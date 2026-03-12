'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const RED = '#fd1803'
const navLinks = [
  { label:'หน้าแรก',    href:'/' },
  { label:'ฟีเจอร์',    href:'/#features' },
  { label:'วิธีทำงาน', href:'/#how' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:50,
      background:'rgba(255,255,255,0.72)',
      backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
      borderBottom:'1px solid rgba(255,255,255,0.55)',
      boxShadow:'0 2px 24px rgba(0,0,0,0.06)',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px',
        height:64, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>

        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{
            width:38, height:38, borderRadius:12,
            background:`linear-gradient(135deg,${RED},#c01002)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, boxShadow:`0 4px 16px ${RED}45`,
          }}>🐻</div>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:'#0a0a0f', lineHeight:1 }}>เฮงเฮงปังจัง</div>
            <div style={{ fontSize:10, fontWeight:700, color:RED, letterSpacing:1, marginTop:2 }}>MERCHANT LOYALTY</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display:'flex', alignItems:'center', gap:4 }} className="hidden lg:flex">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} style={{
              padding:'8px 16px', borderRadius:10,
              fontSize:14, fontWeight:700, color:'#374151',
              textDecoration:'none', transition:'all .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = RED; (e.currentTarget as HTMLElement).style.background = `${RED}0e` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#374151'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }} className="hidden lg:flex">
          <Link href="/login" style={{
            padding:'9px 20px', borderRadius:12,
            border:'1.5px solid rgba(0,0,0,.12)',
            background:'rgba(255,255,255,.6)',
            fontSize:14, fontWeight:700, color:'#374151',
            textDecoration:'none', transition:'all .2s',
          }}>เข้าสู่ระบบ</Link>
          <Link href="/register" style={{
            padding:'9px 20px', borderRadius:12,
            background:`linear-gradient(135deg,${RED},#c01002)`,
            fontSize:14, fontWeight:900, color:'#fff',
            textDecoration:'none', boxShadow:`0 4px 18px ${RED}45`,
            transition:'all .2s',
          }}>สมัครฟรี →</Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} style={{
          display:'flex', background:'none', border:'none',
          cursor:'pointer', padding:8, borderRadius:8,
          color:'#374151',
        }} className="lg:hidden">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          borderTop:'1px solid rgba(255,255,255,.5)',
          background:'rgba(255,255,255,.88)',
          backdropFilter:'blur(20px)',
          padding:'12px 24px 20px',
        }} className="lg:hidden">
          {navLinks.map(l => (
            <a key={l.label} href={l.href}
              onClick={() => setOpen(false)}
              style={{ display:'block', padding:'10px 8px', fontSize:14,
                fontWeight:700, color:'#374151', textDecoration:'none', borderRadius:10 }}>
              {l.label}
            </a>
          ))}
          <div style={{ height:1, background:'rgba(0,0,0,.07)', margin:'10px 0' }}/>
          <Link href="/login" onClick={() => setOpen(false)}
            style={{ display:'block', padding:'10px 8px', fontSize:14,
              fontWeight:700, color:'#374151', textDecoration:'none' }}>
            เข้าสู่ระบบ
          </Link>
          <Link href="/register" onClick={() => setOpen(false)}
            style={{ display:'block', margin:'8px 0 0',
              padding:'12px', borderRadius:12, textAlign:'center',
              background:`linear-gradient(135deg,${RED},#c01002)`,
              fontSize:14, fontWeight:900, color:'#fff', textDecoration:'none' }}>
            สมัครฟรี →
          </Link>
        </div>
      )}
    </nav>
  )
}
