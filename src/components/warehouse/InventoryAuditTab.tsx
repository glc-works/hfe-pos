import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { ReceivingRecord, WasteRecord } from '../../hooks/useWarehouse'

export interface InventoryAuditTabProps {
  receivingLogs: ReceivingRecord[]
  wasteAdjustments: WasteRecord[]
}

export const InventoryAuditTab: React.FC<InventoryAuditTabProps> = ({
  receivingLogs,
  wasteAdjustments,
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Riwayat Penerimaan Surat Jalan (GRN) */}
      <div>
        <h4 className="text-xs font-bold text-foreground mb-2">Riwayat Penerimaan Surat Jalan (GRN)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                <th className="py-2.5 px-3">No. Penerimaan</th>
                <th className="py-2.5 px-3">Item & SKU</th>
                <th className="py-2.5 px-3">Referensi PO / Surat Jalan</th>
                <th className="py-2.5 px-3 text-center">Batch / Exp</th>
                <th className="py-2.5 px-3 text-center">Qty Diterima</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {receivingLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-500">{log.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-foreground">{log.itemCode}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{log.supplierPoNumber}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-[11px] text-muted-foreground">
                    {log.batchNumber || '-'} / {log.expiryDate || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-foreground">{log.qty} Unit</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  </td>
                </tr>
              ))}
              {receivingLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground text-xs">
                    Belum ada riwayat penerimaan barang.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Jurnal Penyesuaian Kerusakan / Waste */}
      <div>
        <h4 className="text-xs font-bold text-foreground mb-2">Jurnal Penyesuaian Kerusakan / Waste</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                <th className="py-2.5 px-3">ID Jurnal Waste</th>
                <th className="py-2.5 px-3">Item & SKU</th>
                <th className="py-2.5 px-3">Alasan Kerusakan</th>
                <th className="py-2.5 px-3">Akun Beban GL</th>
                <th className="py-2.5 px-3 text-center">Qty Rusak</th>
                <th className="py-2.5 px-3 text-right">Status GL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {wasteAdjustments.map((w) => (
                <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-rose-500">{w.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-foreground">{w.itemCode}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{w.reason}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">{w.expenseGlAccount}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-rose-500">{w.qty} Unit</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Posted di GL
                    </span>
                  </td>
                </tr>
              ))}
              {wasteAdjustments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground text-xs">
                    Belum ada penyesuaian waste.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
