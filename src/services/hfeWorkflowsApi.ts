// --- HFE REST API WORKFLOWS & DELIVERY TRANSPORT ENDPOINTS ---

export interface ReconcileShiftPayload {
  openingFloat: number
  totalCashSales: number
  cashOutTotal: number
  physicalCashCount: number
  variance: number
  notes?: string
}

export interface ReconcileShiftResponse {
  reconcileId: string
  status: 'balanced' | 'over' | 'short'
  reconciledAt: string
  varianceAmount: number
}

export interface RefundTransactionResponse {
  refundId: string
  transactionId: string
  status: 'refunded' | 'partial_refunded'
  restoredBomIngredients: string[]
  refundedAt: string
}

export interface StocktakeItemPayload {
  itemCode: string
  systemStock: number
  physicalCount: number
  variance: number
  notes?: string
}

export interface StocktakeResponse {
  auditId: string
  adjustedItemsCount: number
  submittedAt: string
}

export interface DeliveryQueueItem {
  id: string
  orderId: string
  customerName: string
  phone: string
  address: string
  unitNotes?: string
  distanceKm: number
  deliveryFee: number
  status: 'pending' | 'dispatched' | 'driver_assigned' | 'in_transit' | 'delivered'
  runnerId?: string
  runnerName?: string
  provider: 'internal_runner' | 'gosend' | 'grabexpress' | 'lalamove' | 'paxel'
  resiCode?: string
  createdAt: string
}

export async function reconcileShift(
  payload: ReconcileShiftPayload,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<ReconcileShiftResponse> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/shifts/reconcile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    console.info('[HfeWorkflowsApi] Shift reconcile offline fallback.')
    return {
      reconcileId: `REC-${Date.now().toString().slice(-6)}`,
      status: payload.variance === 0 ? 'balanced' : payload.variance > 0 ? 'over' : 'short',
      reconciledAt: new Date().toISOString(),
      varianceAmount: payload.variance,
    }
  }
}

export async function refundTransaction(
  transactionId: string,
  managerPin: string,
  reason: string,
  isPartial: boolean = false,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<RefundTransactionResponse> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/transactions/${transactionId}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manager_pin: managerPin, reason, is_partial: isPartial }),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    console.info('[HfeWorkflowsApi] Refund transaction offline fallback.')
    return {
      refundId: `REF-${Date.now().toString().slice(-6)}`,
      transactionId,
      status: isPartial ? 'partial_refunded' : 'refunded',
      restoredBomIngredients: ['ING-COFFEE-01', 'ING-MILK-OAT', 'ING-SUGAR-SYRUP'],
      refundedAt: new Date().toISOString(),
    }
  }
}

export async function submitStocktake(
  items: StocktakeItemPayload[],
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<StocktakeResponse> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/inventory/stocktake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    console.info('[HfeWorkflowsApi] Stocktake submit offline fallback.')
    return {
      auditId: `STK-${Date.now().toString().slice(-6)}`,
      adjustedItemsCount: items.filter(i => i.variance !== 0).length,
      submittedAt: new Date().toISOString(),
    }
  }
}

export async function fetchDeliveryQueue(
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<DeliveryQueueItem[]> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/deliveries`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    console.info('[HfeWorkflowsApi] Delivery queue offline fallback.')
    return [
      {
        id: 'DEL-001',
        orderId: 'ORD-8801',
        customerName: 'Bambang Tri',
        phone: '6281299887766',
        address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
        unitNotes: 'Lantai 3, Unit 302',
        distanceKm: 1.2,
        deliveryFee: 5000,
        status: 'in_transit',
        runnerId: 'MEM-001',
        runnerName: 'Budi Santoso (Runner)',
        provider: 'internal_runner',
        resiCode: 'RESI-SENOPATI-20260815-0042',
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      },
      {
        id: 'DEL-002',
        orderId: 'ORD-8805',
        customerName: 'Dewi Lestari',
        phone: '6281355443322',
        address: 'Jl. Gunawarman No. 18, Jakarta Selatan',
        unitNotes: 'Pagar Putih',
        distanceKm: 2.1,
        deliveryFee: 5000,
        status: 'pending',
        provider: 'internal_runner',
        resiCode: 'RESI-SENOPATI-20260815-0043',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ]
  }
}

export async function dispatchRunner(
  deliveryId: string,
  runnerId: string,
  runnerName: string = 'Budi Santoso',
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<{ success: boolean; status: string; dispatchedAt: string }> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/deliveries/${deliveryId}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ runner_id: runnerId, runner_name: runnerName }),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    console.info('[HfeWorkflowsApi] Dispatch runner offline fallback.')
    return {
      success: true,
      status: 'in_transit',
      dispatchedAt: new Date().toISOString(),
    }
  }
}

export async function completeDelivery(
  deliveryId: string,
  paymentStatus: string = 'paid',
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<{ success: boolean; status: string; completedAt: string }> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/deliveries/${deliveryId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status: paymentStatus }),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    console.info('[HfeWorkflowsApi] Complete delivery offline fallback.')
    return {
      success: true,
      status: 'delivered',
      completedAt: new Date().toISOString(),
    }
  }
}

export async function generateResi(
  deliveryId: string,
  storeSlug: string = 'SENOPATI',
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<{ resiCode: string; trackingUrl: string }> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/deliveries/${deliveryId}/generate-resi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store_slug: storeSlug }),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const seq = Math.floor(1000 + Math.random() * 9000).toString()
    const resiCode = `RESI-${storeSlug.toUpperCase()}-${todayStr}-${seq}`
    return {
      resiCode,
      trackingUrl: `https://hfe.togrow.id/resi/${resiCode}`,
    }
  }
}

export async function fetchResiStatus(
  resiCode: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<{ resiCode: string; status: string; statusHistory: Array<{ status: string; timestamp: string; title: string; note: string }> }> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/deliveries/resi/${resiCode}`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    const now = new Date()
    return {
      resiCode,
      status: 'in_transit',
      statusHistory: [
        { status: 'placed', timestamp: new Date(now.getTime() - 30 * 60000).toISOString(), title: 'Pesanan Dibuat', note: 'Order diterima oleh kasir' },
        { status: 'kitchen', timestamp: new Date(now.getTime() - 20 * 60000).toISOString(), title: 'Dipacking Dapur', note: 'Minuman dan makanan telah dipacking rapi' },
        { status: 'in_transit', timestamp: new Date(now.getTime() - 10 * 60000).toISOString(), title: 'Dalam Pengiriman (Budi)', note: 'Kurir toko sedang menuju lokasi pengiriman' },
        { status: 'delivered', timestamp: '', title: 'Tiba di Lokasi', note: 'Menunggu konfirmasi penerimaan' },
      ],
    }
  }
}

export async function sendDigitalReceipt(
  transactionId: string,
  phone: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = 'http://localhost:8080'
): Promise<{ success: boolean; waUrl: string }> {
  try {
    const response = await fetch(`${baseUrl}/v1/company-books/${bookId}/transactions/${transactionId}/receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    return await response.json()
  } catch (err) {
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const msg = encodeURIComponent(`Halo, berikut link Struk Digital Hfe POS untuk Transaksi #${transactionId}: https://hfe.togrow.id/receipt/${transactionId}`)
    return {
      success: true,
      waUrl: `https://wa.me/${cleanPhone}?text=${msg}`,
    }
  }
}
