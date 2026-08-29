import React, { useState } from 'react'
import {
  Search,
  Plus,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Percent,
  SlidersHorizontal,
  DollarSign,
  Coffee,
  ShoppingBag,
  Sparkles,
  Layers,
  Edit3,
  Trash2,
  Check,
  X
} from 'lucide-react'
import { Button, Badge, Card, TextInput } from '@/ui'

export interface ProductCatalogItem {
  id: string
  sku: string
  name: string
  category: string
  type: 'food_beverage' | 'retail_merch' | 'service'
  price: number
  unitCost: number
  isAvailable: boolean
  isTaxable: boolean
  variants?: { name: string; priceDiff: number }[]
  bomRecipe?: { ingredientName: string; qty: number; unit: string }[]
}

const INITIAL_PRODUCTS: ProductCatalogItem[] = [
  {
    id: 'PRD-001',
    sku: 'BEV-ESPR-01',
    name: 'Espresso Aren Latte',
    category: 'Minuman Kopi',
    type: 'food_beverage',
    price: 28000,
    unitCost: 9200,
    isAvailable: true,
    isTaxable: true,
    variants: [
      { name: 'Reguler (250ml)', priceDiff: 0 },
      { name: 'Large (500ml)', priceDiff: 6000 }
    ],
    bomRecipe: [
      { ingredientName: 'Biji Kopi House Blend Arabica', qty: 18, unit: 'Gram' },
      { ingredientName: 'Oat Milk Barista Edition', qty: 150, unit: 'Ml' }
    ]
  },
  {
    id: 'PRD-002',
    sku: 'BEV-JAP-01',
    name: 'Japanese Iced Drip Coffee',
    category: 'Manual Brew',
    type: 'food_beverage',
    price: 35000,
    unitCost: 11000,
    isAvailable: true,
    isTaxable: true,
    bomRecipe: [
      { ingredientName: 'Biji Kopi House Blend Arabica', qty: 15, unit: 'Gram' }
    ]
  },
  {
    id: 'PRD-003',
    sku: 'MER-TSHIRT-01',
    name: 'Kopi Nusantara Official T-Shirt',
    category: 'Merchandise Retail',
    type: 'retail_merch',
    price: 149000,
    unitCost: 65000,
    isAvailable: true,
    isTaxable: false,
    variants: [
      { name: 'Size S / M', priceDiff: 0 },
      { name: 'Size L / XL', priceDiff: 10000 }
    ]
  },
  {
    id: 'PRD-004',
    sku: 'SRV-ROAST-01',
    name: 'Jasa Custom Roasting Beans (1kg)',
    category: 'Layanan Jasa',
    type: 'service',
    price: 45000,
    unitCost: 5000,
    isAvailable: true,
    isTaxable: false
  }
]

export const ProductCatalogManagementTab: React.FC = () => {
  const [products, setProducts] = useState<ProductCatalogItem[]>(INITIAL_PRODUCTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductCatalogItem | null>(null)

  // Form State for Adding / Editing
  const [formName, setFormName] = useState('')
  const [formSku, setFormSku] = useState('')
  const [formCategory, setFormCategory] = useState('Minuman Kopi')
  const [formPrice, setFormPrice] = useState('28000')
  const [formUnitCost, setFormUnitCost] = useState('9000')

  const categories = ['all', 'Minuman Kopi', 'Manual Brew', 'Merchandise Retail', 'Layanan Jasa']

  const filteredProducts = products.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory
    return matchSearch && matchCat
  })

  const toggleAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    )
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setFormName('')
    setFormSku(`PRD-${Math.floor(100 + Math.random() * 900)}`)
    setFormCategory('Minuman Kopi')
    setFormPrice('25000')
    setFormUnitCost('8000')
    setIsModalOpen(true)
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseInt(formPrice.replace(/\D/g, ''), 10) || 0
    const costNum = parseInt(formUnitCost.replace(/\D/g, ''), 10) || 0

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: formName, sku: formSku, category: formCategory, price: priceNum, unitCost: costNum }
            : p
        )
      )
    } else {
      const newProduct: ProductCatalogItem = {
        id: `PRD-00${products.length + 1}`,
        sku: formSku,
        name: formName,
        category: formCategory,
        type: formCategory === 'Layanan Jasa' ? 'service' : formCategory === 'Merchandise Retail' ? 'retail_merch' : 'food_beverage',
        price: priceNum,
        unitCost: costNum,
        isAvailable: true,
        isTaxable: true
      }
      setProducts((prev) => [newProduct, ...prev])
    }
    setIsModalOpen(false)
  }

  const formatIdr = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3.5 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari produk / SKU / jasa..."
              className="pl-8 pr-3 py-1.5 text-xs bg-background border border-border text-foreground rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none w-52 sm:w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-background border border-border text-foreground rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'Semua Kategori' : c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Tambah Produk / Jasa</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                <th className="py-3 px-4">Produk / Layanan</th>
                <th className="py-3 px-3">Kategori & Tipe</th>
                <th className="py-3 px-3 text-right">Harga Jual</th>
                <th className="py-3 px-3 text-right">HPP (Cost)</th>
                <th className="py-3 px-3 text-center">Margin Laba</th>
                <th className="py-3 px-3 text-center">Status (86-ing)</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredProducts.map((p) => {
                const marginPct = p.price > 0 ? Math.round(((p.price - p.unitCost) / p.price) * 100) : 0
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        {p.type === 'service' ? (
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        ) : (
                          <Coffee className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{p.name}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        SKU: {p.sku} {p.variants ? `• ${p.variants.length} Varian` : ''}
                      </div>
                      {p.bomRecipe && (
                        <div className="text-[10px] text-amber-500/90 font-mono mt-0.5 flex items-center gap-1">
                          <Layers className="w-3 h-3" /> Resep: {p.bomRecipe.map((b) => `${b.qty}${b.unit} ${b.ingredientName.split(' ')[0]}`).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg bg-muted text-foreground text-[11px] font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-foreground">
                      {formatIdr(p.price)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">
                      {formatIdr(p.unitCost)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono ${
                          marginPct >= 60
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : marginPct >= 30
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        {marginPct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(p.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                          p.isAvailable
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        {p.isAvailable ? '🟢 Aktif Jual' : '🔴 Kosong (86)'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(p)
                          setFormName(p.name)
                          setFormSku(p.sku)
                          setFormCategory(p.category)
                          setFormPrice(p.price.toString())
                          setFormUnitCost(p.unitCost.toString())
                          setIsModalOpen(true)
                        }}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                        title="Edit Produk"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>{editingProduct ? 'Edit Produk / Layanan' : 'Tambah Produk / Jasa Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Nama Produk / Jasa</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Caramel Macchiato"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">SKU / Barcode</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Minuman Kopi">Minuman Kopi</option>
                    <option value="Manual Brew">Manual Brew</option>
                    <option value="Merchandise Retail">Merchandise Retail</option>
                    <option value="Layanan Jasa">Layanan Jasa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Harga Jual (IDR)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">HPP / Cost (IDR)</label>
                  <input
                    type="number"
                    required
                    value={formUnitCost}
                    onChange={(e) => setFormUnitCost(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
