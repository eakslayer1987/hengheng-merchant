'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'

interface SpinRecord {
  id: number
  created_at: string
  name: string
  emoji: string
  color: string
  type: string
  customer_name: string
  customer_phone: string
  coupon_code?: string
  coupon_status?: string
}

export default function HistoryClient({ spins }: { spins: SpinRecord[] }) {
  const [search, setSearch] = useState('')

  const filtered = spins.filter(s =>
    s.customer_phone.includes(search) ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.coupon_code || '').includes(search.toUpperCase())
  )

  return (
    <div>
      <h1 className="text-xl font-black text-gray-900 mb-1">ประวัติการหมุน</h1>
      <p className="text-gray-400 text-sm mb-5">50 รายการล่าสุด</p>

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="🔍 ค้นหาเบอร์ / รางวัล / รหัสคูปอง..."
        className="w-full mb-4 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm
          focus:outline-none focus:border-brand-400 transition-colors"
      />

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-300 py-16 text-sm">ไม่พบข้อมูล</div>
        ) : filtered.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.03*i }}
            className="bg-white rounded-2xl p-3.5 shadow-card border border-gray-100 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: (s.color || '#8B5CF6') + '22' }}>
              {s.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-gray-900 truncate">{s.name}</div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(s.created_at).toLocaleTimeString('th-TH', { hour:'2-digit', minute:'2-digit' })}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{s.customer_phone}</div>
              {s.coupon_code && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono bg-brand-50 text-brand-600 px-2 py-0.5 rounded-lg">
                    {s.coupon_code}
                  </span>
                  <span className={`text-xs font-semibold
                    ${s.coupon_status === 'used' ? 'text-gray-400' : 'text-green-500'}`}>
                    {s.coupon_status === 'used' ? 'ใช้แล้ว' : 'ยังไม่ได้ใช้'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
