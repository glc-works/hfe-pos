export interface EcosystemConnector {
  slug: string
  name: string
  region: 'id' | 'sg' | 'hk' | 'uae' | 'us' | 'eu'
  category: 'accounting' | 'banking' | 'payments' | 'pos' | 'ecommerce' | 'tax'
  icon: string
  summary: string
  track: 'stable' | 'beta' | 'alpha'
  verified: boolean
  installs: number
  supportedVersions: string[]
  officialDocsUrl?: string
}

export const CONNECTORS_DATA: EcosystemConnector[] = [
  // 🇮🇩 Indonesia (ID)
  {
    slug: 'bca-snap-bi-gateway',
    name: 'BCA SNAP BI Gateway',
    region: 'id',
    category: 'banking',
    icon: '🏦',
    summary: 'KlikBCA corporate statement feeds, balance inquiry & BI-FAST settlement normalizer.',
    track: 'stable',
    verified: true,
    installs: 142,
    supportedVersions: ['v1.0', 'SNAP-BI-2.0']
  },
  {
    slug: 'mandiri-mcm-snap-bi',
    name: 'Mandiri MCM 2.0 SNAP',
    region: 'id',
    category: 'banking',
    icon: '🏦',
    summary: 'Bank Mandiri MCM 2.0 corporate banking & dynamic bill payment auto-reconciliation.',
    track: 'stable',
    verified: true,
    installs: 98,
    supportedVersions: ['v2.1', 'SNAP-BI-2.0']
  },
  {
    slug: 'bri-briapi-snap-gateway',
    name: 'BRI BRIAPI SNAP',
    region: 'id',
    category: 'banking',
    icon: '🏦',
    summary: 'Bank BRI BRIVA virtual accounts and real-time ledger statement sync.',
    track: 'stable',
    verified: true,
    installs: 84,
    supportedVersions: ['v2.0']
  },
  {
    slug: 'bank-jago-bisnis-connector',
    name: 'Bank Jago Bisnis',
    region: 'id',
    category: 'banking',
    icon: '📱',
    summary: 'Neobank business pockets sync to dedicated COA Cash & Bank accounts.',
    track: 'beta',
    verified: true,
    installs: 56,
    supportedVersions: ['v0.9-dev', 'v1.0-rc']
  },
  {
    slug: 'moka-pos-sync',
    name: 'Moka POS Next-Gen',
    region: 'id',
    category: 'pos',
    icon: '☕',
    summary: 'GoTo Moka POS shift closing, gross/net revenue splitting & COGS depletion.',
    track: 'beta',
    verified: true,
    installs: 210,
    supportedVersions: ['v2.0', 'v2.1-rc']
  },
  {
    slug: 'esb-resto-enterprise',
    name: 'ESB Resto Enterprise',
    region: 'id',
    category: 'pos',
    icon: '🍽️',
    summary: 'Enterprise restaurant POS with split-bill & 5-10% service charge accounting.',
    track: 'stable',
    verified: true,
    installs: 135,
    supportedVersions: ['v3.4']
  },
  {
    slug: 'gofood-grabfood-merchant-sync',
    name: 'GoFood & GrabFood Sync',
    region: 'id',
    category: 'ecommerce',
    icon: '🛵',
    summary: 'Food delivery 20% commission & net payout auto-reconciliation into posting journals.',
    track: 'stable',
    verified: true,
    installs: 180,
    supportedVersions: ['v1.5']
  },
  {
    slug: 'xero-sync-connector',
    name: 'Xero Cloud Sync',
    region: 'id',
    category: 'accounting',
    icon: '📊',
    summary: 'Bi-directional sync and 1-click historical migration from Xero API.',
    track: 'stable',
    verified: true,
    installs: 310,
    supportedVersions: ['v2.0']
  },
  {
    slug: 'mekari-jurnal-sync-connector',
    name: 'Mekari Jurnal Sync',
    region: 'id',
    category: 'accounting',
    icon: '📒',
    summary: 'Native import and live sync from Jurnal.id Open API ledger books.',
    track: 'stable',
    verified: true,
    installs: 240,
    supportedVersions: ['v1.8']
  },
  {
    slug: 'accurate-online-sync-connector',
    name: 'Accurate Online Bridge',
    region: 'id',
    category: 'accounting',
    icon: '📗',
    summary: 'CPSSoft Accurate Online master data and opening balance synchronization.',
    track: 'stable',
    verified: true,
    installs: 195,
    supportedVersions: ['v2.2']
  },
  {
    slug: 'djp-efaktur-gateway',
    name: 'DJP e-Faktur Gateway',
    region: 'id',
    category: 'tax',
    icon: '🏛️',
    summary: 'Directorate General of Taxes electronic invoice generation and tax filing.',
    track: 'stable',
    verified: true,
    installs: 420,
    supportedVersions: ['v3.2', 'v4.0-coretax']
  },

  // 🇸🇬 Singapore (SG)
  {
    slug: 'sg-paynow-fast-gateway',
    name: 'Singapore PayNow & FAST',
    region: 'sg',
    category: 'banking',
    icon: '🇸🇬',
    summary: 'DBS IDEAL, OCBC Velocity, UOB Infinity feeds and FAST settlement.',
    track: 'stable',
    verified: true,
    installs: 120,
    supportedVersions: ['v1.2']
  },
  {
    slug: 'sg-invoicenow-peppol',
    name: 'IMDA InvoiceNow Peppol',
    region: 'sg',
    category: 'tax',
    icon: '📨',
    summary: 'IMDA Peppol network e-invoicing and IRAS quarterly GST F5 return.',
    track: 'stable',
    verified: true,
    installs: 85,
    supportedVersions: ['BIS-3.0']
  },
  {
    slug: 'sg-qashier-storehub-pos',
    name: 'Qashier & StoreHub POS',
    region: 'sg',
    category: 'pos',
    icon: '🛒',
    summary: 'Singapore retail/F&B cashier terminal integration (GrabPay, PayLah!).',
    track: 'beta',
    verified: true,
    installs: 64,
    supportedVersions: ['v1.1-beta']
  },

  // 🇭🇰 Hong Kong (HK)
  {
    slug: 'hk-fps-banking-rail',
    name: 'HKMA Faster Payment (FPS)',
    region: 'hk',
    category: 'banking',
    icon: '🇭🇰',
    summary: 'HKMA 24/7 multicurrency FPS rail & HSBC Business Go integration.',
    track: 'stable',
    verified: true,
    installs: 95,
    supportedVersions: ['v1.0']
  },
  {
    slug: 'hk-octopus-alipay-pos',
    name: 'Octopus Card & e-Wallets',
    region: 'hk',
    category: 'pos',
    icon: '💳',
    summary: 'Octopus Card (八達通), AlipayHK, and WeChat Pay HK retail settlement.',
    track: 'beta',
    verified: true,
    installs: 72,
    supportedVersions: ['v0.9']
  },

  // 🇦🇪 UAE & Dubai (UAE)
  {
    slug: 'uae-fta-emaratax-vat',
    name: 'FTA EmaraTax (VAT & CT)',
    region: 'uae',
    category: 'tax',
    icon: '🇦🇪',
    summary: 'UAE Federal Tax Authority 5% VAT and 9% Corporate Tax engine.',
    track: 'stable',
    verified: true,
    installs: 110,
    supportedVersions: ['v1.0']
  },
  {
    slug: 'uae-foodics-pos-bridge',
    name: 'Foodics Cloud POS',
    region: 'uae',
    category: 'pos',
    icon: '🍔',
    summary: 'Leading GCC cloud restaurant and raw material inventory sync.',
    track: 'beta',
    verified: true,
    installs: 88,
    supportedVersions: ['v2.0-rc']
  },

  // 🇺🇸 United States (US)
  {
    slug: 'us-plaid-fednow-bridge',
    name: 'Plaid & FedNow ACH',
    region: 'us',
    category: 'banking',
    icon: '🇺🇸',
    summary: '12,000+ US banks Open Banking ingestion and FedNow / Nacha ACH.',
    track: 'stable',
    verified: true,
    installs: 280,
    supportedVersions: ['v2.0']
  },
  {
    slug: 'us-toast-clover-pos',
    name: 'Toast POS & Clover',
    region: 'us',
    category: 'pos',
    icon: '🍕',
    summary: 'US restaurant POS batching and kitchen display timing synchronization.',
    track: 'beta',
    verified: true,
    installs: 150,
    supportedVersions: ['v1.4-beta']
  },

  // 🇪🇺 European Union (EU)
  {
    slug: 'eu-sepa-instant-tink',
    name: 'SEPA Instant & Tink',
    region: 'eu',
    category: 'banking',
    icon: '🇪🇺',
    summary: 'Pan-European SEPA credit transfers and PSD2 open banking feeds.',
    track: 'stable',
    verified: true,
    installs: 230,
    supportedVersions: ['ISO-20022']
  },
  {
    slug: 'eu-adyen-mollie-gateway',
    name: 'Adyen & Mollie Gateway',
    region: 'eu',
    category: 'payments',
    icon: '💶',
    summary: 'iDEAL, Bancontact, Klarna, and global card acquiring settlement.',
    track: 'stable',
    verified: true,
    installs: 290,
    supportedVersions: ['v3.0']
  }
]
