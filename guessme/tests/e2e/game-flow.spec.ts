import { test, expect } from "@playwright/test";
import {
  mockBoot,
  mockAskSim,
  mockAskNao,
  mockAskTalvez,
  mockAskWin,
  mockHint,
  CATEGORIES,
} from "./helpers/api-mocks";

// Clear stored game state before each test so the hook always boots fresh.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await mockBoot(page);
});

// ─── Boot ─────────────────────────────────────────────────────────────────────

test.describe("Game boot", () => {
  test("auto-starts and shows AI opening message in chat", async ({ page }) => {
    await page.goto("/game");
    const chat = page.getByTestId("chat-scroll");
    await expect(chat).toContainText("Pode fazer sua primeira pergunta!");
  });

  test("shows case status badge Caso Aberto", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByText("Caso Aberto")).toBeVisible();
  });

  test("shows investigation phase label when no questions asked", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByText("Nenhuma evidência coletada")).toBeVisible();
  });
});

// ─── Category ─────────────────────────────────────────────────────────────────

test.describe("Category select", () => {
  test("loads and displays all categories in dropdown menu", async ({ page }) => {
    await page.goto("/game");
    // Wait for boot to complete
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page
      .getByRole("button", { name: /Domínio/ })
      .click();
    for (const cat of CATEGORIES) {
      await expect(
        page.getByRole("menuitemradio", { name: cat }),
      ).toBeVisible();
    }
  });

  test("changing category restarts the case with new category message", async ({
    page,
  }) => {
    await mockBoot(page, "Anime"); // override start for the restart
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );

    await page.getByRole("button", { name: /Domínio/ }).click();
    await page.getByRole("menuitemradio", { name: "Anime" }).click();

    await expect(page.getByTestId("chat-scroll")).toContainText("Anime");
  });
});

// ─── Question input ───────────────────────────────────────────────────────────

test.describe("Question input behaviour", () => {
  test("send button is disabled while input is empty", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await expect(page.getByRole("button", { name: "Enviar" })).toBeDisabled();
  });

  test("send button enables when input has text", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    const input = page.getByRole("textbox", {
      name: "Pergunta para a investigação",
    });
    await input.fill("É humano?");
    await expect(page.getByRole("button", { name: "Enviar" })).toBeEnabled();
  });

  test("overlong question (301 chars) disables send button", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    const input = page.getByRole("textbox", {
      name: "Pergunta para a investigação",
    });
    await input.fill("x".repeat(301));
    await expect(page.getByRole("button", { name: "Enviar" })).toBeDisabled();
  });

  test("character counter shows over-limit state at 301 chars", async ({
    page,
  }) => {
    await page.goto("/game");
    await page
      .getByRole("textbox", { name: "Pergunta para a investigação" })
      .fill("x".repeat(301));
    // The char counter shows 301/300
    await expect(page.getByText("301/300")).toBeVisible();
  });

  test("question can be submitted with Enter key", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    const input = page.getByRole("textbox", {
      name: "Pergunta para a investigação",
    });
    await input.fill("É famoso?");
    await input.press("Enter");
    await expect(page.getByTestId("chat-scroll")).toContainText("É famoso?");
  });

  test("input clears after submission", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    const input = page.getByRole("textbox", {
      name: "Pergunta para a investigação",
    });
    await input.fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(input).toHaveValue("");
  });
});

// ─── AI answer states ─────────────────────────────────────────────────────────

test.describe("AI answer states", () => {
  async function sendQuestion(page: import("@playwright/test").Page) {
    const chat = page.getByTestId("chat-scroll");
    await expect(chat).toContainText("primeira pergunta");
    const input = page.getByRole("textbox", {
      name: "Pergunta para a investigação",
    });
    await input.fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();
    return chat;
  }

  test("Sim response appears in chat and gets green bubble", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    const chat = await sendQuestion(page);
    await expect(chat).toContainText("Sim");
    const simBubble = chat.locator(".bubbleSim");
    await expect(simBubble).toBeVisible();
  });

  test("Não response appears in chat and gets red bubble", async ({ page }) => {
    await mockAskNao(page);
    await page.goto("/game");
    const chat = await sendQuestion(page);
    await expect(chat).toContainText("Não");
    const naoBubble = chat.locator(".bubbleNao");
    await expect(naoBubble).toBeVisible();
  });

  test("Talvez response appears in chat and gets amber bubble", async ({
    page,
  }) => {
    await mockAskTalvez(page);
    await page.goto("/game");
    const chat = await sendQuestion(page);
    await expect(chat).toContainText("Talvez");
    const talvezBubble = chat.locator(".bubbleTalvez");
    await expect(talvezBubble).toBeVisible();
  });

  test("user message bubble appears in chat with Você sender", async ({
    page,
  }) => {
    await mockAskSim(page);
    await page.goto("/game");
    const chat = await sendQuestion(page);
    // The user bubble is in .msgRow.user and shows the sender label "Você"
    await expect(chat.locator(".msgRow.user")).toContainText("Você");
    await expect(chat.locator(".msgRow.user")).toContainText("É humano?");
  });

  test("questions counter increments after AI responds", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    const chat = page.getByTestId("chat-scroll");
    await expect(chat).toContainText("primeira pergunta");
    await expect(page.getByText("Nenhuma evidência coletada")).toBeVisible();

    const input = page.getByRole("textbox", {
      name: "Pergunta para a investigação",
    });
    await input.fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(chat).toContainText("Sim");
    // Stats bar shows 1 interrogação, phase label changes
    await expect(page.locator(".statValue")).toContainText("1");
  });
});

// ─── Hint ─────────────────────────────────────────────────────────────────────

test.describe("Hint flow", () => {
  test("hint button triggers request and shows hint bubble in chat", async ({
    page,
  }) => {
    await mockHint(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("button", { name: /Solicitar pista/ }).click();
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "habilidades sobrenaturais",
    );
  });

  test("hint bubble uses amber hint style", async ({ page }) => {
    await mockHint(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("button", { name: /Solicitar pista/ }).click();
    const hintBubble = page.getByTestId("chat-scroll").locator(".bubbleHint");
    await expect(hintBubble).toBeVisible();
  });

  test("hint sender label shows Nova pista", async ({ page }) => {
    await mockHint(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("button", { name: /Solicitar pista/ }).click();
    await expect(page.getByTestId("chat-scroll")).toContainText("Nova pista");
  });
});

// ─── Victory / solved flow ────────────────────────────────────────────────────

test.describe("Victory flow", () => {
  test("correct guess opens victory modal with Caso Encerrado", async ({
    page,
  }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    const input = page.getByRole("textbox", {
      name: "Pergunta para a investigação",
    });
    await input.fill("É o Naruto?");
    await page.getByRole("button", { name: "Enviar" }).click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Caso Encerrado");
  });

  test("victory modal shows character name", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É o Naruto?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByRole("dialog")).toContainText("Naruto Uzumaki");
  });

  test("victory modal shows work name", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É o Naruto?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByRole("dialog")).toContainText("Naruto");
  });

  test("game header changes to Investigação Concluída after win", async ({
    page,
  }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É o Naruto?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(
      page.getByRole("heading", { name: "Investigação Concluída" }),
    ).toBeVisible();
  });

  test("Novo caso button in victory modal restarts game", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText(
      "primeira pergunta",
    );
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É o Naruto?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    // Re-mock start for the restart
    await mockBoot(page);
    await page.getByRole("dialog").getByRole("button", { name: "Novo caso" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Investigação/ }),
    ).toBeVisible();
  });
});
