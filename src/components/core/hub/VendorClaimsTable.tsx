import React, { useState } from 'react'
import { ShieldCheck, Plus, CheckCircle2, AlertTriangle, Shield } from 'lucide-react'
import { Button, Badge } from '@/ui'

export interface VendorClaimRecord {
  id: string
  connectorSlug: string
  connectorName: string
  claimingOrg: string
  domainEmail: string
  method: 'DOMAIN_CHALLENGE' | 'DNS_TXT_RECORD' | 'OAUTH_SIGNATURE'
  sentinelProofToken: string
  verifiedAt: string
  status: 'verified' | 'pending_dns'
}

export const INITIAL_VENDOR_CLAIMS: VendorClaimRecord[] = [
  {
    id: 'clm-01',
    connectorSlug: 'moka-pos-sync',
    connectorName: 'Moka POS Next-Gen',
    claimingOrg: 'PT Moka Teknologi Indonesia (GoTo)',
    domainEmail: 'official@moka.id',
    method: 'DOMAIN_CHALLENGE',
    sentinelProofToken: 'SENTINEL_SHA256_PROVED_TOKEN_9812A',
    verifiedAt: '2026-08-16 14:20',
    status: 'verified'
  },
  {
    id: 'clm-02',
    connectorSlug: 'esb-resto-enterprise',
    connectorName: 'ESB Resto Enterprise',
    claimingOrg: 'PT Esensi Solusi Buana (ESB)',
    domainEmail: 'partner@esb.co.id',
    method: 'DNS_TXT_RECORD',
    sentinelProofToken: 'hfe-verify=esb_9812a01ff7',
    verifiedAt: '2026-08-17 09:15',
    status: 'verified'
  },
  {
    id: 'clm-03',
    connectorSlug: 'us-toast-clover-pos',
    connectorName: 'Toast POS & Clover',
    claimingOrg: 'Toast Inc. (Boston, MA)',
    domainEmail: 'devrel@toasttab.com',
    method: 'DOMAIN_CHALLENGE',
    sentinelProofToken: 'SENTINEL_TOAST_VERIFY_2026',
    verifiedAt: 'Pending Validation',
    status: 'pending_dns'
  }
]

export const VendorClaimsTable: React.FC = () => {
  const [claims, setClaims] = useState<VendorClaimRecord[]>(INITIAL_VENDOR_CLAIMS)

  const handleSubmitClaimModal = () => {
    const slug = prompt('Masukkan Connector Slug (misal: "us-toast-clover-pos"):')
    if (!slug) return
    const org = prompt('Masukkan Nama Perusahaan Counterparty (misal: "Toast Inc"):') || 'Vendor Partner'
    const email = prompt('Masukkan Official Domain Email PIC (misal: "partner@toasttab.com"):')
    if (!email) return

    const newClaim: VendorClaimRecord = {
      id: `clm-${Date.now()}`,
      connectorSlug: slug,
      connectorName: slug,
      claimingOrg: org,
      domainEmail: email,
      method: 'DOMAIN_CHALLENGE',
      sentinelProofToken: `SENTINEL_SHA256_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      verifiedAt: 'Pending Validation',
      status: 'pending_dns'
    }

    setClaims((prev) => [newClaim, ...prev])
    alert(
      `🛡️ Klaim Vendor Berhasil Dikirim!\n\nConnector: ${slug}\nOrganisasi: ${org}\nEmail: ${email}\n\nChallenge verifikasi telah dikirimkan ke domain resmi vendor.`
    )
  }

  const handleApproveClaim = (id: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'verified' as const,
              verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          : c
      )
    )
    alert('✅ Klaim vendor diverifikasi dan badge "Official Verified" diaktifkan!')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Counterparty Vendor Claims &amp; Cryptographic Sentinel Proofs</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Verifikasi kepemilikan resmi konektor oleh vendor SaaS / Bank melalui tantangan DNS &amp; Domain.
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleSubmitClaimModal}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Ajukan Klaim Vendor</span>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Connector</th>
              <th className="py-3 px-4">Claiming Organization</th>
              <th className="py-3 px-4">Official Email</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Sentinel Proof Token</th>
              <th className="py-3 px-4">Verified At</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-200">{claim.connectorName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{claim.connectorSlug}</div>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-300">
                  {claim.claimingOrg}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-sky-400">
                  {claim.domainEmail}
                </td>
                <td className="py-3 px-4">
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {claim.method}
                  </Badge>
                </td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[160px]">
                  {claim.sentinelProofToken}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                  {claim.verifiedAt}
                </td>
                <td className="py-3 px-4">
                  {claim.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Official</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Pending DNS</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  {claim.status === 'pending_dns' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveClaim(claim.id)}
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      Approve Proof
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => alert(`Proof Token: ${claim.sentinelProofToken}\nVerified via ${claim.method}`)}
                    >
                      View Proof
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
