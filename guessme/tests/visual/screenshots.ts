import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const OUT = path.join(process.cwd(), "visual-screenshots");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "tablet-768",   width: 768,  height: 1024 },
  { name: "mobile-390",   width: 390,  height: 844 },
  { name: "mobile-360",   width: 360,  height: 780 },
];

/** Three cases for progression + compact stats views */
const SEED_3 = JSON.stringify([
  {
    id: "ss-001", createdAt: Date.now() - 86400000 * 3,
    characterName: "Naruto Uzumaki", work: "Naruto", category: "Anime",
    questionCount: 8, hintCount: 2, messages: [],
    evidence: {
      confirmed: [{ id: "c1", question: "É de anime?", answer: "Sim", kind: "confirmed" }],
      refuted:   [{ id: "r1", question: "É vilão?",    answer: "Não", kind: "refuted"  }],
      inconclusive: [], hints: [{ id: "h1", text: "Possui habilidades sobrenaturais." }],
    },
    solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
    winningQuestion: "É o Naruto?", verdictStats: { yes: 4, no: 2, maybe: 1, unknown: 0 },
  },
  {
    id: "ss-002", createdAt: Date.now() - 86400000 * 2,
    characterName: "Goku", work: "Dragon Ball Z", category: "Anime",
    questionCount: 4, hintCount: 0, messages: [],
    evidence: {
      confirmed: [{ id: "gc1", question: "É forte?", answer: "Sim", kind: "confirmed" }],
      refuted: [], inconclusive: [], hints: [],
    },
    solvedSummary: { name: "Goku", work: "Dragon Ball Z", image: "" },
    winningQuestion: "É o Goku?", verdictStats: { yes: 3, no: 1, maybe: 0, unknown: 0 },
  },
  {
    id: "ss-003", createdAt: Date.now() - 86400000,
    characterName: "Geralt de Rívia", work: "The Witcher", category: "Games",
    questionCount: 9, hintCount: 1, messages: [],
    evidence: {
      confirmed: [], refuted: [],
      inconclusive: [{ id: "gi1", question: "É humano?", answer: "Talvez", kind: "inconclusive" }],
      hints: [{ id: "gh1", text: "Famoso caçador de monstros." }],
    },
    solvedSummary: { name: "Geralt de Rívia", work: "The Witcher", image: "" },
    winningQuestion: "É o Geralt?", verdictStats: { yes: 2, no: 3, maybe: 2, unknown: 0 },
  },
]);

/** Eight cases across four categories for fully-populated stats dashboard */
const SEED_8 = JSON.stringify([
  {
    id: "rich-001", createdAt: Date.now() - 86400000 * 8,
    characterName: "Naruto Uzumaki", work: "Naruto", category: "Anime",
    questionCount: 8, hintCount: 2, messages: [],
    evidence: { confirmed: [{ id: "c1", question: "É anime?", answer: "Sim", kind: "confirmed" }], refuted: [], inconclusive: [], hints: [] },
    solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
    winningQuestion: "É o Naruto?", verdictStats: { yes: 5, no: 2, maybe: 1, unknown: 0 },
  },
  {
    id: "rich-002", createdAt: Date.now() - 86400000 * 7,
    characterName: "Goku", work: "Dragon Ball Z", category: "Anime",
    questionCount: 4, hintCount: 0, messages: [],
    evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] },
    solvedSummary: { name: "Goku", work: "Dragon Ball Z", image: "" },
    winningQuestion: "É o Goku?", verdictStats: { yes: 3, no: 1, maybe: 0, unknown: 0 },
  },
  {
    id: "rich-003", createdAt: Date.now() - 86400000 * 6,
    characterName: "Geralt de Rívia", work: "The Witcher", category: "Games",
    questionCount: 9, hintCount: 1, messages: [],
    evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [{ id: "h1", text: "Caçador de monstros." }] },
    solvedSummary: { name: "Geralt de Rívia", work: "The Witcher", image: "" },
    winningQuestion: "É o Geralt?", verdictStats: { yes: 2, no: 4, maybe: 2, unknown: 0 },
  },
  {
    id: "rich-004", createdAt: Date.now() - 86400000 * 5,
    characterName: "Walter White", work: "Breaking Bad", category: "Séries",
    questionCount: 12, hintCount: 3, messages: [],
    evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] },
    solvedSummary: { name: "Walter White", work: "Breaking Bad", image: "" },
    winningQuestion: "É o Walter White?", verdictStats: { yes: 6, no: 4, maybe: 2, unknown: 0 },
  },
  {
    id: "rich-005", createdAt: Date.now() - 86400000 * 4,
    characterName: "Tony Stark", work: "Marvel", category: "Filmes",
    questionCount: 5, hintCount: 0, messages: [],
    evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] },
    solvedSummary: { name: "Tony Stark", work: "Marvel", image: "" },
    winningQuestion: "É o Homem de Ferro?", verdictStats: { yes: 4, no: 1, maybe: 0, unknown: 0 },
  },
  {
    id: "rich-006", createdAt: Date.now() - 86400000 * 3,
    characterName: "Lara Croft", work: "Tomb Raider", category: "Games",
    questionCount: 7, hintCount: 1, messages: [],
    evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] },
    solvedSummary: { name: "Lara Croft", work: "Tomb Raider", image: "" },
    winningQuestion: "É a Lara Croft?", verdictStats: { yes: 5, no: 2, maybe: 0, unknown: 0 },
  },
  {
    id: "rich-007", createdAt: Date.now() - 86400000 * 2,
    characterName: "Hermione Granger", work: "Harry Potter", category: "Filmes",
    questionCount: 6, hintCount: 2, messages: [],
    evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] },
    solvedSummary: { name: "Hermione Granger", work: "Harry Potter", image: "" },
    winningQuestion: "É a Hermione?", verdictStats: { yes: 4, no: 1, maybe: 1, unknown: 0 },
  },
  {
    id: "rich-008", createdAt: Date.now() - 86400000,
    characterName: "Eleven", work: "Stranger Things", category: "Séries",
    questionCount: 3, hintCount: 0, messages: [],
    evidence: { confirmed: [], refuted: [], inconclusive: [], hints: [] },
    solvedSummary: { name: "Eleven", work: "Stranger Things", image: "" },
    winningQuestion: "É a Eleven?", verdictStats: { yes: 2, no: 1, maybe: 0, unknown: 0 },
  },
]);

/** Three cases seeded into game localStorage to show populated case history below game UI */
const SEED_GAME_HISTORY = SEED_3;

/**
 * Active investigation transcript seeded into guessme:state:v5 — renders the full
 * workstation (dividers, verdict badges, populated notebook) without a backend.
 */
const SEED_GAME_ACTIVE = JSON.stringify({
  sessionId: "shot-session-001",
  category: "Anime",
  questionsCount: 5,
  winner: null,
  messages: [
    { id: "m1", sender: "AI", text: "Caso aberto. Já escolhi um personagem — pode interrogar.", ts: 1, kind: "ai" },
    { id: "m2", sender: "Você", text: "É humano?", ts: 2, kind: "user" },
    { id: "m3", sender: "AI", text: "Sim.", ts: 3, kind: "ai", verdict: "YES" },
    { id: "m4", sender: "Você", text: "É vilão?", ts: 4, kind: "user" },
    { id: "m5", sender: "AI", text: "Não.", ts: 5, kind: "ai", verdict: "NO" },
    { id: "m6", sender: "Você", text: "Opera nas sombras?", ts: 6, kind: "user" },
    { id: "m7", sender: "AI", text: "Talvez. Depende do arco da história.", ts: 7, kind: "ai", verdict: "MAYBE" },
    { id: "m8", sender: "AI", text: "Pista: o suspeito é conhecido por um lema sobre nunca desistir.", ts: 8, kind: "hint" },
    { id: "m9", sender: "Você", text: "Tem poderes?", ts: 9, kind: "user" },
    { id: "m10", sender: "AI", text: "Sim, habilidades sobrenaturais confirmadas.", ts: 10, kind: "ai", verdict: "YES" },
  ],
});

type Route = {
  name: string;
  path: string;
  seed?: string;
  gameSeed?: string;
  waitUntil?: "networkidle" | "load";
};

type OfflineRoute = Route & { simulateOffline?: boolean };

const ROUTES: OfflineRoute[] = [
  // Static pages
  { name: "home",         path: "/" },
  { name: "how-it-works", path: "/how-it-works" },

  // Game — initial state (shows investigation interface before any API call)
  { name: "game-empty",   path: "/game" },

  // Game — with populated case history panel below the investigation UI
  { name: "game-history", path: "/game", seed: SEED_GAME_HISTORY },

  // Game — active investigation with rich transcript and populated notebook
  { name: "game-active",  path: "/game", gameSeed: SEED_GAME_ACTIVE },

  // Stats — empty (no cases)
  { name: "stats-empty",  path: "/stats" },

  // Stats — three cases (shows progression panel, rank Analista)
  { name: "stats-progression", path: "/stats", seed: SEED_3 },

  // Stats — eight cases across four categories (fully-populated dashboard)
  { name: "stats-rich",   path: "/stats", seed: SEED_8 },

  // PWA offline state — home with offline banner visible
  { name: "offline-banner", path: "/", simulateOffline: true },

  // Standalone offline fallback page — static file: networkidle can hang in dev, use load
  { name: "offline-page", path: "/offline.html", waitUntil: "load" },
];

async function run() {
  const browser = await chromium.launch();
  const failures: string[] = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });

    for (const route of ROUTES) {
      const page = await ctx.newPage();

      try {
        if (route.seed) {
          await page.addInitScript(
            (data: string) => localStorage.setItem("guessme.caseHistory.v1", data),
            route.seed,
          );
        }
        if (route.gameSeed) {
          await page.addInitScript(
            (data: string) => localStorage.setItem("guessme:state:v5", data),
            route.gameSeed,
          );
        }

        await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: route.waitUntil ?? "networkidle",
          timeout: 20000,
        });
        await page.waitForTimeout(500);

        if (route.simulateOffline) {
          await page.context().setOffline(true);
          await page.evaluate(() => window.dispatchEvent(new Event("offline")));
          await page.waitForTimeout(200);
        }

        const file = path.join(OUT, `${vp.name}--${route.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`✓ ${file}`);
      } catch (e) {
        // Isolate per-route failures so one flaky page never kills the whole matrix.
        failures.push(`${vp.name}--${route.name}`);
        console.error(`✗ ${vp.name}--${route.name}: ${e instanceof Error ? e.message.split("\n")[0] : e}`);
      } finally {
        // Contexts are shared across routes — always restore connectivity.
        if (route.simulateOffline) await ctx.setOffline(false);
        await page.close();
      }
    }

    await ctx.close();
  }

  await browser.close();
  const total = ROUTES.length * VIEWPORTS.length;
  console.log(`\nDone — ${total - failures.length}/${total} screenshots captured (${ROUTES.length} routes × ${VIEWPORTS.length} viewports)`);
  if (failures.length > 0) console.log(`Failed: ${failures.join(", ")}`);
  console.log(`Output: visual-screenshots/ (gitignored)`);
  if (failures.length > 0) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
