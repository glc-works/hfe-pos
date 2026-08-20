import React from 'react'
import { Building2, Store, Globe, FileCheck, ShieldCheck, MapPin } from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { HfeCompanyProfile } from '../../types/pos'

export interface CompanyLegalProfileZoneProps {
  hfeCompanyProfile: HfeCompanyProfile
  setHfeCompanyProfile: React.Dispatch<React.SetStateAction<HfeCompanyProfile>>
}

export const CompanyLegalProfileZone: React.FC<CompanyLegalProfileZoneProps> = ({
  hfeCompanyProfile,
  setHfeCompanyProfile
}) => {
  const { t } = useTranslation()

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {t.settings.zone1Heading}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.settings.zone1Desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>OSS & DJP Verified</span>
        </div>
      </div>

      {/* FORM INPUTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. NAMA BADAN HUKUM */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            {t.settings.ptLegalName}
          </label>
          <input
            type="text"
            value={hfeCompanyProfile.ptLegalName}
            onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, ptLegalName: e.target.value }))}
            placeholder={t.settings.ptLegalNamePlaceholder}
            className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />
        </div>

        {/* 2. NAMA BRANDING OUTLET */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            {t.settings.brandName}
          </label>
          <input
            type="text"
            value={hfeCompanyProfile.brandName}
            onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, brandName: e.target.value }))}
            placeholder={t.settings.brandNamePlaceholder}
            className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
        </div>

        {/* 3. NPWP E-FAKTUR */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t.settings.taxIdNpwp}
          </label>
          <input
            type="text"
            value={hfeCompanyProfile.taxIdNpwp}
            onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, taxIdNpwp: e.target.value }))}
            placeholder={t.settings.taxIdNpwpPlaceholder}
            className="bg-slate-950 border border-slate-800 text-emerald-400 text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
          />
        </div>

        {/* 4. NIB PERMIT */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            {t.settings.nibPermit}
          </label>
          <input
            type="text"
            value={hfeCompanyProfile.nibPermit || ''}
            onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, nibPermit: e.target.value }))}
            placeholder={t.settings.nibPermitPlaceholder}
            className="bg-slate-950 border border-slate-800 text-blue-400 text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
          />
        </div>

        {/* 5. LOGO URL */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            {t.settings.logoUrl}
          </label>
          <div className="flex items-center gap-3">
            {hfeCompanyProfile.logoUrl && (
              <img
                src={hfeCompanyProfile.logoUrl}
                alt="Logo preview"
                className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
              />
            )}
            <input
              type="text"
              value={hfeCompanyProfile.logoUrl}
              onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, logoUrl: e.target.value }))}
              placeholder={t.settings.logoUrlPlaceholder}
              className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
          </div>
        </div>

        {/* 6. ALAMAT LENGKAP OUTLET */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            {t.settings.storeAddress}
          </label>
          <textarea
            rows={2}
            value={hfeCompanyProfile.address || ''}
            onChange={(e) => setHfeCompanyProfile(prev => ({ ...prev, address: e.target.value }))}
            placeholder={t.settings.storeAddressPlaceholder}
            className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-rose-500 transition-colors shadow-inner resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
