// --- SCHEMA.ORG KNOWLEDGE GRAPH JSON-LD GENERATOR ---
import { StorefrontCustomizationConfig, MenuItem } from '../types/pos'
import { StorefrontInfo } from './llmsTxtGenerator'

/**
 * Generates Schema.org JSON-LD Knowledge Graph for CafeOrCoffeeShop and FAQPage.
 */
export function generateStorefrontSchemaJsonLd(
  config: Partial<StorefrontCustomizationConfig>,
  catalog: MenuItem[],
  info: StorefrontInfo
): object {
  const storeName = info.storeName || config.storeName || 'Hfe Merchant Store'
  const primaryUrl = config.storefrontCustomDomain 
    ? `https://${config.storefrontCustomDomain}`
    : `https://${config.storefrontSubdomain || 'store'}.hfeit.com`

  const menuItems = catalog.slice(0, 10).map(item => ({
    '@type': 'MenuItem',
    name: item.name,
    description: item.description || item.name,
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: config.currency || 'IDR',
      availability: 'https://schema.org/InStock',
    },
    menuAddOn: item.variants?.map((v: { name: string; options: { name: string; priceDelta?: number }[] }) => ({
      '@type': 'MenuSection',
      name: v.name,
      hasMenuItem: v.options.map((opt: { name: string; priceDelta?: number }) => ({
        '@type': 'MenuItem',
        name: opt.name,
        offers: {
          '@type': 'Offer',
          price: opt.priceDelta || 0,
          priceCurrency: config.currency || 'IDR',
        }
      }))
    }))
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CafeOrCoffeeShop',
        '@id': `${primaryUrl}/#business`,
        name: storeName,
        image: config.storefrontHeroImage || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80',
        url: primaryUrl,
        telephone: info.phone,
        email: info.email,
        priceRange: '$$',
        servesCuisine: ['Specialty Coffee', 'Indonesian Fusion', 'Artisan Bakery'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: info.address,
          addressLocality: info.city,
          addressCountry: info.country,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '07:00',
            closes: '22:00',
          },
        ],
        hasMenu: {
          '@type': 'Menu',
          name: `${storeName} Digital Menu`,
          hasMenuItem: menuItems,
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'High Speed WiFi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Power Outlets', value: info.powerOutletsAvailable },
          { '@type': 'LocationFeatureSpecification', name: 'Outdoor Seating', value: info.smokingArea },
          { '@type': 'LocationFeatureSpecification', name: 'QRIS & Card Payment', value: true },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${primaryUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `Apakah ${storeName} menyediakan colokan listrik dan WiFi untuk kerja (WFH/WFC)?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Ya, ${storeName} menyediakan colokan listrik di setiap meja dan koneksi WiFi cepat untuk kenyamanan bekerja atau belajar.`
            }
          },
          {
            '@type': 'Question',
            name: `Metode pembayaran apa saja yang diterima di ${storeName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Kami menerima pembayaran QRIS (BCA, GoPay, OVO, Dana, ShopeePay), Kartu Debit/Kredit (Visa/Mastercard/JCB), dan Tunai (Cash IDR).`
            }
          },
          {
            '@type': 'Question',
            name: `Apakah ${storeName} halal?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: info.halalCertified 
                ? `${storeName} menggunakan 100% bahan baku halal bersertifikat.`
                : `${storeName} menyajikan makanan tanpa daging babi (pork-free) dan menggunakan bahan baku berkualitas tinggi.`
            }
          }
        ]
      }
    ]
  }
}
