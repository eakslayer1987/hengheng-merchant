import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { query } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import MerchantsClient from './MerchantsClient'

export default async function AdminMerchantsPage() {
  const user = getAuthUser()
  if (!user || user.role !== 'admin') redirect('/auth/login')

  const merchants = await query(
    `SELECT m.*, u.phone,
       COALESCE(q.quota_total,0) AS quota_total,
       COALESCE(q.quota_used,0)  AS quota_used,
       (SELECT COUNT(*) FROM spins s WHERE s.merchant_id=m.id) AS total_spins,
       (SELECT COUNT(*) FROM receipts r WHERE r.merchant_id=m.id AND r.approved=0) AS pending_receipts
     FROM merchants m
     JOIN users u ON m.user_id = u.id
     LEFT JOIN merchant_quota q ON m.id = q.merchant_id
     ORDER BY m.created_at DESC`
  )

  return (
    <AdminLayout>
      <MerchantsClient merchants={merchants as any} />
    </AdminLayout>
  )
}
