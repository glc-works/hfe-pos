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
import { ToggleSwitch, Button, Badge } from '@/ui'

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

  const handleToggleAutoCut = (next: boolean) => {
    setAutoCut(next)
    printerService.updateConfig({ autoCut: next })
  }

  const handleToggleAutoKick = (next: boolean) => {
    setAutoKickDrawer(next)
    printerService.updateConfig({ autoKickDrawerOnCash: next })
  }

  const handleToggleSound = (next: boolean) => {
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
    CashierAudioService.getInstance().playBeep(1200, 200)
    showStatus(t.settings.testBeeperSuccess)
  }

  const CONNECTION_OPTIONS = [
    { id: 'simulated', label: t.settings.virtualPos, icon: <Radio className="w-4 h-4 text-slate-400" /> },
    { id: 'bluetooth', label: t.settings.bluetooth, icon: <Bluetooth className="w-4 h-4 text-blue-400" /> },
    { id: 'usb', label: t.settings.usbCable, icon: <Usb className="w-4 h-4 text-emerald-400" /> }
  ]

  const isConnected = currentStatus.status === 'connected'

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

        <Badge variant={isConnected ? 'emerald' : 'amber'} glyph="🖨️">
          {connectionType.toUpperCase()} {paperWidth}mm • {isConnected ? 'Online' : 'Ready'}
        </Badge>
      </div>

      {statusMsg && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* 1. CONNECTION TYPE SELECTOR */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          {t.settings.printerConnectionTitle}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CONNECTION_OPTIONS.map((conn) => (
            <button
              key={conn.id}
              type="button"
              onClick={() => handleConnectionChange(conn.id as PrinterConnectionType)}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
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
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
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
          <div className="p-3 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between">
            <ToggleSwitch
              checked={autoCut}
              onChange={handleToggleAutoCut}
              label={t.settings.autoCutter}
              description={t.settings.autoCutterDesc}
            />
          </div>

          {/* AUTO KICK DRAWER */}
          <div className="p-3 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between">
            <ToggleSwitch
              checked={autoKickDrawer}
              onChange={handleToggleAutoKick}
              label={t.settings.autoKickDrawer}
              description={t.settings.autoKickDrawerDesc}
            />
          </div>

          {/* SOUND BEEPER */}
          <div className="p-3 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between">
            <ToggleSwitch
              checked={soundBeeperEnabled}
              onChange={handleToggleSound}
              label={t.settings.soundBeeper}
              description={t.settings.soundBeeperDesc}
            />
          </div>
        </div>
      </div>

      {/* 4. HARDWARE DIAGNOSTICS & TEST ACTIONS */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {t.settings.hardwareDiagnosticsTitle}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Button
            variant="secondary"
            size="md"
            disabled={isPrinting}
            onClick={handleTestPrint}
            icon={<Printer className="w-4 h-4 text-indigo-400" />}
          >
            {isPrinting ? t.settings.printing : t.settings.testPrintReceipt}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleTestDrawer}
            icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
          >
            {t.settings.testKickDrawer}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleTestBeeper}
            icon={<Volume2 className="w-4 h-4 text-amber-400" />}
          >
            {t.settings.testSoundBeeper}
          </Button>
        </div>
      </div>
    </div>
  )
}
