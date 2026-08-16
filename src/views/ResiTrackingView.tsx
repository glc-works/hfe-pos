import React, { useState } from 'react'
import { Package, Truck, CheckCircle2, Clock, MapPin, Phone, Send, ArrowLeft } from 'lucide-react'

interface ResiTrackingViewProps {
  resiCode?: string
  onClose?: () => void
}

export const ResiTrackingView: React.FC<ResiTrackingViewProps> = ({
  resiCode = 'RESI-SENOPATI-20260815-0042',
  onClose,
}) => {
  const [currentResi] = useState<string>(resiCode)
  const [activeStep] = useState<number>(2) // 0: Dibuat, 1: Dapur, 2: Pengiriman, 3: Selesai

  const timelineSteps = [
    { title: 'Pesanan Dibuat', time: '12:00 WIB', desc: 'Order diterima oleh kasir Senopati', completed: true },
    { title: 'Dipacking Dapur', time: '12:10 WIB', desc: 'Minuman & makanan disiapkan barista', completed: true },
    { title: 'Dalam Pengiriman (Budi)', time: '12:20 WIB', desc: 'Kurir toko Budi Santoso sedang menuju lokasi', completed: true },
    { title: 'Tiba di Lokasi', time: 'Estimasi 12:35 WIB', desc: 'Paket diserahkan ke penerima', completed: false },
  ]

  const handleContactRunner = () => {
    const text = encodeURIComponent(`Halo Mas Budi (Kurir Hfe POS), saya penerima pesanan resi ${currentResi}.`)
    window.open(`https://wa.me/6281299887766?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 flex flex-col gap-5 shadow-2xl relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 flex items-center gap-1 text-xs px-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali
          </button>
        )}

        <div className="text-center pt-2">
          <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 mb-2">
            <Truck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 block w-max mx-auto mb-1 uppercase">
            ● Live Delivery Status
          </span>
          <h2 className="text-lg font-bold text-white">Lacak Resi AWB Pengiriman</h2>
          <span className="font-mono text-xs font-bold text-amber-400">{currentResi}</span>
        </div>

        {/* RECIPIENT SUMMARY CARD */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center border-b border-slate-850 pb-1.5">
            <span className="text-slate-400 text-[10px]">Toko Pengirim:</span>
            <span className="font-bold text-amber-400">Kopitiam Senopati HQ</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-850 pb-1.5">
            <span className="text-slate-400 text-[10px]">Penerima:</span>
            <span className="font-bold text-white">Bambang Tri</span>
          </div>
          <div className="flex items-start gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span>Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan</span>
          </div>
        </div>

        {/* TIMELINE PROGRESS */}
        <div className="flex flex-col gap-4 bg-slate-950 border border-slate-800 p-4 rounded-2xl">
          <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" /> Progress Status Pengiriman:
          </h4>
          <div className="flex flex-col gap-3 relative pl-4 border-l-2 border-slate-800">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col gap-0.5 text-xs">
                <div
                  className={`absolute -left-[21px] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                    step.completed
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      : idx === activeStep
                      ? 'bg-amber-500 border-amber-400 animate-pulse'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                />
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${step.completed ? 'text-white' : idx === activeStep ? 'text-amber-400' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{step.time}</span>
                </div>
                <p className="text-[11px] text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RUNNER CONTACT CARD */}
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-3 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Kurir Toko Assigned:</span>
            <span className="font-bold text-white text-sm">Budi Santoso</span>
          </div>
          <button
            onClick={handleContactRunner}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5" /> Hubungi Kurir WA
          </button>
        </div>
      </div>
    </div>
  )
}
