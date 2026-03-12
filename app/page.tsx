'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const RED = '#fd1803'
const RED2 = '#e01502'
const DARK = '#1C1C2E'

/* ─── Flow Steps ─── */
const merchantFlow = [
  { icon: '🛒', title: 'ร้านค้าซื้อซอสเฮงเฮงปังจัง', desc: 'ทุกกล่อง/แกลลอนมี QR Code หรือรหัสหลังฝาไว้ให้สแกน' },
  { icon: '📱', title: 'สแกนรับแต้ม CRM', desc: 'ร้านค้าสแกนผ่าน LINE OA ได้แต้มสะสมเข้าบัญชีร้านทันที' },
  { icon: '🪧', title: 'รับสแตนดี้ QR ไปตั้งโต๊ะ', desc: 'แบรนด์ส่งป้ายสแตนดี้ฝัง Shop ID ให้ร้านตั้งที่โต๊ะอาหาร' },
  { icon: '🎁', title: 'ลูกค้าสแกน → ร้านได้รางวัลด้วย!', desc: 'เมื่อลูกค้าถูกรางวัล ระบบแจ้งเตือนร้านทันที ได้รางวัลพร้อมกัน' },
]

const consumerFlow = [
  { icon: '🍽️', title: 'ลูกค้ามาทานอาหาร', desc: 'เห็นสแตนดี้เฮงเฮงปังจังบนโต๊ะ' },
  { icon: '📷', title: 'สแกน QR ผ่านมือถือ', desc: 'ไม่ต้องโหลดแอปเพิ่ม ใช้แค่ LINE ที่มีอยู่แล้ว' },
  { icon: '🎰', title: 'หมุนวงล้อ / เปิดกล่องสุ่ม', desc: 'ลุ้นรางวัลทันที กินฟรีมื้อนี้, ส่วนลด, ของพรีเมียม' },
  { icon: '🏆', title: 'ถูกรางวัล! ร้านได้ด้วย!', desc: 'ลูกค้าได้รางวัล ร้านได้ซอสฟรี/เงินสด/แต้มพิเศษพร้อมกัน' },
]

const rewards = [
  { prob: '1%', icon: '🎉', label: 'รางวัลใหญ่', desc: 'กินฟรีมื้อนี้ + ซอสฟรี 1 ลัง', color: '#FFD700' },
  { prob: '20%', icon: '🎁', label: 'รางวัลเล็ก', desc: 'ส่วนลด / ของพรีเมียม', color: '#fd1803' },
  { prob: '79%', icon: '⭐', label: 'แต้มสะสม', desc: 'แต้มเข้า LINE OA อัตโนมัติ', color: '#8B5CF6' },
]

const features = [
  { icon: '🔐', title: 'Unique QR Code', desc: 'แต่ละล็อตสินค้ามี QR เฉพาะ ป้องกันการปลอมแปลง 100%' },
  { icon: '🎰', title: 'Gamification Engine', desc: 'ตั้งค่าโควต้าและความน่าจะเป็นรางวัลได้เองจาก Dashboard' },
  { icon: '🔗', title: 'Relationship Mapping', desc: 'ระบบจับคู่ลูกค้า↔ร้านได้เป๊ะ จ่ายรางวัลถูกร้านเสมอ' },
  { icon: '📊', title: 'Brand Dashboard', desc: 'ดู Real-time ว่าซอสล็อตนี้ไปถึงร้านไหน ลูกค้าสแกนเยอะแค่ไหน' },
  { icon: '🛡️', title: 'Fraud Prevention', desc: 'GPS + จำกัด 1 เบอร์/วัน ป้องกันร้านสแกนแทนลูกค้า' },
  { icon: '📱', title: 'LINE OA / LIFF', desc: 'ใช้งานได้ทันทีผ่าน LINE ไม่ต้องโหลดแอปเพิ่ม' },
]

const stats = [
  { n: '2,500+', l: 'ร้านค้าพาร์ทเนอร์' },
  { n: '50,000+', l: 'QR Code ที่ออก' },
  { n: '1.2M+', l: 'แต้มที่สะสม' },
  { n: '98%', l: 'ความพึงพอใจ' },
]

export default function Home() {
  const hasReveal = useRef(false)
  useEffect(() => {
    if (hasReveal.current) return
    hasReveal.current = true
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main>

        {/* ══ HERO ══ */}
        <section className="relative min-h-screen flex items-center overflow-hidden"
          style={{background:`linear-gradient(160deg,${DARK} 0%,#2D2D44 55%,#3a1a1a 100%)`}}>
          <div className="absolute inset-0 pointer-events-none"
            style={{background:'radial-gradient(ellipse 70% 60% at 60% 30%,rgba(253,24,3,.12),transparent 70%)'}}/>
          {/* floating circles */}
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5"
            style={{background:`radial-gradient(circle,${RED},transparent)`,filter:'blur(40px)'}}/>
          <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full opacity-5"
            style={{background:`radial-gradient(circle,${RED},transparent)`,filter:'blur(30px)'}}/>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wide mb-6 animate-fadeUp"
                style={{background:'rgba(253,24,3,.15)',border:'1px solid rgba(253,24,3,.3)',color:'#ff8070'}}>
                <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{background:'#ff8070'}}/>
                B2B2C Gamification Loyalty — 2025
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 animate-fadeUp" style={{animationDelay:'.1s'}}>
                ลูกค้าถูกรางวัล<br/>
                <span style={{color:'#ff8070'}}>ร้านค้าได้ด้วย</span><br/>
                พร้อมกันทันที!
              </h1>
              <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-[480px] animate-fadeUp" style={{animationDelay:'.2s'}}>
                ระบบ Double Reward ที่ผูกซอสเฮงเฮงปังจัง → ร้านอาหาร → ลูกค้า<br/>
                ในวงจรเดียว ผ่าน LINE OA ไม่ต้องโหลดแอปเพิ่ม
              </p>
              <div className="flex gap-3 flex-wrap animate-fadeUp" style={{animationDelay:'.3s'}}>
                <Link href="/register"
                  className="px-8 py-3.5 rounded-xl text-[15px] font-extrabold text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                  style={{background:`linear-gradient(135deg,${RED},${RED2})`,boxShadow:'0 4px 20px rgba(253,24,3,.4)'}}>
                  🚀 สมัครร้านค้าฟรี
                </Link>
                <a href="#how"
                  className="px-7 py-3.5 rounded-xl text-[15px] font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors inline-flex items-center gap-2">
                  ▶ ดูวิธีทำงาน
                </a>
              </div>
            </div>

            {/* Double Reward Card */}
            <div className="hidden lg:flex justify-center animate-fadeUp" style={{animationDelay:'.4s'}}>
              <div className="relative">
                {/* Merchant card */}
                <div className="bg-white rounded-2xl p-5 shadow-2xl w-64 absolute -left-8 top-0 z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{background:`linear-gradient(135deg,${RED},${RED2})`}}>🏪</div>
                    <div>
                      <div className="text-xs font-extrabold text-gray-900">ร้านกะเพราป้าแดง</div>
                      <div className="text-[10px] text-gray-400">Merchant Account</div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <div className="text-xl">🎉</div>
                    <div className="text-xs font-extrabold text-green-700">ได้รางวัลด้วย!</div>
                    <div className="text-[10px] text-green-600">ซอสฟรี 1 ลัง</div>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 text-center">แจ้งเตือนผ่าน LINE OA ✅</div>
                </div>
                {/* Consumer card */}
                <div className="bg-white rounded-2xl p-5 shadow-2xl w-64 ml-16 mt-16">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-purple-100">👤</div>
                    <div>
                      <div className="text-xs font-extrabold text-gray-900">ลูกค้า</div>
                      <div className="text-[10px] text-gray-400">สแกน QR บนโต๊ะ</div>
                    </div>
                  </div>
                  {/* Spin wheel mockup */}
                  <div className="rounded-xl p-3 text-center mb-2"
                    style={{background:`linear-gradient(135deg,${RED},${RED2})`}}>
                    <div className="text-2xl mb-1">🎰</div>
                    <div className="text-white text-xs font-extrabold">หมุนวงล้อ!</div>
                    <div className="text-white/80 text-[10px]">ลุ้นรางวัลทันที</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-2 text-center">
                    <div className="text-xs font-extrabold text-yellow-700">🏆 ถูกรางวัล! กินฟรีมื้อนี้</div>
                  </div>
                </div>
                {/* connecting arrow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-black z-20 shadow-lg"
                  style={{background:`linear-gradient(135deg,${RED},${RED2})`}}>⚡</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-wrap gap-8 items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">เชื่อใจโดย</span>
            <div className="flex flex-wrap gap-10">
              {stats.map(({n,l}) => (
                <div key={l} className="text-center">
                  <div className="text-xl font-black text-gray-900">{n}</div>
                  <div className="text-[11px] text-gray-500 font-semibold">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 reveal">
              <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:RED}}>วิธีทำงาน</div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Double Reward Flow</h2>
              <p className="text-gray-500 text-lg">ลูกค้าถูกรางวัล ร้านได้รางวัลพร้อมกันทันทีในระบบเดียว</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Merchant Flow */}
              <div className="reveal">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{background:`linear-gradient(135deg,${RED},${RED2})`}}>🏪</div>
                  <div>
                    <div className="text-sm font-extrabold text-gray-900">สำหรับร้านค้า (Merchant)</div>
                    <div className="text-xs text-gray-400">ซื้อซอส → สะสมแต้ม → รับรางวัล</div>
                  </div>
                </div>
                <div className="flex flex-col gap-0">
                  {merchantFlow.map((s, i) => (
                    <div key={s.title} className="flex gap-4 pb-6 relative">
                      {i < merchantFlow.length - 1 && (
                        <div className="absolute left-[19px] top-11 w-0.5 bottom-0 bg-gray-100"/>
                      )}
                      <div className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-lg bg-red-50 border-2 z-10"
                        style={{borderColor:RED}}>
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-gray-900 mb-0.5">{s.title}</div>
                        <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consumer Flow */}
              <div className="reveal">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-purple-100">👤</div>
                  <div>
                    <div className="text-sm font-extrabold text-gray-900">สำหรับลูกค้า (Consumer)</div>
                    <div className="text-xs text-gray-400">สแกน QR → หมุนวงล้อ → ลุ้นรางวัล</div>
                  </div>
                </div>
                <div className="flex flex-col gap-0">
                  {consumerFlow.map((s, i) => (
                    <div key={s.title} className="flex gap-4 pb-6 relative">
                      {i < consumerFlow.length - 1 && (
                        <div className="absolute left-[19px] top-11 w-0.5 bottom-0 bg-gray-100"/>
                      )}
                      <div className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-lg bg-purple-50 border-2 border-purple-200 z-10">
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-gray-900 mb-0.5">{s.title}</div>
                        <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ REWARD SYSTEM ══ */}
        <section className="py-24" style={{background:`linear-gradient(160deg,${DARK},#2D2D44)`}}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-14 reveal">
              <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:'#ff8070'}}>ระบบรางวัล</div>
              <h2 className="text-4xl font-extrabold text-white mb-3">Gamification Engine</h2>
              <p className="text-white/50 text-lg">ตั้งค่าโควต้าและความน่าจะเป็นรางวัลได้เองจาก Dashboard</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
              {rewards.map(r => (
                <div key={r.label} className="rounded-2xl p-8 text-center border border-white/10 hover:border-white/20 transition-all"
                  style={{background:'rgba(255,255,255,0.05)'}}>
                  <div className="text-5xl mb-4">{r.icon}</div>
                  <div className="text-4xl font-black mb-2" style={{color:r.color}}>{r.prob}</div>
                  <div className="text-lg font-extrabold text-white mb-2">{r.label}</div>
                  <div className="text-sm text-white/50">{r.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 reveal">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="text-sm font-extrabold text-white mb-1">Fraud Prevention</div>
                  <div className="text-sm text-white/50">ป้องกันร้านค้าสแกน QR แทนลูกค้า — ระบบจำกัด 1 เบอร์โทร/วัน + GPS ตรวจสอบว่าสแกนจากอุปกรณ์เดียวซ้ำซากหรือไม่</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-14 reveal">
              <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:RED}}>ฟีเจอร์ทั้งหมด</div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-3">ระบบครบวงจร</h2>
              <p className="text-gray-500 text-lg">ทุกเครื่องมือที่แบรนด์และร้านค้าต้องการ ในแดชบอร์ดเดียว</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
              {features.map(f => (
                <div key={f.title}
                  className="border-2 border-gray-100 rounded-2xl p-7 hover:border-[#fd1803]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                    style={{background:`linear-gradient(90deg,${RED},#ff8070)`}}/>
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-base font-extrabold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="pricing" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-14 reveal">
              <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:RED}}>แพ็กเกจ</div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-3">เลือกแผนที่เหมาะกับร้านคุณ</h2>
              <p className="text-gray-500 text-lg">ทุกแพ็กเกจไม่มีสัญญาผูกมัด ยกเลิกได้ทุกเมื่อ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
              {[
                {
                  tier:'สำหรับร้านเล็ก', name:'Starter', price:'ฟรี', unit:'/เดือน',
                  desc:'เริ่มสร้าง Loyalty โดยไม่ต้องลงทุน',
                  badge:null,
                  features:['QR Code สูงสุด 200 โค้ด/เดือน','Dashboard พื้นฐาน','LINE OA Integration','สุ่มรางวัลพื้นฐาน'],
                  off:['AI Predictive','Open API'],
                  cta:'เริ่มต้นฟรี', fill:false
                },
                {
                  tier:'ยอดนิยม', name:'Pro', price:'฿1,990', unit:'/เดือน',
                  desc:'Double Reward + AI เต็มรูปแบบ',
                  badge:'⭐ ยอดนิยม',
                  features:['QR Code ไม่จำกัด','Dashboard + Analytics เชิงลึก','LINE OA + Push Message อัตโนมัติ','Gamification Engine เต็มรูปแบบ','Fraud Prevention GPS','Relationship Mapping'],
                  off:['Open API Partner'],
                  cta:'สมัครเลย', fill:true
                },
                {
                  tier:'แฟรนไชส์ / เชน', name:'Enterprise', price:'ติดต่อ', unit:'',
                  desc:'ระบบครบวงจรสำหรับธุรกิจขนาดใหญ่',
                  badge:null,
                  features:['Multi-branch Dashboard','White Label App','Full AI + Gamification','Open API (Grab, LINE MAN)','Custom Reward Rules','Dedicated Support'],
                  off:[],
                  cta:'คุยกับทีมงาน', fill:false
                },
              ].map(p => (
                <div key={p.name}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-9 flex flex-col hover:border-[#fd1803]/30 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{background:`linear-gradient(90deg,${RED},#ff8070)`}}/>
                  {p.badge && (
                    <span className="inline-block text-white text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full mb-4 w-fit"
                      style={{background:RED}}>{p.badge}</span>
                  )}
                  <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">{p.tier}</div>
                  <div className="text-2xl font-black mb-2 text-gray-900">{p.name}</div>
                  <div className="text-4xl font-black mb-1 text-gray-900">
                    {p.price}<span className="text-sm font-normal ml-1 text-gray-400">{p.unit}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-6 mt-1">{p.desc}</div>
                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="text-sm flex gap-2.5 items-start font-medium text-gray-700">
                        <span className="font-black mt-0.5" style={{color:RED}}>✓</span>{f}
                      </li>
                    ))}
                    {p.off.map(f => (
                      <li key={f} className="text-sm flex gap-2.5 items-start text-gray-300 opacity-50">
                        <span className="font-black mt-0.5">—</span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register"
                    className="w-full py-3.5 rounded-xl text-sm font-extrabold text-center block transition-all hover:opacity-90"
                    style={p.fill
                      ? {background:`linear-gradient(135deg,${RED},${RED2})`,color:'#fff',boxShadow:'0 4px 20px rgba(253,24,3,.4)'}
                      : {border:`2px solid ${RED}`,color:RED}}>
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="py-20 text-center relative overflow-hidden"
          style={{background:`linear-gradient(160deg,${DARK},#2D2D44)`}}>
          <div className="absolute inset-0 pointer-events-none"
            style={{background:'radial-gradient(ellipse 60% 80% at 50% 0%,rgba(253,24,3,0.18),transparent 70%)'}}/>
          <div className="max-w-2xl mx-auto px-6 relative reveal">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              พร้อมสร้าง<br/>
              <span style={{color:'#ff8070'}}>Double Reward</span><br/>
              ให้ร้านคุณแล้วหรือยัง?
            </h2>
            <p className="text-white/60 text-lg mb-10">สมัครฟรี ไม่ต้องใส่บัตรเครดิต เริ่มออก QR Code ได้ใน 15 นาที</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register"
                className="px-9 py-4 rounded-xl text-[15px] font-extrabold text-white hover:opacity-90 transition-opacity"
                style={{background:`linear-gradient(135deg,${RED},${RED2})`,boxShadow:'0 4px 20px rgba(253,24,3,.4)'}}>
                🚀 สมัครร้านค้าฟรี
              </Link>
              <a href="https://line.me"
                className="px-9 py-4 rounded-xl text-[15px] font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                📞 นัดผู้เชี่ยวชาญ
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
