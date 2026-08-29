import { describe, it, expect } from 'vitest'
import { ProductFormData, ModifierGroup, MatrixVariant } from '../components/hub/ProductFormModal'
import { AttentionNotificationItem } from '../components/common/UnifiedAttentionCenterPopOver'

describe('2-Tier Attention Center & Product Modifiers Suite (L2-POS-825 Parity)', () => {
  it('validates AttentionNotificationItem 3-tier severity and source categorization', () => {
    const mockAttentionItems: AttentionNotificationItem[] = [
      {
        id: 'notif-01',
        title: '🍳 Meja OUT-04 Siap Diantar',
        subtitle: '2x Espresso Aren Latte siap di pickup bar barista.',
        timestamp: '1m yang lalu',
        severity: 'action_required',
        source: 'kds',
        actionLabel: 'Tandai Selesai'
      },
      {
        id: 'notif-02',
        title: '⚠️ 3 Mutasi QRIS Butuh Pencocokan',
        subtitle: 'Mutasi BCA Merchant perlu Find & Match ke Buku Besar Hfe CORE.',
        timestamp: '5m yang lalu',
        severity: 'action_required',
        source: 'financial',
        actionLabel: 'Buka Rekonsiliasi'
      },
      {
        id: 'notif-04',
        title: '✅ Shift Kasir #12 Berjalan Normal',
        subtitle: 'Kas awal Rp 500.000 tercatat di GL 1101 Kasir.',
        timestamp: '45m yang lalu',
        severity: 'info',
        source: 'core'
      }
    ]

    expect(mockAttentionItems.length).toBe(3)
    const actionRequired = mockAttentionItems.filter((i) => i.severity === 'action_required')
    expect(actionRequired.length).toBe(2)
    expect(actionRequired[0].actionLabel).toBe('Tandai Selesai')
  })

  it('validates F&B modifier groups and retail matrix variants schema in ProductFormData', () => {
    const sampleFnbProduct: ProductFormData = {
      sku: 'BEV-ESPR-01',
      name: 'Espresso Aren Latte',
      category: 'coffee',
      categoryLabel: 'Minuman Kopi',
      price: 28000,
      cogs: 9200,
      marginPercent: 67,
      stockType: 'recipe_bom',
      isActive: true,
      customizationType: 'modifiers_fnb',
      modifierGroups: [
        {
          id: 'mod-sugar',
          name: 'Tingkat Kemanisan (Sugar Level)',
          selectionType: 'single',
          options: [
            { id: 's1', name: 'Normal (100%)', priceDelta: 0 },
            { id: 's2', name: 'Less Sugar (50%)', priceDelta: 0 },
            { id: 's3', name: 'No Sugar (0%)', priceDelta: 0 }
          ]
        },
        {
          id: 'mod-addons',
          name: 'Tambahan & Topping (Add-ons)',
          selectionType: 'multiple',
          options: [
            { id: 'a1', name: 'Extra Espresso Shot', priceDelta: 6000, bomDelta: '+9g Biji Kopi' },
            { id: 'a2', name: 'Ganti Oat Milk', priceDelta: 8000, bomDelta: 'Susu Oat 150ml' }
          ]
        }
      ]
    }

    expect(sampleFnbProduct.customizationType).toBe('modifiers_fnb')
    expect(sampleFnbProduct.modifierGroups?.length).toBe(2)
    expect(sampleFnbProduct.modifierGroups?.[0].options.length).toBe(3)
    expect(sampleFnbProduct.modifierGroups?.[1].options[0].priceDelta).toBe(6000)

    const sampleRetailProduct: ProductFormData = {
      sku: 'MER-TSHIRT-01',
      name: 'Official T-Shirt Kopi Nusantara',
      category: 'merchandise',
      categoryLabel: 'Merchandise Retail',
      price: 149000,
      cogs: 65000,
      marginPercent: 56,
      stockType: 'unit_inventory',
      isActive: true,
      customizationType: 'matrix_retail',
      matrixVariants: [
        { sku: 'MER-TSHIRT-BLK-S', name: 'Hitam - S', price: 149000, stock: 12 },
        { sku: 'MER-TSHIRT-BLK-M', name: 'Hitam - M', price: 149000, stock: 24 }
      ]
    }

    expect(sampleRetailProduct.customizationType).toBe('matrix_retail')
    expect(sampleRetailProduct.matrixVariants?.length).toBe(2)
    expect(sampleRetailProduct.matrixVariants?.[0].sku).toBe('MER-TSHIRT-BLK-S')
  })
})
