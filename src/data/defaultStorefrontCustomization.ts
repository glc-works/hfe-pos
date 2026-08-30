import { StorefrontCustomizationConfig } from '../types/pos'

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
    { icon: 'trees', title: 'Outdoor Garden', desc: 'Area outdoor asri & smoking area' },
    { icon: 'sparkles', title: 'VIP AC Room', desc: 'Ruang privat meeting 12 pax' },
    { icon: 'wifi', title: 'WiFi 300 Mbps', desc: 'Koneksi cepat & colokan di tiap meja' },
    { icon: 'car', title: 'Free Valet Parking', desc: 'Parkir luas & EV charging' }
  ],
  events: [
    {
      id: 'EVT-JAZZ-01', title: 'Friday Night Live Acoustic Jazz', category: 'music_event',
      date: 'Setiap Jumat', time: '19:30 - 22:00 WIB', location: 'Outdoor Garden & Stage',
      price: 150000, quotaTotal: 40, quotaRemaining: 14,
      description: 'Penampilan jazz akustik santai, termasuk Welcome Drink Signature Mocktail.',
      includedBenefits: ['Welcome Drink', 'Free Seating Stage View']
    },
    {
      id: 'EVT-WORKSHOP-02', title: 'Barista Cupping & Manual Brew Masterclass', category: 'workshop_class',
      date: 'Sabtu, 29 Agustus', time: '10:00 - 13:00 WIB', location: 'VIP Roastery Room',
      price: 250000, quotaTotal: 12, quotaRemaining: 4, instructorName: 'Head Roaster Dimas',
      description: 'Workshop seduh V60 & cupping 5 single-origin nusantara + Sertifikat & Biji Kopi 200g.',
      includedBenefits: ['Sertifikat Workshop', 'Beans 200g', 'Cupping Kit']
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
