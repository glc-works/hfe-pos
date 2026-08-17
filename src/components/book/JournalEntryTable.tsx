import React, { useState, useMemo } from 'react'
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  X,
  Trash2,
} from 'lucide-react'
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, Input, PriceTag } from '@/ui'

export type JournalType = 'ALL' | 'SALES' | 'PURCHASE' | 'BANK' | 'PAYROLL' | 'GENERAL'

export interface JournalLineItem {
  id: string
  accountCode: string
  accountName: string
  debit: number
  credit: number
}

export interface JournalEntry {
  id: string
  refNumber: string
  date: string
  type: Exclude<JournalType, 'ALL'>
  memo: string
  sourceDoc?: string
  status: 'POSTED' | 'DRAFT'
  lines: JournalLineItem[]
}

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'jrn-101', refNumber: 'SLS-2026-08-042', date: '2026-08-17 14:30', type: 'SALES', memo: 'Penjualan Kasir Shift Pagi (Dine-In + QRIS)', sourceDoc: 'POS-SHIFT-0817-A', status: 'POSTED',
    lines: [
      { id: 'l-1', accountCode: '1110', accountName: 'Kas Kasir / Cash Drawer', debit: 4500000, credit: 0 },
      { id: 'l-2', accountCode: '1130', accountName: 'Bank Mandiri QRIS Escrow', debit: 7800000, credit: 0 },
      { id: 'l-3', accountCode: '4100', accountName: 'Penjualan Makanan Dine-In', debit: 0, credit: 8200000 },
      { id: 'l-4', accountCode: '4200', accountName: 'Penjualan Minuman & Bar', debit: 0, credit: 3500000 },
      { id: 'l-5', accountCode: '2200', accountName: 'Hutang Pajak PB1 (10%)', debit: 0, credit: 600000 },
    ],
  },
  {
    id: 'jrn-102', refNumber: 'PUR-2026-08-019', date: '2026-08-17 11:15', type: 'PURCHASE', memo: 'Penerimaan Stok Biji Kopi Arabica (Supplier CV Kopi)', sourceDoc: 'PO-20260815-09', status: 'POSTED',
    lines: [
      { id: 'l-6', accountCode: '1320', accountName: 'Persediaan Biji Kopi & Minuman', debit: 3850000, credit: 0 },
      { id: 'l-7', accountCode: '2100', accountName: 'Hutang Usaha Supplier', debit: 0, credit: 3850000 },
    ],
  },
  {
    id: 'jrn-103', refNumber: 'BNK-2026-08-005', date: '2026-08-16 17:00', type: 'BANK', memo: 'Setoran Tunai Drawer Float ke BCA', sourceDoc: 'SLIP-SETOR-BCA-9812', status: 'POSTED',
    lines: [
      { id: 'l-8', accountCode: '1120', accountName: 'Bank BCA Operasional', debit: 6000000, credit: 0 },
      { id: 'l-9', accountCode: '1110', accountName: 'Kas Kasir / Cash Drawer', debit: 0, credit: 6000000 },
    ],
  },
  {
    id: 'jrn-104', refNumber: 'PAY-2026-08-012', date: '2026-08-15 10:00', type: 'PAYROLL', memo: 'Pembayaran Gaji Barista & Kitchen Mid-Month via BCA', sourceDoc: 'PAYROLL-BATCH-AUG1', status: 'POSTED',
    lines: [
      { id: 'l-10', accountCode: '6100', accountName: 'Beban Gaji & Tunjangan Staff', debit: 12500000, credit: 0 },
      { id: 'l-11', accountCode: '1120', accountName: 'Bank BCA Operasional', debit: 0, credit: 12500000 },
    ],
  },
  {
    id: 'jrn-105', refNumber: 'JRN-2026-08-001', date: '2026-08-14 09:30', type: 'GENERAL', memo: 'Penyesuaian Biaya Listrik & Internet Outlet Kemang', sourceDoc: 'PLN-BILL-88912', status: 'POSTED',
    lines: [
      { id: 'l-12', accountCode: '6200', accountName: 'Beban Sewa Outlet & Utilitas', debit: 2750000, credit: 0 },
      { id: 'l-13', accountCode: '1110', accountName: 'Kas Kasir / Cash Drawer', debit: 0, credit: 2750000 },
    ],
  },
]

export const JournalEntryTable: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES)
  const [selectedType, setSelectedType] = useState<JournalType>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [formRef, setFormRef] = useState(`JRN-2026-08-${Math.floor(Math.random() * 900 + 100)}`)
  const [formDate, setFormDate] = useState(new Date().toISOString().substring(0, 16).replace('T', ' '))
  const [formType, setFormType] = useState<Exclude<JournalType, 'ALL'>>('GENERAL')
  const [formMemo, setFormMemo] = useState('')
  const [formSourceDoc, setFormSourceDoc] = useState('')
  const [formLines, setFormLines] = useState<JournalLineItem[]>([
    { id: 'new-1', accountCode: '1110', accountName: 'Kas Kasir', debit: 0, credit: 0 },
    { id: 'new-2', accountCode: '4100', accountName: 'Penjualan Makanan', debit: 0, credit: 0 },
  ])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (selectedType !== 'ALL' && entry.type !== selectedType) return false
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        entry.refNumber.toLowerCase().includes(q) ||
        entry.memo.toLowerCase().includes(q) ||
        (entry.sourceDoc && entry.sourceDoc.toLowerCase().includes(q)) ||
        entry.lines.some((l) => l.accountCode.includes(q) || l.accountName.toLowerCase().includes(q))
      )
    })
  }, [entries, selectedType, searchQuery])

  const totals = useMemo(() => {
    let totalDebit = 0, totalCredit = 0
    filteredEntries.forEach((entry) => {
      entry.lines.forEach((l) => { totalDebit += l.debit; totalCredit += l.credit })
    })
    return { totalDebit, totalCredit, isBalanced: totalDebit === totalCredit }
  }, [filteredEntries])

  const formTotals = useMemo(() => {
    const totalDebit = formLines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0)
    const totalCredit = formLines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0)
    return { totalDebit, totalCredit, isBalanced: totalDebit === totalCredit && totalDebit > 0 }
  }, [formLines])

  const handleAddLine = () => setFormLines((p) => [...p, { id: `new-${Date.now()}`, accountCode: '1120', accountName: 'Bank BCA', debit: 0, credit: 0 }])
  const handleRemoveLine = (id: string) => { if (formLines.length > 2) setFormLines((p) => p.filter((l) => l.id !== id)) }

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTotals.isBalanced) return
    const newEntry: JournalEntry = {
      id: `jrn-${Date.now()}`, refNumber: formRef, date: formDate, type: formType, memo: formMemo || 'Jurnal Transaksi', sourceDoc: formSourceDoc || undefined, status: 'POSTED',
      lines: formLines.map((l) => ({ ...l, debit: Number(l.debit) || 0, credit: Number(l.credit) || 0 })),
    }
    setEntries((p) => [newEntry, ...p])
    setIsCreateModalOpen(false)
    setFormMemo('')
    setFormSourceDoc('')
    setFormRef(`JRN-2026-08-${Math.floor(Math.random() * 900 + 100)}`)
  }

  return (
    <Card className="w-full bg-slate-950 border-slate-800">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20"><BookOpen className="w-5 h-5" /></div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-100">Jurnal Transaksi (Double-Entry)</CardTitle>
              <p className="text-xs text-slate-400">Pencatatan Jurnal Otomatis POS & Posting Manual Terverifikasi</p>
            </div>
          </div>
          <Button variant="default" size="sm" className="gap-1.5" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Buat Jurnal Baru
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['ALL', 'SALES', 'PURCHASE', 'BANK', 'PAYROLL', 'GENERAL'] as JournalType[]).map((type) => (
              <Button key={type} variant={selectedType === type ? 'default' : 'outline'} size="sm" className="text-xs h-7 px-2.5" onClick={() => setSelectedType(type)}>
                {type === 'ALL' ? 'Semua' : type}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={totals.isBalanced ? 'emerald' : 'destructive'} className="gap-1 text-xs">
              {totals.isBalanced ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {totals.isBalanced ? 'Balanced ✓ Debits == Credits' : '⚠️ Imbalance'}
            </Badge>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <span>Dr: <PriceTag amount={totals.totalDebit} size="sm" variant="emerald" /></span>
              <span className="text-slate-600">|</span>
              <span>Cr: <PriceTag amount={totals.totalCredit} size="sm" variant="default" /></span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <Input placeholder="Cari nomor ref, memo, dokumen atau akun..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-slate-900/80 border-slate-800" />
        </div>

        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const entryDebit = entry.lines.reduce((sum, l) => sum + l.debit, 0)
            const entryCredit = entry.lines.reduce((sum, l) => sum + l.credit, 0)
            const isBalanced = entryDebit === entryCredit

            return (
              <div key={entry.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex flex-wrap items-center justify-between p-3 bg-slate-900/90 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="font-mono text-xs">{entry.refNumber}</Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono"><Calendar className="w-3 h-3 text-slate-500" /> {entry.date}</span>
                    <Badge variant="secondary" className="text-[10px] uppercase">{entry.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.sourceDoc && <span className="text-[11px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1"><FileText className="w-3 h-3 text-slate-500" /> {entry.sourceDoc}</span>}
                    <Badge variant={isBalanced ? 'emerald' : 'destructive'} className="text-[11px]">{isBalanced ? 'Balanced ✓' : 'Imbalanced'}</Badge>
                  </div>
                </div>

                <div className="px-4 py-1.5 text-xs text-slate-300 bg-slate-950/40 border-b border-slate-800/40">{entry.memo}</div>

                <div className="divide-y divide-slate-800/60">
                  {entry.lines.map((line) => (
                    <div key={line.id} className="grid grid-cols-12 px-4 py-2 text-xs items-center hover:bg-slate-900/40">
                      <div className="col-span-2 font-mono text-slate-400 font-semibold">{line.accountCode}</div>
                      <div className={`col-span-6 truncate ${line.credit > 0 ? 'pl-4 text-slate-300' : 'text-slate-100 font-medium'}`}>{line.accountName}</div>
                      <div className="col-span-2 text-right">{line.debit > 0 ? <PriceTag amount={line.debit} size="xs" variant="emerald" /> : <span className="text-slate-600">-</span>}</div>
                      <div className="col-span-2 text-right">{line.credit > 0 ? <PriceTag amount={line.credit} size="xs" variant="default" /> : <span className="text-slate-600">-</span>}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-400" /><h4 className="font-bold text-slate-100 text-sm">Buat Jurnal Umum Baru</h4></div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setIsCreateModalOpen(false)}><X className="w-4 h-4" /></Button>
            </div>
            <form onSubmit={handleSaveEntry} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">No. Ref</label>
                  <Input value={formRef} onChange={(e) => setFormRef(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tipe</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value as Exclude<JournalType, 'ALL'>)} className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-slate-100">
                    <option value="GENERAL">General</option>
                    <option value="SALES">Sales</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="BANK">Bank</option>
                    <option value="PAYROLL">Payroll</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Dokumen</label>
                  <Input placeholder="INV-01" value={formSourceDoc} onChange={(e) => setFormSourceDoc(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Memo</label>
                <Input placeholder="Rincian jurnal..." value={formMemo} onChange={(e) => setFormMemo(e.target.value)} required />
              </div>
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Baris Double-Entry</span>
                  <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleAddLine}><Plus className="w-3 h-3" /> Tambah Baris</Button>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto p-1">
                  {formLines.map((line, idx) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <div className="col-span-3"><Input placeholder="Kode" value={line.accountCode} onChange={(e) => setFormLines((p) => p.map((l, i) => (i === idx ? { ...l, accountCode: e.target.value } : l)))} /></div>
                      <div className="col-span-4"><Input placeholder="Nama" value={line.accountName} onChange={(e) => setFormLines((p) => p.map((l, i) => (i === idx ? { ...l, accountName: e.target.value } : l)))} /></div>
                      <div className="col-span-2"><Input type="number" placeholder="Debit" value={line.debit || ''} onChange={(e) => { const v = parseFloat(e.target.value) || 0; setFormLines((p) => p.map((l, i) => (i === idx ? { ...l, debit: v, credit: v > 0 ? 0 : l.credit } : l))) }} /></div>
                      <div className="col-span-2"><Input type="number" placeholder="Credit" value={line.credit || ''} onChange={(e) => { const v = parseFloat(e.target.value) || 0; setFormLines((p) => p.map((l, i) => (i === idx ? { ...l, credit: v, debit: v > 0 ? 0 : l.debit } : l))) }} /></div>
                      <div className="col-span-1 flex justify-center">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400" onClick={() => handleRemoveLine(line.id)} disabled={formLines.length <= 2}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 mt-2">
                  <div className="text-xs text-slate-400">Dr: <PriceTag amount={formTotals.totalDebit} size="xs" variant="emerald" /> | Cr: <PriceTag amount={formTotals.totalCredit} size="xs" variant="default" /></div>
                  <Badge variant={formTotals.isBalanced ? 'emerald' : 'destructive'} className="text-xs">{formTotals.isBalanced ? 'Balanced ✓' : 'Imbalanced'}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="default" size="sm" disabled={!formTotals.isBalanced}>Posting Jurnal</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  )
}
