'use client'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import Link from 'next/link'

const fadeUp = (delay = 0) => ({
  initial: { opacity:0, y:16 },
  animate: { opacity:1, y:0 },
  transition: { duration:.45, delay, ease:[.16,1,.3,1] },
})

export default function AdminDashboardClient({
  stats, spinChart,
}: {
  stats: { total_merchants:number; total_customers:number; total_spins:number; total_coupons:number; pending_receipts:number }
  spinChart: { date:string; count:number }[]
}) {
  const max = Math.max(...spinChart.map(s => s.count), 1)

  const cards = [
    { label:'ร้านค้า',         value:stats.total_merchants,  color:'bg-brand-50 text-brand-700',  icon:'🏪' },
    { label:'ลูกค้า',           value:stats.total_customers,  color:'bg-blue-50 text-blue-700',    icon:'👥' },
    { label:'Total Spins',     value:stats.total_spins,      color:'bg-green-50 text-green-700',  icon:'🎰' },
    { label:'Coupons',          value:stats.total_coupons,    color:'bg-yellow-50 text-yellow-700',icon:'🏷️' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">ภาพรวมระบบทั้งหมด</p>
        </div>
        {stats.pending_receipts > 0 && (
          <Link href="/admin/receipts"
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600
              rounded-2xl px-4 py-2 text-sm font-bold">
            <span className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-black">
              {stats.pending_receipts}
            </span>
            ใบเสร็จรออนุมัติ
          </Link>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {cards.map((c, i) => (
          <motion.div key={c.label} {...fadeUp(.06*i)}
            className={`${c.color.split(' ')[0]} rounded-2xl p-4`}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className={`text-3xl font-black ${c.color.split(' ')[1]}`}>
              <CountUp end={c.value} duration={1.5} delay={.1+i*.05} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Spin chart */}
      <motion.div {...fadeUp(.2)}
        className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Spins รายวัน (7 วันล่าสุด)</h2>
        {spinChart.length === 0 ? (
          <div className="text-center text-gray-300 py-8 text-sm">ยังไม่มีข้อมูล</div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {spinChart.map((s, i) => (
              <div key={s.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs font-bold text-brand-600">{s.count}</div>
                <motion.div
                  initial={{ height:0 }} animate={{ height: `${(s.count/max)*96}px` }}
                  transition={{ duration:.6, delay:.05*i, ease:[.16,1,.3,1] }}
                  className="w-full bg-brand-400 rounded-t-lg"
                />
                <div className="text-[9px] text-gray-400">
                  {new Date(s.date).toLocaleDateString('th-TH', { day:'numeric', month:'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick links */}
      <motion.div {...fadeUp(.25)}>
        <h2 className="text-sm font-bold text-gray-700 mb-3">จัดการระบบ</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { href:'/admin/merchants', icon:'🏪', label:'จัดการร้านค้า',   desc:'อนุมัติ / ระงับ' },
            { href:'/admin/receipts',  icon:'📄', label:'อนุมัติใบเสร็จ',  desc:`${stats.pending_receipts} รายการรอ` },
            { href:'/admin/rewards',   icon:'🎁', label:'ตั้งค่ารางวัล',   desc:'ปรับความน่าจะเป็น' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center gap-3 hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
