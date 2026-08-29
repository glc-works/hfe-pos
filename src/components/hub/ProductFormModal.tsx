import React, { useState, useEffect } from 'react'
import { Button, Badge, TextInput } from '../../ui'
import { Tag, Sliders, ChevronRight, Gift, Layers, Package, Wrench } from 'lucide-react'
import { 
  ProductFormModifierSection, 
  ModifierGroup, 
  MatrixVariant,
  ModifierOption 
} from './ProductFormModifierSection'
import { ProductFormChannelPricingSection } from './ProductFormChannelPricingSection'
import { ProductFormLivePreviewPane } from './ProductFormLivePreviewPane'
import { ProductFormRecipeBomSection, RecipeIngredient } from './ProductFormRecipeBomSection'

export type { ModifierGroup, MatrixVariant, ModifierOption, RecipeIngredient }

export interface ChannelPricing {
  deliveryGoFood?: number
  deliveryGrabFood?: number
  qrSelfOrder?: number
}

export type ProductStockType = 'recipe_bom' | 'unit_inventory' | 'bundle_combo' | 'non_stock_service'

export interface ProductFormData {
  id?: string
  sku: string
  name: string
  category: 'coffee' | 'non_coffee' | 'food' | 'merchandise' | 'service'
  categoryLabel: string
  price: number
  cogs: number
  marginPercent: number
  stockType: ProductStockType
  isActive: boolean
  recipeIngredients?: RecipeIngredient[]
  customizationType?: 'none' | 'modifiers_fnb' | 'matrix_retail'
  modifierGroups?: ModifierGroup[]
  matrixVariants?: MatrixVariant[]
  channelPricing?: ChannelPricing
  kdsStation?: string
  taxApplicable?: boolean
}

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: ProductFormData) => void
  initialData?: ProductFormData | null
}

const CATEGORY_LABELS: Record<string, string> = {
  coffee: 'Minuman Kopi',
  non_coffee: 'Non-Kopi & Teh',
  food: 'Makanan & Pastry',
  merchandise: 'Merchandise & Retail',
  service: 'Layanan Jasa / Bengkel'
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
  const [price, setPrice] = useState<number>(28000)
  const [cogs, setCogs] = useState<number>(9200)
  const [stockType, setStockType] = useState<ProductStockType>('recipe_bom')
  const [customizationType, setCustomizationType] = useState<'none' | 'modifiers_fnb' | 'matrix_retail'>('modifiers_fnb')
  const [kdsStation, setKdsStation] = useState('Barista Station')
  const [taxApplicable, setTaxApplicable] = useState(true)

  // Progressive Multi-Channel Pricing
  const [showChannelPricing, setShowChannelPricing] = useState(false)
  const [channelMarkupPercent, setChannelMarkupPercent] = useState<number>(25)
  const [customDeliveryPrice, setCustomDeliveryPrice] = useState<number | null>(null)
  const [customQrPrice, setCustomQrPrice] = useState<number | null>(null)

  // Ingredients for BOM
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: 'Biji Kopi House Blend Gayo', amount: '18 Gram', cost: 4500 },
    { name: 'Fresh Milk / Oat Milk', amount: '150 ML', cost: 3500 },
    { name: 'Sirup Gula Aren Organik', amount: '20 ML', cost: 1200 }
  ])

  // Modifiers & Variants
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([
    {
      id: 'mod-sugar',
      name: 'Tingkat Kemanisan (Sugar Level)',
      selectionType: 'single',
      options: [
        { id: 's1', name: 'Normal (100%)', priceDelta: 0 },
        { id: 's2', name: 'Less Sugar (50%)', priceDelta: 0 }
      ]
    }
  ])

  const [matrixVariants, setMatrixVariants] = useState<MatrixVariant[]>([
    { sku: 'MER-TSHIRT-BLK-S', name: 'Hitam - S', price: 149000, stock: 12 },
    { sku: 'MER-TSHIRT-BLK-M', name: 'Hitam - M', price: 149000, stock: 24 }
  ])

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setSku(initialData.sku || '')
      setCategory(initialData.category || 'coffee')
      setPrice(initialData.price || 28000)
      setCogs(initialData.cogs || 9200)
      setStockType(initialData.stockType || 'recipe_bom')
      setCustomizationType(initialData.customizationType || (initialData.category === 'merchandise' ? 'matrix_retail' : 'modifiers_fnb'))
      setKdsStation(initialData.kdsStation || 'Barista Station')
      setTaxApplicable(initialData.taxApplicable !== false)
      setIngredients(initialData.recipeIngredients || [])
      if (initialData.modifierGroups) setModifierGroups(initialData.modifierGroups)
      if (initialData.matrixVariants) setMatrixVariants(initialData.matrixVariants)
      if (initialData.channelPricing?.deliveryGoFood) {
        setShowChannelPricing(true)
        setCustomDeliveryPrice(initialData.channelPricing.deliveryGoFood)
        setCustomQrPrice(initialData.channelPricing.qrSelfOrder || null)
      }
    } else {
      setName('')
      setSku(`SKU-${Date.now().toString().slice(-4)}`)
      setCategory('coffee')
      setPrice(28000)
      setCogs(9200)
      setStockType('recipe_bom')
      setCustomizationType('modifiers_fnb')
      setKdsStation('Barista Station')
      setTaxApplicable(true)
      setShowChannelPricing(false)
      setCustomDeliveryPrice(null)
      setCustomQrPrice(null)
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const calculatedMargin = price > 0 ? Math.round(((price - cogs) / price) * 100) : 0
  const autoCalculatedDeliveryPrice = Math.ceil((price * (1 + channelMarkupPercent / 100)) / 1000) * 1000
  const effectiveDeliveryPrice = customDeliveryPrice !== null ? customDeliveryPrice : autoCalculatedDeliveryPrice
  const effectiveQrPrice = customQrPrice !== null ? customQrPrice : price

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      id: initialData?.id || `prod-${Date.now()}`,
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      name,
      category,
      categoryLabel: CATEGORY_LABELS[category] || 'Produk',
      price: Number(price),
      cogs: Number(cogs),
      marginPercent: calculatedMargin,
      stockType,
      isActive: true,
      recipeIngredients: stockType === 'recipe_bom' ? ingredients : [],
      customizationType,
      modifierGroups: customizationType === 'modifiers_fnb' ? modifierGroups : [],
      matrixVariants: customizationType === 'matrix_retail' ? matrixVariants : [],
      channelPricing: showChannelPricing ? {
        deliveryGoFood: effectiveDeliveryPrice,
        deliveryGrabFood: effectiveDeliveryPrice,
        qrSelfOrder: effectiveQrPrice
      } : undefined,
      kdsStation,
      taxApplicable
    })
    onClose()
  }

  return (
    <div className="w-full h-full flex flex-col bg-background font-sans animate-fadeIn">
      {/* 1. Pure Breadcrumbs Header Bar */}
      <div className="h-14 px-4 sm:px-6 border-b border-border flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-muted"
          >
            <span>🛍️ Katalog Produk</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-bold text-foreground truncate max-w-[200px] sm:max-w-none">
            {isEditing ? `Ubah: ${name || 'Menu'}` : 'Tambah Produk & Varian Baru'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono font-bold">
            #FORM-PROD • {sku || 'AUTO'}
          </span>
          <Button
            type="button"
            variant="amber"
            size="sm"
            onClick={handleSubmit}
            className="h-9 px-4 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            {isEditing ? 'Simpan Data' : 'Simpan Produk ➔'}
          </Button>
        </div>
      </div>

      {/* 2. Sub-Header Tab Navigation Strip */}
      <div className="h-11 px-4 sm:px-6 border-b border-border bg-muted/20 flex items-center gap-2 shrink-0">
        {[
          { key: 'general', label: 'Informasi & Harga', icon: <Tag className="w-3.5 h-3.5" /> },
          { key: 'modifiers', label: 'Varian & Modifier', icon: <Sliders className="w-3.5 h-3.5" /> },
          { key: 'routing', label: 'Dapur & Pajak', icon: <Layers className="w-3.5 h-3.5" /> }
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

      {/* 3. Dual-Pane Responsive Full View Body */}
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* LEFT PANE: Dynamic Form Input (61.8% Golden Ratio / 8 Kolom) */}
        <div className="md:col-span-7 lg:col-span-8 p-4 sm:p-6 space-y-4 overflow-y-auto">
          {activeTab === 'general' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Nama Menu / Produk / Jasa:</label>
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Espresso Aren Latte / Oli Mesin 4L"
                  className="w-full h-10 px-3 bg-background border-border rounded-xl text-xs"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="merchandise">👕 Merchandise &amp; Retail</option>
                    <option value="service">🛠️ Layanan Jasa / Bengkel</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground block">Kode SKU / Barcode:</label>
                    <span className="text-[10px] text-muted-foreground">(Otomatis)</span>
                  </div>
                  <TextInput
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="BEV-ESPR-01"
                    className="w-full h-10 px-3 bg-background border-border rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Pricing & Margin */}
              <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">💰 Harga Jual Toko &amp; Margin:</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[11px] font-mono font-bold h-6 px-2">
                    Margin {calculatedMargin}%
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-foreground block">Harga Toko / Kasir (Rp):</label>
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

                <ProductFormChannelPricingSection
                  price={price}
                  showChannelPricing={showChannelPricing}
                  setShowChannelPricing={setShowChannelPricing}
                  channelMarkupPercent={channelMarkupPercent}
                  setChannelMarkupPercent={setChannelMarkupPercent}
                  effectiveDeliveryPrice={effectiveDeliveryPrice}
                  customDeliveryPrice={customDeliveryPrice}
                  setCustomDeliveryPrice={setCustomDeliveryPrice}
                />
              </div>

              {/* 4 Universal Stock Types: Centered Vertical Tiles */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Tipe Pengelolaan Stok &amp; Produk (Universal):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStockType('recipe_bom')}
                    className={`min-h-[58px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                      stockType === 'recipe_bom'
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-xs'
                        : 'bg-background hover:bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span className="leading-none text-[11px]">Komposisi BoM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockType('unit_inventory')}
                    className={`min-h-[58px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                      stockType === 'unit_inventory'
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-xs'
                        : 'bg-background hover:bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span className="leading-none text-[11px]">Barang Jadi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockType('bundle_combo')}
                    className={`min-h-[58px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                      stockType === 'bundle_combo'
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-xs'
                        : 'bg-background hover:bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span className="leading-none text-[11px]">Paket Bundle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockType('non_stock_service')}
                    className={`min-h-[58px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                      stockType === 'non_stock_service'
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-xs'
                        : 'bg-background hover:bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span className="leading-none text-[11px]">Jasa Non-Stok</span>
                  </button>
                </div>
              </div>

              {/* Bill of Materials (BOM) */}
              {stockType === 'recipe_bom' && (
                <ProductFormRecipeBomSection
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  onUpdateTotalCogs={(newCogs) => setCogs(newCogs)}
                />
              )}

              {/* Bundle / Combo Info */}
              {stockType === 'bundle_combo' && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-500 font-bold">
                    <Gift className="w-4 h-4" />
                    <span>Paket Penjualan Bundling / Combo</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Paket bundle menggabungkan beberapa barang jadi di katalog menjadi 1 harga paket. Saat terjual, stok masing-masing produk berkurang serentak.
                  </p>
                </div>
              )}
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
                <label className="text-xs font-semibold text-muted-foreground block">Stasiun Cetak Dapur / Operasional:</label>
                <select
                  value={kdsStation}
                  onChange={(e) => setKdsStation(e.target.value)}
                  className="w-full h-10 px-3 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none"
                >
                  <option value="Barista Station">☕ Barista Station</option>
                  <option value="Kitchen Station">🍳 Kitchen Station</option>
                  <option value="Retail Station">🛍️ Retail Station</option>
                  <option value="Pharmacy Lab">💊 Lab Farmasi / Apotek</option>
                  <option value="Workshop Pit">🔧 Bengkel Pit Area</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Kepatuhan Pajak (PB1 / PPN):</label>
                <Button
                  type="button"
                  variant={taxApplicable ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setTaxApplicable(!taxApplicable)}
                  className={`w-full h-10 rounded-xl text-xs justify-center cursor-pointer ${
                    taxApplicable ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold' : ''
                  }`}
                >
                  {taxApplicable ? '✅ Kena Pajak Resmi (10% PB1/PPN)' : '❌ Bebas Pajak'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: Live Interactive Preview & Action Dock (38.2% Golden Ratio / 4 Kolom) */}
        <div className="md:col-span-5 lg:col-span-4 p-4 sm:p-6 bg-muted/20 flex flex-col justify-between">
          <ProductFormLivePreviewPane
            name={name}
            sku={sku}
            categoryLabel={CATEGORY_LABELS[category] || 'Produk'}
            price={price}
            cogs={cogs}
            calculatedMargin={calculatedMargin}
            effectiveDeliveryPrice={effectiveDeliveryPrice}
            customizationType={customizationType}
            modifierGroups={modifierGroups}
            matrixVariants={matrixVariants}
            isEditing={isEditing}
            onClose={onClose}
          />
        </div>
      </form>
    </div>
  )
}
