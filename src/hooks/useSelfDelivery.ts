import { useState } from 'react'

export type CourierProvider = 'internal_runner' | 'gosend' | 'grabexpress' | 'lalamove' | 'paxel'
export type DeliveryStatus = 'pending' | 'dispatched' | 'driver_assigned' | 'in_transit' | 'delivered'

export interface DeliveryRecord {
  id: string
  orderId: string
  recipientName: string
  phone: string
  address: string
  distanceKm: number
  deliveryFee: number
  status: DeliveryStatus
  runnerId?: string
  runnerName?: string
  provider: CourierProvider
  resiCode: string
  createdAt: string
  dispatchedAt?: string
  deliveredAt?: string
}

export function useSelfDelivery(initialRecords: DeliveryRecord[] = []) {
  const [courierProvider, setCourierProvider] = useState<CourierProvider>('internal_runner')
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(initialRecords)

  const createDeliveryRecord = (
    orderId: string,
    recipientName: string,
    phone: string,
    address: string,
    distanceKm: number = 1.5,
    orderSubtotal: number = 75000,
    storeSlug: string = 'SENOPATI'
  ): DeliveryRecord => {
    const isFree = orderSubtotal >= 100000
    const fee = isFree ? 0 : 5000
    const seq = Math.floor(1000 + Math.random() * 9000).toString()
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const resiCode = `RESI-${storeSlug.toUpperCase()}-${todayStr}-${seq}`

    const newRecord: DeliveryRecord = {
      id: `DEL-${Date.now().toString().slice(-4)}`,
      orderId,
      recipientName,
      phone,
      address,
      distanceKm,
      deliveryFee: fee,
      status: 'pending',
      provider: courierProvider,
      resiCode,
      createdAt: new Date().toISOString(),
    }

    setDeliveries((prev) => [newRecord, ...prev])
    return newRecord
  }

  const assignRunner = (
    deliveryId: string,
    runnerId: string = 'MEM-RUNNER-01',
    runnerName: string = 'Budi Santoso (Staff Runner)'
  ) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          // Standardized state machine: pending -> dispatched -> driver_assigned -> in_transit -> delivered
          const nextStatus: DeliveryStatus = d.status === 'pending' ? 'dispatched' : 'in_transit'
          return {
            ...d,
            runnerId,
            runnerName,
            status: nextStatus,
            dispatchedAt: d.dispatchedAt || new Date().toISOString(),
          }
        }
        return d
      })
    )
  }

  const advanceDeliveryStatus = (deliveryId: string, targetStatus: DeliveryStatus) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: targetStatus,
            deliveredAt: targetStatus === 'delivered' ? new Date().toISOString() : d.deliveredAt,
          }
        }
        return d
      })
    )
  }

  return {
    courierProvider,
    setCourierProvider,
    deliveries,
    createDeliveryRecord,
    assignRunner,
    advanceDeliveryStatus,
  }
}
