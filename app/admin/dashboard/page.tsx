import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const user = getAuthUser()
  if (!user || user.role !== 'admin') redirect('/auth/login')

  const stats = await queryOne<{
    total_merchants: number
    total_customers: number
    total_spins: number
    total_coupons: number
    pending_receipts: number
  }>(
    `SELECT
       (SELECT COUNT(*) FROM merchants)                       AS total_merchants,
       (SELECT COUNT(*) FROM users WHERE role='customer')     AS total_customers,
       (SELECT COUNT(*) FROM spins)                           AS total_spins,
       (SELECT COUNT(*) FROM coupons)                         AS total_coupons,
       (SELECT COUNT(*) FROM receipts WHERE approved=0)       AS pending_receipts`
  ) || { total_merchants:0, total_customers:0, total_spins:0, total_coupons:0, pending_receipts:0 }

  // Spins per day last 7 days
  const spinChart = await query<{ date: string; count: number }>(
    `SELECT DATE(created_at) AS date, COUNT(*) AS count
     FROM spins WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
     GROUP BY DATE(created_at) ORDER BY date ASC`
  )

  return (
    <AdminLayout>
      <AdminDashboardClient stats={stats} spinChart={spinChart} />
    </AdminLayout>
  )
}
