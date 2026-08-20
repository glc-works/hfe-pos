import React, { useState } from 'react'
import {
  Printer,
  Bluetooth,
  Usb,
  Radio,
  Sliders,
  DollarSign,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  Check
} from 'lucide-react'
import { useTranslation } from '../../context/LanguageContext'
import { useMerchantConfig } from '../../context/MerchantConfigContext'
import {
  ThermalPrinterService,
  PrinterConnectionType,
  PaperWidth
} from '../../services/hardware/ThermalPrinterService'
import { CashierAudioService } from '../../services/hardware/CashierAudioService'

export const HardwareCashierZone: React.FC = () => {
  const { t } = useTranslation()
  const { soundBeeperEnabled, setSoundBeeperEnabled } = useMerchantConfig()

  const printerService = ThermalPrinterService.getInstance()
  const currentConfig = printerService.getConfig()
  const currentStatus = printerService.getStatus()

  const [connectionType, setConnectionType] = useState<PrinterConnectionType>(currentConfig.connectionType)
  const [paperWidth, setPaperWidth] = useState<PaperWidth>(currentConfig.paperWidth)
  const [autoCut, setAutoCut] = useState(currentConfig.autoCut)
  const [autoKickDrawer, setAutoKickDrawer] = useState(currentConfig.autoKickDrawerOnCash)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)

  const showStatus = (msg: string) => {
    setStatusMsg(msg)
    setTimeout(() => setStatusMsg(null), 3500)
  }

  const handleConnectionChange = async (type: PrinterConnectionType) => {
    setConnectionType(type)
    if (type === 'bluetooth') {
      await printerService.connectBluetooth()
      showStatus('Bluetooth Thermal Printer (58mm) connected!')
    } else if (type === 'usb') {
      await printerService.connectUsb()
      setPaperWidth(80)
      showStatus('USB Thermal Printer (80mm) connected!')
    } else {
      printerService.updateConfig({ connectionType: 'simulated' })
      showStatus('Virtual ESC/POS Simulator active.')
    }
  }

  const handlePaperWidthChange = (width: PaperWidth) => {
    setPaperWidth(width)
    printerService.updateConfig({ paperWidth: width })
  }

  const handleToggleAutoCut = () => {
    const next = !autoCut
    setAutoCut(next)
    printerService.updateConfig({ autoCut: next })
  }

  const handleToggleAutoKick = () => {
    const next = !autoKickDrawer
    setAutoKickDrawer(next)
    printerService.updateConfig({ autoKickDrawerOnCash: next })
  }

  const handleToggleSound = () => {
    const next = !soundBeeperEnabled
    setSoundBeeperEnabled(next)
    if (next) {
      CashierAudioService.getInstance().playBeep(880, 100)
    }
  }

  const handleTestPrint = async () => {
    setIsPrinting(true)
    const res = await printerService.printTestReceipt()
    setIsPrinting(false)
    if (res.success) {
      showStatus(t.settings.testPrintSuccess)
      if (soundBeeperEnabled) CashierAudioService.getInstance().playBeep(1000, 80)
    }
  }

  const handleTestDrawer = async () => {
    await printerService.kickCashDrawer()
    showStatus(t.settings.testDrawerSuccess)
    if (soundBeeperEnabled) CashierAudioService.getInstance().playBeep(600, 150)
  }

  const handleTestBeeper = () => {
    CashierAudioService.getInstance().playSuccessChime()
    showStatus(t.settings.testBeeperSuccess)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {t.settings.zone3Heading}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.settings.zone3Desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-emerald-400">
            {currentStatus.deviceName}
          </span>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* 1. CONNECTION INTERFACE */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          {t.settings.printerConnectionTitle}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'bluetooth', label: t.settings.bluetooth, icon: <Bluetooth className="w-4 h-4" /> },
            { id: 'usb', label: t.settings.usbCable, icon: <Usb className="w-4 h-4" /> },
            { id: 'simulated', label: t.settings.virtualPos, icon: <Radio className="w-4 h-4" /> }
          ].map((conn) => (
            <button
              key={conn.id}
              type="button"
              onClick={() => handleConnectionChange(conn.id as PrinterConnectionType)}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                connectionType === conn.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold ring-1 ring-indigo-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {conn.icon}
              <span className="text-xs">{conn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. PAPER WIDTH SELECTION */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Printer className="w-3.5 h-3.5 text-indigo-400" />
          {t.settings.paperWidthTitle}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handlePaperWidthChange(58)}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all ${
              paperWidth === 58
                ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-400 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300">{t.settings.paper58mm}</span>
              {paperWidth === 58 && <Check className="w-3.5 h-3.5 text-indigo-400 stroke-[3]" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.settings.paper58mmDesc}</p>
          </button>

          <button
            type="button"
            onClick={() => handlePaperWidthChange(80)}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all ${
              paperWidth === 80
                ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-400 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300">{t.settings.paper80mm}</span>
              {paperWidth === 80 && <Check className="w-3.5 h-3.5 text-indigo-400 stroke-[3]" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.settings.paper80mmDesc}</p>
          </button>
        </div>
      </div>

      {/* 3. HARDWARE AUTOMATIONS */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {t.settings.hardwareAutomationTitle}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* AUTO-CUTTER */}
          <button
            type="button"
            onClick={handleToggleAutoCut}
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              autoCut
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex flex-col text-left pr-2">
              <span className="text-xs font-bold text-slate-200">{t.settings.autoCutter}</span>
              <span className="text-[10px] text-slate-400">{t.settings.autoCutterDesc}</span>
            </div>
            <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${autoCut ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'}`}>
              {autoCut && <Check className="w-3 h-3 stroke-[3]" />}
            </span>
          </button>

          {/* AUTO KICK DRAWER */}
          <button
            type="button"
            onClick={handleToggleAutoKick}
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              autoKickDrawer
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex flex-col text-left pr-2">
              <span className="text-xs font-bold text-slate-200">{t.settings.autoKickDrawer}</span>
              <span className="text-[10px] text-slate-400">{t.settings.autoKickDrawerDesc}</span>
            </div>
            <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${autoKickDrawer ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'}`}>
              {autoKickDrawer && <Check className="w-3 h-3 stroke-[3]" />}
            </span>
          </button>

          {/* SOUND BEEPER */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              soundBeeperEnabled
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex flex-col text-left pr-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                {soundBeeperEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                {t.settings.soundBeeper}
              </span>
              <span className="text-[10px] text-slate-400">{t.settings.soundBeeperDesc}</span>
            </div>
            <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${soundBeeperEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'}`}>
              {soundBeeperEnabled && <Check className="w-3 h-3 stroke-[3]" />}
            </span>
          </button>
        </div>
      </div>

      {/* 4. HARDWARE DIAGNOSTICS & TEST ACTIONS */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {t.settings.hardwareDiagnosticsTitle}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            disabled={isPrinting}
            onClick={handleTestPrint}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 shadow"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            {isPrinting ? t.settings.printing : t.settings.testPrintReceipt}
          </button>

          <button
            type="button"
            onClick={handleTestDrawer}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 shadow"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            {t.settings.testKickDrawer}
          </button>

          <button
            type="button"
            onClick={handleTestBeeper}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 shadow"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            {t.settings.testSoundBeeper}
          </button>
        </div>
      </div>
    </div>
  )
}
