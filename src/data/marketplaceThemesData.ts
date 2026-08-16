import { CafeThemeConfig } from '../types/pos'

export interface MarketplaceThemeItem {
  id: string
  title: string
  creator: string
  rating: number
  downloads: string
  category: 'Matcha & Tea' | 'Artisanal Coffee' | 'Bakery & Pastry' | 'Boba & Sweet' | 'Bar & Night'
  badge?: string
  theme: CafeThemeConfig
}

export const MARKETPLACE_THEMES: MarketplaceThemeItem[] = [
  {
    id: 'tokyo-matcha-zen',
    title: 'Tokyo Matcha Zen',
    creator: 'Studio Kyoto',
    rating: 4.9,
    downloads: '2.4k',
    category: 'Matcha & Tea',
    badge: 'Popular',
    theme: {
      themeName: 'Tokyo Matcha Zen',
      mode: 'dark',
      primaryAccentHex: '#10b981',
      pageBgHex: '#062016',
      cardBgHex: '#0c2e22',
      textColorHex: '#f0fdf4',
      textMutedHex: '#86efac',
      fontFamily: 'Inter, sans-serif'
    }
  },
  {
    id: 'nordic-artisanal-roastery',
    title: 'Nordic Artisanal Roastery',
    creator: 'Oslo Minimalist Lab',
    rating: 4.8,
    downloads: '1.8k',
    category: 'Artisanal Coffee',
    badge: 'Featured',
    theme: {
      themeName: 'Nordic Artisanal Roastery',
      mode: 'dark',
      primaryAccentHex: '#f59e0b',
      pageBgHex: '#18120c',
      cardBgHex: '#261c14',
      textColorHex: '#fef3c7',
      textMutedHex: '#fcd34d',
      fontFamily: 'Inter, sans-serif'
    }
  },
  {
    id: 'cyberpunk-neon-boba',
    title: 'Cyberpunk Neon Boba',
    creator: 'Neo Shibuya UI',
    rating: 4.9,
    downloads: '3.1k',
    category: 'Boba & Sweet',
    badge: 'Trending',
    theme: {
      themeName: 'Cyberpunk Neon Boba',
      mode: 'dark',
      primaryAccentHex: '#06b6d4',
      pageBgHex: '#0f051d',
      cardBgHex: '#1a0b33',
      textColorHex: '#fae8ff',
      textMutedHex: '#e879f9',
      fontFamily: 'Inter, sans-serif'
    }
  },
  {
    id: 'parisian-croissant-warm',
    title: 'Parisian Croissant & Pastry',
    creator: 'Atelier Montmartre',
    rating: 4.7,
    downloads: '1.2k',
    category: 'Bakery & Pastry',
    theme: {
      themeName: 'Parisian Croissant Warm',
      mode: 'light',
      primaryAccentHex: '#d97706',
      pageBgHex: '#fefce8',
      cardBgHex: '#fef08a',
      textColorHex: '#78350f',
      textMutedHex: '#92400e',
      fontFamily: 'serif, Inter'
    }
  },
  {
    id: 'sunset-lounge-speakeasy',
    title: 'Sunset Lounge & Speakeasy',
    creator: 'Velvet Room Design',
    rating: 5.0,
    downloads: '950',
    category: 'Bar & Night',
    badge: 'OLED Black',
    theme: {
      themeName: 'Sunset Lounge Speakeasy',
      mode: 'dark',
      primaryAccentHex: '#ec4899',
      pageBgHex: '#000000',
      cardBgHex: '#11030d',
      textColorHex: '#fdf2f8',
      textMutedHex: '#f472b6',
      fontFamily: 'Inter, sans-serif'
    }
  }
]
