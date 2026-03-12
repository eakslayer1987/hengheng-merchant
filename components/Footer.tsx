import Link from 'next/link'

const footerCols = [
  { title: 'สำรวจ', links: [{ label:'ฟีเจอร์', href:'#features' },{ label:'วิธีทำงาน', href:'#how' },{ label:'แพ็กเกจ', href:'#pricing' },{ label:'Case Studies', href:'#' }] },
  { title: 'บริษัท', links: [{ label:'ปังจัง.com', href:'https://xn--72cac8e8ec.com/' },{ label:'Merchant Portal', href:'https://meeprungmerchant.com/' },{ label:'เกี่ยวกับเรา', href:'#' },{ label:'ติดต่อ', href:'#' }] },
  { title: 'ช่วยเหลือ', links: [{ label:'คู่มือการใช้งาน', href:'#' },{ label:'FAQ', href:'#faq' },{ label:'LINE Support', href:'#' },{ label:'นโยบาย PDPA', href:'#' }] },
]

export default function Footer() {
  return (
    <footer className="bg-[#1C1C2E] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-orange"
                style={{background:'linear-gradient(135deg,#fd1803,#e01502)'}}>🐻</div>
              <div>
                <div className="text-[15px] font-extrabold leading-none">เฮงเฮงปังจัง</div>
                <div className="text-[10px] font-bold leading-none mt-0.5" style={{color:'#fd1803'}}>Merchant Loyalty Platform</div>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-[240px]">
              แพลตฟอร์ม B2B2C Loyalty สำหรับร้านค้าพาร์ทเนอร์
            </p>
          </div>
          {footerCols.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-extrabold tracking-wider mb-4 text-white/80 uppercase">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-white/50 font-medium transition-colors hover:text-[#fd1803]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/30">© 2025 เฮงเฮงปังจัง.com สงวนสิทธิ์ทุกประการ</p>
          <div className="flex gap-5">
            {['นโยบายความเป็นส่วนตัว','เงื่อนไขการใช้งาน','Cookie Policy'].map(t => (
              <a key={t} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
