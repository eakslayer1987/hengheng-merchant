import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import type { Merchant } from '@/types'
import MerchantLayout from '@/components/merchant/MerchantLayout'
import HistoryClient from './HistoryClient'

export default async function HistoryPage() {
  const user = getAuthUser()
  if (!user) redirect('/auth/login')

  const merchant = await queryOne<Merchant>('SELECT * FROM merchants WHERE user_id=?', [user.id])
  if (!merchant) redirect('/auth/login')

  const spins = await query(
    `SELECT s.id, s.created_at, r.name, r.emoji, r.color, r.type,
       u.name AS customer_name, u.phone AS customer_phone,
       c.code AS coupon_code, c.status AS coupon_status
     FROM spins s
     JOIN rewards r ON s.reward_id = r.id
     JOIN users u   ON s.user_id   = u.id
     LEFT JOIN coupons c ON c.spin_id = s.id
     WHERE s.merchant_id = ?
     ORDER BY s.created_at DESC LIMIT 50`,
    [merchant.id]
  )

  return (
    <MerchantLayout storeName={merchant.store_name}>
      <HistoryClient spins={spins as any} />
    </MerchantLayout>
  )
}
