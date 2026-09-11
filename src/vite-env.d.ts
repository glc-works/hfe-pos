/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HFE_BEARER_TOKEN?: string
  readonly VITE_HFE_CASHIER_PRINCIPAL_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
