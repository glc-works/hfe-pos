import React from 'react'
import { EcosystemConnector } from './connectorsData'

interface ConnectorCredentialFieldsProps {
  category: EcosystemConnector['category']
  credentials: Record<string, string>
  onChange: (credentials: Record<string, string>) => void
}

export const ConnectorCredentialFields: React.FC<ConnectorCredentialFieldsProps> = ({
  category,
  credentials,
  onChange
}) => {
  const update = (field: string, val: string) => {
    onChange({ ...credentials, [field]: val })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
      {category === 'accounting' && (
        <>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Tenant Subdomain / Org ID</label>
            <input
              type="text"
              value={credentials.subdomain || ''}
              onChange={(e) => update('subdomain', e.target.value)}
              placeholder="contoh: pt-kopi-nusantara"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">OAuth Client ID</label>
            <input
              type="text"
              value={credentials.clientId || ''}
              onChange={(e) => update('clientId', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Client Secret / API Key</label>
            <input
              type="password"
              value={credentials.clientSecret || ''}
              onChange={(e) => update('clientSecret', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </>
      )}

      {category === 'payments' && (
        <>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Live Public Key</label>
            <input
              type="text"
              value={credentials.publicKey || ''}
              onChange={(e) => update('publicKey', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Live Secret Key</label>
            <input
              type="password"
              value={credentials.secretKey || ''}
              onChange={(e) => update('secretKey', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Webhook Signing Secret</label>
            <input
              type="text"
              value={credentials.webhookSecret || ''}
              onChange={(e) => update('webhookSecret', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </>
      )}

      {category === 'banking' && (
        <>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">SNAP Corporate Client ID</label>
            <input
              type="text"
              value={credentials.corporateId || ''}
              onChange={(e) => update('corporateId', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Partner / Bearer Token</label>
            <input
              type="password"
              value={credentials.partnerToken || ''}
              onChange={(e) => update('partnerToken', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Private Key (RSA PEM / SNAP Signature)</label>
            <textarea
              rows={2}
              value={credentials.privateKeyPem || ''}
              onChange={(e) => update('privateKeyPem', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-sky-500 font-mono text-[10px]"
            />
          </div>
        </>
      )}

      {category === 'ecommerce' && (
        <>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Store Base URL / Endpoint</label>
            <input
              type="text"
              value={credentials.storeUrl || ''}
              onChange={(e) => update('storeUrl', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">API Access Token</label>
            <input
              type="password"
              value={credentials.accessToken || ''}
              onChange={(e) => update('accessToken', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </>
      )}

      {category === 'pos' && (
        <>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">POS Terminal / Branch ID</label>
            <input
              type="text"
              value={credentials.terminalId || ''}
              onChange={(e) => update('terminalId', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Pairing Secret Key</label>
            <input
              type="password"
              value={credentials.pairingSecret || ''}
              onChange={(e) => update('pairingSecret', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </>
      )}

      {category === 'tax' && (
        <>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">NPWP Badan 16 Digit</label>
            <input
              type="text"
              value={credentials.npwp || ''}
              onChange={(e) => update('npwp', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Passphrase Sertifikat Digital</label>
            <input
              type="password"
              value={credentials.certPassphrase || ''}
              onChange={(e) => update('certPassphrase', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </>
      )}
    </div>
  )
}
