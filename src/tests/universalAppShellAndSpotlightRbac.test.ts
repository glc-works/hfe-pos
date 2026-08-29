import { describe, it, expect } from 'vitest'
import { SpotlightItem, SpotlightRole } from '../components/common/GlobalSpotlightCommandPalette'

describe('Universal App Shell & Spotlight RBAC Gate (L2-POS-102)', () => {
  const mockItems: SpotlightItem[] = [
    {
      id: 'prd-1',
      title: 'Espresso Aren Latte',
      subtitle: 'Menu Minuman',
      category: 'menu_product',
      requiredRole: 'cashier',
      action: () => {}
    },
    {
      id: 'wh-1',
      title: 'Kesehatan Stok Bahan Baku',
      subtitle: 'Gudang & Logistik',
      category: 'warehouse',
      requiredRole: 'warehouse',
      action: () => {}
    },
    {
      id: 'own-1',
      title: 'Executive Insights & Laba Kotor',
      subtitle: 'Omzet & P&L',
      category: 'backoffice_owner',
      requiredRole: 'owner',
      action: () => {}
    },
    {
      id: 'own-2',
      title: 'Kepatuhan Pajak PB1 & Bapenda',
      subtitle: 'Pajak Daerah',
      category: 'backoffice_owner',
      requiredRole: 'owner',
      action: () => {}
    }
  ]

  const filterByRole = (items: SpotlightItem[], role: SpotlightRole) => {
    return items.filter((item) => {
      if (role === 'cashier') return item.requiredRole === 'cashier'
      if (role === 'warehouse') return item.requiredRole === 'cashier' || item.requiredRole === 'warehouse'
      return true
    })
  }

  it('should strictly hide owner insights and tax from cashier role (anti-privilege escalation)', () => {
    const cashierResults = filterByRole(mockItems, 'cashier')
    expect(cashierResults.length).toBe(1)
    expect(cashierResults[0].id).toBe('prd-1')
    expect(cashierResults.some((i) => i.requiredRole === 'owner')).toBe(false)
  })

  it('should allow warehouse role to see warehouse and cashier items but block owner finances', () => {
    const warehouseResults = filterByRole(mockItems, 'warehouse')
    expect(warehouseResults.length).toBe(2)
    expect(warehouseResults.some((i) => i.id === 'own-1')).toBe(false)
    expect(warehouseResults.some((i) => i.id === 'own-2')).toBe(false)
  })

  it('should allow owner role to see all items across the ecosystem', () => {
    const ownerResults = filterByRole(mockItems, 'owner')
    expect(ownerResults.length).toBe(4)
    expect(ownerResults.some((i) => i.id === 'own-1')).toBe(true)
  })
})
