import React, { useState } from 'react'

export interface ValueLedMembershipBannerProps {
  isCustomerSessionActive?: boolean
  onJoinMembership?: (phone: string) => void
}

export const ValueLedMembershipBanner: React.FC<ValueLedMembershipBannerProps> = ({
  isCustomerSessionActive = false,
  onJoinMembership
}) => {
  const [showJoinPhone, setShowJoinPhone] = useState(false)
  const [joinPhoneInput, setJoinPhoneInput] = useState('')
  const [joinedSuccess, setJoinedSuccess] = useState(false)

  if (isCustomerSessionActive) return null

  return (
    <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-2.5 flex flex-col gap-1.5 shadow-sm text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          🎁 {joinedSuccess ? 'Member Aktif: Poin Tersimpan!' : 'Gabung Member: Hemat & Kumpulkan Poin'}
        </span>
        {!joinedSuccess && !showJoinPhone && (
          <button
            type="button"
            onClick={() => setShowJoinPhone(true)}
            className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors"
          >
            ✨ Gabung (1-Ketuk)
          </button>
        )}
      </div>
      {showJoinPhone && !joinedSuccess && (
        <div className="flex items-center gap-1.5 pt-1">
          <input
            type="tel"
            placeholder="Nomor HP (cth: 08123456789)"
            value={joinPhoneInput}
            onChange={(e) => setJoinPhoneInput(e.target.value)}
            className="flex-1 text-xs px-2 py-1 rounded-lg border bg-background border-border outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (joinPhoneInput.trim().length >= 8) {
                onJoinMembership?.(joinPhoneInput.trim())
                setJoinedSuccess(true)
                setShowJoinPhone(false)
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => setShowJoinPhone(false)}
            className="text-[11px] text-muted-foreground px-1"
          >
            Batal
          </button>
        </div>
      )}
      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
        {joinedSuccess ? 'Nomor terhubung ke transaksi ini.' : 'Daftar instan tanpa password untuk struk digital & reward point.'}
      </p>
    </div>
  )
}
