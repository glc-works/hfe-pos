# Hfe POS — Development Process & Delivery Authority

This document defines the delivery process, GitHub Delivery Project mapping, planning structure, and verification authority for `glc-works/hfe-pos`.

## Level 0 / Level 1 / Level 2 Planning Structure

- **Level 0 (L0):** Core Product Strategy (`Hfe` Ecosystem & POS Commerce Suite).
- **Level 1 (L1):** Domain Capability Plans located in `docs/active/plans/level-1/`.
- **Level 2 (L2):** Tactical Feature Execution Plans located in `docs/active/plans/level-2/`.

## Dispatcher & Project Board Routine

1. Run `git status` before starting work.
2. Check the private **Company Books Delivery Project** for claimed issues.
3. Use branch naming: `codex/<tier>-<issue>-<slug>`.
4. Verify every feature with unit/integration tests and visual evidence before merging.
5. Autonomous merges to `main` require green checks and explicit authority.

## Local synthetic demo access

The canonical test-only identity and manual instructions live in
`fixtures/demo/`. Use `npm run test:demo` to prove the documented account can
enter and reset a clean browser session. The Playwright helper at
`e2e/helpers/demoSession.ts` is the reusable automation boundary; direct auth
storage injection is not an accepted login path.

Failure to discover or complete this documented local flow is a repository
reliability defect. It is not evidence of a ToGrow or Hfe Core access blocker.
Never commit credentials for either external system.
