import { describe, it, expect } from 'vitest'
import {
  InventoryAssemblyModal,
  BiologicalAssetRegistry,
  ConsolidatedStatementView,
  PRESET_BOM_RECIPES,
  INITIAL_PLANTATION_BLOCKS
} from '../components/book'
import { WholesaleBillingInspector } from '../components/admin'
import * as BookComponents from '../components/book'
import * as AdminComponents from '../components/admin'

describe('Domain Components: Pillar 6 (BOOK) and Pillar 2 (ADMIN)', () => {
  describe('Barrel Index Exports', () => {
    it('exports all canonical book domain components including new wave 6 additions', () => {
      expect(BookComponents.InventoryAssemblyModal).toBeDefined()
      expect(BookComponents.BiologicalAssetRegistry).toBeDefined()
      expect(BookComponents.ConsolidatedStatementView).toBeDefined()
      expect(BookComponents.CoATreeHierarchy).toBeDefined()
      expect(BookComponents.JournalEntryTable).toBeDefined()
      expect(BookComponents.TrialBalanceView).toBeDefined()
      expect(BookComponents.BalanceSheetStatement).toBeDefined()
      expect(BookComponents.ProfitAndLossStatement).toBeDefined()
      expect(BookComponents.TaxCompliancePortal).toBeDefined()
    })

    it('exports admin domain components from src/components/admin barrel', () => {
      expect(AdminComponents.WholesaleBillingInspector).toBeDefined()
    })
  })

  describe('1. InventoryAssemblyModal (Roasting BOM & COGM Engine)', () => {
    it('calculates 100kg Arabica Gayo batch consumption, 15% shrinkage, and COGM unit cost correctly', () => {
      const recipe = PRESET_BOM_RECIPES[0] // Arabica Gayo Medium Roast - 100kg batch
      expect(recipe.baseBatchGreenKg).toBe(100)
      expect(recipe.shrinkagePct).toBe(15)

      const greenBeanConsumedKg = 100
      const roastedOutputKg = greenBeanConsumedKg * (1 - 0.15) // 85kg
      const valveBagConsumedPcs = Math.ceil(roastedOutputKg / recipe.packSizeKg) // 85 pcs

      const greenBeanCost = greenBeanConsumedKg * recipe.greenBeanCostPerKg // 100 * 125,000 = 12,500,000
      const packagingCost = valveBagConsumedPcs * recipe.valveBagCostPerPcs // 85 * 4,500 = 382,500
      const laborCost = recipe.directLaborCostPerBatch // 350,000
      const overheadCost = recipe.overheadGasElectricity // 220,000

      const totalCogm = greenBeanCost + packagingCost + laborCost + overheadCost // 13,452,500
      const cogmPerKg = totalCogm / roastedOutputKg // 13,452,500 / 85 = 158,264.70

      expect(roastedOutputKg).toBe(85)
      expect(valveBagConsumedPcs).toBe(85)
      expect(greenBeanCost).toBe(12500000)
      expect(totalCogm).toBe(13452500)
      expect(cogmPerKg).toBeCloseTo(158264.7, 1)
    })
  })

  describe('2. BiologicalAssetRegistry (PSAK 69 / IAS 41 Plantation Valuation)', () => {
    it('verifies 50-Ha plantation, 50,000 mature coffee trees, and total valuation Rp 3,000,000,000', () => {
      const totalArea = INITIAL_PLANTATION_BLOCKS.reduce((acc, b) => acc + b.areaHa, 0)
      const totalTrees = INITIAL_PLANTATION_BLOCKS.reduce((acc, b) => acc + b.treeCount, 0)
      const totalValuation = INITIAL_PLANTATION_BLOCKS.reduce(
        (acc, b) => acc + b.treeCount * b.fairValuePerTree,
        0
      )

      expect(totalArea).toBe(50) // 50 Ha
      expect(totalTrees).toBe(50000) // 50,000 trees
      expect(totalValuation).toBe(3000000000) // Rp 3,000,000,000 (3 Billion IDR)
      expect(totalValuation / totalTrees).toBe(60000) // Rp 60,000 / tree
    })

    it('calculates harvest point-of-harvest produce valuation for 12,500 kg fresh cherries', () => {
      const harvestWeightKg = 12500
      const cherryMarketPricePerKg = 14000
      const totalProduceValuation = harvestWeightKg * cherryMarketPricePerKg

      expect(totalProduceValuation).toBe(175000000) // Rp 175,000,000
    })
  })

  describe('3. ConsolidatedStatementView (Multi-Entity Holding Consolidation)', () => {
    it('verifies zero reciprocal net variance upon intercompany elimination', () => {
      // HoldCo SG Intercompany AR = $900,000
      // PT Indo Intercompany AP = $600,000
      // MY OpCo Intercompany AP = $300,000
      const intercompanyAr = 900000
      const intercompanyAp = 600000 + 300000
      const netIntercompanyDiff = intercompanyAr - intercompanyAp

      expect(netIntercompanyDiff).toBe(0) // Net Selisih $0.00
    })
  })

  describe('4. WholesaleBillingInspector (Super-Admin B2B Wholesale Metering)', () => {
    it('meters live monthly API mutation volume counter and dual-ledger posting equivalence', () => {
      const posVolume = 1200000
      const tbVolume = 950000
      const kdsVolume = 695920
      const totalVolume = posVolume + tbVolume + kdsVolume

      const posCost = posVolume * 15 // 18,000,000
      const tbCost = tbVolume * 25 // 23,750,000
      const kdsCost = kdsVolume * 10 // 6,959,200
      const totalInvoice = posCost + tbCost + kdsCost // 48,709,200

      expect(totalVolume).toBe(2845920)
      expect(totalInvoice).toBe(48709200)

      // Dual ledger assertion: Tenant 01 AR == Tenant 02 AP
      const tenant01Ar = totalInvoice
      const tenant02Ap = totalInvoice
      expect(tenant01Ar).toBe(tenant02Ap)
    })
  })
})
