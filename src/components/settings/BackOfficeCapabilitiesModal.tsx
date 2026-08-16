import React, { useState } from 'react'
import { X, ShoppingBag, Receipt, Package, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import { submitPurchaseOrder, submitExpenseClaim, saveProductMaster, PurchaseOrderPayload, ExpenseClaimPayload } from '../../services/hfeApi'
import { MenuItem } from '../../types/pos'

interface Props {
  isOpen: boolean
  onClose: () => void
  bookId?: string
}

type TabType = 'purchase' | 'expense' | 'product'

export const BackOfficeCapabilitiesModal: React.FC<Props> = ({ isOpen, onClose, bookId = 'BOOK-CAFE-HQ-88' }) => {
  const [activeTab, setActiveTab] = useState<TabType>('purchase')
  const [loading, setLoading] = useState<boolean>(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // PO Form State
  const [poNumber, setPoNumber] = useState(`PO-${Date.now().toString().slice(-6)}`)
  const [supplierName, setSupplierName] = useState('PT Kopi Nusantara Jaya')
  const [itemName, setItemName] = useState('Biji Kopi Arabica Gayo 1kg')
  const [itemQty, setItemQty] = useState<number>(10)
  const [unitCost, setUnitCost] = useState<number>(150000)
  const [poGlAccount, setPoGlAccount] = useState('5100-PERSEDIAAN-KOPI')

  // Expense Form State
  const [expenseCategory, setExpenseCategory] = useState('OPERASIONAL_KAS_KECIL')
  const [expenseAmount, setExpenseAmount] = useState<number>(75000)
  const [beneficiaryName, setBeneficiaryName] = useState('Kasir Pagi (Siti)')
  const [expenseDesc, setExpenseDesc] = useState('Pembelian Air Galon Isi Ulang 5 Btl')

  // Product Form State
  const [prodName, setProdName] = useState('')
  const [prodCategory, setProdCategory] = useState('Coffee')
  const [prodPrice, setProdPrice] = useState<number>(35000)
  const [prodGlAccount, setProdGlAccount] = useState('4100-PENJUALAN-KOPI')

  if (!isOpen) return null

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMsg(null)
    try {
      const payload: PurchaseOrderPayload = {
        poNumber,
        supplierName,
        items: [{ productName: itemName, qty: Number(itemQty), unitCost: Number(unitCost) }],
        totalAmount: Number(itemQty) * Number(unitCost),
        glAccount: poGlAccount,
      }
      const res = await submitPurchaseOrder(payload, bookId)
      if (res.success) {
        setStatusMsg({ type: 'success', text: `PO Supplier #${res.po_id} berhasil dicatat ke HCB Core REST API!` })
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err?.message || 'Gagal menyimpan PO Supplier.' })
    } finally {
      setLoading(false)
    }
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMsg(null)
    try {
      const payload: ExpenseClaimPayload = {
        expenseCategory,
        amount: Number(expenseAmount),
        beneficiaryName,
        description: expenseDesc,
      }
      const res = await submitExpenseClaim(payload, bookId)
      if (res.success) {
        setStatusMsg({ type: 'success', text: `Klaim pengeluaran #${res.expense_id} berhasil disinkronkan!` })
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err?.message || 'Gagal mencatat klaim pengeluaran.' })
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prodName.trim()) {
      setStatusMsg({ type: 'error', text: 'Nama produk wajib diisi.' })
      return
    }
    setLoading(true)
    setStatusMsg(null)
    try {
      const newProd: MenuItem = {
        id: `PROD-${Date.now().toString().slice(-4)}`,
        name: prodName,
        category: prodCategory,
        hfeCategoryCode: prodCategory.toUpperCase(),
        hfeGlAccount: prodGlAccount,
        price: Number(prodPrice),
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&h=300&fit=crop',
        description: 'Produk Master Baru HCB Back-Office',
      }
      const res = await saveProductMaster(newProd, bookId)
      if (res.success) {
        setStatusMsg({ type: 'success', text: `Master Produk [${newProd.name}] (ID: ${res.product_id}) berhasil disimpan!` })
        setProdName('')
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err?.message || 'Gagal menyimpan produk master.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Capability Back-Office Integrasi HCB</h3>
              <p className="text-xs text-slate-400">PO Supplier, Pengeluaran Kas Kecil & Master Produk REST API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-3 bg-slate-950/60 p-2 border-b border-slate-800 text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => { setActiveTab('purchase'); setStatusMsg(null); }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'purchase' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>PO Supplier</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('expense'); setStatusMsg(null); }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'expense' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Kas Kecil Expense</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('product'); setStatusMsg(null); }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'product' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Master Produk</span>
          </button>
        </div>

        {/* Notification Status */}
        {statusMsg && (
          <div className={`px-6 py-2.5 text-xs font-medium flex items-center gap-2 border-b ${
            statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PO SUPPLIER */}
          {activeTab === 'purchase' && (
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor PO</label>
                  <input
                    type="text"
                    required
                    value={poNumber}
                    onChange={e => setPoNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Supplier</label>
                  <input
                    type="text"
                    required
                    value={supplierName}
                    onChange={e => setSupplierName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Barang / Bahan Baku</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kuantitas (Qty)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={itemQty}
                    onChange={e => setItemQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={unitCost}
                    onChange={e => setUnitCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">HFE GL Account Buku Besar</label>
                <input
                  type="text"
                  required
                  value={poGlAccount}
                  onChange={e => setPoGlAccount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Biaya PO Supplier:</span>
                <span className="text-amber-400 font-bold text-sm">Rp {(Number(itemQty) * Number(unitCost)).toLocaleString('id-ID')}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {loading ? 'Mengirim PO...' : 'Simpan & Kirim PO Supplier ke REST API'}
              </button>
            </form>
          )}

          {/* TAB 2: EXPENSE CLAIM */}
          {activeTab === 'expense' && (
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Pengeluaran</label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="OPERASIONAL_KAS_KECIL">Operasional Kas Kecil (Supplies)</option>
                  <option value="UTILITY_ELECTRICITY">Listrik & Utilitas Cafe</option>
                  <option value="REFRESHMENT_AIR_GAS">Refill Air Galon / Gas LPG</option>
                  <option value="SPOILAGE_DISCARD">Beban Spoilage / Bahan Rusak</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nominal Pengeluaran (Rp)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Penerima / Staf Penanggung Jawab</label>
                  <input
                    type="text"
                    required
                    value={beneficiaryName}
                    onChange={e => setBeneficiaryName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi / Catatan Pengeluaran</label>
                <textarea
                  required
                  rows={2}
                  value={expenseDesc}
                  onChange={e => setExpenseDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {loading ? 'Mencatat...' : 'Catat Pengeluaran Kas Kecil'}
              </button>
            </form>
          )}

          {/* TAB 3: PRODUCT MASTER CRUD */}
          {activeTab === 'product' && (
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Produk Baru</label>
                <input
                  type="text"
                  required
                  placeholder="Matcha Oat Latte Cold"
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Produk</label>
                  <select
                    value={prodCategory}
                    onChange={e => setProdCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Non-Coffee">Non-Coffee</option>
                    <option value="Pastry">Pastry</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodPrice}
                    onChange={e => setProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">HFE GL Revenue Account</label>
                <input
                  type="text"
                  required
                  value={prodGlAccount}
                  onChange={e => setProdGlAccount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Tambah Master Produk Baru'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
