import { describe, it, expect, beforeEach } from 'vitest'
import { updateDocumentFavicon, createCircularFaviconDataUri } from '../hooks/useDynamicFavicon'

describe('Dynamic Merchant Favicon & Document Title Hook (SSOT)', () => {
  let mockLinks: any[] = []
  let appendedLinks: any[] = []

  beforeEach(() => {
    mockLinks = [
      { rel: 'icon', href: '/favicon.svg', getAttribute: (attr: string) => attr === 'href' ? mockLinks[0].href : null },
      { rel: 'apple-touch-icon', href: '/favicon.svg', getAttribute: (attr: string) => attr === 'href' ? mockLinks[1].href : null }
    ]
    appendedLinks = []

    // Mock document
    ;(global as any).document = {
      title: 'POS.Hfeit',
      querySelectorAll: (selector: string) => {
        return mockLinks
      },
      createElement: (tag: string) => {
        const el: any = { tag, rel: '', href: '', type: '' }
        return el
      },
      head: {
        appendChild: (el: any) => {
          appendedLinks.push(el)
        }
      }
    }
  })

  it('should generate circular SVG data URI with circle mask for any merchant image', () => {
    const merchantLogo = 'https://images.unsplash.com/photo-merchant-logo.png'
    const dataUri = createCircularFaviconDataUri(merchantLogo)

    expect(dataUri).toContain('data:image/svg+xml;utf8,')
    expect(decodeURIComponent(dataUri)).toContain('clipPath id="circleMask"')
    expect(decodeURIComponent(dataUri)).toContain('circle cx="32" cy="32" r="29"')
    expect(decodeURIComponent(dataUri)).toContain(merchantLogo)
  })

  it('should synchronize favicon to circular masked merchant logo when provided', () => {
    const merchantLogo = 'https://images.unsplash.com/photo-merchant-logo.png'
    const brandName = 'Senopati Roastery'

    updateDocumentFavicon(merchantLogo, brandName)

    expect(mockLinks[0].href).toContain('data:image/svg+xml;utf8,')
    expect(mockLinks[1].href).toContain('data:image/svg+xml;utf8,')
    expect(decodeURIComponent(mockLinks[0].href)).toContain(merchantLogo)
    expect(document.title).toBe('Senopati Roastery • Powered by HFE')
  })

  it('should fallback gracefully to standard POS /favicon.svg when logoUrl is empty or undefined', () => {
    mockLinks[0].href = 'https://custom-logo.png'
    updateDocumentFavicon(undefined, 'Senopati Roastery')

    expect(mockLinks[0].href).toBe('/favicon.svg')
  })

  it('should fallback to standard POS /favicon.svg when logoUrl is empty string', () => {
    mockLinks[0].href = 'https://custom-logo.png'
    updateDocumentFavicon('', 'Senopati Roastery')

    expect(mockLinks[0].href).toBe('/favicon.svg')
  })
})
