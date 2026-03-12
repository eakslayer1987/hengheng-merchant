'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('merchant_token', data.token)
        window.location.href = '/dashboard'
      } else {
        setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      }
    } catch { setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่') }
    finally { setLoading(false) }
  }

  const ic = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-dark-gradient p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{background:'radial-gradient(ellipse 80% 60% at 50% 20%,rgba(253,24,3,.15),transparent 70%)'}}/>
        <Link href="/" className="flex items-center gap-2.5 z-10 relative">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-orange"
            style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>🐻</div>
          <div>
            <div className="text-[16px] font-extrabold text-white leading-none">เฮงเฮงปังจัง</div>
            <div className="text-[11px] font-bold leading-none mt-0.5" style={{color:'#fd1803'}}>Merchant Loyalty Platform</div>
          </div>
        </Link>
        <div className="z-10 relative">
          <blockquote className="text-2xl font-extrabold text-white leading-relaxed mb-5">
            "จัดการ Loyalty ร้านค้า<br/>วัดผลได้จริง ทุกคำกิน"
          </blockquote>
          <div className="flex gap-3">
            {[['2,500+','ร้านค้า'],['50K+','QR Code'],['1.2M+','แต้ม']].map(([n,l]) => (
              <div key={l} className="bg-white/10 rounded-xl px-4 py-2.5 text-center border border-white/10">
                <div className="text-lg font-black text-white">{n}</div>
                <div className="text-[10px] text-white/50 font-semibold">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/30 z-10 relative">© 2025 เฮงเฮงปังจัง.com</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-orange"
              style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>🐻</div>
            <div>
              <div className="text-[15px] font-extrabold text-gray-900 leading-none">เฮงเฮงปังจัง</div>
              <div className="text-[10px] font-bold leading-none mt-0.5" style={{color:'#fd1803'}}>Merchant Loyalty Platform</div>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500 mb-8">ยินดีต้อนรับกลับมา จัดการร้านค้าของคุณได้เลย</p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 font-medium">⚠️ {error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">อีเมล</label>
              <input type="email" required autoComplete="email" placeholder="merchant@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className={ic} style={{borderColor: form.email ? '#fd1803' : ''}}
                onFocus={e => e.target.style.borderColor = '#fd1803'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}/>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-bold text-gray-700">รหัสผ่าน</label>
                <a href="#" className="text-xs font-bold transition-colors" style={{color:'#fd1803'}}>ลืมรหัสผ่าน?</a>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className={ic + ' pr-12'}
                  onFocus={e => e.target.style.borderColor = '#fd1803'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}/>
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-extrabold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-1 shadow-orange"
              style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>
              {loading && <Loader2 size={16} className="animate-spin"/>}
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ →'}
            </button>
          </form>
          <p className="text-sm text-gray-500 text-center mt-6">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="font-bold transition-colors" style={{color:'#fd1803'}}>สมัครฟรีตอนนี้</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
