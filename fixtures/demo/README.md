# Canonical Local Demo Entry

`access.json` is the single machine-readable contract for entering the local synthetic POS demo.
It contains test data only and is intentionally safe to commit.

## Manual entry

1. Run `npm run demo:dev`.
2. Open `http://localhost:5173/?app=cafe`.
3. Select the branch recorded in `access.json`.
4. Enter the six-digit staff PIN recorded in `access.json`.

The canonical account is **Siti Barista**, PIN **123456**, at branch
`BRANCH-HQ-01`. Do not create or document alternate hidden demo PINs.

## Automated entry and reset

Playwright consumers must import `loginAsCanonicalDemoStaff` and
`resetCanonicalDemoSession` from `e2e/helpers/demoSession.ts`. Both helpers read
`access.json`; tests and scripts must not duplicate its identity or PIN.

Run the browser proof with:

```sh
npm run test:demo
```

`resetCanonicalDemoSession` clears only the test browser context. It does not
reset Hfe Core or any external environment.

Both demo commands set `VITE_ENABLE_LOCAL_DEMO=true`. The runtime additionally
requires loopback browser and API hosts, and only falls back after a network
failure. An HTTP authentication rejection remains authoritative and fails
closed.

## Security boundary

Never add real ToGrow usernames, passwords, access tokens, customer data, or
production PINs here. Real first-party credentials belong in the approved
secret manager or environment injection path and must never be committed.
