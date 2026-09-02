# Retired Legacy Plan Files

Retirement marker for the legacy plan tree cleanup of 2026-09-02. It records every plan file
removed from `docs/active/plans/`, its disposition, and the successor authority or the
code/tests that own the truth now. Source inventory:
[`DISPOSITION.md`](DISPOSITION.md) (audit basis: Canon Convergence Execution Contract,
`glc-works/hfeit-product@governance/canon-convergence-execution.md`).

Removed bodies remain recoverable from Git history (plan tree last present at `f1319fe`).
They are provenance only: never treat them as product authority and never dispatch work from them.
Product authority lives in Product Canon (`glc-works/hfeit-product`), which wins any conflict.

| Disposition | Count | Meaning |
|---|---|---|
| RETIRE | 99 | Truth now lives in code/tests, or the approach was abandoned (PR closed unmerged). |
| SUPERSEDED | 15 | Durable product meaning moved to a named Product Canon successor. |
| **Total removed** | **114** | Of 129 audited plan files; 15 files remain active (see below). |

Remaining active plan files: 4 EXTRACT-TO-CANON in `level-1/` (harvest-pending, banner-marked),
7 in `level-2/` (3 EXTRACT-TO-CANON + 4 KEEP-AS-COORDINATION), and 1 UNCLEAR
(`level-2/l2-pos-101-board-dual-cta-and-online-state-isolation.md`, fails closed).
Templates under `templates/` are scaffolding, outside the 129-file audit count.

## SUPERSEDED (15) — successor canon

| removed file | successor / evidence (per DISPOSITION.md) |
|---|---|
| `level-0/000-hfex-master-experience-platform.md` | `product/level-0/current-product-system.md` + `product-relationship-classification.md` + `experience-surface-map.md` own surface meaning; already dispositioned STALE/HARVESTED at POS `eacd1ec2`; Product `#68` OPEN_DECISION on shipping selection. |
| `level-0/hfe-pos-suite-master-plan.md` | Surface meaning → `experience-surface-map.md`/`experience-card-board-order.md`; loyalty/voucher semantics → `01.01.28-promotions-offers.md`; Product `#68` keeps shipping selection open. |
| `level-1/l1-01-guest-login-mobile-qr-self-order.md` | Entry/guest semantics → `first-party-identity-sso-session.md` + `experience-card-board-order.md` §7; POS-local login must not re-own identity (see l2-pos-86). |
| `level-1/l1-02-barista-touch-pos-table-engine.md` | POS surface meaning → `experience-surface-map.md`, `experience-card-board-order.md` §7. |
| `level-1/l1-03-policy-based-payment-checkout.md` | Payment/settlement truth is CORE's (`01.05.05-settlement` family); ORDER mode mapping → `experience-card-board-order.md` §5. |
| `level-1/l1-04-kitchen-ticket-barista-display.md` | Operations UX is POS implementation detail; surface role in Canon. |
| `level-1/l1-05-universal-loyalty-and-voucher-engine.md` | Canon successor exists: `product/specs/01.01.28-promotions-offers.md`; plan's `/v1/loyalty` API design must not compete. |
| `level-1/l1-06-offline-indexeddb-resilience-buffer.md` | `product/specs/01.01.11-offline.md` owns semantics; already dispositioned in the legacy matrix; server-side breadth remains HCB `#931`, field proof POS `#114`. |
| `level-1/l1-09-customer-preferences-togrow-account-and-merchant-tiering.md` | Identity → `identity-federation-entitlements.md`, `first-party-identity-sso-session.md`; subscription tiering → `01.06.06-subscription-billing-journey`. |
| `level-1/l1-12-store-onboarding-getting-started-wizard.md` | Merchant administration/onboarding meaning → `merchant-administration-surfaces.md` (verify onboarding coverage during harvest; else demote to RETIRE). |
| `level-1/l1-13-team-membership-and-staff-invitation.md` | Identity/session + authorization meaning → `first-party-identity-sso-session.md`, `governed-object-authorization.md`; shared-terminal PIN decision pending in Product PR `#50`. |
| `level-1/l1-19-multi-branch-outlet-management-suite.md` | Multi-outlet administration → `merchant-administration-surfaces.md` (verify multi-outlet coverage during harvest). |
| `level-1/l1-20-esg-sustainability-commerce-engine.md` | Sustainability meaning → `product/specs/01.01.25-sustainability.md` (matrix row: HCB `#924`/`#932` own reconciliation); uncovered eco-perk deltas, if wanted, go through that spec. |
| `level-1/l1-24-customer-contact-master-and-crm-suite.md` | Contact/party semantics → `01.01.02-contact.md` family; CRM view is implementation detail. |
| `level-2/l2-pos-08-offline-indexeddb-resilience-buffer.md` | Same offline family row as l1-06 in the legacy matrix; `01.01.11-offline.md` owns semantics. |
