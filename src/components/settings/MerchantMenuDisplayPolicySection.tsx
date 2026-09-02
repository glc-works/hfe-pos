import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { MenuDisplayPolicy } from '../../types/pos'

interface MerchantMenuDisplayPolicySectionProps {
  policy?: MenuDisplayPolicy
  onChange: (newPolicy: MenuDisplayPolicy) => void
}

export const MerchantMenuDisplayPolicySection: React.FC<MerchantMenuDisplayPolicySectionProps> = ({
  policy = {
    showPublicIngredients: false,
    showTastingNotes: true,
    showCuratedStory: true,
    showDietaryBadges: true,
    showOriginInfo: true
  },
  onChange
}) => {
  const update = (patch: Partial<MenuDisplayPolicy>) => {
    onChange({ ...policy, ...patch })
  }

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Kedaulatan & Privasi Menu (Secret Recipe Guard)
        </h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Sovereign Control
        </span>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Atur bagian mana dari detail produk yang boleh diakses oleh publik dan bagian mana yang dirahasiakan untuk dapur/backoffice.
      </p>

      <div className="space-y-2 pt-1">
        {/* TOGGLE 1: BoM Ingredients (Default OFF to protect secret recipe) */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer">
          <div className="flex items-start gap-2.5">
            <span className="text-sm mt-0.5">{policy.showPublicIngredients ? '🔓' : '🔒'}</span>
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                {policy.showPublicIngredients ? 'Tampilkan Komposisi Bahan ke Publik' : 'Sembunyikan Resep & Komposisi BoM (Rahasia Dapur)'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {policy.showPublicIngredients ? 'Pelanggan dapat melihat rincian bahan baku di modal detail.' : 'Direkomendasikan: Hanya staf dapur & sistem stok yang dapat melihat gramatur/resep racikan.'}
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(policy.showPublicIngredients)}
            onChange={(e) => update({ showPublicIngredients: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0 ml-3"
          />
        </label>

        {/* TOGGLE 2: Curated Story Card */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer">
          <div className="flex items-start gap-2.5">
            <span className="text-sm mt-0.5">✨</span>
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Cerita Kurasi Roaster / Chef
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Tampilkan narasi kurasi dan edisi musiman pada menu unggulan.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={policy.showCuratedStory !== false}
            onChange={(e) => update({ showCuratedStory: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0 ml-3"
          />
        </label>

        {/* TOGGLE 3: Tasting Notes */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer">
          <div className="flex items-start gap-2.5">
            <span className="text-sm mt-0.5">🌸</span>
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Profil Rasa (Tasting Notes)
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Tampilkan tag aroma dan rasa (misal: Peach, Melati, Gula Aren).
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={policy.showTastingNotes !== false}
            onChange={(e) => update({ showTastingNotes: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0 ml-3"
          />
        </label>

        {/* TOGGLE 4: Dietary & Allergen Badges */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer">
          <div className="flex items-start gap-2.5">
            <span className="text-sm mt-0.5">🌱</span>
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Tag Alergen & Keselamatan Diet
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Tampilkan lencana Vegan, Bebas Gluten, Bebas Susu, dan Sertifikasi Halal.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={policy.showDietaryBadges !== false}
            onChange={(e) => update({ showDietaryBadges: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0 ml-3"
          />
        </label>
      </div>
    </div>
  )
}
