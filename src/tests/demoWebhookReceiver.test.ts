import { describe, expect, it } from "vitest";

describe("demo WhatsApp webhook receiver", () => {
  it("verifies signatures, rejects cross-tenant events, and deduplicates delivery", async () => {
    const { createDemoWebhookReceiver, signDemoWebhook } = await import(
      "../../scripts/demo-webhook-receiver.mjs"
    );
    const receiver = createDemoWebhookReceiver({
      secret: "synthetic-webhook-secret",
      tenantId: "tenant.nusantara",
    });
    const payload = JSON.stringify({
      event_id: "event.synthetic.delivered.001",
      tenant_id: "tenant.nusantara",
      status: "delivered",
      message_id: "wamid.synthetic-demo-message-001",
    });
    const signature = signDemoWebhook(payload, "synthetic-webhook-secret");

    expect(receiver.receive(payload, signature)).toEqual({
      accepted: true,
      duplicate: false,
      status: "delivered",
    });
    expect(receiver.receive(payload, signature)).toEqual({
      accepted: true,
      duplicate: true,
      status: "delivered",
    });
    expect(() => receiver.receive(payload, "sha256=invalid")).toThrow(
      "Invalid webhook signature",
    );

    const crossTenant = JSON.stringify({
      event_id: "event.synthetic.cross-tenant.001",
      tenant_id: "tenant.hfeit",
      status: "read",
      message_id: "wamid.synthetic-demo-message-001",
    });
    expect(() =>
      receiver.receive(
        crossTenant,
        signDemoWebhook(crossTenant, "synthetic-webhook-secret"),
      ),
    ).toThrow("Webhook tenant mismatch");
  });
});
