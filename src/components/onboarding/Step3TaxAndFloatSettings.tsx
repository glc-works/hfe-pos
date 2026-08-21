import React, { useState } from 'react'
import { OnboardingData, PB1TaxMode } from '../../types/pos'
import { Input, PriceTag, Badge, Button } from '@/ui'
import { Receipt, Coins, UploadCloud, FileCheck2, CheckCircle2, ShieldCheck } from 'lucide-react'

interface Props {
  data: OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export const Step3TaxAndFloatSettings: React.FC<Props> = ({ data, onChange }) => {
  const [isSimulatedUploading, setIsSimulatedUploading] = useState(false)

  const taxModes = [
    {
      mode: 0 as PB1TaxMode,
      title: 'Mode 0: Non-PB1 / Bebas Pajak (0%)',
      badge: 'UMKM Non-PKP',
      description: 'Pajak restoran tidak dikenakan pada transaksi (0%). Cocok untuk skala UMKM.',
    },
    {
      mode: 1 as PB1TaxMode,
      title: 'Mode 1: Pajak Exclude (10% Ditambahkan)',
      badge: 'Paling Populer',
      description: 'Pajak PB1 10% dihitung & ditambahkan di atas subtotal pesanan.',
    },
    {
      mode: 2 as PB1TaxMode,
      title: 'Mode 2: Pajak Include (10% Terintegrasi)',
      badge: 'Nett Price',
      description: 'Pajak PB1 10% sudah termasuk di dalam harga jual menu produk.',
    },
  ]

  const floatPresets = [250000, 500000, 1000000, 2000000]

  const handleSimulateUpload = (fileName: string) => {
    setIsSimulatedUploading(true)
    setTimeout(() => {
      onChange({ migrationFileName: fileName })
      setIsSimulatedUploading(false)
    }, 600)
  }

  return (
    <div className="space-y-4">
      {/* Pengaturan Pajak PB1 */}
      <div>
        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Receipt className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          1. Kebijakan Pajak Restoran (PB1 / PPN 10%)
        </h4>
        <div className="space-y-2">
          {taxModes.map((m) => {
            const isSelected = data.pb1TaxMode === m.mode
            return (
              <button
                key={m.mode}
                type="button"
                onClick={() => onChange({ pb1TaxMode: m.mode })}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                  isSelected
                    ? 'border-amber-600 bg-amber-500/15 shadow-sm ring-1 ring-amber-500/30'
                    : 'border-amber-900/15 bg-amber-500/5 hover:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant={isSelected ? 'default' : 'secondary'} className="text-[10px] py-0">
                      {m.badge}
                    </Badge>
                    <span className="text-xs font-bold text-amber-950 dark:text-amber-100">
                      {m.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/70 dark:text-amber-200/70">
                    {m.description}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 ml-2 mt-0.5" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Kas Laci Float Awal Shift */}
      <div className="border-t border-amber-900/10 pt-3">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            2. Modal Kas Laci Float Awal Shift
          </h4>
          <PriceTag amount={data.initialKasFloat} size="sm" variant="accent" />
        </div>
        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mb-2">
          Jumlah uang tunai fisik modal awal di laci kasir saat membuka shift pertama kali.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <Input
            type="number"
            value={data.initialKasFloat}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ initialKasFloat: Math.max(0, parseInt(e.target.value) || 0) })}
            placeholder="500000"
            className="h-9 text-xs font-bold font-mono tabular-nums"
          />
          <div className="flex gap-1.5">
            {floatPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange({ initialKasFloat: preset })}
                className={`flex-1 text-[11px] py-1.5 px-1 rounded-lg border font-mono tabular-nums transition-all ${
                  data.initialKasFloat === preset
                    ? 'bg-amber-600 text-white border-amber-600 font-bold'
                    : 'bg-amber-500/10 text-amber-900 dark:text-amber-100 border-amber-900/15 hover:bg-amber-500/20'
                }`}
              >
                {(preset / 1000).toLocaleString('id-ID')}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* File CSV / Migration Bridge Data Upload */}
      <div className="border-t border-amber-900/10 pt-3">
        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <UploadCloud className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          3. Berkas Migrasi CSV / Excel ({data.migrationSource?.toUpperCase() || 'FRESH'})
        </h4>
        <div className="p-3.5 rounded-xl border-2 border-dashed border-amber-900/25 bg-amber-500/5 text-center">
          {data.migrationFileName ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 dark:text-emerald-100">
              <div className="flex items-center gap-2 text-xs font-bold">
                <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{data.migrationFileName}</span>
                <Badge variant="emerald" className="text-[10px]">
                  Terverifikasi (142 Baris)
                </Badge>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange({ migrationFileName: undefined })}
                className="h-6 text-[10px] text-red-500 hover:text-red-600 px-2"
              >
                Hapus
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-amber-900/70 dark:text-amber-200/70">
                Tarik & letakkan file CSV/Excel atau klik untuk simulasi impor data migrasi.
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isSimulatedUploading}
                  onClick={() => handleSimulateUpload(`migrasi_${data.migrationSource || 'katalog'}_2026.csv`)}
                  className="text-xs h-7"
                >
                  {isSimulatedUploading ? 'Memproses Berkas...' : '📁 Pilih / Contoh Berkas Migrasi'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2 text-xs text-emerald-950 dark:text-emerald-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <span className="leading-snug">
          Konfigurasi otomatis disinkronkan ke HCB Posting Kernel via REST API saat setup selesai.
        </span>
      </div>
    </div>
  )
}
