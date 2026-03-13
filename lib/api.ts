// ───────────────────────────────────────────────
//  lib/api.ts  — PHP backend base URL helper
//  PHP lives at: xn--72ca9ib1gc.xn--72cac8e8ec.com
// ───────────────────────────────────────────────

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://xn--72ca9ib1gc.xn--72cac8e8ec.com'

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

// ── Types ──────────────────────────────────────
export interface QRInfo {
  qr_id: string
  merchant_name: string
  merchant_address: string
  merchant_logo?: string
  remaining_codes: number
  total_codes: number
}

export interface SpinResult {
  code_id: string
  prize_id: number
  prize_name: string
  prize_type: 'discount' | 'free_meal' | 'points' | 'no_prize'
  prize_value: number
  prize_description: string
  big_prize_ticket: string | null
}

export interface PrizeItem {
  id: number
  name: string
  type: 'discount' | 'free_meal' | 'points' | 'no_prize'
  value: number
  color: string
  probability: number
}
