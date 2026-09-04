export type PersonSession = { authenticated: false } | {
  authenticated: true
  user: { displayName: string | null; email: string; emailVerified: boolean }
  csrfToken: string
}

/** Only the application-owned BFF contract crosses this boundary. */
async function readSessionOnce(): Promise<PersonSession> {
  let response = await fetch('/auth/session', { credentials: 'same-origin', cache: 'no-store' })
  if (response.status === 401) {
    const challenge = await response.clone().json()
    if (challenge.code === 'session_expired' && typeof challenge.csrfToken === 'string' && challenge.csrfToken) {
      response = await fetch('/auth/refresh', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'X-CSRF-Token': challenge.csrfToken },
      })
    }
  }
  if (!response.ok) throw new Error('person_session_unavailable')
  const value = await response.json()
  if (value.authenticated === false) return { authenticated: false }
  if (value.authenticated !== true || !(value.user?.displayName === null || typeof value.user?.displayName === 'string') ||
    typeof value.user?.email !== 'string' || typeof value.user?.emailVerified !== 'boolean' ||
    typeof value.csrfToken !== 'string' || !value.csrfToken) throw new Error('invalid_person_session')
  return {
    authenticated: true,
    user: { displayName: value.user.displayName, email: value.user.email, emailVerified: value.user.emailVerified },
    csrfToken: value.csrfToken,
  }
}

let pendingRead: Promise<PersonSession> | undefined
export function readPersonSession(): Promise<PersonSession> {
  if (!pendingRead) {
    const run = (async (): Promise<PersonSession> => {
      return typeof navigator !== 'undefined' && navigator.locks
        ? await navigator.locks.request('hfe-person-session', readSessionOnce) : readSessionOnce()
    })()
    pendingRead = run.finally(() => { pendingRead = undefined })
  }
  return pendingRead
}

async function logoutOnce(csrfToken: string): Promise<void> {
  const response = await fetch('/auth/logout', {
    method: 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
    body: JSON.stringify({ scope: 'local' }),
  })
  if (!response.ok) throw new Error('person_logout_failed')
  const value = await response.json()
  // This caller requests local logout only, never an arbitrary external redirect.
  if (value.redirectTo !== '/auth') throw new Error('invalid_logout_redirect')
}

export async function logoutPersonSession(csrfToken: string): Promise<void> {
  // Serialize against rotating refresh cookies, including another browser tab.
  if (typeof navigator !== 'undefined' && navigator.locks) {
    await navigator.locks.request('hfe-person-session', () => logoutOnce(csrfToken))
  } else {
    await pendingRead?.catch(() => undefined)
    await logoutOnce(csrfToken)
  }
}
