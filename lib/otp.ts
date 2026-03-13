/**
 * OTP Service - SMSMKT + MySQL (no auto-create table)
 * Create otp_tokens table manually via phpMyAdmin first
 */

const API_SEND     = 'https://portal-otp.smsmkt.com/api/otp-send'
const API_VALIDATE = 'https://portal-otp.smsmkt.com/api/otp-validate'
const PROJECT_KEY  = '3b89c17882'
const API_KEY      = 'b92efef8ffc9ee61875238c8fe1d820b'
const SECRET_KEY   = 'jzeaGdqReIePWFOw'

import mysql from 'mysql2/promise'

function getPool() {
  return mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME     || 'meeprung_reward',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: 5,
  })
}

// ─── Send OTP ─────────────────────────────────────────────
export async function sendOTP(phone: string): Promise<boolean> {
  try {
    const res  = await fetch(API_SEND, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key':      API_KEY,
        'secret_key':   SECRET_KEY,
      },
      body: JSON.stringify({ project_key: PROJECT_KEY, phone }),
    })

    const data = await res.json()
    console.log('[OTP send]', JSON.stringify(data))

    if (data.code !== '000' || !data.result?.token) {
      console.error('[OTP send failed]', data.detail || data.message)
      return false
    }

    const token    = data.result.token
    const ref_code = data.result.ref_code || ''
    const expires  = new Date(Date.now() + 5 * 60 * 1000)
      .toISOString().slice(0, 19).replace('T', ' ')

    const pool = getPool()
    await pool.execute('DELETE FROM otp_tokens WHERE phone = ?', [phone])
    await pool.execute(
      'INSERT INTO otp_tokens (phone, token, ref_code, expires_at) VALUES (?,?,?,?)',
      [phone, token, ref_code, expires]
    )
    await pool.end()
    return true

  } catch (e) {
    console.error('[OTP send error]', e)
    return false
  }
}

// ─── Verify OTP ───────────────────────────────────────────
export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  try {
    const pool = getPool()

    const [rows] = await pool.execute<any[]>(
      `SELECT * FROM otp_tokens
       WHERE phone = ? AND verified = 0 AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [phone]
    )

    const record = rows[0]
    if (!record) { console.error('[OTP] no token for', phone); await pool.end(); return false }
    if (record.attempts >= 5) { await pool.end(); return false }

    const res  = await fetch(API_VALIDATE, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key':      API_KEY,
        'secret_key':   SECRET_KEY,
      },
      body: JSON.stringify({
        token:    record.token,
        otp_code: otp,
        ref_code: record.ref_code,
      }),
    })

    const data = await res.json()
    console.log('[OTP verify]', JSON.stringify(data))

    if (data.code === '000' && data.result?.status === true) {
      await pool.execute('UPDATE otp_tokens SET verified = 1 WHERE id = ?', [record.id])
      await pool.end()
      return true
    }

    await pool.execute('UPDATE otp_tokens SET attempts = attempts + 1 WHERE id = ?', [record.id])
    await pool.end()
    return false

  } catch (e) {
    console.error('[OTP verify error]', e)
    return false
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
export function storeOTP(_p: string, _c: string): void {}
