import { Page } from '@playwright/test'

export async function switchPillar(page: Page, pillar: 'customer' | 'cafe' | 'landing' | 'customer-portal') {
  await page.goto(`/?app=${pillar}`)
}

export async function switchStaffRole(page: Page, role: 'barista-pos' | 'kds-screen' | 'hfe-insights' | 'branch-mgmt') {
  await page.goto(`/?app=cafe&surface=${role}`)
}
