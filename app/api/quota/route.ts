import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import type { Merchant, MerchantStats } from '@/types'

export async function GET(req: NextRequest) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const merchant = await queryOne<Merchant>('SELECT * FROM merchants WHERE user_id = ?', [user.id])
  if (!merchant) return NextResponse.json({ success: false, message: 'ไม่พบร้านค้า' })

  const stats = await queryOne<MerchantStats>(
    `SELECT
       COALESCE(q.quota_total, 0)                             AS quota_total,
       COALESCE(q.quota_used, 0)                              AS quota_used,
       COALESCE(q.quota_total, 0) - COALESCE(q.quota_used, 0) AS quota_remaining,
       (SELECT COUNT(*) FROM spins   WHERE merchant_id = ?)   AS total_spins,
       (SELECT COUNT(*) FROM coupons WHERE merchant_id = ?)   AS total_coupons,
       (SELECT COUNT(*) FROM receipts WHERE merchant_id = ?)  AS total_receipts
     FROM merchants m
     LEFT JOIN merchant_quota q ON m.id = q.merchant_id
     WHERE m.id = ?`,
    [merchant.id, merchant.id, merchant.id, merchant.id]
  )

  return NextResponse.json({ success: true, data: stats, merchant })
}
