import { expect, test } from "@playwright/test";

test("captured synthetic receipt is readable in the local Mailpit inbox", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:8025");
  await expect(page.getByText("Synthetic Nusantara receipt", { exact: true })).toBeVisible();
  await page.getByText("Synthetic Nusantara receipt", { exact: true }).click();
  await expect(
    page.getByRole("link", { name: "owner@nusantara.demo.invalid", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Synthetic receipt only. No public delivery.", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/demo-communications-mailpit.png",
    fullPage: true,
  });
});
