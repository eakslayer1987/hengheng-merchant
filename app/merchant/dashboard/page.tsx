import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import type { Merchant, MerchantStats } from '@/types'
import MerchantDashboardClient from './DashboardClient'

export default async function MerchantDashboardPage() {
  const user = getAuthUser()
  if (!user) redirect('/auth/login')

  // ใช้ phone แทน user_id เพราะตาราง merchants เก่าไม่มี column user_id
  const merchant = await queryOne<Merchant>(
    'SELECT * FROM merchants WHERE phone = ? LIMIT 1', [user.phone]
  )
  if (!merchant) redirect('/auth/login')

  const stats = await queryOne<MerchantStats>(
    `SELECT
       COALESCE(q.quota_total,0)                                AS quota_total,
       COALESCE(q.quota_used,0)                                 AS quota_used,
       COALESCE(q.quota_total,0) - COALESCE(q.quota_used,0)    AS quota_remaining,
       (SELECT COUNT(*) FROM spins    WHERE merchant_id=?)      AS total_spins,
       (SELECT COUNT(*) FROM coupons  WHERE merchant_id=?)      AS total_coupons,
       (SELECT COUNT(*) FROM receipts WHERE merchant_id=?)      AS total_receipts
     FROM merchants m
     LEFT JOIN merchant_quota q ON m.id = q.merchant_id
     WHERE m.id = ?`,
    [merchant.id, merchant.id, merchant.id, merchant.id]
  ) || { quota_total:0, quota_used:0, quota_remaining:0, total_spins:0, total_coupons:0, total_receipts:0 }

  const recentSpins = await queryOne<{ count: number }>(
    `SELECT COUNT(*) AS count FROM spins
     WHERE merchant_id=? AND DATE(created_at)=CURDATE()`,
    [merchant.id]
  )

  return (
    <MerchantDashboardClient
      merchant={merchant}
      stats={stats as MerchantStats}
      todaySpins={recentSpins?.count || 0}
    />
  )
}
