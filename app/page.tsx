'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function GoldBorder() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {[
        'top-0 left-0',
        'top-0 right-0 scale-x-[-1]',
        'bottom-0 left-0 scale-y-[-1]',
        'bottom-0 right-0 scale-[-1]',
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-14 h-14`}>
          <svg viewBox="0 0 56 56" className="w-full h-full" fill="none">
            <path d="M0 0 L36 0 L36 4 L4 4 L4 36 L0 36 Z" fill="#D4AF37"/>
            <path d="M0 0 L26 0 L26 3 L3 3 L3 26 L0 26 Z" fill="#FFD700"/>
            <circle cx="7" cy="7" r="3.5" fill="#FFD700"/>
          </svg>
        </div>
      ))}
      <div className="absolute top-0 left-14 right-14 h-1 bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-700" />
      <div className="absolute bottom-0 left-14 right-14 h-1 bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-700" />
      <div className="absolute left-0 top-14 bottom-14 w-1 bg-gradient-to-b from-yellow-700 via-yellow-300 to-yellow-700" />
      <div className="absolute right-0 top-14 bottom-14 w-1 bg-gradient-to-b from-yellow-700 via-yellow-300 to-yellow-700" />
    </div>
  )
}

export default function HomePage() {
  const [ticketNum] = useState(() =>
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')
  )
  const [drawDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 1, 1)
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
  })
  const [glow, setGlow] = useState(false)
  useEffect(() => {
    const t = setInterval(() => setGlow(g => !g), 2500)
    return () => clearInterval(t)
  }, [])

  const thaiDigit = (n: string) =>
    n.split('').map(d => '๐๑๒๓๔๕๖๗๘๙'[parseInt(d)]).join('')

  return (
    <div className="min-h-screen overflow-x-hidden" style={{
      background: 'linear-gradient(160deg,#7a0000 0%,#cc0000 35%,#ee2200 55%,#cc0000 75%,#7a0000 100%)',
      fontFamily: "'Kanit','Sarabun',sans-serif",
    }}>
      {/* Temple BG */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.07]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300'%3E%3Cpath d='M0 300 L80 300 L80 180 L100 150 L120 120 L140 90 L160 70 L180 90 L200 120 L220 150 L240 180 L240 300Z' fill='white'/%3E%3Cpath d='M550 300 L620 300 L620 200 L635 170 L650 140 L665 110 L680 90 L695 110 L710 140 L725 170 L740 200 L740 300Z' fill='white'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }}/>

      {/* Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div key={i} className="fixed rounded-full pointer-events-none"
          style={{
            width: `${3+(i%3)*3}px`, height: `${3+(i%3)*3}px`,
            background: i%2===0 ? '#FFD700' : '#FFF',
            left: `${8+(i*9.3)%85}%`, top: `${8+(i*8.7)%82}%`,
            opacity: 0.5,
          }}
          animate={{ y:[-8,8,-8], opacity:[0.3,0.7,0.3] }}
          transition={{ repeat:Infinity, duration:3+(i%3), delay:i*0.35 }}
        />
      ))}

      {/* Marquee */}
      <div className="relative overflow-hidden bg-yellow-500 py-1.5 z-20">
        <motion.div animate={{ x:['100%','-200%'] }} transition={{ repeat:Infinity, duration:20, ease:'linear' }}
          className="whitespace-nowrap text-red-900 font-black text-xs tracking-widest px-4">
          ✦ สลากกินแบ่งดิจิทัล หมีปรุง ✦ MEEPRUNG DIGITAL LOTTERY ✦ รางวัลที่ ๑ หนึ่งแสนบาท ✦ หมุนวงล้อรับโชคทุกวัน ✦
        </motion.div>
      </div>

      <div className="relative z-10 max-w-sm mx-auto px-4 py-5 pb-36">

        {/* Lottery Card */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{ boxShadow:'0 8px 40px rgba(0,0,0,.5), 0 0 0 2px #D4AF37' }}>

          <GoldBorder />

          {/* Red header */}
          <div className="relative py-4 px-8 text-center"
            style={{ background:'linear-gradient(180deg,#CC0000,#990000)' }}>
            <div className="absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center">
              <span className="text-yellow-400 text-[8px] font-black whitespace-nowrap"
                style={{ writingMode:'vertical-rl', transform:'rotate(180deg)', letterSpacing:'0.25em' }}>
                สลากกินแบ่งดิจิทัล
              </span>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-5 flex items-center justify-center">
              <span className="text-yellow-400 text-[8px] font-black whitespace-nowrap"
                style={{ writingMode:'vertical-rl', letterSpacing:'0.25em' }}>
                หมีปรุง
              </span>
            </div>

            <motion.div animate={{ y:[0,-4,0] }} transition={{ repeat:Infinity, duration:2.5 }}
              className="text-5xl mb-2 leading-none">🐻‍🍳</motion.div>

            <div className="inline-block border-2 border-yellow-400 rounded-xl px-5 py-1 mb-2"
              style={{ background:'linear-gradient(135deg,#7a0000,#cc0000)' }}>
              <div className="text-xl font-black text-yellow-300 tracking-widest"
                style={{ textShadow:'0 2px 4px rgba(0,0,0,.6)' }}>หมีปรุง</div>
              <div className="text-yellow-400 text-[9px] tracking-[0.35em] font-bold">MEE PRUNG</div>
            </div>

            <div className="text-yellow-200 text-xs font-bold">สลากกินแบ่งดิจิทัล หมีปรุง</div>
            <div className="text-yellow-300 text-[11px]">งวดวันที่ {drawDate}</div>
          </div>

          {/* Number section */}
          <div className="px-5 py-4 text-center"
            style={{ background:'linear-gradient(180deg,#FFF9C4,#FFE000)' }}>
            <div className="text-red-900 text-xs font-bold mb-1 tracking-wide">ชุดที่ ๑</div>
            <motion.div
              animate={glow
                ? { textShadow:'0 0 20px #FF6B00, 0 0 40px #FFD700' }
                : { textShadow:'0 2px 6px rgba(0,0,0,.25)' }}
              transition={{ duration:0.6 }}
              className="text-5xl font-black text-red-900 tracking-[0.18em]"
              style={{ fontFamily:'Georgia,serif' }}>
              {ticketNum}
            </motion.div>
            <div className="text-red-800/60 text-sm tracking-[0.25em] font-semibold mt-0.5">
              {thaiDigit(ticketNum)}
            </div>

            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {[
                { label:'เลขหน้า ๓ ตัว', val:ticketNum.slice(0,3) },
                { label:'เลขท้าย ๓ ตัว', val:ticketNum.slice(3,6) },
                { label:'เลขท้าย ๒ ตัว', val:ticketNum.slice(4,6) },
              ].map(x => (
                <div key={x.label} className="rounded-lg py-2 bg-red-800/10">
                  <div className="text-red-900 text-[9px] font-semibold">{x.label}</div>
                  <div className="text-red-900 text-xl font-black">{x.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Prize row */}
          <div className="grid grid-cols-2 gap-2 px-4 pb-4"
            style={{ background:'linear-gradient(180deg,#FFE000,#FFC000)' }}>
            <div className="bg-red-800 rounded-xl p-3 text-center">
              <div className="text-yellow-300 text-[10px] font-bold mb-0.5">รางวัลที่ ๑</div>
              <div className="text-yellow-300 text-xl font-black">฿๑๐๐,๐๐๐</div>
              <div className="text-yellow-200 text-[9px]">บาท</div>
            </div>
            <div className="bg-red-800 rounded-xl p-2">
              <table className="w-full text-[10px] text-yellow-200">
                <tbody>
                  {[['ที่ ๑','100,000'],['ที่ ๒','50,000'],['ที่ ๓','20,000'],['ท้าย ๒','2,000']].map(([r,v])=>(
                    <tr key={r}>
                      <td className="py-0.5">{r}</td>
                      <td className="text-right font-bold">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* How to play */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.4 }}
          className="mt-4 rounded-2xl overflow-hidden"
          style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,215,0,0.25)' }}>
          <div className="px-4 py-2.5 border-b border-yellow-500/20 text-center">
            <span className="text-yellow-300 font-black text-sm tracking-wide">🎯 วิธีรับสลาก</span>
          </div>
          <div className="px-4 py-3 space-y-2.5">
            {[
              ['🛒','ซื้อซอสหมีปรุง 1 ถุง = 1 สลาก'],
              ['📱','สแกน QR ที่ร้านอาหาร รับสิทธิ์ทันที'],
              ['🎰','หมุนวงล้อลุ้นรางวัลประจำวัน'],
              ['🎟️','สะสม Ticket ลุ้นโชคใหญ่รายเดือน'],
            ].map(([icon,text],i)=>(
              <motion.div key={i} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.5+i*0.1 }}
                className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background:'rgba(255,215,0,0.18)' }}>{icon}</div>
                <span className="text-white text-sm font-semibold">{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.65 }}
          className="mt-4 grid grid-cols-3 gap-2">
          {[['500+','ร้านอาหาร'],['10K+','ผู้ร่วมสนุก'],['฿100K','รางวัลใหญ่']].map(([v,l])=>(
            <div key={l} className="text-center rounded-xl py-3"
              style={{ background:'rgba(255,255,255,0.08)' }}>
              <div className="text-yellow-300 font-black text-base">{v}</div>
              <div className="text-white/60 text-[11px]">{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-6 pt-4"
        style={{ background:'linear-gradient(to top, rgba(100,0,0,1) 70%, transparent)' }}>
        <div className="max-w-sm mx-auto space-y-2.5">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}>
            <Link href="/auth/login"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-base text-red-900"
              style={{ background:'linear-gradient(135deg,#FFD700,#FF9500)', boxShadow:'0 4px 24px rgba(255,200,0,.5)' }}>
              🎫 ร้านค้า / เข้าสู่ระบบ
            </Link>
          </motion.div>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}>
            <Link href="/auth/login"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-yellow-300 border border-yellow-600/40"
              style={{ background:'rgba(255,255,255,0.08)' }}>
              📱 สแกน QR รับสลากฟรี
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
