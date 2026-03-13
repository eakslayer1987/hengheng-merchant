'use client'
import { Suspense } from 'react'
import SpinInner from './SpinInner'
export default function SpinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400 font-medium">กำลังโหลด…</p></div>}>
      <SpinInner />
    </Suspense>
  )
}
