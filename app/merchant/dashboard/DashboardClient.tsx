'use client'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import Link from 'next/link'
import MerchantLayout from '@/components/merchant/MerchantLayout'
import type { Merchant, MerchantStats } from '@/types'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .5, delay, ease: [.16, 1, .3, 1] },
})

export default function MerchantDashboardClient({
  merchant, stats, todaySpins,
}: {
  merchant: Merchant
  stats: MerchantStats
  todaySpins: number
}) {
  const pct = stats.quota_total > 0
    ? Math.round((stats.quota_used / stats.quota_total) * 100)
    : 0

  const cards = [
    { label: 'Quota ทั้งหมด',  value: stats.quota_total,     color: 'bg-brand-50',  text: 'text-brand-700',  icon: '🎯' },
    { label: 'ใช้ไปแล้ว',      value: stats.quota_used,      color: 'bg-red-50',    text: 'text-red-600',    icon: '📉' },
    { label: 'เหลืออยู่',      value: stats.quota_remaining, color: 'bg-green-50',  text: 'text-green-600',  icon: '✅' },
    { label: 'Spin วันนี้',     value: todaySpins,            color: 'bg-orange-50', text: 'text-orange-600', icon: '🎰' },
    { label: 'Coupons ทั้งหมด', value: stats.total_coupons,  color: 'bg-pink-50',   text: 'text-pink-600',   icon: '🏷️' },
    { label: 'ใบเสร็จ',         value: stats.total_receipts, color: 'bg-yellow-50', text: 'text-yellow-600', icon: '📄' },
  ]

  return (
    <MerchantLayout storeName={merchant.store_name}>
      {/* Welcome banner */}
      <motion.div {...fadeUp(0)}
        className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-5 mb-5 text-white"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-brand-200 text-xs mb-1">ยินดีต้อนรับ 👋</div>
            <h1 className="text-xl font-black leading-tight">{merchant.store_name}</h1>
            <p className="text-brand-200 text-xs mt-1">{merchant.phone}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            🏪
          </div>
        </div>

        {/* Quota progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-brand-200 mb-1.5">
            <span>Quota ที่ใช้แล้ว</span>
            <span className="font-bold text-white">{pct}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, delay: .3, ease: [.16,1,.3,1] }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-brand-200 mt-1">
            <span>{stats.quota_used} used</span>
            <span>{stats.quota_remaining} remaining</span>
          </div>
        </div>
      </motion.div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {cards.map((c, i) => (
          <motion.div key={c.label} {...fadeUp(.08 * i + .1)}
            className={`${c.color} rounded-2xl p-3 text-center`}
          >
            <div className="text-xl mb-1">{c.icon}</div>
            <div className={`text-2xl font-black ${c.text}`}>
              <CountUp end={c.value} duration={1.5} delay={.2 + i*.05} />
            </div>
            <div className="text-xs text-gray-500 mt-0.5 leading-tight">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div {...fadeUp(.35)}>
        <h2 className="text-sm font-bold text-gray-700 mb-3">เมนูลัด</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/merchant/upload"
            className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 card-hover border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-xl">📷</div>
            <div>
              <div className="text-sm font-bold text-gray-900">อัพโหลดใบเสร็จ</div>
              <div className="text-xs text-gray-400">1 ถุง = 30 spins</div>
            </div>
          </Link>
          <Link href="/merchant/qrcodes"
            className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 card-hover border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">📱</div>
            <div>
              <div className="text-sm font-bold text-gray-900">QR Code ร้าน</div>
              <div className="text-xs text-gray-400">ดาวน์โหลด / แชร์</div>
            </div>
          </Link>
          <Link href="/merchant/history"
            className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 card-hover border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-xl">📋</div>
            <div>
              <div className="text-sm font-bold text-gray-900">ประวัติการใช้</div>
              <div className="text-xs text-gray-400">Spin & Coupon</div>
            </div>
          </Link>
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🎟️</div>
            <div>
              <div className="text-sm font-bold text-white">Grand Prize</div>
              <div className="text-xs text-pink-100">ลุ้นโชคใหญ่</div>
            </div>
          </div>
        </div>
      </motion.div>
    </MerchantLayout>
  )
}
