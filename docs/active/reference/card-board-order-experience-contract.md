# CARD / BOARD / ORDER Experience Contract

Product authority: `glc-works/hfeit-product/product/level-1/experience-card-board-order.md`.

This document records the consumer boundary `hfe-pos` must follow. It does not create a second product authority.

## CARD

CARD is the **Life & Work pass experience**, not a loyalty-only application.

Life use cases include merchant membership, loyalty, personal pass/identity presentation, receipts, tickets, reservations and other user-held entitlements.

Work use cases include employee ID pass, attendance/check-in, approval/workflow identity presentation, workplace access and employee-held entitlements.

Canonical identity remains with ToGrow Account / governed IAM. CARD presents or consumes identity, membership and entitlement contracts; it does not become the identity authority.

## BOARD

BOARD is the merchant **website, public presence, discovery and presentation experience**. Hfeit-managed landing pages and merchant websites use Astro unless a later product decision changes the implementation standard.

BOARD may present catalog/menu, events, services, reservations, bookings, tickets and campaigns, but it does not own their commercial transaction lifecycle.

When a user creates a commercial commitment, BOARD hands intent to ORDER.

```text
BOARD
  ↓ intent
ORDER
  ↓ governed transaction flow
Hfe CORE
```

## ORDER

ORDER is the customer-facing **transactional interaction and orchestration experience**. QR dine-in is only one mode.

Supported product modes may include:

- dine-in;
- takeaway / pickup;
- delivery;
- reservation;
- booking;
- ticket purchase;
- service order;
- future commitment/fulfillment modes sharing the same governed lifecycle.

Mode-specific UX may differ while shared transaction concerns remain consistent: party/customer context, selection, availability, pricing snapshot, taxes/fees, payment/settlement where applicable, idempotency, status, fulfillment/entitlement, cancellation/reversal policy and audit evidence.

ORDER does not own financial truth. Canonical posting, settlement and accounting truth remain in Hfe CORE/HCB.

## Reservation / booking / ticket flow

```text
BOARD → ORDER(mode=reservation|booking|ticket) → Hfe CORE
                                               ↓ entitlement/read model
                                              CARD
```

CARD may surface the resulting pass or entitlement after authoritative creation; CARD is not the transaction engine.

## POS relationship

POS is the merchant/staff operational Experience Application. ORDER is the customer transactional Experience Application. Both converge on governed Hfe CORE contracts rather than private shadow state.

```text
Customer                 Merchant / Staff
   ↓                            ↓
 ORDER                         POS
    \                           /
     └──── governed Hfe CORE ──┘
```

## Anti-drift rules

- Do not redefine CARD as loyalty-only.
- Do not place checkout/reservation/booking/ticket transaction ownership in BOARD.
- Do not restrict ORDER to QR dine-in.
- Do not make CARD, BOARD, ORDER or POS parallel backend authorities.
