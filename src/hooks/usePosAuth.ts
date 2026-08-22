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
  ToGrowAccountProfile,
} from '../services/hfeAuthApi'

const AUTH_TOKEN_KEY = 'hfe_pos_auth_token'
const AUTH_USER_KEY = 'hfe_pos_auth_user'
const TOGROW_PROFILE_KEY = 'hfe_pos_togrow_profile'
const MAX_FAILED_ATTEMPTS = 5
const COOLDOWN_DURATION_SEC = 60

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

  const saveSession = useCallback((token: string, user: StaffUserSession, toGrowProfile?: ToGrowAccountProfile) => {
    setAuthToken(token)
    setCurrentStaffUser(user)
    if (toGrowProfile) setToGrowUser(toGrowProfile)
    setFailedAttempts(0)
    setCooldownSeconds(0)
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token)
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      if (toGrowProfile) sessionStorage.setItem(TOGROW_PROFILE_KEY, JSON.stringify(toGrowProfile))
    }
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setCurrentStaffUser(null)
    setToGrowUser(null)
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
      sessionStorage.removeItem(AUTH_USER_KEY)
      sessionStorage.removeItem(TOGROW_PROFILE_KEY)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(TOGROW_PROFILE_KEY)
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

  const loginWithOwner = useCallback(
    async (email: string, password: string): Promise<StaffUserSession> => {
      if (cooldownSeconds > 0) {
        throw new Error(`Terlalu banyak percobaan gagal. Silakan tunggu ${cooldownSeconds} detik.`)
      }
      try {
        const res = await ownerLogin(email, password)
        saveSession(res.token, res.user)
        return res.user
      } catch (err: any) {
        registerFailedAttempt()
        throw err
      }
    },
    [cooldownSeconds, registerFailedAttempt, saveSession]
  )

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
    registerOwner,
    requestPasswordReset,
    confirmPasswordReset,
    logout,
  }
}
