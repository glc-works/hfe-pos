import React, { useState } from 'react'
import { Delete, RotateCcw } from 'lucide-react'

export interface EmployeePinKeypadProps {
  onPinComplete?: (pin: string) => void
  onPinChange?: (pin: string) => void
  maxLength?: number
  disabled?: boolean
}

export const EmployeePinKeypad: React.FC<EmployeePinKeypadProps> = ({
  onPinComplete,
  onPinChange,
  maxLength = 6,
  disabled = false,
}) => {
  const [pin, setPin] = useState<string>('')

  const handleKeyPress = (num: string) => {
    if (disabled || pin.length >= maxLength) return
    const nextPin = pin + num
    setPin(nextPin)
    if (onPinChange) onPinChange(nextPin)

    if (nextPin.length === maxLength && onPinComplete) {
      onPinComplete(nextPin)
    }
  }

  const handleDelete = () => {
    if (disabled || pin.length === 0) return
    const nextPin = pin.slice(0, -1)
    setPin(nextPin)
    if (onPinChange) onPinChange(nextPin)
  }

  const handleClear = () => {
    if (disabled) return
    setPin('')
    if (onPinChange) onPinChange('')
  }

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center">
      {/* PIN Digit Indicators */}
      <div className="flex justify-center items-center space-x-3 my-4">
        {Array.from({ length: maxLength }).map((_, idx) => (
          <div
            key={idx}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
              idx < pin.length
                ? 'bg-amber-600 border-amber-600 scale-110 shadow-sm'
                : 'border-slate-300 bg-white'
            }`}
          />
        ))}
      </div>

      {/* 3x4 Numeric Keypad Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            type="button"
            disabled={disabled}
            onClick={() => handleKeyPress(num)}
            className="h-14 rounded-xl bg-slate-100 hover:bg-amber-100 active:bg-amber-200 text-slate-800 text-2xl font-bold transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          disabled={disabled || pin.length === 0}
          onClick={handleClear}
          className="h-14 rounded-xl bg-slate-100 hover:bg-red-100 active:bg-red-200 text-red-600 text-sm font-semibold flex items-center justify-center transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset PIN"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleKeyPress('0')}
          className="h-14 rounded-xl bg-slate-100 hover:bg-amber-100 active:bg-amber-200 text-slate-800 text-2xl font-bold transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          0
        </button>
        <button
          type="button"
          disabled={disabled || pin.length === 0}
          onClick={handleDelete}
          className="h-14 rounded-xl bg-slate-100 hover:bg-amber-100 active:bg-amber-200 text-slate-700 text-sm font-semibold flex items-center justify-center transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Hapus"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
