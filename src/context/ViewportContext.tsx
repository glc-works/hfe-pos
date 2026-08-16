import React, { createContext, useContext } from 'react'
import { ViewportModeType } from '../types/pos'

export interface ViewportContextValue {
  viewportMode: ViewportModeType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const ViewportContext = createContext<ViewportContextValue>({
  viewportMode: 'responsive',
  isMobile: false,
  isTablet: false,
  isDesktop: true
})

export interface ViewportProviderProps {
  viewportMode: ViewportModeType
  children: React.ReactNode
}

export const ViewportProvider: React.FC<ViewportProviderProps> = ({
  viewportMode,
  children
}) => {
  const isMobile = viewportMode === 'mobile'
  const isTablet = viewportMode === 'tablet-portrait' || viewportMode === 'tablet-landscape' || viewportMode === 'tablet'
  const isDesktop = viewportMode === 'responsive'

  return (
    <ViewportContext.Provider value={{ viewportMode, isMobile, isTablet, isDesktop }}>
      {children}
    </ViewportContext.Provider>
  )
}

export const useViewport = (): ViewportContextValue => {
  return useContext(ViewportContext)
}
