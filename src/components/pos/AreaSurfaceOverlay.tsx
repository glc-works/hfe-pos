import React from 'react'
import { PropertyZoneId } from '../../types/pos'

export interface AreaSurfaceConfig {
  id: PropertyZoneId
  name: string
  icon: string
  color: string
  bgCard: string
  borderCard: string
  hoverBorderCard: string
}

export const AREA_SURFACE_PALETTES: Record<PropertyZoneId, AreaSurfaceConfig> = {
  all: {
    id: 'all',
    name: 'Semua Area',
    icon: '🏢',
    color: '#94a3b8',
    bgCard: 'bg-slate-900/60',
    borderCard: 'border-slate-800',
    hoverBorderCard: 'hover:border-slate-700',
  },
  'outdoor-garden': {
    id: 'outdoor-garden',
    name: 'Outdoor Garden',
    icon: '🌿',
    color: '#10b981',
    bgCard: 'bg-emerald-950/25',
    borderCard: 'border-emerald-500/25',
    hoverBorderCard: 'hover:border-emerald-400/50',
  },
  'indoor-ac': {
    id: 'indoor-ac',
    name: 'Indoor AC Dining',
    icon: '❄️',
    color: '#06b6d4',
    bgCard: 'bg-cyan-950/25',
    borderCard: 'border-cyan-500/25',
    hoverBorderCard: 'hover:border-cyan-400/50',
  },
  'vip-private': {
    id: 'vip-private',
    name: 'VIP Private Rooms',
    icon: '👑',
    color: '#f59e0b',
    bgCard: 'bg-amber-950/30',
    borderCard: 'border-amber-500/35',
    hoverBorderCard: 'hover:border-amber-400/60',
  },
  'poolside-cabana': {
    id: 'poolside-cabana',
    name: 'Poolside Cabana',
    icon: '🏊',
    color: '#14b8a6',
    bgCard: 'bg-teal-950/25',
    borderCard: 'border-teal-500/25',
    hoverBorderCard: 'hover:border-teal-400/50',
  },
  'rooftop-skybar': {
    id: 'rooftop-skybar',
    name: 'Rooftop Sky Bar',
    icon: '🍸',
    color: '#6366f1',
    bgCard: 'bg-indigo-950/25',
    borderCard: 'border-indigo-500/25',
    hoverBorderCard: 'hover:border-indigo-400/50',
  },
}

export interface AreaSurfaceOverlayProps {
  viewMode?: 'grid' | 'compact' | 'list'
}

export const AreaSurfaceOverlay: React.FC<AreaSurfaceOverlayProps> = () => {
  // Wireframe strokes eliminated to guarantee zero-collision between area islands.
  // Area island identity is natively projected through high-contrast chromatic card surfaces.
  return null
}
