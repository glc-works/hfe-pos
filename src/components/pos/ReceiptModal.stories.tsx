import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ReceiptModal } from './ReceiptModal'

const meta: Meta<typeof ReceiptModal> = {
  title: 'POS/ReceiptModal',
  component: ReceiptModal,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof ReceiptModal>

export const ThermalSettlementReceipt: Story = {
  args: {
    show: true,
    onClose: () => {},
    receiptData: {
      receiptNo: 'REC-2026-0816-042',
      storeName: 'Kopitiam Senopati & Roastery',
      storeAddress: 'Jl. Senopati No. 45, Jakarta Selatan',
      storeNpwp: '01.234.567.8',
      cashierName: 'Siti Nurhaliza',
      customerName: 'Budi Santoso',
      tableNo: 'Meja 04',
      orderType: 'dine-in',
      timestamp: '2026-08-16 12:30',
      items: [
        { name: 'Espresso Aren Latte', qty: 2, price: 28000 },
        { name: 'Almond Croissant', qty: 1, price: 32000 }
      ],
      subtotal: 88000,
      pb1Tax: 8800,
      grandTotal: 96800,
      paymentMethod: 'cash',
      cashGiven: 100000,
      changeReturned: 3200,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  }
}
