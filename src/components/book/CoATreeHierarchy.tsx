import React, { useState, useMemo } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  FolderTree,
  Scale,
  PlusCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react'
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, Input, PriceTag } from '@/ui'

export type AccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'COGS' | 'EXPENSE'

export interface AccountNode {
  id: string
  code: string
  name: string
  category: AccountCategory
  type: 'HEADER' | 'DETAIL'
  normalBalance: 'DEBIT' | 'CREDIT'
  balance: number
  children?: AccountNode[]
}

export const INITIAL_COA_DATA: AccountNode[] = [
  {
    id: 'coa-1000', code: '1000', name: 'Aktiva Lancar & Kas', category: 'ASSET', type: 'HEADER', normalBalance: 'DEBIT', balance: 185450000,
    children: [
      {
        id: 'coa-1100', code: '1100', name: 'Kas & Setara Kas', category: 'ASSET', type: 'HEADER', normalBalance: 'DEBIT', balance: 142200000,
        children: [
          { id: 'coa-1110', code: '1110', name: 'Kas Kasir / Cash Drawer Float', category: 'ASSET', type: 'DETAIL', normalBalance: 'DEBIT', balance: 5000000 },
          { id: 'coa-1120', code: '1120', name: 'Bank BCA Operasional (Settlement EDC)', category: 'ASSET', type: 'DETAIL', normalBalance: 'DEBIT', balance: 84500000 },
          { id: 'coa-1130', code: '1130', name: 'Bank Mandiri QRIS Escrow', category: 'ASSET', type: 'DETAIL', normalBalance: 'DEBIT', balance: 52700000 },
        ],
      },
      {
        id: 'coa-1200', code: '1200', name: 'Piutang & Kasbon Usaha', category: 'ASSET', type: 'HEADER', normalBalance: 'DEBIT', balance: 18250000,
        children: [
          { id: 'coa-1210', code: '1210', name: 'Piutang Invoice Catering B2B', category: 'ASSET', type: 'DETAIL', normalBalance: 'DEBIT', balance: 14500000 },
          { id: 'coa-1220', code: '1220', name: 'Kasbon Karyawan & Staff Advance', category: 'ASSET', type: 'DETAIL', normalBalance: 'DEBIT', balance: 3750000 },
        ],
      },
      {
        id: 'coa-1300', code: '1300', name: 'Persediaan Barang & Bahan Baku', category: 'ASSET', type: 'HEADER', normalBalance: 'DEBIT', balance: 25000000,
        children: [
          { id: 'coa-1310', code: '1310', name: 'Stok Bahan Baku Makanan (Kitchen)', category: 'ASSET', type: 'DETAIL', normalBalance: 'DEBIT', balance: 16200000 },
          { id: 'coa-1320', code: '1320', name: 'Stok Biji Kopi & Minuman (Bar)', category: 'ASSET', type: 'DETAIL', normalBalance: 'DEBIT', balance: 8800000 },
        ],
      },
    ],
  },
  {
    id: 'coa-2000', code: '2000', name: 'Kewajiban & Hutang Lancar', category: 'LIABILITY', type: 'HEADER', normalBalance: 'CREDIT', balance: 42800000,
    children: [
      { id: 'coa-2100', code: '2100', name: 'Hutang Usaha Supplier (AP)', category: 'LIABILITY', type: 'DETAIL', normalBalance: 'CREDIT', balance: 28500000 },
      { id: 'coa-2200', code: '2200', name: 'Hutang Pajak Resto PB1 (10%)', category: 'LIABILITY', type: 'DETAIL', normalBalance: 'CREDIT', balance: 9800000 },
      { id: 'coa-2300', code: '2300', name: 'Akrual Gaji Karyawan', category: 'LIABILITY', type: 'DETAIL', normalBalance: 'CREDIT', balance: 4500000 },
    ],
  },
  {
    id: 'coa-3000', code: '3000', name: 'Modal & Ekuitas Pemilik', category: 'EQUITY', type: 'HEADER', normalBalance: 'CREDIT', balance: 142650000,
    children: [
      { id: 'coa-3100', code: '3100', name: 'Modal Disetor (Paid-in Capital)', category: 'EQUITY', type: 'DETAIL', normalBalance: 'CREDIT', balance: 100000000 },
      { id: 'coa-3200', code: '3200', name: 'Laba Ditahan (Retained Earnings)', category: 'EQUITY', type: 'DETAIL', normalBalance: 'CREDIT', balance: 42650000 },
    ],
  },
  {
    id: 'coa-4000', code: '4000', name: 'Pendapatan Usaha (Revenue)', category: 'REVENUE', type: 'HEADER', normalBalance: 'CREDIT', balance: 198500000,
    children: [
      { id: 'coa-4100', code: '4100', name: 'Penjualan Makanan Dine-In & Takeaway', category: 'REVENUE', type: 'DETAIL', normalBalance: 'CREDIT', balance: 124200000 },
      { id: 'coa-4200', code: '4200', name: 'Penjualan Minuman & Barista Coffee', category: 'REVENUE', type: 'DETAIL', normalBalance: 'CREDIT', balance: 61300000 },
      { id: 'coa-4300', code: '4300', name: 'Pendapatan Service Charge (5%)', category: 'REVENUE', type: 'DETAIL', normalBalance: 'CREDIT', balance: 13000000 },
    ],
  },
  {
    id: 'coa-5000', code: '5000', name: 'Beban Pokok Penjualan (CoGS)', category: 'COGS', type: 'HEADER', normalBalance: 'DEBIT', balance: 74200000,
    children: [
      { id: 'coa-5100', code: '5100', name: 'HPP Bahan Baku Makanan Kitchen', category: 'COGS', type: 'DETAIL', normalBalance: 'DEBIT', balance: 48900000 },
      { id: 'coa-5200', code: '5200', name: 'HPP Biji Kopi & Susu Bar', category: 'COGS', type: 'DETAIL', normalBalance: 'DEBIT', balance: 20300000 },
      { id: 'coa-5300', code: '5300', name: 'Kemasan & Packaging Box', category: 'COGS', type: 'DETAIL', normalBalance: 'DEBIT', balance: 5000000 },
    ],
  },
  {
    id: 'coa-6000', code: '6000', name: 'Beban Operasional (Expenses)', category: 'EXPENSE', type: 'HEADER', normalBalance: 'DEBIT', balance: 41800000,
    children: [
      { id: 'coa-6100', code: '6100', name: 'Gaji & Tunjangan Staff Kitchen', category: 'EXPENSE', type: 'DETAIL', normalBalance: 'DEBIT', balance: 24500000 },
      { id: 'coa-6200', code: '6200', name: 'Sewa Outlet & Utilitas', category: 'EXPENSE', type: 'DETAIL', normalBalance: 'DEBIT', balance: 12500000 },
      { id: 'coa-6300', code: '6300', name: 'Biaya MDR EDC & Platform POS', category: 'EXPENSE', type: 'DETAIL', normalBalance: 'DEBIT', balance: 4800000 },
    ],
  },
]

export interface CoATreeHierarchyProps {
  accounts?: any
}

export const CoATreeHierarchy: React.FC<CoATreeHierarchyProps> = ({ accounts: _accounts }) => {
  const [treeData, setTreeData] = useState<AccountNode[]>(INITIAL_COA_DATA)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'coa-1000': true, 'coa-1100': true, 'coa-2000': true, 'coa-3000': true, 'coa-4000': true, 'coa-5000': true, 'coa-6000': true,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<AccountCategory>('ASSET')
  const [newNormalBalance, setNewNormalBalance] = useState<'DEBIT' | 'CREDIT'>('DEBIT')
  const [newBalance, setNewBalance] = useState('')

  const toggleExpand = (id: string) => setExpandedIds((p) => ({ ...p, [id]: !p[id] }))

  const getBadgeVariant = (cat: AccountCategory): 'emerald' | 'default' | 'indigo' | 'secondary' => {
    if (cat === 'ASSET' || cat === 'REVENUE') return 'emerald'
    if (cat === 'LIABILITY' || cat === 'COGS') return 'default'
    if (cat === 'EQUITY') return 'indigo'
    return 'secondary'
  }

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode || !newName) return
    const newNode: AccountNode = {
      id: `coa-${newCode}`, code: newCode, name: newName, category: newCategory, type: 'DETAIL', normalBalance: newNormalBalance, balance: parseFloat(newBalance) || 0,
    }
    setTreeData((prev) =>
      prev.map((root) =>
        root.code === newCode.charAt(0) + '000'
          ? { ...root, balance: root.balance + newNode.balance, children: [...(root.children || []), newNode] }
          : root
      )
    )
    setIsAddModalOpen(false)
    setNewCode('')
    setNewName('')
    setNewBalance('')
  }

  const matchesSearch = (node: AccountNode, q: string): boolean => {
    if (!q) return true
    const query = q.toLowerCase()
    return node.code.toLowerCase().includes(query) || node.name.toLowerCase().includes(query) || (node.children ? node.children.some((c) => matchesSearch(c, query)) : false)
  }

  const renderAccountNode = (node: AccountNode, depth: number = 0) => {
    if (searchQuery && !matchesSearch(node, searchQuery)) return null
    const hasChildren = Boolean(node.children && node.children.length > 0)
    const isExpanded = expandedIds[node.id] ?? false

    return (
      <div key={node.id} className="flex flex-col">
        <div
          className={`flex items-center justify-between py-2 px-3 rounded-xl border border-transparent hover:border-slate-800 transition-colors ${
            node.type === 'HEADER' ? 'bg-slate-900/90 font-bold' : 'hover:bg-slate-900/40'
          }`}
          style={{ paddingLeft: `${depth * 18 + 10}px` }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-slate-400" onClick={() => toggleExpand(node.id)} aria-label="Toggle">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </Button>
            ) : <span className="w-6" />}
            <Badge variant={getBadgeVariant(node.category)} className="font-mono text-[11px] px-2 py-0.5">{node.code}</Badge>
            <span className={`truncate text-sm ${node.type === 'HEADER' ? 'text-slate-100 font-semibold' : 'text-slate-300'}`}>{node.name}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-mono text-slate-500 uppercase">{node.normalBalance}</span>
            <PriceTag amount={node.balance} size={node.type === 'HEADER' ? 'md' : 'sm'} variant={node.category === 'REVENUE' || node.category === 'ASSET' ? 'emerald' : 'default'} />
          </div>
        </div>
        {hasChildren && isExpanded && <div className="flex flex-col">{node.children!.map((child) => renderAccountNode(child, depth + 1))}</div>}
      </div>
    )
  }

  const totalAssets = useMemo(() => treeData.find((n) => n.code === '1000')?.balance || 0, [treeData])
  const totalLiab = useMemo(() => treeData.find((n) => n.code === '2000')?.balance || 0, [treeData])
  const totalEquity = useMemo(() => treeData.find((n) => n.code === '3000')?.balance || 0, [treeData])
  const isEquationBalanced = Math.abs(totalAssets - (totalLiab + totalEquity)) < 1

  return (
    <Card className="w-full bg-slate-950 border-slate-800">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20"><FolderTree className="w-5 h-5" /></div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-100">Bagan Akun (Chart of Accounts)</CardTitle>
              <p className="text-xs text-slate-400">Hierarki 6 Kategori Standar (1xxx Aktiva, 2xxx Hutang, 3xxx Modal, 4xxx Pendapatan, 5xxx HPP, 6xxx Beban)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm" className="gap-1.5"
              onClick={() => {
                const all: Record<string, boolean> = {}
                const recurse = (nodes: AccountNode[]) => nodes.forEach((n) => { all[n.id] = true; if (n.children) recurse(n.children) })
                recurse(treeData)
                setExpandedIds(all)
              }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Buka Semua
            </Button>
            <Button variant="default" size="sm" className="gap-1.5" onClick={() => setIsAddModalOpen(true)}>
              <PlusCircle className="w-3.5 h-3.5" /> Tambah Akun
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/60">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">Total Aktiva (1xxx)</span>
            <PriceTag amount={totalAssets} variant="emerald" size="md" />
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">Hutang + Modal (2xxx+3xxx)</span>
            <PriceTag amount={totalLiab + totalEquity} variant="default" size="md" />
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">Persamaan Akuntansi</span>
            <Badge variant={isEquationBalanced ? 'emerald' : 'destructive'} className="gap-1 text-xs">
              <Scale className="w-3 h-3" /> {isEquationBalanced ? 'Balanced (A = L + E)' : 'Imbalance'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <Input placeholder="Cari kode atau nama akun..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-slate-900/80 border-slate-800" />
        </div>
        <div className="space-y-1 bg-slate-950/80 p-2 rounded-2xl border border-slate-800/80">
          {treeData.map((rootNode) => renderAccountNode(rootNode))}
        </div>
      </CardContent>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2"><Plus className="w-5 h-5 text-amber-400" /><h4 className="font-bold text-slate-100 text-sm">Tambah Akun Buku Baru</h4></div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setIsAddModalOpen(false)}><X className="w-4 h-4" /></Button>
            </div>
            <form onSubmit={handleAddAccount} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Kategori Akun</label>
                <select
                  value={newCategory}
                  onChange={(e) => {
                    const cat = e.target.value as AccountCategory
                    setNewCategory(cat)
                    setNewNormalBalance(cat === 'ASSET' || cat === 'COGS' || cat === 'EXPENSE' ? 'DEBIT' : 'CREDIT')
                  }}
                  className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-slate-100"
                >
                  <option value="ASSET">1xxx - Aktiva / Assets</option>
                  <option value="LIABILITY">2xxx - Kewajiban / Liabilities</option>
                  <option value="EQUITY">3xxx - Modal / Equity</option>
                  <option value="REVENUE">4xxx - Pendapatan / Revenue</option>
                  <option value="COGS">5xxx - HPP / Cost of Goods Sold</option>
                  <option value="EXPENSE">6xxx - Beban / Expenses</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Kode Akun</label>
                  <Input placeholder="1140" value={newCode} onChange={(e) => setNewCode(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Saldo Normal</label>
                  <select value={newNormalBalance} onChange={(e) => setNewNormalBalance(e.target.value as 'DEBIT' | 'CREDIT')} className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-slate-100">
                    <option value="DEBIT">Debit (Dr)</option>
                    <option value="CREDIT">Credit (Cr)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Akun</label>
                <Input placeholder="Kas Operasional 2" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Saldo Awal</label>
                <Input type="number" placeholder="0" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="default" size="sm">Simpan Akun</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  )
}
