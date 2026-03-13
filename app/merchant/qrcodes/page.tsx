import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import type { Merchant } from '@/types'
import QRCodeClient from './QRCodeClient'

export default async function QRCodesPage() {
  const user = getAuthUser()
  if (!user) redirect('/auth/login')

  const merchant = await queryOne<Merchant>(
    'SELECT * FROM merchants WHERE user_id = ?', [user.id]
  )
  if (!merchant) redirect('/auth/login')

  return <QRCodeClient merchant={merchant} />
}
