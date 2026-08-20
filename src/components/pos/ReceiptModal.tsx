import React from 'react'
import { X, Printer, Send, CheckCircle2, Share2 } from 'lucide-react'
import { ReceiptData, formatThermalReceiptText } from '../../services/receiptPrinter'
import { ThermalPrinterService } from '../../services/hardware/ThermalPrinterService'

export interface ReceiptModalProps {
  show: boolean
  onClose: () => void
  receiptData: ReceiptData | null
  onSendWhatsAppReceipt?: (phone: string) => void
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  show,
  onClose,
  receiptData,
  onSendWhatsAppReceipt
}) => {
  if (!show || !receiptData) return null

  const receiptText = formatThermalReceiptText(receiptData)

  const handlePrintPhysical = async () => {
    try {
      const printer = ThermalPrinterService.getInstance()
      await printer.printReceipt({
        storeName: receiptData.storeName || 'Kopi Nusantara Senopati',
        address: receiptData.storeAddress,
        receiptNumber: receiptData.receiptNo,
        tableName: receiptData.tableNo,
        queueNumber: receiptData.queueNo,
        orderType: receiptData.orderType,
        cashierName: receiptData.cashierName || 'Kasir',
        timestamp: receiptData.timestamp,
        items: receiptData.items.map((i) => ({
          name: i.name,
          qty: i.qty,
          price: i.price,
          total: i.price * i.qty
        })),
        subtotal: receiptData.subtotal,
        taxPb1: receiptData.pb1Tax,
        serviceFee: receiptData.serviceCharge,
        packagingFee: receiptData.packagingFee,
        total: receiptData.grandTotal,
        paymentMethod: receiptData.paymentMethod || 'cash',
        amountTendered: receiptData.cashGiven,
        changeDue: receiptData.changeReturned,
        glPostingId: receiptData.glPostingId,
        transactionRef: receiptData.transactionRef,
        sha256Hash: receiptData.sha256Hash
      })
    } catch {
      window.print()
    }
  }

  const handleWaShare = () => {
    const defaultPhone = '6281298765432'
    if (onSendWhatsAppReceipt) {
      onSendWhatsAppReceipt(defaultPhone)
    } else {
      const waMsg = encodeURIComponent(`*STRUK PELUNASAN DIGITAL*\n${receiptText}`)
      window.open(`https://wa.me/${defaultPhone}?text=${waMsg}`, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Struk Pelunasan Pembayaran</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PRINTER RECEIPT PREVIEW (58mm / 80mm Thermal Layout) */}
        <div className="bg-white text-slate-950 font-mono text-[11px] p-4 rounded-2xl border border-slate-300 shadow-inner overflow-y-auto max-h-80 select-all leading-tight">
          <pre className="whitespace-pre-wrap font-mono">{receiptText}</pre>
        </div>

        {/* BUTTON ACTIONS */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleWaShare}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4 text-emerald-400" /> Kirim Struk WA
          </button>
          <button
            type="button"
            onClick={handlePrintPhysical}
            className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Printer className="w-4 h-4" /> Cetak Thermal (ESC/POS)
          </button>
        </div>
      </div>
    </div>
  )
}
