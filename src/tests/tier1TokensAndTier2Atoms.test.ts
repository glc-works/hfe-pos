import { describe, it, expect } from 'vitest'
import { GLYPHS, SPACING_GRID, TYPOGRAPHY_TOKENS, SEMANTIC_COLORS } from '../tokens/designTokens'
import * as UIAtoms from '../ui'

describe('Tier 1 Design Tokens & Tier 2 React Aria Atoms Verification Suite', () => {
  describe('Tier 1: Centralized Design Tokens (GLYPHS, SPACING, TYPOGRAPHY, COLORS)', () => {
    it('declares authoritative micro-glyphs with zero character bloat', () => {
      expect(GLYPHS.TABLE).toBe('👥')
      expect(GLYPHS.DINE_IN).toBe('🍽️')
      expect(GLYPHS.TAKEAWAY).toBe('🛍️')
      expect(GLYPHS.DELIVERY).toBe('🛵')
      expect(GLYPHS.TIMER).toBe('⏱️')
      expect(GLYPHS.VIP).toBe('👑')
      expect(GLYPHS.QUEUE).toBe('🏷️')
      expect(GLYPHS.WIFI).toBe('📶')
    })

    it('enforces spatial 4px/8px rhythm and minimum 44px touch targets', () => {
      expect(SPACING_GRID.UNIT_PX).toBe(4)
      expect(SPACING_GRID.TOUCH_TARGET_MIN_PX).toBe(44)
      expect(SPACING_GRID.RADIUS_MD).toBe('12px')
      expect(SPACING_GRID.RADIUS_LG).toBe('16px')
    })

    it('enforces tabular numbers and typography scale hierarchy', () => {
      expect(TYPOGRAPHY_TOKENS.FONT_NUMERIC).toBe('font-variant-numeric: tabular-nums')
      expect(TYPOGRAPHY_TOKENS.SCALE.MICRO).toBe('10px')
      expect(TYPOGRAPHY_TOKENS.SCALE.BODY).toBe('13px')
      expect(TYPOGRAPHY_TOKENS.SCALE.PRICE).toBe('15px')
    })

    it('declares dual-theme status colors and fulfillment tokens', () => {
      expect(SEMANTIC_COLORS.STATUS.OCCUPIED_AMBER.darkBg).toContain('amber')
      expect(SEMANTIC_COLORS.STATUS.PAID_EMERALD.darkBg).toContain('emerald')
      expect(SEMANTIC_COLORS.FULFILLMENT.TAKEAWAY.glyph).toBe('🛍️')
    })
  })

  describe('Tier 2: React Aria Atoms Master Barrel Exports', () => {
    it('exports all 12 Tier 2 atomic components cleanly', () => {
      expect(UIAtoms.Button).toBeDefined()
      expect(UIAtoms.IconButton).toBeDefined()
      expect(UIAtoms.SegmentedControl).toBeDefined()
      expect(UIAtoms.TextInput).toBeDefined()
      expect(UIAtoms.ToggleSwitch).toBeDefined()
      expect(UIAtoms.KbdBadge).toBeDefined()
      expect(UIAtoms.StatusPill).toBeDefined()
      expect(UIAtoms.Divider).toBeDefined()
      expect(UIAtoms.PriceTag).toBeDefined()
      expect(UIAtoms.CapacityBadge).toBeDefined()
      expect(UIAtoms.TimerPill).toBeDefined()
      expect(UIAtoms.MinSpendPill).toBeDefined()
    })
  })
})
