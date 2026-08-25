import { useTranslation } from '../../context/LanguageContext'
import type { CafeFinancialNotice, CafeFinancialStatus, CheckoutFailureCode } from '../../hooks/useCafeSettlement'

interface FinancialStatusBannerProps {
  status: CafeFinancialStatus
  notice: CafeFinancialNotice
  failureCode: CheckoutFailureCode | null
  onResume: () => void
}

export function FinancialStatusBanner({ status, notice, failureCode, onResume }: FinancialStatusBannerProps) {
  const { t } = useTranslation()
  if (!notice || status === 'idle') return null

  const tone = status === 'error'
    ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200'
    : status === 'posted'
      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
      : 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200'

  return (
    <div role="status" data-financial-failure-code={failureCode || undefined} className={`relative z-[90] shrink-0 px-3 py-2 text-center text-xs font-bold ${tone}`}>
      <span>{t.cart.financialNotices[notice]}</span>
      {(notice === 'outcome_unknown' || notice === 'pending_core' || notice === 'posted_unacknowledged') && (
        <button type="button" onClick={onResume} className="ml-3 rounded-md border border-current px-2 py-1 underline-offset-2 hover:underline">
          {t.cart.resumeFinancialAttempt}
        </button>
      )}
    </div>
  )
}
