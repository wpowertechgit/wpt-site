import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/technology", "/applications"];

for (const route of ROUTES) {
  test(`axe scan: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? "")
    );

    expect(
      blocking,
      `Found blocking accessibility issues on ${route}`
    ).toHaveLength(0);
  });
}
