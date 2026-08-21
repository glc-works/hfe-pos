import React, { useState } from 'react'
import { Card, Button, Badge } from '../../ui'
import { Calendar, Download, ShieldCheck, CheckCircle2, FileSpreadsheet, Building2 } from 'lucide-react'

export function TaxComplianceTab() {
  const [selectedMonth, setSelectedMonth] = useState('2026-07')
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  // Tax statistics
  const taxStats = {
    grossSalesTaxable: 145200000,
    pb1TaxRate: 10, // 10% PB1
    pb1Payable: 14520000,
    totalInvoices: 2840,
    dueDate: '15 Agustus 2026',
    daysRemaining: 6,
    status: 'ready_to_file',
  }

  const handleExportCsv = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2500)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Pajak Restoran Daerah (PB1 / PBJT 10%) & Bapenda
          </h3>
          <p className="text-xs text-muted-foreground">
            Otomasi rekapitulasi Pajak Barang dan Jasa Tertentu (PBJT) 10% untuk pelaporan resmi Bapenda Pemda
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleExportCsv} 
            className="text-xs font-bold"
            disabled={isExporting}
          >
            {exportSuccess ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Berkas CSV Bapenda Diunduh!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Unduh Format Resmi CSV Bapenda
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <Card className="p-5 border-primary/30 bg-primary/5">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-primary">Kewajiban Setor PB1 10%</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              Juli 2026
            </Badge>
          </div>
          <div className="text-2xl font-bold text-foreground tabular-nums my-1">
            Rp {taxStats.pb1Payable.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-sans text-muted-foreground mt-2 pt-2 border-t border-border/50">
            Dari Dasar Pengenaan Pajak (DPP): Rp {taxStats.grossSalesTaxable.toLocaleString('id-ID')}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Jatuh Tempo Pelaporan
            </span>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
              Tgl 15 Tiap Bulan
            </Badge>
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums my-1">
            {taxStats.dueDate}
          </div>
          <div className="text-[11px] font-sans text-amber-400 mt-2 pt-2 border-t border-border/50">
            ⏳ {taxStats.daysRemaining} Hari tersisa sebelum batas akhir
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Status Kepatuhan (Compliance)
            </span>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
              100% Valid
            </Badge>
          </div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums my-1">
            Siap Dilaporkan
          </div>
          <div className="text-[11px] font-sans text-muted-foreground mt-2 pt-2 border-t border-border/50">
            {taxStats.totalInvoices.toLocaleString('id-ID')} Struk tercatat di <code>GL 2102</code>
          </div>
        </Card>
      </div>

      {/* CSV Export & Audit Lineage Information */}
      <Card className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-foreground">
              Ekspor Laporan Resmi Pajak Daerah Bapenda (Standard Pemda DKI / Jabar / Bali)
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Berkas CSV yang diunduh mencakup kolom resmi yang diwajibkan oleh Badan Pendapatan Daerah (Bapenda): 
              <code>Nomor Struk Kasir</code>, <code>Waktu Transaksi</code>, <code>Nominal Penjualan Makanan/Minuman</code>, <code>DPP</code>, <code>Pajak PB1 10%</code>, dan <code>Metode Pembayaran (QRIS/Kas/Kartu)</code>.
            </p>
            <div className="pt-2 flex gap-3">
              <Button size="sm" variant="outline" onClick={handleExportCsv} className="text-xs font-semibold">
                <Download className="w-3.5 h-3.5 mr-1" /> Unduh CSV (Juli 2026)
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportCsv} className="text-xs font-semibold">
                <Download className="w-3.5 h-3.5 mr-1" /> Unduh CSV (Juni 2026)
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
