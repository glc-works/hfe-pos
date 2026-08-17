import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { COA_ID_FNB_CAFE } from '../../data/presets/coaPresets'
import { Button, Badge, Card, PriceTag, CapacityBadge, TimerPill } from '@/ui'
import { Users, Split, CheckCircle2, QrCode, Banknote, CreditCard, Sparkles, Store } from 'lucide-react'

// Presentational Component for SCN-01-01-01 BSD Cafe Scenario
interface TableItem {
  id: string
  name: string
  qty: number
  price: number
}

interface TableOrder {
  id: string
  name: string
  seatedGuests: number
  maxCapacity: number
  guestName: string
  elapsedMinutes: number
  items: TableItem[]
  totalBill: number
  isOccupied: boolean
  splitReceipts?: { person: string; amount: number; method: string; paid: boolean }[]
}

interface BsdCafeScenarioProps {
  shiftOpen?: boolean
  table: TableOrder
  showSplitModal?: boolean
  presetId?: string
}

export const BsdCafeScenarioView: React.FC<BsdCafeScenarioProps> = ({
  shiftOpen: initialShiftOpen = true,
  table: initialTable,
  showSplitModal: initialShowSplitModal = false,
  presetId = COA_ID_FNB_CAFE.id,
}) => {
  const [shiftOpen, setShiftOpen] = useState(initialShiftOpen)
  const [table, setTable] = useState<TableOrder>(initialTable)
  const [isSplitOpen, setIsSplitOpen] = useState(initialShowSplitModal)
  const [paxSplit, setPaxSplit] = useState(4)
  const [settledQris, setSettledQris] = useState(false)
  const [activePerson, setActivePerson] = useState(1)

  const splitPerPerson = Math.ceil(table.totalBill / paxSplit)

  const handleOpenShift = () => setShiftOpen(true)
  const handleSelectTable = () => setIsSplitOpen(true)
  const handleSettleQris = () => {
    setSettledQris(true)
    if (activePerson < paxSplit) {
      setActivePerson((p) => p + 1)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">BSD Specialty Cafe & Roastery</h1>
              <Badge variant="default" className="text-[10px] py-0 bg-amber-500 text-slate-950 font-bold">
                SCN-01-01-01
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">CoA Preset: {presetId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!shiftOpen ? (
            <Button size="sm" onClick={handleOpenShift} data-testid="btn-open-shift">
              Buka Shift Kasir
            </Button>
          ) : (
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 bg-emerald-500/10">
              ● Shift Aktif: Kasir Pagi
            </Badge>
          )}
        </div>
      </div>

      {/* Main Floor Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Table 8 Card */}
        <Card
          data-testid="card-table-8"
          onClick={handleSelectTable}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            table.isOccupied
              ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400 ring-1 ring-amber-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Card Top: Entity ID, Area of Focus, Elapsed Timer */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-sm font-black text-white font-mono">{table.name}</span>
            <div className="focal-optical-center">
              <CapacityBadge
                seatedGuests={table.seatedGuests}
                maxCapacity={table.maxCapacity}
                isOccupied={table.isOccupied}
              />
            </div>
            <TimerPill elapsedMinutes={table.elapsedMinutes} />
          </div>

          {/* Guest Name & Items Preview */}
          <div className="space-y-1.5 min-w-0 mb-3">
            <p className="text-xs font-semibold text-slate-300 truncate" title={table.guestName}>
              {table.guestName || 'Meja Kosong (Tersedia)'}
            </p>
            <div className="text-[11px] text-slate-400 space-y-0.5 max-h-16 overflow-hidden">
              {table.items.map((it) => (
                <div key={it.id} className="flex justify-between items-center">
                  <span className="truncate">{it.qty}x {it.name}</span>
                  <PriceTag amount={it.price * it.qty} size="xs" variant="muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Total Bill & Action */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Tagihan:</span>
            <PriceTag amount={table.totalBill} size="sm" variant="accent" />
          </div>
        </Card>
      </div>

      {/* Split Bill Modal Overlay */}
      {isSplitOpen && (
        <div
          data-testid="modal-split-bill"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Split className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Split Bill Granular — {table.name}</h3>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setIsSplitOpen(false)} data-testid="btn-close-split">
                ✕
              </Button>
            </div>

            {/* Split Mode Selector */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Users className="w-4 h-4 text-amber-400" /> Bagi Rata Pax:
              </span>
              <div className="flex gap-1.5">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPaxSplit(num)}
                    data-testid={`btn-pax-${num}`}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold ${
                      paxSplit === num ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Settlement Status */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Bagian Orang ke-{activePerson}:</span>
                <PriceTag amount={splitPerPerson} size="xs" variant="accent" />
              </div>

              {settledQris ? (
                <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>QRIS Settled & Disinkron ke Subledger Meja (CoA 1130)</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                  onClick={handleSettleQris}
                  data-testid="btn-settle-qris"
                >
                  <QrCode className="w-4 h-4 mr-1.5" /> Settle QRIS Bagian {activePerson} (Rp {splitPerPerson.toLocaleString('id-ID')})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const meta: Meta<typeof BsdCafeScenarioView> = {
  title: 'Scenarios/SCN-01-01-01 BSD Cafe Split Bill',
  component: BsdCafeScenarioView,
  parameters: {
    scenarioId: 'SCN-01-01-01',
    preset: 'COA_ID_FNB_CAFE',
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof BsdCafeScenarioView>

// Quadrant 1: Zero / Empty State
export const EmptyState: Story = {
  args: {
    shiftOpen: false,
    table: {
      id: 'T-08',
      name: 'Meja 08',
      seatedGuests: 0,
      maxCapacity: 4,
      guestName: '',
      elapsedMinutes: 0,
      items: [],
      totalBill: 0,
      isOccupied: false,
    },
    showSplitModal: false,
  },
}

// Quadrant 2: Extreme Short Initial State
export const ShortInitialState: Story = {
  args: {
    shiftOpen: true,
    table: {
      id: 'T-08',
      name: 'Meja 08',
      seatedGuests: 1,
      maxCapacity: 4,
      guestName: 'Al',
      elapsedMinutes: 1,
      items: [{ id: 'item-1', name: 'Es Teh', qty: 1, price: 500 }],
      totalBill: 500,
      isOccupied: true,
    },
    showSplitModal: false,
  },
}

// Quadrant 3: Extreme Long / Overflow 1 Billion State
export const ExtremeOverflow1Billion: Story = {
  args: {
    shiftOpen: true,
    table: {
      id: 'T-08',
      name: 'Meja 08 - VIP Lounge Suite',
      seatedGuests: 4,
      maxCapacity: 4,
      guestName: 'Bpk. Alexander Raden Christopher III',
      elapsedMinutes: 120,
      items: [
        { id: 'item-1', name: 'Private Reserve Geisha 1931 Lot 88', qty: 4, price: 450000000 },
        { id: 'item-2', name: 'Tasting Menu Gold Leaf Edition', qty: 4, price: 12500000 },
      ],
      totalBill: 1850000000,
      isOccupied: true,
    },
    showSplitModal: false,
  },
}

// Quadrant 4: Multi-State Split Bill with 4-Way Split
export const MultiStateSplitBill: Story = {
  args: {
    shiftOpen: true,
    table: {
      id: 'T-08',
      name: 'Meja 08',
      seatedGuests: 4,
      maxCapacity: 4,
      guestName: 'Group Arisan BSD (4 Pax)',
      elapsedMinutes: 45,
      items: [
        { id: 'item-1', name: 'Piccolo Latte Double Shot', qty: 2, price: 38000 },
        { id: 'item-2', name: 'V60 Gayo Anaerobic Natural', qty: 2, price: 45000 },
        { id: 'item-3', name: 'Almond Croissant Artisan', qty: 4, price: 32000 },
      ],
      totalBill: 294000,
      isOccupied: true,
    },
    showSplitModal: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = await canvas.findByTestId('card-table-8')
    expect(card).toBeDefined()

    const pax4Btn = await canvas.findByTestId('btn-pax-4')
    await userEvent.click(pax4Btn)

    const settleBtn = await canvas.findByTestId('btn-settle-qris')
    await userEvent.click(settleBtn)
  },
}
