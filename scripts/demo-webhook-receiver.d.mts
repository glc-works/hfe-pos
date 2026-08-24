export interface DemoWebhookResult {
  accepted: true;
  duplicate: boolean;
  status: string;
}

export interface DemoWebhookReceiver {
  receive(payload: string, signature: string): DemoWebhookResult;
}

export function signDemoWebhook(payload: string, secret: string): string;

export function createDemoWebhookReceiver(options: {
  secret: string;
  tenantId: string;
}): DemoWebhookReceiver;
