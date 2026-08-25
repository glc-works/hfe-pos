import { useState, useEffect, useCallback, useRef } from 'react'
import { CartItem, OrderFulfillmentMode, ParkedOperationTab } from '../types/pos'

const STORAGE_KEY = 'hfe_pos_parked_operations_tray'

export interface UseOperationsTrayProps {
  onShowToast?: (message: string) => void
}

export function useOperationsTray({ onShowToast }: UseOperationsTrayProps = {}) {
  const isInitialMount = useRef(true)
  const [parkedTabs, setParkedTabs] = useState<ParkedOperationTab[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          return JSON.parse(stored)
        }
      } catch {
        // Ignore fallback
      }
    }
    return []
  })

  // Persist to localStorage on change, skipping initial mount overwrite
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parkedTabs))
      } catch {
        // Ignore
      }
    }
  }, [parkedTabs])

  // Park current active cart
  const parkCurrentCart = useCallback((params: {
    items: CartItem[]
    fulfillmentMode: OrderFulfillmentMode
    tableName?: string
    customerName?: string
    customerPhone?: string
    rawSubtotal: number
    packagingFee?: number
    notes?: string
  }): ParkedOperationTab | null => {
    if (params.items.length === 0) {
      if (onShowToast) onShowToast('⚠️ Keranjang masih kosong, tidak ada yang diparkir.')
      return null
    }

    const packaging = params.packagingFee || 0
    const total = params.rawSubtotal + packaging
    const id = `PARK-${Date.now().toString(36).toUpperCase()}`

    let label = '🛍️ Pesanan Baru'
    if (params.fulfillmentMode === 'dine_in') {
      label = `🍽️ ${params.tableName || 'Meja'}`
    } else if (params.fulfillmentMode === 'takeaway') {
      label = `🛍️ Bungkus (${params.items.reduce((s, i) => s + i.quantity, 0)})`
    } else if (params.fulfillmentMode === 'delivery') {
      label = `🛵 Antar: ${params.customerName || 'Pelanggan'}`
    }

    const newTab: ParkedOperationTab = {
      id,
      label,
      fulfillmentMode: params.fulfillmentMode,
      tableName: params.tableName,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      items: [...params.items],
      rawSubtotal: params.rawSubtotal,
      packagingFee: packaging,
      totalAmount: total,
      parkedAt: new Date().toISOString(),
      notes: params.notes
    }

    setParkedTabs(prev => [newTab, ...prev])
    if (onShowToast) onShowToast(`📥 Transaksi [${label}] berhasil diparkir ke Tray Bawah.`)
    return newTab
  }, [onShowToast])

  // Discard a parked tab
  const discardParkedTab = useCallback((tabId: string) => {
    setParkedTabs(prev => prev.filter(t => t.id !== tabId))
    if (onShowToast) onShowToast('🗑️ Tab parkir dihapus.')
  }, [onShowToast])

  // Clear all parked tabs
  const clearAllParkedTabs = useCallback(() => {
    setParkedTabs([])
    if (onShowToast) onShowToast('🧹 Seluruh tab parkir dibersihkan.')
  }, [onShowToast])

  // Find a specific parked tab
  const getParkedTab = useCallback((tabId: string) => {
    return parkedTabs.find(t => t.id === tabId) || null
  }, [parkedTabs])

  return {
    parkedTabs,
    parkedCount: parkedTabs.length,
    parkCurrentCart,
    discardParkedTab,
    clearAllParkedTabs,
    getParkedTab
  }
}
