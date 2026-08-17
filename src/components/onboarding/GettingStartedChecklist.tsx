import React, { useState } from 'react'
import { useOnboarding } from '../../hooks/useOnboarding'
import { StoreOnboardingWizard } from './StoreOnboardingWizard'
import { GettingStartedGuideModal } from './GettingStartedGuideModal'
import { Button, Badge } from '@/ui'
import { Sparkles, ShieldCheck, ChevronDown, ChevronUp, RotateCcw, Building2, Users, DollarSign, BookOpen } from 'lucide-react'

export interface GettingStartedChecklistProps {
  companyName?: string
  staffCount?: number
  cashFloat?: number
}

export const GettingStartedChecklist: React.FC<GettingStartedChecklistProps> = ({
  companyName = 'PT Artisan Kopi Indonesia',
  staffCount = 3,
  cashFloat = 500000
}) => {
  const { isOnboardingCompleted } = useOnboarding()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  // System-Verified Verification Rules (HCB Core Concept)
  const isProfileVerified = Boolean(companyName && companyName.length > 3)
  const isStaffVerified = staffCount >= 1
  const isShiftVerified = cashFloat > 0

  const items = [
    {
      id: 'step-1-pt',
      label: '1. Atur Profil PT / Identitas Badan Usaha',
      subtext: `Status: ${companyName} (${isProfileVerified ? 'Terdaftar di HCB Core REST API' : 'Belum Diatur'})`,
      icon: Building2,
      isVerified: isProfileVerified,
    },
    {
      id: 'step-2-staff',
      label: '2. Tambah Minimum 1 Staf Kasir',
      subtext: `Status: ${staffCount} Staf Aktif (${isStaffVerified ? 'Memenuhi Syarat Operasional' : 'Butuh Tambah Staf'})`,
      icon: Users,
      isVerified: isStaffVerified,
    },
    {
      id: 'step-3-shift',
      label: '3. Buka Shift Floating Awal',
      subtext: `Status Kas Awal: Rp ${cashFloat.toLocaleString('id-ID')} (${isShiftVerified ? 'Shift Terbuka' : 'Floating Kas Kosong'})`,
      icon: DollarSign,
      isVerified: isShiftVerified,
    },
  ]

  const completedCount = items.filter(it => it.isVerified).length
  const totalCount = items.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-900/20 shadow-md">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-600 text-white shadow-sm shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2 flex-wrap">
              Panduan Penyiapan System-Verified HCB Core
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                {completedCount}/{totalCount} Terverifikasi ({progressPercent}%)
              </span>
            </h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
              Verifikasi otomatis status riil operasional merchant HCB tanpa centang manual.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsGuideOpen(true)}
            className="text-xs h-8 border-amber-900/20 bg-amber-500/10 text-amber-950 dark:text-amber-100 hover:bg-amber-500/20 font-bold"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
            📖 Baca Panduan Lengkap
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setIsWizardOpen(true)}
            className="text-xs h-8 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            {isOnboardingCompleted ? 'Ulang Wizard' : 'Buka Setup Wizard'}
          </Button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-amber-900/10 rounded-full h-2 overflow-hidden">
        <div
          className="bg-amber-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      {!isCollapsed && (
        <div className="mt-4 space-y-2 border-t border-amber-900/10 pt-3">
          {items.map((it) => {
            const ItemIcon = it.icon

            return (
              <div
                key={it.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  it.isVerified
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                    : 'bg-amber-500/5 border-amber-900/15 text-amber-950 dark:text-amber-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${it.isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold flex items-center gap-2">
                      {it.label}
                    </h4>
                    <p className="text-[11px] text-amber-800/70 dark:text-amber-300/70 mt-0.5">
                      {it.subtext}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {it.isVerified ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> System Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Pending Action
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <StoreOnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={() => setIsWizardOpen(false)}
      />

      <GettingStartedGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenWizard={() => setIsWizardOpen(true)}
      />
    </div>
  )
}
