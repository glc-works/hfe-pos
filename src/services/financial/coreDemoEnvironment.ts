export type CoreDemoEnvironment = 'development' | 'staging'

export interface CoreDemoConfig {
  environment: CoreDemoEnvironment
  baseUrl: string
  companyBookId: string
  authorityContextId: string
  accessToken: string
  diagnosticSummary: {
    environment: CoreDemoEnvironment
    coreOrigin: string
    companyBookId: string
    authorityContextId: string
    tokenConfigured: true
  }
}

type EnvironmentValues = Record<string, string | undefined>

function required(values: EnvironmentValues, key: string): string {
  const value = values[key]?.trim()
  if (!value) throw new Error(`${key} is required for the Hfe CORE demo`)
  return value
}

export function resolveCoreDemoEnvironment(values: EnvironmentValues): CoreDemoConfig {
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

  return {
    environment,
    baseUrl: baseUrl.origin,
    companyBookId,
    authorityContextId,
    accessToken,
    diagnosticSummary: {
      environment,
      coreOrigin: baseUrl.origin,
      companyBookId,
      authorityContextId,
      tokenConfigured: true,
    },
  }
}

export function createCoreDemoFinancialPort(values: EnvironmentValues): {
  port: HfeSdkAdapter
  diagnosticSummary: CoreDemoConfig['diagnosticSummary']
} {
  const config = resolveCoreDemoEnvironment(values)
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
