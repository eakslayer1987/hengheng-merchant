/**
 * OTP Service - SMSMKT + MySQL storage (Vercel-safe)
 */

const API_SEND     = 'https://portal-otp.smsmkt.com/api/otp-send'
const API_VALIDATE = 'https://portal-otp.smsmkt.com/api/otp-validate'

const PROJECT_KEY = '3b89c17882'
const API_KEY     = 'b92efef8ffc9ee61875238c8fe1d820b'
const SECRET_KEY  = 'jzeaGdqReIePWFOw'

import { query, execute } from '@/lib/db'

// Ensure otp_tokens table exists
async function ensureTable() {
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS otp_tokens (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        phone      VARCHAR(20)  NOT NULL,
        token      VARCHAR(255) NOT NULL,
        ref_code   VARCHAR(20)  DEFAULT '',
        attempts   INT          DEFAULT 0,
        verified   TINYINT(1)   DEFAULT 0,
        expires_at DATETIME     NOT NULL,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `, [])
  } catch { /* table already exists */ }
}

// ─── Send OTP ─────────────────────────────────────────────
export async function sendOTP(phone: string): Promise<boolean> {
  try {
    const res  = await fetch(API_SEND, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key':       API_KEY,
        'secret_key':    SECRET_KEY,
      },
      body: JSON.stringify({ project_key: PROJECT_KEY, phone }),
    })
    const data = await res.json()
    console.log('[OTP] send:', JSON.stringify(data))

    if (data.code === '000' && data.result?.token) {
      await ensureTable()

      const expires = new Date(Date.now() + 5 * 60 * 1000)
        .toISOString().slice(0, 19).replace('T', ' ')

      // Delete old tokens for this phone
      await execute('DELETE FROM otp_tokens WHERE phone = ?', [phone])

      // Save new token to DB
      await execute(
        'INSERT INTO otp_tokens (phone, token, ref_code, expires_at) VALUES (?,?,?,?)',
        [phone, data.result.token, data.result.ref_code || '', expires]
      )
      return true
    }

    console.error('[OTP] send failed:', data.detail || data.message)
    return false
  } catch (e) {
    console.error('[OTP] send error:', e)
    return false
  }
}

// ─── Verify OTP ───────────────────────────────────────────
export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  try {
    await ensureTable()

    const rows = await query<any>(
      `SELECT * FROM otp_tokens
       WHERE phone = ? AND verified = 0 AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [phone]
    )
    const record = rows[0]
    if (!record) {
      console.error('[OTP] no valid token for', phone)
      return false
    }
    if (record.attempts >= 5) {
      console.error('[OTP] too many attempts for', phone)
      return false
    }

    const res  = await fetch(API_VALIDATE, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key':       API_KEY,
        'secret_key':    SECRET_KEY,
      },
      body: JSON.stringify({
        token:    record.token,
        otp_code: otp,
        ref_code: record.ref_code,
      }),
    })
    const data = await res.json()
    console.log('[OTP] verify:', JSON.stringify(data))

    if (data.code === '000' && data.result?.status === true) {
      await execute('UPDATE otp_tokens SET verified = 1 WHERE id = ?', [record.id])
      return true
    }

    await execute('UPDATE otp_tokens SET attempts = attempts + 1 WHERE id = ?', [record.id])
    return false
  } catch (e) {
    console.error('[OTP] verify error:', e)
    return false
  }
}

// Legacy stubs
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
export function storeOTP(_phone: string, _code: string): void {}
