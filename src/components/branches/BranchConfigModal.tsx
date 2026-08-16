import React, { useState, useEffect } from 'react'
import { X, Settings, MapPin, Wifi, Clock, Phone } from 'lucide-react'
import { BranchInfo, CreateBranchPayload } from '../../services/hfeApi'

export interface BranchConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (branchId: string, payload: Partial<CreateBranchPayload>) => Promise<void>
  branch: BranchInfo | null
}

export const BranchConfigModal: React.FC<BranchConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  branch,
}) => {
  const [address, setAddress] = useState('')
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')
  const [operatingHours, setOperatingHours] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [managerContact, setManagerContact] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (branch) {
      setAddress(branch.address || '')
      setGoogleMapsUrl(branch.googleMapsUrl || '')
      setOperatingHours(branch.operatingHours || '07:00 - 22:00 WIB')
      setWifiSsid(branch.wifiSsid || '')
      setWifiPassword(branch.wifiPassword || '')
      setManagerContact(branch.managerContact || '')
    }
  }, [branch])

  if (!isOpen || !branch) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(branch.id, {
        address,
        googleMapsUrl,
        operatingHours,
        wifiSsid,
        wifiPassword,
        managerContact,
      })
      onClose()
    } catch (err) {
      console.error('[BranchConfigModal] Error updating branch:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Pengaturan Cabang: {branch.name}</h3>
              <p className="text-xs text-slate-500">Edit informasi operasional & credentials store</p>
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Outlet</label>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link Google Maps Pin</label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Operasional Store</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="07:00 - 22:00 WIB"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WiFi SSID (Nama)</label>
              <div className="relative">
                <Wifi className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WiFi Password</label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kontak WhatsApp Manajer Cabang</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={managerContact}
                onChange={(e) => setManagerContact(e.target.value)}
                placeholder="6281234567890"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
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
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Simpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
