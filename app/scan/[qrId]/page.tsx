'use client'
// ─────────────────────────────────────────────────────────────
//  app/scan/[qrId]/page.tsx
//  ลูกค้าสแกน QR → เห็นข้อมูลร้าน → ลงทะเบียน/เข้าสู่ระบบ
// ─────────────────────────────────────────────────────────────
import { useEffect, useState, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiFetch, type QRInfo } from '@/lib/api'
import { MapPin, Phone, Shield, ChevronRight, Star, Loader2 } from 'lucide-react'

type Step = 'loading' | 'info' | 'phone' | 'otp' | 'error'

export default function ScanPage() {
  const { qrId } = useParams<{ qrId: string }>()
  const router = useRouter()
  const [step, setStep] = useState<Step>('loading')
  const [qrInfo, setQrInfo] = useState<QRInfo | null>(null)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  // ── Load QR info ───────────────────────────────────────────
  useEffect(() => {
    apiFetch<QRInfo>(`/qr/info.php?qr_id=${qrId}`)
      .then(data => { setQrInfo(data); setStep('info') })
      .catch(() => setStep('error'))
  }, [qrId])

  // ── Send OTP ───────────────────────────────────────────────
  async function sendOtp() {
    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('กรุณากรอกเบอร์โทรให้ถูกต้อง')
      return
    }
    setErrorMsg('')
    startTransition(async () => {
      try {
        await apiFetch('/auth/send-otp.php', {
          method: 'POST',
          body: JSON.stringify({ phone: phone.replace(/\D/g, ''), qr_id: qrId }),
        })
        setStep('otp')
      } catch {
        setErrorMsg('ส่ง OTP ไม่สำเร็จ กรุณาลองใหม่')
      }
    })
  }

  // ── Verify OTP ─────────────────────────────────────────────
  async function verifyOtp() {
    const code = otp.join('')
    if (code.length < 6) return
    startTransition(async () => {
      try {
        const res = await apiFetch<{ token: string; is_new: boolean }>(
          '/auth/verify-otp.php',
          { method: 'POST', body: JSON.stringify({ phone: phone.replace(/\D/g, ''), otp: code, qr_id: qrId }) }
        )
        localStorage.setItem('hh_token', res.token)
        localStorage.setItem('hh_qr', qrId)
        router.push(`/spin?qr=${qrId}`)
      } catch {
        setErrorMsg('รหัส OTP ไม่ถูกต้อง')
        setOtp(['', '', '', '', '', ''])
      }
    })
  }

  // ── OTP input handler ──────────────────────────────────────
  function handleOtpChange(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus()
    }
    if (next.join('').length === 6) {
      setTimeout(verifyOtp, 100)
    }
  }

  // ── Remaining bar ──────────────────────────────────────────
  const pct = qrInfo ? Math.round((qrInfo.remaining_codes / qrInfo.total_codes) * 100) : 0

  // ══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">

      {/* ── LOADING ── */}
      {step === 'loading' && (
        <div className="glass-card p-10 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-red-500" size={40} />
          <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลร้าน…</p>
        </div>
      )}

      {/* ── ERROR ── */}
      {step === 'error' && (
        <div className="glass-card p-10 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">😢</div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">QR Code หมดอายุ</h3>
          <p className="text-gray-500">QR นี้ใช้งานไม่ได้แล้ว หรือโควต้าหมดแล้วครับ</p>
        </div>
      )}

      {/* ── INFO STEP ── */}
      {step === 'info' && qrInfo && (
        <div className="w-full max-w-sm flex flex-col gap-4">
          {/* Header Brand */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 shadow-sm text-xs font-bold text-red-500 border border-red-100 mb-3">
              🐻 เฮงเฮงปังจัง Loyalty
            </div>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">ยินดีต้อนรับ!</h1>
            <p className="text-gray-500 text-sm mt-1">สแกนเพื่อลุ้นรับสิทธิ์พิเศษ</p>
          </div>

          {/* Merchant Card */}
          <div className="glass-card p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md"
                style={{ background: 'linear-gradient(135deg,#fd1803,#e01502)' }}>
                🍽️
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-extrabold text-gray-900 leading-tight">{qrInfo.merchant_name}</h2>
                <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                  <MapPin size={11} />
                  <span className="truncate">{qrInfo.merchant_address || 'ร้านค้าพาร์ทเนอร์'}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">ร้านรับรอง</span>
                </div>
              </div>
            </div>

            {/* Quota bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>สิทธิ์คงเหลือ</span>
                <span className="font-bold text-red-500">{qrInfo.remaining_codes} / {qrInfo.total_codes}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#fd1803,#ff6b4a)' }} />
              </div>
              {qrInfo.remaining_codes <= 5 && (
                <p className="text-xs text-red-500 font-medium mt-1.5 text-center animate-pulse">
                  ⚡ เหลือสิทธิ์น้อยมาก! รีบด่วน
                </p>
              )}
            </div>
          </div>

          {/* Prize teaser */}
          <div className="glass-card p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">ลุ้นรับ</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🏷️', label: 'ส่วนลด 10 บาท', sub: 'โค้ดลดค่าซอส' },
                { icon: '🍛', label: 'ทานฟรีมื้อนี้', sub: 'ลุ้นได้เลย!' },
                { icon: '🎟️', label: 'ลุ้นโชคใหญ่', sub: 'สะสมสิทธิ์' },
                { icon: '⭐', label: 'คะแนนสะสม', sub: 'แลกของพรีเมียม' },
              ].map(p => (
                <div key={p.label} className="bg-white/60 rounded-xl p-2.5 text-center">
                  <div className="text-xl mb-0.5">{p.icon}</div>
                  <div className="text-xs font-bold text-gray-800">{p.label}</div>
                  <div className="text-[10px] text-gray-400">{p.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('phone')}
            className="w-full h-14 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(253,24,3,0.4)] active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg,#fd1803,#e01502)' }}>
            รับสิทธิ์เลย! <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* ── PHONE STEP ── */}
      {step === 'phone' && (
        <div className="w-full max-w-sm flex flex-col gap-5">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-md"
              style={{ background: 'linear-gradient(135deg,#fd1803,#e01502)' }}>📱</div>
            <h2 className="text-2xl font-black text-gray-900">กรอกเบอร์โทรศัพท์</h2>
            <p className="text-gray-400 text-sm mt-1">เพื่อรับ OTP ยืนยันตัวตน</p>
          </div>

          <div className="glass-card p-5 flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                <Phone size={11} className="inline mr-1" />เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
                placeholder="0xx-xxx-xxxx"
                maxLength={12}
                className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-red-400 outline-none text-gray-900 font-bold text-lg tracking-widest bg-white/80 transition-colors"
              />
              {errorMsg && <p className="text-red-500 text-xs mt-1.5 font-medium">{errorMsg}</p>}
            </div>

            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
              <Shield size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-500 leading-relaxed">
                เบอร์โทรของคุณจะถูกใช้เพื่อยืนยันตัวตนและรับสิทธิ์เท่านั้น ไม่มีการเปิดเผยต่อบุคคลที่สาม
              </p>
            </div>

            <button
              onClick={sendOtp}
              disabled={isPending}
              className="w-full h-12 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(253,24,3,0.35)] disabled:opacity-60 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#fd1803,#e01502)' }}>
              {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
              {isPending ? 'กำลังส่ง OTP…' : 'ส่ง OTP →'}
            </button>
          </div>
        </div>
      )}

      {/* ── OTP STEP ── */}
      {step === 'otp' && (
        <div className="w-full max-w-sm flex flex-col gap-5">
          <div className="text-center">
            <div className="text-4xl mb-3">💬</div>
            <h2 className="text-2xl font-black text-gray-900">กรอกรหัส OTP</h2>
            <p className="text-gray-400 text-sm mt-1">
              ส่งไปที่ <strong className="text-gray-700">{phone}</strong>
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center gap-5">
            {/* OTP boxes */}
            <div className="flex gap-2.5">
              {otp.map((v, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !v && i > 0)
                      document.getElementById(`otp-${i - 1}`)?.focus()
                  }}
                  className="w-11 h-14 rounded-xl border-2 text-center text-xl font-black outline-none transition-colors bg-white/80"
                  style={{ borderColor: v ? '#fd1803' : '#e5e7eb', color: '#111' }}
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm font-medium text-center">{errorMsg}</p>
            )}

            {isPending && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 size={16} className="animate-spin" />
                กำลังตรวจสอบ…
              </div>
            )}

            <button
              onClick={() => setStep('phone')}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              ไม่ได้รับ OTP? ส่งใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
