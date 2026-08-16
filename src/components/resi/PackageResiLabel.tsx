import React from 'react'
import { QrCode, Printer, CheckSquare, MapPin, Phone, User, Package, Truck } from 'lucide-react'

export interface ResiLabelData {
  resiCode: string
  orderId: string
  storeName: string
  recipientName: string
  phone: string
  address: string
  unitNotes?: string
  runnerName: string
  items: Array<{ name: string; quantity: number }>
  createdAt: string
}

export function generateAwbResiCode(
  storeSlug: string = 'SENOPATI',
  dateObj: Date = new Date(),
  seq: number = 42
): string {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  const seqStr = String(seq).padStart(4, '0')
  return `RESI-${storeSlug.toUpperCase()}-${dateStr}-${seqStr}`
}

interface PackageResiLabelProps {
  labelData?: ResiLabelData
  onClose?: () => void
}

const DEFAULT_LABEL_DATA: ResiLabelData = {
  resiCode: 'RESI-SENOPATI-20260815-0042',
  orderId: 'ORD-8801',
  storeName: 'Kopitiam Senopati HQ',
  recipientName: 'Bambang Tri',
  phone: '6281299887766',
  address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
  unitNotes: 'Lantai 3, Unit 302',
  runnerName: 'Budi Santoso (Runner Toko)',
  items: [
    { name: 'Kopi Susu Gula Aren (Iced)', quantity: 2 },
    { name: 'Croissant Butter Fresh', quantity: 1 },
  ],
  createdAt: new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }),
}

export const PackageResiLabel: React.FC<PackageResiLabelProps> = ({
  labelData = DEFAULT_LABEL_DATA,
  onClose,
}) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-4 text-slate-100">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
            {labelData.storeName}
          </span>
        </div>
        <button
          onClick={handlePrint}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 shadow"
        >
          <Printer className="w-3.5 h-3.5" /> Cetak Resi
        </button>
      </div>

      {/* AWB RESI CODE & QR BOX */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
        <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center border border-slate-700">
          <QrCode className="w-20 h-20 text-slate-950" />
        </div>
        <span className="font-mono font-bold text-base text-amber-400 tracking-wider">
          {labelData.resiCode}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          REF ORDER: {labelData.orderId} • {labelData.createdAt}
        </span>
      </div>

      {/* RECIPIENT DETAILS */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
          <span className="text-slate-400 text-[10px] font-bold uppercase">Penerima Paket</span>
          <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
            <Phone className="w-3 h-3" /> {labelData.phone}
          </span>
        </div>
        <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
          <User className="w-4 h-4 text-indigo-400" /> {labelData.recipientName}
        </h4>
        <p className="text-slate-300 text-xs flex items-start gap-1">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          {labelData.address} {labelData.unitNotes ? `(${labelData.unitNotes})` : ''}
        </p>
      </div>

      {/* PACKING CHECKLIST */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2 text-xs">
        <span className="text-amber-400 text-[10px] font-bold uppercase flex items-center gap-1">
          <CheckSquare className="w-3.5 h-3.5" /> Packing Checklist Dapur
        </span>
        {labelData.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-850 pb-1">
            <span className="text-slate-200">
              [ ] {item.name}
            </span>
            <span className="font-mono font-bold text-amber-400">x{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* RUNNER ASSIGNMENT */}
      <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl text-xs text-indigo-300">
        <span className="flex items-center gap-1.5 font-bold">
          <Truck className="w-4 h-4 text-indigo-400" /> Kurir Assigned:
        </span>
        <span className="font-semibold text-white">{labelData.runnerName}</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-xl"
        >
          Tutup Label Resi
        </button>
      )}
    </div>
  )
}
