'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const features = [
  { icon: '⚡', color: 'bg-red-50',    tag: 'Auto-Credit',  title: 'Payment-Linked Loyalty',     desc: 'ผูก PromptPay หรือแอปธนาคาร ลูกค้าจ่ายปุ๊บแต้มเข้า LINE OA ทันที ไม่ต้องสแกน QR แยก' },
  { icon: '🤖', color: 'bg-purple-50', tag: 'AI Predict',   title: 'AI คาดเดาพฤติกรรมลูกค้า',   desc: 'วิเคราะห์ Pattern เช่น "กะเพราวันศุกร์" ส่งโปรโมชั่นก่อนถึงเวลา กระตุ้นการตัดสินใจ' },
  { icon: '🎯', color: 'bg-green-50',  tag: 'Real-time',    title: 'Dynamic Rewards',            desc: 'ปรับค่าแต้มตาม Real-time เช่น บ่ายสองแต้มคูณ 2 ดึงลูกค้าช่วงร้านเงียบได้อัตโนมัติ' },
  { icon: '🔗', color: 'bg-blue-50',   tag: 'Open API',     title: 'Ecosystem Interoperability', desc: 'โอนแต้มข้ามแพลตฟอร์ม เชื่อม Grab, LINE MAN, เน็ตมือถือ เพิ่มคุณค่าให้แต้มทุกเม็ด' },
  { icon: '🎮', color: 'bg-orange-50', tag: 'UGC Rewards',  title: 'Behavioral Gamification',    desc: 'โพสต์รูปจาน รีวิวใน Google Maps หรือแชร์เมนู ก็ได้แต้มทันที สร้าง Viral Loop ฟรี' },
  { icon: '📊', color: 'bg-slate-50',  tag: 'Dashboard',    title: 'Merchant Analytics',         desc: 'ดูยอด Redemption, ลูกค้าใหม่, Revenue ประเมิน และ AI Insights แบบ Real-time ในหน้าเดียว' },
]

const howSteps = [
  { n: '1', title: 'สมัครและสร้างร้านค้า',           desc: 'สมัครบัญชี Merchant ฟรี กรอกข้อมูลร้าน + GPS เริ่มได้ใน 15 นาที' },
  { n: '2', title: 'ออก QR Code / โค้ดซีเรียล',      desc: 'สั่งพิมพ์ QR Sheet หรือ Export PDF แจกลูกค้า หรือติดบนบรรจุภัณฑ์ซอส' },
  { n: '3', title: 'ลูกค้าสแกน รับแต้มผ่าน LINE OA', desc: 'ลูกค้าสแกนหรือพิมพ์รหัส แต้มเข้า LINE OA ทันที ไม่ต้องโหลดแอปเพิ่ม' },
  { n: '4', title: 'ติดตามผลใน Dashboard',            desc: 'ดูสถิติ Redemption, ลูกค้ากลับมา, ยอดขายประเมิน และ AI Insights' },
]

/* ─── Pricing: ไม่มี featured dark card ─────────────────── */
const plans = [
  {
    tier: 'สำหรับร้านเล็ก', name: 'Starter', price: 'ฟรี', priceUnit: '/เดือน',
    desc: 'เริ่มสร้าง Loyalty โดยไม่ต้องลงทุน',
    badge: null,
    features: ['QR Code สูงสุด 200 โค้ด/เดือน', 'Dashboard พื้นฐาน', 'LINE OA Integration'],
    disabled: ['AI Predictive Personalization', 'Dynamic Rewards', 'Open API'],
    cta: 'เริ่มต้นฟรี', ctaStyle: 'outline',
  },
  {
    tier: 'ยอดนิยม', name: 'Pro', price: '฿1,990', priceUnit: '/เดือน',
    desc: 'AI + Dynamic Rewards เต็มรูปแบบ',
    badge: '⭐ ยอดนิยม',
    features: ['QR Code ไม่จำกัด', 'Dashboard + Analytics เชิงลึก', 'LINE OA + Push Message อัตโนมัติ', 'AI Predictive Personalization', 'Dynamic Rewards Real-time'],
    disabled: ['Open API Partner'],
    cta: 'สมัครเลย', ctaStyle: 'fill',
  },
  {
    tier: 'แฟรนไชส์ / เชน', name: 'Enterprise', price: 'ติดต่อ', priceUnit: '',
    desc: 'ระบบครบวงจรสำหรับธุรกิจขนาดใหญ่',
    badge: null,
    features: ['Multi-branch Dashboard', 'White Label App', 'Full AI + Gamification', 'Ecosystem API (Grab, LINE MAN)', 'Custom Reward Rules', 'Dedicated Support Manager'],
    disabled: [],
    cta: 'คุยกับทีมงาน', ctaStyle: 'outline',
  },
]

const testimonials = [
  { stars: 5, text: '"ตั้งแต่ติด QR เฮงเฮงปังจังบนโต๊ะ ลูกค้ากลับมาบ่อยขึ้นชัดเจน Dashboard ดูง่ายมาก ไม่ต้องมีความรู้ IT ก็ใช้ได้เลย"', name: 'ร้านกะเพราป้าแดง', role: 'ร้านตามสั่ง • กรุงเทพฯ', icon: '🍳' },
  { stars: 5, text: '"AI ส่งโปรโมชั่นตอนบ่ายสองโมงให้อัตโนมัติ ทำให้ช่วงเงียบๆ มีออเดอร์เพิ่มขึ้น 30% เลย สุดยอดมาก"', name: 'ครัวคุณแม่ สาขา 3', role: 'แฟรนไชส์ • เชียงใหม่', icon: '🏪' },
  { stars: 5, text: '"ลูกค้าชอบมากที่แต้มโอนไป Grab ได้ ทำให้คนไม่ลืมสะสม รู้สึกคุ้มทุกคำกิน ยอดขายซอสเพิ่มตามด้วย"', name: 'ร้านข้าวมันไก่ทองหล่อ', role: 'ร้านอาหาร • กรุงเทพฯ', icon: '🌶️' },
]

const faqs = [
  { q: 'สมัครฟรีได้จริงหรือเปล่า?', a: 'ฟรีจริงครับ แพ็กเกจ Starter ไม่มีค่าใช้จ่าย ออก QR Code ได้สูงสุด 200 โค้ด/เดือน อัพเกรดได้ทุกเมื่อ' },
  { q: 'ต้องมี LINE OA ก่อนหรือเปล่า?', a: 'ต้องมีครับ ระบบแต้มผูกกับ LINE OA ของแบรนด์คุณ ถ้ายังไม่มีเราช่วยแนะนำได้เลย' },
  { q: 'ลูกค้าต้องโหลดแอปไหม?', a: 'ไม่ต้องเลยครับ ลูกค้าแค่มี LINE ก็สแกน QR Code หรือพิมพ์รหัสได้ทันที แต้มเข้า LINE OA อัตโนมัติ' },
  { q: 'ข้อมูลลูกค้าปลอดภัยไหม?', a: 'ข้อมูลทั้งหมด SSL/HTTPS เราไม่ขายข้อมูลให้บุคคลที่สาม และเป็นไปตาม PDPA' },
  { q: 'GPS ของร้านค้าใช้ทำอะไร?', a: 'ใช้แสดงร้านบนแผนที่ในแอปลูกค้า และ AI ใช้ข้อมูลพื้นที่วิเคราะห์ Dynamic Rewards ตามเวลาและตำแหน่งอัตโนมัติ' },
]

function DashboardMock() {
  const bars = [35, 55, 42, 68, 50, 85, 38]
  return (
    <div className="w-full max-w-[480px] bg-white rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"/>
          <div className="w-3 h-3 rounded-full bg-yellow-400"/>
          <div className="w-3 h-3 rounded-full bg-green-400"/>
        </div>
        <div className="flex-1 mx-2 bg-white border border-gray-200 rounded-md px-3 py-1 text-[11px] text-gray-400">
          merchant.henghengpangjang.com/dashboard
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-extrabold text-gray-900">ภาพรวมวันนี้ 🔥</span>
          <span className="text-xs text-gray-400 font-semibold">พ. 11 มี.ค. 2025</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[['1,284','โค้ดที่ Redeem'],['฿32K','ยอดขาย'],['348','ลูกค้าใหม่']].map(([n,l]) => (
            <div key={l} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black" style={{color:'#fd1803'}}>{n}</div>
              <div className="text-[10px] text-gray-400 font-semibold mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-3.5 mb-3">
          <div className="text-[10px] font-bold text-gray-400 mb-2 tracking-wider">REDEMPTIONS THIS WEEK</div>
          <div className="flex items-end gap-1.5 h-12">
            {bars.map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-md transition-all ${h === 85 ? 'opacity-100' : 'opacity-60'}`}
                style={{ height: `${h}%`, background: 'linear-gradient(to top, #fd1803, #ff6040)' }}/>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[['🏆','Gold Members','128 คน (+12%)'],['⚡','Flash Deal','บ่าย 2–4 โมง']].map(([ic,t,s]) => (
            <div key={t} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <span className="text-lg">{ic}</span>
              <div>
                <div className="text-[12px] font-extrabold text-gray-800">{t}</div>
                <div className="text-[10px] text-gray-400">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section id="hero" className="bg-dark-gradient min-h-[88vh] flex items-end overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 pt-20 pb-0 items-end">
            <div className="pb-20 lg:pb-24">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wide mb-7 animate-fadeUp"
                style={{background:'rgba(253,24,3,.15)',border:'1px solid rgba(253,24,3,.3)',color:'#ff8070'}}>
                <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{background:'#ff8070'}}/>
                B2B2C Loyalty Platform ใหม่ 2025
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] mb-5 animate-fadeUp delay-100">
                จัดการร้านค้า<br/>
                สร้าง <span style={{color:'#ff8070'}}>Loyalty</span><br/>
                วัดผลได้จริง
              </h1>
              <p className="text-lg text-white/60 leading-relaxed mb-9 max-w-[440px] animate-fadeUp delay-200">
                เชื่อมซอสเฮงเฮงปังจังจากโรงงาน ถึงร้านอาหาร ถึงมือลูกค้า<br/>
                ด้วย QR Code Loyalty ที่ร้านค้าพาร์ทเนอร์จัดการได้เองทั้งหมด
              </p>
              <div className="flex gap-3 flex-wrap animate-fadeUp delay-300">
                <Link href="/register"
                  className="px-8 py-3.5 rounded-xl text-[15px] font-extrabold text-white hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-orange"
                  style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>
                  🚀 สมัครฟรีตอนนี้
                </Link>
                <a href="#how"
                  className="px-7 py-3.5 rounded-xl text-[15px] font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors inline-flex items-center gap-2">
                  ▶ ดูวิธีทำงาน
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-end animate-fadeUp delay-400">
              <DashboardMock />
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-wrap gap-8 items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">เชื่อใจโดย</span>
            <div className="flex flex-wrap gap-10">
              {[['2,500+','ร้านค้าพาร์ทเนอร์'],['50,000+','โค้ด QR ที่ออก'],['1.2M+','แต้มที่สะสม'],['98%','ความพึงพอใจ']].map(([n,l]) => (
                <div key={l} className="text-center">
                  <div className="text-xl font-black text-gray-900">{n}</div>
                  <div className="text-[11px] text-gray-500 font-semibold">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-14 reveal">
              <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:'#fd1803'}}>ฟีเจอร์ทั้งหมด</div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">ทุกเครื่องมือที่ร้านค้าต้องการ</h2>
              <p className="text-gray-500 text-lg max-w-lg mx-auto">จัดการ Loyalty ตั้งแต่ออกโค้ด QR ไปจนถึงวิเคราะห์พฤติกรรมลูกค้า ในแดชบอร์ดเดียว</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
              {features.map(f => (
                <div key={f.title}
                  className="border border-gray-100 rounded-2xl p-7 hover:shadow-card hover:-translate-y-1 transition-all duration-200 group cursor-default relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-t-2xl"
                    style={{background:'linear-gradient(90deg,#fd1803,#ff8070)'}}/>
                  <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>{f.icon}</div>
                  <div className="text-[10px] font-extrabold tracking-widest uppercase mb-2" style={{color:'#fd1803'}}>{f.tag}</div>
                  <h3 className="text-base font-extrabold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="reveal">
                  <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:'#fd1803'}}>วิธีทำงาน</div>
                  <h2 className="text-4xl font-extrabold text-gray-900 mb-4">B2B2C ที่เชื่อมทุกคน<br/>ในห่วงโซ่คุณค่า</h2>
                  <p className="text-gray-500 text-lg">ร้านค้าไม่ต้องเขียนโค้ด ไม่ต้องมีนักพัฒนา เปิดใช้งานได้ใน 15 นาที</p>
                </div>
                <div className="mt-10 flex flex-col gap-0 reveal">
                  {howSteps.map((s, i) => (
                    <div key={s.n} className="flex gap-5 pb-8 relative">
                      {i < howSteps.length - 1 && (
                        <div className="absolute left-[19px] top-11 w-0.5 bottom-0 bg-gray-200"/>
                      )}
                      <div className={`w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-sm font-black z-10 border-2`}
                        style={i === 0
                          ? {background:'#fd1803',borderColor:'#fd1803',color:'#fff',boxShadow:'0 4px 14px rgba(253,24,3,.45)'}
                          : {background:'#fff',borderColor:'#e5e5e5',color:'#fd1803'}}>
                        {s.n}
                      </div>
                      <div>
                        <div className="text-[15px] font-extrabold text-gray-900 mb-1">{s.title}</div>
                        <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="reveal flex justify-center">
                <div className="bg-[#1C1C2E] rounded-[36px] p-3 shadow-2xl border-[8px] border-[#2a2a3e] max-w-[270px] w-full">
                  <div className="bg-white rounded-[26px] overflow-hidden">
                    <div className="bg-[#1C1C2E] h-7 flex items-center justify-center">
                      <div className="w-14 h-1 bg-gray-700 rounded-full"/>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[13px] font-extrabold">🐻 เฮงเฮงปังจัง</span>
                        <span className="text-lg">🔔</span>
                      </div>
                      <div className="rounded-2xl p-4 text-white text-center mb-3"
                        style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>
                        <div className="text-3xl font-black leading-none">150</div>
                        <div className="text-[11px] opacity-80 font-bold mt-1">แต้มสะสม</div>
                        <div className="h-1 bg-white/30 rounded-full mt-2.5 overflow-hidden"><div className="h-full w-[62%] bg-white rounded-full"/></div>
                        <div className="text-[10px] opacity-70 mt-1.5 font-semibold">อีก 50 แต้ม ถึง Silver 🥈</div>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 mb-3">
                        {[['📷','สแกน QR'],['🎁','แลกรางวัล'],['📊','ประวัติ'],['👥','แนะนำ']].map(([ic,lb]) => (
                          <div key={lb} className="bg-gray-50 rounded-xl py-2 text-center">
                            <div className="text-lg">{ic}</div>
                            <div className="text-[9px] font-bold text-gray-600 mt-0.5">{lb}</div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <div>
                          <div className="text-[11px] font-extrabold">Flash Deal ตอนนี้!</div>
                          <div className="text-[9px] text-gray-400">บ่าย 2–4 โมง แต้มคูณ 2</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING — ทุก card เป็น white เหมือนกัน */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-14 reveal">
              <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:'#fd1803'}}>แพ็กเกจ</div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">เลือกแผนที่เหมาะกับร้านคุณ</h2>
              <p className="text-gray-500 text-lg">ทุกแพ็กเกจไม่มีสัญญาผูกมัด ยกเลิกได้ทุกเมื่อ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
              {plans.map((p) => (
                <div key={p.name}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-9 flex flex-col hover:border-[#fd1803]/30 hover:shadow-card transition-all duration-200 relative overflow-hidden">
                  {/* top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{background:'linear-gradient(90deg,#fd1803,#ff8070)'}}/>
                  {p.badge && (
                    <span className="inline-block text-white text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full mb-4 w-fit"
                      style={{background:'#fd1803'}}>
                      {p.badge}
                    </span>
                  )}
                  <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">{p.tier}</div>
                  <div className="text-2xl font-black mb-2 text-gray-900">{p.name}</div>
                  <div className="text-4xl font-black mb-1 text-gray-900">
                    {p.price}<span className="text-sm font-normal ml-1 text-gray-400">{p.priceUnit}</span>
                  </div>
                  <div className="text-sm mb-7 text-gray-500 mt-2">{p.desc}</div>
                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="text-sm flex gap-2.5 items-start font-medium text-gray-700">
                        <span className="font-black mt-0.5" style={{color:'#fd1803'}}>✓</span>{f}
                      </li>
                    ))}
                    {p.disabled.map(f => (
                      <li key={f} className="text-sm flex gap-2.5 items-start text-gray-300 opacity-50">
                        <span className="font-black mt-0.5">—</span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register"
                    className={`w-full py-3.5 rounded-xl text-sm font-extrabold text-center block transition-all
                      ${p.ctaStyle === 'fill'
                        ? 'text-white hover:opacity-90 shadow-orange'
                        : 'border-2 text-gray-800 hover:text-white transition-all'
                      }`}
                    style={p.ctaStyle === 'fill'
                      ? {background:'linear-gradient(135deg,#fd1803,#e01502)'}
                      : {borderColor:'#fd1803', color:'#fd1803'}
                    }
                    onMouseEnter={p.ctaStyle !== 'fill' ? (e) => {
                      (e.currentTarget as HTMLElement).style.background = '#fd1803'
                      ;(e.currentTarget as HTMLElement).style.color = '#fff'
                    } : undefined}
                    onMouseLeave={p.ctaStyle !== 'fill' ? (e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.color = '#fd1803'
                    } : undefined}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12 reveal">
              <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:'#fd1803'}}>รีวิวจากร้านค้า</div>
              <h2 className="text-4xl font-extrabold text-gray-900">ร้านค้าพูดถึงเราว่ายังไง</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
              {testimonials.map(t => (
                <div key={t.name} className="bg-white rounded-2xl p-7 shadow-card hover:-translate-y-1 transition-all duration-200">
                  <div className="text-yellow-400 text-sm tracking-widest mb-4">{'★'.repeat(t.stars)}</div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg border border-gray-200">{t.icon}</div>
                    <div>
                      <div className="text-sm font-extrabold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-400 font-medium">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 lg:px-0">
            <div className="text-center mb-12 reveal">
              <div className="text-xs font-extrabold tracking-[3px] uppercase mb-3" style={{color:'#fd1803'}}>FAQ</div>
              <h2 className="text-4xl font-extrabold text-gray-900">คำถามที่พบบ่อย</h2>
            </div>
            <div className="flex flex-col gap-3 reveal">
              {faqs.map(f => (
                <details key={f.q} className="group border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="flex justify-between items-center px-6 py-4 font-bold text-[15px] text-gray-900 cursor-pointer hover:bg-gray-50 list-none select-none">
                    {f.q}
                    <span className="font-black text-lg ml-4 group-open:rotate-45 transition-transform" style={{color:'#fd1803'}}>+</span>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-dark-gradient py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{background:'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(253,24,3,0.18), transparent 70%)'}}/>
          <div className="max-w-2xl mx-auto px-6 relative reveal">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              พร้อมสร้าง <span style={{color:'#ff8070'}}>Loyalty</span><br/>ที่วัดผลได้แล้วหรือยัง?
            </h2>
            <p className="text-white/60 text-lg mb-10">สมัครฟรี ไม่ต้องใส่บัตรเครดิต เริ่มออก QR Code ได้ใน 15 นาที</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register"
                className="px-9 py-4 rounded-xl text-[15px] font-extrabold text-white hover:opacity-90 transition-opacity shadow-orange"
                style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>
                🚀 สมัครใช้งานฟรี
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
