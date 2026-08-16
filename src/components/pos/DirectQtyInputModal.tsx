import React, { useState, useEffect } from 'react'
import { X, Calculator, Check, RotateCcw } from 'lucide-react'

export interface DirectQtyInputModalProps {
  show: boolean
  onClose: () => void
  itemName?: string
  currentQty: number
  onConfirmQty: (newQty: number) => void
}

export const DirectQtyInputModal: React.FC<DirectQtyInputModalProps> = ({
  show,
  onClose,
  itemName,
  currentQty,
  onConfirmQty
}) => {
  const [inputValue, setInputValue] = useState<string>(currentQty.toString())

  useEffect(() => {
    if (show) {
      setInputValue(currentQty.toString())
    }
  }, [show, currentQty])

  if (!show) return null

  const handleKeyPress = (digit: string) => {
    if (inputValue === '0') {
      setInputValue(digit)
    } else {
      setInputValue(prev => prev + digit)
    }
  }

  const handleBackspace = () => {
    if (inputValue.length <= 1) {
      setInputValue('0')
    } else {
      setInputValue(prev => prev.slice(0, -1))
    }
  }

  const handleClear = () => {
    setInputValue('0')
  }

  const handleQuickAdd = (delta: number) => {
    const val = parseInt(inputValue || '0', 10) + delta
    setInputValue(Math.max(1, val).toString())
  }

  const handleSave = () => {
    const parsed = parseInt(inputValue, 10)
    const validQty = isNaN(parsed) || parsed < 1 ? 1 : parsed
    onConfirmQty(validQty)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs sm:max-w-sm w-full p-5 flex flex-col gap-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Input Jumlah (Qty) Direct</h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
              {itemName || 'Ubah Quantity Item'}
            </p>
          </div>
        </div>

        {/* DIRECT NUMBER DISPLAY & PHYSICAL KEYBOARD INPUT */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-semibold">Ketik Jumlah Langsung:</label>
          <div className="relative flex items-center">
            <input
              type="number"
              min="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
              }}
              autoFocus
              className="w-full bg-slate-950 border border-indigo-500/50 focus:border-indigo-400 text-right text-2xl font-mono font-bold text-emerald-400 p-3 rounded-xl focus:outline-none ring-2 ring-indigo-500/20"
            />
          </div>
        </div>

        {/* QUICK INCREMENT PRESETS */}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleQuickAdd(-10)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300 rounded-lg"
          >
            -10
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(-1)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-300 rounded-lg"
          >
            -1
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(1)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-indigo-300 rounded-lg"
          >
            +1
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(10)}
            className="py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-indigo-300 rounded-lg"
          >
            +10
          </button>
        </div>

        {/* TOUCH KEYPAD GRID */}
        <div className="grid grid-cols-3 gap-2">
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', '000'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="py-3 bg-slate-950 hover:bg-slate-800 text-base font-bold font-mono text-slate-200 rounded-xl border border-slate-800 transition-all active:scale-95"
            >
              {digit}
            </button>
          ))}
        </div>

        {/* CONTROL BUTTONS */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleBackspace}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 rounded-xl flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Backspace
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-400 rounded-xl border border-rose-500/30"
          >
            Reset (Clear)
          </button>
        </div>

        {/* CONFIRM BUTTON */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-1"
        >
          <Check className="w-4 h-4" /> Simpan Jumlah (Qty: {inputValue || '1'})
        </button>
      </div>
    </div>
  )
}
