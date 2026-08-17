import type { Meta, StoryObj } from '@storybook/react'
import { CorePlatformView } from '../../views/CorePlatformView'

const meta: Meta<typeof CorePlatformView> = {
  title: 'Tier 6 Smart Views/CorePlatformView',
  component: CorePlatformView,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CorePlatformView>

/**
 * Quadrant 1: Default Overview & Architecture View
 */
export const Q1_Overview: Story = {
  args: {
    initialTab: 'overview'
  }
}

/**
 * Quadrant 2: Connect Hub Ecosystem (44+ Connectors Grid)
 */
export const Q2_ConnectHub: Story = {
  args: {
    initialTab: 'connect-hub'
  }
}

/**
 * Quadrant 3: B2B Pricing Calculator with High-Throughput Overage Slider
 */
export const Q3_PricingOverage: Story = {
  args: {
    initialTab: 'pricing'
  }
}

/**
 * Quadrant 4: Double-Entry Posting Simulator & OpenAPI Docs
 */
export const Q4_SandboxSimulator: Story = {
  args: {
    initialTab: 'sandbox'
  }
}

export const DeveloperConsole: Story = {
  args: {
    initialTab: 'console'
  }
}
