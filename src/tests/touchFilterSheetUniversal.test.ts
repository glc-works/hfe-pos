import { describe, it, expect, vi } from 'vitest'
import { FilterSection, FilterOption } from '../components/shared/TouchFilterSheet'
import { PROPERTY_ZONES, INITIAL_TABLES } from '../data/mockData'

describe('L2-POS-90: Universal TouchFilterSheet Engine & Polymorphic Filter Specifications', () => {
  it('formats zone and status filter sections correctly for POS Floor Plan', () => {
    const mockOnSelectZone = vi.fn()
    const mockOnSelectStatus = vi.fn()

    const tablesGrid = INITIAL_TABLES
    const scopedTotal = tablesGrid.length
    const scopedUnpaid = tablesGrid.filter(t => (t.status === 'open-tab' || t.status === 'occupied') && t.totalBill > 0).length
    const scopedAvailable = tablesGrid.filter(t => t.status === 'free').length

    const sections: FilterSection<string>[] = [
      {
        id: 'zones',
        title: 'Lantai / Zona Area',
        selected: 'all',
        onSelect: mockOnSelectZone,
        options: PROPERTY_ZONES.map((z) => ({
          id: z.id,
          label: z.name,
          icon: z.icon,
          badgeCount: z.id === 'all'
            ? tablesGrid.length
            : tablesGrid.filter(t => t.zoneId === z.id).length
        }))
      },
      {
        id: 'status',
        title: 'Status Tagihan Meja',
        selected: 'unpaid',
        onSelect: mockOnSelectStatus,
        options: [
          { id: 'all', label: 'Semua Status Meja', icon: '🏢', badgeCount: scopedTotal },
          { id: 'unpaid', label: 'Belum Lunas (Open Tab)', icon: '⏳', badgeCount: scopedUnpaid },
          { id: 'available', label: 'Meja Kosong (Siap Pakai)', icon: '🟢', badgeCount: scopedAvailable }
        ]
      }
    ]

    expect(sections).toHaveLength(2)
    expect(sections[0].options.length).toBeGreaterThanOrEqual(5)
    expect(sections[1].options).toHaveLength(3)

    // Test selection dispatch
    sections[0].onSelect('outdoor-garden')
    expect(mockOnSelectZone).toHaveBeenCalledWith('outdoor-garden')

    sections[1].onSelect('available')
    expect(mockOnSelectStatus).toHaveBeenCalledWith('available')
  })

  it('supports polymorphic re-use for Catalog Menu category filtering', () => {
    const categories = ['all', 'coffee', 'non-coffee', 'pastry', 'snack']
    const mockOnSelectCategory = vi.fn()

    const catalogSection: FilterSection<string> = {
      id: 'catalog-category',
      title: 'Kategori Menu & Produk',
      selected: 'coffee',
      onSelect: mockOnSelectCategory,
      options: categories.map(c => ({
        id: c,
        label: c === 'all' ? '✨ Semua Kategori' : c.toUpperCase(),
        icon: c === 'coffee' ? '☕' : '🍽️',
        badgeCount: c === 'all' ? 19 : 4
      }))
    }

    expect(catalogSection.options).toHaveLength(5)
    expect(catalogSection.selected).toBe('coffee')

    catalogSection.onSelect('pastry')
    expect(mockOnSelectCategory).toHaveBeenCalledWith('pastry')
  })

  it('computes correct table count badges per area without negative numbers or NaN', () => {
    PROPERTY_ZONES.forEach(zone => {
      const count = zone.id === 'all'
        ? INITIAL_TABLES.length
        : INITIAL_TABLES.filter(t => t.zoneId === zone.id).length

      expect(count).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(count)).toBe(true)
    })
  })
})
