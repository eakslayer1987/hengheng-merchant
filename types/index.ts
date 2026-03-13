// ─── User / Auth ───────────────────────────────────────────
export interface User {
  id: number
  phone: string
  name: string
  role: 'customer' | 'merchant' | 'admin'
  created_at: string
}

export interface JWTPayload {
  id: number
  phone: string
  role: 'customer' | 'merchant' | 'admin'
}

// ─── Merchant ───────────────────────────────────────────────
export interface Merchant {
  id: number
  user_id: number
  store_name: string
  phone: string
  address: string
  qr_code: string
  approved: boolean
  created_at: string
}

export interface MerchantQuota {
  id: number
  merchant_id: number
  quota_total: number
  quota_used: number
  created_at: string
}

export interface MerchantStats {
  quota_total: number
  quota_used: number
  quota_remaining: number
  total_spins: number
  total_coupons: number
  total_receipts: number
}

// ─── Receipt ───────────────────────────────────────────────
export interface Receipt {
  id: number
  merchant_id: number
  image_url: string
  quantity: number
  approved: boolean
  approved_at?: string
  created_at: string
  store_name?: string
}

// ─── Reward / Spin ─────────────────────────────────────────
export interface Reward {
  id: number
  name: string
  name_en: string
  type: 'discount' | 'free_meal' | 'points' | 'raffle' | 'none'
  value: number
  probability: number
  color: string
  emoji: string
  active: boolean
}

export interface Spin {
  id: number
  user_id: number
  merchant_id: number
  reward_id: number
  reward?: Reward
  created_at: string
}

export interface SpinResult {
  success: boolean
  reward: Reward
  coupon_code?: string
  raffle_ticket_id?: number
  message: string
}

// ─── Coupon ────────────────────────────────────────────────
export interface Coupon {
  id: number
  code: string
  user_id: number
  reward_id: number
  reward?: Reward
  merchant_id: number
  merchant?: { store_name: string }
  status: 'active' | 'used' | 'expired'
  created_at: string
  expires_at: string
}

// ─── Raffle ────────────────────────────────────────────────
export interface RaffleTicket {
  id: number
  user_id: number
  spin_id: number
  ticket_code: string
  created_at: string
}

// ─── API Response ──────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ─── Admin ─────────────────────────────────────────────────
export interface AdminStats {
  total_merchants: number
  total_customers: number
  total_spins: number
  total_coupons: number
  pending_receipts: number
  total_quota_issued: number
}
