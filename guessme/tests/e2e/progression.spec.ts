import { test, expect, type Page } from "@playwright/test";
import { mockBoot } from "./helpers/api-mocks";

// ─── Seed data ────────────────────────────────────────────────────────────────

const BASE_CASE = {
  id: "prog-case-001",
  createdAt: new Date("2026-06-01T10:00:00").getTime(),
  characterName: "Naruto Uzumaki",
  work: "Naruto",
  category: "Anime",
  questionCount: 8,
  hintCount: 2,
  messages: [],
  evidence: {
    confirmed: [
      { id: "c1", question: "É humano?", answer: "Sim", kind: "confirmed" },
      { id: "c2", question: "É de anime?", answer: "Sim", kind: "confirmed" },
    ],
    refuted: [
      { id: "r1", question: "É vilão?", answer: "Não", kind: "refuted" },
    ],
    inconclusive: [],
    hints: [
      { id: "h1", text: "Personagem com habilidades sobrenaturais." },
      { id: "h2", text: "Veste laranja." },
    ],
  },
  solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
  winningQuestion: "É o Naruto?",
  verdictStats: { yes: 2, no: 1, maybe: 0, unknown: 0 },
};

const EFFICIENT_CASE = {
  ...BASE_CASE,
  id: "prog-case-002",
  characterName: "Goku",
  work: "Dragon Ball Z",
  category: "Anime",
  questionCount: 4,
  hintCount: 0,
  evidence: {
    confirmed: [
      { id: "gc1", question: "É forte?", answer: "Sim", kind: "confirmed" },
      { id: "gc2", question: "É de anime?", answer: "Sim", kind: "confirmed" },
      { id: "gc3", question: "Voa?", answer: "Sim", kind: "confirmed" },
    ],
    refuted: [
      { id: "gr1", question: "É vilão?", answer: "Não", kind: "refuted" },
    ],
    inconclusive: [],
    hints: [],
  },
  verdictStats: { yes: 3, no: 1, maybe: 0, unknown: 0 },
};

const GAMES_CASE = {
  ...BASE_CASE,
  id: "prog-case-003",
  characterName: "Geralt de Rívia",
  work: "The Witcher",
  category: "Games",
  questionCount: 9,
  hintCount: 1,
  evidence: {
    confirmed: [
      { id: "gg1", question: "É humano?", answer: "Talvez", kind: "inconclusive" },
    ],
    refuted: [],
    inconclusive: [
      { id: "gi1", question: "É humano?", answer: "Talvez", kind: "inconclusive" },
    ],
    hints: [{ id: "gh1", text: "Famoso caçador de monstros." }],
  },
  verdictStats: { yes: 0, no: 0, maybe: 1, unknown: 0 },
};

const FILMES_CASE = {
  ...BASE_CASE,
  id: "prog-case-004",
  characterName: "Darth Vader",
  work: "Star Wars",
  category: "Filmes",
  questionCount: 6,
  hintCount: 0,
  evidence: {
    confirmed: [{ id: "fv1", question: "É vilão?", answer: "Sim", kind: "confirmed" }],
    refuted: [],
    inconclusive: [],
    hints: [],
  },
  verdictStats: { yes: 1, no: 0, maybe: 0, unknown: 0 },
};

async function seedHistory(page: Page, entries: object[]) {
  await page.addInitScript(
    (data) => localStorage.setItem("guessme.caseHistory.v1", data),
    JSON.stringify(entries),
  );
}

// ─── Setup ────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await mockBoot(page);
});

// ─── Empty state ──────────────────────────────────────────────────────────────

test.describe("Progression — empty state (no cases)", () => {
  test("dossier panel is visible even with no cases", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("agent-dossier-panel")).toBeVisible();
  });

  test("rank is Recruta with no cases", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("agent-rank-title")).toContainText("Recruta");
  });

  test("progress bar toward Analista is shown when no cases", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("rank-progress-bar")).toBeVisible();
  });

  test("progress bar aria shows 0 of 1 when no cases", async ({ page }) => {
    await page.goto("/stats");
    const bar = page.getByTestId("rank-progress-bar");
    await expect(bar).toBeVisible();
    const progressbar = bar.getByRole("progressbar");
    await expect(progressbar).toHaveAttribute("aria-valuenow", "0");
    await expect(progressbar).toHaveAttribute("aria-valuemax", "1");
  });

  test("all achievements are locked with no cases", async ({ page }) => {
    await page.goto("/stats");
    const cards = page.getByTestId("achievement-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveAttribute("data-unlocked", "false");
    }
  });

  test("achievement grid is visible with no cases", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("achievement-grid")).toBeVisible();
  });

  test("achievement count shows 0 unlocked", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("achievement-count")).toContainText("0 /");
  });
});

// ─── Single case ─────────────────────────────────────────────────────────────

test.describe("Progression — single solved case", () => {
  test.beforeEach(async ({ page }) => {
    await seedHistory(page, [BASE_CASE]);
  });

  test("rank advances to Analista after 1 case", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("agent-rank-title")).toContainText("Analista");
  });

  test("Primeiro Caso achievement is unlocked", async ({ page }) => {
    await page.goto("/stats");
    const cards = page.getByTestId("achievement-card");
    const titles = page.getByTestId("achievement-title");
    const count = await titles.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text?.includes("Primeiro Caso")) {
        await expect(cards.nth(i)).toHaveAttribute("data-unlocked", "true");
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  test("Sequência Inicial is still locked after 1 case", async ({ page }) => {
    await page.goto("/stats");
    const titles = page.getByTestId("achievement-title");
    const cards = page.getByTestId("achievement-card");
    const count = await titles.count();
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text?.includes("Sequência Inicial")) {
        await expect(cards.nth(i)).toHaveAttribute("data-unlocked", "false");
      }
    }
  });

  test("progress bar shows progress toward next rank", async ({ page }) => {
    await page.goto("/stats");
    const bar = page.getByTestId("rank-progress-bar");
    await expect(bar).toBeVisible();
  });

  test("achievement count shows at least 1 unlocked", async ({ page }) => {
    await page.goto("/stats");
    const countEl = page.getByTestId("achievement-count");
    const text = await countEl.textContent();
    const unlocked = parseInt(text?.match(/^(\d+)/)?.[1] ?? "0", 10);
    expect(unlocked).toBeGreaterThanOrEqual(1);
  });
});

// ─── Efficiency achievements ──────────────────────────────────────────────────

test.describe("Progression — efficiency achievements", () => {
  test("Investigação Cirúrgica unlocked when a case has ≤5 questions", async ({ page }) => {
    await seedHistory(page, [BASE_CASE, EFFICIENT_CASE]);
    await page.goto("/stats");
    const titles = page.getByTestId("achievement-title");
    const cards = page.getByTestId("achievement-card");
    const count = await titles.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text?.includes("Investigação Cirúrgica")) {
        await expect(cards.nth(i)).toHaveAttribute("data-unlocked", "true");
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  test("Sem Ajuda unlocked when a case has 0 hints", async ({ page }) => {
    await seedHistory(page, [EFFICIENT_CASE]);
    await page.goto("/stats");
    const titles = page.getByTestId("achievement-title");
    const cards = page.getByTestId("achievement-card");
    const count = await titles.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text?.includes("Sem Ajuda")) {
        await expect(cards.nth(i)).toHaveAttribute("data-unlocked", "true");
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  test("Sem Ajuda locked when all cases have hints", async ({ page }) => {
    await seedHistory(page, [BASE_CASE]);
    await page.goto("/stats");
    const titles = page.getByTestId("achievement-title");
    const cards = page.getByTestId("achievement-card");
    const count = await titles.count();
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text?.includes("Sem Ajuda")) {
        await expect(cards.nth(i)).toHaveAttribute("data-unlocked", "false");
      }
    }
  });
});

// ─── Category achievement ─────────────────────────────────────────────────────

test.describe("Progression — category achievements", () => {
  test("Multiverso unlocked with 3 different categories", async ({ page }) => {
    await seedHistory(page, [BASE_CASE, GAMES_CASE, FILMES_CASE]);
    await page.goto("/stats");
    const titles = page.getByTestId("achievement-title");
    const cards = page.getByTestId("achievement-card");
    const count = await titles.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text?.includes("Multiverso")) {
        await expect(cards.nth(i)).toHaveAttribute("data-unlocked", "true");
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  test("Multiverso still locked with only 2 categories", async ({ page }) => {
    await seedHistory(page, [BASE_CASE, GAMES_CASE]);
    await page.goto("/stats");
    const titles = page.getByTestId("achievement-title");
    const cards = page.getByTestId("achievement-card");
    const count = await titles.count();
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text?.includes("Multiverso")) {
        await expect(cards.nth(i)).toHaveAttribute("data-unlocked", "false");
      }
    }
  });
});

// ─── Rank progression ─────────────────────────────────────────────────────────

test.describe("Progression — rank ladder from seeded history", () => {
  test("rank is Investigador with 3 cases", async ({ page }) => {
    await seedHistory(page, [BASE_CASE, EFFICIENT_CASE, GAMES_CASE]);
    await page.goto("/stats");
    await expect(page.getByTestId("agent-rank-title")).toContainText("Investigador");
  });

  test("rank is Detetive with 7 cases", async ({ page }) => {
    const cases = Array.from({ length: 7 }, (_, i) => ({
      ...BASE_CASE,
      id: `rank-case-${i}`,
    }));
    await seedHistory(page, cases);
    await page.goto("/stats");
    await expect(page.getByTestId("agent-rank-title")).toContainText("Detetive");
  });

  test("progress bar is not shown when at max rank", async ({ page }) => {
    const cases = Array.from({ length: 25 }, (_, i) => ({
      ...BASE_CASE,
      id: `max-case-${i}`,
    }));
    await seedHistory(page, cases);
    await page.goto("/stats");
    await expect(page.getByTestId("rank-maxed")).toBeVisible();
    await expect(page.getByTestId("rank-progress-bar")).not.toBeVisible();
  });

  test("Mestre do Dossiê rank shown at 25 cases", async ({ page }) => {
    const cases = Array.from({ length: 25 }, (_, i) => ({
      ...BASE_CASE,
      id: `mestre-case-${i}`,
    }));
    await seedHistory(page, cases);
    await page.goto("/stats");
    await expect(page.getByTestId("agent-rank-title")).toContainText("Mestre do Dossiê");
  });
});

// ─── Achievement groups ───────────────────────────────────────────────────────

test.describe("Progression — achievement categories", () => {
  test("achievement group titles are shown", async ({ page }) => {
    await page.goto("/stats");
    const titles = page.getByTestId("achievement-group-title");
    const count = await titles.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("Casos category group is present", async ({ page }) => {
    await page.goto("/stats");
    const titles = page.getByTestId("achievement-group-title");
    const texts: string[] = [];
    const count = await titles.count();
    for (let i = 0; i < count; i++) {
      texts.push((await titles.nth(i).textContent()) ?? "");
    }
    expect(texts.some((t) => t.includes("Casos"))).toBe(true);
  });

  test("Arquivo Robusto shows progress counter when partially complete", async ({ page }) => {
    await seedHistory(page, [BASE_CASE, EFFICIENT_CASE]);
    await page.goto("/stats");
    await expect(page.getByTestId("achievement-progress").first()).toBeVisible();
  });
});

// ─── Imported cases count ─────────────────────────────────────────────────────

test.describe("Progression — imported cases count toward rank", () => {
  test("imported cases count toward rank progression", async ({ page }) => {
    const importedCases = Array.from({ length: 3 }, (_, i) => ({
      ...BASE_CASE,
      id: `imported-case-${i}`,
      characterName: `Character ${i}`,
    }));
    await seedHistory(page, importedCases);
    await page.goto("/stats");
    await expect(page.getByTestId("agent-rank-title")).toContainText("Investigador");
  });
});

// ─── Mobile layout ────────────────────────────────────────────────────────────

test.describe("Progression — mobile layout at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("dossier panel is visible on mobile", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("agent-dossier-panel")).toBeVisible();
  });

  test("achievement grid is visible on mobile", async ({ page }) => {
    await page.goto("/stats");
    await expect(page.getByTestId("achievement-grid")).toBeVisible();
  });

  test("no horizontal overflow at 390px with progression", async ({ page }) => {
    await page.goto("/stats");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});

test.describe("Progression — mobile layout at 360px", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test("dossier panel renders without overflow at 360px", async ({ page }) => {
    await seedHistory(page, [BASE_CASE, EFFICIENT_CASE, GAMES_CASE]);
    await page.goto("/stats");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(361);
  });
});

