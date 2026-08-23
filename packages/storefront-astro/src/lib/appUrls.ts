// Centralized App URLs for POS.Hfeit Early Access & Pilot Onboarding
// Status: PRE-GA / INVITE-ONLY PILOT PROGRAM

export const POS_EARLY_ACCESS_EMAIL = 'exp@hfeit.com'

export const POS_EARLY_ACCESS_URL = 
  import.meta.env.PUBLIC_EARLY_ACCESS_URL || 
  `mailto:${POS_EARLY_ACCESS_EMAIL}?subject=Permintaan%20Akses%20Awal%20POS.Hfeit%20(Invite-Only)&body=Halo%20Tim%20HFE,%0A%0ASaya%20tertarik%20mengajukan%20akses%20awal%20program%20pilot%20POS.Hfeit%20untuk%20usaha%20saya:%0A%0A-%20Nama%20Usaha:%20%0A-%20Jenis%20Bisnis%20(Kafe/Resto/Retail):%20%0A-%20Jumlah%20Cabang:%20%0A-%20Kota:%20%0A-%20Nomor%20WhatsApp:%20%0A%0ATerima%20kasih!`

// Production App & Sandbox Demo URLs
export const POS_APP_URL = 
  import.meta.env.PUBLIC_APP_URL || 'https://pos.hfeit.app'

export const POS_DEMO_URL = 
  import.meta.env.PUBLIC_DEMO_URL || 'https://prv-pos.hfeit.app/demo'
