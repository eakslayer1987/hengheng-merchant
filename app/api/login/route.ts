import { NextRequest, NextResponse } from 'next/server'
import { queryOne, execute } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { v4 as uuid } from 'uuid'
import type { User } from '@/types'

const API_SEND     = 'https://portal-otp.smsmkt.com/api/otp-send'
const API_VALIDATE = 'https://portal-otp.smsmkt.com/api/otp-validate'
const PROJECT_KEY  = '3b89c17882'
const API_KEY      = 'b92efef8ffc9ee61875238c8fe1d820b'
const SECRET_KEY   = 'jzeaGdqReIePWFOw'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { step, phone, otp, name } = body

  if (!phone) return NextResponse.json({ success: false, message: 'ต้องการเบอร์โทร' })

  // ─── Step 1: Send OTP ─────────────────────────────────────
  if (step === 'send_otp') {
    try {
      const res  = await fetch(API_SEND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api_key': API_KEY, 'secret_key': SECRET_KEY },
        body: JSON.stringify({ project_key: PROJECT_KEY, phone }),
      })
      const data = await res.json()
      console.log('[OTP send]', JSON.stringify(data))

      if (data.code !== '000' || !data.result?.token)
        return NextResponse.json({ success: false, message: `SMSMKT: ${data.detail || data.message}` })

      await execute('DELETE FROM otp_tokens WHERE phone = ?', [phone])
      await execute(
        `INSERT INTO otp_tokens (phone, token, ref_code, expires_at)
         VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
        [phone, data.result.token, data.result.ref_code || '']
      )
      return NextResponse.json({ success: true })
    } catch (e: any) {
      return NextResponse.json({ success: false, message: `Error: ${e?.message}` })
    }
  }

  // ─── Step 2: Verify OTP ──────────────────────────────────
  if (step === 'verify_otp') {
    try {
      const record = await queryOne<any>(
        `SELECT * FROM otp_tokens WHERE phone = ? AND verified = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1`,
        [phone]
      )
      if (!record) return NextResponse.json({ success: false, message: 'OTP หมดอายุ กรุณาขอใหม่' })
      if (record.attempts >= 5) return NextResponse.json({ success: false, message: 'ลองผิดเกิน 5 ครั้ง' })

      const res  = await fetch(API_VALIDATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api_key': API_KEY, 'secret_key': SECRET_KEY },
        body: JSON.stringify({ token: record.token, otp_code: otp, ref_code: record.ref_code }),
      })
      const data = await res.json()
      console.log('[OTP verify]', JSON.stringify(data))

      if (data.code !== '000' || data.result?.status !== true) {
        await execute('UPDATE otp_tokens SET attempts = attempts + 1 WHERE id = ?', [record.id])
        return NextResponse.json({ success: false, message: 'OTP ไม่ถูกต้อง' })
      }

      await execute('UPDATE otp_tokens SET verified = 1 WHERE id = ?', [record.id])

      const user = await queryOne<User>('SELECT * FROM users WHERE phone = ?', [phone])
      if (!user) return NextResponse.json({ success: true, is_new: true })

      const token = signToken({ id: user.id, phone: user.phone, role: user.role })
      const response = NextResponse.json({
        success: true, is_new: false,
        redirect: user.role === 'admin' ? '/admin/dashboard' : '/merchant/dashboard',
      })
      response.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60*60*24*7, path: '/' })
      return response
    } catch (e: any) {
      return NextResponse.json({ success: false, message: `Error: ${e?.message}` })
    }
  }

  // ─── Step 3: Set name (new merchant) ─────────────────────
  if (step === 'set_name') {
    if (!name?.trim()) return NextResponse.json({ success: false, message: 'ต้องการชื่อร้าน' })
    try {
      // 1. Insert user
      const userResult = await execute(
        'INSERT INTO users (phone, name, role) VALUES (?,?,?)',
        [phone, name.trim(), 'merchant']
      )
      const userId = userResult.insertId

      // 2. Insert merchant — ใช้ columns ที่มีจริงในตาราง
      const qrCode = `MP-${uuid().slice(0,8).toUpperCase()}`
      const merchantResult = await execute(
        'INSERT INTO merchants (store_name, phone, qr_code, approved) VALUES (?,?,?,1)',
        [name.trim(), phone, qrCode]
      )
      const merchantId = merchantResult.insertId

      // 3. Insert quota โดยใช้ merchantId โดยตรง
      await execute(
        'INSERT INTO merchant_quota (merchant_id, quota_total, quota_used) VALUES (?,0,0)',
        [merchantId]
      )

      const token = signToken({ id: userId, phone, role: 'merchant' })
      const res = NextResponse.json({ success: true, redirect: '/merchant/dashboard' })
      res.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60*60*24*7, path: '/' })
      return res
    } catch (e: any) {
      console.error('[set_name error]', e)
      return NextResponse.json({ success: false, message: `Error: ${e?.message}` })
    }
  }

  return NextResponse.json({ success: false, message: 'invalid step' })
}
