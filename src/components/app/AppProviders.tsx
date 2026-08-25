import type { ReactNode } from 'react'
import { ThemeProvider } from '../../context/ThemeContext'
import { LanguageProvider } from '../../context/LanguageContext'
import { MerchantConfigProvider, useMerchantConfig } from '../../context/MerchantConfigContext'
import { NotificationProvider } from '../../context/NotificationContext'
import { ViewportProvider } from '../../context/ViewportContext'
import { connectedRuntimeConfigurationError } from '../../config/firstPartyRuntime'
import { RuntimeConfigurationErrorView } from '../auth/RuntimeConfigurationErrorView'

function ViewportConsumer({ children }: { children: ReactNode }) {
  return <ViewportProvider viewportMode={useMerchantConfig().viewportMode}>{children}</ViewportProvider>
}

export function AppProviders({ children }: { children: ReactNode }) {
  const configurationError = connectedRuntimeConfigurationError()
  if (configurationError) return <RuntimeConfigurationErrorView message={configurationError} />
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MerchantConfigProvider>
          <NotificationProvider>
            <ViewportConsumer>{children}</ViewportConsumer>
          </NotificationProvider>
        </MerchantConfigProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
