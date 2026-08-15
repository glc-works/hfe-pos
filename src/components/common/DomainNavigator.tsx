import React from 'react'
import { PrimaryDomainApp } from '../../types/pos'
import { Globe, Smartphone, Store } from 'lucide-react'

interface DomainNavigatorProps {
  activeApp: PrimaryDomainApp
  cafeUsername: string
  onSwitchDomain: (app: PrimaryDomainApp) => void
}

export const DomainNavigator: React.FC<DomainNavigatorProps> = ({
  activeApp,
  cafeUsername,
  onSwitchDomain
}) => {
  return (
    <div className="bg-slate-950 border-b border-slate-800 px-3 py-1.5 flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-slate-400">DOMAIN APP:</span>
        <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
          activeApp === 'landing' 
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : activeApp === 'customer'
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
        }`}>
          {activeApp === 'landing' ? `🌐 WWW.KOPITIAM.COM/${cafeUsername}` : activeApp === 'customer' ? '📱 ORDER.KOPITIAM.COM (?app=customer)' : '🏪 POS.KOPITIAM.COM (?app=cafe)'}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSwitchDomain('landing')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
            activeApp === 'landing' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-amber-950" /> URL 3: Official Landing Page (/{cafeUsername})
        </button>

        <button
          onClick={() => onSwitchDomain('customer')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
            activeApp === 'customer' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> URL 1: Web Pelanggan (QR)
        </button>
        
        <button
          onClick={() => onSwitchDomain('cafe')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
            activeApp === 'cafe' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" /> URL 2: Web Staf POS/KDS
        </button>
      </div>
    </div>
  )
}
