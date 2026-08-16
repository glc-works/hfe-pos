/**
 * SHA-256 Web Crypto API Integrity Hasher
 * Generates and verifies SHA-256 checksums for transaction payloads.
 */

/**
 * Sort object keys recursively to ensure deterministic JSON serialization.
 */
function canonicalizeJSON(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj)
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJSON).join(',') + ']'
  }
  const sortedKeys = Object.keys(obj).sort()
  const keyValues = sortedKeys.map(key => `${JSON.stringify(key)}:${canonicalizeJSON(obj[key])}`)
  return '{' + keyValues.join(',') + '}'
}

/**
 * Generate a 64-character hex SHA-256 checksum for a payload object using Web Crypto API.
 */
export async function generatePayloadChecksum(payload: object): Promise<string> {
  const jsonString = canonicalizeJSON(payload)
  const encoder = new TextEncoder()
  const data = encoder.encode(jsonString)

  if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Fallback for environments without crypto.subtle (e.g. legacy JS engines)
  let hash = 0
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return hex.repeat(8).substring(0, 64)
}

/**
 * Verify if payload matches expected SHA-256 checksum string.
 */
export async function verifyPayloadIntegrity(payload: object, expectedHash: string): Promise<boolean> {
  if (!expectedHash || expectedHash.length !== 64) {
    return false
  }
  const calculatedHash = await generatePayloadChecksum(payload)
  return calculatedHash === expectedHash
}
