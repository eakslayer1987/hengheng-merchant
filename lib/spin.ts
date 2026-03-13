import { Reward } from '@/types'

export function pickReward(rewards: Reward[]): Reward {
  const active = rewards.filter(r => r.active)
  const total  = active.reduce((s, r) => s + r.probability, 0)
  let rand = Math.random() * total
  for (const r of active) {
    rand -= r.probability
    if (rand <= 0) return r
  }
  return active[active.length - 1]
}

export function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'HH-'
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'TK-'
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// Wheel segment stop angles for each reward slot (6 segments by default)
export function getWheelStopAngle(rewardIndex: number, totalSegments: number): number {
  const segmentAngle = 360 / totalSegments
  const baseAngle    = segmentAngle * rewardIndex + segmentAngle / 2
  // Add extra full rotations for drama
  return 1800 + (360 - baseAngle)
}
