import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('PWA Web App Installation & Manifest Integrity', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should have a valid public/manifest.json with standalone display mode', () => {
    const manifestPath = path.resolve(__dirname, '../../public/manifest.json')
    expect(fs.existsSync(manifestPath)).toBe(true)

    const raw = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(raw)

    expect(manifest.name).toBe('Hfe POS — Point of Sale & Commerce Suite')
    expect(manifest.short_name).toBe('Hfe POS')
    expect(manifest.display).toBe('standalone')
    expect(manifest.start_url).toBe('/')
    expect(manifest.theme_color).toBe('#0f172a')
    expect(manifest.background_color).toBe('#020617')
    expect(Array.isArray(manifest.icons)).toBe(true)
    expect(manifest.icons.length).toBeGreaterThan(0)
  })

  it('should declare PWA and Apple Mobile Web App tags in index.html', () => {
    const indexPath = path.resolve(__dirname, '../../index.html')
    expect(fs.existsSync(indexPath)).toBe(true)

    const indexHtml = fs.readFileSync(indexPath, 'utf-8')

    expect(indexHtml).toContain('rel="manifest"')
    expect(indexHtml).toContain('href="/manifest.json"')
    expect(indexHtml).toContain('name="apple-mobile-web-app-capable"')
    expect(indexHtml).toContain('content="black-translucent"')
    expect(indexHtml).toContain('rel="apple-touch-icon"')
  })

  it('should have a high quality SVG icon in public/favicon.svg', () => {
    const faviconPath = path.resolve(__dirname, '../../public/favicon.svg')
    expect(fs.existsSync(faviconPath)).toBe(true)

    const svgContent = fs.readFileSync(faviconPath, 'utf-8')
    expect(svgContent).toContain('<svg')
    expect(svgContent).toContain('viewBox="0 0 512 512"')
  })
})
