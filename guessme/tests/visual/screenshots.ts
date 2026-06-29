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

const ROUTES = [
  { name: "home", path: "/" },
  { name: "game", path: "/game" },
  { name: "how-it-works", path: "/how-it-works" },
];

async function run() {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      await page.goto(`http://localhost:5173${route.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      const file = path.join(OUT, `${vp.name}--${route.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`✓ ${file}`);
    }

    await ctx.close();
  }

  await browser.close();
  console.log("\nDone.");
}

run().catch((e) => { console.error(e); process.exit(1); });
