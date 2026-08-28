export type SupportedLanguage = 'id' | 'en'

export interface ProductFeatureInfo {
  name: string
  tagline: string
  role: string
  features: string[]
  badgeColor: string
}

export interface ExpTranslations {
  nav: {
    products: string
    solutions: string
    workflow: string
    pricing: string
    login: string
    startTrial: string
  }
  hero: {
    badge: string
    titlePart1: string
    titleHighlight: string
    titlePart2: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
    subBadge1: string
    subBadge2: string
    subBadge3: string
  }
  painPoints: {
    sectionBadge: string
    sectionTitle: string
    sectionSubtitle: string
    p1: { title: string; desc: string; solvedBy: string; product: string }
    p2: { title: string; desc: string; solvedBy: string; product: string }
    p3: { title: string; desc: string; solvedBy: string; product: string }
    p4: { title: string; desc: string; solvedBy: string; product: string }
  }
  quintet: {
    sectionBadge: string
    sectionTitle: string
    sectionSubtitle: string
    pos: ProductFeatureInfo
    book: ProductFeatureInfo
    order: ProductFeatureInfo
    board: ProductFeatureInfo
    card: ProductFeatureInfo
  }
  workflow: {
    sectionBadge: string
    sectionTitle: string
    sectionSubtitle: string
    steps: Array<{ step: string; title: string; desc: string; targetProduct: string; color: string }>
  }
  industries: {
    sectionBadge: string
    sectionTitle: string
    fnb: { title: string; desc: string }
    retail: { title: string; desc: string }
    salon: { title: string; desc: string }
    coworking: { title: string; desc: string }
    clinic: { title: string; desc: string }
  }
  cta: {
    title: string
    subtitle: string
    buttonText: string
    guarantee: string
  }
}

export const TRANSLATIONS: Record<SupportedLanguage, ExpTranslations> = {
  id: {
    nav: {
      products: '5 Produk Inti',
      solutions: 'Solusi Bisnis',
      workflow: 'Alur Kebenaran',
      pricing: 'Paket Usaha',
      login: 'Masuk Kasir',
      startTrial: 'Daftar Toko Gratis ➔'
    },
    hero: {
      badge: '⚡ A SYSTEM THAT GROWS WITH YOU • SATU SISTEM UNTUK SETIAP TAHAP BISNISMU',
      titlePart1: 'Satu Sistem untuk',
      titleHighlight: 'Setiap Tahap',
      titlePart2: 'Bisnis Anda.',
      subtitle: 'Dirancang untuk setiap tahap bisnis Anda—dari gerai pertama hingga jaringan enterprise. Kasir kilat <16ms, struk offline, pesanan QR meja, dan pembukuan otomatis Hfe CORE di setiap langkah perjalanan usaha Anda.',
      ctaPrimary: '🚀 Daftarkan Usaha Anda Gratis ➔',
      ctaSecondary: '📱 Coba Demo Kasir Langsung',
      subBadge1: '✓ Tanpa Biaya Tersembunyi',
      subBadge2: '✓ Internet Mati Tetap Jalan',
      subBadge3: '✓ Setup Selesai dalam 60 Detik'
    },
    painPoints: {
      sectionBadge: 'MASALAH NYATA PENGUSAHA',
      sectionTitle: 'Hentikan Kerumitan Aplikasi yang Terpecah-Pecah',
      sectionSubtitle: 'Bebaskan bisnis Anda dari rekap manual tengah malam, kasir lemot saat ramai, dan komisi aplikasi yang mencekik.',
      p1: {
        title: 'Capek Rekap Manual & Uang Kas Selisih',
        desc: 'Tiap malam lembur mencocokkan struk kasir dengan Excel pembukuan? Selisih kasir bikin pusing?',
        solvedBy: 'Setiap transaksi kasir otomatis terjurnal ke laporan laba rugi instan. Nol selisih kas, nol lembur rekap.',
        product: 'BOOK.Hfeit'
      },
      p2: {
        title: 'Kasir Lemot / Crash Saat Antrean Panjang',
        desc: 'Kasir berbasis cloud muter-muter saat internet kafe drop? Tamu marah dan antrean mengular?',
        solvedBy: 'Kecepatan sentuh <16ms. Tetap menyala dan bisa mencetak struk thermal meski internet mati total.',
        product: 'POS.Hfeit'
      },
      p3: {
        title: 'Tercekik Komisi Ojek Online 20%-30%',
        desc: 'Margin tipis karena potongan komisi marketplace pihak ketiga yang terlampau tinggi?',
        solvedBy: 'Etalase web & QR meja milik Anda sendiri. 100% uang pembayaran masuk langsung ke rekening Anda.',
        product: 'ORDER & BOARD'
      },
      p4: {
        title: 'Pusing Memantau Banyak Cabang & Staf',
        desc: 'Susah memantau operasional, omzet, dan kejujuran staf saat pemilik sedang tidak ada di toko?',
        solvedBy: 'Ganti role langsung di POS dengan PIN Manajer/Owner. Pantau omzet multi-cabang real-time dari HP Anda.',
        product: 'POS.Hfeit (RBAC)'
      }
    },
    quintet: {
      sectionBadge: '5 PRODUK INTI PENGUSAHA',
      sectionTitle: 'Satu Rangkaian Lengkap untuk Menjalankan Usaha',
      sectionSubtitle: 'Lima produk terintegrasi sempurna yang dirancang untuk pemilik, staf kasir, dan pelanggan Anda.',
      pos: {
        name: 'POS.Hfeit',
        tagline: 'Run the Business',
        role: 'Terminal Kasir, Dapur & Manajemen Outlet',
        features: ['Respon Cepat <16ms & Cetak Struk Offline', 'KDS Dapur Multi-Stasiun & Peta Meja', 'Izin Staf & PIN Role Manajer / Owner (RBAC)'],
        badgeColor: 'amber'
      },
      book: {
        name: 'BOOK.Hfeit',
        tagline: 'Control the Books',
        role: 'Buku Besar & Pembukuan Double-Entry Otomatis',
        features: ['Jurnal Akuntansi Real-Time Tanpa Input Ulang', 'Kalkulasi Pajak PB1 10% & Rekonsiliasi Kas', 'Laporan Laba Rugi & Neraca Keuangan Instan'],
        badgeColor: 'emerald'
      },
      order: {
        name: 'ORDER.Hfeit',
        tagline: 'Do Business',
        role: 'Pemesanan Mandiri Pelanggan 3-Jalur',
        features: ['Dine-In QR Meja, Bungkus & Pesan Antar', 'Settlement QRIS Dinamis Instan', 'Cart Handoff <16ms ke Terminal Kasir'],
        badgeColor: 'rose'
      },
      board: {
        name: 'BOARD.Hfeit',
        tagline: 'Be Found',
        role: 'Etalase Publik & Website Menu SEO',
        features: ['Cloudflare Edge TTFB <15ms Super Kilat', 'Schema.org JSON-LD Terindeks Resmi di Google', 'Form Reservasi Meja & Jam Operasional Toko'],
        badgeColor: 'cyan'
      },
      card: {
        name: 'CARD.Hfeit',
        tagline: 'Be Known',
        role: 'Paspor Relasi & Dompet Member Digital',
        features: ['Apple Wallet Style Loyalty Stamp Card', 'Dompet E-Tiket Gate-In Workshop & Komunitas', 'Satu Nomor Member di Seluruh Jaringan Outlet'],
        badgeColor: 'purple'
      }
    },
    workflow: {
      sectionBadge: 'SIMULASI SATU KEBENARAN DATA',
      sectionTitle: 'Satu Transaksi. Satu Kebenaran Data.',
      sectionSubtitle: 'Lihat bagaimana 1 pesanan pelanggan menggerakkan seluruh sistem secara bersamaan tanpa input ganda.',
      steps: [
        { step: '01', title: 'Pelanggan Pesan Mandiri', desc: 'Scan QR di meja OUT-04 via ORDER.Hfeit', targetProduct: 'ORDER.Hfeit', color: 'text-rose-600' },
        { step: '02', title: 'Dapur & Kasir Berbunyi', desc: 'KDS Dapur terima tiket & kasir POS terupdate kilat', targetProduct: 'POS.Hfeit', color: 'text-amber-600' },
        { step: '03', title: 'Pelanggan Terima Stamp', desc: 'Stamp loyalitas otomatis masuk ke dompet CARD.Hfeit', targetProduct: 'CARD.Hfeit', color: 'text-purple-600' },
        { step: '04', title: 'Jurnal Akuntansi Terbit', desc: 'Debit Kas 1101 / Kredit Penjualan 4101 di BOOK.Hfeit', targetProduct: 'BOOK.Hfeit', color: 'text-emerald-600' },
        { step: '05', title: 'Pemilik Pantau Omzet', desc: 'Dasbor Owner POS mencatat kenaikan omzet toko real-time', targetProduct: 'POS.Hfeit', color: 'text-indigo-600' }
      ]
    },
    industries: {
      sectionBadge: 'ADAPTASI MULTI-INDUSTRI',
      sectionTitle: 'Dirancang untuk Segala Tipe Perdagangan',
      fnb: { title: 'Kafe, Restoran & Bar', desc: 'Peta meja fleksibel, modifier pesanan, split bill kilat, dan KDS dapur.' },
      retail: { title: 'Butik & Retail Roastery', desc: 'Barcode scanner kilat, varian warna/ukuran, dan pesanan online kurir.' },
      salon: { title: 'Barbershop, Salon & Spa', desc: 'Menu durasi treatment, komisi stylist, dan kalender reservasi.' },
      coworking: { title: 'Coworking & Olahraga', desc: 'Sewa ruang per jam, booking lapangan padel, dan WiFi pasca-bayar.' },
      clinic: { title: 'Klinik Dokter & Estetika', desc: 'Jadwal dokter, estimasi tindakan, dan rekam kunjungan pasien.' }
    },
    cta: {
      title: 'Siap Menjalankan Bisnis Tanpa Pusing?',
      subtitle: 'Bergabunglah dengan ratusan pengusaha modern. Daftarkan usaha Anda dalam 60 detik.',
      buttonText: '🚀 Daftarkan Usaha Anda Sekarang (Gratis) ➔',
      guarantee: '✓ Gratis Uji Coba • Tanpa Kartu Kredit • Batal Kapan Saja'
    }
  },
  en: {
    nav: {
      products: '5 Core Products',
      solutions: 'Solutions',
      workflow: 'Truth Flow',
      pricing: 'Pricing',
      login: 'Cashier Login',
      startTrial: 'Start Free Trial ➔'
    },
    hero: {
      badge: '⚡ A SYSTEM THAT GROWS WITH YOU • ONE SYSTEM FOR EVERY STAGE OF YOUR BUSINESS',
      titlePart1: 'One Unified System for',
      titleHighlight: 'Every Stage',
      titlePart2: 'of Your Business.',
      subtitle: 'Designed for every stage of business—from your first store to enterprise networks. Instant touch POS (<16ms), offline receipts, table QR orders, and automated Hfe CORE accounting.',
      ctaPrimary: '🚀 Start Free Merchant Trial ➔',
      ctaSecondary: '📱 Launch Live Cashier Demo',
      subBadge1: '✓ Zero Hidden Fees',
      subBadge2: '✓ 100% Offline Resilient',
      subBadge3: '✓ 60-Second Setup Time'
    },
    painPoints: {
      sectionBadge: 'REAL MERCHANT PAIN POINTS',
      sectionTitle: 'Eliminate Fragmented Software Chaos',
      sectionSubtitle: 'Free your business from midnight manual reconciliations, offline cashier crashes, and predatory marketplace commission fees.',
      p1: {
        title: 'Exhausted by Manual Bookkeeping & Cash Mismatches',
        desc: 'Overtime every night matching register chits with Excel sheets? Cash drawer discrepancies causing headaches?',
        solvedBy: 'Every register transaction automatically posts to live P&L reports. Zero cash drift, zero midnight re-entry.',
        product: 'BOOK.Hfeit'
      },
      p2: {
        title: 'Cashier Slowdowns & Crashes During Peak Rushes',
        desc: 'Pure cloud POS spinning when cafe internet drops? Frustrated guests and stalled lines?',
        solvedBy: 'Ultra-responsive <16ms touch latency. Stays operational and prints thermal receipts even if internet is fully dead.',
        product: 'POS.Hfeit'
      },
      p3: {
        title: 'Suffocating 20%-30% Food Delivery App Commissions',
        desc: 'Thin profit margins devoured by third-party delivery marketplace cut rates?',
        solvedBy: 'Your own web storefront & dine-in QR ordering. 100% of customer funds settle directly into your bank account.',
        product: 'ORDER & BOARD'
      },
      p4: {
        title: 'Struggling to Monitor Multiple Outlets & Staff',
        desc: 'Difficult to track store operations, sales velocity, and cashier integrity when away from the shop?',
        solvedBy: 'Switch roles instantly inside POS via Manager/Owner PIN. Monitor live revenue and staff RBAC anywhere.',
        product: 'POS.Hfeit (RBAC)'
      }
    },
    quintet: {
      sectionBadge: '5 MERCHANT CORE PILLARS',
      sectionTitle: 'The Complete Suite to Run Your Enterprise',
      sectionSubtitle: 'Five seamlessly integrated products engineered for business owners, cashier staff, and customers.',
      pos: {
        name: 'POS.Hfeit',
        tagline: 'Run the Business',
        role: 'High-Speed Cashier, Kitchen & Outlet Management',
        features: ['Sub-16ms Touch Latency & Offline Receipt Printing', 'Multi-Station Kitchen KDS & Floor Maps', 'Staff RBAC & Manager / Owner PIN Switching'],
        badgeColor: 'amber'
      },
      book: {
        name: 'BOOK.Hfeit',
        tagline: 'Control the Books',
        role: 'Automated Double-Entry General Ledger',
        features: ['Real-Time Double-Entry Journaling Without Re-entry', 'Automated PB1 10% Tax & Cash Drawer Reconciliation', 'Instant P&L Reports & Balance Sheet Accounting'],
        badgeColor: 'emerald'
      },
      order: {
        name: 'ORDER.Hfeit',
        tagline: 'Do Business',
        role: '3-Way Self-Service Customer Ordering',
        features: ['Dine-In Table QR, Takeaway & Parcel Delivery', 'Instant Dynamic QRIS Payment Settlement', 'Sub-16ms Cart Handoff to Cashier Register'],
        badgeColor: 'rose'
      },
      board: {
        name: 'BOARD.Hfeit',
        tagline: 'Be Found',
        role: 'Public Web Storefront & SEO Menu Catalog',
        features: ['Cloudflare Edge TTFB <15ms Blazing Speed', 'Schema.org JSON-LD Google Indexed Rich Snippets', 'Table Reservation Engine & Operating Hours'],
        badgeColor: 'cyan'
      },
      card: {
        name: 'CARD.Hfeit',
        tagline: 'Be Known',
        role: 'Digital Passport & Loyalty Passbook',
        features: ['Apple Wallet Style Loyalty Stamp Card', 'Event & Community Workshop E-Ticket Wallet', 'Unified Customer Identity Across Outlet Network'],
        badgeColor: 'purple'
      }
    },
    workflow: {
      sectionBadge: 'ONE BUSINESS TRUTH SIMULATION',
      sectionTitle: 'One Transaction. One Business Truth.',
      sectionSubtitle: 'Observe how 1 customer order instantly activates the entire ecosystem in real-time with zero manual duplication.',
      steps: [
        { step: '01', title: 'Customer Orders at Table', desc: 'Scans QR at Table OUT-04 via ORDER.Hfeit', targetProduct: 'ORDER.Hfeit', color: 'text-rose-600' },
        { step: '02', title: 'Kitchen & Cashier Alerted', desc: 'Kitchen KDS receives ticket & POS cart updates', targetProduct: 'POS.Hfeit', color: 'text-amber-600' },
        { step: '03', title: 'Customer Earns Stamps', desc: 'Loyalty stamps credit automatically in CARD.Hfeit', targetProduct: 'CARD.Hfeit', color: 'text-purple-600' },
        { step: '04', title: 'Ledger Journal Posted', desc: 'Debit Cash 1101 / Credit Revenue 4101 in BOOK.Hfeit', targetProduct: 'BOOK.Hfeit', color: 'text-emerald-600' },
        { step: '05', title: 'Owner Monitors Revenue', desc: 'Owner POS dashboard reflects instant branch revenue delta', targetProduct: 'POS.Hfeit', color: 'text-indigo-600' }
      ]
    },
    industries: {
      sectionBadge: 'MULTI-INDUSTRY ADAPTABILITY',
      sectionTitle: 'Engineered for Every Retail & Hospitality Sector',
      fnb: { title: 'Cafes, Restaurants & Bars', desc: 'Dynamic table layout, beverage modifiers, split bill, and kitchen KDS.' },
      retail: { title: 'Boutiques & Specialty Roasteries', desc: 'Rapid barcode scanning, SKU matrix variants, and parcel delivery.' },
      salon: { title: 'Barbershops, Salons & Spas', desc: 'Treatment duration menus, stylist commissions, and booking calendar.' },
      coworking: { title: 'Coworking & Sports Arenas', desc: 'Hourly meeting room rent, padel court booking, and payment-gated WiFi.' },
      clinic: { title: 'Medical Clinics & Aesthetics', desc: 'Doctor schedules, procedure quotes, and patient visitation logs.' }
    },
    cta: {
      title: 'Ready to Run Your Business Without Friction?',
      subtitle: 'Join hundreds of visionary merchants. Setup your modern store in under 60 seconds.',
      buttonText: '🚀 Start Free Merchant Trial Now ➔',
      guarantee: '✓ Free Trial • No Credit Card Required • Cancel Anytime'
    }
  }
}
