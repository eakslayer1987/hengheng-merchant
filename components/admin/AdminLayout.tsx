'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import axios from 'axios'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin/dashboard', icon: '📊', label: 'ภาพรวม' },
  { href: '/admin/merchants', icon: '🏪', label: 'ร้านค้า' },
  { href: '/admin/receipts',  icon: '📄', label: 'ใบเสร็จ' },
  { href: '/admin/rewards',   icon: '🎁', label: 'รางวัล' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path   = usePathname()
  const router = useRouter()

  async function logout() {
    await axios.post('/api/logout')
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for tablet+ / Top bar for mobile */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white text-sm">🐻</div>
            <span className="text-sm font-black text-gray-900">Admin Panel</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                  path === item.href ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50'
                )}>
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </div>
          <button onClick={logout}
            className="text-sm text-red-500 font-semibold px-3 py-1.5 rounded-xl hover:bg-red-50">
            ออกจากระบบ
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden bg-white border-t border-gray-100 fixed bottom-0 inset-x-0 z-40">
        <div className="grid grid-cols-4 max-w-lg mx-auto">
          {NAV.map(item => {
            const active = path === item.href
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex flex-col items-center gap-0.5 py-3 text-xs font-semibold',
                  active ? 'text-brand-600' : 'text-gray-400'
                )}>
                <span className="text-xl">{item.icon}</span>{item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
