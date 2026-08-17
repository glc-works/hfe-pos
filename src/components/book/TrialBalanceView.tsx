import React, { useState, useMemo } from 'react'
import {
  Scale,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  History,
} from 'lucide-react'
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, Input, PriceTag } from '@/ui'

export type PeriodFilter = 'TODAY' | 'THIS_WEEK' | 'MTD' | 'Q3_2026' | 'YTD'

export interface TrialBalanceItem {
  accountCode: string
  accountName: string
  category: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'COGS' | 'EXPENSE'
  debit: number
  credit: number
  subledgerCount: number
}

export interface SubledgerTransaction {
  id: string
  date: string
  refNumber: string
  memo: string
  debit: number
  credit: number
  runningBalance: number
}

export const INITIAL_TRIAL_BALANCE: TrialBalanceItem[] = [
  { accountCode: '1110', accountName: 'Kas Kasir / Cash Drawer Float', category: 'ASSET', debit: 5000000, credit: 0, subledgerCount: 14 },
  { accountCode: '1120', accountName: 'Bank BCA Operasional (Settlement EDC)', category: 'ASSET', debit: 167000000, credit: 0, subledgerCount: 28 },
  { accountCode: '1130', accountName: 'Bank Mandiri QRIS Escrow', category: 'ASSET', debit: 52700000, credit: 0, subledgerCount: 42 },
  { accountCode: '1210', accountName: 'Piutang Invoice Catering B2B', category: 'ASSET', debit: 14500000, credit: 0, subledgerCount: 6 },
  { accountCode: '1220', accountName: 'Kasbon Karyawan & Staff Advance', category: 'ASSET', debit: 3750000, credit: 0, subledgerCount: 3 },
  { accountCode: '1310', accountName: 'Stok Bahan Baku Makanan Kitchen', category: 'ASSET', debit: 16200000, credit: 0, subledgerCount: 19 },
  { accountCode: '1320', accountName: 'Stok Biji Kopi & Sirup Minuman', category: 'ASSET', debit: 8800000, credit: 0, subledgerCount: 11 },
  { accountCode: '2100', accountName: 'Hutang Usaha Supplier (AP)', category: 'LIABILITY', debit: 0, credit: 28500000, subledgerCount: 8 },
  { accountCode: '2200', accountName: 'Hutang Pajak Resto PB1 (10%)', category: 'LIABILITY', debit: 0, credit: 9800000, subledgerCount: 15 },
  { accountCode: '2300', accountName: 'Akrual Gaji Karyawan', category: 'LIABILITY', debit: 0, credit: 4500000, subledgerCount: 4 },
  { accountCode: '3100', accountName: 'Modal Disetor (Paid-in Capital)', category: 'EQUITY', debit: 0, credit: 100000000, subledgerCount: 1 },
  { accountCode: '3200', accountName: 'Laba Ditahan (Retained Earnings)', category: 'EQUITY', debit: 0, credit: 42650000, subledgerCount: 2 },
  { accountCode: '4100', accountName: 'Penjualan Makanan Dine-In & Takeaway', category: 'REVENUE', debit: 0, credit: 124200000, subledgerCount: 85 },
  { accountCode: '4200', accountName: 'Penjualan Minuman & Barista Coffee', category: 'REVENUE', debit: 0, credit: 61300000, subledgerCount: 64 },
  { accountCode: '4300', accountName: 'Pendapatan Service Charge (5%)', category: 'REVENUE', debit: 0, credit: 13000000, subledgerCount: 37 },
  { accountCode: '5100', accountName: 'HPP Bahan Baku Makanan Kitchen', category: 'COGS', debit: 48900000, credit: 0, subledgerCount: 22 },
  { accountCode: '5200', accountName: 'HPP Biji Kopi, Susu & Sirup Bar', category: 'COGS', debit: 20300000, credit: 0, subledgerCount: 18 },
  { accountCode: '5300', accountName: 'Kemasan Takeaway & Packaging Box', category: 'COGS', debit: 5000000, credit: 0, subledgerCount: 9 },
  { accountCode: '6100', accountName: 'Gaji & Tunjangan Staff Kitchen', category: 'EXPENSE', debit: 24500000, credit: 0, subledgerCount: 7 },
  { accountCode: '6200', accountName: 'Biaya Sewa Outlet & Utilitas', category: 'EXPENSE', debit: 12500000, credit: 0, subledgerCount: 5 },
  { accountCode: '6300', accountName: 'Biaya MDR EDC & Merchant Platform POS', category: 'EXPENSE', debit: 4800000, credit: 0, subledgerCount: 16 },
]

export const MOCK_SUBLEDGER_MAP: Record<string, SubledgerTransaction[]> = {
  '1110': [
    { id: 'tx-1', date: '2026-08-17 14:30', refNumber: 'SLS-08-042', memo: 'Penjualan Kasir Shift Pagi Cash', debit: 4500000, credit: 0, runningBalance: 5000000 },
    { id: 'tx-2', date: '2026-08-16 17:00', refNumber: 'BNK-08-005', memo: 'Setoran Kas Tunai ke Bank BCA', debit: 0, credit: 6000000, runningBalance: 500000 },
  ],
  '1120': [
    { id: 'tx-3', date: '2026-08-16 17:00', refNumber: 'BNK-08-005', memo: 'Penerimaan Setoran Tunai Kasir', debit: 6000000, credit: 0, runningBalance: 84500000 },
    { id: 'tx-4', date: '2026-08-15 10:00', refNumber: 'PAY-08-012', memo: 'Pembayaran Payroll Mid-Month', debit: 0, credit: 12500000, runningBalance: 78500000 },
  ],
}

export interface TrialBalanceViewProps {
  rows?: any
  periodName?: string
}

export const TrialBalanceView: React.FC<TrialBalanceViewProps> = ({ rows: _rows, periodName: _periodName }) => {
  const [items] = useState<TrialBalanceItem[]>(INITIAL_TRIAL_BALANCE)
  const [period, setPeriod] = useState<PeriodFilter>('MTD')
  const [searchQuery, setSearchQuery] = useState('')
  const [drilldownAccount, setDrilldownAccount] = useState<TrialBalanceItem | null>(null)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return item.accountCode.includes(q) || item.accountName.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    })
  }, [items, searchQuery])

  const totals = useMemo(() => {
    const totalDebit = filteredItems.reduce((acc, curr) => acc + curr.debit, 0)
    const totalCredit = filteredItems.reduce((acc, curr) => acc + curr.credit, 0)
    return { totalDebit, totalCredit, isBalanced: totalDebit === totalCredit }
  }, [filteredItems])

  const subledgerTransactions = useMemo(() => {
    if (!drilldownAccount) return []
    return MOCK_SUBLEDGER_MAP[drilldownAccount.accountCode] || [
      {
        id: 'tx-default-1',
        date: '2026-08-17 10:00',
        refNumber: 'JRN-2026-08-01',
        memo: `Mutasi Akun ${drilldownAccount.accountName}`,
        debit: drilldownAccount.debit,
        credit: drilldownAccount.credit,
        runningBalance: drilldownAccount.debit > 0 ? drilldownAccount.debit : drilldownAccount.credit,
      },
    ]
  }, [drilldownAccount])

  return (
    <Card className="w-full bg-slate-950 border-slate-800">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-100">Neraca Saldo (Trial Balance)</CardTitle>
              <p className="text-xs text-slate-400">Verifikasi Kesetaraan Saldo Debit dan Kredit Seluruh Akun</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => alert(`Export CSV Neraca Saldo ${period}`)}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'TODAY', label: 'Hari Ini' },
              { id: 'THIS_WEEK', label: 'Minggu Ini' },
              { id: 'MTD', label: 'MTD (Agustus 2026)' },
              { id: 'Q3_2026', label: 'Q3 2026' },
              { id: 'YTD', label: 'YTD 2026' },
            ].map((p) => (
              <Button
                key={p.id}
                variant={period === p.id ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-7 px-2.5"
                onClick={() => setPeriod(p.id as PeriodFilter)}
              >
                {p.label}
              </Button>
            ))}
          </div>

          <Badge variant={totals.isBalanced ? 'emerald' : 'destructive'} className="gap-1 text-xs">
            {totals.isBalanced ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {totals.isBalanced ? 'Trial Balance Balanced (Dr == Cr)' : 'Out of Balance Alert'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <Input
            placeholder="Cari kode akun atau nama akun dalam neraca saldo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-900/80 border-slate-800"
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-bold text-slate-300">
            <div className="col-span-2">Kode Akun</div>
            <div className="col-span-4">Nama Akun & Klasifikasi</div>
            <div className="col-span-3 text-right">Saldo Debit (Dr)</div>
            <div className="col-span-3 text-right">Saldo Kredit (Cr)</div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[440px] overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.accountCode}
                onClick={() => setDrilldownAccount(item)}
                className="grid grid-cols-12 px-4 py-2 text-xs hover:bg-slate-800/50 cursor-pointer transition-colors items-center group"
              >
                <div className="col-span-2 font-mono text-slate-300 font-bold flex items-center gap-1.5">
                  <span>{item.accountCode}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="col-span-4 flex items-center gap-2 truncate">
                  <span className="text-slate-100 truncate">{item.accountName}</span>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{item.category}</Badge>
                </div>
                <div className="col-span-3 text-right">
                  {item.debit > 0 ? <PriceTag amount={item.debit} size="sm" variant="emerald" /> : <span className="text-slate-600">-</span>}
                </div>
                <div className="col-span-3 text-right">
                  {item.credit > 0 ? <PriceTag amount={item.credit} size="sm" variant="default" /> : <span className="text-slate-600">-</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-12 px-4 py-3 bg-slate-900 border-t border-slate-800 text-xs font-bold items-center">
            <div className="col-span-6 text-slate-100 uppercase tracking-wider font-mono">
              Total Neraca Saldo ({filteredItems.length} Akun)
            </div>
            <div className="col-span-3 text-right">
              <PriceTag amount={totals.totalDebit} size="md" variant="emerald" />
            </div>
            <div className="col-span-3 text-right">
              <PriceTag amount={totals.totalCredit} size="md" variant="default" />
            </div>
          </div>
        </div>
      </CardContent>

      {drilldownAccount && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">
                    Buku Besar Pembantu: [{drilldownAccount.accountCode}] {drilldownAccount.accountName}
                  </h4>
                  <p className="text-xs text-slate-400">Mutasi transaksi subledger ({period})</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setDrilldownAccount(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
              <div className="grid grid-cols-12 px-3 py-2 bg-slate-900 text-[11px] font-bold text-slate-300">
                <div className="col-span-3">Tanggal / Ref</div>
                <div className="col-span-4">Keterangan / Memo</div>
                <div className="col-span-2 text-right">Debit</div>
                <div className="col-span-3 text-right">Saldo Berjalan</div>
              </div>

              {subledgerTransactions.map((tx) => (
                <div key={tx.id} className="grid grid-cols-12 px-3 py-2 text-xs items-center">
                  <div className="col-span-3 font-mono text-slate-400 text-[11px]">
                    <div>{tx.date}</div>
                    <span className="text-amber-400 font-semibold">{tx.refNumber}</span>
                  </div>
                  <div className="col-span-4 text-slate-200 text-xs pr-2 truncate">{tx.memo}</div>
                  <div className="col-span-2 text-right">
                    {tx.debit > 0 ? <PriceTag amount={tx.debit} size="xs" variant="emerald" /> : <PriceTag amount={tx.credit} size="xs" variant="default" />}
                  </div>
                  <div className="col-span-3 text-right">
                    <PriceTag amount={tx.runningBalance} size="xs" variant="default" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
              <span>Total: {subledgerTransactions.length} Mutasi</span>
              <Button variant="outline" size="sm" onClick={() => setDrilldownAccount(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
