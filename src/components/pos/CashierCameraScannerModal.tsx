import React, { useState, useEffect, useRef } from 'react'
import { X, Camera, RefreshCw, Zap, Scan, CheckCircle, AlertCircle } from 'lucide-react'

export interface CashierCameraScannerModalProps {
  show: boolean
  onClose: () => void
  onScanSuccess: (barcode: string) => void
}

export const CashierCameraScannerModal: React.FC<CashierCameraScannerModalProps> = ({
  show,
  onClose,
  onScanSuccess
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState<string>('')
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (show) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [show, facingMode])

  const startCamera = async () => {
    setCameraError(null)
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraActive(true)
      } else {
        setCameraError('WebRTC Video Camera API tidak didukung pada browser ini.')
      }
    } catch (err: any) {
      setCameraError('Kamera tidak diizinkan atau tidak ditemukan pada perangkat.')
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
  }

  const handleSimulateScan = (code: string) => {
    setLastScanned(code)
    onScanSuccess(code)
    setTimeout(() => {
      onClose()
    }, 400)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      handleSimulateScan(manualCode.trim())
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm sm:max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Scanner Barcode Kamera</h3>
            <p className="text-[11px] text-slate-400">Scan Barcode / QR Produk Kasir Retail & F&B</p>
          </div>
        </div>

        {/* WEBRTC CAMERA PREVIEW CONTAINER */}
        <div className="relative w-full h-56 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* SCANNING RETICLE OVERLAY */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-32 border-2 border-dashed border-emerald-400/80 rounded-2xl animate-pulse relative">
                  <div className="absolute inset-0 bg-emerald-500/10" />
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center p-4 text-center gap-2 text-slate-400">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <p className="text-xs">{cameraError || 'Menghubungkan ke sensor kamera...'}</p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-1 px-3 py-1.5 bg-indigo-500 text-white text-xs font-bold rounded-lg shadow"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* CONTROLS OVERLAY */}
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleToggleFacingMode}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 shadow backdrop-blur"
              title="Ganti Lensa Kamera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DEMO QUICK PRESETS FOR TEST SIMULATION */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Scan className="w-3.5 h-3.5 text-indigo-400" /> Quick Preset Barcode (Demo Test):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSimulateScan('8999901')}
              className="py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-amber-300 rounded-xl"
            >
              Espresso (8999901)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateScan('8999902')}
              className="py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-emerald-300 rounded-xl"
            >
              Croissant (8999902)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateScan('8999903')}
              className="py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-indigo-300 rounded-xl"
            >
              Matcha (8999903)
            </button>
          </div>
        </div>

        {/* MANUAL TEXT/SKU INPUT FALLBACK */}
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-1.5">
          <label className="text-[11px] text-slate-400 font-semibold">Atau Ketik Kode Barcode/SKU Manual:</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Contoh: 8999901"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow"
            >
              Scan
            </button>
          </div>
        </form>

        {lastScanned && (
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Barcode Terdeteksi: {lastScanned}
          </div>
        )}
      </div>
    </div>
  )
}
