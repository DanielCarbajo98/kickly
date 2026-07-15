#!/usr/bin/env node
/**
 * Genera una página HTML estática por evento en /ver/<id>.html y
 * reconstruye sitemap.xml. Ejecutar tras editar data/events.json:
 *   node tools/build-events.js
 */
const fs = require("fs");
const path = require("path");

const SITE = "https://kickly.app";
const ROOT = path.join(__dirname, "..");
const SPORTS = { futbol: "Fútbol", baloncesto: "Baloncesto", tenis: "Tenis", ufc: "UFC · MMA" };

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data/events.json"), "utf8"));
const events = data.events || [];
const WATCH = data.watch || {};

const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const title = ev => ev.away ? `${ev.home} – ${ev.away}` : ev.home;
const sportName = ev => SPORTS[ev.sport] || ev.sport;
const longDate = iso => new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(new Date(iso));

function keywords(ev) {
  const kws = [];
  const pairs = ev.away
    ? [`${ev.home} ${ev.away}`, `${ev.away} ${ev.home}`, `${ev.home} vs ${ev.away}`]
    : [ev.home];
  for (const p of pairs) {
    kws.push(`ver ${p} gratis`, `ver ${p} online`, `${p} en directo`, `ver ${p} online gratis`, `${p} streaming`, `${p} en vivo`);
  }
  kws.push(`${ev.competitionName} en directo`, `ver ${sportName(ev).toLowerCase()} online gratis`);
  return kws;
}

function eventLd(ev) {
  const url = `${SITE}/ver/${encodeURIComponent(ev.id)}.html`;
  const ld = {
    "@type": "SportsEvent",
    name: `${title(ev)} — ${ev.competitionName}`,
    description: ev.description || `${title(ev)} en directo. ${sportName(ev)} · ${ev.competitionName}.`,
    startDate: ev.date,
    sport: sportName(ev),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url },
    organizer: { "@type": "Organization", name: ev.competitionName },
    url
  };
  if (ev.away) ld.competitor = [{ "@type": "SportsTeam", name: ev.home }, { "@type": "SportsTeam", name: ev.away }];
  return ld;
}

function globalSources() {
  if (!WATCH.url || !(WATCH.buttons || []).length) return [];
  return WATCH.buttons.map(label => ({ label, url: WATCH.url }));
}

function sourcesPanelStatic(ev) {
  const srcs = ((ev.sources && ev.sources.length) ? ev.sources : globalSources()).filter(s => s && s.url);
  if (!srcs.length) return "";
  const btns = srcs.map((s, i) =>
    `<a class="src-btn" href="${esc(s.url)}" target="_blank" rel="nofollow noopener"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>${esc(s.label || ("Enlace " + (i + 1)))}</a>`
  ).join("");
  return `<div class="sources"><div class="sources-head">Dónde ver ${esc(title(ev))} en directo</div><div class="sources-btns">${btns}</div></div>`;
}

function broadcastersStatic(ev) {
  const bs = ev.broadcasters || [];
  if (!bs.length) return "";
  const rows = bs.map(b => {
    const ch = b.url
      ? `<a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.channels)}</a>`
      : esc(b.channels);
    return `<tr><th>${esc(b.country)}</th><td>${ch}</td></tr>`;
  }).join("");
  return `<section class="section"><h2>Dónde ver ${esc(title(ev))} por país</h2><table class="bcast"><tbody>${rows}</tbody></table></section>`;
}

const MARK = `<svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true"><path d="M18 36a20 20 0 0 1 28 0" stroke="#ff4655" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M8 26a34 34 0 0 1 48 0" stroke="#ff4655" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="32" cy="47" r="8" fill="#ff4655"/></svg>`;
const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2316181d'/%3E%3Cpath d='M18 36a20 20 0 0 1 28 0' stroke='%23ff4655' stroke-width='7' fill='none' stroke-linecap='round'/%3E%3Cpath d='M8 26a34 34 0 0 1 48 0' stroke='%23ff4655' stroke-width='7' fill='none' stroke-linecap='round' opacity='.5'/%3E%3Ccircle cx='32' cy='47' r='8' fill='%23ff4655'/%3E%3C/svg%3E`;
const MULTITAG = `<script src="https://quge5.com/88/tag.min.js" data-zone="259826" async data-cfasync="false"></script>`;

function page(ev) {
  const t = `Ver ${title(ev)} Online Gratis — ${ev.competitionName} en directo | Kickly`;
  const desc = `Ver ${title(ev)} gratis y online: ${sportName(ev)} · ${ev.competitionName}, ${longDate(ev.date)} h. ${ev.description ? ev.description + " " : ""}Emisión en directo en Kickly.`;
  const canon = `${SITE}/ver/${encodeURIComponent(ev.id)}.html`;
  const scene = SPORTS[ev.sport] ? ev.sport : "futbol";
  const ld = Object.assign({ "@context": "https://schema.org" }, eventLd(ev));
  const bc = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: sportName(ev), item: `${SITE}/deportes/${ev.sport}.html` },
      { "@type": "ListItem", position: 3, name: title(ev) }
    ]
  };
  const broadcast = {
    "@context": "https://schema.org", "@type": "BroadcastEvent",
    name: `Ver ${title(ev)} online gratis`, isLiveBroadcast: true, videoFormat: "HD",
    inLanguage: "es", startDate: ev.date, broadcastOfEvent: eventLd(ev)
  };
  return `<!DOCTYPE html>
<html lang="es">
<head>
${MULTITAG}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(keywords(ev).join(", "))}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canon}">
<meta property="og:type" content="video.other">
<meta property="og:site_name" content="Kickly">
<meta property="og:title" content="${esc(t)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canon}">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0b0c0f">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/style.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(bc)}</script>
<script type="application/ld+json">${JSON.stringify(broadcast)}</script>
</head>
<body data-root=".." data-event-id="${esc(ev.id)}">
<header class="hd">
  <div class="wrap hd-in">
    <a class="brand" href="../" aria-label="Kickly — inicio">${MARK}<span class="brand-name">kickly</span></a>
    <nav class="hd-nav" aria-label="Deportes">
      <a href="../">Agenda</a>
      <a href="../deportes/futbol.html">Fútbol</a>
      <a href="../deportes/baloncesto.html">Baloncesto</a>
      <a href="../deportes/tenis.html">Tenis</a>
      <a href="../deportes/ufc.html">UFC</a>
    </nav>
    <div class="hd-live" id="live-indicator"><i></i><span>DIRECTO</span></div>
  </div>
</header>

<main>
  <div class="wrap">
    <div id="event-page">
      <nav class="crumbs" aria-label="Ruta"><a href="../">Inicio</a><span class="sep">/</span><a href="../deportes/${esc(ev.sport)}.html">${esc(sportName(ev))}</a><span class="sep">/</span><span>${esc(title(ev))}</span></nav>
      <div class="player">
        <div class="sim"><div class="sim-scene ${esc(scene)}"></div>
          <button class="play-btn" aria-label="Ver ${esc(title(ev))}"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
          <div class="sim-title">${esc(title(ev))}</div>
          <div class="sim-sub">${esc(longDate(ev.date))} h</div>
        </div>
      </div>
      ${sourcesPanelStatic(ev)}
      <header class="ev-head"><h1>Ver ${esc(title(ev))} en directo online gratis</h1>
        <div class="meta"><span>${esc(sportName(ev))} · ${esc(ev.competitionName)}</span><time datetime="${esc(ev.date)}">${esc(longDate(ev.date))} h</time></div>
      </header>
      ${ev.description ? `<p class="ev-desc">${esc(ev.description)}</p>` : ""}
      ${broadcastersStatic(ev)}
    </div>
    <div class="ad" id="ad-bottom"></div>
  </div>
</main>

<footer class="ft">
  <div class="wrap">
    <div class="ft-in">
      <div>
        <a class="brand" href="../" aria-label="Kickly">${MARK}<span class="brand-name">kickly</span></a>
        <p>La agenda del deporte en directo: horarios y emisiones de fútbol, baloncesto, tenis y UFC, en tu zona horaria y desde cualquier dispositivo.</p>
      </div>
      <div>
        <h3>Deportes</h3>
        <ul>
          <li><a href="../deportes/futbol.html">Fútbol en directo</a></li>
          <li><a href="../deportes/baloncesto.html">Baloncesto en directo</a></li>
          <li><a href="../deportes/tenis.html">Tenis en directo</a></li>
          <li><a href="../deportes/ufc.html">UFC · MMA en directo</a></li>
        </ul>
      </div>
      <div>
        <h3>Kickly</h3>
        <ul>
          <li><a href="../">Agenda de hoy</a></li>
          <li><a href="../aviso-legal.html">Aviso legal</a></li>
        </ul>
      </div>
    </div>
    <div class="ft-base"><span>© 2026 Kickly</span><span>kickly.app · deporte en directo</span></div>
  </div>
</footer>

<script src="../assets/js/config.js"></script>
<script src="../assets/js/app.js" defer></script>
</body>
</html>
`;
}

// --- Generar páginas /ver/ ---
const verDir = path.join(ROOT, "ver");
fs.rmSync(verDir, { recursive: true, force: true });
fs.mkdirSync(verDir, { recursive: true });
for (const ev of events) {
  fs.writeFileSync(path.join(verDir, `${ev.id}.html`), page(ev));
  console.log(`ver/${ev.id}.html`);
}

// --- Regenerar sitemap.xml ---
const today = new Date().toISOString().slice(0, 10);
const staticUrls = [
  { loc: `${SITE}/`, freq: "hourly", pri: "1.0" },
  { loc: `${SITE}/deportes/futbol.html`, freq: "daily", pri: "0.8" },
  { loc: `${SITE}/deportes/baloncesto.html`, freq: "daily", pri: "0.8" },
  { loc: `${SITE}/deportes/tenis.html`, freq: "daily", pri: "0.8" },
  { loc: `${SITE}/deportes/ufc.html`, freq: "daily", pri: "0.8" },
  { loc: `${SITE}/aviso-legal.html`, freq: "yearly", pri: "0.2" }
];
const eventUrls = events
  .filter(ev => ev.status !== "finished")
  .map(ev => ({ loc: `${SITE}/ver/${encodeURIComponent(ev.id)}.html`, freq: "hourly", pri: "0.9" }));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...eventUrls].map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
console.log(`sitemap.xml (${staticUrls.length + eventUrls.length} URLs)`);
