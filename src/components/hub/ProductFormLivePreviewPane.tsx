import React from 'react'
import { Card, Badge, Button } from '../../ui'
import { Sparkles, Landmark, Layers } from 'lucide-react'
import { ModifierGroup, MatrixVariant } from './ProductFormModifierSection'

interface ProductFormLivePreviewPaneProps {
  name: string
  sku: string
  categoryLabel: string
  price: number
  cogs: number
  calculatedMargin: number
  effectiveDeliveryPrice: number
  customizationType: 'none' | 'modifiers_fnb' | 'matrix_retail'
  modifierGroups: ModifierGroup[]
  matrixVariants: MatrixVariant[]
  isEditing: boolean
  onClose: () => void
}

export const ProductFormLivePreviewPane: React.FC<ProductFormLivePreviewPaneProps> = ({
  name,
  sku,
  categoryLabel,
  price,
  cogs,
  calculatedMargin,
  effectiveDeliveryPrice,
  customizationType,
  modifierGroups,
  matrixVariants,
  isEditing,
  onClose
}) => {
  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pratinjau Kartu Kasir (Live)</span>
          </span>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-mono font-bold">
            Realtime
          </Badge>
        </div>

        {/* Live POS Card Simulation */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-md space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block">
                {categoryLabel || 'Produk'} • {sku || 'SKU-AUTO'}
              </span>
              <h4 className="text-sm font-bold text-foreground truncate">
                {name || 'Nama Produk / Menu'}
              </h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-sm shrink-0">
              ☕
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
            <div>
              <span className="text-muted-foreground block">Toko / Kasir:</span>
              <span className="font-mono font-bold text-foreground text-xs">
                Rp {price.toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Ojol Delivery:</span>
              <span className="font-mono font-bold text-emerald-400 text-xs">
                Rp {effectiveDeliveryPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Modifiers / Variants pill summary */}
          {customizationType === 'modifiers_fnb' && modifierGroups.length > 0 && (
            <div className="pt-2 border-t border-border/50 flex flex-wrap gap-1">
              {modifierGroups.map((g) => (
                <span key={g.id} className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium">
                  {g.name.split('(')[0].trim()} ({g.options.length})
                </span>
              ))}
            </div>
          )}

          {customizationType === 'matrix_retail' && matrixVariants.length > 0 && (
            <div className="pt-2 border-t border-border/50 flex flex-wrap gap-1">
              {matrixVariants.map((v) => (
                <span key={v.sku} className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium">
                  {v.name} ({v.stock} pcs)
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Financial Margin & Ledger Summary */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-semibold">Estimasi Margin Laba:</span>
            <span className="font-mono font-bold text-emerald-400 text-xs">{calculatedMargin}%</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Laba Bersih per Item:</span>
            <span className="font-mono font-bold text-foreground">
              Rp {Math.max(0, price - cogs).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Landmark className="w-3 h-3 text-indigo-400" /> Buku Besar Hfe CORE:
            </span>
            <span className="font-mono font-bold text-indigo-400">GL 4101 (Pendapatan)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Dock */}
      <div className="pt-3 border-t border-border flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 h-10 rounded-xl text-xs font-semibold cursor-pointer"
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="amber"
          className="flex-1 h-10 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
        >
          {isEditing ? 'Simpan Data' : 'Simpan Produk ➔'}
        </Button>
      </div>
    </div>
  )
}
