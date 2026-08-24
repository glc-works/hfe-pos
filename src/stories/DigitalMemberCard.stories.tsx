import type { Meta, StoryObj } from '@storybook/react'
import { DigitalMemberCard } from '../components/customer-portal/DigitalMemberCard'
import { DigitalMemberCardData } from '../types/pos'

const baseMemberCard: DigitalMemberCardData = {
  cardNumber: 'MEM-8899-001',
  customerName: 'Bpk. Alexander Christopher',
  phone: '+62 812-3456-7890',
  tier: 'Gold',
  pointsBalance: 45000,
  stampCount: 8,
  stampMax: 10,
  barcodeData: 'HFE-MEM-8899-001',
  qrData: 'https://card.hfeit.com/member/MEM-8899-001',
  brandName: 'Kopitiam Senopati HQ',
  joinedDate: '12 Januari 2025',
  expiryDate: '31 Desember 2026',
}

const meta: Meta<typeof DigitalMemberCard> = {
  title: 'Customer / DigitalMemberCard',
  component: DigitalMemberCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    cardData: baseMemberCard,
  },
}

export default meta
type Story = StoryObj<typeof DigitalMemberCard>

export const GoldVipPass: Story = {
  args: {
    cardData: {
      ...baseMemberCard,
      tier: 'Gold',
      stampCount: 8,
    },
  },
}

export const PlatinumEliteWithReward: Story = {
  args: {
    cardData: {
      ...baseMemberCard,
      tier: 'Platinum',
      pointsBalance: 125000,
      stampCount: 10,
      customerName: 'Ibu Victoria Alexandra',
    },
  },
}

export const SilverMember: Story = {
  args: {
    cardData: {
      ...baseMemberCard,
      tier: 'Silver',
      pointsBalance: 15000,
      stampCount: 4,
    },
  },
}

export const BronzeNewMember: Story = {
  args: {
    cardData: {
      ...baseMemberCard,
      tier: 'Bronze',
      pointsBalance: 0,
      stampCount: 0,
      customerName: 'Al',
    },
  },
}

