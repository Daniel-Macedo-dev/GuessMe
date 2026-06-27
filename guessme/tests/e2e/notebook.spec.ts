import { test, expect } from "@playwright/test";
import {
  mockBoot,
  mockAskSim,
  mockAskNao,
  mockAskTalvez,
  mockAskWin,
  mockHint,
} from "./helpers/api-mocks";

// ─── Shared setup ─────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await mockBoot(page);
});

async function waitForBoot(page: import("@playwright/test").Page) {
  await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
}

async function sendAndWait(page: import("@playwright/test").Page, question: string, expectedReply: string) {
  await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill(question);
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByTestId("chat-scroll")).toContainText(expectedReply);
}

// ─── Notebook presence ────────────────────────────────────────────────────────

test.describe("Evidence Notebook presence", () => {
  test("notebook renders on game page", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("evidence-notebook")).toBeVisible();
  });

  test("notebook has accessible label", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByRole("complementary", { name: "Caderno de Evidências" })).toBeVisible();
  });
});

// ─── Empty state ──────────────────────────────────────────────────────────────

test.describe("Notebook empty state", () => {
  test("shows empty state before any questions", async ({ page }) => {
    await page.goto("/game");
    await waitForBoot(page);
    await expect(page.getByTestId("evidence-empty")).toBeVisible();
  });

  test("empty state contains guidance text", async ({ page }) => {
    await page.goto("/game");
    await waitForBoot(page);
    await expect(page.getByTestId("evidence-empty")).toContainText("Sem evidências");
  });

  test("confirmed section hidden when no Sim answers", async ({ page }) => {
    await page.goto("/game");
    await waitForBoot(page);
    await expect(page.getByTestId("evidence-confirmed")).not.toBeVisible();
  });

  test("intel section hidden when no hints requested", async ({ page }) => {
    await page.goto("/game");
    await waitForBoot(page);
    await expect(page.getByTestId("evidence-intel")).not.toBeVisible();
  });
});

// ─── Confirmed evidence ───────────────────────────────────────────────────────

test.describe("Confirmed evidence entries", () => {
  test("confirmed section appears after Sim answer", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É humano?", "Sim");
    await expect(page.getByTestId("evidence-confirmed")).toBeVisible();
  });

  test("empty state disappears after first confirmed entry", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É humano?", "Sim");
    await expect(page.getByTestId("evidence-empty")).not.toBeVisible();
  });

  test("confirmed entry shows the question asked", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É humano?", "Sim");
    await expect(page.getByTestId("evidence-confirmed")).toContainText("É humano?");
  });

  test("confirmed entry shows Sim verdict badge", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É famoso?", "Sim");
    const section = page.getByTestId("evidence-confirmed");
    await expect(section.locator(".nbVerdictSim")).toBeVisible();
  });

  test("confirmed section title shows entry count", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É humano?", "Sim");
    await expect(page.getByTestId("evidence-confirmed")).toContainText("Confirmado");
  });
});

// ─── Refuted evidence ─────────────────────────────────────────────────────────

test.describe("Refuted evidence entries", () => {
  test("refuted section appears after Não answer", async ({ page }) => {
    await mockAskNao(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É vilão?", "Não");
    await expect(page.getByTestId("evidence-refuted")).toBeVisible();
  });

  test("refuted entry shows the question asked", async ({ page }) => {
    await mockAskNao(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É vilão?", "Não");
    await expect(page.getByTestId("evidence-refuted")).toContainText("É vilão?");
  });

  test("refuted entry shows Não verdict badge", async ({ page }) => {
    await mockAskNao(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É vilão?", "Não");
    await expect(page.getByTestId("evidence-refuted").locator(".nbVerdictNao")).toBeVisible();
  });

  test("confirmed section not shown when all answers are Não", async ({ page }) => {
    await mockAskNao(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É vilão?", "Não");
    await expect(page.getByTestId("evidence-confirmed")).not.toBeVisible();
  });
});

// ─── Inconclusive evidence ────────────────────────────────────────────────────

test.describe("Inconclusive evidence entries", () => {
  test("inconclusive section appears after Talvez answer", async ({ page }) => {
    await mockAskTalvez(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "Tem poderes?", "Talvez");
    await expect(page.getByTestId("evidence-inconclusive")).toBeVisible();
  });

  test("inconclusive entry shows the question", async ({ page }) => {
    await mockAskTalvez(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "Tem poderes?", "Talvez");
    await expect(page.getByTestId("evidence-inconclusive")).toContainText("Tem poderes?");
  });

  test("inconclusive entry shows Talvez verdict badge", async ({ page }) => {
    await mockAskTalvez(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "Tem poderes?", "Talvez");
    await expect(page.getByTestId("evidence-inconclusive").locator(".nbVerdictTalvez")).toBeVisible();
  });
});

// ─── Intel / hints ────────────────────────────────────────────────────────────

test.describe("Intel entries from hints", () => {
  test("intel section appears after requesting a hint", async ({ page }) => {
    await mockHint(page);
    await page.goto("/game");
    await waitForBoot(page);
    await page.getByRole("button", { name: /Solicitar pista/ }).click();
    await expect(page.getByTestId("chat-scroll")).toContainText("habilidades sobrenaturais");
    await expect(page.getByTestId("evidence-intel")).toBeVisible();
  });

  test("intel entry shows hint text", async ({ page }) => {
    await mockHint(page);
    await page.goto("/game");
    await waitForBoot(page);
    await page.getByRole("button", { name: /Solicitar pista/ }).click();
    await expect(page.getByTestId("chat-scroll")).toContainText("habilidades sobrenaturais");
    await expect(page.getByTestId("evidence-intel")).toContainText("habilidades sobrenaturais");
  });

  test("intel entry shows Pista verdict badge", async ({ page }) => {
    await mockHint(page);
    await page.goto("/game");
    await waitForBoot(page);
    await page.getByRole("button", { name: /Solicitar pista/ }).click();
    await expect(page.getByTestId("chat-scroll")).toContainText("habilidades sobrenaturais");
    await expect(page.getByTestId("evidence-intel").locator(".nbVerdictIntel")).toBeVisible();
  });
});

// ─── Solved notebook summary ──────────────────────────────────────────────────

test.describe("Solved case notebook summary", () => {
  test("notebook solved summary appears after victory", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É o Naruto?", "Sim");
    await expect(page.getByTestId("notebook-solved")).toBeVisible();
  });

  test("solved summary shows character name", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É o Naruto?", "Sim");
    await expect(page.getByTestId("notebook-solved")).toContainText("Naruto Uzumaki");
  });

  test("solved summary shows work", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É o Naruto?", "Sim");
    await expect(page.getByTestId("notebook-solved")).toContainText("Naruto");
  });

  test("solved summary shows Caso Encerrado stamp", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É o Naruto?", "Sim");
    await expect(page.getByTestId("notebook-solved")).toContainText("Caso Encerrado");
  });

  test("winning answer appears in confirmed evidence section", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await waitForBoot(page);
    await sendAndWait(page, "É o Naruto?", "Sim");
    await expect(page.getByTestId("evidence-confirmed")).toBeVisible();
    await expect(page.getByTestId("evidence-confirmed")).toContainText("É o Naruto?");
  });
});

// ─── Mobile layout ────────────────────────────────────────────────────────────

test.describe("Notebook mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("notebook is visible on mobile below the chat", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("evidence-notebook")).toBeVisible();
  });

  test("notebook does not cause horizontal overflow on mobile", async ({ page }) => {
    await page.goto("/game");
    await waitForBoot(page);
    const overflow = await page.evaluate(
      () => document.body.scrollWidth > document.body.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("empty state visible on mobile", async ({ page }) => {
    await page.goto("/game");
    await waitForBoot(page);
    await expect(page.getByTestId("evidence-empty")).toBeVisible();
  });
});
