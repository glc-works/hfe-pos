import React, { useState } from 'react'
import { Sparkles, X, Check, Palette, Wand2, ShieldCheck } from 'lucide-react'
import { CafeThemeConfig } from '../../types/pos'

export interface AiThemePromptModalProps {
  show: boolean
  onClose: () => void
  onApplyTheme: (theme: CafeThemeConfig) => void
}

interface LocalMoodPreset {
  id: string
  name: string
  emoji: string
  description: string
  primaryAccent: string
  cardBg: string
  pageBg: string
  textColor: string
  highlightBadgeBg: string
  highlightBadgeText: string
}

const LOCAL_MOOD_PRESETS: LocalMoodPreset[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    emoji: '🌌',
    description: 'Neon magenta & electric violet',
    primaryAccent: '#e879f9',
    cardBg: '#1e0b2b',
    pageBg: '#0d0414',
    textColor: '#fae8ff',
    highlightBadgeBg: '#d946ef25',
    highlightBadgeText: '#f0abfc'
  },
  {
    id: 'matcha',
    name: 'Kyoto Matcha Zen',
    emoji: '🍵',
    description: 'Serene forest green & jade',
    primaryAccent: '#34d399',
    cardBg: '#062b20',
    pageBg: '#021711',
    textColor: '#ecfdf5',
    highlightBadgeBg: '#10b98125',
    highlightBadgeText: '#6ee7b7'
  },
  {
    id: 'ocean',
    name: 'Pacific Ocean Teal',
    emoji: '🌊',
    description: 'Deep aqua cyan & marine',
    primaryAccent: '#22d3ee',
    cardBg: '#082730',
    pageBg: '#03141a',
    textColor: '#ecfeff',
    highlightBadgeBg: '#06b6d425',
    highlightBadgeText: '#67e8f9'
  },
  {
    id: 'roastery',
    name: 'Artisan Espresso Warm',
    emoji: '☕',
    description: 'Caramel amber & roastery wood',
    primaryAccent: '#fbbf24',
    cardBg: '#23140c',
    pageBg: '#130a06',
    textColor: '#fffbeb',
    highlightBadgeBg: '#f59e0b25',
    highlightBadgeText: '#fde68a'
  },
  {
    id: 'rose',
    name: 'Velvet Rose Gold',
    emoji: '🌸',
    description: 'Pastel rose & midnight plum',
    primaryAccent: '#fb7185',
    cardBg: '#240b15',
    pageBg: '#13040a',
    textColor: '#fff1f2',
    highlightBadgeBg: '#f43f5e25',
    highlightBadgeText: '#fecdd3'
  },
  {
    id: 'nordic',
    name: 'Nordic Slate Minimal',
    emoji: '🏔️',
    description: 'Clean crisp obsidian & silver',
    primaryAccent: '#f8fafc',
    cardBg: '#1e293b',
    pageBg: '#0b1120',
    textColor: '#f8fafc',
    highlightBadgeBg: '#ffffff20',
    highlightBadgeText: '#ffffff'
  }
]

export const AiThemePromptModal: React.FC<AiThemePromptModalProps> = ({
  show,
  onClose,
  onApplyTheme
}) => {
  const [selectedMood, setSelectedMood] = useState<LocalMoodPreset>(LOCAL_MOOD_PRESETS[0])
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [isGenerated, setIsGenerated] = useState<boolean>(false)

  if (!show) return null

  // 100% Offline Local Deterministic Palette Synthesizer (0 External API Calls / 0 Tokens)
  const handleSynthesizeLocalPalette = () => {
    const q = customPrompt.toLowerCase().trim()
    let generated: LocalMoodPreset

    if (q.includes('blue') || q.includes('laut') || q.includes('ocean') || q.includes('cyan')) {
      generated = {
        id: 'custom-ocean',
        name: customPrompt ? `Custom: ${customPrompt}` : 'Deep Blue Marine',
        emoji: '🌊',
        description: 'Algoritma palet biru laut lokal',
        primaryAccent: '#38bdf8',
        cardBg: '#0c2233',
        pageBg: '#05111c',
        textColor: '#f0f9ff',
        highlightBadgeBg: '#0284c725',
        highlightBadgeText: '#7dd3fc'
      }
    } else if (q.includes('green') || q.includes('hijau') || q.includes('alam') || q.includes('nature')) {
      generated = {
        id: 'custom-nature',
        name: customPrompt ? `Custom: ${customPrompt}` : 'Earthy Sage Green',
        emoji: '🌿',
        description: 'Algoritma palet sage alam lokal',
        primaryAccent: '#4ade80',
        cardBg: '#0e2916',
        pageBg: '#06170c',
        textColor: '#f0fdf4',
        highlightBadgeBg: '#16a34a25',
        highlightBadgeText: '#86efac'
      }
    } else if (q.includes('gold') || q.includes('kuning') || q.includes('sunset') || q.includes('orange')) {
      generated = {
        id: 'custom-sunset',
        name: customPrompt ? `Custom: ${customPrompt}` : 'Golden Sunset Aura',
        emoji: '🌅',
        description: 'Algoritma palet sunset hangat lokal',
        primaryAccent: '#fb923c',
        cardBg: '#2b170a',
        pageBg: '#170b04',
        textColor: '#fff7ed',
        highlightBadgeBg: '#ea580c25',
        highlightBadgeText: '#fdba74'
      }
    } else if (q.includes('pink') || q.includes('merah') || q.includes('purple') || q.includes('ungu')) {
      generated = {
        id: 'custom-purple',
        name: customPrompt ? `Custom: ${customPrompt}` : 'Royal Plum Velvet',
        emoji: '💜',
        description: 'Algoritma palet velvet elegan lokal',
        primaryAccent: '#c084fc',
        cardBg: '#230e38',
        pageBg: '#11051c',
        textColor: '#faf5ff',
        highlightBadgeBg: '#9333ea25',
        highlightBadgeText: '#d8b4fe'
      }
    } else {
      generated = selectedMood
    }

    setSelectedMood(generated)
    setIsGenerated(true)
  }

  const handleApply = () => {
    const newTheme: CafeThemeConfig = {
      version: '1.0',
      themeId: `theme-local-${selectedMood.id}-${Date.now()}`,
      themeName: selectedMood.name,
      brandName: 'Kopitiam Senopati & Roastery',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      primaryAccentHex: selectedMood.primaryAccent,
      primaryAccentHoverHex: selectedMood.primaryAccent,
      pageBgHex: selectedMood.pageBg,
      cardBgHex: selectedMood.cardBg,
      headerBgHex: `${selectedMood.cardBg}f5`,
      textColorHex: selectedMood.textColor,
      secondaryTextColorHex: '#94a3b8',
      highlightBadgeBgHex: selectedMood.highlightBadgeBg,
      highlightBadgeTextHex: selectedMood.highlightBadgeText,
      borderRadiusPx: 16
    }
    onApplyTheme(newTheme)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                Kustomisasi Warna Mood
              </h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Offline Local Engine (0 Biaya Token)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4 no-scrollbar">
          {/* SECTION 1: 1-TAP MOOD CHIPS */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wider">
              Pilih Mood Nuansa Cafe (1-Ketuk):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LOCAL_MOOD_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedMood(preset)
                    setIsGenerated(true)
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    selectedMood.id === preset.id
                      ? 'bg-slate-800 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg">{preset.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{preset.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0" style={{ backgroundColor: preset.primaryAccent }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0" style={{ backgroundColor: preset.cardBg }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0" style={{ backgroundColor: preset.pageBg }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: CUSTOM KEYWORD INPUT */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Atau Ketik Kata Kunci Nuansa:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSynthesizeLocalPalette()}
                placeholder="Contoh: nuansa pantai biru laut, hutan hijau..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSynthesizeLocalPalette}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Racik
              </button>
            </div>
          </div>

          {/* SECTION 3: LIVE PALETTE PREVIEW CARD */}
          <div className="border border-slate-800 rounded-2xl p-3 bg-slate-950 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preview Palet Terpilih:</span>
              <span className="text-xs font-bold text-amber-400">{selectedMood.name}</span>
            </div>

            {/* MINI SIMULATED MOBILE CARD WITH REAL ACCENT COLORS */}
            <div 
              className="rounded-xl p-3 border flex flex-col gap-2 transition-all shadow-inner"
              style={{ backgroundColor: selectedMood.pageBg, borderColor: `${selectedMood.primaryAccent}40` }}
            >
              {/* MINI HEADER */}
              <div 
                className="p-2 rounded-lg flex items-center justify-between border"
                style={{ backgroundColor: selectedMood.cardBg, borderColor: `${selectedMood.primaryAccent}30` }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" style={{ backgroundColor: selectedMood.primaryAccent, color: selectedMood.pageBg }}>
                    ☕
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: selectedMood.textColor }}>Kopitiam Senopati</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: selectedMood.highlightBadgeBg, color: selectedMood.highlightBadgeText }}>
                  Meja-04
                </span>
              </div>

              {/* MINI ITEM CARD */}
              <div 
                className="p-2 rounded-lg flex items-center justify-between border"
                style={{ backgroundColor: selectedMood.cardBg, borderColor: `${selectedMood.primaryAccent}25` }}
              >
                <div>
                  <p className="text-[11px] font-bold" style={{ color: selectedMood.textColor }}>Espresso Aren Latte</p>
                  <p className="text-[10px] font-bold font-mono" style={{ color: selectedMood.primaryAccent }}>Rp 28.000</p>
                </div>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold shadow-sm" style={{ backgroundColor: selectedMood.primaryAccent, color: selectedMood.pageBg }}>
                  + Tambah
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Terapkan Tema Ini ➔
          </button>
        </div>
      </div>
    </div>
  )
}
