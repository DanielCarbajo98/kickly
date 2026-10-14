/* Genera og.png (1200x630), apple-touch-icon.png (180) y favicon-96.png con Chromium.
 * Uso: NODE_PATH=$(npm root -g) node tools/images.mjs */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import C from "../src/config.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const browser = await chromium.launch();
const page = await browser.newPage();
const font = `<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Inter:wght@500;700&display=swap" rel="stylesheet">`;
const check = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2f3cf0"/><path d="M13 44a19 19 0 0 1 38 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M32 44l11-13" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="44" r="5" fill="#fff"/></svg>`;

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`${font}<body style="margin:0;width:1200px;height:630px;background:#f6f5f1;font-family:Inter,sans-serif;display:flex;flex-direction:column;justify-content:center;padding:0 80px;box-sizing:border-box;position:relative;overflow:hidden">
<div style="position:absolute;right:-120px;top:-120px;width:520px;height:520px;border-radius:50%;background:#e9ebff"></div>
<div style="display:flex;align-items:center;gap:16px;font-family:'Bricolage Grotesque';font-weight:800;font-size:44px;letter-spacing:-1.5px;position:relative">${check(64, 8)}<span>${C.brandHtml.replace("<b>", '<b style="color:#2f3cf0">')}</span></div>
<div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:84px;line-height:1;letter-spacing:-3px;margin:34px 0 22px;color:#16181d;position:relative">¿A quién votar el 29N?<br><span style="color:#2f3cf0">Haz el test.</span></div>
<div style="font-size:30px;color:#555b66;font-weight:500;position:relative">Test de afinidad política · Elecciones generales 2026 · Gratis y anónimo</div>
</body>`);
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, "og.png") });

for (const [s, f] of [[180, "apple-touch-icon.png"], [96, "favicon-96.png"]]) {
  await page.setViewportSize({ width: s, height: s });
  await page.setContent(`<body style="margin:0">${check(s, 8)}</body>`);
  await page.screenshot({ path: path.join(OUT, f), omitBackground: true });
}
await browser.close();
console.log("imágenes generadas");
