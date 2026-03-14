import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import MerchantLayout from '@/components/merchant/MerchantLayout'
import UploadClient from './UploadClient'

export default async function UploadPage() {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')

  const merchant = await queryOne<any>(
    'SELECT * FROM merchants WHERE phone=? LIMIT 1', [user.phone]
  )
  if (!merchant) redirect('/auth/login')

  const merchantMapped = {
    ...merchant,
    store_name: merchant.shop_name || merchant.store_name || '',
    id: merchant.id,
  }

  return (
    <MerchantLayout storeName={merchantMapped.store_name}>
      <UploadClient merchantId={merchantMapped.id} />
    </MerchantLayout>
  )
}
