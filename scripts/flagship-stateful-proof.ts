import { resolveCoreDemoEnvironment } from '../src/services/financial/coreDemoEnvironment'
import { HfeSdkAdapter } from '../src/services/financial/HfeSdkAdapter'

type EnvironmentValues = Record<string, string | undefined>

export interface FlagshipStatefulProofEvidence {
  schemaVersion: 1
  result: 'pass'
  observedAt: string
  environment: 'development' | 'staging'
  coreOrigin: string
  companyBookId: string
  authorityContextId: string
  admissionReceiptId: string
  admissionParticipantId: string
  admissionScope: 'flagship-pos-demo'
  settlementId: string
  postingId: string
  postingStateRevision: string
  sourceObjectId: string
  stableEffectKey: string
  idempotencyReplayVerified: true
}

function required(values: EnvironmentValues, key: string): string {
  const value = values[key]?.trim()
  if (!value) throw new Error(`${key} is required for the flagship stateful proof`)
  return value
}

export async function runFlagshipStatefulProof(
  values: EnvironmentValues,
  now = new Date(),
  fetchFn: typeof globalThis.fetch = globalThis.fetch
): Promise<FlagshipStatefulProofEvidence> {
  const config = resolveCoreDemoEnvironment(values, now)
  const documentReferenceId = required(values, 'HFE_POS_DOCUMENT_REFERENCE_ID')
  const totalObligationMinor = required(values, 'HFE_POS_TOTAL_OBLIGATION_MINOR')
  const idempotencyKey = required(values, 'HFE_POS_IDEMPOTENCY_KEY')
  const adapter = new HfeSdkAdapter({
    baseUrl: config.baseUrl,
    defaultBookId: config.companyBookId,
    authorityContextId: config.authorityContextId,
    token: config.accessToken,
    fetchFn,
  })
  const settlement = await adapter.settleUniversalMultiTender({
    document_kind: 'pos_retail_order',
    document_reference_id: documentReferenceId,
    total_obligation_minor: totalObligationMinor,
    tenders: [{ tender_type: 'cash', amount_minor: totalObligationMinor }],
    idempotency_key: idempotencyKey,
    notes: 'Hfe POS invite-only flagship stateful proof',
  })
  if (!settlement.posting_verified || !settlement.posting_state_revision) {
    throw new Error('canonical posting verification evidence is required')
  }
  const replay = await adapter.settleUniversalMultiTender({
    document_kind: 'pos_retail_order',
    document_reference_id: documentReferenceId,
    total_obligation_minor: totalObligationMinor,
    tenders: [{ tender_type: 'cash', amount_minor: totalObligationMinor }],
    idempotency_key: idempotencyKey,
    notes: 'Hfe POS invite-only flagship stateful proof',
  })
  if (!replay.posting_verified || replay.journal_posting_id !== settlement.journal_posting_id) {
    throw new Error('idempotency replay did not resolve to the original canonical posting')
  }

  return {
    schemaVersion: 1,
    result: 'pass',
    observedAt: now.toISOString(),
    environment: config.environment,
    coreOrigin: config.baseUrl,
    companyBookId: config.companyBookId,
    authorityContextId: config.authorityContextId,
    admissionReceiptId: config.admission.receiptId,
    admissionParticipantId: config.admission.participantId,
    admissionScope: config.admission.scope,
    settlementId: settlement.settlement_id,
    postingId: settlement.journal_posting_id,
    postingStateRevision: settlement.posting_state_revision,
    sourceObjectId: documentReferenceId,
    stableEffectKey: idempotencyKey,
    idempotencyReplayVerified: true,
  }
}

async function main(): Promise<void> {
  try {
    const evidence = await runFlagshipStatefulProof(process.env)
    process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`)
  } catch (error: unknown) {
    const errorName = error instanceof Error ? error.name : 'UnknownError'
    process.stderr.write(`Flagship stateful proof failed closed (${errorName}).\n`)
    process.exitCode = 1
  }
}

if (process.env.VITEST !== 'true') {
  void main()
}
