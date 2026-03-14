'use client'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import Link from 'next/link'
import MerchantLayout from '@/components/merchant/MerchantLayout'
import type { Merchant, MerchantStats } from '@/types'

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

  return (
    <MerchantLayout storeName={merchant.store_name}>

      {/* Hero banner - lottery style */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="relative rounded-3xl overflow-hidden mb-5 shadow-xl">
        {/* Pattern overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #CC0000 0%, #8B0000 100%)' }} />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 2px, transparent 2px, transparent 20px)' }} />
        {/* Gold top border */}
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)' }} />

        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-yellow-300 text-[10px] font-bold tracking-widest mb-1">
                🐻‍🍳 MEEPRUNG DIGITAL LOTTERY
              </div>
              <h1 className="text-white text-xl font-black leading-tight">{merchant.store_name}</h1>
              <p className="text-red-200 text-xs mt-0.5">{merchant.phone}</p>
            </div>
            <div className="text-4xl">🏪</div>
          </div>

          {/* Gold divider */}
          <div className="my-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />

          {/* Quota progress */}
          <div className="bg-black/20 rounded-2xl p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-yellow-300 text-xs font-bold">🎯 โควต้าสปิน</span>
              <span className="text-white text-xs font-black">{stats.quota_remaining} เหลือ</span>
            </div>
            <div className="h-3 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width:0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration:1.2, delay:.3, ease:[.16,1,.3,1] }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1.5">
              <span className="text-red-200">ใช้ไป {stats.quota_used}</span>
              <span className="text-yellow-300 font-bold">{pct}%</span>
              <span className="text-red-200">ทั้งหมด {stats.quota_total}</span>
            </div>
          </div>
        </div>

        {/* Gold bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)' }} />
      </motion.div>

      {/* Stats grid - lottery ticket style */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          { label:'สปินทั้งหมด', value:stats.quota_total,     icon:'🎯', color:'#CC0000' },
          { label:'ใช้ไปแล้ว',   value:stats.quota_used,      icon:'🎰', color:'#8B0000' },
          { label:'เหลืออยู่',   value:stats.quota_remaining, icon:'✨', color:'#B8860B' },
          { label:'สปินวันนี้',  value:todaySpins,            icon:'📊', color:'#CC0000' },
          { label:'คูปอง',       value:stats.total_coupons,   icon:'🏷️', color:'#8B0000' },
          { label:'ใบเสร็จ',     value:stats.total_receipts,  icon:'📄', color:'#B8860B' },
        ].map((c, i) => (
          <motion.div key={c.label}
            initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:.08*i+.1 }}
            className="rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}88)` }} />
            <div className="bg-amber-50 p-3 text-center border border-amber-100 rounded-b-2xl">
              <div className="text-xl mb-1">{c.icon}</div>
              <div className="text-2xl font-black" style={{ color: c.color }}>
                <CountUp end={c.value} duration={1.5} delay={.1+i*.05} />
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{c.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Menu - lottery card style */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}>
        <div className="text-xs font-black text-gray-500 mb-3 tracking-widest">เมนูหลัก</div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/merchant/upload"
            className="relative rounded-2xl overflow-hidden shadow-md group">
            <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,#CC0000,#8B0000)' }} />
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage:'repeating-linear-gradient(45deg,#FFD700 0px,#FFD700 1px,transparent 1px,transparent 15px)' }} />
            <div className="relative p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">📷</div>
              <div>
                <div className="text-white font-black text-sm">อัพโหลดใบเสร็จ</div>
                <div className="text-red-200 text-xs">1 ถุง = 30 สปิน</div>
              </div>
            </div>
          </Link>

          <Link href="/merchant/qrcodes"
            className="relative rounded-2xl overflow-hidden shadow-md group">
            <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,#B8860B,#8B6914)' }} />
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage:'repeating-linear-gradient(45deg,#FFD700 0px,#FFD700 1px,transparent 1px,transparent 15px)' }} />
            <div className="relative p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">📱</div>
              <div>
                <div className="text-white font-black text-sm">QR Code ร้าน</div>
                <div className="text-yellow-200 text-xs">ดาวน์โหลด / แชร์</div>
              </div>
            </div>
          </Link>

          <Link href="/merchant/history"
            className="relative rounded-2xl overflow-hidden shadow-md col-span-2">
            <div className="absolute inset-0 bg-amber-50 border border-amber-200 rounded-2xl" />
            <div className="relative p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background:'linear-gradient(135deg,#FFD700,#FFA500)' }}>📋</div>
              <div>
                <div className="font-black text-sm text-gray-800">ประวัติการใช้งาน</div>
                <div className="text-xs text-gray-400">Spin &amp; Coupon history</div>
              </div>
              <div className="ml-auto text-gray-300 text-lg">›</div>
            </div>
          </Link>
        </div>
      </motion.div>
    </MerchantLayout>
  )
}
