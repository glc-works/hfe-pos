import { describe, it, expect } from 'vitest'
import {
  OPENAPI_DOMAINS,
  TOTAL_OPENAPI_ENDPOINTS,
  TOTAL_OPENAPI_DOMAINS,
  OPENAPI_SPEC_VERSION
} from '../data/openApiRegistry'
import { ScalarApiExplorer } from '../components/core/docs/ScalarApiExplorer'
import { CoreLandingView } from '../views/CoreLandingView'

describe('Embedded In-App Interactive Scalar API Docs (Pillar 0 CORE)', () => {
  it('should conform to OpenAPI 3.1 specification invariants', () => {
    expect(OPENAPI_SPEC_VERSION).toBe('3.1.0')
    expect(TOTAL_OPENAPI_DOMAINS).toBe(44)
    expect(TOTAL_OPENAPI_ENDPOINTS).toBe(494)
    expect(OPENAPI_DOMAINS.length).toBe(44)
  })

  it('should calculate total indexed endpoints across all 44 domains', () => {
    const totalCount = OPENAPI_DOMAINS.reduce((acc, domain) => acc + domain.endpointCount, 0)
    expect(totalCount).toBe(494)
  })

  it('should include core domain endpoints with required OIDC auth and idempotency', () => {
    const coreBooksDomain = OPENAPI_DOMAINS.find((d) => d.id === 'core-books')
    expect(coreBooksDomain).toBeDefined()
    expect(coreBooksDomain?.endpoints.length).toBeGreaterThan(0)

    const transferEndpoint = coreBooksDomain?.endpoints.find((e) => e.path.includes('/transfers'))
    expect(transferEndpoint).toBeDefined()
    expect(transferEndpoint?.method).toBe('POST')
    expect(transferEndpoint?.requiresAuth).toBe(true)
    expect(transferEndpoint?.idempotent).toBe(true)
    expect(transferEndpoint?.requestBodySchema).toBeDefined()
  })

  it('should include SNAP BI Open Banking and POS cashier domains', () => {
    const bankingDomain = OPENAPI_DOMAINS.find((d) => d.id === 'snap-bi-banking')
    expect(bankingDomain).toBeDefined()
    expect(bankingDomain?.name).toContain('SNAP BI')

    const posDomain = OPENAPI_DOMAINS.find((d) => d.id === 'pos-checkout')
    expect(posDomain).toBeDefined()
    expect(posDomain?.endpoints.some((e) => e.method === 'POST')).toBe(true)
  })

  it('should verify component modules are defined and callable', () => {
    expect(ScalarApiExplorer).toBeDefined()
    expect(typeof ScalarApiExplorer).toBe('function')

    expect(CoreLandingView).toBeDefined()
    expect(typeof CoreLandingView).toBe('function')
  })
})
