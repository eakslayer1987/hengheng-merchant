// In-memory OTP store (replace with Redis in production)
const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>()

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeOTP(phone: string, otp: string): void {
  otpStore.set(phone, {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
  })
}

export function verifyOTP(phone: string, otp: string): boolean {
  const record = otpStore.get(phone)
  if (!record) return false
  if (Date.now() > record.expires) { otpStore.delete(phone); return false }
  if (record.attempts >= 5) return false
  record.attempts++
  if (record.otp !== otp) return false
  otpStore.delete(phone)
  return true
}

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  // SMSMKT integration
  const apiKey  = process.env.SMSMKT_API_KEY  || ''
  const secret  = process.env.SMSMKT_SECRET   || ''

  if (!apiKey) {
    // Dev mode: log to console
    console.log(`[OTP] ${phone} → ${otp}`)
    return true
  }

  try {
    const res = await fetch('https://www.thaibulksms.com/api/v2/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: apiKey,
        password: secret,
        msisdn: phone,
        message: `รหัส OTP เฮงเฮงปังจัง: ${otp} (หมดอายุใน 5 นาที)`,
        sender: 'MeeprungRW',
        force: 'standard',
      }),
    })
    const data = await res.json()
    return data.status === 'ok' || data.code === '000'
  } catch (e) {
    console.error('SMS error:', e)
    return false
  }
}
