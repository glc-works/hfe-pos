import type { Meta, StoryObj } from '@storybook/react'
import { CafeGoLiveReadinessModal } from '../components/hub/CafeGoLiveReadinessModal'
import { MerchantConfigProvider } from '../context/MerchantConfigContext'

const meta: Meta<typeof CafeGoLiveReadinessModal> = {
  title: 'Hub / CafeGoLiveReadinessModal',
  component: CafeGoLiveReadinessModal,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MerchantConfigProvider>
        <div className="w-full h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
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
type Story = StoryObj<typeof CafeGoLiveReadinessModal>

export const DefaultGoLiveReadinessModal: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
}
