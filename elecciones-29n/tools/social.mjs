/* Genera el kit de imágenes para redes sociales en marketing/redes/.
 * Uso: NODE_PATH=$(npm root -g) node tools/social.mjs */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import C from "../src/config.mjs";
import { parties, questions } from "../src/data.mjs";
import { seoTopics } from "../src/seo-topics.mjs";
import { pollAverage } from "../src/polls-page.mjs";
import { pollParties, pollsUpdated } from "../src/polls.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "marketing", "redes");
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const LOGO = `<svg width="56" height="56" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2f3cf0"/><path d="M13 44a19 19 0 0 1 38 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M32 44l11-13" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="44" r="5" fill="#fff"/></svg>`;
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Inter:wght@500;600;700;800&display=swap" rel="stylesheet">`;
const base = (w, h, inner, bg = "#f6f5f1") => `${FONTS}<body style="margin:0;width:${w}px;height:${h}px;background:${bg};font-family:Inter,sans-serif;color:#16181d;position:relative;overflow:hidden;box-sizing:border-box">
<style>*{box-sizing:border-box}.d{font-family:'Bricolage Grotesque',Inter,sans-serif;font-weight:800;letter-spacing:-.03em}</style>
<div style="position:absolute;right:-160px;top:-160px;width:520px;height:520px;border-radius:50%;background:#e9ebff"></div>
<div style="position:relative;height:100%;padding:72px;display:flex;flex-direction:column">
<div style="display:flex;align-items:center;gap:16px" class="d"><span>${LOGO}</span><span style="font-size:38px">Partidó<span style="color:#2f3cf0">metro</span></span></div>
${inner}
</div></body>`;
const foot = (t = `Haz el test en <b>${C.domain}</b>`) => `<div style="margin-top:auto;background:#2f3cf0;color:#fff;border-radius:22px;padding:26px;text-align:center;font-size:34px;font-weight:700">${t}</div>`;
const LBL = { 2: "Totalmente a favor", 1: "A favor", 0: "Neutral / ambiguo", "-1": "En contra", "-2": "Totalmente en contra" };
const COL = { 2: "#14804f", 1: "#4bb27f", 0: "#9aa0aa", "-1": "#e0756b", "-2": "#bf2f2f" };

const slides = [];

/* 1. Portada genérica de carrusel */
slides.push(["00-portada-carrusel", 1080, 1350, base(1080, 1350, `
<div class="d" style="font-size:44px;color:#555b66;margin-top:120px">Elecciones generales · 29N</div>
<div class="d" style="font-size:120px;line-height:.98;margin-top:18px">¿Qué opina<br>cada partido<br><span style="color:#2f3cf0">de…?</span></div>
<div style="font-size:36px;color:#555b66;margin-top:40px;line-height:1.35">Las posiciones de los 11 partidos,<br>tema a tema y sin opinión.</div>
<div style="font-size:30px;color:#8a8f99;margin-top:30px">Desliza →</div>
${foot()}`)]);

/* 2. Una imagen por tema caliente */
const HOT = ["alquiler-tope", "okupas", "jornada", "regularizacion", "prioridad-nacional", "irpf", "autodeterminacion", "nucleares", "aborto-constitucion", "financiacion-singular"];
HOT.forEach((id, i) => {
  const q = questions.find((x) => x.id === id);
  const [, h1] = seoTopics[id];
  const rows = [...parties].sort((a, b) => q.pos[b.id][0] - q.pos[a.id][0]);
  slides.push([`${String(i + 1).padStart(2, "0")}-tema-${id}`, 1080, 1350, base(1080, 1350, `
<div class="d" style="font-size:54px;line-height:1.05;margin-top:36px">${esc(h1)}</div>
<div style="display:grid;gap:9px;margin-top:28px">${rows.map((p) => `<div style="display:flex;align-items:center;gap:18px;background:#fff;border-radius:14px;padding:10px 20px">
<span style="width:20px;height:20px;border-radius:50%;background:${p.color};flex-shrink:0"></span>
<b style="font-size:28px;width:260px">${esc(p.short)}</b>
<span style="margin-left:auto;background:${COL[q.pos[p.id][0]]};color:#fff;font-weight:800;font-size:22px;padding:7px 14px;border-radius:10px">${LBL[q.pos[p.id][0]]}</span></div>`).join("")}</div>
<div style="font-size:21px;color:#8a8f99;margin:12px 0 14px">Fuentes y justificación de cada posición en ${C.domain}</div>
${foot("¿Y tú? Descubre tu partido en <b>" + C.domain + "</b>")}`)]);
});

/* 3. Encuestas */
const A = pollAverage();
if (A) {
  const rows = pollParties.filter((p) => A.vote[p.id] != null).sort((a, b) => A.vote[b.id] - A.vote[a.id]).slice(0, 6);
  const max = Math.max(...rows.map((p) => A.vote[p.id]));
  const seat = (ids) => Math.round(ids.reduce((t, id) => t + (A.seats[id] || 0), 0));
  slides.push(["20-encuestas-media", 1080, 1350, base(1080, 1350, `
<div class="d" style="font-size:76px;line-height:1;margin-top:56px">¿Quién va<br>ganando el 29N?</div>
<div style="font-size:28px;color:#555b66;margin-top:16px">Media de ${A.used.length} encuestas publicadas · ${new Date(pollsUpdated + "T12:00").toLocaleDateString("es-ES", { day: "numeric", month: "long" })}</div>
<div style="display:grid;gap:22px;margin-top:44px">${rows.map((p) => `<div style="display:grid;grid-template-columns:250px 1fr 150px;align-items:center;gap:18px"><b style="font-size:34px">${esc(p.short)}</b><span style="height:34px;border-radius:17px;background:#e4e1d8;overflow:hidden"><i style="display:block;height:100%;width:${(A.vote[p.id] / max) * 100}%;background:${p.color};border-radius:17px"></i></span><b class="d" style="font-size:44px;text-align:right">${A.vote[p.id].toFixed(1).replace(".", ",")}%</b></div>`).join("")}</div>
<div style="display:flex;gap:18px;margin-top:40px"><div style="flex:1;background:#fff;border-radius:18px;padding:22px"><div style="font-size:26px;color:#555b66">PP + Vox</div><div class="d" style="font-size:64px">${seat(["pp", "vox"])}</div><div style="font-size:22px;color:#8a8f99">escaños · mayoría: 176</div></div><div style="flex:1;background:#fff;border-radius:18px;padding:22px"><div style="font-size:26px;color:#555b66">PSOE + FA + Podemos</div><div class="d" style="font-size:64px">${seat(["psoe", "frente-amplio", "podemos"])}</div><div style="font-size:22px;color:#8a8f99">escaños · mayoría: 176</div></div></div>
<div style="font-size:20px;color:#8a8f99;margin:14px 0">Media simple de sondeos de terceros (encuestadora, medio, campo y muestra en ${C.domain}/encuestas). No se publican encuestas del 24 al 29 de noviembre.</div>
${foot("Las encuestas dicen quién gana. ¿A quién te pareces tú? <b>" + C.domain + "</b>")}`)]);
}

/* 4. Mesa electoral */
slides.push(["30-mesa-electoral", 1080, 1350, base(1080, 1350, `
<div class="d" style="font-size:88px;line-height:1;margin-top:60px">¿Te ha tocado<br>mesa el 29N?</div>
<div style="display:grid;gap:18px;margin-top:46px;font-size:34px">
<div style="background:#fff;border-radius:18px;padding:22px 26px">💶 Cobras <b>75 €</b> (presidentes y vocales)</div>
<div style="background:#fff;border-radius:18px;padding:22px 26px">🗳️ Sorteo: <b>31 oct – 4 nov</b></div>
<div style="background:#fff;border-radius:18px;padding:22px 26px">✍️ Alegaciones: <b>7 días</b> desde la notificación</div>
<div style="background:#fff;border-radius:18px;padding:22px 26px">🕗 A las <b>8:00</b> en tu colegio</div>
<div style="background:#fff;border-radius:18px;padding:22px 26px">🏢 Al día siguiente, <b>5 horas menos</b> de trabajo</div>
<div style="background:#fde7e7;border-radius:18px;padding:22px 26px">⚠️ No ir sin causa es <b>delito</b></div></div>
${foot("Guía completa en <b>" + C.domain + "</b>")}`)]);

/* 5. Voto por correo */
slides.push(["31-voto-por-correo", 1080, 1350, base(1080, 1350, `
<div class="d" style="font-size:88px;line-height:1;margin-top:60px">¿Votas por<br>correo el 29N?</div>
<div style="display:grid;gap:20px;margin-top:50px">
${[["Hasta el 19 nov", "Pídelo en Correos (con DNI) o en su web"], ["Desde el 9 nov", "Te llegan las papeletas a casa"], ["Hasta el 25 nov", "Entrega tu voto en Correos"]].map(([a, b]) => `<div style="display:flex;gap:22px;align-items:center;background:#fff;border-radius:20px;padding:26px"><b class="d" style="font-size:44px;color:#2f3cf0;width:340px;flex-shrink:0">${a}</b><span style="font-size:32px">${b}</span></div>`).join("")}
<div style="font-size:30px;color:#555b66;margin-top:8px">Si lo pides, ya no puedes votar en persona.</div></div>
${foot("Antes de votar: ¿con quién coincides? <b>" + C.domain + "</b>")}`)]);

/* 6. Story CTA (1080x1920) */
const days = Math.ceil((new Date(C.electionDate) - new Date()) / 864e5);
slides.push(["40-story-haz-el-test", 1080, 1920, base(1080, 1920, `
<div class="d" style="font-size:54px;color:#555b66;margin-top:240px">Faltan ${days} días para el 29N</div>
<div class="d" style="font-size:150px;line-height:.95;margin-top:24px">¿A quién<br>votar?</div>
<div style="font-size:44px;color:#555b66;margin-top:40px;line-height:1.3">44 preguntas · 11 partidos<br>3 minutos · gratis y anónimo</div>
<div class="d" style="font-size:64px;color:#2f3cf0;margin-top:60px">Haz el test 👇</div>
${foot("<b>" + C.domain + "</b>")}`)]);

/* 7. Diapositiva final de carrusel */
slides.push(["99-cierre-carrusel", 1080, 1350, base(1080, 1350, `
<div class="d" style="font-size:110px;line-height:.98;margin-top:140px">¿Y tú,<br>con quién<br><span style="color:#2f3cf0">coincides?</span></div>
<div style="font-size:38px;color:#555b66;margin-top:40px;line-height:1.35">Responde 44 preguntas y mira tu % de afinidad con cada partido.</div>
<div style="font-size:30px;color:#8a8f99;margin-top:20px">Independiente · sin registro · tus respuestas no salen de tu móvil</div>
${foot("Enlace en la bio · <b>" + C.domain + "</b>")}`)]);

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, w, h, html] of slides) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, name + ".png") });
}
await browser.close();
console.log(`${slides.length} imágenes en marketing/redes/`);
