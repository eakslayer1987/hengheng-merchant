'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, MapPin, Navigation, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeUp = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0} }
const fadeIn  = { hidden:{opacity:0}, visible:{opacity:1} }

type GPSState = 'idle'|'loading'|'success'|'error'
interface Coords { lat:number; lng:number }

function useGPS() {
  const [state, setState] = useState<GPSState>('idle')
  const [coords, setCoords] = useState<Coords|null>(null)
  const [error, setError] = useState('')
  const detect = useCallback(() => {
    if (!navigator.geolocation) { setError('Browser ไม่รองรับ GPS'); setState('error'); return }
    setState('loading')
    navigator.geolocation.getCurrentPosition(
      pos => { setCoords({ lat:pos.coords.latitude, lng:pos.coords.longitude }); setState('success') },
      err => { setError(err.code===1?'ไม่ได้รับอนุญาต GPS กรุณากรอกที่อยู่แทน':'ระบุตำแหน่งไม่ได้'); setState('error') },
      { timeout:10000, enableHighAccuracy:true }
    )
  }, [])
  return { state, coords, error, detect }
}

export default function RegisterPage() {
  const [form, setForm] = useState({ shop_name:'', owner_name:'', email:'', phone:'', password:'', confirm_password:'', address:'' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const gps = useGPS()
  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) { setError('รหัสผ่านไม่ตรงกัน'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register.php`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, lat:gps.coords?.lat??null, lng:gps.coords?.lng??null }),
      })
      const data = await res.json()
      if (data.success) setSuccess(true)
      else setError(data.message||'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } catch { setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div className="bg-white rounded-2xl shadow-card p-12 text-center max-w-md w-full"
        initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{type:'spring',bounce:.4}}>
        <motion.div className="text-6xl mb-5" animate={{rotate:[0,15,-10,15,0]}} transition={{delay:.2,duration:.6}}>🎉</motion.div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">สมัครสำเร็จแล้ว!</h2>
        <p className="text-gray-500 text-sm mb-8">ตรวจสอบอีเมลเพื่อยืนยันบัญชี จากนั้นเข้าสู่ระบบได้เลย</p>
        <Link href="/login" className="w-full py-3.5 rounded-xl text-sm font-extrabold text-white hover:opacity-90 block text-center shadow-orange"
          style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>ไปหน้าเข้าสู่ระบบ →</Link>
      </motion.div>
    </div>
  )

  const ic = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all"
  const focusStyle = { onFocus:(e:any)=>e.target.style.borderColor='#fd1803', onBlur:(e:any)=>e.target.style.borderColor='#e5e7eb' }

  return (
    <div className="min-h-screen flex">
      <motion.div className="hidden lg:flex flex-col justify-between w-[440px] bg-dark-gradient p-12 relative overflow-hidden"
        initial={{x:-60,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.7,ease:[.22,1,.36,1]}}>
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
          <h2 className="text-2xl font-extrabold text-white mb-6">สิ่งที่คุณจะได้รับ</h2>
          <div className="flex flex-col gap-4">
            {[['⚡','QR Code Loyalty พร้อมใช้ใน 15 นาที'],['🤖','AI วิเคราะห์พฤติกรรมลูกค้าอัตโนมัติ'],['📍','แสดงร้านบนแผนที่ใกล้เคียงลูกค้า'],['🎁','แต้มโอนข้าม Grab / LINE MAN ได้']].map(([ico,t],i)=>(
              <motion.div key={t} className="flex items-center gap-3"
                initial={fadeUp.hidden} animate={fadeUp.visible} transition={{delay:.3+i*.1,duration:.55}}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{background:'rgba(253,24,3,.15)',border:'1px solid rgba(253,24,3,.25)'}}>{ico}</div>
                <span className="text-sm font-semibold text-white/80">{t}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/30 z-10 relative">© 2025 เฮงเฮงปังจัง.com</p>
      </motion.div>

      <div className="flex-1 flex items-start justify-center bg-gray-50 p-6 overflow-y-auto">
        <motion.div className="w-full max-w-[520px] py-10"
          initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:[.22,1,.36,1],delay:.15}}>
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-orange"
              style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>🐻</div>
            <div>
              <div className="text-[15px] font-extrabold text-gray-900 leading-none">เฮงเฮงปังจัง</div>
              <div className="text-[10px] font-bold leading-none mt-0.5" style={{color:'#fd1803'}}>Merchant Loyalty Platform</div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">สมัครใช้งานฟรี</h1>
          <p className="text-sm text-gray-500 mb-7">ไม่ต้องใส่บัตรเครดิต เริ่มออก QR Code ได้ทันที</p>

          <AnimatePresence>
            {error && (
              <motion.div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 font-medium"
                initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>⚠️ {error}</motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2"><label className="block text-sm font-bold text-gray-700 mb-1.5">ชื่อร้านค้า</label><input type="text" required placeholder="ร้านกะเพราป้าแดง" value={form.shop_name} onChange={set('shop_name')} className={ic} {...focusStyle}/></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">ชื่อเจ้าของร้าน</label><input type="text" required placeholder="สมใจ ใจดี" value={form.owner_name} onChange={set('owner_name')} className={ic} {...focusStyle}/></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">เบอร์โทร</label><input type="tel" required placeholder="08X-XXX-XXXX" value={form.phone} onChange={set('phone')} className={ic} {...focusStyle}/></div>
              <div className="col-span-2"><label className="block text-sm font-bold text-gray-700 mb-1.5">อีเมล</label><input type="email" required placeholder="shop@example.com" value={form.email} onChange={set('email')} className={ic} {...focusStyle}/></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">รหัสผ่าน</label><div className="relative"><input type={showPw?'text':'password'} required minLength={8} placeholder="อย่างน้อย 8 ตัว" value={form.password} onChange={set('password')} className={ic+' pr-11'} {...focusStyle}/><button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">ยืนยันรหัสผ่าน</label><input type={showPw?'text':'password'} required placeholder="••••••••" value={form.confirm_password} onChange={set('confirm_password')} className={ic} {...focusStyle}/></div>
            </div>

            {/* GPS */}
            <motion.div className="rounded-2xl p-5 mb-5 relative overflow-hidden"
              style={{background:'rgba(253,24,3,.04)',border:'1.5px solid rgba(253,24,3,.2)'}}
              initial={fadeUp.hidden} animate={fadeUp.visible} transition={{delay:.2,duration:.55}}>
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                style={{background:'linear-gradient(90deg,#fd1803,#ff8070)'}}/>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-orange"
                  style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}><MapPin size={18} color="white"/></div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900">ตำแหน่งร้านค้า (GPS)</div>
                  <div className="text-xs text-gray-500">ใช้แสดงบนแผนที่และระบบ AI Dynamic Rewards</div>
                </div>
              </div>
              <div className={`relative h-36 rounded-xl border-2 flex flex-col items-center justify-center mb-4 overflow-hidden cursor-pointer transition-all
                ${gps.state==='success'?'bg-green-50 border-green-400':'bg-white border-dashed border-gray-300 hover:border-[#fd1803] hover:bg-red-50/30'}`}
                onClick={gps.detect}>
                <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px)',backgroundSize:'22px 22px'}}/>
                <AnimatePresence mode="wait">
                  {gps.state==='idle'&&<motion.div key="idle" className="flex flex-col items-center gap-1 z-10" initial={fadeIn.hidden} animate={fadeIn.visible} exit={fadeIn.hidden}><span className="text-3xl">📍</span><span className="text-sm font-bold text-gray-500">คลิกเพื่อระบุตำแหน่ง</span><span className="text-xs text-gray-400">ระบบจะขอสิทธิ์ GPS</span></motion.div>}
                  {gps.state==='loading'&&<motion.div key="loading" className="flex flex-col items-center gap-2 z-10" initial={fadeIn.hidden} animate={fadeIn.visible} exit={fadeIn.hidden}><div className="relative w-10 h-10 flex items-center justify-center"><motion.div className="absolute inset-0 rounded-full" style={{background:'rgba(253,24,3,.2)'}} animate={{scale:[1,1.8],opacity:[.8,0]}} transition={{repeat:Infinity,duration:1.2}}/><Navigation size={18} className="relative z-10" style={{color:'#fd1803'}}/></div><span className="text-sm font-bold" style={{color:'#fd1803'}}>กำลังระบุตำแหน่ง...</span></motion.div>}
                  {gps.state==='success'&&gps.coords&&<motion.div key="ok" className="flex flex-col items-center gap-1 z-10" initial={{scale:.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',bounce:.5}}><CheckCircle2 size={28} className="text-green-500"/><span className="text-sm font-bold text-green-700">ระบุตำแหน่งสำเร็จ!</span><span className="text-xs font-mono text-green-600">{gps.coords.lat.toFixed(5)}, {gps.coords.lng.toFixed(5)}</span></motion.div>}
                  {gps.state==='error'&&<motion.div key="err" className="flex flex-col items-center gap-1 z-10 px-4 text-center" initial={fadeIn.hidden} animate={fadeIn.visible}><span className="text-2xl">⚠️</span><span className="text-xs text-red-500 font-semibold">{gps.error}</span></motion.div>}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {gps.coords&&<motion.div className="grid grid-cols-2 gap-2 mb-3" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>
                  {[['Latitude',gps.coords.lat.toFixed(6)],['Longitude',gps.coords.lng.toFixed(6)]].map(([l,v])=>(
                    <div key={l} className="bg-white border border-gray-200 rounded-xl px-3 py-2"><div className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">{l}</div><div className="text-sm font-bold text-gray-800 font-mono">{v}</div></div>
                  ))}
                </motion.div>}
              </AnimatePresence>
              <button type="button" onClick={gps.detect} disabled={gps.state==='loading'}
                className={`w-full py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${gps.state==='success'?'bg-green-500 text-white':'text-white hover:opacity-90 shadow-orange'} disabled:opacity-60`}
                style={gps.state!=='success'?{background:'linear-gradient(135deg,#fd1803,#e01502)'}:{}}>
                {gps.state==='loading'&&<Loader2 size={14} className="animate-spin"/>}
                {gps.state==='success'?'✅ ระบุแล้ว — คลิกเพื่ออัปเดต':'📍 ระบุตำแหน่ง GPS อัตโนมัติ'}
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-2">หรือพิมพ์ที่อยู่ร้านด้านล่างแทน</p>
              <input type="text" placeholder="เช่น 123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110" value={form.address} onChange={set('address')} className={ic+' mt-2 text-[13px]'} {...focusStyle}/>
            </motion.div>

            <p className="text-xs text-gray-400 mb-5">เมื่อสมัคร คุณยอมรับ <a href="#" className="font-bold" style={{color:'#fd1803'}}>เงื่อนไขการใช้งาน</a> และ <a href="#" className="font-bold" style={{color:'#fd1803'}}>นโยบายความเป็นส่วนตัว</a></p>
            <motion.button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-extrabold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-orange"
              style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}
              whileTap={{scale:.97}}>
              {loading&&<Loader2 size={16} className="animate-spin"/>}
              {loading?'กำลังสร้างบัญชี...':'สร้างบัญชีฟรี →'}
            </motion.button>
          </form>
          <p className="text-sm text-gray-500 text-center mt-5">มีบัญชีอยู่แล้ว? <Link href="/login" className="font-bold transition-colors" style={{color:'#fd1803'}}>เข้าสู่ระบบ</Link></p>
        </motion.div>
      </div>
    </div>
  )
}
