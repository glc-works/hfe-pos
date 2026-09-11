const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const requiredValues = [
  'VITE_TOGROW_URL',
  'VITE_HFE_CORE_URL',
  'VITE_HFE_COMPANY_BOOK_URL',
  'VITE_TOGROW_CLIENT_ID',
  'VITE_HFE_BRANCH_ID',
]
const requiredUuids = [
  'VITE_HFE_BOOK_ID',
  'VITE_HFE_AUTHORITY_CONTEXT_ID',
  'VITE_HFE_CASHIER_SESSION_ID',
  'VITE_HFE_FLAGSHIP_PRODUCT_ID',
]

if (process.env.VITE_HFE_RUNTIME_MODE !== 'connected') {
  throw new Error('preview build requires VITE_HFE_RUNTIME_MODE=connected')
}
for (const name of requiredValues) {
  if (!process.env[name]?.trim()) throw new Error(`preview build is missing ${name}`)
}
const orgId = process.env.VITE_HFE_ORGANIZATION_ID || process.env.VITE_TOGROW_ORGANIZATION_ID
if (!orgId || !uuidPattern.test(orgId)) {
  throw new Error('preview build requires valid UUID VITE_HFE_ORGANIZATION_ID (or VITE_TOGROW_ORGANIZATION_ID)')
}
for (const name of requiredUuids) {
  if (!uuidPattern.test(process.env[name] || '')) throw new Error(`preview build requires UUID ${name}`)
}

console.log('first-party preview build environment: valid')
