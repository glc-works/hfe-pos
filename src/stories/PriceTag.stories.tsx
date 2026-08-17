import type { Meta, StoryObj } from '@storybook/react'
import { PriceTag } from '../ui/PriceTag'

const meta: Meta<typeof PriceTag> = {
  title: 'Tier 2 Atoms/PriceTag',
  component: PriceTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['full', 'compact', 'adaptive'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['default', 'accent', 'emerald', 'muted'],
    },
  },
}

export default meta
type Story = StoryObj<typeof PriceTag>

export const StandardIDR: Story = {
  args: {
    amount: 86000,
    mode: 'full',
    size: 'md',
    variant: 'default',
  },
}

export const MillionAdaptive: Story = {
  args: {
    amount: 1530000,
    mode: 'adaptive',
    size: 'lg',
    variant: 'emerald',
  },
}

export const Discounted: Story = {
  args: {
    amount: 45000,
    originalAmount: 60000,
    mode: 'full',
    size: 'md',
    variant: 'accent',
  },
}
