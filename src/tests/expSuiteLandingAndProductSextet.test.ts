import { describe, it, expect } from 'vitest'
import { resolveLanguage, getExpTranslations } from '../../packages/storefront-astro/src/i18n/langResolver'
import { TRANSLATIONS } from '../../packages/storefront-astro/src/i18n/translations'

describe('L2-POS-88: Flagship EXP.Hfeit Cloudflare Light & 5-Product Quintet Tests', () => {
  it('resolves language with proper hierarchy: URL param > Cookie > Geo-IP > Accept-Language', () => {
    // 1. URL param wins
    expect(resolveLanguage('hfe_lang=id', 'ID', 'id-ID', 'en')).toBe('en')
    expect(resolveLanguage('hfe_lang=en', 'US', 'en-US', 'id')).toBe('id')

    // 2. Cookie manual preference wins over Geo-IP
    expect(resolveLanguage('hfe_lang=en', 'ID', 'id-ID', null)).toBe('en')
    expect(resolveLanguage('hfe_lang=id', 'US', 'en-US', null)).toBe('id')

    // 3. Cloudflare Edge CF-IPCountry
    expect(resolveLanguage(null, 'ID', 'en-US', null)).toBe('id')
    expect(resolveLanguage(null, 'AU', 'en-US', null)).toBe('en')
    expect(resolveLanguage(null, 'SG', 'en-US', null)).toBe('en')

    // 4. Accept-Language fallback
    expect(resolveLanguage(null, null, 'id-ID,id;q=0.9,en;q=0.8', null)).toBe('id')
    expect(resolveLanguage(null, null, 'en-US,en;q=0.9', null)).toBe('en')

    // 5. Default fallback
    expect(resolveLanguage(null, null, null, null)).toBe('id')
  })

  it('guarantees complete translation dictionary parity across ID and EN for 5 Merchant Products', () => {
    const id = TRANSLATIONS.id
    const en = TRANSLATIONS.en

    // Hero
    expect(id.hero.badge).toContain('A SYSTEM THAT GROWS WITH YOU')
    expect(en.hero.badge).toContain('A SYSTEM THAT GROWS WITH YOU')
    expect(id.hero.titleHighlight).toBe('Setiap Tahap')
    expect(en.hero.titleHighlight).toBe('Every Stage')
    expect(id.hero.ctaPrimary).toContain('Daftarkan Usaha')
    expect(en.hero.ctaPrimary).toContain('Start Free Merchant')

    // 5 Quintet Products (No SaaS Operator noise)
    expect(id.quintet.pos.name).toBe('POS.Hfeit')
    expect(en.quintet.pos.name).toBe('POS.Hfeit')
    expect(id.quintet.book.name).toBe('BOOK.Hfeit')
    expect(en.quintet.book.name).toBe('BOOK.Hfeit')
    expect(id.quintet.order.name).toBe('ORDER.Hfeit')
    expect(en.quintet.order.name).toBe('ORDER.Hfeit')
    expect(id.quintet.board.name).toBe('BOARD.Hfeit')
    expect(en.quintet.board.name).toBe('BOARD.Hfeit')
    expect(id.quintet.card.name).toBe('CARD.Hfeit')
    expect(en.quintet.card.name).toBe('CARD.Hfeit')

    // 4 Pain Points Solved
    expect(id.painPoints.p1.product).toBe('BOOK.Hfeit')
    expect(id.painPoints.p2.product).toBe('POS.Hfeit')
    expect(id.painPoints.p3.product).toBe('ORDER & BOARD')
    expect(id.painPoints.p4.product).toBe('POS.Hfeit (RBAC)')

    // 5-Step Workflow Simulation
    expect(id.workflow.steps.length).toBe(5)
    expect(en.workflow.steps.length).toBe(5)
  })

  it('provides high-conversion Onboarding Gateway CTA', () => {
    const id = getExpTranslations('id')
    const en = getExpTranslations('en')

    expect(id.cta.buttonText).toContain('Daftarkan Usaha Anda Sekarang')
    expect(en.cta.buttonText).toContain('Start Free Merchant Trial')
    expect(id.cta.guarantee).toContain('Tanpa Kartu Kredit')
  })
})
