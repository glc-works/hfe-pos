import React, { useState } from 'react'
import { Star, Heart, CheckCircle2, MessageSquare, AlertCircle, Sparkles, Send, X } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useNotification } from '../../context/NotificationContext'
import { CafeThemeConfig } from '../../types/pos'

export interface PostVisitFeedbackSectionProps {
  activeTheme: CafeThemeConfig
  tableNumber?: string
  guestName?: string
  isMember?: boolean
  onSaveMemberVisit?: () => void
}

export const PostVisitFeedbackSection: React.FC<PostVisitFeedbackSectionProps> = ({
  activeTheme,
  tableNumber = 'OUT-04',
  guestName = 'Tamu',
  isMember = false,
  onSaveMemberVisit,
}) => {
  const { t } = useTranslation()
  const { createServiceTicket } = useNotification()

  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAlertSubmitted, setIsAlertSubmitted] = useState<boolean>(false)
  const [isPointsSaved, setIsPointsSaved] = useState<boolean>(false)
  
  // HFE Product Feedback Modal state
  const [showProductFeedbackModal, setShowProductFeedbackModal] = useState<boolean>(false)
  const [productSentiment, setProductSentiment] = useState<'loved' | 'better' | 'wrong' | null>(null)
  const [productFeedbackNote, setProductFeedbackNote] = useState<string>('')
  const [productFeedbackSent, setProductFeedbackSent] = useState<boolean>(false)

  const isLight = activeTheme.mode === 'light'
  const accentColor = activeTheme.primaryAccentHex || '#f59e0b'

  const handleRatingClick = (stars: number) => {
    setSelectedRating(stars)
    setIsAlertSubmitted(false)
  }

  const toggleTag = (tagKey: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagKey) ? prev.filter((t) => t !== tagKey) : [...prev, tagKey]
    )
  }

  const handleSubmitServiceAlert = () => {
    if (!selectedRating) return
    const reasonText = selectedTags.length > 0 ? selectedTags.join(', ') : 'Keluhan Tamu'
    createServiceTicket({
      tableNumber,
      type: 'waiter_call',
      notes: reasonText,
    })
    setIsAlertSubmitted(true)
  }

  const handleSavePoints = () => {
    setIsPointsSaved(true)
    onSaveMemberVisit?.()
  }

  const handleSendProductFeedback = () => {
    if (!productSentiment) return
    setProductFeedbackSent(true)
    setTimeout(() => {
      setShowProductFeedbackModal(false)
      setProductFeedbackSent(false)
      setProductSentiment(null)
      setProductFeedbackNote('')
    }, 1800)
  }

  const tagOptions = [
    { key: 'slow_order', label: t.feedback.tagSlowOrder },
    { key: 'food_quality', label: t.feedback.tagFoodQuality },
    { key: 'wrong_order', label: t.feedback.tagWrongOrder },
    { key: 'staff_service', label: t.feedback.tagStaffService },
    { key: 'other', label: t.feedback.tagOther },
  ]

  return (
    <section 
      className="w-full mt-4 p-4 rounded-2xl border transition-all animate-fadeIn"
      style={{
        backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.85)',
        borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
      }}
    >
      {/* 1. Header & Star Rating */}
      <div className="flex flex-col items-center text-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {t.feedback.howWasYourVisitTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t.feedback.howWasYourVisitSubtitle}
        </p>

        {/* 5-Star Rating Buttons */}
        <div className="flex items-center gap-2 mt-3">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = selectedRating !== null && star <= selectedRating
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                aria-label={`Rate ${star} stars`}
                className={`p-2 rounded-xl transition-all duration-150 active:scale-90 ${
                  isFilled
                    ? 'text-amber-500 bg-amber-500/10 scale-110 shadow-sm'
                    : 'text-slate-400 dark:text-slate-600 hover:text-amber-400 bg-slate-100 dark:bg-slate-800/60'
                }`}
              >
                <Star className={`w-5 h-5 ${isFilled ? 'fill-amber-500' : ''}`} />
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Positive Branch (4-5 Stars) ➔ Membership & Points CTA */}
      {selectedRating !== null && selectedRating >= 4 && (
        <div className="mt-4 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col gap-2.5 animate-slideUp">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {t.feedback.positiveKeepPointsTitle}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                {t.feedback.positiveKeepPointsDesc}
              </span>
            </div>
          </div>

          {!isPointsSaved ? (
            <button
              type="button"
              onClick={handleSavePoints}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: accentColor,
                color: isLight ? '#ffffff' : '#020617',
              }}
            >
              <span>{t.feedback.savePointsCta}</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Poin & Kunjungan Berhasil Disimpan!</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Negative Branch (1-3 Stars) ➔ Service Recovery & Manager Ticket */}
      {selectedRating !== null && selectedRating <= 3 && (
        <div className="mt-4 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 flex flex-col gap-2.5 animate-slideUp">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {t.feedback.negativeRecoveryTitle}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 text-left">
            {t.feedback.negativeRecoveryDesc}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {tagOptions.map((tag) => {
              const isSelected = selectedTags.includes(tag.key)
              return (
                <button
                  key={tag.key}
                  type="button"
                  onClick={() => toggleTag(tag.key)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-400'
                  }`}
                >
                  {tag.label}
                </button>
              )
            })}
          </div>

          {!isAlertSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitServiceAlert}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 mt-1"
            >
              <span>{t.feedback.submitServiceAlert}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{t.feedback.alertSentSuccess}</span>
            </div>
          )}
        </div>
      )}

      {/* 4. Secondary Footer: HFE Product Feedback */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-center">
        <button
          type="button"
          onClick={() => setShowProductFeedbackModal(true)}
          className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors py-1"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>{t.feedback.helpUsGrowCta}</span>
        </button>
      </div>

      {/* 5. Product Feedback Modal Sheet */}
      {showProductFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div 
            className="w-full max-w-sm rounded-2xl border p-4 shadow-2xl animate-scaleUp relative flex flex-col gap-3"
            style={{
              backgroundColor: isLight ? '#ffffff' : '#0f172a',
              borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {t.feedback.helpUsGrowTitle}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowProductFeedbackModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-left">
              {t.feedback.helpUsGrowSubtitle}
            </p>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'loved', label: t.feedback.productLovedIt },
                { id: 'better', label: t.feedback.productCouldBeBetter },
                { id: 'wrong', label: t.feedback.productSomethingWrong },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setProductSentiment(opt.id as any)}
                  className={`p-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                    productSentiment === opt.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <textarea
              value={productFeedbackNote}
              onChange={(e) => setProductFeedbackNote(e.target.value)}
              placeholder={t.feedback.feedbackOptionalPlaceholder}
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            {!productFeedbackSent ? (
              <button
                type="button"
                disabled={!productSentiment}
                onClick={handleSendProductFeedback}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.feedback.sendProductFeedback}</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.feedback.thankYouFeedback}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
