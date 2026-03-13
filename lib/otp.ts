/**
 * OTP Service - SMSMKT Integration
 * ใช้ credentials เดียวกับ ปังจัง.com
 */

const API_SEND     = 'https://portal-otp.smsmkt.com/api/otp-send'
const API_VALIDATE = 'https://portal-otp.smsmkt.com/api/otp-validate'

const PROJECT_KEY  = process.env.SMSMKT_PROJECT_KEY  || '3b89c17882'
const API_KEY      = process.env.SMSMKT_API_KEY      || 'b92efef8ffc9ee61875238c8fe1d820b'
const SECRET_KEY   = process.env.SMSMKT_SECRET_KEY   || 'jzeaGdqReIePWFOw'

// In-memory OTP store (Vercel serverless — resets per cold start แต่เพียงพอสำหรับ OTP)
interface OTPRecord {
  token:     string
  ref_code:  string
  expires:   number
  attempts:  number
}
const otpStore = new Map<string, OTPRecord>()

// ─── Send OTP via SMSMKT ──────────────────────────────────
export async function sendOTP(phone: string): Promise<boolean> {
  try {
    const res = await fetch(API_SEND, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key':       API_KEY,
        'secret_key':    SECRET_KEY,
      },
      body: JSON.stringify({ project_key: PROJECT_KEY, phone }),
    })

    const data = await res.json()
    console.log('[OTP] Send response:', data)

    if (data.code === '000' && data.result?.token) {
      otpStore.set(phone, {
        token:    data.result.token,
        ref_code: data.result.ref_code || '',
        expires:  Date.now() + 5 * 60 * 1000, // 5 min
        attempts: 0,
      })
      return true
    }

    console.error('[OTP] Send failed:', data.detail || data.message)
    return false
  } catch (e) {
    console.error('[OTP] Send error:', e)
    return false
  }
}

// ─── Verify OTP via SMSMKT ────────────────────────────────
export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const record = otpStore.get(phone)
  if (!record) return false
  if (Date.now() > record.expires) { otpStore.delete(phone); return false }
  if (record.attempts >= 5) return false

  try {
    const res = await fetch(API_VALIDATE, {
      method: 'POST',
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
    console.log('[OTP] Verify response:', data)

    if (data.code === '000' && data.result?.status === true) {
      otpStore.delete(phone)
      return true
    }

    // Increment attempts on wrong OTP
    record.attempts++
    otpStore.set(phone, record)
    return false
  } catch (e) {
    console.error('[OTP] Verify error:', e)
    return false
  }
}

// ─── Legacy helpers (keep API compat) ─────────────────────
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeOTP(phone: string, code: string): void {
  // Not used in production — kept for compatibility
  console.warn('[OTP] storeOTP called (legacy) — use sendOTP instead')
}
