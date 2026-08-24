import type { Meta, StoryObj } from '@storybook/react'
import { ExecutiveInsightsTab } from '../components/hub/ExecutiveInsightsTab'

const meta: Meta<typeof ExecutiveInsightsTab> = {
  title: 'Hub / ExecutiveInsightsTab',
  component: ExecutiveInsightsTab,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    postingStatus: 'demo',
    eventDetails: {
      tableName: 'Meja OUT-04 • QR',
      grossMinor: 57500,
      taxMinor: 5000,
      grossProfitMinor: 36000,
      marginPercent: 72,
    },
  },
}

export default meta
type Story = StoryObj<typeof ExecutiveInsightsTab>

export const DemoMode: Story = {
  args: {
    postingStatus: 'demo',
  },
}

export const PostedToCore: Story = {
  args: {
    postingStatus: 'posted',
    eventDetails: {
      tableName: 'Meja IND-02 • POS',
      grossMinor: 125000,
      taxMinor: 12500,
      grossProfitMinor: 89000,
      marginPercent: 71,
    },
  },
}

export const PendingSync: Story = {
  args: {
    postingStatus: 'pending',
    eventDetails: {
      tableName: 'Takeaway #14 • Offline',
      grossMinor: 48000,
      taxMinor: 4000,
      grossProfitMinor: 32000,
      marginPercent: 67,
    },
  },
}

export const FailedPosting: Story = {
  args: {
    postingStatus: 'failed',
    eventDetails: {
      tableName: 'Meja VIP-01 • QR',
      grossMinor: 2500000,
      taxMinor: 250000,
      grossProfitMinor: 1750000,
      marginPercent: 70,
    },
  },
}

export const HighVolumeMonetaryStress: Story = {
  args: {
    postingStatus: 'demo',
    eventDetails: {
      tableName: 'Catering Corporate • B2B',
      grossMinor: 1850000000,
      taxMinor: 185000000,
      grossProfitMinor: 1295000000,
      marginPercent: 70,
    },
  },
}
