import React, { useState, useEffect } from 'react'
import { Download, X, Share2, PlusSquare, Smartphone, Zap, WifiOff, Sparkles, Check } from 'lucide-react'

export interface PwaInstallPromptModalProps {
  isOpen?: boolean
  onClose?: () => void
  forceShow?: boolean
}

export const PwaInstallPromptModal: React.FC<PwaInstallPromptModalProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  forceShow = false
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isInstalledSuccess, setIsInstalledSuccess] = useState(false)

  useEffect(() => {
    // Check if already in standalone mode
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsStandalone(standaloneMode)

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIosDevice)

    // Listen for Chromium / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      const dismissed = localStorage.getItem('hfe_pwa_dismissed')
      if (!dismissed && !standaloneMode) {
        // Auto show after 3 seconds for new users
        setTimeout(() => setInternalIsOpen(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    window.addEventListener('appinstalled', () => {
      setIsInstalledSuccess(true)
      setDeferredPrompt(null)
      setTimeout(() => {
        setInternalIsOpen(false)
        externalOnClose?.()
      }, 2000)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [externalOnClose])

  const isOpen = forceShow || externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

  const handleClose = () => {
    localStorage.setItem('hfe_pwa_dismissed', 'true')
    setInternalIsOpen(false)
    externalOnClose?.()
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalledSuccess(true)
      }
      setDeferredPrompt(null)
    }
  }

  // If already running inside installed standalone PWA, do not show
  if (isStandalone && !forceShow) return null
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-100 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* TOP ACCENT GLOW */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500" />

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition-all"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl shrink-0">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-extrabold text-white">Pasang Web App Hfe POS</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded-md font-bold flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Dapatkan performa prima & pengalaman native tanpa browser bar</p>
          </div>
        </div>

        {/* 3 VALUE PILLARS */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-slate-200">Buka Instan</span>
            <span className="text-[8px] text-slate-500 leading-tight">60 FPS Native</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-slate-800">
            <WifiOff className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-200">Offline Penuh</span>
            <span className="text-[8px] text-slate-500 leading-tight">Tetap Kasir Aktif</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-200">Layar Penuh</span>
            <span className="text-[8px] text-slate-500 leading-tight">Tanpa URL Bar</span>
          </div>
        </div>

        {/* INSTRUCTIONS BY DEVICE */}
        {isInstalledSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-400">
            <Check className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold">Aplikasi berhasil dipasang di layar utama perangkat Anda!</span>
          </div>
        ) : isIOS ? (
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2.5">
            <span className="text-[11px] font-bold text-slate-300">Cara Pasang di iPhone / iPad (Safari):</span>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
              <span>Ketuk tombol Bagikan <Share2 className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> di bawah Safari</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
              <span>Pilih <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400 mx-1" /> <strong className="text-slate-200">"Tambah ke Layar Utama"</strong> (Add to Home Screen)</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold py-3 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Pasang Aplikasi Sekarang
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
          <span>Hemat kuota & bebas update toko</span>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  )
}
export default PwaInstallPromptModal
