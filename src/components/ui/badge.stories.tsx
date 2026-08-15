import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'emerald', 'indigo'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const AmberDefault: Story = {
  args: {
    children: 'Kopi Barista (Gold Tier)',
    variant: 'default',
  },
}

export const EmeraldFreeStatus: Story = {
  args: {
    children: 'Meja-01 Free',
    variant: 'emerald',
  },
}

export const IndigoOpenTabStatus: Story = {
  args: {
    children: 'Open Tab Billing (Post-Paid)',
    variant: 'indigo',
  },
}
