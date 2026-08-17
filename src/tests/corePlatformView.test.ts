import { describe, it, expect } from 'vitest'
import { CorePlatformView } from '../views/CorePlatformView'
import { DoubleEntrySandbox } from '../components/core/sandbox/DoubleEntrySandbox'
import {
  CoreHeroSection,
  CoreArchitectureVisualizer,
  CorePillarsShowcase,
  CorePricingSection
} from '../components/core/landing'
import {
  ConnectorsCatalogGrid,
  WebhookRelayPanel,
  BetaAllowlistTable,
  VendorClaimsTable,
  DeveloperKeysManager
} from '../components/core/hub'
import { ScalarApiExplorer } from '../components/core/docs/ScalarApiExplorer'

describe('CorePlatformView Master Runtime Experience (CORE.Hfeit.com)', () => {
  it('should export all Core Platform and sub-components', () => {
    expect(CorePlatformView).toBeDefined()
    expect(typeof CorePlatformView).toBe('function')

    expect(DoubleEntrySandbox).toBeDefined()
    expect(typeof DoubleEntrySandbox).toBe('function')

    expect(CoreHeroSection).toBeDefined()
    expect(CoreArchitectureVisualizer).toBeDefined()
    expect(CorePillarsShowcase).toBeDefined()
    expect(CorePricingSection).toBeDefined()

    expect(ConnectorsCatalogGrid).toBeDefined()
    expect(WebhookRelayPanel).toBeDefined()
    expect(BetaAllowlistTable).toBeDefined()
    expect(VendorClaimsTable).toBeDefined()
    expect(DeveloperKeysManager).toBeDefined()

    expect(ScalarApiExplorer).toBeDefined()
  })
})
