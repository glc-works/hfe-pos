import React, { useState } from 'react'
import { Zap, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw, Terminal } from 'lucide-react'

export interface BankFeedSimulatorProps {
  initialBank?: string
}

export const BankFeedSimulator: React.FC<BankFeedSimulatorProps> = ({ initialBank = 'BCA' }) => {
  const [bank, setBank] = useState<string>(initialBank)
  const [direction, setDirection] = useState<'CR' | 'DB'>('CR')
  const [amount, setAmount] = useState<string>('1500000')
  const [currency, setCurrency] = useState<string>('IDR')
  const [remark, setRemark] = useState<string>('Transfer In from Customer PT Maju Jaya')
  const [result, setResult] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)

  const handleSimulate = () => {
    setIsSimulating(true)
    const numAmt = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
    const minorUnits = currency === 'IDR' ? Math.round(numAmt) : Math.round(numAmt * 100)

    const directionEnum = direction === 'CR' ? 'InboundCredit' : 'OutboundDebit'
    const ledgerAccount =
      direction === 'CR' ? '1110.01 - Bank Central Asia (IDR)' : '2110.01 - Accounts Payable'
    const contraAccount =
      direction === 'CR' ? '1120.01 - Accounts Receivable' : '1110.01 - Bank Central Asia (IDR)'

    setTimeout(() => {
      setResult({
        normalized_feed_event: {
          account_id: '01918a22-4412-7890-bcde-000000000001',
          external_bank_reference: `${bank}-TRX-${Math.floor(100000000 + Math.random() * 900000000)}`,
          direction: directionEnum,
          minor_unit_amount: minorUnits,
          currency: currency,
          formatted_amount: `${currency} ${numAmt.toLocaleString('id-ID')}`,
          transaction_date: new Date().toISOString(),
          raw_remark: remark
        },
        journal_posting_preview: {
          journal_type: 'BankStatementIngestion',
          lines: [
            {
              account: ledgerAccount,
              debit: direction === 'CR' ? minorUnits : 0,
              credit: direction === 'DB' ? minorUnits : 0
            },
            {
              account: contraAccount,
              debit: direction === 'DB' ? minorUnits : 0,
              credit: direction === 'CR' ? minorUnits : 0
            }
          ],
          balanced: true,
          integrity_proof: 'VALIDATED_TIGERBEETLE_READY'
        }
      })
      setIsSimulating(false)
    }, 200)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-400" />
            <span>Interactive SNAP BI &amp; Open Banking Statement Normalizer Simulator</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Uji normalisasi real-time mutasi rekening bank menjadi posting jurnal debet/kredit balance.
          </div>
        </div>
        <button
          type="button"
          onClick={handleSimulate}
          disabled={isSimulating}
          className="py-1.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          {isSimulating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5" />
          )}
          <span>{isSimulating ? 'Processing...' : 'Run Normalizer Simulation'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3.5">
          <div className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>1. Inbound Bank Payload (SNAP BI / ISO 20022)</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Bank Provider (SNAP BI API)
              </label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500"
              >
                <option value="BCA">Bank Central Asia (BCA KlikBCA SNAP)</option>
                <option value="MANDIRI">Bank Mandiri (MCM 2.0 SNAP)</option>
                <option value="BRI">Bank Rakyat Indonesia (BRIAPI SNAP)</option>
                <option value="BNI">Bank Negara Indonesia (BNI Direct SNAP)</option>
                <option value="JAGO">Bank Jago Bisnis (Open API)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Mutasi (CR/DB)
                </label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as 'CR' | 'DB')}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                >
                  <option value="CR">CR (Credit / Inbound)</option>
                  <option value="DB">DB (Debit / Outbound)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Nominal Mutasi
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1500000"
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                  />
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-16 bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-xs text-center rounded-lg px-2 py-2 outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Keterangan Transaksi (Raw Remark)
              </label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Contoh: Transfer In from Customer..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Output Payload Preview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Standardized Feed &amp; Double-Entry Preview</span>
              </span>
              {result && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  100% BALANCED
                </span>
              )}
            </div>

            <pre className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-sky-400 overflow-x-auto max-h-[220px]">
              {result
                ? JSON.stringify(result, null, 2)
                : `// Klik "Run Normalizer Simulation" untuk melihat hasil parsing JSON`}
            </pre>
          </div>

          {result && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="text-slate-400">Status Integritas Ledger:</div>
              <div className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>TigerBeetle Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
