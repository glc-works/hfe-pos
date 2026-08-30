import { AmenityTagId } from '../types/pos'

export interface StandardAmenityDefinition {
  id: AmenityTagId
  icon: string
  labelId: string
  labelEn: string
  category: 'connectivity' | 'comfort' | 'parking' | 'facilities' | 'services'
}

export const STANDARD_AMENITIES_CATALOG: StandardAmenityDefinition[] = [
  // 1. Connectivity & Power
  {
    id: 'wifi_high_speed',
    icon: 'wifi',
    labelId: 'WiFi 300 Mbps',
    labelEn: 'High-Speed WiFi (300 Mbps)',
    category: 'connectivity'
  },
  {
    id: 'power_outlets',
    icon: 'zap',
    labelId: 'Stopkontak di Meja',
    labelEn: 'Power Outlets at Tables',
    category: 'connectivity'
  },

  // 2. Comfort & Atmosphere
  {
    id: 'ac_indoor',
    icon: 'wind',
    labelId: 'Ruangan Full AC',
    labelEn: 'Air Conditioned Indoor',
    category: 'comfort'
  },
  {
    id: 'outdoor_garden',
    icon: 'trees',
    labelId: 'Taman & Outdoor',
    labelEn: 'Outdoor Garden & Patio',
    category: 'comfort'
  },
  {
    id: 'dedicated_smoking',
    icon: 'wind',
    labelId: 'Area Merokok Terpisah',
    labelEn: 'Dedicated Smoking Area',
    category: 'comfort'
  },

  // 3. Parking & Accessibility
  {
    id: 'free_parking',
    icon: 'car',
    labelId: 'Parkir Gratis Luas',
    labelEn: 'Spacious Free Parking',
    category: 'parking'
  },
  {
    id: 'valet_parking',
    icon: 'car',
    labelId: 'Layanan Valet',
    labelEn: 'Valet Parking Service',
    category: 'parking'
  },
  {
    id: 'ev_charging',
    icon: 'zap',
    labelId: 'Stasiun Cas Mobil Listrik (EV)',
    labelEn: 'EV Charging Station',
    category: 'parking'
  },
  {
    id: 'wheelchair_access',
    icon: 'check',
    labelId: 'Akses Kursi Roda',
    labelEn: 'Wheelchair Accessible',
    category: 'parking'
  },

  // 4. General Facilities & Family
  {
    id: 'prayer_room',
    icon: 'sparkles',
    labelId: 'Musholla Bersih',
    labelEn: 'Clean Prayer Room (Musholla)',
    category: 'facilities'
  },
  {
    id: 'clean_restrooms',
    icon: 'sparkles',
    labelId: 'Toilet Bersih & Higienis',
    labelEn: 'Hygienic Restrooms',
    category: 'facilities'
  },
  {
    id: 'baby_high_chair',
    icon: 'check',
    labelId: 'Kursi Bayi (High Chair)',
    labelEn: 'Baby High Chairs',
    category: 'facilities'
  },
  {
    id: 'pet_friendly',
    icon: 'trees',
    labelId: 'Ramah Hewan Peliharaan',
    labelEn: 'Pet Friendly Area',
    category: 'facilities'
  },

  // 5. Payment & Services
  {
    id: 'cashless_only',
    icon: 'check',
    labelId: 'Pembayaran Non-Tunai / QRIS',
    labelEn: 'QRIS & Cashless Accepted',
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
