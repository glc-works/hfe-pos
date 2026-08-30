import { AmenityTagId } from '../types/pos'

export interface StandardAmenityDefinition {
  id: AmenityTagId
  icon: 'wifi' | 'zap' | 'wind' | 'trees' | 'car' | 'sparkles' | 'check' | 'music' | 'calendar'
  labelId: string
  labelEn: string
  category: 'connectivity' | 'comfort' | 'parking' | 'facilities' | 'dietary' | 'services'
}

export const STANDARD_AMENITIES_CATALOG: StandardAmenityDefinition[] = [
  // 1. Connectivity & Power
  {
    id: 'wifi_free',
    icon: 'wifi',
    labelId: 'WiFi Gratis',
    labelEn: 'Free WiFi',
    category: 'connectivity'
  },
  {
    id: 'wifi_high_speed',
    icon: 'wifi',
    labelId: 'WiFi Cepat',
    labelEn: 'Fast WiFi',
    category: 'connectivity'
  },
  {
    id: 'power_outlets',
    icon: 'zap',
    labelId: 'Stopkontak',
    labelEn: 'Power Outlets',
    category: 'connectivity'
  },
  {
    id: 'meeting_room',
    icon: 'sparkles',
    labelId: 'Ruang Meeting',
    labelEn: 'Meeting Room',
    category: 'connectivity'
  },

  // 2. Comfort & Atmosphere
  {
    id: 'ac_indoor',
    icon: 'wind',
    labelId: 'Full AC',
    labelEn: 'Air Conditioned',
    category: 'comfort'
  },
  {
    id: 'outdoor_garden',
    icon: 'trees',
    labelId: 'Outdoor',
    labelEn: 'Outdoor',
    category: 'comfort'
  },
  {
    id: 'dedicated_smoking',
    icon: 'wind',
    labelId: 'Smoking Area',
    labelEn: 'Smoking Area',
    category: 'comfort'
  },
  {
    id: 'non_smoking_only',
    icon: 'wind',
    labelId: 'Non-Smoking',
    labelEn: 'Non-Smoking',
    category: 'comfort'
  },
  {
    id: 'rooftop_view',
    icon: 'sparkles',
    labelId: 'Rooftop',
    labelEn: 'Rooftop',
    category: 'comfort'
  },

  // 3. Parking & Accessibility
  {
    id: 'free_parking',
    icon: 'car',
    labelId: 'Parkir Luas',
    labelEn: 'Free Parking',
    category: 'parking'
  },
  {
    id: 'valet_parking',
    icon: 'car',
    labelId: 'Valet Parking',
    labelEn: 'Valet Parking',
    category: 'parking'
  },
  {
    id: 'ev_charging',
    icon: 'zap',
    labelId: 'Cas EV',
    labelEn: 'EV Charger',
    category: 'parking'
  },
  {
    id: 'wheelchair_access',
    icon: 'check',
    labelId: 'Akses Difabel',
    labelEn: 'Accessible',
    category: 'parking'
  },

  // 4. Sanitation & Facilities
  {
    id: 'prayer_room',
    icon: 'sparkles',
    labelId: 'Musholla',
    labelEn: 'Prayer Room',
    category: 'facilities'
  },
  {
    id: 'clean_restrooms',
    icon: 'sparkles',
    labelId: 'Toilet Bersih',
    labelEn: 'Restrooms',
    category: 'facilities'
  },
  {
    id: 'baby_high_chair',
    icon: 'check',
    labelId: 'Kursi Bayi',
    labelEn: 'High Chairs',
    category: 'facilities'
  },
  {
    id: 'nursing_room',
    icon: 'sparkles',
    labelId: 'Ruang Laktasi',
    labelEn: 'Nursing Room',
    category: 'facilities'
  },
  {
    id: 'pet_friendly',
    icon: 'trees',
    labelId: 'Pet Friendly',
    labelEn: 'Pet Friendly',
    category: 'facilities'
  },

  // 5. Dietary & Entertainment
  {
    id: 'halal_certified',
    icon: 'check',
    labelId: 'Halal MUI',
    labelEn: 'Halal',
    category: 'dietary'
  },
  {
    id: 'vegetarian_friendly',
    icon: 'trees',
    labelId: 'Vegetarian',
    labelEn: 'Vegetarian',
    category: 'dietary'
  },
  {
    id: 'live_music',
    icon: 'music',
    labelId: 'Live Music',
    labelEn: 'Live Music',
    category: 'dietary'
  },

  // 6. Services & Payment
  {
    id: 'cashless_accepted',
    icon: 'check',
    labelId: 'Non-Tunai',
    labelEn: 'Cashless',
    category: 'services'
  },
  {
    id: 'reservations_welcome',
    icon: 'calendar',
    labelId: 'Bisa Reservasi',
    labelEn: 'Reservations',
    category: 'services'
  }
]

export const DEFAULT_MERCHANT_AMENITY_TAGS: AmenityTagId[] = [
  'wifi_high_speed',
  'power_outlets',
  'ac_indoor',
  'outdoor_garden',
  'valet_parking',
  'prayer_room'
]
