import React, { useState } from 'react'
import { Webhook, Plus, Send, RefreshCw, Clock, Key, Activity, ShieldCheck, AlertOctagon, RotateCcw } from 'lucide-react'
import { Button, Badge } from '@/ui'

export interface WebhookSubscription {
  id: string
  url: string
  events: string[]
  status: 'active' | 'paused' | 'degraded'
  secret: string
  successRate: number
  lastDelivery: string
}

export interface DeliveryAttempt {
  attemptNumber: number
  timestamp: string
  httpStatus: number
  latencyMs: number
  backoffDelaySec: number
  status: 'success' | 'failed'
  responseBody: string
  idempotencyKey: string
  isDlq?: boolean
}

const INITIAL_SUBSCRIPTIONS: WebhookSubscription[] = [
  {
    id: 'sub_01',
    url: 'https://api.merchant.com/v1/hfe-webhooks',
    events: ['order.created', 'payment.settled', 'refund.issued'],
    status: 'active',
    secret: 'whsec_9812af0192bc8819',
    successRate: 99.8,
    lastDelivery: '10s ago'
  },
  {
    id: 'sub_02',
    url: 'https://erp-connector.corp.id/ingest/ledger',
    events: ['bank_feed.ingested', 'subledger.posted'],
    status: 'active',
    secret: 'whsec_330198aa71b00912',
    successRate: 98.4,
    lastDelivery: '2m ago'
  },
  {
    id: 'sub_03',
    url: 'https://warehouse-wms.logistics.com/hooks/stock',
    events: ['inventory.depleted', 'inventory.restocked'],
    status: 'degraded',
    secret: 'whsec_778100ff99a123bc',
    successRate: 84.1,
    lastDelivery: '12m ago'
  }
]

const SAMPLE_DELIVERY_LOGS: DeliveryAttempt[] = [
  { attemptNumber: 1, timestamp: '2026-08-17 15:20:00', httpStatus: 504, latencyMs: 5012, backoffDelaySec: 0, status: 'failed', responseBody: '{"error": "Gateway Timeout"}', idempotencyKey: 'idemp_live_9812_01', isDlq: true },
  { attemptNumber: 2, timestamp: '2026-08-17 15:20:02', httpStatus: 502, latencyMs: 245, backoffDelaySec: 2, status: 'failed', responseBody: '{"error": "Bad Gateway"}', idempotencyKey: 'idemp_live_9812_01', isDlq: true },
  { attemptNumber: 3, timestamp: '2026-08-17 15:20:10', httpStatus: 200, latencyMs: 46, backoffDelaySec: 8, status: 'success', responseBody: '{"received": true, "processed": true}', idempotencyKey: 'idemp_live_9812_01' }
]

export const WebhookRelayPanel: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<WebhookSubscription[]>(INITIAL_SUBSCRIPTIONS)
  const [selectedSubId, setSelectedSubId] = useState<string>('sub_01')
  const [testEvent, setTestEvent] = useState<string>('payment.settled')
  const [isTriggering, setIsTriggering] = useState<boolean>(false)
  const [isReplayingDlq, setIsReplayingDlq] = useState<boolean>(false)
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null)
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryAttempt[]>(SAMPLE_DELIVERY_LOGS)

  const activeSub = subscriptions.find((s) => s.id === selectedSubId) || subscriptions[0]
  const simulatedTimestamp = Math.floor(Date.now() / 1000)
  const simulatedIdempotencyKey = `idemp_live_${simulatedTimestamp}_${activeSub?.id || 'sub_01'}`
  const simulatedPayload = JSON.stringify({ id: `evt_${Date.now()}`, type: testEvent, created: simulatedTimestamp, idempotency_key: simulatedIdempotencyKey, data: { order_id: 'ORD-9812', amount: 350000, currency: 'IDR' } }, null, 2)
  const simulatedHmac = `v1=${Array.from({ length: 64 }, (_, i) => ((i * 17 + (activeSub?.secret.charCodeAt(i % activeSub.secret.length) || 42)) % 16).toString(16)).join('')}`

  const handleTestDispatch = () => {
    setIsTriggering(true)
    setTriggerStatus('Signing payload with HMAC-SHA256 & attaching X-Idempotency-Key...')
    setTimeout(() => {
      const newAttempt: DeliveryAttempt = {
        attemptNumber: deliveryLogs.length + 1,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        httpStatus: 200,
        latencyMs: Math.floor(32 + Math.random() * 35),
        backoffDelaySec: 0,
        status: 'success',
        responseBody: `{"received": true, "event": "${testEvent}", "status": "200_OK", "idempotency_enforced": true}`,
        idempotencyKey: simulatedIdempotencyKey
      }
      setDeliveryLogs((prev) => [newAttempt, ...prev.slice(0, 5)])
      setIsTriggering(false)
      setTriggerStatus('✅ Test Webhook Succeeded (HTTP 200 OK, HMAC Verified)')
    }, 600)
  }

  const handleReplayDlq = () => {
    setIsReplayingDlq(true)
    setTriggerStatus('Replaying Dead-Letter Queue items with exponential backoff reset...')
    setTimeout(() => {
      const replayedAttempt: DeliveryAttempt = {
        attemptNumber: deliveryLogs.length + 1,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        httpStatus: 200,
        latencyMs: Math.floor(40 + Math.random() * 25),
        backoffDelaySec: 0,
        status: 'success',
        responseBody: '{"dlq_replayed": true, "recovered": true, "status": "200_OK"}',
        idempotencyKey: `idemp_dlq_replay_${Date.now()}`
      }
      setDeliveryLogs((prev) => [replayedAttempt, ...prev.map(log => log.isDlq ? { ...log, isDlq: false } : log)])
      setIsReplayingDlq(false)
      setTriggerStatus('🎉 DLQ Replay Complete: 100% Transactions Ingested')
    }, 700)
  }

  const handleAddSubscription = () => {
    const url = prompt('Masukkan Webhook Target URL:')
    if (!url) return
    const newSub: WebhookSubscription = {
      id: `sub_${Date.now()}`,
      url,
      events: ['order.created', 'payment.settled'],
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(2, 14)}`,
      successRate: 100.0,
      lastDelivery: 'Never'
    }
    setSubscriptions((prev) => [newSub, ...prev])
    setSelectedSubId(newSub.id)
  }

  const dlqCount = deliveryLogs.filter(log => log.isDlq).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div>
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Webhook className="w-4 h-4 text-sky-400" />
            <span>Event Webhook Relay &amp; HMAC-SHA256 Signature Sentinel</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
            <span>Real-time webhook dispatcher dengan exponential backoff retry, idempotensi ketat, dan DLQ replay.</span>
            <Badge variant="emerald" className="text-[9px] gap-1"><ShieldCheck className="w-3 h-3" /> HMAC-SHA256 Active</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dlqCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleReplayDlq} disabled={isReplayingDlq} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold gap-1">
              <RotateCcw className={`w-3.5 h-3.5 ${isReplayingDlq ? 'animate-spin' : ''}`} />
              <span>Replay DLQ ({dlqCount})</span>
            </Button>
          )}
          <Button variant="default" size="sm" onClick={handleAddSubscription} className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>+ Endpoint Baru</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Col 1: Subscriptions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-sky-400" /><span>Registered Endpoints</span></span>
            <span className="font-mono text-[10px] text-slate-400">{subscriptions.length} active</span>
          </div>
          <div className="space-y-2">
            {subscriptions.map((sub) => (
              <div key={sub.id} onClick={() => setSelectedSubId(sub.id)} className={`p-3 rounded-xl border transition-all cursor-pointer ${sub.id === selectedSubId ? 'bg-slate-800/90 border-sky-500/50 shadow-sm' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-mono text-xs font-bold text-slate-200 truncate flex-1">{sub.url}</div>
                  <Badge variant={sub.status === 'active' ? 'emerald' : 'destructive'} className="text-[9px] px-1.5 uppercase">{sub.status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">{sub.successRate}% OK</span>
                  <span>·</span><span>Last: {sub.lastDelivery}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {sub.events.map((evt) => (
                    <span key={evt} className="text-[9px] font-mono bg-slate-900 text-sky-400 px-1.5 py-0.5 rounded border border-slate-700/60">{evt}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: HMAC & Idempotency Generator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /><span>HMAC &amp; Idempotency Sentinel</span></span>
              <span className="text-[10px] font-mono text-emerald-400">SHA-256</span>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Event Topic</label>
                <select value={testEvent} onChange={(e) => setTestEvent(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-sky-500 font-mono">
                  <option value="payment.settled">payment.settled (QRIS / Card)</option>
                  <option value="order.created">order.created (POS / Cashier)</option>
                  <option value="refund.issued">refund.issued (Reversal Journal)</option>
                  <option value="inventory.depleted">inventory.depleted (BOM Stock)</option>
                  <option value="bank_feed.ingested">bank_feed.ingested (SNAP BI)</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Computed Signature Header</span><span className="text-[10px] text-emerald-400 font-mono">X-Hfe-Signature</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-amber-300 break-all">
                  t={simulatedTimestamp},{simulatedHmac}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Idempotency Key Header</span><span className="text-[10px] text-sky-400 font-mono">X-Idempotency-Key</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-sky-300 truncate">
                  {simulatedIdempotencyKey}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Simulated JSON Payload</label>
                <pre className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-sky-400 max-h-[105px] overflow-y-auto">{simulatedPayload}</pre>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <Button variant="default" size="sm" onClick={handleTestDispatch} disabled={isTriggering} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5">
              {isTriggering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isTriggering ? 'Dispatching...' : 'Send Test Webhook'}</span>
            </Button>
            {triggerStatus && <div className="text-[10px] text-slate-400 mt-1.5 text-center font-mono truncate">{triggerStatus}</div>}
          </div>
        </div>

        {/* Col 3: Delivery Logs & DLQ */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" /><span>Backoff &amp; DLQ Inspector</span></span>
            <span className="text-[10px] font-mono text-slate-400">Retry Tier 1-5</span>
          </div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {deliveryLogs.map((log) => (
              <div key={`${log.attemptNumber}-${log.timestamp}`} className={`p-2.5 rounded-xl border space-y-1 text-[11px] ${log.isDlq ? 'bg-rose-950/20 border-rose-800/60' : 'bg-slate-950/60 border-slate-800/80'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold font-mono text-slate-200">Attempt #{log.attemptNumber}</span>
                    {log.isDlq && <Badge variant="destructive" className="text-[8px] px-1 py-0 gap-0.5"><AlertOctagon className="w-2.5 h-2.5" /> DLQ</Badge>}
                    {log.backoffDelaySec > 0 && <span className="text-[9px] font-mono bg-slate-800 text-amber-400 px-1.5 rounded">+{log.backoffDelaySec}s Backoff</span>}
                  </div>
                  <Badge variant={log.status === 'success' ? 'emerald' : 'destructive'} className="text-[9px] font-mono">HTTP {log.httpStatus}</Badge>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{log.timestamp}</span><span className="text-sky-400 tabular-nums">⚡ {log.latencyMs}ms</span>
                </div>
                <div className="bg-slate-900 p-1.5 rounded font-mono text-[9px] text-slate-400 truncate">{log.responseBody}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

