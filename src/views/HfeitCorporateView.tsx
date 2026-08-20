import React, { useState } from 'react'
import {
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  Sparkles,
  Search,
  Tag,
  Clock,
  User,
  ChevronRight,
  ExternalLink,
  Store,
  CreditCard,
  Building2,
  Receipt,
  Layers,
  Globe,
  Cpu,
  Mail,
  CheckCircle2,
  X
} from 'lucide-react'
import { HFEIT_ARTICLES, HfeitArticle } from '../data/mockArticlesData'

export interface HfeitCorporateViewProps {
  onNavigateToApp?: (app: string) => void
}

export const HfeitCorporateView: React.FC<HfeitCorporateViewProps> = ({ onNavigateToApp }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ecosystem' | 'solutions' | 'blog'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeArticle, setActiveArticle] = useState<HfeitArticle | null>(null)
  const [activeEcosystemProduct, setActiveEcosystemProduct] = useState<string>('POS.Hfeit')

  const categories = ['All', 'UX & Design Rules', 'Engineering & Architecture', 'Product Updates', 'Case Studies']

  const filteredArticles = HFEIT_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesSearch
  })

  const ecosystemProducts = [
    {
      id: 'POS.Hfeit',
      tagline: 'Run the Business',
      role: 'Operational business experience for POS cashiers, KDS kitchens, waiters, & outlet management.',
      icon: Store,
      color: 'from-amber-500 to-orange-500',
      features: ['Unified POS Workstation', '1-Tap Direct Add', 'Kitchen Display System (KDS)', 'QR Self-Ordering']
    },
    {
      id: 'BOOK.Hfeit',
      tagline: 'Control the Books',
      role: 'Standalone-ready advanced accounting & financial control experience including close & reconciliation.',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      features: ['General Ledger & COA', 'DJP E-Faktur Kode 01/08 XML', 'TER PPh 21 Calculator', 'Bank Feeds & Auto-Reconcile']
    },
    {
      id: 'ADMIN.Hfeit',
      tagline: 'Manage the Business',
      role: 'Customer-facing administration for organizations, members, roles, locations, & subscriptions.',
      icon: Building2,
      color: 'from-blue-500 to-indigo-500',
      features: ['Multi-Branch Management', 'Staff RBAC & PIN', 'Single-Door Merchant Config', 'Audit Trail Logs']
    },
    {
      id: 'CARD.Hfeit',
      tagline: 'Be Known',
      role: 'Person-centric portable relationship identity across Life (Customer) and Work (Employee) contexts.',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
      features: ['Life & Work Contexts', 'Merchant Loyalty Wallet', 'Employee Identity Pass', 'Zero-Privacy Leakage']
    },
    {
      id: 'BOARD.Hfeit',
      tagline: 'Be Found',
      role: 'Business and merchant presence, discovery, and digital storefront experience.',
      icon: Globe,
      color: 'from-cyan-500 to-blue-500',
      features: ['Brand Landing Page (/username)', 'Public Catalog Engine', 'Location & Hours', 'SEO Optimization']
    },
    {
      id: 'ORDER.Hfeit',
      tagline: 'Do Business',
      role: 'Customer ordering and online-to-offline transaction experience across web & mobile.',
      icon: Receipt,
      color: 'from-rose-500 to-red-500',
      features: ['Dine-In QR Scan', 'Takeaway & Delivery', 'SNAP QRIS Payment', 'Digital Receipt Delivery']
    }
  ]

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* BACKGROUND GRID OVERLAY */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(31, 36, 48, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(31, 36, 48, 0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* AMBER GLOW RADIAL EFFECT */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* TOP CORPORATE NAV BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B0C10]/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* BRAND LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-slate-950 text-xl tracking-tighter">
              Hf
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white font-heading">
                H<span className="text-amber-400">fe</span>it
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-mono font-semibold text-slate-400 bg-slate-800/60 rounded border border-slate-700/50">
                Corporate
              </span>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition-colors">Perusahaan</a>
            <a href="#ecosystem" className="hover:text-amber-400 transition-colors">Ekosistem EXP.Hfeit</a>
            <a href="#solutions" className="hover:text-amber-400 transition-colors">Solusi Industri</a>
            <a href="#journal" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>Journal & Blog</span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                5 Articles
              </span>
            </a>
          </nav>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToApp?.('cafe')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95"
            >
              <span>Buka POS Workstation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="about" className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-amber-400 mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HFE IT — Official Corporate Website</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto font-heading leading-tight sm:leading-none">
          Powering Modern Commerce & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            Financial Accounting Truth
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          HFE IT membangun ekosistem perdagangan digital dan mesin keuangan headless (<span className="font-semibold text-slate-200">Hfe CORE</span>) yang menggerakkan operasional kasir, akuntansi neraca, dan identitas bisnis secara mulus.
        </p>

        {/* BRAND PHILOSOPHY PILLARS */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-amber-400 font-mono font-bold text-lg">H</div>
            <div className="text-xs font-semibold text-slate-200 mt-1">Pillar (Fondasi)</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-snug">Struktur fondasi bisnis yang kokoh & teruji.</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-amber-400 font-mono font-bold text-lg">fe</div>
            <div className="text-xs font-semibold text-slate-200 mt-1">Ferrum (Iron)</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-snug">Kekuatan, keandalan, & ketahanan sistem.</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-amber-400 font-mono font-bold text-lg">IT</div>
            <div className="text-xs font-semibold text-slate-200 mt-1">Technology / Have It</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-snug">Teknologi modern yang siap digunakan.</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-amber-400 font-mono font-bold text-lg">Faith</div>
            <div className="text-xs font-semibold text-slate-200 mt-1">Kepercayaan Bisnis</div>
            <div className="text-[11px] text-slate-400 mt-1 leading-snug">Keyakinan yang dibangun atas kebenaran akuntansi.</div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM SECTION (EXP.Hfeit) */}
      <section id="ecosystem" className="relative z-10 py-16 bg-slate-950/60 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">EXP.Hfeit Experience Layer</div>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white mt-2">
              Ekosistem Produk Terpadu Hfeit
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Enam produk khusus yang dirancang untuk mengelola seluruh spektrum operasional dan keuangan bisnis Anda.
            </p>
          </div>

          {/* ECOSYSTEM PRODUCT GRID */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemProducts.map((prod) => {
              const Icon = prod.icon
              const isSelected = activeEcosystemProduct === prod.id
              return (
                <div
                  key={prod.id}
                  onClick={() => setActiveEcosystemProduct(prod.id)}
                  className={`p-6 rounded-3xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/50 shadow-xl shadow-amber-500/10'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${prod.color} flex items-center justify-center text-slate-950 shadow-md font-bold`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      {prod.tagline}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-heading mt-5">{prod.id}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{prod.role}</p>

                  <ul className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                    {prod.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* JOURNAL & BLOG SECTION */}
      <section id="journal" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">Engineering & Design Journal</div>
            <h2 className="text-3xl font-bold font-heading text-white mt-1">
              Artikel Standar Design & Arsitektur Sistem
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              Publikasi teknis mengenai UX Heuristics F&B, arsitektur ledger akuntansi ganda, dan standar desain antarmuka modern Hfeit.
            </p>
          </div>

          {/* SEARCH BOX */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FEATURED ARTICLE (IF ALL CATEGORIES SELECTED & NO SEARCH) */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="mt-8">
            {HFEIT_ARTICLES.filter((a) => a.featured).map((featArt) => (
              <div
                key={featArt.id}
                onClick={() => setActiveArticle(featArt)}
                className="group relative rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden hover:border-amber-500/50 transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 shadow-2xl"
              >
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {featArt.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featArt.readTime}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-4 group-hover:text-amber-400 transition-colors leading-snug">
                      {featArt.title}
                    </h3>

                    <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                      {featArt.summary}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <img src={featArt.author.avatar} alt={featArt.author.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{featArt.author.name}</div>
                        <div className="text-[11px] text-slate-400">{featArt.author.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>Baca Artikel</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src={featArt.heroImage}
                    alt={featArt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ARTICLES GRID */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles
            .filter((a) => selectedCategory !== 'All' || searchQuery || !a.featured)
            .map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between p-5"
              >
                <div>
                  <div className="h-44 rounded-2xl overflow-hidden relative mb-4">
                    <img
                      src={art.heroImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-800">
                      {art.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-2">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                    <span>•</span>
                    <span>{art.publishedAt}</span>
                  </div>

                  <h4 className="text-base font-bold text-white font-heading group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h4>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={art.author.avatar} alt={art.author.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-[11px] font-medium text-slate-300">{art.author.name}</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ARTICLE READER MODAL DRAWER */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#0B0C10] border border-slate-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-10">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {activeArticle.category}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white mt-4 leading-snug">
              {activeArticle.title}
            </h1>

            <div className="mt-6 flex items-center gap-3 pb-6 border-b border-slate-800">
              <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
              <div>
                <div className="text-sm font-semibold text-slate-200">{activeArticle.author.name}</div>
                <div className="text-xs text-slate-400">{activeArticle.author.role} • {activeArticle.publishedAt}</div>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="my-6 rounded-2xl overflow-hidden h-64 sm:h-80">
              <img src={activeArticle.heroImage} alt={activeArticle.title} className="w-full h-full object-cover" />
            </div>

            {/* CONTENT */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              {activeArticle.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="text-xl font-bold text-white font-heading mt-6 mb-2">{paragraph.replace('### ', '')}</h3>
                }
                if (paragraph.startsWith('#### ')) {
                  return <h4 key={idx} className="text-lg font-bold text-amber-400 font-heading mt-4 mb-2">{paragraph.replace('#### ', '')}</h4>
                }
                return <p key={idx}>{paragraph}</p>
              })}
            </div>

            {/* TAGS */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-amber-400" />
              {activeArticle.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 py-12 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">Hf</div>
            <span className="font-semibold text-slate-300">HFE IT — Hfeit Ecosystem</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Kontak Resmi: <a href="mailto:exp@hfeit.com" className="text-amber-400 hover:underline">exp@hfeit.com</a></span>
            <span>•</span>
            <span>Engine: <a href="mailto:hello@hfecore.com" className="text-slate-300 hover:underline">hello@hfecore.com</a></span>
          </div>

          <div>
            © 2026 HFE IT. All rights reserved. hfeit.com
          </div>
        </div>
      </footer>
    </div>
  )
}
