import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { COA_ID_AGRICULTURE_FARM } from '../../data/presets/coaPresets'
import { Button, Badge, Card, PriceTag, Input } from '@/ui'
import { Sprout, TreePine, DollarSign, CheckCircle2, Leaf, ArrowRight } from 'lucide-react'

interface PlantationPlot {
  plotId: string
  locationName: string
  hectares: number
  treeCount: number
  fairValuePerTree: number
  immatureCount: number
  harvestKg: number
  pickingCostPerKg: number
  isRevalued: boolean
  isHarvestLogged: boolean
}

interface GayoHarvestScenarioProps {
  plot: PlantationPlot
  presetId?: string
}

export const BiologicalAssetRegistryView: React.FC<GayoHarvestScenarioProps> = ({
  plot: initialPlot,
  presetId = COA_ID_AGRICULTURE_FARM.id,
}) => {
  const [plot, setPlot] = useState<PlantationPlot>(initialPlot)
  const [cherryKg, setCherryKg] = useState<number>(initialPlot.harvestKg)

  const totalFairValue = plot.treeCount * plot.fairValuePerTree
  const fairValueGain = plot.isRevalued ? Math.round(totalFairValue * 0.12) : 0
  const totalPickingCost = cherryKg * plot.pickingCostPerKg
  const produceInventoryValue = cherryKg * 18000 // Rp 18.000 / kg market price at harvest point

  const handleRevaluePsak69 = () => {
    setPlot((prev) => ({ ...prev, isRevalued: true }))
  }

  const handleLogHarvest = () => {
    setPlot((prev) => ({ ...prev, isHarvestLogged: true, harvestKg: cherryKg }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">Gayo Plantation PSAK 69 / IAS 41 Registry</h1>
              <Badge variant="default" className="text-[10px] py-0 bg-emerald-600 text-white font-bold">
                SCN-01-05-01
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">CoA Preset: {presetId}</p>
          </div>
        </div>

        <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-mono">
          Plot: {plot.plotId || 'N/A'} ({plot.hectares} Ha)
        </Badge>
      </div>

      {/* Main Registry Card */}
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400" /> Aset Biologis Pohon Kopi (PSAK 69 / Akun 1410)
            </span>
            <span className="text-[11px] font-mono text-slate-400">{plot.locationName}</span>
          </div>

          {/* Asset Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Pohon Produktif (1410)</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {plot.treeCount.toLocaleString('id-ID')} Pohon
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Bibit Belum Menghasilkan (1420)</span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {plot.immatureCount.toLocaleString('id-ID')} Bibit
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Nilai Wajar Aset (1410)</span>
              <div className="mt-0.5">
                <PriceTag amount={totalFairValue} size="xs" variant="accent" />
              </div>
            </div>
          </div>

          {/* PSAK 69 Fair Value Gain Section */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Keuntungan Nilai Wajar Aset Biologis (Akun 4210):</span>
              <PriceTag amount={fairValueGain} size="sm" variant="accent" />
            </div>

            {plot.isRevalued ? (
              <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Revaluasi Nilai Wajar PSAK 69 (+12%) Terposting ke Akun 1410 & 4210</span>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                onClick={handleRevaluePsak69}
                data-testid="btn-revalue-psak69"
              >
                <DollarSign className="w-4 h-4 mr-1" /> Eksekusi Revaluasi Nilai Wajar PSAK 69 (Fair Value Gain)
              </Button>
            )}
          </div>

          {/* Harvest Produce Logging Section */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-amber-400" /> Pencatatan Panen Ceri Kopi Segar (Agricultural Produce)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Hasil Petik Ceri Merah (kg):</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    data-testid="input-harvest-kg"
                    value={cherryKg || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCherryKg(parseFloat(e.target.value) || 0)}
                    placeholder="0 kg"
                    className="bg-slate-900 border-slate-800 text-sm font-mono text-white"
                  />
                  <span className="text-xs text-slate-400 font-bold">kg</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Nilai Persediaan Panen (Akun 1350):</label>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <PriceTag amount={produceInventoryValue} size="xs" variant="accent" />
                </div>
              </div>
            </div>

            {plot.isHarvestLogged ? (
              <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Panen {plot.harvestKg} kg Ceri Merah Masuk Persediaan (1350) & Upah Petik (5310)</span>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                onClick={handleLogHarvest}
                data-testid="btn-log-harvest"
              >
                <ArrowRight className="w-4 h-4 mr-1" /> Catat Panen & Jurnal Persediaan Hasil Panen (1350)
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

const meta: Meta<typeof BiologicalAssetRegistryView> = {
  title: 'Scenarios/SCN-01-05-01 Gayo Harvest PSAK 69',
  component: BiologicalAssetRegistryView,
  parameters: {
    scenarioId: 'SCN-01-05-01',
    preset: 'COA_ID_PLANTATION_AGRI',
    layout: 'fullscreen',
  },
  args: {
    plot: {
      plotId: 'PLOT-GAYO-01',
      locationName: 'Blang Gele, Takengon (1.400 mdpl)',
      hectares: 2.5,
      treeCount: 3500,
      fairValuePerTree: 55000,
      immatureCount: 500,
      harvestKg: 450,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof BiologicalAssetRegistryView>

// Quadrant 1: Zero / Empty State
export const EmptyState: Story = {
  args: {
    plot: {
      plotId: 'PLOT-EMPTY',
      locationName: 'Lahan Kosong Takengon',
      hectares: 0,
      treeCount: 0,
      fairValuePerTree: 45000,
      immatureCount: 0,
      harvestKg: 0,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false,
    },
  },
}

// Quadrant 2: Extreme Short Initial State
export const ShortInitialState: Story = {
  args: {
    plot: {
      plotId: 'P1',
      locationName: 'Plot 1',
      hectares: 1,
      treeCount: 50,
      fairValuePerTree: 45000,
      immatureCount: 10,
      harvestKg: 20,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false,
    },
  },
}

// Quadrant 3: Extreme Long / Overflow 1 Billion State
export const ExtremeOverflow1Billion: Story = {
  args: {
    plot: {
      plotId: 'PLOT-ESTATE-TAKENGON-HIGHLANDS-GAYO-CENTRAL-ACEH-VALLEY-500HA',
      locationName: 'Perkebunan Kopi Organik Dataran Tinggi Takengon HGU No. 88/2026',
      hectares: 500,
      treeCount: 250000,
      fairValuePerTree: 18000,
      immatureCount: 50000,
      harvestKg: 75000,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false,
    },
  },
}

// Quadrant 4: Multi-State Harvest Produce (Active Harvest & Revaluation)
export const MultiStateHarvestProduce: Story = {
  args: {
    plot: {
      plotId: 'PLOT-GAYO-KENAWAT-04',
      locationName: 'Kebun Arabica Specialty Kenawat (1,400 mdpl)',
      hectares: 5,
      treeCount: 3500,
      fairValuePerTree: 45000,
      immatureCount: 400,
      harvestKg: 250,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const revalueBtn = await canvas.findByTestId('btn-revalue-psak69')
    await userEvent.click(revalueBtn)

    const harvestInput = await canvas.findByTestId('input-harvest-kg')
    await userEvent.clear(harvestInput)
    await userEvent.type(harvestInput, '250')

    const logHarvestBtn = await canvas.findByTestId('btn-log-harvest')
    await userEvent.click(logHarvestBtn)
  },
}
