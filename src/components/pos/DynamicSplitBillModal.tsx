import React, { useState } from 'react'
import { X, Users, Divide, CheckCircle2, Split, CreditCard, Banknote, QrCode, Sparkles } from 'lucide-react'
import { CartItem } from '../../types/pos'
import { PriceTag } from '../../ui/PriceTag'

export interface DynamicSplitBillModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  totalBill: number
  onCompleteSplitPayment?: (splitReceipts: { personName: string; amount: number; method: string; items: string[] }[]) => void
}

type SplitMode = 'equal' | 'by_item' | 'custom'

export const DynamicSplitBillModal: React.FC<DynamicSplitBillModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalBill,
  onCompleteSplitPayment
}) => {
  const [splitMode, setSplitMode] = useState<SplitMode>('by_item')
  const [paxCount, setPaxCount] = useState<number>(2)
  const [selectedItemsForPerson, setSelectedItemsForPerson] = useState<Record<number, string[]>>({ 1: [], 2: [] })
  const [paidStatusPerPerson, setPaidStatusPerPerson] = useState<Record<number, boolean>>({})
  const [paymentMethodPerPerson, setPaymentMethodPerPerson] = useState<Record<number, string>>({ 1: 'QRIS', 2: 'TUNAI' })
  const [isCompleted, setIsCompleted] = useState<boolean>(false)

  if (!isOpen) return null

  // Equal split calculation
  const equalAmount = Math.ceil(totalBill / paxCount)

  const toggleItemForPerson = (personIndex: number, itemId: string) => {
    setSelectedItemsForPerson(prev => {
      const currentList = prev[personIndex] || []
      const updated = currentList.includes(itemId)
        ? currentList.filter(id => id !== itemId)
        : [...currentList, itemId]
      return { ...prev, [personIndex]: updated }
    })
  }

  const handlePayPerson = (personIndex: number) => {
    setPaidStatusPerPerson(prev => ({ ...prev, [personIndex]: true }))
    const allPaid = Array.from({ length: paxCount }).every((_, idx) => {
      if (idx + 1 === personIndex) return true
      return !!paidStatusPerPerson[idx + 1]
    })

    if (allPaid) {
      setIsCompleted(true)
      if (onCompleteSplitPayment) {
        const receipts = Array.from({ length: paxCount }).map((_, idx) => ({
          personName: `Pelanggan ${idx + 1}`,
          amount: splitMode === 'equal' ? equalAmount : totalBill / paxCount,
          method: paymentMethodPerPerson[idx + 1] || 'QRIS',
          items: selectedItemsForPerson[idx + 1] || []
        }))
        onCompleteSplitPayment(receipts)
      }
      setTimeout(() => {
        setIsCompleted(false)
        onClose()
      }, 2500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-scaleUp text-slate-100">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">🍽️ Split Bill Dinamis Granular</h4>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span>Total Tagihan:</span>
                <PriceTag amount={totalBill} variant="accent" size="xs" />
              </div>
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

        {isCompleted ? (
          <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 flex flex-col items-center gap-2 text-center animate-fadeIn py-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            <span className="text-base font-bold text-white">Seluruh Tagihan Split Telah Lunas!</span>
            <p className="text-xs text-emerald-300 font-mono">
              Pembukuan Kasir dan Subledger Meja telah direkonsiliasi dengan sukses.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* MODE SELECTOR */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'by_item', label: '🥢 Pilih per Item', desc: 'Sesuai pesanan' },
                { id: 'equal', label: '👥 Bagi Rata', desc: 'Rata per orang' },
                { id: 'custom', label: '💵 Nominal Bebas', desc: 'Parsial rupiah' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSplitMode(m.id as SplitMode)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                    splitMode === m.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="text-[9px] opacity-80">{m.desc}</span>
                </button>
              ))}
            </div>

            {/* PAX SELECTOR */}
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" /> Jumlah Orang Patungan:
              </span>
              <div className="flex items-center gap-2">
                {[2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPaxCount(num)}
                    className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                      paxCount === num
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* SPLIT TILES */}
            <div className="flex flex-col gap-3">
              {Array.from({ length: paxCount }).map((_, idx) => {
                const personNum = idx + 1
                const isPaid = !!paidStatusPerPerson[personNum]
                const personTotal = splitMode === 'equal' 
                  ? equalAmount 
                  : cartItems.filter(i => (selectedItemsForPerson[personNum] || []).includes(i.id)).reduce((s, i) => s + (i.price * i.quantity), 0)

                return (
                  <div
                    key={personNum}
                    className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 transition-all ${
                      isPaid
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                          {personNum}
                        </span>
                        <span className="text-xs font-bold text-white">Orang ke-{personNum}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-amber-400">
                          Rp {personTotal.toLocaleString('id-ID')}
                        </span>
                        {isPaid && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                            ✅ LUNAS
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ITEMS SELECTOR IF BY_ITEM */}
                    {splitMode === 'by_item' && !isPaid && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cartItems.map(item => {
                          const isSelected = (selectedItemsForPerson[personNum] || []).includes(item.id)
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleItemForPerson(personNum, item.id)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {item.quantity}x {item.name} (Rp {item.price.toLocaleString('id-ID')})
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* PAYMENT BUTTON FOR THIS PERSON */}
                    {!isPaid && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-1.5">
                          {['QRIS', 'TUNAI', 'KARTU'].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setPaymentMethodPerPerson(prev => ({ ...prev, [personNum]: m }))}
                              className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                                paymentMethodPerPerson[personNum] === m
                                  ? 'bg-slate-700 text-white'
                                  : 'bg-slate-950 text-slate-400'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePayPerson(personNum)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Bayar Bagian {personNum}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
