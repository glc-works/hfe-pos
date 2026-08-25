import { isConnectedFirstPartyRuntime } from './firstPartyRuntime'

function companyBookOrigin(): string | null {
  const configured = import.meta.env.VITE_HFE_COMPANY_BOOK_URL?.trim()
  if (isConnectedFirstPartyRuntime()) return configured || null
  return configured || 'http://localhost:8081'
}

/** Build the cross-experience handoff only from exact verified CORE identities. */
export function companyBookPostingHref(
  organizationId: string,
  companyBookId: string,
  postingId: string,
  orderId: string,
): string | null {
  if (!organizationId.trim() || !companyBookId.trim() || !postingId.trim() || !orderId.trim()) return null
  try {
    const configuredOrigin = companyBookOrigin()
    if (!configuredOrigin) return null
    const origin = new URL(configuredOrigin)
    if (origin.username || origin.password) return null
    if (origin.protocol !== 'https:' && origin.hostname !== 'localhost' && origin.hostname !== '127.0.0.1') return null

    const path = [companyBookId, postingId].map(encodeURIComponent)
    const target = new URL(`/app/accounting/company-books/${path[0]}/postings/${path[1]}`, origin)
    target.searchParams.set('orderId', orderId)
    target.searchParams.set('organizationId', organizationId)
    return target.toString()
  } catch {
    return null
  }
}
