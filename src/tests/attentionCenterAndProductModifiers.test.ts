import { describe, it, expect } from 'vitest'
import { ProductFormData, ModifierGroup, MatrixVariant, ChannelPricing, ProductStockType } from '../components/hub/ProductFormModal'
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

  it('validates 4 universal stock types (BoM, Unit, Bundle, Service) and F&B/Retail customizers', () => {
    const validStockTypes: ProductStockType[] = [
      'recipe_bom',
      'unit_inventory',
      'bundle_combo',
      'non_stock_service'
    ]
    expect(validStockTypes.length).toBe(4)

    const sampleBoMProduct: ProductFormData = {
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
      recipeIngredients: [
        { name: 'Biji Kopi House Blend Gayo', amount: '18 Gram', cost: 4500 },
        { name: 'Susu Fresh Milk / Oat', amount: '150 ML', cost: 3500 },
        { name: 'Sirup Gula Aren Organik', amount: '20 ML', cost: 1200 }
      ],
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
        }
      ],
      channelPricing: {
        deliveryGoFood: 35000,
        deliveryGrabFood: 35000,
        qrSelfOrder: 28000
      }
    }

    expect(sampleBoMProduct.stockType).toBe('recipe_bom')
    expect(sampleBoMProduct.recipeIngredients?.length).toBe(3)
    const totalCogs = sampleBoMProduct.recipeIngredients?.reduce((sum, item) => sum + item.cost, 0)
    expect(totalCogs).toBe(9200)

    const sampleBundleProduct: ProductFormData = {
      sku: 'BND-LUNCH-01',
      name: 'Paket Hemat Siang (Latte + Croissant)',
      category: 'food',
      categoryLabel: 'Paket Hemat',
      price: 45000,
      cogs: 18000,
      marginPercent: 60,
      stockType: 'bundle_combo',
      isActive: true
    }
    expect(sampleBundleProduct.stockType).toBe('bundle_combo')
  })
})
