import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('L2-POS-89: POS.Hfeit Dedicated Marketing Landing Page', () => {
  const astroPagesDir = path.resolve(__dirname, '../../packages/storefront-astro/src')
  const distDir = path.resolve(__dirname, '../../packages/storefront-astro/dist')

  it('should have index.astro and pos/index.astro files configured for POS.Hfeit', () => {
    const indexContent = fs.readFileSync(path.join(astroPagesDir, 'pages/index.astro'), 'utf-8')
    const posIndexContent = fs.readFileSync(path.join(astroPagesDir, 'pages/pos/index.astro'), 'utf-8')

    expect(indexContent).toContain('PosLayout')
    expect(indexContent).toContain('PosHeroSection')
    expect(indexContent).toContain('PosBentoGrid')
    expect(indexContent).toContain('PosBottomCta')

    expect(posIndexContent).toContain('PosLayout')
  })

  it('should verify high-impact merchant copywriting in PosHeroSection.astro', () => {
    const heroContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosHeroSection.astro'), 'utf-8')

    // Headline assertions
    expect(heroContent).toContain('Antrean panjang.')
    expect(heroContent).toContain('Selesai tanpa kasir panik.')
    expect(heroContent).toContain('16 milidetik')
    expect(heroContent).toContain('internet mati total')

    // Uses centralized app URLs
    expect(heroContent).toContain('POS_SIGNUP_URL')
    expect(heroContent).toContain('POS_DEMO_URL')
  })

  it('should verify preview and production app url helper in appUrls.ts', () => {
    const appUrlsContent = fs.readFileSync(path.join(astroPagesDir, 'lib/appUrls.ts'), 'utf-8')
    expect(appUrlsContent).toContain('pos.hfeit.app')
    expect(appUrlsContent).toContain('prv-pos.hfeit.app')
  })

  it('should verify the 5 core POS bento capabilities in PosBentoGrid.astro', () => {
    const bentoContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosBentoGrid.astro'), 'utf-8')

    // 01 Kitchen Operations
    expect(bentoContent).toContain('Tiket otomatis terpisah ke stasiun yang tepat.')
    expect(bentoContent).toContain('SIAP DISAJIKAN')

    // 02 Spatial Management
    expect(bentoContent).toContain('Pindah meja dan gabung tagihan dalam 1 ketuk.')
    expect(bentoContent).toContain('RELOKASI SELESAI')

    // 03 Reliability
    expect(bentoContent).toContain('Internet mati total, kasir tetap jualan.')
    expect(bentoContent).toContain('OFFLINE MODE: AKTIF')

    // 04 Self-Order
    expect(bentoContent).toContain('Tamu pesan mandiri, 0% potongan komisi.')
    expect(bentoContent).toContain('0% KOMISI PIHAK KETIGA')

    // 05 Security
    expect(bentoContent).toContain('Nol kebocoran kas dengan otorisasi PIN.')
    expect(bentoContent).toContain('RBAC: OTORISASI SUPERVISOR')
  })

  it('should verify navigation and bottom CTA point to POS App URLs', () => {
    const navContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosNavbar.astro'), 'utf-8')
    const ctaContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosBottomCta.astro'), 'utf-8')

    expect(navContent).toContain('POS_APP_URL')
    expect(ctaContent).toContain('POS_SIGNUP_URL')
  })
})
