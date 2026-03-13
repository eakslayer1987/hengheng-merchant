import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'

export default function HomePage() {
  const user = getAuthUser()
  if (!user) redirect('/auth/login')
  if (user.role === 'admin')    redirect('/admin/dashboard')
  if (user.role === 'merchant') redirect('/merchant/dashboard')
  redirect('/auth/login')
}
