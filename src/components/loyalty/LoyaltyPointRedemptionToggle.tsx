import React, { useState, useEffect } from 'react'
import { Award, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

export interface LoyaltyPointRedemptionToggleProps {
  availablePoints: number
  conversionRate?: number // e.g. 100 IDR per point (500 pts = Rp 50.000)
  redeemedPoints: number
  onChangeRedemption: (pointsToRedeem: number, discountAmount: number) => void
  maxRedeemableAmount?: number
  customerName?: string
  disabled?: boolean
}

export const LoyaltyPointRedemptionToggle: React.FC<LoyaltyPointRedemptionToggleProps> = ({
  availablePoints,
  conversionRate = 100,
  redeemedPoints,
  onChangeRedemption,
  maxRedeemableAmount,
  customerName = 'Pelanggan',
  disabled = false
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(redeemedPoints > 0)
  const [pointsInput, setPointsInput] = useState<number>(redeemedPoints > 0 ? redeemedPoints : Math.min(500, availablePoints))

  // Max points allowed based on maxRedeemableAmount if specified
  const maxPointsAllowedByBill = maxRedeemableAmount
    ? Math.floor(maxRedeemableAmount / conversionRate)
    : availablePoints
  const effectiveMaxPoints = Math.min(availablePoints, maxPointsAllowedByBill)

  useEffect(() => {
    if (isEnabled) {
      const validPoints = Math.min(pointsInput, effectiveMaxPoints)
      const calculatedDiscount = validPoints * conversionRate
      onChangeRedemption(validPoints, calculatedDiscount)
    } else {
      onChangeRedemption(0, 0)
    }
  }, [isEnabled, pointsInput, effectiveMaxPoints, conversionRate])

  const handleToggle = () => {
    if (disabled) return
    const nextState = !isEnabled
    setIsEnabled(nextState)
    if (nextState) {
      const defaultPts = Math.min(500, effectiveMaxPoints)
      setPointsInput(defaultPts)
    }
  }

  const handleApplyPreset = (pts: number) => {
    const clamped = Math.min(pts, effectiveMaxPoints)
    setPointsInput(clamped)
    if (!isEnabled) setIsEnabled(true)
  }

  const currentDiscount = isEnabled ? pointsInput * conversionRate : 0
  const remainingPoints = isEnabled ? Math.max(0, availablePoints - pointsInput) : availablePoints

  const formatIdr = (num: number) => `Rp ${Math.round(num).toLocaleString('id-ID')}`

  return (
    <div className={`p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 transition-all ${
      isEnabled ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''
    }`}>
      {/* Header & Toggle Switch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border transition-all ${
            isEnabled
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              Penukaran Poin Loyalty
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                ⭐ {availablePoints} Poin
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Redeem poin loyalty {customerName} (1 Poin = {formatIdr(conversionRate)})
            </p>
          </div>
        </div>

        {/* Custom Toggle Switch Button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled || availablePoints <= 0}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            isEnabled ? 'bg-amber-500' : 'bg-slate-800'
          } ${disabled || availablePoints <= 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Expanded Controls when Enabled */}
      {isEnabled && (
        <div className="pt-2 border-t border-slate-800 space-y-3 animate-fade-in">
          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => handleApplyPreset(250)}
              disabled={effectiveMaxPoints < 250}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold whitespace-nowrap disabled:opacity-40"
            >
              Redeem 250 Poin (Potongan {formatIdr(250 * conversionRate)})
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(500)}
              disabled={effectiveMaxPoints < 500}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold whitespace-nowrap disabled:opacity-40"
            >
              Redeem 500 Poin (Potongan {formatIdr(500 * conversionRate)})
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(effectiveMaxPoints)}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-extrabold whitespace-nowrap"
            >
              Gunakan Maksimal ({effectiveMaxPoints} Poin)
            </button>
          </div>

          {/* Points Input & Calculated Discount */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Poin Ditukarkan:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={effectiveMaxPoints}
                  value={pointsInput}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    setPointsInput(Math.min(val, effectiveMaxPoints))
                  }}
                  className="w-24 px-2 py-1 bg-slate-900 border border-amber-500/40 rounded-lg text-xs font-mono font-bold text-amber-400 text-right focus:outline-none"
                />
                <span className="text-slate-400 font-bold">Poin</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Total Potongan Direct:
              </span>
              <span className="font-mono font-extrabold text-sm text-emerald-400">
                - {formatIdr(currentDiscount)}
              </span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Sisa Poin Pelanggan:</span>
              <span className="font-mono font-semibold text-slate-300">{remainingPoints} Poin</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
