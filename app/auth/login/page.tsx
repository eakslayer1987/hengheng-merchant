'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Step = 'phone' | 'otp' | 'name'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep]     = useState<Step>('phone')
  const [phone, setPhone]   = useState('')
  const [otp,   setOtp]     = useState('')
  const [name,  setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [isNew,   setIsNew]   = useState(false)

  async function handleSendOTP() {
    if (phone.replace(/\D/g,'').length < 9) {
      setError('กรุณากรอกเบอร์โทรให้ถูกต้อง'); return
    }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/login', { step: 'send_otp', phone })
      if (data.success) setStep('otp')
      else setError(data.message || 'เกิดข้อผิดพลาด')
    } catch { setError('ไม่สามารถส่ง OTP ได้') }
    finally { setLoading(false) }
  }

  async function handleVerifyOTP() {
    if (otp.length !== 6) { setError('กรุณากรอก OTP 6 หลัก'); return }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/login', { step: 'verify_otp', phone, otp })
      if (data.success) {
        if (data.is_new) { setIsNew(true); setStep('name') }
        else router.push(data.redirect || '/merchant/dashboard')
      } else setError(data.message || 'OTP ไม่ถูกต้อง')
    } catch { setError('เกิดข้อผิดพลาด') }
    finally { setLoading(false) }
  }

  async function handleSetName() {
    if (!name.trim()) { setError('กรุณากรอกชื่อร้าน'); return }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/login', { step: 'set_name', phone, name })
      if (data.success) router.push('/merchant/dashboard')
      else setError(data.message || 'เกิดข้อผิดพลาด')
    } catch { setError('เกิดข้อผิดพลาด') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-6 pt-14 pb-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 text-3xl">
            🐻
          </div>
          <h1 className="text-2xl font-black text-white">เฮงเฮงปังจัง</h1>
          <p className="text-brand-200 text-sm mt-1">ระบบรางวัลสำหรับร้านอาหาร</p>
        </motion.div>
      </div>

      {/* Card */}
      <div className="flex-1 -mt-6 bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-[0_-4px_24px_rgba(0,0,0,.08)]">
        {/* Step indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {(['phone','otp','name'] as Step[]).map((s, i) => (
            <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-300
              ${step === s ? 'bg-brand-600' : i < ['phone','otp','name'].indexOf(step) ? 'bg-brand-300' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div key="phone"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }} transition={{ duration: .28 }}
            >
              <h2 className="text-xl font-black text-gray-900 mb-1">เข้าสู่ระบบ</h2>
              <p className="text-gray-500 text-sm mb-7">ใส่เบอร์โทรเพื่อรับ OTP</p>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel" value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleSendOTP()}
                placeholder="0xx-xxx-xxxx"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-base
                  font-medium focus:outline-none focus:border-brand-500 transition-colors"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button onClick={handleSendOTP} disabled={loading}
                className="mt-5 w-full py-3.5 rounded-2xl bg-brand-600 text-white text-base
                  font-black shadow-brand btn-press disabled:opacity-60 transition-all">
                {loading ? 'กำลังส่ง OTP...' : 'ส่ง OTP →'}
              </button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }} transition={{ duration: .28 }}
            >
              <h2 className="text-xl font-black text-gray-900 mb-1">กรอก OTP</h2>
              <p className="text-gray-500 text-sm mb-7">
                ส่งไปยัง <span className="font-semibold text-brand-600">{phone}</span>
              </p>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                รหัส OTP 6 หลัก
              </label>
              <input
                type="number" value={otp} maxLength={6}
                onChange={e => setOtp(e.target.value.slice(0,6))}
                onKeyDown={e => e.key==='Enter' && handleVerifyOTP()}
                placeholder="000000"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200
                  text-2xl font-black text-center tracking-[.4em] focus:outline-none
                  focus:border-brand-500 transition-colors"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button onClick={handleVerifyOTP} disabled={loading}
                className="mt-5 w-full py-3.5 rounded-2xl bg-brand-600 text-white text-base
                  font-black shadow-brand btn-press disabled:opacity-60 transition-all">
                {loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน OTP →'}
              </button>
              <button onClick={() => { setStep('phone'); setOtp(''); setError('') }}
                className="mt-3 w-full py-2.5 text-sm text-gray-400">
                ← กลับแก้ไขเบอร์โทร
              </button>
            </motion.div>
          )}

          {step === 'name' && (
            <motion.div key="name"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }} transition={{ duration: .28 }}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="text-xl font-black text-gray-900 mb-1">ยินดีต้อนรับ!</h2>
                <p className="text-gray-500 text-sm">กรอกชื่อร้านของคุณเพื่อเริ่มใช้งาน</p>
              </div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                ชื่อร้าน
              </label>
              <input
                type="text" value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleSetName()}
                placeholder="เช่น ร้านกะเพราป้าแดง"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-base
                  font-medium focus:outline-none focus:border-brand-500 transition-colors"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button onClick={handleSetName} disabled={loading}
                className="mt-5 w-full py-3.5 rounded-2xl bg-brand-600 text-white text-base
                  font-black shadow-brand btn-press disabled:opacity-60 transition-all">
                {loading ? 'กำลังสร้างบัญชี...' : 'เริ่มใช้งาน 🚀'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
