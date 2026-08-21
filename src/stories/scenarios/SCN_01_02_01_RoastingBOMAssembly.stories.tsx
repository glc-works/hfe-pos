import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { COA_ID_ROASTING_MFG } from '../../data/presets/coaPresets'
import { Button, Badge, Card, PriceTag, Input } from '@/ui'
import { Flame, Layers, ArrowRight, CheckCircle2, Factory, Scale, Percent } from 'lucide-react'

interface AssemblyBatchState {
  batchNumber: string
  greenBeanKg: number
  greenBeanCostPerKg: number
  gasCost: number
  laborCost: number
  shrinkageRate: number // 0.15 = 15%
  isPosted: boolean
}

interface RoastingAssemblyProps {
  batch: AssemblyBatchState
  presetId?: string
}

export const RoastingBOMAssemblyView: React.FC<RoastingAssemblyProps> = ({
  batch: initialBatch,
  presetId = COA_ID_ROASTING_MFG.id,
}) => {
  const [batch, setBatch] = useState<AssemblyBatchState>(initialBatch)
  const [roastedKg, setRoastedKg] = useState<number>(
    initialBatch.greenBeanKg * (1 - initialBatch.shrinkageRate)
  )

  const greenBeanTotal = batch.greenBeanKg * batch.greenBeanCostPerKg
  const shrinkageLossKg = batch.greenBeanKg * batch.shrinkageRate
  const totalCogm = greenBeanTotal + batch.gasCost + batch.laborCost
  const unitCogmPerKg = roastedKg > 0 ? totalCogm / roastedKg : 0

  const handleUpdateKg = (kg: number) => {
    setBatch((prev) => ({ ...prev, greenBeanKg: kg }))
    setRoastedKg(kg * (1 - batch.shrinkageRate))
  }

  const handlePostCogm = () => {
    setBatch((prev) => ({ ...prev, isPosted: true }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">Roastery Assembly & COGM Engine</h1>
              <Badge variant="default" className="text-[10px] py-0 bg-amber-600 text-white font-bold">
                SCN-01-02-01
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">CoA Preset: {presetId}</p>
          </div>
        </div>

        <Badge variant="outline" className="text-amber-400 border-amber-500/40 bg-amber-500/10 font-mono">
          Lot: {batch.batchNumber || 'N/A'}
        </Badge>
      </div>

      {/* Main Assembly Workstation Card */}
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" /> Bill of Materials (BOM Roasting 15% Susut)
            </span>
            <span className="text-[11px] font-mono text-slate-400">Akun: 1310 → 1320 → 1330</span>
          </div>

          {/* Green Beans Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Green Beans (1310 - Mentah):</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  data-testid="input-green-beans"
                  value={batch.greenBeanKg || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateKg(parseFloat(e.target.value) || 0)}
                  placeholder="0 kg"
                  className="bg-slate-950 border-slate-800 text-sm font-mono text-white"
                />
                <span className="text-xs text-slate-400 font-bold">kg</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Biaya Bahan Baku (Green Beans):</label>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <PriceTag amount={greenBeanTotal} size="sm" variant="muted" />
              </div>
            </div>
          </div>

          {/* Shrinkage Rate & Yield Calculation */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Kadar Susut</span>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center justify-center gap-0.5">
                <Percent className="w-3 h-3" /> {(batch.shrinkageRate * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Bobot Hilang (Air)</span>
              <span className="text-xs font-mono font-bold text-rose-400">
                -{shrinkageLossKg.toFixed(2)} kg
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Yield Roasted (1330)</span>
              <span className="text-xs font-mono font-black text-emerald-400" data-testid="text-roasted-yield">
                {roastedKg.toFixed(2)} kg
              </span>
            </div>
          </div>

          {/* COGM Breakdown & Financial Result */}
          <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Overhead Gas + Upah Roaster (5210/5220):</span>
              <PriceTag amount={batch.gasCost + batch.laborCost} size="xs" variant="muted" />
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-200 font-bold">Total Harga Pokok Produksi (COGM 5100):</span>
              <PriceTag amount={totalCogm} size="sm" variant="accent" />
            </div>
            <div className="flex justify-between text-[11px] text-amber-300 font-mono">
              <span>HPP per Kg Biji Sangrai:</span>
              <span>Rp {Math.round(unitCogmPerKg).toLocaleString('id-ID')} / kg</span>
            </div>
          </div>

          {/* Post COGM Button */}
          {batch.isPosted ? (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Jurnal COGM #COGM-{batch.batchNumber} Berhasil Diposting ke Subledger</span>
            </div>
          ) : (
            <Button
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              onClick={handlePostCogm}
              data-testid="btn-post-cogm"
            >
              <Flame className="w-4 h-4 mr-1.5" /> Posting Produksi & Jurnal COGM (CoA 5100)
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}

const meta: Meta<typeof RoastingBOMAssemblyView> = {
  title: 'Scenarios/SCN-01-02-01 Roasting BOM Assembly',
  component: RoastingBOMAssemblyView,
  parameters: {
    scenarioId: 'SCN-01-02-01',
    preset: 'COA_ID_ROASTING_MFG',
    layout: 'fullscreen',
  },
  args: {
    batch: {
      batchNumber: 'LOT-GAYO-ANAEROBIC-2026-B08',
      greenBeanKg: 20,
      greenBeanCostPerKg: 140000,
      gasCost: 65000,
      laborCost: 85000,
      shrinkageRate: 0.15,
      isPosted: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof RoastingBOMAssemblyView>

// Quadrant 1: Zero / Empty State
export const EmptyState: Story = {
  args: {
    batch: {
      batchNumber: 'LOT-EMPTY',
      greenBeanKg: 0,
      greenBeanCostPerKg: 120000,
      gasCost: 0,
      laborCost: 0,
      shrinkageRate: 0.15,
      isPosted: false,
    },
  },
}

// Quadrant 2: Extreme Short Initial State
export const ShortInitialState: Story = {
  args: {
    batch: {
      batchNumber: 'L1',
      greenBeanKg: 1,
      greenBeanCostPerKg: 120000,
      gasCost: 15000,
      laborCost: 20000,
      shrinkageRate: 0.15,
      isPosted: false,
    },
  },
}

// Quadrant 3: Extreme Long / Overflow 1 Billion State
export const ExtremeOverflow1Billion: Story = {
  args: {
    batch: {
      batchNumber: 'LOT-INDUSTRIAL-BATCH-GAYO-SUPER-EXTRA-LONG-SPEC-2026-X999',
      greenBeanKg: 10000,
      greenBeanCostPerKg: 120000,
      gasCost: 25000000,
      laborCost: 25000000,
      shrinkageRate: 0.15,
      isPosted: false,
    },
  },
}

// Quadrant 4: Multi-State Roasting Assembly (Batch in Progress & Ready to Post)
export const MultiStateAssembly: Story = {
  args: {
    batch: {
      batchNumber: 'LOT-GAYO-ANAEROBIC-2026-B08',
      greenBeanKg: 20,
      greenBeanCostPerKg: 140000,
      gasCost: 65000,
      laborCost: 85000,
      shrinkageRate: 0.15,
      isPosted: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = await canvas.findByTestId('input-green-beans')
    await userEvent.clear(input)
    await userEvent.type(input, '20')

    const postBtn = await canvas.findByTestId('btn-post-cogm')
    await userEvent.click(postBtn)

    const yieldText = await canvas.findByTestId('text-roasted-yield')
    expect(yieldText).toBeDefined()
  },
}
