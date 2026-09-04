import { useCallback, useEffect, useRef, useState } from 'react'
import { logoutPersonSession, readPersonSession, type PersonSession } from '../services/auth/personSession'
import { readLegacyPosSession } from '../services/auth/personSessionStorage'

export function usePersonSession() {
  const [session, setSession] = useState<PersonSession>({ authenticated: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const generation = useRef(0)
  const reload = useCallback(async () => {
    const current = ++generation.current
    setLoading(true)
    setError(false)
    try { const next = await readPersonSession(); if (current === generation.current) setSession(next) }
    catch { if (current === generation.current) { setSession({ authenticated: false }); setError(true) } }
    finally { if (current === generation.current) setLoading(false) }
  }, [])
  useEffect(() => {
    for (const key of ['hfe_pos_auth_user', 'hfe_pos_auth_token', 'hfe_pos_togrow_profile',
      'hfe_pos_first_party_identity_session', 'hfe_pos_user_session', 'hfe_pos_auth_attempt', 'hfe_pos_togrow_social_attempt']) {
      readLegacyPosSession(key, sessionStorage, localStorage)
    }
    const onFocus = () => { void reload() }
    void reload()
    window.addEventListener('focus', onFocus)
    return () => { ++generation.current; window.removeEventListener('focus', onFocus) }
  }, [reload])
  const logout = useCallback(async () => {
    if (!session.authenticated) return
    ++generation.current
    setLoading(true)
    setError(false)
    try { await logoutPersonSession(session.csrfToken); setSession({ authenticated: false }) }
    catch { setError(true) }
    finally { setLoading(false) }
  }, [session])
  return { session, loading, error, reload, logout }
}
