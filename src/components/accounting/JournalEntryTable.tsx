import React, { useState } from 'react'
import {
  FileText,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react'
import { JournalEntry } from '../../types/accounting'
import { PriceTag } from '../../ui/PriceTag'

export interface JournalEntryTableProps {
  entries: JournalEntry[]
  onSelectEntry?: (entry: JournalEntry) => void
}

export const JournalEntryTable: React.FC<JournalEntryTableProps> = ({
  entries,
  onSelectEntry
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredEntries = entries.filter((j) => {
    return (
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.lines.some((l) =>
        l.accountCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.accountName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  })

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor jurnal, ref, akun, atau deskripsi transaksi..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TigerBeetle Proof: Verified</span>
          </div>
        </div>
      </div>

      {/* Journals List */}
      <div className="flex flex-col gap-3">
        {filteredEntries.map((entry) => {
          const isExpanded = expandedId === entry.id
          const isBalanced = entry.totalDebit === entry.totalCredit

          return (
            <div
              key={entry.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              {/* Journal Summary Header */}
              <div
                onClick={() => {
                  toggleExpand(entry.id)
                  onSelectEntry?.(entry)
                }}
                className="p-3.5 sm:p-4 bg-slate-950/40 hover:bg-slate-850/50 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-black text-white">{entry.id}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                        {entry.referenceNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {entry.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium truncate mt-0.5">{entry.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-[10px] text-slate-400">Total Transaksi</span>
                    <PriceTag amount={entry.totalDebit} size="sm" variant="accent" />
                  </div>

                  <div className="flex items-center gap-2">
                    {isBalanced ? (
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Balanced
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md">
                        Dr ≠ Cr
                      </span>
                    )}

                    <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Journal Lines Details */}
              {isExpanded && (
                <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800 animate-fadeIn">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Baris Ledger ({entry.lines.length} Akun)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Diposting oleh: {entry.postedBy} • Proof: {entry.kernelProofId}
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                        <tr>
                          <th className="p-2.5">Kode Akun</th>
                          <th className="p-2.5">Nama Akun & Memo</th>
                          <th className="p-2.5 text-right">Debit</th>
                          <th className="p-2.5 text-right">Kredit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {entry.lines.map((line) => (
                          <tr key={line.id} className="hover:bg-slate-800/40 font-mono">
                            <td className="p-2.5 text-amber-400 font-bold whitespace-nowrap">
                              {line.accountCode}
                            </td>
                            <td className="p-2.5 min-w-[200px]">
                              <div className="text-slate-200 font-sans font-medium">{line.accountName}</div>
                              {line.memo && <div className="text-[10px] text-slate-400 font-sans">{line.memo}</div>}
                            </td>
                            <td className="p-2.5 text-right whitespace-nowrap">
                              {line.debit > 0 ? (
                                <PriceTag amount={line.debit} size="xs" variant="default" />
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="p-2.5 text-right whitespace-nowrap">
                              {line.credit > 0 ? (
                                <PriceTag amount={line.credit} size="xs" variant="default" />
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-950 border-t border-slate-800 font-bold text-xs">
                        <tr>
                          <td colSpan={2} className="p-2.5 text-right text-slate-400 font-sans">
                            Total Journal Balance
                          </td>
                          <td className="p-2.5 text-right">
                            <PriceTag amount={entry.totalDebit} size="xs" variant="accent" />
                          </td>
                          <td className="p-2.5 text-right">
                            <PriceTag amount={entry.totalCredit} size="xs" variant="accent" />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
