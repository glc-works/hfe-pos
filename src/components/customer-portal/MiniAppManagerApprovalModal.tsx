import React, { useState } from 'react'
import { X, ShieldCheck, ShieldAlert, Check, AlertTriangle, Sparkles, Clock, UserCheck } from 'lucide-react'
import { ManagerApprovalRequest } from '../../types/pos'

export interface MiniAppManagerApprovalModalProps {
  isOpen: boolean
  onClose: () => void
}

const INITIAL_APPROVAL_REQUESTS: ManagerApprovalRequest[] = [
  {
    id: 'APP-VOID-01',
    orderId: 'ORD-8821',
    tableNumber: 'Meja OUT-04',
    type: 'void_item',
    amount: 58000,
    reason: 'Tamu salah pesan Nasi Goreng Wagyu, minta diganti Pasta Truffle',
    requestedByCashierName: 'Rian (Kasir 1)',
    requestedAt: '2 menit lalu',
    status: 'pending'
  },
  {
    id: 'APP-DISC-02',
    orderId: 'ORD-8829',
    tableNumber: 'Meja VIP-01',
    type: 'custom_discount',
    amount: 150000,
    reason: 'Diskon Relasi Owner / Partner Komunitas Kopi (30%)',
    requestedByCashierName: 'Siti (Kasir 2)',
    requestedAt: '5 menit lalu',
    status: 'pending'
  }
]

export const MiniAppManagerApprovalModal: React.FC<MiniAppManagerApprovalModalProps> = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState<ManagerApprovalRequest[]>(INITIAL_APPROVAL_REQUESTS)
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleApprove = (reqId: string, orderId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r))
    setActionSuccessMsg(`Otorisasi HfeCard sukses! Kasir telah menerima persetujuan untuk ${orderId}.`)
    setTimeout(() => setActionSuccessMsg(null), 3500)
  }

  const handleReject = (reqId: string, orderId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r))
    setActionSuccessMsg(`Permintaan untuk ${orderId} telah ditolak.`)
    setTimeout(() => setActionSuccessMsg(null), 3500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-950 border border-teal-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">🔔 Baki Approval Manajer Realtime</h4>
              <span className="text-[10px] font-mono text-teal-400">Otorisasi Digital HfeCard • Anti-Fraud Protection</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {actionSuccessMsg && (
          <div className="p-3 bg-teal-500/20 border border-teal-500/40 rounded-2xl text-teal-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* REQUESTS LIST */}
        <div className="flex flex-col gap-3">
          {requests.map((req) => {
            const isApproved = req.status === 'approved'
            const isRejected = req.status === 'rejected'
            const isPending = req.status === 'pending'

            return (
              <div
                key={req.id}
                className={`rounded-2xl p-4 border flex flex-col gap-3 transition-all ${
                  isApproved
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isRejected
                    ? 'bg-rose-950/20 border-rose-500/40 opacity-60'
                    : 'bg-slate-900/90 border-slate-700 shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
                      {req.orderId}
                    </span>
                    <span className="text-xs font-bold text-white">{req.tableNumber}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isApproved
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : isRejected
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                  }`}>
                    {isApproved ? '🛡️ Disetujui' : isRejected ? '❌ Ditolak' : '⏳ Menunggu Approval'}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Jenis Permintaan:</span>
                    <span className="font-bold text-amber-400 uppercase font-mono">
                      {req.type === 'void_item' ? '⚠️ Void Item Pesanan' : '🏷️ Diskon VIP Khusus'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nominal:</span>
                    <span className="font-mono font-black text-rose-400">
                      Rp {req.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 mt-1">
                    <strong className="text-slate-400">Alasan: </strong>{req.reason}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                    <span>Diminta oleh: <strong className="text-slate-200">{req.requestedByCashierName}</strong></span>
                    <span>⏱️ {req.requestedAt}</span>
                  </div>
                </div>

                {isPending && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleReject(req.id, req.orderId)}
                      className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-slate-700 hover:border-rose-500/40 font-bold text-xs transition-all cursor-pointer"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(req.id, req.orderId)}
                      className="flex-1 py-2 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Setujui dengan HfeCard</span>
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
