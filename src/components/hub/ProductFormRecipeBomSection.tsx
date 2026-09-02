import React from 'react'
import { Button, TextInput } from '../../ui'
import { ChefHat, Plus, Trash2, Sparkles, Scale, Layers } from 'lucide-react'

export interface RecipeIngredient {
  name: string
  amount: string
  cost: number
}

interface ProductFormRecipeBomSectionProps {
  ingredients: RecipeIngredient[]
  setIngredients: (ingredients: RecipeIngredient[]) => void
  onUpdateTotalCogs: (totalCogs: number) => void
}

export const ProductFormRecipeBomSection: React.FC<ProductFormRecipeBomSectionProps> = ({
  ingredients,
  setIngredients,
  onUpdateTotalCogs
}) => {
  const handleAddIngredient = () => {
    const newIngredients = [...ingredients, { name: '', amount: '10 Gram', cost: 2000 }]
    setIngredients(newIngredients)
    const total = newIngredients.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
    onUpdateTotalCogs(total)
  }

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index)
    setIngredients(newIngredients)
    const total = newIngredients.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
    onUpdateTotalCogs(total)
  }

  const handleChangeIngredient = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
    const total = newIngredients.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
    onUpdateTotalCogs(total)
  }

  const totalBomCost = ingredients.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)

  return (
    <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-foreground">
            Komposisi Bahan &amp; BoM (Bill of Materials)
          </h4>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-400">
          Total HPP: Rp {totalBomCost.toLocaleString('id-ID')}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-tight">
        Setiap penjualan produk/jasa ini di POS atau Ojol otomatis memotong stok bahan baku &amp; material gudang.
      </p>

      {/* Ingredient Items List */}
      <div className="space-y-2">
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-border/80 text-xs">
            <TextInput
              value={ing.name}
              onChange={(e) => handleChangeIngredient(idx, 'name', e.target.value)}
              placeholder="Nama bahan baku / komponen"
              className="flex-[2] h-10 px-3 bg-muted/40 border-border rounded-xl text-xs"
            />
            <TextInput
              value={ing.amount}
              onChange={(e) => handleChangeIngredient(idx, 'amount', e.target.value)}
              placeholder="Takaran (cth: 18 Gram / 1 Pcs)"
              className="flex-1 h-10 px-3 bg-muted/40 border-border rounded-xl text-xs font-mono"
            />
            <div className="flex items-center gap-1.5 flex-1 min-w-[110px]">
              <span className="text-[11px] text-muted-foreground">Rp</span>
              <TextInput
                type="number"
                value={ing.cost}
                onChange={(e) => handleChangeIngredient(idx, 'cost', Number(e.target.value))}
                placeholder="HPP"
                className="w-full h-10 px-3 bg-muted/40 border-border rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveIngredient(idx)}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              title="Hapus Komponen"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddIngredient}
        className="w-full h-10 rounded-xl text-xs font-bold border-dashed border-border hover:border-amber-500/50 hover:bg-amber-500/5 text-foreground flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-amber-500" />
        <span>+ Tambah Bahan Baku / Material dari Gudang</span>
      </Button>
    </div>
  )
}
