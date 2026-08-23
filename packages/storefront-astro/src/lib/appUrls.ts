// Centralized App URLs for POS.Hfeit Marketing & Conversion
// Production Landing (pos.hfeit.com) provides market presence,
// while interactive Demo runs on isolated preview sandbox (prv-pos.hfeit.app/demo) without polluting prod.

export const POS_APP_URL = 
  import.meta.env.PUBLIC_APP_URL || 'https://pos.hfeit.app'

export const POS_SIGNUP_URL = 
  import.meta.env.PUBLIC_SIGNUP_URL || `${POS_APP_URL}/signup`

// Demo sandbox explicitly uses isolated preview environment
export const POS_DEMO_URL = 
  import.meta.env.PUBLIC_DEMO_URL || 'https://prv-pos.hfeit.app/demo'
