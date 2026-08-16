import React, { useState, useEffect } from 'react'
import { X, Plus, Minus, Check } from 'lucide-react'
import { MenuItem, CartItem } from '../../types/pos'
import { shouldAllowItemCustomNotes } from '../../utils/modifierHelpers'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export interface ItemModifierModalProps {
  show: boolean
  onClose: () => void
  item: MenuItem | null
  onAddToCart: (configuredItem: CartItem) => void
}

export const ItemModifierModal: React.FC<ItemModifierModalProps> = ({
  show,
  onClose,
  item,
  onAddToCart
}) => {
  const { customerTheme } = useMerchantConfig()
  const isLight = customerTheme.mode === 'light'
  const textColor = customerTheme.textColorHex || (isLight ? '#0f172a' : '#f8fafc')
  const secondaryTextColor = customerTheme.secondaryTextColorHex || (isLight ? '#64748b' : '#94a3b8')
  const modalBg = isLight ? '#ffffff' : '#0f172a'
  const cardBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const subCardBg = isLight ? '#f8fafc' : 'rgba(2,6,23,0.7)'
  const subCardBorder = isLight ? '#e2e8f0' : '#1e293b'
  const inputBg = isLight ? '#ffffff' : '#020617'
  const inputBorder = isLight ? '#cbd5e1' : '#334155'
  const buttonInactiveBg = isLight ? '#ffffff' : '#020617'
  const buttonInactiveBorder = isLight ? '#cbd5e1' : '#1e293b'

  if (!show || !item) return null

  const isBeverage = item.category === 'Coffee' || item.category === 'Non-Coffee'
  const isOatProduct = item.name.toLowerCase().includes('oat')

  const [temperature, setTemperature] = useState<'Iced' | 'Hot'>('Iced')
  const [sugarLevel, setSugarLevel] = useState<'100%' | '50%' | '0%'>('100%')
  const [milkOption, setMilkOption] = useState<string>(isOatProduct ? 'Oat Milk' : 'Fresh Milk')
  const [quantity, setQuantity] = useState<number>(1)
  const [customNote, setCustomNote] = useState<string>('')

  // Reset state on item change
  useEffect(() => {
    if (item) {
      setTemperature('Iced')
      setSugarLevel('100%')
      setMilkOption(item.name.toLowerCase().includes('oat') ? 'Oat Milk' : 'Fresh Milk')
      setQuantity(1)
      setCustomNote('')
    }
  }, [item])

  // If item is already an Oat drink, Oat Milk has 0 extra cost; otherwise Fresh Milk is 0 and Oat Milk is +5000
  const extraMilkCost = !isOatProduct && milkOption.includes('Oat') ? 5000 : 0
  const unitPrice = item.price + extraMilkCost
  const totalPrice = unitPrice * quantity

  const handleConfirm = () => {
    const configuredItem: CartItem = {
      ...item,
      price: unitPrice,
      quantity,
      temperature: isBeverage ? temperature : undefined,
      sugarLevel: isBeverage ? sugarLevel : undefined,
      milkOption: isBeverage ? milkOption : undefined,
      customNotes: customNote.trim() || undefined
    }
    onAddToCart(configuredItem)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div 
        className="w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border animate-slideUp"
        style={{ backgroundColor: modalBg, borderColor: cardBorder }}
      >
        
        {/* HERO IMAGE BANNER (UBER EATS / APPLE HIG STANDARD) */}
        <div className="relative w-full h-48 sm:h-52 bg-slate-950 shrink-0">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Floating Translucent Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg transition-all"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PRODUCT DETAILS HEADER */}
        <div className="px-4 pt-3 pb-3 border-b flex flex-col gap-1" style={{ borderColor: cardBorder }}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold tracking-tight leading-snug" style={{ color: textColor }}>{item.name}</h3>
            <span className="text-sm font-mono font-bold shrink-0" style={{ color: customerTheme.primaryAccentHex }}>
              Rp {item.price.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: secondaryTextColor }}>{item.description}</p>
        </div>

        {/* MODIFIERS BODY */}
        <div className="p-4 overflow-y-auto flex flex-col gap-4 text-xs">
          {isBeverage && (
            <>
              {/* SUHU / TEMPERATURE */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-xs" style={{ color: textColor }}>Pilihan Suhu (Temperature):</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '❄️ Dingin (Iced)', val: 'Iced' as const },
                    { label: '🔥 Panas (Hot)', val: 'Hot' as const }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setTemperature(opt.val)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        temperature === opt.val
                          ? 'shadow-sm font-extrabold'
                          : ''
                      }`}
                      style={
                        temperature === opt.val
                          ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: customerTheme.primaryAccentHex }
                          : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
                      }
                    >
                      {temperature === opt.val && <Check className="w-3.5 h-3.5" />}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TINGKAT GULA / SUGAR LEVEL */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-xs" style={{ color: textColor }}>Tingkat Manis (Sugar Level):</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Normal (100%)', val: '100%' as const },
                    { label: 'Less (50%)', val: '50%' as const },
                    { label: 'No Sugar (0%)', val: '0%' as const }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setSugarLevel(opt.val)}
                      className={`py-2.5 px-2 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                        sugarLevel === opt.val
                          ? 'shadow-sm font-extrabold'
                          : ''
                      }`}
                      style={
                        sugarLevel === opt.val
                          ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: customerTheme.primaryAccentHex }
                          : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
                      }
                    >
                      {sugarLevel === opt.val && <Check className="w-3 h-3" />}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PILIHAN SUSU / MILK SUBSTITUTE */}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-xs" style={{ color: textColor }}>Pilihan Susu (Dairy Option):</span>
                <div className="grid grid-cols-2 gap-2">
                  {isOatProduct ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMilkOption('Oat Milk')}
                        className="py-2.5 px-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                        style={
                          milkOption === 'Oat Milk'
                            ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: customerTheme.primaryAccentHex }
                            : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
                        }
                      >
                        {milkOption === 'Oat Milk' && <Check className="w-3.5 h-3.5" />}
                        <span>🌾 Oatside (Default)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMilkOption('Fresh Milk')}
                        className="py-2.5 px-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                        style={
                          milkOption === 'Fresh Milk'
                            ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: customerTheme.primaryAccentHex }
                            : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
                        }
                      >
                        {milkOption === 'Fresh Milk' && <Check className="w-3.5 h-3.5" />}
                        <span>🥛 Fresh Milk (Standard)</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setMilkOption('Fresh Milk')}
                        className="py-2.5 px-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                        style={
                          milkOption === 'Fresh Milk'
                            ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: customerTheme.primaryAccentHex }
                            : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
                        }
                      >
                        {milkOption === 'Fresh Milk' && <Check className="w-3.5 h-3.5" />}
                        <span>🥛 Fresh Milk (Standard)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMilkOption('Oat Milk (+Rp 5.000)')}
                        className="py-2.5 px-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                        style={
                          milkOption.includes('Oat')
                            ? { backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617', borderColor: customerTheme.primaryAccentHex }
                            : { backgroundColor: buttonInactiveBg, color: secondaryTextColor, borderColor: buttonInactiveBorder }
                        }
                      >
                        {milkOption.includes('Oat') && <Check className="w-3.5 h-3.5" />}
                        <span>🌾 Oatside (+5rb)</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* CATATAN KHUSUS (TERGANTUNG ATURAN PER-MENU / ETALASE) */}
          {shouldAllowItemCustomNotes(item) && (
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-xs" style={{ color: textColor }}>Catatan Khusus ({isBeverage ? 'Barista' : 'Dapur'}):</span>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder={isBeverage ? "Contoh: Less ice..." : "Tulis instruksi khusus..."}
                className="text-xs rounded-xl px-3 py-2.5 focus:outline-none transition-all border"
                style={{ backgroundColor: inputBg, color: textColor, borderColor: inputBorder }}
              />
            </div>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 border-t flex items-center gap-3" style={{ borderColor: cardBorder }}>
          {/* STEPPER QTY */}
          <div 
            className="flex items-center gap-1.5 border rounded-xl p-1 shrink-0"
            style={{ backgroundColor: subCardBg, borderColor: subCardBorder }}
          >
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border"
              style={{ backgroundColor: buttonInactiveBg, color: textColor, borderColor: buttonInactiveBorder }}
              title="Kurangi"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold font-mono text-sm w-6 text-center" style={{ color: textColor }}>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border"
              style={{ backgroundColor: buttonInactiveBg, color: textColor, borderColor: buttonInactiveBorder }}
              title="Tambah"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* CONFIRM BUTTON */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 font-bold text-xs py-3 rounded-xl shadow-lg flex items-center justify-between px-4 transition-all"
            style={{ backgroundColor: customerTheme.primaryAccentHex, color: isLight ? '#ffffff' : '#020617' }}
          >
            <span>+ Masukkan Pesanan</span>
            <span className="font-mono font-extrabold text-sm">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
