# START HERE — Hfe POS Workspace

This repository is an **implementation workspace**. It is not the standalone source of product meaning.

## Required reading order

1. **Product Canon first:** `glc-works/hfeit-product`
   - repository entry contract: `product/repository-entry-contract.md`
   - CARD / BOARD / ORDER boundaries: `product/level-1/experience-card-board-order.md`
   - canonical public and authenticated surfaces: `product/level-1/experience-surface-map.md`
2. **Local technical authority:** `ARCHITECTURE.md` and approved standards under `docs/active/standards/`.
3. **Hfe CORE/backend authority:** governed contracts in `glc-works/headless-company-books` where business/financial truth is involved.
4. **Deployment/environment truth:** `glc-works/hfe-deployment-governance` when the task touches domains, environments, runtime or promotion.
5. **Current delivery state:** live GitHub Issues/PRs/Project plus `DEVELOPMENT.md`.

## Do not infer product meaning from local code

Local views, fixtures, mocks, historical plans and stale wording MUST NOT redefine Product Canon.

If local documentation conflicts with Product Canon about what CARD, BOARD, ORDER, POS or another Hfeit product means, reconcile the local documentation before product-affecting implementation.

Current experience boundaries:

- **CARD** = Life & Work pass experience.
- **BOARD** = merchant website/public presence/discovery/presentation.
- **ORDER** = universal transactional interaction/orchestration; dine-in, takeaway, delivery, reservation, booking, ticket purchase and service order are modes.
- **POS** = merchant/staff operational experience.
- **Hfe CORE** = authoritative governed business/financial truth.

Product intent does not equal implementation proof. Never present a mock, fixture or mounted-but-non-persistent route as authoritative implementation.
