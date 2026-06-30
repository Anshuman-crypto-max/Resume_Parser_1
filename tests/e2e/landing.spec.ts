import { expect, test } from "@playwright/test";

test("landing page renders product and CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Resume Parser" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open app/i })).toBeVisible();
});
