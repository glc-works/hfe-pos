export type CoreDemoEnvironment = 'development' | 'staging'

export interface CoreDemoConfig {
  environment: CoreDemoEnvironment
  baseUrl: string
  companyBookId: string
  authorityContextId: string
  accessToken: string
  /** Operational early-access evidence only; Hfe CORE still enforces token, membership, and authority. */
  admission: {
    receiptId: string
    approvedBy: string
    approvedAt: string
    expiresAt: string
  }
  diagnosticSummary: {
    environment: CoreDemoEnvironment
    coreOrigin: string
    companyBookId: string
    authorityContextId: string
    tokenConfigured: true
    admissionReceiptId: string
    admissionApprovedBy: string
    admissionExpiresAt: string
  }
}

type EnvironmentValues = Record<string, string | undefined>

function required(values: EnvironmentValues, key: string): string {
  const value = values[key]?.trim()
  if (!value) throw new Error(`${key} is required for the Hfe CORE demo`)
  return value
}

function requiredTimestamp(values: EnvironmentValues, key: string): { text: string; value: number } {
  const text = required(values, key)
  const value = Date.parse(text)
  if (!Number.isFinite(value)) throw new Error(`${key} must be an ISO-8601 timestamp`)
  return { text, value }
}

export function resolveCoreDemoEnvironment(
  values: EnvironmentValues,
  now = new Date()
): CoreDemoConfig {
  const environment = required(values, 'HFE_CORE_ENVIRONMENT')
  if (environment !== 'development' && environment !== 'staging') {
    throw new Error('HFE_CORE_ENVIRONMENT must be development or staging')
  }

  const baseUrl = new URL(required(values, 'HFE_CORE_BASE_URL'))
  if (baseUrl.username || baseUrl.password || baseUrl.search || baseUrl.hash || baseUrl.pathname !== '/') {
    throw new Error('HFE_CORE_BASE_URL must be a credential-free origin')
  }
  if (environment === 'staging' && baseUrl.protocol !== 'https:') {
    throw new Error('HFE_CORE_BASE_URL must use HTTPS for staging')
  }
  if (
    environment === 'development' &&
    baseUrl.protocol !== 'https:' &&
    !['localhost', '127.0.0.1'].includes(baseUrl.hostname)
  ) {
    throw new Error('development HTTP is allowed only for localhost')
  }

  const companyBookId = required(values, 'HFE_CORE_COMPANY_BOOK_ID')
  const authorityContextId = required(values, 'HFE_CORE_AUTHORITY_CONTEXT_ID')
  const accessToken = required(values, 'HFE_CORE_ACCESS_TOKEN')
  const admissionReceiptId = required(values, 'HFE_CORE_ADMISSION_RECEIPT_ID')
  const admissionApprovedBy = required(values, 'HFE_CORE_ADMISSION_APPROVED_BY')
  const admissionApprovedAt = requiredTimestamp(values, 'HFE_CORE_ADMISSION_APPROVED_AT')
  const admissionExpiresAt = requiredTimestamp(values, 'HFE_CORE_ADMISSION_EXPIRES_AT')
  if (admissionApprovedAt.value > now.getTime()) throw new Error('manual admission approval is not active yet')
  if (admissionExpiresAt.value <= admissionApprovedAt.value) {
    throw new Error('manual admission expiry must follow approval')
  }
  if (admissionExpiresAt.value <= now.getTime()) throw new Error('manual admission receipt has expired')

  return {
    environment,
    baseUrl: baseUrl.origin,
    companyBookId,
    authorityContextId,
    accessToken,
    admission: {
      receiptId: admissionReceiptId,
      approvedBy: admissionApprovedBy,
      approvedAt: admissionApprovedAt.text,
      expiresAt: admissionExpiresAt.text,
    },
    diagnosticSummary: {
      environment,
      coreOrigin: baseUrl.origin,
      companyBookId,
      authorityContextId,
      tokenConfigured: true,
      admissionReceiptId,
      admissionApprovedBy,
      admissionExpiresAt: admissionExpiresAt.text,
    },
  }
}

export function createCoreDemoFinancialPort(values: EnvironmentValues, now = new Date()): {
  port: HfeSdkAdapter
  diagnosticSummary: CoreDemoConfig['diagnosticSummary']
} {
  const config = resolveCoreDemoEnvironment(values, now)
  return {
    port: new HfeSdkAdapter({
      baseUrl: config.baseUrl,
      defaultBookId: config.companyBookId,
      authorityContextId: config.authorityContextId,
      token: config.accessToken,
    }),
    diagnosticSummary: config.diagnosticSummary,
  }
}
import { HfeSdkAdapter } from './HfeSdkAdapter'
