import { useEffect, useState } from 'react'

export interface ShortcutHandlers {
  onOpenSpotlight?: () => void
  onCloseModals?: () => void
  onFocusCatalog?: () => void
  onToggleFloorPlan?: () => void
  onQuickPayCash?: () => void
  onQuickPayQris?: () => void
  onSplitBill?: () => void
  onPrintReceipt?: () => void
}

export const useSpotlightShortcuts = (handlers: ShortcutHandlers) => {
  const [isMac, setIsMac] = useState<boolean>(false)

  useEffect(() => {
    try {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform))
    } catch {
      setIsMac(false)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Check if user is typing inside an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )

      // 2. Cmd+K (Mac) or Ctrl+K (Windows/Linux) - Global Spotlight
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        handlers.onOpenSpotlight?.()
        return
      }

      // 3. '/' key to open search (when not currently focused in an input)
      if (e.key === '/' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        handlers.onOpenSpotlight?.()
        return
      }

      // 4. Escape - Close modals
      if (e.key === 'Escape') {
        handlers.onCloseModals?.()
        return
      }

      // If user is currently typing in an input, do not trigger function keys
      if (isInput) return

      // 5. Functional Key Shortcuts for Cashier
      switch (e.key) {
        case 'F1':
          e.preventDefault()
          handlers.onFocusCatalog?.()
          break
        case 'F2':
          e.preventDefault()
          handlers.onToggleFloorPlan?.()
          break
        case 'F4':
          e.preventDefault()
          handlers.onQuickPayCash?.()
          break
        case 'F8':
          e.preventDefault()
          handlers.onQuickPayQris?.()
          break
        case 'F9':
          e.preventDefault()
          handlers.onSplitBill?.()
          break
        case 'F12':
          e.preventDefault()
          handlers.onPrintReceipt?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])

  return {
    isMac,
    shortcutSymbol: isMac ? '⌘K' : 'Ctrl+K'
  }
}
