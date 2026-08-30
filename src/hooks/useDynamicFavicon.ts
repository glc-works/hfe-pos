import { useEffect } from 'react'

/**
 * Pure DOM updater for document favicon and brand title.
 */
export function updateDocumentFavicon(logoUrl?: string, brandName?: string) {
  if (typeof document === 'undefined') return

  const DEFAULT_FAVICON = '/favicon.svg'
  const targetIcon = logoUrl && logoUrl.trim() !== '' ? logoUrl : DEFAULT_FAVICON

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
