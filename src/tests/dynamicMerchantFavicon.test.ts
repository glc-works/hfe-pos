import { describe, it, expect, beforeEach } from 'vitest'
import { updateDocumentFavicon } from '../hooks/useDynamicFavicon'

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

  it('should synchronize favicon to merchant brand logoUrl when provided', () => {
    const merchantLogo = 'https://images.unsplash.com/photo-merchant-logo.png'
    const brandName = 'Senopati Roastery'

    updateDocumentFavicon(merchantLogo, brandName)

    expect(mockLinks[0].href).toBe(merchantLogo)
    expect(mockLinks[1].href).toBe(merchantLogo)
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
