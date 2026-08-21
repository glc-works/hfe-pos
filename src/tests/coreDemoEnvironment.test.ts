import { describe, expect, it } from 'vitest'

import {
  createCoreDemoFinancialPort,
  resolveCoreDemoEnvironment,
} from '../services/financial/coreDemoEnvironment'

describe('Hfe CORE demo environment contract', () => {
  it('fails closed when environment identity or financial authority is incomplete', () => {
    expect(() => resolveCoreDemoEnvironment({})).toThrow('HFE_CORE_ENVIRONMENT')
    expect(() => resolveCoreDemoEnvironment({ HFE_CORE_ENVIRONMENT: 'production' })).toThrow(
      'development or staging'
    )
  })

  it('accepts explicit local development without leaking its token in diagnostics', () => {
    const config = resolveCoreDemoEnvironment({
      HFE_CORE_ENVIRONMENT: 'development',
      HFE_CORE_BASE_URL: 'http://localhost:8080',
      HFE_CORE_COMPANY_BOOK_ID: 'BOOK-DEMO-01',
      HFE_CORE_AUTHORITY_CONTEXT_ID: 'AUTH-DEMO-01',
      HFE_CORE_ACCESS_TOKEN: 'secret-development-token',
      HFE_CORE_ADMISSION_RECEIPT_ID: 'ADMISSION-001',
      HFE_CORE_ADMISSION_APPROVED_BY: 'founder@hfeit.com',
      HFE_CORE_ADMISSION_APPROVED_AT: '2026-08-21T00:00:00.000Z',
      HFE_CORE_ADMISSION_EXPIRES_AT: '2026-09-21T00:00:00.000Z',
    }, new Date('2026-08-22T00:00:00.000Z'))

    expect(config.environment).toBe('development')
    expect(config.diagnosticSummary).toEqual({
      environment: 'development',
      coreOrigin: 'http://localhost:8080',
      companyBookId: 'BOOK-DEMO-01',
      authorityContextId: 'AUTH-DEMO-01',
      tokenConfigured: true,
      admissionReceiptId: 'ADMISSION-001',
      admissionApprovedBy: 'founder@hfeit.com',
      admissionExpiresAt: '2026-09-21T00:00:00.000Z',
    })
    expect(JSON.stringify(config.diagnosticSummary)).not.toContain('secret-development-token')
  })

  it('requires HTTPS for staging', () => {
    const values = {
      HFE_CORE_ENVIRONMENT: 'staging',
      HFE_CORE_BASE_URL: 'http://stg-api.hfeit.app',
      HFE_CORE_COMPANY_BOOK_ID: 'BOOK-STG-01',
      HFE_CORE_AUTHORITY_CONTEXT_ID: 'AUTH-STG-01',
      HFE_CORE_ACCESS_TOKEN: 'secret-staging-token',
      HFE_CORE_ADMISSION_RECEIPT_ID: 'ADMISSION-002',
      HFE_CORE_ADMISSION_APPROVED_BY: 'founder@hfeit.com',
      HFE_CORE_ADMISSION_APPROVED_AT: '2026-08-21T00:00:00.000Z',
      HFE_CORE_ADMISSION_EXPIRES_AT: '2026-09-21T00:00:00.000Z',
    }

    expect(() => resolveCoreDemoEnvironment(values)).toThrow('HTTPS')
  })

  it('constructs the production adapter only from a complete demo contract', () => {
    const result = createCoreDemoFinancialPort({
      HFE_CORE_ENVIRONMENT: 'staging',
      HFE_CORE_BASE_URL: 'https://stg-api.hfeit.app',
      HFE_CORE_COMPANY_BOOK_ID: 'BOOK-STG-01',
      HFE_CORE_AUTHORITY_CONTEXT_ID: 'AUTH-STG-01',
      HFE_CORE_ACCESS_TOKEN: 'secret-staging-token',
      HFE_CORE_ADMISSION_RECEIPT_ID: 'ADMISSION-003',
      HFE_CORE_ADMISSION_APPROVED_BY: 'founder@hfeit.com',
      HFE_CORE_ADMISSION_APPROVED_AT: '2026-08-21T00:00:00.000Z',
      HFE_CORE_ADMISSION_EXPIRES_AT: '2026-09-21T00:00:00.000Z',
    }, new Date('2026-08-22T00:00:00.000Z'))

    expect(result.port.adapterName).toBe('HfeSdkAdapter')
    expect(result.port.isSimulated).toBe(false)
    expect(JSON.stringify(result.diagnosticSummary)).not.toContain('secret-staging-token')
  })

  it('rejects an expired manual admission receipt', () => {
    expect(() => createCoreDemoFinancialPort({
      HFE_CORE_ENVIRONMENT: 'staging',
      HFE_CORE_BASE_URL: 'https://stg-api.hfeit.app',
      HFE_CORE_COMPANY_BOOK_ID: 'BOOK-STG-01',
      HFE_CORE_AUTHORITY_CONTEXT_ID: 'AUTH-STG-01',
      HFE_CORE_ACCESS_TOKEN: 'secret-staging-token',
      HFE_CORE_ADMISSION_RECEIPT_ID: 'ADMISSION-EXPIRED',
      HFE_CORE_ADMISSION_APPROVED_BY: 'founder@hfeit.com',
      HFE_CORE_ADMISSION_APPROVED_AT: '2026-07-01T00:00:00.000Z',
      HFE_CORE_ADMISSION_EXPIRES_AT: '2026-08-01T00:00:00.000Z',
    }, new Date('2026-08-22T00:00:00.000Z'))).toThrow('expired')
  })
})
