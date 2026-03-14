import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { queryOne, execute } from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin')
    return NextResponse.json({ success: false }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const merchant_id = searchParams.get('merchant_id')

  const receipts = merchant_id
    ? await execute(`SELECT * FROM receipts WHERE merchant_id=? ORDER BY created_at DESC`, [merchant_id])
    : await execute(`SELECT r.*, m.store_name, m.phone FROM receipts r JOIN merchants m ON r.merchant_id=m.id ORDER BY r.approved ASC, r.created_at DESC LIMIT 100`, [])

  return NextResponse.json({ success: true, data: receipts })
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin')
    return NextResponse.json({ success: false }, { status: 403 })

  const { receipt_id, approved } = await req.json()

  // ถ้าอนุมัติ → เพิ่ม quota
  if (approved) {
    const receipt = await queryOne<any>(
      'SELECT * FROM receipts WHERE id=?', [receipt_id]
    )
    if (receipt) {
      const spins = receipt.quantity * 30
      await execute(
        `UPDATE merchant_quota SET quota_total=quota_total+? WHERE merchant_id=?`,
        [spins, receipt.merchant_id]
      )
    }
  }

  await execute('UPDATE receipts SET approved=? WHERE id=?', [approved ? 1 : 0, receipt_id])
  return NextResponse.json({ success: true })
}
