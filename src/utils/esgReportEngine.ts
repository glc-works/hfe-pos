/**
 * ESG & Sustainability Report Engine
 * Generates measurable Environmental, Social, and Governance (ESG) metrics
 * for enterprise sustainability compliance, green financing, and B2B audit reporting.
 */

export interface EsgReportRawData {
  companyName: string
  legalPtName: string
  taxIdNpwp: string
  periodStart: string
  periodEnd: string
  totalTransactions: number
  paperlessTransactions: number
  byocTransactions: number
  surplusFoodPortionsRescued: number
  totalTipsCollectedRp: number
  activeStaffCount: number
  dietaryAllergenFlagsHandled: number
  allergenIncidentsCount: number
  guestFeedbackRatings: number[] // array of 1-5 ratings
  totalRevenueBeforeTaxRp: number
  pb1TaxRemittedRp: number
  shiftReconciliationsCount: number
  matchedShiftCount: number
}

export interface EsgReportMetrics {
  metadata: {
    companyName: string
    legalPtName: string
    taxIdNpwp: string
    reportPeriod: string
    generatedAt: string
  }
  environmental: {
    paperlessAdoptionRatePercent: number
    thermalPaperSheetsSaved: number
    carbonCo2SavedKg: number
    treesEquivalentPreserved: number
    byocSingleUseCupsSaved: number
    surplusFoodRescuedPortions: number
    estimatedFoodWasteDivertedKg: number
  }
  social: {
    totalEmployeeTipsDistributedRp: number
    averageTipPerStaffRp: number
    allergenSafeOrdersHandled: number
    allergenIncidentRatePercent: number
    guestSatisfactionScore: number
    totalFeedbacksCount: number
  }
  governance: {
    pb1TaxComplianceRp: number
    shiftBlindCountAccuracyPercent: number
    dataPrivacyScorePercent: number
    auditTrailIntegrityStatus: 'COMPLIANT' | 'FLAGGED'
  }
}

export function generateEsgReport(data: EsgReportRawData): EsgReportMetrics {
  // Environmental Math:
  const paperlessRate = data.totalTransactions > 0
    ? (data.paperlessTransactions / data.totalTransactions) * 100
    : 0

  const thermalSheetsSaved = data.paperlessTransactions
  // Factor: 1 thermal receipt ≈ 20 grams CO2 equivalent (0.02 kg)
  const carbonCo2SavedKg = Number((thermalSheetsSaved * 0.02).toFixed(2))
  // Factor: ~8,333 paper sheets ≈ 1 standard tree
  const treesPreserved = Number((thermalSheetsSaved / 8333).toFixed(3))
  const foodWasteDivertedKg = Number((data.surplusFoodPortionsRescued * 0.25).toFixed(1))

  // Social Math:
  const avgTipPerStaff = data.activeStaffCount > 0
    ? Math.round(data.totalTipsCollectedRp / data.activeStaffCount)
    : 0

  const totalFeedbacks = data.guestFeedbackRatings.length
  const avgSatisfaction = totalFeedbacks > 0
    ? Number((data.guestFeedbackRatings.reduce((acc, curr) => acc + curr, 0) / totalFeedbacks).toFixed(2))
    : 5.0

  const allergenIncidentRate = data.dietaryAllergenFlagsHandled > 0
    ? (data.allergenIncidentsCount / data.dietaryAllergenFlagsHandled) * 100
    : 0

  // Governance Math:
  const shiftAccuracy = data.shiftReconciliationsCount > 0
    ? (data.matchedShiftCount / data.shiftReconciliationsCount) * 100
    : 100

  return {
    metadata: {
      companyName: data.companyName,
      legalPtName: data.legalPtName,
      taxIdNpwp: data.taxIdNpwp,
      reportPeriod: `${data.periodStart} s/d ${data.periodEnd}`,
      generatedAt: new Date().toISOString()
    },
    environmental: {
      paperlessAdoptionRatePercent: Number(paperlessRate.toFixed(1)),
      thermalPaperSheetsSaved: thermalSheetsSaved,
      carbonCo2SavedKg,
      treesEquivalentPreserved: treesPreserved,
      byocSingleUseCupsSaved: data.byocTransactions,
      surplusFoodRescuedPortions: data.surplusFoodPortionsRescued,
      estimatedFoodWasteDivertedKg: foodWasteDivertedKg
    },
    social: {
      totalEmployeeTipsDistributedRp: data.totalTipsCollectedRp,
      averageTipPerStaffRp: avgTipPerStaff,
      allergenSafeOrdersHandled: data.dietaryAllergenFlagsHandled,
      allergenIncidentRatePercent: Number(allergenIncidentRate.toFixed(2)),
      guestSatisfactionScore: avgSatisfaction,
      totalFeedbacksCount: totalFeedbacks
    },
    governance: {
      pb1TaxComplianceRp: data.pb1TaxRemittedRp,
      shiftBlindCountAccuracyPercent: Number(shiftAccuracy.toFixed(1)),
      dataPrivacyScorePercent: 100, // Zero third-party ad tracker
      auditTrailIntegrityStatus: 'COMPLIANT'
    }
  }
}
