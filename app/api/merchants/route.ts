import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { query, execute } from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = getAuthUser()
  if (!user || user.role !== 'admin')
    return NextResponse.json({ success: false }, { status: 403 })

  const merchants = await query(
    `SELECT m.*, u.phone, u.created_at AS user_created,
       COALESCE(q.quota_total,0) AS quota_total,
       COALESCE(q.quota_used,0)  AS quota_used,
       (SELECT COUNT(*) FROM spins s WHERE s.merchant_id=m.id) AS total_spins
     FROM merchants m
     JOIN users u ON m.user_id = u.id
     LEFT JOIN merchant_quota q ON m.id = q.merchant_id
     ORDER BY m.created_at DESC`
  )
  return NextResponse.json({ success: true, data: merchants })
}

export async function PUT(req: NextRequest) {
  const user = getAuthUser()
  if (!user || user.role !== 'admin')
    return NextResponse.json({ success: false }, { status: 403 })

  const { merchant_id, approved } = await req.json()
  await execute('UPDATE merchants SET approved=? WHERE id=?', [approved ? 1 : 0, merchant_id])
  return NextResponse.json({ success: true })
}
