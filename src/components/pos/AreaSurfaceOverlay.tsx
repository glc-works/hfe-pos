import React from 'react'
import { PropertyZoneId } from '../../types/pos'

export interface AreaSurfaceConfig {
  id: PropertyZoneId
  name: string
  icon: string
  color: string
  bgFill: string
  borderColor: string
  badgeText: string
}

export const AREA_SURFACE_PALETTES: Record<PropertyZoneId, AreaSurfaceConfig> = {
  all: {
    id: 'all',
    name: 'Semua Area',
    icon: '🏢',
    color: '#94a3b8',
    bgFill: 'rgba(148, 163, 184, 0.04)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    badgeText: 'All Areas',
  },
  'outdoor-garden': {
    id: 'outdoor-garden',
    name: 'Outdoor Garden',
    icon: '🌿',
    color: '#10b981',
    bgFill: 'rgba(16, 185, 129, 0.06)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    badgeText: 'Outdoor Garden',
  },
  'indoor-ac': {
    id: 'indoor-ac',
    name: 'Indoor AC Dining',
    icon: '❄️',
    color: '#06b6d4',
    bgFill: 'rgba(6, 182, 212, 0.06)',
    borderColor: 'rgba(6, 182, 212, 0.25)',
    badgeText: 'Indoor AC Dining',
  },
  'vip-private': {
    id: 'vip-private',
    name: 'VIP Private Rooms',
    icon: '👑',
    color: '#f59e0b',
    bgFill: 'rgba(245, 158, 11, 0.07)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    badgeText: 'VIP Sanctuary',
  },
  'poolside-cabana': {
    id: 'poolside-cabana',
    name: 'Poolside Cabana',
    icon: '🏊',
    color: '#14b8a6',
    bgFill: 'rgba(20, 184, 166, 0.06)',
    borderColor: 'rgba(20, 184, 166, 0.25)',
    badgeText: 'Poolside Cabana',
  },
  'rooftop-skybar': {
    id: 'rooftop-skybar',
    name: 'Rooftop Sky Bar',
    icon: '🍸',
    color: '#6366f1',
    bgFill: 'rgba(99, 102, 241, 0.06)',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    badgeText: 'Rooftop Sky Bar',
  },
}

export interface AreaSurfaceOverlayProps {
  viewMode?: 'grid' | 'compact' | 'list'
}

export const AreaSurfaceOverlay: React.FC<AreaSurfaceOverlayProps> = ({ viewMode = 'grid' }) => {
  if (viewMode !== 'grid') return null

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. OUTDOOR GARDEN INTERLOCKING SURFACE (Row 0: Cols 0-3, Row 1: Cols 0-1) */}
      <div
        className="absolute top-0 left-0 w-full h-[calc(33.33%-4px)] rounded-3xl border transition-all duration-300"
        style={{
          backgroundColor: AREA_SURFACE_PALETTES['outdoor-garden'].bgFill,
          borderColor: AREA_SURFACE_PALETTES['outdoor-garden'].borderColor,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 50% 50%, 50% 100%, 0% 100%)',
        }}
      />

      {/* 2. INDOOR AC DINING INTERLOCKING SURFACE (Row 1: Cols 2-3, Row 2: Cols 0-3) */}
      <div
        className="absolute top-[calc(16.66%)] left-0 w-full h-[calc(33.33%-4px)] rounded-3xl border transition-all duration-300"
        style={{
          backgroundColor: AREA_SURFACE_PALETTES['indoor-ac'].bgFill,
          borderColor: AREA_SURFACE_PALETTES['indoor-ac'].borderColor,
          clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%, 50% 50%)',
        }}
      />

      {/* 3. VIP SANCTUARY SURFACE (Row 3: Cols 0-3) */}
      <div
        className="absolute top-[calc(50%)] left-0 w-full h-[calc(16.66%-6px)] rounded-3xl border transition-all duration-300"
        style={{
          backgroundColor: AREA_SURFACE_PALETTES['vip-private'].bgFill,
          borderColor: AREA_SURFACE_PALETTES['vip-private'].borderColor,
        }}
      />

      {/* 4. POOLSIDE CABANA SURFACE (Row 4: Cols 0-3) */}
      <div
        className="absolute top-[calc(66.66%)] left-0 w-full h-[calc(16.66%-6px)] rounded-3xl border transition-all duration-300"
        style={{
          backgroundColor: AREA_SURFACE_PALETTES['poolside-cabana'].bgFill,
          borderColor: AREA_SURFACE_PALETTES['poolside-cabana'].borderColor,
        }}
      />

      {/* 5. ROOFTOP SKY BAR SURFACE (Row 5: Cols 0-3) */}
      <div
        className="absolute top-[calc(83.33%)] left-0 w-full h-[calc(16.66%-6px)] rounded-3xl border transition-all duration-300"
        style={{
          backgroundColor: AREA_SURFACE_PALETTES['rooftop-skybar'].bgFill,
          borderColor: AREA_SURFACE_PALETTES['rooftop-skybar'].borderColor,
        }}
      />
    </div>
  )
}
