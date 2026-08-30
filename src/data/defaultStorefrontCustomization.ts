import { StorefrontCustomizationConfig } from '../types/pos'
import { DEFAULT_MERCHANT_AMENITY_TAGS } from './amenityCatalog'

export const DEFAULT_STOREFRONT_CUSTOMIZATION: StorefrontCustomizationConfig = {
  // 1. Landing Page Studio
  heroHeadline: 'Artisan Coffee Roasters & Fresh Pastry Bar',
  heroTagline: 'Koleksi single origin nusantara terbaik disangrai segar setiap minggu di Senopati. Nikmati pengalaman ngopi kelas dunia di area taman kami.',
  heroBannerUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80',
  announcementBarText: 'Gunakan kupon "SENOPATI20" untuk diskon 20% saat order di meja!',
  announcementBarActive: true,
  ctaOrderText: 'Buka Menu & Pesan',
  ctaReserveText: 'Reservasi Meja',
  brandStoryText: 'Didirikan pada tahun 2021 di jantung Senopati, Jakarta Selatan, Kopitiam Senopati memadukan tradisi kedai kopi peranakan dengan teknologi pemanggangan specialty modern.',
  operatingHoursText: 'Buka Setiap Hari: 07:00 - 23:00 WIB',
  socialLinks: {
    instagram: '@kopitiam_senopati',
    whatsapp: '+62 812-3456-7890',
    tiktok: '@kopitiamsenopati',
    googleMapsUrl: 'https://maps.google.com/?q=Senopati+Jakarta',
    website: 'https://kopitiamsenopati.id'
  },
  channels: {
    enableDineInQr: true,
    enableTakeaway: true,
    enableOnlineDelivery: true,
    enableTableReservation: true,
    enableEventTicketing: true,
    isEmergencyBusyMode: false
  },
  facilities: [
    {
      icon: 'trees',
      title: 'Taman & Outdoor',
      desc: 'Area asri & smoking area',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80'
    },
    {
      icon: 'sparkles',
      title: 'Ruang VIP Privat',
      desc: 'Ruang meeting AC 12 pax',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'
    },
    {
      icon: 'coffee',
      title: 'Main Bar & Roastery',
      desc: 'Area slow bar manual brew',
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80'
    },
    {
      icon: 'sparkles',
      title: 'Rooftop Terrace',
      desc: 'Pemandangan kota senja',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80'
    }
  ],
  amenityTags: DEFAULT_MERCHANT_AMENITY_TAGS,
  events: [
    {
      id: 'EVT-JAZZ-01', title: 'Friday Night Live Acoustic Jazz', category: 'music_event',
      date: 'Setiap Jumat', time: '19:30 - 22:00 WIB', location: 'Outdoor Garden & Stage',
      price: 150000, quotaTotal: 40, quotaRemaining: 14,
      bannerUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
      description: 'Penampilan jazz akustik santai, termasuk Welcome Drink Signature Mocktail.',
      includedBenefits: ['Welcome Drink', 'Free Seating Stage View']
    },
    {
      id: 'EVT-WORKSHOP-02', title: 'Barista Cupping & Manual Brew Masterclass', category: 'workshop_class',
      date: 'Sabtu, 29 Agustus', time: '10:00 - 13:00 WIB', location: 'VIP Roastery Room',
      price: 250000, quotaTotal: 12, quotaRemaining: 4, instructorName: 'Head Roaster Dimas',
      bannerUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
      description: 'Workshop seduh V60 & cupping 5 single-origin nusantara + Sertifikat & Biji Kopi 200g.',
      includedBenefits: ['Sertifikat Workshop', 'Beans 200g', 'Cupping Kit']
    },
    {
      id: 'EVT-COMMUNITY-03', title: 'Sunday Morning 5K Coffee & Runners Meetup', category: 'sports_class',
      date: 'Setiap Minggu', time: '06:30 - 09:00 WIB', location: 'Outdoor Patio & Parkir',
      price: 0, quotaTotal: 50, quotaRemaining: 28,
      bannerUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&q=80',
      description: 'Lari pagi 5K santai bersama komunitas runners Senopati. Gratis air mineral & voucher sarapan.',
      includedBenefits: ['Free Mineral Water', '15% Breakfast Voucher']
    }
  ],

  // 2. QR Order Customer Space Studio
  greetingMessage: 'Selamat datang! Silakan pilih menu dan nikmati waktu santai Anda.',
  qrBannerUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  qrMenuLayout: 'grid_2col',
  wifiAccessPolicy: 'after_payment',
  enableAllergenBadges: true,
  enableDigitalReceiptSharing: true,
  receiptCustomFooter: 'Terima kasih telah berkunjung! Simpan e-receipt ini untuk klaim reward member.'
}

export const BANNER_PRESETS = [
  {
    label: '☕ Specialty Coffee & Roastery',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80'
  },
  {
    label: '🥐 Artisan French Bakery',
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80'
  },
  {
    label: '🍵 Japanese Matcha & Tea Bar',
    url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=1200&q=80'
  },
  {
    label: '🍸 Rooftop Sky Bar & Cocktail Lounge',
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80'
  },
  {
    label: '🍽️ Fine Dining & Modern Bistro',
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80'
  }
]

export interface ConceptThemeTemplate {
  id: string
  name: string
  accentColor: string
  mode: 'light' | 'dark'
  desc: string
  bannerUrl: string
  icon: string
}

export const CONCEPT_THEME_TEMPLATES: ConceptThemeTemplate[] = [
  {
    id: 'roastery',
    name: 'Artisan Roastery',
    accentColor: '#f59e0b',
    mode: 'dark',
    desc: 'Nuansa kayu hangat & kopi espresso dark roast',
    bannerUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80',
    icon: '☕'
  },
  {
    id: 'matcha',
    name: 'Matcha & Bakery',
    accentColor: '#10b981',
    mode: 'light',
    desc: 'Estetika zen minimalis & botani teh hijau',
    bannerUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=1200&q=80',
    icon: '🍵'
  },
  {
    id: 'bistro',
    name: 'Modern Bistro & Lounge',
    accentColor: '#8b5cf6',
    mode: 'dark',
    desc: 'Lounge malam, dining elegan & cocktail bar',
    bannerUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80',
    icon: '🍷'
  },
  {
    id: 'brunch',
    name: 'Sunlit Pastry Cafe',
    accentColor: '#f97316',
    mode: 'light',
    desc: 'Sinar pagi, croissant hangat & sourdough bakery',
    bannerUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80',
    icon: '🥐'
  }
]
