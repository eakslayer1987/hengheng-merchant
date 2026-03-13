'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

interface Receipt {
  id: number
  store_name: string
  phone: string
  image_url: string
  quantity: number
  approved: boolean
  created_at: string
}

export default function ReceiptsClient({ receipts: initial }: { receipts: Receipt[] }) {
  const [receipts, setReceipts] = useState(initial)
  const [preview,  setPreview]  = useState<string | null>(null)
  const [loading,  setLoading]  = useState<number | null>(null)
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'approved'>('pending')

  const filtered = receipts.filter(r =>
    filter === 'all'      ? true :
    filter === 'pending'  ? !r.approved :
                             r.approved
  )

  async function approve(id: number, approved: boolean) {
    setLoading(id)
    try {
      await axios.put('/api/upload-receipt/approve', { receipt_id: id, approved })
      setReceipts(rs => rs.map(r => r.id === id ? { ...r, approved } : r))
    } catch { alert('เกิดข้อผิดพลาด') }
    finally { setLoading(null) }
  }

  const pending  = receipts.filter(r => !r.approved).length
  const approved = receipts.filter(r =>  r.approved).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">อนุมัติใบเสร็จ</h1>
          <p className="text-gray-400 text-sm mt-0.5">ตรวจสอบและอนุมัติใบเสร็จจากร้านค้า</p>
        </div>
        {pending > 0 && (
          <div className="bg-red-100 text-red-600 rounded-full px-3 py-1 text-sm font-bold">
            {pending} รายการรอ
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {([
          ['pending',  `รออนุมัติ (${pending})`],
          ['approved', `อนุมัติแล้ว (${approved})`],
          ['all',      'ทั้งหมด'],
        ] as const).map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${filter === v
                ? 'bg-brand-600 text-white shadow-brand'
                : 'bg-white text-gray-500 border border-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="text-center text-gray-300 py-16 text-sm">ไม่มีรายการ</div>
          ) : filtered.map((r, i) => (
            <motion.div key={r.id}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: .04*i }}
              className="bg-white rounded-2xl p-4 shadow-card border border-gray-100"
            >
              <div className="flex gap-4 items-start">
                {/* Thumbnail */}
                <button onClick={() => setPreview(r.image_url)}
                  className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                  <img src={r.image_url} alt="receipt"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs
                    text-white bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                    ดูรูป
                  </div>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-gray-900 text-sm truncate">{r.store_name}</div>
                      <div className="text-xs text-gray-400">{r.phone}</div>
                    </div>
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0
                      ${r.approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {r.approved ? '✅ อนุมัติ' : '⏳ รออนุมัติ'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-xs text-gray-500">
                      📦 <strong>{r.quantity}</strong> ถุง
                      <span className="text-brand-600 ml-1">= {r.quantity * 30} spins</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString('th-TH')}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {!r.approved ? (
                      <button onClick={() => approve(r.id, true)}
                        disabled={loading === r.id}
                        className="flex-1 py-2 rounded-xl bg-green-500 text-white text-xs font-bold
                          disabled:opacity-50 transition-opacity">
                        {loading === r.id ? '...' : '✅ อนุมัติ'}
                      </button>
                    ) : (
                      <button onClick={() => approve(r.id, false)}
                        disabled={loading === r.id}
                        className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold
                          disabled:opacity-50">
                        {loading === r.id ? '...' : '↩️ ยกเลิก'}
                      </button>
                    )}
                    <button onClick={() => setPreview(r.image_url)}
                      className="px-4 py-2 rounded-xl bg-brand-50 text-brand-600 text-xs font-bold">
                      🔍 ดูรูป
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Image preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            onClick={() => setPreview(null)}>
            <motion.img src={preview} alt="receipt"
              initial={{ scale:.85 }} animate={{ scale:1 }} exit={{ scale:.85 }}
              className="max-w-sm w-full rounded-2xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
