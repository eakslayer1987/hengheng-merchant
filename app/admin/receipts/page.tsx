import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { query } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import ReceiptsClient from './ReceiptsClient'

export default async function AdminReceiptsPage() {
  const user = getAuthUser()
  if (!user || user.role !== 'admin') redirect('/auth/login')

  const receipts = await query(
    `SELECT r.*, m.store_name, u.phone FROM receipts r
     JOIN merchants m ON r.merchant_id = m.id
     JOIN users u ON m.user_id = u.id
     ORDER BY r.approved ASC, r.created_at DESC LIMIT 100`
  )
  return (
    <AdminLayout>
      <ReceiptsClient receipts={receipts as any} />
    </AdminLayout>
  )
}
