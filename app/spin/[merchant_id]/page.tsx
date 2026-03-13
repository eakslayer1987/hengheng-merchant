'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import axios from 'axios'
import type { Reward, SpinResult } from '@/types'

const COLORS = ['#7C3AED','#6D28D9','#8B5CF6','#A78BFA','#5B21B6','#4C1D95','#DDD6FE','#EDE9FE']

export default function SpinPage() {
  const { merchant_id } = useParams()

  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const [rewards,   setRewards]   = useState<Reward[]>([])
  const [merchant,  setMerchant]  = useState<{ store_name: string } | null>(null)
  const [spinning,  setSpinning]  = useState(false)
  const [result,    setResult]    = useState<SpinResult | null>(null)
  const [error,     setError]     = useState('')
  const [rotation,  setRotation]  = useState(0)
  const [showConf,  setShowConf]  = useState(false)
  const animRef     = useRef<number>()

  // ── Load rewards & merchant ─────────────────────────────
  useEffect(() => {
    axios.get(`/api/spin?merchant_id=${merchant_id}`)
      .then(({ data }) => {
        if (data.success) {
          setRewards(data.data.rewards)
          setMerchant(data.data.merchant)
        }
      })
  }, [merchant_id])

  // ── Draw wheel ──────────────────────────────────────────
  const drawWheel = useCallback((rot: number) => {
    const canvas = canvasRef.current
    if (!canvas || !rewards.length) return
    const ctx = canvas.getContext('2d')!
    const cx  = canvas.width  / 2
    const cy  = canvas.height / 2
    const r   = cx - 6
    const n   = rewards.length
    const arc = (Math.PI * 2) / n

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    rewards.forEach((rw, i) => {
      const start = arc * i + rot
      const end   = start + arc

      // Slice
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = rw.color || COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()

      // Label
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + arc / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = 'white'
      ctx.font = `bold 12px 'Kanit', sans-serif`
      ctx.fillText(rw.name, r - 12, 5)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 28, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.shadowColor = 'rgba(0,0,0,.15)'
    ctx.shadowBlur  = 8
    ctx.fill()
    ctx.shadowBlur  = 0

    ctx.fillStyle   = '#7C3AED'
    ctx.font        = `900 11px 'Kanit', sans-serif`
    ctx.textAlign   = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SPIN', cx, cy)
  }, [rewards])

  useEffect(() => { drawWheel(rotation) }, [drawWheel, rotation])

  // ── Spin animation ──────────────────────────────────────
  function animateSpin(targetAngle: number, duration: number, onDone: () => void) {
    const start     = performance.now()
    const startRot  = rotation
    const totalDiff = targetAngle - startRot

    function tick(now: number) {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      const current  = startRot + totalDiff * eased
      setRotation(current)
      drawWheel(current)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        onDone()
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }

  // ── Trigger spin ────────────────────────────────────────
  async function handleSpin() {
    if (spinning || !rewards.length) return
    setSpinning(true); setError(''); setResult(null)

    try {
      const { data } = await axios.post('/api/spin', { merchant_id: Number(merchant_id) })
      if (!data.success) { setError(data.message); setSpinning(false); return }

      const wonReward: Reward  = data.data.reward
      const rewardIndex        = rewards.findIndex(r => r.id === wonReward.id)
      const n                  = rewards.length
      const arc                = (Math.PI * 2) / n
      // Target: pointer at top (−π/2), land on winning slice center
      const sliceCenter        = arc * rewardIndex + arc / 2
      const targetAngle        = rotation + Math.PI * 10 + (Math.PI * 2 - sliceCenter - Math.PI / 2)

      animateSpin(targetAngle, 4000, () => {
        setSpinning(false)
        setResult(data.data)
        if (wonReward.type !== 'none') setShowConf(true)
        setTimeout(() => setShowConf(false), 5000)
      })
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setSpinning(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showConf && <Confetti recycle={false} numberOfPieces={250} colors={['#7C3AED','#A78BFA','#FBBF24','#EC4899']} />}

      {/* Header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-5 pt-10 pb-6 text-center">
        <p className="text-brand-200 text-xs mb-1">{merchant?.store_name}</p>
        <h1 className="text-xl font-black text-white">Spin the Wheel</h1>
        <p className="text-brand-200 text-sm">หมุนวงล้อรับรางวัลฟรี!</p>
      </div>

      {/* Wheel section */}
      <div className="flex-1 flex flex-col items-center px-5 pt-6 pb-10">

        {/* Tab bar (decorative, matches Style B) */}
        <div className="flex bg-brand-50 rounded-full p-1 mb-6 w-full max-w-xs">
          {['Watch Video', 'Spin & Win', 'Shop & Earn'].map((t, i) => (
            <div key={t} className={`flex-1 text-center text-xs py-2 rounded-full font-semibold transition-all
              ${i===1 ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-400'}`}>
              {t}
            </div>
          ))}
        </div>

        {/* Wheel + stand */}
        <div className="relative mb-2">
          {/* Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px]
              border-l-transparent border-r-transparent border-t-brand-600
              drop-shadow-md" />
          </div>
          <canvas ref={canvasRef} width={280} height={280}
            className="rounded-full shadow-[0_8px_40px_rgba(124,58,237,.25)]" />
          {/* Stand */}
          <div className="mx-auto w-16 h-4 bg-gray-200 rounded-b-xl -mt-1" />
          <div className="mx-auto w-24 h-3 bg-gray-100 rounded-b-xl" />
        </div>

        {/* Spin button */}
        <motion.button
          onClick={handleSpin}
          disabled={spinning || !!result}
          whileTap={{ scale: .95 }}
          className="mt-4 w-full max-w-xs py-4 rounded-2xl bg-brand-600 text-white text-base
            font-black shadow-brand disabled:opacity-50 transition-opacity"
        >
          {spinning ? '⏳ กำลังหมุน...' : '🎰 หมุนเลย!'}
        </motion.button>

        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

        {/* Reward chips */}
        {rewards.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-5 max-w-xs">
            {rewards.filter(r => r.type !== 'none').map(r => (
              <div key={r.id}
                className="flex items-center gap-1.5 bg-brand-50 rounded-full px-3 py-1 border border-brand-100">
                <span className="text-sm">{r.emoji}</span>
                <span className="text-xs font-semibold text-brand-700">{r.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Result popup */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
            onClick={() => setResult(null)}
          >
            <motion.div
              initial={{ y:80, scale:.9, opacity:0 }}
              animate={{ y:0, scale:1, opacity:1 }}
              exit={{ y:80, opacity:0 }}
              transition={{ type:'spring', stiffness:300, damping:28 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl mb-3">
                {result.reward.type === 'none' ? '😔' : result.reward.emoji}
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                {result.reward.type === 'none' ? 'เสียดายครั้งนี้...' : 'ยินดีด้วย! 🎉'}
              </div>
              <h2 className="text-2xl font-black text-brand-700 mb-2">{result.reward.name}</h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{result.message}</p>

              {result.coupon_code && (
                <div className="bg-brand-50 rounded-2xl py-3 px-4 mb-4">
                  <div className="text-xs text-brand-500 mb-1">รหัสคูปอง</div>
                  <div className="text-xl font-black tracking-[.25em] text-brand-700">
                    {result.coupon_code}
                  </div>
                </div>
              )}

              {result.raffle_ticket_id && (
                <div className="text-xs text-gray-400 mb-4">
                  🎟️ ได้รับ Ticket ลุ้นโชคใหญ่แล้ว!
                </div>
              )}

              <button onClick={() => setResult(null)}
                className="w-full py-3.5 rounded-2xl bg-brand-600 text-white font-black shadow-brand">
                {result.reward.type === 'none' ? 'ลองใหม่วันพรุ่งนี้' : 'บันทึกรางวัล ✓'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
