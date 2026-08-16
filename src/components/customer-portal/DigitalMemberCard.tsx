import React, { useState } from 'react'
import { Award, QrCode, Sparkles, Check, Copy, Coffee, Flame, ShieldCheck, ChevronDown, ChevronUp, Smartphone, ShieldAlert } from 'lucide-react'
import { DigitalMemberCardData, MemberTier } from '../../types/pos'

export interface DigitalMemberCardProps {
  cardData: DigitalMemberCardData
  onShowFullBarcode?: () => void
  onOrderOnline?: () => void
}

const TIER_STYLES: Record<MemberTier, {
  badgeBg: string
  badgeBorder: string
  badgeText: string
  gradient: string
  borderGlow: string
  accentColor: string
  label: string
}> = {
  Bronze: {
    badgeBg: 'bg-amber-900/40',
    badgeBorder: 'border-amber-700/60',
    badgeText: 'text-amber-300',
    gradient: 'from-stone-950 via-amber-950/40 to-stone-900',
    borderGlow: 'border-amber-700/40 shadow-amber-950/50',
    accentColor: '#d97706',
    label: 'BRONZE MEMBER'
  },
  Silver: {
    badgeBg: 'bg-slate-700/50',
    badgeBorder: 'border-slate-400/60',
    badgeText: 'text-slate-200',
    gradient: 'from-slate-950 via-slate-800 to-slate-900',
    borderGlow: 'border-slate-400/50 shadow-slate-900/50',
    accentColor: '#94a3b8',
    label: 'SILVER MEMBER'
  },
  Gold: {
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-400/60',
    badgeText: 'text-amber-300',
    gradient: 'from-amber-950/80 via-slate-950 to-amber-900/50',
    borderGlow: 'border-amber-500/50 shadow-amber-500/20',
    accentColor: '#f59e0b',
    label: 'GOLD VIP'
  },
  Platinum: {
    badgeBg: 'bg-cyan-500/20',
    badgeBorder: 'border-cyan-400/60',
    badgeText: 'text-cyan-200',
    gradient: 'from-slate-950 via-cyan-950/50 to-slate-900',
    borderGlow: 'border-cyan-400/50 shadow-cyan-500/20',
    accentColor: '#06b6d4',
    label: 'PLATINUM ELITE'
  }
}

export const DigitalMemberCard: React.FC<DigitalMemberCardProps> = ({ cardData, onOrderOnline }) => {
  const [copied, setCopied] = useState(false)
  const [showBarcodeExpanded, setShowBarcodeExpanded] = useState(false)

  const tierInfo = TIER_STYLES[cardData.tier] || TIER_STYLES.Gold
  const stampsRemaining = Math.max(0, cardData.stampMax - cardData.stampCount)

  const handleCopyBarcode = () => {
    navigator.clipboard?.writeText(cardData.barcodeData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3 w-full select-none">
      {/* 💳 LUXURY APPLE WALLET / PASSBOOK PASS CONTAINER */}
      <div 
        className={`w-full rounded-3xl p-5 border bg-gradient-to-br ${tierInfo.gradient} ${tierInfo.borderGlow} shadow-2xl relative overflow-hidden flex flex-col justify-between gap-4 transition-all text-white`}
      >
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-36 h-36 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

        {/* 1. TOP PASSBOOK HEADER */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            {cardData.logoUrl ? (
              <img 
                src={cardData.logoUrl} 
                alt={cardData.brandName} 
                className="w-9 h-9 rounded-xl object-cover border border-white/20 shadow-sm shrink-0" 
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow">
                <Coffee className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Digital Member Pass</span>
              <h3 className="text-sm font-black text-white tracking-tight truncate">{cardData.brandName}</h3>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full border ${tierInfo.badgeBg} ${tierInfo.badgeBorder} flex items-center gap-1.5 shadow-sm shrink-0`}>
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className={`text-[10px] font-black tracking-wider uppercase font-mono ${tierInfo.badgeText}`}>
              {tierInfo.label}
            </span>
          </div>
        </div>

        {/* 2. MEMBER PROFILE & ACCRUED POINTS LEDGER */}
        <div className="flex items-end justify-between gap-4 relative z-10 pt-1">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Nama Anggota</span>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">{cardData.customerName}</h2>
            <p className="text-xs text-slate-300 font-mono mt-0.5">{cardData.phone}</p>
            {cardData.allergens && cardData.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {cardData.allergens.map((alg) => (
                  <span key={alg} className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded flex items-center gap-0.5 font-mono">
                    <ShieldAlert className="w-2.5 h-2.5 text-rose-400" /> Bebas {alg}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-right shrink-0 bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-inner">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider font-mono flex items-center justify-end gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Saldo Poin
            </span>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                {cardData.pointsBalance.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">pts</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono block">
              ≈ Rp {(cardData.pointsBalance * 10).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* 3. COFFEE CUP STAMP CARD PROGRESS */}
        <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2 relative z-10 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" /> Loyalty Stamp Card
            </span>
            <span className="font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 text-[11px]">
              {cardData.stampCount}/{cardData.stampMax} Stamps
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 py-1">
            {Array.from({ length: cardData.stampMax }).map((_, idx) => {
              const isFilled = idx < cardData.stampCount
              return (
                <div 
                  key={idx} 
                  className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold transition-all border ${
                    isFilled 
                      ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30' 
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                  title={isFilled ? `Stamp ${idx + 1} Terisi` : `Stamp ${idx + 1} Kosong`}
                >
                  {isFilled ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="font-mono text-[9px]">{idx + 1}</span>}
                </div>
              )
            })}
          </div>

          <p className="text-[10px] text-slate-400 font-mono">
            {stampsRemaining === 0 ? (
              <span className="text-emerald-400 font-bold">🎉 Stamp penuh! Dapatkan 1 Minuman Pilihan Gratis di kasir.</span>
            ) : (
              <span>☕ Kumpulkan <strong className="text-amber-400 font-bold">{stampsRemaining} stamp lagi</strong> untuk Gratis 1 Minuman Spesial!</span>
            )}
          </p>
        </div>

        {/* 4. POS SCANNER BARCODE & QR PASSBOOK FOOTER */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col items-center gap-2 text-slate-950 relative z-10 shadow-lg">
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Member Barcode ID
            </span>
            <button 
              type="button" 
              onClick={handleCopyBarcode}
              className="text-[10px] font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-300 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>

          <div 
            onClick={() => setShowBarcodeExpanded(!showBarcodeExpanded)}
            className="w-full bg-white py-1 flex flex-col items-center cursor-pointer group"
            title="Ketuk untuk memperbesar barcode"
          >
            <div className="w-full h-12 flex items-center justify-center gap-[3px] px-2 overflow-hidden">
              {[4, 2, 5, 1, 3, 2, 6, 1, 4, 2, 5, 3, 1, 6, 2, 4, 1, 5, 2, 3, 4, 1, 6, 2, 5, 1, 3, 4, 2, 6, 1, 5, 3].map((w, i) => (
                <div key={i} className="bg-black h-full rounded-[1px]" style={{ width: `${w}px` }} />
              ))}
            </div>
            <span className="text-xs font-mono font-black tracking-widest text-slate-900 mt-1">
              {cardData.barcodeData}
            </span>
          </div>

          <div className="w-full flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200">
            <span>Tunjukkan barcode ke kasir saat transaksi</span>
            <button 
              type="button" 
              onClick={() => setShowBarcodeExpanded(!showBarcodeExpanded)}
              className="text-amber-600 font-bold flex items-center gap-0.5 hover:underline"
            >
              <QrCode className="w-3 h-3" />
              <span>{showBarcodeExpanded ? 'Tutup QR' : 'QR Mode'}</span>
              {showBarcodeExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showBarcodeExpanded && (
            <div className="w-full pt-2 flex flex-col items-center gap-2 border-t border-slate-200 animate-fadeIn">
              <div className="p-3 bg-slate-950 text-white rounded-xl flex items-center justify-center">
                <QrCode className="w-28 h-28 text-white" />
              </div>
              <span className="text-[10px] font-mono text-slate-600 text-center">
                {cardData.qrData}
              </span>
            </div>
          )}
        </div>

        {/* 5. 1-TAP ONLINE ORDER CTA BUTTON */}
        {onOrderOnline && (
          <button
            type="button"
            onClick={onOrderOnline}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-98 relative z-10"
          >
            <Smartphone className="w-4 h-4" />
            <span>Pesan Menu Online / Delivery Sekarang ➔</span>
          </button>
        )}
      </div>
    </div>
  )
}
