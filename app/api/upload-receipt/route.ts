import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { query, queryOne, execute } from '@/lib/db'
import { uploadFile } from '@/lib/storage'
import type { Merchant } from '@/types'

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const merchant = await queryOne<Merchant>(
    'SELECT * FROM merchants WHERE phone=? LIMIT 1', [user.phone]
  )
  if (!merchant) return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลร้านค้า' })

  const formData = await req.formData()
  const file     = formData.get('receipt') as File | null
  const quantity = parseInt(formData.get('quantity') as string || '1')

  if (!file) return NextResponse.json({ success: false, message: 'ไม่พบไฟล์' })
  if (quantity < 1 || quantity > 100)
    return NextResponse.json({ success: false, message: 'จำนวนไม่ถูกต้อง' })

  const buffer   = Buffer.from(await file.arrayBuffer())
  const imageUrl = await uploadFile(buffer, file.name, file.type, 'receipts')

  const result = await execute(
    'INSERT INTO receipts (merchant_id, image_url, quantity, approved) VALUES (?,?,?,0)',
    [merchant.id, imageUrl, quantity]
  )

  return NextResponse.json({
    success: true,
    receipt_id: result.insertId,
    message: `อัพโหลดสำเร็จ! รอการอนุมัติจาก Admin (${quantity} ถุง = ${quantity*30} spins)`,
  })
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const merchant = await queryOne<Merchant>(
    'SELECT * FROM merchants WHERE phone=? LIMIT 1', [user.phone]
  )
  if (!merchant) return NextResponse.json({ success: false })

  const receipts = await query(
    `SELECT * FROM receipts WHERE merchant_id=? ORDER BY created_at DESC LIMIT 20`,
    [merchant.id]
  )
  return NextResponse.json({ success: true, data: receipts })
}
