import React, { useState } from 'react'
import { Button, Badge, TextInput } from '../../ui'
import { 
  ShoppingBag, Plus, Search, Filter, Edit3, Trash2, 
  Sparkles, CheckCircle2, AlertCircle, ArrowUpRight,
  ChefHat, Layers, Tag, Percent, ArrowRight, ChevronRight, X
} from 'lucide-react'
import { ProductFormModal, ProductFormData } from './ProductFormModal'

export interface ProductCatalogItem extends ProductFormData {}

const INITIAL_PRODUCTS: ProductCatalogItem[] = [
  {
    id: 'prod-01',
    sku: 'BEV-ESPR-01',
    name: 'Espresso Aren Latte',
    category: 'coffee',
    categoryLabel: 'Minuman Kopi',
    price: 28000,
    cogs: 9200,
    marginPercent: 67,
    stockType: 'recipe_bom',
    isActive: true,
    recipeIngredients: [
      { name: 'Biji Kopi House Blend Gayo', amount: '18 Gram', cost: 4500 },
      { name: 'Susu Fresh Milk / Oat', amount: '150 ML', cost: 3500 },
      { name: 'Sirup Gula Aren Organik', amount: '20 ML', cost: 1200 }
    ],
    channelPricing: {
      deliveryGoFood: 35000,
      deliveryGrabFood: 35000,
      qrSelfOrder: 28000
    },
    kdsStation: 'Barista Station',
    taxApplicable: true
  },
  {
    id: 'prod-02',
    sku: 'BEV-JAP-01',
    name: 'Japanese Iced Drip Coffee',
    category: 'coffee',
    categoryLabel: 'Manual Brew',
    price: 35000,
    cogs: 11000,
    marginPercent: 69,
    stockType: 'recipe_bom',
    isActive: true,
    recipeIngredients: [
      { name: 'Biji Kopi Single Origin Ijen', amount: '15 Gram', cost: 8000 },
      { name: 'Es Batu Kristal RO', amount: '120 Gram', cost: 1000 },
      { name: 'Paper Filter V60', amount: '1 Pcs', cost: 2000 }
    ],
    channelPricing: {
      deliveryGoFood: 42000,
      deliveryGrabFood: 42000,
      qrSelfOrder: 35000
    },
    kdsStation: 'Manual Brew Bar',
    taxApplicable: true
  },
  {
    id: 'prod-03',
    sku: 'MER-TSHIRT-01',
    name: 'Kopi Nusantara Official T-Shirt',
    category: 'merchandise',
    categoryLabel: 'Merchandise Retail',
    price: 149000,
    cogs: 65000,
    marginPercent: 56,
    stockType: 'unit_inventory',
    isActive: true,
    customizationType: 'matrix_retail',
    matrixVariants: [
      { sku: 'MER-TSHIRT-BLK-S', name: 'Hitam - S', price: 149000, stock: 12 },
      { sku: 'MER-TSHIRT-BLK-M', name: 'Hitam - M', price: 149000, stock: 24 }
    ],
    kdsStation: 'Retail Station',
    taxApplicable: false
  },
  {
    id: 'prod-04',
    sku: 'SRV-ROAST-01',
    name: 'Jasa Custom Roasting Beans (1kg)',
    category: 'service',
    categoryLabel: 'Jasa Roastery',
    price: 45000,
    cogs: 8000,
    marginPercent: 82,
    stockType: 'non_stock_service',
    isActive: true,
    kdsStation: 'Roastery Lab',
    taxApplicable: true
  }
]

export const ProductCatalogManagementTab: React.FC = () => {
  const [products, setProducts] = useState<ProductCatalogItem[]>(INITIAL_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductCatalogItem | null>(null)
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<ProductCatalogItem | null>(null)

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSaveProduct = (formData: ProductFormData) => {
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === formData.id ? { ...formData } : p)))
    } else {
      setProducts((prev) => [{ ...formData, id: `prod-${Date.now()}` }, ...prev])
    }
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      if (selectedProductForDetail?.id === id) setSelectedProductForDetail(null)
    }
  }

  // 1. FULL VIEW: FORM EDITOR (CREATE OR EDIT)
  if (isFormOpen) {
    return (
      <ProductFormModal
        isOpen={true}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProduct(null)
        }}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />
    )
  }

  // 2. FULL VIEW: DETAILED VIEW WITH PURE BREADCRUMBS
  if (selectedProductForDetail) {
    return (
      <div className="w-full h-full flex flex-col bg-background font-sans animate-fadeIn">
        {/* Pure Breadcrumbs Header */}
        <div className="h-14 px-4 sm:px-6 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedProductForDetail(null)}
              className="flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-muted"
            >
              <span>🛍️ Katalog Produk</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-bold text-foreground truncate max-w-[200px] sm:max-w-none">
              {selectedProductForDetail.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingProduct(selectedProductForDetail)
                setSelectedProductForDetail(null)
                setIsFormOpen(true)
              }}
              className="h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Ubah Produk
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => handleDeleteProduct(selectedProductForDetail.id!)}
              className="h-9 px-3.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </Button>
          </div>
        </div>

        {/* Detail Content Canvas (Dual-Pane) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Details (8 Kolom) */}
          <div className="md:col-span-8 space-y-4">
            <div className="p-4 sm:p-5 bg-card rounded-2xl border border-border space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-500">
                    {selectedProductForDetail.sku} • {selectedProductForDetail.categoryLabel}
                  </span>
                  <h2 className="text-lg font-bold text-foreground mt-0.5">
                    {selectedProductForDetail.name}
                  </h2>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs font-bold">
                  Aktif Dijual
                </Badge>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-muted/40 rounded-xl border border-border">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Harga Toko:</span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    Rp {selectedProductForDetail.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">HPP (Modal):</span>
                  <span className="font-mono font-bold text-sm text-muted-foreground">
                    Rp {selectedProductForDetail.cogs.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Margin Laba:</span>
                  <span className="font-mono font-bold text-sm text-emerald-400">
                    {selectedProductForDetail.marginPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Multi-Channel Pricing Breakdown */}
            <div className="p-4 sm:p-5 bg-card rounded-2xl border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">🛵 Saluran Penjualan &amp; Harga:</span>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-bold">
                  Omnichannel
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-3 bg-muted/30 rounded-xl border border-border/80 flex items-center justify-between">
                  <span className="text-muted-foreground">🏬 Toko / Kasir:</span>
                  <span className="font-mono font-bold text-foreground">
                    Rp {selectedProductForDetail.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl border border-border/80 flex items-center justify-between">
                  <span className="text-muted-foreground">🛵 GoFood &amp; Grab:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    Rp {(selectedProductForDetail.channelPricing?.deliveryGoFood || Math.ceil((selectedProductForDetail.price * 1.25) / 1000) * 1000).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipe Ingredients BOM */}
            {selectedProductForDetail.recipeIngredients && selectedProductForDetail.recipeIngredients.length > 0 && (
              <div className="p-4 sm:p-5 bg-card rounded-2xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>🧪 Komposisi Bahan &amp; BoM (Bill of Materials)</span>
                  </h4>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Auto-Potong Stok Gudang
                  </span>
                </div>

                <div className="rounded-xl border border-border divide-y divide-border/60 overflow-hidden bg-background">
                  {selectedProductForDetail.recipeIngredients.map((ing, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{ing.name}</span>
                        <span className="text-[11px] text-muted-foreground block">Takaran: {ing.amount}</span>
                      </div>
                      <span className="font-mono text-muted-foreground font-bold">
                        Rp {ing.cost.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Summary (4 Kolom) */}
          <div className="md:col-span-4 space-y-4">
            <div className="p-4 sm:p-5 bg-card rounded-2xl border border-border space-y-3">
              <span className="text-xs font-bold text-foreground block">⚙️ Operasional &amp; Pajak</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Stasiun Dapur:</span>
                  <span className="font-bold text-foreground">{selectedProductForDetail.kdsStation || 'Barista'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Pajak PB1:</span>
                  <span className="font-bold text-emerald-400">{selectedProductForDetail.taxApplicable ? 'Ya (10%)' : 'Bebas Pajak'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Tipe Stok:</span>
                  <span className="font-bold text-amber-500 capitalize">{selectedProductForDetail.stockType.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 3. MASTER VIEW: PRODUCT CATALOG TABLE & TOOLBAR
  return (
    <div className="w-full h-full flex flex-col bg-background font-sans">
      {/* Action Toolbar */}
      <div className="p-4 border-b border-border bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <TextInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu, SKU, atau kategori..."
              className="w-full h-10 pl-9 pr-3 bg-background border-border rounded-xl text-xs"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="coffee">☕ Minuman Kopi</option>
            <option value="non_coffee">🍵 Non-Kopi</option>
            <option value="food">🥐 Makanan</option>
            <option value="merchandise">👕 Merchandise</option>
            <option value="service">🛠️ Layanan Jasa</option>
          </select>
        </div>

        <Button
          type="button"
          variant="amber"
          size="sm"
          onClick={() => {
            setEditingProduct(null)
            setIsFormOpen(true)
          }}
          className="w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk &amp; Varian Baru</span>
        </Button>
      </div>

      {/* Catalog Table */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="divide-y divide-border/60">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProductForDetail(product)}
                className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-muted/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm shrink-0">
                    ☕
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-amber-500 transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                        {product.sku}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {product.categoryLabel} • HPP: Rp {product.cogs.toLocaleString('id-ID')} • Margin: {product.marginPercent}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-mono font-bold text-foreground block">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Ojol: Rp {(product.channelPricing?.deliveryGoFood || Math.ceil((product.price * 1.25) / 1000) * 1000).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingProduct(product)
                        setIsFormOpen(true)
                      }}
                      className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Ubah Produk"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteProduct(product.id!, e)}
                      className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg text-muted-foreground hover:text-rose-400 cursor-pointer"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
