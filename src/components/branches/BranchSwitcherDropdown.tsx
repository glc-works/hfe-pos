import React, { useState, useRef, useEffect } from 'react'
import { Store, ChevronDown, Check, Building2 } from 'lucide-react'
import { BranchInfo } from '../../services/hfeApi'

export interface BranchSwitcherDropdownProps {
  branches: BranchInfo[]
  activeBranchId: string
  onSelectBranch: (branchId: string) => void
}

export const BranchSwitcherDropdown: React.FC<BranchSwitcherDropdownProps> = ({
  branches,
  activeBranchId,
  onSelectBranch,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0] || {
    id: 'BRANCH-SENOPATI',
    name: 'Kopitiam Senopati HQ',
    code: 'SNP-01',
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-300 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl transition-all border border-slate-200 shadow-2xs"
      >
        <Store className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="max-w-[140px] truncate">{activeBranch.name}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pilih Workstation Outlet
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  onSelectBranch(b.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                  b.id === activeBranchId
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Building2 className={`w-4 h-4 flex-shrink-0 ${b.id === activeBranchId ? 'text-amber-600' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <div className="truncate">{b.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.code} {b.isHQ ? '(HQ)' : ''}</div>
                  </div>
                </div>
                {b.id === activeBranchId && <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
