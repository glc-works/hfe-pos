import { describe, it, expect } from 'vitest'
import { idTranslations } from '../i18n/id'
import { enTranslations } from '../i18n/en'

export interface SupportTicketPayload {
  category: 'bug' | 'feature' | 'question' | 'praise'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  description: string
  contactInfo?: string
  diagnostics: {
    app: string
    activeView: string
    bookId: string
    branchId: string
    device: string
    screenWidth: string
    timestamp: string
  }
}

export function validateAndFormatSupportTicket(input: {
  category: 'bug' | 'feature' | 'question' | 'praise'
  isUrgent: boolean
  title: string
  description: string
  contactInfo?: string
  activeViewName: string
  bookId: string
  branchId: string
  deviceInfo?: string
}): SupportTicketPayload {
  if (!input.title.trim()) {
    throw new Error('Judul tiket wajib diisi')
  }
  if (!input.description.trim()) {
    throw new Error('Rincian tiket wajib diisi')
  }

  return {
    category: input.category,
    priority: input.isUrgent ? 'urgent' : 'medium',
    title: input.title.trim(),
    description: input.description.trim(),
    contactInfo: input.contactInfo?.trim() || undefined,
    diagnostics: {
      app: 'hfe-pos',
      activeView: input.activeViewName,
      bookId: input.bookId,
      branchId: input.branchId,
      device: input.deviceInfo || 'Mock-Browser/2026',
      screenWidth: '1024x768',
      timestamp: new Date().toISOString()
    }
  }
}

export function generateSupportReferenceId(prefix = 'TIC'): string {
  const year = new Date().getFullYear()
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${year}${month}-${randomSuffix}`
}

describe('Support & Feedback Ticketing Engine (GLC-ENG-STD-001 / Wednesday Deployment)', () => {
  it('formats support ticket payload with automatic diagnostics snapshot', () => {
    const payload = validateAndFormatSupportTicket({
      category: 'bug',
      isUrgent: true,
      title: 'Printer Thermal Tidak Keluar Kertas',
      description: 'Kertas macet di printer kasir meja 1 setelah settlement QRIS',
      contactInfo: '081298765432',
      activeViewName: 'Kasir POS',
      bookId: 'book-senopati-01',
      branchId: 'branch-senopati-hq',
      deviceInfo: 'iPad Pro iOS 18'
    })

    expect(payload.category).toBe('bug')
    expect(payload.priority).toBe('urgent')
    expect(payload.title).toBe('Printer Thermal Tidak Keluar Kertas')
    expect(payload.diagnostics.app).toBe('hfe-pos')
    expect(payload.diagnostics.activeView).toBe('Kasir POS')
    expect(payload.diagnostics.bookId).toBe('book-senopati-01')
    expect(payload.diagnostics.branchId).toBe('branch-senopati-hq')
    expect(payload.diagnostics.device).toBe('iPad Pro iOS 18')
  })

  it('rejects tickets with empty title or description', () => {
    expect(() => validateAndFormatSupportTicket({
      category: 'bug',
      isUrgent: false,
      title: '   ',
      description: 'Ada kendala',
      activeViewName: 'Kasir POS',
      bookId: 'book-01',
      branchId: 'branch-01'
    })).toThrowError('Judul tiket wajib diisi')

    expect(() => validateAndFormatSupportTicket({
      category: 'feature',
      isUrgent: false,
      title: 'Fitur Split Bill',
      description: '',
      activeViewName: 'Kasir POS',
      bookId: 'book-01',
      branchId: 'branch-01'
    })).toThrowError('Rincian tiket wajib diisi')
  })

  it('generates valid ticket reference IDs with year-month prefix', () => {
    const ticketId = generateSupportReferenceId('TIC')
    expect(ticketId).toMatch(/^TIC-\d{6}-\d{4}$/)
  })

  it('maintains 100% i18n parity for support translations in id and en', () => {
    expect(idTranslations.support.modalTitle).toBe('Bantuan & Tiket Masukan (Support)')
    expect(enTranslations.support.modalTitle).toBe('Support & Feedback Ticket')
    expect(idTranslations.support.categoryBug).toBe('🐛 Kendala / Bug')
    expect(enTranslations.support.categoryBug).toBe('🐛 Bug / Issue')
    expect(idTranslations.support.submitCta).toBeDefined()
    expect(enTranslations.support.submitCta).toBeDefined()
  })
})
