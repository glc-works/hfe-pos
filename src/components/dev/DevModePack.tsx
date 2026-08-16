import React, { ReactNode } from 'react'
import { FloatKit, FloatKitProps } from './FloatKit'

export interface DevModePackProps extends FloatKitProps {
  children?: ReactNode
}

/**
 * DevModePack v3.0 (Compatibility Wrapper for FloatKit)
 * 
 * Replaced cumbersome simulated iframe wrappers with pure native viewports + FloatKit widget.
 */
export const DevModePack: React.FC<DevModePackProps> = ({
  activeStaffSurface,
  setActiveStaffSurface,
  children
}) => {
  return (
    <>
      {children}
      <FloatKit
        activeStaffSurface={activeStaffSurface}
        setActiveStaffSurface={setActiveStaffSurface}
      />
    </>
  )
}
