import React, { useState } from 'react'
import { X, Printer, Send, FileText, CheckCircle2 } from 'lucide-react'
import { OrderTicket, HfeCompanyProfile } from '../../types/pos'
import { formatReceiptText, ReceiptData, generateEscPosBuffer } from '../../utils/escPosDriver'
import { sendDigitalReceipt } from '../../services/hfeWorkflowsApi'

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  order?: OrderTicket | null
  companyProfile?: HfeCompanyProfile | null
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  companyProfile,
}) => {
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('58mm')
  const [customerPhone, setCustomerPhone] = useState<string>('6281299887766')
  const [isSendingWa, setIsSendingWa] = useState<boolean>(false)
  const [waSentSuccess, setWaSentSuccess] = useState<boolean>(false)

  if (!isOpen) return null

  const receiptData: ReceiptData = {
    companyName: companyProfile?.brandName || 'KOPITIAM SENOPATI HQ',
    address: companyProfile?.address || 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
    npwp: companyProfile?.taxIdNpwp || '01.234.567.8-012.000',
    cashierName: 'Siti (Kasir)',
    orderId: order?.id || 'ORD-8801',
    dateStr: new Date().toLocaleDateString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    items: order?.items?.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })) || [
      { name: 'Kopi Susu Gula Aren (Iced)', quantity: 2, price: 28000 },
      { name: 'Croissant Butter Fresh', quantity: 1, price: 32000 },
    ],
    subtotal: order?.total ? Math.round(order.total * 0.85) : 74783,
    serviceFee: order?.serviceFeeAmount || 4400,
    pb1Tax: order?.taxPB1Amount || 8800,
    grandTotal: order?.total || 88000,
    paymentMethod: 'QRIS Statis',
    qrisRef: 'ID1020304050607',
  }

  const formattedReceiptText = formatReceiptText(receiptData, paperWidth)

  const handlePrintThermal = () => {
    const buffer = generateEscPosBuffer(receiptData, paperWidth)
    console.info('[ReceiptModal] ESC/POS buffer generated:', buffer.byteLength, 'bytes')
    window.print()
  }

  const handleSendWa = async () => {
    setIsSendingWa(true)
    try {
      const res = await sendDigitalReceipt(receiptData.orderId, customerPhone)
      if (res.waUrl) {
        window.open(res.waUrl, '_blank')
        setWaSentSuccess(true)
      }
    } catch (err) {
      console.error('Send WA receipt error:', err)
    } finally {
      setIsSendingWa(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 pr-8">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Struk Thermal ESC/POS & Struk WA</h3>
            <p className="text-xs text-slate-400">Preview cetak 58mm/80mm & struk digital WhatsApp</p>
          </div>
        </div>

        {/* PAPER WIDTH TOGGLE */}
        <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setPaperWidth('58mm')}
            className={`py-1.5 rounded-lg transition-all ${
              paperWidth === '58mm' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thermal 58mm (32 Karakter)
          </button>
          <button
            onClick={() => setPaperWidth('80mm')}
            className={`py-1.5 rounded-lg transition-all ${
              paperWidth === '80mm' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thermal 80mm (48 Karakter)
          </button>
        </div>

        {/* THERMAL PREVIEW CANVAS */}
        <div className="bg-amber-50/95 text-slate-950 font-mono text-[11px] leading-tight p-4 rounded-2xl border-2 border-amber-200 shadow-inner overflow-x-auto whitespace-pre">
          {formattedReceiptText}
        </div>

        {/* DIGITAL WA RECEIPT FORM */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2">
          <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Kirim Struk Digital via WhatsApp:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="62812xxxxxxx"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSendWa}
              disabled={isSendingWa || !customerPhone}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-3 rounded-xl shadow transition-all"
            >
              {isSendingWa ? 'Sending...' : 'Kirim WA'}
            </button>
          </div>
          {waSentSuccess && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Link Struk Terkirim ke WA!
            </span>
          )}
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={handlePrintThermal}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
        >
          <Printer className="w-4 h-4" /> Cetak Struk Thermal ({paperWidth})
        </button>
      </div>
    </div>
  )
}
