import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'เฮงเฮงปังจัง | Reward Platform',
  description: 'สแกน QR หมุนวงล้อ รับรางวัลทันที',
  manifest: '/manifest.json',
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
  openGraph: {
    title: 'เฮงเฮงปังจัง',
    description: 'สแกน QR หมุนวงล้อ รับรางวัลทันที',
    locale: 'th_TH',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#7C3AED',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="font-kanit antialiased">{children}</body>
    </html>
  )
}
