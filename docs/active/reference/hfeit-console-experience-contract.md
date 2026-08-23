# HFEIT Console / POS Experience Contract

## Position

`hfe-pos` is an Experience Application and proving ground. It consumes the Hfeit platform; it does not become the platform authority.

```text
ToGrow Account
  ↓
Hfeit Console
  ↓ governed contracts
Hfe CORE / HCB
  ↓
hfe-pos
```

## Workspace and Environment

One Experience Application uses one Workspace. CompanyBook/POS-related applications may share the Workspace according to the product contract.

Persistent Customer Environments:

- Development
- Staging
- Production

Feature-specific testing uses a temporary Sandbox under the existing Workspace. Sandbox is not a new Workspace and is not the server deployment environment. TTL, destruction, credential rotation, and data isolation are server-authoritative.

## Identity

POS must adopt the canonical ToGrow first-party SSO/session contract rather than maintain a bespoke identity authority. See `account-togrow#23`, `account-togrow#25`, and `EXP.Hfeit#5`.

## CORE authority

All financial truth is governed by Hfe CORE/HCB. POS must use canonical generated operations and durable read-back for financial claims. Local state, fixtures, or a simulated adapter must never be presented as authoritative CORE posting.

## Offline

Offline is a consumer capability, not a new accounting authority. Local durable intent may preserve an idempotency identity, but only CORE read-back establishes posted financial truth. Existing POS offline work remains governed by `hfe-pos#61`, `hfe-pos#35`, and HCB `#856`.

## Console / Workbench expectations

The Customer Console provides the developer control plane: application/environment configuration, credentials/secrets, API exploration, request logs, events, webhooks, errors and health. POS should expose only the consumer-facing subset it needs and must not duplicate the Workbench or secret authority.

## Cross-repo references

- `glc-works/hfeit-product#23/#24` — product/Console contract
- `glc-works/CORE.Hfeit#4/#5` — Console implementation
- `glc-works/headless-company-books#935` — backend Console contracts
- `glc-works/headless-company-books#856` — governed POS financial completion
- `glc-works/account-togrow#23/#25` — first-party identity/session
- `glc-works/hfe-pos#35/#61` — POS proving/financial/offline work
