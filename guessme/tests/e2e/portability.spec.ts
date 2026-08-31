import { expect, test } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CASE = { id: "portable-1", createdAt: Date.now(), characterName: "Geralt de Rívia", work: "The Witcher", category: "Games", questionCount: 5, hintCount: 0,
  messages: [{ id: "m1", sender: "Você", text: "É o Geralt?", ts: 1, kind: "user" }], evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] },
  solvedSummary: { name: "Geralt de Rívia", work: "The Witcher", image: "" }, winningQuestion: "É o Geralt?", verdictStats: { yes: 1, no: 0, maybe: 0, unknown: 0 } };
test.beforeEach(async ({ page }) => { await page.addInitScript((entry) => localStorage.setItem("guessme.caseHistory.v1", JSON.stringify([entry])), CASE); });

test("replay retains individual JSON and SVG exports", async ({ page }) => {
  await page.goto("/archive"); await page.getByTestId("history-replay-btn").click(); await expect(page.getByTestId("replay-copy-btn")).toBeVisible();
  const [json] = await Promise.all([page.waitForEvent("download"), page.getByTestId("replay-download-json-btn").click()]);
  expect(JSON.parse(fs.readFileSync((await json.path())!, "utf8"))).toMatchObject({ schemaVersion: 1, app: "GuessMe", case: { characterName: "Geralt de Rívia" } });
  const [svg] = await Promise.all([page.waitForEvent("download"), page.getByTestId("replay-download-svg-btn").click()]);
  expect(fs.readFileSync((await svg.path())!, "utf8")).toContain("Geralt de Rívia");
});
test("imports a valid individual case without overwriting an ID collision", async ({ page }) => {
  const file = path.join(os.tmpdir(), `guessme-case-${Date.now()}.json`); fs.writeFileSync(file, JSON.stringify({ schemaVersion: 1, app: "GuessMe", case: { ...CASE, characterName: "Geralt alternativo" } }));
  await page.goto("/archive"); await page.locator('input[type="file"]').setInputFiles(file); await expect(page.getByTestId("archive-status")).toContainText("ID renomeado");
  await expect(page.getByTestId("history-card")).toHaveCount(2); fs.unlinkSync(file);
});
test("invalid JSON reports an error and preserves the archive", async ({ page }) => {
  const file = path.join(os.tmpdir(), `guessme-invalid-${Date.now()}.json`); fs.writeFileSync(file, "{invalid"); await page.goto("/archive");
  await page.locator('input[type="file"]').setInputFiles(file); await expect(page.getByTestId("archive-status")).toContainText("inválido"); await expect(page.getByTestId("history-card")).toHaveCount(1); fs.unlinkSync(file);
});
test("storage failure is reported without false success", async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException("Quota", "QuotaExceededError"); }; });
  const file = path.join(os.tmpdir(), `guessme-quota-${Date.now()}.json`); fs.writeFileSync(file, JSON.stringify({ schemaVersion: 1, app: "GuessMe", case: { ...CASE, id: "new" } }));
  await page.goto("/archive"); await page.locator('input[type="file"]').setInputFiles(file); await expect(page.getByTestId("archive-status")).toContainText("recusou"); fs.unlinkSync(file);
});
test("portability actions fit at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 }); await page.goto("/archive"); await page.getByTestId("history-replay-btn").click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
});
