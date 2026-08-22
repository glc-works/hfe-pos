export type SupportedLanguage = 'id' | 'en'

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
  sextet: {
    sectionBadge: string
    sectionTitle: string
    sectionSubtitle: string
    admin: { name: string; tagline: string; role: string; features: string[] }
    pos: { name: string; tagline: string; role: string; features: string[] }
    book: { name: string; tagline: string; role: string; features: string[] }
    card: { name: string; tagline: string; role: string; features: string[] }
    board: { name: string; tagline: string; role: string; features: string[] }
    order: { name: string; tagline: string; role: string; features: string[] }
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
      products: '6 Produk',
      solutions: 'Solusi Bisnis',
      workflow: 'Alur Kebenaran',
      pricing: 'Paket Usaha',
      login: 'Masuk Kasir',
      startTrial: 'Daftar Gratis ➔'
    },
    hero: {
      badge: '⚡ THE UNIFIED COMMERCE & EXPERIENCE SUITE 2026+',
      titlePart1: 'Satu Sistem Cerdas untuk',
      titleHighlight: 'Semua Urusan Bisnis',
      titlePart2: 'Anda.',
      subtitle: 'Jalankan kasir cepat, terima pesanan QR meja, bangun loyalitas member, dan dapatkan pembukuan otomatis. Semua berjalan sendiri tanpa bikin pusing.',
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
        solvedBy: 'Cek omzet seluruh cabang secara real-time, atur hak akses PIN staf (RBAC) dari HP Anda.',
        product: 'ADMIN.Hfeit'
      }
    },
    sextet: {
      sectionBadge: '6 PILAR PENGALAMAN BISNIS',
      sectionTitle: 'Satu Rangkaian Lengkap untuk Menjalankan Usaha',
      sectionSubtitle: 'Enam produk terintegrasi sempurna yang dirancang untuk pemilik, staf, dan pelanggan Anda.',
      admin: {
        name: 'ADMIN.Hfeit',
        tagline: 'Manage the Business',
        role: 'Pusat Manajemen Merchant',
        features: ['Multi-Cabang & Hierarki Outlet', 'Izin Staf & PIN Kasir (RBAC)', 'Kontrol Langganan & Aktivasi Produk']
      },
      pos: {
        name: 'POS.Hfeit',
        tagline: 'Run the Business',
        role: 'Terminal Kasir & Dapur Kilat',
        features: ['Respon Cepat <16ms', 'KDS Dapur Multi-Stasiun & Peta Meja', 'Tahan Offline (IndexedDB Resilience)']
      },
      book: {
        name: 'BOOK.Hfeit',
        tagline: 'Control the Books',
        role: 'Pembukuan & Buku Besar Otomatis',
        features: ['Jurnal Double-Entry Real-Time', 'Kalkulasi Pajak PB1 10% Otomatis', 'Laporan Laba Rugi & Rekonsiliasi Kas']
      },
      card: {
        name: 'CARD.Hfeit',
        tagline: 'Be Known',
        role: 'Paspor Relasi & Member Digital',
        features: ['Apple Wallet Style Loyalty Stamp Card', 'Dompet E-Tiket Workshop & Event', 'Satu Identitas Pelanggan di Semua Outlet']
      },
      board: {
        name: 'BOARD.Hfeit',
        tagline: 'Be Found',
        role: 'Etalase Publik & Menu SEO',
        features: ['Cloudflare Edge TTFB <20ms', 'Schema.org JSON-LD Terindeks Google', 'Sistem Reservasi Meja & Jam Operasional']
      },
      order: {
        name: 'ORDER.Hfeit',
        tagline: 'Do Business',
        role: 'Pemesanan Mandiri 3-Jalur',
        features: ['Dine-In QR Meja, Takeaway & Delivery', 'Settlement QRIS Dinamis Instan', 'Cart Handoff <16ms ke Kasir']
      }
    },
    workflow: {
      sectionBadge: 'SIMULASI ALUR KEBENARAN',
      sectionTitle: 'Satu Transaksi. Satu Kebenaran Data.',
      sectionSubtitle: 'Lihat bagaimana 1 pesanan pelanggan menggerakkan seluruh 6 produk secara bersamaan tanpa input ganda.',
      steps: [
        { step: '01', title: 'Pelanggan Pesan di Meja', desc: 'Scan QR di meja OUT-04 via ORDER.Hfeit', targetProduct: 'ORDER.Hfeit', color: 'text-rose-400' },
        { step: '02', title: 'Dapur & Kasir Berbunyi', desc: 'KDS Dapur menerima tiket & kasir POS terupdate', targetProduct: 'POS.Hfeit', color: 'text-amber-400' },
        { step: '03', title: 'Pelanggan Dapat Poin', desc: 'Stamp loyalitas otomatis masuk ke dompet CARD.Hfeit', targetProduct: 'CARD.Hfeit', color: 'text-purple-400' },
        { step: '04', title: 'Jurnal Akuntansi Terbit', desc: 'Debit Kas 1101 / Kredit Pendapatan 4101 di BOOK.Hfeit', targetProduct: 'BOOK.Hfeit', color: 'text-emerald-400' },
        { step: '05', title: 'HQ Memantau Omzet', desc: 'Dasbor ADMIN.Hfeit mencatat kenaikan omzet jaringan', targetProduct: 'ADMIN.Hfeit', color: 'text-indigo-400' }
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
      products: '6 Products',
      solutions: 'Solutions',
      workflow: 'Truth Flow',
      pricing: 'Pricing',
      login: 'Cashier Login',
      startTrial: 'Free Trial ➔'
    },
    hero: {
      badge: '⚡ THE UNIFIED COMMERCE & EXPERIENCE SUITE 2026+',
      titlePart1: 'One Intelligent System for',
      titleHighlight: 'Your Entire Business',
      titlePart2: 'Operations.',
      subtitle: 'Run high-speed POS, accept QR table orders, build customer loyalty passes, and get automated double-entry accounting without friction.',
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
        solvedBy: 'Monitor live network revenue and configure staff RBAC PIN permissions directly from your smartphone anywhere.',
        product: 'ADMIN.Hfeit'
      }
    },
    sextet: {
      sectionBadge: '6 EXPERIENCE PILLARS',
      sectionTitle: 'The Complete Suite to Run Your Enterprise',
      sectionSubtitle: 'Six seamlessly integrated products engineered for business owners, operators, and customers.',
      admin: {
        name: 'ADMIN.Hfeit',
        tagline: 'Manage the Business',
        role: 'Merchant Governance Hub',
        features: ['Multi-Branch & Outlet Hierarchy', 'Staff RBAC & Cashier Security PINs', 'Subscription & Product Entitlements']
      },
      pos: {
        name: 'POS.Hfeit',
        tagline: 'Run the Business',
        role: 'High-Speed Cashier & Kitchen Workstation',
        features: ['Sub-16ms Touch Latency', 'Multi-Station Kitchen KDS & Floor Maps', 'Offline-First IndexedDB Resilience']
      },
      book: {
        name: 'BOOK.Hfeit',
        tagline: 'Control the Books',
        role: 'Automated General Ledger Accounting',
        features: ['Real-Time Double-Entry Journaling', 'Automated PB1 10% Tax Calculation', 'Instant P&L & Cash Reconciliation']
      },
      card: {
        name: 'CARD.Hfeit',
        tagline: 'Be Known',
        role: 'Digital Passport & Loyalty Passbook',
        features: ['Apple Wallet Style Loyalty Stamp Card', 'Event & Workshop E-Ticket Wallet', 'Unified Customer Identity Across Outlets']
      },
      board: {
        name: 'BOARD.Hfeit',
        tagline: 'Be Found',
        role: 'Public Storefront & SEO Catalog',
        features: ['Cloudflare Edge TTFB <20ms', 'Schema.org JSON-LD Google Indexed', 'Table Reservation & Operating Hours']
      },
      order: {
        name: 'ORDER.Hfeit',
        tagline: 'Do Business',
        role: '3-Way Self-Service Ordering',
        features: ['Dine-In Table QR, Takeaway & Delivery', 'Instant Dynamic QRIS Settlement', 'Sub-16ms Cart Handoff to Cashier']
      }
    },
    workflow: {
      sectionBadge: 'TRUTH FLOW SIMULATION',
      sectionTitle: 'One Transaction. One Business Truth.',
      sectionSubtitle: 'Observe how 1 customer order instantly activates all 6 products in real-time with zero manual duplication.',
      steps: [
        { step: '01', title: 'Customer Orders at Table', desc: 'Scans QR at Table OUT-04 via ORDER.Hfeit', targetProduct: 'ORDER.Hfeit', color: 'text-rose-400' },
        { step: '02', title: 'Kitchen & Cashier Alerted', desc: 'Kitchen KDS receives ticket & POS cart updates', targetProduct: 'POS.Hfeit', color: 'text-amber-400' },
        { step: '03', title: 'Customer Earns Stamps', desc: 'Loyalty stamps credit automatically in CARD.Hfeit', targetProduct: 'CARD.Hfeit', color: 'text-purple-400' },
        { step: '04', title: 'Ledger Journal Posted', desc: 'Debit Cash 1101 / Credit Revenue 4101 in BOOK.Hfeit', targetProduct: 'BOOK.Hfeit', color: 'text-emerald-400' },
        { step: '05', title: 'HQ Observes Live Sales', desc: 'ADMIN.Hfeit dashboard reflects instant branch revenue delta', targetProduct: 'ADMIN.Hfeit', color: 'text-indigo-400' }
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
