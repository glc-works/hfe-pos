import React, { useState } from 'react'
import { MessageSquare, CheckCircle, Loader2 } from 'lucide-react'
import { verifyWaInbound } from '../../../services/hfeAuthApi'

export interface WaVerificationButtonProps {
  phone?: string
  buttonText?: string
  apiEndpoint?: string
  onVerified?: (res: { status: string; verified: boolean }) => void
}

export const WaVerificationButton: React.FC<WaVerificationButtonProps> = ({
  phone = '6281234567890',
  buttonText = 'Verifikasi WhatsApp (Rp 0 / Free)',
  apiEndpoint = 'http://localhost:8080',
  onVerified,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [verified, setVerified] = useState<boolean>(false)

  const handleWaVerify = async () => {
    setLoading(true)
    try {
      const code = `VERIFY-${Math.floor(100000 + Math.random() * 900000)}`
      const waUrl = `https://wa.me/6281298765432?text=Halo%20Hfe%20Auth,%20verifikasi%20nomor%20saya:%20${code}`
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank')
      }

      const res = await verifyWaInbound(phone, code, apiEndpoint)
      setVerified(res.verified)
      if (onVerified) onVerified(res)
    } catch (err) {
      console.error('[WaVerificationButton] Error during WA verification:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleWaVerify}
      disabled={loading || verified}
      className={`w-full py-3 px-4 rounded-xl text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm ${
        verified
          ? 'bg-emerald-600 hover:bg-emerald-700 cursor-default'
          : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700'
      } disabled:opacity-75`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Memverifikasi WA...</span>
        </>
      ) : verified ? (
        <>
          <CheckCircle className="w-5 h-5 text-white" />
          <span>Nomor WA Terverifikasi</span>
        </>
      ) : (
        <>
          <MessageSquare className="w-5 h-5 text-white" />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  )
}
