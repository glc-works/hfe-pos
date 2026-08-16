import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { PosCartSection } from './PosCartSection'
import { PRODUCT_CATALOG } from '../../data/mockData'

const meta: Meta<typeof PosCartSection> = {
  title: 'POS/PosCartSection',
  component: PosCartSection,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof PosCartSection>

export const EmptyCart: Story = {
  args: {
    cartItems: [],
    selectedPOSTable: null,
    posPayMethod: 'cash',
    posCashGiven: '0',
    subtotal: 0,
    pb1Tax: 0,
    grandTotal: 0,
    onUpdateQty: () => {},
    onOpenDirectQtyModal: () => {},
    setPosPayMethod: () => {},
    setPosCashGiven: () => {},
    onCheckout: () => {},
    onOpenSplitPayment: () => {}
  }
}

export const PopulatedCartWithCashChange: Story = {
  args: {
    cartItems: [
      {
        ...PRODUCT_CATALOG[0],
        quantity: 2
      },
      {
        ...PRODUCT_CATALOG[3],
        quantity: 1
      }
    ],
    selectedPOSTable: {
      id: 'T-04',
      name: 'Meja 04',
      status: 'occupied',
      customerName: 'Budi Santoso',
      totalBill: 88000,
      orderCount: 2
    },
    posPayMethod: 'cash',
    posCashGiven: '100000',
    subtotal: 88000,
    pb1Tax: 8800,
    grandTotal: 96800,
    onUpdateQty: () => {},
    onOpenDirectQtyModal: () => {},
    setPosPayMethod: () => {},
    setPosCashGiven: () => {},
    onCheckout: () => {},
    onOpenSplitPayment: () => {}
  }
}
