# Issue 101 CORE Authority Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the connected flagship cafe consume one authoritative Hfe CORE flow—catalog reference, reviewed quote, exact acceptance, cash or QRIS tender, and durable outcome—without browser-owned monetary or accounting truth.

**Architecture:** Keep UI intent, local device state, and durable retry coordination in HFE POS, while generated `@hfe/sdk` contracts remain the only CORE transport vocabulary. Split quote preparation from order acceptance so the cashier reviews a frozen CORE projection; persist accepted tender evidence and reconcile QRIS through the read-only outcome endpoint without replaying mutations. Catalog adoption is gated on HCB #1019 and must fail closed until a published tenant/book-scoped resolution contract exists.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, generated `@hfe/sdk`, IndexedDB-backed `OfflineIntentQueue`, Hfe CORE REST contracts.

**Spec:** [HFE POS Issue #101](https://github.com/glc-works/hfe-pos/issues/101), `ARCHITECTURE.md`, `DEVELOPMENT.md`, and `docs/active/standards/HFE-OMBOK-STD-001.md`.

## Global Constraints

- Baseline HFE POS authority is `origin/main` `721d2eb52f9ca7f0533cc90b850c968ac1ba413d`; refresh and stop if the implementation branch no longer descends from it without a reviewed rebase.
- SDK provider authority is `glc-works/headless-company-books` `origin/main` `d3f75a337e6318519022769976bf799ad34a3b9b`; its generated `packages/hfe-sdk/src/index.ts` SHA-256 is `1f8095178ecbc8441c80ed1b8e4bad777e488ec9f8d35b4925ff14c6154db9ed`, and `hcb2/openapi.json` SHA-256 is `0b71f54c8af1458b381e9cdc199d98afb0826b1c895becd1ad4f5f4e14a88452`.
- Replace current consumer provenance `6dbe6c9a2aa5dcf2bace856f32cc14e05e788103`; never hand-author a shadow operation or response interface when the generated SDK supplies it.
- The canonical sequence is `calculatePosSaleQuote -> acceptGovernedPosOrder -> confirmGovernedPosCashTender` or authenticated QRIS provider confirmation `-> getGovernedPosTenderOutcome`.
- `processPosRetailOrder` is compatibility-only and must not appear in the connected flagship path.
- Connected mode never owns unit price, discount result, tax, service charge, rounding, total due, GL/account identity, cashier principal, provider outcome, or Posting success.
- Mock/demo mode may retain explicit synthetic calculations, but its values must be labeled non-authoritative and must never enter a connected request.
- Exact idempotency keys, quote revision/digest, accepted tender effect key, tender ID, and Posting lineage are evidence—not disposable UI state.
- No production/provider/deployment/secrets, real credentials/data, HCB financial-kernel changes, or fabricated routes are in scope.
- Issue #100 owns its existing `package.json`, `e2e/`, fixture, script, and test changes. Do not edit or overwrite its uncommitted work; coordinate/rebase before the final browser-proof task.
- HCB #1019 is a hard dependency for authoritative catalog/category/item/modifier projection. Do not infer suitability from generic `/items` or the old invented `/products` adapter.
- Run first-party full-file Aikido scanning for every modified or added code file and reach zero findings before delivery.

## State Machine and Authority Model

```text
editing intent
    | persist attempt + stable phase keys before network
    | calculatePosSaleQuote (idempotency: <attempt>:quote)
    v
quote_ready ── cashier changes item/tender ──> editing intent (invalidate quote)
    | cashier explicitly reviews exact quote_id/revision/digest/amount_due
    | acceptGovernedPosOrder (idempotency: <attempt>:accept)
    v
accepted
    | cash: confirmGovernedPosCashTender (<attempt>:confirm)
    | qris: display provider intent; provider confirms outside the browser
    v
pending_outcome ── GET tender outcome only; never recreate quote/order/tender ──┐
    | outcome=applied + exact lineage + durable Posting read-back              |
    v                                                                          |
posted ── acknowledge/clear cart                                                |
    ^                                                                          |
    └──────────────────────── resume after timeout/reload ──────────────────────┘
```

`expired`, quote revision/digest mismatch, foreign item/tender, amount/currency mismatch, ambiguous eligibility, failed provider outcome, or Posting lineage mismatch all stop without creating another financial effect.

The attempt is durable before the first quote request. It owns one random
`attemptId` and stable phase keys `<attemptId>:quote`,
`<attemptId>:qris-intent`, `<attemptId>:accept`, and
`<attemptId>:confirm`. A transport retry may repeat the exact same request with
the exact same phase key; it must never mint a new key. “Never recreate” means
never create a second logical quote/order/tender effect, not “never retransmit
an idempotent request after a lost response.”

| Persisted phase when response is lost | Recovery contract |
|---|---|
| `quote_requested` without quote receipt | retransmit the byte-identical quote request with `<attemptId>:quote`; require the same converged quote identity |
| `qris_intent_requested` without provider-intent receipt | retransmit the byte-identical QRIS-intent request with `<attemptId>:qris-intent`; require the same provider intent |
| `accept_requested` without accepted receipt | call generated `getAcceptedPosOrderByIdempotencyKey(book, <attemptId>:accept)`; do not repeat acceptance until a definitive not-found contract is available |
| cash `accepted` / `confirm_requested` without a durably stored confirmation response | retransmit the byte-identical `confirmGovernedPosCashTender` body with the persisted `<attemptId>:confirm` key; require the same converged effect/Posting response and never mint a replacement key |
| cash confirmation response persisted as `pending_dispatch` | observe its returned Posting identity through generated `getPosting`; an exact confirm replay with the same body/key is allowed when the response/effect state is uncertain, but a new confirmation key/body is forbidden |
| QRIS `accepted` or later | call `getGovernedPosTenderOutcome(book, tenderId)`; provider confirmation remains external to the browser |

Every successful phase response is atomically written to IndexedDB before the
UI may advance, close, clear the cart, or report pending/posted. A store-write
failure leaves the UI in a fail-closed operator-action-required state.

## Locked File Map

The implementation is intentionally divided into reviewable fences. Do not broaden it to Retail, Scan-and-Go, Warehouse, split tender, or legacy adapter cleanup.

| Responsibility | Files |
|---|---|
| Generated contract provenance | `packages/hfe-sdk/src/index.ts`, `packages/hfe-sdk/provenance.json`, `package-lock.json` only if the local file dependency records a generated package change |
| Financial domain contracts | `src/services/financial/HfePosFinancialPort.ts` |
| Quote/accept/tender transport | `src/services/financial/GovernedPosCheckout.ts`, `src/services/financial/HfeSdkAdapter.ts`, `src/services/financial/MockHfeAdapter.ts` |
| Durable attempt state | `src/services/financial/CafeCheckoutAttemptCoordinator.ts`, `src/services/financial/OfflineIntentQueue.ts` only if serialization needs the added evidence |
| Connected orchestration | `src/hooks/useCafeSettlement.ts`, `src/config/firstPartyRuntime.ts` |
| Cashier projection | `src/views/UnifiedPosView.tsx`, `src/components/pos/PosCartSection.tsx`, `src/components/pos/PosMobileCartDrawer.tsx`, `src/components/pos/GovernedQrisPendingModal.tsx`, `src/components/pos/FinancialStatusBanner.tsx` |
| Catalog cutover after #1019 | `src/App.tsx`, `src/data/mockData.ts`, `src/data/runtimeDemoData.ts`, plus one new focused `src/services/financial/GovernedPosCatalog.ts` |
| Architecture truth | `ARCHITECTURE.md` |
| Unit/component proof | `src/tests/hfeSdkPosOrderPosting.test.ts`, `src/tests/hfeSdkGovernedQris.test.ts`, `src/tests/cafeCheckoutAttemptCoordinator.test.ts`, `src/tests/governedCafeCheckoutPayload.test.ts`, `src/tests/firstPartyIdentityBridge.test.ts`, and new focused tests named below |
| Browser proof | A new Issue #101-owned spec only after coordination with #100; do not modify #100 files in parallel |

---

### Task 1: Repin the Generated HCB SDK and Prove Provenance

**Files:**
- Modify: `packages/hfe-sdk/src/index.ts`
- Modify: `packages/hfe-sdk/provenance.json`
- Modify only if changed by the repository-native install: `package-lock.json`
- Test: `src/tests/hfeSdkGovernedQris.test.ts`

**Interfaces:**
- Consumes: provider-generated `HfeClient.operations.getGovernedPosTenderOutcome({ path: { book, tender_id } })` and `GovernedPosTenderOutcomeResponse`.
- Produces: a compiled, provenance-verified SDK exposing the exact upstream response fields `accepted_tender_effect_key`, `amount_minor`, `currency`, `order_id`, `outcome`, optional Posting/provider evidence, and `tender_id`.

- [ ] **Step 1: Verify exact provider input before copying generated artifacts**

Run:

```bash
HFE_CORE_CHECKOUT="${HFE_CORE_CHECKOUT:?set HFE_CORE_CHECKOUT to a headless-company-books checkout}"
git -C "$HFE_CORE_CHECKOUT" fetch --prune origin
test "$(git -C "$HFE_CORE_CHECKOUT" rev-parse origin/main)" = d3f75a337e6318519022769976bf799ad34a3b9b
git -C "$HFE_CORE_CHECKOUT" show origin/main:packages/hfe-sdk/src/index.ts | shasum -a 256
git -C "$HFE_CORE_CHECKOUT" show origin/main:hcb2/openapi.json | shasum -a 256
```

Expected: the exact hashes in Global Constraints. If either differs, stop and update this plan/provenance through review rather than silently pinning a moving provider.

- [ ] **Step 2: Write the failing generated-contract test**

Add a test that type-checks and invokes the generated operation, without defining a local response type:

```ts
it('exposes the generated governed tender outcome operation', async () => {
  const fetchMock = vi.fn().mockResolvedValue(response(200, {
    accepted_tender_effect_key: 'e'.repeat(64),
    amount_minor: '30800', currency: 'IDR', order_id: 'ORDER-1',
    outcome: 'pending', posting_finality: null, posting_id: null,
    posting_source_capability: null, posting_source_object_id: null,
    posting_stable_effect_key: null, provider_event_id: null,
    provider_event_receipt_id: null, provider_occurred_at: null,
    tender_id: 'TENDER-1',
  }))
  vi.stubGlobal('fetch', fetchMock)
  const client = new HfeClient({ baseUrl: 'http://localhost:8080' })
  const result = await client.operations.getGovernedPosTenderOutcome({
    path: { book: 'BOOK-1', tender_id: 'TENDER-1' },
  })
  expect(result.body).toMatchObject({ tender_id: 'TENDER-1', outcome: 'pending' })
})
```

- [ ] **Step 3: Run the focused test and prove it is red for the missing operation**

Run: `npx vitest run src/tests/hfeSdkGovernedQris.test.ts`

Expected: TypeScript/test failure because the currently pinned SDK has no `getGovernedPosTenderOutcome`.

- [ ] **Step 4: Replace the SDK only from the verified provider artifact and write exact provenance**

Copy the provider-generated package content without editing generated TypeScript by hand. Set `packages/hfe-sdk/provenance.json` to the verified source commit and digest:

```json
{
  "source_repo": "glc-works/headless-company-books",
  "source_commit": "d3f75a337e6318519022769976bf799ad34a3b9b",
  "source_path": "packages/hfe-sdk",
  "contract_version": "2.1.0",
  "synced_at": "2026-08-28T00:00:00Z",
  "digest_sha256": "1f8095178ecbc8441c80ed1b8e4bad777e488ec9f8d35b4925ff14c6154db9ed",
  "openapi_digest_sha256": "0b71f54c8af1458b381e9cdc199d98afb0826b1c895becd1ad4f5f4e14a88452"
}
```

The shown timestamp is the plan-day example, not a value to copy blindly. Immediately before writing the file, run `date -u +%Y-%m-%dT%H:%M:%SZ` and replace that example with the command's exact output; do not reuse the prior provenance timestamp.

- [ ] **Step 5: Compile and run the contract proof**

Run:

```bash
npm run build:sdk
npx vitest run src/tests/hfeSdkGovernedQris.test.ts
git diff --check
```

Expected: all pass and generated code contains exactly one `getGovernedPosTenderOutcome` operation.

- [ ] **Step 6: Commit the isolated provenance unit**

```bash
git add packages/hfe-sdk/src/index.ts packages/hfe-sdk/provenance.json package-lock.json src/tests/hfeSdkGovernedQris.test.ts
git commit -m "chore: repin governed POS outcome SDK"
```

Omit `package-lock.json` from staging when it is unchanged.

### Task 2: Split Quote Preparation from Acceptance

**Files:**
- Modify: `src/services/financial/HfePosFinancialPort.ts`
- Modify: `src/services/financial/GovernedPosCheckout.ts`
- Modify: `src/services/financial/HfeSdkAdapter.ts`
- Modify: `src/services/financial/MockHfeAdapter.ts`
- Create: `src/tests/governedPosQuoteReview.test.ts`
- Modify: `src/tests/hfeSdkPosOrderPosting.test.ts`
- Modify: `src/tests/governedCafeCheckoutPayload.test.ts`

**Interfaces:**
- Consumes: `GovernedRetailCheckoutPayload`, `RetailPostingContext`, generated `PosSaleQuoteView`, and the existing idempotency lineage.
- Produces:

```ts
export type GovernedTenderType = 'cash' | 'qris'
export type ExactMinorString = string

export interface ReviewedPosQuote {
  quoteId: string
  revision: string
  digestSha256: string
  currency: string
  subtotalMinor: ExactMinorString
  amountDueMinor: ExactMinorString
  discountTotalMinor: ExactMinorString
  taxTotalMinor: ExactMinorString
  serviceChargeTotalMinor: ExactMinorString
  tipTotalMinor: ExactMinorString
  roundingTotalMinor: ExactMinorString
  presetId: string
  presetVersion: string
  lines: Array<{
    ordinal: number
    itemId: string
    quantity: string
    modifierIds: string[]
    discountAllocatedMinor: ExactMinorString
  }>
  expiresAt: string
  tenderEligibility: Array<{ tenderType: GovernedTenderType; eligible: boolean; reasonCode?: string }>
  source: 'hfe-core'
}

export interface GovernedAcceptedTenderEvidence {
  orderId: string
  acceptedAt: string
  tenderId: string
  acceptanceEffectKey: string
  tenderType: GovernedTenderType
  amountMinor: ExactMinorString
  quote: Pick<ReviewedPosQuote, 'quoteId' | 'revision' | 'digestSha256' | 'currency' | 'amountDueMinor' | 'presetId' | 'presetVersion'>
}

prepareGovernedRetailQuote(
  payload: GovernedRetailCheckoutPayload,
  context: RetailPostingContext,
): Promise<ReviewedPosQuote>

acceptGovernedRetailQuote(
  payload: GovernedRetailCheckoutPayload,
  reviewed: ReviewedPosQuote,
  context: RetailPostingContext,
): Promise<GovernedAcceptedTenderEvidence>
```

- [ ] **Step 1: Write red tests for quote-only behavior**

Assert that `prepareGovernedRetailQuote` performs one `calculatePosSaleQuote` call, returns exact CORE totals/revision/digest/eligibility, and never calls accept, QRIS generation, cash confirmation, or Posting reads.

```ts
expect(fetchMock).toHaveBeenCalledTimes(1)
expect(result).toMatchObject({
  quoteId: 'QUOTE-1', revision: '3', digestSha256: 'd'.repeat(64),
  currency: 'IDR', subtotalMinor: '28000', discountTotalMinor: '0',
  taxTotalMinor: '2800', serviceChargeTotalMinor: '0', tipTotalMinor: '0',
  roundingTotalMinor: '0', amountDueMinor: '30800',
  presetId: 'PRESET-1', presetVersion: '4', source: 'hfe-core',
})
```

Also assert rejection for noncanonical or negative decimal money strings,
missing/ambiguous tender eligibility, expired quote, and response currency
differing from the requested validation echo.

- [ ] **Step 2: Run focused tests to prove the new interface is absent**

Run: `npx vitest run src/tests/governedPosQuoteReview.test.ts src/tests/hfeSdkPosOrderPosting.test.ts src/tests/governedCafeCheckoutPayload.test.ts`

Expected: compile/test failure for missing quote preparation interfaces.

- [ ] **Step 3: Implement the minimal quote projection**

Move only quote validation and generated `calculatePosSaleQuote` invocation out of `postGovernedPosCheckout`. Project every field of generated `PosSaleQuoteView`, including its line-level discount allocation and preset lineage; no component may be reconstructed later. Preserve monetary values byte-exact as canonical decimal strings and validate them without converting to `number`:

```ts
function exactMinor(value: string, field: string): ExactMinorString {
  if (!/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new Error(`CORE ${field} is not a canonical non-negative minor-unit string.`)
  }
  return value
}
```

Use `BigInt(value)` only in a presentation helper for comparison, change, and
locale formatting. Never persist the `bigint`, convert it to `number`, emit
exponential notation, or serialize a reformatted value back to CORE.

Do not calculate tax, service charge, discount, rounding, or totals from lines. Project only generated response values.

- [ ] **Step 4: Implement exact reviewed-quote acceptance**

Before `acceptGovernedPosOrder`, reject when the reviewed quote is expired, has a different currency, lacks exactly one eligible selected tender, or its identity fields are blank. Pass only:

```ts
body: {
  quote_digest_sha256: reviewed.digestSha256,
  quote_id: reviewed.quoteId,
  quote_revision: reviewed.revision as Int64String,
  tender: {
    amount_minor: reviewed.amountDueMinor,
    tender_type: payload.payment_method,
    ...(providerIntentReference ? { provider_intent_reference: providerIntentReference } : {}),
  },
}
```

Cash confirmation remains after acceptance. QRIS returns pending evidence. Delete the one-call `postGovernedPosCheckout` use from the connected adapter; a compatibility wrapper may remain only for mock tests and must call `prepare` then `accept` explicitly.

- [ ] **Step 5: Prove no caller-owned money or GL entered the contract**

Run:

```bash
npx vitest run src/tests/governedPosQuoteReview.test.ts src/tests/hfeSdkPosOrderPosting.test.ts src/tests/governedCafeCheckoutPayload.test.ts
npm run check:truth-boundary
npm run typecheck
```

Expected: pass; serialized governed request contains item identity, quantity, modifiers, promotion selection, governed context, and reviewed quote evidence only.

- [ ] **Step 6: Commit the transport boundary**

```bash
git add src/services/financial/HfePosFinancialPort.ts src/services/financial/GovernedPosCheckout.ts src/services/financial/HfeSdkAdapter.ts src/services/financial/MockHfeAdapter.ts src/tests/governedPosQuoteReview.test.ts src/tests/hfeSdkPosOrderPosting.test.ts src/tests/governedCafeCheckoutPayload.test.ts
git commit -m "feat: require reviewed CORE quote before acceptance"
```

### Task 3: Drive Cashier Totals and Tender Choices from the Reviewed Quote

**Files:**
- Modify: `src/hooks/useCafeSettlement.ts`
- Modify: `src/views/UnifiedPosView.tsx`
- Modify: `src/components/pos/PosCartSection.tsx`
- Modify: `src/components/pos/PosMobileCartDrawer.tsx`
- Create: `src/tests/governedQuoteCashierProjection.test.tsx`
- Modify: `src/tests/financialStatusBanner.test.tsx`

**Interfaces:**
- Consumes: `ReviewedPosQuote`, `prepareGovernedRetailQuote`, and `acceptGovernedRetailQuote` from Task 2.
- Produces:

```ts
export type GovernedCheckoutPhase =
  | { kind: 'editing' }
  | { kind: 'quoting' }
  | { kind: 'review'; quote: ReviewedPosQuote; payloadFingerprint: string }
  | { kind: 'accepting'; quote: ReviewedPosQuote }
  | { kind: 'pending_outcome'; quote: ReviewedPosQuote; tenderId: string }
  | { kind: 'posted'; postingId: string }
  | { kind: 'failed'; message: string }

requestQuote(): Promise<void>
acceptReviewedQuote(): Promise<void>
invalidateQuote(): void
```

- [ ] **Step 1: Write component tests that expose the competing browser truth**

Render connected `PosCartSection` with browser total `33_000` and reviewed CORE quote `30_800`. Assert the connected presentation uses `30_800`, includes CORE source/revision, and does not render `33_000` as payable. Assert card is absent or disabled with an honest localized reason when eligibility contains only cash/QRIS.

```ts
expect(screen.getByTestId('authoritative-amount-due')).toHaveTextContent('30.800')
expect(screen.queryByText('33.000')).not.toBeInTheDocument()
expect(screen.getByRole('button', { name: /kartu/i })).toBeDisabled()
```

Assert exact-cash and denomination callbacks receive `quote.amountDueMinor`, not `grandTotal`.

- [ ] **Step 2: Run the projection tests and verify red**

Run: `npx vitest run src/tests/governedQuoteCashierProjection.test.tsx src/tests/financialStatusBanner.test.tsx`

Expected: failure because connected UI has no reviewed quote state and still exposes card.

- [ ] **Step 3: Add the explicit quote-before-accept hook state machine**

`handleCheckout` must request a quote on the first operator action. Only `acceptReviewedQuote` may invoke financial mutation after the review state is visible. Any item, modifier, quantity, promotion, outlet, terminal, currency validation echo, or tender change calls `invalidateQuote` and returns to `editing`.

The payload fingerprint used for review must be the same canonical checksum input used by `CafeCheckoutAttemptCoordinator`; acceptance must fail before network mutation if it differs.

When the operator changes intent while the durable attempt is still strictly
pre-accept, atomically mark that attempt retired (or remove it through a
store operation that asserts its phase is pre-accept) before creating the next
attempt and fingerprint. Never retire, overwrite, or reuse an attempt at
`accept_requested`, `accepted`, `confirm_requested`, `pending_outcome`, or
`posted`; those require the recovery table or explicit acknowledgement.

- [ ] **Step 4: Project authoritative totals and supported tenders**

At application startup, resolve `VITE_HFE_RUNTIME_MODE` through one exhaustive
parser that accepts only `connected` or `synthetic`. A missing, blank, or
unrecognized mode is a fatal configuration error before rendering or network
access. `isConnectedFirstPartyRuntime()` must delegate to that parser; no
caller may interpret an invalid mode as disconnected. Tests and local launch
scripts must set `synthetic` explicitly rather than depending on absence.

In connected mode:

- render CORE amount, discount, tax/service/rounding fields only when present in the generated quote contract;
- never reconstruct a missing component from subtotal arithmetic;
- use a `BigInt` presentation projection of the quote amount for exact cash,
  denomination presets, cash-given validation, and change while retaining the
  exact source string as durable/network evidence;
- enable a tender only when exactly one quote eligibility row for that tender is `eligible: true`;
- hide or disable card/credit/debit until CORE publishes a governed contract;
- retain existing local calculation presentation only when `!isConnectedFirstPartyRuntime()` and label it simulation/non-authoritative.

- [ ] **Step 5: Verify changed-intent invalidation and no premature acceptance**

Add assertions that item quantity and tender changes invalidate the quote, double-click quote requests are coalesced, and no acceptance request occurs before the explicit review CTA.

Run:

```bash
npx vitest run src/tests/governedQuoteCashierProjection.test.tsx src/tests/governedCafeCheckoutPayload.test.ts src/tests/cafeCheckoutAttemptCoordinator.test.ts
npm run typecheck
```

Expected: pass with zero accept calls during quote preparation.

- [ ] **Step 6: Commit the connected cashier projection**

```bash
git add src/hooks/useCafeSettlement.ts src/views/UnifiedPosView.tsx src/components/pos/PosCartSection.tsx src/components/pos/PosMobileCartDrawer.tsx src/tests/governedQuoteCashierProjection.test.tsx src/tests/financialStatusBanner.test.tsx
git commit -m "feat: project reviewed CORE quote in cashier flow"
```

### Task 4: Reconcile QRIS Through the Read-Only Outcome Contract

**Files:**
- Modify: `src/services/financial/HfePosFinancialPort.ts`
- Modify: `src/services/financial/GovernedPosCheckout.ts`
- Modify: `src/services/financial/HfeSdkAdapter.ts`
- Modify: `src/services/financial/MockHfeAdapter.ts`
- Modify: `src/services/financial/CafeCheckoutAttemptCoordinator.ts`
- Modify only if added evidence is not currently serialized: `src/services/financial/OfflineIntentQueue.ts`
- Modify: `src/hooks/useCafeSettlement.ts`
- Modify: `src/components/pos/GovernedQrisPendingModal.tsx`
- Modify: `src/components/pos/FinancialStatusBanner.tsx`
- Modify: `src/tests/hfeSdkGovernedQris.test.ts`
- Modify: `src/tests/cafeCheckoutAttemptCoordinator.test.ts`
- Modify: `src/tests/governedQrisPendingModal.test.tsx`

**Interfaces:**
- Consumes: generated `GovernedPosTenderOutcomeResponse`, persisted accepted tender evidence, and `HfePostingReadbackValidator`.
- Produces:

```ts
export interface GovernedTenderOutcomeQuery {
  orderId: string
  tenderId: string
  acceptedTenderEffectKey: string
  amountMinor: ExactMinorString
  currency: string
}

reconcileGovernedTenderOutcome(
  query: GovernedTenderOutcomeQuery,
  context: RetailPostingContext,
): Promise<SubmitRetailTransactionResponse>
```

- [ ] **Step 1: Replace the old fail-closed test with red outcome cases**

Cover:

- `pending` returns pending with no mutation request;
- the persisted `bookId` selects the request path; `applied` requires exact
  returned order/tender/amount/currency/effect key (the generated outcome body
  has no book field), followed by book-scoped Posting read-back;
- applied also requires `posting_id`, `posting_finality === 'applied'`, `posting_source_capability === 'pos_tender_sale'`, `posting_source_object_id === tenderId`, and stable effect-key agreement;
- `failed` remains failed and never commits paid state;
- mismatches and ambiguous outcomes throw before UI acknowledgement;
- network timeout leaves the attempt resumable with the same evidence;
- repeated QRIS resume performs GET outcome/read-back only and never quote,
  QRIS generation, accept, or confirm;
- repeated cash recovery may retransmit only the byte-identical confirmation
  with the persisted confirm key; it never re-quotes, re-accepts, or changes
  tender/effect evidence.

```ts
expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
  expect.stringContaining(`/pos/tenders/${tenderId}/outcome`),
  expect.stringContaining(`/postings/${postingId}`),
])
```

- [ ] **Step 2: Run the focused tests and prove red**

Run: `npx vitest run src/tests/hfeSdkGovernedQris.test.ts src/tests/cafeCheckoutAttemptCoordinator.test.ts src/tests/governedQrisPendingModal.test.tsx`

Expected: the existing “outcome contract unavailable” behavior fails the new expectations.

- [ ] **Step 3: Persist sufficient accepted evidence**

Create and persist the attempt, payload fingerprint, and all phase keys before
the quote request. After acceptance, atomically store the exact generated
`AcceptedOrderReceipt` projection—`orderId`, `acceptedAt`, `tenderId`,
`acceptedTenderEffectKey`, exact `amountMinor`, `currency`, quote identity, and
QRIS intent receipt—before returning `pending` or exposing a closable modal. Do
not store a browser-computed monetary snapshot. Preserve the same attempt
identity across close, reload, and resume.

- [ ] **Step 4: Implement read-only reconciliation and exact durable validation**

For QRIS, call `getGovernedPosTenderOutcome` with only book and tender ID.
Compare every returned identity/value—including order ID, amount, and
currency—against persisted accepted evidence. For `applied`, independently
call `getPosting` and pass exact expected book/source/effect and currency into
`HfePostingReadbackValidator`. The generic Posting contract has neither order
ID nor a top-level tender total: order and exact amount are therefore proven by
the governed tender outcome, while Posting lineage is proven by
`source_object_id === tenderId`. The Posting validator must compare
`functional_currency` exactly and validate positive, balanced journal lines
with exact `BigInt` arithmetic; it must not invent a tender total from arbitrary
journal-line semantics or coerce values through JavaScript `number`. Add
independent mismatch tests for outcome order, outcome amount, outcome currency,
and Posting currency, plus unbalanced/non-positive Posting lines. Return
`posted` only after both outcome and Posting checks pass.

Do not call `postGovernedRetailOrder` from `reconcileGovernedTenderOutcome`.
Replace the adapter's existing `reconcileGovernedRetailOrder` surface and every
connected caller with `reconcileGovernedTenderOutcome`; the new implementation
must not delegate to `postGovernedRetailOrder` for cash or QRIS.
Recover a lost acceptance response with generated
`getAcceptedPosOrderByIdempotencyKey` and the stable accept key. Once an
accepted receipt exists, QRIS unknown outcomes use
`getGovernedPosTenderOutcome` with the stored tender ID. That endpoint is
QRIS-only and cannot create or resolve a missing cash confirmation. Cash
response loss must replay the exact `confirmGovernedPosCashTender` request with
the stored body and `<attemptId>:confirm` key, then validate the converged
Posting response/read-back. Never recreate the order, alter confirmation
evidence, or mint a replacement phase key.

- [ ] **Step 5: Wire operator-controlled resume**

The QRIS modal and financial banner expose a localized “Check payment status” action. Closing the modal does not discard the attempt. Pending and unknown results stay resumable; only applied + validated Posting calls `commitPaidState`, clears the cart, and acknowledges the attempt.

- [ ] **Step 6: Run the stateful regression group**

Run:

```bash
npx vitest run src/tests/hfeSdkGovernedQris.test.ts src/tests/cafeCheckoutAttemptCoordinator.test.ts src/tests/governedQrisPendingModal.test.tsx src/tests/hfeSdkPosOrderPosting.test.ts
npm run check:truth-boundary
npm run typecheck
```

Expected: all pass; QRIS resume tests observe zero mutation calls, while cash
response-loss tests observe only byte-identical confirmation replay with one
stable confirm key/effect.

- [ ] **Step 7: Commit QRIS outcome recovery**

```bash
git add src/services/financial/HfePosFinancialPort.ts src/services/financial/GovernedPosCheckout.ts src/services/financial/HfeSdkAdapter.ts src/services/financial/MockHfeAdapter.ts src/services/financial/CafeCheckoutAttemptCoordinator.ts src/services/financial/OfflineIntentQueue.ts src/hooks/useCafeSettlement.ts src/components/pos/GovernedQrisPendingModal.tsx src/components/pos/FinancialStatusBanner.tsx src/tests/hfeSdkGovernedQris.test.ts src/tests/cafeCheckoutAttemptCoordinator.test.ts src/tests/governedQrisPendingModal.test.tsx
git commit -m "feat: resume governed QRIS from authoritative outcome"
```

Omit `OfflineIntentQueue.ts` when its serialization already preserves the response unchanged.

### Task 5: Adopt Authoritative Catalog Only After HCB #1019 Ships

**Files:**
- Create: `src/services/financial/GovernedPosCatalog.ts`
- Modify: `src/services/financial/HfePosFinancialPort.ts`
- Modify: `src/services/financial/HfeSdkAdapter.ts`
- Modify: `src/services/financial/MockHfeAdapter.ts`
- Modify: `src/App.tsx`
- Modify: `src/data/mockData.ts`
- Modify: `src/data/runtimeDemoData.ts`
- Modify: `src/config/firstPartyRuntime.ts`
- Create: `src/tests/governedPosCatalog.test.ts`
- Modify: `src/tests/firstPartyIdentityBridge.test.ts`

**Interfaces:**
- Consumes: the exact generated HCB #1019 tenant/book-scoped catalog/category/item/modifier contract. Its operation/type names must be copied into this section when #1019 merges; generic `MenuItem[]` from `/products` is not accepted evidence.
- Produces: `loadGovernedPosCatalog(bookId, context): Promise<GovernedPosCatalogView>` where every row has governed identity, active status, display metadata, category/modifier references, and no client-owned settlement price authority.

**Connected identity precondition:** The configured organization, Company Book,
authority context, and cashier session are not four independent browser facts.
Before catalog or quote access, HFE POS must consume one immutable,
revision-bound HLab/runtime receipt that maps the Product Canon aliases
`tenant.nusantara` and `book.nusantara-indonesia` to their materialized UUIDs,
ToGrow organization/token claims, authority context, and cashier session. The
receipt must also bind the exact allowed POS and CORE origins. The authenticated
principal/session remains authoritative; environment values are only expected
identities to compare against it and may never manufacture or override claims.

Stop this task until ToGrow #25 resolves the relying-party/customer-org token
semantics, ToGrow #26 materializes the synthetic identities and organization,
HCB #1022 publishes the alias-to-tenant/book/generation receipt through the
trusted local seam from HCB #1020, and HCB #964 publishes governed cashier
session/attestation evidence. HFE POS #100 must then consume those receipts
rather than mint a parallel fixture. A collection of independent `VITE_*`
values, an opaque fake JWT, a ToGrow person UUID treated as cashier authority,
an `org.hfeit` token treated as Nusantara customer-org proof, or an HLab slug
used as a UUID is not sufficient evidence.

- [ ] **Step 1: Stop if the provider dependency is not merged and generated**

Run:

```bash
gh issue view 1019 --repo glc-works/headless-company-books --json state,closedAt,url
HFE_CORE_CHECKOUT="${HFE_CORE_CHECKOUT:?set HFE_CORE_CHECKOUT to a headless-company-books checkout}"
git -C "$HFE_CORE_CHECKOUT" fetch --prune origin
git -C "$HFE_CORE_CHECKOUT" show origin/main:packages/hfe-sdk/src/index.ts | rg -n '(^|    )(get|list|resolve).*(Catalog|Category|Item|Modifier)'
```

Expected: issue closed with implementation evidence and a matching generated operation. Task 5 is deliberately non-executable until a reviewed amendment replaces the generic `GovernedPosCatalogView` boundary above with those exact merged operation/type names. Do not substitute `/v1/company-books/{book}/products` or infer a contract from `/items`.

- [ ] **Step 2: Write red connected-identity and catalog authority tests**

First prove the runtime identity binding fails closed before any CORE request.
Cover organization-claim, book, authority-context, cashier-session, receipt
revision, and allowed-origin mismatches individually. Assert the current
opaque fake-JWT fixture cannot satisfy the connected proof merely because the
independent environment values are syntactically valid. The positive fixture
must use the single canonical synthetic receipt produced by Issue #100; no
second test-only mapping is allowed.

Cover book/tenant scope, inactive/foreign/unknown/duplicate item rejection, category and modifier mapping, empty/error states, and no fallback to `PRODUCT_CATALOG` in connected mode. Assert mock/demo mode still uses canonical synthetic fixture explicitly.

- [ ] **Step 3: Run focused tests and prove the fixture leak**

Run: `npx vitest run src/tests/governedPosCatalog.test.ts src/tests/firstPartyIdentityBridge.test.ts`

Expected: connected mode currently returns the first local fixture with only its ID replaced.

- [ ] **Step 4: Implement the generated catalog adapter and fail-closed loader**

Map only published generated fields. Do not invent names, categories, modifiers, tender eligibility, or prices. If required presentation data is absent, return a typed unavailable state and prevent checkout rather than mixing local display facts with governed identity.

- [ ] **Step 5: Remove connected fixture substitution**

`createRuntimeProductCatalog()` remains for mock/demo only. `App.tsx` loads the governed catalog asynchronously in connected mode and does not initialize a synthetic order/table bill before the catalog resolves.

- [ ] **Step 6: Verify catalog authority**

Run:

```bash
npx vitest run src/tests/governedPosCatalog.test.ts src/tests/firstPartyIdentityBridge.test.ts src/tests/governedPosQuoteReview.test.ts
npm run check:truth-boundary
npm run typecheck
```

Expected: no connected code path reads `PRODUCT_CATALOG` as live product truth.

- [ ] **Step 7: Commit the dependency-bounded catalog adoption**

```bash
git add src/services/financial/GovernedPosCatalog.ts src/services/financial/HfePosFinancialPort.ts src/services/financial/HfeSdkAdapter.ts src/services/financial/MockHfeAdapter.ts src/App.tsx src/data/mockData.ts src/data/runtimeDemoData.ts src/config/firstPartyRuntime.ts src/tests/governedPosCatalog.test.ts src/tests/firstPartyIdentityBridge.test.ts
git commit -m "feat: load connected catalog from governed CORE contract"
```

### Task 6: Correct the Architecture Contract

**Files:**
- Modify: `ARCHITECTURE.md`
- Test: `src/tests/governedCafeCheckoutPayload.test.ts`
- Test: `src/tests/governedQuoteCashierProjection.test.tsx`

**Interfaces:**
- Consumes: settled connected-mode boundaries proven by Tasks 2–5.
- Produces: normative documentation distinguishing local simulation mathematics from connected CORE authority.

- [ ] **Step 1: Write the intended normative replacement**

Replace the unconditional “Financial & Tax Calculation Protocol” with:

```markdown
## Financial and Tax Authority Protocol

In connected mode, HFE POS submits governed identities, quantities, modifiers,
promotion intent, and tender intent. Hfe CORE is the sole authority for price,
discount/funding allocation, tax/PB1, service charge, rounding, amount due,
semantic accounts, and Posting outcome. The cashier must review the exact CORE
quote revision and digest before acceptance; HFE POS must not recalculate or
override a returned monetary component.

The PB1 and service-fee formulas below apply only to explicit local synthetic
simulation. Simulation output is non-authoritative and must never be serialized
into a connected mutation.
```

Also replace the architecture diagram’s invented `/products` and `/transactions` claims with the published governed operations adopted by this issue.

- [ ] **Step 2: Run truth tests before and after the documentation edit**

Run:

```bash
npx vitest run src/tests/governedCafeCheckoutPayload.test.ts src/tests/governedQuoteCashierProjection.test.tsx
rg -n '/products|/transactions|processPosRetailOrder' ARCHITECTURE.md src/hooks/useCafeSettlement.ts src/services/financial/GovernedPosCheckout.ts
git diff --check
```

Expected: tests pass; no architecture claim makes legacy/invented routes the connected authority; any remaining `processPosRetailOrder` occurrence is explicitly marked compatibility-only outside the flagship call graph.

- [ ] **Step 3: Commit the normative correction**

```bash
git add ARCHITECTURE.md
git commit -m "docs: make CORE authoritative for connected sale truth"
```

### Task 7: Browser Proof, Security Gate, and Delivery Receipt

**Files:**
- Create after #100 coordination: `e2e/core-authority-adoption.spec.ts`
- Modify only after #100 work is committed/rebased: `package.json` if a dedicated script is necessary
- Do not modify: Issue #100’s current uncommitted fixture, helper, script, test, or e2e files.

**Interfaces:**
- Consumes: canonical synthetic identity through `e2e/helpers/demoSession.ts`, connected runtime, HLab-preserved local environment, and all implementation tasks.
- Produces: browser and backend evidence for one quote/order/tender/Posting truth with zero duplicate effects.

**QRIS confirmation owner and precondition:** The browser never calls
`confirmPosQrisProviderEvent`. Issue #100's product-owned HLab verification
action must invoke the generated HCB authenticated provider-confirmation
operation as the separately authorized synthetic provider principal, bound to
the exact tenant/book/provider-connection/origin identities in the immutable
runtime receipt. Its evidence output must record the request idempotency key,
provider event/reference, connection ID, tender ID/effect key, authenticated
principal, and terminal response without returning a provider secret to the
browser. The Playwright flow may then resume only through
`getGovernedPosTenderOutcome` and Posting read-back.

Before writing or running the applied-path QRIS proof, require all of the
following: ToGrow #25/#26 provide the correct customer-organization token and
identity receipt; HCB #1020, #1022, and #964 are merged; HFE POS #100 is merged
at an exact SHA; the HLab manifest pins the exact POS/CORE/Company Books origins
and synthetic provider connection; and the product-owned action declares the
exact generated operation plus auth scope. If any precondition is absent, stop
and report `qris_confirmation_harness_unavailable`; do not intercept a success,
call the provider mutation from the browser, or treat `pending` as applied.

- [ ] **Step 1: Coordinate the file fence with Issue #100**

Before touching `e2e/` or `package.json`, inspect the #100 worktree and obtain its owner’s committed head/handoff. Rebase Issue #101 onto that head or choose a new spec filename with no overlap. Never copy or overwrite its uncommitted files.

- [ ] **Step 2: Write the failing Playwright proof**

The new spec must use `e2e/helpers/demoSession.ts` and prove:

1. connected catalog is CORE-derived;
2. browser-local total is not presented as payable;
3. exact CORE quote is visible before accept;
4. unsupported card is absent/disabled;
5. cash response-loss recovery preserves one acceptance/confirmation effect
   lineage through acceptance-by-idempotency-key lookup, byte-identical cash
   confirmation replay with the persisted confirm key/body, and Posting
   read-back;
6. QRIS timeout/reload resumes with outcome GET, not a second mutation;
7. only applied outcome clears the cart;
8. the HLab action receipt proves one authenticated provider confirmation for
   the exact synthetic connection/tender, while browser network evidence proves
   zero provider-confirmation mutations;
9. final posting link/read-back matches book, order, tender, effect key, amount, currency, and applied finality;
10. the runtime receipt binds token organization claims, materialized book,
    authority context, cashier session, and allowed origins; every single-field
    mismatch fails before quote or financial mutation.

Count unique idempotency/effect identities rather than raw retransmissions:
assert one quote ID, one order ID, one tender/effect key, and one Posting. Any
retransmitted quote/QRIS-intent request must be byte-identical and reuse its
phase key. Acceptance response-loss recovery uses the generated idempotency-key
GET. QRIS/provider-confirmation recovery remains GET-only; cash confirmation
response loss may replay only the exact persisted request with the same confirm
key/body. Assert no `processPosRetailOrder` request.

- [ ] **Step 3: Run browser proof at required ports/viewports**

Run the focused spec against port 5173 and the production preview at port 4173. Inspect 360px, 390px, 768px, and 1280px widths, light/dark themes, one scroll owner, button reachability, long amount/reference text, and QR modal focus/close/resume behavior.

Expected: no clipping/collision; the quote review and outcome state remain operable at every viewport.

- [ ] **Step 4: Run all local gates once, serially**

```bash
npm run ci
npm run test:flagship
npm run test:demo
git diff --check
```

Do not start duplicate Cargo/provider builds. Hosted CI is final confirmation, not a debugger.

- [ ] **Step 5: Run full-file Aikido scans**

Send the full content of every added or modified first-party code file to `aikido_full_scan`. Fix findings and rescan until the result contains zero issues. Generated SDK artifacts and documentation are provenance/diff reviewed; do not manually “fix” generated code.

- [ ] **Step 6: Perform live synthetic reconciliation**

With HLab preserving the local environment, execute exactly one synthetic cash and one synthetic QRIS case. Record the immutable runtime-receipt revision and alias-to-UUID/claim binding; quote ID/revision/digest; order ID; tender ID/effect key; the product-owned HLab provider-confirmation receipt; Posting ID; journal/read-back identity; and request counts. Query PostgreSQL/TigerBeetle only through existing read-only proof tooling; do not reset or mutate shared runtime during observation.

Stop if any duplicate quote, order, tender, Posting, journal, or dispatch effect appears, or if PostgreSQL and TigerBeetle evidence cannot be reconciled.

- [ ] **Step 7: Commit the coordinated browser proof**

```bash
git add e2e/core-authority-adoption.spec.ts package.json
git commit -m "test: prove governed POS authority end to end"
```

Omit `package.json` when no dedicated script was added.

## Rollback and Stop Conditions

- Roll back by reverting the Issue #101 commits in reverse order; never restore live checkout to `processPosRetailOrder` as a shortcut.
- A catalog dependency failure rolls back only Task 5; Tasks 1–4 remain independently useful and safe.
- Stop before mutation when quote identity changed after review, eligibility is missing/ambiguous, or response amount/currency differs from frozen evidence.
- Stop QRIS recovery when the outcome endpoint lacks exact accepted-tender lineage or applied Posting evidence. Preserve the attempt for investigation; do not recreate it.
- Stop if generated SDK source commit/digests differ from the approved provenance or if a local edit appears inside generated code.
- Stop and coordinate if Issue #100 modifies any intended `package.json`, `e2e/`, fixture, helper, script, or test path.
- Stop before connected access when the immutable runtime receipt is absent,
  stale, untrusted, origin-mismatched, or disagrees with organization/token,
  book, authority-context, or cashier-session identity.
- Stop the QRIS applied-path proof when Issue #100/HLab has no exact
  authenticated synthetic provider-confirmation action and receipt; browser
  interception or browser-owned confirmation is not a substitute.
- Stop if HCB #1019 is not merged into the SDK; do not fabricate catalog routes or project generic items as a POS catalog.
- Stop if local gates fail, Aikido reports unresolved issues, browser proof only passes with intercepted/fabricated financial success, or live read-only evidence shows duplicate effects.

## Final Completeness Receipt

Before requesting review, attach:

- HFE POS base/head SHAs and exact HCB SDK source commit plus both digests;
- changed-file list proving the locked fence;
- focused red/green test commands and final `npm run ci` output;
- Aikido zero-findings receipt for all changed first-party code;
- browser matrix for ports 5173/4173 and widths 360/390/768/1280;
- one synthetic cash and QRIS lineage table showing one quote, order, tender, and Posting effect;
- explicit statement that no production/provider/deployment/secret mutation occurred;
- explicit residual status for HCB #1019, HCB #964 cashier attribution, HCB #1010 legacy route retirement, and HFE POS #100 verification ownership.
