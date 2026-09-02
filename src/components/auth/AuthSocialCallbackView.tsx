import { useEffect, useState } from 'react'

export interface AuthSocialCallbackViewProps {
  complete: (search: string) => Promise<unknown>
  providerName?: string
}

export function AuthSocialCallbackView({
  complete,
  providerName = 'Layanan Autentikasi',
}: AuthSocialCallbackViewProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const callbackSearch = window.location.search
    window.history.replaceState(null, '', '/auth/callback')
    void complete(callbackSearch)
      .then(() => {
        if (!cancelled) window.location.replace('/?app=cafe')
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [complete])

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
        <h1 className="text-lg font-black">
          {failed ? 'Login sosial gagal' : 'Menyelesaikan login aman'}
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          {failed
            ? 'Kembali ke login dan coba lagi. Tidak ada sesi yang disimpan.'
            : `${providerName} sedang menukar kode sekali pakai menjadi sesi resmi.`}
        </p>
        {failed && (
          <button
            type="button"
            onClick={() => window.location.replace('/?app=cafe')}
            className="mt-5 min-h-11 w-full rounded-xl bg-amber-500 px-4 text-xs font-black text-slate-950 hover:bg-amber-400 active:scale-95 transition-all cursor-pointer"
          >
            Kembali ke Login
          </button>
        )}
      </div>
    </main>
  )
}

// Backwards-compatible alias
export const ToGrowSocialCallbackView = AuthSocialCallbackView
