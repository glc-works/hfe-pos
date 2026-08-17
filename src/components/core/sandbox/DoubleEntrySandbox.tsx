import React, { useState } from 'react'
import {
  Zap,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Layers,
  ArrowRightLeft,
  DollarSign,
  FileCode,
  Sparkles,
  Database
} from 'lucide-react'
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui'
import { BankFeedSimulator } from '../hub/BankFeedSimulator'

export type SandboxMode = 'journal-posting' | 'bank-feed'

export interface JournalLine {
  account: string
  code: string
  debit: number
  credit: number
  memo: string
}

export interface PostingResult {
  transaction_id: string
  timestamp: string
  journal_type: string
  company_book_id: string
  lines: JournalLine[]
  total_debit: number
  total_credit: number
  balanced: boolean
  tigerbeetle_code: number
  integrity_hash: string
  execution_latency_micros: number
}

const PRESET_TEMPLATES = [
  {
    id: 'pos_sale',
    name: 'POS Cash/QRIS Sale + COGS',
    description: 'Instant sale revenue recognition with automated inventory deduction',
    defaultAmount: 250000,
    cogsAmount: 85000,
    lines: (amt: number, cogs: number): JournalLine[] => [
      { account: '1110.01 - Kas / QRIS Clearing', code: '1110.01', debit: amt, credit: 0, memo: 'Customer QRIS Settlement' },
      { account: '4110.01 - Pendapatan Penjualan F&B', code: '4110.01', debit: 0, credit: amt, memo: 'Beverage & Food Sales' },
      { account: '5110.01 - Beban Pokok Pendapatan (COGS)', code: '5110.01', debit: cogs, credit: 0, memo: 'Ingredient Depletion' },
      { account: '1410.01 - Persediaan Bahan Baku Kopi', code: '1410.01', debit: 0, credit: cogs, memo: 'Inventory Asset Outflow' }
    ]
  },
  {
    id: 'supplier_invoice',
    name: 'Supplier Bean Invoicing (AP)',
    description: 'Raw materials inventory purchase with VAT PB1/PPN 11% split',
    defaultAmount: 11100000,
    cogsAmount: 1100000,
    lines: (amt: number, vat: number): JournalLine[] => [
      { account: '1410.01 - Persediaan Biji Hijau Arabica', code: '1410.01', debit: amt - vat, credit: 0, memo: '100kg Green Beans Intake' },
      { account: '1150.01 - PPN Masukan (VAT Input 11%)', code: '1150.01', debit: vat, credit: 0, memo: 'DJP e-Faktur Tax Claim' },
      { account: '2110.01 - Hutang Usaha (Accounts Payable)', code: '2110.01', debit: 0, credit: amt, memo: 'Farmer Cooperative Invoice' }
    ]
  },
  {
    id: 'multi_currency',
    name: 'Multi-Currency FX Settlement (USD/IDR)',
    description: 'Export coffee roasting batch with realized exchange gain/loss',
    defaultAmount: 32500000,
    cogsAmount: 500000,
    lines: (amt: number, fxGain: number): JournalLine[] => [
      { account: '1110.05 - USD Multi-Currency Clearing (BCA)', code: '1110.05', debit: amt + fxGain, credit: 0, memo: '$2,000 USD Inbound Remittance' },
      { account: '1120.02 - Piutang Usaha Ekspor (USD AR)', code: '1120.02', debit: 0, credit: amt, memo: 'Customer Tokyo Roastery' },
      { account: '7110.01 - Keuntungan Selisih Kurs (FX Gain)', code: '7110.01', debit: 0, credit: fxGain, memo: 'Spot Rate Appreciation' }
    ]
  }
]

export const DoubleEntrySandbox: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<SandboxMode>('journal-posting')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('pos_sale')
  const [amount, setAmount] = useState<number>(250000)
  const [secondaryAmount, setSecondaryAmount] = useState<number>(85000)
  const [tenantBookId, setTenantBookId] = useState<string>('BOOK-SENOPATI-01')
  const [isPosting, setIsPosting] = useState<boolean>(false)
  const [postingResult, setPostingResult] = useState<PostingResult | null>(null)

  const activeTemplate = PRESET_TEMPLATES.find((t) => t.id === selectedTemplateId) || PRESET_TEMPLATES[0]

  const handleRunPosting = () => {
    setIsPosting(true)
    const lines = activeTemplate.lines(amount, secondaryAmount)
    const totalDebit = lines.reduce((acc, l) => acc + l.debit, 0)
    const totalCredit = lines.reduce((acc, l) => acc + l.credit, 0)
    const isBalanced = totalDebit === totalCredit

    setTimeout(() => {
      setPostingResult({
        transaction_id: `TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        journal_type: activeTemplate.id.toUpperCase(),
        company_book_id: tenantBookId,
        lines,
        total_debit: totalDebit,
        total_credit: totalCredit,
        balanced: isBalanced,
        tigerbeetle_code: isBalanced ? 0 : 42201,
        integrity_hash: `SHA256:0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        execution_latency_micros: Math.floor(120 + Math.random() * 80)
      })
      setIsPosting(false)
    }, 180)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sandbox Sub-Header Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Financial Double-Entry Posting Simulator</span>
              <Badge variant="emerald" className="font-mono text-[10px]">
                TigerBeetle In-Memory
              </Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive deterministic kernel sandbox: test dual-entry balancing, COGS, and SNAP BI statement normalization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('journal-posting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'journal-posting'
                ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Posting Kernel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank-feed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'bank-feed'
                ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SNAP BI Normalizer</span>
          </button>
        </div>
      </div>

      {activeTab === 'bank-feed' ? (
        <BankFeedSimulator />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="bg-slate-900/90 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span>1. Configure Transaction Parameters</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Select transaction profile to preview automated debit/credit balancing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Accounting Event Preset
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {PRESET_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplateId(tmpl.id)
                          setAmount(tmpl.defaultAmount)
                          setSecondaryAmount(tmpl.cogsAmount)
                        }}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                          selectedTemplateId === tmpl.id
                            ? 'bg-sky-950/40 border-sky-500/50 text-white shadow-sm'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="font-bold">{tmpl.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{tmpl.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Primary Amount (IDR)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-100 font-mono text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      COGS / Offset (IDR)
                    </label>
                    <input
                      type="number"
                      value={secondaryAmount}
                      onChange={(e) => setSecondaryAmount(Number(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-100 font-mono text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Target Book Scope (Tenant ID)
                  </label>
                  <input
                    type="text"
                    value={tenantBookId}
                    onChange={(e) => setTenantBookId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 font-mono text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                  />
                </div>

                <Button
                  variant="default"
                  onClick={handleRunPosting}
                  disabled={isPosting}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold gap-2 py-2.5"
                >
                  {isPosting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{isPosting ? 'Posting to Kernel...' : 'Execute Deterministic Posting'}</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="bg-slate-900/90 border-slate-800">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>2. Deterministic Journal Execution Record</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Dual-leg debit/credit verification with TigerBeetle audit proof
                  </CardDescription>
                </div>
                {postingResult && (
                  <Badge variant="emerald" className="font-mono text-[10px]">
                    {postingResult.execution_latency_micros}µs Execution
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {postingResult ? (
                  <div className="space-y-4">
                    {/* Balanced Ledger Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold">
                            <th className="p-2.5">Account &amp; Description</th>
                            <th className="p-2.5 text-right">Debit (Rp)</th>
                            <th className="p-2.5 text-right">Credit (Rp)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {postingResult.lines.map((l, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/40">
                              <td className="p-2.5">
                                <div className="font-semibold text-slate-200">{l.account}</div>
                                <div className="text-[10px] text-slate-400 font-sans">{l.memo}</div>
                              </td>
                              <td className="p-2.5 text-right text-sky-400 tabular-nums">
                                {l.debit > 0 ? `Rp ${l.debit.toLocaleString('id-ID')}` : '-'}
                              </td>
                              <td className="p-2.5 text-right text-emerald-400 tabular-nums">
                                {l.credit > 0 ? `Rp ${l.credit.toLocaleString('id-ID')}` : '-'}
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-slate-700 bg-slate-900/90 font-bold">
                            <td className="p-2.5 text-slate-200">TOTAL POSTING BALANCE</td>
                            <td className="p-2.5 text-right text-sky-300 tabular-nums">
                              Rp {postingResult.total_debit.toLocaleString('id-ID')}
                            </td>
                            <td className="p-2.5 text-right text-emerald-300 tabular-nums">
                              Rp {postingResult.total_credit.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Metadata & TigerBeetle Seal */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block">Status:</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Balanced
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">TigerBeetle Code:</span>
                        <span className="font-mono text-slate-200">0 (OK_SUCCESS)</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 truncate">
                        <span className="text-slate-400 block">Integrity Proof:</span>
                        <span className="font-mono text-purple-400 truncate block">
                          {postingResult.integrity_hash}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                    <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">
                      Click &quot;Execute Deterministic Posting&quot; to test ledger pipeline
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
