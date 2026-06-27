import { Page } from "@playwright/test";

export const TEST_SESSION_ID = "test-session-0000-0000-0000-000000000001";

export const CATEGORIES = [
  "Geral",
  "Anime",
  "Games",
  "Filmes",
  "Séries",
  "Quadrinhos",
];

// ─── Categories ───────────────────────────────────────────────────────────────

export async function mockCategories(page: Page) {
  await page.route("**/api/game/categories", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(CATEGORIES),
    });
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────

export async function mockStart(page: Page, category = "Geral") {
  const suffix =
    category === "Geral" ? "" : ` da categoria: ${category}`;
  await page.route("**/api/game/start", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: `Ok! Já escolhi um personagem${suffix}. Pode fazer sua primeira pergunta!`,
        success: false,
        character: null,
        sessionId: TEST_SESSION_ID,
      }),
    });
  });
}

export async function mockStartUnavailable(page: Page) {
  await page.route("**/api/game/start", async (route) => {
    await route.abort("connectionrefused");
  });
}

// ─── Ask ──────────────────────────────────────────────────────────────────────

function fulfillAsk(
  answer: string,
  success = false,
  character: object | null = null,
  verdict = "UNKNOWN",
) {
  return JSON.stringify({ answer, success, character, sessionId: TEST_SESSION_ID, verdict });
}

export async function mockAskSim(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fulfillAsk("Sim", false, null, "YES"),
    });
  });
}

export async function mockAskNao(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fulfillAsk("Não", false, null, "NO"),
    });
  });
}

export async function mockAskTalvez(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fulfillAsk("Talvez", false, null, "MAYBE"),
    });
  });
}

export async function mockAskWin(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fulfillAsk(
        "Sim! O personagem é Naruto Uzumaki.\nObra: Naruto",
        true,
        { name: "Naruto Uzumaki", work: "Naruto", image: "" },
        "YES",
      ),
    });
  });
}

export async function mockAskCooldown(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fulfillAsk("Aguarde alguns instantes antes de fazer outra pergunta.", false, null, "UNKNOWN"),
    });
  });
}

export async function mockAskMaxQuestions(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fulfillAsk(
        "Limite de perguntas atingido para esta sessão. Inicie um novo jogo com POST /api/game/start.",
        false, null, "UNKNOWN",
      ),
    });
  });
}

export async function mockAskStaleSession(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fulfillAsk(
        "Sessão não encontrada. Inicie um novo jogo com POST /api/game/start.",
        false, null, "UNKNOWN",
      ),
    });
  });
}

export async function mockAskGeminiError(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fulfillAsk(
        'Erro da API Gemini (400): {"error":{"code":400,"message":"API key not valid. Please pass a valid API key.","status":"INVALID_ARGUMENT"}}',
        false, null, "UNKNOWN",
      ),
    });
  });
}

// Legacy mock: omits verdict to test backwards-compatible text fallback.
export async function mockAskSimLegacy(page: Page) {
  await page.route("**/api/game/ask", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ answer: "Sim", success: false, character: null, sessionId: TEST_SESSION_ID }),
    });
  });
}

// ─── Hint ─────────────────────────────────────────────────────────────────────

export async function mockHint(page: Page) {
  await page.route("**/api/game/hint", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: "O personagem possui habilidades sobrenaturais marcantes.",
        success: false,
        character: null,
        sessionId: TEST_SESSION_ID,
      }),
    });
  });
}

export async function mockHintMax(page: Page) {
  await page.route("**/api/game/hint", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer:
          "Limite de dicas atingido para esta sessão. Inicie um novo jogo com POST /api/game/start.",
        success: false,
        character: null,
        sessionId: TEST_SESSION_ID,
      }),
    });
  });
}

// ─── Convenience: set up both categories + start in one call ──────────────────

export async function mockBoot(page: Page, category = "Geral") {
  await mockCategories(page);
  await mockStart(page, category);
}
