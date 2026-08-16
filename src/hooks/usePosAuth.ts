import { useState, useEffect, useCallback } from 'react'
import {
  employeeLogin,
  ownerLogin,
  ownerRegister,
  forgotPassword,
  resetPassword,
  StaffUserSession,
} from '../services/hfeApi'

const AUTH_TOKEN_KEY = 'hfe_pos_auth_token'
const AUTH_USER_KEY = 'hfe_pos_auth_user'
const MAX_FAILED_ATTEMPTS = 5
const COOLDOWN_DURATION_SEC = 60

export function usePosAuth() {
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUserSession | null>(() => {
    if (typeof localStorage === 'undefined') return null
    const saved = localStorage.getItem(AUTH_USER_KEY)
    if (!saved) return null
    try {
      return JSON.parse(saved)
    } catch {
      return null
    }
  })

  const [authToken, setAuthToken] = useState<string | null>(() => {
    if (typeof localStorage === 'undefined') return null
    return localStorage.getItem(AUTH_TOKEN_KEY)
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

  const saveSession = useCallback((token: string, user: StaffUserSession) => {
    setAuthToken(token)
    setCurrentStaffUser(user)
    setFailedAttempts(0)
    setCooldownSeconds(0)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    }
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setCurrentStaffUser(null)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }, [])

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
    authToken,
    activeBranchId,
    setActiveBranchId,
    failedAttempts,
    cooldownSeconds,
    isCooldownActive: cooldownSeconds > 0,
    loginWithPin,
    loginWithOwner,
    registerOwner,
    requestPasswordReset,
    confirmPasswordReset,
    logout,
  }
}
