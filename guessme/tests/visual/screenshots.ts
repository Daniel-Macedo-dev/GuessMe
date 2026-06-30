import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const OUT = path.join(process.cwd(), "visual-screenshots");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-360", width: 360, height: 780 },
];

const PROGRESSION_SEED = JSON.stringify([
  {
    id: "ss-case-001", createdAt: Date.now() - 86400000 * 3,
    characterName: "Naruto Uzumaki", work: "Naruto", category: "Anime",
    questionCount: 8, hintCount: 2, messages: [],
    evidence: {
      confirmed: [{ id: "c1", question: "É de anime?", answer: "Sim", kind: "confirmed" }],
      refuted: [{ id: "r1", question: "É vilão?", answer: "Não", kind: "refuted" }],
      inconclusive: [], hints: [{ id: "h1", text: "Possui habilidades sobrenaturais." }],
    },
    solvedSummary: { name: "Naruto Uzumaki", work: "Naruto", image: "" },
    winningQuestion: "É o Naruto?", verdictStats: { yes: 2, no: 1, maybe: 0, unknown: 0 },
  },
  {
    id: "ss-case-002", createdAt: Date.now() - 86400000 * 2,
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
    id: "ss-case-003", createdAt: Date.now() - 86400000,
    characterName: "Geralt de Rívia", work: "The Witcher", category: "Games",
    questionCount: 9, hintCount: 1, messages: [],
    evidence: {
      confirmed: [], refuted: [],
      inconclusive: [{ id: "gi1", question: "É humano?", answer: "Talvez", kind: "inconclusive" }],
      hints: [{ id: "gh1", text: "Famoso caçador de monstros." }],
    },
    solvedSummary: { name: "Geralt de Rívia", work: "The Witcher", image: "" },
    winningQuestion: "É o Geralt?", verdictStats: { yes: 0, no: 0, maybe: 1, unknown: 0 },
  },
]);

type Route = {
  name: string;
  path: string;
  seed?: string;
};

const ROUTES: Route[] = [
  { name: "home", path: "/" },
  { name: "game", path: "/game" },
  { name: "how-it-works", path: "/how-it-works" },
  { name: "stats", path: "/stats" },
  { name: "stats-progression", path: "/stats", seed: PROGRESSION_SEED },
];

async function run() {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });

    for (const route of ROUTES) {
      const page = await ctx.newPage();

      if (route.seed) {
        await page.addInitScript(
          (data) => localStorage.setItem("guessme.caseHistory.v1", data),
          route.seed,
        );
      }

      await page.goto(`http://localhost:5173${route.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const file = path.join(OUT, `${vp.name}--${route.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`✓ ${file}`);
      await page.close();
    }

    await ctx.close();
  }

  await browser.close();
  console.log("\nDone.");
}

run().catch((e) => { console.error(e); process.exit(1); });
