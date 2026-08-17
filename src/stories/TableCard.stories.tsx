import type { Meta, StoryObj } from '@storybook/react'
import { TableCard } from '../components/shared/TableCard'

const meta: Meta<typeof TableCard> = {
  title: 'Tier 3 Widgets/TableCard',
  component: TableCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TableCard>

export const FreeTable: Story = {
  args: {
    table: {
      id: 'OUT-01',
      name: 'OUT-01',
      zoneId: 'outdoor',
      status: 'free',
      maxCapacity: 4,
      seatedGuests: 0,
      totalBill: 0,
      orderCount: 0,
    },
    slotSpan: 1,
    viewMode: 'compact',
    isSelected: false,
  },
}

export const OccupiedTable: Story = {
  args: {
    table: {
      id: 'OUT-04',
      name: 'OUT-04',
      zoneId: 'outdoor',
      status: 'occupied',
      maxCapacity: 4,
      seatedGuests: 3,
      totalBill: 86000,
      seatedDurationMinutes: 45,
      orderCount: 2,
      customerName: 'Aldi (QR)',
    },
    slotSpan: 1,
    viewMode: 'compact',
    isSelected: true,
  },
}

export const VipTable: Story = {
  args: {
    table: {
      id: 'VIP-01',
      name: 'VIP-01',
      zoneId: 'vip-private',
      status: 'occupied',
      maxCapacity: 10,
      seatedGuests: 8,
      totalBill: 1480000,
      minSpend: 2000000,
      seatedDurationMinutes: 75,
      orderCount: 5,
      customerName: 'Drs. H. Bambang Soeprapto',
    },
    slotSpan: 2,
    viewMode: 'compact',
    isSelected: false,
  },
}
