import React, { useState } from 'react'
import { ThermalPrinterService, PrinterConnectionType, PaperWidth } from '../../services/hardware/ThermalPrinterService'
import {
  X,
  Printer,
  Bluetooth,
  Usb,
  Zap,
  CheckCircle2,
  Sliders,
  DollarSign,
  Radio,
  FileText,
  Sparkles,
  Check
} from 'lucide-react'

export interface ThermalPrinterSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ThermalPrinterSettingsModal: React.FC<ThermalPrinterSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null

  const printerService = ThermalPrinterService.getInstance()
  const currentConfig = printerService.getConfig()
  const currentStatus = printerService.getStatus()

  const [connectionType, setConnectionType] = useState<PrinterConnectionType>(currentConfig.connectionType)
  const [paperWidth, setPaperWidth] = useState<PaperWidth>(currentConfig.paperWidth)
  const [autoCut, setAutoCut] = useState(currentConfig.autoCut)
  const [autoKickDrawer, setAutoKickDrawer] = useState(currentConfig.autoKickDrawerOnCash)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const showStatus = (msg: string) => {
    setStatusMsg(msg)
    setTimeout(() => setStatusMsg(null), 3000)
  }

  const handleConnect = async (type: PrinterConnectionType) => {
    setConnectionType(type)
    if (type === 'bluetooth') {
      await printerService.connectBluetooth()
      showStatus('Berhasil terhubung ke Bluetooth Thermal Printer (RPP02N)!')
    } else if (type === 'usb') {
      await printerService.connectUsb()
      setPaperWidth(80)
      showStatus('Berhasil terhubung ke USB Thermal Printer (Epson TM-T82X)!')
    } else {
      printerService.updateConfig({ connectionType: 'simulated' })
      showStatus('Mode Virtual Thermal ESC/POS aktif.')
    }
  }

  const handleSaveConfig = () => {
    printerService.updateConfig({
      connectionType,
      paperWidth,
      autoCut,
      autoKickDrawerOnCash: autoKickDrawer
    })
    showStatus('Konfigurasi hardware printer berhasil disimpan!')
    setTimeout(() => onClose(), 600)
  }

  const handleTestPrint = async () => {
    setIsTesting(true)
    const result = await printerService.printTestReceipt()
    setIsTesting(false)
    if (result.success) {
      showStatus(`🎉 Struk uji coba (${result.rawBytesLength} bytes) berhasil dicetak ke ${currentStatus.deviceName}!`)
    }
  }

  const handleTestDrawer = async () => {
    await printerService.kickCashDrawer()
    showStatus('⚡ Sinyal RJ11 50ms electric pulse dikirim ke laci kasir!')
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Hardware Printer Thermal ESC/POS</h2>
              <p className="text-xs text-slate-400">Driver Bluetooth, USB, & Sinyal Laci Kasir RJ11</p>
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

        {/* BODY */}
        <div className="p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto text-xs">
          {statusMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {statusMsg}
            </div>
          )}

          {/* ACTIVE DEVICE STATUS CARD */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-slate-400 block text-[11px]">Printer Aktif:</span>
                <span className="font-bold text-white text-xs">{currentStatus.deviceName}</span>
              </div>
            </div>
            <span className="font-mono text-[11px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
              {paperWidth}mm ESC/POS
            </span>
          </div>

          {/* CONNECTION INTERFACE SELECTOR */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-300">Pilih Jalur Koneksi Printer</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bluetooth', label: 'Bluetooth', icon: <Bluetooth className="w-4 h-4" /> },
                { id: 'usb', label: 'USB Cable', icon: <Usb className="w-4 h-4" /> },
                { id: 'simulated', label: 'Virtual POS', icon: <Radio className="w-4 h-4" /> }
              ].map((conn) => (
                <button
                  key={conn.id}
                  type="button"
                  onClick={() => handleConnect(conn.id as PrinterConnectionType)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    connectionType === conn.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow ring-1 ring-indigo-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {conn.icon}
                  <span className="font-bold text-xs">{conn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PAPER WIDTH SELECTOR */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-300">Lebar Kertas Thermal</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaperWidth(58)}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-0.5 transition-all ${
                  paperWidth === 58
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs">58 mm (Standard Mini)</span>
                <span className="text-[10px] text-slate-400 font-mono">32 Karakter / Kolom</span>
              </button>

              <button
                type="button"
                onClick={() => setPaperWidth(80)}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-0.5 transition-all ${
                  paperWidth === 80
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs">80 mm (Heavy Duty / Resto)</span>
                <span className="text-[10px] text-slate-400 font-mono">48 Karakter / Kolom</span>
              </button>
            </div>
          </div>

          {/* TOGGLES */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-300">Otomasi Perangkat Keras</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAutoCut(!autoCut)}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  autoCut
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-medium text-slate-200">Auto-Cutter Kertas</span>
                <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${autoCut ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'}`}>
                  {autoCut && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAutoKickDrawer(!autoKickDrawer)}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  autoKickDrawer
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-medium text-slate-200">Auto Kick Laci Kasir</span>
                <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${autoKickDrawer ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'}`}>
                  {autoKickDrawer && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
              </button>
            </div>
          </div>

          {/* HARDWARE DIAGNOSTICS & TEST BUTTONS */}
          <div className="flex flex-col gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Uji Coba Perangkat Kasir Fisik
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isTesting}
                onClick={handleTestPrint}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-400" />
                {isTesting ? 'Mencetak...' : 'Cetak Struk Uji'}
              </button>

              <button
                type="button"
                onClick={handleTestDrawer}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Uji Buka Laci Kasir
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSaveConfig}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all"
          >
            Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  )
}
