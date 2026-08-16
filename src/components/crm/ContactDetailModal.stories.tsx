import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ContactDetailModal } from './ContactDetailModal'

const meta: Meta<typeof ContactDetailModal> = {
  title: 'CRM/ContactDetailModal',
  component: ContactDetailModal,
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof ContactDetailModal>

export const VipGoldCustomerDetail: Story = {
  args: {
    show: true,
    onClose: () => {},
    contact: {
      id: 'CUST-001',
      name: 'Aldi Pratama',
      phone: '6281298765432',
      email: 'aldi@example.com',
      tier: 'gold',
      kasbonLimit: 1000000,
      kasbonBalance: 150000,
      allergens: ['Lactose', 'Nuts'],
      totalOrdersCount: 28,
      totalSpend: 1850000,
      favoriteItems: ['Espresso Aren Latte', 'Almond Croissant'],
      notes: 'Suka tempat di pojok, less sugar'
    },
    onSave: () => {}
  }
}
