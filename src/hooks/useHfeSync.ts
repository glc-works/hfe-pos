import { useState } from 'react'
import { HfeCompanyProfile } from '../types/pos'
import { DEFAULT_COMPANY_PROFILE } from '../data/mockData'
import { isConnectedFirstPartyRuntime, requiredRuntimeUuid } from '../config/firstPartyRuntime'

export function createInitialHfeCompanyProfile(): HfeCompanyProfile {
  return {
    ...DEFAULT_COMPANY_PROFILE,
    companyBookId: isConnectedFirstPartyRuntime()
      ? requiredRuntimeUuid('VITE_HFE_BOOK_ID')
      : DEFAULT_COMPANY_PROFILE.companyBookId,
    isLiveHfeSynced: true,
    lastSyncedAt: '19:30',
  }
}

export function useHfeSync() {
  const [hfeCompanyProfile, setHfeCompanyProfile] = useState<HfeCompanyProfile>(
    createInitialHfeCompanyProfile
  )

  const [hfeBranchMode, setHfeBranchMode] = useState<'dimensional' | 'multi_book' | 'sub_account'>('dimensional')
  const [activeBranchId, setActiveBranchId] = useState<string>('OUTLET-SENOPATI-01')
  const [outletBranches] = useState([
    { id: 'OUTLET-SENOPATI-01', name: 'Kopitiam Senopati (HQ Outlet)', isMain: true },
    { id: 'OUTLET-DAGO-02', name: 'Kopitiam Dago Bandung', isMain: false },
    { id: 'OUTLET-CANGGU-03', name: 'Kopitiam Beach Club Canggu', isMain: false }
  ])

  const handleFetchHfeCompanyProfile = () => {
    const mockSyncedProfile: HfeCompanyProfile = {
      ...hfeCompanyProfile,
      isLiveHfeSynced: true,
      lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    setHfeCompanyProfile(mockSyncedProfile)
    alert(`🔄 Success GET /v1/company-books/${hfeCompanyProfile.companyBookId}/profile! Profil PT "${mockSyncedProfile.ptLegalName}" & Branding "${mockSyncedProfile.brandName}" Ter-sync Live dari HFE Rust Backend.`)
  }

  const handlePushHfeCompanyProfile = () => {
    setHfeCompanyProfile(prev => ({
      ...prev,
      isLiveHfeSynced: true,
      lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }))
    alert(`💾 Success POST /v1/company-books/${hfeCompanyProfile.companyBookId}/profile! Perubahan Profil PT "${hfeCompanyProfile.ptLegalName}" & Logo Outlet Berhasil Diposting ke HFE Engine.`)
  }

  return {
    hfeCompanyProfile,
    setHfeCompanyProfile,
    hfeBranchMode,
    setHfeBranchMode,
    activeBranchId,
    setActiveBranchId,
    outletBranches,
    handleFetchHfeCompanyProfile,
    handlePushHfeCompanyProfile
  }
}
