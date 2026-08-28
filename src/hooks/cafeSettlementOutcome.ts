import type { PosPayMethod } from '../types/pos'
import { formatExactMinorCurrency } from '../utils/localeNumberFormat'

export type CheckoutFailureCode = 'auth' | 'contract' | 'network' | 'validation' | 'conflict' | 'unknown'

export function classifyCheckoutFailure(message?: string): CheckoutFailureCode {
  const normalized = (message || '').toLowerCase()
  if (/\((401|403)\)|unauthorized|forbidden/.test(normalized)) return 'auth'
  if (/\(404\)|not found|unexpected successful http status/.test(normalized)) return 'contract'
  if (/network|timed out|timeout|fetch/.test(normalized)) return 'network'
  if (/\(409\)|conflict/.test(normalized)) return 'conflict'
  if (/mismatch|required|invalid|must be|unsupported|does not yet support/.test(normalized)) return 'validation'
  return 'unknown'
}

export function formatPostedCheckoutAmount(
  value: number | string,
  currency: string,
  language: string,
  fallback: () => string,
): string {
  if (typeof value === 'number') return Number.isFinite(value) ? fallback() : String(value)
  try {
    return formatExactMinorCurrency(value, currency, language)
  } catch {
    return fallback()
  }
}

export async function settleQuoteRetirement(
  retirement: Promise<void>,
  onFailure: (error: unknown) => void,
): Promise<void> {
  try {
    await retirement
  } catch (error) {
    onFailure(error)
    throw error
  }
}

export function shouldAcceptQuoteResponse(requestedFingerprint: string, latestFingerprint: string): boolean {
  return requestedFingerprint === latestFingerprint
}

export function activeQuotePaymentMethod(
  configuredAtRequest: PosPayMethod,
  intendedAtRequest: PosPayMethod,
  currentlyConfigured: PosPayMethod,
): PosPayMethod {
  return currentlyConfigured === configuredAtRequest ? intendedAtRequest : currentlyConfigured
}

export async function acknowledgeConfirmedPosted<T>(
  response: T,
  acknowledge: () => Promise<void>,
  afterPosted: () => void | Promise<void> = () => {},
): Promise<{ kind: 'acknowledged'; response: T } | { kind: 'posted_unacknowledged'; response: T; error: unknown }> {
  try {
    await afterPosted()
    await acknowledge()
    return { kind: 'acknowledged', response }
  } catch (error) {
    return { kind: 'posted_unacknowledged', response, error }
  }
}

export async function resumeDurablePostedCleanup<T>(
  findPosted: () => Promise<T | null>,
  settlePosted: (attempt: T) => Promise<void>,
): Promise<boolean> {
  const attempt = await findPosted()
  if (!attempt) return false
  await settlePosted(attempt)
  return true
}
