import { describe, it, expect } from 'vitest'
import { DEFAULT_STOREFRONT_CUSTOMIZATION } from '../data/defaultStorefrontCustomization'
import { MenuDisplayPolicy, MenuItem } from '../types/pos'

describe('Merchant Menu Privacy & Secret Recipe Policy Guard (POS-ENG-STD-001)', () => {
  it('should enforce default secret recipe protection (showPublicIngredients: false)', () => {
    const policy = DEFAULT_STOREFRONT_CUSTOMIZATION.menuDisplayPolicy
    expect(policy).toBeDefined()
    expect(policy?.showPublicIngredients).toBe(false)
    expect(policy?.showCuratedStory).toBe(true)
    expect(policy?.showTastingNotes).toBe(true)
    expect(policy?.showDietaryBadges).toBe(true)
    expect(policy?.showOriginInfo).toBe(true)
  })

  it('should correctly evaluate what fields are visible based on merchant display policy', () => {
    const sampleProduct: MenuItem = {
      id: 'MN-SECRET-01',
      hfeCategoryCode: 'CAT-COF',
      name: 'Signature House Blend Espresso',
      price: 35000,
      description: 'Signature espresso blend',
      category: 'Coffee',
      image: '☕',
      badge: 'signature',
      badgeStory: 'Rahasia sangrai 3 varietas arabica pilihan juara dunia.',
      tastingNotes: ['Dark Chocolate', 'Molasses', 'Caramel'],
      originInfo: 'Gunung Tilu & Ijen Estate',
      bomIngredients: [
        { itemCode: 'RAW-001', name: 'Arabica Gayo 50%', amount: '10g' },
        { itemCode: 'RAW-002', name: 'Arabica Ijen 30%', amount: '6g' },
        { itemCode: 'RAW-003', name: 'Robusta Java 20%', amount: '4g' }
      ],
      dietaryTags: ['vegan', 'halal']
    }

    const resolveProductVisibility = (item: MenuItem, policy: MenuDisplayPolicy) => ({
      shouldRenderStory: Boolean(policy.showCuratedStory !== false && item.badgeStory),
      shouldRenderTastingNotes: Boolean(policy.showTastingNotes !== false && item.tastingNotes?.length),
      shouldRenderOrigin: Boolean(policy.showOriginInfo !== false && item.originInfo),
      shouldRenderBoM: Boolean(policy.showPublicIngredients === true && item.bomIngredients?.length),
      shouldRenderDietary: Boolean(policy.showDietaryBadges !== false && item.dietaryTags?.length)
    })

    // 1. Default policy (Secret Recipe Hidden)
    const defaultView = resolveProductVisibility(sampleProduct, DEFAULT_STOREFRONT_CUSTOMIZATION.menuDisplayPolicy!)
    expect(defaultView.shouldRenderBoM).toBe(false) // Secret recipe is PROTECTED!
    expect(defaultView.shouldRenderStory).toBe(true)
    expect(defaultView.shouldRenderTastingNotes).toBe(true)
    expect(defaultView.shouldRenderDietary).toBe(true)

    // 2. Artisanal Open-Transparency policy (Merchant explicitly enables public ingredients)
    const openPolicy: MenuDisplayPolicy = {
      showPublicIngredients: true,
      showCuratedStory: true,
      showTastingNotes: true,
      showDietaryBadges: true,
      showOriginInfo: true
    }
    const openView = resolveProductVisibility(sampleProduct, openPolicy)
    expect(openView.shouldRenderBoM).toBe(true)

    // 3. Minimalist Quick-Service policy (Story & Notes turned off)
    const minimalistPolicy: MenuDisplayPolicy = {
      showPublicIngredients: false,
      showCuratedStory: false,
      showTastingNotes: false,
      showDietaryBadges: true,
      showOriginInfo: false
    }
    const minimalistView = resolveProductVisibility(sampleProduct, minimalistPolicy)
    expect(minimalistView.shouldRenderBoM).toBe(false)
    expect(minimalistView.shouldRenderStory).toBe(false)
    expect(minimalistView.shouldRenderTastingNotes).toBe(false)
    expect(minimalistView.shouldRenderOrigin).toBe(false)
    expect(minimalistView.shouldRenderDietary).toBe(true)
  })
})
