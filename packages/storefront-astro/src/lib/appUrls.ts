// Centralized App URLs for POS.Hfeit Marketing & Conversion
export const POS_APP_URL = 
  import.meta.env.PUBLIC_APP_URL || 
  (import.meta.env.MODE === 'production' && !import.meta.env.PUBLIC_IS_PREVIEW 
    ? 'https://pos.hfeit.app' 
    : 'https://prv-pos.hfeit.app')

export const POS_SIGNUP_URL = `${POS_APP_URL}/signup`
export const POS_DEMO_URL = `${POS_APP_URL}/demo`
