import { expect, test, type Page } from '@playwright/test'
import { PosCashierDriver } from './drivers/PosCashierDriver'
import { demoAccess, loginAsCanonicalDemoStaff, resetCanonicalDemoSession } from './helpers/demoSession'

type PostingFixtureMode = 'applied' | 'pending' | 'mismatch' | 'recover'
type ObservedRequest = { url: string; headers: Record<string, string>; body?: Record<string, unknown> }
const flagshipOrderId = 'ORDER-FLAGSHIP-001'
const flagshipPostingId = 'POSTING-FLAGSHIP-001'

async function installPostingFixture(page: Page, mode: PostingFixtureMode): Promise<ObservedRequest[]> {
  const observed: ObservedRequest[] = []
  const orderId = flagshipOrderId
  const postingId = flagshipPostingId
  const sourceToken = 'SOURCE-TOKEN-FLAGSHIP-001'
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

    if (url.endsWith('/pos/orders')) {
      await route.fulfill({ status: 201, json: {
        id: orderId,
        company_book_id: demoAccess.bookId,
        content_sha256: sourceToken,
        status: 'Draft',
        subtotal_minor: '86000',
        tax_amount_minor: '0',
        discount_amount_minor: '0',
        final_total_minor: '86000',
        functional_currency: 'IDR',
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
          : { order_id: orderId, posting_id: postingId, finality: 'applied' },
      })
    } else if (url.endsWith(`/pos/orders/${orderId}`)) {
      await route.fulfill({ status: 200, json: {
        id: orderId,
        company_book_id: demoAccess.bookId,
        created_at: '2026-08-25T00:00:00.000Z',
        status: 'posted',
        posting_id: postingId,
      } })
    } else if (url.endsWith(`/postings/${postingId}`)) {
      postingReads += 1
      if (mode === 'recover' && postingReads === 1) {
        await route.abort('connectionreset')
        return
      }
      const postRequest = observed.find(({ url: observedUrl }) => observedUrl.endsWith(`/pos/orders/${orderId}/post`))
      await route.fulfill({ status: 200, json: {
        id: mode === 'mismatch' ? 'POSTING-DIFFERENT' : postingId,
        book_id: 'ACCOUNTING-BOOK-FLAGSHIP-001',
        posting_time: '2026-08-25T00:00:01.000Z',
        finality: 'applied',
        source_capability: 'pos_order',
        source_object_id: mode === 'mismatch' ? 'ORDER-DIFFERENT' : orderId,
        stable_effect_key: postRequest?.headers['idempotency-key'],
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
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders/ORDER-FLAGSHIP-001/submit`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders/ORDER-FLAGSHIP-001/post`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/postings/POSTING-FLAGSHIP-001`,
    ])
    const mutationCalls = observed.slice(0, 3)
    const rootKey = mutationCalls[0].headers['idempotency-key'].replace(/:process$/, '')
    expect(mutationCalls.map(({ headers }) => headers['idempotency-key'])).toEqual([
      `${rootKey}:process`,
      `${rootKey}:submit`,
      `${rootKey}:post`,
    ])
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
    expect(urls.filter((url) => url.endsWith('/submit'))).toHaveLength(1)
    expect(urls.filter((url) => url.endsWith('/post'))).toHaveLength(1)
    expect(urls).toEqual([
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders/${flagshipOrderId}/submit`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders/${flagshipOrderId}/post`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/postings/${flagshipPostingId}`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/pos/orders/${flagshipOrderId}`,
      `http://localhost:8080/v1/company-books/${demoAccess.bookId}/postings/${flagshipPostingId}`,
    ])
  })
})
