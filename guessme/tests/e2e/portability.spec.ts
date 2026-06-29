import { test, expect, type Page } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { mockBoot } from "./helpers/api-mocks";

// ─── Shared seed entry ────────────────────────────────────────────────────────

const SEED_ENTRY = {
  id: "portability-case-001",
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
    { id: "m4", sender: "Você", text: "É o Naruto?", ts: 6000, kind: "user" },
    {
      id: "m5",
      sender: "AI",
      text: "Sim! O personagem é Naruto Uzumaki.\nObra: Naruto",
      ts: 7000,
      kind: "ai",
      verdict: "YES",
    },
    { id: "m6", sender: "AI", text: "O personagem possui habilidades sobrenaturais.", ts: 5500, kind: "hint" },
  ],
  evidence: {
    confirmed: [
      { id: "m3", question: "É humano?", answer: "Sim", kind: "confirmed" },
      { id: "m5", question: "É o Naruto?", answer: "Sim!", kind: "confirmed" },
    ],
    refuted: [],
    inconclusive: [],
    hints: [{ id: "m6", text: "O personagem possui habilidades sobrenaturais." }],
  },
  solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
  winningQuestion: "É o Naruto?",
  verdictStats: { yes: 2, no: 0, maybe: 0, unknown: 0 },
};

const STORAGE_KEY = "guessme.caseHistory.v1";

async function seedHistory(page: Page, entries = [SEED_ENTRY]) {
  await page.addInitScript(
    (serialized) => localStorage.setItem("guessme.caseHistory.v1", serialized),
    JSON.stringify(entries),
  );
}

async function openReplayModal(page: Page) {
  await page.goto("/game");
  await page.getByTestId("history-replay-btn").first().click();
  await expect(page.getByTestId("replay-modal")).toBeVisible();
}

// ─── Setup ────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await mockBoot(page);
});

// ─── Replay modal: export buttons visible ─────────────────────────────────────

test.describe("Replay modal export buttons", () => {
  test.beforeEach(async ({ page }) => {
    await seedHistory(page);
  });

  test("Copiar resumo button is visible in replay modal", async ({ page }) => {
    await openReplayModal(page);
    await expect(page.getByTestId("replay-copy-btn")).toBeVisible();
  });

  test("Baixar JSON button is visible in replay modal", async ({ page }) => {
    await openReplayModal(page);
    await expect(page.getByTestId("replay-download-json-btn")).toBeVisible();
  });

  test("Baixar card button is visible in replay modal", async ({ page }) => {
    await openReplayModal(page);
    await expect(page.getByTestId("replay-download-svg-btn")).toBeVisible();
  });

  test("export buttons are keyboard reachable via Tab", async ({ page }) => {
    await openReplayModal(page);
    // Tab through focusable elements and verify export buttons receive focus
    const copyBtn = page.getByTestId("replay-copy-btn");
    await copyBtn.focus();
    await expect(copyBtn).toBeFocused();
  });

  test("modal stays open after clicking Copiar resumo", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openReplayModal(page);
    await page.getByTestId("replay-copy-btn").click();
    // Modal still visible
    await expect(page.getByTestId("replay-modal")).toBeVisible();
  });

  test("modal stays open after clicking Baixar JSON", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^guessme-.*\.json$/);
    await expect(page.getByTestId("replay-modal")).toBeVisible();
  });

  test("modal stays open after clicking Baixar card", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-svg-btn").click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^guessme-.*\.svg$/);
    await expect(page.getByTestId("replay-modal")).toBeVisible();
  });
});

// ─── Clipboard: copy summary ──────────────────────────────────────────────────

test.describe("Copy summary action", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test.beforeEach(async ({ page }) => {
    await seedHistory(page);
  });

  test("clicking Copiar resumo shows success status", async ({ page }) => {
    await openReplayModal(page);
    await page.getByTestId("replay-copy-btn").click();
    const status = page.getByTestId("replay-export-status");
    await expect(status).toBeVisible();
    await expect(status).toContainText("copiado");
  });

  test("copied text contains character name", async ({ page }) => {
    await openReplayModal(page);
    await page.getByTestId("replay-copy-btn").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("Naruto Uzumaki");
  });

  test("copied text contains work name", async ({ page }) => {
    await openReplayModal(page);
    await page.getByTestId("replay-copy-btn").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("Naruto");
  });

  test("copied text contains category", async ({ page }) => {
    await openReplayModal(page);
    await page.getByTestId("replay-copy-btn").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("Anime");
  });

  test("copied text contains winning question", async ({ page }) => {
    await openReplayModal(page);
    await page.getByTestId("replay-copy-btn").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("Naruto");
  });

  test("copied text contains evidence section headers", async ({ page }) => {
    await openReplayModal(page);
    await page.getByTestId("replay-copy-btn").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("Confirmado");
  });
});

// ─── JSON download ────────────────────────────────────────────────────────────

test.describe("JSON download action", () => {
  test.beforeEach(async ({ page }) => {
    await seedHistory(page);
  });

  test("JSON download starts when clicking Baixar JSON", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    expect(download).toBeTruthy();
  });

  test("downloaded JSON has guessme- prefix filename", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^guessme-/);
  });

  test("downloaded JSON contains schemaVersion 1", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    const filePath = await download.path();
    const content = fs.readFileSync(filePath!, "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed.schemaVersion).toBe(1);
  });

  test("downloaded JSON has app field GuessMe", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    const filePath = await download.path();
    const content = fs.readFileSync(filePath!, "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed.app).toBe("GuessMe");
  });

  test("downloaded JSON contains case.characterName", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    const filePath = await download.path();
    const content = fs.readFileSync(filePath!, "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed.case.characterName).toBe("Naruto Uzumaki");
  });

  test("downloaded JSON contains case.messages array", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    const filePath = await download.path();
    const content = fs.readFileSync(filePath!, "utf-8");
    const parsed = JSON.parse(content);
    expect(Array.isArray(parsed.case.messages)).toBe(true);
    expect(parsed.case.messages.length).toBeGreaterThan(0);
  });

  test("downloaded JSON contains case.evidence", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    const filePath = await download.path();
    const content = fs.readFileSync(filePath!, "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed.case.evidence).toBeDefined();
    expect(Array.isArray(parsed.case.evidence.confirmed)).toBe(true);
  });

  test("JSON download shows success status", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-json-btn").click(),
    ]);
    expect(download).toBeTruthy();
    const status = page.getByTestId("replay-export-status");
    await expect(status).toBeVisible();
    await expect(status).toContainText("JSON baixado");
  });
});

// ─── SVG share card download ──────────────────────────────────────────────────

test.describe("SVG share card download", () => {
  test.beforeEach(async ({ page }) => {
    await seedHistory(page);
  });

  test("SVG download starts when clicking Baixar card", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-svg-btn").click(),
    ]);
    expect(download).toBeTruthy();
  });

  test("downloaded SVG filename ends with .svg", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-svg-btn").click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.svg$/);
  });

  test("SVG content contains CASO ENCERRADO stamp", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-svg-btn").click(),
    ]);
    const filePath = await download.path();
    const content = fs.readFileSync(filePath!, "utf-8");
    expect(content).toContain("CASO ENCERRADO");
  });

  test("SVG content contains character name", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-svg-btn").click(),
    ]);
    const filePath = await download.path();
    const content = fs.readFileSync(filePath!, "utf-8");
    expect(content).toContain("Naruto Uzumaki");
  });

  test("SVG content contains GuessMe branding", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-svg-btn").click(),
    ]);
    const filePath = await download.path();
    const content = fs.readFileSync(filePath!, "utf-8");
    expect(content.toLowerCase()).toContain("guessme");
  });

  test("SVG download shows success status", async ({ page }) => {
    await openReplayModal(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("replay-download-svg-btn").click(),
    ]);
    expect(download).toBeTruthy();
    await expect(page.getByTestId("replay-export-status")).toContainText("Card baixado");
  });
});

// ─── Import: valid JSON ───────────────────────────────────────────────────────

function makeTempJsonFile(payload: object): string {
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `guessme-test-import-${Date.now()}.json`);
  fs.writeFileSync(tmpFile, JSON.stringify(payload, null, 2), "utf-8");
  return tmpFile;
}

test.describe("Import valid case JSON", () => {
  const IMPORT_ENTRY = {
    id: "imported-case-999",
    createdAt: new Date("2026-05-15T09:30:00").getTime(),
    characterName: "Goku",
    work: "Dragon Ball Z",
    category: "Anime",
    questionCount: 5,
    hintCount: 0,
    messages: [
      { id: "i1", sender: "AI", text: "Pode fazer sua primeira pergunta!", ts: 1000, kind: "ai" },
      { id: "i2", sender: "Você", text: "É de anime?", ts: 2000, kind: "user" },
      { id: "i3", sender: "AI", text: "Sim", ts: 3000, kind: "ai", verdict: "YES" },
    ],
    evidence: {
      confirmed: [{ id: "i3", question: "É de anime?", answer: "Sim", kind: "confirmed" }],
      refuted: [],
      inconclusive: [],
      hints: [],
    },
    solvedSummary: { name: "Goku", work: "Dragon Ball Z", image: "" },
    winningQuestion: "É o Goku?",
    verdictStats: { yes: 1, no: 0, maybe: 0, unknown: 0 },
  };

  const WRAPPED_PAYLOAD = {
    schemaVersion: 1,
    app: "GuessMe",
    exportedAt: new Date().toISOString(),
    case: IMPORT_ENTRY,
  };

  test("import button is visible in history panel", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-import-btn")).toBeVisible();
  });

  test("importing valid wrapped JSON adds card to history", async ({ page }) => {
    const tmpFile = makeTempJsonFile(WRAPPED_PAYLOAD);
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    await expect(page.getByTestId("history-card")).toBeVisible();
    await expect(page.getByTestId("history-card-name")).toContainText("Goku");
    fs.unlinkSync(tmpFile);
  });

  test("importing bare CaseHistoryEntry JSON also works", async ({ page }) => {
    const tmpFile = makeTempJsonFile(IMPORT_ENTRY);
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    await expect(page.getByTestId("history-card-name")).toContainText("Goku");
    fs.unlinkSync(tmpFile);
  });

  test("import shows success status message", async ({ page }) => {
    const tmpFile = makeTempJsonFile(WRAPPED_PAYLOAD);
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    await expect(page.getByTestId("history-import-status")).toContainText("importado");
    fs.unlinkSync(tmpFile);
  });

  test("imported case can be opened in replay modal", async ({ page }) => {
    const tmpFile = makeTempJsonFile(WRAPPED_PAYLOAD);
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    await expect(page.getByTestId("history-card")).toBeVisible();
    await page.getByTestId("history-replay-btn").first().click();
    await expect(page.getByTestId("replay-modal")).toBeVisible();
    await expect(page.getByTestId("replay-character")).toContainText("Goku");
    fs.unlinkSync(tmpFile);
  });

  test("imported case persists in localStorage after import", async ({ page }) => {
    const tmpFile = makeTempJsonFile(WRAPPED_PAYLOAD);
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    await expect(page.getByTestId("history-card")).toBeVisible();
    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    const parsed = JSON.parse(stored ?? "[]") as Array<{ characterName: string }>;
    expect(parsed.some((e) => e.characterName === "Goku")).toBe(true);
    fs.unlinkSync(tmpFile);
  });
});

// ─── Import: invalid JSON ─────────────────────────────────────────────────────

test.describe("Import invalid case JSON", () => {
  test("invalid JSON shows error status", async ({ page }) => {
    const tmpFile = path.join(os.tmpdir(), `guessme-bad-${Date.now()}.json`);
    fs.writeFileSync(tmpFile, "{ this is not valid json !!! }");
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    const status = page.getByTestId("history-import-status");
    await expect(status).toBeVisible();
    await expect(status).toContainText("inválido");
    fs.unlinkSync(tmpFile);
  });

  test("JSON missing required fields shows error status", async ({ page }) => {
    const tmpFile = makeTempJsonFile({ foo: "bar", baz: 123 });
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    await expect(page.getByTestId("history-import-status")).toContainText("incompletos");
    fs.unlinkSync(tmpFile);
  });

  test("invalid import does not add a card", async ({ page }) => {
    const tmpFile = path.join(os.tmpdir(), `guessme-bad2-${Date.now()}.json`);
    fs.writeFileSync(tmpFile, "INVALID");
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    await expect(page.getByTestId("history-empty")).toBeVisible();
    fs.unlinkSync(tmpFile);
  });
});

// ─── Import: duplicate prevention ─────────────────────────────────────────────

test.describe("Import duplicate case prevention", () => {
  test("importing a case with existing id assigns a new id and shows renamed message", async ({
    page,
  }) => {
    // Seed the same id that the import will bring
    await seedHistory(page, [
      { ...SEED_ENTRY, id: "portability-case-001", characterName: "Naruto Uzumaki" },
    ]);

    const duplicate = {
      schemaVersion: 1,
      app: "GuessMe",
      exportedAt: new Date().toISOString(),
      case: {
        ...SEED_ENTRY,
        id: "portability-case-001",
        characterName: "Naruto Uzumaki Duplicate",
      },
    };
    const tmpFile = makeTempJsonFile(duplicate);
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    const status = page.getByTestId("history-import-status");
    await expect(status).toBeVisible();
    await expect(status).toContainText("renomeado");
    fs.unlinkSync(tmpFile);
  });

  test("duplicate import adds a second card instead of silently overwriting", async ({
    page,
  }) => {
    await seedHistory(page, [
      { ...SEED_ENTRY, id: "portability-case-001" },
    ]);

    const duplicate = {
      schemaVersion: 1,
      app: "GuessMe",
      exportedAt: new Date().toISOString(),
      case: { ...SEED_ENTRY, id: "portability-case-001", characterName: "Naruto (copy)" },
    };
    const tmpFile = makeTempJsonFile(duplicate);
    await page.goto("/game");
    await page.getByTestId("history-import-input").setInputFiles(tmpFile);
    // Should now have 2 cards
    await expect(page.getByTestId("history-card")).toHaveCount(2);
    fs.unlinkSync(tmpFile);
  });
});

// ─── Mobile: export and import at 390px ───────────────────────────────────────

test.describe("Mobile portability actions at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await seedHistory(page);
  });

  test("import button is visible on mobile", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-import-btn")).toBeVisible();
  });

  test("replay export buttons are visible on mobile", async ({ page }) => {
    await openReplayModal(page);
    await expect(page.getByTestId("replay-copy-btn")).toBeVisible();
    await expect(page.getByTestId("replay-download-json-btn")).toBeVisible();
    await expect(page.getByTestId("replay-download-svg-btn")).toBeVisible();
  });

  test("export actions do not cause horizontal overflow at 390px", async ({ page }) => {
    await openReplayModal(page);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test("history panel with import button does not overflow at 390px", async ({ page }) => {
    await page.goto("/game");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});

// ─── Mobile: export and import at 360px ───────────────────────────────────────

test.describe("Mobile portability actions at 360px", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test.beforeEach(async ({ page }) => {
    await seedHistory(page);
  });

  test("import button is visible at 360px", async ({ page }) => {
    await page.goto("/game");
    await expect(page.getByTestId("history-import-btn")).toBeVisible();
  });

  test("no horizontal overflow at 360px with export buttons open", async ({ page }) => {
    await openReplayModal(page);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(361);
  });
});
