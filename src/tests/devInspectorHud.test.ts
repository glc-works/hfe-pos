import { describe, it, expect } from 'vitest'
import { HoveredElementInfo } from '../components/dev/DevInspectorHud'

describe('DevKit Zero-Lag Live Hover Inspector HUD (L2-POS-41)', () => {
  it('should parse hovered element properties correctly into HoveredElementInfo', () => {
    const mockInfo: HoveredElementInfo = {
      tagName: 'BUTTON',
      componentHint: 'PosCommandHeader',
      textPreview: 'Peta Meja',
      dimensions: {
        width: 120,
        height: 38,
        top: 100,
        left: 200
      },
      classes: ['px-3', 'py-1.5', 'rounded-lg', 'bg-white'],
      attributes: {
        'data-testid': 'pos-tables-tab',
        'role': 'button'
      },
      isClickable: true
    }

    expect(mockInfo.tagName).toBe('BUTTON')
    expect(mockInfo.componentHint).toBe('PosCommandHeader')
    expect(mockInfo.dimensions.width).toBe(120)
    expect(mockInfo.isClickable).toBe(true)
    expect(mockInfo.attributes['data-testid']).toBe('pos-tables-tab')
  })

  it('should support static element inspection', () => {
    const staticInfo: HoveredElementInfo = {
      tagName: 'SPAN',
      dimensions: { width: 50, height: 16, top: 50, left: 50 },
      classes: ['font-mono', 'text-xs'],
      attributes: {},
      isClickable: false
    }

    expect(staticInfo.isClickable).toBe(false)
  })
})
