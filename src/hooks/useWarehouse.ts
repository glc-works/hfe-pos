import { useState, useEffect } from 'react'
import {
  WarehouseInfo,
  StockItem,
  ReceiveGoodsPayload,
  StockTransferPayload,
  WasteAdjustmentPayload,
  fetchWarehouses,
  receiveGoods,
  transferStock,
  adjustWaste,
} from '../services/hfeApi'

export interface TransferRecord {
  id: string
  sourceWarehouseId: string
  destinationWarehouseId: string
  itemCode: string
  itemName: string
  qty: number
  status: 'requested' | 'in_transit' | 'received'
  requestedAt: string
  notes?: string
}

export interface WasteRecord {
  id: string
  warehouseId: string
  itemCode: string
  itemName: string
  qty: number
  reason: string
  expenseGlAccount: string
  adjustedAt: string
  expenseAmountIdr: number
}

export interface ReceivingRecord {
  id: string
  warehouseId: string
  itemCode: string
  itemName: string
  qty: number
  supplierPoNumber: string
  batchNumber: string
  expiryDate?: string
  receivedAt: string
}

const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    id: 'STK-001',
    sku: 'ING-CF-BEANS-01',
    name: 'Bijikopi House Blend Arabica 1kg',
    category: 'Bahan Baku Kopi',
    currentStock: 45,
    minStock: 10,
    unit: 'Kg',
    unitCost: 185000,
    warehouseId: 'WH-CENTRAL-HQ',
    status: 'in_stock',
    barcode: '899100100201',
  },
  {
    id: 'STK-002',
    sku: 'ING-MILK-OAT-01',
    name: 'Oat Milk Barista Edition 1L',
    category: 'Susu & Diary',
    currentStock: 8,
    minStock: 15,
    unit: 'Kartus',
    unitCost: 42000,
    warehouseId: 'WH-SENOPATI-STORE',
    status: 'low_stock',
    barcode: '899100100202',
  },
  {
    id: 'STK-003',
    sku: 'ING-SYRUP-VANILLA-01',
    name: 'French Vanilla Syrup 750ml',
    category: 'Syrup & Flavour',
    currentStock: 0,
    minStock: 5,
    unit: 'Botol',
    unitCost: 165000,
    warehouseId: 'WH-SENOPATI-STORE',
    status: 'out_of_stock',
    barcode: '899100100203',
  },
  {
    id: 'STK-004',
    sku: 'PACK-CUP-ICED-16OZ',
    name: 'Paper Cup Cold 16oz (Pack 50s)',
    category: 'Kemasan & Packaging',
    currentStock: 120,
    minStock: 30,
    unit: 'Pack',
    unitCost: 35000,
    warehouseId: 'WH-CENTRAL-HQ',
    status: 'in_stock',
    barcode: '899100100204',
  },
]

export function useWarehouse(bookId: string = 'BOOK-CAFE-HQ-88') {
  const [activeWarehouseId, setActiveWarehouseId] = useState<string>('WH-CENTRAL-HQ')
  const [warehouses, setWarehouses] = useState<WarehouseInfo[]>([])
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS)
  const [transferRequests, setTransferRequests] = useState<TransferRecord[]>([
    {
      id: 'TRF-9901',
      sourceWarehouseId: 'WH-CENTRAL-HQ',
      destinationWarehouseId: 'WH-SENOPATI-STORE',
      itemCode: 'ING-CF-BEANS-01',
      itemName: 'Bijikopi House Blend Arabica 1kg',
      qty: 10,
      status: 'in_transit',
      requestedAt: new Date(Date.now() - 3600000).toISOString(),
      notes: 'Permintaan restock rutin Senopati',
    },
  ])
  const [wasteAdjustments, setWasteAdjustments] = useState<WasteRecord[]>([])
  const [receivingLogs, setReceivingLogs] = useState<ReceivingRecord[]>([])

  const [isReceivingModalOpen, setIsReceivingModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWarehouses(bookId).then(setWarehouses).catch(console.error)
  }, [bookId])

  const handleReceiveGoods = async (payload: ReceiveGoodsPayload) => {
    setLoading(true)
    try {
      const res = await receiveGoods(bookId, payload)
      const targetItem = stockItems.find((i) => i.sku === payload.itemCode || i.id === payload.itemCode)
      const itemName = targetItem ? targetItem.name : payload.itemCode

      const newRecord: ReceivingRecord = {
        id: res.receiving_id,
        warehouseId: payload.warehouseId,
        itemCode: payload.itemCode,
        itemName,
        qty: payload.qty,
        supplierPoNumber: payload.supplierPoNumber,
        batchNumber: payload.batchNumber,
        expiryDate: payload.expiryDate,
        receivedAt: res.received_at,
      }
      setReceivingLogs((prev) => [newRecord, ...prev])

      // Update local stock item
      setStockItems((prev) =>
        prev.map((item) => {
          if (item.sku === payload.itemCode || item.id === payload.itemCode) {
            const nextStock = item.currentStock + payload.qty
            const nextStatus = nextStock === 0 ? 'out_of_stock' : nextStock <= item.minStock ? 'low_stock' : 'in_stock'
            return { ...item, currentStock: nextStock, status: nextStatus }
          }
          return item
        })
      )
      setIsReceivingModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleTransferStock = async (payload: StockTransferPayload) => {
    setLoading(true)
    try {
      const res = await transferStock(bookId, payload)
      const targetItem = stockItems.find((i) => i.sku === payload.itemCode || i.id === payload.itemCode)
      const itemName = targetItem ? targetItem.name : payload.itemCode

      const newRecord: TransferRecord = {
        id: res.transfer_id,
        sourceWarehouseId: payload.sourceWarehouseId,
        destinationWarehouseId: payload.destinationWarehouseId,
        itemCode: payload.itemCode,
        itemName,
        qty: payload.qty,
        status: res.status,
        requestedAt: res.requested_at,
        notes: payload.notes,
      }
      setTransferRequests((prev) => [newRecord, ...prev])
      setIsTransferModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const updateTransferStatus = (transferId: string, nextStatus: 'requested' | 'in_transit' | 'received') => {
    setTransferRequests((prev) =>
      prev.map((rec) => {
        if (rec.id === transferId) {
          // If moving to received, update target stock
          if (nextStatus === 'received' && rec.status !== 'received') {
            setStockItems((items) =>
              items.map((item) => {
                if (item.sku === rec.itemCode || item.id === rec.itemCode) {
                  const newQty = item.currentStock + rec.qty
                  return { ...item, currentStock: newQty, status: newQty <= item.minStock ? 'low_stock' : 'in_stock' }
                }
                return item
              })
            )
          }
          return { ...rec, status: nextStatus }
        }
        return rec
      })
    )
  }

  const handleAdjustWaste = async (payload: WasteAdjustmentPayload) => {
    setLoading(true)
    try {
      const res = await adjustWaste(bookId, payload)
      const targetItem = stockItems.find((i) => i.sku === payload.itemCode || i.id === payload.itemCode)
      const itemName = targetItem ? targetItem.name : payload.itemCode

      const newRecord: WasteRecord = {
        id: res.adjustment_id,
        warehouseId: payload.warehouseId,
        itemCode: payload.itemCode,
        itemName,
        qty: payload.qty,
        reason: payload.reason,
        expenseGlAccount: res.gl_account,
        adjustedAt: res.adjusted_at,
        expenseAmountIdr: res.expense_amount_idr,
      }
      setWasteAdjustments((prev) => [newRecord, ...prev])

      // Deduct stock
      setStockItems((prev) =>
        prev.map((item) => {
          if (item.sku === payload.itemCode || item.id === payload.itemCode) {
            const nextStock = Math.max(0, item.currentStock - payload.qty)
            const nextStatus = nextStock === 0 ? 'out_of_stock' : nextStock <= item.minStock ? 'low_stock' : 'in_stock'
            return { ...item, currentStock: nextStock, status: nextStatus }
          }
          return item
        })
      )
      setIsWasteModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const activeWarehouse = warehouses.find((w) => w.id === activeWarehouseId) || {
    id: activeWarehouseId,
    name: 'Gudang Utama',
    code: 'WH-HQ',
    type: 'central_hq',
    totalItemCount: stockItems.length,
    totalValuationIdr: stockItems.reduce((acc, i) => acc + i.currentStock * i.unitCost, 0),
  }

  const filteredStockItems = stockItems.filter((i) => i.warehouseId === activeWarehouseId || activeWarehouseId === 'WH-CENTRAL-HQ')

  return {
    activeWarehouseId,
    setActiveWarehouseId,
    activeWarehouse,
    warehouses,
    stockItems: filteredStockItems,
    allStockItems: stockItems,
    transferRequests,
    wasteAdjustments,
    receivingLogs,
    isReceivingModalOpen,
    setIsReceivingModalOpen,
    isTransferModalOpen,
    setIsTransferModalOpen,
    isWasteModalOpen,
    setIsWasteModalOpen,
    loading,
    handleReceiveGoods,
    handleTransferStock,
    updateTransferStatus,
    handleAdjustWaste,
  }
}
