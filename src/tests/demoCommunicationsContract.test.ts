import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const contractPath = resolve(root, "fixtures/demo/communications/contract.json");
const composePath = resolve(root, "compose.demo-communications.yaml");
const wireMockMappingPath = resolve(
  root,
  "fixtures/demo/communications/wiremock/mappings/send-message.json",
);
const packagePath = resolve(root, "package.json");
const helperPath = resolve(root, "scripts/demo-communications.mjs");
const webhookFixturePaths = ["delivered", "read", "inbound-reply"].map((event) =>
  resolve(
    root,
    `fixtures/demo/communications/wiremock/mappings/webhook-${event}.json`,
  ),
);

describe("canonical demo communications contract", () => {
  it("materializes the pinned local-only provider harness", () => {
    expect(existsSync(contractPath)).toBe(true);
    expect(existsSync(composePath)).toBe(true);
    expect(existsSync(wireMockMappingPath)).toBe(true);
    expect(webhookFixturePaths.every((path) => existsSync(path))).toBe(true);

    const contract = JSON.parse(readFileSync(contractPath, "utf8"));
    const compose = readFileSync(composePath, "utf8");

    expect(contract).toMatchObject({
      contract_id: "hfe.demo-ecosystem",
      contract_version: "1.0.0",
      fixture_schema_version: 1,
      classification: "synthetic_test_only",
      public_delivery_allowed: false,
    });
    expect(contract.endpoints.email.address).toMatch(/\.invalid$/);
    expect(contract.endpoints.whatsapp.transport).toBe("wiremock_local_only");
    expect(compose).toContain("axllent/mailpit:v1.31.0");
    expect(compose).toContain("wiremock/wiremock:3.13.2");
    expect(compose).not.toContain(":latest");
  });

  it("exposes repository-native lifecycle and proof commands", () => {
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));

    expect(existsSync(helperPath)).toBe(true);
    expect(packageJson.scripts).toMatchObject({
      "demo:communications:start": expect.any(String),
      "demo:communications:reset": expect.any(String),
      "demo:communications:test": expect.any(String),
      "demo:communications:stop": expect.any(String),
    });
    const helper = readFileSync(helperPath, "utf8");
    expect(helper).toContain('fetch("http://127.0.0.1:8089/__admin/requests", {');
    expect(helper).toContain('method: "DELETE"');
  });
});
