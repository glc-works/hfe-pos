# Hfe POS & Commerce Suite - Agent Guidance

`glc-works/hfe-pos` is the canonical repository for active work on the **Point of Sale (POS) & Retail Cashier Frontend Suite**.

Read `ARCHITECTURE.md` first as the highest technical contract, then `DEVELOPMENT.md` for delivery process authority. `CLAUDE.md` and this file are contributor entry points only.

## Current product lifecycle state

As of 2026-08-15, `hfe-pos` is **pre-production** and contains no real-user or customer data.

## Four Guiding Principles

1. **Think before coding.** State assumptions explicitly, push back on unnecessary complexity, and ask rather than guess.
2. **Simplicity first.** Deliver the simplest compliant UI and offline-first cashier integration.
3. **Surgical changes.** Touch only what the request requires. Clean up your own unused code.
4. **Goal-driven execution.** Turn imperative tasks into verifiable UI and API test criteria.

## Slot Reservation Rules

- **`planning1`:** Reserved for the central Planner peer session.
- **`implementation1`:** EXCLUSIVELY reserved for the primary Implementer peer session. Subagents must NEVER claim `implementation1`.
- **`implementation2`, `implementation3`, ...:** Allocated for subagent execution when requested.

## Agent Budget & Verification

- `XS`: <10k tokens, `S`: 10-30k tokens, `M`: 30-75k tokens, `L`: 75-150k tokens.
- Verification evidence requires explicit test outputs, console checks, and visual proof before declaring victory.
