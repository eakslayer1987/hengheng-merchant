'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

const RED = '#fd1803'

const BLOBS = [
  { size:420, x:'-8%', y:'6%',  color:'rgba(210,10,10,.20)',  dur:9,  delay:0   },
  { size:280, x:'68%', y:'4%',  color:'rgba(22,55,170,.17)',  dur:11, delay:1.5 },
  { size:220, x:'76%', y:'60%', color:'rgba(210,10,10,.12)',  dur:8,  delay:0.8 },
  { size:300, x:'1%',  y:'55%', color:'rgba(22,55,170,.12)',  dur:10, delay:2   },
]

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:.08 } } }
const fadeUp  = {
  hidden:{ opacity:0, y:22 },
  show:{ opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1] as any } }
}

const PRIZES = [
  { e:'🏷️', name:'ส่วนลด 10 บาท', desc:'โค้ดซื้อซอสหมีปรุง', pct:'55%', bg:'rgba(253,24,3,.09)',   bc:'rgba(253,24,3,.22)',   tc:'#fd1803' },
  { e:'🍛', name:'ทานฟรีมื้อนี้',  desc:'ร้านค้าเป็นผู้มอบให้',  pct:'10%', bg:'rgba(232,168,32,.09)', bc:'rgba(232,168,32,.25)', tc:'#e8a820' },
  { e:'⭐', name:'50 คะแนน',       desc:'สะสมแลกของพรีเมียม',  pct:'15%', bg:'rgba(16,185,129,.09)', bc:'rgba(16,185,129,.25)', tc:'#10b981' },
  { e:'🎟️', name:'ลุ้นโชคใหญ่',   desc:'Ticket รายเดือน',     pct:'20%', bg:'rgba(139,92,246,.09)', bc:'rgba(139,92,246,.22)', tc:'#8b5cf6' },
]

const HOW = [
  { n:'01', c:RED,       bg:'rgba(253,24,3,.1)',       bc:'rgba(253,24,3,.22)',    title:'ซื้อซอสหมีปรุง',   desc:'ซื้อ 1 ถุง รับ QR Code + 30 redemption codes + ราคา VIP ทันที' },
  { n:'02', c:'#e8a820', bg:'rgba(232,168,32,.1)',     bc:'rgba(232,168,32,.25)',  title:'ลูกค้าสแกน QR',    desc:'ลงทะเบียนเบอร์โทร รับ OTP แล้วหมุนวงล้อ Instant Win ได้ทันที' },
  { n:'03', c:'#10b981', bg:'rgba(16,185,129,.1)',     bc:'rgba(16,185,129,.25)',  title:'รับรางวัลทันที',    desc:'ส่วนลดซอส / ทานฟรีมื้อนี้ / คะแนนสะสม / ลุ้นโชคใหญ่รายเดือน' },
]

const SLICES = [
  { name:['ส่วนลด','10 บาท'], color:'#fd1803' },
  { name:['ทานฟรี','มื้อนี้'], color:'#e8a820' },
  { name:['50','คะแนน'],      color:'#10b981' },
  { name:['ลุ้น','โชคใหญ่'],  color:'#8b5cf6' },
  { name:['ลอง','โชคใหม่'],   color:'#94a3b8' },
  { name:['ฟรี','มื้อนี้'],   color:'#3b82f6' },
]

function SpinWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotRef    = useRef(0)
  const speedRef  = useRef(0.003)
  const dirRef    = useRef(1)
  const rafRef    = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const cx=131,cy=131,r=123
    const arc=(2*Math.PI)/SLICES.length

    function draw() {
      ctx.clearRect(0,0,262,262)
      SLICES.forEach((s,i) => {
        const st=rotRef.current+i*arc, en=st+arc
        ctx.beginPath(); ctx.moveTo(cx,cy)
        ctx.arc(cx,cy,r,st,en); ctx.closePath()
        ctx.fillStyle=s.color; ctx.fill()
        ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=2.5; ctx.stroke()
        ctx.save(); ctx.translate(cx,cy); ctx.rotate(st+arc/2)
        ctx.textAlign='right'; ctx.fillStyle='rgba(255,255,255,.96)'
        ctx.shadowColor='rgba(0,0,0,.4)'; ctx.shadowBlur=6
        ctx.font='bold 11.5px Kanit,sans-serif'
        s.name.forEach((l,li) => ctx.fillText(l, r-10, li*14-(s.name.length-1)*7+1))
        ctx.restore()
      })
      ctx.beginPath(); ctx.arc(cx,cy,r,0,2*Math.PI)
      ctx.strokeStyle='rgba(255,255,255,.22)'; ctx.lineWidth=4; ctx.stroke()
      const cg=ctx.createRadialGradient(cx-3,cy-3,2,cx,cy,24)
      cg.addColorStop(0,'#fff'); cg.addColorStop(1,'#f0f0f0')
      ctx.beginPath(); ctx.arc(cx,cy,24,0,2*Math.PI)
      ctx.fillStyle=cg; ctx.fill()
      ctx.strokeStyle='rgba(253,24,3,.22)'; ctx.lineWidth=2; ctx.stroke()
      ctx.font='18px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.shadowBlur=0; ctx.fillText('🐻',cx,cy)
    }

    function tick() {
      speedRef.current += dirRef.current * 0.000006
      if (speedRef.current > 0.007) dirRef.current = -1
      if (speedRef.current < 0.0018) dirRef.current = 1
      rotRef.current += speedRef.current
      draw()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return <canvas ref={canvasRef} width={262} height={262} style={{ borderRadius:'50%', position:'relative', zIndex:2, boxShadow:`0 0 0 3px rgba(253,24,3,.12), 0 16px 48px rgba(0,0,0,.14)` }}/>
}

export default function HomePage() {
  const mouseX  = useMotionValue(0.5)
  const mouseY  = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness:50, damping:18 })
  const springY = useSpring(mouseY, { stiffness:50, damping:18 })
  const gX = useTransform(springX, [0,1], [-16,16])
  const gY = useTransform(springY, [0,1], [-12,12])

  useEffect(() => {
    const fn = (e: MouseEvent) => { mouseX.set(e.clientX/window.innerWidth); mouseY.set(e.clientY/window.innerHeight) }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const glass: React.CSSProperties = {
    background:'rgba(255,255,255,.68)',
    border:'1px solid rgba(255,255,255,.92)',
    backdropFilter:'blur(12px)',
    boxShadow:'0 4px 22px rgba(0,0,0,.05)',
  }

  return (
    <div style={{ minHeight:'100vh', overflowX:'hidden', fontFamily:"'Kanit', sans-serif" }}>

      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700;900&display=swap');
        *{box-sizing:border-box;}
        body{font-family:'Kanit',sans-serif;}
        @keyframes thaiRay{0%{opacity:.65;transform:scaleY(1) translateY(0)}50%{opacity:1;transform:scaleY(1.07) translateY(-1%)}100%{opacity:.7;transform:scaleY(.96) translateY(1%)}}
      `}</style>

      {/* BG */}
      <motion.div style={{ position:'fixed', inset:'-24px', zIndex:0, x:gX, y:gY,
        background:`
          radial-gradient(ellipse 65% 95% at -8% 50%, rgba(200,0,0,1) 0%, rgba(155,0,0,.75) 32%, transparent 60%),
          radial-gradient(ellipse 55% 85% at 108% 50%, rgba(10,30,160,1) 0%, rgba(8,20,110,.75) 32%, transparent 60%),
          radial-gradient(ellipse 60% 55% at 50% 50%, #fff 0%, #ebebf5 100%)
        ` }}/>
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:'radial-gradient(ellipse 45% 60% at 50% 48%, rgba(255,255,255,.7) 0%, transparent 68%)',
        animation:'thaiRay 10s ease-in-out infinite alternate' }}/>
      {BLOBS.map((b,i) => (
        <motion.div key={i}
          animate={{ y:[0,-26,0], x:[0,16,0], scale:[1,1.09,1] }}
          transition={{ repeat:Infinity, duration:b.dur, delay:b.delay, ease:'easeInOut' }}
          style={{ position:'fixed', borderRadius:'50%', pointerEvents:'none', zIndex:1,
            width:b.size, height:b.size, left:b.x, top:b.y,
            background:`radial-gradient(circle,${b.color},transparent 70%)`, filter:'blur(48px)' }}/>
      ))}

      {/* NAV */}
      <motion.nav initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:.6, ease:[0.22,1,0.36,1] }}
        style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center',
          justifyContent:'space-between', padding:'0 40px', height:64,
          background:'rgba(255,255,255,.75)', backdropFilter:'blur(24px)',
          borderBottom:'1px solid rgba(255,255,255,.85)', boxShadow:'0 1px 24px rgba(0,0,0,.05)' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg,${RED},#c01002)`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
            boxShadow:`0 4px 18px ${RED}45` }}>🐻</div>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:'#0a0a0f', lineHeight:1.1 }}>เฮงเฮงปังจัง</div>
            <div style={{ fontSize:9, fontWeight:700, color:RED, letterSpacing:'2.5px' }}>MERCHANT LOYALTY</div>
          </div>
        </Link>
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          {['หน้าแรก','ฟีเจอร์','วิธีทำงาน'].map(l => (
            <button key={l} style={{ padding:'8px 16px', borderRadius:9, border:'none', background:'transparent',
              fontSize:13, fontWeight:700, color:'#374151', fontFamily:"'Kanit',sans-serif", cursor:'pointer' }}>{l}</button>
          ))}
          <div style={{ width:1, height:20, background:'#E5E7EB', margin:'0 4px' }}/>
          <Link href="/login" style={{ padding:'8px 18px', borderRadius:9, border:'1.5px solid #E5E7EB',
            fontSize:13, fontWeight:700, color:'#374151', textDecoration:'none' }}>เข้าสู่ระบบ</Link>
          <Link href="/register" style={{ padding:'8px 20px', borderRadius:9,
            background:`linear-gradient(135deg,${RED},#c01002)`,
            fontSize:13, fontWeight:900, color:'#fff', textDecoration:'none',
            boxShadow:`0 4px 18px ${RED}40` }}>สมัครฟรี →</Link>
        </div>
      </motion.nav>

      {/* HERO */}
      <section style={{ position:'relative', zIndex:10, maxWidth:1060, margin:'0 auto',
        padding:'64px 40px 52px', display:'grid',
        gridTemplateColumns:'1fr 300px', gap:56, alignItems:'center' }}>
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'6px 16px',
              borderRadius:999, background:`${RED}12`, border:`1px solid ${RED}25`,
              fontSize:11, fontWeight:800, color:RED, letterSpacing:'2px', marginBottom:22 }}>
              <Zap size={10}/> B2B2C LOYALTY PLATFORM 2025
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{ fontSize:'clamp(2.8rem,5.5vw,4.2rem)', fontWeight:900,
            lineHeight:1.04, letterSpacing:'-2.5px', color:'#0a0a0f', margin:'0 0 18px' }}>
            ลูกค้าสแกน<br/>
            <span style={{ color:RED }}>ลุ้นรางวัล</span><br/>
            ร้านได้ด้วย
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize:15, fontWeight:300, color:'#6B7280',
            lineHeight:1.85, margin:'0 0 34px', maxWidth:420 }}>
            ระบบ <strong style={{ fontWeight:700, color:'#374151' }}>Double Reward</strong> เชื่อมซอสหมีปรุง ร้านอาหาร<br/>
            และลูกค้าในวงจรเดียว ผ่าน LINE OA
          </motion.p>

          <motion.div variants={fadeUp} style={{ display:'flex', gap:12, alignItems:'center' }}>
            <motion.div whileHover={{ scale:1.03, boxShadow:`0 14px 40px ${RED}55` }} whileTap={{ scale:.97 }}>
              <Link href="/register" style={{ display:'inline-flex', alignItems:'center', gap:8,
                padding:'15px 30px', borderRadius:13,
                background:`linear-gradient(135deg,${RED},#c01002)`,
                fontSize:15, fontWeight:900, color:'#fff', textDecoration:'none',
                boxShadow:`0 10px 32px ${RED}45` }}>
                สมัครร้านค้าฟรี <ArrowRight size={17}/>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}>
              <Link href="#how" style={{ display:'inline-flex', alignItems:'center', gap:8,
                padding:'15px 24px', borderRadius:13,
                border:'1.5px solid rgba(0,0,0,.11)',
                background:'rgba(255,255,255,.72)',
                fontSize:15, fontWeight:700, color:'#374151',
                textDecoration:'none', backdropFilter:'blur(8px)' }}>
                ดูวิธีทำงาน
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* WHEEL */}
        <motion.div initial={{ opacity:0, x:40, scale:.94 }} animate={{ opacity:1, x:0, scale:1 }}
          transition={{ duration:.8, delay:.2, ease:[0.22,1,0.36,1] }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {/* glow */}
            <div style={{ position:'absolute', width:290, height:290, borderRadius:'50%',
              background:`radial-gradient(circle,${RED}22,transparent 68%)` }}/>
            {/* ring */}
            <div style={{ position:'absolute', inset:-10, borderRadius:'50%',
              background:'rgba(255,255,255,.42)', backdropFilter:'blur(10px)',
              border:'2px solid rgba(255,255,255,.78)' }}/>
            {/* pointer */}
            <div style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', zIndex:5 }}>
              <svg width="24" height="30" viewBox="0 0 24 30">
                <polygon points="12,2 1,30 23,30" fill={RED}
                  style={{ filter:`drop-shadow(0 3px 10px ${RED}80)` }}/>
              </svg>
            </div>
            <SpinWheel/>
            {/* quota float */}
            <div style={{ position:'absolute', top:8, right:-38, background:'rgba(255,255,255,.88)',
              backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,.95)',
              borderRadius:13, padding:'9px 14px', boxShadow:'0 4px 18px rgba(0,0,0,.09)' }}>
              <div style={{ fontSize:10, color:'#9CA3AF', marginBottom:3 }}>สิทธิ์คงเหลือ</div>
              <div style={{ fontSize:15, fontWeight:900, color:RED }}>24 / 30</div>
              <div style={{ height:4, borderRadius:99, background:'#F3F4F6', marginTop:6, overflow:'hidden' }}>
                <div style={{ width:'80%', height:'100%', borderRadius:99,
                  background:`linear-gradient(90deg,${RED},#ff6b4a)` }}/>
              </div>
            </div>
          </div>
          <motion.button whileHover={{ scale:1.04, boxShadow:`0 14px 36px ${RED}55` }} whileTap={{ scale:.97 }}
            style={{ padding:'13px 36px', borderRadius:14,
              background:`linear-gradient(135deg,${RED},#c01002)`,
              fontSize:16, fontWeight:900, color:'#fff', border:'none',
              fontFamily:"'Kanit',sans-serif", cursor:'pointer',
              boxShadow:`0 10px 32px ${RED}50` }}>
            🎰 หมุนเลย!
          </motion.button>
          <div style={{ fontSize:11, fontWeight:400, color:'rgba(0,0,0,.3)' }}>1 สิทธิ์ต่อ 1 การสแกน QR</div>
        </motion.div>
      </section>

      {/* STATS */}
      <div style={{ position:'relative', zIndex:10, maxWidth:1060, margin:'0 auto 52px', padding:'0 40px',
        display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { n:'500+',    l:'ร้านค้าพาร์ทเนอร์', c:RED },
          { n:'50,000+', l:'ลูกค้าลุ้นแล้ว',    c:'#e8a820' },
          { n:'฿2M+',    l:'รางวัลที่แจกออกไป', c:'#10b981' },
        ].map((s,i) => (
          <motion.div key={s.l} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:i*.08, duration:.5 }}
            style={{ ...glass, padding:'22px 20px', borderRadius:16, textAlign:'center' }}>
            <div style={{ fontSize:28, fontWeight:900, color:s.c, lineHeight:1 }}>{s.n}</div>
            <div style={{ fontSize:12, fontWeight:400, color:'#9CA3AF', marginTop:5 }}>{s.l}</div>
          </motion.div>
        ))}
      </div>

      {/* HOW */}
      <div id="how" style={{ position:'relative', zIndex:10, maxWidth:1060, margin:'0 auto 52px', padding:'0 40px' }}>
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div style={{ display:'inline-block', padding:'5px 14px', borderRadius:999,
            background:`${RED}09`, border:`1px solid ${RED}20`,
            fontSize:10, fontWeight:800, color:RED, letterSpacing:'2.5px', marginBottom:12 }}>
            วิธีทำงาน
          </div>
          <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:900, color:'#0a0a0f',
            letterSpacing:'-1.2px', margin:'0 0 28px' }}>3 ขั้นตอนง่ายๆ</h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {HOW.map((h,i) => (
            <motion.div key={h.n} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*.1, duration:.5 }}>
              <motion.div whileHover={{ y:-4 }} style={{ ...glass, padding:'26px 22px', borderRadius:18, height:'100%' }}>
                <div style={{ width:38, height:38, borderRadius:11, display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:14, fontWeight:900, color:h.c,
                  background:h.bg, border:`1px solid ${h.bc}`, marginBottom:14 }}>{h.n}</div>
                <div style={{ fontSize:15, fontWeight:900, color:'#0a0a0f', marginBottom:7 }}>{h.title}</div>
                <div style={{ fontSize:12.5, fontWeight:300, color:'#6B7280', lineHeight:1.75 }}>{h.desc}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PRIZES */}
      <div style={{ position:'relative', zIndex:10, maxWidth:1060, margin:'0 auto 52px', padding:'0 40px' }}>
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div style={{ display:'inline-block', padding:'5px 14px', borderRadius:999,
            background:`${RED}09`, border:`1px solid ${RED}20`,
            fontSize:10, fontWeight:800, color:RED, letterSpacing:'2.5px', marginBottom:12 }}>
            รางวัลที่ลุ้นได้
          </div>
          <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:900, color:'#0a0a0f',
            letterSpacing:'-1.2px', margin:'0 0 28px' }}>Instant Win 4 ประเภท</h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {PRIZES.map((p,i) => (
            <motion.div key={p.name} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*.08, duration:.5 }}>
              <motion.div whileHover={{ y:-5, boxShadow:'0 20px 50px rgba(0,0,0,.1)' }}
                style={{ ...glass, padding:'22px 18px', borderRadius:18, textAlign:'center', transition:'box-shadow .3s' }}>
                <div style={{ fontSize:32, marginBottom:10 }}>{p.e}</div>
                <div style={{ fontSize:14, fontWeight:900, color:'#0a0a0f', marginBottom:5 }}>{p.name}</div>
                <div style={{ fontSize:11, fontWeight:300, color:'#9CA3AF', marginBottom:10 }}>{p.desc}</div>
                <div style={{ display:'inline-block', padding:'4px 12px', borderRadius:999,
                  background:p.bg, border:`1px solid ${p.bc}`,
                  fontSize:11, fontWeight:700, color:p.tc }}>{p.pct}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position:'relative', zIndex:10, maxWidth:580, margin:'0 auto', padding:'0 40px 72px', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, scale:.96 }} whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true }} transition={{ duration:.7, ease:[0.22,1,0.36,1] }}
          style={{ ...glass, padding:'48px 40px', borderRadius:24, boxShadow:`0 28px 72px ${RED}11` }}>
          <motion.div animate={{ rotate:[0,10,-8,10,0] }} transition={{ delay:.4, duration:.8 }}
            style={{ fontSize:48, marginBottom:14 }}>🐻</motion.div>
          <h2 style={{ fontSize:26, fontWeight:900, color:'#0a0a0f', letterSpacing:'-1px', margin:'0 0 10px' }}>
            เริ่มต้นวันนี้ ฟรี!
          </h2>
          <p style={{ fontSize:14, fontWeight:300, color:'#6B7280', margin:'0 0 26px', lineHeight:1.8 }}>
            สมัครร้านค้า ออก QR Code แรก<br/>เริ่มสร้าง loyalty ให้ลูกค้าได้เลย
          </p>
          <motion.div whileHover={{ scale:1.03, boxShadow:`0 16px 48px ${RED}55` }} whileTap={{ scale:.97 }}>
            <Link href="/register" style={{ display:'inline-flex', alignItems:'center', gap:10,
              padding:'15px 40px', borderRadius:16,
              background:`linear-gradient(135deg,${RED},#c01002)`,
              fontSize:16, fontWeight:900, color:'#fff', textDecoration:'none',
              boxShadow:`0 8px 32px ${RED}45` }}>
              สมัครร้านค้าฟรี <ArrowRight size={20}/>
            </Link>
          </motion.div>
          <p style={{ fontSize:11, fontWeight:400, color:'#9CA3AF', marginTop:14 }}>
            ไม่มีค่าใช้จ่าย · ไม่ต้องใช้บัตรเครดิต
          </p>
        </motion.div>
      </div>

      <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 24px 28px',
        fontSize:11, fontWeight:400, color:'rgba(0,0,0,.28)' }}>
        © 2025 เฮงเฮงปังจัง.com · Powered by หมีปรุง Global Foods
      </div>
    </div>
  )
}
