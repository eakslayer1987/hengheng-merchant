'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'

type Step = 'phone' | 'otp' | 'name'

export default function LoginPage() {
  const router = useRouter()
  const [step,    setStep]    = useState<Step>('phone')
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [name,    setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function sendOTP() {
    if (phone.replace(/\D/g,'').length < 9) { setError('กรุณากรอกเบอร์ให้ถูกต้อง'); return }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/login', { step: 'send_otp', phone })
      if (data.success) setStep('otp')
      else setError(data.message)
    } catch { setError('เกิดข้อผิดพลาด กรุณาลองใหม่') }
    finally { setLoading(false) }
  }

  async function verifyOTP() {
    if (otp.length !== 6) { setError('กรุณากรอก OTP 6 หลัก'); return }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/login', { step: 'verify_otp', phone, otp })
      if (data.success) {
        if (data.is_new) setStep('name')
        else router.push(data.redirect || '/merchant/dashboard')
      } else setError(data.message)
    } catch { setError('เกิดข้อผิดพลาด กรุณาลองใหม่') }
    finally { setLoading(false) }
  }

  async function setStoreName() {
    if (!name.trim()) { setError('กรุณากรอกชื่อร้าน'); return }
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/login', { step: 'set_name', phone, name })
      if (data.success) router.push(data.redirect || '/merchant/dashboard')
      else setError(data.message)
    } catch { setError('เกิดข้อผิดพลาด') }
    finally { setLoading(false) }
  }

  const steps: Step[] = ['phone', 'otp', 'name']
  const stepIdx = steps.indexOf(step)

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(160deg,#7a0000 0%,#cc0000 35%,#ee2200 55%,#cc0000 75%,#7a0000 100%)',
      fontFamily: "'Kanit','Sarabun',sans-serif",
    }}>
      {/* Marquee */}
      <div className="overflow-hidden bg-yellow-500 py-1.5 flex-shrink-0">
        <motion.div animate={{ x:['100%','-200%'] }} transition={{ repeat:Infinity, duration:20, ease:'linear' }}
          className="whitespace-nowrap text-red-900 font-black text-xs tracking-widest px-4">
          ✦ สลากกินแบ่งดิจิทัล หมีปรุง ✦ MEEPRUNG DIGITAL LOTTERY ✦ รางวัลที่ ๑ หนึ่งแสนบาท ✦ หมุนวงล้อรับโชคทุกวัน ✦
        </motion.div>
      </div>

      {/* Particles */}
      {[...Array(8)].map((_,i) => (
        <motion.div key={i} className="fixed rounded-full pointer-events-none"
          style={{
            width:`${3+(i%3)*3}px`, height:`${3+(i%3)*3}px`,
            background: i%2===0 ? '#FFD700' : '#FFF',
            left:`${8+(i*11.3)%85}%`, top:`${8+(i*9.7)%82}%`, opacity:0.4,
          }}
          animate={{ y:[-8,8,-8], opacity:[0.2,0.6,0.2] }}
          transition={{ repeat:Infinity, duration:3+(i%3), delay:i*0.4 }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10 pt-10 pb-8 px-6 text-center flex-shrink-0">
        <Link href="/">
          <motion.div animate={{ y:[0,-4,0] }} transition={{ repeat:Infinity, duration:2.5 }}
            className="text-6xl mb-3 leading-none block">🐻‍🍳</motion.div>
        </Link>
        <div className="inline-block border-2 border-yellow-400 rounded-xl px-6 py-1.5 mb-2"
          style={{ background:'linear-gradient(135deg,#7a0000,#cc0000)' }}>
          <div className="text-xl font-black text-yellow-300 tracking-widest"
            style={{ textShadow:'0 2px 4px rgba(0,0,0,.6)' }}>หมีปรุง</div>
          <div className="text-yellow-400 text-[10px] tracking-[0.35em] font-bold">MEE PRUNG</div>
        </div>
        <div className="text-yellow-200 text-sm font-bold mt-1">เฮงเฮงปังจัง</div>
        <div className="text-yellow-300/70 text-xs">ระบบรางวัลสำหรับร้านอาหาร</div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 mx-4 mb-6" style={{ maxWidth:400, margin:'0 auto', width:'100%', padding:'0 16px 32px' }}>
        <motion.div
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background:'linear-gradient(180deg,#FFF9C4 0%,#FFFFFF 40%)',
            boxShadow:'0 8px 40px rgba(0,0,0,.4), 0 0 0 2px #D4AF37',
          }}
        >
          {/* Card top bar */}
          <div className="h-2 w-full" style={{ background:'linear-gradient(90deg,#D4AF37,#FFD700,#D4AF37)' }} />

          <div className="px-6 pt-5 pb-6">
            {/* Step dots */}
            <div className="flex gap-2 justify-center mb-6">
              {steps.map((s,i) => (
                <div key={s} className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === stepIdx ? '32px' : '10px',
                    background: i <= stepIdx ? '#CC0000' : '#E5E7EB',
                  }} />
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* Step 1: Phone */}
              {step === 'phone' && (
                <motion.div key="phone"
                  initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
                  transition={{ duration:0.3 }}>
                  <div className="text-red-900 text-xl font-black mb-1">เข้าสู่ระบบ</div>
                  <div className="text-gray-500 text-sm mb-5">ใส่เบอร์โทรเพื่อรับ OTP</div>

                  <label className="block text-xs font-black text-red-800 uppercase tracking-widest mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <div className="relative mb-4">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">📱</span>
                    <input type="tel" value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && sendOTP()}
                      placeholder="0xx-xxx-xxxx"
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-yellow-300 bg-yellow-50
                        text-gray-900 font-semibold text-base focus:outline-none focus:border-red-400 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600 font-semibold mb-3">
                      ⚠️ {error}
                    </div>
                  )}

                  <motion.button onClick={sendOTP} disabled={loading} whileTap={{ scale:0.97 }}
                    className="w-full py-4 rounded-2xl font-black text-base transition-opacity disabled:opacity-60"
                    style={{ background:'linear-gradient(135deg,#CC0000,#990000)', color:'#FFD700', boxShadow:'0 4px 20px rgba(180,0,0,.4)' }}>
                    {loading ? '⏳ กำลังส่ง...' : '🎫 ส่ง OTP →'}
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <motion.div key="otp"
                  initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
                  transition={{ duration:0.3 }}>
                  <div className="text-red-900 text-xl font-black mb-1">กรอก OTP</div>
                  <div className="text-gray-500 text-sm mb-1">รหัส 6 หลักที่ส่งไปยัง</div>
                  <div className="text-red-700 font-black text-sm mb-5">{phone}</div>

                  <input type="number" value={otp} maxLength={6}
                    onChange={e => setOtp(e.target.value.slice(0,6))}
                    onKeyDown={e => e.key==='Enter' && verifyOTP()}
                    placeholder="000000"
                    className="w-full px-4 py-4 rounded-2xl border-2 border-yellow-300 bg-yellow-50
                      text-4xl font-black text-center tracking-[0.5em] text-red-900
                      focus:outline-none focus:border-red-400 transition-colors mb-4"
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600 font-semibold mb-3">
                      ⚠️ {error}
                    </div>
                  )}

                  <motion.button onClick={verifyOTP} disabled={loading} whileTap={{ scale:0.97 }}
                    className="w-full py-4 rounded-2xl font-black text-base mb-3 disabled:opacity-60"
                    style={{ background:'linear-gradient(135deg,#CC0000,#990000)', color:'#FFD700', boxShadow:'0 4px 20px rgba(180,0,0,.4)' }}>
                    {loading ? '⏳ กำลังตรวจสอบ...' : '🎰 ยืนยัน OTP →'}
                  </motion.button>

                  <button onClick={() => { setStep('phone'); setOtp(''); setError('') }}
                    className="w-full py-2.5 text-sm text-gray-500 font-semibold">
                    ← เปลี่ยนเบอร์โทร
                  </button>
                </motion.div>
              )}

              {/* Step 3: Name */}
              {step === 'name' && (
                <motion.div key="name"
                  initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
                  transition={{ duration:0.3 }}>
                  <div className="text-2xl text-center mb-1">🏪</div>
                  <div className="text-red-900 text-xl font-black mb-1 text-center">ยินดีต้อนรับ!</div>
                  <div className="text-gray-500 text-sm mb-5 text-center">กรอกชื่อร้านของคุณ</div>

                  <label className="block text-xs font-black text-red-800 uppercase tracking-widest mb-2">
                    ชื่อร้านอาหาร
                  </label>
                  <input type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && setStoreName()}
                    placeholder="เช่น ร้านข้าวแม่อ้อย"
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-yellow-300 bg-yellow-50
                      text-gray-900 font-semibold text-base focus:outline-none focus:border-red-400 transition-colors mb-4"
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600 font-semibold mb-3">
                      ⚠️ {error}
                    </div>
                  )}

                  <motion.button onClick={setStoreName} disabled={loading} whileTap={{ scale:0.97 }}
                    className="w-full py-4 rounded-2xl font-black text-base disabled:opacity-60"
                    style={{ background:'linear-gradient(135deg,#CC0000,#990000)', color:'#FFD700', boxShadow:'0 4px 20px rgba(180,0,0,.4)' }}>
                    {loading ? '⏳ กำลังสร้างร้าน...' : '🎉 เริ่มใช้งาน →'}
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Card bottom bar */}
          <div className="h-1 w-full" style={{ background:'linear-gradient(90deg,#D4AF37,#FFD700,#D4AF37)' }} />
        </motion.div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-yellow-300/70 text-sm font-semibold hover:text-yellow-300 transition-colors">
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
}
