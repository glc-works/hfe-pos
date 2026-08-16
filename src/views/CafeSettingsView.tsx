import React, { useState } from 'react'
import { ChevronLeft, Check, Layers, Store, Globe, Users, DollarSign, Package } from 'lucide-react'
import { useTranslation } from '../context/LanguageContext'
import { IosSettingsMasterList, SettingsSectionId } from '../components/settings/IosSettingsMasterList'
import { HfeSyncSettingsSection } from '../components/settings/HfeSyncSettingsSection'
import { ReservationSettingsSection } from '../components/settings/ReservationSettingsSection'
import { ThemeConfigSection } from '../components/settings/ThemeConfigSection'
import { CustomerCrmSection } from '../components/settings/CustomerCrmSection'
import { VoucherPromoSettingsSection } from '../components/settings/VoucherPromoSettingsSection'
import { GettingStartedChecklist } from '../components/onboarding/GettingStartedChecklist'
import { TeamRosterSection } from '../components/team/TeamRosterSection'
import {
  HfeCompanyProfile,
  CafeThemeConfig,
  TableReservation,
  CustomerProfile,
  MenuItem,
  ViewportModeType
} from '../types/pos'

export interface CafeSettingsViewProps {
  hfeCompanyProfile: HfeCompanyProfile
  setHfeCompanyProfile: React.Dispatch<React.SetStateAction<HfeCompanyProfile>>
  hfeBranchMode: 'dimensional' | 'multi_book' | 'sub_account'
  setHfeBranchMode: (mode: 'dimensional' | 'multi_book' | 'sub_account') => void
  activeBranchId: string
  setActiveBranchId: (id: string) => void
  outletBranches: { id: string; name: string; isMain: boolean }[]
  handleFetchHfeCompanyProfile: () => void
  handlePushHfeCompanyProfile: () => void
  reservationPolicyMode: 'instant' | 'manual_review'
  setReservationPolicyMode: (mode: 'instant' | 'manual_review') => void
  dpRequiredMode: boolean
  setDpRequiredMode: (req: boolean) => void
  dpAmountConfig: number
  setDpAmountConfig: (amt: number) => void
  reservations: TableReservation[]
  handleApproveReservation: (id: string) => void
  handleRejectReservation: (id: string) => void
  reservationOrderMode: 'table_only' | 'optional_order' | 'mandatory_order'
  setReservationOrderMode: (mode: 'table_only' | 'optional_order' | 'mandatory_order') => void
  customerAppDisplayMode: 'full_ordering' | 'catalog_only'
  setCustomerAppDisplayMode: (mode: 'full_ordering' | 'catalog_only') => void
  priceVisibilityMode: 'show_prices' | 'hide_prices'
  setPriceVisibilityMode: (mode: 'show_prices' | 'hide_prices') => void
  builtinThemes: CafeThemeConfig[]
  activeTheme: CafeThemeConfig
  setActiveTheme: (theme: CafeThemeConfig) => void
  merchantTheme?: CafeThemeConfig
  setMerchantTheme?: (theme: CafeThemeConfig) => void
  aiStylesheetInput: string
  setAiStylesheetInput: (val: string) => void
  handleExportThemeFile: () => void
  handleImportThemeFile: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleApplyAIThemeString: () => void
  customerProfiles: CustomerProfile[]
  productCatalog: MenuItem[]
  viewportMode?: ViewportModeType
}

export const CafeSettingsView: React.FC<CafeSettingsViewProps> = ({
  hfeCompanyProfile,
  setHfeCompanyProfile,
  hfeBranchMode,
  setHfeBranchMode,
  activeBranchId,
  setActiveBranchId,
  outletBranches,
  handleFetchHfeCompanyProfile,
  handlePushHfeCompanyProfile,
  reservationPolicyMode,
  setReservationPolicyMode,
  dpRequiredMode,
  setDpRequiredMode,
  dpAmountConfig,
  setDpAmountConfig,
  reservations,
  handleApproveReservation,
  handleRejectReservation,
  reservationOrderMode,
  setReservationOrderMode,
  customerAppDisplayMode,
  setCustomerAppDisplayMode,
  priceVisibilityMode,
  setPriceVisibilityMode,
  builtinThemes,
  activeTheme,
  setActiveTheme,
  merchantTheme,
  setMerchantTheme,
  aiStylesheetInput,
  setAiStylesheetInput,
  handleExportThemeFile,
  handleImportThemeFile,
  handleApplyAIThemeString,
  customerProfiles,
  productCatalog
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSectionId | null>(null)
  const { language, setLanguage, t } = useTranslation()

  const SECTION_TITLES: Record<SettingsSectionId, string> = {
    profile: 'Profil PT & Legalitas Resto',
    theme: 'Tema & Tampilan Visual',
    language: 'Bahasa (Language)',
    'tax-cash': 'Pajak PB1 & Kas Toko',
    team: 'Tim Staf & Akses PIN',
    'po-expense': 'PO Supplier & Kas Kecil',
    reservations: 'Reservasi Meja & DP',
    crm: 'Database Pelanggan (CRM)',
    vouchers: 'Manajemen Kupon & Promo Mitra',
    checklist: 'Getting Started Checklist'
  }

  return (
    <main className="flex-1 p-3 sm:p-6 max-w-4xl mx-auto w-full flex flex-col gap-5">
      {/* 1. MASTER VIEW (IOS INSET GROUPED LIST) */}
      {activeSection === null ? (
        <IosSettingsMasterList
          hfeCompanyProfile={hfeCompanyProfile}
          activeTheme={activeTheme}
          merchantTheme={merchantTheme}
          language={language}
          onSelectSection={(sec) => setActiveSection(sec)}
          onPushProfile={handlePushHfeCompanyProfile}
        />
      ) : (
        /* 2. SUB-PAGE DRILL-DOWN VIEW (WITH NATIVE BACK HEADER) */
        <div className="flex flex-col gap-5 animate-fadeIn pb-12">
          {/* TOP BACK BAR (IOS HEADER STYLE) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Pengaturan
            </button>

            <h3 className="text-sm font-black text-white truncate text-center flex-1">
              {SECTION_TITLES[activeSection]}
            </h3>

            <button
              type="button"
              onClick={handlePushHfeCompanyProfile}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Simpan
            </button>
          </div>

          {/* SUB-PAGE CONTENTS */}
          {activeSection === 'theme' && (
            <ThemeConfigSection
              builtinThemes={builtinThemes}
              activeTheme={activeTheme}
              setActiveTheme={setActiveTheme}
              merchantTheme={merchantTheme}
              setMerchantTheme={setMerchantTheme}
              aiStylesheetInput={aiStylesheetInput}
              setAiStylesheetInput={setAiStylesheetInput}
              handleExportThemeFile={handleExportThemeFile}
              handleImportThemeFile={handleImportThemeFile}
              handleApplyAIThemeString={handleApplyAIThemeString}
            />
          )}

          {activeSection === 'language' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.settings.languageSetting}</h3>
                  <p className="text-xs text-slate-400">{t.settings.languageSettingSub}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setLanguage('id')}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    language === 'id'
                      ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇮🇩</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Bahasa Indonesia</h4>
                      <p className="text-[11px] text-slate-400 font-mono">ID / Rupiah (Rp)</p>
                    </div>
                  </div>
                  {language === 'id' && <Check className="w-4 h-4 text-amber-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    language === 'en'
                      ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇬🇧</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">English (Global)</h4>
                      <p className="text-[11px] text-slate-400 font-mono">EN / Multi-Currency</p>
                    </div>
                  </div>
                  {language === 'en' && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <HfeSyncSettingsSection
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

          {activeSection === 'tax-cash' && (
            <HfeSyncSettingsSection
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

          {activeSection === 'team' && <TeamRosterSection />}

          {activeSection === 'reservations' && (
            <ReservationSettingsSection
              reservationPolicyMode={reservationPolicyMode}
              setReservationPolicyMode={setReservationPolicyMode}
              dpRequiredMode={dpRequiredMode}
              setDpRequiredMode={setDpRequiredMode}
              dpAmountConfig={dpAmountConfig}
              setDpAmountConfig={setDpAmountConfig}
              reservations={reservations}
              handleApproveReservation={handleApproveReservation}
              handleRejectReservation={handleRejectReservation}
              reservationOrderMode={reservationOrderMode}
              setReservationOrderMode={setReservationOrderMode}
              customerAppDisplayMode={customerAppDisplayMode}
              setCustomerAppDisplayMode={setCustomerAppDisplayMode}
              priceVisibilityMode={priceVisibilityMode}
              setPriceVisibilityMode={setPriceVisibilityMode}
            />
          )}

          {activeSection === 'crm' && (
            <CustomerCrmSection
              customerProfiles={customerProfiles}
              productCatalog={productCatalog}
            />
          )}

          {activeSection === 'vouchers' && <VoucherPromoSettingsSection />}

          {activeSection === 'checklist' && (
            <GettingStartedChecklist
              companyName={hfeCompanyProfile.ptLegalName}
              staffCount={4}
              cashFloat={1500000}
            />
          )}

          {activeSection === 'po-expense' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400 shadow-inner">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Purchase Orders (PO) & Klaim Expense Kas Kecil</h3>
                  <p className="text-xs text-slate-400">
                    Integrasi Pencatatan Transaksi Supplier & Pengeluaran Harian HCB Core REST API
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-inner">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300">📦 PO Supplier Aktif</span>
                      <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                        2 Menunggu Kirim
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Biji Kopi Arabica Kintamani (10kg) & Fresh Milk Pasteurisasi (40L)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Fitur Buat PO Supplier Baru terhubung ke HCB Engine')}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    + Buat PO Supplier Baru
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-inner">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300">💵 Kas Kecil (Petty Cash)</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                        Saldo: Rp 450.000
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Pengeluaran es batu kristal darurat & gas LPG 3kg hari ini
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Form Klaim Pengeluaran Kas Kecil terhubung ke HCB General Journal')}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    + Catat Klaim Pengeluaran
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
