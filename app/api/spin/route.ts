import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { query, queryOne, execute } from '@/lib/db'
import { pickReward, generateCouponCode, generateTicketCode } from '@/lib/spin'
import type { Reward, Merchant } from '@/types'

export async function POST(req: NextRequest) {
  const user = getAuthUser()
  if (!user) return NextResponse.json({ success: false, message: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })

  const { merchant_id } = await req.json()
  if (!merchant_id) return NextResponse.json({ success: false, message: 'ไม่พบ merchant_id' })

  // ─── 1. Check merchant exists & has quota ─────────────────
  const merchant = await queryOne<Merchant>(
    'SELECT * FROM merchants WHERE id = ? AND approved = 1', [merchant_id]
  )
  if (!merchant) return NextResponse.json({ success: false, message: 'ไม่พบร้านค้านี้' })

  const quota = await queryOne<{ quota_total: number; quota_used: number }>(
    'SELECT quota_total, quota_used FROM merchant_quota WHERE merchant_id = ?', [merchant_id]
  )
  if (!quota || quota.quota_total - quota.quota_used <= 0)
    return NextResponse.json({ success: false, message: 'โควต้าของร้านนี้หมดแล้ว' })

  // ─── 2. Anti-cheat: 1 spin per user per merchant per day ──
  const today = new Date().toISOString().slice(0, 10)
  const existingSpin = await queryOne(
    `SELECT id FROM spins
     WHERE user_id=? AND merchant_id=? AND DATE(created_at)=?`,
    [user.id, merchant_id, today]
  )
  if (existingSpin)
    return NextResponse.json({ success: false, message: 'คุณได้หมุนวงล้อของร้านนี้วันนี้แล้ว' })

  // ─── 3. Pick reward ───────────────────────────────────────
  const rewards = await query<Reward>('SELECT * FROM rewards WHERE active=1 ORDER BY sort_order')
  if (!rewards.length) return NextResponse.json({ success: false, message: 'ยังไม่มีรางวัลในระบบ' })
  const reward = pickReward(rewards)

  // ─── 4. Record spin + reduce quota ───────────────────────
  const spinResult = await execute(
    'INSERT INTO spins (user_id, merchant_id, reward_id) VALUES (?,?,?)',
    [user.id, merchant_id, reward.id]
  )
  await execute(
    'UPDATE merchant_quota SET quota_used = quota_used + 1 WHERE merchant_id = ?',
    [merchant_id]
  )

  let coupon_code: string | undefined
  let raffle_ticket_id: number | undefined

  // ─── 5. Create coupon (if reward has value) ───────────────
  if (reward.type !== 'none') {
    const code     = generateCouponCode()
    const expires  = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    const couponResult = await execute(
      `INSERT INTO coupons (code, user_id, reward_id, merchant_id, spin_id, expires_at)
       VALUES (?,?,?,?,?,?)`,
      [code, user.id, reward.id, merchant_id, spinResult.insertId, expires.toISOString()]
    )
    coupon_code = code
  }

  // ─── 6. Create raffle ticket ──────────────────────────────
  const ticketCode = generateTicketCode()
  const ticketResult = await execute(
    'INSERT INTO raffle_tickets (user_id, spin_id, ticket_code) VALUES (?,?,?)',
    [user.id, spinResult.insertId, ticketCode]
  )
  raffle_ticket_id = ticketResult.insertId

  return NextResponse.json({
    success: true,
    data: {
      reward,
      coupon_code,
      raffle_ticket_id,
      ticket_code: ticketCode,
      message: reward.type === 'none'
        ? 'เสียดายครั้งนี้ไม่ได้รางวัล แต่ได้รับ Ticket ลุ้นโชคใหญ่!'
        : `ยินดีด้วย! คุณได้รับ ${reward.name}`,
    },
  })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const merchant_id = searchParams.get('merchant_id')
  if (!merchant_id) return NextResponse.json({ success: false })

  const rewards = await query<Reward>('SELECT * FROM rewards WHERE active=1 ORDER BY sort_order')
  const quota   = await queryOne<{ quota_total: number; quota_used: number }>(
    'SELECT quota_total, quota_used FROM merchant_quota WHERE merchant_id = ?', [merchant_id]
  )
  const merchant = await queryOne<Merchant>(
    'SELECT id, store_name, phone FROM merchants WHERE id = ? AND approved = 1', [merchant_id]
  )
  if (!merchant) return NextResponse.json({ success: false, message: 'ไม่พบร้านค้า' })

  return NextResponse.json({ success: true, data: { rewards, quota, merchant } })
}
