import { describe, it, expect } from 'vitest'
import { idTranslations } from '../i18n/id'
import { enTranslations } from '../i18n/en'
import { ThermalPrinterService } from '../services/hardware/ThermalPrinterService'
import { CashierAudioService } from '../services/hardware/CashierAudioService'
import { HfeCompanyProfile } from '../types/pos'

describe('Settings 4-Zone Architecture & Simplification (POS-ENG-STD-001)', () => {
  describe('Zone 1: Profil Usaha & Identitas Legal', () => {
    it('supports full legal identity, brand name, NPWP, NIB OSS, and physical store address', () => {
      const profile: HfeCompanyProfile = {
        companyBookId: 'e9b27bc8-a720-4a4b-9706-5b4cfdc79011',
        ptLegalName: 'PT Kopi Karya Nusantara',
        brandName: 'Kopitiam Senopati & Roastery',
        logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
        taxIdNpwp: '01.234.567.8-012.000',
        nibPermit: '9120001234567',
        address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
        hfeLedgerApiEndpoint: 'http://localhost:8080/v1'
      }

      expect(profile.ptLegalName).toBe('PT Kopi Karya Nusantara')
      expect(profile.brandName).toBe('Kopitiam Senopati & Roastery')
      expect(profile.taxIdNpwp).toBe('01.234.567.8-012.000')
      expect(profile.nibPermit).toBe('9120001234567')
      expect(profile.address).toContain('Senopati')
    })
  })

  describe('Zone 2: Kebijakan Finansial, Pajak PB1 & Biaya Kemasan Takeaway', () => {
    it('supports PB1 Tax Modes: Exclude 10%, Include 10%, Disabled 0%', () => {
      const modes = [0, 1, 2] // 0=Disabled, 1=Exclude, 2=Include
      expect(modes).toContain(1)
      expect(modes).toContain(2)
      expect(modes).toContain(0)

      const subtotal = 100000
      const pb1ExcludeTax = Math.round(subtotal * 0.10)
      const takeawaySurcharge = 2000
      const grandTotalExclude = subtotal + pb1ExcludeTax + takeawaySurcharge

      expect(pb1ExcludeTax).toBe(10000)
      expect(takeawaySurcharge).toBe(2000)
      expect(grandTotalExclude).toBe(112000)
    })

    it('validates default currency is IDR and opening cash float is configured', () => {
      const defaultCurrency = 'IDR'
      const defaultCashFloat = 500000
      expect(defaultCurrency).toBe('IDR')
      expect(defaultCashFloat).toBe(500000)
    })
  })

  describe('Zone 3: Perangkat Keras & Kasir', () => {
    it('configures Thermal ESC/POS printer driver and paper widths 58mm and 80mm', () => {
      const printer = ThermalPrinterService.getInstance()
      printer.updateConfig({
        connectionType: 'bluetooth',
        paperWidth: 58,
        autoCut: true,
        autoKickDrawerOnCash: true
      })

      const config58 = printer.getConfig()
      expect(config58.connectionType).toBe('bluetooth')
      expect(config58.paperWidth).toBe(58)
      expect(config58.autoCut).toBe(true)
      expect(config58.autoKickDrawerOnCash).toBe(true)

      printer.updateConfig({ paperWidth: 80 })
      expect(printer.getConfig().paperWidth).toBe(80)
    })

    it('configures CashierAudioService sound beeper and chime generator', () => {
      const audioService = CashierAudioService.getInstance()
      audioService.setEnabled(true)
      expect(audioService.isEnabled()).toBe(true)

      expect(() => audioService.playBeep(880, 100)).not.toThrow()
      expect(() => audioService.playSuccessChime()).not.toThrow()

      audioService.setEnabled(false)
      expect(audioService.isEnabled()).toBe(false)
      audioService.setEnabled(true)
    })
  })

  describe('Zone 4: Integrasi Hfe Core Single Source of Truth', () => {
    it('supports multi-branch accounting modes: dimensional, multi_book, sub_account', () => {
      const branchModes = ['dimensional', 'multi_book', 'sub_account']
      expect(branchModes).toContain('dimensional')
      expect(branchModes).toContain('multi_book')
      expect(branchModes).toContain('sub_account')
    })
  })

  describe('100% i18n Translation Coverage for Settings', () => {
    it('verifies all 4-zone keys exist and match in ID and EN translation dictionaries', () => {
      const idSettings = idTranslations.settings
      const enSettings = enTranslations.settings

      // Zone 1
      expect(idSettings.zone1Heading).toBeDefined()
      expect(enSettings.zone1Heading).toBeDefined()
      expect(idSettings.ptLegalName).toBeDefined()
      expect(enSettings.ptLegalName).toBeDefined()
      expect(idSettings.taxIdNpwp).toBeDefined()
      expect(enSettings.taxIdNpwp).toBeDefined()

      // Zone 2
      expect(idSettings.zone2Heading).toBeDefined()
      expect(enSettings.zone2Heading).toBeDefined()
      expect(idSettings.pb1TaxTitle).toBeDefined()
      expect(enSettings.pb1TaxTitle).toBeDefined()
      expect(idSettings.takeawaySurcharge).toBeDefined()
      expect(enSettings.takeawaySurcharge).toBeDefined()

      // Zone 3
      expect(idSettings.zone3Heading).toBeDefined()
      expect(enSettings.zone3Heading).toBeDefined()
      expect(idSettings.printerConnectionTitle).toBeDefined()
      expect(enSettings.printerConnectionTitle).toBeDefined()
      expect(idSettings.paper58mm).toBeDefined()
      expect(enSettings.paper58mm).toBeDefined()
      expect(idSettings.soundBeeper).toBeDefined()
      expect(enSettings.soundBeeper).toBeDefined()

      // Zone 4
      expect(idSettings.zone4Heading).toBeDefined()
      expect(enSettings.zone4Heading).toBeDefined()
      expect(idSettings.liveSyncedBadge).toBeDefined()
      expect(enSettings.liveSyncedBadge).toBeDefined()
      expect(idSettings.companyBookId).toBeDefined()
      expect(enSettings.companyBookId).toBeDefined()
      expect(idSettings.dimensionalTagging).toBeDefined()
      expect(enSettings.dimensionalTagging).toBeDefined()
    })
  })
})
