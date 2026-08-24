# Demo Communications Harness

This directory materializes the POS subset of the proposed
`hfe.demo-ecosystem@1.0.0` Product Canon contract. Everything here is
`synthetic_test_only`.

It is a proving-ground harness, not production communication ownership:

- Mailpit captures SMTP messages locally at `http://127.0.0.1:8025`.
- WireMock simulates the WhatsApp-style HTTP provider at
  `http://127.0.0.1:8089`.
- All published ports bind to loopback only.
- Email recipients use `.invalid` and cannot resolve publicly.
- Telephone identifiers, bearer tokens, webhook secrets, messages, tenants,
  and message IDs are visibly synthetic.
- Mailpit has no relay configuration and WireMock has no proxy/pass-through
  mapping.

Never replace these values with a real ToGrow credential, provider token,
telephone number, email address, customer message, or production tenant.

## One-command proof

Docker and Playwright Chromium must be available. Then run:

```text
npm run test:demo-communications
```

The command starts pinned Mailpit and WireMock containers, resets prior local
state, sends one synthetic receipt and one WhatsApp-style message, verifies the
`delivered → read → inbound_reply` sequence, opens the captured inbox in a real
browser, and removes the containers and volume even when the proof fails.

For manual inspection:

```text
npm run demo:communications:start
npm run demo:communications:test
open http://127.0.0.1:8025
npm run demo:communications:reset
npm run demo:communications:stop
```

Failure to start, reset, or inspect this documented local harness is a
repository reliability defect. It is not evidence that a real provider, real
identity, or upstream Hfe CORE access is required.

## Covered boundaries

Automated proofs cover:

- captured receipt delivery to the synthetic email endpoint;
- a matched WhatsApp-style outbound provider request;
- deterministic delivered, read, and inbound-reply events;
- HMAC signature rejection;
- duplicate webhook idempotency;
- cross-tenant webhook rejection;
- pinned container versions with no `latest` tag;
- fail-closed local-only endpoint classification.

Provider sandbox smoke tests require separate issue ownership and secret-backed
configuration. They are not ordinary pull-request gates.
