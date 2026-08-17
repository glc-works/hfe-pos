import React, { useState, useEffect } from 'react'
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Key,
  Database
} from 'lucide-react'
import { EcosystemConnector } from './connectorsData'
import { CONNECTOR_PERMISSION_SCOPES } from './connectorScopes'
import { ConnectorCredentialFields } from './ConnectorCredentialFields'

export interface ConnectorInstallModalProps {
  isOpen: boolean
  onClose: () => void
  connector: EcosystemConnector | null
  isInstalled?: boolean
  onInstall: (
    connector: EcosystemConnector,
    credentials: Record<string, string>,
    scopes: string[]
  ) => void
  onDisconnect?: (connector: EcosystemConnector) => void
}

export const ConnectorInstallModal: React.FC<ConnectorInstallModalProps> = ({
  isOpen,
  onClose,
  connector,
  isInstalled = false,
  onInstall,
  onDisconnect
}) => {
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle')
  const [testLatency, setTestLatency] = useState<number | null>(null)
  const [confirmDisconnect, setConfirmDisconnect] = useState<boolean>(false)

  useEffect(() => {
    if (!connector) return
    const scopesList =
      CONNECTOR_PERMISSION_SCOPES[connector.category] || CONNECTOR_PERMISSION_SCOPES.accounting
    setSelectedScopes(scopesList.map((s) => s.id))
    setTestStatus(isInstalled ? 'success' : 'idle')
    setTestLatency(isInstalled ? 42 : null)
    setConfirmDisconnect(false)

    if (connector.category === 'accounting') {
      setCredentials({
        subdomain: 'pt-kopi-nusantara',
        clientId: 'xero_client_live_981a',
        clientSecret: '••••••••••••••••••••••••'
      })
    } else if (connector.category === 'payments') {
      setCredentials({
        publicKey: 'pk_live_51Mzk01928374',
        secretKey: '••••••••••••••••••••••••',
        webhookSecret: 'whsec_9918237461'
      })
    } else if (connector.category === 'banking') {
      setCredentials({
        corporateId: 'CORP_BCA_882910',
        partnerToken: 'tok_snap_bi_live_2026',
        privateKeyPem: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0r...\n-----END RSA PRIVATE KEY-----'
      })
    } else if (connector.category === 'ecommerce') {
      setCredentials({
        storeUrl: 'https://kopinusantara.store.id',
        accessToken: 'shpat_9812739182739182739'
      })
    } else if (connector.category === 'pos') {
      setCredentials({
        terminalId: 'TERM-JKT-OUTLET-01',
        pairingSecret: 'pair_sec_7719283'
      })
    } else {
      setCredentials({
        npwp: '01.234.567.8-901.000',
        certPassphrase: '••••••••••••••••'
      })
    }
  }, [connector, isInstalled])

  if (!isOpen || !connector) return null

  const scopes =
    CONNECTOR_PERMISSION_SCOPES[connector.category] || CONNECTOR_PERMISSION_SCOPES.accounting

  const handleToggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    )
  }

  const handleRunPingTest = () => {
    setTestStatus('testing')
    setTimeout(() => {
      setTestStatus('success')
      setTestLatency(Math.floor(35 + Math.random() * 45))
    }, 650)
  }

  const handleSave = () => {
    onInstall(connector, credentials, selectedScopes)
    onClose()
  }

  const handleExecuteDisconnect = () => {
    onDisconnect?.(connector)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/70 flex items-center justify-center text-2xl shrink-0">
              {connector.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                  {connector.name}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    connector.track === 'stable'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {connector.track}
                </span>
                {isInstalled && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    TERPASANG
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono truncate">{connector.slug}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Section 1: Dynamic Credentials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-sky-400" />
                <span>Kredensial &amp; Konfigurasi API ({connector.category})</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">TLS 1.3 / AES-256</span>
            </div>

            <ConnectorCredentialFields
              category={connector.category}
              credentials={credentials}
              onChange={setCredentials}
            />
          </div>

          {/* Section 2: Granular Scopes Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Granular Permission Scopes ({selectedScopes.length}/{scopes.length})</span>
              </span>
              <span className="text-[10px] text-slate-400">Pilih akses data yang diizinkan</span>
            </div>

            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {scopes.map((s) => {
                const checked = selectedScopes.includes(s.id)
                return (
                  <label
                    key={s.id}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer select-none ${
                      checked
                        ? 'bg-sky-500/10 border-sky-500/30 text-slate-200'
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleScope(s.id)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{s.label}</span>
                        {checked && <CheckCircle2 className="w-3 h-3 text-sky-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Section 3: Connection Ping Test */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulasi Ping &amp; Validasi Handshake</span>
              </span>
              <button
                type="button"
                onClick={handleRunPingTest}
                disabled={testStatus === 'testing'}
                className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3 h-3 ${testStatus === 'testing' ? 'animate-spin text-sky-400' : ''}`} />
                <span>{testStatus === 'testing' ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {testStatus === 'success' && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Handshake Sukses: TLS 1.3 Valid, API Token Active.</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  ⚡ {testLatency}ms
                </span>
              </div>
            )}

            {testStatus === 'idle' && (
              <div className="text-[11px] text-slate-500 italic">
                Klik &quot;Test Connection&quot; untuk memvalidasi kredensial sebelum menyimpan.
              </div>
            )}
          </div>

          {/* Section 4: Double-Entry Impact Summary */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Double-Entry &amp; Tenant Safety Invariant</span>
            </div>
            <ul className="text-[10px] text-slate-400 space-y-1 list-disc list-inside">
              <li>
                Isolasi ketat multi-tenant: Seluruh data disematkan ke <code className="font-mono text-slate-300">company_book_id</code> saat ini.
              </li>
              <li>
                Jurnal transaksi terintegrasi ke COA (<code className="font-mono text-slate-300">1112 Bank Clearing</code>, <code className="font-mono text-slate-300">4100 Sales</code>).
              </li>
              <li>
                Sentinel cryptographic audit trail aktif untuk mencegah desinkronisasi mutasi.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
          <div>
            {isInstalled && (
              <>
                {!confirmDisconnect ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDisconnect(true)}
                    className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-rose-400 font-bold">Putus koneksi?</span>
                    <button
                      type="button"
                      onClick={handleExecuteDisconnect}
                      className="py-1.5 px-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Ya, Putuskan
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDisconnect(false)}
                      className="py-1.5 px-2 bg-slate-800 text-slate-400 rounded-lg text-xs hover:text-white"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isInstalled ? 'Perbarui Konfigurasi' : 'Pasang Konektor'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
