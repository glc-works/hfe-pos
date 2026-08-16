import React, { useState, useRef, useEffect } from 'react'
import {
  Palette,
  Check,
  Sparkles,
  Download,
  Upload,
  Copy,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Bookmark,
  ShoppingBag,
  Plus,
  Trash2,
  Layers,
  Code,
  Store
} from 'lucide-react'
import { CafeThemeConfig } from '../../types/pos'
import { MarketplaceThemeGallery } from './MarketplaceThemeGallery'
import { SaveCustomThemeModal } from './SaveCustomThemeModal'
import { AiThemePromptModal } from './AiThemePromptModal'
import { MerchantStorefrontCustomizerModal } from './MerchantStorefrontCustomizerModal'

export interface ThemeConfigSectionProps {
  builtinThemes: CafeThemeConfig[]
  activeTheme: CafeThemeConfig
  setActiveTheme: (theme: CafeThemeConfig) => void
  merchantTheme?: CafeThemeConfig
  setMerchantTheme?: (theme: CafeThemeConfig) => void
  aiStylesheetInput: string
  setAiStylesheetInput: (val: string) => void
  handleExportThemeFile: () => void
  handleImportThemeFile: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleApplyAIThemeString: () => void
}

export const ThemeConfigSection: React.FC<ThemeConfigSectionProps> = ({
  builtinThemes,
  activeTheme,
  setActiveTheme,
  merchantTheme = builtinThemes[4] || builtinThemes[0],
  setMerchantTheme,
  aiStylesheetInput,
  setAiStylesheetInput,
  handleExportThemeFile,
  handleImportThemeFile,
  handleApplyAIThemeString
}) => {
  const [targetScope, setTargetScope] = useState<'customer' | 'merchant'>('customer')
  const [galleryTab, setGalleryTab] = useState<'builtin' | 'saved' | 'marketplace'>('builtin')
  const [filterMode, setFilterMode] = useState<'all' | 'light' | 'dark'>('all')
  const [showAiModal, setShowAiModal] = useState<boolean>(false)
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false)
  const [showStorefrontModal, setShowStorefrontModal] = useState<boolean>(false)
  const [newTemplateName, setNewTemplateName] = useState<string>('')
  const [showAdvancedJson, setShowAdvancedJson] = useState<boolean>(false)
  const [copiedJson, setCopiedJson] = useState<boolean>(false)
  const [copiedCss, setCopiedCss] = useState<boolean>(false)
  const [savedThemes, setSavedThemes] = useState<CafeThemeConfig[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hfe_custom_saved_templates')
      if (stored) {
        setSavedThemes(JSON.parse(stored))
      }
    } catch (e) {
      // ignore storage parse error
    }
  }, [])

  const currentTheme = targetScope === 'customer' ? activeTheme : merchantTheme

  const handleSelectTheme = (theme: CafeThemeConfig) => {
    if (targetScope === 'customer') {
      setActiveTheme(theme)
      try {
        localStorage.setItem('hfe_customer_theme', JSON.stringify(theme))
      } catch (e) {}
    } else if (setMerchantTheme) {
      setMerchantTheme(theme)
      try {
        localStorage.setItem('hfe_merchant_theme', JSON.stringify(theme))
      } catch (e) {}
    }
  }

  const handleSaveCurrentTemplate = () => {
    if (!newTemplateName.trim()) return
    const customTheme: CafeThemeConfig = {
      ...currentTheme,
      themeName: newTemplateName.trim()
    }
    const updated = [customTheme, ...savedThemes.filter((t) => t.themeName !== customTheme.themeName)]
    setSavedThemes(updated)
    try {
      localStorage.setItem('hfe_custom_saved_templates', JSON.stringify(updated))
    } catch (e) {}
    setShowSaveModal(false)
    setNewTemplateName('')
    handleSelectTheme(customTheme)
    alert(`🎉 Template "${customTheme.themeName}" berhasil disimpan ke Vault!`)
  }

  const handleDeleteSavedTemplate = (name: string) => {
    const updated = savedThemes.filter((t) => t.themeName !== name)
    setSavedThemes(updated)
    try {
      localStorage.setItem('hfe_custom_saved_templates', JSON.stringify(updated))
    } catch (e) {}
  }

  const handleCopyThemeJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentTheme, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
  }

  const handleCopyShadcnCss = () => {
    const cssString = `:root {
  --background: ${currentTheme.pageBgHex};
  --card: ${currentTheme.cardBgHex};
  --primary: ${currentTheme.primaryAccentHex};
  --foreground: ${currentTheme.textColorHex};
  --muted-foreground: ${currentTheme.textMutedHex || '#94a3b8'};
  --font-sans: ${currentTheme.fontFamily};
}`
    navigator.clipboard.writeText(cssString)
    setCopiedCss(true)
    setTimeout(() => setCopiedCss(false), 2000)
  }

  const filteredBuiltin = builtinThemes.filter((t) => {
    if (filterMode === 'light') return t.mode === 'light'
    if (filterMode === 'dark') return t.mode === 'dark'
    return true
  })

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl select-none">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Kustomisasi Tema & Marketplace
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Atur tema personal Menu Pelanggan (QR) & Layar Kasir dengan standar shadcn tokens.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setShowStorefrontModal(true)}
            className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-indigo-400" /> Studio Toko (Landing/QR)
          </button>
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" /> Simpan
          </button>
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Theming
          </button>
        </div>
      </div>

      {/* 1. TARGET SCOPE SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTargetScope('customer')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              targetScope === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Menu Pelanggan (QR)
          </button>
          <button
            type="button"
            onClick={() => setTargetScope('merchant')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              targetScope === 'merchant'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Layar Kasir POS
          </button>
        </div>

        {/* 3-TAB GALLERY NAVIGATOR */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setGalleryTab('builtin')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              galleryTab === 'builtin' ? 'bg-white text-slate-950 shadow font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Preset Bawaan
          </button>
          <button
            type="button"
            onClick={() => setGalleryTab('saved')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              galleryTab === 'saved' ? 'bg-white text-slate-950 shadow font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3 h-3 text-amber-500" /> Template Saya ({savedThemes.length})
          </button>
          <button
            type="button"
            onClick={() => setGalleryTab('marketplace')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              galleryTab === 'marketplace' ? 'bg-cyan-500 text-slate-950 shadow font-extrabold' : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <ShoppingBag className="w-3 h-3 text-cyan-400" /> Marketplace
          </button>
        </div>
      </div>

      {/* 2. THEMES GRID: TAB 1 (BUILT-IN PRESETS) */}
      {galleryTab === 'builtin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBuiltin.map((theme) => {
            const isSelected = currentTheme.themeName === theme.themeName
            return (
              <div
                key={theme.themeName}
                onClick={() => handleSelectTheme(theme)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 relative group ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/30 bg-slate-950 shadow-xl'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {/* MINI PREVIEW CANVAS */}
                <div
                  className="w-full h-20 rounded-xl p-2 flex flex-col justify-between border shadow-inner relative overflow-hidden"
                  style={{ backgroundColor: theme.pageBgHex, borderColor: `${theme.primaryAccentHex}30` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black" style={{ color: theme.textColorHex }}>
                      {theme.themeName}
                    </span>
                    <span
                      className="px-1.5 py-0.2 rounded text-[8px] font-bold"
                      style={{ backgroundColor: theme.primaryAccentHex, color: theme.mode === 'light' ? '#fff' : '#000' }}
                    >
                      + Tambah
                    </span>
                  </div>
                  <div
                    className="rounded-lg p-1 flex items-center justify-between border shadow-sm"
                    style={{ backgroundColor: theme.cardBgHex, borderColor: `${theme.primaryAccentHex}30` }}
                  >
                    <span className="text-[8px] font-bold" style={{ color: theme.textColorHex }}>🛒 Keranjang (1)</span>
                    <span className="text-[8px] font-bold font-mono" style={{ color: theme.primaryAccentHex }}>Rp 28.000</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: theme.primaryAccentHex }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: theme.pageBgHex }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: theme.cardBgHex }} />
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-500/20">
                      <Check className="w-2.5 h-2.5" /> Aktif
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 2. THEMES GRID: TAB 2 (SAVED CUSTOM TEMPLATES) */}
      {galleryTab === 'saved' && (
        <div className="flex flex-col gap-3">
          {savedThemes.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center gap-2">
              <Bookmark className="w-8 h-8 text-amber-500/60" />
              <p className="text-xs font-bold text-slate-200">Belum ada template kustom yang disimpan.</p>
              <p className="text-[11px] text-slate-500">
                Klik tombol "+ Simpan Template" di atas untuk menyimpan racikan warna aktif ke vault Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {savedThemes.map((theme) => {
                const isSelected = currentTheme.themeName === theme.themeName
                return (
                  <div
                    key={theme.themeName}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2.5 relative group ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/30 bg-slate-950 shadow-xl'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => handleSelectTheme(theme)}
                      className="w-full h-20 rounded-xl p-2 flex flex-col justify-between border shadow-inner cursor-pointer"
                      style={{ backgroundColor: theme.pageBgHex, borderColor: `${theme.primaryAccentHex}30` }}
                    >
                      <span className="text-[10px] font-black" style={{ color: theme.textColorHex }}>{theme.themeName}</span>
                      <div
                        className="rounded-lg p-1 flex items-center justify-between border"
                        style={{ backgroundColor: theme.cardBgHex, borderColor: `${theme.primaryAccentHex}30` }}
                      >
                        <span className="text-[8px] font-bold" style={{ color: theme.textColorHex }}>🛒 Keranjang</span>
                        <span className="text-[8px] font-bold font-mono" style={{ color: theme.primaryAccentHex }}>Rp 28.000</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: theme.primaryAccentHex }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: theme.pageBgHex }} />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSelectTheme(theme)}
                          className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-lg border border-slate-700"
                        >
                          {isSelected ? '✓ Terpasang' : 'Pasang'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedTemplate(theme.themeName)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Hapus Template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. THEMES GRID: TAB 3 (COMMUNITY THEME MARKETPLACE) */}
      {galleryTab === 'marketplace' && (
        <MarketplaceThemeGallery currentTheme={currentTheme} onSelectTheme={handleSelectTheme} />
      )}

      {/* ADVANCED THEME EXPORT / IMPORT (JSON & SHADCN CSS VARIABLES) */}
      <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowAdvancedJson(!showAdvancedJson)}
          className="flex items-center justify-between w-full text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ekspor / Impor JSON Stylesheet & shadcn CSS Variables</span>
          </span>
          {showAdvancedJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvancedJson && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3.5 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-300 font-bold">Stylesheet ({currentTheme.themeName}):</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyShadcnCss}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  {copiedCss ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy shadcn CSS</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyThemeJson}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  {copiedJson ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy JSON</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportThemeFile}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-amber-400" /> Ekspor (.json)
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Upload className="w-3 h-3 text-emerald-400" /> Impor (.json)
                </button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportThemeFile} className="hidden" />
              </div>
            </div>

            <textarea
              rows={4}
              value={aiStylesheetInput || JSON.stringify(currentTheme, null, 2)}
              onChange={(e) => setAiStylesheetInput(e.target.value)}
              placeholder="Paste JSON stylesheet di sini..."
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 shadow-inner"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleApplyAIThemeString}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Terapkan JSON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SAVE CUSTOM TEMPLATE MODAL */}
      <SaveCustomThemeModal
        show={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        templateName={newTemplateName}
        onChangeTemplateName={setNewTemplateName}
        onSave={handleSaveCurrentTemplate}
      />

      {/* AI THEME PROMPT MODAL */}
      <AiThemePromptModal show={showAiModal} onClose={() => setShowAiModal(false)} onApplyTheme={handleSelectTheme} />

      {/* STOREFRONT STUDIO CUSTOMIZER MODAL */}
      <MerchantStorefrontCustomizerModal
        isOpen={showStorefrontModal}
        onClose={() => setShowStorefrontModal(false)}
        initialTab="theme"
      />
    </div>
  )
}
