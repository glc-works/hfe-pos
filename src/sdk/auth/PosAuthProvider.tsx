import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { readLegacyPosSession } from '../../services/auth/personSessionStorage'
import { isConnectedFirstPartyRuntime } from '../../config/firstPartyRuntime'
import {
  StaffUserSession,
  AuthResponse,
  employeeLogin,
  ownerLogin,
  ownerRegister,
  verifyWaInbound,
} from '../../services/hfeAuthApi'

export interface RateLimitState {
  failedAttempts: number
  isLocked: boolean
  remainingCooldownSeconds: number
}

export interface PosAuthContextType {
  user: StaffUserSession | null
  isAuthenticated: boolean
  token: string | null
  apiEndpoint: string
  bookId: string
  rateLimitState: RateLimitState
  loginWithPin: (branchId: string, pin: string) => Promise<AuthResponse>
  loginOwner: (email: string, pass: string) => Promise<AuthResponse>
  registerOwner: (brandName: string, email: string, pass: string) => Promise<AuthResponse>
  logout: () => void
  verifyWa: (phone: string, code: string) => Promise<boolean>
}

const PosAuthContext = createContext<PosAuthContextType | undefined>(undefined)

const STORAGE_TOKEN_KEY = 'hfe_pos_auth_token'
const STORAGE_USER_KEY = 'hfe_pos_user_session'
const MAX_FAILED_ATTEMPTS = 5
const COOLDOWN_SECONDS = 60

export interface PosAuthProviderProps {
  children: ReactNode
  apiEndpoint?: string
  bookId?: string
  onAuthSuccess?: (session: StaffUserSession) => void
}

export const PosAuthProvider: React.FC<PosAuthProviderProps> = ({
  children,
  apiEndpoint = 'http://localhost:8080',
  bookId = 'BOOK-CAFE-HQ-88',
  onAuthSuccess,
}) => {
  const [user, setUser] = useState<StaffUserSession | null>(() => {
    try {
      const savedUser = readLegacyPosSession(STORAGE_USER_KEY, undefined, localStorage)
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    try {
      return readLegacyPosSession(STORAGE_TOKEN_KEY, undefined, localStorage)
    } catch {
      return null
    }
  })

  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    failedAttempts: 0,
    isLocked: false,
    remainingCooldownSeconds: 0,
  })

  // Timer effect for rate limiting cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (rateLimitState.isLocked && rateLimitState.remainingCooldownSeconds > 0) {
      timer = setInterval(() => {
        setRateLimitState((prev) => {
          if (prev.remainingCooldownSeconds <= 1) {
            return { failedAttempts: 0, isLocked: false, remainingCooldownSeconds: 0 }
          }
          return { ...prev, remainingCooldownSeconds: prev.remainingCooldownSeconds - 1 }
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [rateLimitState.isLocked, rateLimitState.remainingCooldownSeconds])

  const registerFailedAttempt = () => {
    setRateLimitState((prev) => {
      const nextAttempts = prev.failedAttempts + 1
      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        return {
          failedAttempts: nextAttempts,
          isLocked: true,
          remainingCooldownSeconds: COOLDOWN_SECONDS,
        }
      }
      return { ...prev, failedAttempts: nextAttempts }
    })
  }

  const handleAuthSuccess = (res: AuthResponse) => {
    setUser(res.user)
    setToken(res.token)
    setRateLimitState({ failedAttempts: 0, isLocked: false, remainingCooldownSeconds: 0 })
    try {
      if (!isConnectedFirstPartyRuntime()) {
        localStorage.setItem(STORAGE_TOKEN_KEY, res.token)
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.user))
      }
    } catch (err) {
      console.warn('[PosAuthProvider] Failed to save token to localStorage:', err)
    }
    if (onAuthSuccess) {
      onAuthSuccess(res.user)
    }
  }

  const loginWithPin = async (branchId: string, pin: string): Promise<AuthResponse> => {
    if (rateLimitState.isLocked) {
      throw new Error(`Akses terkunci. Coba lagi dalam ${rateLimitState.remainingCooldownSeconds} detik.`)
    }
    try {
      const res = await employeeLogin(branchId, pin, bookId, apiEndpoint)
      handleAuthSuccess(res)
      return res
    } catch (err: any) {
      registerFailedAttempt()
      throw err
    }
  }

  const loginOwner = async (email: string, pass: string): Promise<AuthResponse> => {
    if (rateLimitState.isLocked) {
      throw new Error(`Akses terkunci. Coba lagi dalam ${rateLimitState.remainingCooldownSeconds} detik.`)
    }
    try {
      const res = await ownerLogin(email, pass, apiEndpoint)
      handleAuthSuccess(res)
      return res
    } catch (err: any) {
      registerFailedAttempt()
      throw err
    }
  }

  const registerOwner = async (brandName: string, email: string, pass: string): Promise<AuthResponse> => {
    const res = await ownerRegister(brandName, email, pass, apiEndpoint)
    handleAuthSuccess(res)
    return res
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem(STORAGE_TOKEN_KEY)
      localStorage.removeItem(STORAGE_USER_KEY)
    } catch (err) {
      console.warn('[PosAuthProvider] Failed to clear localStorage:', err)
    }
  }

  const verifyWa = async (phone: string, code: string): Promise<boolean> => {
    const res = await verifyWaInbound(phone, code, apiEndpoint)
    return res.verified
  }

  return (
    <PosAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        token,
        apiEndpoint,
        bookId,
        rateLimitState,
        loginWithPin,
        loginOwner,
        registerOwner,
        logout,
        verifyWa,
      }}
    >
      {children}
    </PosAuthContext.Provider>
  )
}

export const usePosAuth = (): PosAuthContextType => {
  const context = useContext(PosAuthContext)
  if (!context) {
    throw new Error('usePosAuth must be used within a <PosAuthProvider>')
  }
  return context
}

export { PosAuthContext }
