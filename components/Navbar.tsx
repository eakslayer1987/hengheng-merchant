'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'หน้าแรก',    href: '#hero' },
  { label: 'ฟีเจอร์',    href: '#features' },
  { label: 'วิธีทำงาน', href: '#how' },
  { label: 'แพ็กเกจ',   href: '#pricing' },
  { label: 'ช่วยเหลือ', href: '#faq' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-orange transition-transform group-hover:rotate-[-8deg] group-hover:scale-110"
            style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>🐻</div>
          <div>
            <div className="text-[15px] font-extrabold text-gray-900 leading-none">เฮงเฮงปังจัง</div>
            <div className="text-[10px] font-bold leading-none mt-0.5" style={{color:'#fd1803'}}>Merchant Loyalty Platform</div>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(l => (
            <a key={l.label} href={l.href}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login"
            className="px-5 py-2 rounded-lg text-sm font-bold text-gray-700 border border-gray-200 hover:border-gray-300 bg-white transition-colors">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register"
            className="px-5 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-orange"
            style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>
            สมัครใช้งานฟรี →
          </Link>
        </div>
        <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 pb-5">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <hr className="my-2 border-gray-100" />
            <Link href="/login" className="px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg">เข้าสู่ระบบ</Link>
            <Link href="/register" className="px-3 py-2.5 text-sm font-bold text-white rounded-lg text-center"
              style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>สมัครใช้งานฟรี</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
