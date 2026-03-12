'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Eye, EyeOff, Loader2, Phone, Lock } from 'lucide-react'

const RED = '#fd1803'

const BLOBS = [
  { size: 320, x: '10%',  y: '15%',  color: `${RED}22`,     dur: 7,  delay: 0   },
  { size: 200, x: '75%',  y: '10%',  color: '#1e3a8a22',    dur: 9,  delay: 1.5 },
  { size: 160, x: '80%',  y: '70%',  color: `${RED}15`,     dur: 6,  delay: 0.8 },
  { size: 260, x: '5%',   y: '65%',  color: '#1e40af18',    dur: 8,  delay: 2   },
  { size: 100, x: '50%',  y: '80%',  color: `${RED}20`,     dur: 5,  delay: 0.3 },
]

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.07 } } }
const fadeUp  = {
  hidden: { opacity:0, y:18 },
  show:   { opacity:1, y:0, transition:{ duration:.5, ease:[0.22,1,0.36,1] } }
}

export default function LoginPage() {
  const [form, setForm]         = useState({ phone:'', password:'' })
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [remember, setRemember] = useState(false)

  // 1. Mouse tracking
  const mouseX  = useMotionValue(0.5)
  const mouseY  = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness:60, damping:18 })
  const springY = useSpring(mouseY, { stiffness:60, damping:18 })

  // BG moves slightly
  const gradX = useTransform(springX, [0,1], [-12, 12])
  const gradY = useTransform(springY, [0,1], [-10, 10])

  // Card 3-D tilt
  const rotateX = useTransform(springY, [0,1], [ 6, -6])
  const rotateY = useTransform(springX, [0,1], [-6,  6])

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
      } else { setError(data.message || 'เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง') }
    } catch { setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้') }
    finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight:'100vh', overflow:'hidden', position:'relative',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'Kanit','Sarabun',sans-serif",
    }}>

      {/* ── 1. BG gradient follows mouse ── */}
      <motion.div style={{
        position:'absolute', inset:'-20px', x:gradX, y:gradY,
        background:`
          radial-gradient(ellipse 55% 70% at 0% 50%,   rgba(253,24,3,0.45)   0%, transparent 60%),
          radial-gradient(ellipse 45% 60% at 100% 50%,  rgba(30,64,175,0.35)  0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 50%  50%,  rgba(255,255,255,1)   0%, #f1f5f9 100%)
        `,
      }}/>

      {/* ── 2. Floating blobs ── */}
      {BLOBS.map((b,i) => (
        <motion.div key={i}
          animate={{ y:[0,-24,0], x:[0,12,0], scale:[1,1.08,1] }}
          transition={{ repeat:Infinity, duration:b.dur, delay:b.delay, ease:'easeInOut' }}
          style={{
            position:'absolute', borderRadius:'50%', pointerEvents:'none',
            width:b.size, height:b.size, left:b.x, top:b.y,
            background:`radial-gradient(circle,${b.color},transparent 70%)`,
            filter:'blur(32px)',
          }}
        />
      ))}

      {/* ── 3. Card with 3-D tilt ── */}
      <motion.div
        style={{ position:'relative', zIndex:10, rotateX, rotateY, transformPerspective:1200 }}
        initial={{ opacity:0, scale:.94, y:24 }}
        animate={{ opacity:1, scale:1,   y:0  }}
        transition={{ duration:.7, ease:[0.22,1,0.36,1] }}
      >
        <div style={{
          width:420, borderRadius:28,
          background:'rgba(255,255,255,0.82)',
          backdropFilter:'blur(28px) saturate(1.6)',
          border:'1.5px solid rgba(255,255,255,0.9)',
          boxShadow:'0 32px 80px rgba(0,0,0,.14), 0 2px 8px rgba(0,0,0,.06)',
          padding:'40px 40px 36px',
        }}>

          {/* Logo */}
          <motion.div variants={stagger} initial="hidden" animate="show"
            style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:28 }}>
            <motion.div variants={fadeUp} style={{
              width:60, height:60, borderRadius:16, marginBottom:12,
              background:`linear-gradient(135deg,${RED},#c01002)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:28, boxShadow:`0 8px 28px ${RED}55`,
            }}>🐻</motion.div>
            <motion.div variants={fadeUp} style={{ fontSize:20, fontWeight:900, color:'#111', lineHeight:1 }}>
              เฮงเฮงปังจัง
            </motion.div>
            <motion.div variants={fadeUp} style={{ fontSize:11, fontWeight:700, color:RED, letterSpacing:2, marginTop:3 }}>
              MERCHANT PORTAL
            </motion.div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.h1 variants={fadeUp} style={{ fontSize:22, fontWeight:900, color:'#111',
              margin:'0 0 4px', textAlign:'center' }}>เข้าสู่ระบบ</motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize:12, color:'#9CA3AF', textAlign:'center',
              margin:'0 0 24px', fontWeight:500 }}>จัดการร้านค้าและ QR Code ของคุณ</motion.p>

            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                style={{ background:'#fff1f0', border:`1px solid ${RED}40`, borderRadius:12,
                  padding:'10px 14px', marginBottom:16, fontSize:12, fontWeight:700,
                  color:RED, textAlign:'center' }}>⚠️ {error}</motion.div>
            )}

            {/* Phone */}
            <motion.div variants={fadeUp} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:800, color:'#374151', display:'block', marginBottom:6 }}>เบอร์โทรศัพท์</label>
              <div style={{ position:'relative' }}>
                <Phone size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }}/>
                <input type="tel" placeholder="0812345678"
                  value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}
                  onKeyDown={e => e.key==='Enter' && handleSubmit()}
                  style={{
                    width:'100%', padding:'12px 14px 12px 38px', borderRadius:12,
                    border:`1.5px solid ${form.phone ? RED+'60':'#E5E7EB'}`,
                    fontSize:15, fontWeight:600, color:'#111', outline:'none',
                    background:'rgba(255,255,255,.8)', fontFamily:'inherit', boxSizing:'border-box',
                    transition:'border-color .2s, box-shadow .2s',
                    boxShadow: form.phone ? `0 0 0 3px ${RED}12` : 'none',
                  }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <label style={{ fontSize:12, fontWeight:800, color:'#374151' }}>รหัสผ่าน</label>
                <a href="#" style={{ fontSize:11, fontWeight:700, color:RED, textDecoration:'none' }}>ลืมรหัสผ่าน?</a>
              </div>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }}/>
                <input type={showPw ? 'text':'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                  onKeyDown={e => e.key==='Enter' && handleSubmit()}
                  style={{
                    width:'100%', padding:'12px 42px 12px 38px', borderRadius:12,
                    border:`1.5px solid ${form.password ? RED+'60':'#E5E7EB'}`,
                    fontSize:15, fontWeight:600, color:'#111', outline:'none',
                    background:'rgba(255,255,255,.8)', fontFamily:'inherit', boxSizing:'border-box',
                    transition:'border-color .2s, box-shadow .2s',
                    boxShadow: form.password ? `0 0 0 3px ${RED}12` : 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', padding:4,
                }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </motion.div>

            {/* Remember */}
            <motion.div variants={fadeUp} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <div onClick={() => setRemember(!remember)} style={{
                width:18, height:18, borderRadius:5, cursor:'pointer', flexShrink:0,
                border:`2px solid ${remember ? RED:'#D1D5DB'}`,
                background: remember ? RED : '#fff',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s',
              }}>
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
                style={{
                  width:'100%', padding:'14px', borderRadius:14, border:'none',
                  background: loading ? '#f3f4f6' : `linear-gradient(135deg,${RED},#c01002)`,
                  color: loading ? '#9CA3AF':'#fff',
                  fontSize:16, fontWeight:900, cursor: loading ? 'not-allowed':'pointer',
                  boxShadow: loading ? 'none' : `0 8px 28px ${RED}45`,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  fontFamily:'inherit', transition:'background .2s',
                }}>
                {loading && <Loader2 size={16} className="animate-spin"/>}
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ →'}
              </motion.button>
            </motion.div>

            <motion.div variants={fadeUp} style={{ textAlign:'center', marginTop:18 }}>
              <span style={{ fontSize:13, color:'#9CA3AF', fontWeight:500 }}>ยังไม่มีบัญชี? </span>
              <Link href="/register" style={{ fontSize:13, fontWeight:800, color:RED, textDecoration:'none' }}>สมัครใช้งานฟรี</Link>
            </motion.div>
            <motion.div variants={fadeUp} style={{ textAlign:'center', marginTop:8 }}>
              <Link href="/" style={{ fontSize:12, color:'#9CA3AF', fontWeight:500, textDecoration:'none' }}>← กลับหน้าหลัก</Link>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

    </div>
  )
}
