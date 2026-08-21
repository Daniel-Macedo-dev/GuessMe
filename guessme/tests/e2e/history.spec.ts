import { test, expect, type Page } from "@playwright/test";
import { mockBoot, mockAskSim, mockAskNao, mockAskWin } from "./helpers/api-mocks";

const SEED_ENTRY = {
  id: "seed-case-001",
  createdAt: new Date("2026-06-01T10:00:00").getTime(),
  characterName: "Naruto Uzumaki",
  work: "Naruto",
  category: "Anime",
  questionCount: 3,
  hintCount: 1,
  messages: [
    { id: "m1", sender: "AI", text: "Pode fazer sua primeira pergunta!", ts: 1000, kind: "ai" },
    { id: "m2", sender: "Você", text: "É humano?", ts: 2000, kind: "user" },
    { id: "m3", sender: "AI", text: "Sim", ts: 3000, kind: "ai", verdict: "YES" },
    { id: "m4", sender: "Você", text: "É de anime?", ts: 4000, kind: "user" },
    { id: "m5", sender: "AI", text: "Sim", ts: 5000, kind: "ai", verdict: "YES" },
    { id: "m6", sender: "AI", text: "O personagem possui habilidades sobrenaturais.", ts: 5500, kind: "hint" },
    { id: "m7", sender: "Você", text: "É o Naruto?", ts: 6000, kind: "user" },
    {
      id: "m8",
      sender: "AI",
      text: "Sim! O personagem é Naruto Uzumaki.\nObra: Naruto",
      ts: 7000,
      kind: "ai",
      verdict: "YES",
    },
  ],
  evidence: {
    confirmed: [
      { id: "m3", question: "É humano?", answer: "Sim", kind: "confirmed" },
      { id: "m5", question: "É de anime?", answer: "Sim", kind: "confirmed" },
      { id: "m8", question: "É o Naruto?", answer: "Sim! O personagem é Naruto Uzumaki.\nObra: Naruto", kind: "confirmed" },
    ],
    refuted: [],
    inconclusive: [],
    hints: [{ id: "m6", text: "O personagem possui habilidades sobrenaturais." }],
  },
  solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
  winningQuestion: "É o Naruto?",
  verdictStats: { yes: 3, no: 0, maybe: 0, unknown: 0 },
};

// Seed localStorage before page navigation. Uses the two-arg form of addInitScript
// so the entries data is properly serialized into the browser context.
async function addSeedScript(page: Page, entries = [SEED_ENTRY]) {
  await page.addInitScript(
    (serialized) => localStorage.setItem("guessme.caseHistory.v1", serialized),
    JSON.stringify(entries),
  );
}

// ─── Setup ────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await mockBoot(page);
});

// ─── Empty state ──────────────────────────────────────────────────────────────

test.describe("History empty state", () => {
  test("renders history panel on game page", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-panel")).toBeVisible();
  });

  test("shows empty state message when no history", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-empty")).toBeVisible();
    await expect(page.getByTestId("history-empty")).toContainText(
      "Nenhum caso arquivado ainda",
    );
  });

  test("history panel has accessible label", async ({ page }) => {
    await page.goto("/game");
    await expect(
      page.getByRole("region", { name: "Histórico de Casos" }),
    ).toBeVisible();
  });
});

// ─── Seeded history cards ─────────────────────────────────────────────────────

test.describe("History cards from seeded storage", () => {
  test.beforeEach(async ({ page }) => {
    await addSeedScript(page);
  });

  test("renders history card with character name", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-card-name")).toContainText(
      "Naruto Uzumaki",
    );
  });

  test("renders history card with work name", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-card-work")).toContainText("Naruto");
  });

  test("renders history card with question count", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-card-questions")).toContainText("3");
  });

  test("does not show empty state when history has entries", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-empty")).not.toBeVisible();
  });

  test("clear button visible when history has entries", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-clear-btn")).toBeVisible();
  });
});

test.describe("History empty state — no clear button", () => {
  test("no clear button when history is empty", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-empty")).toBeVisible();
    await expect(page.getByTestId("history-clear-btn")).not.toBeVisible();
  });
});

// ─── Victory saves case ───────────────────────────────────────────────────────

test.describe("Victory saves case to history", () => {
  test("history card appears after winning a game", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É o Naruto?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByTestId("history-card-name")).toContainText("Naruto Uzumaki");
  });

  test("victory save does not create duplicates on modal re-render", async ({ page }) => {
    await mockAskWin(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É o Naruto?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByTestId("history-card")).toHaveCount(1);
  });
});

// ─── Persistence after reload ─────────────────────────────────────────────────

test.describe("Case history persists across page reloads", () => {
  test.beforeEach(async ({ page }) => {
    await addSeedScript(page);
  });

  test("seeded history card survives page reload", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-card-name")).toContainText("Naruto Uzumaki");
    await page.reload();
    await expect(page.getByTestId("history-card-name")).toContainText("Naruto Uzumaki");
  });
});

// ─── Replay modal ─────────────────────────────────────────────────────────────

test.describe("Case replay modal", () => {
  test.beforeEach(async ({ page }) => {
    await addSeedScript(page);
  });

  test("replay modal opens when clicking Rever caso", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    await expect(page.getByTestId("replay-modal")).toBeVisible();
  });

  test("replay shows character name", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    await expect(page.getByTestId("replay-character")).toContainText("Naruto Uzumaki");
  });

  test("replay shows question/answer timeline", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    const timeline = page.getByTestId("replay-timeline");
    await expect(timeline).toBeVisible();
    await expect(timeline).toContainText("É humano?");
    await expect(timeline).toContainText("Sim");
  });

  test("replay timeline shows verdict-colored bubbles", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    const timeline = page.getByTestId("replay-timeline");
    await expect(timeline.locator(".bubbleSim").first()).toBeVisible();
  });

  test("replay shows evidence snapshot with confirmed section", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    await expect(page.getByTestId("replay-evidence-snapshot")).toBeVisible();
    await expect(page.getByTestId("replay-evidence-confirmed")).toBeVisible();
  });

  test("replay shows intel section", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    await expect(page.getByTestId("replay-evidence-intel")).toBeVisible();
  });

  test("replay shows winning question", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    await expect(page.getByTestId("replay-winning-question")).toContainText("É o Naruto?");
  });

  test("replay modal closes with close button", async ({ page }) => {
    await page.goto("/game");
    const replayButton = page.getByTestId("history-replay-btn").first();
    await replayButton.click();
    await expect(page.getByTestId("replay-modal")).toBeVisible();
    await page.getByTestId("replay-close-btn").click();
    await expect(page.getByTestId("replay-modal")).not.toBeVisible();
    await expect(replayButton).toBeFocused();
  });

  test("replay modal closes with Escape key", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    await expect(page.getByTestId("replay-modal")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("replay-modal")).not.toBeVisible();
  });

  test("replay is read-only and has no question input", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    const modal = page.getByTestId("replay-modal");
    await expect(modal.getByRole("textbox")).toHaveCount(0);
  });
});

// ─── Delete one case ──────────────────────────────────────────────────────────

test.describe("Delete history entry", () => {
  test.beforeEach(async ({ page }) => {
    await addSeedScript(page);
  });

  test("deleting a case removes its card from the panel", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-card")).toBeVisible();
    await page.getByTestId("history-delete-btn").first().click();
    await expect(page.getByTestId("history-card")).not.toBeVisible();
    await expect(page.getByTestId("history-empty")).toBeVisible();
  });

  test("deletion is written to localStorage", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-delete-btn").first().click();
    await expect(page.getByTestId("history-empty")).toBeVisible();
    const stored = await page.evaluate(() =>
      localStorage.getItem("guessme.caseHistory.v1"),
    );
    expect(JSON.parse(stored ?? "[]")).toHaveLength(0);
  });
});

// ─── Clear all history ────────────────────────────────────────────────────────

test.describe("Clear all history", () => {
  test.beforeEach(async ({ page }) => {
    const twoEntries = [
      SEED_ENTRY,
      { ...SEED_ENTRY, id: "seed-case-002", characterName: "Goku", work: "Dragon Ball Z" },
    ];
    await addSeedScript(page, twoEntries);
  });

  test("clear all removes all cards and shows empty state", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-card")).toHaveCount(2);
    await page.getByTestId("history-clear-btn").click();
    await expect(page.getByTestId("history-empty")).toBeVisible();
    await expect(page.getByTestId("history-card")).toHaveCount(0);
  });
});

// ─── Corrupted storage fallback ───────────────────────────────────────────────

test.describe("Corrupted storage graceful fallback", () => {
  test("shows empty state when localStorage has corrupted history JSON", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("guessme.caseHistory.v1", "{{INVALID JSON}}");
    });
    await page.goto("/game");
    await expect(page.getByTestId("history-empty")).toBeVisible();
  });

  test("game still boots normally with corrupted history storage", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("guessme.caseHistory.v1", "not-json");
    });
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
  });
});

// ─── History does not break game flow ─────────────────────────────────────────

test.describe("History does not break existing game flow", () => {
  test("game boots and works normally when history is empty", async ({ page }) => {
    await mockAskSim(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É humano?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("chat-scroll")).toContainText("Sim");
  });

  test("game boots and works normally when history has entries", async ({ page }) => {
    await addSeedScript(page);
    await mockAskNao(page);
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
    await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É vilão?");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByTestId("chat-scroll")).toContainText("Não");
  });
});

// ─── Mobile layout ────────────────────────────────────────────────────────────

test.describe("History mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await addSeedScript(page);
  });

  test("history panel is visible on 390px viewport", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-panel")).toBeVisible();
  });

  test("history card is visible on 390px viewport", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-card")).toBeVisible();
  });

  test("replay modal is usable on 390px viewport", async ({ page }) => {
    await page.goto("/game");
    await page.getByTestId("history-replay-btn").first().click();
    await expect(page.getByTestId("replay-modal")).toBeVisible();
    await expect(page.getByTestId("replay-character")).toBeVisible();
  });
});
