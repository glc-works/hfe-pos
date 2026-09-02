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
| RETIRE | 97 | Truth now lives in code/tests, or the approach was abandoned (PR closed unmerged). |
| SUPERSEDED | 17 | Durable product meaning moved to a named Product Canon successor (incl. both auth-starterkit plans — see CodeRabbit finding). |
| **Total removed** | **114** | Of 129 audited plan files; 15 files remain active (see below). |

Remaining active plan files (15): 7 EXTRACT-TO-CANON (4 in `level-1/`: l1-27, l1-10,
l1-15, l1-16; 3 in `level-2/`: l2-pos-46, l2-pos-12, l2-pos-18 — harvest-pending,
banner-marked), 7 KEEP-AS-COORDINATION in `level-2/` (live issue bindings), and
1 UNCLEAR (`level-2/l2-pos-101-board-dual-cta-and-online-state-isolation.md`, fails closed).
Templates under `templates/` are scaffolding, outside the 129-file audit count.

## SUPERSEDED (17) — successor canon

| removed file | successor / evidence (per DISPOSITION.md) |
|---|---|
| `level-0/000-hfex-master-experience-platform.md` | `product/level-0/current-product-system.md` + `product-relationship-classification.md` + `experience-surface-map.md` own surface meaning; already dispositioned STALE/HARVESTED at POS `eacd1ec2`; Product `#68` OPEN_DECISION on shipping selection. |
| `level-0/hfe-pos-suite-master-plan.md` | Surface meaning → `experience-surface-map.md`/`experience-card-board-order.md`; loyalty/voucher semantics → `01.01.28-promotions-offers.md`; Product `#68` keeps shipping selection open. |
| `level-1/l1-17-hfe-pos-auth-starterkit-sdk.md` | Identity canon (`first-party-identity` alignment, `#38`/`#40` closed) owns auth; POS-local auth-starterkit was never implemented. |
| `level-2/l2-pos-20-hfe-pos-auth-starterkit-sdk-package.md` | Package twin of l1-17; same Identity-canon supersession. |
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

## RETIRE (97) — truth owned by code/tests

| removed file | evidence / successor (per DISPOSITION.md) |
|---|---|
| `level-1/l1-11-fine-dining-course-pacing-suite.md` | F&B-vertical implementation, not ecosystem meaning. |
| `level-1/l1-14-operational-workflows-shift-void-stocktake.md` | Operational workflow detail; cash truth is CORE's. |
| `level-1/l1-18-multi-warehouse-operations-suite.md` | Inventory/warehouse semantics → `01.01.17-product-inventory.md`; plan is implementation detail. |
| `level-1/l1-21-real-world-rl-operations-suite.md` | Mostly hardware/parsing implementation; consignment semantics, if wanted, belong under `01.01.17`. |
| `level-1/l1-22-hfe-pos-insights-and-ux-purification-suite.md` | Analytics presentation detail; live-truth boundary for insights now tracked by `#85`-`#88`/`#126` and plan 94. |
| `level-1/l1-23-pos-2026-next-gen-capabilities-suite.md` | Feature implementation detail; "POS 2026 standards" claims are marketing language, not evidence. |
| `level-1/l1-25-engineering-platform-suite.md` | Repo tooling coordination; stays as provenance only. |
| `level-2/l2-pos-01-mobile-qr-guest-login-cart.md` | Shipped; identity semantics superseded (see l1-01). |
| `level-2/l2-pos-02-barista-touch-table-grid.md` | Shipped. |
| `level-2/l2-pos-03-open-tab-qris-payment-modal.md` | Payment truth now flows through GovernedPosCheckout/CORE (plan 50/101). |
| `level-2/l2-pos-04-kds-thermal-ticket-printer.md` | Shipped. |
| `level-2/l2-pos-05-app-monolith-decomposing-and-testing.md` | Done; modularity now enforced by `scripts/check-modularity.py`. |
| `level-2/l2-pos-06-modularity-guard-and-frontend-tooling.md` | Done. |
| `level-2/l2-pos-07-loyalty-tiers-voucher-wallet-engine.md` | Loyalty semantics superseded by `01.01.28-promotions-offers.md`. |
| `level-2/l2-pos-100-fix-theme-desync-and-visual-capture.md` | Shipped. |
| `level-2/l2-pos-102-luxury-online-delivery-checkout.md` | Shipped 3-tier address/distance-fee checkout; delivery semantics → ORDER canon (§4); ongkir pricing semantics, if harvested, belong with the l1-15 courier extraction. |
| `level-2/l2-pos-103-live-track-order-dock-and-hub-favorite-products.md` | Shipped; hub analytics must obey the truth boundary (`#126`, plan 94). |
| `level-2/l2-pos-11-allergen-filter-togrow-account-merchant-tiering.md` | Entitlement semantics superseded by Identity/entitlements canon. |
| `level-2/l2-pos-13-course-firing-sommelier-maitre-d-engine.md` | Shipped fine-dining detail. |
| `level-2/l2-pos-14-store-onboarding-wizard-getting-started.md` | Shipped. |
| `level-2/l2-pos-15-team-invitation-staff-rbac-pin-engine.md` | Residuals have live owners (`#126`, Product PR `#50` shared-terminal decision). |
| `level-2/l2-pos-16-unified-simple-pos-login-screen.md` | Auth semantics now governed by l2-pos-86/Identity canon; residual `#115`. |
| `level-2/l2-pos-17-shift-reconcile-void-refund-stocktake-engine.md` | Shipped. |
| `level-2/l2-pos-19-awb-resi-and-thermal-receipt-engine.md` | Printing is implementation detail; resi semantics harvested via l1-16. |
| `level-2/l2-pos-21-warehouse-management-view-transfer-spoilage-engine.md` | Shipped; inventory truth under `01.01.17`. |
| `level-2/l2-pos-22-branch-management-view-outlet-switcher-engine.md` | Shipped. |
| `level-2/l2-pos-23-eco-impact-dashboard-surplus-discount-tip-engine.md` | Unimplemented deltas, if wanted, route through `01.01.25-sustainability.md` (HCB `#932`), not this plan. |
| `level-2/l2-pos-24-comprehensive-ux-purification-board-review.md` | Point-in-time UX repair; superseded by later UX waves. |
| `level-2/l2-pos-25-station-printer-routing-gs1-barcode-scale-consignment-engine.md` | Same as l1-21; unimplemented parts route through Canon specs if wanted. |
| `level-2/l2-pos-26-comprehensive-17-point-ux-catalog-repair.md` | Point-in-time repair; provenance. |
| `level-2/l2-pos-27-ux-repair-and-hfe-insights-engine.md` | Insights truth-boundary residuals now owned by `#85`-`#88`/plan 94. |
| `level-2/l2-pos-28-ai-upsell-kiosk-pay-at-table-timeclock-engine.md` | Shipped (l1-23 L2 twin). |
| `level-2/l2-pos-28-theme-selector-miniature-preview-and-merchant-settings-repair.md` | Shipped; note duplicated plan ID 28 (see identity-collision finding). |
| `level-2/l2-pos-29-customer-contacts-view-and-crm-engine.md` | Contact semantics under `01.01.02`. |
| `level-2/l2-pos-29-table-bill-hydration-and-payment-status-visibility.md` | Shipped; duplicated plan ID 29. |
| `level-2/l2-pos-30-anti-bleeding-typography-and-mobile-component-audit.md` | Shipped typography hardening in `src/`; owned by `src/tests/antiBleedingTypography.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-31-living-component-design-system-and-ssot-rules.md` | Shipped design-system SSOT in `src/`; owned by `src/tests/designSystemShowcase.test.ts`, `src/tests/tier1TokensAndTier2Atoms.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-32-light-dark-themes-and-merchant-customer-separation.md` | Shipped theme separation; owned by `src/tests/dayModeLightAndDarkTheme.test.ts`, `src/tests/dualThemePurityAndAestheticEngine.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-33-ios-android-grouped-settings-architecture.md` | Shipped grouped settings; owned by `src/tests/iosSettingsView.test.ts`, `src/tests/settingsFourZoneArchitecture.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-34-hfe-insights-menu-surface-promotion.md` | Shipped insights surface; owned by `src/tests/hfeInsightsAndUxRepair.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-35-app-drawer-launchpad-architecture.md` | Shipped app drawer/launchpad; owned by `src/tests/appDrawerNavigation.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-36-5-core-apps-consolidation-and-modular-features.md` | Shipped 5-core-apps consolidation; owned by `src/tests/fiveCoreAppsSuite.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-37-mobile-viewport-visual-repair-and-single-line-rule.md` | Shipped mobile visual repair; owned by `src/tests/mobileVisualRepair.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-38-unified-pos-command-header-and-devmode-isolation.md` | Shipped unified command header; owned by `src/tests/unifiedPosCommandHeader.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-39-eliminate-triple-redundant-navigation-staff-subnav.md` | Shipped navigation de-duplication; owned by `src/tests/staffSubNavZeroRedundancy.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-40-true-single-top-bar-and-devkit-v2.md` | Shipped single top bar + devkit; owned by `src/tests/trueSingleTopBarAndDevkit.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-41-devkit-zero-lag-hover-inspector-hud.md` | Shipped dev inspector HUD; owned by `src/tests/devInspectorHud.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-42-custom-theme-templates-and-marketplace-vault.md` | Shipped theme marketplace; owned by `src/tests/themeMarketplaceAndCustomTemplates.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-43-single-door-merchant-config-architecture.md` | Shipped single-door merchant config; owned by `src/tests/merchantConfigContext.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-44-wifi-access-policy-and-storefront-security.md` | Shipped Wi-Fi access policy; owned by `src/tests/wifiAccessPolicy.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-45-multi-zone-floor-plan-and-large-hotel-resto-operations.md` | Shipped multi-zone floor plan; owned by `src/tests/multiZoneHotelResto.test.ts`. (row absent from the merged Group 4 tables; retired under the inventory's RETIRE count (97 after the starterkit reclassification).) |
| `level-2/l2-pos-47-customer-card-and-member-portal.md` | Shipped; CARD meaning (Life & Work pass model, not loyalty-only) owned by `experience-card-board-order.md` §2. |
| `level-2/l2-pos-49-notification-center-and-operations-ticketing.md` | Notification delivery semantics → `01.01.12.03-notification-delivery.md`; ticketing → `01.01.03-ticket.md`. |
| `level-2/l2-pos-50-production-contract-cutover-and-sdk-adoption.md` | Defers correctly to CORE authority ("Authority References" section is deferential, not a claim); residual connected-mode breadth moved to plan 101. |
| `level-2/l2-pos-51-unified-wave-upgrade-sdk-and-design-hierarchy.md` | Merged; front-matter status unreliable — shipped as SDK refactor — code/tests own the truth. |
| `level-2/l2-pos-52-customer-touchpoints-and-order-channels.md` | Shipped. |
| `level-2/l2-pos-53-operations-kds-and-backoffice-cutover.md` | Shipped. |
| `level-2/l2-pos-55-master-product-wide-compliance-sweep-and-device-parity.md` | "100% Tier 2" claim in front matter is unevidenced; treat as provenance only. |
| `level-2/l2-pos-56-proportional-tetris-zone-packing-zero-empty-space.md` | Superseded by later geometry iterations; final state in code. |
| `level-2/l2-pos-57-2d-tetris-vertical-rowspan-packing.md` | Same family. |
| `level-2/l2-pos-58-symmetric-3x2-tetris-zone-pairing.md` | Same family. |
| `level-2/l2-pos-59-universal-3-row-micro-budget-multi-device.md` | Layout invariants now live in the consumer-client UI standard carried in AGENTS.md-type contracts, not this plan. |
| `level-2/l2-pos-60-restore-spacious-4-col-grid-view.md` | Shipped. |
| `level-2/l2-pos-61-adaptive-factor-grid-columns-zero-empty-space.md` | Shipped. |
| `level-2/l2-pos-63-ios-widget-matrix-floor-plan.md` | Shipped. |
| `level-2/l2-pos-64-strict-4col-grid-and-6col-compact-canvas.md` | Abandoned approach; do not dispatch from this plan. |
| `level-2/l2-pos-65-4col-interlocking-tetris-rotation.md` | Abandoned approach. |
| `level-2/l2-pos-67-continuous-interlocking-area-surface-engine.md` | Abandoned approach. |
| `level-2/l2-pos-68-native-svg-fillet-path-surface-engine.md` | Abandoned approach. |
| `level-2/l2-pos-69-symmetric-othello-grid-and-zone-surfaces.md` | Abandoned approach (pure-CSS successor PR #16 was merged instead). |
| `level-2/l2-pos-70-pure-css-territorial-area-classification.md` | Shipped terminal state of the geometry saga. |
| `level-2/l2-pos-71-direct-modal-action-and-clean-selection-rollback.md` | Abandoned or absorbed. |
| `level-2/l2-pos-72-floor-plan-area-filters-and-full-view-consistency.md` | Abandoned or absorbed. |
| `level-2/l2-pos-73-unified-single-canvas-6col-compact-view.md` | Abandoned. |
| `level-2/l2-pos-74-bar-operations-and-billion-monetary-stress-test.md` | Spatial-containment intent survives in the consumer-client UI standard, not this plan. |
| `level-2/l2-pos-75-six-tier-layer-isolation-and-adaptive-pricetag-atom.md` | Tier model lives in architecture contracts. |
| `level-2/l2-pos-76-hfe-core-ssot-sync-and-multi-tender.md` | Settlement truth is CORE's (`01.05.05`); local multi-tender UI work absorbed elsewhere. |
| `level-2/l2-pos-77-domain-separation-cafe-operations-and-ticketing.md` | Bounded-context principle survives in standards; plan abandoned. |
| `level-2/l2-pos-78-shared-pos-catalog-category-showcase-and-search.md` | Shipped. |
| `level-2/l2-pos-79-smart-search-and-multilingual-thesaurus.md` | Shipped; semantic-search capability provenance. |
| `level-2/l2-pos-80-hfecard-dual-persona-warehouse-wms-and-milestone-courier.md` | CARD Life/Work dual-persona meaning → `experience-card-board-order.md` §2; do not let this plan redefine CARD. |
| `level-2/l2-pos-81-multi-country-adaptive-cash-denominations.md` | Currency master data is CORE's (`01.01.08.01`); UI preset logic is implementation. |
| `level-2/l2-pos-82-kiss-multi-currency-cashier-tender.md` | Shipped. |
| `level-2/l2-pos-83-banknote-ceiling-and-speed-keys-000.md` | Shipped. |
| `level-2/l2-pos-84-locale-driven-number-formatting.md` | Localization projection semantics → `01.01.12.06-localization-projection.md`. |
| `level-2/l2-pos-85-daymode-light-theme-engine.md` | Shipped as part of the theme engine family (32/85/100). |
| `level-2/l2-pos-86-hfex-tooling-broken-link-remediation.md` | One-off remediation, complete. |
| `level-2/l2-pos-87-admin-mode-merchant-and-user-management.md` | Admin semantics → `merchant-administration-surfaces.md`; residuals have live owners. |
| `level-2/l2-pos-88-escpos-thermal-printer-and-cash-drawer-driver.md` | Contract rule: physical go-live must not be inferred from simulated hardware; residual owned by live `#88`. |
| `level-2/l2-pos-88-flagship-exp-hfeit-suite-landing-page.md` | EXP positioning now owned by Canon surface docs + `#111` claims hygiene; note duplicated plan ID 88. |
| `level-2/l2-pos-90-safe-zero-downtime-dns-migration-togrow-and-sekeding.md` | Already marked Superseded in front matter; deployment truth owned by deployment governance (`hfe-deployment-governance`). |
| `level-2/l2-pos-91-live-core-plumbing-and-authoritative-readback.md` | Executed; remaining connected-mode breadth is owned by plan 101 / live `#101`. |
| `level-2/l2-pos-95-offline-stack-requalification.md` | Legacy matrix dispositioned this family: `01.01.11-offline.md` owns semantics; residual real-device/manager-triage proof is POS `#114`. |
| `level-2/l2-pos-96-storefront-resolver-fail-closed.md` | Fail-closed invariant enforced; provenance. |
| `level-2/l2-pos-97-board-footer-merchant-onboarding-cta.md` | Shipped. |
| `level-2/l2-pos-98-exp-landing-system-that-grows-with-you.md` | Positioning copy shipped; claims language residual under live `#111`. |
| `level-2/l2-pos-99-qr-order-scrollbar-and-theme-contrast-fix.md` | Shipped. |
