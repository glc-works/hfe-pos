import React, { useState } from 'react'
import { Card, Button, Badge, TextInput } from '../../ui'
import { Users, KeyRound, ShieldAlert, CheckCircle2, UserPlus, Lock } from 'lucide-react'
import { StaffRole } from '../../types/pos'

interface StaffMember {
  id: string
  name: string
  role: StaffRole
  phone: string
  pinMasked: string
  status: 'active' | 'suspended'
}

export function TeamPinAccessTab() {
  const [members, setMembers] = useState<StaffMember[]>([
    { id: 'STF-01', name: 'Alexander Raden (Owner)', role: 'owner', phone: '0812-8888-9999', pinMasked: '••••', status: 'active' },
    { id: 'STF-02', name: 'Bambang Sudarsono', role: 'store_manager', phone: '0813-7777-1111', pinMasked: '••••', status: 'active' },
    { id: 'STF-03', name: 'Siti Rahmawati', role: 'cashier', phone: '0815-2222-3333', pinMasked: '••••', status: 'active' },
    { id: 'STF-04', name: 'Dimas Barista', role: 'barista', phone: '0819-4444-5555', pinMasked: '••••', status: 'active' },
    { id: 'STF-05', name: 'Rian Server', role: 'waiter', phone: '0857-6666-7777', pinMasked: '••••', status: 'active' },
  ])

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [newPin, setNewPin] = useState('')
  const [pinResetSuccess, setPinResetSuccess] = useState(false)

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaff || newPin.length !== 4) return
    setPinResetSuccess(true)
    setTimeout(() => {
      setPinResetSuccess(false)
      setSelectedStaff(null)
      setNewPin('')
    }, 1500)
  }

  const roleLabel = (role: StaffRole) => {
    switch (role) {
      case 'owner': return { name: 'Owner (Pemilik)', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
      case 'store_manager': return { name: 'Store Manager', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
      case 'cashier': return { name: 'Kasir', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
      case 'barista': return { name: 'Barista / Chef', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
      case 'waiter': return { name: 'Server / Waiter', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
      default: return { name: role, color: 'bg-muted text-muted-foreground' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Tim & Manajemen PIN Akses (RBAC)
          </h3>
          <p className="text-xs text-muted-foreground">
            Atur hak akses operasional kasir, dapur, dan reset PIN 4-digit staf
          </p>
        </div>
      </div>

      {/* Staff Roster Table */}
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold">
                <th className="pb-2">Nama Staf</th>
                <th className="pb-2">Role & Izin</th>
                <th className="pb-2">No. Handphone</th>
                <th className="pb-2">PIN Status</th>
                <th className="pb-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {members.map((staff) => {
                const rInfo = roleLabel(staff.role)
                return (
                  <tr key={staff.id} className="hover:bg-muted/20">
                    <td className="py-3">
                      <div className="font-bold text-foreground">{staff.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{staff.id}</div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={`text-[10px] ${rInfo.color}`}>
                        {rInfo.name}
                      </Badge>
                    </td>
                    <td className="py-3 font-mono text-muted-foreground">{staff.phone}</td>
                    <td className="py-3 font-mono">
                      <span className="px-2 py-0.5 rounded bg-muted text-[11px] flex items-center gap-1 w-fit">
                        <Lock className="w-3 h-3 text-muted-foreground" /> Aktif
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs font-semibold"
                        onClick={() => setSelectedStaff(staff)}
                      >
                        <KeyRound className="w-3 h-3 mr-1" /> Reset PIN
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Access Matrix */}
      <Card className="p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Matriks Otorisasi Berdasarkan Role
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
            <div className="font-bold text-purple-400">👑 Owner & Manager</div>
            <ul className="text-[11px] text-muted-foreground space-y-0.5 list-disc list-inside">
              <li>Full Akses Merchant Hub</li>
              <li>Ubah Domain & Rekening Bank</li>
              <li>Lihat Laporan Laba Kotor & HPP</li>
              <li>Otorisasi Void / Refund Struk</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
            <div className="font-bold text-emerald-400">💵 Kasir (Cashier)</div>
            <ul className="text-[11px] text-muted-foreground space-y-0.5 list-disc list-inside">
              <li>Transaksi Kasir & Buka Shift</li>
              <li>Terima Pembayaran QRIS & Tunai</li>
              <li>Tutup Kas Laci Shift Sendiri</li>
              <li className="text-rose-400">Terkunci dari Merchant Hub</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
            <div className="font-bold text-amber-400">👨‍🍳 Barista / KDS Dapur</div>
            <ul className="text-[11px] text-muted-foreground space-y-0.5 list-disc list-inside">
              <li>Tampilan Pesanan KDS Dapur</li>
              <li>Tandai Tiket Siap / Selesai</li>
              <li className="text-rose-400">Nol akses ke kas & uang</li>
              <li className="text-rose-400">Terkunci dari Merchant Hub</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* PIN Reset Dialog Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6 bg-card border-border shadow-2xl space-y-4">
            {pinResetSuccess ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-foreground">PIN Berhasil Diperbarui!</h4>
                <p className="text-xs text-muted-foreground">
                  PIN baru untuk <strong>{selectedStaff.name}</strong> telah aktif seketika.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPin} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary" /> Reset PIN 4-Digit
                  </h4>
                  <button 
                    type="button" 
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedStaff(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Staf:</span> <strong>{selectedStaff.name}</strong>
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">Ketik 4-Digit PIN Baru</label>
                    <TextInput 
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      className="font-mono text-center text-lg tracking-widest font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedStaff(null)}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 font-bold"
                    disabled={newPin.length !== 4}
                  >
                    Simpan PIN
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
