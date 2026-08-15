import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Coffee, Plus, ShoppingBag, CreditCard } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const PrimaryAmber: Story = {
  args: {
    children: 'Tambah Pesanan',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Tutup Shift Kasir',
    variant: 'secondary',
  },
}

export const OutlineWithIcon: Story = {
  render: () => (
    <Button variant="outline">
      <Coffee className="w-4 h-4 mr-2 text-amber-500" /> Pesan Kopi Sekarang
    </Button>
  ),
}

export const PayFirstCheckoutButton: Story = {
  render: () => (
    <Button size="lg" className="w-full font-bold">
      <CreditCard className="w-4 h-4 mr-2" /> Bayar QRIS & Kirim Dapur (Rp 86.000)
    </Button>
  ),
}
