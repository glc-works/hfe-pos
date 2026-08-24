import React, { useState } from 'react'
import {
  Palette,
  Globe,
  DollarSign,
  Users,
  Package,
  Store,
  Calendar,
  Contact,
  CheckCircle2,
  ChevronRight,
  Search,
  Building,
  ShieldCheck,
  Printer,
  Network,
  Ticket
} from 'lucide-react'
import { HfeCompanyProfile, CafeThemeConfig } from '../../types/pos'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import { useTranslation } from '../../context/LanguageContext'

export type SettingsSectionId =
  | 'profile'
  | 'tax-cash'
  | 'hardware'
  | 'hfe-core'
  | 'theme'
  | 'language'
  | 'team'
  | 'po-expense'
  | 'reservations'
  | 'crm'
  | 'vouchers'
  | 'checklist'

export interface IosSettingsMasterListProps {
  hfeCompanyProfile: HfeCompanyProfile
  activeTheme: CafeThemeConfig
  merchantTheme?: CafeThemeConfig
  language: string
  onSelectSection: (section: SettingsSectionId) => void
  onPushProfile: () => void
}

interface SettingsRow {
  id: SettingsSectionId
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle?: string
  value?: string
}

interface SettingsGroup {
  groupTitle: string
  rows: SettingsRow[]
}

export const IosSettingsMasterList: React.FC<IosSettingsMasterListProps> = ({
  hfeCompanyProfile,
  activeTheme,
  language,
  onSelectSection
}) => {
  const { t } = useTranslation()
  const { vouchers, partnerContacts, operatingArchetype, pb1TaxMode } = useMerchantConfig()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const GROUPS: SettingsGroup[] = [
    {
      groupTitle: '4-Zona Pengaturan Toko & Kasir',
      rows: [
        {
          id: 'profile',
          icon: <Building className="w-4 h-4 text-indigo-300" />,
          iconBg: 'bg-indigo-500/20 border-indigo-500/40',
          title: t.settings.zone1NavTitle,
          subtitle: t.settings.zone1NavSubtitle,
          value: hfeCompanyProfile.brandName.split('&')[0].trim()
        },
        {
          id: 'tax-cash',
          icon: <DollarSign className="w-4 h-4 text-emerald-300" />,
          iconBg: 'bg-emerald-500/20 border-emerald-500/40',
          title: t.settings.zone2NavTitle,
          subtitle: t.settings.zone2NavSubtitle,
          value: pb1TaxMode === 1 ? '10% Exclude' : pb1TaxMode === 2 ? '10% Include' : '0% Non-Tax'
        },
        {
          id: 'hardware',
          icon: <Printer className="w-4 h-4 text-indigo-300" />,
          iconBg: 'bg-indigo-500/20 border-indigo-500/40',
          title: t.settings.zone3NavTitle,
          subtitle: t.settings.zone3NavSubtitle,
          value: '58/80mm ESC/POS'
        },
        {
          id: 'hfe-core',
          icon: <Network className="w-4 h-4 text-emerald-300" />,
          iconBg: 'bg-emerald-500/20 border-emerald-500/40',
          title: t.settings.zone4NavTitle,
          subtitle: t.settings.zone4NavSubtitle,
          value: t.settings.liveSyncedBadge
        }
      ]
    },
    {
      groupTitle: 'Model Usaha & Alur Kasir POS',
      rows: [
        {
          id: 'profile',
          icon: <Store className="w-4 h-4 text-emerald-300" />,
          iconBg: 'bg-emerald-500/20 border-emerald-500/40',
          title: 'Cara Kerja Usaha & Alur Kasir POS',
          subtitle: 'Gerai Cepat (Tanpa Meja), Kafe Kasual (Meja), atau Resto Lengkap (Booking)',
          value: operatingArchetype === 'quick-service-stall' ? '🛍️ Gerai Cepat' : operatingArchetype === 'full-service-resto' ? '👑 Resto Lengkap' : '☕ Kafe Kasual'
        }
      ]
    },
    {
      groupTitle: 'Pemasaran & Program Promosi',
      rows: [
        {
          id: 'vouchers',
          icon: <Ticket className="w-4 h-4 text-amber-300" />,
          iconBg: 'bg-amber-500/20 border-amber-500/40',
          title: 'Manajemen Kupon & Promo Mitra',
          subtitle: 'Terbitkan kupon merchant atau aktifkan promo bank/platform',
          value: `${vouchers.length} Kupon Aktif`
        },
        {
          id: 'crm',
          icon: <Contact className="w-4 h-4 text-teal-300" />,
          iconBg: 'bg-teal-500/20 border-teal-500/40',
          title: 'Database Pelanggan & Kontak Mitra CRM',
          subtitle: 'Riwayat preferensi tamu & kontak mitra perbankan',
          value: `${partnerContacts.length} Mitra`
        }
      ]
    },
    {
      groupTitle: 'Tampilan & Bahasa',
      rows: [
        {
          id: 'theme',
          icon: <Palette className="w-4 h-4 text-amber-300" />,
          iconBg: 'bg-amber-500/20 border-amber-500/40',
          title: t.settings.themeSetting,
          subtitle: 'Kustomisasi mode Light / Dark & warna cafe',
          value: activeTheme.themeName.split('(')[0].trim()
        },
        {
          id: 'language',
          icon: <Globe className="w-4 h-4 text-blue-300" />,
          iconBg: 'bg-blue-500/20 border-blue-500/40',
          title: t.settings.languageSetting,
          subtitle: t.settings.languageSettingSub,
          value: language === 'id' ? t.settings.indonesian : t.settings.english
        }
      ]
    },
    {
      groupTitle: 'Operasional Resto & Staf',
      rows: [
        {
          id: 'team',
          icon: <Users className="w-4 h-4 text-amber-300" />,
          iconBg: 'bg-amber-500/20 border-amber-500/40',
          title: 'Tim Staf & Akses PIN Kasir',
          subtitle: 'Kelola peran kasir, barista, server, dan PIN',
          value: '4 Anggota'
        },
        {
          id: 'reservations',
          icon: <Calendar className="w-4 h-4 text-rose-300" />,
          iconBg: 'bg-rose-500/20 border-rose-500/40',
          title: 'Reservasi Meja & Down Payment (DP)',
          subtitle: 'Aturan persetujuan booking & nominal DP',
          value: 'Instant Approval'
        },
        {
          id: 'po-expense',
          icon: <Package className="w-4 h-4 text-purple-300" />,
          iconBg: 'bg-purple-500/20 border-purple-500/40',
          title: t.settings.purchaseOrders,
          subtitle: 'Catat pembelian bahan baku & klaim pengeluaran harian',
          value: '3 Transaksi'
        }
      ]
    },
    {
      groupTitle: 'Verifikasi & Kesiapan Sistem',
      rows: [
        {
          id: 'checklist',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-300" />,
          iconBg: 'bg-emerald-500/20 border-emerald-500/40',
          title: 'Panduan Awal Kasir & Toko',
          subtitle: 'Verifikasi kesiapan operasional gerai dan kasir',
          value: '3/3 Selesai'
        }
      ]
    }
  ]

  const filteredGroups = GROUPS.map((g) => ({
    ...g,
    rows: g.rows.filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.subtitle && r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter((g) => g.rows.length > 0)

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn pb-12">
      {/* 1. APPLE ID-STYLE MERCHANT PROFILE BANNER */}
      <div
        onClick={() => onSelectSection('profile')}
        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xl hover:scale-[1.005] group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={hfeCompanyProfile.logoUrl}
            alt={hfeCompanyProfile.brandName}
            className="w-14 h-14 rounded-2xl object-cover border border-amber-500/40 shadow-md shrink-0 group-hover:border-amber-400 transition-colors"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white truncate group-hover:text-amber-400 transition-colors">
                {hfeCompanyProfile.brandName}
              </h2>
              <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.2 rounded-full shrink-0">
                Owner
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <Building className="w-3 h-3 text-slate-500" /> {hfeCompanyProfile.ptLegalName}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold mt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{t.settings.liveSyncedBadge}</span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
      </div>

      {/* 2. SEARCH BAR (IOS NATIVE STYLE) */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.common.search}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
          >
            {t.common.cancel}
          </button>
        )}
      </div>

      {/* 3. INSET GROUPED SETTINGS CARDS */}
      <div className="flex flex-col gap-6">
        {filteredGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-1.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              {group.groupTitle}
            </h3>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800/80 shadow-lg">
              {group.rows.map((row) => (
                <div
                  key={`${group.groupTitle}-${row.id}-${row.title}`}
                  onClick={() => onSelectSection(row.id)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/50 active:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${row.iconBg}`}
                    >
                      {row.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-white truncate">
                        {row.title}
                      </span>
                      {row.subtitle && (
                        <span className="text-[11px] text-slate-400 truncate">
                          {row.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {row.value && (
                      <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200">
                        {row.value}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
