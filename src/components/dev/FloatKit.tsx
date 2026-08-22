import React from 'react'
import { StaffSurfaceMode } from '../../types/pos'

export interface FloatKitProps {
  activeStaffSurface?: StaffSurfaceMode
  setActiveStaffSurface?: (surface: StaffSurfaceMode) => void
}

/**
 * FloatKit — Floating Dev Quick-Settings (Disabled per user request)
 */
export const FloatKit: React.FC<FloatKitProps> = () => {
  return null
}
