import React, { createContext, useContext, useState, useEffect } from 'react'
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
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isPhysicallyMobile = windowWidth < 768
  const isPhysicallyTablet = windowWidth >= 768 && windowWidth < 1024
  const isPhysicallyDesktop = windowWidth >= 1024

  const isMobile = viewportMode === 'mobile' || (viewportMode === 'responsive' && isPhysicallyMobile)
  const isTablet = viewportMode === 'tablet-portrait' || viewportMode === 'tablet-landscape' || viewportMode === 'tablet' || (viewportMode === 'responsive' && isPhysicallyTablet)
  const isDesktop = viewportMode === 'responsive' ? isPhysicallyDesktop : false

  return (
    <ViewportContext.Provider value={{ viewportMode, isMobile, isTablet, isDesktop }}>
      {children}
    </ViewportContext.Provider>
  )
}

export const useViewport = (): ViewportContextValue => {
  return useContext(ViewportContext)
}
