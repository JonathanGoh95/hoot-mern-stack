// @ts-check
import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173/";

test("has title", async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hoots/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Sign In" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
});

test("incorrect sign in", async ({ page }) => {
  await page.goto(`${BASE_URL}/sign-in`);
  await page.getByLabel("Username").type("xxx");
  await page.getByLabel("Password").type("xxx");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByRole("paragraph")).toContainText("Error");
});
