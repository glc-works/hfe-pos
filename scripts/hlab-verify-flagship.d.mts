export interface HlabCliOptions {
  syntheticTenant: string;
  syntheticCompanyBook: string;
  inputFile: string;
  receiptOut: string;
  rawJson: boolean;
  help: boolean;
}

export interface ValidatedSyntheticScope {
  tenant: string;
  book: string;
}

export interface HlabVerificationReceipt {
  contract_version: string;
  schema: string;
  status: 'passed' | 'failed';
  synthetic_tenant: string;
  synthetic_company_book: string;
  executed_at: string;
  duration_ms: number;
  test_count: number;
  passed_count: number;
  failed_count: number;
  tests: Array<{ title: string; ok: boolean }>;
  lineage_verified: boolean;
  truth_boundary_verified: boolean;
  error_message?: string;
}

export function parseArguments(argv: string[]): HlabCliOptions;
export function validateSyntheticScope(options: Partial<HlabCliOptions>): ValidatedSyntheticScope;
export function generateReceipt(options: {
  status: 'passed' | 'failed';
  syntheticTenant: string;
  syntheticCompanyBook: string;
  durationMs?: number;
  testCount?: number;
  passedCount?: number;
  failedCount?: number;
  tests?: Array<{ title: string; ok: boolean }>;
  errorMessage?: string;
}): HlabVerificationReceipt;
export function runFlagshipSuite(scope: ValidatedSyntheticScope): Promise<HlabVerificationReceipt>;
