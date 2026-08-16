import React from 'react'
import { OnboardingData, PB1TaxMode } from '../../types/pos'
import { Receipt, Coins, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export const Step3TaxAndFloatSettings: React.FC<Props> = ({ data, onChange }) => {
  const taxModes = [
    {
      mode: 0 as PB1TaxMode,
      title: 'Mode 0: Bebas Pajak (Off 0%)',
      badge: 'Non-PB1',
      description: 'Pajak restoran tidak dikenakan pada pesanan (0%). Digunakan untuk UMKM non-PKP.',
    },
    {
      mode: 1 as PB1TaxMode,
      title: 'Mode 1: Pajak Exclude (10% Ditambah di Atas)',
      badge: 'Paling Populer',
      description: 'Pajak PB1 10% dihitung & ditambahkan di atas subtotal transaksi belanja.',
    },
    {
      mode: 2 as PB1TaxMode,
      title: 'Mode 2: Pajak Include (10% Terintegrasi dalam Harga)',
      badge: 'Nett Price',
      description: 'Pajak PB1 10% sudah termasuk di dalam harga jual menu produk (Nett price).',
    },
  ]

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100 mb-1 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          3. Pengaturan Pajak PB1 Restoran & Shift Kas Float
        </h3>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-4">
          Sesuaikan regulasi perhitungan pajak daerah (PB1 Restoran 10%) & saldo uang kembalian awal shift kasir.
        </p>

        <div className="space-y-3">
          {taxModes.map((m) => {
            const isSelected = data.pb1TaxMode === m.mode

            return (
              <button
                key={m.mode}
                type="button"
                onClick={() => onChange({ pb1TaxMode: m.mode })}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between ${
                  isSelected
                    ? 'border-amber-600 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30'
                    : 'border-amber-900/15 hover:border-amber-500/50 bg-amber-500/5'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-600/20 text-amber-800 dark:text-amber-200">
                      {m.badge}
                    </span>
                    <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                      {m.title}
                    </h4>
                  </div>
                  <p className="text-xs text-amber-900/70 dark:text-amber-200/70">
                    {m.description}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 ml-2 mt-0.5" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-amber-900/10 pt-4">
        <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Modal Uang Kembalian (Kas Float Awal Shift Kasir)
        </label>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-2">
          Jumlah uang tunai modal fisik di laci kasir saat membuka shift pertama kali.
        </p>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
              Rp
            </span>
            <input
              type="number"
              value={data.initialKasFloat}
              onChange={(e) => onChange({ initialKasFloat: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full pl-10 pr-3 py-2 text-sm font-bold rounded-lg border border-amber-900/20 bg-amber-500/5 focus:bg-amber-500/10 focus:border-amber-600 focus:outline-none text-amber-950 dark:text-amber-100"
            />
          </div>

          <div className="flex gap-1.5">
            {[250000, 500000, 1000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange({ initialKasFloat: preset })}
                className={`text-xs px-2.5 py-2 rounded-lg border font-semibold transition-all ${
                  data.initialKasFloat === preset
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-900/15 hover:bg-amber-500/20'
                }`}
              >
                {formatCurrency(preset)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed">
          Semua konfigurasi di atas disinkronkan langsung ke HCB Ledger Core via REST API. Anda dapat mengubah pengaturan ini kapan saja di menu <strong>Cafe Settings</strong>.
        </p>
      </div>
    </div>
  )
}
