import type { Meta, StoryObj } from '@storybook/react'
import { ThermalPrinterSettingsModal } from '../../components/hardware/ThermalPrinterSettingsModal'

const meta: Meta<typeof ThermalPrinterSettingsModal> = {
  title: 'Hardware/ThermalPrinterSettingsModal',
  component: ThermalPrinterSettingsModal,
  parameters: {
    layout: 'centered'
  },
  args: {
    isOpen: true,
    onClose: () => console.log('Close clicked')
  }
}

export default meta
type Story = StoryObj<typeof ThermalPrinterSettingsModal>

export const Default: Story = {
  render: (args) => <ThermalPrinterSettingsModal {...args} />
}
