import React, { useState } from 'react'
import {
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  PackageCheck,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react'
import { TransferRecord } from '../../hooks/useWarehouse'

export interface LogisticsPipelineTabProps {
  currentWarehouseId: string
  transferRequests: TransferRecord[]
  onOpenReceivingModal?: (prefill?: any) => void
  onOpenTransferModal?: () => void
}

interface InboundDeliveryItem {
  id: string
  trackingNo: string
  sourceType: 'vendor' | 'branch'
  sourceName: string
  destinationWarehouse: string
  itemsSummary: string
  totalQty: number
  unit: string
  estimatedArrival: string
  status: 'ordered' | 'in_transit' | 'arrived' | 'completed'
  valuationIdr: number
  driverOrCourier?: string
  poRef?: string
}

export const LogisticsPipelineTab: React.FC<LogisticsPipelineTabProps> = ({
  currentWarehouseId,
  transferRequests,
  onOpenReceivingModal,
  onOpenTransferModal,
}) => {
  const [pipelineView, setPipelineView] = useState<'inbound' | 'outbound'>('inbound')

  // Mock Inbound Shipments (Supplier POs & Inbound Branch Transfers)
  const mockInboundDeliveries: InboundDeliveryItem[] = [
    {
      id: 'INB-20260829-01',
      trackingNo: 'DO-SUPP-8821',
      sourceType: 'vendor',
      sourceName: 'PT Nusantara Roastery Abadi',
      destinationWarehouse: 'Gudang Pusat HQ (Cikini)',
      itemsSummary: 'Bijikopi House Blend Arabica 1kg',
      totalQty: 25,
      unit: 'Kg',
      estimatedArrival: 'Hari Ini, 14:00 WIB',
      status: 'in_transit',
      valuationIdr: 4625000,
      driverOrCourier: 'Kurir Internal Vendor (B 9821 TPA)',
      poRef: 'PO-20260829-01',
    },
    {
      id: 'INB-20260829-02',
      trackingNo: 'DO-SUPP-9012',
      sourceType: 'vendor',
      sourceName: 'CV Dairy Fresh Sejahtera',
      destinationWarehouse: 'Gudang Pusat HQ (Cikini)',
      itemsSummary: 'Oat Milk Barista Edition 1L',
      totalQty: 15,
      unit: 'Kartus',
      estimatedArrival: 'Besok Pagi, 09:30 WIB',
      status: 'ordered',
      valuationIdr: 630000,
      driverOrCourier: 'Ekspedisi Pending',
      poRef: 'PO-20260829-02',
    },
    {
      id: 'INB-20260829-03',
      trackingNo: 'SJ-TRF-0911',
      sourceType: 'branch',
      sourceName: 'Cabang Senopati Store',
      destinationWarehouse: 'Gudang Pusat HQ (Cikini)',
      itemsSummary: 'Paper Cup Cold 16oz (Pack 50s)',
      totalQty: 10,
      unit: 'Pack',
      estimatedArrival: 'Tiba 30 mnt lalu',
      status: 'arrived',
      valuationIdr: 350000,
      driverOrCourier: 'Motor Kurir Toko',
    },
  ]

  const formatIdr = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  const totalInTransitValue = mockInboundDeliveries
    .filter((d) => d.status === 'in_transit' || d.status === 'arrived')
    .reduce((sum, d) => sum + d.valuationIdr, 0)

  return (
    <div className="space-y-4">
      {/* Top Controls: Inbound vs Outbound Toggle & Metrics */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setPipelineView('inbound')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              pipelineView === 'inbound'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>📥 Barang Masuk / Inbound ({mockInboundDeliveries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setPipelineView('outbound')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              pipelineView === 'outbound'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>📤 Pengiriman Keluar / Outbound ({transferRequests.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-muted-foreground block font-semibold">Estimasi Nilai Barang di Jalan:</span>
            <span className="font-mono font-black text-amber-500 text-sm">{formatIdr(totalInTransitValue)}</span>
          </div>
          {pipelineView === 'inbound' ? (
            <button
              type="button"
              onClick={() => onOpenReceivingModal && onOpenReceivingModal()}
              className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              <span>[FORM-LOG-01] Terima Barang Baru</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenTransferModal && onOpenTransferModal()}
              className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>[FORM-LOG-03] Kirim Transfer Cabang</span>
            </button>
          )}
        </div>
      </div>

      {/* PIPELINE VIEW 1: INBOUND GOODS & DELIVERY ARRIVALS */}
      {pipelineView === 'inbound' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stage 1: Dipesan ke Vendor / Cabang */}
          <div className="bg-card/60 rounded-2xl border border-border p-3.5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <h4 className="text-xs font-bold text-foreground">1. Dipesan / Menunggu Kirim</h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-muted-foreground">
                {mockInboundDeliveries.filter((d) => d.status === 'ordered').length} Pesanan
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[520px] custom-scrollbar">
              {mockInboundDeliveries
                .filter((d) => d.status === 'ordered')
                .map((item) => (
                  <div key={item.id} className="bg-background border border-border p-3 rounded-xl space-y-2 hover:border-border/80 transition-all">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-amber-500">{item.trackingNo}</span>
                      <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium">
                        {item.sourceType === 'vendor' ? '🏢 Vendor PO' : '🔄 Transfer'}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground leading-snug">{item.itemsSummary}</h5>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" /> {item.sourceName}
                      </p>
                    </div>
                    <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                      <span className="font-mono font-semibold text-foreground">
                        {item.totalQty} {item.unit}
                      </span>
                      <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {item.estimatedArrival}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Stage 2: Dalam Pengiriman (In-Transit OTW) */}
          <div className="bg-card/60 rounded-2xl border border-border p-3.5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h4 className="text-xs font-bold text-foreground">2. Dalam Perjalanan (In-Transit)</h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-500">
                {mockInboundDeliveries.filter((d) => d.status === 'in_transit').length} Armada
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[520px] custom-scrollbar">
              {mockInboundDeliveries
                .filter((d) => d.status === 'in_transit')
                .map((item) => (
                  <div key={item.id} className="bg-background border border-amber-500/40 p-3.5 rounded-xl space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-amber-500">{item.trackingNo}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold">
                        OTW Menuju Gudang
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground leading-snug">{item.itemsSummary}</h5>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Truck className="w-3 h-3 text-amber-500" /> {item.driverOrCourier}
                      </p>
                    </div>
                    <div className="bg-muted/60 p-2 rounded-lg text-[11px] flex items-center justify-between">
                      <div>
                        <span className="text-muted-foreground text-[10px] block">Jumlah Muatan:</span>
                        <span className="font-mono font-bold text-foreground">{item.totalQty} {item.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground text-[10px] block">Estimasi Tiba:</span>
                        <span className="font-semibold text-amber-500 text-[11px]">{item.estimatedArrival}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenReceivingModal && onOpenReceivingModal({
                        poNumber: item.poRef || item.trackingNo,
                        vendorName: item.sourceName,
                        itemSku: 'ING-CF-BEANS-01',
                        qtyOrdered: item.totalQty,
                      })}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Terima Barang (Verifikasi GRN) ➔</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Stage 3: Selesai Diterima & Verifikasi Fisik */}
          <div className="bg-card/60 rounded-2xl border border-border p-3.5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h4 className="text-xs font-bold text-foreground">3. Tiba di Lokasi / Baru Masuk</h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-500">
                {mockInboundDeliveries.filter((d) => d.status === 'arrived' || d.status === 'completed').length} Selesai
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[520px] custom-scrollbar">
              {mockInboundDeliveries
                .filter((d) => d.status === 'arrived')
                .map((item) => (
                  <div key={item.id} className="bg-background border border-emerald-500/30 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-emerald-500">{item.trackingNo}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                        ✓ Fisik Tiba
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground leading-snug">{item.itemsSummary}</h5>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-500" /> {item.destinationWarehouse}
                      </p>
                    </div>
                    <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-foreground">
                        {item.totalQty} {item.unit} ({formatIdr(item.valuationIdr)})
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        Stok Bertambah
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* PIPELINE VIEW 2: OUTBOUND BRANCH DISPATCHES */}
      {pipelineView === 'outbound' && (
        <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">Pengiriman Barang Keluar ke Cabang</h4>
              <p className="text-xs text-muted-foreground">Monitoring surat jalan transfer dan status armada pengiriman</p>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              Total {transferRequests.length} Surat Jalan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-3">No. Surat Jalan</th>
                  <th className="pb-3">Item / SKU</th>
                  <th className="pb-3">Gudang Asal</th>
                  <th className="pb-3">Tujuan Cabang</th>
                  <th className="pb-3 text-center">Jumlah</th>
                  <th className="pb-3 text-center">Status Armada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {transferRequests.map((tr) => (
                  <tr key={tr.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-blue-500">{tr.id}</td>
                    <td className="py-3 font-semibold text-foreground">{tr.itemCode}</td>
                    <td className="py-3 text-muted-foreground">{tr.sourceWarehouseId}</td>
                    <td className="py-3 font-medium text-foreground">{tr.destinationWarehouseId}</td>
                    <td className="py-3 text-center font-mono font-bold">{tr.qty} Unit</td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          tr.status === 'in_transit'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}
                      >
                        {tr.status === 'in_transit' ? '🚚 Sedang Dikirim' : '✓ Diterima'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
