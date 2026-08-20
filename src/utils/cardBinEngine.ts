/**
 * Universal Card BIN (Bank Identification Number) & IIN Engine (ISO/IEC 7812-1)
 * Supports 8-digit & 6-digit BIN lookup for International & Indonesian Banks.
 */

export type CardNetworkType = 'visa' | 'mastercard' | 'gpn' | 'jcb' | 'amex' | 'discover' | 'unionpay' | 'other'
export type CardInstrumentType = 'debit' | 'credit'

export interface CardBinInfo {
  network: CardNetworkType
  cardType: CardInstrumentType
  bankName: string
  cardTier: string
  countryCode: string
  formattedLabel: string
  badgeColor: string
  brandColor: string
}

interface BinEntry {
  prefix: string // 2 to 8 digits prefix
  network: CardNetworkType
  cardType: CardInstrumentType
  bankName: string
  cardTier: string
  countryCode: string
  brandColor: string
}

// Comprehensive BIN Dictionary (Indonesian Top Banks + Global Top Issuers)
const BIN_DICTIONARY: BinEntry[] = [
  // --- INDONESIA: BANK CENTRAL ASIA (BCA) ---
  { prefix: '455633', network: 'visa', cardType: 'debit', bankName: 'BCA', cardTier: 'Paspor Platinum', countryCode: 'ID', brandColor: '#00529C' },
  { prefix: '45563321', network: 'visa', cardType: 'debit', bankName: 'BCA', cardTier: 'Paspor Platinum', countryCode: 'ID', brandColor: '#00529C' },
  { prefix: '45563388', network: 'visa', cardType: 'credit', bankName: 'BCA', cardTier: 'Visa Batman CC', countryCode: 'ID', brandColor: '#00529C' },
  { prefix: '472647', network: 'visa', cardType: 'credit', bankName: 'BCA', cardTier: 'Everyday Card', countryCode: 'ID', brandColor: '#00529C' },
  { prefix: '47264700', network: 'visa', cardType: 'credit', bankName: 'BCA', cardTier: 'Visa Platinum CC', countryCode: 'ID', brandColor: '#00529C' },
  { prefix: '537176', network: 'mastercard', cardType: 'credit', bankName: 'BCA', cardTier: 'Mastercard Platinum', countryCode: 'ID', brandColor: '#00529C' },
  { prefix: '53717600', network: 'mastercard', cardType: 'credit', bankName: 'BCA', cardTier: 'Mastercard Black CC', countryCode: 'ID', brandColor: '#00529C' },
  { prefix: '356512', network: 'jcb', cardType: 'credit', bankName: 'BCA', cardTier: 'JCB Black CC', countryCode: 'ID', brandColor: '#00529C' },
  { prefix: '194600', network: 'gpn', cardType: 'debit', bankName: 'BCA', cardTier: 'Paspor GPN Chip', countryCode: 'ID', brandColor: '#00529C' },

  // --- INDONESIA: BANK MANDIRI ---
  { prefix: '409784', network: 'visa', cardType: 'debit', bankName: 'Mandiri', cardTier: 'Mandiri Debit Visa', countryCode: 'ID', brandColor: '#003366' },
  { prefix: '416564', network: 'visa', cardType: 'credit', bankName: 'Mandiri', cardTier: 'Mandiri Signature CC', countryCode: 'ID', brandColor: '#003366' },
  { prefix: '521114', network: 'mastercard', cardType: 'debit', bankName: 'Mandiri', cardTier: 'Mandiri Debit Gold', countryCode: 'ID', brandColor: '#003366' },
  { prefix: '52111400', network: 'mastercard', cardType: 'debit', bankName: 'Mandiri', cardTier: 'Mandiri Debit Platinum', countryCode: 'ID', brandColor: '#003366' },
  { prefix: '518856', network: 'mastercard', cardType: 'credit', bankName: 'Mandiri', cardTier: 'Mandiri Skyz CC', countryCode: 'ID', brandColor: '#003366' },
  { prefix: '557338', network: 'mastercard', cardType: 'credit', bankName: 'Mandiri', cardTier: 'World Elite CC', countryCode: 'ID', brandColor: '#003366' },
  { prefix: '356513', network: 'jcb', cardType: 'credit', bankName: 'Mandiri', cardTier: 'Mandiri JCB Precious', countryCode: 'ID', brandColor: '#003366' },
  { prefix: '194602', network: 'gpn', cardType: 'debit', bankName: 'Mandiri', cardTier: 'Mandiri GPN Chip', countryCode: 'ID', brandColor: '#003366' },

  // --- INDONESIA: BANK RAKYAT INDONESIA (BRI) ---
  { prefix: '461700', network: 'visa', cardType: 'debit', bankName: 'BRI', cardTier: 'BritAma Visa Debit', countryCode: 'ID', brandColor: '#005696' },
  { prefix: '46170012', network: 'visa', cardType: 'debit', bankName: 'BRI', cardTier: 'BritAma Bisnis Debit', countryCode: 'ID', brandColor: '#005696' },
  { prefix: '436502', network: 'visa', cardType: 'credit', bankName: 'BRI', cardTier: 'BRI Infinite CC', countryCode: 'ID', brandColor: '#005696' },
  { prefix: '518828', network: 'mastercard', cardType: 'credit', bankName: 'BRI', cardTier: 'BRI Touch CC', countryCode: 'ID', brandColor: '#005696' },
  { prefix: '522184', network: 'mastercard', cardType: 'debit', bankName: 'BRI', cardTier: 'BRI Simpedes Debit', countryCode: 'ID', brandColor: '#005696' },
  { prefix: '356514', network: 'jcb', cardType: 'credit', bankName: 'BRI', cardTier: 'BRI JCB Platinum', countryCode: 'ID', brandColor: '#005696' },
  { prefix: '194603', network: 'gpn', cardType: 'debit', bankName: 'BRI', cardTier: 'BRI GPN Chip', countryCode: 'ID', brandColor: '#005696' },

  // --- INDONESIA: BANK NEGARA INDONESIA (BNI) ---
  { prefix: '421570', network: 'visa', cardType: 'debit', bankName: 'BNI', cardTier: 'BNI Taplus Debit', countryCode: 'ID', brandColor: '#005E5D' },
  { prefix: '42157011', network: 'visa', cardType: 'debit', bankName: 'BNI', cardTier: 'BNI Emerald Debit', countryCode: 'ID', brandColor: '#005E5D' },
  { prefix: '432440', network: 'visa', cardType: 'credit', bankName: 'BNI', cardTier: 'BNI Visa Signature', countryCode: 'ID', brandColor: '#005E5D' },
  { prefix: '542640', network: 'mastercard', cardType: 'credit', bankName: 'BNI', cardTier: 'BNI World Mastercard', countryCode: 'ID', brandColor: '#005E5D' },
  { prefix: '356515', network: 'jcb', cardType: 'credit', bankName: 'BNI', cardTier: 'BNI JCB Ultimate', countryCode: 'ID', brandColor: '#005E5D' },
  { prefix: '194601', network: 'gpn', cardType: 'debit', bankName: 'BNI', cardTier: 'BNI GPN Chip', countryCode: 'ID', brandColor: '#005E5D' },

  // --- INDONESIA: CIMB NIAGA, PERMATA, DANAMON, DIGITAL BANKS ---
  { prefix: '405466', network: 'visa', cardType: 'debit', bankName: 'CIMB Niaga', cardTier: 'Octo Debit Visa', countryCode: 'ID', brandColor: '#ED1B2D' },
  { prefix: '528941', network: 'mastercard', cardType: 'credit', bankName: 'CIMB Niaga', cardTier: 'CIMB ALL Accor Live', countryCode: 'ID', brandColor: '#ED1B2D' },
  { prefix: '356516', network: 'jcb', cardType: 'credit', bankName: 'CIMB Niaga', cardTier: 'CIMB JCB Ultimate', countryCode: 'ID', brandColor: '#ED1B2D' },
  { prefix: '429841', network: 'visa', cardType: 'debit', bankName: 'Permata', cardTier: 'Permata ME Debit', countryCode: 'ID', brandColor: '#008542' },
  { prefix: '548989', network: 'mastercard', cardType: 'credit', bankName: 'Permata', cardTier: 'Permata Black World', countryCode: 'ID', brandColor: '#008542' },
  { prefix: '425945', network: 'visa', cardType: 'debit', bankName: 'Danamon', cardTier: 'Danamon Debit Visa', countryCode: 'ID', brandColor: '#002D62' },
  { prefix: '541577', network: 'mastercard', cardType: 'credit', bankName: 'Danamon', cardTier: 'Danamon World Elite', countryCode: 'ID', brandColor: '#002D62' },
  { prefix: '405542', network: 'visa', cardType: 'debit', bankName: 'Jenius (BTPN)', cardTier: 'm-Card Visa Debit', countryCode: 'ID', brandColor: '#00A3E0' },
  { prefix: '418855', network: 'visa', cardType: 'debit', bankName: 'Bank Jago', cardTier: 'Jago Visa Debit', countryCode: 'ID', brandColor: '#5E2750' },

  // --- SINGAPORE & REGIONAL: DBS, UOB, OCBC ---
  { prefix: '454313', network: 'visa', cardType: 'debit', bankName: 'DBS Singapore', cardTier: 'DBS Visa Debit', countryCode: 'SG', brandColor: '#FF0000' },
  { prefix: '526471', network: 'mastercard', cardType: 'credit', bankName: 'DBS Singapore', cardTier: 'DBS Altitude World', countryCode: 'SG', brandColor: '#FF0000' },
  { prefix: '454172', network: 'visa', cardType: 'credit', bankName: 'UOB', cardTier: 'UOB PRVI Miles Visa', countryCode: 'SG', brandColor: '#00205B' },
  { prefix: '542563', network: 'mastercard', cardType: 'credit', bankName: 'UOB', cardTier: 'UOB One Card MC', countryCode: 'SG', brandColor: '#00205B' },
  { prefix: '455202', network: 'visa', cardType: 'credit', bankName: 'OCBC Singapore', cardTier: 'OCBC 90N Visa', countryCode: 'SG', brandColor: '#E60000' },
  { prefix: '528987', network: 'mastercard', cardType: 'credit', bankName: 'OCBC Singapore', cardTier: 'OCBC Titanium Rewards', countryCode: 'SG', brandColor: '#E60000' },

  // --- GLOBAL & US: CHASE, CITI, HSBC, AMEX, REVOLUT, WISE ---
  { prefix: '402400', network: 'visa', cardType: 'credit', bankName: 'Chase (US)', cardTier: 'Sapphire Preferred', countryCode: 'US', brandColor: '#117ACA' },
  { prefix: '414720', network: 'visa', cardType: 'credit', bankName: 'Chase (US)', cardTier: 'Chase Freedom Visa', countryCode: 'US', brandColor: '#117ACA' },
  { prefix: '480011', network: 'visa', cardType: 'credit', bankName: 'Bank of America', cardTier: 'Travel Rewards Visa', countryCode: 'US', brandColor: '#E31837' },
  { prefix: '546616', network: 'mastercard', cardType: 'credit', bankName: 'Citibank (Global)', cardTier: 'Citi Premier World', countryCode: 'US', brandColor: '#003B70' },
  { prefix: '400022', network: 'visa', cardType: 'credit', bankName: 'HSBC Global', cardTier: 'HSBC Premier Visa', countryCode: 'GB', brandColor: '#DB0011' },
  { prefix: '541288', network: 'mastercard', cardType: 'credit', bankName: 'HSBC Global', cardTier: 'HSBC World Elite', countryCode: 'GB', brandColor: '#DB0011' },
  { prefix: '340000', network: 'amex', cardType: 'credit', bankName: 'American Express', cardTier: 'Centurion Black Card', countryCode: 'US', brandColor: '#006FCF' },
  { prefix: '371200', network: 'amex', cardType: 'credit', bankName: 'American Express', cardTier: 'Platinum Card', countryCode: 'US', brandColor: '#006FCF' },
  { prefix: '378282', network: 'amex', cardType: 'credit', bankName: 'American Express', cardTier: 'Gold Card', countryCode: 'US', brandColor: '#006FCF' },
  { prefix: '535456', network: 'mastercard', cardType: 'debit', bankName: 'Revolut', cardTier: 'Revolut Multi-Currency', countryCode: 'GB', brandColor: '#19B2FF' },
  { prefix: '539123', network: 'mastercard', cardType: 'debit', bankName: 'Wise', cardTier: 'Wise Travel Debit', countryCode: 'GB', brandColor: '#9FE870' }
]

/**
 * Identify Card Network, Bank Name, Card Type (Debit/Credit), and Tier from 8-digit or 6-digit prefix.
 */
export function identifyCardBin(rawInput: string): CardBinInfo {
  const cleaned = rawInput.replace(/\D/g, '')

  // 1. Try exact longest prefix match in dictionary
  if (cleaned.length >= 4) {
    // Sort dictionary by prefix length descending for most specific match (8-digit before 6-digit)
    const sorted = [...BIN_DICTIONARY].sort((a, b) => b.prefix.length - a.prefix.length)
    for (const entry of sorted) {
      if (cleaned.startsWith(entry.prefix)) {
        return {
          network: entry.network,
          cardType: entry.cardType,
          bankName: entry.bankName,
          cardTier: entry.cardTier,
          countryCode: entry.countryCode,
          formattedLabel: `${entry.bankName} ${entry.cardTier}`,
          badgeColor: entry.cardType === 'credit' ? 'bg-indigo-500' : 'bg-emerald-500',
          brandColor: entry.brandColor
        }
      }
    }
  }

  // 2. Fallback to ISO/IEC 7812 Major Industry Identifier (MII) Network Recognition
  let network: CardNetworkType = 'other'
  let cardType: CardInstrumentType = 'debit'
  let defaultBank = 'Bank Umum'
  let defaultTier = 'Standar'

  if (cleaned.startsWith('4')) {
    network = 'visa'
    defaultBank = 'Visa Card'
    defaultTier = cleaned.length >= 6 ? 'Visa Platinum' : 'Visa Classic'
  } else if (/^(5[1-5]|2[2-7])/.test(cleaned)) {
    network = 'mastercard'
    defaultBank = 'Mastercard'
    defaultTier = 'Mastercard World'
  } else if (/^(34|37)/.test(cleaned)) {
    network = 'amex'
    cardType = 'credit'
    defaultBank = 'American Express'
    defaultTier = 'AMEX Express'
  } else if (/^(35)/.test(cleaned)) {
    network = 'jcb'
    cardType = 'credit'
    defaultBank = 'JCB International'
    defaultTier = 'JCB Platinum'
  } else if (/^(6011|65|64[4-9]|622)/.test(cleaned)) {
    network = 'discover'
    cardType = 'credit'
    defaultBank = 'Discover Card'
    defaultTier = 'Discover Global'
  } else if (/^(62|81)/.test(cleaned)) {
    network = 'unionpay'
    defaultBank = 'UnionPay Global'
    defaultTier = 'UnionPay Diamond'
  } else if (/^(1946|5899|60)/.test(cleaned)) {
    network = 'gpn'
    cardType = 'debit'
    defaultBank = 'GPN Nasional'
    defaultTier = 'GPN Chip Debit'
  }

  return {
    network,
    cardType,
    bankName: defaultBank,
    cardTier: defaultTier,
    countryCode: 'GLOBAL',
    formattedLabel: `${defaultBank} • ${network.toUpperCase()}`,
    badgeColor: cardType === 'credit' ? 'bg-indigo-500' : 'bg-emerald-500',
    brandColor: '#4F46E5'
  }
}
