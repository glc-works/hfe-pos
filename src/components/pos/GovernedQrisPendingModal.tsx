import { QrCode, X } from 'lucide-react'
import type { QrisPaymentResponse } from '../../services/financial'
import { useTranslation } from '../../context/LanguageContext'

interface GovernedQrisPendingModalProps {
  payment: QrisPaymentResponse & { tender_id: string }
  onClose: () => void
}

export function GovernedQrisPendingModal({ payment, onClose }: GovernedQrisPendingModalProps) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="governed-qris-title"
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-slate-700 bg-slate-900 p-5 text-center shadow-2xl"
      >
        <div className="flex w-full items-center justify-between gap-3">
          <h2 id="governed-qris-title" className="flex min-w-0 items-center gap-2 text-sm font-bold text-white">
            <QrCode className="h-5 w-5 shrink-0 text-amber-400" />
            <span className="truncate">{t.cart.qrisPendingTitle}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cart.qrisPendingClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
          <img className="h-44 w-44" src={payment.qr_image_url} alt={t.cart.qrisPendingTitle} />
        </div>

        <p className="text-xs leading-relaxed text-slate-300">{t.cart.qrisPendingInstruction}</p>
        <dl className="grid w-full gap-2 rounded-xl bg-slate-950/60 p-3 text-left text-[11px] text-slate-300">
          <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2">
            <dt>{t.cart.qrisPendingReference}</dt>
            <dd className="truncate font-mono text-white">{payment.payment_id}</dd>
          </div>
          <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2">
            <dt>{t.cart.qrisPendingExpiry}</dt>
            <dd className="truncate font-mono text-white">{payment.expires_at}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
