import { test, expect, type Page } from "@playwright/test";
import { mockBoot } from "./helpers/api-mocks";

// ─── Seed data ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "guessme.caseHistory.v1";

const BASE_ENTRY = {
  id: "stats-case-001",
  createdAt: new Date("2026-06-01T10:00:00").getTime(),
  characterName: "Naruto Uzumaki",
  work: "Naruto",
  category: "Anime",
  questionCount: 8,
  hintCount: 2,
  messages: [
    { id: "m1", sender: "AI", text: "Pode fazer sua primeira pergunta!", ts: 1000, kind: "ai" },
    { id: "m2", sender: "Você", text: "É humano?", ts: 2000, kind: "user" },
    { id: "m3", sender: "AI", text: "Sim", ts: 3000, kind: "ai", verdict: "YES" },
    { id: "m4", sender: "Você", text: "É de anime?", ts: 4000, kind: "user" },
    { id: "m5", sender: "AI", text: "Sim", ts: 5000, kind: "ai", verdict: "YES" },
    { id: "m6", sender: "AI", text: "Pista: o personagem possui habilidades sobrenaturais.", ts: 5500, kind: "hint" },
    { id: "m7", sender: "Você", text: "É vilão?", ts: 6000, kind: "user" },
    { id: "m8", sender: "AI", text: "Não", ts: 7000, kind: "ai", verdict: "NO" },
    { id: "m9", sender: "Você", text: "É o Naruto?", ts: 8000, kind: "user" },
    { id: "m10", sender: "AI", text: "Sim! Naruto Uzumaki.", ts: 9000, kind: "ai", verdict: "YES" },
  ],
  evidence: {
    confirmed: [
      { id: "m3", question: "É humano?", answer: "Sim", kind: "confirmed" },
      { id: "m5", question: "É de anime?", answer: "Sim", kind: "confirmed" },
      { id: "m10", question: "É o Naruto?", answer: "Sim!", kind: "confirmed" },
    ],
    refuted: [{ id: "m8", question: "É vilão?", answer: "Não", kind: "refuted" }],
    inconclusive: [],
    hints: [{ id: "m6", text: "Pista: o personagem possui habilidades sobrenaturais." }],
  },
  solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
  winningQuestion: "É o Naruto?",
  verdictStats: { yes: 3, no: 1, maybe: 0, unknown: 0 },
};

const SECOND_ENTRY = {
  ...BASE_ENTRY,
  id: "stats-case-002",
  createdAt: new Date("2026-06-10T14:00:00").getTime(),
  characterName: "Goku",
  work: "Dragon Ball Z",
  category: "Anime",
  questionCount: 12,
  hintCount: 0,
  evidence: {
    confirmed: [{ id: "g1", question: "É forte?", answer: "Sim", kind: "confirmed" }],
    refuted: [],
    inconclusive: [{ id: "g2", question: "É vilão?", answer: "Talvez", kind: "inconclusive" }],
    hints: [],
  },
  verdictStats: { yes: 1, no: 0, maybe: 1, unknown: 0 },
};

const GAME_ENTRY = {
  ...BASE_ENTRY,
  id: "stats-case-003",
  createdAt: new Date("2026-06-15T08:00:00").getTime(),
  characterName: "Geralt de Rívia",
  work: "The Witcher",
  category: "Games",
  questionCount: 5,
  hintCount: 1,
  verdictStats: { yes: 2, no: 1, maybe: 0, unknown: 0 },
};

async function seedHistory(page: Page, entries = [BASE_ENTRY]) {
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

// ─── Empty stats dashboard ────────────────────────────────────────────────────

test.describe("Stats dashboard — empty state", () => {
  test("/stats route renders", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-page")).toBeVisible();
  });

  test("empty state is shown when no history", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-empty")).toBeVisible();
  });

  test("empty state message explains what to do", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-empty")).toContainText("Resolva um caso");
  });

  test("empty state CTA links to /game", async ({ page }) => {
    await page.goto("/stats");
    const cta = page.getByTestId("stats-empty-cta");
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL("/game");
  });

  test("dashboard panels are not rendered when empty", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-dashboard")).not.toBeVisible();
  });
});

// ─── Populated stats dashboard ────────────────────────────────────────────────

test.describe("Stats dashboard — populated single case", () => {
  test.beforeEach(async ({ page }) => {
    await seedHistory(page);
  });

  test("dashboard is visible when history has cases", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-dashboard")).toBeVisible();
  });

  test("empty state is not visible when history has cases", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-empty")).not.toBeVisible();
  });

  test("total solved cases shows correct count", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-total-cases")).toContainText("1");
  });

  test("total questions shows correct value", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-total-questions")).toContainText("8");
  });

  test("total hints shows correct value", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-total-hints")).toContainText("2");
  });

  test("average questions shows correct value", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-avg-questions")).toContainText("8");
  });

  test("overview grid is rendered", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-overview-grid")).toBeVisible();
  });
});

// ─── Populated stats with multiple cases ─────────────────────────────────────

test.describe("Stats dashboard — multiple cases", () => {
  const THREE_ENTRIES = [BASE_ENTRY, SECOND_ENTRY, GAME_ENTRY];

  test.beforeEach(async ({ page }) => {
    await seedHistory(page, THREE_ENTRIES);
  });

  test("total cases shows 3", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-total-cases")).toContainText("3");
  });

  test("total questions shows sum", async ({ page }) => {
    // 8 + 12 + 5 = 25
    await page.goto("/stats");
    await expect(page.getByTestId("stats-total-questions")).toContainText("25");
  });

  test("verdict panel is visible", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-verdict-panel")).toBeVisible();
  });

  test("verdict bars are rendered", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-verdict-bars")).toBeVisible();
  });

  test("category panel is visible", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-category-panel")).toBeVisible();
  });

  test("category bars show Anime and Games", async ({ page }) => {
    await page.goto("/stats");
    const catBars = page.getByTestId("stats-category-bars");
    await expect(catBars).toContainText("Anime");
    await expect(catBars).toContainText("Games");
  });

  test("distribution bars expose values without relying on color", async ({ page }) => {
    await page.goto("/stats");
    const animeMeter = page.getByRole("meter", { name: "Anime" });
    await expect(animeMeter).toHaveAttribute("aria-valuenow", "2");
    await expect(animeMeter).toHaveAttribute("aria-valuemax", "2");
  });

  test("evidence panel is visible", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-evidence-panel")).toBeVisible();
  });

  test("evidence bars are rendered", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-evidence-bars")).toBeVisible();
  });

  test("ranking panel is visible", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-ranking-panel")).toBeVisible();
  });

  test("best case (fewest questions) is Geralt de Rívia (5 questions)", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-best-case-name")).toContainText("Geralt");
  });

  test("longest case (most questions) is Goku (12 questions)", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-longest-case-name")).toContainText("Goku");
  });

  test("recent activity panel is visible", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-recent-panel")).toBeVisible();
  });

  test("recent activity shows character names", async ({ page }) => {
    await page.goto("/stats");
    const names = page.getByTestId("stats-recent-name");
    await expect(names.first()).toBeVisible();
  });

  test("recent items are limited to 5", async ({ page }) => {
    await page.goto("/stats");
    const items = page.getByTestId("stats-recent-item");
    const count = await items.count();
    expect(count).toBeLessThanOrEqual(5);
    expect(count).toBeGreaterThan(0);
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe("Stats route navigation", () => {
  test("Estatísticas navbar link exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Estatísticas" })).toBeVisible();
  });

  test("clicking Estatísticas link navigates to /stats", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Estatísticas" }).click();
    await expect(page).toHaveURL("/stats");
  });

  test("direct URL /stats renders the page", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-page")).toBeVisible();
  });

  test("Estatísticas link is active when on /stats", async ({ page }) => {
    await page.goto("/stats");
    const link = page.getByRole("link", { name: "Estatísticas" });
    await expect(link).toHaveClass(/active/);
  });

  test("other routes still work after stats route is added", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
  });

  test("/how-it-works still accessible", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page).toHaveURL("/how-it-works");
  });

  test("unknown route still redirects to home", async ({ page }) => {
    await page.goto("/not-a-real-route");
    await expect(page).toHaveURL("/");
  });
});

// ─── Import compatibility ─────────────────────────────────────────────────────

test.describe("Stats dashboard with imported/incomplete data", () => {
  test("dashboard handles entry with missing evidence gracefully", async ({ page }) => {
    const incomplete = {
      ...BASE_ENTRY,
      id: "stats-incomplete-001",
      evidence: undefined,
      verdictStats: undefined,
    };
    await seedHistory(page, [incomplete as never]);
    await page.goto("/stats");
    await expect(page.getByTestId("stats-dashboard")).toBeVisible();
    await expect(page.getByTestId("stats-total-cases")).toContainText("1");
  });

  test("dashboard handles entry with zero questions gracefully", async ({ page }) => {
    const zeroQ = { ...BASE_ENTRY, id: "stats-zero-001", questionCount: 0, hintCount: 0 };
    await seedHistory(page, [zeroQ]);
    await page.goto("/stats");
    await expect(page.getByTestId("stats-dashboard")).toBeVisible();
  });

  test("dashboard does not crash with corrupted localStorage", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("guessme.caseHistory.v1", "NOT_VALID_JSON");
    });
    await page.goto("/stats");
    await expect(page.getByTestId("stats-empty")).toBeVisible();
  });
});

// ─── Mobile layout ────────────────────────────────────────────────────────────

test.describe("Stats mobile layout at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await seedHistory(page, [BASE_ENTRY, SECOND_ENTRY]);
  });

  test("stats page renders on mobile", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-page")).toBeVisible();
  });

  test("overview cards visible on mobile", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-overview-grid")).toBeVisible();
  });

  test("no horizontal overflow at 390px", async ({ page }) => {
    await page.goto("/stats");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});

test.describe("Stats mobile layout at 360px", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test.beforeEach(async ({ page }) => {
    await seedHistory(page, [BASE_ENTRY, SECOND_ENTRY]);
  });

  test("stats page renders on 360px", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("stats-page")).toBeVisible();
  });

  test("no horizontal overflow at 360px", async ({ page }) => {
    await page.goto("/stats");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(361);
  });
});
