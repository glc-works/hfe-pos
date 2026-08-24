import { createHmac, timingSafeEqual } from "node:crypto";

export function signDemoWebhook(payload, secret) {
  return `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
}

function signaturesMatch(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function createDemoWebhookReceiver({ secret, tenantId }) {
  const acceptedEventIds = new Set();

  return {
    receive(payload, signature) {
      const expectedSignature = signDemoWebhook(payload, secret);
      if (!signaturesMatch(signature, expectedSignature)) {
        throw new Error("Invalid webhook signature");
      }

      const event = JSON.parse(payload);
      if (event.tenant_id !== tenantId) {
        throw new Error("Webhook tenant mismatch");
      }
      const duplicate = acceptedEventIds.has(event.event_id);
      acceptedEventIds.add(event.event_id);
      return { accepted: true, duplicate, status: event.status };
    },
  };
}
