'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode.react'

export default function QRCodesClient({
  merchantId, storeName, qrCode, spinUrl,
}: {
  merchantId: number
  storeName: string
  qrCode: string
  spinUrl: string
}) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  function copyUrl() {
    navigator.clipboard.writeText(spinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadQR() {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `QR-${storeName}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden mb-5 p-5"
        style={{ background: 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 2px, transparent 2px, transparent 20px)' }} />
        <div className="relative">
          <div className="text-yellow-300 text-xs font-bold mb-1">📱 QR Code ร้านค้า</div>
          <h1 className="text-white text-2xl font-black">{storeName}</h1>
          <p className="text-red-200 text-xs mt-1">ให้ลูกค้าสแกนเพื่อหมุนวงล้อรับรางวัล</p>
        </div>
        <div className="absolute right-4 top-4 text-5xl opacity-30">🎰</div>
      </div>

      {/* QR Card - lottery style */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="rounded-3xl overflow-hidden mb-4 shadow-xl">
        {/* Card top - red */}
        <div className="p-5 text-center" style={{ background: 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)' }}>
          <div className="text-yellow-300 text-xs font-bold tracking-widest mb-1">🐻‍🍳 MEEPRUNG DIGITAL LOTTERY</div>
          <div className="text-white text-xl font-black">เฮงเฮงปังจัง</div>
          <div className="text-red-200 text-xs">ระบบรางวัลสำหรับร้านอาหาร</div>
        </div>
        {/* Gold border line */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)' }} />
        {/* Card body - cream/yellow */}
        <div className="bg-amber-50 p-6 text-center">
          <div className="text-gray-600 text-xs font-bold mb-1">ร้าน: {storeName}</div>
          <div className="text-gray-400 text-xs mb-4">รหัส: {qrCode}</div>
          {/* QR Code */}
          <div ref={qrRef} className="inline-block p-3 bg-white rounded-2xl shadow-md">
            <QRCode
              value={spinUrl}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#CC0000"
            />
          </div>
          <div className="mt-4 text-xs text-gray-500 break-all px-2">{spinUrl}</div>
        </div>
        {/* Gold border line */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)' }} />
        {/* Card footer */}
        <div className="p-3 text-center" style={{ background: 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)' }}>
          <div className="text-yellow-300 text-xs">สแกนเพื่อหมุนวงล้อรับรางวัลทันที 🎁</div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={downloadQR}
          className="py-4 rounded-2xl text-white font-black text-sm"
          style={{ background: 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)' }}>
          ⬇️ ดาวน์โหลด QR
        </button>
        <button onClick={copyUrl}
          className={`py-4 rounded-2xl font-black text-sm transition-all
            ${copied ? 'bg-green-500 text-white' : 'bg-amber-100 text-amber-800'}`}>
          {copied ? '✅ คัดลอกแล้ว!' : '📋 คัดลอก URL'}
        </button>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl p-4 border border-yellow-100">
        <div className="text-sm font-black text-gray-700 mb-3">วิธีใช้งาน</div>
        {[
          ['1', 'ปริ้น QR Code แล้วติดที่ร้าน', '🖨️'],
          ['2', 'ลูกค้าสแกนด้วยกล้องมือถือ', '📱'],
          ['3', 'ลูกค้าลงทะเบียนแล้วหมุนวงล้อ', '🎰'],
          ['4', 'ลูกค้าได้รับคูปองส่วนลดทันที', '🎁'],
        ].map(([num, text, icon]) => (
          <div key={num} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ background: '#CC0000' }}>{num}</div>
            <div className="text-sm text-gray-600">{icon} {text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
