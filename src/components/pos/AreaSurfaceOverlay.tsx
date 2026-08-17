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
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 900"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. OUTDOOR GARDEN SMOOTH FILLET PATH (Row 0: 4 cols, Row 1: 2 cols) */}
        <path
          d="M 20 0 H 980 A 20 20 0 0 1 1000 20 V 120 A 20 20 0 0 1 980 140 H 520 A 16 16 0 0 0 504 156 V 272 A 20 20 0 0 1 484 292 H 20 A 20 20 0 0 1 0 272 V 20 A 20 20 0 0 1 20 0 Z"
          fill={AREA_SURFACE_PALETTES['outdoor-garden'].bgFill}
          stroke={AREA_SURFACE_PALETTES['outdoor-garden'].borderColor}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* 2. INDOOR AC DINING SMOOTH FILLET PATH (Row 1: 2 cols, Row 2: 4 cols) */}
        <path
          d="M 524 152 H 980 A 20 20 0 0 1 1000 172 V 424 A 20 20 0 0 1 980 444 H 20 A 20 20 0 0 1 0 424 V 324 A 20 20 0 0 1 20 304 H 480 A 16 16 0 0 0 496 288 V 172 A 20 20 0 0 1 516 152 Z"
          fill={AREA_SURFACE_PALETTES['indoor-ac'].bgFill}
          stroke={AREA_SURFACE_PALETTES['indoor-ac'].borderColor}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* 3. VIP SANCTUARY SMOOTH PATH (Row 3: 4 cols / 2x1 slots) */}
        <path
          d="M 20 456 H 980 A 20 20 0 0 1 1000 476 V 576 A 20 20 0 0 1 980 596 H 20 A 20 20 0 0 1 0 576 V 476 A 20 20 0 0 1 20 456 Z"
          fill={AREA_SURFACE_PALETTES['vip-private'].bgFill}
          stroke={AREA_SURFACE_PALETTES['vip-private'].borderColor}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* 4. POOLSIDE CABANA SMOOTH PATH (Row 4: 4 cols) */}
        <path
          d="M 20 608 H 980 A 20 20 0 0 1 1000 628 V 728 A 20 20 0 0 1 980 748 H 20 A 20 20 0 0 1 0 728 V 628 A 20 20 0 0 1 20 608 Z"
          fill={AREA_SURFACE_PALETTES['poolside-cabana'].bgFill}
          stroke={AREA_SURFACE_PALETTES['poolside-cabana'].borderColor}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* 5. ROOFTOP SKY BAR SMOOTH PATH (Row 5: 4 cols) */}
        <path
          d="M 20 760 H 980 A 20 20 0 0 1 1000 780 V 880 A 20 20 0 0 1 980 900 H 20 A 20 20 0 0 1 0 880 V 780 A 20 20 0 0 1 20 760 Z"
          fill={AREA_SURFACE_PALETTES['rooftop-skybar'].bgFill}
          stroke={AREA_SURFACE_PALETTES['rooftop-skybar'].borderColor}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
