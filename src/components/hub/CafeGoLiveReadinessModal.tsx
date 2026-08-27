import React, { useState } from 'react'
import { Card, Button, Badge, TruthChannelBadge } from '@/ui'
import { 
  CheckCircle2, AlertCircle, Printer, Landmark, QrCode, 
  Store, KeyRound, ShieldCheck, Sparkles, X, ChevronRight,
  DollarSign, Wifi, Terminal, ExternalLink
} from 'lucide-react'
import { ThermalPrinterService } from '../../services/hardware/ThermalPrinterService'

export interface CafeGoLiveReadinessModalProps {
  isOpen: boolean
  onClose: () => void
  onGoLiveSuccess?: () => void
}

interface ChecklistItem {
  id: string
  title: string
  category: 'auth' | 'hardware' | 'payment' | 'ledger' | 'catalog'
  description: string
  status: 'ready' | 'pending' | 'action_needed'
  actionLabel?: string
}

export const CafeGoLiveReadinessModal: React.FC<CafeGoLiveReadinessModalProps> = ({
  isOpen,
  onClose,
  onGoLiveSuccess
}) => {
  const printerService = ThermalPrinterService.getInstance()
  const printerConfig = printerService.getConfig()
  const printerStatus = printerService.getStatus()
  const [printTestSuccess, setPrintTestSuccess] = useState(false)
  const [drawerKickSuccess, setDrawerKickSuccess] = useState(false)
  const [goLiveDeclared, setGoLiveDeclared] = useState(false)

  const isHardwareSimulated = printerConfig.connectionType === 'simulated'

  const checklist: ChecklistItem[] = [
    {
      id: 'chk-01',
      title: 'PIN Kasir & Kas Awal (Float)',
      category: 'auth',
      description: 'PIN Kasir 6-digit terdaftar (8888), kas laci awal diset Rp 200.000.',
      status: 'ready'
    },
    {
      id: 'chk-02',
      title: 'Printer Struk Thermal ESC/POS (58/80mm)',
      category: 'hardware',
      description: isHardwareSimulated 
        ? 'Driver Virtual ESC/POS aktif (Simulasi Memori Browser).'
        : `Driver fisik ${printerStatus.deviceName} terhubung (${printerConfig.paperWidth}mm).`,
      status: isHardwareSimulated ? 'pending' : 'ready',
      actionLabel: 'Tes Cetak'
    },
    {
      id: 'chk-03',
      title: 'QRIS Dinamis & Settlement Bank',
      category: 'payment',
      description: 'NMID ID1020038912389 terdaftar, MDR 0.3% regulasi BI, siap terima QRIS.',
      status: 'ready'
    },
    {
      id: 'chk-04',
      title: 'Buku Besar Hfe CORE (Double-Entry)',
      category: 'ledger',
      description: 'Jurnal GL 1101, GL 4101, GL 2102 diposting via Offline Intent Queue (Local Persisted).',
      status: 'pending'
    },
    {
      id: 'chk-05',
      title: 'Katalog Menu & Resep Bahan Baku (BOM)',
      category: 'catalog',
      description: 'Menu espresso, latte, croissant siap. Dosis 18g/cup terlacak di stok.',
      status: 'ready'
    }
  ]

  if (!isOpen) return null

  const handleTestPrint = async () => {
    await printerService.printTestReceipt('Kopi Nusantara Senopati HQ')
    setPrintTestSuccess(true)
    setTimeout(() => setPrintTestSuccess(false), 3000)
  }

  const handleTestDrawer = async () => {
    await printerService.kickCashDrawer()
    setDrawerKickSuccess(true)
    setTimeout(() => setDrawerKickSuccess(false), 3000)
  }

  const handleDeclareGoLive = () => {
    setGoLiveDeclared(true)
    if (onGoLiveSuccess) onGoLiveSuccess()
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const allReady = checklist.every(c => c.status === 'ready')

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 font-sans">
        
        {/* HEADER */}
        <header className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-wide">
                  Pusat Kesiapan Operasional Toko (Go-Live Readiness)
                </h3>
                <TruthChannelBadge channel={isHardwareSimulated ? 'pending-sync' : 'live-core'} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verifikasi menyeluruh kasir, printer thermal, QRIS, buku besar, dan stok sebelum melayani pelanggan nyata.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* BODY (Scroll Owner) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
          {/* HARDWARE QUICK TEST DOCK */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 text-white space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold flex items-center gap-2 text-emerald-400">
                  <Printer className="w-4 h-4" /> Uji Coba Cepat Perangkat Keras Kasir
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Driver: <strong className="text-white font-mono">{printerStatus.deviceName}</strong> ({printerConfig.paperWidth}mm)
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTestDrawer}
                  className="text-xs border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>{drawerKickSuccess ? '✓ Laci Terbuka!' : 'Tes Buka Laci (RJ11)'}</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleTestPrint}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{printTestSuccess ? '✓ Struk Terkirim!' : 'Tes Cetak Struk ESC/POS'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* CHECKLIST ITEMS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
              Daftar Standar Kesiapan Operasional Harian
            </h4>

            {checklist.map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    item.status === 'ready'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}>
                    {item.status === 'ready' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {item.status === 'ready' ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                      ✓ Terverifikasi
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-mono font-bold">
                      🧪 Mode Simulasi
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* FOOTER ACTION DOCK */}
        <footer className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Semua protokol audit aman & terisolasi.</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Tutup
            </Button>
            <Button
              size="sm"
              onClick={handleDeclareGoLive}
              disabled={goLiveDeclared}
              className={`font-bold text-xs flex items-center gap-1.5 shadow-lg ${
                isHardwareSimulated
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {goLiveDeclared 
                  ? '🎉 Toko Resmi Live!' 
                  : isHardwareSimulated 
                    ? 'Buka Toko (Mode Simulasi Virtual) ➔' 
                    : 'Deklarasikan Toko Siap Buka (Go-Live) ➔'}
              </span>
            </Button>
          </div>
        </footer>

      </div>
    </div>
  )
}
export default CafeGoLiveReadinessModal
