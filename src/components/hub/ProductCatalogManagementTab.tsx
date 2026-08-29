import React, { useState } from 'react'
import { Button, Badge, TextInput } from '../../ui'
import { 
  ShoppingBag, Plus, Search, Filter, Edit3, Trash2, 
  Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, X,
  ChefHat, Layers, Tag, Percent, ArrowRight, ChevronRight
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
    recipeIngredients: [],
    kdsStation: 'Kasir Retail Shelf',
    taxApplicable: true
  },
  {
    id: 'prod-04',
    sku: 'SRV-ROAST-01',
    name: 'Jasa Custom Roasting Beans (1kg)',
    category: 'service',
    categoryLabel: 'Layanan Jasa',
    price: 45000,
    cogs: 5000,
    marginPercent: 89,
    stockType: 'non_stock_service',
    isActive: true,
    recipeIngredients: [
      { name: 'Gas Roaster & Tenaga Ahli', amount: '1 Batch', cost: 5000 }
    ],
    kdsStation: 'Roastery Lab',
    taxApplicable: true
  }
]

export const ProductCatalogManagementTab: React.FC = () => {
  const [products, setProducts] = useState<ProductCatalogItem[]>(INITIAL_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<ProductCatalogItem | null>(null)
  const [editingProduct, setEditingProduct] = useState<ProductCatalogItem | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  // Filter products
  const filteredProducts = products.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSaveProduct = (saved: ProductFormData) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === saved.id ? (saved as ProductCatalogItem) : p)))
    } else {
      setProducts([saved as ProductCatalogItem, ...products])
    }
    setEditingProduct(null)
    setSelectedProductForDetail(null)
  }

  return (
    <div className="space-y-4 font-sans">
      {/* 3-DEVICE RESPONSIVE CONTROL TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <TextInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk / SKU / jasa..."
              className="w-full h-10 pl-9 pr-3 bg-card border-border rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto h-10 px-3 bg-card border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Kategori</option>
              <option value="coffee">☕ Minuman Kopi</option>
              <option value="merchandise">👕 Merchandise Retail</option>
              <option value="service">🛠️ Layanan Jasa</option>
            </select>
          </div>
        </div>

        {/* Top-Right CTA on Tablet/Desktop (Standard 40px / h-10) */}
        <Button
          variant="amber"
          size="sm"
          onClick={() => {
            setEditingProduct(null)
            setIsFormModalOpen(true)
          }}
          className="hidden sm:flex h-10 px-4 rounded-xl text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Tambah Produk / Jasa</span>
        </Button>
      </div>

      {/* MOBILE ONLY (< md): RESPONSIVE SUMMARY CARDS */}
      <div className="md:hidden space-y-2.5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => setSelectedProductForDetail(prod)}
            className="p-3.5 rounded-2xl bg-card border border-border shadow-xs hover:border-amber-500/40 active:scale-[0.99] transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">☕</span>
                  <h4 className="text-xs font-bold text-foreground truncate">{prod.name}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {prod.sku} • {prod.categoryLabel}
                </p>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[11px] shrink-0 font-mono font-bold h-6 px-2">
                Margin {prod.marginPercent}%
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">Harga Jual:</span>
                <span className="font-mono font-bold text-foreground text-xs">Rp {prod.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
                  🟢 Aktif Jual
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Sticky Add Button (Prominent 48px / h-12) */}
        <Button
          variant="amber"
          size="lg"
          fullWidth
          onClick={() => {
            setEditingProduct(null)
            setIsFormModalOpen(true)
          }}
          className="mt-4 h-12 rounded-xl text-xs font-bold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tambah Produk / Jasa Baru</span>
        </Button>
      </div>

      {/* DESKTOP / TABLET (>= md): COMPREHENSIVE FINANCIAL DATA TABLE */}
      <div className="hidden md:block bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <th className="py-3 px-4">Produk / Layanan</th>
                <th className="py-3 px-4">Kategori &amp; SKU</th>
                <th className="py-3 px-4 font-mono">Harga Jual</th>
                <th className="py-3 px-4 font-mono">HPP (Modal)</th>
                <th className="py-3 px-4 font-mono">Margin %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((prod) => (
                <tr 
                  key={prod.id} 
                  onClick={() => setSelectedProductForDetail(prod)}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-bold text-foreground flex items-center gap-2">
                    <span className="text-sm">☕</span>
                    <span>{prod.name}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <div>{prod.categoryLabel}</div>
                    <div className="text-[11px] font-mono text-muted-foreground/80">{prod.sku}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-foreground">
                    Rp {prod.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">
                    Rp {prod.cogs.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[11px] font-mono font-bold h-6 px-2">
                      {prod.marginPercent}%
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
                      🟢 Aktif
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProductForDetail(prod)
                      }}
                      className="h-8 px-3 rounded-lg text-xs"
                    >
                      Detail &amp; Resep ➔
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER / MODAL (RESEP & ACTIONS BELONG HERE) */}
      {selectedProductForDetail && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-card rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[85dvh] flex flex-col">
            {/* Header (Height: 56px) */}
            <div className="h-14 px-4 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm shrink-0">
                  ☕
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{selectedProductForDetail.name}</h3>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {selectedProductForDetail.sku} • {selectedProductForDetail.categoryLabel}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedProductForDetail(null)}
                className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Financial Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-muted/40 rounded-xl border border-border">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Harga Jual:</span>
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

              {/* Multi-Channel Pricing Breakdown */}
              <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">🛵 Saluran Penjualan &amp; Harga:</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-bold">
                    Omnichannel
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 bg-background rounded-lg border border-border/80 flex items-center justify-between">
                    <span className="text-muted-foreground">🏬 Toko Fisik:</span>
                    <span className="font-mono font-bold text-foreground">Rp {selectedProductForDetail.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="p-2 bg-background rounded-lg border border-border/80 flex items-center justify-between">
                    <span className="text-muted-foreground">🛵 GoFood/Grab:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      Rp {(selectedProductForDetail.channelPricing?.deliveryGoFood || Math.ceil((selectedProductForDetail.price * 1.25) / 1000) * 1000).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recipe & Ingredients (BOM) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                    <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                    <span>🧪 Resep &amp; Komposisi Bahan Baku (BOM)</span>
                  </h4>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Auto-Potong Stok Gudang
                  </span>
                </div>

                {selectedProductForDetail.recipeIngredients && selectedProductForDetail.recipeIngredients.length > 0 ? (
                  <div className="rounded-xl border border-border divide-y divide-border/60 overflow-hidden bg-background">
                    {selectedProductForDetail.recipeIngredients.map((ing, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-foreground text-xs">{ing.name}</span>
                          <span className="text-[11px] text-muted-foreground block">Takaran: {ing.amount}</span>
                        </div>
                        <span className="font-mono text-muted-foreground text-xs">
                          Rp {ing.cost.toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground p-3 bg-muted/30 rounded-xl text-xs">
                    Produk retail / jasa ini tidak menggunakan resep bahan baku peracikan.
                  </p>
                )}
              </div>

              {/* Operational Routing */}
              <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1.5">
                <h4 className="font-bold text-foreground text-xs">🎛️ Routing &amp; Kebijakan Toko:</h4>
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>Stasiun Cetak KDS:</span>
                  <span className="font-semibold text-foreground">{selectedProductForDetail.kdsStation}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>Pajak Restoran PB1 (10%):</span>
                  <span className="text-emerald-400 font-semibold">✅ Dikenakan Pajak</span>
                </div>
              </div>
            </div>

            {/* Action Buttons in Detail View (Standard 40px / h-10 Buttons) */}
            <div className="p-3 bg-muted/30 border-t border-border flex items-center justify-between gap-2 shrink-0">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setSelectedProductForDetail(null)}
                className="h-10 px-3.5 rounded-xl text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Nonaktifkan
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="amber"
                  size="sm"
                  onClick={() => {
                    setEditingProduct(selectedProductForDetail)
                    setIsFormModalOpen(true)
                  }}
                  className="h-10 px-4 rounded-xl text-xs font-bold"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Ubah Data &amp; Resep
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL REUSABLE PRODUCT FORM MODAL */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingProduct(null)
        }}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />
    </div>
  )
}
