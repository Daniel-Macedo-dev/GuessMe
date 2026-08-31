import { expect, test } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const STORAGE_KEY = "guessme.caseHistory.v1";

function entry(id: string, characterName: string, category: string, questions: number, hints: number, createdAt: number) {
  return {
    id, createdAt, characterName, work: `${characterName} — Obra`, category,
    questionCount: questions, hintCount: hints, messages: [],
    evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] },
    solvedSummary: { name: characterName, work: `${characterName} — Obra`, image: "" },
    winningQuestion: `É ${characterName}?`, verdictStats: { yes: 1, no: 0, maybe: 0, unknown: 0 },
  };
}

const CASES = [
  entry("a", "Álvaro", "Filmes", 4, 0, new Date("2026-08-20").getTime()),
  entry("b", "Zelda", "Games", 12, 2, new Date("2025-01-01").getTime()),
  entry("c", "Goku", "Anime", 7, 1, new Date("2026-08-25").getTime()),
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ key, cases }) => localStorage.setItem(key, JSON.stringify(cases)), { key: STORAGE_KEY, cases: CASES });
});

test("search is accent and case insensitive and writes URL state", async ({ page }) => {
  await page.goto("/archive");
  await page.getByRole("searchbox", { name: "Pesquisar casos" }).fill("alvaro");
  await expect(page.getByTestId("history-card")).toHaveCount(1);
  await expect(page.getByTestId("history-card-name")).toHaveText("Álvaro");
  await expect(page).toHaveURL(/q=alvaro/);
});

test("combines category and hint filters", async ({ page }) => {
  await page.goto("/archive?category=Games&hints=with");
  await expect(page.getByTestId("history-card")).toHaveCount(1);
  await expect(page.getByTestId("history-card-name")).toHaveText("Zelda");
  await expect(page.getByTestId("archive-result-count")).toContainText("1 de 3");
});

test("sorts by fewest questions deterministically", async ({ page }) => {
  await page.goto("/archive?sort=fewest");
  await expect(page.getByTestId("history-card-name")).toHaveText(["Álvaro", "Goku", "Zelda"]);
});

test("unknown query values fall back safely", async ({ page }) => {
  await page.goto("/archive?hints=invalid&period=never&sort=random");
  await expect(page.getByTestId("history-card")).toHaveCount(3);
  await expect(page.getByLabel("Pistas")).toHaveValue("all");
});

test("discrete filters participate in browser back navigation", async ({ page }) => {
  await page.goto("/archive");
  await page.getByLabel("Categoria").selectOption("Games");
  await expect(page).toHaveURL(/category=Games/);
  await page.goBack();
  await expect(page.getByLabel("Categoria")).toHaveValue("all");
});

test("shows and resets the no-results state", async ({ page }) => {
  await page.goto("/archive?q=inexistente");
  await expect(page.getByRole("heading", { name: "Nenhum dossiê encontrado" })).toBeVisible();
  await page.getByRole("status").filter({ hasText: "Nenhum dossiê" }).getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByTestId("history-card")).toHaveCount(3);
});

test("replay preserves the filtered URL and restores trigger focus", async ({ page }) => {
  await page.goto("/archive?category=Anime");
  const replay = page.getByTestId("history-replay-btn");
  await replay.click();
  await expect(page.getByTestId("replay-modal")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(replay).toBeFocused();
  await expect(page).toHaveURL(/category=Anime/);
});

test("archive controls fit at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/archive");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
  await expect(page.getByTestId("archive-export-btn")).toBeVisible();
});

test("exports a deterministic versioned archive bundle", async ({ page }) => {
  await page.goto("/archive");
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByTestId("archive-export-btn").click()]);
  const payload = JSON.parse(fs.readFileSync((await download.path())!, "utf8"));
  expect(payload).toMatchObject({ schemaVersion: 1, app: "GuessMe", kind: "case-archive" });
  expect(payload.cases.map((item: { id: string }) => item.id)).toEqual(["c", "a", "b"]);
});

test("merges a full archive and reports duplicates, renamed IDs, and rejected entries", async ({ page }) => {
  const payload = {
    schemaVersion: 1, app: "GuessMe", kind: "case-archive", exportedAt: new Date().toISOString(),
    cases: [CASES[0], { ...CASES[0], characterName: "Outro Álvaro" }, { invalid: true }],
  };
  const file = path.join(os.tmpdir(), `guessme-archive-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(payload));
  await page.goto("/archive");
  await page.locator('input[type="file"]').setInputFiles(file);
  await expect(page.getByTestId("archive-status")).toContainText("1 importado; 1 duplicado ignorado; 1 ID renomeado");
  await expect(page.getByTestId("archive-status")).toContainText("1 inválido rejeitado");
  fs.unlinkSync(file);
});

test("rejects unsupported archive schema without changing storage", async ({ page }) => {
  const file = path.join(os.tmpdir(), `guessme-schema-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify({ schemaVersion: 99, app: "GuessMe", kind: "case-archive", cases: [] }));
  await page.goto("/archive");
  await page.locator('input[type="file"]').setInputFiles(file);
  await expect(page.getByTestId("archive-status")).toContainText("não suportada");
  await expect(page.getByTestId("history-card")).toHaveCount(3);
  fs.unlinkSync(file);
});

test("semantic duplicates with different IDs are skipped", async ({ page }) => {
  const file = path.join(os.tmpdir(), `guessme-semantic-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify({ schemaVersion: 1, app: "GuessMe", kind: "case-archive", cases: [{ ...CASES[0], id: "different-id" }] }));
  await page.goto("/archive");
  await page.locator('input[type="file"]').setInputFiles(file);
  await expect(page.getByTestId("archive-status")).toContainText("1 duplicado ignorado");
  await expect(page.getByTestId("history-card")).toHaveCount(3);
  fs.unlinkSync(file);
});
