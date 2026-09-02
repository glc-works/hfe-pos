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

export function resolveInitialStaffSurface(search: string, hostname: string): any {
  const params = new URLSearchParams(search)
  const surfaceParam = params.get('surface')
  if (surfaceParam) return surfaceParam

  const appParam = params.get('app')
  if (appParam === 'hub' || appParam === 'admin' || appParam === 'admin-hub') return 'admin-hub'
  if (appParam === 'kds' || appParam === 'kitchen' || appParam === 'kds-screen') return 'kds-screen'
  if (appParam === 'book' || appParam === 'ledger' || appParam === 'company-book') return 'hfe-company-book'
  if (appParam === 'branch' || appParam === 'franchise') return 'branch-network'
  if (appParam === 'warehouse' || appParam === 'inventory') return 'warehouse-stock'
  if (appParam === 'sommelier' || appParam === 'wine') return 'sommelier-bar'
  if (appParam === 'maitred' || appParam === 'host') return 'maitre-d-host'

  const host = normalizeSurfaceHost(hostname)
  if (host.startsWith('gallery.') || host.startsWith('design.')) return 'gallery'
  if (host.startsWith('admin.') || host.startsWith('hub.')) return 'admin-hub'
  if (host.startsWith('book.') || host.startsWith('ledger.')) return 'hfe-company-book'
  if (host.startsWith('kds.') || host.startsWith('kitchen.')) return 'kds-screen'

  return 'barista-pos'
}
