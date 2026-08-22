import { test, expect } from "@playwright/test";
import {
  mockBoot,
  mockCategories,
  mockStartUnavailable,
  mockAskCooldown,
  mockAskMaxQuestions,
  mockAskStaleSession,
  mockAskGeminiError,
  mockHintMax,
} from "./helpers/api-mocks";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("recovers from structurally invalid persisted game state", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "guessme:state:v5",
      JSON.stringify({
        messages: [{ id: "broken", sender: "AI", kind: "ai" }],
        questionsCount: 1,
        winner: null,
        category: "Geral",
        sessionId: "stale-session",
      }),
    );
  });
  await mockBoot(page);

  await page.goto("/game");

  await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
  await expect(page.getByRole("textbox", { name: "Pergunta para a investigação" })).toBeEnabled();
});

// ─── Backend unavailable ──────────────────────────────────────────────────────

test.describe("Backend unavailable", () => {
  test("shows error message when start request fails", async ({ page }) => {
    await mockCategories(page);
    await mockStartUnavailable(page);
    await page.goto("/game");
    // Either the errorBox or the error bubble in chat is sufficient
    await expect(page.getByTestId("error-box")).toBeVisible({ timeout: 10_000 });
  });

  test("shows Tentar novamente button on boot failure", async ({ page }) => {
    await mockCategories(page);
    await mockStartUnavailable(page);
    await page.goto("/game");
    await expect(
      page.getByRole("button", { name: "Tentar novamente" }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("does not duplicate a boot failure inside the transcript", async ({ page }) => {
    await mockCategories(page);
    await mockStartUnavailable(page);
    await page.goto("/game");
    await expect(page.getByTestId("error-box")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("chat-scroll")).not.toContainText("Não foi possível abrir o caso");
  });
});

// ─── Cooldown ─────────────────────────────────────────────────────────────────

test.describe("Cooldown warning", () => {
  test("cooldown response shows amber warning box", async ({ page }) => {
    await mockBoot(page);
    await mockAskCooldown(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("warning-box")).toBeVisible();
    await expect(page.getByTestId("warning-box")).toContainText("Aguarde");
  });

  test("cooldown does not add AI bubble to chat", async ({ page }) => {
    await mockBoot(page);
    await mockAskCooldown(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    const chatBubblesBefore = await page
      .getByTestId("chat-scroll")
      .locator(".msgRow")
      .count();

    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("rápido");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("warning-box")).toBeVisible();

    // Only user message added; no extra AI bubble beyond the opening one
    const chatBubblesAfter = await page
      .getByTestId("chat-scroll")
      .locator(".msgRow")
      .count();
    // +1 user bubble, no AI bubble for rejected request
    expect(chatBubblesAfter).toBe(chatBubblesBefore + 1);
  });
});

// ─── Max questions ────────────────────────────────────────────────────────────

test.describe("Max questions warning", () => {
  test("max questions response shows amber warning box", async ({ page }) => {
    await mockBoot(page);
    await mockAskMaxQuestions(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("Limite?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("warning-box")).toBeVisible();
    await expect(page.getByTestId("warning-box")).toContainText("Limite");
  });
});

// ─── Max hints ────────────────────────────────────────────────────────────────

test.describe("Max hints warning", () => {
  test("max hints response shows amber warning box", async ({ page }) => {
    await mockBoot(page);
    await mockHintMax(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("button", { name: /Solicitar pista/ }).click();
    await expect(page.getByTestId("warning-box")).toBeVisible();
    await expect(page.getByTestId("warning-box")).toContainText("Limite de dicas");
  });
});

// ─── Stale session ────────────────────────────────────────────────────────────

test.describe("Stale session", () => {
  test("session expired response shows error box", async ({ page }) => {
    await mockBoot(page);
    await mockAskStaleSession(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("Teste?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("error-box")).toBeVisible();
    await expect(page.getByTestId("error-box")).toContainText("expirada");
  });

  test("session expired error box shows Novo caso button", async ({ page }) => {
    await mockBoot(page);
    await mockAskStaleSession(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("Teste?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(
      page.getByTestId("error-box").getByRole("button", { name: "Novo caso" }),
    ).toBeVisible();
  });

  test("Novo caso button in error box restarts the game", async ({ page }) => {
    await mockBoot(page);
    await mockAskStaleSession(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("Teste?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("error-box")).toBeVisible();

    // Re-mock start for the restart
    await mockBoot(page);
    await page
      .getByTestId("error-box")
      .getByRole("button", { name: "Novo caso" })
      .click();

    await expect(page.getByTestId("error-box")).not.toBeVisible();
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
  });
});

// ─── Gemini system error ──────────────────────────────────────────────────────

test.describe("Gemini system error", () => {
  test("malformed API response shows a stable recovery message", async ({ page }) => {
    await mockBoot(page);
    await page.route("**/api/game/ask", async (route) => {
      await route.fulfill({ status: 200, contentType: "text/plain", body: "not-json" });
    });
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");

    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();

    await expect(page.getByTestId("error-box")).toContainText("Resposta inválida do servidor.");
    await expect(page.getByTestId("error-box")).not.toContainText("JSON");
  });

  test("wrong response field types show a stable recovery message", async ({ page }) => {
    await mockBoot(page);
    await page.route("**/api/game/ask", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ answer: { text: "Sim" }, success: "true", sessionId: 42 }),
      });
    });
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");

    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();

    await expect(page.getByTestId("error-box")).toContainText("Resposta inválida do servidor.");
    await expect(page.getByTestId("questions-count")).toHaveText("0");
  });

  test("Gemini API error shows cleaned message in error box", async ({
    page,
  }) => {
    await mockBoot(page);
    await mockAskGeminiError(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("error-box")).toBeVisible();
    // cleanGeminiError extracts the message from the JSON body
    await expect(page.getByTestId("error-box")).toContainText(
      "Erro da API Gemini (400)",
    );
    await expect(page.getByTestId("error-box")).toContainText(
      "API key not valid",
    );
  });

  test("Gemini error box does not show raw JSON braces", async ({ page }) => {
    await mockBoot(page);
    await mockAskGeminiError(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("error-box")).toBeVisible();
    // The raw JSON blob should not be shown as a string starting with {
    const boxText = await page.getByTestId("error-box").innerText();
    expect(boxText).not.toMatch(/^\{/);
    expect(boxText).not.toContain('"code":400');
  });

  test("Gemini error does not consume the question counter", async ({ page }) => {
    await mockBoot(page);
    await mockAskGeminiError(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();

    await expect(page.getByTestId("error-box")).toBeVisible();
    await expect(page.getByTestId("questions-count")).toContainText("0");
  });
});
