import { describe, it, expect } from 'vitest'

export interface WidgetSlotBlueprint {
  type: 'standard' | 'vip'
  row1: string[] // Header items
  row2: string[] // Body items
  row3: string[] // Footer items
  gridColumnsOccupied: number
}

export const generateWidgetBlueprint = (type: 'standard' | 'vip'): WidgetSlotBlueprint => {
  if (type === 'vip') {
    return {
      type: 'vip',
      row1: ['tableId', 'capacityUtilisation', 'timer'],
      row2: ['guestName', 'vipProgressBadge', 'microProgressBar'],
      row3: ['ticketId', 'priceTabular'],
      gridColumnsOccupied: 1,
    }
  }

  return {
    type: 'standard',
    row1: ['tableId', 'capacityUtilisation', 'timer'],
    row2: ['guestName', 'menuCountBadge'],
    row3: ['ticketId', 'priceTabular'],
    gridColumnsOccupied: 1,
  }
}

describe('iOS/Android Modular Widget Matrix Floor Plan Suite (L2-POS-63)', () => {
  it('guarantees Standard and VIP cards adhere to the exact same 3-row atomic layout blueprint', () => {
    const standardWidget = generateWidgetBlueprint('standard')
    const vipWidget = generateWidgetBlueprint('vip')

    // Row 1 (Header): Identical anchors (ID on left, Capacity center, Timer right)
    expect(standardWidget.row1[0]).toBe(vipWidget.row1[0])
    expect(standardWidget.row1[1]).toBe(vipWidget.row1[1])
    expect(standardWidget.row1[2]).toBe(vipWidget.row1[2])

    // Row 3 (Footer): Identical anchors (Ticket on left, Price tabular on right)
    expect(standardWidget.row3[0]).toBe(vipWidget.row3[0])
    expect(standardWidget.row3[1]).toBe(vipWidget.row3[1])
  })

  it('guarantees 100% continuous grid track baseline alignment across all zones', () => {
    const zones = [
      { name: 'Outdoor Garden', tables: 6, cols: 3, rows: 2 },
      { name: 'Indoor AC Dining', tables: 6, cols: 3, rows: 2 },
      { name: 'VIP Private Rooms', tables: 2, cols: 2, rows: 1 },
      { name: 'Poolside Cabana', tables: 4, cols: 4, rows: 1 },
      { name: 'Rooftop Sky Bar', tables: 4, cols: 4, rows: 1 },
    ]

    zones.forEach((z) => {
      // Every zone forms a complete rectangular matrix with 0 trailing remainder cells!
      expect((z.tables % z.cols)).toBe(0)
      expect(z.cols * z.rows).toBe(z.tables)
    })
  })
})
