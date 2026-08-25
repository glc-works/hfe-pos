import React, { useState } from 'react'
import {
  Trees,
  Sprout,
  TrendingUp,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  Button,
  Badge,
  PriceTag,
  Input
} from '@/ui'

export interface TreeBlock {
  id: string
  blockName: string
  areaHa: number
  treeCount: number
  variety: string
  plantingYear: number
  healthStatus: 'optimal' | 'moderate' | 'treatment'
  fairValuePerTree: number
}

export const INITIAL_PLANTATION_BLOCKS: TreeBlock[] = [
  {
    id: 'BLK-A1',
    blockName: 'Blok A1 - Pantan Cuaca (Gayo Highlands)',
    areaHa: 20,
    treeCount: 20000,
    variety: 'Arabica Ateng Super',
    plantingYear: 2021,
    healthStatus: 'optimal',
    fairValuePerTree: 60000
  },
  {
    id: 'BLK-B2',
    blockName: 'Blok B2 - Bener Meriah Ridge',
    areaHa: 18,
    treeCount: 18000,
    variety: 'Arabica Tim Tim & Typica',
    plantingYear: 2020,
    healthStatus: 'optimal',
    fairValuePerTree: 60000
  },
  {
    id: 'BLK-C3',
    blockName: 'Blok C3 - Takengon Lakeside',
    areaHa: 12,
    treeCount: 12000,
    variety: 'Arabica Bourbon & Gayo 1',
    plantingYear: 2022,
    healthStatus: 'moderate',
    fairValuePerTree: 60000
  }
]

export const BiologicalAssetRegistry: React.FC = () => {
  const [blocks, setBlocks] = useState<TreeBlock[]>(INITIAL_PLANTATION_BLOCKS)
  const [showRevalModal, setShowRevalModal] = useState<boolean>(false)
  const [showHarvestModal, setShowHarvestModal] = useState<boolean>(false)
  const [newFairValuePerTree, setNewFairValuePerTree] = useState<number>(65000)
  const [revalSuccessMsg, setRevalSuccessMsg] = useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string>(INITIAL_PLANTATION_BLOCKS[0].id)
  const [harvestWeightKg, setHarvestWeightKg] = useState<number>(12500)
  const [cherryMarketPricePerKg, setCherryMarketPricePerKg] = useState<number>(14000)
  const [harvestSuccessMsg, setHarvestSuccessMsg] = useState<string | null>(null)

  const totalAreaHa = blocks.reduce((acc, b) => acc + b.areaHa, 0)
  const totalTrees = blocks.reduce((acc, b) => acc + b.treeCount, 0)
  const totalValuation = blocks.reduce((acc, b) => acc + b.treeCount * b.fairValuePerTree, 0)
  const avgFairValuePerTree = totalTrees > 0 ? totalValuation / totalTrees : 0

  const handleExecuteRevaluation = () => {
    setBlocks(blocks.map((b) => ({ ...b, fairValuePerTree: newFairValuePerTree })))
    setShowRevalModal(false)
    setRevalSuccessMsg(`Revaluasi PSAK 69 Berhasil! Nilai wajar Rp ${newFairValuePerTree.toLocaleString('id-ID')}/pohon.`)
    setTimeout(() => setRevalSuccessMsg(null), 4000)
  }

  const handleRecordHarvest = () => {
    setShowHarvestModal(false)
    setHarvestSuccessMsg(`Panen Ceri Kopi ${harvestWeightKg.toLocaleString('id-ID')} kg berhasil dicatat & diposting!`)
    setTimeout(() => setHarvestSuccessMsg(null), 4000)
  }

  return (
    <div className="space-y-5 w-full max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Trees className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Registri Aset Biologis (PSAK 69 / IAS 41)</h2>
              <Badge variant="emerald">IFRS Active</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pengakuan nilai wajar tanaman kopi &amp; penimbangan panen ceri.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowRevalModal(true)} className="gap-1.5 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Revaluasi Nilai Wajar Semesteran
          </Button>
          <Button variant="default" size="sm" onClick={() => setShowHarvestModal(true)} className="gap-1.5 text-xs">
            <Sprout className="w-3.5 h-3.5" /> Catat Timbangan Panen Ceri Kopi
          </Button>
        </div>
      </div>

      {revalSuccessMsg && (
        <div className="bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /><span>{revalSuccessMsg}</span>
        </div>
      )}
      {harvestSuccessMsg && (
        <div className="bg-sky-500/10 dark:bg-sky-950/60 border border-sky-500/50 p-3 rounded-xl text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" /><span>{harvestSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="p-3 pb-0"><CardDescription className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Luas Perkebunan</CardDescription></CardHeader>
          <CardContent className="p-3 pt-1"><div className="text-lg font-black font-mono text-slate-900 dark:text-white tabular-nums">{totalAreaHa} Ha</div><div className="text-[10px] text-emerald-600 dark:text-emerald-400">100% Hak Guna Usaha</div></CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="p-3 pb-0"><CardDescription className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Pohon Produktif</CardDescription></CardHeader>
          <CardContent className="p-3 pt-1"><div className="text-lg font-black font-mono text-slate-900 dark:text-white tabular-nums">{totalTrees.toLocaleString('id-ID')} Pohon</div><div className="text-[10px] text-slate-500 dark:text-slate-400">Arabica Dataran Tinggi</div></CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="p-3 pb-0"><CardDescription className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Nilai Wajar / Pohon</CardDescription></CardHeader>
          <CardContent className="p-3 pt-1"><PriceTag amount={avgFairValuePerTree} size="md" variant="accent" /><div className="text-[10px] text-amber-700 dark:text-amber-300">Tingkat 2 Benchmark</div></CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="p-3 pb-0"><CardDescription className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Total Valuasi Biologis</CardDescription></CardHeader>
          <CardContent className="p-3 pt-1"><PriceTag amount={totalValuation} size="md" variant="emerald" /><div className="text-[10px] text-slate-500 dark:text-slate-400">Akun: 1450 Aset Biologis</div></CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Rincian Blok Perkebunan
        </h3>
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs font-mono shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <th className="p-3 font-sans">Nama Blok</th><th className="p-3 text-right">Luas</th><th className="p-3 text-right">Pohon</th><th className="p-3 font-sans">Varietas</th><th className="p-3 text-right">Nilai Wajar</th><th className="p-3 text-right">Total Valuasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-800 dark:text-slate-300">
              {blocks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                  <td className="p-3 font-sans"><div className="font-bold text-slate-900 dark:text-white">{b.blockName}</div><div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{b.id}</div></td>
                  <td className="p-3 text-right tabular-nums">{b.areaHa} Ha</td>
                  <td className="p-3 text-right tabular-nums text-slate-900 dark:text-white font-bold">{b.treeCount.toLocaleString('id-ID')}</td>
                  <td className="p-3 font-sans"><div className="text-slate-800 dark:text-slate-200">{b.variety}</div><div className="text-[10px] text-slate-500 dark:text-slate-400">Tanam {b.plantingYear}</div></td>
                  <td className="p-3 text-right tabular-nums text-amber-700 dark:text-amber-300">Rp {b.fairValuePerTree.toLocaleString('id-ID')}</td>
                  <td className="p-3 text-right tabular-nums font-bold text-emerald-700 dark:text-emerald-400">Rp {(b.treeCount * b.fairValuePerTree).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRevalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Revaluasi Semesteran (PSAK 69)</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRevalModal(false)}>✕</Button>
            </div>
            <div className="space-y-3 text-xs">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold">Nilai Wajar Baru / Pohon (IDR)</label>
              <Input type="number" value={newFairValuePerTree} onChange={(e) => setNewFairValuePerTree(parseInt(e.target.value) || 0)} className="font-mono text-xs" />
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-700 dark:text-slate-300"><span>Valuasi Baru:</span><span className="text-slate-900 dark:text-white font-bold">Rp {(totalTrees * newFairValuePerTree).toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold"><span>Selisih P&amp;L:</span><span>Rp {((newFairValuePerTree - avgFairValuePerTree) * totalTrees).toLocaleString('id-ID')}</span></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setShowRevalModal(false)}>Batal</Button>
              <Button variant="default" size="sm" onClick={handleExecuteRevaluation}>Terapkan &amp; Post</Button>
            </div>
          </div>
        </div>
      )}

      {showHarvestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><Sprout className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Catat Panen Ceri Kopi</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHarvestModal(false)}>✕</Button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Blok Perkebunan</label>
                <select value={selectedBlockId} onChange={(e) => setSelectedBlockId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-slate-200 text-xs">
                  {blocks.map((b) => (<option key={b.id} value={b.id}>{b.blockName}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Berat (Kg Ceri)</label><Input type="number" value={harvestWeightKg} onChange={(e) => setHarvestWeightKg(parseInt(e.target.value) || 0)} className="font-mono text-xs" /></div>
                <div><label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Harga Wajar (Rp/Kg)</label><Input type="number" value={cherryMarketPricePerKg} onChange={(e) => setCherryMarketPricePerKg(parseInt(e.target.value) || 0)} className="font-mono text-xs" /></div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                <div className="flex justify-between text-slate-700 dark:text-slate-300"><span>Nilai Panen:</span><span className="text-emerald-700 dark:text-emerald-400 font-bold">Rp {(harvestWeightKg * cherryMarketPricePerKg).toLocaleString('id-ID')}</span></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setShowHarvestModal(false)}>Batal</Button>
              <Button variant="default" size="sm" onClick={handleRecordHarvest}>Simpan &amp; Posting</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
