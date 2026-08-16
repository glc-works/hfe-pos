import React from 'react'
import { Bookmark } from 'lucide-react'

export interface SaveCustomThemeModalProps {
  show: boolean
  onClose: () => void
  templateName: string
  onChangeTemplateName: (val: string) => void
  onSave: () => void
}

export const SaveCustomThemeModal: React.FC<SaveCustomThemeModalProps> = ({
  show,
  onClose,
  templateName,
  onChangeTemplateName,
  onSave
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4 animate-fadeIn">
        <h4 className="text-sm font-black text-white flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-400" /> Simpan sebagai Template Kustom
        </h4>
        <p className="text-xs text-slate-400">
          Beri nama untuk tema aktif ini agar tersimpan di Vault Anda dan dapat dipasang kembali kapan saja.
        </p>
        <input
          type="text"
          value={templateName}
          onChange={(e) => onChangeTemplateName(e.target.value)}
          placeholder="Contoh: Kopi Kenangan Senopati V2"
          className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
        />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md"
          >
            Simpan ke Vault
          </button>
        </div>
      </div>
    </div>
  )
}
