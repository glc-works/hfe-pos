import React, { useState } from 'react'
import { Building2, DollarSign, Printer, Network, Layers } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { HfeCompanyProfile } from '../../types/pos'
import { CompanyLegalProfileZone } from './CompanyLegalProfileZone'
import { FinancialTaxPolicyZone } from './FinancialTaxPolicyZone'
import { HardwareCashierZone } from './HardwareCashierZone'
import { HfeCoreIntegrationZone } from './HfeCoreIntegrationZone'

export type SettingsZoneTab = 'all' | 'legal-profile' | 'financial-tax' | 'hardware' | 'hfe-core'

export interface HfeSyncSettingsSectionProps {
  hfeCompanyProfile: HfeCompanyProfile
  setHfeCompanyProfile: React.Dispatch<React.SetStateAction<HfeCompanyProfile>>
  hfeBranchMode: 'dimensional' | 'multi_book' | 'sub_account'
  setHfeBranchMode: (mode: 'dimensional' | 'multi_book' | 'sub_account') => void
  activeBranchId: string
  setActiveBranchId: (id: string) => void
  outletBranches: { id: string; name: string; isMain: boolean }[]
  handleFetchHfeCompanyProfile: () => void
  handlePushHfeCompanyProfile: () => void
  defaultZoneTab?: SettingsZoneTab
}

export const HfeSyncSettingsSection: React.FC<HfeSyncSettingsSectionProps> = ({
  hfeCompanyProfile,
  setHfeCompanyProfile,
  hfeBranchMode,
  setHfeBranchMode,
  activeBranchId,
  setActiveBranchId,
  outletBranches,
  handleFetchHfeCompanyProfile,
  handlePushHfeCompanyProfile,
  defaultZoneTab = 'all'
}) => {
  const { t } = useTranslation()
  const [activeZone, setActiveZone] = useState<SettingsZoneTab>(defaultZoneTab)

  const ZONE_TABS: { id: SettingsZoneTab; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t.common.all, icon: <Layers className="w-4 h-4" /> },
    { id: 'legal-profile', label: t.settings.zone1NavTitle, icon: <Building2 className="w-4 h-4" /> },
    { id: 'financial-tax', label: t.settings.zone2NavTitle, icon: <DollarSign className="w-4 h-4" /> },
    { id: 'hardware', label: t.settings.zone3NavTitle, icon: <Printer className="w-4 h-4" /> },
    { id: 'hfe-core', label: t.settings.zone4NavTitle, icon: <Network className="w-4 h-4" /> }
  ]

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 4-ZONE HORIZONTAL PILL NAVIGATOR */}
      <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-lg">
        {ZONE_TABS.map((tab) => {
          const isActive = activeZone === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveZone(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* RENDER ACTIVE ZONES */}
      <div className="flex flex-col gap-5">
        {/* ZONE 1: PROFIL USAHA & IDENTITAS LEGAL */}
        {(activeZone === 'all' || activeZone === 'legal-profile') && (
          <CompanyLegalProfileZone
            hfeCompanyProfile={hfeCompanyProfile}
            setHfeCompanyProfile={setHfeCompanyProfile}
          />
        )}

        {/* ZONE 2: KEBIJAKAN FINANSIAL, PAJAK PB1 & BIAYA TAKEAWAY */}
        {(activeZone === 'all' || activeZone === 'financial-tax') && (
          <FinancialTaxPolicyZone />
        )}

        {/* ZONE 3: PERANGKAT KERAS & KASIR */}
        {(activeZone === 'all' || activeZone === 'hardware') && (
          <HardwareCashierZone />
        )}

        {/* ZONE 4: INTEGRASI HFE CORE SSOT */}
        {(activeZone === 'all' || activeZone === 'hfe-core') && (
          <HfeCoreIntegrationZone
            hfeCompanyProfile={hfeCompanyProfile}
            setHfeCompanyProfile={setHfeCompanyProfile}
            hfeBranchMode={hfeBranchMode}
            setHfeBranchMode={setHfeBranchMode}
            activeBranchId={activeBranchId}
            setActiveBranchId={setActiveBranchId}
            outletBranches={outletBranches}
            handleFetchHfeCompanyProfile={handleFetchHfeCompanyProfile}
            handlePushHfeCompanyProfile={handlePushHfeCompanyProfile}
          />
        )}
      </div>
    </div>
  )
}
