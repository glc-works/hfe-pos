import React from 'react'
import { Search, X, Layers, Maximize2, MousePointer, Sparkles, Tag, Code } from 'lucide-react'

export interface HoveredElementInfo {
  tagName: string
  componentHint?: string
  textPreview?: string
  dimensions: { width: number; height: number; top: number; left: number }
  classes: string[]
  attributes: Record<string, string>
  isClickable: boolean
}

export interface DevInspectorHudProps {
  hoveredElementInfo: HoveredElementInfo | null
  isInspectMode: boolean
  onToggleInspectMode: () => void
  onClose: () => void
}

export const DevInspectorHud: React.FC<DevInspectorHudProps> = ({
  hoveredElementInfo,
  isInspectMode,
  onToggleInspectMode,
  onClose
}) => {
  if (!isInspectMode) return null

  return (
    <aside className="w-72 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-3xl p-3.5 flex flex-col gap-3 shadow-2xl text-slate-100 shrink-0 h-[640px] max-h-[85vh] overflow-hidden select-none my-auto transition-all">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold shrink-0">
            <Search className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-white truncate">Live Inspector</h4>
            <p className="text-[10px] text-cyan-400 font-mono font-bold truncate">● Hover Active (60 FPS)</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Tutup Inspector"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-3">
        {hoveredElementInfo ? (
          <>
            {/* 1. TAG NAME & HINT */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  &lt;{hoveredElementInfo.tagName.toLowerCase()}&gt;
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  hoveredElementInfo.isClickable
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <MousePointer className="w-2.5 h-2.5" />
                  {hoveredElementInfo.isClickable ? 'Clickable' : 'Static'}
                </span>
              </div>

              {hoveredElementInfo.componentHint && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 truncate mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{hoveredElementInfo.componentHint}</span>
                </div>
              )}
            </div>

            {/* 2. PIXEL DIMENSIONS BOX */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-indigo-400" /> Bounding Dimensions
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-xs">
                <div className="bg-slate-900 px-2 py-1 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Lebar: </span>
                  <span className="font-bold text-indigo-300">{Math.round(hoveredElementInfo.dimensions.width)}px</span>
                </div>
                <div className="bg-slate-900 px-2 py-1 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Tinggi: </span>
                  <span className="font-bold text-indigo-300">{Math.round(hoveredElementInfo.dimensions.height)}px</span>
                </div>
              </div>
            </div>

            {/* 3. TEXT SNIPPET PREVIEW */}
            {hoveredElementInfo.textPreview && (
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-col gap-1 shadow-sm">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-400" /> Content Preview
                </span>
                <p className="text-xs text-slate-200 font-medium italic bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 break-words">
                  "{hoveredElementInfo.textPreview}"
                </p>
              </div>
            )}

            {/* 4. ATTRIBUTES / PROPS */}
            {Object.keys(hoveredElementInfo.attributes).length > 0 && (
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-col gap-1.5 shadow-sm">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
                  <Code className="w-3 h-3 text-amber-400" /> Attributes
                </span>
                <div className="flex flex-col gap-1">
                  {Object.entries(hoveredElementInfo.attributes).map(([key, val]) => (
                    <div key={key} className="text-[11px] font-mono flex items-start gap-1 bg-slate-900 p-1.5 rounded-lg border border-slate-800/60 break-all">
                      <span className="text-cyan-400 font-bold">{key}=</span>
                      <span className="text-amber-300 font-medium">"{val}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TAILWIND UTILITY CLASSES */}
            {hoveredElementInfo.classes.length > 0 && (
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex flex-col gap-1.5 shadow-sm">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-400" /> Tailwind Classes ({hoveredElementInfo.classes.length})
                </span>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto no-scrollbar pt-1">
                  {hoveredElementInfo.classes.map((cls, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded-md">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* EMPTY HOVER STATE */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 gap-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
              <MousePointer className="w-5 h-5 animate-bounce" />
            </div>
            <p className="text-xs font-bold text-slate-300">Arahkan Kursor ke Device</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hover tombol, kartu meja, atau teks di dalam HP untuk melihat data komponen live.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER TOGGLE */}
      <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-[10px]">DevKit v2.1</span>
        <button
          type="button"
          onClick={onToggleInspectMode}
          className="text-cyan-400 hover:text-cyan-300 font-bold transition-all"
        >
          Nonaktifkan
        </button>
      </div>
    </aside>
  )
}
