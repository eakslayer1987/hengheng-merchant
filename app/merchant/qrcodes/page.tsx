import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import MerchantLayout from '@/components/merchant/MerchantLayout'
import QRCodesClient from './QRCodesClient'

export default async function QRCodesPage() {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')

  const merchant = await queryOne<any>(
    'SELECT * FROM merchants WHERE phone=? LIMIT 1', [user.phone]
  )
  if (!merchant) redirect('/auth/login')

  const storeName = merchant.shop_name || merchant.store_name || ''
  const qrCode    = merchant.qr_code || `MP-${merchant.id}`
  const spinUrl   = `${process.env.NEXT_PUBLIC_APP_URL || 'https://xn--72ca9ib1gc.xn--72cac8e8ec.com'}/r/${merchant.id}`

  return (
    <MerchantLayout storeName={storeName}>
      <QRCodesClient
        merchantId={merchant.id}
        storeName={storeName}
        qrCode={qrCode}
        spinUrl={spinUrl}
      />
    </MerchantLayout>
  )
}
