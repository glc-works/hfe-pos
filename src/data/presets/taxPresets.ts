/**
 * Official Jurisdictional Tax Profile Presets Compiled from E2E Master Scenarios
 * Standard: GLC-ARCH-TENANCY-001 Section 10
 */

export interface TaxProfilePreset {
  id: string;
  title: string;
  jurisdiction: string;
  primaryRatePercent: string;
  description: string;
}

export const TAX_ID_PB1_PPN: TaxProfilePreset = {
  id: 'TAX_ID_PB1_PPN',
  title: 'Indonesia F&B Restaurant Tax (PB1 10%) & DJP PPN 11%',
  jurisdiction: 'ID',
  primaryRatePercent: '11.0%',
  description: 'Pajak Restoran Daerah PB1 10% untuk F&B dan PPN DJP e-Faktur 11% untuk barang/jasa umum',
};

export const TAX_SG_IRAS_GST_9: TaxProfilePreset = {
  id: 'TAX_SG_IRAS_GST_9',
  title: 'Singapore IRAS GST 9% Standard & 0% Zero-Rated Export',
  jurisdiction: 'SG',
  primaryRatePercent: '9.0%',
  description: 'Singapore Goods & Services Tax 9% on domestic supply and 0% for international freight/exports',
};

export const TAX_MY_LHDN_EINVOICE: TaxProfilePreset = {
  id: 'TAX_MY_LHDN_EINVOICE',
  title: 'Malaysia LHDN e-Invoice & SST Service Tax 6%',
  jurisdiction: 'MY',
  primaryRatePercent: '6.0%',
  description: 'Lembaga Hasil Dalam Negeri Malaysia validated e-Invoice format with 6% Service Tax',
};

export const TAX_HK_IRD_PROFITS: TaxProfilePreset = {
  id: 'TAX_HK_IRD_PROFITS',
  title: 'Hong Kong IRD Corporate Profits Tax Two-Tier Profile (8.25% / 16.5%)',
  jurisdiction: 'HK',
  primaryRatePercent: '16.5%',
  description: 'Inland Revenue Department Hong Kong profits tax with two-tier rates for corporations',
};

export const ALL_TAX_PRESETS: TaxProfilePreset[] = [
  TAX_ID_PB1_PPN,
  TAX_SG_IRAS_GST_9,
  TAX_MY_LHDN_EINVOICE,
  TAX_HK_IRD_PROFITS,
];
