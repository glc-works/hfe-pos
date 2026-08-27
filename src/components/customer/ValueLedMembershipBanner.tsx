import React, { useState } from 'react'
import { useTranslation } from '../../context/LanguageContext'

export interface ValueLedMembershipBannerProps {
  isCustomerSessionActive?: boolean
  onJoinMembership?: (phone: string) => void
}

export const ValueLedMembershipBanner: React.FC<ValueLedMembershipBannerProps> = ({
  isCustomerSessionActive = false,
  onJoinMembership
}) => {
  const { t } = useTranslation()
  const [showJoinPhone, setShowJoinPhone] = useState(false)
  const [joinPhoneInput, setJoinPhoneInput] = useState('')
  const [joinedSuccess, setJoinedSuccess] = useState(false)

  if (isCustomerSessionActive) return null

  return (
    <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-2.5 flex flex-col gap-1.5 shadow-sm text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          🎁 {joinedSuccess ? t.customer.membershipJoinSuccess : t.customer.membershipJoinIdle}
        </span>
        {!joinedSuccess && !showJoinPhone && (
          <button
            type="button"
            onClick={() => setShowJoinPhone(true)}
            className="min-h-[44px] px-3 rounded-lg bg-emerald-600 text-white font-bold text-[11px] active:scale-[0.97] hover:bg-emerald-700 transition-colors shrink-0"
          >
            {t.customer.membershipJoinCta}
          </button>
        )}
      </div>
      {showJoinPhone && !joinedSuccess && (
        <div className="flex items-center gap-1.5 pt-1">
          <input
            type="tel"
            placeholder={t.customer.membershipPhonePlaceholder}
            value={joinPhoneInput}
            onChange={(e) => setJoinPhoneInput(e.target.value)}
            className="flex-1 min-h-[44px] text-xs px-2 rounded-lg border bg-background border-border outline-none"
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
            className="min-h-[44px] px-3 rounded-lg bg-emerald-600 text-white font-bold text-xs active:scale-[0.97] hover:bg-emerald-700 transition-colors shrink-0"
          >
            {t.customer.membershipSaveCta}
          </button>
          <button
            type="button"
            onClick={() => setShowJoinPhone(false)}
            className="min-h-[44px] text-[11px] text-muted-foreground px-2 active:scale-[0.97] transition-transform shrink-0"
          >
            {t.customer.membershipCancelCta}
          </button>
        </div>
      )}
      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
        {joinedSuccess ? t.customer.membershipHintSuccess : t.customer.membershipHintIdle}
      </p>
    </div>
  )
}
