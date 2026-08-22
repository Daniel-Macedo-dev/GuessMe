import { test, expect } from "@playwright/test";
import { mockBoot } from "./helpers/api-mocks";

// ─── Home ─────────────────────────────────────────────────────────────────────

test.describe("Home page", () => {
  test("renders investigation identity", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Desvende a identidade" })).toBeVisible();
    await expect(page.getByRole("link", { name: "GuessMe" })).toBeVisible();
    await expect(page.getByText("Jogo de Investigação")).toBeVisible();
  });

  test("shows three case-step cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Caso registrado")).toBeVisible();
    await expect(page.getByText("Evidências coletadas")).toBeVisible();
    await expect(page.getByText("Dossiê revelado")).toBeVisible();
  });

  test("does not show Vite default branding", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Vite + React")).not.toBeVisible();
    await expect(page.getByText("count is")).not.toBeVisible();
  });

  test("navigation bar has Home, Como funciona, and Jogo links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Como funciona" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Jogo" })).toBeVisible();
  });
});

// ─── HowItWorks ───────────────────────────────────────────────────────────────

test.describe("HowItWorks page", () => {
  test("renders manual do agente heading", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByRole("heading", { name: "Protocolo de Interrogação" })).toBeVisible();
  });

  test("shows five numbered steps", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByText("Abrir o caso")).toBeVisible();
    await expect(page.getByText("Formular perguntas")).toBeVisible();
    await expect(page.getByText("Ler as evidências")).toBeVisible();
    await expect(page.getByText("Solicitar intel")).toBeVisible();
    await expect(page.getByText("Revelar o suspeito")).toBeVisible();
  });

  test("shows evidence legend tags", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByText("Sim — confirmado")).toBeVisible();
    await expect(page.getByText("Não — descartado")).toBeVisible();
    await expect(page.getByText("Talvez — inconclusivo")).toBeVisible();
  });
});

// ─── Game page basic presence ─────────────────────────────────────────────────

test.describe("Game page", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await mockBoot(page);
  });

  test("renders game investigation header", async ({ page }) => {
    await page.goto("/game");
    await expect(
      page.getByRole("heading", { name: /Investigação/ }),
    ).toBeVisible();
  });

  test("renders question input and send button", async ({ page }) => {
    await page.goto("/game");
    await expect(
      page.getByRole("textbox", { name: "Pergunta para a investigação" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Enviar" })).toBeVisible();
  });

  test("renders hint button", async ({ page }) => {
    await page.goto("/game");
    await expect(
      page.getByRole("button", { name: /Solicitar pista/ }),
    ).toBeVisible();
  });
});

// ─── Navigation ───────────────────────────────────────────────────────────────

test.describe("Navigation", () => {
  test("updates the document title and marks the current route", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page).toHaveTitle("Manual do Agente — GuessMe");
    await expect(page.getByRole("link", { name: "Como funciona" })).toHaveAttribute("aria-current", "page");
  });

  test("offers a keyboard skip link to the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Ir para o conteúdo" });
    await expect(skipLink).toBeFocused();
    await skipLink.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("Home Abrir caso link goes to /game", async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await mockBoot(page);
    await page.goto("/");
    await page.getByRole("link", { name: "Abrir caso" }).first().click();
    await expect(page).toHaveURL("/game");
  });

  test("Home Manual do agente link goes to /how-it-works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Manual do agente" }).click();
    await expect(page).toHaveURL("/how-it-works");
  });

  test("Navbar Como funciona link navigates correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Como funciona" }).click();
    await expect(page).toHaveURL("/how-it-works");
    await expect(page.getByRole("heading", { name: "Protocolo de Interrogação" })).toBeVisible();
  });

  test("Navbar Jogo link goes to /game", async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await mockBoot(page);
    await page.goto("/");
    await page.getByRole("link", { name: "Jogo" }).click();
    await expect(page).toHaveURL("/game");
  });

  test("HowItWorks Abrir caso link goes to /game", async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await mockBoot(page);
    await page.goto("/how-it-works");
    await page.getByRole("link", { name: "Abrir caso" }).click();
    await expect(page).toHaveURL("/game");
  });

  test("unknown route redirects to Home", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Desvende a identidade" })).toBeVisible();
  });
});

// ─── SPA direct URL access ────────────────────────────────────────────────────

test.describe("SPA direct URL access", () => {
  test("opening /how-it-works directly renders page", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByRole("heading", { name: "Protocolo de Interrogação" })).toBeVisible();
  });

  test("opening /game directly renders game", async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await mockBoot(page);
    await page.goto("/game");
    await expect(
      page.getByRole("textbox", { name: "Pergunta para a investigação" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: /Investigação/ })).toBeVisible();
  });
});
