'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronRight, Zap, QrCode, BarChart3, MapPin, Gift, ArrowRight } from 'lucide-react'

const RED = '#fd1803'

const BLOBS = [
  { size:420, x:'-5%',  y:'8%',  color:'rgba(210,10,10,.20)',  dur:9,  delay:0   },
  { size:280, x:'72%',  y:'5%',  color:'rgba(22,55,170,.16)',  dur:11, delay:1.5 },
  { size:220, x:'80%',  y:'62%', color:'rgba(210,10,10,.12)',  dur:8,  delay:0.8 },
  { size:320, x:'0%',   y:'58%', color:'rgba(22,55,170,.12)',  dur:10, delay:2   },
  { size:140, x:'45%',  y:'72%', color:'rgba(255,255,255,.55)', dur:7, delay:0.3 },
]

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.08 } } }
const fadeUp  = { hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1] as any } } }

const FEATURES = [
  { icon:QrCode,   title:'QR Code Loyalty',      desc:'ออก QR พร้อมใช้ใน 15 นาที ลูกค้าสแกนรับสิทธิ์ทันที', color:'#fd1803' },
  { icon:BarChart3, title:'Dashboard Real-time',  desc:'วิเคราะห์ลูกค้า ติดตาม quota และรายได้แบบ real-time', color:'#3b82f6' },
  { icon:MapPin,   title:'แผนที่ร้านค้า',         desc:'แสดงร้านของคุณบนแผนที่ ให้ลูกค้าในพื้นที่ค้นพบ', color:'#10b981' },
  { icon:Gift,     title:'Double Reward',         desc:'ลูกค้าได้รางวัล ร้านได้ VIP pricing ซอสหมีปรุง', color:'#8b5cf6' },
]

const HOW = [
  { n:'01', title:'ซื้อซอสหมีปรุง',        desc:'ร้านซื้อ 1 ถุง = รับ QR Code + 30 redemption codes + VIP price' },
  { n:'02', title:'ลูกค้าสแกน QR',         desc:'ลูกค้าสแกนที่ร้าน → ลงทะเบียนผ่านเบอร์โทร → หมุนวงล้อ' },
  { n:'03', title:'รับรางวัลทันที',          desc:'ส่วนลด / ทานฟรี / คะแนนสะสม / ลุ้นโชคใหญ่' },
]

export default function HomePage() {
  const mouseX  = useMotionValue(0.5)
  const mouseY  = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness:50, damping:18 })
  const springY = useSpring(mouseY, { stiffness:50, damping:18 })
  const gradX   = useTransform(springX, [0,1], [-16,16])
  const gradY   = useTransform(springY, [0,1], [-12,12])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div style={{ minHeight:'100vh', overflowX:'hidden' }}>

      {/* ── BG ── */}
      <motion.div style={{
        position:'fixed', inset:'-20px', zIndex:0, x:gradX, y:gradY,
        background:`
          radial-gradient(ellipse 60% 90% at -5% 50%,  rgba(220,10,10,.82)   0%, rgba(185,5,5,.45)   35%, transparent 62%),
          radial-gradient(ellipse 50% 80% at 105% 50%, rgba(22,55,170,.78)   0%, rgba(15,40,130,.42) 35%, transparent 62%),
          radial-gradient(ellipse 55% 50% at 50%  50%, rgba(255,255,255,1)   0%, #eaeaf4             100%)
        `,
      }}/>
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:'radial-gradient(ellipse 40% 55% at 50% 50%, rgba(255,255,255,.65) 0%, transparent 65%)',
        animation:'thaiRay 9s ease-in-out infinite alternate',
      }}/>
      {BLOBS.map((b,i) => (
        <motion.div key={i}
          animate={{ y:[0,-24,0], x:[0,14,0], scale:[1,1.08,1] }}
          transition={{ repeat:Infinity, duration:b.dur, delay:b.delay, ease:'easeInOut' }}
          style={{ position:'fixed', borderRadius:'50%', pointerEvents:'none', zIndex:1,
            width:b.size, height:b.size, left:b.x, top:b.y,
            background:`radial-gradient(circle,${b.color},transparent 70%)`, filter:'blur(40px)' }}/>
      ))}

      {/* ── NAVBAR ── */}
      <motion.nav initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:.6, ease:[0.22,1,0.36,1] }}
        style={{ position:'sticky', top:0, zIndex:100, padding:'0 24px',
          display:'flex', alignItems:'center', justifyContent:'space-between', height:64,
          background:'rgba(255,255,255,.72)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(255,255,255,.8)', boxShadow:'0 1px 20px rgba(0,0,0,.06)' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:38, height:38, borderRadius:11, background:`linear-gradient(135deg,${RED},#c01002)`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
            boxShadow:`0 4px 16px ${RED}45` }}>🐻</div>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:'#0a0a0f', lineHeight:1 }}>เฮงเฮงปังจัง</div>
            <div style={{ fontSize:9, fontWeight:800, color:RED, letterSpacing:2 }}>MERCHANT LOYALTY</div>
          </div>
        </Link>

        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <Link href="/login" style={{ padding:'8px 18px', borderRadius:10, fontSize:13, fontWeight:700,
            color:'#374151', background:'transparent', border:'1.5px solid #E5E7EB', textDecoration:'none',
            transition:'all .2s' }}>เข้าสู่ระบบ</Link>
          <Link href="/register" style={{ padding:'8px 18px', borderRadius:10, fontSize:13, fontWeight:900,
            color:'#fff', background:`linear-gradient(135deg,${RED},#c01002)`, textDecoration:'none',
            boxShadow:`0 4px 16px ${RED}40` }}>สมัครฟรี →</Link>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section style={{ position:'relative', zIndex:10, minHeight:'calc(100vh - 64px)',
        display:'flex', alignItems:'center', padding:'60px 24px 80px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:40, alignItems:'center', width:'100%' }}>

          {/* Left */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px',
                borderRadius:999, background:`${RED}12`, border:`1px solid ${RED}28`,
                fontSize:11, fontWeight:800, color:RED, letterSpacing:2, marginBottom:24 }}>
                <Zap size={10}/> B2B2C LOYALTY PLATFORM 2025
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp}
              style={{ fontSize:'clamp(2.6rem,6vw,4.5rem)', fontWeight:900, lineHeight:1.05,
                letterSpacing:'-2px', margin:'0 0 20px', color:'#0a0a0f' }}>
              ลูกค้าถูกรางวัล<br/>
              <span style={{ color:RED }}>ร้านค้าได้ด้วย</span><br/>
              พร้อมกันทันที
            </motion.h1>

            <motion.p variants={fadeUp}
              style={{ fontSize:15, color:'#6B7280', lineHeight:1.8, margin:'0 0 36px', maxWidth:480 }}>
              ระบบ Double Reward เชื่อมซอสเฮงเฮงปังจัง ร้านอาหาร และลูกค้า<br/>ในวงจรเดียว ผ่าน LINE OA
            </motion.p>

            <motion.div variants={fadeUp} style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <motion.div whileHover={{ scale:1.03, boxShadow:`0 14px 40px ${RED}55` }} whileTap={{ scale:.97 }}>
                <Link href="/register" style={{ display:'inline-flex', alignItems:'center', gap:8,
                  padding:'15px 28px', borderRadius:14, background:`linear-gradient(135deg,${RED},#c01002)`,
                  color:'#fff', fontSize:16, fontWeight:900, textDecoration:'none',
                  boxShadow:`0 8px 28px ${RED}45` }}>
                  สมัครร้านค้าฟรี <ArrowRight size={18}/>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}>
                <Link href="#how" style={{ display:'inline-flex', alignItems:'center', gap:8,
                  padding:'15px 28px', borderRadius:14, background:'rgba(255,255,255,.7)',
                  border:'1.5px solid rgba(0,0,0,.1)', color:'#374151',
                  fontSize:16, fontWeight:700, textDecoration:'none', backdropFilter:'blur(10px)' }}>
                  ดูวิธีทำงาน <ChevronRight size={18}/>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: mock cards */}
          <motion.div initial={{ opacity:0, x:40, scale:.94 }} animate={{ opacity:1, x:0, scale:1 }}
            transition={{ duration:.8, delay:.2, ease:[0.22,1,0.36,1] }}
            style={{ display:'flex', flexDirection:'column', gap:14, minWidth:240 }}
            className="hidden md:flex">

            {/* Merchant card */}
            <motion.div animate={{ y:[0,-8,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}
              className="glass-card" style={{ padding:'18px 20px', width:240 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${RED}15`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏪</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:900, color:'#0a0a0f' }}>ร้านกะเพราป้าแดง</div>
                  <div style={{ fontSize:10, color:'#9CA3AF' }}>Merchant Account</div>
                </div>
              </div>
              <div style={{ padding:'10px 14px', borderRadius:12, background:`${RED}08`,
                border:`1px solid ${RED}18`, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>🎉</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:RED }}>ได้รางวัลด้วย!</div>
                  <div style={{ fontSize:10, color:'#9CA3AF' }}>ซอสฟรี 1 ลัง ฿480</div>
                </div>
              </div>
            </motion.div>

            {/* Customer scan card */}
            <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:5, ease:'easeInOut', delay:1 }}
              className="glass-card" style={{ padding:'18px 20px', width:240 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#9CA3AF', letterSpacing:1, marginBottom:10 }}>ลูกค้าสแกน QR</div>
              <div style={{ padding:'14px', borderRadius:14, background:`linear-gradient(135deg,${RED},#c01002)`,
                textAlign:'center', boxShadow:`0 8px 24px ${RED}45` }}>
                <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>🎁 ถูกรางวัล!</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.8)', marginTop:4 }}>กินฟรีมื้อนี้</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ position:'relative', zIndex:10, padding:'80px 24px', maxWidth:1100, margin:'0 auto' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.6 }} style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px',
            borderRadius:999, background:`${RED}10`, border:`1px solid ${RED}20`,
            fontSize:11, fontWeight:800, color:RED, letterSpacing:2, marginBottom:14 }}>
            ฟีเจอร์
          </div>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, color:'#0a0a0f',
            letterSpacing:'-1px', margin:'0 0 12px' }}>ครบในที่เดียว</h2>
          <p style={{ fontSize:15, color:'#6B7280', maxWidth:480, margin:'0 auto' }}>ระบบ loyalty ที่ออกแบบมาสำหรับร้านอาหารไทยโดยเฉพาะ</p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:16 }}>
          {FEATURES.map((f,i) => (
            <motion.div key={f.title} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*.1, duration:.5, ease:[0.22,1,0.36,1] }}>
              <motion.div whileHover={{ y:-4, boxShadow:'0 20px 50px rgba(0,0,0,.1)' }}
                className="glass-card" style={{ padding:'24px 22px', height:'100%', transition:'box-shadow .3s' }}>
                <div style={{ width:44, height:44, borderRadius:12, marginBottom:16,
                  background:`${f.color}15`, border:`1px solid ${f.color}25`,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <f.icon size={20} color={f.color}/>
                </div>
                <div style={{ fontSize:15, fontWeight:900, color:'#0a0a0f', marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'#6B7280', lineHeight:1.7 }}>{f.desc}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ position:'relative', zIndex:10, padding:'80px 24px', maxWidth:860, margin:'0 auto' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.6 }} style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px',
            borderRadius:999, background:`${RED}10`, border:`1px solid ${RED}20`,
            fontSize:11, fontWeight:800, color:RED, letterSpacing:2, marginBottom:14 }}>
            วิธีทำงาน
          </div>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, color:'#0a0a0f',
            letterSpacing:'-1px', margin:0 }}>3 ขั้นตอนง่ายๆ</h2>
        </motion.div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {HOW.map((h,i) => (
            <motion.div key={h.n} initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ delay:i*.12, duration:.5, ease:[0.22,1,0.36,1] }}>
              <motion.div whileHover={{ x:6 }} className="glass-card"
                style={{ padding:'22px 24px', display:'flex', alignItems:'center', gap:20 }}>
                <div style={{ fontSize:28, fontWeight:900, color:`${RED}30`, fontFamily:'monospace',
                  minWidth:48, lineHeight:1 }}>{h.n}</div>
                <div style={{ width:1, height:40, background:'rgba(0,0,0,.08)' }}/>
                <div>
                  <div style={{ fontSize:16, fontWeight:900, color:'#0a0a0f', marginBottom:4 }}>{h.title}</div>
                  <div style={{ fontSize:13, color:'#6B7280', lineHeight:1.6 }}>{h.desc}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position:'relative', zIndex:10, padding:'80px 24px 100px' }}>
        <motion.div initial={{ opacity:0, scale:.96 }} whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true }} transition={{ duration:.7, ease:[0.22,1,0.36,1] }}
          style={{ maxWidth:580, margin:'0 auto' }}>
          <div className="glass-card" style={{ padding:'48px 40px', textAlign:'center',
            boxShadow:`0 24px 80px ${RED}20` }}>
            <motion.div animate={{ rotate:[0,10,-8,10,0] }} transition={{ delay:.3, duration:.8, repeat:0 }}
              style={{ fontSize:52, marginBottom:16 }}>🐻</motion.div>
            <h2 style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:900, color:'#0a0a0f',
              letterSpacing:'-1px', margin:'0 0 10px' }}>เริ่มต้นวันนี้ ฟรี!</h2>
            <p style={{ fontSize:14, color:'#6B7280', margin:'0 0 28px', lineHeight:1.7 }}>
              สมัครร้านค้า ออก QR Code แรก และเริ่มสร้าง loyalty<br/>ให้กับลูกค้าได้เลยโดยไม่มีค่าใช้จ่าย
            </p>
            <motion.div whileHover={{ scale:1.03, boxShadow:`0 16px 48px ${RED}55` }} whileTap={{ scale:.97 }}>
              <Link href="/register" style={{ display:'inline-flex', alignItems:'center', gap:10,
                padding:'16px 36px', borderRadius:16, background:`linear-gradient(135deg,${RED},#c01002)`,
                color:'#fff', fontSize:17, fontWeight:900, textDecoration:'none',
                boxShadow:`0 8px 32px ${RED}45` }}>
                สมัครร้านค้าฟรี <ArrowRight size={20}/>
              </Link>
            </motion.div>
            <p style={{ fontSize:11, color:'#9CA3AF', marginTop:14 }}>ไม่มีค่าใช้จ่าย · ไม่ต้องใช้บัตรเครดิต</p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 24px 32px',
        fontSize:11, color:'rgba(0,0,0,.3)', fontWeight:500 }}>
        © 2025 เฮงเฮงปังจัง.com · Powered by หมีปรุง Global Foods
      </div>

      <style>{`
        @keyframes thaiRay {
          0%   { opacity:.7; transform:scaleY(1) translateY(0); }
          50%  { opacity:1;  transform:scaleY(1.06) translateY(-1.5%); }
          100% { opacity:.75;transform:scaleY(.97) translateY(1.5%); }
        }
        .hidden { display:none; }
        @media(min-width:768px){ .hidden.md\\:flex{ display:flex!important; } }
      `}</style>
    </div>
  )
}
