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
  // 1. Accounting
  {
    slug: 'xero-sync-connector', name: 'Xero Cloud Sync', region: 'id', category: 'accounting', icon: '📊',
    summary: 'Bi-directional sync and 1-click historical migration from Xero API.',
    track: 'stable', verified: true, installs: 310, supportedVersions: ['v2.0']
  },
  {
    slug: 'quickbooks-online-bridge', name: 'Intuit QuickBooks Online', region: 'us', category: 'accounting', icon: '💼',
    summary: 'QBO cloud general journal synchronization with tax and customer subledgers.',
    track: 'stable', verified: true, installs: 275, supportedVersions: ['v3.0']
  },
  {
    slug: 'mekari-jurnal-sync-connector', name: 'Mekari Jurnal Sync', region: 'id', category: 'accounting', icon: '📒',
    summary: 'Native import and live sync from Jurnal.id Open API ledger books.',
    track: 'stable', verified: true, installs: 240, supportedVersions: ['v1.8']
  },
  {
    slug: 'accurate-online-sync-connector', name: 'Accurate Online Bridge', region: 'id', category: 'accounting', icon: '📗',
    summary: 'CPSSoft Accurate Online master data and opening balance synchronization.',
    track: 'stable', verified: true, installs: 195, supportedVersions: ['v2.2']
  },
  {
    slug: 'sap-business-one-connector', name: 'SAP Business One Cloud', region: 'eu', category: 'accounting', icon: '🏢',
    summary: 'SAP Service Layer REST integration for enterprise chart of accounts & journals.',
    track: 'beta', verified: true, installs: 110, supportedVersions: ['v10.0-HANA']
  },
  {
    slug: 'netsuite-erp-connector', name: 'Oracle NetSuite ERP', region: 'us', category: 'accounting', icon: '🌐',
    summary: 'SuiteTalk REST Web Services bi-directional GL posting and multicurrency consolidation.',
    track: 'beta', verified: true, installs: 85, supportedVersions: ['2026.1']
  },
  {
    slug: 'odoo-accounting-bridge', name: 'Odoo Accounting & Invoicing', region: 'eu', category: 'accounting', icon: '🟣',
    summary: 'Odoo Community/Enterprise JSON-RPC automated voucher reconciliation.',
    track: 'stable', verified: true, installs: 145, supportedVersions: ['v17.0', 'v18.0']
  },
  {
    slug: 'wave-accounting-sync', name: 'Wave Financial Bridge', region: 'us', category: 'accounting', icon: '🌊',
    summary: 'GraphQL API bridge for small business automated bookkeeping and receipts.',
    track: 'stable', verified: false, installs: 78, supportedVersions: ['v1.0']
  },
  {
    slug: 'sage-intacct-gateway', name: 'Sage Intacct Financials', region: 'us', category: 'accounting', icon: '🌿',
    summary: 'Multi-entity AICPA-endorsed financial management and journal batch sync.',
    track: 'beta', verified: true, installs: 62, supportedVersions: ['v3.0']
  },

  // 2. Payments
  {
    slug: 'qris-bi-standar-gateway', name: 'QRIS Dynamic Standar BI', region: 'id', category: 'payments', icon: '💳',
    summary: 'Bank Indonesia National Standard QRIS dynamic generation & real-time webhook callback.',
    track: 'stable', verified: true, installs: 512, supportedVersions: ['QRIS-2.0']
  },
  {
    slug: 'stripe-elements-gateway', name: 'Stripe Global Payments', region: 'us', category: 'payments', icon: '⚡',
    summary: 'Stripe PaymentIntents, Apple Pay, Google Pay, and localized regional rails.',
    track: 'stable', verified: true, installs: 430, supportedVersions: ['2024-11-15']
  },
  {
    slug: 'midtrans-snap-gateway', name: 'Midtrans Snap & Core API', region: 'id', category: 'payments', icon: '🚀',
    summary: 'GoTo Midtrans payment gateway with VA, GoPay, ShopeePay, and credit card acquiring.',
    track: 'stable', verified: true, installs: 390, supportedVersions: ['v2.0']
  },
  {
    slug: 'xendit-invoicing-gateway', name: 'Xendit XenPlatform', region: 'id', category: 'payments', icon: '💸',
    summary: 'Xendit marketplace split-payments, dynamic VA, and instant payout disbursement.',
    track: 'stable', verified: true, installs: 340, supportedVersions: ['v3.1']
  },
  {
    slug: 'doku-checkout-gateway', name: 'DOKU Payment Gateway', region: 'id', category: 'payments', icon: '🛡️',
    summary: 'Jokul DOKU checkout with minimarket cash-in (Alfamart/Indomaret) and direct debit.',
    track: 'stable', verified: true, installs: 215, supportedVersions: ['v1.4']
  },
  {
    slug: 'faspay-billing-gateway', name: 'Faspay Payment Rail', region: 'id', category: 'payments', icon: '⚡',
    summary: 'Faspay Business payment gateway with multi-bank virtual account routing.',
    track: 'stable', verified: false, installs: 92, supportedVersions: ['v2.0']
  },
  {
    slug: 'ovo-merchant-direct', name: 'OVO Merchant QR & Push', region: 'id', category: 'payments', icon: '🟣',
    summary: 'Grab OVO direct merchant app-to-app push notification payments.',
    track: 'stable', verified: true, installs: 280, supportedVersions: ['v2.1']
  },
  {
    slug: 'gopay-merchant-direct', name: 'GoPay & GoPay Later Rail', region: 'id', category: 'payments', icon: '🟢',
    summary: 'Direct GoPay QRIS and GoPay Later installment settlement integration.',
    track: 'stable', verified: true, installs: 360, supportedVersions: ['v2.5']
  },
  {
    slug: 'dana-qris-direct', name: 'DANA Enterprise QRIS', region: 'id', category: 'payments', icon: '🔵',
    summary: 'DANA open API for enterprise merchant cashier terminals and dynamic QR.',
    track: 'stable', verified: true, installs: 245, supportedVersions: ['v2.0']
  },
  {
    slug: 'shopeepay-merchant-direct', name: 'ShopeePay & SPayLater Rail', region: 'id', category: 'payments', icon: '🟠',
    summary: 'SeaMoney ShopeePay offline barcode/QR scanning with coin cashback.',
    track: 'stable', verified: true, installs: 310, supportedVersions: ['v2.0']
  },
  {
    slug: 'eu-adyen-mollie-gateway', name: 'Adyen & Mollie Gateway', region: 'eu', category: 'payments', icon: '💶',
    summary: 'iDEAL, Bancontact, Klarna, and global card acquiring settlement.',
    track: 'stable', verified: true, installs: 290, supportedVersions: ['v3.0']
  },

  // 3. Banking
  {
    slug: 'bca-snap-bi-gateway', name: 'BCA SNAP BI Gateway', region: 'id', category: 'banking', icon: '🏦',
    summary: 'KlikBCA corporate statement feeds, balance inquiry & BI-FAST settlement normalizer.',
    track: 'stable', verified: true, installs: 142, supportedVersions: ['v1.0', 'SNAP-BI-2.0']
  },
  {
    slug: 'mandiri-mcm-snap-bi', name: 'Mandiri MCM 2.0 SNAP', region: 'id', category: 'banking', icon: '🏦',
    summary: 'Bank Mandiri MCM 2.0 corporate banking & dynamic bill payment auto-reconciliation.',
    track: 'stable', verified: true, installs: 98, supportedVersions: ['v2.1', 'SNAP-BI-2.0']
  },
  {
    slug: 'bri-briapi-snap-gateway', name: 'BRI BRIAPI SNAP', region: 'id', category: 'banking', icon: '🏦',
    summary: 'Bank BRI BRIVA virtual accounts and real-time ledger statement sync.',
    track: 'stable', verified: true, installs: 84, supportedVersions: ['v2.0']
  },
  {
    slug: 'bni-direct-snap-gateway', name: 'BNI Direct SNAP BI', region: 'id', category: 'banking', icon: '🏦',
    summary: 'BNI Direct corporate cash management, VA management, and account statement sync.',
    track: 'stable', verified: true, installs: 76, supportedVersions: ['SNAP-BI-2.0']
  },
  {
    slug: 'bank-jago-bisnis-connector', name: 'Bank Jago Bisnis', region: 'id', category: 'banking', icon: '📱',
    summary: 'Neobank business pockets sync to dedicated COA Cash & Bank accounts.',
    track: 'beta', verified: true, installs: 56, supportedVersions: ['v0.9-dev', 'v1.0-rc']
  },
  {
    slug: 'cimb-bizchannel-snap', name: 'CIMB Niaga BizChannel', region: 'id', category: 'banking', icon: '🏦',
    summary: 'BizChannel@CIMB statement feeds, bulk payroll, and instant BI-FAST clearance.',
    track: 'stable', verified: true, installs: 68, supportedVersions: ['SNAP-BI-2.0']
  },
  {
    slug: 'permata-ebusiness-snap', name: 'Permata e-Business SNAP', region: 'id', category: 'banking', icon: '🏦',
    summary: 'PermataBank Open Banking API for corporate liquidity & virtual accounts.',
    track: 'beta', verified: false, installs: 45, supportedVersions: ['v1.1']
  },
  {
    slug: 'sg-paynow-fast-gateway', name: 'Singapore PayNow & FAST', region: 'sg', category: 'banking', icon: '🇸🇬',
    summary: 'DBS IDEAL, OCBC Velocity, UOB Infinity feeds and FAST settlement.',
    track: 'stable', verified: true, installs: 120, supportedVersions: ['v1.2']
  },
  {
    slug: 'hk-fps-banking-rail', name: 'HKMA Faster Payment (FPS)', region: 'hk', category: 'banking', icon: '🇭🇰',
    summary: 'HKMA 24/7 multicurrency FPS rail & HSBC Business Go integration.',
    track: 'stable', verified: true, installs: 95, supportedVersions: ['v1.0']
  },
  {
    slug: 'us-plaid-fednow-bridge', name: 'Plaid & FedNow ACH', region: 'us', category: 'banking', icon: '🇺🇸',
    summary: '12,000+ US banks Open Banking ingestion and FedNow / Nacha ACH.',
    track: 'stable', verified: true, installs: 280, supportedVersions: ['v2.0']
  },
  {
    slug: 'eu-sepa-instant-tink', name: 'SEPA Instant & Tink', region: 'eu', category: 'banking', icon: '🇪🇺',
    summary: 'Pan-European SEPA credit transfers and PSD2 open banking feeds.',
    track: 'stable', verified: true, installs: 230, supportedVersions: ['ISO-20022']
  },

  // 4. E-Commerce
  {
    slug: 'shopify-multistore-sync', name: 'Shopify Multi-Store', region: 'us', category: 'ecommerce', icon: '🛍️',
    summary: 'Shopify Admin GraphQL bi-directional catalog, orders, and gift card balance sync.',
    track: 'stable', verified: true, installs: 260, supportedVersions: ['2026-01']
  },
  {
    slug: 'woocommerce-webhook-sync', name: 'WooCommerce Webhook', region: 'eu', category: 'ecommerce', icon: '🛒',
    summary: 'Automated order ingestion, inventory reservation, and coupon accounting.',
    track: 'stable', verified: true, installs: 190, supportedVersions: ['v3.0']
  },
  {
    slug: 'alfamart-h2h-retail-sync', name: 'Alfamart Host-to-Host', region: 'id', category: 'ecommerce', icon: '🏪',
    summary: 'Alfamart 19,000+ outlets over-the-counter payment, cash-out, and stock dropship.',
    track: 'stable', verified: true, installs: 175, supportedVersions: ['v2.0-H2H']
  },
  {
    slug: 'indomaret-isaku-sync', name: 'Indomaret i-Saku Rail', region: 'id', category: 'ecommerce', icon: '🏪',
    summary: 'Indomaret Point voucher redemption and i-Saku payment channel reconciliation.',
    track: 'stable', verified: true, installs: 165, supportedVersions: ['v1.9']
  },
  {
    slug: 'tokopedia-omnichannel-sync', name: 'Tokopedia Omnichannel', region: 'id', category: 'ecommerce', icon: '🟢',
    summary: 'Tokopedia Open API order auto-fulfillment, bundle depletion, and fee deduction.',
    track: 'stable', verified: true, installs: 320, supportedVersions: ['v2.3']
  },
  {
    slug: 'shopee-open-platform-sync', name: 'Shopee Open Platform', region: 'id', category: 'ecommerce', icon: '🟠',
    summary: 'Shopee Open API v2 real-time order sync, tracking update, and escrow payout.',
    track: 'stable', verified: true, installs: 345, supportedVersions: ['v2.0']
  },
  {
    slug: 'tiktok-shop-partner-sync', name: 'TikTok Shop Partner Center', region: 'id', category: 'ecommerce', icon: '🎵',
    summary: 'TikTok Shop live shopping order routing, affiliate fee, and inventory locks.',
    track: 'stable', verified: true, installs: 295, supportedVersions: ['v2026.02']
  },
  {
    slug: 'lazada-open-platform-sync', name: 'Lazada Open Platform', region: 'id', category: 'ecommerce', icon: '💙',
    summary: 'Lazada Open Platform multi-country logistics sync and seller balance audit.',
    track: 'stable', verified: false, installs: 125, supportedVersions: ['v2.0']
  },
  {
    slug: 'gofood-grabfood-merchant-sync', name: 'GoFood & GrabFood Sync', region: 'id', category: 'ecommerce', icon: '🛵',
    summary: 'Food delivery 20% commission & net payout auto-reconciliation into posting journals.',
    track: 'stable', verified: true, installs: 180, supportedVersions: ['v1.5']
  },

  // 5. POS
  {
    slug: 'moka-pos-sync', name: 'Moka POS Next-Gen', region: 'id', category: 'pos', icon: '☕',
    summary: 'GoTo Moka POS shift closing, gross/net revenue splitting & COGS depletion.',
    track: 'beta', verified: true, installs: 210, supportedVersions: ['v2.0', 'v2.1-rc']
  },
  {
    slug: 'esb-resto-enterprise', name: 'ESB Resto Enterprise', region: 'id', category: 'pos', icon: '🍽️',
    summary: 'Enterprise restaurant POS with split-bill & 5-10% service charge accounting.',
    track: 'stable', verified: true, installs: 135, supportedVersions: ['v3.4']
  },
  {
    slug: 'sg-qashier-storehub-pos', name: 'Qashier & StoreHub POS', region: 'sg', category: 'pos', icon: '🛒',
    summary: 'Singapore retail/F&B cashier terminal integration (GrabPay, PayLah!).',
    track: 'beta', verified: true, installs: 64, supportedVersions: ['v1.1-beta']
  },
  {
    slug: 'hk-octopus-alipay-pos', name: 'Octopus Card & e-Wallets', region: 'hk', category: 'pos', icon: '💳',
    summary: 'Octopus Card (八達通), AlipayHK, and WeChat Pay HK retail settlement.',
    track: 'beta', verified: true, installs: 72, supportedVersions: ['v0.9']
  },
  {
    slug: 'uae-foodics-pos-bridge', name: 'Foodics Cloud POS', region: 'uae', category: 'pos', icon: '🍔',
    summary: 'Leading GCC cloud restaurant and raw material inventory sync.',
    track: 'beta', verified: true, installs: 88, supportedVersions: ['v2.0-rc']
  },
  {
    slug: 'us-toast-clover-pos', name: 'Toast POS & Clover', region: 'us', category: 'pos', icon: '🍕',
    summary: 'US restaurant POS batching and kitchen display timing synchronization.',
    track: 'beta', verified: true, installs: 150, supportedVersions: ['v1.4-beta']
  },

  // 6. Tax
  {
    slug: 'djp-efaktur-gateway', name: 'DJP e-Faktur Gateway', region: 'id', category: 'tax', icon: '🏛️',
    summary: 'Directorate General of Taxes electronic invoice generation and tax filing.',
    track: 'stable', verified: true, installs: 420, supportedVersions: ['v3.2', 'v4.0-coretax']
  },
  {
    slug: 'sg-invoicenow-peppol', name: 'IMDA InvoiceNow Peppol', region: 'sg', category: 'tax', icon: '📨',
    summary: 'IMDA Peppol network e-invoicing and IRAS quarterly GST F5 return.',
    track: 'stable', verified: true, installs: 85, supportedVersions: ['BIS-3.0']
  },
  {
    slug: 'uae-fta-emaratax-vat', name: 'FTA EmaraTax (VAT & CT)', region: 'uae', category: 'tax', icon: '🇦🇪',
    summary: 'UAE Federal Tax Authority 5% VAT and 9% Corporate Tax engine.',
    track: 'stable', verified: true, installs: 110, supportedVersions: ['v1.0']
  },
  {
    slug: 'us-vertex-cloud-tax', name: 'Vertex Cloud Indirect Tax', region: 'us', category: 'tax', icon: '🗽',
    summary: 'Automated US state & local sales tax calculation and nexus threshold monitoring.',
    track: 'stable', verified: true, installs: 95, supportedVersions: ['v2.1']
  }
]
