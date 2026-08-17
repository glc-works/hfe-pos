import type { Meta, StoryObj } from '@storybook/react'
import { DoubleEntrySandbox } from '../../components/core/sandbox/DoubleEntrySandbox'

const meta: Meta<typeof DoubleEntrySandbox> = {
  title: 'Tier 3 Widgets/DoubleEntrySandbox',
  component: DoubleEntrySandbox,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof DoubleEntrySandbox>

/**
 * Quadrant 1: Zero / Fresh Unposted State (Empty Results Area)
 */
export const Q1_EmptyUnpostedState: Story = {
  args: {
    className: 'max-w-6xl mx-auto'
  }
}

/**
 * Quadrant 2: POS Sale Micro-Transaction (Rp 250.000 + COGS Rp 85.000)
 */
export const Q2_PosSalePreset: Story = {
  args: {
    className: 'max-w-6xl mx-auto'
  }
}

/**
 * Quadrant 3: Multi-Billion Enterprise Invoice Stress State (Rp 1.850.000.000)
 */
export const Q3_EnterpriseStressState: Story = {
  args: {
    className: 'max-w-6xl mx-auto'
  }
}

/**
 * Quadrant 4: Multi-Currency FX Settlement (USD/IDR Spot Gain Balancing)
 */
export const Q4_MultiCurrencyFxState: Story = {
  args: {
    className: 'max-w-6xl mx-auto'
  }
}
