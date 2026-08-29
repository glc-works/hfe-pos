import React from 'react'
import { Button, TextInput } from '../../ui'
import { Plus, Trash2 } from 'lucide-react'

export interface ModifierOption {
  id: string
  name: string
  priceDelta: number
  bomDelta?: string
}

export interface ModifierGroup {
  id: string
  name: string
  selectionType: 'single' | 'multiple'
  options: ModifierOption[]
}

export interface MatrixVariant {
  sku: string
  name: string
  price: number
  stock: number
}

interface ProductFormModifierSectionProps {
  customizationType: 'none' | 'modifiers_fnb' | 'matrix_retail'
  setCustomizationType: (type: 'none' | 'modifiers_fnb' | 'matrix_retail') => void
  modifierGroups: ModifierGroup[]
  setModifierGroups: (groups: ModifierGroup[]) => void
  matrixVariants: MatrixVariant[]
  setMatrixVariants: (variants: MatrixVariant[]) => void
}

export const ProductFormModifierSection: React.FC<ProductFormModifierSectionProps> = ({
  customizationType,
  setCustomizationType,
  modifierGroups,
  setModifierGroups,
  matrixVariants,
  setMatrixVariants
}) => {
  const handleAddModifierGroup = () => {
    setModifierGroups([
      ...modifierGroups,
      {
        id: `mod-${Date.now()}`,
        name: 'Grup Pilihan Baru',
        selectionType: 'single',
        options: [{ id: `opt-${Date.now()}`, name: 'Pilihan 1', priceDelta: 0 }]
      }
    ])
  }

  const handleAddModifierOption = (groupIndex: number) => {
    const next = [...modifierGroups]
    next[groupIndex].options.push({
      id: `opt-${Date.now()}`,
      name: 'Opsi Tambahan',
      priceDelta: 5000
    })
    setModifierGroups(next)
  }

  const handleRemoveModifierOption = (groupIndex: number, optionIndex: number) => {
    const next = [...modifierGroups]
    next[groupIndex].options.splice(optionIndex, 1)
    setModifierGroups(next)
  }

  return (
    <div className="space-y-4">
      {/* Customization Type Switcher */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground block">Model Kustomisasi Produk:</label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={customizationType === 'none' ? 'amber' : 'outline'}
            size="sm"
            onClick={() => setCustomizationType('none')}
            className="h-10 rounded-xl text-xs"
          >
            Tanpa Varian
          </Button>
          <Button
            type="button"
            variant={customizationType === 'modifiers_fnb' ? 'amber' : 'outline'}
            size="sm"
            onClick={() => setCustomizationType('modifiers_fnb')}
            className="h-10 rounded-xl text-xs"
          >
            ☕ Modifier F&amp;B
          </Button>
          <Button
            type="button"
            variant={customizationType === 'matrix_retail' ? 'amber' : 'outline'}
            size="sm"
            onClick={() => setCustomizationType('matrix_retail')}
            className="h-10 rounded-xl text-xs"
          >
            👕 Matrix Retail
          </Button>
        </div>
      </div>

      {/* F&B MODIFIERS EDITOR (Sugar, Temp, Add-ons) */}
      {customizationType === 'modifiers_fnb' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Grup Modifier &amp; Racikan Minuman:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddModifierGroup}
              className="h-8 px-2.5 text-[11px] rounded-lg"
            >
              <Plus className="w-3 h-3 mr-1 text-amber-500" /> Tambah Grup
            </Button>
          </div>

          {modifierGroups.map((grp, gIdx) => (
            <div key={grp.id} className="p-3 bg-muted/30 border border-border rounded-xl space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <TextInput
                  value={grp.name}
                  onChange={(e) => {
                    const next = [...modifierGroups]
                    next[gIdx].name = e.target.value
                    setModifierGroups(next)
                  }}
                  className="flex-1 h-9 px-3 text-xs bg-background border-border rounded-lg font-bold"
                  placeholder="Nama Grup (e.g. Tingkat Gula)"
                />
                <select
                  value={grp.selectionType}
                  onChange={(e) => {
                    const next = [...modifierGroups]
                    next[gIdx].selectionType = e.target.value as any
                    setModifierGroups(next)
                  }}
                  className="h-9 px-2 text-[11px] bg-background border border-border rounded-lg"
                >
                  <option value="single">Pilih 1 (Radio)</option>
                  <option value="multiple">Multi (Add-on)</option>
                </select>
              </div>

              {/* Options */}
              <div className="space-y-1.5 pl-2 border-l-2 border-amber-500/40">
                {grp.options.map((opt, oIdx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <TextInput
                      value={opt.name}
                      onChange={(e) => {
                        const next = [...modifierGroups]
                        next[gIdx].options[oIdx].name = e.target.value
                        setModifierGroups(next)
                      }}
                      placeholder="Nama Opsi (e.g. Less Sugar 50%)"
                      className="flex-1 h-9 px-2.5 text-xs bg-background border-border rounded-lg"
                    />
                    <TextInput
                      type="number"
                      value={opt.priceDelta}
                      onChange={(e) => {
                        const next = [...modifierGroups]
                        next[gIdx].options[oIdx].priceDelta = Number(e.target.value)
                        setModifierGroups(next)
                      }}
                      placeholder="+Rp"
                      className="w-24 h-9 px-2 text-xs bg-background border-border rounded-lg text-right font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveModifierOption(gIdx, oIdx)}
                      className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg text-muted-foreground hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddModifierOption(gIdx)}
                  className="h-7 px-2 text-[11px] text-amber-500 hover:text-amber-400"
                >
                  + Tambah Opsi
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RETAIL MATRIX VARIANTS (Size x Color) */}
      {customizationType === 'matrix_retail' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Daftar Kombinasi SKU &amp; Stok Retail:</span>
          </div>

          <div className="rounded-xl border border-border divide-y divide-border/60 overflow-hidden bg-background">
            {matrixVariants.map((variant) => (
              <div key={variant.sku} className="p-2.5 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-foreground text-xs">{variant.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground block">{variant.sku}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Stok: {variant.stock} pcs</span>
                  <span className="text-xs font-mono font-bold text-foreground">
                    Rp {variant.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
