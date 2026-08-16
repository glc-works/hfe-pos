import { describe, it, expect } from 'vitest'
import { generateEsgReport, EsgReportRawData } from '../utils/esgReportEngine'

describe('ESG Sustainability Report Calculation Engine (L1-20 / L2-POS-23)', () => {
  const sampleData: EsgReportRawData = {
    companyName: 'Kopitiam Senopati',
    legalPtName: 'PT Kopi Nusantara Abadi',
    taxIdNpwp: '01.2026.889.2.100.000',
    periodStart: '01 Jan 2026',
    periodEnd: '30 Jun 2026',
    totalTransactions: 10000,
    paperlessTransactions: 9000,
    byocTransactions: 2500,
    surplusFoodPortionsRescued: 400,
    totalTipsCollectedRp: 24000000,
    activeStaffCount: 12,
    dietaryAllergenFlagsHandled: 300,
    allergenIncidentsCount: 0,
    guestFeedbackRatings: [5, 5, 4, 5, 5, 4, 5, 5],
    totalRevenueBeforeTaxRp: 800000000,
    pb1TaxRemittedRp: 80000000,
    shiftReconciliationsCount: 100,
    matchedShiftCount: 99
  }

  it('calculates Environmental metrics correctly (Paperless %, CO2e, Trees, BYOC)', () => {
    const report = generateEsgReport(sampleData)
    expect(report.environmental.paperlessAdoptionRatePercent).toBe(90.0)
    expect(report.environmental.thermalPaperSheetsSaved).toBe(9000)
    // 9000 * 0.02 = 180 kg CO2e
    expect(report.environmental.carbonCo2SavedKg).toBe(180)
    // 9000 / 8333 ≈ 1.080 trees
    expect(report.environmental.treesEquivalentPreserved).toBe(1.08)
    expect(report.environmental.byocSingleUseCupsSaved).toBe(2500)
    expect(report.environmental.surplusFoodRescuedPortions).toBe(400)
  })

  it('calculates Social & Workforce metrics correctly (Tip distribution, Allergen rate, Ratings)', () => {
    const report = generateEsgReport(sampleData)
    expect(report.social.totalEmployeeTipsDistributedRp).toBe(24000000)
    expect(report.social.averageTipPerStaffRp).toBe(2000000) // 24M / 12 = 2M per staff
    expect(report.social.allergenIncidentRatePercent).toBe(0)
    expect(report.social.guestSatisfactionScore).toBeGreaterThan(4.5)
  })

  it('calculates Governance & Tax Integrity metrics correctly (PB1 10%, Blind Count Accuracy)', () => {
    const report = generateEsgReport(sampleData)
    expect(report.governance.pb1TaxComplianceRp).toBe(80000000)
    expect(report.governance.shiftBlindCountAccuracyPercent).toBe(99.0)
    expect(report.governance.dataPrivacyScorePercent).toBe(100)
    expect(report.governance.auditTrailIntegrityStatus).toBe('COMPLIANT')
  })

  it('handles edge cases gracefully without division by zero', () => {
    const zeroData: EsgReportRawData = {
      ...sampleData,
      totalTransactions: 0,
      paperlessTransactions: 0,
      activeStaffCount: 0,
      dietaryAllergenFlagsHandled: 0,
      guestFeedbackRatings: [],
      shiftReconciliationsCount: 0
    }

    const report = generateEsgReport(zeroData)
    expect(report.environmental.paperlessAdoptionRatePercent).toBe(0)
    expect(report.social.averageTipPerStaffRp).toBe(0)
    expect(report.social.guestSatisfactionScore).toBe(5.0)
    expect(report.governance.shiftBlindCountAccuracyPercent).toBe(100)
  })
})
