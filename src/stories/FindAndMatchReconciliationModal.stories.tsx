import type { Meta, StoryObj } from '@storybook/react'
import { FindAndMatchReconciliationModal } from '../components/hub/FindAndMatchReconciliationModal'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'

const meta: Meta<typeof FindAndMatchReconciliationModal> = {
  title: 'Hub / FindAndMatchReconciliationModal',
  component: FindAndMatchReconciliationModal,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MerchantConfigProvider>
        <div className="w-full min-h-screen bg-background text-foreground flex items-center justify-center p-4">
          <Story />
        </div>
      </MerchantConfigProvider>
    ),
  ],
  args: {
    isOpen: true,
    onClose: () => {},
  },
}

export default meta
type Story = StoryObj<typeof FindAndMatchReconciliationModal>

export const DefaultReconciliationModal: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
}
