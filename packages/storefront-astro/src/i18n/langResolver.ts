import { TRANSLATIONS, type SupportedLanguage, type ExpTranslations } from './translations'

export function resolveLanguage(
  cookieHeader: string | null | undefined,
  geoCountry: string | null | undefined,
  acceptLanguage: string | null | undefined,
  urlParam: string | null | undefined
): SupportedLanguage {
  // 1. Explicit URL query param (?lang=en / ?lang=id)
  if (urlParam === 'en' || urlParam === 'id') {
    return urlParam
  }

  // 2. Cookie manual preference (hfe_lang=en / hfe_lang=id)
  if (cookieHeader) {
    const match = cookieHeader.match(/hfe_lang=(id|en)/)
    if (match && (match[1] === 'id' || match[1] === 'en')) {
      return match[1] as SupportedLanguage
    }
  }

  // 3. Cloudflare Edge Geo-Header (CF-IPCountry)
  if (geoCountry) {
    if (geoCountry.toUpperCase() === 'ID') {
      return 'id'
    }
    return 'en'
  }

  // 4. Accept-Language header fallback
  if (acceptLanguage) {
    const lower = acceptLanguage.toLowerCase()
    if (lower.startsWith('id') || lower.includes(',id')) {
      return 'id'
    }
    if (lower.startsWith('en') || lower.includes(',en')) {
      return 'en'
    }
  }

  // Default to Indonesian
  return 'id'
}

export function getExpTranslations(lang: SupportedLanguage): ExpTranslations {
  return TRANSLATIONS[lang] || TRANSLATIONS.id
}
