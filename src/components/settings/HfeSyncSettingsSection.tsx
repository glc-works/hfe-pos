import React from 'react'
import { Building, Radio, RefreshCw, Building2, Store, Globe, FileCheck, Database, Check, CheckCircle2, Wifi, KeyRound } from 'lucide-react'
import { HfeCompanyProfile } from '../../types/pos'

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
  handlePushHfeCompanyProfile
}) => {
  const storefrontInfo = hfeCompanyProfile.storefrontInfo || {}
  const wifiPolicy = storefrontInfo.wifiAccessPolicy || 'after_payment'
  const wifiSsid = storefrontInfo.wifiSsid || ''
  const wifiPassword = storefrontInfo.wifiPassword || ''

  const updateStorefront = (partial: Partial<NonNullable<HfeCompanyProfile['storefrontInfo']>>) => {
    setHfeCompanyProfile(prev => ({
      ...prev,
      storefrontInfo: {
        ...prev.storefrontInfo,
        ...partial
      }
    }))
  }
  return (
    <>
      {/* CARD 1: HFE COMPANY / PROFIL PT LEGAL ENTITY REST API INTEGRATION */}
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" /> Profil PT & HFE Core Ledger REST API Connection
              </h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> LIVE HFE SYNCED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Identitas Legal PT, Logo Outlet, NPWP Pajak E-Faktur, & Endpoint HFE Book ID: <span className="font-mono text-indigo-300 font-bold">{hfeCompanyProfile.companyBookId}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchHfeCompanyProfile}
              className="bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-4 h-4 text-indigo-400" /> Sync Ulang dari REST API
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Nama Badan Hukum (Profil PT Official):
            </label>
            <input
              type="text"
              value={hfeCompanyProfile.ptLegalName}
              onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, ptLegalName: e.target.value }))}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-indigo-500"
              placeholder="cth: PT Kopi Karya Nusantara"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-amber-500" /> Nama Branding Outlet Kafe:
            </label>
            <input
              type="text"
              value={hfeCompanyProfile.brandName}
              onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, brandName: e.target.value }))}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-indigo-500"
              placeholder="cth: Kopitiam Senopati & Roastery"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> URL Logo Outlet Kafe:
            </label>
            <input
              type="text"
              value={hfeCompanyProfile.logoUrl}
              onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, logoUrl: e.target.value }))}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-indigo-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> NPWP Badan Pajak (E-Faktur DJP):
            </label>
            <input
              type="text"
              value={hfeCompanyProfile.taxIdNpwp}
              onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, taxIdNpwp: e.target.value }))}
              className="bg-slate-950 border border-slate-800 text-emerald-400 text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-indigo-500"
              placeholder="01.234.567.8-012.000"
            />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400">Endpoint HFE REST API:</span>
            <span className="font-mono text-indigo-300 font-bold">{hfeCompanyProfile.hfeLedgerApiEndpoint}</span>
          </div>
          <button
            onClick={handlePushHfeCompanyProfile}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            <Check className="w-3.5 h-3.5" /> Push & Sync ke HFE Core
          </button>
        </div>
      </div>

      {/* CARD 2: PENGATURAN AKSES WIFI PELANGGAN & STOREFRONT OUTLET */}
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-amber-400" /> Kebijakan Akses WiFi Pelanggan & Storefront
              </h3>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                {wifiPolicy}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Atur visibilitas kredensial WiFi tamu pada Customer Mobile QR, Struk Digital, & Modal Bill Meja.
            </p>
          </div>
        </div>

        {/* WIFI ACCESS POLICY PILL SELECTOR */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">
            Pilih Kebijakan Akses WiFi:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => updateStorefront({ wifiAccessPolicy: 'always_visible' })}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                wifiPolicy === 'always_visible'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span>🌐</span>
              <span>Selalu Terbuka</span>
            </button>
            <button
              type="button"
              onClick={() => updateStorefront({ wifiAccessPolicy: 'after_payment' })}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                wifiPolicy === 'after_payment'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span>🔒</span>
              <span>Buka Setelah Bayar</span>
            </button>
            <button
              type="button"
              onClick={() => updateStorefront({ wifiAccessPolicy: 'disabled' })}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                wifiPolicy === 'disabled'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span>🚫</span>
              <span>Nonaktifkan WiFi</span>
            </button>
          </div>
        </div>

        {/* SSID & PASSWORD INPUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-amber-400" /> SSID / Nama WiFi Pelanggan:
            </label>
            <input
              type="text"
              disabled={wifiPolicy === 'disabled'}
              value={wifiSsid}
              onChange={(e) => updateStorefront({ wifiSsid: e.target.value })}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-amber-500 disabled:opacity-40"
              placeholder="cth: Kopitiam_Senopati_Guest"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Password WiFi Pelanggan:
            </label>
            <input
              type="text"
              disabled={wifiPolicy === 'disabled'}
              value={wifiPassword}
              onChange={(e) => updateStorefront({ wifiPassword: e.target.value })}
              className="bg-slate-950 border border-slate-800 text-amber-400 text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-amber-500 disabled:opacity-40"
              placeholder="cth: kopiuenak2026"
            />
          </div>
        </div>
      </div>

      {/* CARD 1.5: HFE MULTI-BRANCH ENGINE CONFIGURATION */}
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" /> Konfigurasi Multi-Branch / Multi-Outlet HFE Engine
              </h3>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 uppercase">
                MODE: {hfeBranchMode}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih treatment akuntansi pencatatan cabang: <b className="text-white">Dimensional Tagging</b>, <b className="text-white">Multi-Book Hierarchy</b>, atau <b className="text-white">Sub-Account COA</b>.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-slate-400 font-semibold">Cabang Aktif:</span>
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="bg-transparent text-indigo-300 font-mono font-bold text-xs focus:outline-none"
            >
              {outletBranches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setHfeBranchMode('dimensional')}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
              hfeBranchMode === 'dimensional'
                ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Opsi 1 (Default F&B)</span>
                {hfeBranchMode === 'dimensional' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <h4 className="font-bold text-xs text-white mt-1">Dimensional Tagging</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                1 CompanyBook PT Utama. Setiap transaksi diberi tag <code className="text-amber-400">branch_id</code>. Konsolidasi P&L real-time instan.
              </p>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold w-fit">
              RECOMMENDED UMKM & F&B
            </span>
          </div>

          <div
            onClick={() => setHfeBranchMode('multi_book')}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
              hfeBranchMode === 'multi_book'
                ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Opsi 2 (Holding/Franchise)</span>
                {hfeBranchMode === 'multi_book' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <h4 className="font-bold text-xs text-white mt-1">Multi-Book Hierarchy</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Setiap outlet punya <code className="text-indigo-300">CompanyBook</code> terpisah. HFE Consolidation Engine memproses agregasi ke HQ.
              </p>
            </div>
            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold w-fit">
              ENTERPRISE & FRANCHISE
            </span>
          </div>

          <div
            onClick={() => setHfeBranchMode('sub_account')}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 cursor-pointer transition-all ${
              hfeBranchMode === 'sub_account'
                ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Opsi 3 (Strict COA)</span>
                {hfeBranchMode === 'sub_account' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </div>
              <h4 className="font-bold text-xs text-white mt-1">Sub-Account COA</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                Transaksi langsung memposting ke Sub-Akun COA spesifik cabang (<code className="text-amber-400">1010-01 Kas Senopati</code>).
              </p>
            </div>
            <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold w-fit">
              AUDIT PHYSICAL CASH/INV
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
