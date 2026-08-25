import type { Meta, StoryObj } from '@storybook/react'
import { MerchantHomeHubView } from '../views/MerchantHomeHubView'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'

const meta: Meta<typeof MerchantHomeHubView> = {
  title: 'Views/MerchantHomeHubView',
  component: MerchantHomeHubView,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MerchantConfigProvider>
        <div className="w-full h-screen bg-background text-foreground">
          <Story />
        </div>
      </MerchantConfigProvider>
    ),
  ],
  args: {
    bypassPinForTesting: true,
    initialTab: 'payouts',
  },
}

export default meta
type Story = StoryObj<typeof MerchantHomeHubView>

export const Tab1PayoutsAndSettlement: Story = {
  args: {
    initialTab: 'payouts',
    bypassPinForTesting: true,
  },
}

export const Tab2ExecutiveInsightsAndZReport: Story = {
  args: {
    initialTab: 'insights',
    bypassPinForTesting: true,
  },
}

export const TabHoldingAndMultiEntity: Story = {
  args: {
    initialTab: 'holding_entities',
    bypassPinForTesting: true,
  },
}

export const Tab3PrintAndQrStudio: Story = {
  args: {
    initialTab: 'print_qr',
    bypassPinForTesting: true,
  },
}

export const Tab4StorefrontAndDomainManager: Story = {
  args: {
    initialTab: 'domains',
    bypassPinForTesting: true,
  },
}

export const Tab5TeamAndPinAccess: Story = {
  args: {
    initialTab: 'team_pin',
    bypassPinForTesting: true,
  },
}

export const Tab6TaxCompliancePB1: Story = {
  args: {
    initialTab: 'tax_pb1',
    bypassPinForTesting: true,
  },
}

export const LockedPinChallengeModal: Story = {
  args: {
    bypassPinForTesting: false,
    initialTab: 'payouts',
  },
}
