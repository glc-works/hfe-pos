import React, { useState, useEffect } from 'react'
import { X, UserCheck, Calendar, Heart, Wine, ShieldAlert, Award, MessageSquare } from 'lucide-react'
import { fetchVipGuestHistory, VipGuestHistory } from '../../services/hfeApi'

export interface GuestHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  contactId?: string
}

export const GuestHistoryModal: React.FC<GuestHistoryModalProps> = ({
  isOpen,
  onClose,
  contactId = 'VIP-001'
}) => {
  const [history, setHistory] = useState<VipGuestHistory | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetchVipGuestHistory(contactId)
        .then(data => setHistory(data))
        .catch(err => console.error('Failed to fetch VIP guest history:', err))
        .finally(() => setLoading(false))
    }
  }, [isOpen, contactId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Profil & Riwayat Tamu VIP Maître d'</h2>
              <p className="text-xs text-slate-400">Concierge VIP Guest Preference Ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-slate-400 text-sm">Memuat profil VIP...</div>
          ) : history ? (
            <div className="space-y-4">
              {/* Guest Profile Summary */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white">{history.guestName}</h3>
                    <p className="text-xs text-slate-400">Telp: {history.phone} | Kunjungan ke-{history.totalVisits}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    VIP Platinum Patron
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" /> Meja Favorit
                    </span>
                    <p className="text-xs font-bold text-slate-200">{history.preferredTable}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Wine className="w-3 h-3 text-purple-400" /> Sommelier Favorit
                    </span>
                    <p className="text-xs font-bold text-slate-200">{history.preferredSommelier}</p>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" /> Favorite Vintage Wine
                  </span>
                  <p className="text-xs font-bold text-amber-300">{history.favoriteVintage}</p>
                </div>
              </div>

              {/* Allergen Alert Badge */}
              {history.allergenAlert && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{history.allergenAlert}</span>
                </div>
              )}

              {/* Special Dates (Anniversary & Birthday) */}
              <div className="grid grid-cols-2 gap-2">
                {history.anniversaryDate && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" /> Anniversary Date
                    </span>
                    <p className="text-xs font-bold text-white">{history.anniversaryDate}</p>
                  </div>
                )}
                {history.birthdayDate && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" /> Birthday Date
                    </span>
                    <p className="text-xs font-bold text-white">{history.birthdayDate}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {history.specialNotes && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-slate-400" /> Catatan Layanan Khusus
                  </span>
                  <p className="text-xs text-slate-300">{history.specialNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">Data tamu tidak ditemukan.</div>
          )}
        </div>
      </div>
    </div>
  )
}
