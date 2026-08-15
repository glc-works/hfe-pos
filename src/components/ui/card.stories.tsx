import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from './button'
import { Coffee, Award } from 'lucide-react'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const LoyaltyBadgeCard: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-amber-400 flex items-center gap-1.5 text-sm">
            <Award className="w-4 h-4" /> Kopi Barista (Gold Tier)
          </CardTitle>
          <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
            450 Poin Hfe
          </span>
        </div>
        <CardDescription>
          Antrean Barista Prioritas & Diskon Biji Kopi 10%
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-slate-300">
        1.5x Point Multiplier aktif untuk transaksi Anda hari ini.
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">Tukar Poin Diskon</Button>
      </CardFooter>
    </Card>
  ),
}

export const ProductMenuItemCard: Story = {
  render: () => (
    <Card className="max-w-md p-3 flex gap-3">
      <img
        src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80"
        alt="Espresso Aren Latte"
        className="w-20 h-20 rounded-xl object-cover border border-slate-800"
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Coffee
            </span>
            <span className="text-xs font-bold text-emerald-400">Rp 28.000</span>
          </div>
          <h4 className="font-bold text-sm text-slate-100 mt-1">Espresso Aren Latte</h4>
          <p className="text-[11px] text-slate-400">Double espresso dengan gula aren organik</p>
        </div>
        <Button size="sm" className="self-end text-xs">
          + Tambah Pesanan
        </Button>
      </div>
    </Card>
  ),
}
