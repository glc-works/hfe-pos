import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { TableDetailDrawer } from './TableDetailDrawer'

const meta: Meta<typeof TableDetailDrawer> = {
  title: 'Tables/TableDetailDrawer',
  component: TableDetailDrawer,
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta
type Story = StoryObj<typeof TableDetailDrawer>

export const OccupiedTableWithSeats: Story = {
  args: {
    show: true,
    onClose: () => {},
    table: {
      id: 'T-04',
      name: 'Meja 04',
      status: 'occupied',
      customerName: 'Budi Santoso',
      totalBill: 165000,
      orderCount: 3
    },
    onAddItemsToTable: () => {},
    onCheckoutTable: () => {},
    onUnjoinTable: () => {},
    onPartialSeatCheckout: () => {}
  }
}
