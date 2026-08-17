import React, { useState, useEffect } from 'react'
import {
  Zap,
  Activity,
  Server,
  Receipt,
  FileCheck2,
  CheckCircle2,
  Building,
  RefreshCw,
  TrendingUp,
  CreditCard,
  Layers,
  ArrowRight
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  PriceTag
} from '@/ui'

export interface MeteringMetric {
  id: string
  label: string
  volume: number
  unitRateRp: number
  subtotalRp: number
  category: string
}

export const WholesaleBillingInspector: React.FC = () => {
  const [liveMutationCounter, setLiveMutationCounter] = useState<number>(2845920)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedInvoiceNo, setGeneratedInvoiceNo] = useState<string | null>(null)
  const [isPostedToLedger, setIsPostedToLedger] = useState<boolean>(false)

  // Simulate tick of real-time mutations
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMutationCounter((prev) => prev + Math.floor(Math.random() * 4) + 1)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  const posVolume = 1200000
  const tbVolume = 950000
  const kdsVolume = liveMutationCounter - posVolume - tbVolume

  const metrics: MeteringMetric[] = [
    {
      id: 'pos-events',
      label: 'POS Checkout & QRIS Transactions',
      volume: posVolume,
      unitRateRp: 15,
      subtotalRp: posVolume * 15,
      category: 'Transactions'
    },
    {
      id: 'tb-transfers',
      label: 'TigerBeetle Double-Entry Postings',
      volume: tbVolume,
      unitRateRp: 25,
      subtotalRp: tbVolume * 25,
      category: 'Financial Ledger'
    },
    {
      id: 'kds-relays',
      label: 'Kitchen KDS WebSocket Relays',
      volume: kdsVolume,
      unitRateRp: 10,
      subtotalRp: kdsVolume * 10,
      category: 'Realtime Infrastructure'
    }
  ]

  const totalWholesaleBill = metrics.reduce((acc, m) => acc + m.subtotalRp, 0)

  const handleGenerateInvoice = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const invNo = `INV-2026-WS-${Date.now().toString().slice(-6)}-T02`
      setGeneratedInvoiceNo(invNo)
      setIsPostedToLedger(true)
      setIsGenerating(false)
    }, 800)
  }

  const handleResetInvoice = () => {
    setGeneratedInvoiceNo(null)
    setIsPostedToLedger(false)
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto text-slate-100">
      {/* HEADER STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Super-Admin B2B Wholesale Compute Metering
                </h2>
                <Badge variant="indigo">Pillar 2: Multi-Tenant Core</Badge>
              </div>
              <p className="text-xs text-slate-400">
                Pemantauan kuota mutasi API &amp; penagihan otomatis antar-tenant (Tenant 01 Platform vs Tenant 02 Merchant).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>METERING ENGINE ONLINE</span>
          </div>
        </div>
      </div>

      {/* TENANT 02 METADATA BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Tenant 02: PT Kopi Megah Nusantara (Enterprise)</span>
              <Badge variant="default">Tier-3 Wholesale Ultra</Badge>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              12 Outlet Cabang • Central Roastery • SLA Uptime 99.99% (&lt;12ms p99)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Volume Mutasi Berjalan</div>
            <div className="text-xl font-black font-mono text-amber-400 tabular-nums">
              {liveMutationCounter.toLocaleString('id-ID')} calls
            </div>
          </div>
        </div>
      </div>

      {/* METERING BREAKDOWN TABLE */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          Rincian Konsumsi Compute API &amp; Ledger Mutations (Siklus 30 Hari)
        </h3>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                <th className="p-3.5 font-sans">Layanan Compute / API Pipeline</th>
                <th className="p-3.5 text-right">Volume Mutasi</th>
                <th className="p-3.5 text-right">Tarif Satuan (Rp)</th>
                <th className="p-3.5 text-right">Subtotal Tagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {metrics.map((m) => (
                <tr key={m.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3.5 font-sans">
                    <div className="font-bold text-white">{m.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{m.category}</div>
                  </td>
                  <td className="p-3.5 text-right tabular-nums text-white font-bold">
                    {m.volume.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right tabular-nums text-amber-300">
                    Rp {m.unitRateRp.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right tabular-nums font-bold text-emerald-400">
                    Rp {m.subtotalRp.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-950/80 font-bold text-white border-t border-slate-700">
                <td className="p-3.5 font-sans">TOTAL TAGIHAN WHOLESALE COMPUTE (BULANAN)</td>
                <td className="p-3.5 text-right tabular-nums text-amber-400">
                  {liveMutationCounter.toLocaleString('id-ID')}
                </td>
                <td className="p-3.5 text-right text-slate-400 font-sans font-normal text-[11px]">Blended Rate</td>
                <td className="p-3.5 text-right tabular-nums text-emerald-400 text-sm">
                  Rp {totalWholesaleBill.toLocaleString('id-ID')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DUAL-LEDGER POSTING SUMMARY & INVOICE GENERATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DUAL-LEDGER JOURNAL SUMMARY */}
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-purple-400" />
              Skema Dual-Ledger TigerBeetle Antar-Tenant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="text-indigo-400 font-bold font-sans text-xs">
                [Tenant 01: Platform HoldCo Book]
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>[DR] 1200 Piutang Inter-Tenant (Tenant 02)</span>
                <span className="tabular-nums">Rp {totalWholesaleBill.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400 pl-3">
                <span>[CR] 4100 Pendapatan SaaS &amp; Compute</span>
                <span className="tabular-nums">Rp {totalWholesaleBill.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="text-amber-400 font-bold font-sans text-xs">
                [Tenant 02: Merchant Chain Book]
              </div>
              <div className="flex justify-between text-rose-400">
                <span>[DR] 5300 Beban SaaS &amp; Cloud Infrastructure</span>
                <span className="tabular-nums">Rp {totalWholesaleBill.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-400 pl-3">
                <span>[CR] 2100 Utang Inter-Tenant (Tenant 01)</span>
                <span className="tabular-nums">Rp {totalWholesaleBill.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* INVOICE ACTION PANEL */}
        <Card className="bg-slate-900/80 border-slate-800 flex flex-col justify-between">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              Generator Invoice Siklus Day-30
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Menerbitkan faktur resmi B2B dan mengeksekusi transfer jurnal ganda otomatis.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-0 space-y-4">
            {isPostedToLedger && generatedInvoiceNo ? (
              <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-4 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Invoice Berhasil Diterbitkan &amp; Diposting!</span>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Nomor Faktur: <span className="text-white font-bold">{generatedInvoiceNo}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Status: Post-Settlement Dual Ledger Active
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={handleResetInvoice} className="text-xs">
                    <RefreshCw className="w-3 h-3 mr-1" /> Reset Generator
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-slate-300">
                  <span>Total Tagihan Periode:</span>
                  <PriceTag amount={totalWholesaleBill} size="lg" variant="accent" />
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Menekan tombol di bawah akan mengunci kuota metering bulan ini dan membukukan piutang pada Tenant 01 serta utang pada Tenant 02.
                </div>
                <Button
                  variant="default"
                  size="default"
                  onClick={handleGenerateInvoice}
                  disabled={isGenerating}
                  className="w-full gap-2 text-xs"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Menerbitkan &amp; Dual-Posting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Generate Wholesale Day-30 Invoice
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
