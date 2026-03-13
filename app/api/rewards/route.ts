import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { query, execute } from '@/lib/db'
import type { Reward } from '@/types'

export async function GET() {
  const rewards = await query<Reward>('SELECT * FROM rewards ORDER BY sort_order')
  return NextResponse.json({ success: true, data: rewards })
}

export async function PUT(req: NextRequest) {
  const user = getAuthUser()
  if (!user || user.role !== 'admin')
    return NextResponse.json({ success: false }, { status: 403 })

  const { id, probability, active, name, value } = await req.json()
  await execute(
    'UPDATE rewards SET probability=?, active=?, name=?, value=? WHERE id=?',
    [probability, active ? 1 : 0, name, value, id]
  )
  return NextResponse.json({ success: true })
}

export async function POST(req: NextRequest) {
  const user = getAuthUser()
  if (!user || user.role !== 'admin')
    return NextResponse.json({ success: false }, { status: 403 })

  const { name, name_en, type, value, probability, color, emoji } = await req.json()
  const result = await execute(
    'INSERT INTO rewards (name, name_en, type, value, probability, color, emoji) VALUES (?,?,?,?,?,?,?)',
    [name, name_en, type, value, probability, color, emoji]
  )
  return NextResponse.json({ success: true, id: result.insertId })
}
