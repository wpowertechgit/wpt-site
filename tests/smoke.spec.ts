import { expect, test } from "@playwright/test";

test("homepage renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Waste Powertech/i);
  await expect(page.getByRole("link", { name: /technology/i })).toBeVisible();
});

test("main routes load", async ({ page }) => {
  await page.goto("/technology");
  await expect(page).toHaveURL(/\/technology$/);

  await page.goto("/applications");
  await expect(page).toHaveURL(/\/applications$/);
});
