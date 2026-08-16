import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { PosFavoritesBar } from './PosFavoritesBar'
import { PRODUCT_CATALOG } from '../../data/mockData'

const meta: Meta<typeof PosFavoritesBar> = {
  title: 'POS/PosFavoritesBar',
  component: PosFavoritesBar,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof PosFavoritesBar>

export const Default12PinnedFavorites: Story = {
  args: {
    pinnedFavorites: PRODUCT_CATALOG.slice(0, 12),
    isImageUrl: () => true,
    onAddToCart: () => {},
    onEditPinnedMenu: () => {}
  }
}
