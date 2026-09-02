import { useEffect } from 'react'

/**
 * Creates a circular SVG data URI from any merchant image URL,
 * applying a smooth circle mask with an amber perimeter ring.
 */
export function createCircularFaviconDataUri(imageUrl: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <clipPath id="circleMask">
      <circle cx="32" cy="32" r="29"/>
    </clipPath>
  </defs>
  <circle cx="32" cy="32" r="31" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>
  <image href="${imageUrl}" x="3" y="3" width="58" height="58" preserveAspectRatio="xMidYMid slice" clip-path="url(#circleMask)"/>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Pure DOM updater for document favicon and brand title.
 */
export function updateDocumentFavicon(logoUrl?: string, brandName?: string) {
  if (typeof document === 'undefined') return

  const DEFAULT_FAVICON = '/favicon.svg'
  const hasCustomLogo = Boolean(logoUrl && logoUrl.trim() !== '')
  const targetIcon = hasCustomLogo ? createCircularFaviconDataUri(logoUrl!.trim()) : DEFAULT_FAVICON

  // Update existing favicon link tags or create a new one
  const iconLinks = document.querySelectorAll<HTMLLinkElement>(
    "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
  )

  if (iconLinks.length > 0) {
    iconLinks.forEach(link => {
      link.href = targetIcon
    })
  } else {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.href = targetIcon
    document.head.appendChild(link)
  }

  if (brandName && brandName.trim() !== '') {
    document.title = `${brandName} • Powered by HFE`
  }
}

/**
 * React Hook that dynamically synchronizes the browser tab favicon and document title
 * based on merchant brand logo, falling back to the standard POS / Hfe logo.
 */
export function useDynamicFavicon(logoUrl?: string, brandName?: string) {
  useEffect(() => {
    updateDocumentFavicon(logoUrl, brandName)
  }, [logoUrl, brandName])
}
