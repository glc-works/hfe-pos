import { Language, TranslationDictionary } from './types'
import { idTranslations } from './id'
import { enTranslations } from './en'

export { type Language, type TranslationDictionary } from './types'
export { idTranslations } from './id'
export { enTranslations } from './en'

export const translations: Record<Language, TranslationDictionary> = {
  id: idTranslations,
  en: enTranslations
}
