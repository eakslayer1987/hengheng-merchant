import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 10) return clean.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  return phone
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone
  return phone.slice(0, 3) + '***' + phone.slice(-3)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(date))
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('th-TH').format(n)
}
