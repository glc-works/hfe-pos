import { Voucher } from '../types/pos'

export const DEFAULT_AVAILABLE_VOUCHERS: Voucher[] = [
  {
    code: 'BCA15K',
    title: 'Diskon Debit/Kredit BCA Rp 15.000',
    description: 'Min. belanja Rp 50.000 dengan kartu BCA di EDC resto',
    discountAmount: 15000,
    discountType: 'flat',
    minSpend: 50000,
    isStackable: true,
    issuerOrigin: 'platform',
    contactId: 'contact-bca',
    sponsorType: 'bank',
    sponsorName: 'Bank BCA',
    sponsorIcon: '💳',
    sponsorBrandColor: '#005baa',
    expiryDate: '31 Des 2026',
    quantity: 1,
    isActive: true,
    termsAndConditions: [
      'Berlaku khusus untuk transaksi menggunakan Kartu Debit / Kredit BCA.',
      'Minimum transaksi Rp 50.000 sebelum PB1 dan service fee.',
      'Dapat digabungkan dengan promo merchant dan cashback loyalitas.',
      'Berlaku di seluruh outlet resmi Kopitiam Senopati & Roastery.'
    ]
  },
  {
    code: 'BNI25K',
    title: 'Diskon Spesial Kartu BNI Rp 25.000',
    description: 'Potongan Rp 25.000 untuk QRIS BNI / Kartu BNI min. Rp 75.000',
    discountAmount: 25000,
    discountType: 'flat',
    minSpend: 75000,
    isStackable: true,
    issuerOrigin: 'platform',
    contactId: 'contact-bni',
    sponsorType: 'bank',
    sponsorName: 'Bank BNI',
    sponsorIcon: '🏦',
    sponsorBrandColor: '#f15a24',
    expiryDate: '31 Des 2026',
    quantity: 1,
    isActive: true,
    termsAndConditions: [
      'Berlaku untuk pembayaran QRIS wondr by BNI atau Kartu Kredit/Debit BNI.',
      'Minimum transaksi Rp 75.000.',
      'Kuota terbatas per hari sesuai ketentuan BNI promo program.'
    ]
  },
  {
    code: 'BRI20K',
    title: 'Promo BRImo & Kartu BRI Rp 20.000',
    description: 'Potongan Rp 20.000 min. order Rp 60.000 dengan BRI',
    discountAmount: 20000,
    discountType: 'flat',
    minSpend: 60000,
    isStackable: true,
    issuerOrigin: 'platform',
    contactId: 'contact-bri',
    sponsorType: 'bank',
    sponsorName: 'Bank BRI',
    sponsorIcon: '🏛️',
    sponsorBrandColor: '#00529c',
    expiryDate: '31 Des 2026',
    quantity: 1,
    isActive: true,
    termsAndConditions: [
      'Berlaku untuk pembayaran melalui BRImo QRIS atau Kartu Debit BRI.',
      'Min. transaksi Rp 60.000.',
      'Berlaku setiap hari selama masa periode program promo.'
    ]
  },
  {
    code: 'KOPIHEBAT',
    title: 'Voucher Kopitiam Loyalty Rp 10.000',
    description: 'Potongan Rp 10.000 untuk varian Kopi & Manual Brew',
    discountAmount: 10000,
    discountType: 'flat',
    minSpend: 30000,
    isStackable: true,
    issuerOrigin: 'merchant',
    contactId: 'contact-merchant',
    sponsorType: 'merchant',
    sponsorName: 'Kopitiam Official',
    sponsorIcon: '☕',
    sponsorBrandColor: '#d97706',
    expiryDate: '31 Des 2026',
    quantity: 3,
    isActive: true,
    termsAndConditions: [
      'Voucher resmi diterbitkan oleh Kopitiam Senopati & Roastery HQ.',
      'Min. transaksi Rp 30.000 untuk seluruh kategori minuman kopi.',
      'Dapat digabungkan dengan promo bank sponsor.'
    ]
  },
  {
    code: 'GRABFOOD20',
    title: 'Partner Promo GrabFood Rp 20.000',
    description: 'Diskon merchant partner min. order Rp 60.000',
    discountAmount: 20000,
    discountType: 'flat',
    minSpend: 60000,
    isStackable: false,
    issuerOrigin: 'platform',
    contactId: 'contact-grab',
    sponsorType: 'partner',
    sponsorName: 'Grab Partner',
    sponsorIcon: '🛵',
    sponsorBrandColor: '#00b14f',
    expiryDate: '31 Des 2026',
    quantity: 1,
    isActive: true,
    termsAndConditions: [
      'Voucher promo khusus kemitraan GrabFood Dine-in.',
      'Single use only, tidak dapat digabungkan dengan promo bank lain.'
    ]
  },
  {
    code: 'CASHBACK50',
    title: 'Cashback 50% Poin VIP Sultan',
    description: 'Cashback poin loyalitas hingga 200 Poin untuk member terdaftar',
    discountAmount: 12000,
    discountType: 'flat',
    minSpend: 35000,
    isStackable: true,
    issuerOrigin: 'merchant',
    contactId: 'contact-vip',
    sponsorType: 'loyalty',
    sponsorName: 'VIP Member',
    sponsorIcon: '👑',
    sponsorBrandColor: '#8b5cf6',
    expiryDate: '31 Des 2026',
    quantity: 2,
    isActive: true,
    termsAndConditions: [
      'Berlaku otomatis untuk semua pelanggan terdaftar dengan status VIP Member.',
      'Poin langsung dikreditkan ke saldo akun setelah pesanan selesai.'
    ]
  }
]
