import React from 'react'
import { Contact, AlertTriangle, Barcode } from 'lucide-react'
import { CustomerProfile, MenuItem } from '../../types/pos'

export interface CustomerCrmSectionProps {
  customerProfiles: CustomerProfile[]
  productCatalog: MenuItem[]
}

export const CustomerCrmSection: React.FC<CustomerCrmSectionProps> = ({
  customerProfiles,
  productCatalog
}) => {
  return (
    <>
      {/* CARD CUSTOMER PROFILING & SEAT-LEVEL PREFERENCE DATABASE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <Contact className="w-4 h-4 text-emerald-400" /> Database Profil & Preferensi Tamu (Seat Binding CRM)
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
            {customerProfiles.length} Contacts Profiled
          </span>
        </div>
        <p className="text-xs text-slate-400">Profil preferensi otomatis terikat saat kustomisasi item dengan penandaan nomor kursi meja:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {customerProfiles.map((cust) => (
            <div key={cust.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    👤
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{cust.name}</h4>
                    <p className="text-[10px] font-mono text-slate-400">{cust.phone}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {cust.loyaltyTier}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>
                  <span>Preferensi Kursi:</span>
                  <p className="font-bold text-indigo-400 font-mono">{cust.favoriteSeat}</p>
                </div>
                <div>
                  <span>Minuman Favorit:</span>
                  <p className="font-bold text-slate-200 truncate">{cust.favoriteDrink}</p>
                </div>
                <div>
                  <span>Jenis Susu Preferensi:</span>
                  <p className="font-bold text-emerald-400">{cust.preferredMilk}</p>
                </div>
                <div>
                  <span>Level Gula Preferensi:</span>
                  <p className="font-bold text-amber-400">{cust.preferredSugar}</p>
                </div>
              </div>

              {cust.allergenAlert && (
                <div className="text-[10px] text-rose-400 font-semibold bg-rose-500/10 p-1.5 rounded border border-rose-500/20 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 text-rose-500" /> Profil Alergen: {cust.allergenAlert}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CARD HFE PRODUCT CATEGORIES & SKU INVENTORY MATRIX */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
        <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Barcode className="w-4 h-4 text-indigo-400" /> Matriks Kode Menu POS & Raw Material BOM (Inventori Kafe)
        </h3>
        <p className="text-xs text-slate-400">Kode Barang Internal Kasir & Bahan Baku BOM (Hanya Tampil di Portal Staf Kafe):</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {productCatalog.map((item) => (
            <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {item.id}
                  </span>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">{item.hfeCategoryCode}</span>
              </div>

              <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 text-[10px]">Kode Bahan Baku BOM:</span>
                {item.bomIngredients?.map((ing, ingIdx) => (
                  <div key={ingIdx} className="flex justify-between text-slate-400 font-mono text-[10px]">
                    <span>• [{ing.itemCode}] {ing.name}</span>
                    <span className="text-amber-400">{ing.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
