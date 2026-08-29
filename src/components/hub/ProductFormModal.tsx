import React, { useState, useEffect } from 'react'
import { Button, Badge, TextInput } from '../../ui'
import { 
  X, Plus, Trash2, ChefHat, Sparkles, CheckCircle2, 
  Layers, Package, Wrench, Coffee, Tag, Percent, Sliders, Shirt
} from 'lucide-react'
import { 
  ProductFormModifierSection, 
  ModifierGroup, 
  MatrixVariant,
  ModifierOption 
} from './ProductFormModifierSection'

export type { ModifierGroup, MatrixVariant, ModifierOption }

export interface ProductFormData {
  id?: string
  sku: string
  name: string
  category: 'coffee' | 'non_coffee' | 'food' | 'merchandise' | 'service'
  categoryLabel: string
  price: number
  cogs: number
  marginPercent: number
  stockType: 'recipe_bom' | 'unit_inventory' | 'non_stock_service'
  isActive: boolean
  recipeIngredients?: { name: string; amount: string; cost: number }[]
  customizationType?: 'none' | 'modifiers_fnb' | 'matrix_retail'
  modifierGroups?: ModifierGroup[]
  matrixVariants?: MatrixVariant[]
  kdsStation?: string
  taxApplicable?: boolean
}

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: ProductFormData) => void
  initialData?: ProductFormData | null
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const isEditing = !!initialData?.id

  const [activeTab, setActiveTab] = useState<'general' | 'modifiers' | 'routing'>('general')
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState<'coffee' | 'non_coffee' | 'food' | 'merchandise' | 'service'>('coffee')
  const [price, setPrice] = useState<number>(25000)
  const [cogs, setCogs] = useState<number>(8000)
  const [stockType, setStockType] = useState<'recipe_bom' | 'unit_inventory' | 'non_stock_service'>('recipe_bom')
  const [customizationType, setCustomizationType] = useState<'none' | 'modifiers_fnb' | 'matrix_retail'>('modifiers_fnb')
  const [kdsStation, setKdsStation] = useState('Barista Station')
  const [taxApplicable, setTaxApplicable] = useState(true)

  // Ingredients for BOM
  const [ingredients, setIngredients] = useState<{ name: string; amount: string; cost: number }[]>([
    { name: 'Biji Kopi House Blend', amount: '18 Gram', cost: 4500 },
    { name: 'Fresh Milk', amount: '150 ML', cost: 3500 }
  ])

  // Modifier Groups for F&B
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([
    {
      id: 'mod-sugar',
      name: 'Tingkat Kemanisan (Sugar Level)',
      selectionType: 'single',
      options: [
        { id: 's1', name: 'Normal (100%)', priceDelta: 0 },
        { id: 's2', name: 'Less Sugar (50%)', priceDelta: 0 },
        { id: 's3', name: 'No Sugar (0%)', priceDelta: 0 }
      ]
    },
    {
      id: 'mod-addons',
      name: 'Tambahan & Topping (Add-ons)',
      selectionType: 'multiple',
      options: [
        { id: 'a1', name: 'Extra Espresso Shot', priceDelta: 6000, bomDelta: '+9g Biji Kopi' },
        { id: 'a2', name: 'Ganti Oat Milk', priceDelta: 8000, bomDelta: 'Susu Oat 150ml' }
      ]
    }
  ])

  // Matrix Variants for Retail
  const [matrixVariants, setMatrixVariants] = useState<MatrixVariant[]>([
    { sku: 'MER-TSHIRT-BLK-S', name: 'Hitam - S', price: 149000, stock: 12 },
    { sku: 'MER-TSHIRT-BLK-M', name: 'Hitam - M', price: 149000, stock: 24 },
    { sku: 'MER-TSHIRT-BLK-L', name: 'Hitam - L', price: 149000, stock: 18 },
    { sku: 'MER-TSHIRT-BLK-XL', name: 'Hitam - XL', price: 159000, stock: 8 }
  ])

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setSku(initialData.sku || '')
      setCategory(initialData.category || 'coffee')
      setPrice(initialData.price || 25000)
      setCogs(initialData.cogs || 8000)
      setStockType(initialData.stockType || 'recipe_bom')
      setCustomizationType(initialData.customizationType || (initialData.category === 'merchandise' ? 'matrix_retail' : 'modifiers_fnb'))
      setKdsStation(initialData.kdsStation || 'Barista Station')
      setTaxApplicable(initialData.taxApplicable !== false)
      setIngredients(initialData.recipeIngredients || [])
      if (initialData.modifierGroups) setModifierGroups(initialData.modifierGroups)
      if (initialData.matrixVariants) setMatrixVariants(initialData.matrixVariants)
    } else {
      setName('')
      setSku(`SKU-${Date.now().toString().slice(-4)}`)
      setCategory('coffee')
      setPrice(28000)
      setCogs(9000)
      setStockType('recipe_bom')
      setCustomizationType('modifiers_fnb')
      setKdsStation('Barista Station')
      setTaxApplicable(true)
      setIngredients([
        { name: 'Biji Kopi House Blend', amount: '18 Gram', cost: 4500 },
        { name: 'Fresh Milk', amount: '150 ML', cost: 3500 }
      ])
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const calculatedMargin = price > 0 ? Math.round(((price - cogs) / price) * 100) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const categoryLabels: Record<string, string> = {
      coffee: 'Minuman Kopi',
      non_coffee: 'Non-Kopi & Teh',
      food: 'Makanan & Pastry',
      merchandise: 'Merchandise Retail',
      service: 'Layanan Jasa'
    }

    onSave({
      id: initialData?.id || `prod-${Date.now()}`,
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      name,
      category,
      categoryLabel: categoryLabels[category] || 'Produk',
      price: Number(price),
      cogs: Number(cogs),
      marginPercent: calculatedMargin,
      stockType,
      isActive: true,
      recipeIngredients: stockType === 'recipe_bom' ? ingredients : [],
      customizationType,
      modifierGroups: customizationType === 'modifiers_fnb' ? modifierGroups : [],
      matrixVariants: customizationType === 'matrix_retail' ? matrixVariants : [],
      kdsStation,
      taxApplicable
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-sans">
      <div className="w-full max-w-lg bg-card rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="h-14 px-4 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm shrink-0">
              ☕
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {isEditing ? 'Ubah Data & Varian Produk' : 'Tambah Produk & Varian Baru'}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-tight">
                POS &amp; Hub Unified Catalog Suite
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-xl text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="h-11 px-4 border-b border-border bg-muted/20 flex items-center gap-2 shrink-0">
          {[
            { key: 'general', label: 'Informasi & Harga', icon: <Tag className="w-3.5 h-3.5" /> },
            { key: 'modifiers', label: 'Varian & Modifier', icon: <Sliders className="w-3.5 h-3.5" /> },
            { key: 'routing', label: 'Dapur & Pajak', icon: <ChefHat className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {activeTab === 'general' && (
            <>
              {/* Basic Info */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Nama Menu / Produk:</label>
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Espresso Aren Latte"
                  className="w-full h-10 px-3 bg-background border-border rounded-xl text-xs"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground block">Kategori:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-10 px-3 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="coffee">☕ Minuman Kopi</option>
                    <option value="non_coffee">🍵 Non-Kopi &amp; Teh</option>
                    <option value="food">🥐 Makanan &amp; Pastry</option>
                    <option value="merchandise">👕 Merchandise Retail</option>
                    <option value="service">🛠️ Layanan Jasa</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground block">Kode SKU / Barcode:</label>
                  <TextInput
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="BEV-ESPR-01"
                    className="w-full h-10 px-3 bg-background border-border rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Pricing & Margin */}
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">💰 Harga &amp; Margin Laba:</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[11px] font-mono font-bold h-6 px-2">
                    Margin {calculatedMargin}%
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground block">Harga Jual Konsumen (Rp):</label>
                    <TextInput
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-background border-border rounded-xl text-xs font-mono font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground block">HPP / Biaya Modal (Rp):</label>
                    <TextInput
                      type="number"
                      value={cogs}
                      onChange={(e) => setCogs(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-background border-border rounded-xl text-xs font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Stock Management */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">Tipe Pengelolaan Stok:</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={stockType === 'recipe_bom' ? 'amber' : 'outline'}
                    size="sm"
                    onClick={() => setStockType('recipe_bom')}
                    className="h-10 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Racikan Resep</span>
                  </Button>
                  <Button
                    type="button"
                    variant={stockType === 'unit_inventory' ? 'amber' : 'outline'}
                    size="sm"
                    onClick={() => setStockType('unit_inventory')}
                    className="h-10 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Barang Jadi</span>
                  </Button>
                  <Button
                    type="button"
                    variant={stockType === 'non_stock_service' ? 'amber' : 'outline'}
                    size="sm"
                    onClick={() => setStockType('non_stock_service')}
                    className="h-10 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Jasa Non-Stok</span>
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'modifiers' && (
            <ProductFormModifierSection
              customizationType={customizationType}
              setCustomizationType={setCustomizationType}
              modifierGroups={modifierGroups}
              setModifierGroups={setModifierGroups}
              matrixVariants={matrixVariants}
              setMatrixVariants={setMatrixVariants}
            />
          )}

          {activeTab === 'routing' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Stasiun Cetak Dapur (KDS):</label>
                <select
                  value={kdsStation}
                  onChange={(e) => setKdsStation(e.target.value)}
                  className="w-full h-10 px-3 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none"
                >
                  <option value="Barista Station">☕ Barista Station</option>
                  <option value="Kitchen Station">🍳 Kitchen Station</option>
                  <option value="Retail Station">🛍️ Retail Shelf</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Kepatuhan Pajak Restoran (PB1):</label>
                <Button
                  type="button"
                  variant={taxApplicable ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setTaxApplicable(!taxApplicable)}
                  className={`w-full h-10 rounded-xl text-xs justify-center ${
                    taxApplicable ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold' : ''
                  }`}
                >
                  {taxApplicable ? '✅ Pajak Restoran 10%' : '❌ Bebas Pajak'}
                </Button>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="amber"
              size="sm"
              className="h-10 px-5 rounded-xl text-xs font-bold"
            >
              {isEditing ? 'Simpan Perubahan' : 'Simpan Produk Baru'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
