'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import MerchantLayout from '@/components/merchant/MerchantLayout'

interface FileWithPreview extends File { preview?: string }

export default function UploadPage() {
  const [file,     setFile]     = useState<FileWithPreview | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [progress, setProgress] = useState(0)
  const [status,   setStatus]   = useState<'idle'|'uploading'|'success'|'error'>('idle')
  const [message,  setMessage]  = useState('')

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted[0]) return
    const f = Object.assign(accepted[0], { preview: URL.createObjectURL(accepted[0]) })
    setFile(f)
    setStatus('idle')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  async function handleUpload() {
    if (!file) return
    setStatus('uploading'); setProgress(0)
    const form = new FormData()
    form.append('receipt', file)
    form.append('quantity', String(quantity))
    try {
      const { data } = await axios.post('/api/upload-receipt', form, {
        onUploadProgress: e => setProgress(Math.round((e.loaded / (e.total||1)) * 100)),
      })
      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setFile(null)
        setQuantity(1)
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch {
      setStatus('error')
      setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  return (
    <MerchantLayout>
      <div className="pb-4">
        <motion.h1 initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          className="text-xl font-black text-gray-900 mb-1">
          อัพโหลดใบเสร็จ
        </motion.h1>
        <p className="text-sm text-gray-400 mb-6">1 ถุง = 30 spins สำหรับลูกค้าของคุณ</p>

        {/* Quota formula info */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}
          className="bg-brand-50 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="text-2xl">🧮</div>
          <div>
            <div className="text-sm font-bold text-brand-800">สูตรคำนวณ Quota</div>
            <div className="text-xs text-brand-600 mt-0.5">
              จำนวนถุง × 30 = Spin ที่ลูกค้าใช้ได้
            </div>
          </div>
        </motion.div>

        {/* Dropzone */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
              transition-all duration-200 mb-5
              ${isDragActive
                ? 'border-brand-500 bg-brand-50'
                : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-brand-300 hover:bg-brand-50/50'
              }`}
          >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="preview"
                  initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  exit={{ scale:.8, opacity:0 }}
                >
                  {file.preview && (
                    <img src={file.preview} alt="receipt"
                      className="w-24 h-24 object-cover rounded-xl mx-auto mb-3 shadow-card" />
                  )}
                  <p className="text-sm font-bold text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(file.size / 1024).toFixed(0)} KB · แตะเพื่อเปลี่ยน
                  </p>
                </motion.div>
              ) : (
                <motion.div key="empty"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center
                    mx-auto mb-3 text-2xl">
                    📷
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    {isDragActive ? 'วางรูปที่นี่...' : 'Drag & Drop หรือแตะเพื่อเลือกรูป'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · สูงสุด 10MB</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quantity */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
          className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 mb-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            จำนวนถุงหมีปรุง
          </label>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(q => Math.max(1, q-1))}
              className="w-10 h-10 rounded-full bg-gray-100 text-xl font-black flex items-center justify-center">−</button>
            <div className="flex-1 text-center">
              <div className="text-3xl font-black text-brand-700">{quantity}</div>
              <div className="text-xs text-gray-400">ถุง = {quantity*30} spins</div>
            </div>
            <button onClick={() => setQuantity(q => Math.min(99, q+1))}
              className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 text-xl font-black flex items-center justify-center">+</button>
          </div>
        </motion.div>

        {/* Upload progress */}
        <AnimatePresence>
          {status === 'uploading' && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 mb-4 overflow-hidden"
            >
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                <span>กำลังอัพโหลด...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-brand-500 rounded-full progress-fill"
                  style={{ width: `${progress}%` }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ scale:.85, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:.85, opacity:0 }}
              transition={{ type:'spring', stiffness:300, damping:20 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex items-start gap-3"
            >
              <span className="text-2xl">🎉</span>
              <div>
                <div className="text-sm font-bold text-green-800">อัพโหลดสำเร็จ!</div>
                <div className="text-xs text-green-600 mt-0.5">{message}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-start gap-3"
            >
              <span className="text-xl">⚠️</span>
              <div className="text-sm font-bold text-red-700">{message}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
          onClick={handleUpload}
          disabled={!file || status === 'uploading'}
          whileTap={{ scale: .97 }}
          className="w-full py-4 rounded-2xl bg-brand-600 text-white text-base font-black
            shadow-brand disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {status === 'uploading' ? 'กำลังอัพโหลด...' : 'ส่งใบเสร็จ →'}
        </motion.button>
      </div>
    </MerchantLayout>
  )
}
