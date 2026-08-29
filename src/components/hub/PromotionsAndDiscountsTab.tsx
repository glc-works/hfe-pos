import React, { useState } from 'react'
import {
  Ticket,
  Clock,
  Package,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Percent,
  DollarSign,
  Calendar,
  Sparkles,
  Layers,
  X
} from 'lucide-react'

export interface PromoCampaign {
  id: string
  code: string
  name: string
  type: 'voucher_code' | 'happy_hour' | 'combo_bundle' | 'loyalty_cashback'
  discountType: 'fixed_nominal' | 'percentage'
  discountValue: number
  minSpend: number
  usageCount: number
  usageLimit?: number
  validUntil: string
  isActive: boolean
  channels: ('pos' | 'qr_dine_in' | 'takeaway')[]
}

const INITIAL_PROMOS: PromoCampaign[] = [
  {
    id: 'PRM-001',
    code: 'DISKON15K',
    name: 'Voucher Potongan Spesial Pelanggan Baru',
    type: 'voucher_code',
    discountType: 'fixed_nominal',
    discountValue: 15000,
    minSpend: 60000,
    usageCount: 42,
    usageLimit: 100,
    validUntil: '31 Agu 2026',
    isActive: true,
    channels: ['pos', 'qr_dine_in', 'takeaway']
  },
  {
    id: 'PRM-002',
    code: 'HAPPYHOUR20',
    name: 'Happy Hour Sore Kopi & Mocktail (14:00 - 17:00)',
    type: 'happy_hour',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 0,
    usageCount: 128,
    validUntil: '31 Des 2026',
    isActive: true,
    channels: ['pos', 'qr_dine_in']
  },
  {
    id: 'PRM-003',
    code: 'COMBO-SARAPAN',
    name: 'Paket Kombo Americano + Butter Croissant',
    type: 'combo_bundle',
    discountType: 'fixed_nominal',
    discountValue: 12000,
    minSpend: 0,
    usageCount: 89,
    validUntil: '30 Sep 2026',
    isActive: true,
    channels: ['pos', 'qr_dine_in', 'takeaway']
  }
]

export const PromotionsAndDiscountsTab: React.FC = () => {
  const [promos, setPromos] = useState<PromoCampaign[]>(INITIAL_PROMOS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State for new Promo
  const [formCode, setFormCode] = useState('')
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<'voucher_code' | 'happy_hour' | 'combo_bundle'>('voucher_code')
  const [formDiscountType, setFormDiscountType] = useState<'fixed_nominal' | 'percentage'>('fixed_nominal')
  const [formDiscountVal, setFormDiscountVal] = useState('10000')
  const [formMinSpend, setFormMinSpend] = useState('50000')

  const filteredPromos = promos.filter((p) => {
    const matchSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = filterType === 'all' || p.type === filterType
    return matchSearch && matchType
  })

  const togglePromoStatus = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault()
    const discNum = parseInt(formDiscountVal.replace(/\D/g, ''), 10) || 0
    const minSpendNum = parseInt(formMinSpend.replace(/\D/g, ''), 10) || 0

    const newPromo: PromoCampaign = {
      id: `PRM-00${promos.length + 1}`,
      code: formCode.toUpperCase().replace(/\s+/g, ''),
      name: formName,
      type: formType,
      discountType: formDiscountType,
      discountValue: discNum,
      minSpend: minSpendNum,
      usageCount: 0,
      usageLimit: 100,
      validUntil: '31 Des 2026',
      isActive: true,
      channels: ['pos', 'qr_dine_in', 'takeaway']
    }

    setPromos((prev) => [newPromo, ...prev])
    setIsModalOpen(false)
    setFormCode('')
    setFormName('')
  }

  const formatIdr = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="space-y-4">
      {/* Top Action Bar (Mobile-First Responsive Stack) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-card p-3.5 rounded-2xl border border-border">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kode kupon / nama promo..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto text-xs bg-background border border-border text-foreground rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer min-h-[40px]"
          >
            <option value="all">Semua Tipe Promo</option>
            <option value="voucher_code">Kode Voucher</option>
            <option value="happy_hour">Happy Hour (Waktu)</option>
            <option value="combo_bundle">Paket Kombo</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormCode(`HEMAT${Math.floor(10 + Math.random() * 90)}K`)
            setFormName('Promo Diskon Khusus Pelanggan')
            setIsModalOpen(true)
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[42px] shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Buat Promo Baru</span>
        </button>
      </div>

      {/* Promos Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPromos.map((p) => (
          <div
            key={p.id}
            className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
              p.isActive
                ? 'bg-card border-border shadow-xs'
                : 'bg-muted/20 border-border/50 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {p.type === 'happy_hour' ? (
                    <Clock className="w-4 h-4" />
                  ) : p.type === 'combo_bundle' ? (
                    <Package className="w-4 h-4" />
                  ) : (
                    <Ticket className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <span className="font-mono font-black text-sm text-foreground tracking-wider">
                    {p.code}
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    {p.type === 'happy_hour'
                      ? 'Diskon Happy Hour'
                      : p.type === 'combo_bundle'
                      ? 'Paket Kombo'
                      : 'Kupon Voucher'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => togglePromoStatus(p.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition-all min-h-[30px] ${
                  p.isActive
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {p.isActive ? '🟢 Aktif' : '⚪ Nonaktif'}
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-foreground leading-snug">{p.name}</h4>
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Besar Diskon:</span>
                <span className="font-bold text-emerald-500 font-mono text-sm">
                  {p.discountType === 'percentage'
                    ? `${p.discountValue}% OFF`
                    : `-${formatIdr(p.discountValue)}`}
                </span>
              </div>
              {p.minSpend > 0 && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Min. Belanja:</span>
                  <span className="font-mono text-foreground">{formatIdr(p.minSpend)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
                <span className="text-muted-foreground">Klaim Penggunaan:</span>
                <span className="font-mono font-bold text-foreground">
                  {p.usageCount} {p.usageLimit ? `/ ${p.usageLimit}` : 'kali'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Berlaku: {p.validUntil}</span>
              <div className="flex gap-1">
                {p.channels.map((c) => (
                  <span key={c} className="px-1.5 py-0.5 rounded bg-muted font-mono uppercase text-[9px]">
                    {c === 'pos' ? 'POS' : c === 'qr_dine_in' ? 'QR' : 'Bungkus'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Create Promo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card w-full max-w-md p-5 sm:p-6 rounded-2xl border border-border shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-500" />
                <span>Buat Kampanye Promo Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Kode Promo / Kupon (Kapital)</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: MERDEKA50"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-mono font-bold tracking-wider focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Nama Deskripsi Promo</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Diskon Kemerdekaan Rp 15.000"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Tipe Diskon</label>
                  <select
                    value={formDiscountType}
                    onChange={(e) => setFormDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                  >
                    <option value="fixed_nominal">Potongan Nominal (Rp)</option>
                    <option value="percentage">Potongan Persen (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Besar Diskon</label>
                  <input
                    type="number"
                    required
                    value={formDiscountVal}
                    onChange={(e) => setFormDiscountVal(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Syarat Minimum Belanja (IDR)</label>
                <input
                  type="number"
                  required
                  value={formMinSpend}
                  onChange={(e) => setFormMinSpend(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[40px]"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs"
                >
                  Aktifkan Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
