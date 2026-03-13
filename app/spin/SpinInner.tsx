'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Zap } from 'lucide-react'
import { apiFetch, type SpinResult, type PrizeItem } from '@/lib/api'

const RED = '#fd1803'

const DEFAULT_PRIZES: PrizeItem[] = [
  { id:1, name:'ส่วนลด 10 บาท', type:'discount',  value:10, color:'#fd1803', probability:.55 },
  { id:2, name:'ทานฟรีมื้อนี้', type:'free_meal', value:1,  color:'#e8a820', probability:.10 },
  { id:3, name:'50 คะแนน',      type:'points',    value:50, color:'#10b981', probability:.15 },
  { id:4, name:'ลองโชคใหม่',   type:'no_prize',  value:0,  color:'#94a3b8', probability:.20 },
]

function easeOut(t: number): number { return 1 - Math.pow(1-t, 4) }

function drawWheel(canvas: HTMLCanvasElement, prizes: PrizeItem[], rotation: number) {
  const ctx = canvas.getContext('2d'); if (!ctx) return
  const cx = canvas.width/2, cy = canvas.height/2, r = cx - 8
  const arc = (2*Math.PI)/prizes.length
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  prizes.forEach((p, i) => {
    const start = rotation + i*arc, end = start + arc
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath()
    ctx.fillStyle = p.color; ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2.5; ctx.stroke()
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + arc/2)
    ctx.textAlign = 'right'; ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px Kanit, sans-serif'
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 5
    ctx.fillText(p.name, r-12, 5); ctx.restore()
  })
  // center hub
  const hub = ctx.createRadialGradient(cx-3, cy-3, 2, cx, cy, 24)
  hub.addColorStop(0,'#fff'); hub.addColorStop(1,'#f0f0f0')
  ctx.beginPath(); ctx.arc(cx, cy, 24, 0, 2*Math.PI)
  ctx.fillStyle = hub; ctx.fill()
  ctx.strokeStyle = `${RED}40`; ctx.lineWidth = 2; ctx.stroke()
  ctx.font = '19px sans-serif'; ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'; ctx.shadowBlur = 0
  ctx.fillText('🐻', cx, cy)
}

export default function SpinInner() {
  const params   = useSearchParams()
  const router   = useRouter()
  const qrId     = params.get('qr') ?? ''
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const rotRef    = useRef<number>(0)
  const [prizes,   setPrizes]   = useState<PrizeItem[]>(DEFAULT_PRIZES)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [hasSpun,  setHasSpun]  = useState(false)
  const [result,   setResult]   = useState<SpinResult | null>(null)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => { rotRef.current = rotation }, [rotation])
  useEffect(() => {
    apiFetch<PrizeItem[]>('/prize/catalog.php')
      .then(d => { if (d.length) setPrizes(d) }).catch(()=>{}).finally(()=>setLoading(false))
  }, [])
  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    drawWheel(c, prizes, rotation)
  }, [rotation, prizes])

  const doSpin = useCallback(async () => {
    if (spinning || hasSpun) return
    const token = localStorage.getItem('hh_token')
    if (!token) { router.push(`/scan/${qrId}`); return }
    setSpinning(true); setError('')
    try {
      const data = await apiFetch<SpinResult>('/qr/spin.php', {
        method:'POST',
        headers:{ Authorization:`Bearer ${token}` },
        body: JSON.stringify({ qr_id: qrId }),
      })
      const idx = prizes.findIndex(p => p.id === data.prize_id)
      const winIdx = idx >= 0 ? idx : 0
      const arc = (2*Math.PI)/prizes.length
      const target = -(winIdx*arc + arc/2) - Math.PI/2 + 5*2*Math.PI
      const duration = 4800, startTime = performance.now(), startRot = rotRef.current
      const tick = (now: number) => {
        const t = Math.min((now-startTime)/duration, 1)
        setRotation(startRot + easeOut(t)*(target-startRot))
        if (t < 1) { rafRef.current = requestAnimationFrame(tick) }
        else {
          setSpinning(false); setHasSpun(true); setResult(data)
          setTimeout(() => { localStorage.setItem('hh_result', JSON.stringify(data)); router.push('/result') }, 1400)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด'); setSpinning(false)
    }
  }, [spinning, hasSpun, prizes, qrId, router])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="glass-card" style={{ padding:48, textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:18, background:`linear-gradient(135deg,${RED},#c01002)`,
          display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px',
          boxShadow:`0 8px 32px ${RED}55` }}>
          <Loader2 className="animate-spin" color="#fff" size={28}/>
        </div>
        <p style={{ fontWeight:600, color:'#6B7280' }}>กำลังเตรียมวงล้อ…</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', overflow:'hidden', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px' }}>

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

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:380 }}>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>

          {/* Header */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
            style={{ textAlign:'center' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 16px',
              borderRadius:999, background:'rgba(255,255,255,0.85)', border:`1px solid ${RED}30`,
              fontSize:11, fontWeight:800, color:RED, backdropFilter:'blur(12px)', letterSpacing:1 }}>
              <Zap size={11}/> INSTANT WIN
            </span>
            <h1 style={{ fontSize:'clamp(1.8rem,7vw,2.4rem)', fontWeight:900, color:'#0a0a0f',
              lineHeight:1, marginTop:10, marginBottom:4 }}>หมุนวงล้อลุ้นโชค!</h1>
            <p style={{ fontSize:13, color:'#6B7280', fontWeight:500 }}>1 สิทธิ์ต่อ 1 การสแกน</p>
          </motion.div>

          {/* Wheel */}
          <motion.div initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:.6, ease:[0.22,1,0.36,1], delay:.1 }}
            style={{ position:'relative' }}>
            {/* pointer */}
            <div style={{ position:'absolute', top:-2, left:'50%', transform:'translateX(-50%)', zIndex:10 }}>
              <div style={{ width:0, height:0,
                borderLeft:'12px solid transparent', borderRight:'12px solid transparent',
                borderTop:`26px solid ${RED}`,
                filter:`drop-shadow(0 3px 6px ${RED}70)` }}/>
            </div>
            {/* outer ring */}
            <div style={{ position:'absolute', inset:-10, borderRadius:'50%',
              background:'rgba(255,255,255,0.4)', backdropFilter:'blur(8px)',
              border:'1.5px solid rgba(255,255,255,.7)' }}/>
            <motion.canvas ref={canvasRef} width={300} height={300}
              animate={{ boxShadow: spinning
                ? [`0 0 0 4px ${RED}30, 0 20px 60px ${RED}40`, `0 0 0 6px ${RED}50, 0 24px 70px ${RED}55`]
                : `0 12px 40px rgba(0,0,0,.15)` }}
              transition={{ repeat: spinning ? Infinity : 0, duration:.8, repeatType:'reverse' }}
              style={{ borderRadius:'50%', position:'relative', zIndex:1, cursor: !spinning && !hasSpun ? 'pointer':'default' }}
              onClick={!spinning && !hasSpun ? doSpin : undefined}/>
          </motion.div>

          {/* Spin button */}
          {!hasSpun && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }} style={{ width:'100%' }}>
              <motion.button onClick={doSpin} disabled={spinning}
                whileHover={!spinning ? { scale:1.02, boxShadow:`0 14px 42px ${RED}55` } : {}}
                whileTap={!spinning ? { scale:.98 } : {}}
                style={{ width:'100%', height:54, borderRadius:16, border:'none',
                  background: spinning ? '#f3f4f6' : `linear-gradient(135deg,${RED},#c01002)`,
                  color: spinning ? '#9CA3AF':'#fff', fontSize:17, fontWeight:900,
                  cursor: spinning ? 'not-allowed':'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center', gap:8,
                  boxShadow: spinning ? 'none' : `0 8px 32px ${RED}45`, transition:'background .2s' }}>
                {spinning ? <><Loader2 size={18} className="animate-spin"/> กำลังหมุน…</> : '🎰 หมุนเลย!'}
              </motion.button>
            </motion.div>
          )}

          {/* Legend */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
            className="glass-card" style={{ padding:'16px 20px', width:'100%' }}>
            <p style={{ fontSize:10, fontWeight:800, color:'#9CA3AF', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>รางวัลที่ลุ้นได้</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {prizes.map(p => (
                <div key={p.id} className="glass-surface" style={{ borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', flexShrink:0, background:p.color }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:'#374151' }}>{p.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {error && (
            <div style={{ width:'100%', padding:'10px 16px', borderRadius:12, textAlign:'center',
              background:`${RED}10`, border:`1px solid ${RED}25`, fontSize:13, fontWeight:700, color:RED }}>
              ⚠️ {error}
            </div>
          )}

          {result && <p style={{ fontSize:13, color:'#9CA3AF', fontWeight:500 }} className="animate-pulse">กำลังไปหน้าผลรางวัล…</p>}
        </motion.div>
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
