import React, { useState } from 'react'
import {
  Layers,
  CheckCircle2,
  XCircle,
  Code2,
  Smartphone,
  ArrowRight,
  Copy,
  CheckCheck,
  Sparkles
} from 'lucide-react'
import { PRODUCT_CATALOG } from '../data/mockData'
import { COMPONENT_REGISTRY } from '../data/componentRegistryData'
import { useViewport } from '../context/ViewportContext'

export const ComponentShowcaseView: React.FC = () => {
  const { isMobile } = useViewport()
  const [selectedId, setSelectedId] = useState<string>(COMPONENT_REGISTRY[0].id)
  const [activeTab, setActiveTab] = useState<'preview' | 'rules' | 'code'>('preview')
  const [copied, setCopied] = useState<boolean>(false)

  const activeDoc = COMPONENT_REGISTRY.find((c) => c.id === selectedId) || COMPONENT_REGISTRY[0]

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeDoc.snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. CLEAN LIVING DESIGN SYSTEM & RULEBOOK HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 shadow-xl shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shadow-inner shrink-0">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xs sm:text-sm font-black text-white truncate">
                {isMobile ? 'HFE Living Design System' : 'HFE Living Design System & Rulebook'}
              </h1>
              <span className="text-[9px] sm:text-[10px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-mono uppercase shrink-0">
                SSOT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              Single Source of Truth spesifikasi & aturan komponen UI F&B.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500 shrink-0">
          v1.0 • SSOT Rulebook
        </div>
      </header>

      {/* 2. MAIN SHOWCASE CONTAINER (RESPONSIVE 1-COL OR 2-COL) */}
      <div className={`flex-1 max-w-7xl w-full mx-auto p-2.5 sm:p-6 flex flex-col ${
        isMobile ? 'gap-3' : 'grid grid-cols-1 lg:grid-cols-12 gap-6'
      }`}>
        {/* MOBILE COMPONENT SELECTOR DROPDOWN (1-COLUMN ON HP) */}
        {isMobile ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center justify-between gap-2 shadow-md">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                aria-label="Pilih Komponen SSOT"
                className="bg-transparent text-xs font-black text-white outline-none cursor-pointer w-full truncate"
              >
                {COMPONENT_REGISTRY.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white font-bold">
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg shrink-0">
              SSOT
            </span>
          </div>
        ) : (
          /* DESKTOP SIDEBAR: COMPONENT CATALOG LIST */
          <aside className="lg:col-span-4 flex flex-col gap-2.5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Katalog Komponen SSOT ({COMPONENT_REGISTRY.length})
              </h3>
              <div className="flex flex-col gap-1.5">
                {COMPONENT_REGISTRY.map((comp) => {
                  const isSelected = comp.id === selectedId
                  return (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => setSelectedId(comp.id)}
                      className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg scale-[1.01]'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs truncate">{comp.title}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono block truncate ${
                            isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {comp.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                          isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        SSOT
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>
        )}

        {/* MAIN SANDBOX & DOS/DON'TS AREA */}
        <main className={isMobile ? 'flex flex-col gap-3' : 'lg:col-span-8 flex flex-col gap-4'}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 sm:p-6 shadow-2xl flex flex-col gap-4">
            {/* COMPONENT TITLE & METADATA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl font-black text-white truncate">{activeDoc.title}</h2>
                  <span className="text-[10px] sm:text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold shrink-0">
                    {activeDoc.category}
                  </span>
                </div>
                <p className="text-[11px] text-amber-400 font-mono font-bold mt-0.5 truncate">{activeDoc.ruleRef}</p>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{activeDoc.description}</p>
              </div>

              {/* TABS SWITCHER (SYMMETRIC GRID ON ALL VIEWPORTS) */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'preview' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 shrink-0" /> Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rules')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'rules' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Aturan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'code' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 shrink-0" /> Code
                </button>
              </div>
            </div>

            {/* TAB 1: LIVE ISOLATED SANDBOX PREVIEW */}
            {activeTab === 'preview' && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>📱 Viewport Sandbox: Smartphone (380px)</span>
                  <span className="text-emerald-400 font-bold">● Live Rendered</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5 sm:p-6 flex justify-center items-center shadow-inner overflow-hidden">
                  <div className="w-full max-w-[380px] bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl">
                    {activeDoc.id === 'payment-method-grid' && (
                      <div className="grid grid-cols-3 gap-1.5">
                        <button className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 bg-white text-slate-950 font-extrabold shadow-md whitespace-nowrap">
                          <span>💵 Cash</span>
                        </button>
                        <button className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 bg-slate-950 border-slate-800 text-slate-400 whitespace-nowrap">
                          <span>🔲 QRIS</span>
                        </button>
                        <button className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 bg-slate-950 border-slate-800 text-slate-400 whitespace-nowrap">
                          <span>💳 Kartu</span>
                        </button>
                      </div>
                    )}

                    {activeDoc.id === 'product-card' && (
                      <div className="border border-slate-800/80 p-2.5 flex gap-2.5 rounded-2xl bg-slate-950 shadow-lg">
                        <img
                          src={PRODUCT_CATALOG[9].image}
                          alt="Dark Chocolate"
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs text-slate-100 truncate">{PRODUCT_CATALOG[9].name}</h4>
                            <span className="text-xs font-bold font-mono text-amber-400 whitespace-nowrap shrink-0">
                              Rp {PRODUCT_CATALOG[9].price.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{PRODUCT_CATALOG[9].description}</p>
                          <div className="flex justify-end mt-1">
                            <button className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              + Tambah
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeDoc.id === 'table-status-card' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border border-amber-500/60 bg-amber-500/10 rounded-2xl p-2.5 flex flex-col justify-between h-28 relative overflow-hidden">
                          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500" />
                          <div className="flex items-center justify-between gap-1 pl-1">
                            <span className="font-mono font-bold text-xs text-white truncate">MEJA-04</span>
                            <span className="text-[9px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                              ⏳ Tagihan
                            </span>
                          </div>
                          <div className="pl-1">
                            <p className="text-slate-300 text-[11px] font-semibold truncate">Aldi (2 Tamu)</p>
                            <p className="font-mono text-xs font-black text-amber-400">Rp 86.000</p>
                          </div>
                        </div>

                        <div className="border border-indigo-500/60 bg-indigo-500/10 rounded-2xl p-2.5 flex flex-col justify-between h-28 relative overflow-hidden">
                          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-indigo-500" />
                          <div className="flex items-center justify-between gap-1 pl-1">
                            <span className="font-mono font-bold text-xs text-white truncate">MEJA-02</span>
                            <span className="text-[9px] font-black bg-indigo-500 text-white px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                              ✅ Lunas
                            </span>
                          </div>
                          <div className="pl-1">
                            <p className="text-slate-300 text-[11px] font-semibold truncate">Sarah (Lunas)</p>
                            <p className="font-mono text-xs font-black text-indigo-300">Rp 0 (PAID)</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeDoc.id === 'floating-cart-dock' && (
                      <div className="bg-slate-950 border border-amber-500/60 rounded-2xl px-3 py-2 flex items-center justify-between font-bold min-h-[50px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-mono font-black text-xs relative shrink-0">
                            🛒
                          </div>
                          <div className="flex flex-col text-left leading-tight min-w-0">
                            <span className="text-[9px] uppercase font-bold text-slate-400">Keranjang (3)</span>
                            <h4 className="text-xs font-black font-mono text-amber-400 whitespace-nowrap">Rp 124.600</h4>
                          </div>
                        </div>
                        <button className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1">
                          <span>Checkout</span> <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {activeDoc.id === 'card-settlement-edc' && (
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-inner">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-extrabold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-md font-mono shrink-0">
                            VISA
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-200 truncate">
                            BCA EDC • 4123-***-789
                          </span>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                          Auto-Detected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DO'S & DON'TS EXPLICIT RULES */}
            {activeTab === 'rules' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                {/* 🟢 DO'S */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col gap-2.5">
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> 🟢 Aturan Wajib (DO'S)
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {activeDoc.dos.map((doItem, idx) => (
                      <li key={idx} className="text-xs text-emerald-200/90 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-400 font-bold shrink-0">•</span>
                        <span>{doItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 🔴 DON'TS */}
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-3.5 flex flex-col gap-2.5">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 shrink-0" /> 🔴 Aturan Haram (DON'TS)
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {activeDoc.donts.map((dontItem, idx) => (
                      <li key={idx} className="text-xs text-rose-200/90 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-rose-400 font-bold shrink-0">•</span>
                        <span>{dontItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: PRODUCTION CANONICAL CODE */}
            {activeTab === 'code' && (
              <div className="flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Canonical React / Tailwind Snippet:</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-amber-300 overflow-x-auto">
                  <code>{activeDoc.snippet}</code>
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
