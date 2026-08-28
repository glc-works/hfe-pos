import { describe, it, expect } from 'vitest'
import { writeFileSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  parseArguments,
  validateSyntheticScope,
  generateReceipt,
} from '../../scripts/hlab-verify-flagship.mjs'

describe('HLab Synthetic Flagship Verification Contract (Issue #100)', () => {
  it('parses canonical CLI arguments correctly', () => {
    const argv = [
      '--hlab-synthetic-tenant', '01a035df-b618-7612-aef2-6e332bfcdec5',
      '--hlab-synthetic-company-book', 'BOOK-CAFE-HQ-88',
      '--receipt-out', '/tmp/test-receipt.json',
      '--json',
    ]

    const parsed = parseArguments(argv)
    expect(parsed.syntheticTenant).toBe('01a035df-b618-7612-aef2-6e332bfcdec5')
    expect(parsed.syntheticCompanyBook).toBe('BOOK-CAFE-HQ-88')
    expect(parsed.receiptOut).toBe('/tmp/test-receipt.json')
    expect(parsed.rawJson).toBe(true)
  })

  it('supports short alias arguments (--tenant, --company-book)', () => {
    const argv = [
      '--tenant', '01a035df-b618-7612-aef2-6e332bfcdec5',
      '--company-book', 'BOOK-CAFE-HQ-88',
    ]

    const parsed = parseArguments(argv)
    expect(parsed.syntheticTenant).toBe('01a035df-b618-7612-aef2-6e332bfcdec5')
    expect(parsed.syntheticCompanyBook).toBe('BOOK-CAFE-HQ-88')
  })

  it('reads typed input JSON file when provided', () => {
    const tempFile = resolve(process.cwd(), 'temp-hlab-input.json')
    writeFileSync(tempFile, JSON.stringify({
      tenantId: '01a035df-b618-7612-aef2-6e332bfcdec5',
      companyBookId: 'BOOK-CAFE-HQ-88',
    }))

    try {
      const parsed = parseArguments(['--input-file', 'temp-hlab-input.json'])
      expect(parsed.syntheticTenant).toBe('01a035df-b618-7612-aef2-6e332bfcdec5')
      expect(parsed.syntheticCompanyBook).toBe('BOOK-CAFE-HQ-88')
    } finally {
      unlinkSync(tempFile)
    }
  })

  it('fails closed when synthetic tenant or book is missing', () => {
    expect(() => validateSyntheticScope({ syntheticTenant: '', syntheticCompanyBook: 'BOOK-CAFE-HQ-88' }))
      .toThrow(/Missing required --hlab-synthetic-tenant/)

    expect(() => validateSyntheticScope({ syntheticTenant: '01a035df-b618-7612-aef2-6e332bfcdec5', syntheticCompanyBook: '' }))
      .toThrow(/Missing required --hlab-synthetic-company-book/)
  })

  it('fails closed and rejects production or non-synthetic scope', () => {
    expect(() => validateSyntheticScope({
      syntheticTenant: 'prod-enterprise-tenant-01',
      syntheticCompanyBook: 'BOOK-CAFE-HQ-88',
    })).toThrow(/Non-synthetic\/production scope rejected/)

    expect(() => validateSyntheticScope({
      syntheticTenant: '01a035df-b618-7612-aef2-6e332bfcdec5',
      syntheticCompanyBook: 'company-book-live-real-user',
    })).toThrow(/Non-synthetic\/production scope rejected/)

    expect(() => validateSyntheticScope({
      syntheticTenant: 'invalid!special!characters',
      syntheticCompanyBook: 'BOOK-CAFE-HQ-88',
    })).toThrow(/Invalid synthetic identifier pattern/)
  })

  it('accepts valid synthetic tenant and company book scopes', () => {
    const valid = validateSyntheticScope({
      syntheticTenant: '01a035df-b618-7612-aef2-6e332bfcdec5',
      syntheticCompanyBook: 'BOOK-CAFE-HQ-88',
    })
    expect(valid).toEqual({
      tenant: '01a035df-b618-7612-aef2-6e332bfcdec5',
      book: 'BOOK-CAFE-HQ-88',
    })
  })

  it('generates schema-compliant machine-readable verification receipt', () => {
    const passedReceipt = generateReceipt({
      status: 'passed',
      syntheticTenant: '01a035df-b618-7612-aef2-6e332bfcdec5',
      syntheticCompanyBook: 'BOOK-CAFE-HQ-88',
      durationMs: 14500,
      testCount: 6,
      passedCount: 6,
      failedCount: 0,
      tests: [{ title: 'flagship test 1', ok: true }],
    })

    expect(passedReceipt).toMatchObject({
      contract_version: '1.0.0',
      schema: 'hlab.flagship-verification-receipt.v1',
      status: 'passed',
      synthetic_tenant: '01a035df-b618-7612-aef2-6e332bfcdec5',
      synthetic_company_book: 'BOOK-CAFE-HQ-88',
      test_count: 6,
      passed_count: 6,
      failed_count: 0,
      lineage_verified: true,
      truth_boundary_verified: true,
    })
    expect(passedReceipt.executed_at).toBeDefined()

    const failedReceipt = generateReceipt({
      status: 'failed',
      syntheticTenant: '01a035df-b618-7612-aef2-6e332bfcdec5',
      syntheticCompanyBook: 'BOOK-CAFE-HQ-88',
      errorMessage: 'Posting lineage mismatch',
    })

    expect(failedReceipt.status).toBe('failed')
    expect(failedReceipt.lineage_verified).toBe(false)
    expect(failedReceipt.truth_boundary_verified).toBe(false)
    expect(failedReceipt.error_message).toBe('Posting lineage mismatch')
  })
})
