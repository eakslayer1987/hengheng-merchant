'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type SpinResult } from '@/lib/api'
import { Share2, Home, RotateCcw, Ticket, Copy, Check } from 'lucide-react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  color: string; size: number; rotation: number; vr: number; life: number
}

const CONFETTI_COLORS = ['#fd1803','#e8a820','#10b981','#3b82f6','#8b5cf6','#ec4899']

function useConfetti(active: boolean, canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        life: 1,
      })
    }

    // capture non-null refs for use inside draw
    const safeCtx = ctx
    const safeCanvas = canvas
    let raf = 0

    const draw = () => {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.12
        p.rotation += p.vr
        p.life -= 0.007
        if (p.life <= 0) { particles.splice(i, 1); continue }
        safeCtx.save()
        safeCtx.translate(p.x, p.y)
        safeCtx.rotate((p.rotation * Math.PI) / 180)
        safeCtx.globalAlpha = p.life
        safeCtx.fillStyle = p.color
        safeCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        safeCtx.restore()
      }
      if (particles.length > 0) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [active, canvasRef])
}

const PRIZE_CONFIG = {
  discount: {
    emoji: '🏷️',
    gradient: 'linear-gradient(135deg,#fd1803,#ff6b4a)',
    shadow: '0 20px 60px rgba(253,24,3,0.35)',
    title: (v: number) => `ส่วนลด ${v} บาท!`,
    desc: 'นำโค้ดนี้ไปลดราคาซอสหมีปรุงได้เลย',
    bg: 'bg-red-50',
  },
  free_meal: {
    emoji: '🍛',
    gradient: 'linear-gradient(135deg,#e8a820,#f59e0b)',
    shadow: '0 20px 60px rgba(232,168,32,0.35)',
    title: () => 'ทานฟรีมื้อนี้!',
    desc: 'แจ้งพนักงานเพื่อรับสิทธิ์ทานฟรีมื้อนี้ได้เลย',
    bg: 'bg-yellow-50',
  },
  points: {
    emoji: '⭐',
    gradient: 'linear-gradient(135deg,#10b981,#059669)',
    shadow: '0 20px 60px rgba(16,185,129,0.35)',
    title: (v: number) => `+${v} คะแนน!`,
    desc: 'คะแนนสะสมแลกของรางวัลพรีเมียมได้',
    bg: 'bg-green-50',
  },
  no_prize: {
    emoji: '🎲',
    gradient: 'linear-gradient(135deg,#6b7280,#4b5563)',
    shadow: '0 20px 60px rgba(107,114,128,0.25)',
    title: () => 'ลองโชคใหม่!',
    desc: 'ยังมีสิทธิ์ลุ้นโชคใหญ่อยู่นะครับ',
    bg: 'bg-gray-50',
  },
} as const

export default function ResultPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('hh_result')
    if (!raw) { router.replace('/'); return }
    setResult(JSON.parse(raw) as SpinResult)
    setTimeout(() => setShown(true), 100)
  }, [router])

  const isWin = result?.prize_type !== 'no_prize'
  useConfetti(isWin && shown, canvasRef as React.RefObject<HTMLCanvasElement | null>)

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-10 text-center">
        <p className="text-gray-400">กำลังโหลด…</p>
      </div>
    </div>
  )

  const cfg = PRIZE_CONFIG[result.prize_type]

  async function copyCode() {
    if (!result?.code_id) return
    await navigator.clipboard.writeText(result.code_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      <div className={`w-full max-w-sm flex flex-col items-center gap-5 transition-all duration-700 ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 shadow-sm text-xs font-bold text-red-500 border border-red-100">
          🐻 เฮงเฮงปังจัง
        </div>

        <div className="glass-card w-full text-center p-8" style={{ boxShadow: cfg.shadow }}>
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-5 shadow-xl"
            style={{ background: cfg.gradient, transform: shown ? 'scale(1)' : 'scale(0.5)', transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s' }}>
            {cfg.emoji}
          </div>

          {isWin
            ? <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">🎉 ยินดีด้วย!</p>
            : <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ผลการลุ้น</p>
          }

          <h1 className="text-3xl font-black text-gray-900 mb-2">{cfg.title(result.prize_value)}</h1>
          <p className="text-gray-500 text-sm leading-relaxed">{cfg.desc}</p>

          {(result.prize_type === 'discount' || result.prize_type === 'points') && result.code_id && (
            <div className={`mt-5 ${cfg.bg} rounded-2xl p-4`}>
              <p className="text-xs text-gray-400 font-medium mb-2">รหัสของคุณ</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-xl font-black text-gray-900 tracking-[0.2em]">{result.code_id}</code>
                <button onClick={copyCode} className="p-1.5 rounded-lg bg-white shadow-sm">
                  {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} className="text-gray-400" />}
                </button>
              </div>
              {copied && <p className="text-green-500 text-xs font-medium mt-1">คัดลอกแล้ว!</p>}
            </div>
          )}

          {result.prize_type === 'free_meal' && (
            <div className="mt-5 bg-yellow-50 rounded-2xl p-4">
              <p className="text-sm font-bold text-yellow-700 mb-1">วิธีรับสิทธิ์</p>
              <p className="text-xs text-yellow-600 leading-relaxed">แสดงหน้าจอนี้ให้พนักงานหน้าแคชเชียร์</p>
              <div className="mt-3 bg-yellow-100 rounded-xl px-4 py-2 text-xs font-bold text-yellow-700">
                อ้างอิง: {result.code_id}
              </div>
            </div>
          )}
        </div>

        {result.big_prize_ticket && (
          <div className="glass-card w-full p-4"
            style={{ background: 'linear-gradient(135deg,rgba(29,5,5,0.9),rgba(45,15,5,0.85))' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#e8a820,#d4900d)' }}>🎟️</div>
              <div>
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider">ลุ้นโชคใหญ่</p>
                <p className="text-white font-extrabold text-base mt-0.5">ได้รับ ticket แล้ว!</p>
                <p className="text-white/60 text-xs mt-0.5">เลขที่: {result.big_prize_ticket}</p>
              </div>
              <Ticket size={20} className="text-yellow-400 ml-auto flex-shrink-0" />
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              const text = encodeURIComponent(`ฉันเพิ่งลุ้นได้ "${result.prize_name}" จากหมีปรุง! 🐻`)
              window.open(`https://social-plugins.line.me/lineit/share?text=${text}`)
            }}
            className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2"
            style={{ borderColor: '#00B900', color: '#00B900', background: '#f0fff0' }}>
            <Share2 size={16} /> แชร์ผลให้เพื่อนทาง LINE
          </button>

          <button onClick={() => router.push('/')}
            className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white/80 border border-gray-100 text-gray-700">
            <Home size={16} /> กลับหน้าแรก
          </button>
        </div>

        <button onClick={() => router.push('/profile')}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
          <RotateCcw size={12} /> ดูประวัติสิทธิ์ทั้งหมดของคุณ
        </button>
      </div>
    </div>
  )
}
