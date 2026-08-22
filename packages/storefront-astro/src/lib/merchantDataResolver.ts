// --- MERCHANT DATA RESOLVER (SSOT RESOLUTION ENGINE) ---
// Resolves authoritative company book, catalog, and active promos for BOARD.Hfeit

export interface ResolvedMerchantProfile {
  bookId: string
  slug: string
  businessName: string
  legalName: string
  tagline: string
  storyDescription: string
  heroCoverUrl: string
  rating: number
  reviewCount: number
  primaryCurrency: string
  address: string
  city: string
  operatingHours: string
  isOpenNow: boolean
  wifiSsid: string
  wifiPassword?: string
  wifiAccessPolicy: 'always_visible' | 'after_payment' | 'disabled'
  facilities: string[]
  socialLinks: {
    instagram?: string
    whatsapp?: string
    tiktok?: string
    googleMapsUrl?: string
    website?: string
  }
}

export interface StorefrontMenuItem {
  id: string
  name: string
  category: string
  price: number
  formattedPrice: string
  image: string
  description: string
  isFeatured?: boolean
  allergens?: string[]
  isEventTicket?: boolean
  eventDetails?: {
    eventDate: string
    durationMinutes: number
    instructorName: string
    venueArea: string
    remainingSeats: number
  }
}

export interface StorefrontPromo {
  id: string
  code: string
  title: string
  description: string
  discountAmountText: string
  minOrderValueText?: string
  expiresAt?: string
}

export interface ResolvedStorefrontData {
  profile: ResolvedMerchantProfile
  catalog: StorefrontMenuItem[]
  events: StorefrontMenuItem[]
  promos: StorefrontPromo[]
  channels: {
    enableDineInQr: boolean
    enableTakeaway: boolean
    enableOnlineDelivery: boolean
    enableTableReservation: boolean
    enableEventTicketing: boolean
    isEmergencyBusyMode: boolean
  }
}

export function formatCurrencyIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export async function resolveStorefrontData(slug: string): Promise<ResolvedStorefrontData> {
  const normalizedSlug = slug ? slug.toLowerCase().trim() : 'senopati-kopitiam'

  // Standard Authoritative Merchant Blueprint (Auto-Inherited from Core Company Profile)
  const profile: ResolvedMerchantProfile = {
    bookId: 'cbook-senopati-001',
    slug: normalizedSlug,
    businessName: 'Kopitiam Senopati HQ',
    legalName: 'PT Kopitiam Senopati Nusantara',
    tagline: 'Artisan Coffee Roasters & Fresh Pastry Bar',
    storyDescription:
      'Didirikan pada tahun 2021 di jantung Senopati, Jakarta Selatan, Kopitiam Senopati memadukan tradisi kedai kopi nusantara dengan teknologi pemanggangan specialty modern.',
    heroCoverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80',
    rating: 4.9,
    reviewCount: 1420,
    primaryCurrency: 'IDR',
    address: 'Jl. Senopati No. 45, Kebayoran Baru',
    city: 'Jakarta Selatan',
    operatingHours: 'Setiap Hari: 07:00 - 23:00 WIB',
    isOpenNow: true,
    wifiSsid: 'Kopitiam_Senopati_Guest',
    wifiPassword: 'kopiuenak2026',
    wifiAccessPolicy: 'after_payment',
    facilities: ['📶 WiFi 100Mbps', '❄️ AC Dingin', '🌿 Outdoor Garden', '⚡ Colokan Laptop', '🅿️ Parkir Valet'],
    socialLinks: {
      instagram: '@kopitiam_senopati',
      whatsapp: '+62 812-3456-7890',
      tiktok: '@kopitiamsenopati',
      googleMapsUrl: 'https://maps.google.com/?q=Senopati+Jakarta',
      website: 'https://kopitiamsenopati.id',
    },
  }

  const catalog: StorefrontMenuItem[] = [
    {
      id: 'MN-001',
      name: 'Espresso Aren Latte',
      category: 'Coffee',
      price: 28000,
      formattedPrice: formatCurrencyIDR(28000),
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
      description: 'Double shot espresso blend nusantara dengan susu segar dan gula aren murni organik.',
      isFeatured: true,
      allergens: ['Dairy'],
    },
    {
      id: 'MN-002',
      name: 'Japanese Iced Drip',
      category: 'Coffee',
      price: 32000,
      formattedPrice: formatCurrencyIDR(32000),
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80',
      description: 'Single origin Flores Bajawa diseduh manual dengan metode V60 langsung di atas es batu.',
      isFeatured: true,
      allergens: [],
    },
    {
      id: 'MN-003',
      name: 'Uji Matcha Ceremonial Latte',
      category: 'Non-Coffee',
      price: 35000,
      formattedPrice: formatCurrencyIDR(35000),
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80',
      description: 'Matcha ceremonial grade asli Kyoto dipadukan dengan creamy oat milk pilihan.',
      isFeatured: false,
      allergens: ['Oat'],
    },
    {
      id: 'MN-004',
      name: 'Croissant Butter Artisan',
      category: 'Pastry',
      price: 22000,
      formattedPrice: formatCurrencyIDR(22000),
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
      description: 'Pastry Prancis renyah berlapis dengan French Normandy butter segar dari oven.',
      isFeatured: true,
      allergens: ['Gluten', 'Dairy'],
    },
  ]

  // First-Class Event Tickets as Product Primitive (category === 'event_ticket')
  const events: StorefrontMenuItem[] = [
    {
      id: 'EVT-001',
      name: 'Barista Cupping & Sensory Masterclass',
      category: 'event_ticket',
      price: 150000,
      formattedPrice: formatCurrencyIDR(150000),
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
      description: 'Eksplorasi rasa 6 origin kopi terbaik nusantara bersama Q-Grader bersertifikasi SCA.',
      isEventTicket: true,
      eventDetails: {
        eventDate: 'Sabtu, 29 Agustus 2026 • 15:00 - 17:00 WIB',
        durationMinutes: 120,
        instructorName: 'Bpk. Hendra (Q-Grader SCA)',
        venueArea: 'VIP Cupping Room Senopati HQ',
        remainingSeats: 4,
      },
    },
  ]

  const promos: StorefrontPromo[] = [
    {
      id: 'PRM-001',
      code: 'MEMBERBARU15',
      title: 'Diskon Rp 15.000 Member Baru',
      description: 'Hemat Rp 15.000 untuk pesanan pertama saat order di meja atau online delivery.',
      discountAmountText: 'Rp 15.000',
      minOrderValueText: 'Min. Belanja Rp 50.000',
    },
    {
      id: 'PRM-002',
      code: 'HAPPYHOUR',
      title: 'Happy Hour Kopi Sore (14:00 - 17:00)',
      description: 'Beli 1 Espresso Aren Latte Gratis 1 Pastry Pilihan setiap hari kerja.',
      discountAmountText: 'Beli 1 Gratis 1',
    },
  ]

  return {
    profile,
    catalog,
    events,
    promos,
    channels: {
      enableDineInQr: true,
      enableTakeaway: true,
      enableOnlineDelivery: true,
      enableTableReservation: true,
      enableEventTicketing: true,
      isEmergencyBusyMode: false,
    },
  }
}
