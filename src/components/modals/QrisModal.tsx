import React from 'react'
import { QrCode } from 'lucide-react'

interface QrisModalProps {
  show: boolean
  onCompletePayment: () => void
}

export const QrisModal: React.FC<QrisModalProps> = ({ show, onCompletePayment }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 flex flex-col items-center gap-4 text-center shadow-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-amber-500" /> Pembayaran QRIS ASPI
        </h3>
        
        <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-200">
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=POS-HFEIT-CAFE-QRIS" 
            alt="QRIS Code" 
            className="w-44 h-44"
          />
        </div>

        <p className="text-xs text-slate-400">Scan QRIS menggunakan GoPay, OVO, ShopeePay, atau Mobile Banking Anda</p>

        <button
          onClick={onCompletePayment}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg"
        >
          ✓ Simulasi Pembayaran Sukses (Pay-First)
        </button>
      </div>
    </div>
  )
}
