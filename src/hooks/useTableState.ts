import { useState } from 'react'
import { TableStatus, TableReservation, OrderTicket, PosPayMethod, PropertyZoneConfig, PropertyZoneId } from '../types/pos'
import { PROPERTY_ZONES } from '../data/mockData'
import { createRuntimeInitialTables } from '../data/runtimeDemoData'

export interface UseTableStateOptions {
  orders: OrderTicket[]
  setOrders: React.Dispatch<React.SetStateAction<OrderTicket[]>>
  hfeCompanyProfile: { ptLegalName: string }
}

export function useTableState(options: UseTableStateOptions) {
  const { orders, setOrders, hfeCompanyProfile } = options

  // Multi-Zone & Dynamic Property Zone State (Customizable by Owner)
  const [propertyZones, setPropertyZones] = useState<PropertyZoneConfig[]>(PROPERTY_ZONES)
  const [selectedZoneId, setSelectedZoneId] = useState<PropertyZoneId>('all')

  const updateZoneName = (id: string, newName: string) => {
    setPropertyZones(prev => prev.map(z => z.id === id ? { ...z, name: newName } : z))
  }

  const addCustomZone = (newZone: PropertyZoneConfig) => {
    setPropertyZones(prev => {
      if (prev.some(z => z.id === newZone.id)) {
        return prev.map(z => z.id === newZone.id ? newZone : z)
      }
      return [...prev, newZone]
    })
  }

  // Tables Grid & Active Selection State
  const initialTables = createRuntimeInitialTables(orders)
  const [tablesGrid, setTablesGrid] = useState<TableStatus[]>(initialTables)

  const [selectedTable, setSelectedTable] = useState<string>(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    return urlParams.get('table') || ''
  })

  const [scannedSeat, setScannedSeat] = useState<string>(() => {
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    return urlParams.get('seat') || ''
  })

  const [selectedPOSTable, setSelectedPOSTable] = useState<TableStatus | null>(() => {
    return initialTables.find(t => t.status === 'occupied') || initialTables[0] || null
  })
  const [posPayMethod, setPosPayMethod] = useState<PosPayMethod>('cash')
  const [posCashGiven, setPosCashGiven] = useState<string>('100000')

  // Table Reassignment / Split / Join Modal State
  const [showTableReassignModal, setShowTableReassignModal] = useState<boolean>(false)
  const [tableOpMode, setTableOpMode] = useState<'move' | 'split' | 'join'>('move')
  const [reassignFromTable, setReassignFromTable] = useState<string>(() => tablesGrid[0]?.name || 'IND-01')
  const [reassignTargetTable, setReassignTargetTable] = useState<string>(() => tablesGrid[1]?.name || 'IND-02')
  const [splitSourceTable, setSplitSourceTable] = useState<string>(() => tablesGrid[0]?.name || 'IND-01')
  const [splitTargetTable, setSplitTargetTable] = useState<string>(() => tablesGrid[1]?.name || 'IND-02')
  const [splitSelectedSeat, setSplitSelectedSeat] = useState<string>('Kursi 2')
  const [joinSourceTable, setJoinSourceTable] = useState<string>(() => tablesGrid[2]?.name || 'OUT-01')
  const [joinTargetTable, setJoinTargetTable] = useState<string>(() => tablesGrid[0]?.name || 'IND-01')

  // Reservation Engine State
  const [reservationPolicyMode, setReservationPolicyMode] = useState<'instant' | 'manual_review'>('manual_review')
  const [dpRequiredMode, setDpRequiredMode] = useState<boolean>(true)
  const [dpAmountConfig, setDpAmountConfig] = useState<number>(50000)
  const [reservationOrderMode, setReservationOrderMode] = useState<'table_only' | 'optional_order' | 'mandatory_order'>('optional_order')
  const [customerAppDisplayMode, setCustomerAppDisplayMode] = useState<'full_ordering' | 'catalog_only'>('full_ordering')
  const [priceVisibilityMode, setPriceVisibilityMode] = useState<'show_prices' | 'hide_prices'>('show_prices')

  const [resPreOrderItems, setResPreOrderItems] = useState<{ itemId: string; name: string; price: number; qty: number }[]>([])
  const [showReservationModal, setShowReservationModal] = useState<boolean>(false)
  const [resDate, setResDate] = useState<string>('2026-08-16')
  const [resTimeSlot, setResTimeSlot] = useState<string>('19:00 WIB')
  const [resArea, setResArea] = useState<string>('Outdoor Garden (Smoking)')
  const [resPax, setResPax] = useState<number>(4)
  const [resCustomerName, setResCustomerName] = useState<string>('Aldi Pratama')
  const [resCustomerPhone, setResCustomerPhone] = useState<string>('081298765432')
  const [resNotes, setResNotes] = useState<string>('Ulang Tahun (Minta Baby Chair 1 pcs)')
  const [resPayDpNow, setResPayDpNow] = useState<boolean>(true)

  const [reservations, setReservations] = useState<TableReservation[]>([
    {
      id: 'RSV-901',
      customerName: 'Pratama Group',
      phone: '081298765432',
      tableArea: 'VIP Glasshouse',
      paxCount: 6,
      reservationDate: '2026-08-16',
      timeSlot: '19:00 WIB',
      dpAmount: 50000,
      dpStatus: 'paid_qris',
      approvalPolicy: 'instant',
      status: 'confirmed',
      specialNotes: 'Meja dekat Window view garden',
      preOrderItems: [
        { name: 'Espresso Aren Latte', qty: 2, price: 28000 },
        { name: 'Croissant Butter Paris', qty: 2, price: 25000 }
      ],
      totalPreOrderAmount: 106000,
      createdAt: '14:20'
    }
  ])

  // Handlers
  const handleConfirmTableReassign = () => {
    if (reassignFromTable === reassignTargetTable) {
      alert('Meja tujuan tidak boleh sama dengan meja asal!')
      return
    }

    setOrders(prev => prev.map(o => o.table === reassignFromTable ? { ...o, table: reassignTargetTable } : o))

    setTablesGrid(prev => {
      const sourceTableObj = prev.find(t => t.name === reassignFromTable)
      if (!sourceTableObj) return prev
      const bill = sourceTableObj.totalBill
      const count = sourceTableObj.orderCount
      const custName = sourceTableObj.customerName

      return prev.map(t => {
        if (t.name === reassignFromTable) {
          return { ...t, status: 'free', totalBill: 0, orderCount: 0, customerName: undefined }
        }
        if (t.name === reassignTargetTable) {
          return { ...t, status: 'occupied', totalBill: bill, orderCount: count, customerName: custName }
        }
        return t
      })
    })

    if (selectedTable === reassignFromTable) {
      setSelectedTable(reassignTargetTable)
    }

    setShowTableReassignModal(false)
    alert(`🔀 Berhasil! Pesanan pelanggan dari ${reassignFromTable} dipindahkan ke ${reassignTargetTable} oleh Staf Kafe.`)
  }

  const handleConfirmTableSplit = () => {
    if (splitSourceTable === splitTargetTable) {
      alert('Meja tujuan split tidak boleh sama dengan meja asal!')
      return
    }

    const sourceOrderIndex = orders.findIndex(o => o.table === splitSourceTable)
    if (sourceOrderIndex >= 0) {
      const sourceOrder = orders[sourceOrderIndex]
      const splitItems = sourceOrder.items.filter(i => i.seatNumber === splitSelectedSeat)
      const remainingItems = sourceOrder.items.filter(i => i.seatNumber !== splitSelectedSeat)

      if (splitItems.length === 0) {
        alert(`Tidak ada item pesanan di ${splitSelectedSeat} untuk di-split!`)
        return
      }

      const splitSubtotal = splitItems.reduce((s, i) => s + (i.price * i.quantity), 0)
      const remainingSubtotal = remainingItems.reduce((s, i) => s + (i.price * i.quantity), 0)

      const updatedOrders = [...orders]
      updatedOrders[sourceOrderIndex] = {
        ...sourceOrder,
        items: remainingItems,
        total: remainingSubtotal
      }

      const newSplitOrder: OrderTicket = {
        id: `ORD-SPLIT-${Math.floor(100 + Math.random() * 900)}`,
        table: splitTargetTable,
        customerName: `${sourceOrder.customerName} (${splitSelectedSeat})`,
        items: splitItems,
        policy: sourceOrder.policy,
        total: splitSubtotal,
        taxPB1Amount: Math.round(splitSubtotal * 0.1),
        serviceFeeAmount: Math.round(splitSubtotal * 0.05),
        tipAmount: 0,
        status: 'processing',
        timeElapsedMinutes: 1,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }

      setOrders([newSplitOrder, ...updatedOrders])

      setTablesGrid(prev => prev.map(t => {
        if (t.name === splitSourceTable) {
          return { ...t, totalBill: remainingSubtotal, orderCount: remainingItems.length }
        }
        if (t.name === splitTargetTable) {
          return { ...t, status: 'occupied', customerName: newSplitOrder.customerName, totalBill: splitSubtotal, orderCount: splitItems.length }
        }
        return t
      }))

      setShowTableReassignModal(false)
      alert(`✂️ Sukses! Item ${splitSelectedSeat} dari ${splitSourceTable} berhasil di-split ke ${splitTargetTable} (Rp ${splitSubtotal.toLocaleString('id-ID')}).`)
    }
  }

  const handleConfirmTableJoin = () => {
    if (joinSourceTable === joinTargetTable) {
      alert('Meja yang digabung tidak boleh sama!')
      return
    }

    const sourceTableObj = tablesGrid.find(t => t.name === joinSourceTable)
    const targetTableObj = tablesGrid.find(t => t.name === joinTargetTable)

    if (!sourceTableObj || !targetTableObj) return

    const combinedBill = sourceTableObj.totalBill + targetTableObj.totalBill
    const combinedCount = sourceTableObj.orderCount + targetTableObj.orderCount

    setOrders(prev => prev.map(o => {
      if (o.table === joinSourceTable) {
        return { ...o, table: joinTargetTable }
      }
      return o
    }))

    setTablesGrid(prev => prev.map(t => {
      if (t.name === joinSourceTable) {
        return { ...t, status: 'free', totalBill: 0, orderCount: 0, customerName: undefined }
      }
      if (t.name === joinTargetTable) {
        return { ...t, status: 'occupied', totalBill: combinedBill, orderCount: combinedCount, customerName: `${t.customerName || 'Group'} & ${sourceTableObj.customerName || 'Gabungan'}` }
      }
      return t
    }))

    setShowTableReassignModal(false)
    alert(`🔗 Sukses! Meja ${joinSourceTable} berhasil digabungkan dengan ${joinTargetTable}! Total Tagihan Gabungan: Rp ${combinedBill.toLocaleString('id-ID')}.`)
  }

  const handleCreateReservation = () => {
    if (!resCustomerName.trim() || !resCustomerPhone.trim()) {
      alert('Nama dan Nomor HP Pemesan Wajib diisi!')
      return
    }

    if (reservationOrderMode === 'mandatory_order' && resPreOrderItems.length === 0) {
      alert('⚠️ Kebijakan Kafe: Wajib memilih minimal 1 menu Pre-Order untuk melakukan reservasi meja!')
      return
    }

    const totalPreOrderAmount = resPreOrderItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
    const finalDpAmount = (dpRequiredMode && resPayDpNow) ? dpAmountConfig : 0
    const initialStatus = reservationPolicyMode === 'instant' ? 'confirmed' : 'pending'

    const newReservation: TableReservation = {
      id: `RSV-${Math.floor(100 + Math.random() * 900)}`,
      customerName: resCustomerName,
      phone: resCustomerPhone,
      tableArea: resArea,
      paxCount: resPax,
      reservationDate: resDate,
      timeSlot: resTimeSlot,
      dpAmount: finalDpAmount,
      dpStatus: finalDpAmount > 0 ? 'paid_qris' : 'unpaid',
      approvalPolicy: reservationPolicyMode,
      status: initialStatus,
      specialNotes: resNotes.trim() || undefined,
      preOrderItems: resPreOrderItems.length > 0 ? resPreOrderItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })) : undefined,
      totalPreOrderAmount: totalPreOrderAmount > 0 ? totalPreOrderAmount : undefined,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }

    setReservations([newReservation, ...reservations])
    setShowReservationModal(false)
    setResPreOrderItems([])

    if (initialStatus === 'confirmed') {
      alert(`🎉 Reservasi Instan Berhasil Disetujui! Direservasikan untuk ${resCustomerName} (${resDate} @ ${resTimeSlot}). DP Rp ${finalDpAmount.toLocaleString('id-ID')} Terposting ke Ledger Deposit HFE!`)
    } else {
      alert(`⏳ Permohonan Reservasi Terkirim! Status: Menunggu Konfirmasi Staf/Kasir Kafe. Notifikasi akan dikirim via WA ${resCustomerPhone}.`)
    }
  }

  const handleApproveReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'confirmed' } : r))
    alert(`✓ Reservasi ${id} Disetujui! Meja resmi dibooking di sistem.`)
  }

  const handleRejectReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    alert(`❌ Reservasi ${id} Dibatalkan.`)
  }

  const handlePOSCheckoutTable = () => {
    if (!selectedPOSTable) return
    const tableName = selectedPOSTable.name
    const guestName = selectedPOSTable.customerName || 'Tamu'

    setTablesGrid(prev => prev.map(t => {
      if (t.id === selectedPOSTable.id || t.name === selectedPOSTable.name) {
        return {
          ...t,
          status: 'occupied',
          totalBill: 0,
          orderCount: 0,
          customerName: `${guestName.replace(' (Lunas)', '')} (Lunas)`
        }
      }
      return t
    }))

    setSelectedPOSTable(prev => prev ? {
      ...prev,
      status: 'occupied',
      totalBill: 0,
      orderCount: 0,
      customerName: `${guestName.replace(' (Lunas)', '')} (Lunas)`
    } : null)
  }

  return {
    tablesGrid,
    setTablesGrid,
    selectedTable,
    setSelectedTable,
    scannedSeat,
    setScannedSeat,
    selectedPOSTable,
    setSelectedPOSTable,
    posPayMethod,
    setPosPayMethod,
    posCashGiven,
    setPosCashGiven,
    showTableReassignModal,
    setShowTableReassignModal,
    tableOpMode,
    setTableOpMode,
    reassignFromTable,
    setReassignFromTable,
    reassignTargetTable,
    setReassignTargetTable,
    splitSourceTable,
    setSplitSourceTable,
    splitTargetTable,
    setSplitTargetTable,
    splitSelectedSeat,
    setSplitSelectedSeat,
    joinSourceTable,
    setJoinSourceTable,
    joinTargetTable,
    setJoinTargetTable,
    reservationPolicyMode,
    setReservationPolicyMode,
    dpRequiredMode,
    setDpRequiredMode,
    dpAmountConfig,
    setDpAmountConfig,
    reservationOrderMode,
    setReservationOrderMode,
    customerAppDisplayMode,
    setCustomerAppDisplayMode,
    priceVisibilityMode,
    setPriceVisibilityMode,
    resPreOrderItems,
    setResPreOrderItems,
    showReservationModal,
    setShowReservationModal,
    resDate,
    setResDate,
    resTimeSlot,
    setResTimeSlot,
    resArea,
    setResArea,
    resPax,
    setResPax,
    resCustomerName,
    setResCustomerName,
    resCustomerPhone,
    setResCustomerPhone,
    resNotes,
    setResNotes,
    resPayDpNow,
    setResPayDpNow,
    reservations,
    setReservations,
    propertyZones,
    setPropertyZones,
    selectedZoneId,
    setSelectedZoneId,
    updateZoneName,
    addCustomZone,
    handleConfirmTableReassign,
    handleConfirmTableSplit,
    handleConfirmTableJoin,
    handleCreateReservation,
    handleApproveReservation,
    handleRejectReservation,
    handlePOSCheckoutTable
  }
}
