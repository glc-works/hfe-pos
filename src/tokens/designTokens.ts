/**
 * HFE POS & COMMERCE SUITE — TIER 1 DESIGN TOKENS
 * Single Source of Truth for semantic tokens, micro-glyphs, colors, typography, and spacing.
 * Compliant with POS-ENG-STD-001 & HFE-UI-STD-001.
 */

export const GLYPHS = {
  TABLE: '👥',
  DINE_IN: '🍽️',
  TAKEAWAY: '🛍️',
  DELIVERY: '🛵',
  TIMER: '⏱️',
  VIP: '👑',
  QUEUE: '🏷️',
  WIFI: '📶',
  COFFEE: '☕',
  SEARCH: '🔍',
  KDS: '🍳',
  CASH: '💵',
  QRIS: '📱',
  CARD: '💳',
  CHECK: '✓',
  CROSS: '✕',
  LOCK: '🔒',
  UNLOCK: '🔓',
  WARNING: '⚠️',
  FIRE: '🔥',
  SPARKLE: '✨',
  EXPEDITER: '🛎️'
} as const

export type GlyphKey = keyof typeof GLYPHS

export const SPACING_GRID = {
  UNIT_PX: 4,
  GAP_XS: '4px',   // gap-1
  GAP_SM: '8px',   // gap-2
  GAP_MD: '12px',  // gap-3
  GAP_LG: '16px',  // gap-4
  GAP_XL: '24px',  // gap-6
  PADDING_XS: '4px',
  PADDING_SM: '8px',
  PADDING_MD: '12px',
  PADDING_LG: '16px',
  PADDING_XL: '24px',
  RADIUS_SM: '8px',   // rounded-lg
  RADIUS_MD: '12px',  // rounded-xl
  RADIUS_LG: '16px',  // rounded-2xl
  RADIUS_XL: '24px',  // rounded-3xl
  RADIUS_FULL: '9999px',
  TOUCH_TARGET_MIN_PX: 44 // Apple HIG & Nielsen minimum touch target
} as const

export const TYPOGRAPHY_TOKENS = {
  FONT_SANS: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  FONT_MONO: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  FONT_NUMERIC: 'font-variant-numeric: tabular-nums',
  SCALE: {
    MICRO: '10px',
    SMALL: '11px',
    BODY_SM: '12px',
    BODY: '13px',
    BODY_MD: '14px',
    PRICE: '15px',
    SUBHEADER: '18px',
    HEADER: '20px',
    HERO: '24px'
  }
} as const

export const SEMANTIC_COLORS = {
  STATUS: {
    FREE_SLATE: {
      darkBg: 'bg-slate-900/60',
      darkBorder: 'border-slate-700/60',
      darkText: 'text-slate-300',
      lightBg: 'bg-white',
      lightBorder: 'border-slate-200',
      lightText: 'text-slate-700'
    },
    OCCUPIED_AMBER: {
      darkBg: 'bg-amber-950/30',
      darkBorder: 'border-amber-500/50',
      darkText: 'text-amber-200',
      lightBg: 'bg-amber-50',
      lightBorder: 'border-amber-400',
      lightText: 'text-amber-950'
    },
    PAID_EMERALD: {
      darkBg: 'bg-emerald-950/30',
      darkBorder: 'border-emerald-500/50',
      darkText: 'text-emerald-200',
      lightBg: 'bg-emerald-50',
      lightBorder: 'border-emerald-400',
      lightText: 'text-emerald-950'
    },
    DANGER_ROSE: {
      darkBg: 'bg-rose-950/30',
      darkBorder: 'border-rose-500/50',
      darkText: 'text-rose-200',
      lightBg: 'bg-rose-50',
      lightBorder: 'border-rose-400',
      lightText: 'text-rose-950'
    }
  },
  FULFILLMENT: {
    DINE_IN: { glyph: GLYPHS.DINE_IN, labelKey: 'dineInModeLabel', color: 'emerald' },
    TAKEAWAY: { glyph: GLYPHS.TAKEAWAY, labelKey: 'takeawayModeLabel', color: 'amber' },
    DELIVERY: { glyph: GLYPHS.DELIVERY, labelKey: 'deliveryModeLabel', color: 'sky' }
  }
} as const

export const FULFILLMENT_TOKENS = {
  DINE_IN: { glyph: GLYPHS.DINE_IN, labelKey: 'dineInModeLabel', color: 'emerald' },
  TAKEAWAY: { glyph: GLYPHS.TAKEAWAY, labelKey: 'takeawayModeLabel', color: 'amber' },
  DELIVERY: { glyph: GLYPHS.DELIVERY, labelKey: 'deliveryModeLabel', color: 'sky' }
} as const

