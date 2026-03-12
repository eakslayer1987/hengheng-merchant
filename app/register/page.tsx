'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, MapPin, Navigation, Store, Phone, Mail, Lock, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const RED = '#fd1803'
const fadeUp = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:.5,ease:[0.22,1,0.36,1]}} }
const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.06 } } }

type GPSState = 'idle'|'loading'|'success'|'error'

function useGPS() {
  const [state,  setState]  = useState<GPSState>('idle')
  const [coords, setCoords] = useState<{lat:number;lng:number}|null>(null)
  const [err,    setErr]    = useState('')
  const detect = useCallback(() => {
    if (!navigator.geolocation) { setErr('Browser ไม่รองรับ GPS'); setState('error'); return }
    setState('loading')
    navigator.geolocation.getCurrentPosition(
      p  => { setCoords({ lat:p.coords.latitude, lng:p.coords.longitude }); setState('success') },
      e  => { setErr(e.code===1?'ไม่ได้รับอนุญาต GPS':'ระบุตำแหน่งไม่ได้'); setState('error') },
      { timeout:10000, enableHighAccuracy:true }
    )
  }, [])
  return { state, coords, err, detect }
}

const fields: { key:string; label:string; placeholder:string; type?:string; icon:any }[] = [
  { key:'shop_name',   label:'ชื่อร้านค้า',    placeholder:'ร้านกะเพราป้าแดง', icon:Store },
  { key:'owner_name',  label:'ชื่อเจ้าของร้าน', placeholder:'สมชาย ใจดี',       icon:User  },
  { key:'phone',       label:'เบอร์โทรศัพท์',  placeholder:'0812345678',        icon:Phone },
  { key:'email',       label:'อีเมล',           placeholder:'shop@email.com',    icon:Mail, type:'email' },
  { key:'password',    label:'รหัสผ่าน',        placeholder:'อย่างน้อย 8 ตัว',  icon:Lock, type:'password' },
]

export default function RegisterPage() {
  const [form, setForm]     = useState<Record<string,string>>({
    shop_name:'', owner_name:'', phone:'', email:'', password:'', address:'' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const gps = useGPS()
  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const handleSubmit = async () => {
    setError('')
    if (!form.shop_name)  return setError('กรุณากรอกชื่อร้านค้า')
    if (!/^0[0-9]{8,9}$/.test(form.phone)) return setError('เบอร์โทรไม่ถูกต้อง')
    if (form.password.length < 6) return setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัว')
    setLoading(true)
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register.php`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, lat:gps.coords?.lat??null, lng:gps.coords?.lng??null }),
      })
      const data = await res.json()
      if (data.success) setSuccess(true)
      else setError(data.message || 'เกิดข้อผิดพลาด')
    } catch { setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <motion.div className="glass-card" style={{ padding:48, textAlign:'center', maxWidth:400, width:'100%' }}
        initial={{ opacity:0, scale:.88 }} animate={{ opacity:1, scale:1 }}
        transition={{ type:'spring', bounce:.35 }}>
        <motion.div style={{ fontSize:56, marginBottom:16 }}
          animate={{ rotate:[0,15,-10,15,0] }} transition={{ delay:.2, duration:.7 }}>🎉</motion.div>
        <h2 style={{ fontSize:24, fontWeight:900, color:'#0a0a0f', marginBottom:8 }}>สมัครสำเร็จแล้ว!</h2>
        <p style={{ fontSize:13, color:'#9CA3AF', marginBottom:28 }}>
          ตรวจสอบอีเมลเพื่อยืนยันบัญชี จากนั้นเข้าสู่ระบบได้เลย
        </p>
        <Link href="/login" style={{
          display:'block', padding:'13px', borderRadius:14,
          background:`linear-gradient(135deg,${RED},#c01002)`,
          color:'#fff', fontSize:15, fontWeight:900, textDecoration:'none',
          textAlign:'center', boxShadow:`0 8px 28px ${RED}45` }}>
          ไปหน้าเข้าสู่ระบบ →
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'stretch' }}>

      {/* ── Left Panel: dark ── */}
      <motion.div initial={{ x:-60, opacity:0 }} animate={{ x:0, opacity:1 }}
        transition={{ duration:.7, ease:[.22,1,.36,1] }}
        style={{ width:420, flexShrink:0, padding:'48px 40px',
          background:'linear-gradient(160deg,#1C1C2E,#2D2D44)',
          display:'flex', flexDirection:'column', justifyContent:'space-between',
          position:'relative', overflow:'hidden' }}
        className="hidden lg:flex">

        {/* Red glow */}
        <div style={{ position:'absolute', top:-60, left:-60, width:320, height:320,
          borderRadius:'50%', background:`radial-gradient(circle,${RED}18,transparent 70%)`,
          filter:'blur(40px)', pointerEvents:'none' }}/>

        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10,
          position:'relative', zIndex:1, textDecoration:'none' }}>
          <div style={{ width:42, height:42, borderRadius:12,
            background:`linear-gradient(135deg,${RED},#c01002)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:20, boxShadow:`0 4px 20px ${RED}50` }}>🐻</div>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff', lineHeight:1 }}>เฮงเฮงปังจัง</div>
            <div style={{ fontSize:10, fontWeight:700, color:RED, letterSpacing:1, marginTop:2 }}>MERCHANT LOYALTY</div>
          </div>
        </Link>

        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:24,
            letterSpacing:'-0.5px' }}>สิ่งที่คุณจะได้รับ</h2>
          {[
            ['⚡','QR Code Loyalty พร้อมใช้ใน 15 นาที'],
            ['📊','Dashboard วิเคราะห์ลูกค้า Real-time'],
            ['📍','แสดงร้านบนแผนที่ใกล้เคียงลูกค้า'],
            ['🎁','Double Reward — ลูกค้าถูก ร้านได้ด้วย'],
          ].map(([ico, t], i) => (
            <motion.div key={t} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}
              initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:.3 + i*.1, duration:.5 }}>
              <div style={{ width:38, height:38, borderRadius:10, flexShrink:0,
                background:`${RED}18`, border:`1px solid ${RED}28`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{ico}</div>
              <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.75)', lineHeight:1.5 }}>{t}</span>
            </motion.div>
          ))}
        </div>

        <p style={{ fontSize:11, color:'rgba(255,255,255,.25)', position:'relative', zIndex:1, marginBottom:0 }}>
          © 2025 เฮงเฮงปังจัง.com
        </p>
      </motion.div>

      {/* ── Right Panel: form ── */}
      <div style={{ flex:1, display:'flex', alignItems:'flex-start',
        justifyContent:'center', padding:'48px 24px', overflowY:'auto' }}>
        <motion.div className="glass-card" style={{ width:'100%', maxWidth:480, padding:'40px 36px' }}
          initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.7, ease:[.22,1,.36,1] }}>

          {/* Header */}
          <div style={{ marginBottom:28, textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:14, margin:'0 auto 14px',
              background:`linear-gradient(135deg,${RED},#c01002)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:24, boxShadow:`0 6px 24px ${RED}45` }}>🐻</div>
            <h2 style={{ fontSize:22, fontWeight:900, color:'#0a0a0f',
              margin:'0 0 4px', letterSpacing:'-0.5px' }}>สมัครร้านค้า</h2>
            <p style={{ fontSize:12, color:'#9CA3AF', margin:0 }}>สร้างบัญชีและเริ่มออก QR Code ได้ฟรี</p>
          </div>

          {error && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              style={{ background:'#fff1f0', border:`1px solid ${RED}35`,
                borderRadius:12, padding:'10px 14px', marginBottom:16,
                fontSize:12, fontWeight:700, color:RED, textAlign:'center' }}>
              ⚠️ {error}
            </motion.div>
          )}

          <motion.div variants={stagger} initial="hidden" animate="show"
            style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {fields.map(({ key, label, placeholder, type, icon:Icon }) => (
              <motion.div key={key} variants={fadeUp}>
                <label style={{ fontSize:12, fontWeight:800, color:'#374151',
                  display:'block', marginBottom:6 }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <Icon size={15} style={{ position:'absolute', left:13, top:'50%',
                    transform:'translateY(-50%)', color:'#9CA3AF' }}/>
                  <div style={{ position:'relative' }}>
                    <input
                      type={key==='password' ? (showPw?'text':'password') : (type||'text')}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={set(key)}
                      onKeyDown={e => e.key==='Enter' && handleSubmit()}
                      style={{ width:'100%', padding:'12px 14px 12px 38px',
                        paddingRight: key==='password' ? 42 : 14,
                        borderRadius:12,
                        border:`1.5px solid ${form[key] ? RED+'50':'#E5E7EB'}`,
                        fontSize:14, fontWeight:600, color:'#111', outline:'none',
                        background:'rgba(255,255,255,.7)', boxSizing:'border-box',
                        transition:'all .2s',
                        boxShadow: form[key] ? `0 0 0 3px ${RED}10` : 'none' }}
                    />
                    {key==='password' && (
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{
                        position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                        background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}>
                        {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* GPS */}
            <motion.div variants={fadeUp}>
              <label style={{ fontSize:12, fontWeight:800, color:'#374151',
                display:'block', marginBottom:6 }}>ที่อยู่ร้าน</label>
              <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                <div style={{ position:'relative', flex:1 }}>
                  <MapPin size={15} style={{ position:'absolute', left:13, top:'50%',
                    transform:'translateY(-50%)', color:'#9CA3AF' }}/>
                  <input placeholder="ที่อยู่ร้านค้า" value={form.address}
                    onChange={set('address')}
                    style={{ width:'100%', padding:'12px 14px 12px 38px', borderRadius:12,
                      border:`1.5px solid ${form.address ? RED+'50':'#E5E7EB'}`,
                      fontSize:14, fontWeight:600, color:'#111', outline:'none',
                      background:'rgba(255,255,255,.7)', boxSizing:'border-box', transition:'all .2s' }}
                  />
                </div>
                <button type="button" onClick={gps.detect} style={{
                  padding:'0 14px', borderRadius:12, border:`1.5px solid #E5E7EB`,
                  background:'rgba(255,255,255,.7)', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:6,
                  fontSize:12, fontWeight:700, color:'#374151', whiteSpace:'nowrap',
                  transition:'all .2s' }}>
                  <Navigation size={14} color={gps.state==='success' ? '#16A34A' : '#9CA3AF'}/>
                  {gps.state==='loading' ? '...' : gps.state==='success' ? '✓ GPS' : 'GPS'}
                </button>
              </div>
              {gps.state==='success' && (
                <div style={{ fontSize:11, color:'#16A34A', fontWeight:600 }}>
                  📍 {gps.coords?.lat.toFixed(4)}, {gps.coords?.lng.toFixed(4)}
                </div>
              )}
              {gps.state==='error' && (
                <div style={{ fontSize:11, color:RED, fontWeight:600 }}>⚠️ {gps.err}</div>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp}>
              <motion.button onClick={handleSubmit} disabled={loading}
                whileHover={!loading ? { scale:1.02, boxShadow:`0 12px 36px ${RED}50` } : {}}
                whileTap={!loading ? { scale:.98 } : {}}
                style={{ width:'100%', padding:'14px', borderRadius:14, border:'none',
                  background: loading ? '#f3f4f6' : `linear-gradient(135deg,${RED},#c01002)`,
                  color: loading ? '#9CA3AF':'#fff',
                  fontSize:16, fontWeight:900, cursor: loading ? 'not-allowed':'pointer',
                  boxShadow: loading ? 'none' : `0 8px 28px ${RED}45`,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'background .2s' }}>
                {loading && <Loader2 size={16} className="animate-spin"/>}
                {loading ? 'กำลังสมัคร...' : 'สมัครใช้งานฟรี →'}
              </motion.button>
            </motion.div>
          </motion.div>

          <div style={{ textAlign:'center', marginTop:20 }}>
            <span style={{ fontSize:13, color:'#9CA3AF' }}>มีบัญชีแล้ว? </span>
            <Link href="/login" style={{ fontSize:13, fontWeight:900, color:RED }}>เข้าสู่ระบบ</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
