import React, { useState, useEffect, useRef } from 'react'
import { Barcode, Search, Trash2, Plus, Minus, CreditCard, DollarSign, BookOpen, CheckCircle2, Calculator } from 'lucide-react'
import { useRetailPricing, RetailProductPriceInfo } from '../hooks/useRetailPricing'
import { lookupBarcode, submitTransaction } from '../services/hfeApi'
import { KasbonManagementModal } from '../components/retail/KasbonManagementModal'

const INITIAL_RETAIL_PRODUCTS: RetailProductPriceInfo[] = [
  { id: 'RET-001', barcode: '8999901', name: 'Minyak Goreng Rose Brand 1L', retailPrice: 22000, wholesalePrice: 19500, wholesaleMinQty: 40, uom: 'Karton' },
  { id: 'RET-002', barcode: '8999902', name: 'Beras Pandan Wangi 5kg', retailPrice: 78000, wholesalePrice: 72000, wholesaleMinQty: 10, uom: 'Pack' },
  { id: 'RET-003', barcode: '8999903', name: 'Gula Pasir Gulaku 1kg', retailPrice: 17500, wholesalePrice: 15800, wholesaleMinQty: 24, uom: 'Dus' },
  { id: 'RET-004', barcode: '8999904', name: 'Indomie Goreng Original 85g', retailPrice: 3200, wholesalePrice: 2850, wholesaleMinQty: 40, uom: 'Karton' },
]

export const RetailPosView: React.FC = () => {
  const {
    retailCart,
    addItemByBarcode,
    updateItemQty,
    clearCart,
    totalCartAmount,
    totalItemCount,
    parseBarcodeSyntax
  } = useRetailPricing()

  const [barcodeInput, setBarcodeInput] = useState<string>('')
  const [cashGiven, setCashGiven] = useState<string>('')
  const [showKasbonModal, setShowKasbonModal] = useState<boolean>(false)
  const [showChangeModal, setShowChangeModal] = useState<boolean>(false)
  const [transactionSuccess, setTransactionSuccess] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const barcodeInputRef = useRef<HTMLInputElement>(null)

  // Shortcut Ctrl+B auto focus barcode input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        barcodeInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcodeInput.trim()) return

    const { qty, barcode } = parseBarcodeSyntax(barcodeInput)
    let foundProduct = INITIAL_RETAIL_PRODUCTS.find(p => p.barcode === barcode)

    if (!foundProduct) {
      const apiItem = await lookupBarcode(barcode)
      if (apiItem) {
        foundProduct = {
          id: apiItem.productId,
          barcode: apiItem.barcode,
          name: apiItem.name,
          retailPrice: apiItem.retailPrice,
          wholesalePrice: apiItem.wholesalePrice,
          wholesaleMinQty: apiItem.wholesaleMinQty,
          uom: apiItem.uom,
        }
      }
    }

    if (foundProduct) {
      addItemByBarcode(foundProduct, qty)
      setBarcodeInput('')
      setTransactionSuccess(null)
    } else {
      alert(`Produk dengan Barcode ${barcode} tidak ditemukan!`)
    }
  }

  const handleCheckoutCash = async () => {
    const cashNum = parseInt(cashGiven, 10)
    if (isNaN(cashNum) || cashNum < totalCartAmount) {
      alert('Uang tunai kurang dari total belanja!')
      return
    }

    const payload = {
      table_id: 'RETAIL-CASHIER-01',
      contact_id: 'CUST-RETAIL-WALKIN',
      policy: 'pay-first' as const,
      items: retailCart.map(i => ({
        product_id: i.id,
        hfe_gl_account: '4-1000-RETAIL-SALES',
        qty: i.quantity,
        price: i.effectiveUnitPrice
      })),
      subtotal: totalCartAmount,
      tax_pb1_amount: 0,
      service_fee_amount: 0,
      discount_amount: 0,
      grand_total: totalCartAmount
    }

    const res = await submitTransaction(payload)
    setTransactionSuccess(`Transaksi Berhasil! ID: ${res.tx_id}. Kembalian: Rp ${(cashNum - totalCartAmount).toLocaleString('id-ID')}`)
    setShowChangeModal(false)
    clearCart()
    setCashGiven('')
  }

  const filteredProducts = INITIAL_RETAIL_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery)
  )

  const cashNum = parseInt(cashGiven, 10) || 0
  const changeAmount = Math.max(0, cashNum - totalCartAmount)

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Barcode Input & Cart */}
      <div className="flex-1 flex flex-col border-r border-slate-800 p-4 space-y-4 overflow-y-auto">
        {/* Header Barcode Scanner Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Barcode className="w-5 h-5 text-amber-400" />
              <h1 className="text-sm font-bold text-white">Kasir Barcode Kelontong Rapid POS</h1>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-700">
              Pintasan: <kbd className="font-bold">Ctrl+B</kbd>
            </span>
          </div>

          <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan / Ketik Barcode (cth: 10*8999901 atau 8999902)..."
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </form>
          <p className="text-[11px] text-slate-400">
            Sintaks cepat: <span className="text-amber-400 font-mono font-bold">JUMLAH*BARCODE</span> (cth: <span className="font-mono">40*8999901</span> langsung isi 40 Pcs / 1 Karton grosir).
          </p>
        </div>

        {/* Transaction Success Banner */}
        {transactionSuccess && (
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{transactionSuccess}</span>
          </div>
        )}

        {/* Cart Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col shadow-lg overflow-hidden">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Daftar Keranjang Belanja ({totalItemCount} item)</h2>
            {retailCart.length > 0 && (
              <button onClick={clearCart} className="text-xs text-rose-400 hover:underline flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Kosongkan
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 my-2">
            {retailCart.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Keranjang masih kosong. Scan barcode barang untuk memulai kasir.
              </div>
            ) : (
              retailCart.map((item) => (
                <div key={item.barcode} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{item.name}</span>
                      {item.isWholesaleApplied && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Grosir ({item.uom})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Barcode: {item.barcode} | @Rp {item.effectiveUnitPrice.toLocaleString('id-ID')}
                      {item.isWholesaleApplied && <span className="text-slate-500 line-through ml-1.5">Rp {item.retailPrice.toLocaleString('id-ID')}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItemQty(item.barcode, item.quantity - 1)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQty(item.barcode, item.quantity + 1)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      Rp {item.subtotalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300">Total Pembayaran Grosir & Ecer:</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                Rp {totalCartAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowChangeModal(true)}
                disabled={retailCart.length === 0}
                className="py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" /> Bayar Tunai & Kembalian
              </button>
              <button
                onClick={() => setShowKasbonModal(true)}
                className="py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Buku Kasbon Pelanggan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Catalog Quick Search */}
      <div className="w-full md:w-80 bg-slate-900/60 p-4 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col gap-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Katalog Produk Kelontong</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama / barcode..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => addItemByBarcode(p, 1)}
              className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white">{p.name}</span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{p.barcode}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Ecer: Rp {p.retailPrice.toLocaleString('id-ID')}</span>
                <span className="text-amber-400 font-bold">Grosir ({p.wholesaleMinQty} Pcs): Rp {p.wholesalePrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Calculator Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <Calculator className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Kalkulator Kembalian Tunai</h3>
            </div>

            <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Belanja:</span>
                <span className="font-bold text-white font-mono">Rp {totalCartAmount.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Uang Diterima (Rp):</label>
                <input
                  type="number"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  placeholder="Masukkan nominal uang..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-800">
                <span className="font-bold text-slate-300">Kembalian:</span>
                <span className="font-bold text-emerald-400 font-mono">Rp {changeAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowChangeModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleCheckoutCash}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold"
              >
                Selesaikan Transaksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kasbon Ledger Modal */}
      <KasbonManagementModal
        isOpen={showKasbonModal}
        onClose={() => setShowKasbonModal(false)}
      />
    </div>
  )
}
