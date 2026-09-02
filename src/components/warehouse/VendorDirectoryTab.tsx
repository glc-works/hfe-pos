import React, { useState } from 'react'
import { Building2, Phone, Mail, FileText, Plus, CheckCircle2, Clock, Truck, DollarSign, PackageCheck } from 'lucide-react'

export interface VendorItem {
  id: string
  name: string
  category: 'coffee_beans' | 'dairy' | 'syrup_flavour' | 'packaging' | 'machinery'
  picName: string
  phone: string
  email: string
  bankName: string
  bankAccount: string
  paymentTerms: 'COD' | 'Net 14' | 'Net 30' | 'Net 60'
  rating: number
  outstandingPayables: number
}

export interface PurchaseOrderRecord {
  poNumber: string
  vendorId: string
  vendorName: string
  date: string
  items: Array<{ itemName: string; qty: number; unit: string; pricePerUnit: number }>
  totalAmount: number
  status: 'DRAFT' | 'SENT' | 'PARTIALLY_RECEIVED' | 'COMPLETED'
  expectedDelivery: string
}

interface VendorDirectoryTabProps {
  onOpenReceivingModal?: (po?: PurchaseOrderRecord) => void
}

export const VendorDirectoryTab: React.FC<VendorDirectoryTabProps> = ({ onOpenReceivingModal }) => {
  const [vendors, setVendors] = useState<VendorItem[]>([
    {
      id: 'VEND-01',
      name: 'PT Nusantara Roastery Abadi',
      category: 'coffee_beans',
      picName: 'Hendra Setiawan',
      phone: '+62 812-3456-7890',
      email: 'sales@nusantararoastery.co.id',
      bankName: 'BCA',
      bankAccount: '8830-1928-33',
      paymentTerms: 'Net 30',
      rating: 4.9,
      outstandingPayables: 12500000,
    },
    {
      id: 'VEND-02',
      name: 'CV Greenfield Dairy Fresh',
      category: 'dairy',
      picName: 'Siti Rahma',
      phone: '+62 813-9876-5432',
      email: 'order@greenfieldfresh.com',
      bankName: 'Mandiri',
      bankAccount: '1420-0012-9988',
      paymentTerms: 'Net 14',
      rating: 4.8,
      outstandingPayables: 4500000,
    },
    {
      id: 'VEND-03',
      name: 'PT Eco Packaging Indonesia',
      category: 'packaging',
      picName: 'Bambang Tri',
      phone: '+62 821-4567-8901',
      email: 'bambang@ecopack.id',
      bankName: 'BCA',
      bankAccount: '0089-2311-45',
      paymentTerms: 'COD',
      rating: 4.7,
      outstandingPayables: 0,
    },
  ])

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([
    {
      poNumber: 'PO-20260829-001',
      vendorId: 'VEND-01',
      vendorName: 'PT Nusantara Roastery Abadi',
      date: '2026-08-29',
      items: [
        { itemName: 'Biji Kopi House Blend Arabica', qty: 25, unit: 'kg', pricePerUnit: 180000 },
        { itemName: 'Single Origin Gayo Honey', qty: 10, unit: 'kg', pricePerUnit: 240000 },
      ],
      totalAmount: 6900000,
      status: 'SENT',
      expectedDelivery: '2026-08-30',
    },
    {
      poNumber: 'PO-20260828-004',
      vendorId: 'VEND-02',
      vendorName: 'CV Greenfield Dairy Fresh',
      date: '2026-08-28',
      items: [
        { itemName: 'Fresh Milk Pasteurisasi 1L', qty: 60, unit: 'Liter', pricePerUnit: 19500 },
        { itemName: 'Oat Milk Barista Edition 1L', qty: 24, unit: 'Liter', pricePerUnit: 38000 },
      ],
      totalAmount: 2082000,
      status: 'PARTIALLY_RECEIVED',
      expectedDelivery: '2026-08-29',
    },
  ])

  const [showNewPoModal, setShowNewPoModal] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || '')
  const [newPoItemName, setNewPoItemName] = useState('Biji Kopi House Blend Arabica')
  const [newPoQty, setNewPoQty] = useState(20)
  const [newPoPrice, setNewPoPrice] = useState(180000)

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault()
    const matchedVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0]
    const newPo: PurchaseOrderRecord = {
      poNumber: `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-3)}`,
      vendorId: matchedVendor.id,
      vendorName: matchedVendor.name,
      date: new Date().toISOString().slice(0, 10),
      items: [{ itemName: newPoItemName, qty: Number(newPoQty), unit: 'kg/Liter', pricePerUnit: Number(newPoPrice) }],
      totalAmount: Number(newPoQty) * Number(newPoPrice),
      status: 'SENT',
      expectedDelivery: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    }
    setPurchaseOrders(prev => [newPo, ...prev])
    setShowNewPoModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Vendor Payables Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-3 shadow-xs">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Total Vendor Terdaftar</span>
            <span className="font-mono font-bold text-lg text-foreground">{vendors.length} Rekanan</span>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-3 shadow-xs">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Total Utang Usaha (AP Tempo)</span>
            <span className="font-mono font-bold text-lg text-rose-500">
              Rp {vendors.reduce((s, v) => s + v.outstandingPayables, 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center gap-3 shadow-xs">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Purchase Order Aktif</span>
            <span className="font-mono font-bold text-lg text-foreground">
              {purchaseOrders.filter(p => p.status !== 'COMPLETED').length} Pengiriman
            </span>
          </div>
        </div>
      </div>

      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
        <div>
          <h3 className="text-base font-bold text-foreground">Direktori Vendor & Rekanan Pemasok</h3>
          <p className="text-xs text-muted-foreground">Katalog supplier biji kopi, susu, kemasan & pembuatan Purchase Order</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewPoModal(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Buat Purchase Order (PO)
          </button>
          {onOpenReceivingModal && (
            <button
              type="button"
              onClick={() => onOpenReceivingModal()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" /> Terima Barang (GRN)
            </button>
          )}
        </div>
      </div>

      {/* Master Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <div key={v.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-all shadow-xs">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{v.name}</h4>
                  <span className="text-[10px] text-muted-foreground font-mono">{v.id}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {v.paymentTerms}
                </span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{v.phone} ({v.picName})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{v.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bank {v.bankName} - {v.bankAccount}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-2.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">Sisa Utang Tempo:</span>
              <span className={`font-mono font-bold ${v.outstandingPayables > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                Rp {v.outstandingPayables.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Purchase Orders Table */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" /> Riwayat Purchase Order & Pengiriman Vendor
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-[11px]">
                <th className="pb-2">No. PO / Tanggal</th>
                <th className="pb-2">Vendor Pemasok</th>
                <th className="pb-2">Rincian Bahan Baku</th>
                <th className="pb-2 text-right">Total Nominal</th>
                <th className="pb-2 text-center">Status</th>
                <th className="pb-2 text-right">Aksi GRN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {purchaseOrders.map((po) => (
                <tr key={po.poNumber} className="hover:bg-muted/30">
                  <td className="py-2.5">
                    <span className="font-mono font-bold text-foreground block">{po.poNumber}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{po.date}</span>
                  </td>
                  <td className="py-2.5 font-medium text-foreground">{po.vendorName}</td>
                  <td className="py-2.5 text-muted-foreground">
                    {po.items.map((i, idx) => (
                      <div key={idx}>• {i.itemName} ({i.qty} {i.unit})</div>
                    ))}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-foreground">
                    Rp {po.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      po.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : po.status === 'PARTIALLY_RECEIVED'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {po.status === 'COMPLETED' ? '✓ Diterima Lengkap' : po.status === 'PARTIALLY_RECEIVED' ? 'Diterima Sebagian' : 'Dikirim Supplier'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    {onOpenReceivingModal && po.status !== 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => onOpenReceivingModal(po)}
                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Terima GRN
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Order Modal */}
      {showNewPoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-foreground border border-border rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono text-[10px] font-bold">
                  FORM-LOG-02
                </span>
                <h4 className="text-sm font-bold text-foreground">Purchase Order (PO) Baru</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPoModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePo} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Pilih Vendor Pemasok</label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-semibold focus:outline-none focus:border-amber-500"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.paymentTerms})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-muted-foreground mb-1">Nama Item Bahan Baku</label>
                <input
                  type="text"
                  value={newPoItemName}
                  onChange={(e) => setNewPoItemName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1">Jumlah (Qty)</label>
                  <input
                    type="number"
                    value={newPoQty}
                    onChange={(e) => setNewPoQty(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Harga Beli / Satuan (Rp)</label>
                  <input
                    type="number"
                    value={newPoPrice}
                    onChange={(e) => setNewPoPrice(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 font-mono font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="bg-muted/40 p-3 rounded-xl flex items-center justify-between font-mono font-bold">
                <span className="text-muted-foreground text-[11px]">Total Estimasi PO:</span>
                <span className="text-emerald-500 text-sm">Rp {(newPoQty * newPoPrice).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPoModal(false)}
                  className="flex-1 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold cursor-pointer shadow-md"
                >
                  Terbitkan PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
