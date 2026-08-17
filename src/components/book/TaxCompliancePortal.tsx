import React, { useState } from 'react'
import {
  ShieldCheck,
  FileCode,
  Download,
  Copy,
  Check,
  Building2,
  Receipt,
  CheckCircle2,
  Landmark
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  PriceTag
} from '@/ui'

export interface TaxCompliancePortalProps {
  obligations?: any
  companyName?: string
  npwp?: string
  taxPeriodLabel?: string
  isBatamFtzOutlet?: boolean
}

export const TaxCompliancePortal: React.FC<TaxCompliancePortalProps> = ({
  companyName = 'PT Kopi Nusantara Abadi',
  npwp = '01.2026.889.2.100.000',
  taxPeriodLabel = 'Agustus 2026',
  isBatamFtzOutlet = false
}) => {
  const [ppnRate, setPpnRate] = useState<11 | 12>(11)
  const [isFtzActive, setIsFtzActive] = useState<boolean>(isBatamFtzOutlet)
  const [activeTab, setActiveTab] = useState<'ppn' | 'ftz' | 'efaktur' | 'withholding'>('ppn')
  const [copiedCode, setCopiedCode] = useState<boolean>(false)

  const taxableDppSales = 188700000
  const taxableDppPurchases = 84200000

  const ppnOutput = isFtzActive ? 0 : (taxableDppSales * ppnRate) / 100
  const ppnInput = isFtzActive ? 0 : (taxableDppPurchases * ppnRate) / 100
  const ppnPayable = ppnOutput - ppnInput

  const pb1Dpp = 188700000
  const pb1Tax = (pb1Dpp * 10) / 100

  const withholdingList = [
    { id: 'pph21', name: 'PPh 21 (Gaji Karyawan & Barista)', dpp: 34500000, rate: 'Tarif Efektif TER', taxAmount: 1450000, status: 'Siap Setor e-Billing' },
    { id: 'pph23', name: 'PPh 23 (Jasa Maintenance Mesin)', dpp: 4500000, rate: '2.0%', taxAmount: 90000, status: 'Siap Setor e-Billing' },
    { id: 'pph4_2', name: 'PPh Final 4(2) (Sewa Ruko Outlet)', dpp: 18000000, rate: '10.0%', taxAmount: 1800000, status: 'Sudah Dipotong Pemilik' },
  ]
  const totalWithholding = withholdingList.reduce((acc, item) => acc + item.taxAmount, 0)

  const simulatedXml = `<?xml version="1.0" encoding="UTF-8"?>
<resValidateFakturPm xmlns="http://svc.djp.id">
  <kdJenisTransaksi>01</kdJenisTransaksi>
  <fgPengganti>0</fgPengganti>
  <nomorFaktur>010.002-26.00084920</nomorFaktur>
  <tanggalFaktur>17/08/2026</tanggalFaktur>
  <npwpPenjual>${npwp.replace(/[^0-9]/g, '')}</npwpPenjual>
  <namaPenjual>${companyName}</namaPenjual>
  <jumlahDpp>${taxableDppSales}</jumlahDpp>
  <jumlahPpn>${ppnOutput}</jumlahPpn>
  <statusFaktur>VALID_DJP_APPROVED</statusFaktur>
</resValidateFakturPm>`

  const handleCopyXml = () => {
    navigator.clipboard.writeText(simulatedXml)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleDownloadCsv = () => {
    const csv = `FK,KD_JENIS_TRANSAKSI,FG_PENGGANTI,NOMOR_FAKTUR,MASA_PAJAK,TAHUN_PAJAK,TANGGAL_FAKTUR,NPWP,NAMA,JUMLAH_DPP,JUMLAH_PPN\nFK,01,0,0100022600084920,08,2026,17/08/2026,${npwp.replace(/[^0-9]/g, '')},${companyName},${taxableDppSales},${ppnOutput}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `EFAKTUR_DJP_${taxPeriodLabel.replace(/\s+/g, '_')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Portal Kepatuhan Pajak (Tax Portal & e-Faktur)
            </h2>
            {isFtzActive ? (
              <Badge variant="indigo">Kawasan Bebas Batam FTZ (0% PPN)</Badge>
            ) : (
              <Badge variant="emerald">PKP Terdaftar • PPN {ppnRate}%</Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>{companyName}</span>
            <span>•</span>
            <span className="font-mono text-slate-300">NPWP: {npwp}</span>
            <span>•</span>
            <span>Masa: {taxPeriodLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={isFtzActive ? 'default' : 'outline'} size="sm" className="text-xs" onClick={() => setIsFtzActive(!isFtzActive)}>
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            {isFtzActive ? 'Mode FTZ Batam Aktif' : 'Simulasi FTZ Batam (0%)'}
          </Button>
          <Button variant="default" size="sm" className="gap-1.5" onClick={handleDownloadCsv}>
            <Download className="w-3.5 h-3.5" /> Export e-Faktur CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {(['ppn', 'ftz', 'efaktur', 'withholding'] as const).map(tab => (
          <Button key={tab} variant={activeTab === tab ? 'default' : 'ghost'} size="sm" className="h-8 text-xs capitalize" onClick={() => setActiveTab(tab)}>
            {tab === 'ppn' ? 'PPN & PB1 Daerah' : tab === 'ftz' ? 'Insentif FTZ Batam (0%)' : tab === 'efaktur' ? 'Simulator e-Faktur DJP' : 'Withholding Tax (PPh)'}
          </Button>
        ))}
      </div>

      {activeTab === 'ppn' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Pajak Keluaran (Output Tax)</span>
                <div className="flex items-center gap-1">
                  <Button variant={ppnRate === 11 ? 'default' : 'ghost'} size="sm" className="h-6 px-1.5 text-[10px]" onClick={() => setPpnRate(11)}>11%</Button>
                  <Button variant={ppnRate === 12 ? 'default' : 'ghost'} size="sm" className="h-6 px-1.5 text-[10px]" onClick={() => setPpnRate(12)}>12%</Button>
                </div>
              </div>
              <div className="mt-2"><PriceTag amount={ppnOutput} size="lg" variant="accent" /></div>
              <span className="text-[11px] text-slate-500 mt-1 block">Dari Penjualan BKP Rp {taxableDppSales.toLocaleString('id-ID')}</span>
            </Card>
            <Card className="p-4 border-slate-800 bg-slate-900/60">
              <span className="text-xs text-slate-400 font-medium">Pajak Masukan (Input Tax)</span>
              <div className="mt-2"><PriceTag amount={ppnInput} size="lg" variant="default" /></div>
              <span className="text-[11px] text-slate-500 mt-1 block">Dari Pembelian Vendor Rp {taxableDppPurchases.toLocaleString('id-ID')}</span>
            </Card>
            <Card className="p-4 border-slate-800 bg-emerald-950/20 border-emerald-500/30">
              <span className="text-xs text-emerald-400 font-medium">Kurang Bayar PPN</span>
              <div className="mt-2"><PriceTag amount={ppnPayable} size="lg" variant="emerald" /></div>
              <span className="text-[11px] text-emerald-500/80 mt-1 block">Setor sebelum akhir bulan berikutnya via e-Billing</span>
            </Card>
          </div>
          <Card className="p-5 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2"><Receipt className="w-4 h-4 text-purple-400" /><h3 className="font-bold text-sm text-white">Pajak Restoran / PB1 Daerah (10%)</h3></div>
              <Badge variant="secondary" className="text-[10px]">Bapenda Pemda</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div><span className="text-slate-400 block mb-1">Dasar Pengenaan Pajak (DPP):</span><PriceTag amount={pb1Dpp} size="sm" variant="default" /></div>
              <div><span className="text-slate-400 block mb-1">Utang Pajak PB1 (10%):</span><PriceTag amount={pb1Tax} size="sm" variant="accent" /></div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'ftz' && (
        <Card className="p-5 border-slate-800 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-indigo-400 flex items-center gap-2"><Building2 className="w-5 h-5" />Fasilitas Bebas PPN Kawasan Bebas Batam (KPBPB)</h3>
              <p className="text-xs text-slate-400 mt-0.5">PP No. 41/2021 & PMK No. 173/PMK.03/2021 tentang Perlakuan PPN di Batam FTZ.</p>
            </div>
            <Badge variant="indigo">PPFTZ-01 / PPFTZ-03</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 text-xs block">Status Penyerahan BKP</span>
              <span className="font-bold text-emerald-400 text-sm mt-1 block">Bebas PPN 0% (Tidak Dipungut)</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Kode Faktur: 070 (Bebas PPN)</span>
            </div>
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 text-xs block">Endorsement DJBC Batam</span>
              <span className="font-bold text-slate-200 text-sm mt-1 block flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Terverifikasi QR</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Dokumen PPFTZ-01 Sync Aktif</span>
            </div>
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 text-xs block">Penghematan Beban Pajak</span>
              <div className="mt-1"><PriceTag amount={(taxableDppSales * 11) / 100} size="sm" variant="emerald" /></div>
              <span className="text-[11px] text-slate-500 mt-1 block">Cashflow Efisiensi FTZ</span>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'efaktur' && (
        <Card className="p-5 border-slate-800 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2"><FileCode className="w-5 h-5 text-amber-400" />Simulator Ekspor e-Faktur 4.0 DJP</h3>
              <p className="text-xs text-slate-400 mt-0.5">Struktur payload siap impor ke e-Faktur Desktop & DJP Online Web.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={handleCopyXml}>
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Disalin!' : 'Salin XML'}
              </Button>
              <Button variant="default" size="sm" className="gap-1 text-xs" onClick={handleDownloadCsv}>
                <Download className="w-3.5 h-3.5" /> Unduh CSV
              </Button>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
            <pre>{simulatedXml}</pre>
          </div>
        </Card>
      )}

      {activeTab === 'withholding' && (
        <Card className="p-5 border-slate-800 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2"><Landmark className="w-5 h-5 text-emerald-400" />Withholding Tax (PPh Unifikasi)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Pemotongan PPh 21 Karyawan, PPh 23 Vendor, dan PPh Final 4(2) Sewa.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Utang PPh:</span>
              <PriceTag amount={totalWithholding} size="md" variant="accent" />
            </div>
          </div>
          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
            {withholdingList.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900/40 text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block">{item.name}</span>
                  <span className="text-[11px] text-slate-400">DPP: Rp {item.dpp.toLocaleString('id-ID')} • Tarif: {item.rate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PriceTag amount={item.taxAmount} size="sm" variant="default" />
                  <Badge variant="secondary" className="text-[10px]">{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
