import { expect, test, type Page } from "@playwright/test";
import { mockAskSim, mockAskWin, mockBoot } from "./helpers/api-mocks";

const CASE = {
  id: "seed-case-001", createdAt: Date.now(), characterName: "Naruto Uzumaki", work: "Naruto", category: "Anime", questionCount: 3, hintCount: 1,
  messages: [{ id: "m1", sender: "AI", text: "Sim", ts: 1, kind: "ai", verdict: "YES" }],
  evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] }, solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
  winningQuestion: "É o Naruto?", verdictStats: { yes: 1, no: 0, maybe: 0, unknown: 0 },
};
async function seed(page: Page, entries = [CASE]) { await page.addInitScript((value) => localStorage.setItem("guessme.caseHistory.v1", JSON.stringify(value)), entries); }

test.beforeEach(async ({ page }) => { await page.addInitScript(() => localStorage.clear()); await mockBoot(page); });

test("Game exposes a compact archive summary instead of the management list", async ({ page }) => {
  await seed(page); await page.goto("/game");
  await expect(page.getByTestId("game-archive-summary")).toBeVisible();
  await expect(page.getByTestId("history-card")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Abrir Arquivo de Casos" })).toHaveAttribute("href", "/archive");
});
test("recent Game summary deep-links to the archived case", async ({ page }) => {
  await seed(page); await page.goto("/game"); await page.getByRole("link", { name: "Localizar" }).click();
  await expect(page).toHaveURL(/\/archive\?q=Naruto/); await expect(page.getByTestId("history-card-name")).toHaveText("Naruto Uzumaki");
});
test("victory persists exactly one case and updates the summary", async ({ page }) => {
  await mockAskWin(page); await page.goto("/game");
  await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É o Naruto?"); await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByRole("dialog")).toBeVisible(); await expect(page.getByTestId("game-archive-summary")).toContainText("1 caso");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("guessme.caseHistory.v1") ?? "[]"))).toHaveLength(1);
});
test("archive replay opens and restores focus after Escape", async ({ page }) => {
  await seed(page); await page.goto("/archive"); const button = page.getByTestId("history-replay-btn"); await button.click();
  await expect(page.getByTestId("replay-modal")).toBeVisible(); await page.keyboard.press("Escape"); await expect(button).toBeFocused();
});
test("archive deletion is confirmed and persisted", async ({ page }) => {
  await seed(page); await page.goto("/archive"); await page.getByTestId("history-delete-btn").click();
  await expect(page.getByTestId("history-delete-confirm-btn")).toBeFocused(); await page.getByTestId("history-delete-confirm-btn").click();
  await expect(page.getByRole("heading", { name: "O arquivo está vazio" })).toBeVisible();
});
test("corrupt history degrades safely without breaking Game", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("guessme.caseHistory.v1", "not-json")); await page.goto("/archive");
  await expect(page.getByRole("heading", { name: "O arquivo está vazio" })).toBeVisible(); await page.goto("/game");
  await expect(page.getByTestId("chat-scroll")).toContainText("primeira pergunta");
});
test("history does not break active questions", async ({ page }) => {
  await seed(page); await mockAskSim(page); await page.goto("/game");
  await page.getByRole("textbox", { name: "Pergunta para a investigação" }).fill("É humano?"); await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByTestId("chat-scroll")).toContainText("Sim");
});
test("archive and replay remain overflow-free at 390px", async ({ page }) => {
  await seed(page); await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/archive"); await page.getByTestId("history-replay-btn").click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});
