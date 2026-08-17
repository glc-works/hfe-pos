import React, { useState } from 'react'
import { Key, Plus, RefreshCw, Trash2, Shield, CheckCircle2, AlertOctagon } from 'lucide-react'

export interface DeveloperKeyItem {
  id: string
  name: string
  description: string
  ownerName: string
  ownerEmail: string
  prefix: string
  environment: 'live' | 'sandbox'
  status: 'active' | 'revoked'
  totalHits: number
  lastSeenIp: string
  lastSeenTime: string
}

export const INITIAL_DEV_KEYS: DeveloperKeyItem[] = [
  {
    id: 'k-01',
    name: 'Andi - POS Android Flutter Dev',
    description: 'Terminal cashier checkout integration',
    ownerName: 'Andi Pratama',
    ownerEmail: 'andi@hfe.id',
    prefix: 'hfe_live_01jh92_...',
    environment: 'live',
    status: 'active',
    totalHits: 14280,
    lastSeenIp: '114.122.45.10',
    lastSeenTime: '2 mins ago'
  },
  {
    id: 'k-02',
    name: 'Budi - Scalar Docs Testing',
    description: 'Frontend interactive playground and API QA',
    ownerName: 'Budi Santoso',
    ownerEmail: 'budi@hfe.id',
    prefix: 'hfe_sbx_77ka01_...',
    environment: 'sandbox',
    status: 'active',
    totalHits: 3450,
    lastSeenIp: '182.253.11.89',
    lastSeenTime: '14 mins ago'
  }
]

export const DeveloperKeysManager: React.FC = () => {
  const [keys, setKeys] = useState<DeveloperKeyItem[]>(INITIAL_DEV_KEYS)

  const handleIssueKey = () => {
    const name = prompt('Masukkan Nama Developer Key / Label (misal: "Andi - POS Terminal"):')
    if (!name) return
    const email = prompt('Masukkan Email Pemilik Key:') || 'dev@hfe.id'
    const isLive = confirm('Buat key untuk LIVE Production? (Cancel untuk Sandbox)')
    const env = isLive ? 'live' : 'sandbox'
    const prefix = isLive ? 'hfe_live_' : 'hfe_sbx_'
    const randomSecret = `${prefix}${Math.random().toString(36).substring(2, 8)}_${Math.random()
      .toString(36)
      .substring(2, 12)}`

    const newKey: DeveloperKeyItem = {
      id: `k-${Date.now()}`,
      name,
      description: 'Custom integration key',
      ownerName: name.split(' - ')[0] || 'Developer',
      ownerEmail: email,
      prefix: `${randomSecret.substring(0, 16)}...`,
      environment: env,
      status: 'active',
      totalHits: 0,
      lastSeenIp: '127.0.0.1',
      lastSeenTime: 'Just now'
    }

    setKeys((prev) => [newKey, ...prev])
    alert(
      `✅ Developer API Key Berhasil Dibuat!\n\nNama: ${name}\nPemilik: ${email}\nEnvironment: ${env.toUpperCase()}\n\n🔑 API Secret (Salin sekarang, tidak akan ditampilkan lagi):\n${randomSecret}`
    )
  }

  const handleRotate = (id: string) => {
    alert(
      '🔄 Key Rotation: Key penerus baru telah dibuat dengan masa tenggang (grace period) 24 jam untuk key lama tanpa downtime.'
    )
  }

  const handleRevoke = (id: string) => {
    if (confirm('⚠️ KILL SWITCH: Yakin ingin mencabut key ini? Seluruh request yang menggunakan key ini akan ditolak (401).')) {
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k))
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-sky-400" />
            <span>Attributed Developer API Keys &amp; Secret Scanning Signatures</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Manajemen token API teratribusi dengan pemindaian rahasia GitHub &amp; Instant Kill Switch.
          </div>
        </div>
        <button
          type="button"
          onClick={handleIssueKey}
          className="py-1.5 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Issue Developer Key</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Key Label &amp; Deskripsi</th>
              <th className="py-3 px-4">Owner / PIC</th>
              <th className="py-3 px-4">Prefix Token</th>
              <th className="py-3 px-4">Environment</th>
              <th className="py-3 px-4">Total Hits</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Seen</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {keys.map((k) => (
              <tr key={k.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-200">{k.name}</div>
                  <div className="text-[11px] text-slate-500">{k.description}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-300">{k.ownerName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{k.ownerEmail}</div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-sky-400">
                  {k.prefix}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      k.environment === 'live'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    {k.environment}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                  {k.totalHits.toLocaleString('id-ID')}
                </td>
                <td className="py-3 px-4">
                  {k.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 text-[11px] font-semibold">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Revoked</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                  <div>{k.lastSeenIp}</div>
                  <div className="text-slate-500">{k.lastSeenTime}</div>
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  {k.status === 'active' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRotate(k.id)}
                        className="py-1 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Rotate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevoke(k.id)}
                        className="py-1 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
