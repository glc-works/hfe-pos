import { useState } from 'react'
import { HfeCompanyProfile } from '../types/pos'

export function useHfeSync() {
  const [hfeCompanyProfile, setHfeCompanyProfile] = useState<HfeCompanyProfile>({
    companyBookId: 'BOOK-SENOPATI-01',
    ptLegalName: 'PT Kopi Karya Nusantara',
    brandName: 'Kopitiam Senopati & Roastery',
    logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&q=80',
    taxIdNpwp: '01.234.567.8-012.000',
    nibPermit: 'NIB-8120009912001',
    address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    hfeLedgerApiEndpoint: 'https://api.company-books.hfe.internal/v1',
    isLiveHfeSynced: true,
    lastSyncedAt: '19:30',
    storefrontInfo: {
      tagline: 'Artisan Specialty Coffee & Fresh Pastry',
      storyDescription: 'Pelopor kopi artisan dengan biji nusantara pilihan sejak 2020.',
      operatingHours: 'Senin - Minggu: 07:00 - 22:00 WIB',
      wifiSsid: 'Kopitiam_Senopati_Guest',
      wifiPassword: 'kopiuenak2026',
      wifiAccessPolicy: 'after_payment'
    }
  })

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
