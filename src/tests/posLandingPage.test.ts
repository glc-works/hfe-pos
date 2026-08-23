import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('L2-POS-89: POS.Hfeit Dedicated Marketing Landing Page (Early Access Form Focus)', () => {
  const astroPagesDir = path.resolve(__dirname, '../../packages/storefront-astro/src')

  it('should have index.astro and pos/index.astro files configured with PosEarlyAccessSection', () => {
    const indexContent = fs.readFileSync(path.join(astroPagesDir, 'pages/index.astro'), 'utf-8')
    const posIndexContent = fs.readFileSync(path.join(astroPagesDir, 'pages/pos/index.astro'), 'utf-8')

    expect(indexContent).toContain('PosLayout')
    expect(indexContent).toContain('PosHeroSection')
    expect(indexContent).toContain('PosBentoGrid')
    expect(indexContent).toContain('PosEarlyAccessSection')
    expect(indexContent).toContain('PosBottomCta')

    expect(posIndexContent).toContain('PosEarlyAccessSection')
  })

  it('should verify high-impact merchant copywriting and zero premature demo links in PosHeroSection.astro', () => {
    const heroContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosHeroSection.astro'), 'utf-8')

    // Headline assertions
    expect(heroContent).toContain('Antrean panjang.')
    expect(heroContent).toContain('Selesai tanpa kasir panik.')
    expect(heroContent).toContain('16 milidetik')
    expect(heroContent).toContain('internet mati total')

    // Focused Early Access CTA
    expect(heroContent).toContain('Minta Akses Awal')
    expect(heroContent).not.toContain('Coba Demo Interaktif')
  })

  it('should verify interactive early access form fields in PosEarlyAccessSection.astro', () => {
    const formContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosEarlyAccessSection.astro'), 'utf-8')

    // Form inputs
    expect(formContent).toContain('id="early-access"')
    expect(formContent).toContain('name="picName"')
    expect(formContent).toContain('name="storeName"')
    expect(formContent).toContain('name="businessType"')
    expect(formContent).toContain('name="branchCount"')
    expect(formContent).toContain('name="whatsapp"')
    expect(formContent).toContain('name="city"')
    expect(formContent).toContain('Kirim Permohonan Akses Awal')
  })

  it('should verify navigation and bottom CTA point directly to #early-access', () => {
    const navContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosNavbar.astro'), 'utf-8')
    const ctaContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosBottomCta.astro'), 'utf-8')

    expect(navContent).toContain('href="#early-access"')
    expect(navContent).toContain('Minta Akses Awal')

    expect(ctaContent).toContain('href="#early-access"')
    expect(ctaContent).toContain('Minta Akses Awal Sekarang')
  })
})
