'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  QrCode, Store, Users, BarChart3, ShieldCheck, Zap,
  Gift, ChevronRight, Star, TrendingUp, Bell, MapPin,
  CheckCircle2, XCircle, ArrowRight, Sparkles
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const RED = '#fd1803'
const DARK = '#1C1C2E'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { hidden:{}, show:{ transition:{ staggerChildren: 0.1 } } }
const slideIn = {
  hidden: { opacity: 0, x: -30 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } },
}

const merchantFlow = [
  { icon: Store,    title: 'ซื้อซอสเฮงเฮงปังจัง',         desc: 'ทุกกล่องมี QR Code / รหัสหลังฝาสำหรับสแกนสะสมแต้ม' },
  { icon: QrCode,   title: 'สแกนรับแต้ม CRM',             desc: 'สแกนผ่าน LINE OA ได้แต้มเข้าบัญชีร้านทันที' },
  { icon: MapPin,   title: 'รับสแตนดี้ QR ตั้งโต๊ะอาหาร', desc: 'แบรนด์ส่งป้ายฝัง Shop ID ให้ร้านตั้งที่โต๊ะ' },
  { icon: Gift,     title: 'ลูกค้าถูกรางวัล ร้านได้ด้วย!', desc: 'ระบบแจ้งเตือน LINE ร้านทันทีเมื่อลูกค้าถูกรางวัล' },
]

const consumerFlow = [
  { icon: Users,    title: 'ลูกค้ามาทานอาหาร',      desc: 'เห็นสแตนดี้เฮงเฮงปังจังบนโต๊ะ' },
  { icon: QrCode,   title: 'สแกน QR ผ่าน LINE',      desc: 'ไม่ต้องโหลดแอปเพิ่ม ใช้ LINE ที่มีอยู่แล้ว' },
  { icon: Star,     title: 'หมุนวงล้อ / ลุ้นรางวัล', desc: 'กินฟรีมื้อนี้, ส่วนลด, ของพรีเมียม' },
  { icon: Bell,     title: 'ถูกรางวัล! ร้านได้ด้วย', desc: 'Double Reward — ลูกค้าและร้านค้าได้รางวัลพร้อมกัน' },
]

const features = [
  { icon: QrCode,      title: 'Unique QR Code',         desc: 'แต่ละล็อตสินค้ามี QR เฉพาะ ป้องกันการปลอมแปลง 100%' },
  { icon: Sparkles,    title: 'Gamification Engine',     desc: 'ตั้งค่าโควต้าและความน่าจะเป็นรางวัลได้เองจาก Dashboard' },
  { icon: Zap,         title: 'Relationship Mapping',    desc: 'ระบบจับคู่ลูกค้า↔ร้านได้เป๊ะ จ่ายรางวัลถูกร้านเสมอ' },
  { icon: BarChart3,   title: 'Brand Dashboard',         desc: 'ดู Real-time ว่าซอสล็อตนี้ไปถึงร้านไหน มีลูกค้าสแกนเท่าไหร่' },
  { icon: ShieldCheck, title: 'Fraud Prevention',        desc: 'GPS + จำกัด 1 เบอร์/วัน ป้องกันร้านสแกนแทนลูกค้า' },
  { icon: TrendingUp,  title: 'LINE OA / LIFF',          desc: 'ใช้งานได้ทันทีผ่าน LINE ไม่ต้องโหลดแอปเพิ่ม' },
]

const stats = [
  { n: '2,500+', l: 'ร้านค้าพาร์ทเนอร์' },
  { n: '50,000+', l: 'QR Code ที่ออก' },
  { n: '1.2M+', l: 'แต้มสะสม' },
  { n: '98%', l: 'ความพึงพอใจ' },
]

const plans = [
  {
    name: 'Starter', price: 'ฟรี', unit: '', tier: 'สำหรับร้านเล็ก',
    desc: 'เริ่มต้นสร้าง Loyalty โดยไม่ต้องลงทุน',
    badge: null, fill: false, cta: 'เริ่มต้นฟรี',
    features: ['QR Code 200 โค้ด/เดือน', 'Dashboard พื้นฐาน', 'LINE OA Integration', 'สุ่มรางวัลพื้นฐาน'],
    off: ['AI Predictive', 'Open API'],
  },
  {
    name: 'Pro', price: '฿1,990', unit: '/เดือน', tier: 'ยอดนิยม',
    desc: 'Double Reward + AI เต็มรูปแบบ',
    badge: 'ยอดนิยม', fill: true, cta: 'สมัครเลย',
    features: ['QR Code ไม่จำกัด', 'Dashboard + Analytics', 'Push Message อัตโนมัติ', 'Gamification Engine เต็มรูปแบบ', 'Fraud Prevention GPS', 'Relationship Mapping'],
    off: ['Open API Partner'],
  },
  {
    name: 'Enterprise', price: 'ติดต่อ', unit: '', tier: 'แฟรนไชส์ / เชน',
    desc: 'ระบบครบวงจรสำหรับธุรกิจขนาดใหญ่',
    badge: null, fill: false, cta: 'คุยกับทีมงาน',
    features: ['Multi-branch Dashboard', 'White Label App', 'Full AI + Gamification', 'Open API (Grab, LINE MAN)', 'Custom Reward Rules', 'Dedicated Support'],
    off: [],
  },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="font-kanit">

        {/* ══ HERO ══ */}
        <section className="relative min-h-screen flex items-center overflow-hidden"
          style={{ background: `linear-gradient(160deg,${DARK} 0%,#2D2D44 60%,#3a1a1a 100%)` }}>
          {/* glow blobs */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(253,24,3,.12),transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(253,24,3,.08),transparent 70%)', filter: 'blur(40px)' }} />

          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.div variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6"
                style={{ background: 'rgba(253,24,3,.15)', border: '1px solid rgba(253,24,3,.35)', color: '#ff9080' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9080] animate-pulse" />
                B2B2C Gamification Loyalty — 2025
              </motion.div>

              <motion.h1 variants={fadeUp}
                className="text-5xl lg:text-[64px] font-black text-white leading-[1.05] mb-6 tracking-tight">
                ลูกค้าถูกรางวัล<br />
                <span style={{ color: '#ff8070' }}>ร้านค้าได้ด้วย</span><br />
                พร้อมกันทันที!
              </motion.h1>

              <motion.p variants={fadeUp}
                className="text-lg text-white/55 leading-relaxed mb-9 max-w-[480px] font-light">
                ระบบ Double Reward ผูก ซอสเฮงเฮงปังจัง → ร้านอาหาร → ลูกค้า<br />
                ในวงจรเดียว ผ่าน LINE OA ไม่ต้องโหลดแอปเพิ่ม
              </motion.p>

              <motion.div variants={fadeUp} className="flex gap-3 flex-wrap">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: `linear-gradient(135deg,${RED},#e01502)`, boxShadow: '0 8px 30px rgba(253,24,3,.45)' }}>
                  สมัครร้านค้าฟรี <ArrowRight size={16} />
                </Link>
                <a href="#how"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-[15px] font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                  ดูวิธีทำงาน <ChevronRight size={16} />
                </a>
              </motion.div>
            </motion.div>

            {/* Hero Card */}
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex justify-center">
              <div className="relative w-[400px] h-[380px]">
                {/* merchant card */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute left-0 top-0 bg-white rounded-3xl p-6 w-60 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg,${RED},#e01502)` }}>
                      <Store size={18} color="white" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900">ร้านกะเพราป้าแดง</div>
                      <div className="text-[10px] text-gray-400 font-medium">Merchant Account</div>
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                    <CheckCircle2 size={24} className="mx-auto mb-1 text-emerald-500" />
                    <div className="text-sm font-black text-emerald-700">ได้รางวัลด้วย!</div>
                    <div className="text-xs text-emerald-600 font-medium">ซอสฟรี 1 ลัง มูลค่า ฿480</div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Bell size={10} /> แจ้งเตือน LINE OA แล้ว
                  </div>
                </motion.div>

                {/* consumer card */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute right-0 bottom-0 bg-white rounded-3xl p-6 w-60 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Users size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900">ลูกค้า</div>
                      <div className="text-[10px] text-gray-400 font-medium">สแกน QR บนโต๊ะ</div>
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 text-center mb-3"
                    style={{ background: `linear-gradient(135deg,${RED},#e01502)` }}>
                    <Star size={22} className="mx-auto mb-1 text-white fill-white" />
                    <div className="text-white text-sm font-black">ถูกรางวัล!</div>
                    <div className="text-white/80 text-xs font-medium">กินฟรีมื้อนี้</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-center">
                    <div className="text-xs font-black text-amber-700">🏆 รางวัลใหญ่ — มูลค่า ฿350</div>
                  </div>
                </motion.div>

                {/* center bolt */}
                <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-20 shadow-xl"
                  style={{ background: `linear-gradient(135deg,${RED},#e01502)` }}>
                  <Zap size={22} color="white" fill="white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-wrap gap-10 items-center">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-[3px]">เชื่อใจโดย</span>
            <div className="flex flex-wrap gap-12">
              {stats.map(({ n, l }) => (
                <div key={l}>
                  <div className="text-2xl font-black text-gray-900">{n}</div>
                  <div className="text-xs text-gray-400 font-semibold">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how" className="py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-center mb-16">
              <div className="text-xs font-extrabold tracking-[4px] uppercase mb-3" style={{ color: RED }}>วิธีทำงาน</div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3">Double Reward Flow</h2>
              <p className="text-gray-400 text-lg font-light">ลูกค้าถูกรางวัล ร้านได้พร้อมกันทันทีในระบบเดียว</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {[
                { label: 'สำหรับร้านค้า (Merchant)', sub: 'ซื้อซอส → สแกน → รับรางวัล', flow: merchantFlow, accent: RED },
                { label: 'สำหรับลูกค้า (Consumer)',  sub: 'สแกน QR → ลุ้นรางวัล → ถูกรางวัล', flow: consumerFlow, accent: '#7C3AED' },
              ].map(({ label, sub, flow, accent }) => (
                <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{ background: `${accent}18` }}>
                      <Store size={20} style={{ color: accent }} />
                    </div>
                    <div>
                      <div className="text-base font-black text-gray-900">{label}</div>
                      <div className="text-xs text-gray-400 font-medium">{sub}</div>
                    </div>
                  </div>
                  <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="flex flex-col gap-0">
                    {flow.map((s, i) => (
                      <motion.div key={s.title} variants={slideIn} className="flex gap-4 pb-7 relative">
                        {i < flow.length - 1 && (
                          <div className="absolute left-[21px] top-12 w-[2px] bottom-0 bg-gray-100" />
                        )}
                        <div className="w-11 h-11 min-w-[44px] rounded-2xl flex items-center justify-center z-10 border-2"
                          style={{ background: `${accent}10`, borderColor: `${accent}30` }}>
                          <s.icon size={18} style={{ color: accent }} />
                        </div>
                        <div className="pt-1.5">
                          <div className="text-sm font-black text-gray-900 mb-1">{s.title}</div>
                          <p className="text-xs text-gray-400 leading-relaxed font-light">{s.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ REWARD TIERS ══ */}
        <section className="py-28" style={{ background: `linear-gradient(160deg,${DARK},#2D2D44)` }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-center mb-14">
              <div className="text-xs font-extrabold tracking-[4px] uppercase mb-3" style={{ color: '#ff9080' }}>ระบบรางวัล</div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-3">Gamification Engine</h2>
              <p className="text-white/40 text-lg font-light">ตั้งค่าโควต้าและความน่าจะเป็นรางวัลได้เองจาก Dashboard</p>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                { prob: '1%',  Icon: Gift,       label: 'รางวัลใหญ่',  desc: 'กินฟรีมื้อนี้ + ซอสฟรี 1 ลัง',       color: '#FFD700' },
                { prob: '20%', Icon: Star,       label: 'รางวัลเล็ก',  desc: 'ส่วนลด / ของพรีเมียม',               color: RED },
                { prob: '79%', Icon: TrendingUp, label: 'แต้มสะสม',    desc: 'แต้มเข้า LINE OA อัตโนมัติ',         color: '#818CF8' },
              ].map(({ prob, Icon, label, desc, color }) => (
                <motion.div key={label} variants={fadeUp}
                  className="rounded-3xl p-8 text-center border border-white/8 hover:border-white/15 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}>
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: `${color}18` }}>
                    <Icon size={26} style={{ color }} />
                  </div>
                  <div className="text-5xl font-black mb-2" style={{ color }}>{prob}</div>
                  <div className="text-lg font-black text-white mb-2">{label}</div>
                  <div className="text-sm text-white/40 font-light">{desc}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start gap-4">
              <div className="w-11 h-11 min-w-[44px] rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(253,24,3,.15)' }}>
                <ShieldCheck size={20} style={{ color: RED }} />
              </div>
              <div>
                <div className="text-base font-black text-white mb-1">Fraud Prevention</div>
                <div className="text-sm text-white/40 font-light">
                  ป้องกันร้านค้าสแกน QR แทนลูกค้า — ระบบจำกัด 1 เบอร์โทร/วัน + GPS ตรวจสอบว่าสแกนจากอุปกรณ์เดียวซ้ำซากหรือไม่
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section id="features" className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-center mb-14">
              <div className="text-xs font-extrabold tracking-[4px] uppercase mb-3" style={{ color: RED }}>ฟีเจอร์ทั้งหมด</div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3">ระบบครบวงจร</h2>
              <p className="text-gray-400 text-lg font-light">ทุกเครื่องมือที่แบรนด์และร้านค้าต้องการ ในแดชบอร์ดเดียว</p>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={fadeUp}
                  className="group border-2 border-gray-100 rounded-3xl p-8 hover:border-[#fd1803]/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(160deg,rgba(253,24,3,.02),transparent)' }} />
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(253,24,3,.08)' }}>
                    <Icon size={22} style={{ color: RED }} />
                  </div>
                  <h3 className="text-base font-black text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="py-24 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(160deg,${DARK},#2D2D44)` }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%,rgba(253,24,3,.2),transparent 70%)' }} />
          <div className="max-w-2xl mx-auto px-6 relative">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.h2 variants={fadeUp}
                className="text-4xl lg:text-6xl font-black text-white mb-4 leading-tight">
                พร้อมสร้าง<br />
                <span style={{ color: '#ff8070' }}>Double Reward</span><br />
                ให้ร้านคุณแล้วหรือยัง?
              </motion.h2>
              <motion.p variants={fadeUp}
                className="text-white/50 text-lg mb-10 font-light">
                สมัครฟรี ไม่ต้องใส่บัตรเครดิต เริ่มออก QR Code ได้ใน 15 นาที
              </motion.p>
              <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-wrap">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-[15px] font-black text-white hover:opacity-90 transition-opacity"
                  style={{ background: `linear-gradient(135deg,${RED},#e01502)`, boxShadow: '0 8px 30px rgba(253,24,3,.45)' }}>
                  สมัครร้านค้าฟรี <ArrowRight size={16} />
                </Link>
                <a href="https://line.me"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-[15px] font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                  นัดผู้เชี่ยวชาญ <ChevronRight size={16} />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
