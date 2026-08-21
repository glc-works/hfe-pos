import React from 'react'
import {
  Database,
  Radio,
  RefreshCw,
  Check,
  Building2,
  Store,
  CheckCircle2,
  Network
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { HfeCompanyProfile } from '../../types/pos'
import { TextInput, Button, Badge } from '@/ui'

export interface HfeCoreIntegrationZoneProps {
  hfeCompanyProfile: HfeCompanyProfile
  setHfeCompanyProfile: React.Dispatch<React.SetStateAction<HfeCompanyProfile>>
  hfeBranchMode: 'dimensional' | 'multi_book' | 'sub_account'
  setHfeBranchMode: (mode: 'dimensional' | 'multi_book' | 'sub_account') => void
  activeBranchId: string
  setActiveBranchId: (id: string) => void
  outletBranches: { id: string; name: string; isMain: boolean }[]
  handleFetchHfeCompanyProfile: () => void
  handlePushHfeCompanyProfile: () => void
}

export const HfeCoreIntegrationZone: React.FC<HfeCoreIntegrationZoneProps> = ({
  hfeCompanyProfile,
  setHfeCompanyProfile,
  hfeBranchMode,
  setHfeBranchMode,
  activeBranchId,
  setActiveBranchId,
  outletBranches,
  handleFetchHfeCompanyProfile,
  handlePushHfeCompanyProfile
}) => {
  const { t } = useTranslation()

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {t.settings.zone4Heading}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.settings.zone4Desc}
            </p>
          </div>
        </div>

        <Badge variant="emerald" glyph="📡">
          {t.settings.liveSyncedBadge}
        </Badge>
      </div>

      {/* 1. BOOK ID & REST API ENDPOINT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label={t.settings.companyBookId}
          leadingIcon={<Database className="w-4 h-4 text-indigo-400" />}
          value={hfeCompanyProfile.companyBookId}
          onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, companyBookId: e.target.value }))}
          className="font-mono font-bold text-indigo-300"
          placeholder="UUID Book ID"
        />

        <TextInput
          label={t.settings.ledgerApiEndpoint}
          leadingIcon={<Network className="w-4 h-4 text-emerald-400" />}
          value={hfeCompanyProfile.hfeLedgerApiEndpoint}
          onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, hfeLedgerApiEndpoint: e.target.value }))}
          className="font-mono text-emerald-400"
          placeholder="http://localhost:8080/v1"
        />
      </div>

      {/* SYNC ACTIONS STRIP */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate">TigerBeetle + PostgreSQL Financial Journal Core</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={handleFetchHfeCompanyProfile}
            icon={<RefreshCw className="w-3.5 h-3.5 text-indigo-400" />}
          >
            {t.settings.resyncFromApi}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handlePushHfeCompanyProfile}
            icon={<Check className="w-3.5 h-3.5 stroke-[3]" />}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {t.settings.pushToCoreHfe}
          </Button>
        </div>
      </div>

      {/* 2. MULTI-BRANCH ENGINE ARCHITECTURE */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              {t.settings.multiBranchTitle}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.settings.multiBranchDesc}</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs shrink-0">
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-semibold">{t.settings.activeBranch}</span>
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="bg-transparent text-indigo-300 font-mono font-bold focus:outline-none cursor-pointer"
            >
              {outletBranches.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* OPTION 1: DIMENSIONAL TAGGING */}
          <div
            onClick={() => setHfeBranchMode('dimensional')}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
              hfeBranchMode === 'dimensional'
                ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                  {t.settings.recommendedBadge}
                </span>
                {hfeBranchMode === 'dimensional' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <h5 className="font-bold text-xs text-white mt-1">{t.settings.dimensionalTagging}</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                {t.settings.dimensionalTaggingDesc}
              </p>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold w-fit">
              BEST FOR F&B
            </span>
          </div>

          {/* OPTION 2: MULTI-BOOK HIERARCHY */}
          <div
            onClick={() => setHfeBranchMode('multi_book')}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
              hfeBranchMode === 'multi_book'
                ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                  {t.settings.enterpriseBadge}
                </span>
                {hfeBranchMode === 'multi_book' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <h5 className="font-bold text-xs text-white mt-1">{t.settings.multiBookHierarchy}</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                {t.settings.multiBookHierarchyDesc}
              </p>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold w-fit">
              FRANCHISE / HOLDING
            </span>
          </div>

          {/* OPTION 3: SUB-ACCOUNT SEGMENTATION */}
          <div
            onClick={() => setHfeBranchMode('sub_account')}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
              hfeBranchMode === 'sub_account'
                ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {t.settings.auditBadge}
                </span>
                {hfeBranchMode === 'sub_account' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <h5 className="font-bold text-xs text-white mt-1">{t.settings.subAccountCoa}</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                {t.settings.subAccountCoaDesc}
              </p>
            </div>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-bold w-fit">
              SINGLE GL
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
