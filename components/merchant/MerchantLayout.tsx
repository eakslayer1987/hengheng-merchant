'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/merchant/dashboard', icon: '📊', label: 'ภาพรวม' },
  { href: '/merchant/upload',    icon: '📷', label: 'อัพโหลดใบเสร็จ' },
  { href: '/merchant/qrcodes',   icon: '📱', label: 'QR Code' },
  { href: '/merchant/history',   icon: '📋', label: 'ประวัติ' },
]

export default function MerchantLayout({
  children,
  storeName,
}: {
  children: React.ReactNode
  storeName?: string
}) {
  const path     = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  async function logout() {
    await axios.post('/api/logout')
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white text-sm font-black">
              🐻
            </div>
            <div>
              <div className="text-xs text-gray-400 leading-none">เฮงเฮงปังจัง</div>
              <div className="text-sm font-bold text-gray-900 leading-tight truncate max-w-[160px]">
                {storeName || 'ร้านค้า'}
              </div>
            </div>
          </div>
          <button onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
            ⚙️
          </button>
        </div>
      </header>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }} transition={{ duration:.15 }}
            className="fixed top-14 right-4 z-50 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden"
          >
            <button onClick={logout}
              className="flex items-center gap-2 px-5 py-3 text-sm text-red-500 font-semibold w-full hover:bg-red-50">
              🚪 ออกจากระบบ
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Bottom tab bar */}
      <nav className="bg-white border-t border-gray-100 sticky bottom-0 z-40">
        <div className="max-w-lg mx-auto grid grid-cols-4">
          {NAV.map(item => {
            const active = path === item.href
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex flex-col items-center gap-0.5 py-3 transition-colors',
                  active ? 'text-brand-600' : 'text-gray-400'
                )}>
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="text-[10px] font-semibold">{item.label}</span>
                {active && (
                  <motion.div layoutId="tab-indicator"
                    className="absolute bottom-0 w-8 h-0.5 bg-brand-600 rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
