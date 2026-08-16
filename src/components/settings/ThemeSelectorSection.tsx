import React, { useState } from 'react'
import { Palette, Check, Sparkles, Download, Upload, Eye, ChevronDown, ChevronUp, Copy, CheckCheck } from 'lucide-react'
import { CafeThemeConfig } from '../../types/pos'
import { AiThemePromptModal } from './AiThemePromptModal'

export interface ThemeSelectorSectionProps {
  builtinThemes: CafeThemeConfig[]
  activeTheme: CafeThemeConfig
  setActiveTheme: (theme: CafeThemeConfig) => void
  aiStylesheetInput: string
  setAiStylesheetInput: (val: string) => void
  handleExportThemeFile: () => void
  handleImportThemeFile: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleApplyAIThemeString: () => void
  onPreviewCustomerQr?: () => void
}

export const ThemeSelectorSection: React.FC<ThemeSelectorSectionProps> = ({
  builtinThemes,
  activeTheme,
  setActiveTheme,
  aiStylesheetInput,
  setAiStylesheetInput,
  handleExportThemeFile,
  handleImportThemeFile,
  handleApplyAIThemeString,
  onPreviewCustomerQr
}) => {
  const [showAiModal, setShowAiModal] = useState<boolean>(false)
  const [showAdvancedJson, setShowAdvancedJson] = useState<boolean>(false)
  const [copiedJson, setCopiedJson] = useState<boolean>(false)

  const handleCopyThemeJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeTheme, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Tema & Tampilan Layar Pelanggan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih tema visual yang mencerminkan karakter dan atmosfer cafe Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Kustomisasi Warna Mood...
          </button>
        </div>
      </div>

      {/* HORIZONTAL GRID OF HIGH-FIDELITY THEME PRESET CARDS WITH MINI MOCKUPS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {builtinThemes.map((theme) => {
          const isActive = activeTheme.themeId === theme.themeId

          return (
            <div
              key={theme.themeId}
              onClick={() => setActiveTheme(theme)}
              className={`rounded-2xl border p-3.5 flex flex-col gap-3 cursor-pointer transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? 'bg-slate-800/90 border-amber-500 ring-2 ring-amber-500/40 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* ACTIVE CHECKMARK BADGE */}
              {isActive && (
                <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md z-10">
                  <Check className="w-3 h-3 stroke-[3]" /> Aktif
                </div>
              )}

              {/* MINIATURE MOBILE PREVIEW CANVAS */}
              <div 
                className="w-full h-36 rounded-xl border p-2.5 flex flex-col justify-between transition-colors shadow-inner overflow-hidden"
                style={{ 
                  backgroundColor: theme.pageBgHex, 
                  borderColor: `${theme.primaryAccentHex}30` 
                }}
              >
                {/* MINI HEADER */}
                <div 
                  className="rounded-lg p-1.5 flex items-center justify-between border"
                  style={{ 
                    backgroundColor: theme.cardBgHex, 
                    borderColor: `${theme.primaryAccentHex}25` 
                  }}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <div 
                      className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0 shadow-sm"
                      style={{ 
                        backgroundColor: theme.primaryAccentHex, 
                        color: theme.pageBgHex 
                      }}
                    >
                      ☕
                    </div>
                    <span className="text-[10px] font-bold truncate" style={{ color: theme.textColorHex }}>
                      {(theme.brandName || theme.themeName).split('&')[0]}
                    </span>
                  </div>
                  <span 
                    className="text-[8px] font-bold px-1 py-0.5 rounded font-mono shrink-0"
                    style={{ 
                      backgroundColor: theme.highlightBadgeBgHex, 
                      color: theme.highlightBadgeTextHex 
                    }}
                  >
                    Meja-04
                  </span>
                </div>

                {/* MINI PRODUCT CARD */}
                <div 
                  className="rounded-lg p-1.5 flex items-center justify-between border"
                  style={{ 
                    backgroundColor: theme.cardBgHex, 
                    borderColor: `${theme.primaryAccentHex}20` 
                  }}
                >
                  <div>
                    <p className="text-[10px] font-bold leading-tight" style={{ color: theme.textColorHex }}>
                      Aren Latte
                    </p>
                    <p className="text-[9px] font-mono font-bold" style={{ color: theme.primaryAccentHex }}>
                      Rp 28.000
                    </p>
                  </div>
                  <div 
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm"
                    style={{ 
                      backgroundColor: theme.primaryAccentHex, 
                      color: theme.pageBgHex 
                    }}
                  >
                    + Add
                  </div>
                </div>

                {/* MINI FLOATING CART BAR */}
                <div 
                  className="rounded-lg p-1 flex items-center justify-between border"
                  style={{ 
                    backgroundColor: theme.cardBgHex, 
                    borderColor: `${theme.primaryAccentHex}40` 
                  }}
                >
                  <span className="text-[8px] font-bold" style={{ color: theme.textColorHex }}>
                    🛒 Keranjang (1)
                  </span>
                  <span className="text-[8px] font-bold font-mono" style={{ color: theme.primaryAccentHex }}>
                    Rp 28.000
                  </span>
                </div>
              </div>

              {/* THEME INFO & COLOR PALETTE SWATCHES */}
              <div className="flex flex-col gap-1.5">
                <h4 className="text-xs font-bold text-white truncate">{theme.themeName}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" 
                      title={`Primary Accent: ${theme.primaryAccentHex}`}
                      style={{ backgroundColor: theme.primaryAccentHex }} 
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" 
                      title={`Card Surface: ${theme.cardBgHex}`}
                      style={{ backgroundColor: theme.cardBgHex }} 
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" 
                      title={`Page Background: ${theme.pageBgHex}`}
                      style={{ backgroundColor: theme.pageBgHex }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isActive ? 'Aktif Sekarang' : 'Klik Pilih'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* COLLAPSIBLE ADVANCED CUSTOMIZATION SECTION (FOR POWER USERS) */}
      <div className="border border-slate-800 rounded-2xl bg-slate-950/60 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvancedJson(!showAdvancedJson)}
          className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-900/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              ⚙️ Mode Kustomisasi Lanjutan (Export / Import Stylesheet JSON)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              Advanced Power-User
            </span>
          </div>
          {showAdvancedJson ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showAdvancedJson && (
          <div className="p-4 border-t border-slate-800 flex flex-col gap-3.5 bg-slate-900/40 animate-fadeIn">
            <p className="text-xs text-slate-400">
              Anda dapat meng-export stylesheet tema aktif sebagai file JSON, mengeditnya secara manual, atau meng-import tema kustom buatan sendiri.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportThemeFile}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> Download File Theme JSON
              </button>

              <button
                type="button"
                onClick={handleCopyThemeJson}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copiedJson ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> Tersalin ke Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy JSON Aktif
                  </>
                )}
              </button>

              <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-indigo-400" /> Upload File JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportThemeFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Atau Paste Teks JSON Stylesheet:
              </label>
              <textarea
                rows={4}
                value={aiStylesheetInput}
                onChange={(e) => setAiStylesheetInput(e.target.value)}
                placeholder='Paste JSON theme config di sini... Contoh: {"themeName": "Custom", "primaryAccentHex": "#f59e0b", ...}'
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyAIThemeString}
                  disabled={!aiStylesheetInput.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl font-bold text-xs transition-all shadow"
                >
                  Terapkan JSON Stylesheet ➔
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI THEME PROMPT MODAL */}
      <AiThemePromptModal
        show={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApplyTheme={(newTheme) => {
          setActiveTheme(newTheme)
        }}
      />
    </div>
  )
}
