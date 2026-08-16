import { StorefrontCustomizationConfig } from '../types/pos'

export const DEFAULT_STOREFRONT_CUSTOMIZATION: StorefrontCustomizationConfig = {
  // 1. Landing Page Studio
  heroHeadline: 'Artisan Coffee Roasters & Fresh Pastry Bar',
  heroTagline: 'Koleksi single origin nusantara terbaik disangrai segar setiap minggu di Senopati. Nikmati pengalaman ngopi kelas dunia di area taman kami.',
  heroBannerUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80',
  announcementBarText: 'Gunakan kupon "SENOPATI20" untuk diskon 20% saat order di meja!',
  announcementBarActive: true,
  ctaOrderText: 'Buka Menu & Pesan di Meja',
  ctaReserveText: 'Reservasi Meja VIP',
  brandStoryText: 'Didirikan pada tahun 2021 di jantung Senopati, Jakarta Selatan, Kopitiam Senopati memadukan tradisi kedai kopi peranakan dengan teknologi pemanggangan specialty modern.',
  operatingHoursText: 'Buka Setiap Hari: 07:00 - 23:00 WIB',
  socialLinks: {
    instagram: '@kopitiam_senopati',
    whatsapp: '+62 812-3456-7890',
    tiktok: '@kopitiamsenopati',
    googleMapsUrl: 'https://maps.google.com/?q=Senopati+Jakarta',
    website: 'https://kopitiamsenopati.id'
  },

  // 2. QR Order Customer Space Studio
  greetingMessage: 'Selamat datang di Kopitiam Senopati! Silakan pilih menu dan nikmati waktu santai Anda.',
  qrBannerUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  qrMenuLayout: 'grid_2col',
  wifiAccessPolicy: 'after_payment',
  enableAllergenBadges: true,
  enableDigitalReceiptSharing: true,
  receiptCustomFooter: 'Terima kasih telah berkunjung! Follow IG @kopitiam_senopati untuk voucher & promo mingguan.'
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
