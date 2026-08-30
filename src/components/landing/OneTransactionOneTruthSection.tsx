import React from 'react'
import { Card, Badge } from '../../ui'
import { QrCode, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

export const OneTransactionOneTruthSection: React.FC = () => {
  const { t } = useTranslation()

  const steps = [
    {
      num: '1',
      icon: <QrCode className="w-5 h-5 text-amber-500" />,
      title: t.landing.oneTruthStep1Title,
      desc: t.landing.oneTruthStep1Desc,
      badge: 'Scan & Order',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    {
      num: '2',
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
      title: t.landing.oneTruthStep2Title,
      desc: t.landing.oneTruthStep2Desc,
      badge: 'Payment',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      num: '3',
      icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
      title: t.landing.oneTruthStep3Title,
      desc: t.landing.oneTruthStep3Desc,
      badge: 'Ready',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
  ]

  return (
    <section className="py-12 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/30">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block">
            {t.landing.oneTruthTag}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.landing.oneTruthTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t.landing.oneTruthSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="p-4 flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all shadow-xs dark:shadow-md relative group rounded-2xl"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs">
                    {step.icon}
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-mono ${step.badgeColor}`}>
                    {step.badge}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600 group-hover:text-amber-500 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
