import { useState, useEffect, useCallback } from 'react'
import {
  employeeLogin,
  ownerLogin,
  ownerRegister,
  forgotPassword,
  resetPassword,
  StaffUserSession,
} from '../services/hfeApi'
import {
  exchangeToGrowSession,
  establishFirstPartyAuth,
  FirstPartyIdentitySession,
  renewFirstPartyAuth,
  ToGrowAccountProfile,
} from '../services/hfeAuthApi'
import { completeSocialSignIn } from '../services/toGrowSocialSignIn'

const AUTH_TOKEN_KEY = 'hfe_pos_auth_token'
const AUTH_USER_KEY = 'hfe_pos_auth_user'
const TOGROW_PROFILE_KEY = 'hfe_pos_togrow_profile'
const FIRST_PARTY_SESSION_KEY = 'hfe_pos_first_party_identity_session'
const MAX_FAILED_ATTEMPTS = 5
const COOLDOWN_DURATION_SEC = 60

export function parseFirstPartyIdentitySession(raw: string): FirstPartyIdentitySession | null {
  try {
    const value = JSON.parse(raw) as Partial<FirstPartyIdentitySession>
    if (
      typeof value.accessToken !== 'string' || !value.accessToken ||
      typeof value.refreshToken !== 'string' || !value.refreshToken ||
      typeof value.accessExpiresAt !== 'string' || !Number.isFinite(Date.parse(value.accessExpiresAt)) ||
      typeof value.refreshExpiresAt !== 'string' || !Number.isFinite(Date.parse(value.refreshExpiresAt)) ||
      typeof value.hcbExpiresAt !== 'number' || !Number.isFinite(value.hcbExpiresAt)
    ) return null
    return value as FirstPartyIdentitySession
  } catch {
    return null
  }
}

export function renewalDelayMs(session: FirstPartyIdentitySession, now: number = Date.now()): number {
  return Math.max(0, session.hcbExpiresAt - now - 60_000)
}

export function usePosAuth() {
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUserSession | null>(() => {
    if (typeof sessionStorage !== 'undefined') {
      const saved = sessionStorage.getItem(AUTH_USER_KEY) || (typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_USER_KEY) : null)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return null
        }
      }
    }
    return null
  })

  const [toGrowUser, setToGrowUser] = useState<ToGrowAccountProfile | null>(() => {
    if (typeof sessionStorage !== 'undefined') {
      const saved = sessionStorage.getItem(TOGROW_PROFILE_KEY) || (typeof localStorage !== 'undefined' ? localStorage.getItem(TOGROW_PROFILE_KEY) : null)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return null
        }
      }
    }
    return null
  })

  const [authToken, setAuthToken] = useState<string | null>(() => {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(AUTH_TOKEN_KEY) || (typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null)
    }
    return null
  })

  const [firstPartySession, setFirstPartySession] = useState<FirstPartyIdentitySession | null>(() => {
    if (typeof sessionStorage === 'undefined') return null
    const saved = sessionStorage.getItem(FIRST_PARTY_SESSION_KEY)
    if (!saved) return null
    return parseFirstPartyIdentitySession(saved)
  })

  const [activeBranchId, setActiveBranchId] = useState<string>('BRANCH-HQ-01')
  const [failedAttempts, setFailedAttempts] = useState<number>(0)
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0)

  // Cooldown countdown timer interval
  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          setFailedAttempts(0) // Reset failed attempts after cooldown expires
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldownSeconds])

  const registerFailedAttempt = useCallback(() => {
    setFailedAttempts(prev => {
      const next = prev + 1
      if (next >= MAX_FAILED_ATTEMPTS) {
        setCooldownSeconds(COOLDOWN_DURATION_SEC)
      }
      return next
    })
  }, [])

  const saveSession = useCallback((
    token: string,
    user: StaffUserSession,
    toGrowProfile?: ToGrowAccountProfile,
    identitySession?: FirstPartyIdentitySession,
  ) => {
    setAuthToken(token)
    setCurrentStaffUser(user)
    if (toGrowProfile) setToGrowUser(toGrowProfile)
    if (identitySession) setFirstPartySession(identitySession)
    setFailedAttempts(0)
    setCooldownSeconds(0)
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token)
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      if (toGrowProfile) sessionStorage.setItem(TOGROW_PROFILE_KEY, JSON.stringify(toGrowProfile))
      if (identitySession) sessionStorage.setItem(FIRST_PARTY_SESSION_KEY, JSON.stringify(identitySession))
    }
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setCurrentStaffUser(null)
    setToGrowUser(null)
    setFirstPartySession(null)
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
      sessionStorage.removeItem(AUTH_USER_KEY)
      sessionStorage.removeItem(TOGROW_PROFILE_KEY)
      sessionStorage.removeItem(FIRST_PARTY_SESSION_KEY)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(TOGROW_PROFILE_KEY)
      localStorage.removeItem(FIRST_PARTY_SESSION_KEY)
    }
  }, [])

  /**
   * 1. ToGrow Account Person Authentication (Canonical Tier 1 Authority)
   */
  const loginWithToGrow = useCallback(
    async (sessionToken: string): Promise<ToGrowAccountProfile> => {
      try {
        const res = await exchangeToGrowSession(sessionToken)
        const staffUser: StaffUserSession = {
          user_id: res.person.sub,
          name: res.person.fullName,
          role: 'owner',
          branch_id: res.person.companyMemberships[0]?.bookId || 'BOOK-CAFE-HQ-88',
          token: res.accessToken,
        }
        saveSession(res.accessToken, staffUser, res.person)
        return res.person
      } catch (err: any) {
        throw err
      }
    },
    [saveSession]
  )

  /**
   * 2. Cashier Terminal Shift PIN Quick-Switch (Tier 4 Shift Attestation)
   */
  const loginWithPin = useCallback(
    async (branchId: string, pinCode: string): Promise<StaffUserSession> => {
      if (cooldownSeconds > 0) {
        throw new Error(`Terlalu banyak percobaan gagal. Silakan tunggu ${cooldownSeconds} detik.`)
      }
      try {
        const res = await employeeLogin(branchId, pinCode)
        saveSession(res.token, res.user)
        return res.user
      } catch (err: any) {
        registerFailedAttempt()
        throw err
      }
    },
    [cooldownSeconds, registerFailedAttempt, saveSession]
  )

  useEffect(() => {
    if (!firstPartySession || !currentStaffUser) return
    const renewInMs = renewalDelayMs(firstPartySession)
    const timer = window.setTimeout(() => {
      void renewFirstPartyAuth(firstPartySession).then((renewed) => {
        if (!renewed.firstPartySession) return
        const renewedUser = { ...currentStaffUser, token: renewed.token }
        saveSession(renewed.token, renewedUser, undefined, renewed.firstPartySession)
      }).catch(() => logout())
    }, renewInMs)
    return () => window.clearTimeout(timer)
  }, [currentStaffUser, firstPartySession, logout, saveSession])

  const loginWithOwner = useCallback(
    async (email: string, password: string): Promise<StaffUserSession> => {
      if (cooldownSeconds > 0) {
        throw new Error(`Terlalu banyak percobaan gagal. Silakan tunggu ${cooldownSeconds} detik.`)
      }
      try {
        const res = await ownerLogin(email, password)
        saveSession(res.token, res.user, undefined, res.firstPartySession)
        return res.user
      } catch (err: any) {
        registerFailedAttempt()
        throw err
      }
    },
    [cooldownSeconds, registerFailedAttempt, saveSession]
  )

  const completeSocialLogin = useCallback(async (search: string): Promise<StaffUserSession> => {
    const social = await completeSocialSignIn(search)
    if (social.kind === 'error') throw new Error(`Social sign-in failed: ${social.reason}`)
    const res = await establishFirstPartyAuth(social.session)
    saveSession(res.token, res.user, undefined, res.firstPartySession)
    return res.user
  }, [saveSession])

  const registerOwner = useCallback(
    async (brandName: string, email: string, password: string): Promise<StaffUserSession> => {
      try {
        const res = await ownerRegister(brandName, email, password)
        saveSession(res.token, res.user)
        return res.user
      } catch (err: any) {
        throw err
      }
    },
    [saveSession]
  )

  const requestPasswordReset = useCallback(async (email: string): Promise<string> => {
    const res = await forgotPassword(email)
    return res.message
  }, [])

  const confirmPasswordReset = useCallback(async (token: string, newPassword: string): Promise<string> => {
    const res = await resetPassword(token, newPassword)
    return res.message
  }, [])

  return {
    currentStaffUser,
    toGrowUser,
    isToGrowAuthenticated: !!toGrowUser,
    authToken,
    activeBranchId,
    setActiveBranchId,
    failedAttempts,
    cooldownSeconds,
    isCooldownActive: cooldownSeconds > 0,
    loginWithToGrow,
    loginWithPin,
    loginWithOwner,
    completeSocialLogin,
    registerOwner,
    requestPasswordReset,
    confirmPasswordReset,
    logout,
  }
}
