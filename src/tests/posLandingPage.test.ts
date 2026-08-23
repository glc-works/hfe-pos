import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('L2-POS-89: POS.Hfeit Dedicated Marketing Landing Page (Early Access Request Form)', () => {
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

  it('should verify interactive early access form fields and direct CTA in PosEarlyAccessSection.astro', () => {
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
    expect(formContent).toContain('Permohonan Berhasil Dikirim!')
  })

  it('should verify direct early access CTA buttons linking to #early-access without email mentions', () => {
    const navContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosNavbar.astro'), 'utf-8')
    const heroContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosHeroSection.astro'), 'utf-8')
    const ctaContent = fs.readFileSync(path.join(astroPagesDir, 'components/pos/PosBottomCta.astro'), 'utf-8')

    expect(navContent).toContain('href="#early-access"')
    expect(navContent).toContain('Minta Akses Awal')
    expect(navContent).not.toContain('via email')

    expect(heroContent).toContain('href="#early-access"')
    expect(heroContent).toContain('Minta Akses Awal')
    expect(heroContent).not.toContain('via email')

    expect(ctaContent).toContain('href="#early-access"')
    expect(ctaContent).toContain('Minta Akses Awal Sekarang')
    expect(ctaContent).not.toContain('via email')
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
})
