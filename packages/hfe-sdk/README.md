# @hfe/sdk (Headless Financial Engine TypeScript SDK)

Official TypeScript SDK for the Hfe CORE headless financial engine.
Generated from the canonical OpenAPI 3.1 SSOT specification.

## Installation

```bash
npm install @hfe/sdk
# or
bun add @hfe/sdk
# or
pnpm add @hfe/sdk
```

## Quick Start

```typescript
import { HfeClient } from "@hfe/sdk";

const client = new HfeClient({
  baseUrl: "https://api.hfe.id",
  apiKey: process.env.HFE_API_KEY,
});

// Inspect billing profile
const billing = await client.getCompanyBillingProfile("company-uuid-here");
console.log(billing);
```
