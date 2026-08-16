import React, { useState, useEffect } from 'react'
import { X, CreditCard, DollarSign, CheckCircle2, AlertCircle, Search, UserCheck } from 'lucide-react'
import { fetchKasbonBalance, settleKasbon, KasbonReceivablesResponse } from '../../services/hfeApi'

export interface KasbonManagementModalProps {
  isOpen: boolean
  onClose: () => void
  customerContactId?: string
}

export const KasbonManagementModal: React.FC<KasbonManagementModalProps> = ({
  isOpen,
  onClose,
  customerContactId = 'CUST-01'
}) => {
  const [contactIdInput, setContactIdInput] = useState<string>(customerContactId)
  const [kasbonData, setKasbonData] = useState<KasbonReceivablesResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [payAmount, setPayAmount] = useState<string>('')
  const [payMethod, setPayMethod] = useState<'cash' | 'qris'>('cash')
  const [settling, setSettling] = useState<boolean>(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const loadBalance = async (cid: string) => {
    setLoading(true)
    try {
      const data = await fetchKasbonBalance(cid)
      setKasbonData(data)
      setPayAmount(data.activeBalance.toString())
    } catch (err) {
      console.error('Failed to load Kasbon balance:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadBalance(contactIdInput)
      setSuccessMsg(null)
    }
  }, [isOpen, contactIdInput])

  if (!isOpen) return null

  const handleSettle = async () => {
    const amountNum = parseInt(payAmount, 10)
    if (isNaN(amountNum) || amountNum <= 0 || !kasbonData) return

    setSettling(true)
    try {
      const res = await settleKasbon(kasbonData.contactId, amountNum, payMethod)
      setKasbonData(prev => prev ? { ...prev, activeBalance: res.remainingBalance } : null)
      setSuccessMsg(`Pelunasan berhasil! Rp ${amountNum.toLocaleString('id-ID')} via ${payMethod.toUpperCase()}`)
      setPayAmount(res.remainingBalance.toString())
    } catch (err) {
      console.error('Kasbon payment failed:', err)
    } finally {
      setSettling(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Buku Kasbon Pelanggan</h2>
              <p className="text-xs text-slate-400">Pencatatan & Pelunasan Piutang Toko Kelontong</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Customer Search / Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">ID / Nama Pelanggan</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={contactIdInput}
                  onChange={(e) => setContactIdInput(e.target.value)}
                  placeholder="Masukkan Contact ID (cth: CUST-01)"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={() => loadBalance(contactIdInput)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" /> Cari
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400 text-sm">Memuat data Kasbon...</div>
          ) : kasbonData ? (
            <>
              {/* Ledger Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white">{kasbonData.customerName}</h3>
                    <p className="text-xs text-slate-400">Telp: {kasbonData.phone}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    kasbonData.activeBalance > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {kasbonData.activeBalance > 0 ? 'Kasbon Aktif' : 'Lunas'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400">Limit Hutang Kasbon</span>
                    <p className="text-sm font-bold text-slate-200">
                      Rp {kasbonData.creditLimit.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Saldo Piutang Aktif</span>
                    <p className="text-sm font-bold text-amber-400">
                      Rp {kasbonData.activeBalance.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-400 pt-1">
                  <span>Jatuh Tempo: <span className="text-slate-200 font-medium">{kasbonData.dueDate}</span></span>
                  <span>Sisa Limit: <span className="text-emerald-400 font-medium">Rp {Math.max(0, kasbonData.creditLimit - kasbonData.activeBalance).toLocaleString('id-ID')}</span></span>
                </div>
              </div>

              {/* Settlement Form */}
              {kasbonData.activeBalance > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300">Form Pelunasan Kasbon</h4>
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Jumlah Pembayaran (Rp)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        placeholder="Jumlah bayar"
                        className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => setPayAmount(kasbonData.activeBalance.toString())}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 rounded-xl"
                      >
                        Pelunasan Penuh
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Metode Pembayaran</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayMethod('cash')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          payMethod === 'cash' ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <DollarSign className="w-4 h-4" /> Tunai / Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod('qris')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          payMethod === 'qris' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" /> QRIS Instant
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSettle}
                    disabled={settling || !payAmount || parseInt(payAmount, 10) <= 0}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {settling ? 'Memproses Pelunasan...' : 'Bayar & Update Buku Kasbon'}
                  </button>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </>
          ) : (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Data Kasbon untuk pelanggan ini tidak ditemukan.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
