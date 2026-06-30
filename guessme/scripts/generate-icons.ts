/**
 * Generates PWA icon PNGs from the SVG source using Playwright (no extra deps).
 * Run: npx tsx scripts/generate-icons.ts
 *
 * Outputs:
 *   public/icons/icon-192.png   — standard 192×192 icon
 *   public/icons/icon-512.png   — standard 512×512 icon
 *   public/icons/maskable-512.png — maskable icon (safe-zone padded, opaque bg)
 */
import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ICONS_DIR = path.join(process.cwd(), "public", "icons");
const ICON_SVG = path.join(ICONS_DIR, "icon.svg");
const MASKABLE_SVG = path.join(ICONS_DIR, "maskable.svg");

/** Build the maskable variant: same design, no rounded corners, explicit opaque fill */
function writeMaskableSvg() {
  const src = fs.readFileSync(ICON_SVG, "utf8");
  // Replace rx="96" with rx="0" so the OS mask applies cleanly to a square bg
  const maskable = src.replace('rx="96"', 'rx="0"');
  fs.writeFileSync(MASKABLE_SVG, maskable);
}

async function renderSvgToPng(svgPath: string, size: number, outPath: string) {
  const svgContent = fs.readFileSync(svgPath, "utf8");
  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
  div { width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; }
  svg { width: ${size}px; height: ${size}px; }
</style>
</head>
<body><div>${svgContent}</div></body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html, { waitUntil: "load" });
  const buffer = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width: size, height: size },
    omitBackground: false,
  });
  await browser.close();
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ ${outPath} (${size}×${size})`);
}

async function run() {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  writeMaskableSvg();

  await renderSvgToPng(ICON_SVG, 192, path.join(ICONS_DIR, "icon-192.png"));
  await renderSvgToPng(ICON_SVG, 512, path.join(ICONS_DIR, "icon-512.png"));
  await renderSvgToPng(MASKABLE_SVG, 512, path.join(ICONS_DIR, "maskable-512.png"));

  // Remove the temporary maskable SVG
  fs.unlinkSync(MASKABLE_SVG);

  console.log("\nAll icons generated in public/icons/");
}

run().catch((e) => { console.error(e); process.exit(1); });
