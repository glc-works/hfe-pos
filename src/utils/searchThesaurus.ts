/**
 * Smart Semantic Search & Multilingual Thesaurus Engine.
 * Tier 1: Pure Algorithm & Taxonomy Dictionary (Zero Context Dependencies).
 * Enables natural bilingual searching (e.g. 'kopi' -> 'Coffee', 'roti' -> 'Pastry', 'kentang' -> 'Snack').
 */

import { MenuItem } from '../types/pos'

export interface CategoryThesaurusMapping {
  category: string
  synonyms: string[]
}

export const CATEGORY_THESAURUS: CategoryThesaurusMapping[] = [
  {
    category: 'Coffee',
    synonyms: [
      'kopi', 'coffee', 'coffe', 'caffe', 'kafe', 'espresso', 'latte', 'cold brew',
      'americano', 'macchiato', 'piccolo', 'cappuccino', 'flat white', 'aren', 'v60',
      'manual brew', 'arabica', 'robusta', 'caffeine', 'kafein', 'long black'
    ]
  },
  {
    category: 'Non-Coffee',
    synonyms: [
      'non-coffee', 'non coffee', 'teh', 'tea', 'matcha', 'hojicha',
      'coklat', 'cokelat', 'chocolate', 'taro', 'red velvet', 'susu', 'milk', 'oat milk',
      'artisan tea', 'earl grey', 'sencha', 'chamomile'
    ]
  },
  {
    category: 'Pastry',
    synonyms: [
      'pastry', 'pastries', 'roti', 'kue', 'bakery', 'croissant', 'pain au chocolat',
      'kouign-amann', 'kouign', 'danish', 'cinnamon roll', 'muffin', 'bagel', 'sourdough',
      'bread', 'toast'
    ]
  },
  {
    category: 'Snack',
    synonyms: [
      'snack', 'snacks', 'snaks', 'cemilan', 'camilan', 'makanan ringan', 'kentang',
      'fries', 'truffle fries', 'french fries', 'gorengan', 'finger food', 'chips',
      'bites', 'platters', 'wings'
    ]
  },
  {
    category: 'Main Course',
    synonyms: [
      'main course', 'main', 'makan', 'makanan', 'makanan berat', 'nasi', 'rice',
      'pasta', 'spaghetti', 'burger', 'sandwich', 'steak', 'mie', 'noodles', 'lunch',
      'dinner', 'meal'
    ]
  },
  {
    category: 'Dessert',
    synonyms: [
      'dessert', 'desserts', 'penutup', 'manis', 'sweet', 'cake', 'cheesecake',
      'tiramisu', 'pudding', 'ice cream', 'gelato', 'waffle', 'pancake'
    ]
  },
  {
    category: 'Retail',
    synonyms: [
      'retail', 'ritel', 'merchandise', 'beans', 'biji kopi', 'whole bean', 'tumbler',
      'filter', 'dripper', 'kaos', 'totebag', 'souvenir'
    ]
  },
  {
    category: 'Mocktails',
    synonyms: [
      'mocktail', 'mocktails', 'segar', 'soda', 'sparkling', 'mojito', 'citrus',
      'berry', 'fizz', 'cooler', 'refreshing'
    ]
  }
]

/**
 * Checks whether a search query semantically matches a given category through the thesaurus.
 */
export function matchesCategoryThesaurus(category: string, query: string): boolean {
  const cleanQuery = query.toLowerCase().trim()
  if (!cleanQuery) return true

  const mapping = CATEGORY_THESAURUS.find(
    m => m.category.toLowerCase() === category.toLowerCase()
  )
  if (!mapping) {
    return category.toLowerCase().includes(cleanQuery)
  }

  return (
    mapping.category.toLowerCase() === cleanQuery ||
    mapping.synonyms.some(
      syn =>
        syn === cleanQuery ||
        (cleanQuery.length >= 3 && syn.startsWith(cleanQuery)) ||
        (syn.length >= 4 && cleanQuery.startsWith(syn))
    )
  )
}

/**
 * Smart Search Filter: Evaluates products against search query and category with semantic synonym expansion.
 */
export function smartSearchFilter(
  items: MenuItem[],
  query: string,
  selectedCategory: string = 'all'
): MenuItem[] {
  const cleanQuery = query.toLowerCase().trim()

  return items.filter(item => {
    // 1. Category Filter Check
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory
    if (!matchCategory) return false

    // If query is empty, return all category-matched items
    if (!cleanQuery) return true

    // 2. Direct String Match (Name, Code, Description)
    const matchName = item.name.toLowerCase().includes(cleanQuery)
    const matchCode = (item.hfeCategoryCode || '').toLowerCase().includes(cleanQuery)
    const matchId = (item.id || '').toLowerCase().includes(cleanQuery)
    const matchDesc = (item.description || '').toLowerCase().includes(cleanQuery)

    if (matchName || matchCode || matchId || matchDesc) {
      return true
    }

    // 3. Semantic Category Thesaurus Match
    // If the search term is a synonym for this item's category (e.g. searching 'kopi' when category is 'Coffee')
    if (matchesCategoryThesaurus(item.category, cleanQuery)) {
      return true
    }

    return false
  })
}

/**
 * Returns smart suggestion when a search query yields zero direct matches.
 * e.g., if user searches "kopi" while "Pastry" category is selected, or if user types a category synonym.
 */
export function getSmartSearchSuggestion(
  query: string,
  availableCategories: string[]
): { suggestedCategory?: string; reason?: string } | null {
  const cleanQuery = query.toLowerCase().trim()
  if (!cleanQuery) return null

  for (const mapping of CATEGORY_THESAURUS) {
    if (
      mapping.synonyms.some(
        s =>
          s === cleanQuery ||
          (cleanQuery.length >= 3 && s.startsWith(cleanQuery)) ||
          (s.length >= 4 && cleanQuery.startsWith(s))
      )
    ) {
      const matchedCategory = availableCategories.find(
        c => c.toLowerCase() === mapping.category.toLowerCase()
      )
      if (matchedCategory) {
        return {
          suggestedCategory: matchedCategory,
          reason: `Menu dengan kata kunci "${query}" tersedia di kategori ${matchedCategory}`
        }
      }
    }
  }

  return null
}
