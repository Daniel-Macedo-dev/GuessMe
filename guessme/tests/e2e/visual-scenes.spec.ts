import { test, expect } from "@playwright/test";
import { mockBoot } from "./helpers/api-mocks";

/**
 * Structural safety of the original visual asset system (linework scenes,
 * seals, archival marks): decorative SVGs must stay hidden from the
 * accessibility tree, must never intercept interaction, and must not
 * break layout at narrow widths.
 */

const HISTORY_SEED = JSON.stringify([
  {
    id: "1751230000000-a3f2c1",
    createdAt: 1751230000000,
    characterName: "Naruto Uzumaki",
    work: "Naruto",
    category: "Anime",
    questionCount: 8,
    hintCount: 2,
    messages: [],
    evidence: {
      confirmed: [{ id: "c1", question: "É de anime?", answer: "Sim", kind: "confirmed" }],
      refuted: [],
      inconclusive: [],
      hints: [],
    },
    solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
    winningQuestion: "É o Naruto?",
    verdictStats: { yes: 4, no: 2, maybe: 1, unknown: 0 },
  },
]);

const VICTORY_SEED = JSON.stringify({
  sessionId: "scene-session-001",
  category: "Anime",
  questionsCount: 5,
  winner: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
  messages: [
    { id: "m1", sender: "Você", text: "É o Naruto?", ts: 1, kind: "user" },
    { id: "m2", sender: "AI", text: "Sim! Identidade confirmada.", ts: 2, kind: "ai", verdict: "YES" },
  ],
});

// ─── Home case-opening scene ──────────────────────────────────────────────────

test.describe("Home case-opening scene", () => {
  test("hero scene is decorative and does not hide the headline", async ({ page }) => {
    await page.goto("/");
    const scene = page.locator(".heroCaseFileScene svg");
    await expect(scene).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByRole("heading", { name: "Desvende a identidade" })).toBeVisible();
  });

  test("no horizontal overflow at 360px with the scene", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(360);
  });

  test("stacked protocol keeps all three steps readable at 768px", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.getByText("Caso registrado")).toBeVisible();
    await expect(page.getByText("Evidências coletadas")).toBeVisible();
    await expect(page.getByText("Dossiê revelado")).toBeVisible();
  });
});

// ─── Notebook evidence-network scene ──────────────────────────────────────────

test.describe("Notebook empty scene", () => {
  test("empty notebook shows the scene without hiding the status text", async ({ page }) => {
    await mockBoot(page);
    await page.goto("/game");
    const empty = page.getByTestId("evidence-empty");
    await expect(empty).toBeVisible();
    await expect(empty.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(empty.getByText("Sem evidências ainda.")).toBeVisible();
  });
});

// ─── Case history archival marks ──────────────────────────────────────────────

test.describe("History archival visual language", () => {
  test("archived card shows the filing reference code", async ({ page }) => {
    await page.addInitScript(
      (data: string) => localStorage.setItem("guessme.caseHistory.v1", data),
      HISTORY_SEED,
    );
    await mockBoot(page);
    await page.goto("/archive");
    const card = page.getByTestId("history-card").first();
    await expect(card).toBeVisible();
    await expect(card.getByText("REF A3F2C1")).toBeVisible();
  });

  test("empty archive shows the drawer scene and status text", async ({ page }) => {
    await mockBoot(page);
    await page.goto("/archive");
    const empty = page.locator(".archiveEmpty");
    await expect(empty).toBeVisible();
    await expect(empty.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(empty.getByText("O arquivo está vazio")).toBeVisible();
  });
});

// ─── Modal document seals ─────────────────────────────────────────────────────

test.describe("Victory closure seal", () => {
  test("seal is decorative and the dialog title still labels the modal", async ({ page }) => {
    await page.addInitScript(
      (data: string) => localStorage.setItem("guessme:state:v5", data),
      VICTORY_SEED,
    );
    await mockBoot(page);
    await page.goto("/game");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".victoryClosureSeal")).toHaveAttribute("aria-hidden", "true");
    await expect(dialog.getByText("Caso Encerrado")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Novo caso" })).toBeFocused();
  });
});

test.describe("Replay archive watermark", () => {
  test("watermark never intercepts clicks — close button still works", async ({ page }) => {
    await page.addInitScript(
      (data: string) => localStorage.setItem("guessme.caseHistory.v1", data),
      HISTORY_SEED,
    );
    await mockBoot(page);
    await page.goto("/archive");
    await page.getByTestId("history-replay-btn").first().click();
    const modal = page.getByTestId("replay-modal");
    await expect(modal).toBeVisible();
    await expect(modal.locator(".replaySealWatermark")).toHaveAttribute("aria-hidden", "true");
    await page.getByTestId("replay-close-btn").click();
    await expect(modal).not.toBeVisible();
  });
});

// ─── Field manual route map ───────────────────────────────────────────────────

test.describe("Manual protocol route map", () => {
  test("route map is decorative and the manual stays intact", async ({ page }) => {
    await page.goto("/how-it-works");
    const map = page.locator(".protocolRouteWrap svg");
    await expect(map).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByRole("heading", { name: "Protocolo de Interrogação" })).toBeVisible();
  });

  test("no horizontal overflow at 360px with the route map", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/how-it-works");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(360);
  });
});

// ─── Stats intelligence scenes ────────────────────────────────────────────────

test.describe("Stats intelligence visuals", () => {
  test("empty state scene is decorative and the CTA remains reachable", async ({ page }) => {
    await page.goto("/stats");
    const empty = page.getByTestId("stats-empty");
    await expect(empty).toBeVisible();
    await expect(empty.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByTestId("stats-empty-cta")).toBeVisible();
  });

  test("accented overview metrics still expose their values", async ({ page }) => {
    await page.addInitScript(
      (data: string) => localStorage.setItem("guessme.caseHistory.v1", data),
      HISTORY_SEED,
    );
    await page.goto("/stats");
    await expect(page.getByTestId("stats-total-cases")).toContainText("1");
    await expect(page.getByTestId("stats-total-hints")).toContainText("2");
    await expect(page.getByTestId("stats-avg-questions")).toContainText("8");
  });

  test("agent credential seal is decorative", async ({ page }) => {
    await page.goto("/stats");
    const card = page.getByTestId("agent-rank-card");
    await expect(card).toBeVisible();
    await expect(card.locator(".agentCredentialSeal")).toHaveAttribute("aria-hidden", "true");
  });
});
