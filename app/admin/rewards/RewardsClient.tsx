'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import type { Reward } from '@/types'

export default function RewardsClient({ rewards: init }: { rewards: Reward[] }) {
  const [rewards,  setRewards]  = useState(init)
  const [saving,   setSaving]   = useState<number | null>(null)
  const [saved,    setSaved]    = useState<number | null>(null)

  const totalProb = rewards.filter(r => r.active).reduce((s, r) => s + Number(r.probability), 0)

  async function updateReward(id: number, changes: Partial<Reward>) {
    setRewards(rs => rs.map(r => r.id === id ? { ...r, ...changes } : r))
  }

  async function saveReward(r: Reward) {
    setSaving(r.id)
    try {
      await axios.put('/api/rewards', {
        id: r.id,
        name: r.name,
        probability: r.probability,
        active: r.active,
        value: r.value,
      })
      setSaved(r.id)
      setTimeout(() => setSaved(null), 2000)
    } catch { alert('บันทึกไม่สำเร็จ') }
    finally { setSaving(null) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">ตั้งค่ารางวัล</h1>
        <p className="text-gray-400 text-sm mt-0.5">ปรับความน่าจะเป็นและเปิด/ปิดรางวัลแต่ละรายการ</p>
      </div>

      {/* Probability total */}
      <div className={`rounded-2xl p-4 mb-5 flex items-center gap-3
        ${Math.abs(totalProb - 100) < .01 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="text-2xl">{Math.abs(totalProb - 100) < .01 ? '✅' : '⚠️'}</div>
        <div>
          <div className={`text-sm font-bold ${Math.abs(totalProb - 100) < .01 ? 'text-green-700' : 'text-orange-700'}`}>
            รวมความน่าจะเป็น: {totalProb.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">ควรรวมได้ 100% พอดี</div>
        </div>
      </div>

      {/* Probability bar visual */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 mb-5">
        <div className="text-xs font-bold text-gray-500 mb-3">สัดส่วนรางวัล</div>
        <div className="flex h-6 rounded-full overflow-hidden gap-0.5">
          {rewards.filter(r => r.active && r.probability > 0).map(r => (
            <div key={r.id}
              style={{ width: `${r.probability}%`, background: r.color }}
              className="relative group" title={`${r.name}: ${r.probability}%`}>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {rewards.filter(r => r.active).map(r => (
            <div key={r.id} className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
              {r.name} ({r.probability}%)
            </div>
          ))}
        </div>
      </div>

      {/* Reward cards */}
      <div className="space-y-3">
        {rewards.map((r, i) => (
          <motion.div key={r.id}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.05*i }}
            className={`bg-white rounded-2xl p-4 shadow-card border transition-all
              ${r.active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}
          >
            <div className="flex items-start gap-3">
              {/* Color dot + emoji */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: r.color + '22' }}>
                {r.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <input value={r.name}
                    onChange={e => updateReward(r.id, { name: e.target.value })}
                    className="font-bold text-gray-900 text-sm bg-transparent border-b border-dashed
                      border-gray-200 focus:outline-none focus:border-brand-400 flex-1 min-w-0"
                  />
                  {/* Toggle active */}
                  <button onClick={() => updateReward(r.id, { active: !r.active })}
                    className={`w-10 h-6 rounded-full flex-shrink-0 relative transition-colors
                      ${r.active ? 'bg-brand-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
                      ${r.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div className="text-xs text-gray-400 mb-3">{r.name_en} · Type: {r.type}</div>

                {/* Probability slider */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16">ความน่าจะเป็น</span>
                  <input type="range" min="0" max="100" step="1"
                    value={r.probability}
                    onChange={e => updateReward(r.id, { probability: Number(e.target.value) })}
                    className="flex-1 accent-brand-500"
                  />
                  <span className="text-sm font-black text-brand-600 w-12 text-right">
                    {Number(r.probability).toFixed(0)}%
                  </span>
                </div>

                {/* Value (discount amount) */}
                {(r.type === 'discount' || r.type === 'points') && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500 w-16">
                      {r.type === 'discount' ? 'ส่วนลด (฿)' : 'คะแนน'}
                    </span>
                    <input type="number" value={r.value}
                      onChange={e => updateReward(r.id, { value: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg
                        focus:outline-none focus:border-brand-400"
                    />
                  </div>
                )}

                {/* Save button */}
                <div className="mt-3 flex justify-end">
                  <button onClick={() => saveReward(r)}
                    disabled={saving === r.id}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all
                      ${saved === r.id
                        ? 'bg-green-100 text-green-600'
                        : 'bg-brand-600 text-white shadow-brand'}`}>
                    {saving === r.id ? 'กำลังบันทึก...' : saved === r.id ? '✅ บันทึกแล้ว' : 'บันทึก'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
