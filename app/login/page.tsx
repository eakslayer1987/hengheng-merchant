'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Eye, EyeOff, Loader2, Phone, Lock } from 'lucide-react'

const RED = '#fd1803'

const BLOBS = [
  { size:340, x:'8%',   y:'12%', color:'rgba(210,10,10,.16)',  dur:8,  delay:0   },
  { size:220, x:'72%',  y:'8%',  color:'rgba(22,55,170,.14)',  dur:10, delay:1.5 },
  { size:180, x:'78%',  y:'68%', color:'rgba(210,10,10,.10)',  dur:7,  delay:0.8 },
  { size:280, x:'3%',   y:'62%', color:'rgba(22,55,170,.10)',  dur:9,  delay:2   },
  { size:120, x:'48%',  y:'75%', color:'rgba(255,255,255,.50)', dur:6, delay:0.3 },
]

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.07 } } }
const fadeUp  = { hidden:{ opacity:0, y:18 }, show:{ opacity:1, y:0,
  transition:{ duration:.5, ease:[0.22,1,0.36,1] } } }

export default function LoginPage() {
  const [form, setForm]         = useState({ phone:'', password:'' })
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [remember, setRemember] = useState(false)

  const mouseX  = useMotionValue(0.5)
  const mouseY  = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness:60, damping:18 })
  const springY = useSpring(mouseY, { stiffness:60, damping:18 })
  const gradX   = useTransform(springX, [0,1], [-14, 14])
  const gradY   = useTransform(springY, [0,1], [-10, 10])
  const rotateX = useTransform(springY, [0,1], [ 5, -5])
  const rotateY = useTransform(springX, [0,1], [-5,  5])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (!/^0[0-9]{8,9}$/.test(form.phone)) return setError('เบอร์โทรไม่ถูกต้อง')
    if (form.password.length < 6)           return setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัว')
    setLoading(true)
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login.php`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form), credentials:'include',
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('merchant_token', data.token)
        window.location.href = '/dashboard'
      } else setError(data.message || 'เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง')
    } catch { setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้') }
    finally  { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', overflow:'hidden', position:'relative',
      display:'flex', alignItems:'center', justifyContent:'center' }}>

      {/* ── BG: Thai-flag parallax (moves with mouse) ── */}
      <motion.div style={{
        position:'absolute', inset:'-20px', x:gradX, y:gradY,
        background:`
          radial-gradient(ellipse 60% 90% at -5% 50%,  rgba(220,10,10,.82)   0%, rgba(185,5,5,.45)   35%, transparent 62%),
          radial-gradient(ellipse 50% 80% at 105% 50%, rgba(22,55,170,.78)   0%, rgba(15,40,130,.42) 35%, transparent 62%),
          radial-gradient(ellipse 55% 50% at 50%  50%, rgba(255,255,255,1)   0%, #eaeaf4 100%)
        `,
      }}/>

      {/* White shimmer ray */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1,
        background:`
          radial-gradient(ellipse 40% 55% at 50% 50%, rgba(255,255,255,.6) 0%, transparent 65%),
          linear-gradient(180deg, transparent 0%, rgba(255,255,255,.2) 48%, transparent 100%)
        `,
        animation:'thaiRay 9s ease-in-out infinite alternate',
      }}/>

      {/* Floating blobs */}
      {BLOBS.map((b,i) => (
        <motion.div key={i}
          animate={{ y:[0,-22,0], x:[0,12,0], scale:[1,1.07,1] }}
          transition={{ repeat:Infinity, duration:b.dur, delay:b.delay, ease:'easeInOut' }}
          style={{ position:'absolute', borderRadius:'50%', pointerEvents:'none', zIndex:1,
            width:b.size, height:b.size, left:b.x, top:b.y,
            background:`radial-gradient(circle,${b.color},transparent 70%)`,
            filter:'blur(32px)' }}
        />
      ))}

      {/* ── Card: 3D tilt ── */}
      <motion.div style={{ position:'relative', zIndex:10, rotateX, rotateY, transformPerspective:1200 }}
        initial={{ opacity:0, scale:.94, y:28 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ duration:.7, ease:[0.22,1,0.36,1] }}>

        <div className="glass-card" style={{ width:420, padding:'44px 40px 40px' }}>

          {/* Logo */}
          <motion.div variants={stagger} initial="hidden" animate="show"
            style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:28 }}>
            <motion.div variants={fadeUp} style={{
              width:64, height:64, borderRadius:18, marginBottom:14,
              background:`linear-gradient(135deg,${RED},#c01002)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:30, boxShadow:`0 8px 32px ${RED}55`,
            }}>🐻</motion.div>
            <motion.div variants={fadeUp} style={{ fontSize:22, fontWeight:900, color:'#0a0a0f', lineHeight:1 }}>
              เฮงเฮงปังจัง
            </motion.div>
            <motion.div variants={fadeUp} style={{ fontSize:11, fontWeight:800, color:RED, letterSpacing:3, marginTop:4 }}>
              MERCHANT PORTAL
            </motion.div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.h2 variants={fadeUp} style={{ fontSize:22, fontWeight:900, color:'#0a0a0f',
              margin:'0 0 4px', textAlign:'center', letterSpacing:'-0.5px' }}>เข้าสู่ระบบ</motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize:12, color:'#9CA3AF', textAlign:'center',
              margin:'0 0 24px', fontWeight:400 }}>จัดการร้านค้าและ QR Code ของคุณ</motion.p>

            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                style={{ background:'#fff1f0', border:`1px solid ${RED}35`,
                  borderRadius:12, padding:'10px 14px', marginBottom:16,
                  fontSize:12, fontWeight:700, color:RED, textAlign:'center' }}>
                ⚠️ {error}
              </motion.div>
            )}

            {/* Phone */}
            <motion.div variants={fadeUp} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:800, color:'#374151', display:'block', marginBottom:6 }}>
                เบอร์โทรศัพท์
              </label>
              <div style={{ position:'relative' }}>
                <Phone size={15} style={{ position:'absolute', left:14, top:'50%',
                  transform:'translateY(-50%)', color:'#9CA3AF' }}/>
                <input type="tel" placeholder="0812345678"
                  value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}
                  onKeyDown={e => e.key==='Enter' && handleSubmit()}
                  style={{ width:'100%', padding:'12px 14px 12px 40px', borderRadius:12,
                    border:`1.5px solid ${form.phone ? RED+'55':'#E5E7EB'}`,
                    fontSize:15, fontWeight:600, color:'#111', outline:'none',
                    background:'rgba(255,255,255,.7)', boxSizing:'border-box',
                    transition:'all .2s',
                    boxShadow: form.phone ? `0 0 0 3px ${RED}10` : 'none' }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <label style={{ fontSize:12, fontWeight:800, color:'#374151' }}>รหัสผ่าน</label>
                <a href="#" style={{ fontSize:11, fontWeight:700, color:RED }}>ลืมรหัสผ่าน?</a>
              </div>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:14, top:'50%',
                  transform:'translateY(-50%)', color:'#9CA3AF' }}/>
                <input type={showPw ? 'text':'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                  onKeyDown={e => e.key==='Enter' && handleSubmit()}
                  style={{ width:'100%', padding:'12px 42px 12px 40px', borderRadius:12,
                    border:`1.5px solid ${form.password ? RED+'55':'#E5E7EB'}`,
                    fontSize:15, fontWeight:600, color:'#111', outline:'none',
                    background:'rgba(255,255,255,.7)', boxSizing:'border-box',
                    transition:'all .2s',
                    boxShadow: form.password ? `0 0 0 3px ${RED}10` : 'none' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', padding:4 }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </motion.div>

            {/* Remember */}
            <motion.div variants={fadeUp} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <div onClick={() => setRemember(!remember)} style={{
                width:18, height:18, borderRadius:5, cursor:'pointer', flexShrink:0,
                border:`2px solid ${remember ? RED:'#D1D5DB'}`,
                background: remember ? RED : 'rgba(255,255,255,.8)',
                display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}>
                {remember && <span style={{ color:'#fff', fontSize:11 }}>✓</span>}
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:'#6B7280', cursor:'pointer' }}
                onClick={() => setRemember(!remember)}>จดจำการเข้าสู่ระบบ</span>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp}>
              <motion.button onClick={handleSubmit} disabled={loading}
                whileHover={!loading ? { scale:1.02, boxShadow:`0 12px 36px ${RED}55` } : {}}
                whileTap={!loading ? { scale:.98 } : {}}
                style={{ width:'100%', padding:'14px', borderRadius:14, border:'none',
                  background: loading ? '#f3f4f6' : `linear-gradient(135deg,${RED},#c01002)`,
                  color: loading ? '#9CA3AF':'#fff',
                  fontSize:16, fontWeight:900, cursor: loading ? 'not-allowed':'pointer',
                  boxShadow: loading ? 'none' : `0 8px 28px ${RED}45`,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'background .2s' }}>
                {loading && <Loader2 size={16} className="animate-spin"/>}
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ →'}
              </motion.button>
            </motion.div>

            <motion.div variants={fadeUp} style={{ textAlign:'center', marginTop:18 }}>
              <span style={{ fontSize:13, color:'#9CA3AF' }}>ยังไม่มีบัญชี? </span>
              <Link href="/register" style={{ fontSize:13, fontWeight:900, color:RED }}>สมัครใช้งานฟรี</Link>
            </motion.div>
            <motion.div variants={fadeUp} style={{ textAlign:'center', marginTop:8 }}>
              <Link href="/" style={{ fontSize:12, color:'#9CA3AF', fontWeight:500 }}>← กลับหน้าหลัก</Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

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
