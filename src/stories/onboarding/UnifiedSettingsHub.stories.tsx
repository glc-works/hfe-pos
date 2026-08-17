import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { Button, Badge, Card } from '@/ui'
import {
  Store,
  Palette,
  Globe,
  DollarSign,
  Users,
  Calendar,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Building,
  ShieldCheck,
  Check,
} from 'lucide-react'

type SettingsTab =
  | 'profile'
  | 'theme'
  | 'language'
  | 'tax'
  | 'team'
  | 'reservations'
  | 'crm-vouchers'

interface SettingsHubProps {
  initialTab?: SettingsTab
}

export const UnifiedSettingsHubShowcase: React.FC<SettingsHubProps> = ({
  initialTab = 'profile',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)

  const TABS = [
    { id: 'profile' as const, label: 'Profil PT & Legalitas', icon: <Building className="w-4 h-4 text-indigo-400" /> },
    { id: 'theme' as const, label: 'Tema & Tampilan', icon: <Palette className="w-4 h-4 text-amber-400" /> },
    { id: 'language' as const, label: 'Bahasa (Language)', icon: <Globe className="w-4 h-4 text-blue-400" /> },
    { id: 'tax' as const, label: 'Pajak & Kas Toko', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
    { id: 'team' as const, label: 'Tim Staf & Akses PIN', icon: <Users className="w-4 h-4 text-amber-400" /> },
    { id: 'reservations' as const, label: 'Reservasi Meja & DP', icon: <Calendar className="w-4 h-4 text-rose-400" /> },
    { id: 'crm-vouchers' as const, label: 'CRM & Kupon Promo', icon: <Ticket className="w-4 h-4 text-teal-400" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Hub Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white">BSD Specialty Coffee & Eatery</h1>
                <Badge variant="default" className="text-[10px] py-0 bg-amber-500 text-slate-950 font-bold">
                  Single-Door Hub
                </Badge>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PT Kopi Inovasi BSD • CoA 18 Akun Synced
              </p>
            </div>
          </div>
        </div>

        {/* 7-Tab Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-slate-950/60">{tab.icon}</div>
              <span className="text-[11px] leading-tight truncate w-full">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <Card className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          {activeTab === 'profile' && (
            <div data-testid="pane-profile" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" /> Profil PT & Legalitas Restoran
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Nama Badan Usaha:</span>
                  <span className="font-bold text-white">PT Kopi Inovasi BSD Tangsel</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">NPWP Restoran (DJP):</span>
                  <span className="font-mono font-bold text-amber-400">01.234.567.8-411.000</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div data-testid="pane-theme" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" /> Tema & Penyesuaian Visual
              </h3>
              <p className="text-xs text-slate-400">Pilih tema antarmuka POS dan tampilan pelanggan:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-bold">
                  ● Artisan Warm Amber (Aktif)
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
                  ○ Midnight Slate High-Contrast
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div data-testid="pane-language" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> Bahasa Antarmuka & Struk (Language)
              </h3>
              <div className="flex gap-3 text-xs">
                <div className="p-3 bg-blue-500/10 border border-blue-500/40 rounded-xl text-blue-300 font-bold flex-1">
                  🇮🇩 Bahasa Indonesia (Rupiah Rp)
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 flex-1">
                  🇬🇧 English (International Multi-Currency)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div data-testid="pane-tax" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Pajak Daerah (PB1 / PBJT) & Kas Toko
              </h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Skema Pajak Restoran:</span>
                  <span className="font-bold text-emerald-400">PB1 Exclude (10%) - Akun 2210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kas Float Awal Kasir:</span>
                  <span className="font-mono font-bold text-white">Rp 500.000 (Kas Laci 1110)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div data-testid="pane-team" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Roster Tim Staf & Akses PIN Kasir
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span>Andi Prasetya (Manager)</span>
                  <Badge variant="outline" className="text-amber-400 text-[10px]">PIN: ****</Badge>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span>Siti Barista (Kasir)</span>
                  <Badge variant="outline" className="text-emerald-400 text-[10px]">PIN: ****</Badge>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div data-testid="pane-reservations" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" /> Kebijakan Reservasi Meja & Down Payment
              </h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400">Approval Policy:</span>
                <span className="text-rose-300 font-bold">Instant Auto-Approve (DP Wajib Rp 100.000)</span>
              </div>
            </div>
          )}

          {activeTab === 'crm-vouchers' && (
            <div data-testid="pane-crm-vouchers" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-teal-400" /> CRM Database & Kupon Promosi Mitra
              </h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400">Promo Bank BCA Operasional:</span>
                <span className="text-teal-300 font-bold">Diskon 15% Max Rp 30.000 (Voucher CARD)</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

const meta: Meta<typeof UnifiedSettingsHubShowcase> = {
  title: 'Onboarding/UnifiedSettingsHub',
  component: UnifiedSettingsHubShowcase,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof UnifiedSettingsHubShowcase>

export const ProfileAndLegalTab: Story = {
  args: { initialTab: 'profile' },
}

export const ThemeStylingTab: Story = {
  args: { initialTab: 'theme' },
}

export const LanguageTab: Story = {
  args: { initialTab: 'language' },
}

export const TaxAndCashTab: Story = {
  args: { initialTab: 'tax' },
}

export const TeamRosterTab: Story = {
  args: { initialTab: 'team' },
}

export const ReservationsTab: Story = {
  args: { initialTab: 'reservations' },
}

export const CrmAndVouchersTab: Story = {
  args: { initialTab: 'crm-vouchers' },
}

export const InteractiveTabSwitching: Story = {
  args: { initialTab: 'profile' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const taxTab = await canvas.findByTestId('tab-tax')
    await userEvent.click(taxTab)

    const taxPane = await canvas.findByTestId('pane-tax')
    expect(taxPane).toBeDefined()

    const themeTab = await canvas.findByTestId('tab-theme')
    await userEvent.click(themeTab)

    const themePane = await canvas.findByTestId('pane-theme')
    expect(themePane).toBeDefined()
  },
}
