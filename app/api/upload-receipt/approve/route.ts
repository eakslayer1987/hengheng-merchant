import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { query, queryOne, execute } from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = getAuthUser()
  if (!user || user.role !== 'admin')
    return NextResponse.json({ success: false }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const pending = searchParams.get('pending') === '1'

  const receipts = await query(
    `SELECT r.*, m.store_name, u.phone FROM receipts r
     JOIN merchants m ON r.merchant_id = m.id
     JOIN users u ON m.user_id = u.id
     ${pending ? 'WHERE r.approved = 0' : ''}
     ORDER BY r.created_at DESC LIMIT 50`
  )
  return NextResponse.json({ success: true, data: receipts })
}

export async function PUT(req: NextRequest) {
  const user = getAuthUser()
  if (!user || user.role !== 'admin')
    return NextResponse.json({ success: false }, { status: 403 })

  const { receipt_id, approved } = await req.json()

  const receipt = await queryOne<{
    id: number; merchant_id: number; quantity: number; approved: number
  }>('SELECT * FROM receipts WHERE id=?', [receipt_id])

  if (!receipt) return NextResponse.json({ success: false, message: 'ไม่พบใบเสร็จ' })

  await execute(
    'UPDATE receipts SET approved=?, approved_at=NOW(), approved_by=? WHERE id=?',
    [approved ? 1 : 0, user.id, receipt_id]
  )

  // If approving: add quota
  if (approved && !receipt.approved) {
    const quota = receipt.quantity * 30
    await execute(
      `INSERT INTO merchant_quota (merchant_id, quota_total, quota_used)
       VALUES (?,?,0)
       ON DUPLICATE KEY UPDATE quota_total = quota_total + ?`,
      [receipt.merchant_id, quota, quota]
    )
  }
  // If revoking: subtract quota (only the portion from this receipt)
  if (!approved && receipt.approved) {
    const quota = receipt.quantity * 30
    await execute(
      `UPDATE merchant_quota SET quota_total = GREATEST(0, quota_total - ?)
       WHERE merchant_id=?`,
      [quota, receipt.merchant_id]
    )
  }

  return NextResponse.json({ success: true })
}
