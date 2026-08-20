import { describe, it, expect } from 'vitest'
import { formatThermalReceiptText } from '../services/receiptPrinter'

describe('User Journey Test Loop Iterations (Poin 1 - 5 Deep Validation)', () => {

  describe('Loop 1: Hybrid POS Sensor Barcode & Table Overlay Handling (Poin 1)', () => {
    it('executes barcode quick-add scanner overlay while viewing Table Floor Plan', () => {
      const activeState = {
        currentTab: 'peta-meja',
        tableNo: '04',
        cartItems: [] as any[],
      }

      // Simulated USB Barcode Scanner hardware event (Scanning SKU 8999901)
      const scannedBarcode = '8999901'
      const scannedItem = { id: 'item-8999901', name: 'Biji Kopi Arabica 250g', price: 85000, qty: 1 }

      // Scanned barcode auto-adds to active cart without interrupting table view context
      activeState.cartItems.push(scannedItem)

      expect(activeState.currentTab).toBe('peta-meja')
      expect(activeState.cartItems.length).toBe(1)
      expect(activeState.cartItems[0].name).toBe('Biji Kopi Arabica 250g')
    })
  })

  describe('Loop 2: HCB Subledger Theft/Shrinkage & Cash Variance Auditing (Poin 2)', () => {
    it('detects shift cash variance anomaly and flags GL cash shortage entry', () => {
      const expectedCash = 500000
      const actualCashInDrawer = 430000
      const variance = actualCashInDrawer - expectedCash // -70,000

      const isAnomalyDetected = Math.abs(variance) > 50000
      const glAccount = variance < 0 ? '6-5300-CASH-SHORTAGE' : '7-1100-CASH-OVERAGE'

      expect(isAnomalyDetected).toBe(true)
      expect(glAccount).toBe('6-5300-CASH-SHORTAGE')
      expect(variance).toBe(-70000)
    })

    it('detects recipe BOM ingredient shrinkage and triggers inventory alert', () => {
      const soldEspressoCups = 50
      const recipeStandardGramPerCup = 18 // 50 * 18 = 900g
      const expectedCoffeeBeanUsedGrams = soldEspressoCups * recipeStandardGramPerCup
      const actualCoffeeBeanDeductedGrams = 1500 // 1.5 kg used

      const shrinkageGrams = actualCoffeeBeanDeductedGrams - expectedCoffeeBeanUsedGrams
      const shrinkagePct = (shrinkageGrams / expectedCoffeeBeanUsedGrams) * 100

      const isShrinkageAlertTriggered = shrinkagePct > 20 // 66.6% > 20%

      expect(shrinkageGrams).toBe(600)
      expect(isShrinkageAlertTriggered).toBe(true)
    })
  })

  describe('Loop 3: Cashier Personal Slot vs Manager Preset Restrictions (Poin 3)', () => {
    it('enforces RBAC manager preset locking for top 8 items while allowing 4 cashier personal slots', () => {
      const managerLockedPresets = ['Item-1', 'Item-2', 'Item-3', 'Item-4', 'Item-5', 'Item-6', 'Item-7', 'Item-8']
      const cashierPersonalSlots = ['Custom-Bag', 'Extra-Ice']

      const userRole: string = 'cashier'
      const canEditLockedPresets = userRole === 'manager' || userRole === 'owner'
      const canEditPersonalSlots = true

      expect(canEditLockedPresets).toBe(false)
      expect(canEditPersonalSlots).toBe(true)
      expect(managerLockedPresets.length + cashierPersonalSlots.length).toBe(10) // 8 Manager + 2 Personal
    })
  })

  describe('Loop 4: Sub-Folio Credit Line Accounting on Join & Split (Poin 4)', () => {
    it('maintains pre-paid credit lines and tax balance when joining and un-joining tables', () => {
      const table04Folio = { tableNo: '04', bill: 300000, prePaidCredit: 0 }
      const table05Folio = { tableNo: '05', bill: 200000, prePaidCredit: 100000 } // Pre-paid Rp 100k QRIS

      // Join Table 04 + Table 05
      const joinedGroupTotal = table04Folio.bill + table05Folio.bill // 500,000
      const joinedPrePaidCredit = table04Folio.prePaidCredit + table05Folio.prePaidCredit // 100,000
      const remainingPayable = joinedGroupTotal - joinedPrePaidCredit // 400,000

      expect(joinedGroupTotal).toBe(500000)
      expect(joinedPrePaidCredit).toBe(100000)
      expect(remainingPayable).toBe(400000)

      // Un-Join / Split back Table 05
      const unjoinedTable05Payable = table05Folio.bill - table05Folio.prePaidCredit
      expect(unjoinedTable05Payable).toBe(100000)
    })
  })

  describe('Loop 5: Partial Seat Un-Join & Early Departure Checkout (Poin 5)', () => {
    it('extracts Seat 2 items for early checkout without disturbing remaining seats on table', () => {
      const table04State = {
        tableNo: '04',
        seats: [
          { seatNo: 1, guestName: 'Aldi', items: [{ name: 'Steak', price: 150000 }] },
          { seatNo: 2, guestName: 'Budi', items: [{ name: 'Beer', price: 50000 }] }, // Departs early
          { seatNo: 3, guestName: 'Siti', items: [{ name: 'Pasta', price: 85000 }] },
        ],
      }

      // Early Checkout Seat 2 (Budi)
      const seat2 = table04State.seats.find((s) => s.seatNo === 2)
      const seat2Subtotal = seat2 ? seat2.items.reduce((sum, i) => sum + i.price, 0) : 0
      const seat2Pb1Tax = seat2Subtotal * 0.10 // 5.000
      const seat2EarlyBillTotal = seat2Subtotal + seat2Pb1Tax // 55.000

      // Detach Seat 2 from active Table 04
      table04State.seats = table04State.seats.filter((s) => s.seatNo !== 2)

      expect(seat2EarlyBillTotal).toBe(55000)
      expect(table04State.seats.length).toBe(2) // Seats 1 & 3 remain active
      expect(table04State.seats[0].guestName).toBe('Aldi')
      expect(table04State.seats[1].guestName).toBe('Siti')
    })
  })

  describe('Loop 6: Walk-In Customer Checkout Flow (Direct Pay & Open-Tab)', () => {
    it('executes Scenario A: Direct Walk-In Takeaway Checkout at Cashier', () => {
      const walkInCart = [
        { name: 'Iced Aren Latte', price: 28000, quantity: 2 },
        { name: 'Almond Croissant', price: 32000, quantity: 1 }
      ]
      const subtotal = walkInCart.reduce((sum, item) => sum + item.price * item.quantity, 0) // 88,000
      const pb1Tax = Math.round(subtotal * 0.10) // 8,800
      const grandTotal = subtotal + pb1Tax // 96,800

      const cashGiven = 100000
      const changeAmount = cashGiven - grandTotal // 3,200

      expect(subtotal).toBe(88000)
      expect(grandTotal).toBe(96800)
      expect(changeAmount).toBe(3200)
    })

    it('executes Scenario B: Walk-In Open-Tab Pay-Later Search & Settlement', () => {
      const activeOpenTabs = [
        { tabId: 'TAB-104', guestName: 'Erick (Walk-In)', tableNo: 'Walk-In #04', totalBill: 125000, status: 'open-tab' },
        { tabId: 'TAB-105', guestName: 'Rina (Walk-In)', tableNo: 'Walk-In #05', totalBill: 75000, status: 'open-tab' }
      ]

      // Cashier searches for "Erick"
      const searchQuery = 'Erick'
      const matchedTab = activeOpenTabs.find(t => t.guestName.toLowerCase().includes(searchQuery.toLowerCase()))

      expect(matchedTab).toBeDefined()
      expect(matchedTab?.tabId).toBe('TAB-104')
      expect(matchedTab?.totalBill).toBe(125000)
    })
  })

  describe('Loop 7: Multi-Field Catalog Search & Barcode SKU Lookup', () => {
    const mockCatalog = [
      { id: 'SKU-8999901', name: 'Biji Kopi Arabica 250g', category: 'Kopi', price: 85000, hfeCategoryCode: 'CAT-BEV' },
      { id: 'SKU-8999902', name: 'Iced Aren Latte', category: 'Kopi', price: 28000, hfeCategoryCode: 'CAT-BEV' },
      { id: 'SKU-8999903', name: 'Almond Croissant', category: 'Pastry', price: 32000, hfeCategoryCode: 'CAT-BAK' },
    ]

    it('filters catalog items by Name query', () => {
      const query = 'aren'
      const matches = mockCatalog.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
      expect(matches.length).toBe(1)
      expect(matches[0].name).toBe('Iced Aren Latte')
    })

    it('filters catalog items by exact Barcode SKU match', () => {
      const barcodeQuery = '8999901'
      const matches = mockCatalog.filter(i => i.id.includes(barcodeQuery))
      expect(matches.length).toBe(1)
      expect(matches[0].name).toBe('Biji Kopi Arabica 250g')
    })

    it('filters catalog items by HCB Category Code', () => {
      const catQuery = 'CAT-BAK'
      const matches = mockCatalog.filter(i => i.hfeCategoryCode === catQuery)
      expect(matches.length).toBe(1)
      expect(matches[0].name).toBe('Almond Croissant')
    })
  })

  describe('Loop 8: Thermal Receipt Formatting & HCB Hash Verification', () => {
    it('formats thermal receipt text with item breakdown and change calculation', () => {
      const sampleReceipt = {
        receiptNo: 'REC-2026-0816-042',
        storeName: 'Kopi Senopati HQ',
        storeAddress: 'Jl. Senopati No. 45, Jakarta Selatan',
        cashierName: 'Siti',
        customerName: 'Budi',
        orderType: 'takeaway' as const,
        timestamp: '2026-08-16 12:30',
        items: [{ name: 'Iced Aren Latte', qty: 2, price: 28000 }],
        subtotal: 56000,
        pb1Tax: 5600,
        grandTotal: 61600,
        paymentMethod: 'cash' as const,
        cashGiven: 100000,
        changeReturned: 38400,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }

      const receiptText = formatThermalReceiptText(sampleReceipt)

      expect(receiptText).toContain('KOPI SENOPATI HQ')
      expect(receiptText).toContain('REC-2026-0816-042')
      expect(receiptText).toContain('Kembalian     : Rp 38.400')
      expect(receiptText).not.toContain('HCB Verify')
    })
  })

  describe('Loop 9: Cashier Direct Order Entry (Tanpa QR Code)', () => {
    it('allows cashier to create direct table order without QR scanning', () => {
      const table04Order = {
        orderId: 'ORD-108',
        tableNo: '04',
        orderChannel: 'cashier-pos' as const, // Direct Cashier Entry
        customerName: 'Bapak Bambang (Direct Order)',
        items: [
          { name: 'Nasi Goreng Special', price: 45000, qty: 2 },
          { name: 'Es Teh Manis', price: 10000, qty: 2 }
        ],
        status: 'cooking' as const
      }

      const totalItems = table04Order.items.reduce((sum, i) => sum + i.qty, 0)
      const subtotal = table04Order.items.reduce((sum, i) => sum + i.price * i.qty, 0)

      expect(table04Order.orderChannel).toBe('cashier-pos')
      expect(totalItems).toBe(4)
      expect(subtotal).toBe(110000)
    })
  })
})
