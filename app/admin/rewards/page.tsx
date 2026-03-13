import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { query } from '@/lib/db'
import AdminLayout from '@/components/admin/AdminLayout'
import RewardsClient from './RewardsClient'
import type { Reward } from '@/types'

export default async function AdminRewardsPage() {
  const user = getAuthUser()
  if (!user || user.role !== 'admin') redirect('/auth/login')

  const rewards = await query<Reward>('SELECT * FROM rewards ORDER BY sort_order')
  return (
    <AdminLayout>
      <RewardsClient rewards={rewards} />
    </AdminLayout>
  )
}
