import { useTranslation } from '../../context/LanguageContext'
import { usePersonSession } from '../../hooks/usePersonSession'

/** Person login is not an owner role, cashier session, or book membership. */
export function PersonLoginPanel() {
  const { t } = useTranslation()
  const { session, loading, error, reload, logout } = usePersonSession()
  return <main className="flex min-h-[100dvh] items-center justify-center bg-background p-4 text-foreground">
    <section className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <h1 className="text-lg font-bold">{t.personLogin.title}</h1>
      {loading && <p role="status">{t.common.loading}</p>}
      {error && <p role="alert">{t.personLogin.error}</p>}
      {!loading && session.authenticated && <>
        <p className="break-words">{session.user.displayName || session.user.email}</p>
        <p>{t.personLogin.noStaffSession}</p>
        <button className="min-h-[44px] rounded-xl border border-border px-4 active:scale-95" onClick={() => void logout()}>{t.personLogin.logout}</button>
      </>}
      {!loading && !session.authenticated && <a className="flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-4 text-primary-foreground active:scale-95" href="/auth/login">{t.personLogin.signIn}</a>}
      {error && <button className="min-h-[44px] rounded-xl border border-border px-4 active:scale-95" onClick={() => void reload()}>{t.personLogin.retry}</button>}
    </section>
  </main>
}
