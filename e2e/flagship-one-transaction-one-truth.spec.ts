import { expect, test, type Page } from '@playwright/test'
import { PosCashierDriver } from './drivers/PosCashierDriver'
import { generateDynamicFlagshipScenario } from './helpers/dynamicScenarioGenerator'
import { demoAccess, loginAsCanonicalDemoStaff, resetCanonicalDemoSession } from './helpers/demoSession'

type PostingFixtureMode = 'applied' | 'pending' | 'mismatch'
type ObservedRequest = { url: string; headers: Record<string, string>; body?: Record<string, unknown> }

async function installPostingFixture(page: Page, mode: PostingFixtureMode): Promise<ObservedRequest[]> {
  const observed: ObservedRequest[] = []
  const orderId = 'ORDER-FLAGSHIP-001'
  const postingId = 'POSTING-FLAGSHIP-001'
  const sourceToken = 'SOURCE-TOKEN-FLAGSHIP-001'

  await page.route('http://localhost:8080/v1/company-books/**', async (route) => {
    const request = route.request()
    const url = request.url()
    if (url.endsWith('/auth/employee-login')) {
      await route.fulfill({ status: 200, json: {
        token: 'local-controlled-e2e-token',
        user: {
          user_id: demoAccess.staff.id,
          name: demoAccess.staff.name,
          role: demoAccess.staff.role,
          branch_id: demoAccess.branchId,
          authority_context_id: demoAccess.authorityContextId,
          token: 'local-controlled-e2e-token',
        },
      } })
      return
    }

    observed.push({
      url,
      headers: request.headers(),
      body: request.postData() ? request.postDataJSON() : undefined,
    })

    if (url.endsWith('/pos/orders')) {
      await route.fulfill({ status: 201, json: {
        id: orderId,
        company_book_id: demoAccess.bookId,
        content_sha256: sourceToken,
        status: 'Draft',
        items: [],
      } })
    } else if (url.endsWith(`/pos/orders/${orderId}/submit`)) {
      await route.fulfill({ status: 200, json: {
        id: orderId,
        company_book_id: demoAccess.bookId,
        content_sha256: sourceToken,
        status: 'Submitted',
        items: [],
      } })
    } else if (url.endsWith(`/pos/orders/${orderId}/post`)) {
      await route.fulfill({
        status: mode === 'pending' ? 202 : 200,
        json: mode === 'pending'
          ? { order_id: orderId, status: 'Pending' }
          : { order_id: orderId, posting_id: postingId, finality: 'Applied' },
      })
    } else if (url.endsWith(`/postings/${postingId}`)) {
      await route.fulfill({ status: 200, json: {
        id: mode === 'mismatch' ? 'POSTING-DIFFERENT' : postingId,
        book_id: demoAccess.bookId,
        finality: 'Applied',
        source_capability: 'pos.order',
        source_object_id: mode === 'mismatch' ? 'ORDER-DIFFERENT' : orderId,
        stable_effect_key: observed[0].headers['idempotency-key'],
      } })
    } else {
      await route.abort('failed')
    }
  })

  return observed
}

async function openCanonicalCashier(page: Page, mode: PostingFixtureMode) {
  const observed = await installPostingFixture(page, mode)
  await resetCanonicalDemoSession(page)
  await loginAsCanonicalDemoStaff(page)
  const driver = new PosCashierDriver(page)
  await driver.navigateToCashierPos()
  return { driver, observed }
}

const cashScenario = {
  ...generateDynamicFlagshipScenario(20260824),
  paymentChannel: 'cash_exact' as const,
}

test.describe('Flagship café: one transaction, one durable CORE truth', () => {
  test('posts through generated SDK operations and accepts only exact Applied read-back', async ({ page }) => {
    const { driver, observed } = await openCanonicalCashier(page, 'applied')

    await driver.processSettlement(cashScenario)
    await driver.verifySettlementSuccess(cashScenario.tableNumber)

    expect(observed.map(({ url }) => url)).toEqual([
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders/ORDER-FLAGSHIP-001/submit`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders/ORDER-FLAGSHIP-001/post`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/postings/POSTING-FLAGSHIP-001`,
    ])
    const mutationCalls = observed.slice(0, 3)
    expect(new Set(mutationCalls.map(({ headers }) => headers['idempotency-key'])).size).toBe(1)
    for (const { headers } of mutationCalls) {
      expect(headers['x-cbook-authority-context']).toBe(demoAccess.authorityContextId)
    }
    expect(observed[0].body).toMatchObject({ payment_method: 'cash' })
    expect(observed[1].body).toMatchObject({
      handover: { control_transferred: true },
    })
    expect(observed[2].body).toEqual({ expected_source_token: 'SOURCE-TOKEN-FLAGSHIP-001' })
  })

  test('keeps settlement pending when CORE accepts posting asynchronously', async ({ page }) => {
    const { driver, observed } = await openCanonicalCashier(page, 'pending')

    await driver.processSettlement(cashScenario)

    await expect(page.locator('[data-financial-status="pending"]')).toBeVisible()
    expect(observed).toHaveLength(3)
    await expect(page.getByText('(Lunas)')).toHaveCount(0)
  })

  test('keeps settlement failed when durable posting lineage mismatches', async ({ page }) => {
    const { driver, observed } = await openCanonicalCashier(page, 'mismatch')

    await driver.processSettlement(cashScenario)

    await expect(page.locator('[data-financial-status="error"]')).toBeVisible()
    expect(observed).toHaveLength(4)
    await expect(page.getByText('(Lunas)')).toHaveCount(0)
  })
})
