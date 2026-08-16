import React, { useState } from 'react'
import { X, Building2, MapPin, Phone, Banknote } from 'lucide-react'
import { CreateBranchPayload } from '../../services/hfeApi'

export interface CreateBranchModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (payload: CreateBranchPayload) => Promise<void>
}

export const CreateBranchModal: React.FC<CreateBranchModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [code, setCode] = useState('KMG-04')
  const [name, setName] = useState('Kopitiam Kemang Outlet')
  const [address, setAddress] = useState('Jl. Kemang Raya No. 45, Jakarta Selatan')
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')
  const [operatingHours, setOperatingHours] = useState('07:00 - 22:00 WIB')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [managerContact, setManagerContact] = useState('6281298765432')
  const [initialFloat, setInitialFloat] = useState(500000)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !name || !address) return
    setLoading(true)
    try {
      await onCreate({
        code,
        name,
        address,
        googleMapsUrl,
        operatingHours,
        wifiSsid,
        wifiPassword,
        managerContact,
        initialFloat: Number(initialFloat),
      })
      onClose()
    } catch (err) {
      console.error('[CreateBranchModal] Error creating branch:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Registrasi Cabang Outlet Baru</h3>
              <p className="text-xs text-slate-500">Tambah lokasi cabang baru ke Company Book</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Cabang</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="KMG-04"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none uppercase font-mono"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Outlet</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kopitiam Kemang Outlet"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WA Manajer</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={managerContact}
                  onChange={(e) => setManagerContact(e.target.value)}
                  placeholder="62812..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Modal Kas Shift (Rp)</label>
              <div className="relative">
                <Banknote className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  step={50000}
                  value={initialFloat}
                  onChange={(e) => setInitialFloat(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Operasional</label>
            <input
              type="text"
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              placeholder="07:00 - 22:00 WIB"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Mendaftarkan...' : 'Tambah Cabang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
