import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { Language, TranslationDictionary, translations } from '../i18n/translations'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationDictionary
  formatPrice: (amount: number) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'hfe_pos_language'

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'id' || saved === 'en') {
        return saved
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'id'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Ignore localStorage errors
    }
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = useMemo(() => translations[language] || translations.id, [language])

  const formatPrice = (amount: number): string => {
    if (language === 'en') {
      return `IDR ${amount.toLocaleString('en-US')}`
    }
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      language: 'id',
      setLanguage: () => {},
      t: translations.id,
      formatPrice: (amount) => `Rp ${amount.toLocaleString('id-ID')}`
    }
  }
  return context
}
