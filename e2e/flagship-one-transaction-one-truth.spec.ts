import { expect, test, type Page } from '@playwright/test'
import { PosCashierDriver } from './drivers/PosCashierDriver'
import { demoAccess, loginAsCanonicalDemoStaff, resetCanonicalDemoSession } from './helpers/demoSession'

type PostingFixtureMode = 'applied' | 'pending' | 'mismatch' | 'recover'
type ObservedRequest = { url: string; headers: Record<string, string>; body?: Record<string, unknown> }
const flagshipOrderId = 'ORDER-FLAGSHIP-001'
const flagshipPostingId = 'POSTING-FLAGSHIP-001'
const flagshipTenderId = 'TENDER-FLAGSHIP-001'

async function installPostingFixture(page: Page, mode: PostingFixtureMode): Promise<ObservedRequest[]> {
  const observed: ObservedRequest[] = []
  const orderId = flagshipOrderId
  const postingId = flagshipPostingId
  const tenderId = flagshipTenderId
  let postingReads = 0

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

    if (url.endsWith('/pos/sale-quotes')) {
      await route.fulfill({ status: 201, json: {
        quote_id: 'QUOTE-FLAGSHIP-001',
        revision: '1',
        digest_sha256: 'f'.repeat(64),
        preset_id: 'PRESET-CAFE-HQ',
        preset_version: '1',
        currency: 'IDR',
        subtotal_minor: '86000',
        amount_due_minor: '86000',
        discount_total_minor: '0',
        tax_total_minor: '0',
        service_charge_total_minor: '0',
        tip_total_minor: '0',
        rounding_total_minor: '0',
        expires_at: '2099-01-01T00:00:00.000Z',
        lines: [],
        tender_eligibility: [{ tender_type: 'cash', eligible: true }, { tender_type: 'qris', eligible: true }],
      } })
    } else if (url.endsWith('/order/accepted-orders')) {
      await route.fulfill({ status: 201, json: {
        acceptance_idempotency_key: `${orderId}:accept`,
        accepted_at: '2026-08-25T00:00:00.000Z',
        order_id: orderId,
        quote: {
          quote_id: 'QUOTE-FLAGSHIP-001',
          revision: '1',
          digest_sha256: 'f'.repeat(64),
          currency: 'IDR',
          amount_due_minor: '86000',
          preset_id: 'PRESET-CAFE-HQ',
          preset_version: '1',
        },
        tender: {
          acceptance_effect_key: 'e'.repeat(64),
          amount_minor: '86000',
          tender_id: tenderId,
          tender_type: 'cash',
        },
      } })
    } else if (url.includes('/pos/tenders/') && url.endsWith('/confirm-cash')) {
      if (mode === 'pending') {
        await route.fulfill({ status: 202, json: { status: 'pending', order_id: orderId, tender_id: tenderId } })
      } else {
        await route.fulfill({ status: 200, json: {
          status: 'posted',
          posting_id: postingId,
          order_id: orderId,
          tender_id: tenderId,
        } })
      }
    } else if (url.endsWith(`/pos/tenders/${tenderId}/outcome`)) {
      await route.fulfill({ status: 200, json: {
        tender_id: tenderId,
        order_id: orderId,
        amount_minor: '86000',
        currency: 'IDR',
        accepted_tender_effect_key: 'e'.repeat(64),
        outcome: 'applied',
        posting_id: postingId,
      } })
    } else if (url.endsWith(`/postings/${postingId}`)) {
      postingReads += 1
      if (mode === 'recover' && postingReads === 1) {
        await route.abort('connectionreset')
        return
      }
      await route.fulfill({ status: 200, json: {
        id: mode === 'mismatch' ? 'POSTING-DIFFERENT' : postingId,
        posting_id: mode === 'mismatch' ? 'POSTING-DIFFERENT' : postingId,
        book_id: demoAccess.bookId,
        finality: 'applied',
        source_capability: 'pos_tender_sale',
        source_object_id: mode === 'mismatch' ? 'TENDER-DIFFERENT' : tenderId,
        stable_effect_key: 'e'.repeat(64),
        functional_currency: 'IDR',
        lines: [
          { account_id: '1101', debit_minor: '86000', credit_minor: '0' },
          { account_id: '4101', debit_minor: '0', credit_minor: '86000' },
        ],
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
  tableNumber: 'OUT-04',
  paymentChannel: 'cash_exact' as const,
} as const

test.describe('Flagship café: one transaction, one durable CORE truth', () => {
  test('posts through generated SDK operations and accepts only exact applied read-back', async ({ page }) => {
    const { driver, observed } = await openCanonicalCashier(page, 'applied')

    await driver.selectOccupiedTable(cashScenario.tableNumber)
    await driver.processSettlement(cashScenario)
    await driver.verifySettlementSuccess(cashScenario.tableNumber)
    await expect(page.getByRole('link', { name: 'Buka Buku' })).toHaveAttribute(
      'href',
      `http://localhost:8081/app/accounting/company-books/${demoAccess.bookId}/postings/${flagshipPostingId}?orderId=${flagshipOrderId}&organizationId=${demoAccess.organizationId}`,
    )

    expect(observed.map(({ url }) => url)).toEqual([
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/sale-quotes`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/order/accepted-orders`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/tenders/${flagshipTenderId}/confirm-cash`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/postings/POSTING-FLAGSHIP-001`,
    ])
    const mutationCalls = observed.slice(0, 3)
    const rootKey = mutationCalls[0].headers['idempotency-key'].replace(/:quote$/, '')
    expect(mutationCalls.map(({ headers }) => headers['idempotency-key'])).toEqual([
      `${rootKey}:quote`,
      `${rootKey}:accept`,
      `${rootKey}:confirm`,
    ])
    for (const { headers } of mutationCalls) {
      expect(headers['x-cbook-authority-context']).toBe(demoAccess.authorityContextId)
    }
  })

  test('keeps settlement pending when CORE accepts posting asynchronously', async ({ page }) => {
    const { driver, observed } = await openCanonicalCashier(page, 'pending')

    await driver.selectOccupiedTable(cashScenario.tableNumber)
    await driver.processSettlement(cashScenario)

    await expect.poll(() => observed.length).toBe(3)
    await expect(page.locator('[data-financial-status="pending"]')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Buka Buku' })).toHaveCount(0)
    await expect(page.getByText('(Lunas)')).toHaveCount(0)

    await page.reload()
    const reloadedDriver = new PosCashierDriver(page)
    await reloadedDriver.navigateToCashierPos()
    await reloadedDriver.selectOccupiedTable(cashScenario.tableNumber)
    await reloadedDriver.processSettlement(cashScenario)

    await expect(page.getByText(/Jangan bayar ulang|Do not repay/)).toBeVisible()
    expect(observed).toHaveLength(3)
  })

  test('keeps settlement failed when durable posting lineage mismatches', async ({ page }) => {
    const { driver, observed } = await openCanonicalCashier(page, 'mismatch')

    await driver.selectOccupiedTable(cashScenario.tableNumber)
    await driver.processSettlement(cashScenario)

    await expect(page.locator('[data-financial-status="error"]')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Buka Buku' })).toHaveCount(0)
    expect(observed).toHaveLength(4)
    await expect(page.getByText('(Lunas)')).toHaveCount(0)
  })

  test('reconciles an unknown outcome without submitting or posting a second time', async ({ page }) => {
    const { driver, observed } = await openCanonicalCashier(page, 'recover')

    await driver.selectOccupiedTable(cashScenario.tableNumber)
    await driver.processSettlement(cashScenario)

    await expect(page.locator('[data-financial-status="error"]')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Buka Buku' })).toHaveCount(0)
    await expect(page.getByText('(Lunas)')).toHaveCount(0)
    await page.getByRole('button', { name: 'Periksa hasil yang sama di CORE' }).click()
    await driver.verifySettlementSuccess(cashScenario.tableNumber)

    const urls = observed.map(({ url }) => url)
    expect(urls.filter((url) => url.endsWith('/confirm-cash'))).toHaveLength(2)
    expect(urls).toEqual([
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/sale-quotes`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/order/accepted-orders`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/tenders/${flagshipTenderId}/confirm-cash`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/postings/${flagshipPostingId}`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/sale-quotes`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/order/accepted-orders`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/tenders/${flagshipTenderId}/confirm-cash`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/postings/${flagshipPostingId}`,
    ])
  })

  test('flips the truth channel to LIVE only after the applied read-back chain (#35)', async ({ page }) => {
    const { driver } = await openCanonicalCashier(page, 'applied')

    await driver.selectOccupiedTable(cashScenario.tableNumber)
    await expect(page.getByText(/LIVE •/)).toHaveCount(0) // pre-settlement: channel must stay demo/pending
    await driver.processSettlement(cashScenario)
    await driver.verifySettlementSuccess(cashScenario.tableNumber)

    await expect(page.getByText(/LIVE •/).first()).toBeVisible({ timeout: 10_000 })
  })

  test('keeps the truth channel demo when the durable read-back lineage mismatches (#35)', async ({ page }) => {
    const { driver } = await openCanonicalCashier(page, 'mismatch')

    await driver.selectOccupiedTable(cashScenario.tableNumber)
    await driver.processSettlement(cashScenario)
    await expect(page.locator('[data-financial-status="error"]')).toBeVisible()

    await expect(page.getByText(/🧪/).first()).toBeVisible()
    await expect(page.getByText(/LIVE •/)).toHaveCount(0)
  })
})
