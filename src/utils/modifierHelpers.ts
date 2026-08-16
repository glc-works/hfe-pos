import { MenuItem, CategoryEtalaseConfig } from '../types/pos'

export const DEFAULT_CATEGORY_CONFIGS: Record<string, CategoryEtalaseConfig> = {
  'Coffee': { 
    id: 'Coffee', 
    name: 'Coffee', 
    icon: '☕', 
    enableModifiersDefault: true, 
    allowCustomNotesDefault: true 
  },
  'Non-Coffee': { 
    id: 'Non-Coffee', 
    name: 'Non-Coffee', 
    icon: '🍵', 
    enableModifiersDefault: true, 
    allowCustomNotesDefault: true 
  },
  'Pastry': { 
    id: 'Pastry', 
    name: 'Pastry & Bakery', 
    icon: '🥐', 
    enableModifiersDefault: false, 
    allowCustomNotesDefault: false 
  },
  'Snack': { 
    id: 'Snack', 
    name: 'Snack & Finger Food', 
    icon: '🍟', 
    enableModifiersDefault: false, 
    allowCustomNotesDefault: false 
  }
}

/**
 * General Resolver: Evaluates whether a menu item should trigger the modifier modal or 1-tap direct add.
 * Resolution Hierarchy:
 * 1. Item-level explicit modifierPolicy ('always' vs 'never')
 * 2. Item-level explicit hasModifiers flag (true vs false)
 * 3. Category / Etalase-level default configuration (enableModifiersDefault)
 */
export function shouldOpenItemModifierModal(
  item: MenuItem, 
  customCategoryConfigs?: Record<string, CategoryEtalaseConfig>
): boolean {
  if (item.modifierPolicy === 'always') return true
  if (item.modifierPolicy === 'never') return false
  if (typeof item.hasModifiers === 'boolean') return item.hasModifiers

  // Check Category / Etalase level policy
  const categoryConfig = (customCategoryConfigs || DEFAULT_CATEGORY_CONFIGS)[item.category]
  if (categoryConfig) {
    return categoryConfig.enableModifiersDefault
  }

  // Safe default: beverages enable modifiers, solid foods 1-tap direct add
  const beverageCategories = ['Coffee', 'Non-Coffee', 'Minuman', 'Beverages', 'Tea']
  return beverageCategories.includes(item.category)
}

/**
 * General Resolver: Evaluates whether free-text notes should be allowed for this item or kitchen station.
 * Resolution Hierarchy:
 * 1. Item-level explicit allowCustomNotes flag
 * 2. Category / Etalase-level default configuration (allowCustomNotesDefault)
 * 3. Fallback: only allow notes if the item requires custom modifiers
 */
export function shouldAllowItemCustomNotes(
  item: MenuItem,
  customCategoryConfigs?: Record<string, CategoryEtalaseConfig>
): boolean {
  if (typeof item.allowCustomNotes === 'boolean') return item.allowCustomNotes

  const categoryConfig = (customCategoryConfigs || DEFAULT_CATEGORY_CONFIGS)[item.category]
  if (categoryConfig) {
    return categoryConfig.allowCustomNotesDefault
  }

  return shouldOpenItemModifierModal(item, customCategoryConfigs)
}
