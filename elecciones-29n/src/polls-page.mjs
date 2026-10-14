/* Página de encuestas: media de sondeos publicados por terceros, hemiciclo
 * y tabla con ficha técnica (art. 69 LOREG). Respeta la veda del art. 69.7:
 * no se publican encuestas del 24 al 29 de noviembre (hasta el cierre). */
import C from "./config.mjs";
import { polls, pollsUpdated, pollParties } from "./polls.mjs";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmt = (n) => (n == null ? "–" : n.toFixed(1).replace(".", ","));
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

/* Veda electoral: desde el 24 nov 00:00 hasta el 29 nov 21:00 (cierre en Canarias, hora peninsular). */
export const BLACKOUT_START = "2026-11-24T00:00:00+01:00";
export const BLACKOUT_END = "2026-11-29T21:00:00+01:00";
export function inBlackout(now = new Date()) {
  return now >= new Date(BLACKOUT_START) && now < new Date(BLACKOUT_END);
}

/* Media: última encuesta de cada encuestadora en los 30 días anteriores a la más reciente. */
export function pollAverage() {
  if (!polls.length) return null;
  const sorted = [...polls].sort((a, b) => b.published.localeCompare(a.published));
  const newest = new Date(sorted[0].published);
  const cutoff = new Date(newest.getTime() - 30 * 864e5);
  const seen = new Set(), used = [];
  for (const p of sorted) {
    if (new Date(p.published) < cutoff || seen.has(p.pollster)) continue;
    seen.add(p.pollster);
    used.push(p);
  }
  const avg = (field, id) => {
    const v = used.map((p) => p[field]?.[id]).filter((x) => typeof x === "number");
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };
  const vote = {}, seats = {}, seatsN = {};
  for (const id of pollParties.map((p) => p.id)) {
    vote[id] = avg("vote", id);
    seats[id] = avg("seats", id);
    seatsN[id] = used.filter((p) => typeof p.seats?.[id] === "number").length;
    // Solo mostramos la media de voto si al menos 3 institutos dan dato.
    if (used.filter((p) => typeof p.vote?.[id] === "number").length < 3) vote[id] = null;
  }
  return { used, vote, seats, seatsN };
}

/* Hemiciclo de 350 escaños en SVG. */
function hemicycle(seatList) {
  const total = 350, rows = 12, r0 = 120, r1 = 290, cx = 300, cy = 305;
  const radii = Array.from({ length: rows }, (_, i) => r0 + ((r1 - r0) * i) / (rows - 1));
  const sumR = radii.reduce((a, b) => a + b, 0);
  let counts = radii.map((r) => Math.round((total * r) / sumR));
  let diff = total - counts.reduce((a, b) => a + b, 0);
  for (let i = rows - 1; diff !== 0; i = (i - 1 + rows) % rows) { counts[i] += Math.sign(diff); diff -= Math.sign(diff); }
  const pts = [];
  radii.forEach((r, i) => {
    const n = counts[i];
    for (let k = 0; k < n; k++) {
      const a = Math.PI - (Math.PI * k) / (n - 1);
      pts.push({ x: cx + r * Math.cos(a), y: cy - r * Math.sin(a), a });
    }
  });
  pts.sort((p, q) => q.a - p.a);
  const colors = [];
  for (const s of seatList) for (let i = 0; i < s.n; i++) colors.push(s.color);
  while (colors.length < total) colors.push("#c9c6bd");
  return `<svg class="hemi" viewBox="0 0 600 320" role="img" aria-label="Reparto estimado de escaños">${pts.map((p, i) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5.6" fill="${colors[i]}"/>`).join("")}<text x="300" y="290" text-anchor="middle" font-family="Bricolage Grotesque, Inter, sans-serif" font-weight="800" font-size="34" fill="currentColor">350</text><text x="300" y="312" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="#8a8f99">escaños · mayoría 176</text></svg>`;
}

export function pollsWidget() {
  const A = pollAverage();
  if (!A) return "";
  const rows = pollParties.filter((p) => A.vote[p.id] != null).sort((a, b) => A.vote[b.id] - A.vote[a.id]).slice(0, 6);
  const max = Math.max(...rows.map((p) => A.vote[p.id]));
  return `<div class="card" data-polls><h3>¿Quién va ganando? Media de encuestas</h3><p>Media de ${A.used.length} encuestas publicadas. Actualizado el ${fmtDate(pollsUpdated)}.</p>
<div class="poll-hero">${rows.map((p) => `<div class="poll-row"><span class="sc-n"><i class="dot" style="background:${p.color}"></i>${esc(p.short)}</span><span class="rk-bar"><i style="width:${((A.vote[p.id] / max) * 100).toFixed(1)}%;background:${p.color}"></i></span><b>${fmt(A.vote[p.id])}%</b></div>`).join("")}</div>
<p style="margin-top:12px"><a href="/encuestas/">Ver todas las encuestas y el reparto de escaños →</a></p></div>`;
}

export function pollsPage({ layout, write, ctaBox, crumbs, crumbLd, ad }) {
  const blocked = inBlackout();
  const A = blocked ? null : pollAverage();
  let body;
  const blackoutBox = `<div class="blackout">Por ley (art. 69.7 de la LOREG), del 24 de noviembre hasta el cierre de los colegios el 29 de noviembre no se pueden publicar ni difundir encuestas electorales. Volveremos a mostrar los datos después de la votación.</div>`;
  if (!A) {
    body = `<div class="wrap">${crumbs([["Encuestas"]])}<div class="page-head"><h1>Encuestas de las elecciones generales del 29N</h1></div>${blackoutBox}${ctaBox("Mientras tanto: ¿con qué partido coincides más?")}</div>`;
  } else {
    const parties = pollParties.filter((p) => A.vote[p.id] != null).sort((a, b) => A.vote[b.id] - A.vote[a.id]);
    const max = Math.max(...parties.map((p) => A.vote[p.id]));
    const seatParties = pollParties.filter((p) => A.seats[p.id] != null && A.seatsN[p.id] >= 3 && A.seats[p.id] >= 0.5);
    const hasSeats = seatParties.length >= 3;
    const main = seatParties.map((p) => ({ lr: p.lr, n: Math.round(A.seats[p.id]), color: p.color }));
    const rest = Math.max(0, 350 - main.reduce((t, x) => t + x.n, 0));
    const ordered = [...main, { lr: 7.5, n: rest, color: "#c9c6bd" }].sort((a, b) => a.lr - b.lr);
    const sum = (ids) => ids.reduce((t, id) => t + (A.seats[id] || 0), 0);
    const right = sum(["pp", "vox"]), left = sum(["psoe", "frente-amplio", "podemos"]);
    const cols = pollParties.filter((p) => polls.some((x) => x.vote?.[p.id] != null));
    const sorted = [...polls].sort((a, b) => b.published.localeCompare(a.published));
    body = `<div class="wrap">${crumbs([["Encuestas"]])}
<div class="page-head"><h1>Encuestas elecciones generales 29N: ¿quién va ganando?</h1><p>Media de las encuestas publicadas para las elecciones del 29 de noviembre de 2026, con el reparto estimado de escaños y la ficha técnica de cada sondeo. Actualizado el ${fmtDate(pollsUpdated)}.</p></div>
<div data-polls-live>
<div class="res-grid" style="margin-top:8px">
<div class="card"><h3>Estimación de voto · media</h3><p>Media de las últimas encuestas de ${A.used.length} institutos distintos.</p>
<div class="poll-hero">${parties.map((p) => `<div class="poll-row"><span class="sc-n"><i class="dot" style="background:${p.color}"></i>${esc(p.short)}</span><span class="rk-bar"><i style="width:${((A.vote[p.id] / max) * 100).toFixed(1)}%;background:${p.color}"></i></span><b>${fmt(A.vote[p.id])}%</b></div>`).join("")}</div></div>
${hasSeats ? `<div class="card"><h3>Escaños estimados · media</h3>${hemicycle(ordered)}
<div class="legend" style="justify-content:center"><span><i class="dot" style="background:#c9c6bd"></i>Resto de partidos ${rest}</span>${seatParties.sort((a, b) => (A.seats[b.id] || 0) - (A.seats[a.id] || 0)).map((p) => `<span><i class="dot" style="background:${p.color}"></i>${esc(p.short)} ${Math.round(A.seats[p.id])}</span>`).join("")}</div>
<div class="blocks"><div class="block"><span>PP + Vox</span><b>${Math.round(right)}</b><small>${right >= 176 ? "Superan" : "No alcanzan"} la mayoría absoluta</small></div><div class="block"><span>PSOE + Frente Amplio + Podemos</span><b>${Math.round(left)}</b><small>${left >= 176 ? "Superan" : "No alcanzan"} la mayoría absoluta</small></div></div>
<p class="disclaimer">Sumas aritméticas de escaños: no implican pactos. El resto depende de los partidos nacionalistas y regionalistas.</p></div>` : ""}
</div>
${ad("content")}
<section class="section"><h2>Todas las encuestas publicadas</h2>
<div class="card tbl-scroll"><table class="qa-table polls-table"><thead><tr><th>Encuestadora · medio</th><th>Trabajo de campo</th><th>Muestra</th>${cols.map((p) => `<th><span class="dot" style="background:${p.color};display:inline-block"></span> ${esc(p.short)}</th>`).join("")}</tr></thead><tbody>
${sorted.map((x) => `<tr><td><a href="${esc(x.url)}" rel="nofollow noopener" target="_blank">${esc(x.pollster)}</a>${x.media ? ` · ${esc(x.media)}` : ""}<br><small>Publicada el ${fmtDate(x.published)}</small></td><td>${esc(x.fieldwork || "–")}</td><td>${x.sample ? x.sample.toLocaleString("es-ES") : "–"}</td>${cols.map((p) => `<td>${fmt(x.vote?.[p.id])}${x.seats?.[p.id] != null ? `<br><small>${x.seats[p.id]} esc.</small>` : ""}</td>`).join("")}</tr>`).join("")}
</tbody></table></div>
<p class="disclaimer">Estimación de voto en % sobre voto válido y escaños según cada encuestadora. Fuentes enlazadas en cada fila. ${esc(C.brand)} no elabora encuestas propias: recopila y promedia sondeos ya publicados por terceros. Las encuestas son estimaciones con margen de error, no resultados.</p></section>
<section class="section prose" style="padding-top:0"><h2>Cómo calculamos la media</h2><p>Tomamos la encuesta más reciente de cada instituto publicada en los 30 días anteriores al último sondeo y hacemos la media simple de su estimación de voto y de escaños. Todos los institutos pesan igual. Del 24 al 29 de noviembre dejaremos de publicar encuestas, porque lo prohíbe el artículo 69.7 de la LOREG.</p></section>
</div>
<div data-polls-blackout hidden>${blackoutBox}</div>
<script>(function(){var n=Date.now();if(n>=${new Date(BLACKOUT_START).getTime()}&&n<${new Date(BLACKOUT_END).getTime()}){document.querySelectorAll('[data-polls-live]').forEach(function(e){e.remove()});document.querySelector('[data-polls-blackout]').hidden=false;}})();</script>
${ctaBox("Las encuestas dicen quién gana. El test te dice a quién te pareces tú.")}</div>`;
  }
  write("encuestas/index.html", layout({
    path: "/encuestas/", nav: "enc",
    title: `Encuestas elecciones generales 29N 2026: quién va ganando | ${C.brand}`,
    description: "Media de encuestas de las elecciones generales del 29 de noviembre de 2026: estimación de voto y escaños de PP, PSOE, Vox, Sumar, Podemos y SALF, con la ficha técnica de cada sondeo.",
    body,
    jsonld: [crumbLd([["Encuestas", "/encuestas/"]])],
  }));
}
