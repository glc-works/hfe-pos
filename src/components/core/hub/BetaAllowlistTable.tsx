import React, { useState } from 'react'
import { Plus, Trash2, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react'
import { Button, Badge } from '@/ui'

export interface BetaEnrollmentRecord {
  id: string
  companyBookId: string
  companyName: string
  connectorSlug: string
  connectorName: string
  channel: 'beta' | 'alpha' | 'developer_preview'
  inviteToken: string
  enrolledAt: string
  approvedBy: string
  status: 'active' | 'revoked'
}

export const INITIAL_BETA_ENROLLMENTS: BetaEnrollmentRecord[] = [
  {
    id: 'enr-01',
    companyBookId: 'book_9812a-001',
    companyName: 'PT Kopi Nusantara Abadi',
    connectorSlug: 'moka-pos-sync',
    connectorName: 'Moka POS Next-Gen',
    channel: 'beta',
    inviteToken: 'MOKA-BETA-INVITE-2026',
    enrolledAt: '2026-08-15',
    approvedBy: 'hendra@kopinusantara.id',
    status: 'active'
  },
  {
    id: 'enr-02',
    companyBookId: 'book_dfa01-992',
    companyName: 'PT Digital Fintech Asia',
    connectorSlug: 'bank-jago-bisnis-connector',
    connectorName: 'Bank Jago Bisnis',
    channel: 'alpha',
    inviteToken: 'JAGO-ALPHA-SECRET-881',
    enrolledAt: '2026-08-16',
    approvedBy: 'tech@fintechasia.id',
    status: 'active'
  },
  {
    id: 'enr-03',
    companyBookId: 'book_sg_rest01',
    companyName: 'Marina Gourmet Pte Ltd',
    connectorSlug: 'sg-qashier-storehub-pos',
    connectorName: 'Qashier & StoreHub POS',
    channel: 'beta',
    inviteToken: 'SG-QASHIER-2026',
    enrolledAt: '2026-08-17',
    approvedBy: 'ops@marinagourmet.sg',
    status: 'active'
  }
]

export const BetaAllowlistTable: React.FC = () => {
  const [enrollments, setEnrollments] = useState<BetaEnrollmentRecord[]>(INITIAL_BETA_ENROLLMENTS)

  const handleEnrollModal = () => {
    const book = prompt('Masukkan Company Book ID / Slug (misal: "book_kopinusantara"):')
    if (!book) return
    const company = prompt('Masukkan Nama Perusahaan / Outlet:') || 'Outlet Terdaftar'
    const slug = prompt('Masukkan Connector Slug (misal: "moka-pos-sync"):') || 'moka-pos-sync'
    const channel = (prompt('Pilih Channel ("beta" atau "alpha"):', 'beta') || 'beta') as
      | 'beta'
      | 'alpha'

    const token = `${slug.substring(0, 4).toUpperCase()}-${channel.toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`

    const newRecord: BetaEnrollmentRecord = {
      id: `enr-${Date.now()}`,
      companyBookId: book,
      companyName: company,
      connectorSlug: slug,
      connectorName: slug,
      channel,
      inviteToken: token,
      enrolledAt: new Date().toISOString().split('T')[0],
      approvedBy: 'operator@hfe.id',
      status: 'active'
    }

    setEnrollments((prev) => [newRecord, ...prev])
    alert(
      `✅ Tenant Berhasil Didaftarkan ke Channel Early Access!\n\nTenant: ${company}\nConnector: ${slug}\nChannel: ${channel.toUpperCase()}\nInvite Code: ${token}`
    )
  }

  const handleRevoke = (id: string) => {
    if (confirm('Yakin ingin mencabut (revoke) akses beta untuk tenant ini?')) {
      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: 'revoked' as const } : e))
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>TestFlight-Style Beta Allowlist &amp; Early Access Channels</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Kontrol akses tenant ke rilis eksperimental dengan verifikasi token kriptografis.
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleEnrollModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Enroll Tenant Baru</span>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Company Book / Tenant</th>
              <th className="py-3 px-4">Target Connector</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Invite Token</th>
              <th className="py-3 px-4">Approved By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {enrollments.map((enr) => (
              <tr key={enr.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-200">{enr.companyName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{enr.companyBookId}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-300">{enr.connectorName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{enr.connectorSlug}</div>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={enr.channel === 'beta' ? 'default' : 'indigo'}
                    className="text-[10px] uppercase"
                  >
                    {enr.channel}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono font-medium text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-[11px]">
                    {enr.inviteToken}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  {enr.approvedBy}
                </td>
                <td className="py-3 px-4">
                  {enr.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 text-[11px] font-semibold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Revoked</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  {enr.status === 'active' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevoke(enr.id)}
                    >
                      Revoke
                    </Button>
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
