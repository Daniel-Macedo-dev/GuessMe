import { test, expect } from "@playwright/test";
import { mockBoot } from "./helpers/api-mocks";

// ─── Mobile game page ─────────────────────────────────────────────────────────

test.describe("Mobile layout — 390 px (iPhone 14 proxy)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await mockBoot(page);
  });

  test("game page renders without horizontal overflow", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
    const overflow = await page.evaluate(
      () => document.body.scrollWidth > document.body.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("question input is visible and usable", async ({ page }) => {
    await page.goto("/game");
    const input = page.getByRole("textbox", { name: "Pergunta para a investigação" });
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
  });

  test("send button is visible", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByRole("button", { name: "Enviar" })).toBeVisible();
  });

  test("hint button is visible", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByRole("button", { name: /Solicitar pista/ })).toBeVisible();
  });

  test("answer chips are visible", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
    // At least one quick-pick chip is visible
    await expect(page.getByRole("button", { name: "É humano?" })).toBeVisible();
  });

  test("navbar brand is visible", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByRole("link", { name: "GuessMe" })).toBeVisible();
  });

  test("primary route navigation remains available", async ({ page }) => {
    await page.goto("/game");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Como funciona" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Jogo" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Estatísticas" })).toBeVisible();
  });
});

test.describe("Mobile layout — 360 px (small Android proxy)", () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await mockBoot(page);
  });

  test("game page renders without horizontal overflow", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
    const overflow = await page.evaluate(
      () => document.body.scrollWidth > document.body.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("question input is visible at 360 px", async ({ page }) => {
    await page.goto("/game");
    const input = page.getByRole("textbox", { name: "Pergunta para a investigação" });
    await expect(input).toBeVisible();
  });
});

// ─── Mobile home and manual pages ─────────────────────────────────────────────

test.describe("Mobile layout — Home and HowItWorks", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("home page renders without horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.body.scrollWidth > document.body.clientWidth,
    );
    expect(overflow).toBe(false);
    await expect(page.getByRole("heading", { name: "Desvende a identidade" })).toBeVisible();
  });

  test("how-it-works renders without horizontal overflow", async ({ page }) => {
    await page.goto("/how-it-works");
    const overflow = await page.evaluate(
      () => document.body.scrollWidth > document.body.clientWidth,
    );
    expect(overflow).toBe(false);
    await expect(page.getByRole("heading", { name: "Protocolo de Interrogação" })).toBeVisible();
  });

  test("how-it-works Abrir caso link is visible on mobile", async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await mockBoot(page);
    await page.goto("/how-it-works");
    await expect(page.getByRole("link", { name: "Abrir caso" })).toBeVisible();
  });
});
