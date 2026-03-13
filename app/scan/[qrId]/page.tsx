'use client'
import { useEffect, useState, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Shield, ChevronRight, Loader2, Zap, Star } from 'lucide-react'
import { apiFetch, type QRInfo } from '@/lib/api'

const RED = '#fd1803'
const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.07 } } }
const fadeUp  = { hidden:{ opacity:0, y:18 }, show:{ opacity:1, y:0, transition:{ duration:.5, ease:[0.22,1,0.36,1] } } }

type Step = 'loading' | 'info' | 'phone' | 'otp' | 'error'

export default function ScanPage() {
  const { qrId } = useParams<{ qrId: string }>()
  const router = useRouter()
  const [step, setStep]     = useState<Step>('loading')
  const [qrInfo, setQrInfo] = useState<QRInfo | null>(null)
  const [phone, setPhone]   = useState('')
  const [otp, setOtp]       = useState(['','','','','',''])
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    apiFetch<QRInfo>(`/qr/info.php?qr_id=${qrId}`)
      .then(d => { setQrInfo(d); setStep('info') })
      .catch(() => setStep('error'))
  }, [qrId])

  async function sendOtp() {
    if (phone.replace(/\D/g,'').length < 10) { setErrorMsg('กรุณากรอกเบอร์โทรให้ถูกต้อง'); return }
    setErrorMsg('')
    startTransition(async () => {
      try {
        await apiFetch('/auth/send-otp.php', { method:'POST', body: JSON.stringify({ phone: phone.replace(/\D/g,''), qr_id: qrId }) })
        setStep('otp')
      } catch { setErrorMsg('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่') }
    })
  }

  async function verifyOtp() {
    const code = otp.join('')
    if (code.length < 6) return
    startTransition(async () => {
      try {
        const res = await apiFetch<{ token:string; is_new:boolean }>('/auth/verify-otp.php', {
          method:'POST', body: JSON.stringify({ phone: phone.replace(/\D/g,''), otp: code, qr_id: qrId })
        })
        localStorage.setItem('hh_token', res.token)
        localStorage.setItem('hh_qr', qrId)
        router.push(`/spin?qr=${qrId}`)
      } catch { setErrorMsg('รหัส OTP ไม่ถูกต้อง'); setOtp(['','','','','','']) }
    })
  }

  function handleOtpChange(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[idx] = val; setOtp(next)
    if (val && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus()
    if (next.join('').length === 6) setTimeout(verifyOtp, 100)
  }

  const pct = qrInfo ? Math.round((qrInfo.remaining_codes / qrInfo.total_codes) * 100) : 0

  return (
    <div style={{ minHeight:'100vh', overflow:'hidden', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px' }}>

      {/* Thai flag bg */}
      <div style={{
        position:'fixed', inset:0, zIndex:0,
        background:`
          radial-gradient(ellipse 60% 90% at -5% 50%, rgba(220,10,10,.82) 0%, rgba(185,5,5,.45) 35%, transparent 62%),
          radial-gradient(ellipse 50% 80% at 105% 50%, rgba(22,55,170,.78) 0%, rgba(15,40,130,.42) 35%, transparent 62%),
          radial-gradient(ellipse 55% 50% at 50% 50%, rgba(255,255,255,1) 0%, #eaeaf4 100%)
        `,
      }}/>
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:`radial-gradient(ellipse 40% 55% at 50% 50%, rgba(255,255,255,.6) 0%, transparent 65%)`,
        animation:'thaiRay 9s ease-in-out infinite alternate' }}/>

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:420 }}>
        <AnimatePresence mode="wait">

          {/* Loading */}
          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity:0, scale:.94 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.9 }}
              className="glass-card" style={{ padding:48, textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:18, background:`linear-gradient(135deg,${RED},#c01002)`,
                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px',
                boxShadow:`0 8px 32px ${RED}55` }}>
                <Loader2 className="animate-spin" color="#fff" size={28}/>
              </div>
              <p style={{ fontWeight:600, color:'#6B7280' }}>กำลังโหลดข้อมูลร้าน…</p>
            </motion.div>
          )}

          {/* Error */}
          {step === 'error' && (
            <motion.div key="error" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              className="glass-card" style={{ padding:48, textAlign:'center' }}>
              <div style={{ fontSize:56, marginBottom:12 }}>😢</div>
              <h3 style={{ fontSize:20, fontWeight:900, color:'#0a0a0f', marginBottom:8 }}>QR หมดอายุแล้ว</h3>
              <p style={{ fontSize:13, color:'#9CA3AF' }}>โควต้าของร้านนี้หมดแล้ว หรือ QR ไม่ถูกต้อง</p>
            </motion.div>
          )}

          {/* Info */}
          {step === 'info' && qrInfo && (
            <motion.div key="info" variants={stagger} initial="hidden" animate="show" style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {/* Brand pill */}
              <motion.div variants={fadeUp} style={{ textAlign:'center' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:999,
                  background:'rgba(255,255,255,0.85)', border:`1px solid ${RED}30`, fontSize:11, fontWeight:800,
                  color:RED, backdropFilter:'blur(12px)', letterSpacing:1 }}>
                  🐻 เฮงเฮงปังจัง LOYALTY
                </span>
              </motion.div>

              {/* Hero */}
              <motion.div variants={fadeUp} style={{ textAlign:'center' }}>
                <h1 style={{ fontSize:'clamp(2rem,8vw,2.8rem)', fontWeight:900, color:'#0a0a0f', lineHeight:1, marginBottom:4 }}>ยินดีต้อนรับ!</h1>
                <p style={{ fontSize:13, color:'#6B7280', fontWeight:500 }}>สแกนแล้วลุ้นรับสิทธิ์ทันที</p>
              </motion.div>

              {/* Merchant card */}
              <motion.div variants={fadeUp} className="glass-card" style={{ padding:'20px 20px' }}>
                <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:14 }}>
                  <div style={{ width:52, height:52, borderRadius:16, background:`linear-gradient(135deg,${RED},#c01002)`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0,
                    boxShadow:`0 6px 20px ${RED}45` }}>🍽️</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:17, fontWeight:900, color:'#0a0a0f', lineHeight:1.2 }}>{qrInfo.merchant_name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:4, color:'#9CA3AF', fontSize:12 }}>
                      <MapPin size={11}/><span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{qrInfo.merchant_address || 'ร้านค้าพาร์ทเนอร์'}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:2, marginTop:6 }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={10} style={{ fill:'#F59E0B', color:'#F59E0B' }}/>)}
                      <span style={{ fontSize:10, color:'#9CA3AF', marginLeft:4 }}>ร้านรับรอง</span>
                    </div>
                  </div>
                </div>
                {/* Quota */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                    <span style={{ color:'#6B7280', fontWeight:600 }}>สิทธิ์คงเหลือ</span>
                    <span style={{ fontWeight:900, color:RED }}>{qrInfo.remaining_codes} / {qrInfo.total_codes}</span>
                  </div>
                  <div style={{ height:7, borderRadius:999, background:'#F3F4F6', overflow:'hidden' }}>
                    <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:1, ease:'easeOut' }}
                      style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${RED},#ff6b4a)` }}/>
                  </div>
                  {qrInfo.remaining_codes <= 5 && (
                    <p style={{ fontSize:11, fontWeight:800, color:RED, textAlign:'center', marginTop:6 }} className="animate-pulse">⚡ เหลือน้อยมาก!</p>
                  )}
                </div>
              </motion.div>

              {/* Prize teaser */}
              <motion.div variants={fadeUp} className="glass-card" style={{ padding:'16px 20px' }}>
                <p style={{ fontSize:10, fontWeight:800, color:'#9CA3AF', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>สิทธิ์ที่ลุ้นได้</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[
                    { e:'🏷️', l:'ส่วนลด 10 บาท', s:'โค้ดซื้อซอส' },
                    { e:'🍛', l:'ทานฟรีมื้อนี้',   s:'รับได้เลย!' },
                    { e:'🎟️', l:'ลุ้นโชคใหญ่',    s:'สะสมสิทธิ์' },
                    { e:'⭐', l:'คะแนนสะสม',       s:'แลกพรีเมียม' },
                  ].map(p => (
                    <div key={p.l} className="glass-surface" style={{ borderRadius:16, padding:'10px 12px', textAlign:'center' }}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{p.e}</div>
                      <div style={{ fontSize:11, fontWeight:800, color:'#374151', lineHeight:1.3 }}>{p.l}</div>
                      <div style={{ fontSize:10, color:'#9CA3AF', marginTop:2 }}>{p.s}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div variants={fadeUp}>
                <motion.button onClick={() => setStep('phone')}
                  whileHover={{ scale:1.02, boxShadow:`0 14px 40px ${RED}55` }}
                  whileTap={{ scale:.98 }}
                  style={{ width:'100%', height:56, borderRadius:16, border:'none',
                    background:`linear-gradient(135deg,${RED},#c01002)`, color:'#fff',
                    fontSize:17, fontWeight:900, cursor:'pointer', display:'flex',
                    alignItems:'center', justifyContent:'center', gap:8,
                    boxShadow:`0 8px 32px ${RED}45` }}>
                  รับสิทธิ์เลย! <ChevronRight size={20}/>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Phone */}
          {step === 'phone' && (
            <motion.div key="phone" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-40 }} transition={{ duration:.4, ease:[0.22,1,0.36,1] }}>
              <div style={{ textAlign:'center', marginBottom:24 }}>
                <motion.div initial={{ scale:.5, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  transition={{ type:'spring', bounce:.4 }}
                  style={{ width:72, height:72, borderRadius:22, background:`linear-gradient(135deg,${RED},#c01002)`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:32,
                    margin:'0 auto 16px', boxShadow:`0 8px 32px ${RED}55` }}>📱</motion.div>
                <h2 style={{ fontSize:24, fontWeight:900, color:'#0a0a0f', marginBottom:4 }}>กรอกเบอร์โทร</h2>
                <p style={{ fontSize:13, color:'#9CA3AF' }}>รับรหัส OTP เพื่อยืนยันตัวตน</p>
              </div>
              <motion.div className="glass-card" style={{ padding:'28px 24px' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
                <label style={{ fontSize:12, fontWeight:800, color:'#374151', display:'block', marginBottom:6 }}>เบอร์โทรศัพท์</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && sendOtp()} placeholder="0xx-xxx-xxxx" maxLength={12}
                  style={{ width:'100%', height:52, padding:'0 18px', borderRadius:14, fontSize:17,
                    fontWeight:800, color:'#111', outline:'none', boxSizing:'border-box', letterSpacing:'0.1em',
                    border:`1.5px solid ${phone.length > 0 ? RED+'55':'#E5E7EB'}`,
                    background:'rgba(255,255,255,.8)', transition:'all .2s',
                    boxShadow: phone.length > 0 ? `0 0 0 3px ${RED}12` : 'none' }}/>
                {errorMsg && <p style={{ fontSize:12, color:RED, fontWeight:700, marginTop:8 }}>{errorMsg}</p>}
                <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px',
                  borderRadius:12, marginTop:12, background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.15)' }}>
                  <Shield size={13} color="#60A5FA" style={{ marginTop:1, flexShrink:0 }}/>
                  <p style={{ fontSize:11, color:'#60A5FA', lineHeight:1.6, margin:0 }}>เบอร์ของคุณใช้ยืนยันตัวตนเท่านั้น ไม่มีการเปิดเผยต่อบุคคลที่สาม</p>
                </div>
                <motion.button onClick={sendOtp} disabled={isPending}
                  whileHover={!isPending ? { scale:1.02, boxShadow:`0 12px 36px ${RED}50` } : {}}
                  whileTap={!isPending ? { scale:.98 } : {}}
                  style={{ width:'100%', height:52, marginTop:16, borderRadius:14, border:'none',
                    background: isPending ? '#f3f4f6' : `linear-gradient(135deg,${RED},#c01002)`,
                    color: isPending ? '#9CA3AF':'#fff', fontSize:16, fontWeight:900,
                    cursor: isPending ? 'not-allowed':'pointer', display:'flex',
                    alignItems:'center', justifyContent:'center', gap:8,
                    boxShadow: isPending ? 'none' : `0 8px 28px ${RED}45`, transition:'background .2s' }}>
                  {isPending ? <><Loader2 size={17} className="animate-spin"/> กำลังส่ง…</> : 'ส่ง OTP →'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* OTP */}
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-40 }} transition={{ duration:.4, ease:[0.22,1,0.36,1] }}>
              <div style={{ textAlign:'center', marginBottom:24 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
                <h2 style={{ fontSize:24, fontWeight:900, color:'#0a0a0f', marginBottom:4 }}>กรอกรหัส OTP</h2>
                <p style={{ fontSize:13, color:'#9CA3AF' }}>ส่งไปที่ <strong style={{ color:'#374151' }}>{phone}</strong></p>
              </div>
              <div className="glass-card" style={{ padding:'28px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
                <div style={{ display:'flex', gap:10 }}>
                  {otp.map((v, i) => (
                    <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={v}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => e.key==='Backspace' && !v && i > 0 && document.getElementById(`otp-${i-1}`)?.focus()}
                      style={{ width:44, height:54, borderRadius:12, textAlign:'center',
                        fontSize:22, fontWeight:900, color:'#111', outline:'none',
                        border:`2px solid ${v ? RED : '#E5E7EB'}`,
                        background:'rgba(255,255,255,.85)', transition:'all .15s',
                        boxShadow: v ? `0 0 0 3px ${RED}12` : 'none' }}/>
                  ))}
                </div>
                {errorMsg && <p style={{ fontSize:13, color:RED, fontWeight:700 }}>{errorMsg}</p>}
                {isPending && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, color:'#9CA3AF', fontSize:13 }}>
                    <Loader2 size={15} className="animate-spin"/> กำลังตรวจสอบ…
                  </div>
                )}
                <button onClick={() => setStep('phone')}
                  style={{ background:'none', border:'none', cursor:'pointer',
                    fontSize:12, color:'#9CA3AF', fontWeight:600 }}>
                  ไม่ได้รับ OTP? ส่งใหม่
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
        {(step === 'info' || step === 'phone' || step === 'otp') && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}
            style={{ textAlign:'center', marginTop:16, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <Zap size={11} color="#F59E0B"/>
            <span style={{ fontSize:11, color:'#9CA3AF' }}>Loyalty by หมีปรุง × เฮงเฮง</span>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes thaiRay {
          0%   { opacity:.7; transform:scaleY(1) translateY(0); }
          50%  { opacity:1;  transform:scaleY(1.06) translateY(-1.5%); }
          100% { opacity:.75;transform:scaleY(.97) translateY(1.5%); }
        }
      `}</style>
    </div>
  )
}
