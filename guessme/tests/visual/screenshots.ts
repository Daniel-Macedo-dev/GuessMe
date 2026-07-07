import { chromium } from "@playwright/test";
import { spawn, spawnSync, type ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";

const OUT = path.join(process.cwd(), "visual-screenshots");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const BASE_URL = "http://localhost:5173";

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "desktop-1024", width: 1024, height: 768 },
  { name: "tablet-768",   width: 768,  height: 1024 },
  { name: "mobile-390",   width: 390,  height: 844 },
  { name: "mobile-360",   width: 360,  height: 780 },
];

/* ── Dev-server lifecycle ──
   `npm run screenshots` is self-contained: if nothing is listening on 5173
   it starts the Vite dev server, waits until it responds, and tears it down
   (including the child process tree) when the capture run ends. A server
   that was already running is reused and left running. */

async function isServerUp(): Promise<boolean> {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

function stopServer(child: ChildProcess | null): void {
  if (!child || child.pid == null) return;
  if (process.platform === "win32") {
    // Kill the whole tree: the npm shell wrapper spawns vite as a child
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    try {
      process.kill(-child.pid, "SIGTERM"); // detached process group
    } catch {
      child.kill("SIGTERM");
    }
  }
}

async function startServer(): Promise<ChildProcess> {
  console.log("No dev server on :5173 — starting one for this capture run…");
  // Spawn vite's JS entry directly with the current Node binary instead of
  // going through `npm run dev`: on Windows the npm shell-wrapper chain
  // breaks `taskkill /T` (an intermediate parent exits), leaking the server.
  const viteBin = path.join(process.cwd(), "node_modules", "vite", "bin", "vite.js");
  const child = spawn(process.execPath, [viteBin], {
    cwd: process.cwd(),
    detached: process.platform !== "win32",
    stdio: "ignore",
  });
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (await isServerUp()) return child;
    await new Promise((r) => setTimeout(r, 400));
  }
  stopServer(child);
  throw new Error("Dev server did not become ready on :5173 within 30s");
}

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

/** Solved case seeded into game state — opens the VictoryModal deterministically */
const SEED_GAME_VICTORY = JSON.stringify({
  sessionId: "shot-session-002",
  category: "Anime",
  questionsCount: 7,
  winner: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
  messages: [
    { id: "v1", sender: "AI", text: "Caso aberto. Já escolhi um personagem — pode interrogar.", ts: 1, kind: "ai" },
    { id: "v2", sender: "Você", text: "É de anime?", ts: 2, kind: "user" },
    { id: "v3", sender: "AI", text: "Sim.", ts: 3, kind: "ai", verdict: "YES" },
    { id: "v4", sender: "Você", text: "É o Naruto?", ts: 4, kind: "user" },
    { id: "v5", sender: "AI", text: "Sim! Identidade confirmada.", ts: 5, kind: "ai", verdict: "YES" },
  ],
});

type Route = {
  name: string;
  path: string;
  seed?: string;
  gameSeed?: string;
  waitUntil?: "networkidle" | "load";
  /** Post-load interaction to reach modal/system states */
  action?: "open-replay" | "fire-install";
  /** Fixed-position overlays repaint badly in fullPage captures — use viewport */
  viewportOnly?: boolean;
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

  // Game — victory report modal (seeded solved case)
  { name: "victory-report", path: "/game", gameSeed: SEED_GAME_VICTORY, viewportOnly: true },

  // Game — archived case replay modal opened from seeded history
  { name: "replay-report", path: "/game", seed: SEED_3, action: "open-replay", viewportOnly: true },

  // Install prompt — synthetic beforeinstallprompt (same technique as pwa.spec.ts)
  { name: "install-prompt", path: "/", action: "fire-install", viewportOnly: true },

  // PWA offline state — home with offline banner visible
  { name: "offline-banner", path: "/", simulateOffline: true },

  // Standalone offline fallback page — static file: networkidle can hang in dev, use load
  { name: "offline-page", path: "/offline.html", waitUntil: "load" },
];

async function run() {
  const server = (await isServerUp()) ? null : await startServer();

  let failed = 0;
  try {
    failed = await capture();
  } finally {
    stopServer(server);
  }
  if (failed > 0) process.exit(1);
}

async function capture(): Promise<number> {
  const browser = await chromium.launch();
  const failures: string[] = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });

    for (const route of ROUTES) {
      const page = await ctx.newPage();

      try {
        // Contexts are shared across routes and localStorage persists per
        // origin — always reset to exactly the state this route declares, so
        // seeds from earlier routes can never leak into later captures.
        await page.addInitScript(
          (state: { seed: string | null; gameSeed: string | null }) => {
            localStorage.clear();
            if (state.seed) localStorage.setItem("guessme.caseHistory.v1", state.seed);
            if (state.gameSeed) localStorage.setItem("guessme:state:v5", state.gameSeed);
          },
          { seed: route.seed ?? null, gameSeed: route.gameSeed ?? null },
        );

        await page.goto(`${BASE_URL}${route.path}`, {
          waitUntil: route.waitUntil ?? "networkidle",
          timeout: 20000,
        });
        await page.waitForTimeout(500);

        if (route.simulateOffline) {
          await page.context().setOffline(true);
          await page.evaluate(() => window.dispatchEvent(new Event("offline")));
          await page.waitForTimeout(200);
        }

        if (route.action === "open-replay") {
          await page.getByTestId("history-replay-btn").first().click();
          await page.getByTestId("replay-modal").waitFor({ state: "visible", timeout: 5000 });
          await page.waitForTimeout(300);
        }
        if (route.action === "fire-install") {
          await page.evaluate(() => {
            const evt = new Event("beforeinstallprompt", { bubbles: true, cancelable: true }) as Event & {
              prompt: () => Promise<void>;
              userChoice: Promise<{ outcome: string }>;
            };
            evt.prompt = () => Promise.resolve();
            evt.userChoice = Promise.resolve({ outcome: "dismissed" });
            window.dispatchEvent(evt);
          });
          await page.getByTestId("install-prompt").waitFor({ state: "visible", timeout: 5000 });
          await page.waitForTimeout(300);
        }

        const file = path.join(OUT, `${vp.name}--${route.name}.png`);
        await page.screenshot({ path: file, fullPage: !route.viewportOnly });
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
  return failures.length;
}

run().catch((e) => { console.error(e); process.exit(1); });
