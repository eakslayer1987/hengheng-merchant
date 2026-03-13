'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

interface Merchant {
  id: number; store_name: string; phone: string; qr_code: string
  approved: boolean; quota_total: number; quota_used: number
  total_spins: number; pending_receipts: number; created_at: string
}

export default function MerchantsClient({ merchants: init }: { merchants: Merchant[] }) {
  const [merchants, setMerchants] = useState(init)
  const [search,    setSearch]    = useState('')
  const [loading,   setLoading]   = useState<number | null>(null)

  const filtered = merchants.filter(m =>
    m.store_name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  )

  async function toggleApprove(id: number, approved: boolean) {
    setLoading(id)
    try {
      await axios.put('/api/merchants', { merchant_id: id, approved })
      setMerchants(ms => ms.map(m => m.id === id ? { ...m, approved } : m))
    } catch { alert('เกิดข้อผิดพลาด') }
    finally { setLoading(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">จัดการร้านค้า</h1>
          <p className="text-gray-400 text-sm">{merchants.length} ร้านค้าทั้งหมด</p>
        </div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="🔍 ค้นหาชื่อร้านหรือเบอร์..."
        className="w-full mb-5 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm
          focus:outline-none focus:border-brand-400 transition-colors"
      />

      <div className="space-y-3">
        {filtered.map((m, i) => {
          const pct = m.quota_total > 0 ? Math.round((m.quota_used / m.quota_total) * 100) : 0
          return (
            <motion.div key={m.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.04*i }}
              className="bg-white rounded-2xl p-4 shadow-card border border-gray-100"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-xl flex-shrink-0">
                    🏪
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{m.store_name}</div>
                    <div className="text-xs text-gray-400">{m.phone}</div>
                  </div>
                </div>
                <div className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0
                  ${m.approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {m.approved ? '✅ Active' : '⏳ Pending'}
                </div>
              </div>

              {/* Quota bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Quota: {m.quota_used}/{m.quota_total}</span>
                  <span className="text-brand-600 font-semibold">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-400 rounded-full transition-all" style={{ width:`${pct}%` }} />
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-4 text-xs text-gray-500 mb-3">
                <span>🎰 {m.total_spins} spins</span>
                {m.pending_receipts > 0 && (
                  <span className="text-orange-500 font-semibold">📄 {m.pending_receipts} ใบเสร็จรอ</span>
                )}
                <span className="text-gray-300">ID: {m.id}</span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toggleApprove(m.id, !m.approved)}
                  disabled={loading === m.id}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors
                    ${m.approved
                      ? 'bg-red-50 text-red-500 hover:bg-red-100'
                      : 'bg-green-500 text-white hover:bg-green-600'}`}>
                  {loading === m.id ? '...' : m.approved ? '🚫 ระงับ' : '✅ อนุมัติ'}
                </button>
                <div className="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-400 text-xs font-mono flex items-center">
                  {m.qr_code}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
