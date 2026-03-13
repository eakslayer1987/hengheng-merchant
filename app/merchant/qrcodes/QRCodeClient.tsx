'use client'
import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import MerchantLayout from '@/components/merchant/MerchantLayout'
import type { Merchant } from '@/types'

export default function QRCodeClient({ merchant }: { merchant: Merchant }) {
  const qrRef = useRef<HTMLDivElement>(null)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://meeprung.com'
  const scanUrl = `${appUrl}/r/${merchant.id}`

  function downloadQR() {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const xml  = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([xml], { type: 'image/svg+xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `QR-${merchant.store_name}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyLink() {
    navigator.clipboard.writeText(scanUrl)
  }

  return (
    <MerchantLayout storeName={merchant.store_name}>
      <motion.h1 initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        className="text-xl font-black text-gray-900 mb-1">QR Code ของร้าน</motion.h1>
      <p className="text-sm text-gray-400 mb-6">ให้ลูกค้าสแกนเพื่อหมุนวงล้อรับรางวัล</p>

      <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay:.05, type:'spring', stiffness:260, damping:20 }}
        className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 text-center mb-5"
      >
        <div className="bg-brand-50 rounded-2xl p-5 inline-block mb-4" ref={qrRef}>
          <QRCodeSVG
            value={scanUrl}
            size={200}
            fgColor="#4C1D95"
            bgColor="#F5F3FF"
            level="H"
            includeMargin
          />
        </div>
        <div className="text-sm font-bold text-gray-900 mb-1">{merchant.store_name}</div>
        <div className="text-xs text-gray-400 font-mono break-all mb-4">{scanUrl}</div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={downloadQR}
            className="py-3 rounded-2xl bg-brand-600 text-white text-sm font-black shadow-brand btn-press">
            📥 ดาวน์โหลด
          </button>
          <button onClick={copyLink}
            className="py-3 rounded-2xl bg-brand-50 text-brand-700 text-sm font-black btn-press border border-brand-200">
            📋 คัดลอก Link
          </button>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
        className="bg-white rounded-2xl p-4 shadow-card border border-gray-100"
      >
        <h3 className="text-sm font-bold text-gray-700 mb-3">วิธีการใช้งาน</h3>
        {[
          ['1️⃣', 'พิมพ์ QR Code แปะไว้ที่โต๊ะหรือเคาน์เตอร์'],
          ['2️⃣', 'ลูกค้าสแกน QR แล้วลงทะเบียนด้วยเบอร์โทร'],
          ['3️⃣', 'ลูกค้าหมุนวงล้อรับรางวัลได้ทันที'],
          ['4️⃣', 'ระบบจะหักโควต้าของร้านอัตโนมัติ'],
        ].map(([n, t]) => (
          <div key={n} className="flex items-start gap-3 mb-2 last:mb-0">
            <span className="text-base">{n}</span>
            <span className="text-sm text-gray-600">{t}</span>
          </div>
        ))}
      </motion.div>
    </MerchantLayout>
  )
}
