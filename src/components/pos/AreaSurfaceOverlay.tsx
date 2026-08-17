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
    bgCard: 'bg-slate-900/70',
    borderCard: 'border-slate-800',
    hoverBorderCard: 'hover:border-slate-700',
  },
  'outdoor-garden': {
    id: 'outdoor-garden',
    name: 'Outdoor Garden',
    icon: '🌿',
    color: '#10b981',
    bgCard: 'bg-emerald-950/40',
    borderCard: 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.06)]',
    hoverBorderCard: 'hover:border-emerald-400/80',
  },
  'indoor-ac': {
    id: 'indoor-ac',
    name: 'Indoor AC Dining',
    icon: '❄️',
    color: '#06b6d4',
    bgCard: 'bg-cyan-950/40',
    borderCard: 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.06)]',
    hoverBorderCard: 'hover:border-cyan-400/80',
  },
  'vip-private': {
    id: 'vip-private',
    name: 'VIP Private Rooms',
    icon: '👑',
    color: '#f59e0b',
    bgCard: 'bg-amber-950/45',
    borderCard: 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.08)]',
    hoverBorderCard: 'hover:border-amber-400/90',
  },
  'poolside-cabana': {
    id: 'poolside-cabana',
    name: 'Poolside Cabana',
    icon: '🏊',
    color: '#14b8a6',
    bgCard: 'bg-teal-950/40',
    borderCard: 'border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.06)]',
    hoverBorderCard: 'hover:border-teal-400/80',
  },
  'rooftop-skybar': {
    id: 'rooftop-skybar',
    name: 'Rooftop Sky Bar',
    icon: '🍸',
    color: '#6366f1',
    bgCard: 'bg-indigo-950/40',
    borderCard: 'border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.06)]',
    hoverBorderCard: 'hover:border-indigo-400/80',
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
