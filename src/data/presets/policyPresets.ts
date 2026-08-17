/**
 * Official Business Policy Presets Compiled from E2E Master Scenarios
 * Standard: GLC-ARCH-TENANCY-001 Section 10
 */

export interface CompanyPolicyPreset {
  id: string;
  title: string;
  domain: string;
  rules: Record<string, unknown>;
}

export const POLICY_CAFE_FAST_CASHIER: CompanyPolicyPreset = {
  id: 'POLICY_CAFE_FAST_CASHIER',
  title: 'F&B Offline Fast Cashier & Shift Session Policy',
  domain: 'POS & Retail',
  rules: {
    allow_offline_sync: true,
    max_shift_variance_tolerance_idr: 0,
    require_opening_float: true,
    auto_reconcile_snap_bi: true,
    offline_buffer_ttl_hours: 48,
  },
};

export const POLICY_ROASTING_BOM_SHRINKAGE: CompanyPolicyPreset = {
  id: 'POLICY_ROASTING_BOM_SHRINKAGE',
  title: 'Coffee Roasting Standard Moisture Shrinkage & FIFO Costing Policy',
  domain: 'Manufacturing',
  rules: {
    costing_method: 'FIFO',
    standard_shrinkage_percent: 15.0,
    auto_post_cogm_on_assembly: true,
    require_valve_packaging_bom: true,
  },
};

export const POLICY_PLANTATION_FAIR_VALUE: CompanyPolicyPreset = {
  id: 'POLICY_PLANTATION_FAIR_VALUE',
  title: 'Agricultural Biological Asset Semi-Annual Fair Value & Harvest Policy',
  domain: 'Agriculture',
  rules: {
    standard: 'IAS41_PSAK69',
    valuation_model: 'FAIR_VALUE_LESS_COST_TO_SELL',
    revaluation_cadence_months: 6,
    auto_convert_harvest_to_produce: true,
  },
};

export const POLICY_WHOLESALE_METERING: CompanyPolicyPreset = {
  id: 'POLICY_WHOLESALE_METERING',
  title: 'Platform Compute Metering & B2B Wholesale Billing Policy',
  domain: 'Platform Governance',
  rules: {
    billing_cadence_day: 30,
    grace_period_days: 7,
    paired_ledger_dispatch: true,
    engine_rate_per_1000_mutations_idr: 10000,
  },
};

export const ALL_POLICY_PRESETS: CompanyPolicyPreset[] = [
  POLICY_CAFE_FAST_CASHIER,
  POLICY_ROASTING_BOM_SHRINKAGE,
  POLICY_PLANTATION_FAIR_VALUE,
  POLICY_WHOLESALE_METERING,
];
