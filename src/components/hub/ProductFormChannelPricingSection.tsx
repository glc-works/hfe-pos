import React from 'react'
import { Button, TextInput } from '../../ui'
import { Bike, Smartphone, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'

interface ProductFormChannelPricingSectionProps {
  price: number
  showChannelPricing: boolean
  setShowChannelPricing: (show: boolean) => void
  channelMarkupPercent: number
  setChannelMarkupPercent: (percent: number) => void
  effectiveDeliveryPrice: number
  customDeliveryPrice: number | null
  setCustomDeliveryPrice: (price: number | null) => void
}

export const ProductFormChannelPricingSection: React.FC<ProductFormChannelPricingSectionProps> = ({
  price,
  showChannelPricing,
  setShowChannelPricing,
  channelMarkupPercent,
  setChannelMarkupPercent,
  effectiveDeliveryPrice,
  customDeliveryPrice,
  setCustomDeliveryPrice
}) => {
  return (
    <div className="pt-2 border-t border-border/60">
      <button
        type="button"
        onClick={() => setShowChannelPricing(!showChannelPricing)}
        className="w-full flex items-center justify-between h-10 px-3 rounded-xl bg-background hover:bg-muted/80 border border-border text-xs font-semibold text-foreground transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Bike className="w-4 h-4 text-amber-500" />
          <span>Atur Saluran Online (GoFood, GrabFood, QR)</span>
        </div>
        {showChannelPricing ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {/* Level 2/3 Expanded Multi-Channel Matrix */}
      {showChannelPricing && (
        <div className="mt-2.5 p-3.5 rounded-xl bg-card border border-border space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">🛵 Saluran Delivery (GoFood / GrabFood):</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Markup:</span>
              <select
                value={channelMarkupPercent}
                onChange={(e) => {
                  setChannelMarkupPercent(Number(e.target.value))
                  setCustomDeliveryPrice(null)
                }}
                className="h-8 px-2.5 bg-muted rounded-lg border border-border text-xs font-mono text-foreground focus:outline-none"
              >
                <option value={20}>+20%</option>
                <option value={25}>+25% (Rekomendasi)</option>
                <option value={30}>+30%</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TextInput
              type="number"
              value={effectiveDeliveryPrice}
              onChange={(e) => setCustomDeliveryPrice(Number(e.target.value))}
              className="flex-1 h-10 px-3 text-xs bg-background border-border rounded-xl font-mono font-bold"
            />
            {customDeliveryPrice !== null ? (
              <div className="flex items-center gap-1">
                <span className="h-10 px-2.5 flex items-center bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[11px] font-bold">
                  ✏️ Kustom
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setCustomDeliveryPrice(null)}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl text-muted-foreground hover:text-foreground"
                  title="Reset ke Auto Markup"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <span className="h-10 px-3 flex items-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[11px] font-mono font-bold">
                ⚡ Auto +{channelMarkupPercent}%
              </span>
            )}
          </div>

          {/* QR Self-Order */}
          <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-muted-foreground">📱 QR Order Meja:</span>
            </div>
            <span className="font-mono font-bold text-foreground">
              Rp {price.toLocaleString('id-ID')} (Sama dg Toko)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
