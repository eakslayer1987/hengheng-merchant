'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { QrCode, Store, Users, Gift, ShieldCheck, Zap, ArrowRight, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const RED = '#fd1803'

/* ─────────────────────────────────────────
   TEXT REVEAL  — splits sentence into words,
   each word slides up from a masked clip
───────────────────────────────────────── */
function TextReveal({
  text, tag = 'p', className = '', style = {}, delay = 0, staggerDelay = 0.06,
}: {
  text: string; tag?: 'h1'|'h2'|'h3'|'p'|'span'
  className?: string; style?: React.CSSProperties
  delay?: number; staggerDelay?: number
}) {
  const ref  = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const words  = text.split(' ')
  const Tag    = tag as any

  return (
    <Tag ref={ref} className={className}
      style={{ display:'flex', flexWrap:'wrap', gap:'0.22em', ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow:'hidden', display:'inline-block' }}>
          <motion.span
            style={{ display:'inline-block' }}
            initial={{ y:'110%', opacity:0 }}
            animate={inView ? { y:'0%', opacity:1 } : {}}
            transition={{ duration:.65, delay: delay + i * staggerDelay, ease:[0.22,1,0.36,1] }}>
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTON — follows cursor slightly
───────────────────────────────────────── */
function MagneticBtn({ children, href, style = {} }: { children: React.ReactNode; href: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current!
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.28
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.28
    el.style.transform = `translate(${x}px,${y}px) scale(1.04)`
  }
  const handleLeave = () => { ref.current!.style.transform = 'translate(0,0) scale(1)' }

  return (
    <a ref={ref} href={href}
      onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ display:'inline-flex', alignItems:'center', gap:8, transition:'transform .3s cubic-bezier(.22,1,.36,1)', textDecoration:'none', ...style }}>
      {children}
    </a>
  )
}

/* ─────────────────────────────────────────
   FADE UP — generic scroll reveal block
───────────────────────────────────────── */
function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-8% 0px' })
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity:0, y:36 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:.7, delay, ease:[0.22,1,0.36,1] }}>
      {children}
    </motion.div>
  )
}

/* ─── DATA ─── */
const stats = [
  { n:'2,500+', l:'ร้านค้าพาร์ทเนอร์' },
  { n:'50,000+', l:'QR Code ที่ออก' },
  { n:'1.2M+', l:'แต้มสะสม' },
  { n:'98%', l:'ความพึงพอใจ' },
]
const merchantFlow = [
  { icon:Store,   t:'ซื้อซอสเฮงเฮงปังจัง',       d:'ทุกกล่องมี QR / รหัสหลังฝา' },
  { icon:QrCode,  t:'สแกนรับแต้ม CRM',           d:'แต้มเข้า LINE OA ทันที' },
  { icon:Gift,    t:'ตั้งสแตนดี้ QR บนโต๊ะ',     d:'แบรนด์ส่งป้ายฝัง Shop ID ให้' },
  { icon:Zap,     t:'ลูกค้าถูก → ร้านได้ด้วย!',   d:'Double Reward แจ้ง LINE ทันที' },
]
const features = [
  { icon:QrCode,      t:'Unique QR Code',     d:'ป้องกันปลอมแปลง 100%' },
  { icon:Gift,        t:'Gamification',       d:'หมุนวงล้อ / เปิดกล่องสุ่ม' },
  { icon:Zap,         t:'Double Reward',      d:'ร้านได้รางวัลพร้อมลูกค้า' },
  { icon:Users,       t:'Relationship Map',   d:'จับคู่ลูกค้า↔ร้านได้เป๊ะ' },
  { icon:ShieldCheck, t:'Fraud Prevention',   d:'GPS + 1 เบอร์/วัน' },
  { icon:Store,       t:'LINE OA / LIFF',     d:'ไม่ต้องโหลดแอปเพิ่ม' },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily:"'Kanit','Sarabun',sans-serif", background:'#fff', color:'#111' }}>

        {/* ══════════════════════════════════
            HERO — full Text Reveal
        ══════════════════════════════════ */}
        <section style={{ minHeight:'96vh', display:'flex', alignItems:'center',
          padding:'120px 24px 80px', maxWidth:1200, margin:'0 auto',
          position:'relative' }}>

          {/* faint red circle */}
          <div style={{ position:'absolute', right:-100, top:'10%', width:560, height:560,
            borderRadius:'50%', background:`radial-gradient(circle,${RED}08,transparent 70%)`,
            pointerEvents:'none' }}/>

          <div style={{ maxWidth:720 }}>
            {/* eyebrow */}
            <FadeUp>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:24,
                background:`${RED}0f`, border:`1px solid ${RED}30`,
                borderRadius:999, padding:'6px 14px' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:RED,
                  display:'block', boxShadow:`0 0 6px ${RED}` }}/>
                <span style={{ fontSize:11, fontWeight:800, color:RED, letterSpacing:3, textTransform:'uppercase' }}>
                  B2B2C Loyalty Platform 2025
                </span>
              </div>
            </FadeUp>

            {/* Main headline — word-by-word reveal */}
            <TextReveal text="ลูกค้าถูกรางวัล" tag="h1" delay={0.1} staggerDelay={0.08}
              style={{ fontSize:72, fontWeight:900, lineHeight:1.05,
                letterSpacing:'-1px', color:'#0a0a0f', margin:0 }} />
            <TextReveal text="ร้านค้าได้ด้วย" tag="h1" delay={0.3} staggerDelay={0.08}
              style={{ fontSize:72, fontWeight:900, lineHeight:1.05,
                letterSpacing:'-1px', color:RED, margin:0 }} />
            <TextReveal text="พร้อมกันทันที" tag="h1" delay={0.5} staggerDelay={0.08}
              style={{ fontSize:72, fontWeight:900, lineHeight:1.05,
                letterSpacing:'-1px', color:'#0a0a0f', margin:'0 0 24px' }} />

            {/* Sub */}
            <TextReveal text="ระบบ Double Reward เชื่อมซอสเฮงเฮงปังจัง ร้านอาหาร และลูกค้า ในวงจรเดียว ผ่าน LINE OA"
              tag="p" delay={0.7} staggerDelay={0.025}
              style={{ fontSize:18, fontWeight:400, color:'#6B7280',
                lineHeight:1.7, maxWidth:520, marginBottom:36 }} />

            {/* CTA buttons with Magnetic effect */}
            <FadeUp delay={0.9} style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <MagneticBtn href="/register" style={{
                padding:'15px 32px', borderRadius:16,
                background:`linear-gradient(135deg,${RED},#c01002)`,
                color:'#fff', fontSize:16, fontWeight:900,
                boxShadow:`0 8px 32px ${RED}45`,
              }}>
                สมัครร้านค้าฟรี <ArrowRight size={18} />
              </MagneticBtn>
              <MagneticBtn href="#how" style={{
                padding:'15px 28px', borderRadius:16,
                border:'2px solid #E5E7EB', color:'#374151',
                fontSize:15, fontWeight:700, background:'#fff',
              }}>
                ดูวิธีทำงาน <ChevronRight size={16} />
              </MagneticBtn>
            </FadeUp>
          </div>

          {/* Hero floating cards (right) */}
          <div style={{ position:'absolute', right:40, top:'50%', transform:'translateY(-50%)',
            display:'none' /* hidden mobile */ }}>
            <motion.div animate={{ y:[0,-10,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}
              style={{ background:'#fff', borderRadius:20, padding:20, width:220,
                boxShadow:'0 20px 60px rgba(0,0,0,.10)', border:'1px solid #F0F0F6',
                marginBottom:16 }}>
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
              <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12,
                padding:'10px', textAlign:'center' }}>
                <div style={{ fontSize:13, fontWeight:900, color:'#16A34A' }}>🎉 ได้รางวัลด้วย!</div>
                <div style={{ fontSize:10, color:'#15803D', marginTop:2 }}>ซอสฟรี 1 ลัง ฿480</div>
              </div>
            </motion.div>
            <motion.div animate={{ y:[0,10,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut', delay:.5 }}
              style={{ background:'#fff', borderRadius:20, padding:20, width:220,
                boxShadow:'0 20px 60px rgba(0,0,0,.10)', border:'1px solid #F0F0F6' }}>
              <div style={{ textAlign:'center', marginBottom:8 }}>
                <div style={{ fontSize:11, fontWeight:800, color:'#9CA3AF' }}>ลูกค้าสแกน QR</div>
              </div>
              <div style={{ background:`linear-gradient(135deg,${RED},#c01002)`,
                borderRadius:12, padding:'12px', textAlign:'center' }}>
                <div style={{ fontSize:22 }}>🎰</div>
                <div style={{ fontSize:13, fontWeight:900, color:'#fff' }}>ถูกรางวัล!</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.7)', marginTop:2 }}>กินฟรีมื้อนี้</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ STATS BAR ══ */}
        <div style={{ borderTop:'1px solid #F0F0F6', borderBottom:'1px solid #F0F0F6',
          background:'#FAFAFA' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'20px 24px',
            display:'flex', flexWrap:'wrap', gap:32, alignItems:'center' }}>
            <span style={{ fontSize:10, fontWeight:800, color:'#D1D5DB',
              letterSpacing:4, textTransform:'uppercase' }}>เชื่อใจโดย</span>
            {stats.map(({ n, l }) => (
              <FadeUp key={l}>
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
            <TextReveal text="Double Reward Flow" tag="h2" delay={0.1} staggerDelay={0.07}
              style={{ fontSize:48, fontWeight:900, justifyContent:'center',
                color:'#0a0a0f', margin:'0 0 12px' }} />
            <TextReveal text="ลูกค้าถูกรางวัล ร้านได้พร้อมกันทันทีในระบบเดียว" tag="p" delay={0.3}
              style={{ fontSize:16, color:'#9CA3AF', justifyContent:'center', fontWeight:400 }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            {merchantFlow.map(({ icon: Icon, t, d }, i) => (
              <FadeUp key={t} delay={i * 0.1}>
                <div style={{ border:'1.5px solid #F0F0F6', borderRadius:20, padding:24,
                  background:'#fff', position:'relative', overflow:'hidden',
                  transition:'box-shadow .2s, border-color .2s' }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,.08)'
                    ;(e.currentTarget as HTMLDivElement).style.borderColor = `${RED}30`
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                    ;(e.currentTarget as HTMLDivElement).style.borderColor = '#F0F0F6'
                  }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
                    background:`linear-gradient(90deg,${RED},${RED}40)`, borderRadius:'20px 20px 0 0' }}/>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:`${RED}20`,
                    border:`2px solid ${RED}40`, display:'inline-flex', alignItems:'center',
                    justifyContent:'center', fontSize:11, fontWeight:900, color:RED,
                    padding:16, marginBottom:16 }}>
                    <Icon size={18} color={RED} />
                  </div>
                  <div style={{ fontSize:15, fontWeight:900, marginBottom:6 }}>{t}</div>
                  <div style={{ fontSize:13, color:'#9CA3AF', fontWeight:400, lineHeight:1.6 }}>{d}</div>
                  <div style={{ position:'absolute', top:16, right:16,
                    width:28, height:28, borderRadius:8, background:`${RED}08`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:13, fontWeight:900, color:`${RED}60` }}>{i+1}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" style={{ padding:'96px 24px', background:'#FAFAFA' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:60 }}>
              <FadeUp>
                <div style={{ fontSize:11, fontWeight:800, color:RED,
                  letterSpacing:4, textTransform:'uppercase', marginBottom:12 }}>ฟีเจอร์ทั้งหมด</div>
              </FadeUp>
              <TextReveal text="ระบบครบวงจร" tag="h2" delay={0.1} staggerDelay={0.1}
                style={{ fontSize:48, fontWeight:900, justifyContent:'center',
                  color:'#0a0a0f', margin:'0 0 12px' }} />
              <TextReveal text="ทุกเครื่องมือที่แบรนด์และร้านค้าต้องการ ในแดชบอร์ดเดียว" tag="p" delay={0.3}
                style={{ fontSize:16, color:'#9CA3AF', justifyContent:'center', fontWeight:400 }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:14 }}>
              {features.map(({ icon: Icon, t, d }, i) => (
                <FadeUp key={t} delay={i * 0.08}>
                  <div style={{ background:'#fff', border:'1.5px solid #F0F0F6',
                    borderRadius:20, padding:'24px 20px',
                    transition:'all .25s', cursor:'default' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = 'translateY(-4px)'
                      el.style.boxShadow = '0 12px 40px rgba(0,0,0,.08)'
                      el.style.borderColor = `${RED}25`
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = 'translateY(0)'
                      el.style.boxShadow = 'none'
                      el.style.borderColor = '#F0F0F6'
                    }}>
                    <div style={{ width:44, height:44, borderRadius:12,
                      background:`${RED}0f`, display:'flex',
                      alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                      <Icon size={20} color={RED}/>
                    </div>
                    <div style={{ fontSize:14, fontWeight:900, marginBottom:6 }}>{t}</div>
                    <div style={{ fontSize:12, color:'#9CA3AF', lineHeight:1.6 }}>{d}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section style={{ padding:'96px 24px', textAlign:'center',
          background:`linear-gradient(160deg,#0a0a0f,#1C1C2E)`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-100, left:'50%', transform:'translateX(-50%)',
            width:700, height:400, borderRadius:'50%',
            background:`radial-gradient(circle,${RED}20,transparent 70%)`,
            filter:'blur(60px)', pointerEvents:'none' }}/>
          <div style={{ maxWidth:600, margin:'0 auto', position:'relative' }}>
            <TextReveal text="พร้อมสร้าง Double Reward ให้ร้านคุณแล้วหรือยัง?" tag="h2" delay={0.1} staggerDelay={0.04}
              style={{ fontSize:44, fontWeight:900, color:'#fff', justifyContent:'center',
                lineHeight:1.2, margin:'0 0 16px' }} />
            <TextReveal text="สมัครฟรี ไม่ต้องใส่บัตรเครดิต เริ่มออก QR Code ได้ใน 15 นาที" tag="p" delay={0.5}
              style={{ fontSize:15, color:'rgba(255,255,255,.5)', justifyContent:'center',
                fontWeight:400, margin:'0 0 36px' }} />
            <FadeUp delay={0.7} style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
              <MagneticBtn href="/register" style={{
                padding:'16px 36px', borderRadius:16,
                background:`linear-gradient(135deg,${RED},#c01002)`,
                color:'#fff', fontSize:16, fontWeight:900,
                boxShadow:`0 8px 32px ${RED}55`,
              }}>
                สมัครร้านค้าฟรี <ArrowRight size={18}/>
              </MagneticBtn>
              <MagneticBtn href="https://line.me" style={{
                padding:'16px 28px', borderRadius:16,
                border:'1.5px solid rgba(255,255,255,.2)',
                color:'rgba(255,255,255,.8)', fontSize:15, fontWeight:700,
                background:'rgba(255,255,255,.06)',
              }}>
                นัดผู้เชี่ยวชาญ <ChevronRight size={16}/>
              </MagneticBtn>
            </FadeUp>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
