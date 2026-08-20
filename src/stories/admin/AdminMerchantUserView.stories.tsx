import type { Meta, StoryObj } from '@storybook/react'
import { AdminMerchantUserView } from '../../views/admin/AdminMerchantUserView'

const meta: Meta<typeof AdminMerchantUserView> = {
  title: 'Views/Admin/AdminMerchantUserView',
  component: AdminMerchantUserView,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    onBackToPos: () => console.log('Back to POS clicked')
  }
}

export default meta
type Story = StoryObj<typeof AdminMerchantUserView>

export const DefaultMerchantsTab: Story = {
  render: (args) => <AdminMerchantUserView {...args} />
}

export const UserRbacTab: Story = {
  render: (args) => <AdminMerchantUserView {...args} />
}
