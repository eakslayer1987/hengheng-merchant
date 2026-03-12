'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { QrCode, Store, Users, Gift, ShieldCheck, Zap, ArrowRight, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const RED = '#fd1803'

/* ── Text Reveal: word by word ── */
function TextReveal({ text, tag='p', style={}, delay=0, stagger=0.06 }:
  { text:string; tag?:'h1'|'h2'|'h3'|'p'; style?:React.CSSProperties; delay?:number; stagger?:number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-8% 0px' })
  const Tag = tag as any
  return (
    <Tag ref={ref} style={{ display:'flex', flexWrap:'wrap', gap:'.22em', ...style }}>
      {text.split(' ').map((w,i) => (
        <span key={i} style={{ overflow:'hidden', display:'inline-block' }}>
          <motion.span style={{ display:'inline-block' }}
            initial={{ y:'110%', opacity:0 }}
            animate={inView ? { y:'0%', opacity:1 } : {}}
            transition={{ duration:.65, delay: delay + i*stagger, ease:[0.22,1,0.36,1] }}>
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ── Magnetic Button ── */
function MagBtn({ children, href, style={} }: { children:React.ReactNode; href:string; style?:React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <a ref={ref} href={href}
      onMouseMove={e => {
        const r = ref.current!.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width/2)  * .28
        const y = (e.clientY - r.top  - r.height/2) * .28
        ref.current!.style.transform = `translate(${x}px,${y}px) scale(1.04)`
      }}
      onMouseLeave={() => { ref.current!.style.transform = 'translate(0,0) scale(1)' }}
      style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none',
        transition:'transform .3s cubic-bezier(.22,1,.36,1)', ...style }}>
      {children}
    </a>
  )
}

/* ── Fade up on scroll ── */
function FadeUp({ children, delay=0, style={} }: { children:React.ReactNode; delay?:number; style?:React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-6% 0px' })
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity:0, y:32 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:.65, delay, ease:[0.22,1,0.36,1] }}>
      {children}
    </motion.div>
  )
}

const stats = [
  { n:'2,500+', l:'ร้านค้าพาร์ทเนอร์' },
  { n:'50,000+', l:'QR Code ที่ออก' },
  { n:'1.2M+', l:'แต้มสะสม' },
  { n:'98%', l:'ความพึงพอใจ' },
]
const steps = [
  { icon:Store,  t:'ซื้อซอสเฮงเฮงปังจัง',     d:'ทุกกล่องมี QR / รหัสหลังฝา' },
  { icon:QrCode, t:'สแกนรับแต้ม CRM',         d:'แต้มเข้า LINE OA ทันที' },
  { icon:Gift,   t:'ตั้งสแตนดี้ QR บนโต๊ะ',   d:'แบรนด์ส่งป้ายฝัง Shop ID ให้' },
  { icon:Zap,    t:'ลูกค้าถูก → ร้านได้ด้วย!', d:'Double Reward แจ้ง LINE ทันที' },
]
const features = [
  { icon:QrCode,      t:'Unique QR Code',   d:'ป้องกันปลอมแปลง 100%' },
  { icon:Gift,        t:'Gamification',     d:'หมุนวงล้อ / เปิดกล่องสุ่ม' },
  { icon:Zap,         t:'Double Reward',    d:'ร้านได้รางวัลพร้อมลูกค้า' },
  { icon:Users,       t:'Relationship Map', d:'จับคู่ลูกค้า↔ร้านได้เป๊ะ' },
  { icon:ShieldCheck, t:'Fraud Prevention', d:'GPS + 1 เบอร์/วัน' },
  { icon:Store,       t:'LINE OA / LIFF',   d:'ไม่ต้องโหลดแอปเพิ่ม' },
]

export default function Home() {
  return (
    <>
      <Navbar/>
      <main>

        {/* ══ HERO ══ */}
        <section style={{ minHeight:'96vh', display:'flex', alignItems:'center',
          padding:'100px 24px 80px', maxWidth:1200, margin:'0 auto', position:'relative' }}>
          <div style={{ maxWidth:700 }}>

            <FadeUp>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:24,
                background:`${RED}0e`, border:`1px solid ${RED}28`,
                borderRadius:999, padding:'6px 16px' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:RED,
                  display:'block', boxShadow:`0 0 8px ${RED}` }}/>
                <span style={{ fontSize:11, fontWeight:800, color:RED, letterSpacing:3, textTransform:'uppercase' }}>
                  B2B2C Loyalty Platform 2025
                </span>
              </div>
            </FadeUp>

            <TextReveal text="ลูกค้าถูกรางวัล" tag="h1" delay={0.1} stagger={0.08}
              style={{ fontSize:'clamp(2.8rem,8vw,5rem)', fontWeight:900,
                letterSpacing:'-2px', color:'#0a0a0f', margin:0, lineHeight:1.05 }}/>
            <TextReveal text="ร้านค้าได้ด้วย" tag="h1" delay={0.3} stagger={0.08}
              style={{ fontSize:'clamp(2.8rem,8vw,5rem)', fontWeight:900,
                letterSpacing:'-2px', color:RED, margin:0, lineHeight:1.05 }}/>
            <TextReveal text="พร้อมกันทันที" tag="h1" delay={0.5} stagger={0.08}
              style={{ fontSize:'clamp(2.8rem,8vw,5rem)', fontWeight:900,
                letterSpacing:'-2px', color:'#0a0a0f', margin:'0 0 24px', lineHeight:1.05 }}/>

            <TextReveal text="ระบบ Double Reward เชื่อมซอสเฮงเฮงปังจัง ร้านอาหาร และลูกค้า ในวงจรเดียว ผ่าน LINE OA"
              tag="p" delay={0.7} stagger={0.025}
              style={{ fontSize:18, fontWeight:400, color:'#374151', lineHeight:1.8,
                maxWidth:520, marginBottom:36 }}/>

            <FadeUp delay={0.9} style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <MagBtn href="/register" style={{
                padding:'15px 32px', borderRadius:16,
                background:`linear-gradient(135deg,${RED},#c01002)`,
                color:'#fff', fontSize:16, fontWeight:900,
                boxShadow:`0 8px 32px ${RED}45`,
              }}>สมัครร้านค้าฟรี <ArrowRight size={18}/></MagBtn>

              <MagBtn href="#how" style={{
                padding:'14px 26px', borderRadius:16,
                border:'1.5px solid rgba(0,0,0,.12)',
                background:'rgba(255,255,255,.65)',
                backdropFilter:'blur(12px)',
                color:'#374151', fontSize:15, fontWeight:700,
              }}>ดูวิธีทำงาน <ChevronRight size={16}/></MagBtn>
            </FadeUp>
          </div>

          {/* Hero floating cards */}
          <div style={{ position:'absolute', right:40, top:'50%', transform:'translateY(-50%)',
            display:'flex', flexDirection:'column', gap:14 }} className="hidden xl:flex">
            <motion.div animate={{ y:[0,-12,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}>
              <div className="glass-card" style={{ padding:20, width:220 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10,
                    background:`${RED}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Store size={18} color={RED}/>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:800 }}>ร้านกะเพราป้าแดง</div>
                    <div style={{ fontSize:10, color:'#9CA3AF' }}>Merchant Account</div>
                  </div>
                </div>
                <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0',
                  borderRadius:12, padding:10, textAlign:'center' }}>
                  <div style={{ fontSize:13, fontWeight:900, color:'#16A34A' }}>🎉 ได้รางวัลด้วย!</div>
                  <div style={{ fontSize:10, color:'#15803D', marginTop:2 }}>ซอสฟรี 1 ลัง ฿480</div>
                </div>
              </div>
            </motion.div>
            <motion.div animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut', delay:.6 }}>
              <div className="glass-card" style={{ padding:20, width:220 }}>
                <div style={{ textAlign:'center', marginBottom:10 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:'#9CA3AF' }}>ลูกค้าสแกน QR</div>
                </div>
                <div style={{ background:`linear-gradient(135deg,${RED},#c01002)`,
                  borderRadius:12, padding:14, textAlign:'center' }}>
                  <div style={{ fontSize:22 }}>🎰</div>
                  <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>ถูกรางวัล!</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.7)', marginTop:2 }}>กินฟรีมื้อนี้</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ STATS BAR ══ */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,.5)',
          borderBottom:'1px solid rgba(255,255,255,.5)' }}
          className="glass-surface">
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'20px 24px',
            display:'flex', flexWrap:'wrap', gap:36, alignItems:'center' }}>
            <span style={{ fontSize:10, fontWeight:800, color:'#D1D5DB',
              letterSpacing:4, textTransform:'uppercase' }}>เชื่อใจโดย</span>
            {stats.map(({ n, l }, i) => (
              <FadeUp key={l} delay={i * .07}>
                <div style={{ fontSize:22, fontWeight:900, color:'#111' }}>{n}</div>
                <div style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>{l}</div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how" style={{ padding:'96px 24px', maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <FadeUp>
              <div style={{ fontSize:11, fontWeight:800, color:RED,
                letterSpacing:4, textTransform:'uppercase', marginBottom:12 }}>วิธีทำงาน</div>
            </FadeUp>
            <TextReveal text="Double Reward Flow" tag="h2" delay={.1} stagger={.07}
              style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:900,
                justifyContent:'center', color:'#0a0a0f', margin:'0 0 12px' }}/>
            <TextReveal text="ลูกค้าถูกรางวัล ร้านได้พร้อมกันทันทีในระบบเดียว" tag="p" delay={.3}
              style={{ fontSize:16, color:'#9CA3AF', justifyContent:'center', fontWeight:400 }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {steps.map(({ icon:Icon, t, d }, i) => (
              <FadeUp key={t} delay={i * .1}>
                <div className="glass-card" style={{ padding:24, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
                    background:`linear-gradient(90deg,${RED},${RED}30)`, borderRadius:'28px 28px 0 0' }}/>
                  <div style={{ position:'absolute', top:16, right:16, width:28, height:28,
                    borderRadius:8, background:`${RED}0e`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:13, fontWeight:900, color:`${RED}80` }}>{i+1}</div>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${RED}0f`,
                    display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    <Icon size={20} color={RED}/>
                  </div>
                  <div style={{ fontSize:15, fontWeight:900, marginBottom:6 }}>{t}</div>
                  <div style={{ fontSize:13, color:'#9CA3AF', lineHeight:1.65 }}>{d}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" style={{ padding:'96px 24px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:60 }}>
              <FadeUp>
                <div style={{ fontSize:11, fontWeight:800, color:RED,
                  letterSpacing:4, textTransform:'uppercase', marginBottom:12 }}>ฟีเจอร์</div>
              </FadeUp>
              <TextReveal text="ระบบครบวงจร" tag="h2" delay={.1} stagger={.1}
                style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:900,
                  justifyContent:'center', color:'#0a0a0f', margin:'0 0 12px' }}/>
              <TextReveal text="ทุกเครื่องมือที่แบรนด์และร้านค้าต้องการ ในแดชบอร์ดเดียว" tag="p" delay={.3}
                style={{ fontSize:16, color:'#9CA3AF', justifyContent:'center', fontWeight:400 }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:14 }}>
              {features.map(({ icon:Icon, t, d }, i) => (
                <FadeUp key={t} delay={i * .07}>
                  <div className="glass-card" style={{ padding:'24px 20px', transition:'transform .25s',
                    cursor:'default' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${RED}0f`,
                      display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                      <Icon size={20} color={RED}/>
                    </div>
                    <div style={{ fontSize:14, fontWeight:900, marginBottom:6 }}>{t}</div>
                    <div style={{ fontSize:12, color:'#9CA3AF', lineHeight:1.65 }}>{d}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section style={{ padding:'96px 24px', textAlign:'center',
          background:'linear-gradient(160deg,#0a0a0f,#1C1C2E)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)',
            width:700, height:400, borderRadius:'50%',
            background:`radial-gradient(circle,${RED}18,transparent 70%)`,
            filter:'blur(60px)', pointerEvents:'none' }}/>
          <div style={{ maxWidth:600, margin:'0 auto', position:'relative' }}>
            <TextReveal text="พร้อมสร้าง Double Reward ให้ร้านคุณแล้วหรือยัง?" tag="h2"
              delay={.1} stagger={.04}
              style={{ fontSize:'clamp(1.8rem,5vw,2.8rem)', fontWeight:900, color:'#fff',
                justifyContent:'center', lineHeight:1.2, margin:'0 0 16px' }}/>
            <TextReveal text="สมัครฟรี ไม่ต้องใส่บัตรเครดิต เริ่มออก QR Code ได้ใน 15 นาที" tag="p"
              delay={.5}
              style={{ fontSize:15, color:'rgba(255,255,255,.45)', justifyContent:'center',
                fontWeight:400, margin:'0 0 36px' }}/>
            <FadeUp delay={.7} style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
              <MagBtn href="/register" style={{
                padding:'15px 36px', borderRadius:16,
                background:`linear-gradient(135deg,${RED},#c01002)`,
                color:'#fff', fontSize:16, fontWeight:900,
                boxShadow:`0 8px 32px ${RED}55`,
              }}>สมัครร้านค้าฟรี <ArrowRight size={18}/></MagBtn>
              <MagBtn href="https://line.me" style={{
                padding:'14px 26px', borderRadius:16,
                border:'1.5px solid rgba(255,255,255,.2)',
                background:'rgba(255,255,255,.06)',
                color:'rgba(255,255,255,.75)', fontSize:15, fontWeight:700,
              }}>นัดผู้เชี่ยวชาญ <ChevronRight size={16}/></MagBtn>
            </FadeUp>
          </div>
        </section>

      </main>
      <Footer/>
    </>
  )
}
