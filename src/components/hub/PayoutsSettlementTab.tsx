import React, { useState } from 'react'
import { Card, Button, Badge, TextInput } from '../../ui'
import { Landmark, ArrowUpRight, Clock, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { FindAndMatchReconciliationModal } from './FindAndMatchReconciliationModal'

interface PayoutRecord {
  id: string
  date: string
  grossAmount: number
  mdrFee: number
  netDisbursed: number
  bankName: string
  accountMasked: string
  status: 'completed' | 'processing' | 'scheduled'
  refNumber: string
}

export function PayoutsSettlementTab() {
  const [balanceReady, setBalanceReady] = useState(14850000)
  const [selectedBank, setSelectedBank] = useState('BCA')
  const [accountNumber, setAccountNumber] = useState('8830-1928-33')
  const [accountHolder, setAccountHolder] = useState('PT Kopi Nusantara Abadi')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showReconciliationModal, setShowReconciliationModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('14850000')
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  const mockHistory: PayoutRecord[] = [
    {
      id: 'PAY-20260820-01',
      date: '2026-08-20 06:00',
      grossAmount: 9500000,
      mdrFee: 28500, // 0.3%
      netDisbursed: 9471500,
      bankName: 'BCA',
      accountMasked: '•••• 2833',
      status: 'completed',
      refNumber: 'BCA-TRX-9821389',
    },
    {
      id: 'PAY-20260819-01',
      date: '2026-08-19 06:00',
      grossAmount: 12200000,
      mdrFee: 36600, // 0.3%
      netDisbursed: 12163400,
      bankName: 'BCA',
      accountMasked: '•••• 2833',
      status: 'completed',
      refNumber: 'BCA-TRX-8712391',
    },
    {
      id: 'PAY-20260818-01',
      date: '2026-08-18 06:00',
      grossAmount: 8400000,
      mdrFee: 25200, // 0.3%
      netDisbursed: 8374800,
      bankName: 'BCA',
      accountMasked: '•••• 2833',
      status: 'completed',
      refNumber: 'BCA-TRX-7612093',
    },
  ]

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBalanceReady(0)
    setWithdrawSuccess(true)
    setTimeout(() => {
      setShowWithdrawModal(false)
      setWithdrawSuccess(false)
    }, 1800)
  }

  const estimatedMdr = Math.round(balanceReady * 0.003)
  const netEstimated = balanceReady - estimatedMdr

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time Settlement Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-950/40 via-background to-background border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
              <Landmark className="w-4 h-4" /> Saldo Siap Cair (Settlement)
            </span>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
              Live
            </Badge>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground tabular-nums my-1">
            Rp {balanceReady.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <span>Estimasi Bersih (Potong MDR 0.3%):</span>
            <span className="font-mono font-semibold text-emerald-400 tabular-nums">
              Rp {netEstimated.toLocaleString('id-ID')}
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" /> Jadwal Auto Payout
            </span>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
              Otomatis H+1
            </Badge>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-foreground tabular-nums my-1">
            Besok, 06:00 WIB
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
            Dana penjualan hari ini langsung masuk ke rekening bank utama tanpa biaya admin transfer.
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Rekening Bank Terdaftar
            </div>
            <div className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                {selectedBank}
              </span>
              <span className="font-mono text-base tabular-nums">{accountNumber}</span>
            </div>
            <div className="text-xs text-muted-foreground truncate">{accountHolder}</div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 text-xs font-semibold"
            onClick={() => setShowWithdrawModal(true)}
            disabled={balanceReady <= 0}
          >
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Tarik Dana Sekarang (Instant)
          </Button>
        </Card>
      </div>

      {/* Split-Screen Find & Match Bank Reconciliation Card (Xero-Style) */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-emerald-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">Rekonsiliasi Bank & QRIS (Find & Match)</h4>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">
                  3 Menunggu Cocok
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pencocokan 2-arah mutasi rekening koran BCA/Mandiri vs Transaksi Kasir POS & Buku Besar Hfe CORE.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowReconciliationModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-lg shadow-emerald-950/50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Buka Find & Match ➔</span>
          </Button>
        </div>
      </Card>

      {/* MDR Transparency Info Box */}
      <Card className="p-4 bg-muted/30 border-dashed">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-foreground">Transparansi Biaya QRIS (MDR 0,30% Bank Indonesia)</div>
            <p className="text-muted-foreground leading-relaxed">
              Seluruh transaksi QRIS dipotong biaya Merchant Discount Rate (MDR) regulasi Bank Indonesia sebesar 0,30% secara transparan dan dijurnal otomatis ke <code>GL 5102 (Beban Administrasi MDR QRIS)</code>. Nol biaya tersembunyi.
            </p>
          </div>
        </div>
      </Card>

      {/* Payout History Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Riwayat Pencairan Dana (Payouts)</h3>
            <p className="text-xs text-muted-foreground">Arsip mutasi pengiriman dana hasil settlement ke rekening bank</p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            3 Pencairan Terakhir
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold">
                <th className="pb-2">ID Transaksi / Waktu</th>
                <th className="pb-2">Rekening Tujuan</th>
                <th className="pb-2 text-right">Nominal Kotor</th>
                <th className="pb-2 text-right">MDR (0.3%)</th>
                <th className="pb-2 text-right">Dana Diterima</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono">
              {mockHistory.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20">
                  <td className="py-3">
                    <div className="font-bold text-foreground">{item.id}</div>
                    <div className="text-[10px] text-muted-foreground font-sans">{item.date} WIB</div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold">{item.bankName}</div>
                    <div className="text-[10px] text-muted-foreground">{item.accountMasked}</div>
                  </td>
                  <td className="py-3 text-right tabular-nums text-foreground">
                    Rp {item.grossAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-right tabular-nums text-rose-400">
                    -Rp {item.mdrFee.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-right tabular-nums font-bold text-emerald-400">
                    Rp {item.netDisbursed.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-sans">
                      {item.status === 'completed' ? '✓ Berhasil' : item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Tarik Dana Instant */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-card border-border shadow-2xl space-y-4">
            {withdrawSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-foreground">Permintaan Pencairan Diterima!</h4>
                <p className="text-xs text-muted-foreground">
                  Dana sebesar <strong className="font-mono text-emerald-400">Rp {netEstimated.toLocaleString('id-ID')}</strong> sedang diproses ke {selectedBank} {accountNumber}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-primary" /> Konfirmasi Pencairan Dana
                  </h4>
                  <button 
                    type="button" 
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowWithdrawModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1">Rekening Tujuan</label>
                    <div className="p-2.5 rounded bg-muted/40 font-mono flex items-center justify-between">
                      <span className="font-bold">{selectedBank}</span>
                      <span>{accountNumber} ({accountHolder})</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-muted-foreground block mb-1">Nominal yang Dicairkan</label>
                    <TextInput 
                      value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="font-mono font-bold text-base"
                    />
                  </div>

                  <div className="p-3 rounded bg-muted/20 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Biaya MDR (0.3%):</span>
                      <span>-Rp {estimatedMdr.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border">
                      <span>Estimasi Diterima:</span>
                      <span className="text-emerald-400">Rp {netEstimated.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowWithdrawModal(false)}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 font-bold bg-primary text-primary-foreground"
                  >
                    Konfirmasi Tarik Dana
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}

      {/* Find & Match Bank Reconciliation Modal */}
      <FindAndMatchReconciliationModal
        isOpen={showReconciliationModal}
        onClose={() => setShowReconciliationModal(false)}
      />
    </div>
  )
}
