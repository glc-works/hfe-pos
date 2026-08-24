import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "demo-communications.spec.ts",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  preserveOutput: "always",
  outputDir: "test-results",
  use: {
    trace: "retain-on-failure",
    screenshot: "on",
  },
  projects: [
    {
      name: "Demo Communications Chrome",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
});
