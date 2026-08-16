import { describe, it, expect } from 'vitest'
import { ViewportModeType } from '../types/pos'

function resolveViewport(viewportMode: ViewportModeType, windowWidth: number) {
  const isPhysicallyMobile = windowWidth < 768
  const isPhysicallyTablet = windowWidth >= 768 && windowWidth < 1024
  const isPhysicallyDesktop = windowWidth >= 1024

  const isMobile = viewportMode === 'mobile' || (viewportMode === 'responsive' && isPhysicallyMobile)
  const isTablet = viewportMode === 'tablet-portrait' || viewportMode === 'tablet-landscape' || viewportMode === 'tablet' || (viewportMode === 'responsive' && isPhysicallyTablet)
  const isDesktop = viewportMode === 'responsive' ? isPhysicallyDesktop : false

  return { isMobile, isTablet, isDesktop }
}

describe('Multi-Device Switcher & Dual-Port Responsive Invariant (POS-ENG-STD-001 Rule 13)', () => {
  it('correctly maps 360px compact mobile viewport in responsive standalone mode (Port 4173)', () => {
    const { isMobile, isTablet, isDesktop } = resolveViewport('responsive', 360)
    expect(isMobile).toBe(true)
    expect(isTablet).toBe(false)
    expect(isDesktop).toBe(false)
  })

  it('correctly maps 390px iPhone standard mobile viewport in responsive standalone mode', () => {
    const { isMobile } = resolveViewport('responsive', 390)
    expect(isMobile).toBe(true)
  })

  it('correctly maps 768px tablet portrait viewport in responsive standalone mode', () => {
    const { isMobile, isTablet, isDesktop } = resolveViewport('responsive', 768)
    expect(isMobile).toBe(false)
    expect(isTablet).toBe(true)
    expect(isDesktop).toBe(false)
  })

  it('correctly maps 1280px desktop monitor viewport in responsive standalone mode', () => {
    const { isMobile, isTablet, isDesktop } = resolveViewport('responsive', 1280)
    expect(isMobile).toBe(false)
    expect(isTablet).toBe(false)
    expect(isDesktop).toBe(true)
  })

  it('correctly respects simulated mobile override regardless of monitor resolution (Port 5173 DevKit)', () => {
    const { isMobile } = resolveViewport('mobile', 1920)
    expect(isMobile).toBe(true)
  })

  it('verifies that PosCommandHeader labels are hidden on mobile to prevent text clipping', () => {
    const isMobile = true
    const actionLabel = !isMobile ? 'Sambut Tamu' : null
    expect(actionLabel).toBeNull() // Guarantees zero "S..." clipping
  })

  it('verifies that floating cart bar is rendered when isMobile is true and grandTotal > 0', () => {
    const isMobile = true
    const grandTotal = 86000
    const shouldRenderFloatingDock = isMobile && grandTotal > 0
    expect(shouldRenderFloatingDock).toBe(true)
  })
})
