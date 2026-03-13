'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Home, Ticket, Copy, Check, RotateCcw } from 'lucide-react'
import { type SpinResult } from '@/lib/api'

const RED = '#fd1803'

interface Particle { x:number; y:number; vx:number; vy:number; color:string; size:number; rotation:number; vr:number; life:number }
const COLORS = ['#fd1803','#e8a820','#10b981','#3b82f6','#8b5cf6','#f59e0b','#ec4899']

function useConfetti(active: boolean, ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    if (!active) return
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const sc = canvas, sx = ctx
    const particles: Particle[] = Array.from({ length:150 }, () => ({
      x: Math.random()*sc.width, y:-20,
      vx:(Math.random()-.5)*8, vy:Math.random()*5+2,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      size:Math.random()*10+4, rotation:Math.random()*360,
      vr:(Math.random()-.5)*12, life:1,
    }))
    let raf = 0
    const draw = () => {
      sx.clearRect(0, 0, sc.width, sc.height)
      for (let i = particles.length-1; i>=0; i--) {
        const p = particles[i]
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.1; p.rotation+=p.vr; p.life-=0.006
        if (p.life<=0) { particles.splice(i,1); continue }
        sx.save(); sx.translate(p.x,p.y); sx.rotate(p.rotation*Math.PI/180)
        sx.globalAlpha=p.life; sx.fillStyle=p.color
        sx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2); sx.restore()
      }
      if (particles.length>0) raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [active, ref])
}

const CFG = {
  discount: { e:'🏷️', g:`linear-gradient(135deg,${RED},#ff4d2e)`, s:`0 20px 60px ${RED}50`, title:(v:number)=>`ส่วนลด ${v} บาท!`, desc:'นำโค้ดไปลดราคาซอสหมีปรุงได้เลย', bg:`${RED}08`, bc:`${RED}20`, tc:`#c01002` },
  free_meal: { e:'🍛', g:'linear-gradient(135deg,#e8a820,#f59e0b)', s:'0 20px 60px rgba(232,168,32,.5)', title:()=>'ทานฟรีมื้อนี้!', desc:'แสดงหน้าจอนี้ให้พนักงานแคชเชียร์', bg:'rgba(232,168,32,.08)', bc:'rgba(232,168,32,.25)', tc:'#92660a' },
  points:    { e:'⭐', g:'linear-gradient(135deg,#10b981,#059669)', s:'0 20px 60px rgba(16,185,129,.45)', title:(v:number)=>`+${v} คะแนน!`, desc:'สะสมคะแนนแลกของพรีเมียมได้เลย', bg:'rgba(16,185,129,.08)', bc:'rgba(16,185,129,.25)', tc:'#065f46' },
  no_prize:  { e:'🎲', g:'linear-gradient(135deg,#64748b,#475569)', s:'0 20px 60px rgba(100,116,139,.3)', title:()=>'ลองโชคใหม่!', desc:'ยังมีสิทธิ์ลุ้นโชคใหญ่อยู่นะครับ', bg:'rgba(100,116,139,.07)', bc:'rgba(100,116,139,.18)', tc:'#334155' },
} as const

export default function ResultPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [copied, setCopied]  = useState(false)
  const [shown,  setShown]   = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('hh_result')
    if (!raw) { router.replace('/'); return }
    setResult(JSON.parse(raw) as SpinResult)
    setTimeout(() => setShown(true), 80)
  }, [router])

  const isWin = result?.prize_type !== 'no_prize'
  useConfetti(isWin && shown, canvasRef as React.RefObject<HTMLCanvasElement | null>)

  if (!result) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="glass-card" style={{ padding:48, textAlign:'center' }}>
        <p style={{ color:'#9CA3AF', fontWeight:600 }}>กำลังโหลด…</p>
      </div>
    </div>
  )

  const c = CFG[result.prize_type]

  async function copy() {
    if (!result?.code_id) return
    await navigator.clipboard.writeText(result.code_id)
    setCopied(true); setTimeout(()=>setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight:'100vh', overflow:'hidden', position:'relative',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px' }}>

      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:50 }}/>

      {/* Thai flag bg */}
      <div style={{ position:'fixed', inset:0, zIndex:0,
        background:`
          radial-gradient(ellipse 60% 90% at -5% 50%, rgba(220,10,10,.82) 0%, rgba(185,5,5,.45) 35%, transparent 62%),
          radial-gradient(ellipse 50% 80% at 105% 50%, rgba(22,55,170,.78) 0%, rgba(15,40,130,.42) 35%, transparent 62%),
          radial-gradient(ellipse 55% 50% at 50% 50%, rgba(255,255,255,1) 0%, #eaeaf4 100%)
        ` }}/>
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:`radial-gradient(ellipse 40% 55% at 50% 50%, rgba(255,255,255,.6) 0%, transparent 65%)`,
        animation:'thaiRay 9s ease-in-out infinite alternate' }}/>

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:400,
        display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>

        {/* Brand */}
        <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px', borderRadius:999,
            background:'rgba(255,255,255,0.85)', border:`1px solid ${RED}30`, fontSize:11,
            fontWeight:800, color:RED, backdropFilter:'blur(12px)', letterSpacing:1 }}>
            🐻 เฮงเฮงปังจัง
          </span>
        </motion.div>

        {/* Prize card */}
        <motion.div className="glass-card" style={{ width:'100%', textAlign:'center', padding:'32px 24px', boxShadow:c.s }}
          initial={{ opacity:0, scale:.88, y:28 }} animate={{ opacity:1, scale:1, y:0 }}
          transition={{ duration:.7, ease:[0.22,1,0.36,1] }}>

          {/* Icon */}
          <motion.div initial={{ scale:.3, rotate:-20 }} animate={{ scale:1, rotate:0 }}
            transition={{ type:'spring', bounce:.5, delay:.15 }}
            style={{ width:100, height:100, borderRadius:26, background:c.g,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:48,
              margin:'0 auto 20px', boxShadow:c.s }}>
            {c.e}
          </motion.div>

          {isWin
            ? <p style={{ fontSize:11, fontWeight:900, color:RED, letterSpacing:3, textTransform:'uppercase', marginBottom:6 }}>🎉 ยินดีด้วย!</p>
            : <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', letterSpacing:3, textTransform:'uppercase', marginBottom:6 }}>ผลการลุ้น</p>
          }
          <h1 style={{ fontSize:'clamp(1.8rem,7vw,2.4rem)', fontWeight:900, color:'#0a0a0f', lineHeight:1.1, marginBottom:8 }}>
            {c.title(result.prize_value)}
          </h1>
          <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.7, margin:0 }}>{c.desc}</p>

          {/* Code */}
          {(result.prize_type==='discount' || result.prize_type==='points') && result.code_id && (
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
              style={{ marginTop:20, padding:'14px 16px', borderRadius:16, background:c.bg, border:`1px solid ${c.bc}` }}>
              <p style={{ fontSize:11, fontWeight:800, color:c.tc, marginBottom:6, letterSpacing:1 }}>รหัสของคุณ</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                <code style={{ fontSize:20, fontWeight:900, color:'#0a0a0f', letterSpacing:'0.25em' }}>{result.code_id}</code>
                <button onClick={copy} style={{ width:32, height:32, borderRadius:10, border:'none', cursor:'pointer',
                  background:'rgba(255,255,255,.8)', display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 2px 8px rgba(0,0,0,.1)', transition:'all .15s' }}>
                  <AnimatePresence mode="wait">
                    {copied
                      ? <motion.span key="check" initial={{ scale:.5 }} animate={{ scale:1 }}><Check size={14} color="#10b981"/></motion.span>
                      : <motion.span key="copy"  initial={{ scale:.5 }} animate={{ scale:1 }}><Copy  size={14} color="#9CA3AF"/></motion.span>
                    }
                  </AnimatePresence>
                </button>
              </div>
              {copied && <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
                style={{ fontSize:11, color:'#10b981', fontWeight:700, marginTop:6 }}>คัดลอกแล้ว ✓</motion.p>}
            </motion.div>
          )}

          {/* Free meal */}
          {result.prize_type==='free_meal' && (
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
              style={{ marginTop:20, padding:'14px 16px', borderRadius:16, background:c.bg, border:`1px solid ${c.bc}` }}>
              <p style={{ fontSize:13, fontWeight:800, color:c.tc, marginBottom:4 }}>วิธีรับสิทธิ์</p>
              <p style={{ fontSize:12, color:c.tc, lineHeight:1.6, margin:0 }}>แสดงหน้าจอนี้ที่แคชเชียร์<br/>เพื่อรับสิทธิ์ทานฟรีได้เลย</p>
              <div style={{ marginTop:10, padding:'6px 14px', borderRadius:10, background:'rgba(255,255,255,.6)',
                fontSize:12, fontWeight:900, color:c.tc }}>REF: {result.code_id}</div>
            </motion.div>
          )}
        </motion.div>

        {/* Big prize ticket */}
        {result.big_prize_ticket && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}
            style={{ width:'100%', borderRadius:20, padding:'14px 18px', overflow:'hidden', position:'relative',
              background:'linear-gradient(135deg,#1a0800,#2d1200)', border:'1px solid rgba(232,168,32,.3)' }}>
            <div style={{ position:'absolute', inset:0, opacity:.08,
              backgroundImage:'repeating-linear-gradient(45deg,#e8a820 0,#e8a820 1px,transparent 0,transparent 50%)',
              backgroundSize:'7px 7px' }}/>
            <div style={{ position:'relative', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#e8a820,#d4900d)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🎟️</div>
              <div>
                <p style={{ fontSize:10, fontWeight:900, color:'#e8a820', letterSpacing:2, textTransform:'uppercase', margin:0 }}>ลุ้นโชคใหญ่</p>
                <p style={{ fontSize:15, fontWeight:900, color:'#fff', margin:'2px 0' }}>ได้รับ ticket แล้ว!</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,.45)', margin:0 }}>{result.big_prize_ticket}</p>
              </div>
              <Ticket size={20} color="#e8a820" style={{ marginLeft:'auto', flexShrink:0 }}/>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.45 }}
          style={{ width:'100%', display:'flex', flexDirection:'column', gap:10 }}>
          <motion.button
            whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
            onClick={() => {
              const t = encodeURIComponent(`ฉันได้รับ "${result.prize_name}" จากเฮงเฮงปังจัง! 🐻`)
              window.open(`https://social-plugins.line.me/lineit/share?text=${t}`)
            }}
            style={{ width:'100%', height:50, borderRadius:14, border:'2px solid #00B900', cursor:'pointer',
              background:'rgba(0,185,0,.07)', color:'#00B900', fontSize:14, fontWeight:900,
              display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .2s' }}>
            <Share2 size={15}/> แชร์ผลให้เพื่อนทาง LINE
          </motion.button>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
            onClick={() => router.push('/')}
            className="glass-surface"
            style={{ width:'100%', height:50, borderRadius:14, border:'none', cursor:'pointer',
              fontSize:14, fontWeight:800, color:'#374151',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .2s' }}>
            <Home size={15}/> กลับหน้าหลัก
          </motion.button>
        </motion.div>

        <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.6 }}
          onClick={() => router.push('/profile')}
          style={{ background:'none', border:'none', cursor:'pointer', display:'flex',
            alignItems:'center', gap:6, fontSize:12, color:'#9CA3AF', fontWeight:600 }}>
          <RotateCcw size={11}/> ดูประวัติสิทธิ์ทั้งหมด
        </motion.button>
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
