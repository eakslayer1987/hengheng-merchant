'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function UploadClient({ merchantId }: { merchantId: number }) {
  const [file,     setFile]     = useState<File | null>(null)
  const [preview,  setPreview]  = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState<{ success: boolean; message: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  async function submit() {
    if (!file) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('receipt', file)
      fd.append('quantity', String(quantity))
      const res = await axios.post('/api/upload-receipt', fd)
      setResult({ success: true, message: res.data.message })
      setFile(null); setPreview(null); setQuantity(1)
    } catch (e: any) {
      setResult({ success: false, message: e.response?.data?.message || 'เกิดข้อผิดพลาด' })
    }
    setLoading(false)
  }

  const spins = quantity * 30

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden mb-5 p-5"
        style={{ background: 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 2px, transparent 2px, transparent 20px)' }} />
        <div className="relative">
          <div className="text-yellow-300 text-xs font-bold mb-1">📋 อัพโหลดใบเสร็จ</div>
          <h1 className="text-white text-2xl font-black">ซื้อซอส → รับ Spin</h1>
          <p className="text-red-200 text-xs mt-1">1 ถุง = 30 สปิน | ยิ่งซื้อมาก ยิ่งได้มาก</p>
        </div>
        <div className="absolute right-4 top-4 text-5xl opacity-30">🧧</div>
      </div>

      {/* Quantity selector */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-yellow-100 mb-4">
        <div className="text-sm font-black text-gray-700 mb-3">จำนวนถุงที่ซื้อ</div>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity(q => Math.max(1, q-1))}
            className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 text-2xl font-black flex items-center justify-center">−</button>
          <div className="flex-1 text-center">
            <div className="text-4xl font-black text-gray-900">{quantity}</div>
            <div className="text-xs text-gray-400">ถุง</div>
          </div>
          <button onClick={() => setQuantity(q => Math.min(99, q+1))}
            className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 text-2xl font-black flex items-center justify-center">+</button>
        </div>
        {/* Spin preview */}
        <div className="mt-4 rounded-2xl p-3 text-center"
          style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
          <div className="text-white font-black text-lg">🎰 ได้รับ {spins} สปิน!</div>
          <div className="text-yellow-100 text-xs">= {quantity} ถุง × 30 สปิน</div>
        </div>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-yellow-100 mb-4">
        <div className="text-sm font-black text-gray-700 mb-3">ถ่ายรูปใบเสร็จ</div>
        <div
          onDrop={onDrop} onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-yellow-300 rounded-2xl p-6 text-center cursor-pointer
            hover:border-red-400 hover:bg-red-50 transition-all"
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div key="preview" initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}>
                <img src={preview} alt="receipt" className="max-h-48 mx-auto rounded-xl shadow-md object-contain" />
                <p className="text-xs text-gray-400 mt-2">แตะเพื่อเปลี่ยนรูป</p>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                <div className="text-5xl mb-2">📷</div>
                <p className="text-gray-500 text-sm font-semibold">แตะหรือลากรูปมาวางที่นี่</p>
                <p className="text-gray-300 text-xs mt-1">JPG, PNG ขนาดไม่เกิน 10MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className={`rounded-2xl p-4 mb-4 text-sm font-bold text-center
              ${result.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {result.success ? '✅' : '❌'} {result.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button onClick={submit} disabled={!file || loading}
        className="w-full py-4 rounded-2xl text-white font-black text-lg disabled:opacity-40 transition-all"
        style={{ background: loading ? '#999' : 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)' }}>
        {loading ? '⏳ กำลังส่ง...' : `📤 ส่งใบเสร็จ (${quantity} ถุง = ${spins} spins)`}
      </button>
    </div>
  )
}
