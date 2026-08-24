#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import net from "node:net";
import {
  createDemoWebhookReceiver,
  signDemoWebhook,
} from "./demo-webhook-receiver.mjs";

const composeFile = "compose.demo-communications.yaml";
const contract = JSON.parse(
  readFileSync("fixtures/demo/communications/contract.json", "utf8"),
);

function compose(...args) {
  execFileSync("docker", ["compose", "-f", composeFile, ...args], {
    stdio: "inherit",
  });
}

async function waitFor(serviceName, request, attempts = 30) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await request();
      if (response.ok) return;
    } catch {
      // The local container may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Local demo service did not become ready: ${serviceName}`);
}

async function smtpCommand(socket, command, expectedCode) {
  await new Promise((resolve, reject) => {
    const onData = (data) => {
      const response = data.toString();
      if (!response.startsWith(String(expectedCode))) {
        reject(new Error(`SMTP command failed: ${response.trim()}`));
        return;
      }
      resolve();
    };
    socket.once("data", onData);
    if (command) socket.write(`${command}\r\n`);
  });
}

async function sendSyntheticEmail() {
  const recipient = contract.endpoints.email.address;
  if (!recipient.endsWith(".invalid") || contract.public_delivery_allowed) {
    throw new Error("Demo email delivery must remain synthetic and local-only");
  }

  const socket = net.createConnection({ host: "127.0.0.1", port: 1025 });
  await smtpCommand(socket, "", 220);
  await smtpCommand(socket, "EHLO hfe-pos.demo.invalid", 250);
  await smtpCommand(socket, "MAIL FROM:<receipt@hfe-pos.demo.invalid>", 250);
  await smtpCommand(socket, `RCPT TO:<${recipient}>`, 250);
  await smtpCommand(socket, "DATA", 354);
  await smtpCommand(
    socket,
    [
      `From: HFE POS Demo <receipt@hfe-pos.demo.invalid>`,
      `To: ${recipient}`,
      "Subject: Synthetic Nusantara receipt",
      "X-HFE-Contract: hfe.demo-ecosystem@1.0.0",
      "X-HFE-Tenant: tenant.nusantara",
      "Content-Type: text/plain; charset=utf-8",
      "",
      "Synthetic receipt only. No public delivery.",
      ".",
    ].join("\r\n"),
    250,
  );
  socket.end("QUIT\r\n");
}

async function sendSyntheticWhatsApp() {
  if (contract.endpoints.whatsapp.transport !== "wiremock_local_only") {
    throw new Error("Demo WhatsApp transport must remain local-only");
  }
  const response = await fetch(
    "http://127.0.0.1:8089/v23.0/000000000099/messages",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer synthetic-local-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: contract.endpoints.whatsapp.recipient,
        type: "template",
        template: { name: "synthetic_receipt", language: { code: "en_US" } },
      }),
    },
  );
  if (!response.ok) throw new Error(`WhatsApp mock rejected request: ${response.status}`);
  const body = await response.json();
  if (body.messages?.[0]?.id !== "wamid.synthetic-demo-message-001") {
    throw new Error("WhatsApp mock returned an unexpected message ID");
  }
}

async function reset() {
  await waitFor("Mailpit", () => fetch("http://127.0.0.1:8025/livez"));
  await waitFor("WireMock", () =>
    fetch("http://127.0.0.1:8089/__admin/mappings"),
  );
  const mailpit = await fetch("http://127.0.0.1:8025/api/v1/messages", {
    method: "DELETE",
  });
  if (!mailpit.ok) throw new Error(`Mailpit reset failed: ${mailpit.status}`);
  const wireMock = await fetch("http://127.0.0.1:8089/__admin/requests", {
    method: "DELETE",
  });
  if (!wireMock.ok) throw new Error(`WireMock reset failed: ${wireMock.status}`);
}

async function proof() {
  await reset();
  await sendSyntheticEmail();
  await sendSyntheticWhatsApp();

  const inbox = await fetch(
    "http://127.0.0.1:8025/api/v1/search?query=subject%3A%22Synthetic%20Nusantara%20receipt%22",
  ).then((response) => response.json());
  if (inbox.messages_count !== 1) {
    throw new Error(`Expected one captured email, received ${inbox.messages_count}`);
  }

  const requests = await fetch(
    "http://127.0.0.1:8089/__admin/requests?method=POST&url=/v23.0/000000000099/messages",
  ).then((response) => response.json());
  if (requests.meta?.total !== 1) {
    throw new Error(`Expected one WhatsApp request, received ${requests.meta?.total}`);
  }

  const receiver = createDemoWebhookReceiver({
    secret: "synthetic-webhook-secret",
    tenantId: "tenant.nusantara",
  });
  const statuses = [];
  for (const eventName of ["delivered", "read", "inbound-reply"]) {
    const event = await fetch(
      `http://127.0.0.1:8089/__demo/events/${eventName}`,
    ).then((response) => response.json());
    const payload = JSON.stringify(event);
    statuses.push(
      receiver.receive(
        payload,
        signDemoWebhook(payload, "synthetic-webhook-secret"),
      ).status,
    );
  }
  if (statuses.join(",") !== "delivered,read,inbound_reply") {
    throw new Error(`Unexpected webhook sequence: ${statuses.join(",")}`);
  }
  console.log(
    "Demo communications proof passed: email captured; WhatsApp sent, delivered, read, and replied locally",
  );
}

const command = process.argv[2];
if (command === "start") {
  compose("up", "-d", "--wait");
} else if (command === "reset") {
  await reset();
} else if (command === "test") {
  await proof();
} else if (command === "stop") {
  compose("down", "--volumes", "--remove-orphans");
} else {
  console.error("Usage: demo-communications.mjs <start|reset|test|stop>");
  process.exitCode = 2;
}
