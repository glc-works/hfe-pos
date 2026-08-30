import React from 'react'
import { Sparkles, Trees, Car, Wifi, Zap, Wind, Check, Music, CalendarCheck, PawPrint } from 'lucide-react'
import { AmenityTagId } from '../../types/pos'
import { STANDARD_AMENITIES_CATALOG, DEFAULT_MERCHANT_AMENITY_TAGS } from '../../data/amenityCatalog'

interface MerchantAmenitySelectorSectionProps {
  selectedTags?: AmenityTagId[]
  onChange: (newTags: AmenityTagId[]) => void
}

export const MerchantAmenitySelectorSection: React.FC<MerchantAmenitySelectorSectionProps> = ({
  selectedTags = DEFAULT_MERCHANT_AMENITY_TAGS,
  onChange
}) => {
  const currentTags = selectedTags && selectedTags.length > 0 ? selectedTags : DEFAULT_MERCHANT_AMENITY_TAGS

  const toggleTag = (id: AmenityTagId) => {
    if (currentTags.includes(id)) {
      onChange(currentTags.filter(t => t !== id))
    } else {
      onChange([...currentTags, id])
    }
  }

  const renderAmenityIcon = (iconName: string, isSelected: boolean) => {
    const colorClass = isSelected ? 'text-amber-400' : 'text-slate-400'
    switch (iconName) {
      case 'wifi':
        return <Wifi className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      case 'zap':
        return <Zap className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      case 'wind':
        return <Wind className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      case 'trees':
        return <Trees className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      case 'car':
        return <Car className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      case 'sparkles':
        return <Sparkles className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      case 'paw':
        return <PawPrint className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      case 'music':
        return <Music className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      case 'calendar':
        return <CalendarCheck className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
      default:
        return <Check className={`w-3.5 h-3.5 ${colorClass} shrink-0`} />
    }
  }

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" /> Fasilitas & Kenyamanan Outlet (Google Maps)
        </h4>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          {currentTags.length} Terpilih
        </span>
      </div>
      <p className="text-[11px] text-slate-400">
        Pilih fasilitas yang tersedia di outlet Anda untuk ditampilkan pada etalase publik
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
        {STANDARD_AMENITIES_CATALOG.map((amenity) => {
          const isSelected = currentTags.includes(amenity.id)
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggleTag(amenity.id)}
              className={`p-2 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-xs'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {renderAmenityIcon(amenity.icon, isSelected)}
                <span className="truncate">{amenity.labelId}</span>
              </div>
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700 bg-slate-950'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
