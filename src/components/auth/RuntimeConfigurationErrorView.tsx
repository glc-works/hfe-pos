interface RuntimeConfigurationErrorViewProps {
  message: string
}

export function RuntimeConfigurationErrorView({ message }: RuntimeConfigurationErrorViewProps) {
  return (
    <main role="alert" className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <h1 className="text-2xl font-bold">Hfe POS belum siap digunakan</h1>
      <p className="mt-3 text-slate-300">Konfigurasi first-party belum lengkap.</p>
      <code className="mt-4 block rounded bg-slate-900 p-4 text-sm text-amber-300">{message}</code>
    </main>
  )
}
