import React from 'react'
import { LandingPageView } from '../components/landing/LandingPageView'
import { HfeCompanyProfile, MenuItem, ViewportModeType } from '../types/pos'

export interface LandingViewProps {
  hfeCompanyProfile: HfeCompanyProfile
  productCatalog: MenuItem[]
  viewportMode?: ViewportModeType
  onOpenReservationModal: () => void
  onSwitchToCustomerApp: () => void
}

export const LandingView: React.FC<LandingViewProps> = ({
  hfeCompanyProfile,
  productCatalog,
  viewportMode = 'responsive',
  onOpenReservationModal,
  onSwitchToCustomerApp
}) => {
  return (
    <LandingPageView
      hfeCompanyProfile={hfeCompanyProfile}
      productCatalog={productCatalog}
      viewportMode={viewportMode}
      onOpenReservationModal={onOpenReservationModal}
      onSwitchToCustomerApp={onSwitchToCustomerApp}
    />
  )
}
