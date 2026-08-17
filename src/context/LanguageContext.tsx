import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { Language, TranslationDictionary, translations } from '../i18n/translations'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationDictionary
  formatPrice: (amount: number) => string
  formatCompactPrice: (amount: number) => string
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

  const formatCompactPrice = (amount: number): string => {
    const abs = Math.abs(amount)
    const sign = amount < 0 ? '-' : ''

    if (language === 'en') {
      if (abs >= 1e12) return `${sign}IDR ${(abs / 1e12).toFixed(1).replace(/\.0$/, '')}T`
      if (abs >= 1e9) return `${sign}IDR ${(abs / 1e9).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}B`
      if (abs >= 1e6) return `${sign}IDR ${(abs / 1e6).toFixed(1).replace(/\.0$/, '')}M`
      if (abs >= 1e3) return `${sign}IDR ${(abs / 1e3).toFixed(0)}K`
      return `IDR ${abs}`
    }

    // Indonesian (Zero-Ambiguity: rb, Jt, Bio, T)
    if (abs >= 1e12) return `${sign}Rp ${(abs / 1e12).toFixed(1).replace(/\.0$/, '').replace('.', ',')} T`
    if (abs >= 1e9) return `${sign}Rp ${(abs / 1e9).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1').replace('.', ',')} Bio`
    if (abs >= 1e6) return `${sign}Rp ${(abs / 1e6).toFixed(1).replace(/\.0$/, '').replace('.', ',')} Jt`
    if (abs >= 1e3) return `${sign}Rp ${(abs / 1e3).toFixed(0)} rb`
    return `Rp ${abs}`
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice, formatCompactPrice }}>
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
      formatPrice: (amount) => `Rp ${amount.toLocaleString('id-ID')}`,
      formatCompactPrice: (amount) => `Rp ${amount}`
    }
  }
  return context
}
