import type { Meta, StoryObj } from '@storybook/react'
import { RoomChargeModal } from '../components/pos/RoomChargeModal'
import { MOCK_HOTEL_GUEST_FOLIOS } from '../data/mockData'

const meta: Meta<typeof RoomChargeModal> = {
  title: 'POS / RoomChargeModal',
  component: RoomChargeModal,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    show: true,
    totalBill: 175000,
    tableName: 'Meja OUT-04',
    guestFolios: MOCK_HOTEL_GUEST_FOLIOS,
    onClose: () => console.log('Closed modal'),
    onConfirmRoomCharge: (payload) => console.log('Confirmed charge:', payload),
  },
}

export default meta
type Story = StoryObj<typeof RoomChargeModal>

export const StandardRoomCharge: Story = {
  args: {
    show: true,
    totalBill: 175000,
    tableName: 'Meja OUT-04',
  },
}

export const LargeVipFolioCharge: Story = {
  args: {
    show: true,
    totalBill: 2500000,
    tableName: 'VIP-01 Private Dining',
  },
}
