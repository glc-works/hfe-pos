import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { HfeInsightWidget } from './HfeInsightWidget'
import { PRODUCT_CATALOG } from '../../data/mockData'

const meta: Meta<typeof HfeInsightWidget> = {
  title: 'Insights/HfeInsightWidget',
  component: HfeInsightWidget,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof HfeInsightWidget>

export const FullDashboardManager: Story = {
  args: {
    variant: 'full',
    orders: [],
    productCatalog: PRODUCT_CATALOG,
    tablesGrid: [],
    cashDrawerFloat: 1500000
  }
}

export const CompactBanner: Story = {
  args: {
    variant: 'banner',
    orders: [],
    productCatalog: PRODUCT_CATALOG,
    tablesGrid: [],
    cashDrawerFloat: 1500000
  }
}
