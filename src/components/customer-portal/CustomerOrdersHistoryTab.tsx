import React, { useState } from 'react'
import { Receipt, CheckCircle2, MapPin, Sparkles, RefreshCw, X, Download, FileText, Leaf, Star, MessageSquare, Check } from 'lucide-react'

export interface PastOrderItem {
  name: string
  qty: number
  price: number
  customization?: string
}

export interface PastOrderRecord {
  orderId: string
  date: string
  venue: string
  table: string
  status: 'Lunas' | 'Diproses' | 'Dibatalkan'
  paymentMethod: string
  items: PastOrderItem[]
  subtotal: number
  taxPB1: number
  serviceFee: number
  total: number
  pointsEarned: number
  isPaperless?: boolean
  rating?: number
  feedback?: string
}

export interface CustomerOrdersHistoryTabProps {
  orders?: PastOrderRecord[]
  onReorder?: (order: PastOrderRecord) => void
  onSubmitOrderFeedback?: (orderId: string, rating: number, feedback: string) => void
}

const DEFAULT_PAST_ORDERS: PastOrderRecord[] = [
  {
    orderId: 'ORD-8821',
    date: 'Hari ini, 14:30 WIB',
    venue: 'Kopitiam Senopati (HQ)',
    table: 'Meja OUT-04',
    status: 'Lunas',
    paymentMethod: 'QRIS BCA',
    items: [
      { name: 'Espresso Aren Latte', qty: 1, price: 28000, customization: 'Oat Milk (+5k), Gula 50%' },
      { name: 'Nasi Goreng Wagyu Roastery', qty: 1, price: 58000 }
    ],
    subtotal: 86000,
    taxPB1: 8600,
    serviceFee: 4300,
    total: 98900,
    pointsEarned: 86,
    isPaperless: true
  },
  {
    orderId: 'ORD-8710',
    date: '12 Agu 2026, 10:15 WIB',
    venue: 'Kopitiam Senopati (HQ)',
    table: 'Meja IND-02',
    status: 'Lunas',
    paymentMethod: 'Kartu Debit BCA',
    items: [
      { name: 'Japanese Cold Brew V60', qty: 2, price: 70000 },
      { name: 'Croissant Butter Paris', qty: 1, price: 25000 }
    ],
    subtotal: 95000,
    taxPB1: 9500,
    serviceFee: 4750,
    total: 109250,
    pointsEarned: 95,
    isPaperless: true
  },
  {
    orderId: 'ORD-8605',
    date: '05 Agu 2026, 19:40 WIB',
    venue: 'Kopitiam Senopati (HQ)',
    table: 'Takeaway Express',
    status: 'Lunas',
    paymentMethod: 'QRIS GoPay',
    items: [
      { name: 'Uji Matcha Oat Latte', qty: 2, price: 68000 },
      { name: 'Truffle Fries with Garlic Mayo', qty: 1, price: 38000 }
    ],
    subtotal: 106000,
    taxPB1: 10600,
    serviceFee: 0,
    total: 116600,
    pointsEarned: 106,
    isPaperless: true
  }
]

export const CustomerOrdersHistoryTab: React.FC<CustomerOrdersHistoryTabProps> = ({
  orders = DEFAULT_PAST_ORDERS,
  onReorder,
  onSubmitOrderFeedback
}) => {
  const [orderList, setOrderList] = useState<PastOrderRecord[]>(orders)
  const [selectedReceipt, setSelectedReceipt] = useState<PastOrderRecord | null>(null)
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState<string | null>(null)
  
  // Order Review Modal State
  const [reviewOrder, setReviewOrder] = useState<PastOrderRecord | null>(null)
  const [starRating, setStarRating] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null)

  const paperlessCount = orderList.filter(o => o.isPaperless !== false).length

  const handleReorderClick = (ord: PastOrderRecord) => {
    if (onReorder) onReorder(ord)
    setReorderSuccessMsg(`Menu dari ${ord.orderId} telah dimasukkan ke keranjang!`)
    setTimeout(() => setReorderSuccessMsg(null), 3000)
  }

  const handleSendOrderReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewOrder) return

    setOrderList(prev => prev.map(o => {
      if (o.orderId === reviewOrder.orderId) {
        return { ...o, rating: starRating, feedback: reviewComment }
      }
      return o
    }))

    if (onSubmitOrderFeedback) {
      onSubmitOrderFeedback(reviewOrder.orderId, starRating, reviewComment)
    }

    setFeedbackSuccessMsg(`Terima kasih! Ulasan untuk ${reviewOrder.orderId} berhasil dikirim ke manajer toko (+50 Poin).`)
    setReviewOrder(null)
    setReviewComment('')
    setTimeout(() => setFeedbackSuccessMsg(null), 4000)
  }

  return (
    <div className="flex flex-col gap-3.5 w-full text-slate-900 dark:text-slate-100">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Riwayat Pesanan & E-Receipt
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Daftar transaksi per outlet merchant, e-receipt, dan ulasan pesanan</p>
        </div>
        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
          {orderList.length} Transaksi
        </span>
      </div>

      {/* 🌱 ECO WARRIOR GO-GREEN BANNER */}
      <div className="bg-emerald-500/[0.08] dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block text-slate-900 dark:text-white">🌱 Eco Warrior Paperless</span>
            <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono">Menghemat {paperlessCount} lembar kertas termal (+{paperlessCount * 10} Eco-Points)</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shrink-0">
          100% Digital
        </span>
      </div>

      {reorderSuccessMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{reorderSuccessMsg}</span>
        </div>
      )}

      {feedbackSuccessMsg && (
        <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-2xl text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" />
          <span>{feedbackSuccessMsg}</span>
        </div>
      )}

      {/* ORDERS LIST */}
      <div className="flex flex-col gap-3">
        {orderList.map((order) => (
          <div 
            key={order.orderId}
            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 flex flex-col gap-3 shadow-md transition-all"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {order.orderId}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{order.date}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {order.status} ({order.paymentMethod})
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="text-slate-800 dark:text-slate-300 font-medium">{order.venue}</span>
                <span>•</span>
                <span className="font-mono text-amber-700 dark:text-amber-400">{order.table}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800/80 flex flex-col gap-1 mt-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 dark:text-slate-200 truncate">
                      <strong className="text-amber-700 dark:text-amber-400 font-mono">{item.qty}x</strong> {item.name}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 shrink-0">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Existing rating banner if already reviewed */}
            {order.rating && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                <span className="flex items-center gap-1 font-bold">
                  ⭐ {order.rating}/5 Bintang Terkirim ke Manager
                </span>
                {order.feedback && <span className="text-[11px] text-slate-500 dark:text-slate-400 italic truncate max-w-[200px]">"{order.feedback}"</span>}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Total Pembayaran:</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                    Rp {order.total.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> +{order.pointsEarned} pts
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!order.rating && (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewOrder(order)
                      setStarRating(5)
                      setReviewComment('')
                    }}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-all active:scale-[0.97]"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Beri Nilai</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedReceipt(order)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.97]"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>E-Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleReorderClick(order)}
                  className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow transition-all active:scale-[0.97] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Pesan Lagi</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. ORDER-BOUND REVIEW MODAL */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Beri Ulasan Pesanan</h4>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">{reviewOrder.orderId} • {reviewOrder.venue}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewOrder(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendOrderReview} className="flex flex-col gap-3.5">
              <div className="flex items-center justify-center gap-1.5 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarRating(star)}
                    className="p-1 text-amber-400 hover:scale-115 transition-transform"
                  >
                    <Star className={`w-7 h-7 ${star <= starRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  </button>
                ))}
              </div>
              <span className="text-center text-xs font-mono font-bold text-amber-700 dark:text-amber-300">{starRating} dari 5 Bintang</span>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">Kritik, Saran & Pengalaman Anda:</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Ceritakan rasa makanan/minuman atau keramahan barista kami..."
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Kirim Ulasan & Klaim +50 Poin</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. E-RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Digital E-Receipt Resmi</h4>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{selectedReceipt.orderId}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 flex flex-col gap-2.5 font-mono text-xs">
              <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-black text-sm text-slate-900 dark:text-white block">{selectedReceipt.venue}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{selectedReceipt.date} • {selectedReceipt.table}</span>
              </div>

              <div className="flex flex-col gap-1.5 py-1">
                {selectedReceipt.items.map((item, i) => (
                  <div key={i} className="flex items-start justify-between text-slate-800 dark:text-slate-300">
                    <div className="flex flex-col">
                      <span>{item.qty}x {item.name}</span>
                      {item.customization && (
                        <span className="text-[10px] text-amber-700 dark:text-amber-400/80 italic">{item.customization}</span>
                      )}
                    </div>
                    <span>Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 flex flex-col gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {selectedReceipt.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak Resto (PB1 10%):</span>
                  <span>Rp {selectedReceipt.taxPB1.toLocaleString('id-ID')}</span>
                </div>
                {selectedReceipt.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span>Service Charge (5%):</span>
                    <span>Rp {selectedReceipt.serviceFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-amber-700 dark:text-amber-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>TOTAL:</span>
                  <span>Rp {selectedReceipt.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  alert(`📥 Mengunduh struk E-Receipt ${selectedReceipt.orderId} format PDF resmi.`)
                  setSelectedReceipt(null)
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
