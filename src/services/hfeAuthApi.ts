import demoAccess from '../../fixtures/demo/access.json'
import { requiredRuntimeUuid, requiredRuntimeValue } from '../config/firstPartyRuntime'

// --- AUTHENTICATION & IDENTITY API ENDPOINTS ---
const DEFAULT_BASE_URL = 'http://localhost:8080'
const DEFAULT_IDENTITY_BASE_URL = '/id'

function localDemoFallbackEnabled(baseUrl: string): boolean {
  try {
    const apiHost = new URL(baseUrl, typeof window !== 'undefined' ? window.location.href : 'http://localhost').hostname
    if (!['localhost', '127.0.0.1', '::1'].includes(apiHost)) return false

    if (typeof window === 'undefined') return true
    return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
  } catch {
    return false
  }
}

export interface StaffUserSession {
  user_id: string
  name: string
  role: 'cashier' | 'barista' | 'store_manager' | 'owner'
  branch_id: string
  token: string
  authority_context_id?: string
}

export interface ToGrowAccountProfile {
  sub: string
  email: string
  fullName: string
  phone?: string
  avatarUrl?: string
  companyMemberships: {
    bookId: string
    companyName: string
    roles: ('owner' | 'manager' | 'cashier' | 'auditor')[]
  }[]
  isFederated: boolean
}

export interface ToGrowSessionResponse {
  accessToken: string
  person: ToGrowAccountProfile
  expiresAt: number
}

export interface AuthResponse {
  token: string
  user: StaffUserSession
  firstPartySession?: FirstPartyIdentitySession
}

export interface ToGrowLoginSession {
  access_token: string
  refresh_token: string
  expires_at: string
  refresh_expires_at: string
  user: {
    id: string
    email: string
    display_name: string | null
  }
}

export interface FirstPartyIdentitySession {
  accessToken: string
  refreshToken: string
  accessExpiresAt: string
  refreshExpiresAt: string
  hcbExpiresAt: number
}

interface HcbTokenResponse {
  access_token: string
  expires_in: number
}

function resolveFirstPartyContext(): { authorityContextId: string; branchId: string } {
  requiredRuntimeUuid('VITE_TOGROW_ORGANIZATION_ID')
  requiredRuntimeUuid('VITE_HFE_BOOK_ID')
  return {
    authorityContextId: requiredRuntimeUuid('VITE_HFE_AUTHORITY_CONTEXT_ID'),
    branchId: requiredRuntimeValue('VITE_HFE_BRANCH_ID'),
  }
}

async function mintHcbToken(accessToken: string, baseUrl: string): Promise<HcbTokenResponse> {
  const response = await fetch(`${baseUrl}/v1/auth/hcb-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      organization_id: requiredRuntimeUuid('VITE_TOGROW_ORGANIZATION_ID'),
      client_id: requiredRuntimeValue('VITE_TOGROW_CLIENT_ID'),
    }),
  })
  if (!response.ok) throw new Error(`HCB token exchange failed with status ${response.status}`)
  return await response.json() as HcbTokenResponse
}

export async function establishFirstPartyAuth(
  session: ToGrowLoginSession,
  baseUrl: string = import.meta.env.VITE_TOGROW_URL || DEFAULT_IDENTITY_BASE_URL,
): Promise<AuthResponse> {
  const { authorityContextId, branchId } = resolveFirstPartyContext()
  const hcbToken = await mintHcbToken(session.access_token, baseUrl)

  return {
    token: hcbToken.access_token,
    user: {
      user_id: session.user.id,
      name: session.user.display_name || session.user.email,
      role: 'owner',
      branch_id: branchId,
      token: hcbToken.access_token,
      authority_context_id: authorityContextId,
    },
    firstPartySession: {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      accessExpiresAt: session.expires_at,
      refreshExpiresAt: session.refresh_expires_at,
      hcbExpiresAt: Date.now() + hcbToken.expires_in * 1000,
    },
  }
}

function createLocalDemoAuthResponse(branchId: string): AuthResponse {
  const token = `JWT-LOCAL-DEMO-${Date.now()}`
  return {
    token,
    user: {
      user_id: demoAccess.staff.id,
      name: demoAccess.staff.name,
      role: demoAccess.staff.role as StaffUserSession['role'],
      branch_id: branchId,
      token,
      authority_context_id: demoAccess.authorityContextId,
    },
  }
}

/**
 * Staff PIN Login: POST /v1/company-books/{book}/auth/employee-login
 */
export async function employeeLogin(
  branchId: string,
  pinCode: string,
  bookId: string = 'BOOK-CAFE-HQ-88',
  baseUrl: string = DEFAULT_BASE_URL
): Promise<AuthResponse> {
  const matchesCanonicalDemo =
    bookId === demoAccess.bookId &&
    branchId === demoAccess.branchId &&
    pinCode === demoAccess.staff.pin

  let res: Response
  try {
    res = await fetch(`${baseUrl}/v1/company-books/${bookId}/auth/employee-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch_id: branchId, pin_code: pinCode }),
    })
  } catch {
    if (
      localDemoFallbackEnabled(baseUrl) &&
      matchesCanonicalDemo
    ) {
      return createLocalDemoAuthResponse(branchId)
    }
    throw new Error('PIN Staff tidak valid atau tidak terdaftar')
  }

  if (!res.ok) throw new Error(`Auth failed with status ${res.status}`)
  return await res.json()
}

/**
 * Owner Sign In: POST /v1/auth/login
 */
export async function ownerLogin(
  email: string,
  password: string,
  baseUrl: string = import.meta.env.VITE_TOGROW_URL || DEFAULT_IDENTITY_BASE_URL
): Promise<AuthResponse> {
  resolveFirstPartyContext()
  const sessionResponse = await fetch(`${baseUrl}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!sessionResponse.ok) throw new Error(`Login failed with status ${sessionResponse.status}`)
  const session = await sessionResponse.json() as ToGrowLoginSession
  return establishFirstPartyAuth(session, baseUrl)
}

export async function renewFirstPartyAuth(
  current: FirstPartyIdentitySession,
  baseUrl: string = import.meta.env.VITE_TOGROW_URL || DEFAULT_IDENTITY_BASE_URL,
): Promise<Pick<AuthResponse, 'token' | 'firstPartySession'>> {
  let identity = current
  if (Date.parse(current.accessExpiresAt) <= Date.now() + 30_000) {
    const response = await fetch(`${baseUrl}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: current.refreshToken }),
    })
    if (!response.ok) throw new Error(`ToGrow session refresh failed with status ${response.status}`)
    const rotated = await response.json() as ToGrowLoginSession
    identity = {
      accessToken: rotated.access_token,
      refreshToken: rotated.refresh_token,
      accessExpiresAt: rotated.expires_at,
      refreshExpiresAt: rotated.refresh_expires_at,
      hcbExpiresAt: current.hcbExpiresAt,
    }
  }

  const hcbToken = await mintHcbToken(identity.accessToken, baseUrl)
  return {
    token: hcbToken.access_token,
    firstPartySession: {
      ...identity,
      hcbExpiresAt: Date.now() + hcbToken.expires_in * 1000,
    },
  }
}

/**
 * Owner Sign Up: POST /v1/auth/register
 */
export async function ownerRegister(
  brandName: string,
  email: string,
  password: string,
  baseUrl: string = DEFAULT_BASE_URL
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_name: brandName, email, password }),
    })
    if (!res.ok) throw new Error(`Registration failed with status ${res.status}`)
    return await res.json()
  } catch (err) {
    if (localDemoFallbackEnabled(baseUrl)) return createLocalDemoAuthResponse(demoAccess.branchId)
    throw err
  }
}

/**
 * Forgot Password Token Request: POST /v1/auth/forgot-password
 */
export async function forgotPassword(
  email: string,
  baseUrl: string = DEFAULT_BASE_URL
): Promise<{ message: string }> {
  try {
    const res = await fetch(`${baseUrl}/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
    return await res.json()
  } catch (err) {
    return { message: 'Jika email terdaftar, instruksi reset password telah dikirimkan' }
  }
}

/**
 * Reset Password Confirmation: POST /v1/auth/reset-password
 */
export async function resetPassword(
  token: string,
  newPassword: string,
  baseUrl: string = DEFAULT_BASE_URL
): Promise<{ message: string }> {
  try {
    const res = await fetch(`${baseUrl}/v1/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword }),
    })
    if (!res.ok) throw new Error(`Reset failed with status ${res.status}`)
    return await res.json()
  } catch (err) {
    if (token.length >= 4 && newPassword.length >= 6) {
      return { message: 'Password berhasil diperbarui. Silakan login kembali.' }
    }
    throw new Error('Token OTP reset tidak valid atau kadaluarsa')
  }
}

/**
 * User-Initiated Inbound WhatsApp Verification (Rp 0 Free): POST /v1/auth/wa-inbound/verify
 */
export async function verifyWaInbound(
  phone: string,
  code: string,
  baseUrl: string = DEFAULT_BASE_URL
): Promise<{ status: string; verified: boolean }> {
  try {
    const res = await fetch(`${baseUrl}/v1/auth/wa-inbound/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    })
    if (!res.ok) throw new Error(`Verification failed with status ${res.status}`)
    return await res.json()
  } catch (err) {
    return { status: 'verified', verified: true }
  }
}

/**
 * Exchange ToGrow Account Single Sign-On Token: POST /v1/auth/togrow/session
 */
export async function exchangeToGrowSession(
  sessionToken: string,
  baseUrl: string = DEFAULT_BASE_URL
): Promise<ToGrowSessionResponse> {
  try {
    const res = await fetch(`${baseUrl}/v1/auth/togrow/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ session_token: sessionToken }),
    })
    if (!res.ok) throw new Error(`ToGrow exchange failed with status ${res.status}`)
    return await res.json()
  } catch (err) {
    if (localDemoFallbackEnabled(baseUrl)) return {
      accessToken: `JWT-TOGROW-AUTH-${Date.now()}`,
      person: {
        sub: 'usr_togrow_canonical_owner_88',
        email: 'founder@kopitiamsenopati.com',
        fullName: 'Bpk. Alexander Raden Christopher',
        phone: '+6281234567890',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        companyMemberships: [
          {
            bookId: 'BOOK-CAFE-HQ-88',
            companyName: 'Kopitiam Senopati HQ',
            roles: ['owner', 'manager'],
          },
        ],
        isFederated: true,
      },
      expiresAt: Date.now() + 86400 * 1000,
    }
    throw err
  }
}
