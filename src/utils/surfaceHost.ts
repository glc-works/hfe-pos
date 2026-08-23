/**
 * Normalizes surface hostnames by stripping known environment prefixes
 * (dev-, dev., prv-, prv., preview-, stg-) and converting to lowercase.
 *
 * Single Source of Truth (SSOT) for hostname prefix normalization
 * used by both App root router and MerchantConfigContext.
 */
export function normalizeSurfaceHost(hostname: string | null | undefined): string {
  if (!hostname) return ''
  const lower = hostname.trim().toLowerCase()
  return lower.replace(/^(dev[-.]|prv[-.]|preview[-.]|stg[-.])/i, '')
}
