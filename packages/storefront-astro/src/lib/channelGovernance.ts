// --- STOREFRONT CHANNEL GOVERNANCE & SOVEREIGN TOGGLES ---
// Evaluates active merchant channels (Dine-in, Takeaway, Online Delivery, Reservations, Ticketing)

export interface StorefrontChannelState {
  enableDineInQr: boolean
  enableTakeaway: boolean
  enableOnlineDelivery: boolean
  enableTableReservation: boolean
  enableEventTicketing: boolean
  isEmergencyBusyMode: boolean
}

export const DEFAULT_CHANNELS: StorefrontChannelState = {
  enableDineInQr: true,
  enableTakeaway: true,
  enableOnlineDelivery: true,
  enableTableReservation: true,
  enableEventTicketing: true,
  isEmergencyBusyMode: false,
}

export function evaluateActiveChannels(config?: Partial<StorefrontChannelState>): StorefrontChannelState {
  const merged = { ...DEFAULT_CHANNELS, ...config }

  // If emergency busy mode is activated, online delivery and table booking are locked temporarily
  if (merged.isEmergencyBusyMode) {
    return {
      ...merged,
      enableOnlineDelivery: false,
      enableTableReservation: false,
    }
  }

  return merged
}

export function buildOrderHandoffUrl(options: {
  merchantSlug: string
  mode: 'dine_in' | 'takeaway' | 'delivery'
  tableNumber?: string
  addItemId?: string
  quantity?: number
  promoCode?: string
}): string {
  const baseUrl = `https://order.hfeit.com/${encodeURIComponent(options.merchantSlug)}`
  const params = new URLSearchParams()

  params.set('mode', options.mode)
  if (options.tableNumber) {
    params.set('table', options.tableNumber)
  }
  if (options.addItemId) {
    params.set('addItem', options.addItemId)
    params.set('qty', String(options.quantity ?? 1))
  }
  if (options.promoCode) {
    params.set('promo', options.promoCode)
  }

  return `${baseUrl}?${params.toString()}`
}
