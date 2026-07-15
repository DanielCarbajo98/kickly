#!/usr/bin/env node
/**
 * Genera el sitio multilingüe (es/en/pt):
 *  - /ver/<id>.html, /en/ver/<id>.html, /pt/ver/<id>.html   (páginas de evento)
 *  - /index.html se mantiene a mano; /en/index.html y /pt/index.html se generan
 *  - /en/deportes/<s>.html y /pt/deportes/<s>.html          (landing por deporte)
 *  - sitemap.xml con hreflang
 * Ejecutar tras editar data/events.json:  node tools/build-events.js
 */
const fs = require("fs");
const path = require("path");

const SITE = "https://kickly.app";
const ROOT = path.join(__dirname, "..");
const SPORTS = { futbol: "Fútbol", baloncesto: "Baloncesto", tenis: "Tenis", ufc: "UFC · MMA", ciclismo: "Ciclismo" };
const SPORT_ORDER = ["futbol", "baloncesto", "tenis", "ufc", "ciclismo"];

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data/events.json"), "utf8"));
const events = data.events || [];
const WATCH = data.watch || {};

const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const title = ev => ev.away ? `${ev.home} – ${ev.away}` : ev.home;
const sportName = ev => SPORTS[ev.sport] || ev.sport;

/* ---------- Idiomas ---------- */
const LANGS = [
  { code: "es", prefix: "", locale: "es-ES", htmlLang: "es" },
  { code: "en", prefix: "/en", locale: "en-GB", htmlLang: "en" },
  { code: "pt", prefix: "/pt", locale: "pt-BR", htmlLang: "pt" }
];

const TR = {
  es: {
    nav: { agenda: "Agenda", futbol: "Fútbol", baloncesto: "Baloncesto", tenis: "Tenis", ufc: "UFC", ciclismo: "Ciclismo" },
    live: "DIRECTO", loading: "Cargando agenda…",
    homeTitle: "Ver Partidos Gratis Online — Fútbol, Baloncesto, Tenis y UFC en Directo | Kickly",
    homeDesc: "Ver partidos gratis online y en directo: fútbol, baloncesto, tenis, UFC y ciclismo de hoy. Agenda con horarios y dónde ver cada partido.",
    homeH1: "Ver partidos gratis online, hoy en directo",
    homeIntro: "La agenda completa del deporte en vivo: fútbol, baloncesto, tenis, UFC y ciclismo. Horarios en tu zona horaria y dónde ver cada evento.",
    searchPh: "Buscar equipo, competición o evento…",
    all: "Todos", where: t => `Dónde ver ${t} en directo`, byCountry: t => `Dónde ver ${t} por país`,
    h1ev: t => `Ver ${t} en directo online gratis`,
    evTitle: (t, c) => `Ver ${t} Online Gratis — ${c} en directo | Kickly`,
    evDesc: (t, sp, c, d, extra) => `Ver ${t} gratis y online: ${sp} · ${c}, ${d} h. ${extra ? extra + " " : ""}Dónde ver el evento en directo en Kickly.`,
    linksSoon: (t, d) => `Los enlaces para ver ${t} se publicarán poco antes del inicio (${d} h). Vuelve entonces.`,
    linksHead: "Enlaces del partido", footTag: "Kickly · deporte en directo",
    footAbout: "La agenda del deporte en directo: horarios y dónde ver fútbol, baloncesto, tenis, UFC y ciclismo, en tu zona horaria y desde cualquier dispositivo.",
    footSports: "Deportes", footKickly: "Kickly", legal: "Aviso legal", todayAgenda: "Agenda de hoy",
    sportTitle: n => `Ver ${n} Online Gratis — en directo hoy | Kickly`,
    sportDesc: n => `Ver ${n.toLowerCase()} gratis online y en directo hoy: horarios y dónde ver cada evento por país en kickly.app.`,
    sportH1: n => `Ver ${n} online gratis, en directo`,
    sportIntro: n => `Agenda de ${n.toLowerCase()} en directo: horarios en tu zona horaria y los enlaces y canales oficiales para ver cada evento.`
  },
  en: {
    nav: { agenda: "Schedule", futbol: "Football", baloncesto: "Basketball", tenis: "Tennis", ufc: "UFC", ciclismo: "Cycling" },
    live: "LIVE", loading: "Loading schedule…",
    homeTitle: "Watch Sports Free Online — Football, Basketball, Tennis & UFC Live | Kickly",
    homeDesc: "Watch sports free online and live: today's football, basketball, tennis, UFC and cycling. Schedule with kick-off times and where to watch each event.",
    homeH1: "Watch sports free online, live today",
    homeIntro: "The full live sports schedule: football, basketball, tennis, UFC and cycling. Times in your timezone and where to watch every event.",
    searchPh: "Search team, competition or event…",
    all: "All", where: t => `Where to watch ${t} live`, byCountry: t => `Where to watch ${t} by country`,
    h1ev: t => `Watch ${t} live free online`,
    evTitle: (t, c) => `Watch ${t} Free Online — ${c} live | Kickly`,
    evDesc: (t, sp, c, d, extra) => `Watch ${t} free and online: ${sp} · ${c}, ${d}. ${extra ? extra + " " : ""}Where to watch the event live on Kickly.`,
    linksSoon: (t, d) => `The links to watch ${t} will be published shortly before kick-off (${d}). Check back then.`,
    linksHead: "Event links", footTag: "Kickly · live sports",
    footAbout: "The live sports schedule: times and where to watch football, basketball, tennis, UFC and cycling, in your timezone and on any device.",
    footSports: "Sports", footKickly: "Kickly", legal: "Legal notice", todayAgenda: "Today's schedule",
    sportTitle: n => `Watch ${n} Free Online — live today | Kickly`,
    sportDesc: n => `Watch ${n.toLowerCase()} free online and live today: times and where to watch every event by country on kickly.app.`,
    sportH1: n => `Watch ${n} free online, live`,
    sportIntro: n => `Live ${n.toLowerCase()} schedule: times in your timezone plus the links and official channels to watch every event.`
  },
  pt: {
    nav: { agenda: "Agenda", futbol: "Futebol", baloncesto: "Basquete", tenis: "Tênis", ufc: "UFC", ciclismo: "Ciclismo" },
    live: "AO VIVO", loading: "Carregando agenda…",
    homeTitle: "Assistir Jogos Online Grátis — Futebol, Basquete, Tênis e UFC Ao Vivo | Kickly",
    homeDesc: "Assistir jogos online grátis e ao vivo: futebol, basquete, tênis, UFC e ciclismo de hoje. Agenda com horários e onde assistir cada jogo.",
    homeH1: "Assistir jogos online grátis, hoje ao vivo",
    homeIntro: "A agenda completa do esporte ao vivo: futebol, basquete, tênis, UFC e ciclismo. Horários no seu fuso e onde assistir cada evento.",
    searchPh: "Buscar time, competição ou evento…",
    all: "Todos", where: t => `Onde assistir ${t} ao vivo`, byCountry: t => `Onde assistir ${t} por país`,
    h1ev: t => `Assistir ${t} ao vivo online grátis`,
    evTitle: (t, c) => `Assistir ${t} Online Grátis — ${c} ao vivo | Kickly`,
    evDesc: (t, sp, c, d, extra) => `Assistir ${t} grátis e online: ${sp} · ${c}, ${d}. ${extra ? extra + " " : ""}Onde assistir ao evento ao vivo na Kickly.`,
    linksSoon: (t, d) => `Os links para assistir ${t} serão publicados pouco antes do início (${d}). Volte então.`,
    linksHead: "Links do evento", footTag: "Kickly · esporte ao vivo",
    footAbout: "A agenda do esporte ao vivo: horários e onde assistir futebol, basquete, tênis, UFC e ciclismo, no seu fuso e em qualquer dispositivo.",
    footSports: "Esportes", footKickly: "Kickly", legal: "Aviso legal", todayAgenda: "Agenda de hoje",
    sportTitle: n => `Assistir ${n} Online Grátis — ao vivo hoje | Kickly`,
    sportDesc: n => `Assistir ${n.toLowerCase()} online grátis e ao vivo hoje: horários e onde assistir cada evento por país na kickly.app.`,
    sportH1: n => `Assistir ${n} online grátis, ao vivo`,
    sportIntro: n => `Agenda de ${n.toLowerCase()} ao vivo: horários no seu fuso mais os links e canais oficiais para assistir cada evento.`
  }
};
const localName = { es: "Español", en: "English", pt: "Português" };

const longDateFor = (iso, locale) => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(new Date(iso));

const MARK = `<svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true"><path d="M18 36a20 20 0 0 1 28 0" stroke="#ff4655" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M8 26a34 34 0 0 1 48 0" stroke="#ff4655" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/><circle cx="32" cy="47" r="8" fill="#ff4655"/></svg>`;
const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2316181d'/%3E%3Cpath d='M18 36a20 20 0 0 1 28 0' stroke='%23ff4655' stroke-width='7' fill='none' stroke-linecap='round'/%3E%3Cpath d='M8 26a34 34 0 0 1 48 0' stroke='%23ff4655' stroke-width='7' fill='none' stroke-linecap='round' opacity='.5'/%3E%3Ccircle cx='32' cy='47' r='8' fill='%23ff4655'/%3E%3C/svg%3E`;
const MULTITAG = `<script src="https://quge5.com/88/tag.min.js" data-zone="259826" async data-cfasync="false"></script>`;
const SVGICON = {
  agenda: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  futbol: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8l3.8 2.8-1.5 4.4H9.7L8.2 10.8z"/></svg>',
  baloncesto: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 2.5 3 15.5 0 18M12 3c-3 2.5-3 15.5 0 18"/></svg>',
  tenis: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M4.5 6a11 11 0 010 12M19.5 6a11 11 0 000 12"/></svg>',
  ufc: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M8.5 3h7l5 5v8l-5 5h-7l-5-5V8z"/></svg>',
  ciclismo: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="6" cy="17" r="3.4"/><circle cx="18" cy="17" r="3.4"/><path d="M6 17l4-7h5l-3 7M10 10l-1.5-3H6.5M14.5 7H17"/></svg>'
};

// Enlaces absolutos desde la raíz del sitio: p.ej. base("en","/ver/x.html") -> "/en/ver/x.html"
const abs = (lang, pathAfter) => (lang === "es" ? "" : "/" + lang) + pathAfter;

function hreflangs(pathAfter) {
  const links = LANGS.map(l => `<link rel="alternate" hreflang="${l.htmlLang}" href="${SITE}${abs(l.code, pathAfter)}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${SITE}${pathAfter}">`);
  return links.join("\n");
}

function langSwitcher(lang, pathAfter) {
  const opts = LANGS.map(l =>
    `<a href="${abs(l.code, pathAfter)}"${l.code === lang ? ' aria-current="true" class="on"' : ""}>${localName[l.code]}</a>`
  ).join("");
  return `<div class="lang-switch" aria-label="Idioma">${opts}</div>`;
}

function header(lang, current) {
  const t = TR[lang];
  const link = (sport) => {
    const href = sport === "agenda" ? abs(lang, "/") : abs(lang, `/deportes/${sport}.html`);
    const cur = current === sport ? ' aria-current="page"' : "";
    return `<a href="${href}"${cur}>${SVGICON[sport]} ${t.nav[sport]}</a>`;
  };
  return `<header class="hd">
  <div class="wrap hd-in">
    <a class="brand" href="${abs(lang, "/")}" aria-label="Kickly">${MARK}<span class="brand-name">kickly</span></a>
    <nav class="hd-nav" aria-label="${t.footSports}">
      ${link("agenda")}
      ${link("futbol")}
      ${link("baloncesto")}
      ${link("tenis")}
      ${link("ufc")}
      ${link("ciclismo")}
    </nav>
    ${langSwitcher(lang, headerSwitchPath(lang, current))}
    <div class="hd-live" id="live-indicator"><i></i><span>${t.live}</span></div>
  </div>
</header>`;
}
// Para el selector de la cabecera usamos la home de cada idioma (evita rutas de evento específicas)
function headerSwitchPath() { return "/"; }

function footer(lang) {
  const t = TR[lang];
  const sp = s => `<li><a href="${abs(lang, `/deportes/${s}.html`)}">${t.nav[s]}</a></li>`;
  return `<footer class="ft">
  <div class="wrap">
    <div class="ft-in">
      <div>
        <a class="brand" href="${abs(lang, "/")}" aria-label="Kickly">${MARK}<span class="brand-name">kickly</span></a>
        <p>${t.footAbout}</p>
      </div>
      <div>
        <h3>${t.footSports}</h3>
        <ul>${sp("futbol")}${sp("baloncesto")}${sp("tenis")}${sp("ufc")}${sp("ciclismo")}</ul>
      </div>
      <div>
        <h3>${t.footKickly}</h3>
        <ul><li><a href="${abs(lang, "/")}">${t.todayAgenda}</a></li></ul>
      </div>
    </div>
    <div class="ft-base"><span>© 2026 Kickly</span><span>${t.footTag}</span></div>
  </div>
</footer>`;
}

function headTop(lang, titleStr, desc, canonPath, ogType, extraLd) {
  const t = TR[lang];
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${MULTITAG}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titleStr)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${SITE}${abs(lang, canonPath)}">
${hreflangs(canonPath)}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Kickly">
<meta property="og:title" content="${esc(titleStr)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${abs(lang, canonPath)}">
<meta property="og:locale" content="${lang === "es" ? "es_ES" : lang === "pt" ? "pt_BR" : "en_GB"}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0b0c0f">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
${extraLd || ""}
</head>`;
}

/* ---------- Datos de evento ---------- */
function keywords(ev, lang) {
  const kws = [];
  const pairs = ev.away ? [`${ev.home} ${ev.away}`, `${ev.away} ${ev.home}`, `${ev.home} vs ${ev.away}`] : [ev.home];
  const verbs = lang === "en" ? ["watch", "free", "online", "live stream", "live"] : lang === "pt" ? ["assistir", "grátis", "online", "ao vivo", "transmissão"] : ["ver", "gratis", "online", "en directo", "en vivo"];
  for (const p of pairs) {
    if (lang === "en") kws.push(`watch ${p} free`, `watch ${p} online`, `${p} live stream`, `watch ${p} free online`, `${p} live`);
    else if (lang === "pt") kws.push(`assistir ${p} grátis`, `assistir ${p} online`, `${p} ao vivo`, `assistir ${p} online grátis`, `${p} transmissão`);
    else kws.push(`ver ${p} gratis`, `ver ${p} online`, `${p} en directo`, `ver ${p} online gratis`, `${p} en vivo`);
  }
  return kws;
}

function eventLd(ev, lang) {
  const url = `${SITE}${abs(lang, `/ver/${encodeURIComponent(ev.id)}.html`)}`;
  const ld = {
    "@type": "SportsEvent", name: `${title(ev)} — ${ev.competitionName}`,
    description: ev.description || `${title(ev)} — ${sportName(ev)} · ${ev.competitionName}.`,
    startDate: ev.date, sport: sportName(ev),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url },
    organizer: { "@type": "Organization", name: ev.competitionName }, url
  };
  if (ev.away) ld.competitor = [{ "@type": "SportsTeam", name: ev.home }, { "@type": "SportsTeam", name: ev.away }];
  return ld;
}

function globalSources() {
  if (!WATCH.url || !(WATCH.buttons || []).length) return [];
  return WATCH.buttons.map(label => ({ label, url: WATCH.url }));
}

function sourcesPanelStatic(ev, lang) {
  const t = TR[lang];
  const srcs = ((ev.sources && ev.sources.length) ? ev.sources : globalSources()).filter(s => s && s.url);
  if (!srcs.length) return "";
  const btns = srcs.map((s, i) =>
    `<a class="src-btn" href="${esc(s.url)}" target="_blank" rel="nofollow noopener"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>${esc(s.label || ("Enlace " + (i + 1)))}</a>`
  ).join("");
  return `<div class="sources"><div class="sources-head">${esc(t.where(title(ev)))}</div><div class="sources-btns">${btns}</div></div>`;
}

function broadcastersStatic(ev, lang) {
  const t = TR[lang];
  const bs = ev.broadcasters || [];
  if (!bs.length) return "";
  const rows = bs.map(b => {
    const ch = b.url ? `<a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.channels)}</a>` : esc(b.channels);
    return `<tr><th>${esc(b.country)}</th><td>${ch}</td></tr>`;
  }).join("");
  return `<section class="section"><h2>${esc(t.byCountry(title(ev)))}</h2><table class="bcast"><tbody>${rows}</tbody></table></section>`;
}

function eventPage(ev, lang) {
  const t = TR[lang], L = LANGS.find(l => l.code === lang);
  const d = longDateFor(ev.date, L.locale);
  const titleStr = t.evTitle(title(ev), ev.competitionName);
  const desc = t.evDesc(title(ev), sportName(ev), ev.competitionName, d, ev.description);
  const canonPath = `/ver/${encodeURIComponent(ev.id)}.html`;
  const scene = SPORTS[ev.sport] ? ev.sport : "futbol";
  const ld = Object.assign({ "@context": "https://schema.org" }, eventLd(ev, lang));
  const bc = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: t.nav.agenda, item: `${SITE}${abs(lang, "/")}` },
    { "@type": "ListItem", position: 2, name: sportName(ev), item: `${SITE}${abs(lang, `/deportes/${ev.sport}.html`)}` },
    { "@type": "ListItem", position: 3, name: title(ev) }
  ]};
  const broadcast = { "@context": "https://schema.org", "@type": "BroadcastEvent", name: t.where(title(ev)),
    isLiveBroadcast: true, videoFormat: "HD", inLanguage: lang, startDate: ev.date, broadcastOfEvent: eventLd(ev, lang) };
  const extraLd = `<meta name="keywords" content="${esc(keywords(ev, lang).join(", "))}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(bc)}</script>
<script type="application/ld+json">${JSON.stringify(broadcast)}</script>`;
  return `${headTop(lang, titleStr, desc, canonPath, "video.other", extraLd)}
<body data-root="" data-langroot="${lang === "es" ? "" : "/" + lang}" data-event-id="${esc(ev.id)}">
${header(lang)}
<main>
  <div class="wrap">
    <div id="event-page">
      <nav class="crumbs" aria-label="breadcrumb"><a href="${abs(lang, "/")}">${t.nav.agenda}</a><span class="sep">/</span><a href="${abs(lang, `/deportes/${esc(ev.sport)}.html`)}">${esc(sportName(ev))}</a><span class="sep">/</span><span>${esc(title(ev))}</span></nav>
      <div class="player">
        <div class="sim"><div class="sim-scene ${esc(scene)}"></div>
          <button class="play-btn" aria-label="${esc(title(ev))}"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
          <div class="sim-title">${esc(title(ev))}</div>
          <div class="sim-sub">${esc(d)}</div>
        </div>
      </div>
      ${sourcesPanelStatic(ev, lang)}
      <header class="ev-head"><h1>${esc(t.h1ev(title(ev)))}</h1>
        <div class="meta"><span>${esc(sportName(ev))} · ${esc(ev.competitionName)}</span><time datetime="${esc(ev.date)}">${esc(d)}</time></div>
      </header>
      ${ev.description ? `<p class="ev-desc">${esc(ev.description)}</p>` : ""}
      ${broadcastersStatic(ev, lang)}
    </div>
    <div class="ad" id="ad-bottom"></div>
  </div>
</main>
${footer(lang)}
<script src="/assets/js/config.js"></script>
<script src="/assets/js/app.js" defer></script>
</body>
</html>
`;
}

/* ---------- Homepage y páginas de deporte (solo en/pt; es es a mano) ---------- */
function filterChips(lang, sport) {
  const t = TR[lang];
  const emoji = { futbol: "⚽", baloncesto: "🏀", tenis: "🎾", ufc: "🥊", ciclismo: "🚴" };
  const chip = (s, label) => `<button class="filter${sport === s ? " on" : ""}" data-sport="${s}" role="tab">${s ? emoji[s] + " " : ""}${label}</button>`;
  return `<div class="filters" id="filters" role="tablist">${chip("", t.all)}${SPORT_ORDER.map(s => chip(s, t.nav[s])).join("")}</div>`;
}

function homePage(lang) {
  const t = TR[lang];
  const body = `<body data-root="" data-langroot="${lang === "es" ? "" : "/" + lang}">
${header(lang, "agenda")}
<main>
  <div class="wrap">
    <div class="page-head"><h1>${esc(t.homeH1)}</h1><p>${esc(t.homeIntro)}</p></div>
    <div class="ad" id="ad-top"></div>
    <div class="toolbar">
      <div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
        <input type="search" id="q" placeholder="${esc(t.searchPh)}" aria-label="search"></div>
      ${filterChips(lang, "")}
    </div>
    <div id="agenda"><div class="group"><div class="empty">${esc(t.loading)}</div></div></div>
  </div>
</main>
${footer(lang)}
<script src="/assets/js/config.js"></script>
<script src="/assets/js/app.js" defer></script>
</body>
</html>`;
  return `${headTop(lang, t.homeTitle, t.homeDesc, "/", "website")}\n${body}\n`;
}

function sportPage(sport, lang) {
  const t = TR[lang], n = t.nav[sport];
  const body = `<body data-root="" data-langroot="${lang === "es" ? "" : "/" + lang}" data-sport="${sport}">
${header(lang, sport)}
<main>
  <div class="wrap">
    <div class="page-head"><h1>${esc(t.sportH1(n))}</h1><p>${esc(t.sportIntro(n))}</p></div>
    <div class="ad" id="ad-top"></div>
    <div id="agenda"><div class="group"><div class="empty">${esc(t.loading)}</div></div></div>
  </div>
</main>
${footer(lang)}
<script src="/assets/js/config.js"></script>
<script src="/assets/js/app.js" defer></script>
</body>
</html>`;
  return `${headTop(lang, t.sportTitle(n), t.sportDesc(n), `/deportes/${sport}.html`, "website")}\n${body}\n`;
}

/* ---------- Escritura ---------- */
function write(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

let count = 0;
for (const L of LANGS) {
  const dir = L.code === "es" ? "" : L.code + "/";
  // Event pages
  // limpiar carpeta ver del idioma
  const verDir = path.join(ROOT, dir + "ver");
  fs.rmSync(verDir, { recursive: true, force: true });
  for (const ev of events) { write(`${dir}ver/${ev.id}.html`, eventPage(ev, L.code)); count++; }
  // Home y deportes solo para en/pt (es se mantiene a mano)
  if (L.code !== "es") {
    write(`${dir}index.html`, homePage(L.code));
    for (const s of SPORT_ORDER) write(`${dir}deportes/${s}.html`, sportPage(s, L.code));
  }
}
console.log(`Generadas ${count} páginas de evento (${events.length} × ${LANGS.length} idiomas) + home/deportes en/pt`);

/* ---------- Sitemap con hreflang ---------- */
const today = new Date().toISOString().slice(0, 10);
function urlEntry(pathAfter, freq, pri) {
  const alts = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l.htmlLang}" href="${SITE}${abs(l.code, pathAfter)}"/>`).join("\n");
  return LANGS.map(l => `  <url>
    <loc>${SITE}${abs(l.code, pathAfter)}</loc>
${alts}
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`).join("\n");
}
const staticPaths = [["/", "hourly", "1.0"], ...SPORT_ORDER.map(s => [`/deportes/${s}.html`, "daily", "0.8"])];
const eventPaths = events.filter(e => e.status !== "finished").map(e => [`/ver/${encodeURIComponent(e.id)}.html`, "hourly", "0.9"]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticPaths, ...eventPaths].map(([p, f, pr]) => urlEntry(p, f, pr)).join("\n")}
  <url><loc>${SITE}/aviso-legal.html</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.2</priority></url>
</urlset>
`;
write("sitemap.xml", sitemap);
console.log("sitemap.xml con hreflang generado");
