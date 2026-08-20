import React, { useState } from 'react'
import { MerchantAccount, SubscriptionTier, MerchantFeatureToggles } from '../../types/admin'
import {
  X,
  Building2,
  Crown,
  Zap,
  Sliders,
  Check,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  Trash2
} from 'lucide-react'

export interface MerchantDetailModalProps {
  merchant: MerchantAccount | null
  isOpen: boolean
  onClose: () => void
  onUpdateMerchant: (updated: MerchantAccount) => void
}

export const MerchantDetailModal: React.FC<MerchantDetailModalProps> = ({
  merchant,
  isOpen,
  onClose,
  onUpdateMerchant
}) => {
  if (!isOpen || !merchant) return null

  const [tier, setTier] = useState<SubscriptionTier>(merchant.tier)
  const [features, setFeatures] = useState<MerchantFeatureToggles>(merchant.features)
  const [status, setStatus] = useState(merchant.status)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggleFeature = (key: keyof MerchantFeatureToggles) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      onUpdateMerchant({
        ...merchant,
        tier,
        features,
        status,
        mrrAmountIdr: tier === 'enterprise' ? 4900000 : tier === 'pro' ? 1490000 : 0
      })
      setIsSaving(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{merchant.name}</h2>
              <p className="text-xs text-slate-400 font-mono">Tenant ID: {merchant.tenantId} • {merchant.legalEntityName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* STOREFRONT DOMAIN & CONTACT INFO */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Subdomain Storefront:</span>
              <span className="font-mono text-indigo-300 font-bold">{merchant.subdomain}.pos.hfeit.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email Owner:</span>
              <span className="text-slate-200">{merchant.contactEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">No. WhatsApp:</span>
              <span className="font-mono text-slate-200">{merchant.contactPhone}</span>
            </div>
          </div>

          {/* SUBSCRIPTION TIER SELECTOR */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300">Paket Langganan SaaS</label>
            <div className="grid grid-cols-3 gap-2">
              {(['starter', 'pro', 'enterprise'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    tier === t
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold capitalize text-xs">{t}</span>
                    {t === 'enterprise' && <Crown className="w-3.5 h-3.5 text-purple-400" />}
                    {t === 'pro' && <Zap className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {t === 'starter' ? 'Free / Rp 0' : t === 'pro' ? 'Rp 1.490.000' : 'Rp 4.900.000'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FEATURE TOGGLES */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300">Aktivasi Modul Fitur Toko</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'enableKds', label: 'KDS Dapur & Kanban' },
                { key: 'enableOpenTab', label: 'Open-Tab & Bill Meja' },
                { key: 'enableMultiZone', label: 'Peta Meja Multi-Zona' },
                { key: 'enableSnapBi', label: 'SNAP BI Bank Clearing' },
                { key: 'enableCustomerLoyalty', label: 'Loyalty Stamp & Member' },
                { key: 'enableBiologicalAssets', label: 'PSAK 69 Biological Asset' }
              ].map((item) => {
                const isEnabled = features[item.key as keyof MerchantFeatureToggles]
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleToggleFeature(item.key as keyof MerchantFeatureToggles)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isEnabled
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="font-medium text-slate-200">{item.label}</span>
                    <span
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-600'
                      }`}
                    >
                      {isEnabled && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
          </button>
        </div>
      </div>
    </div>
  )
}
