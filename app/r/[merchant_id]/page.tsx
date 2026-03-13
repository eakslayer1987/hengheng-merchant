'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import axios from 'axios'

type Step = 'loading' | 'phone' | 'otp' | 'ready' | 'error'

export default function ScanPage() {
  const { merchant_id } = useParams()
  const router = useRouter()

  const [step,     setStep]     = useState<Step>('loading')
  const [merchant, setMerchant] = useState<{ store_name: string; quota: number } | null>(null)
  const [phone,    setPhone]    = useState('')
  const [otp,      setOtp]      = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    axios.get(`/api/spin?merchant_id=${merchant_id}`)
      .then(({ data }) => {
        if (!data.success) { setStep('error'); return }
        const remaining = (data.data.quota?.quota_total || 0) - (data.data.quota?.quota_used || 0)
        setMerchant({ store_name: data.data.merchant.store_name, quota: remaining })
        setStep('phone')
      })
      .catch(() => setStep('error'))
  }, [merchant_id])

  async function sendOTP() {
    if (phone.replace(/\D/g,'').length < 9) { setError('กรุณากรอกเบอร์ให้ถูกต้อง'); return }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/login', { step: 'send_otp', phone })
      if (data.success) setStep('otp')
      else setError(data.message)
    } catch { setError('เกิดข้อผิดพลาด') }
    finally { setLoading(false) }
  }

  async function verifyOTP() {
    if (otp.length !== 6) { setError('กรุณากรอก 6 หลัก'); return }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/login', {
        step: 'verify_otp', phone, otp, role: 'customer'
      })
      if (data.success) {
        router.push(`/spin/${merchant_id}`)
      } else setError(data.message)
    } catch { setError('เกิดข้อผิดพลาด') }
    finally { setLoading(false) }
  }

  // ── Loading ──────────────────────────────────────────────
  if (step === 'loading') return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full" />
    </div>
  )

  // ── Error ────────────────────────────────────────────────
  if (step === 'error') return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="text-5xl mb-4">😔</div>
      <h2 className="text-xl font-black text-gray-900 mb-2">ไม่พบร้านค้า</h2>
      <p className="text-gray-500 text-sm">QR Code นี้อาจหมดอายุหรือไม่ถูกต้อง</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Purple header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-6 pt-14 pb-20 text-center">
        <motion.div initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:'spring', stiffness:260, damping:20 }}>
          <div className="text-5xl mb-3">🎰</div>
          <h1 className="text-xl font-black text-white">{merchant?.store_name}</h1>
          <p className="text-brand-200 text-sm mt-1">หมุนวงล้อรับรางวัลฟรี!</p>
          {merchant && merchant.quota > 0 && (
            <div className="mt-3 inline-block bg-white/20 rounded-full px-4 py-1 text-sm text-white font-semibold">
              เหลือ {merchant.quota} สิทธิ์
            </div>
          )}
        </motion.div>
      </div>

      {/* Card panel */}
      <div className="flex-1 -mt-8 bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-[0_-4px_24px_rgba(0,0,0,.08)]">
        {/* Step dots */}
        <div className="flex gap-2 justify-center mb-7">
          {['phone','otp'].map((s,i) => (
            <div key={s} className={`h-1.5 w-10 rounded-full transition-all
              ${step === s ? 'bg-brand-600' : i < ['phone','otp'].indexOf(step as any) ? 'bg-brand-300' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {step === 'phone' && (
          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
            <h2 className="text-xl font-black text-gray-900 mb-1">เข้าสู่ระบบ</h2>
            <p className="text-gray-500 text-sm mb-6">ใส่เบอร์โทรเพื่อรับ OTP และหมุนวงล้อ</p>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              เบอร์โทรศัพท์
            </label>
            <input type="tel" value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key==='Enter' && sendOTP()}
              placeholder="0xx-xxx-xxxx"
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-base
                font-medium focus:outline-none focus:border-brand-500 transition-colors mb-2"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button onClick={sendOTP} disabled={loading}
              className="w-full py-4 rounded-2xl bg-brand-600 text-white text-base font-black
                shadow-brand btn-press disabled:opacity-60">
              {loading ? 'กำลังส่ง OTP...' : 'ส่ง OTP →'}
            </button>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
            <h2 className="text-xl font-black text-gray-900 mb-1">กรอก OTP</h2>
            <p className="text-gray-500 text-sm mb-6">
              ส่งไปยัง <strong className="text-brand-600">{phone}</strong>
            </p>
            <input type="number" value={otp} maxLength={6}
              onChange={e => setOtp(e.target.value.slice(0,6))}
              onKeyDown={e => e.key==='Enter' && verifyOTP()}
              placeholder="000000"
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-3xl
                font-black text-center tracking-[.5em] focus:outline-none focus:border-brand-500 mb-2"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button onClick={verifyOTP} disabled={loading}
              className="w-full py-4 rounded-2xl bg-brand-600 text-white text-base font-black
                shadow-brand btn-press disabled:opacity-60">
              {loading ? 'กำลังตรวจสอบ...' : '🎰 ยืนยันและหมุนวงล้อ!'}
            </button>
            <button onClick={() => { setStep('phone'); setOtp(''); setError('') }}
              className="mt-3 w-full py-2 text-sm text-gray-400">← กลับ</button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
