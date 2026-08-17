import React, { useState } from 'react'
import {
  Flame,
  Scale,
  CheckCircle2,
  RefreshCw,
  Package,
  Boxes,
  FileCheck2,
  X,
  Sparkles
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  PriceTag,
  Input
} from '@/ui'

export interface BomRecipe {
  id: string
  name: string
  category: string
  baseBatchGreenKg: number
  shrinkagePct: number
  roastedOutputKg: number
  packSizeKg: number
  targetPackCount: number
  greenBeanCostPerKg: number
  valveBagCostPerPcs: number
  directLaborCostPerBatch: number
  overheadGasElectricity: number
}

export const PRESET_BOM_RECIPES: BomRecipe[] = [
  {
    id: 'REC-GAYO-MED-100',
    name: 'Arabica Gayo Medium Roast - 100kg batch',
    category: 'Single Origin Espresso',
    baseBatchGreenKg: 100,
    shrinkagePct: 15,
    roastedOutputKg: 85,
    packSizeKg: 1.0,
    targetPackCount: 85,
    greenBeanCostPerKg: 125000,
    valveBagCostPerPcs: 4500,
    directLaborCostPerBatch: 350000,
    overheadGasElectricity: 220000
  },
  {
    id: 'REC-TORAJA-DRK-50',
    name: 'Toraja Kalosi Dark Roast - 50kg batch',
    category: 'French Dark Roast',
    baseBatchGreenKg: 50,
    shrinkagePct: 17,
    roastedOutputKg: 41.5,
    packSizeKg: 0.5,
    targetPackCount: 83,
    greenBeanCostPerKg: 140000,
    valveBagCostPerPcs: 3500,
    directLaborCostPerBatch: 200000,
    overheadGasElectricity: 130000
  },
  {
    id: 'REC-KINTAMANI-LGT-200',
    name: 'Bali Kintamani Honey Light - 200kg batch',
    category: 'Filter Specialty',
    baseBatchGreenKg: 200,
    shrinkagePct: 13.5,
    roastedOutputKg: 173,
    packSizeKg: 0.25,
    targetPackCount: 692,
    greenBeanCostPerKg: 165000,
    valveBagCostPerPcs: 2800,
    directLaborCostPerBatch: 600000,
    overheadGasElectricity: 410000
  }
]

export interface InventoryAssemblyModalProps {
  isOpen?: boolean
  onClose?: () => void
  onAssemblySuccess?: (result: {
    batchNumber: string
    recipeName: string
    outputKg: number
    totalCost: number
    cogmPerKg: number
  }) => void
}

export const InventoryAssemblyModal: React.FC<InventoryAssemblyModalProps> = ({
  isOpen = true,
  onClose,
  onAssemblySuccess
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(PRESET_BOM_RECIPES[0].id)
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1)
  const [customMoistureLoss, setCustomMoistureLoss] = useState<number>(15)
  const [isExecuting, setIsExecuting] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [confirmedBatchNo, setConfirmedBatchNo] = useState<string>('')

  const recipe = PRESET_BOM_RECIPES.find((r) => r.id === selectedRecipeId) || PRESET_BOM_RECIPES[0]

  const greenBeanConsumedKg = recipe.baseBatchGreenKg * batchMultiplier
  const roastedOutputKg = greenBeanConsumedKg * (1 - customMoistureLoss / 100)
  const valveBagConsumedPcs = Math.ceil(roastedOutputKg / recipe.packSizeKg)

  const greenBeanTotalCost = greenBeanConsumedKg * recipe.greenBeanCostPerKg
  const packagingTotalCost = valveBagConsumedPcs * recipe.valveBagCostPerPcs
  const laborTotalCost = recipe.directLaborCostPerBatch * batchMultiplier
  const overheadTotalCost = recipe.overheadGasElectricity * batchMultiplier
  const totalProductionCost = greenBeanTotalCost + packagingTotalCost + laborTotalCost + overheadTotalCost
  const cogmPerKg = roastedOutputKg > 0 ? totalProductionCost / roastedOutputKg : 0
  const cogmPerPack = valveBagConsumedPcs > 0 ? totalProductionCost / valveBagConsumedPcs : 0

  const handleExecuteAssembly = () => {
    setIsExecuting(true)
    setTimeout(() => {
      const generatedBatch = `BOM-${Date.now().toString().slice(-6)}`
      setConfirmedBatchNo(generatedBatch)
      setIsExecuting(false)
      setIsCompleted(true)
      onAssemblySuccess?.({
        batchNumber: generatedBatch,
        recipeName: recipe.name,
        outputKg: roastedOutputKg,
        totalCost: totalProductionCost,
        cogmPerKg
      })
    }, 800)
  }

  if (!isOpen) return null

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">Roasting BOM Assembly &amp; COGM</h2>
              <Badge variant="default">Pillar 6: Inventory BOM</Badge>
            </div>
            <p className="text-xs text-slate-400">Perakitan Green Beans menjadi Roasted Coffee dengan kalkulasi susut &amp; COGM.</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
        )}
      </div>

      {isCompleted ? (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">BOM Berhasil Diposting ke TigerBeetle!</h3>
            <p className="text-xs text-slate-300">Nomor Batch: <span className="font-mono text-emerald-400 font-bold">{confirmedBatchNo}</span></p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 max-w-2xl mx-auto">
            <div><div className="text-[10px] text-slate-400">Output Roasted</div><div className="text-sm font-bold font-mono text-white tabular-nums">{roastedOutputKg.toFixed(1)} kg</div></div>
            <div><div className="text-[10px] text-slate-400">Pack Jadi</div><div className="text-sm font-bold font-mono text-white tabular-nums">{valveBagConsumedPcs} pcs</div></div>
            <div><div className="text-[10px] text-slate-400">Total COGM</div><PriceTag amount={totalProductionCost} size="sm" variant="accent" /></div>
            <div><div className="text-[10px] text-slate-400">COGM/Kg</div><PriceTag amount={cogmPerKg} size="sm" variant="emerald" /></div>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsCompleted(false)}><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Rakit Lagi</Button>
            {onClose && <Button variant="default" size="sm" onClick={onClose}>Tutup</Button>}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"><Boxes className="w-3.5 h-3.5 text-amber-400" /> Resep Standar BOM Roastery</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_BOM_RECIPES.map((r) => (
                  <button key={r.id} type="button" onClick={() => { setSelectedRecipeId(r.id); setCustomMoistureLoss(r.shrinkagePct) }} className={`p-2.5 rounded-xl text-left border transition-all ${selectedRecipeId === r.id ? 'bg-amber-500/15 border-amber-500/50 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                    <div className="text-xs font-bold line-clamp-1 text-slate-200">{r.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{r.category}</div>
                    <div className="text-[11px] font-mono font-semibold text-amber-400 mt-1">{r.baseBatchGreenKg} kg / batch</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 text-sky-400" /> Skala Batch &amp; Susut</label>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-2.5">
                <div className="flex justify-between text-[11px] text-slate-400"><span>Batch:</span><span className="font-mono text-white font-bold">{batchMultiplier}x ({greenBeanConsumedKg} kg)</span></div>
                <div className="flex gap-1.5">
                  {[1, 2, 5].map((m) => (
                    <button key={m} type="button" onClick={() => setBatchMultiplier(m)} className={`flex-1 py-0.5 rounded-lg text-xs font-mono font-bold border ${batchMultiplier === m ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>{m}x</button>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400"><span>Moisture Loss:</span><span className="font-mono text-amber-300 font-bold">{customMoistureLoss}%</span></div>
                  <Input type="range" min="10" max="22" step="0.5" value={customMoistureLoss} onChange={(e) => setCustomMoistureLoss(parseFloat(e.target.value))} className="h-5 cursor-pointer mt-0.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2"><Package className="w-3.5 h-3.5 text-emerald-400" /> Komposisi Bahan &amp; Biaya Pabrikasi</h3>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                    <th className="p-2.5 font-sans">Komponen / Akun</th><th className="p-2.5 text-right">Kuantitas</th><th className="p-2.5 text-right">Tarif</th><th className="p-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-sans"><div className="font-bold text-white">Green Beans Mentah</div><div className="text-[10px] text-slate-400">1320 Persediaan Bahan Baku</div></td>
                    <td className="p-2.5 text-right tabular-nums text-amber-400 font-bold">{greenBeanConsumedKg} kg</td>
                    <td className="p-2.5 text-right tabular-nums">Rp {recipe.greenBeanCostPerKg.toLocaleString('id-ID')}</td>
                    <td className="p-2.5 text-right tabular-nums font-bold text-white">Rp {greenBeanTotalCost.toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans"><div className="font-bold text-white">Valve Packaging ({recipe.packSizeKg}kg)</div><div className="text-[10px] text-slate-400">1330 Perlengkapan Kemasan</div></td>
                    <td className="p-2.5 text-right tabular-nums text-sky-400 font-bold">{valveBagConsumedPcs} pcs</td>
                    <td className="p-2.5 text-right tabular-nums">Rp {recipe.valveBagCostPerPcs.toLocaleString('id-ID')}</td>
                    <td className="p-2.5 text-right tabular-nums font-bold text-white">Rp {packagingTotalCost.toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans"><div className="font-bold text-white">Tenaga Kerja Roaster</div><div className="text-[10px] text-slate-400">5200 Upah Langsung</div></td>
                    <td className="p-2.5 text-right tabular-nums">{batchMultiplier} Batch</td>
                    <td className="p-2.5 text-right tabular-nums">Rp {recipe.directLaborCostPerBatch.toLocaleString('id-ID')}</td>
                    <td className="p-2.5 text-right tabular-nums font-bold text-white">Rp {laborTotalCost.toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans"><div className="font-bold text-white">Overhead Gas &amp; Listrik</div><div className="text-[10px] text-slate-400">5300 Overhead Pabrik</div></td>
                    <td className="p-2.5 text-right tabular-nums">{batchMultiplier} Batch</td>
                    <td className="p-2.5 text-right tabular-nums">Rp {recipe.overheadGasElectricity.toLocaleString('id-ID')}</td>
                    <td className="p-2.5 text-right tabular-nums font-bold text-white">Rp {overheadTotalCost.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="bg-slate-900/80 border-slate-800">
              <CardHeader className="p-3 pb-1"><CardTitle className="text-xs uppercase text-slate-400 font-mono">Hasil Roasting &amp; COGM</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800"><span className="text-slate-300">Output:</span><span className="font-mono font-bold text-emerald-400 tabular-nums">{roastedOutputKg.toFixed(1)} kg ({valveBagConsumedPcs} pack)</span></div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800"><span className="text-slate-300">Total Biaya Produksi:</span><PriceTag amount={totalProductionCost} size="sm" variant="accent" /></div>
                <div className="flex justify-between items-center py-1"><span className="text-slate-300">COGM per Kg:</span><PriceTag amount={cogmPerKg} size="sm" variant="emerald" /></div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-slate-800">
              <CardHeader className="p-3 pb-1"><CardTitle className="text-xs uppercase text-slate-400 font-mono flex items-center gap-1.5"><FileCheck2 className="w-3.5 h-3.5 text-purple-400" /> Pratinjau Dual-Post TB</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-emerald-400"><span>[DR] 1310 Persediaan Barang Jadi</span><span className="tabular-nums">Rp {totalProductionCost.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-slate-400 pl-3"><span>[CR] 1320 Persediaan Bahan Baku</span><span className="tabular-nums">Rp {greenBeanTotalCost.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-slate-400 pl-3"><span>[CR] 1330 Perlengkapan Kemasan</span><span className="tabular-nums">Rp {packagingTotalCost.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-slate-400 pl-3"><span>[CR] 5200/5300 Alokasi Upah &amp; Overhead</span><span className="tabular-nums">Rp {(laborTotalCost + overheadTotalCost).toLocaleString('id-ID')}</span></div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-1 flex justify-end gap-2">
            {onClose && <Button variant="outline" size="sm" onClick={onClose} disabled={isExecuting}>Batal</Button>}
            <Button variant="default" size="sm" onClick={handleExecuteAssembly} disabled={isExecuting} className="gap-1.5 text-xs">
              {isExecuting ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Posting...</> : <><Sparkles className="w-3.5 h-3.5" /> Eksekusi Perakitan BOM &amp; Post COGM</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
