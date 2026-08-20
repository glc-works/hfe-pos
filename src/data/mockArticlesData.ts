export interface ArticleAuthor {
  name: string
  role: string
  avatar: string
}

export interface HfeitArticle {
  id: string
  title: string
  slug: string
  summary: string
  category: 'UX & Design Rules' | 'Engineering & Architecture' | 'Product Updates' | 'Case Studies'
  author: ArticleAuthor
  readTime: string
  publishedAt: string
  featured?: boolean
  heroImage: string
  content: string
  tags: string[]
}

export const HFEIT_ARTICLES: HfeitArticle[] = [
  {
    id: 'art-001',
    title: 'The 1-Tap Direct Add & Recipe Hierarchy Principle in High-Volume F&B POS',
    slug: '1-tap-direct-add-recipe-hierarchy-fnb-pos',
    summary: 'Why mandatory popups for standard menu items degrade cashier throughput, and how declarative item-level policies accelerate checkout by 3.4 seconds per order.',
    category: 'UX & Design Rules',
    author: {
      name: 'Sir Jony Ive & Aibo',
      role: 'Chief Design Officer & POS Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '6 min read',
    publishedAt: '2026-08-18',
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
    tags: ['POS UX', 'F&B Heuristics', 'Speed Keys', 'Cashier Throughput'],
    content: `
### ⚡ The 1-Tap Direct Add Rule

In high-volume F&B environments like coffee shops, bakeries, and quick-service restaurants, cashier checkout speed directly dictates revenue during peak rush hours. 

Traditional POS systems suffer from **"Popup Fatigue"** — forcing a modal confirmation on every single menu item regardless of whether it requires customization.

#### 1. Anti-Bikin-Repot Kitchen Rule
Items with fixed recipes (e.g., *Mineral Water*, *Plain Croissant*, *Iced Americano Standard*) **MUST perform a 1-Tap Direct Add** (\`handleAddToCart\`) into the transaction cart without displaying a blocking modal popup.

#### 2. Three-Tier Modifier Resolution Hierarchy
1. **Item-Level Policy (\`modifierPolicy: 'always' | 'never'\`)**: Explicit override set on the menu item.
2. **Explicit Item Flag (\`hasModifiers: boolean\`)**: Disables popups for items without options.
3. **Category Default**: Beverage categories default to opening the customization sheet; solid food/pastry categories default to 1-tap direct add.

#### 3. Smart Recipe Material Consistency
When a menu title explicitly names a premium ingredient (e.g., *"Uji Matcha Oatside Latte"*), that specified oat milk is automatically assigned as the **Default (Rp 0 upcharge)**, avoiding unintended dairy upcharge fees!
`
  },
  {
    id: 'art-002',
    title: 'Zero Free-Text Note Pollution: Protecting Kitchen Workflow Integrity',
    slug: 'zero-free-text-note-pollution-kitchen-workflow',
    summary: 'Eliminating arbitrary text notes on fixed recipe items to protect kitchen display system (KDS) clarity and prevent dish recipe corruption.',
    category: 'UX & Design Rules',
    author: {
      name: 'Bang ESB & Jack',
      role: 'F&B Operations Veteran & UI Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '5 min read',
    publishedAt: '2026-08-15',
    featured: false,
    heroImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80',
    tags: ['Kitchen Operations', 'KDS', 'Menu Engineering', 'Note Controls'],
    content: `
### 🚫 Eliminating Note Pollution in Kitchen Operations

Allowing cashiers or customers to type unconstrained free-text notes on standard menu items leads to kitchen chaos: *"pedes tapi gak pedes"*, *"es sedikit tapi gelas penuh"*, or unpriced extra toppings.

#### Guidelines for Note Sanitation
- **Disabled by Default on Fixed Items**: Free-text note inputs are hidden unless \`shouldAllowItemCustomNotes(item)\` explicitly evaluates to \`true\`.
- **Structured Modifier Selection**: Pre-configured modifiers (e.g. *Less Sugar*, *No Ice*, *Extra Shot*) replace vague typed notes with unambiguous kitchen tickets.
- **Contextual Station Placeholders**: Barista stations display *"e.g. Less ice..."* while kitchen displays *"e.g. Extra spicy sauce..."*, maintaining domain relevance.
`
  },
  {
    id: 'art-003',
    title: '3-Layer Viewport & Mobile Safe-Area Architecture for Web POS',
    slug: '3-layer-viewport-mobile-safe-area-web-pos',
    summary: 'Designing 100dvh flexbox structures to eliminate mobile browser URL bar clipping and dynamic island collision.',
    category: 'Engineering & Architecture',
    author: {
      name: 'Hfe Frontend Team',
      role: 'Web Systems Architects',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '8 min read',
    publishedAt: '2026-08-12',
    featured: false,
    heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80',
    tags: ['Mobile Web', 'Viewport Math', 'CSS Architecture', 'Responsive Design'],
    content: `
### 📱 The 3-Layer Viewport Standard

Web POS applications running on mobile Safari or Android Chrome frequently suffer from clipping when the browser address bar dynamically expands or collapses.

#### The 3-Layer Independent Flexbox Layout (\`100dvh\`)
1. **Top Header Container (\`shrink-0 z-30\`)**: Bounded with \`pt-[max(env(safe-area-inset-top,8px),8px)]\` so it sits securely below notch and Dynamic Island boundaries.
2. **Middle Content Surface (\`flex-1 overflow-y-auto\`)**: Catalog and table maps scroll independently without forcing page-level body scroll jitter.
3. **Persistent Bottom Dock (\`shrink-0 z-40\`)**: Fixed above screen bottom with \`pb-[max(env(safe-area-inset-bottom,16px),16px)]\` ensuring immediate visibility of cart actions.
`
  },
  {
    id: 'art-004',
    title: 'High-Performance Double-Entry Financial Engine with Immutable Ledger Proofs',
    slug: 'double-entry-financial-engine-immutable-ledger-proofs',
    summary: 'How Hfe CORE guarantees zero-drift balance integrity across multi-branch merchant organizations.',
    category: 'Engineering & Architecture',
    author: {
      name: 'Hfe Core Team',
      role: 'Financial Kernel Engineers',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '10 min read',
    publishedAt: '2026-08-08',
    featured: false,
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
    tags: ['Accounting Engine', 'Double Entry', 'Rust Backend', 'Financial Kernel'],
    content: `
### 🏛️ Double-Entry Financial Kernel Architecture

At the heart of the Hfeit ecosystem lies **Hfe CORE** — an immutable double-entry financial ledger kernel engineered in Rust.

#### Core Financial Guarantees
- **Strict Debit = Credit Balance Invariant**: Every monetary event (POS cash settlement, QRIS clearing, inventory shrinkage, supplier bill) produces balanced journal entries.
- **Tenant 01 vs Tenant 02 Boundary**: Master business entities remain securely in Tenant 01 while ecosystem data flows through Tenant 02 without data collision.
- **Indonesian Tax Engine Integration**: Native generation of DJP E-Faktur Kode 01/08 XML documents and TER PPh 21 payroll tax schedules per PMK 168/2023.
`
  },
  {
    id: 'art-005',
    title: 'Single-Door Merchant Configuration & Micro-SaaS Architectural Isolation',
    slug: 'single-door-merchant-config-micro-saas-isolation',
    summary: 'Consolidating multi-tenant merchant settings, tax rates, and feature toggles into a single unified context.',
    category: 'Product Updates',
    author: {
      name: 'Hfeit Product Architecture',
      role: 'Platform Product Lead',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '7 min read',
    publishedAt: '2026-08-04',
    featured: false,
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    tags: ['Merchant Config', 'Single Door', 'SaaS Architecture', 'React Context'],
    content: `
### ⚙️ Single-Door Merchant Config Standard

Fragmenting merchant options across multiple scattered state containers creates synchronization bugs and inconsistent UI rules.

#### Key Architectural Pillars
- **Single Source of Truth (\`MerchantConfigContext\`)**: Taxes (PB1 10%), Service Charges, Order Flow modes (*Pay-First* vs *Open-Tab*), and Theme Presets are resolved from one unified hook.
- **Effective Theme Cascade**: Customer-facing mobile ordering and cashier POS surfaces inherit merchant theme tokens seamlessly while maintaining high-contrast accessibility.
`
  }
]
