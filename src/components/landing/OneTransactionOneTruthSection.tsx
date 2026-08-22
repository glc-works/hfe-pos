import React from 'react'
import { Card, Badge } from '../../ui'
import { QrCode, UtensilsCrossed, CreditCard, BookOpen, Building2, Sparkles, ArrowRight } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'

export const OneTransactionOneTruthSection: React.FC = () => {
  const { t } = useTranslation()

  const steps = [
    {
      num: '1',
      icon: <QrCode className="w-5 h-5 text-amber-500" />,
      title: t.landing.oneTruthStep1Title,
      desc: t.landing.oneTruthStep1Desc,
      badge: 'Guest Touchpoint',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    {
      num: '2',
      icon: <UtensilsCrossed className="w-5 h-5 text-blue-500" />,
      title: t.landing.oneTruthStep2Title,
      desc: t.landing.oneTruthStep2Desc,
      badge: 'Kitchen Routing',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    {
      num: '3',
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
      title: t.landing.oneTruthStep3Title,
      desc: t.landing.oneTruthStep3Desc,
      badge: 'Zero Variance',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      num: '4',
      icon: <BookOpen className="w-5 h-5 text-purple-500" />,
      title: t.landing.oneTruthStep4Title,
      desc: t.landing.oneTruthStep4Desc,
      badge: 'Double-Entry GL',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
    {
      num: '5',
      icon: <Building2 className="w-5 h-5 text-rose-500" />,
      title: t.landing.oneTruthStep5Title,
      desc: t.landing.oneTruthStep5Desc,
      badge: 'HQ Live Delta',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
  ]

  return (
    <section className="py-12 border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">
            {t.landing.oneTruthTag}
          </Badge>
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t.landing.oneTruthTitle}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            {t.landing.oneTruthSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((step, idx) => (
            <Card
              key={step.num}
              className="p-4 flex flex-col justify-between space-y-3 bg-card border-border hover:border-primary/40 transition-all shadow-sm relative group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-xs">
                    {step.icon}
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-mono ${step.badgeColor}`}>
                    {step.badge}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground leading-snug">
                  {step.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40 group-hover:text-primary transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
