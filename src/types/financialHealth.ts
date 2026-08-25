// --- UNIVERSAL FINANCIAL HEALTH & WORKING CAPITAL GAUGE TYPES ---

export type AssetValuationCategory = 
  | 'fnb_raw_ingredients' 
  | 'retail_merchandise' 
  | 'mfg_wip' 
  | 'biological_produce' 
  | 'general_fixed_assets'

export interface FinancialHealthSnapshot {
  cashRunwayDays: number
  cashRunwayStatus: 'healthy' | 'warning' | 'critical'
  quickRatio: number
  grossMarginPercent: number
  operatingMarginPercent: number
  netMarginPercent: number
  workingCapitalMinor: number
  inventoryTurnoverDays: number
  taxReserveFundMinor: number
  taxObligationMinor: number
  taxReserveFundStatus: 'sufficient' | 'deficit'
  assetCategory: AssetValuationCategory
  assetValuationMinor: number
  assetTurnoverVelocityScore: number // 0-100 score
  dailyBurnRateMinor: number
  liquidCashMinor: number
}
