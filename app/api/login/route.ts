import { NextRequest, NextResponse } from 'next/server'
import { queryOne, execute } from '@/lib/db'
import { sendOTP, verifyOTP } from '@/lib/otp'
import { signToken } from '@/lib/auth'
import { v4 as uuid } from 'uuid'
import type { User, Merchant } from '@/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { step, phone, otp, name } = body

  if (!phone) return NextResponse.json({ success: false, message: 'ต้องการเบอร์โทร' })

  // ─── Step 1: Send OTP ─────────────────────────────────────
  if (step === 'send_otp') {
    const sent = await sendOTP(phone)
    if (!sent) return NextResponse.json({ success: false, message: 'ส่ง OTP ไม่สำเร็จ' })
    return NextResponse.json({ success: true, message: 'ส่ง OTP แล้ว' })
  }

  // ─── Step 2: Verify OTP ──────────────────────────────────
  if (step === 'verify_otp') {
    const valid = await verifyOTP(phone, otp)
    if (!valid) return NextResponse.json({ success: false, message: 'OTP ไม่ถูกต้องหรือหมดอายุ' })

    const user = await queryOne<User>('SELECT * FROM users WHERE phone = ?', [phone])
    if (!user) {
      return NextResponse.json({ success: true, is_new: true })
    }
    const token = signToken({ id: user.id, phone: user.phone, role: user.role })
    const res = NextResponse.json({
      success: true, is_new: false,
      redirect: user.role === 'admin' ? '/admin/dashboard' : '/merchant/dashboard',
    })
    res.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60*60*24*7, path: '/' })
    return res
  }

  // ─── Step 3: Set name (new merchant) ─────────────────────
  if (step === 'set_name') {
    if (!name?.trim()) return NextResponse.json({ success: false, message: 'ต้องการชื่อร้าน' })
    const result = await execute(
      'INSERT INTO users (phone, name, role) VALUES (?,?,?)',
      [phone, name.trim(), 'merchant']
    )
    const userId = result.insertId
    const qrCode = `MP-${uuid().slice(0,8).toUpperCase()}`
    await execute(
      'INSERT INTO merchants (user_id, store_name, phone, qr_code, approved) VALUES (?,?,?,?,1)',
      [userId, name.trim(), phone, qrCode]
    )
    const merchant = await queryOne<Merchant>('SELECT * FROM merchants WHERE user_id = ?', [userId])
    if (merchant) {
      await execute(
        'INSERT INTO merchant_quota (merchant_id, quota_total, quota_used) VALUES (?,0,0)',
        [merchant.id]
      )
    }
    const token = signToken({ id: userId, phone, role: 'merchant' })
    const res = NextResponse.json({ success: true, redirect: '/merchant/dashboard' })
    res.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60*60*24*7, path: '/' })
    return res
  }

  return NextResponse.json({ success: false, message: 'invalid step' })
}
