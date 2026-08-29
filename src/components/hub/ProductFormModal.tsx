import React, { useState, useEffect } from 'react'
import { Button, Badge, TextInput } from '../../ui'
import { 
  X, Plus, Trash2, ChefHat, Sparkles, CheckCircle2, 
  Layers, Package, Wrench, Coffee, Tag, Percent
} from 'lucide-react'

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

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState<'coffee' | 'non_coffee' | 'food' | 'merchandise' | 'service'>('coffee')
  const [price, setPrice] = useState<number>(25000)
  const [cogs, setCogs] = useState<number>(8000)
  const [stockType, setStockType] = useState<'recipe_bom' | 'unit_inventory' | 'non_stock_service'>('recipe_bom')
  const [kdsStation, setKdsStation] = useState('Barista Station')
  const [taxApplicable, setTaxApplicable] = useState(true)
  const [ingredients, setIngredients] = useState<{ name: string; amount: string; cost: number }[]>([
    { name: 'Biji Kopi House Blend', amount: '18 Gram', cost: 4500 },
    { name: 'Fresh Milk', amount: '150 ML', cost: 3500 }
  ])

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setSku(initialData.sku || '')
      setCategory(initialData.category || 'coffee')
      setPrice(initialData.price || 25000)
      setCogs(initialData.cogs || 8000)
      setStockType(initialData.stockType || 'recipe_bom')
      setKdsStation(initialData.kdsStation || 'Barista Station')
      setTaxApplicable(initialData.taxApplicable !== false)
      setIngredients(initialData.recipeIngredients || [])
    } else {
      setName('')
      setSku(`SKU-${Date.now().toString().slice(-4)}`)
      setCategory('coffee')
      setPrice(28000)
      setCogs(9000)
      setStockType('recipe_bom')
      setKdsStation('Barista Station')
      setTaxApplicable(true)
      setIngredients([
        { name: 'Biji Kopi House Blend', amount: '18 Gram', cost: 4500 },
        { name: 'Fresh Milk', amount: '150 ML', cost: 3500 }
      ])
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  // Calculate live margin
  const calculatedMargin = price > 0 ? Math.round(((price - cogs) / price) * 100) : 0

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: 'Sirup Perisa / Bahan Tambahan', amount: '15 ML', cost: 1000 }])
  }

  const handleRemoveIngredient = (index: number) => {
    const next = [...ingredients]
    next.splice(index, 1)
    setIngredients(next)
    const totalCost = next.reduce((sum, item) => sum + item.cost, 0)
    setCogs(totalCost)
  }

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
      kdsStation,
      taxApplicable
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-sans">
      <div className="w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm">
              ☕
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {isEditing ? 'Ubah Data Produk & Resep' : 'Tambah Produk / Jasa Baru'}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Design System Katalog Terpadu POS &amp; Hub
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Section 1: Basic Info */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">Nama Menu / Produk:</label>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Espresso Aren Latte"
              className="w-full bg-background border-border text-xs min-h-[40px]"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Kategori:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[40px]"
              >
                <option value="coffee">☕ Minuman Kopi</option>
                <option value="non_coffee">🍵 Non-Kopi &amp; Teh</option>
                <option value="food">🥐 Makanan &amp; Pastry</option>
                <option value="merchandise">👕 Merchandise Retail</option>
                <option value="service">🛠️ Layanan Jasa</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Kode SKU / Barcode:</label>
              <TextInput
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="BEV-ESPR-01"
                className="w-full bg-background border-border text-xs min-h-[40px] font-mono"
              />
            </div>
          </div>

          {/* Section 2: Financials & Margin */}
          <div className="p-3.5 bg-muted/40 rounded-2xl border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">💰 Harga &amp; Margin Laba:</span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-mono font-bold">
                Margin {calculatedMargin}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">Harga Jual Konsumen (Rp):</label>
                <TextInput
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-background border-border text-xs min-h-[40px] font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">HPP / Biaya Modal (Rp):</label>
                <TextInput
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(Number(e.target.value))}
                  className="w-full bg-background border-border text-xs min-h-[40px] font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Stock Type & BOM Recipe */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-muted-foreground block">Tipe Pengelolaan Stok:</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={stockType === 'recipe_bom' ? 'amber' : 'outline'}
                size="sm"
                onClick={() => setStockType('recipe_bom')}
                className="flex-col h-auto py-2.5 gap-1 rounded-xl text-center"
              >
                <ChefHat className="w-4 h-4" />
                <span className="text-[10px]">Racikan Resep</span>
              </Button>

              <Button
                type="button"
                variant={stockType === 'unit_inventory' ? 'amber' : 'outline'}
                size="sm"
                onClick={() => setStockType('unit_inventory')}
                className="flex-col h-auto py-2.5 gap-1 rounded-xl text-center"
              >
                <Package className="w-4 h-4" />
                <span className="text-[10px]">Barang Jadi</span>
              </Button>

              <Button
                type="button"
                variant={stockType === 'non_stock_service' ? 'amber' : 'outline'}
                size="sm"
                onClick={() => setStockType('non_stock_service')}
                className="flex-col h-auto py-2.5 gap-1 rounded-xl text-center"
              >
                <Wrench className="w-4 h-4" />
                <span className="text-[10px]">Jasa Non-Stok</span>
              </Button>
            </div>

            {/* If Recipe BOM */}
            {stockType === 'recipe_bom' && (
              <div className="p-3.5 bg-muted/20 border border-border rounded-2xl space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">🧪 Resep Bahan Baku (BOM):</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddIngredient}
                    className="text-[10px] h-7 px-2"
                  >
                    <Plus className="w-3 h-3 mr-1 text-amber-500" /> Tambah Bahan
                  </Button>
                </div>

                <div className="space-y-1.5">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-background rounded-xl border border-border/80">
                      <TextInput
                        value={ing.name}
                        onChange={(e) => {
                          const next = [...ingredients]
                          next[idx].name = e.target.value
                          setIngredients(next)
                        }}
                        placeholder="Nama Bahan"
                        className="flex-1 text-xs bg-card border-border/60 min-h-[36px]"
                      />
                      <TextInput
                        value={ing.amount}
                        onChange={(e) => {
                          const next = [...ingredients]
                          next[idx].amount = e.target.value
                          setIngredients(next)
                        }}
                        placeholder="18 Gram"
                        className="w-20 text-xs bg-card border-border/60 min-h-[36px]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="w-8 h-8 min-w-[32px] min-h-[32px] text-muted-foreground hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Operational Routing */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/60">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Stasiun Cetak KDS:</label>
              <select
                value={kdsStation}
                onChange={(e) => setKdsStation(e.target.value)}
                className="w-full px-2.5 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none min-h-[40px]"
              >
                <option value="Barista Station">☕ Barista Station</option>
                <option value="Kitchen Station">🍳 Kitchen Station</option>
                <option value="Retail Station">🛍️ Retail Shelf</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Pajak Restoran (PB1):</label>
              <Button
                type="button"
                variant={taxApplicable ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTaxApplicable(!taxApplicable)}
                className={`w-full min-h-[40px] text-xs justify-center ${
                  taxApplicable ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : ''
                }`}
              >
                {taxApplicable ? '✅ Pajak Restoran 10%' : '❌ Bebas Pajak'}
              </Button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="amber"
              size="sm"
              className="text-xs"
            >
              {isEditing ? 'Simpan Perubahan' : 'Simpan Produk Baru'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
