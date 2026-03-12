import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import './globals.css'

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'เฮงเฮงปังจัง Merchant — ระบบ Loyalty B2B2C สำหรับร้านค้าพาร์ทเนอร์',
  description: 'สร้าง QR Code Loyalty สำหรับร้านอาหาร เชื่อมแบรนด์ ร้านอาหาร และลูกค้าในระบบเดียว',
  openGraph: {
    title: 'เฮงเฮงปังจัง Merchant',
    description: 'ระบบ Loyalty B2B2C สำหรับร้านค้าพาร์ทเนอร์',
    locale: 'th_TH',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={kanit.variable}>
      <body className="font-kanit antialiased">{children}</body>
    </html>
  )
}
