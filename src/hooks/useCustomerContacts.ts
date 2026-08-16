import { useState } from 'react'

export interface CustomerContact {
  id: string
  name: string
  phone: string
  email?: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  kasbonLimit: number
  kasbonBalance: number
  allergens: string[]
  totalOrdersCount: number
  totalSpend: number
  favoriteItems: string[]
  notes?: string
}

export function useCustomerContacts() {
  const [contacts, setContacts] = useState<CustomerContact[]>([
    {
      id: 'CUST-001',
      name: 'Aldi Pratama',
      phone: '6281298765432',
      email: 'aldi@example.com',
      tier: 'gold',
      kasbonLimit: 1000000,
      kasbonBalance: 150000,
      allergens: ['Lactose', 'Nuts'],
      totalOrdersCount: 28,
      totalSpend: 1850000,
      favoriteItems: ['Iced Aren Latte', 'Almond Croissant'],
      notes: 'Suka tempat di pojok, less sugar'
    },
    {
      id: 'CUST-002',
      name: 'Budi Santoso',
      phone: '6281311223344',
      tier: 'silver',
      kasbonLimit: 500000,
      kasbonBalance: 0,
      allergens: [],
      totalOrdersCount: 12,
      totalSpend: 620000,
      favoriteItems: ['Espresso Double'],
      notes: 'Pelanggan rutin pagi hari'
    },
    {
      id: 'CUST-003',
      name: 'Citra Dewi',
      phone: '6281755667788',
      tier: 'platinum',
      kasbonLimit: 2500000,
      kasbonBalance: 450000,
      allergens: ['Gluten'],
      totalOrdersCount: 45,
      totalSpend: 4200000,
      favoriteItems: ['Craft Cold Brew', 'Gluten Free Cake'],
      notes: 'VIP Customer Corporate'
    }
  ])

  const addContact = (newContact: Omit<CustomerContact, 'id'>) => {
    const created: CustomerContact = {
      ...newContact,
      id: `CUST-00${contacts.length + 1}`
    }
    setContacts((prev) => [created, ...prev])
  }

  const updateContact = (id: string, updated: Partial<CustomerContact>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    )
  }

  return { contacts, addContact, updateContact }
}
