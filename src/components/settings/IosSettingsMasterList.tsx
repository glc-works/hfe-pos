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
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Search,
  Building,
  ShieldCheck
} from 'lucide-react'
import { Ticket } from 'lucide-react'
import { HfeCompanyProfile, CafeThemeConfig } from '../../types/pos'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export type SettingsSectionId =
  | 'profile'
  | 'theme'
  | 'language'
  | 'tax-cash'
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
  merchantTheme,
  language,
  onSelectSection,
  onPushProfile
}) => {
  const { vouchers, partnerContacts, operatingArchetype } = useMerchantConfig()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const GROUPS: SettingsGroup[] = [
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
          title: 'Tema & Tampilan Visual',
          subtitle: 'Kustomisasi mode Light / Dark & warna cafe',
          value: activeTheme.themeName.split('(')[0].trim()
        },
        {
          id: 'language',
          icon: <Globe className="w-4 h-4 text-blue-300" />,
          iconBg: 'bg-blue-500/20 border-blue-500/40',
          title: 'Bahasa (Language)',
          subtitle: 'Pilihan bahasa operasional & struk',
          value: language === 'id' ? 'Bahasa Indonesia' : 'English'
        }
      ]
    },
    {
      groupTitle: 'Keuangan & Pembukuan',
      rows: [
        {
          id: 'tax-cash',
          icon: <DollarSign className="w-4 h-4 text-emerald-300" />,
          iconBg: 'bg-emerald-500/20 border-emerald-500/40',
          title: 'Pajak Resto (PB1) & Kas Toko',
          subtitle: 'Pengaturan PB1 10%, service fee, dan float kasir',
          value: 'PB1 Exclude (10%)'
        },
        {
          id: 'po-expense',
          icon: <Package className="w-4 h-4 text-purple-300" />,
          iconBg: 'bg-purple-500/20 border-purple-500/40',
          title: 'PO Supplier & Kas Kecil (Expense)',
          subtitle: 'Catat pembelian bahan baku & klaim pengeluaran harian',
          value: '3 Transaksi'
        }
      ]
    },
    {
      groupTitle: 'Operasional Resto & Staf',
      rows: [
        {
          id: 'profile',
          icon: <Store className="w-4 h-4 text-indigo-300" />,
          iconBg: 'bg-indigo-500/20 border-indigo-500/40',
          title: 'Profil PT & Legalitas Resto',
          subtitle: 'Nama PT, NPWP, NIB, dan alamat cabang',
          value: hfeCompanyProfile.brandName.split('&')[0].trim()
        },
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
          id: 'crm',
          icon: <Contact className="w-4 h-4 text-teal-300" />,
          iconBg: 'bg-teal-500/20 border-teal-500/40',
          title: 'Database Pelanggan (CRM)',
          subtitle: 'Riwayat pesanan tamu & poin loyalitas',
          value: '12 Profil'
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
          title: 'Getting Started Checklist (HCB)',
          subtitle: 'Verifikasi kesiapan pembukuan akuntansi core',
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
              <span>Synced with HCB Core Engine</span>
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
          placeholder="Cari pengaturan (Tema, Pajak, Tim Staf, Profil...)"
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Batal
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
                  key={row.id}
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
