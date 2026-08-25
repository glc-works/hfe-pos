import type { ToGrowSocialProvider } from '../../services/toGrowSocialSignIn'

interface ToGrowSocialProviderButtonsProps {
  providers: ToGrowSocialProvider[]
  disabled: boolean
  onSelect: (provider: ToGrowSocialProvider) => void
}

const PROVIDER_LABEL: Record<ToGrowSocialProvider, string> = {
  google: 'Lanjutkan dengan Google',
  apple: 'Lanjutkan dengan Apple',
}

export function ToGrowSocialProviderButtons({
  providers,
  disabled,
  onSelect,
}: ToGrowSocialProviderButtonsProps) {
  if (providers.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      {providers.map(provider => (
        <button
          key={provider}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(provider)}
          className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-xs font-bold text-white transition-colors hover:border-slate-500 disabled:opacity-50"
        >
          <span aria-hidden="true" className="mr-2 font-black">
            {provider === 'google' ? 'G' : '●'}
          </span>
          {PROVIDER_LABEL[provider]}
        </button>
      ))}
      <div className="flex items-center gap-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <span className="h-px flex-1 bg-slate-800" />
        atau gunakan email
        <span className="h-px flex-1 bg-slate-800" />
      </div>
    </div>
  )
}
