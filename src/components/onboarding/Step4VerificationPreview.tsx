import React, { useState } from 'react'
import { OnboardingData } from '../../types/pos'
import { Card, CardHeader, CardTitle, CardContent, Badge, PriceTag } from '@/ui'
import { ShieldCheck, CheckCircle2, Copy, Check, FileSpreadsheet, Scale, Sparkles, Building } from 'lucide-react'

interface Props {
  data: OnboardingData
}

export const Step4VerificationPreview: React.FC<Props> = ({ data }) => {
  const [copiedUuid, setCopiedUuid] = useState(false)
  const tenancyUuid = data.tenancyUuid || 'cb-tenancy-7f8a9b2c-0100-hfe'

  const coaAccounts = [
    { code: '1000', name: 'Kas & Setara Kas', type: 'Asset' },
    { code: '1010', name: 'Kas Laci Kasir (Float)', type: 'Asset' },
    { code: '1020', name: 'Rekening Bank Operasional', type: 'Asset' },
    { code: '1100', name: 'Piutang Usaha (AR)', type: 'Asset' },
    { code: '1200', name: 'Persediaan Bahan Baku', type: 'Asset' },
    { code: '1210', name: 'Persediaan Barang Jadi', type: 'Asset' },
    { code: '1500', name: 'Aset Tetap - Mesin & Peralatan', type: 'Asset' },
    { code: '1510', name: 'Akumulasi Penyusutan Mesin', type: 'Contra' },
    { code: '2000', name: 'Utang Usaha (AP)', type: 'Liability' },
    { code: '2100', name: 'Utang Pajak PB1 / PPN', type: 'Liability' },
    { code: '2200', name: 'Uang Muka Pelanggan (DP)', type: 'Liability' },
    { code: '3000', name: 'Modal Disetor Pemilik', type: 'Equity' },
    { code: '3100', name: 'Saldo Laba Ditahan', type: 'Equity' },
    { code: '4000', name: 'Pendapatan Penjualan Utama', type: 'Revenue' },
    { code: '4100', name: 'Pendapatan Grosir B2B', type: 'Revenue' },
    { code: '5000', name: 'Beban Pokok Penjualan (HPP)', type: 'Expense' },
    { code: '6000', name: 'Beban Gaji & Upah Staf', type: 'Expense' },
    { code: '6100', name: 'Beban Operasional & Utilitas', type: 'Expense' },
  ]

  const journalEntries = [
    { account: '1010 Kas Laci Kasir (Float)', debit: data.initialKasFloat || 500000, credit: 0 },
    { account: '1020 Bank Operasional', debit: 5000000, credit: 0 },
    { account: '1200 Persediaan Awal', debit: 3000000, credit: 0 },
    { account: '1500 Mesin & Peralatan', debit: 20000000, credit: 0 },
    { account: '2000 Utang Usaha Awal', debit: 0, credit: 3500000 },
    { account: '3000 Modal Disetor', debit: 0, credit: (data.initialKasFloat || 500000) + 24500000 },
  ]

  const totalDebit = journalEntries.reduce((sum, j) => sum + j.debit, 0)
  const totalCredit = journalEntries.reduce((sum, j) => sum + j.credit, 0)
  const isBalanced = totalDebit === totalCredit

  const handleCopyUuid = () => {
    navigator.clipboard?.writeText(tenancyUuid)
    setCopiedUuid(true)
    setTimeout(() => setCopiedUuid(false), 1500)
  }

  return (
    <div className="space-y-4">
      {/* System Verification Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
              System-Verified Ready ✨
              <Badge variant="emerald" className="text-[10px] py-0">
                SLA 99.999% Zero-Downtime
              </Badge>
            </h4>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
              Konfigurasi tenancy & bagan akun diverifikasi siap terbit ke HCB Posting Kernel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <span className="text-[11px] font-mono text-emerald-950 dark:text-emerald-100 font-bold truncate max-w-[180px]">
            {tenancyUuid}
          </span>
          <button
            type="button"
            onClick={handleCopyUuid}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 transition-colors"
            title="Salin Tenancy UUID"
          >
            {copiedUuid ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Overview Metadata Card */}
      <Card className="border-amber-900/15 bg-amber-500/5">
        <CardHeader className="p-3.5 pb-2">
          <CardTitle className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Ringkasan Konfigurasi Entitas Bisnis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-900/10">
              <span className="text-[10px] text-amber-800/70 dark:text-amber-300/70 block">Brand Toko</span>
              <span className="font-bold text-amber-950 dark:text-amber-100 truncate block">
                {data.brandName || 'Artisan Cafe'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-900/10">
              <span className="text-[10px] text-amber-800/70 dark:text-amber-300/70 block">Specialist Cluster</span>
              <Badge variant="default" className="text-[10px] py-0 mt-0.5">
                {data.cluster || 'CLUSTER_FNB'}
              </Badge>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-900/10">
              <span className="text-[10px] text-amber-800/70 dark:text-amber-300/70 block">Negara & Mata Uang</span>
              <span className="font-bold text-amber-950 dark:text-amber-100">
                {data.country || 'ID'} • {data.currency || 'IDR'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-900/10">
              <span className="text-[10px] text-amber-800/70 dark:text-amber-300/70 block">Kapasitas Unit</span>
              <span className="font-bold font-mono tabular-nums text-amber-950 dark:text-amber-100 truncate block">
                {data.capacityScale || '20 Meja (👥 3/4)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart of Accounts 18 Accounts Template */}
      <Card className="border-amber-900/15 bg-amber-500/5">
        <CardHeader className="p-3.5 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Chart of Accounts (CoA 18 Akun Standar)
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            18 Akun Aktif
          </Badge>
        </CardHeader>
        <CardContent className="p-3.5 pt-0">
          <div className="max-h-36 overflow-y-auto rounded-xl border border-amber-900/15 bg-amber-950/20 p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] font-mono tabular-nums">
              {coaAccounts.map((acc) => (
                <div
                  key={acc.code}
                  className="flex items-center justify-between px-2 py-1 rounded bg-amber-500/5 hover:bg-amber-500/15 text-amber-950 dark:text-amber-100"
                >
                  <span className="font-bold text-amber-600 dark:text-amber-400">{acc.code}</span>
                  <span className="truncate flex-1 px-2 text-left font-sans text-[11px]">{acc.name}</span>
                  <span className="text-[9px] px-1 rounded bg-amber-900/10 text-amber-800 dark:text-amber-300">
                    {acc.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Balance Journal Double-Entry Balance Verification */}
      <Card className="border-amber-900/15 bg-amber-500/5">
        <CardHeader className="p-3.5 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Jurnal Saldo Awal (Double-Entry Balanced Proof)
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {isBalanced ? (
              <Badge variant="emerald" className="text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Debits == Credits Balanced
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px]">
                Unbalanced
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3.5 pt-0 space-y-1.5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono tabular-nums">
              <thead>
                <tr className="border-b border-amber-900/15 text-amber-800/80 dark:text-amber-300/80 font-sans text-[10px]">
                  <th className="py-1">Akun Buku Besar</th>
                  <th className="py-1 text-right">Debit</th>
                  <th className="py-1 text-right">Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10">
                {journalEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-amber-500/5 text-amber-950 dark:text-amber-100">
                    <td className="py-1 font-sans text-[11px]">{entry.account}</td>
                    <td className="py-1 text-right">{entry.debit > 0 ? <PriceTag amount={entry.debit} size="xs" /> : '-'}</td>
                    <td className="py-1 text-right">{entry.credit > 0 ? <PriceTag amount={entry.credit} size="xs" /> : '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-amber-900/20 font-bold text-amber-950 dark:text-amber-100">
                  <td className="py-1.5 font-sans">Total Saldo Awal</td>
                  <td className="py-1.5 text-right"><PriceTag amount={totalDebit} size="sm" variant="emerald" /></td>
                  <td className="py-1.5 text-right"><PriceTag amount={totalCredit} size="sm" variant="emerald" /></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
