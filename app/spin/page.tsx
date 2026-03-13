'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiFetch, type SpinResult, type PrizeItem } from '@/lib/api'
import { Loader2 } from 'lucide-react'

const DEFAULT_PRIZES: PrizeItem[] = [
  { id: 1, name: 'ส่วนลด 10 บาท', type: 'discount',  value: 10, color: '#fd1803', probability: 0.55 },
  { id: 2, name: 'ทานฟรีมื้อนี้', type: 'free_meal', value: 1,  color: '#e8a820', probability: 0.10 },
  { id: 3, name: '50 คะแนน',      type: 'points',    value: 50, color: '#10b981', probability: 0.15 },
  { id: 4, name: 'ลองโชคใหม่',   type: 'no_prize',  value: 0,  color: '#6b7280', probability: 0.20 },
]

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

function drawWheel(canvas: HTMLCanvasElement, prizes: PrizeItem[], rotation: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const r  = cx - 8
  const arc = (2 * Math.PI) / prizes.length
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  prizes.forEach((p, i) => {
    const start = rotation + i * arc
    const end   = start + arc
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, start, end)
    ctx.closePath()
    ctx.fillStyle = p.color
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(start + arc / 2)
    ctx.textAlign = 'right'
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${prizes.length > 6 ? 11 : 13}px Kanit, sans-serif`
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowBlur = 4
    ctx.fillText(p.name, r - 12, 5)
    ctx.restore()
  })

  ctx.beginPath()
  ctx.arc(cx, cy, 22, 0, 2 * Math.PI)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.font = '18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🐻', cx, cy)
}

export default function SpinPage() {
  const params  = useSearchParams()
  const router  = useRouter()
  const qrId    = params.get('qr') ?? ''

  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const rotRef     = useRef<number>(0)

  const [prizes,   setPrizes]   = useState<PrizeItem[]>(DEFAULT_PRIZES)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [hasSpun,  setHasSpun]  = useState(false)
  const [result,   setResult]   = useState<SpinResult | null>(null)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(true)

  // sync rotRef so animate closure always has latest value
  useEffect(() => { rotRef.current = rotation }, [rotation])

  useEffect(() => {
    apiFetch<PrizeItem[]>('/prize/catalog.php')
      .then(data => { if (data.length) setPrizes(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawWheel(canvas, prizes, rotation)
  }, [rotation, prizes])

  const doSpin = useCallback(async () => {
    if (spinning || hasSpun) return
    const token = localStorage.getItem('hh_token')
    if (!token) { router.push(`/scan/${qrId}`); return }

    setSpinning(true)
    setError('')

    try {
      const data = await apiFetch<SpinResult>('/qr/spin.php', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ qr_id: qrId }),
      })

      const idx    = prizes.findIndex(p => p.id === data.prize_id)
      const winIdx = idx >= 0 ? idx : 0
      const arc    = (2 * Math.PI) / prizes.length
      const target = -(winIdx * arc + arc / 2) - Math.PI / 2 + 5 * 2 * Math.PI

      const duration  = 4500
      const startTime = performance.now()
      const startRot  = rotRef.current

      const tick = (now: number) => {
        const t      = Math.min((now - startTime) / duration, 1)
        const newRot = startRot + easeOut(t) * (target - startRot)
        setRotation(newRot)

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setSpinning(false)
          setHasSpun(true)
          setResult(data)
          setTimeout(() => {
            localStorage.setItem('hh_result', JSON.stringify(data))
            router.push('/result')
          }, 1200)
        }
      }

      rafRef.current = requestAnimationFrame(tick)

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด ลองใหม่นะครับ')
      setSpinning(false)
    }
  }, [spinning, hasSpun, prizes, qrId, router])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-10 flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-red-500" size={40} />
        <p className="text-gray-500 font-medium">กำลังเตรียมวงล้อ…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 shadow-sm text-xs font-bold text-red-500 border border-red-100 mb-3">
            🐻 Instant Win
          </div>
          <h1 className="text-3xl font-black text-gray-900">หมุนวงล้อลุ้นโชค!</h1>
          <p className="text-gray-400 text-sm mt-1">กดหมุนและลุ้นรับรางวัลทันที</p>
        </div>

        {/* Wheel */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0" style={{
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '22px solid #fd1803',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }} />
          </div>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="rounded-full cursor-pointer select-none"
            style={{ boxShadow: spinning ? '0 0 40px rgba(253,24,3,0.5)' : '0 8px 32px rgba(0,0,0,0.15)', transition: 'box-shadow 0.5s' }}
            onClick={!spinning && !hasSpun ? doSpin : undefined}
          />
        </div>

        {/* Spin button */}
        {!hasSpun && (
          <button
            onClick={doSpin}
            disabled={spinning}
            className="w-full h-14 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(253,24,3,0.4)] disabled:opacity-70 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg,#fd1803,#e01502)' }}>
            {spinning ? <><Loader2 size={20} className="animate-spin" /> กำลังหมุน…</> : '🎰 หมุนเลย!'}
          </button>
        )}

        {/* Prize list */}
        <div className="glass-card p-4 w-full">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">รางวัลที่ลุ้นได้</p>
          <div className="flex flex-col gap-2">
            {prizes.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <span className="text-sm font-semibold text-gray-700 flex-1">{p.name}</span>
                <span className="text-xs text-gray-400">{Math.round(p.probability * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-500 text-sm font-medium text-center">
            ⚠️ {error}
          </div>
        )}

        {result && (
          <p className="text-gray-400 text-sm animate-pulse">กำลังไปหน้าผลรางวัล…</p>
        )}
      </div>
    </div>
  )
}
