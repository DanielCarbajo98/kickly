/* Genera el sitio estático en /public a partir de config.mjs y data.mjs.
 * Uso: node src/build.mjs */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import C from "./config.mjs";
import { cats, catSlugs, parties, questions, sources } from "./data.mjs";
import { calendar, faqs } from "./content.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const U = C.siteUrl;
const PBY = Object.fromEntries(parties.map((p) => [p.id, p]));
const pages = [];

/* ---------- utilidades ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const LBL = { 2: "Totalmente a favor", 1: "A favor", 0: "Neutral / ambiguo", "-1": "En contra", "-2": "Totalmente en contra" };
const KEY = { 2: "++", 1: "+", 0: "=", "-1": "−", "-2": "−−" };
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
const dot = (p) => `<span class="dot" style="background:${p.color}"></span>`;
const ad = (name) => `<div class="ad" data-ad="${name}" hidden></div>`;
const statewide = parties.filter((p) => p.scope === "Estatal");

function write(rel, html) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

function similarity(a, b) {
  let num = 0, den = 0;
  for (const q of questions) {
    const x = q.pos[a]?.[0], y = q.pos[b]?.[0];
    if (x === undefined || y === undefined) continue;
    num += Math.abs(x - y); den += 4;
  }
  return den ? Math.round(100 * (1 - num / den)) : 0;
}

/* ---------- layout ---------- */
function layout({ path: p, title, description, body, jsonld = [], noindex = false, scripts = "", nav = "" }) {
  const url = U + p;
  if (!noindex) pages.push(p);
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...o })}</script>`).join("\n");
  const ga = C.ga4
    ? `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});gtag('js',new Date());gtag('config','${C.ga4}',{anonymize_ip:true});</script><script async src="https://www.googletagmanager.com/gtag/js?id=${C.ga4}"></script>`
    : "";
  const adsHead = C.ads.adsenseClient
    ? `<meta name="google-adsense-account" content="${C.ads.adsenseClient}">\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${C.ads.adsenseClient}" crossorigin="anonymous"></script>`
    : "";
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(C.brand)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${U}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${U}/og.png">
<meta name="theme-color" content="#2f3cf0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-96.png" sizes="96x96" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${BUILD}">
${adsHead}
${ga}
${ld}
</head>
<body>
<header class="hd"><div class="wrap hd-in">
<a class="brand" href="/" aria-label="${esc(C.brand)} — inicio"><span class="brand-mark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>${C.brandHtml}</span></a>
<nav class="hd-nav" aria-label="Principal">
<a href="/partidos/"${nav === "partidos" ? ' aria-current="page"' : ""}>Partidos</a>
<a href="/temas/"${nav === "temas" ? ' aria-current="page"' : ""}>Temas</a>
<a href="/calendario-electoral-29n/"${nav === "cal" ? ' aria-current="page"' : ""}>Calendario 29N</a>
<a href="/metodologia/"${nav === "met" ? ' aria-current="page"' : ""}>Metodología</a>
<a class="hd-cta" href="/test/">Hacer el test</a>
</nav>
</div></header>
<main>
${body}
</main>
<footer class="ft"><div class="wrap">
<div class="ft-in">
<div><a class="brand" href="/"><span class="brand-mark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>${C.brandHtml}</span></a>
<p style="margin-top:10px;max-width:440px">Test de afinidad política independiente para las elecciones generales del 29 de noviembre de 2026. Sin afiliación con ningún partido, gobierno ni medio. No es una encuesta ni una recomendación de voto. Tus respuestas no salen de tu dispositivo.</p></div>
<div><h4>Test</h4><ul><li><a href="/test/">Hacer el test</a></li><li><a href="/partidos/">Partidos y candidatos</a></li><li><a href="/temas/">Propuestas por tema</a></li><li><a href="/comparar/">Comparar partidos</a></li><li><a href="/calendario-electoral-29n/">Calendario electoral</a></li><li><a href="/voto-por-correo-29n/">Voto por correo</a></li></ul></div>
<div><h4>Transparencia</h4><ul><li><a href="/metodologia/">Metodología e imparcialidad</a></li><li><a href="/aviso-legal/">Aviso legal</a></li><li><a href="/privacidad/">Política de privacidad</a></li><li><a href="/cookies/">Política de cookies</a></li><li><a href="mailto:${C.owner.email}">Contacto y correcciones</a></li></ul></div>
</div>
<p style="margin-top:22px">© 2026 ${esc(C.brand)} · Posiciones revisadas el ${fmtDate(C.updated)}.</p>
</div></footer>
<script>window.SITE=${JSON.stringify({ siteUrl: U, electionDate: C.electionDate, ads: C.ads })};</script>
<script src="/assets/site.js?v=${BUILD}" defer></script>
${scripts}
</body>
</html>`;
}

const BUILD = Date.now().toString(36);
const crumbs = (items) =>
  `<nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a>${items.map(([n, h]) => ` › ${h ? `<a href="${h}">${esc(n)}</a>` : esc(n)}`).join("")}</nav>`;
const crumbLd = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Inicio", "/"], ...items].map(([n, h], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: U + (h || "/") })),
});
const ctaBox = (t = "¿Con qué partido tienes más afinidad?") =>
  `<section class="card" style="text-align:center;margin:30px 0"><h2 style="font-family:var(--display);font-size:26px;letter-spacing:-.02em;margin-bottom:6px">${t}</h2><p>Responde ${questions.length} preguntas y compárate con ${parties.length} partidos. Gratis, anónimo y sin registro.</p><p style="margin-top:16px"><a class="btn btn-primary" href="/test/">Hacer el test ahora →</a></p></section>`;
const nCore = questions.filter((q) => q.core).length;

/* ============================================================
 * PORTADA
 * ============================================================ */
function home() {
  const faqLd = { "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) };
  const body = `
<section class="hero"><div class="wrap">
<span class="pill"><i></i> Elecciones generales · 29 de noviembre de 2026</span>
<h1>¿A quién votar el 29N? <em>Descúbrelo en 3 minutos</em></h1>
<p class="lead">El test de afinidad política más completo: ${questions.length} afirmaciones sobre vivienda, impuestos, inmigración, pensiones o Cataluña comparadas con lo que defiende cada partido. Gratis, anónimo e imparcial.</p>
<div class="hero-ctas"><a class="btn btn-primary" href="/test/">Empezar el test →</a><a class="btn btn-ghost" href="/metodologia/">¿Cómo funciona?</a></div>
<div class="hero-meta"><span>✓ Sin registro</span><span>✓ Respuestas 100% privadas</span><span>✓ ${parties.length} partidos</span><span>✓ Fuentes en cada posición</span></div>
<div class="countdown" data-countdown aria-label="Cuenta atrás hasta el 29N"><div><b>--</b><small>días</small></div><div><b>--</b><small>horas</small></div><div><b>--</b><small>min</small></div><div><b>--</b><small>seg</small></div></div>
<div class="party-strip">${parties.map((p) => `<a class="chip" href="/partidos/${p.id}/">${dot(p)}${esc(p.short)}</a>`).join("")}</div>
</div></section>
<div class="wrap">${ad("home")}</div>

<section class="section"><div class="wrap">
<h2>Cómo funciona el test electoral</h2>
<div class="grid g3">
<div class="card"><div class="num">1</div><h3>Responde</h3><p>Di si estás de acuerdo o no con ${questions.length} afirmaciones (o ${nCore} en el test rápido). Marca con ★ los temas que más te importan y cuentan el doble.</p></div>
<div class="card"><div class="num">2</div><h3>Comparamos</h3><p>Cruzamos cada respuesta con la posición documentada de cada partido: programa, declaraciones de 2026 y votaciones en el Congreso.</p></div>
<div class="card"><div class="num">3</div><h3>Tu resultado</h3><p>Ves tu % de afinidad con cada partido, tu posición en la brújula política y en qué temas coincides o discrepas con cada uno.</p></div>
</div></div></section>

<section class="section"><div class="wrap">
<h2>Partidos y candidatos del 29N</h2>
<p class="sub">Incluimos las candidaturas con representación en el Congreso o con opciones reales según las encuestas. Pulsa en cada una para ver sus posiciones.</p>
<div class="grid g3">${parties.map((p) => `<a class="card" href="/partidos/${p.id}/" style="text-decoration:none;color:inherit"><h3 style="display:flex;align-items:center;gap:8px">${dot(p)}${esc(p.short)}</h3><p><b>${esc(p.candidate)}</b> · ${esc(p.scope)}</p><p style="margin-top:6px">${esc(p.tagline)}</p></a>`).join("")}</div>
</div></section>

<section class="section"><div class="wrap">
<h2>Un test imparcial, transparente y privado</h2>
<div class="grid g2">
<div class="card"><h3>Independiente</h3><p>No tenemos relación con ningún partido, sindicato, gobierno ni medio de comunicación. No aceptamos dinero de partidos ni publicidad política. Nos financiamos solo con publicidad comercial.</p></div>
<div class="card"><h3>Mismas reglas para todos</h3><p>Todos los partidos se puntúan con la misma escala y la misma fórmula, y cada posición está justificada. La <a href="/metodologia/">metodología</a> es pública. El resultado sale solo de tus respuestas.</p></div>
<div class="card"><h3>Tus respuestas no salen de tu móvil</h3><p>El cálculo se hace en tu navegador. No guardamos ni vendemos tus respuestas ni tu ideología, y no pedimos email ni registro.</p></div>
<div class="card"><h3>Equilibrado</h3><p>Las afirmaciones cubren derecha e izquierda, centralismo y nacionalismos, y están redactadas para no inducir respuestas. Si ves un error, <a href="mailto:${C.owner.email}">escríbenos</a> y lo revisamos.</p></div>
</div></div></section>

<section class="section"><div class="wrap">
<h2>Qué propone cada partido, tema a tema</h2>
<div class="party-strip" style="justify-content:flex-start;margin:0">${Object.keys(cats).map((c) => `<a class="chip" href="/temas/${catSlugs[c]}/">${esc(cats[c])}</a>`).join("")}</div>
<h2 style="margin-top:34px">Comparativas más buscadas</h2>
<div class="party-strip" style="justify-content:flex-start;margin:0">${pairs().slice(0, 12).map(([a, b]) => `<a class="chip" href="/comparar/${a.id}-vs-${b.id}/">${dot(a)}${esc(a.short)} o ${esc(b.short)}${dot(b)}</a>`).join("")}</div>
</div></section>

<div class="wrap">${ad("home2")}</div>

<section class="section faq"><div class="wrap prose">
<h2>Preguntas frecuentes</h2>
${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join("\n")}
</div></section>
<div class="wrap">${ctaBox("¿Todavía no sabes a quién votar?")}</div>`;
  write(
    "index.html",
    layout({
      path: "/",
      title: `Test político 29N: ¿a quién votar en las elecciones generales 2026? | ${C.brand}`,
      description: `Test de afinidad política para las elecciones generales del 29 de noviembre de 2026. Descubre qué partido piensa como tú: PSOE, PP, Vox, Sumar, Podemos y más. Gratis, anónimo e imparcial.`,
      body,
      jsonld: [
        { "@type": "WebSite", name: C.brand, url: U + "/", inLanguage: "es-ES", description: "Test de afinidad política para las elecciones generales de España del 29N de 2026." },
        { "@type": "Organization", name: C.brand, url: U + "/", logo: U + "/apple-touch-icon.png", email: C.owner.email },
        faqLd,
      ],
    }),
  );
}

/* ============================================================
 * TEST Y RESULTADO
 * ============================================================ */
function quizPages() {
  const dataScript = `<script src="/assets/data.js?v=${BUILD}"></script><script src="/assets/quiz.js?v=${BUILD}"></script>`;
  const side = `<aside class="quiz-side">${ad("side")}<div class="card" style="margin-top:14px"><h3>Sobre este test</h3><p>Independiente y anónimo. Posiciones revisadas el ${fmtDate(C.updated)}. <a href="/metodologia/">Ver metodología</a>.</p></div></aside>`;
  write(
    "test/index.html",
    layout({
      path: "/test/",
      title: `Test electoral 29N 2026: ¿qué partido votar? (${questions.length} preguntas) | ${C.brand}`,
      description: `Haz el test para las elecciones generales 2026: responde ${questions.length} preguntas (o ${nCore} en el test rápido) y descubre tu afinidad con PSOE, PP, Vox, Sumar, Podemos, SALF, ERC, Junts y más.`,
      body: `<div class="wrap"><div class="quiz-layout"><div><div id="quiz"><noscript><p class="note">El test necesita JavaScript para calcular tu resultado en tu propio navegador.</p></noscript></div></div>${side}</div></div>`,
      scripts: dataScript,
      jsonld: [
        { "@type": "WebApplication", name: `Test de afinidad política 29N · ${C.brand}`, url: U + "/test/", applicationCategory: "EducationalApplication", operatingSystem: "Any", inLanguage: "es-ES", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } },
        crumbLd([["Test", "/test/"]]),
      ],
    }),
  );
  write(
    "resultado/index.html",
    layout({
      path: "/resultado/",
      title: `Tu resultado del test político 29N | ${C.brand}`,
      description: "Tu afinidad con cada partido en las elecciones generales del 29 de noviembre de 2026.",
      noindex: true,
      body: `<div class="wrap" style="padding-top:22px"><div id="quiz"></div></div>`,
      scripts: dataScript,
    }),
  );
  const data = {
    cats,
    parties: parties.map(({ id, name, short, color, candidate }) => ({ id, name, short, color, candidate })),
    questions: questions.map(({ id, cat, core, text, info, ax, pos }) => ({ id, cat, core: !!core, text, info, ax, pos })),
  };
  write("assets/data.js", `/* Generado por src/build.mjs — no editar a mano */\nwindow.Q29=${JSON.stringify(data)};\n`);
}

/* ============================================================
 * PARTIDOS
 * ============================================================ */
function partyPages() {
  const body = `<div class="wrap">${crumbs([["Partidos"]])}
<div class="page-head"><h1>Partidos y candidatos de las elecciones generales del 29N</h1><p>Quién se presenta, quién es su candidato y qué defiende cada partido en ${questions.length} temas clave.</p></div>
<div class="grid g2" style="margin-top:20px">${parties
    .map(
      (p) => `<a class="card" href="/partidos/${p.id}/" style="text-decoration:none;color:inherit"><div class="party-head"><div class="party-logo" style="background:${p.color};width:54px;height:54px;font-size:16px">${esc(p.short.slice(0, 5))}</div><div><h3>${esc(p.name)}</h3><p>Candidato/a: <b>${esc(p.candidate)}</b> · ${esc(p.scope)}</p></div></div><p style="margin-top:10px">${esc(p.tagline)}</p></a>`,
    )
    .join("")}</div>
${ad("content")}${ctaBox()}</div>`;
  write("partidos/index.html", layout({ path: "/partidos/", nav: "partidos", title: `Partidos y candidatos de las elecciones generales 2026 (29N) | ${C.brand}`, description: `Todos los partidos que se presentan a las elecciones generales del 29 de noviembre de 2026: candidatos, propuestas y posiciones de PSOE, PP, Vox, Sumar, Podemos, SALF, ERC, Junts, Bildu, PNV y BNG.`, body, jsonld: [crumbLd([["Partidos", "/partidos/"]])] }));

  for (const p of parties) {
    const sims = parties.filter((o) => o.id !== p.id).map((o) => [o, similarity(p.id, o.id)]).sort((a, b) => b[1] - a[1]);
    const byCat = Object.keys(cats).map((c) => [c, questions.filter((q) => q.cat === c && q.pos[p.id])]).filter(([, qs]) => qs.length);
    const body = `<div class="wrap">${crumbs([["Partidos", "/partidos/"], [p.short]])}
<div class="page-head"><div class="party-head"><div class="party-logo" style="background:${p.color}">${esc(p.short.slice(0, 5))}</div><div><h1>${esc(p.name)} en las elecciones del 29N: programa, candidato y propuestas</h1></div></div>
<p style="margin-top:12px">${esc(p.summary)}</p></div>
<div class="grid g2" style="margin-top:18px">
<div class="card"><h3>Ficha</h3><table class="qa-table"><tbody>
<tr><th>Candidato/a</th><td>${esc(p.candidate)}</td></tr>
<tr><th>Ámbito</th><td>${esc(p.scope)}</td></tr>
<tr><th>Espacio ideológico</th><td>${esc(p.ideology)}</td></tr>
${p.members ? `<tr><th>Integrantes</th><td>${esc(p.members)}</td></tr>` : ""}
</tbody></table></div>
<div class="card"><h3>Propuestas destacadas para 2026</h3><ul style="padding-left:18px;margin-top:6px">${p.proposals.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
</div>
${ad("content")}
<section class="section" style="padding-top:10px"><h2>Posición de ${esc(p.short)} en cada tema</h2>
<p class="note">Escala: ++ totalmente a favor · + a favor · = neutral o ambiguo · − en contra · −− totalmente en contra. Basado en su programa, declaraciones públicas de 2026 y votaciones en el Congreso. <a href="/metodologia/">Metodología</a>.</p>
${byCat
  .map(
    ([c, qs]) => `<h3 style="margin:24px 0 10px"><a href="/temas/${catSlugs[c]}/">${esc(cats[c])}</a></h3><div class="pos-list">${qs
      .map((q) => `<div class="pos"><span class="v v${q.pos[p.id][0]}">${KEY[q.pos[p.id][0]]}</span><div><p><b>${esc(q.text)}</b></p><small>${esc(LBL[q.pos[p.id][0]])}. ${esc(q.pos[p.id][1])}</small></div></div>`)
      .join("")}</div>`,
  )
  .join("")}
</section>
<section class="section" style="padding-top:0"><h2>Partidos más parecidos a ${esc(p.short)}</h2>
<div class="rank">${sims
      .map(([o, s]) => `<a class="rk" href="/comparar/${pairId(p, o)}/" style="text-decoration:none;color:inherit"><span class="rk-pos">vs</span><span><span class="rk-name">${dot(o)}${esc(o.short)}</span><span class="rk-bar"><i style="width:${s}%;background:${o.color}"></i></span></span><span class="rk-pct">${s}%</span></a>`)
      .join("")}</div>
<p class="disclaimer">Coincidencia calculada sobre las ${questions.length} afirmaciones del test.</p></section>
${ctaBox(`¿Coincides con ${esc(p.short)}? Compruébalo`)}</div>`;
    write(
      `partidos/${p.id}/index.html`,
      layout({
        path: `/partidos/${p.id}/`,
        nav: "partidos",
        title: `${p.short} elecciones 29N 2026: programa, candidato y propuestas | ${C.brand}`,
        description: `Qué propone ${p.name} (${p.candidate}) para las elecciones generales del 29 de noviembre de 2026: vivienda, impuestos, inmigración, pensiones y modelo territorial. Su posición en ${questions.length} temas.`,
        body,
        jsonld: [
          { "@type": "PoliticalParty", name: p.name, alternateName: p.short, url: U + `/partidos/${p.id}/` },
          crumbLd([["Partidos", "/partidos/"], [p.short, `/partidos/${p.id}/`]]),
        ],
      }),
    );
  }
}

/* ============================================================
 * TEMAS
 * ============================================================ */
function topicPages() {
  const idx = `<div class="wrap">${crumbs([["Temas"]])}
<div class="page-head"><h1>Qué proponen los partidos en cada tema (29N 2026)</h1><p>Compara las posiciones de los ${parties.length} partidos en vivienda, impuestos, empleo, inmigración, modelo territorial y más.</p></div>
<div class="grid g3" style="margin-top:20px">${Object.keys(cats)
    .map((c) => `<a class="card" href="/temas/${catSlugs[c]}/" style="text-decoration:none;color:inherit"><h3>${esc(cats[c])}</h3><p>${questions.filter((q) => q.cat === c).length} afirmaciones comparadas</p></a>`)
    .join("")}</div>${ad("content")}${ctaBox()}</div>`;
  write("temas/index.html", layout({ path: "/temas/", nav: "temas", title: `Propuestas de los partidos por temas · Elecciones generales 2026 | ${C.brand}`, description: `Comparativa de propuestas de PSOE, PP, Vox, Sumar, Podemos y demás partidos para el 29N: vivienda, impuestos, pensiones, inmigración, Cataluña, energía y más.`, body: idx, jsonld: [crumbLd([["Temas", "/temas/"]])] }));

  for (const c of Object.keys(cats)) {
    const qs = questions.filter((q) => q.cat === c);
    const body = `<div class="wrap">${crumbs([["Temas", "/temas/"], [cats[c]]])}
<div class="page-head"><h1>${esc(cats[c])}: qué proponen los partidos para el 29N</h1><p>Posición de cada partido sobre ${qs.length} propuestas de ${esc(cats[c].toLowerCase())} en las elecciones generales de 2026, con la justificación de cada una.</p></div>
${qs
  .map(
    (q, i) => `<section class="section" style="padding:24px 0 6px"><h2 style="font-size:24px">${esc(q.text)}</h2>${q.info ? `<p class="note" style="margin-bottom:14px">${esc(q.info)}</p>` : ""}
<div class="pos-list">${parties
      .filter((p) => q.pos[p.id])
      .sort((a, b) => q.pos[b.id][0] - q.pos[a.id][0])
      .map((p) => `<div class="pos"><span class="v v${q.pos[p.id][0]}">${KEY[q.pos[p.id][0]]}</span><div><p>${dot(p)} <b>${esc(p.short)}</b> · ${esc(LBL[q.pos[p.id][0]])}</p><small>${esc(q.pos[p.id][1])}</small></div></div>`)
      .join("")}</div></section>${i === 1 ? ad("content") : ""}`,
  )
  .join("")}
${ctaBox()}</div>`;
    write(
      `temas/${catSlugs[c]}/index.html`,
      layout({
        path: `/temas/${catSlugs[c]}/`,
        nav: "temas",
        title: `${cats[c]}: propuestas de los partidos para las elecciones 29N | ${C.brand}`,
        description: `¿Qué proponen PSOE, PP, Vox, Sumar, Podemos y el resto de partidos sobre ${cats[c].toLowerCase()}? Comparativa para las elecciones generales del 29 de noviembre de 2026.`,
        body,
        jsonld: [crumbLd([["Temas", "/temas/"], [cats[c], `/temas/${catSlugs[c]}/`]])],
      }),
    );
  }
}

/* ============================================================
 * COMPARATIVAS ("PP o Vox")
 * ============================================================ */
function pairId(a, b) {
  const [x, y] = parties.indexOf(a) < parties.indexOf(b) ? [a, b] : [b, a];
  return `${x.id}-vs-${y.id}`;
}
function pairs() {
  // Las comparativas más buscadas primero (vecinos ideológicos), luego el resto.
  const pref = [["pp", "vox"], ["psoe", "frente-amplio"], ["frente-amplio", "podemos"], ["psoe", "pp"], ["vox", "salf"], ["psoe", "podemos"], ["pp", "salf"], ["erc", "junts"], ["bildu", "pnv"], ["psoe", "vox"], ["erc", "frente-amplio"], ["pp", "junts"]];
  const out = [], seen = new Set();
  const add = (a, b) => { const k = pairId(a, b); if (!seen.has(k) && a !== b) { seen.add(k); out.push(parties.indexOf(a) < parties.indexOf(b) ? [a, b] : [b, a]); } };
  pref.forEach(([a, b]) => PBY[a] && PBY[b] && add(PBY[a], PBY[b]));
  for (const a of statewide) for (const b of parties) add(a, b);
  return out;
}
function comparePages() {
  const all = pairs();
  for (const [a, b] of all) {
    const same = [], diff = [];
    for (const q of questions) {
      const x = q.pos[a.id], y = q.pos[b.id];
      if (!x || !y) continue;
      (Math.abs(x[0] - y[0]) <= 1 && Math.sign(x[0]) * Math.sign(y[0]) >= 0 ? same : diff).push([q, x, y]);
    }
    const s = similarity(a.id, b.id);
    const row = ([q, x, y]) => `<tr><td>${esc(q.text)}</td><td><span class="v v${x[0]}" title="${esc(x[1])}">${KEY[x[0]]}</span></td><td><span class="v v${y[0]}" title="${esc(y[1])}">${KEY[y[0]]}</span></td></tr>`;
    const body = `<div class="wrap">${crumbs([["Comparar", "/comparar/"], [`${a.short} o ${b.short}`]])}
<div class="page-head"><h1>¿${esc(a.short)} o ${esc(b.short)}? En qué se parecen y en qué se diferencian (29N)</h1><p>${esc(a.short)} (${esc(a.candidate)}) y ${esc(b.short)} (${esc(b.candidate)}) coinciden en ${same.length} de ${same.length + diff.length} temas del test. Su afinidad programática es del <b>${s}%</b>.</p></div>
<section class="section" style="padding-top:14px"><h2>Donde se diferencian (${diff.length})</h2>
<div class="card tbl-scroll"><table class="qa-table"><thead><tr><th>Afirmación</th><th>${dot(a)} ${esc(a.short)}</th><th>${dot(b)} ${esc(b.short)}</th></tr></thead><tbody>${diff.map(row).join("")}</tbody></table></div></section>
${ad("content")}
<section class="section" style="padding-top:0"><h2>Donde coinciden (${same.length})</h2>
<div class="card tbl-scroll"><table class="qa-table"><thead><tr><th>Afirmación</th><th>${dot(a)} ${esc(a.short)}</th><th>${dot(b)} ${esc(b.short)}</th></tr></thead><tbody>${same.map(row).join("")}</tbody></table></div>
<p class="disclaimer">++ totalmente a favor · + a favor · = neutral · − en contra · −− totalmente en contra. Pasa el ratón por cada valor para ver la justificación, o consulta las fichas de <a href="/partidos/${a.id}/">${esc(a.short)}</a> y <a href="/partidos/${b.id}/">${esc(b.short)}</a>.</p></section>
${ctaBox(`¿Eres más de ${esc(a.short)} o de ${esc(b.short)}? Haz el test`)}</div>`;
    write(
      `comparar/${a.id}-vs-${b.id}/index.html`,
      layout({
        path: `/comparar/${a.id}-vs-${b.id}/`,
        title: `¿${a.short} o ${b.short}? Diferencias y coincidencias · Elecciones 29N | ${C.brand}`,
        description: `Comparativa ${a.short} vs ${b.short} para las elecciones generales del 29N de 2026: en qué coinciden, en qué se diferencian y test para saber a cuál votar.`,
        body,
        jsonld: [crumbLd([["Comparar", "/comparar/"], [`${a.short} o ${b.short}`, `/comparar/${a.id}-vs-${b.id}/`]])],
      }),
    );
  }
  const body = `<div class="wrap">${crumbs([["Comparar"]])}
<div class="page-head"><h1>Comparar partidos: ¿a cuál votar el 29N?</h1><p>Elige una comparativa para ver en qué coinciden y en qué se diferencian dos partidos.</p></div>
<div class="party-strip" style="justify-content:flex-start">${all.map(([a, b]) => `<a class="chip" href="/comparar/${a.id}-vs-${b.id}/">${dot(a)}${esc(a.short)} o ${esc(b.short)}${dot(b)}</a>`).join("")}</div>${ad("content")}${ctaBox()}</div>`;
  write("comparar/index.html", layout({ path: "/comparar/", title: `Comparar partidos políticos · Elecciones generales 2026 | ${C.brand}`, description: "Comparativas entre partidos para el 29N: PP o Vox, PSOE o Sumar, Sumar o Podemos, ERC o Junts y más.", body, jsonld: [crumbLd([["Comparar", "/comparar/"]])] }));
}

/* ============================================================
 * PÁGINAS DE CONTENIDO Y LEGALES
 * ============================================================ */
function contentPages() {
  const calBody = `<div class="wrap">${crumbs([["Calendario electoral 29N"]])}
<div class="page-head"><h1>Calendario de las elecciones generales del 29 de noviembre de 2026</h1><p>Todas las fechas clave del 29N: voto por correo, mesas electorales, campaña, jornada de reflexión y votación.</p></div>
<div class="prose" style="margin-top:20px"><table><thead><tr><th>Fecha</th><th>Qué pasa</th></tr></thead><tbody>${calendar.map(([d, t]) => `<tr><td style="white-space:nowrap"><b>${esc(d)}</b></td><td>${t}</td></tr>`).join("")}</tbody></table>
<p class="note">Fechas según el Real Decreto de disolución y convocatoria (BOE de 6 de octubre de 2026) y la información publicada por el Ministerio del Interior, Correos y la Oficina del Censo Electoral. Consulta siempre las fuentes oficiales: <a href="https://www.infoelectoral.interior.gob.es/" rel="nofollow noopener" target="_blank">infoelectoral.interior.gob.es</a> y <a href="https://www.juntaelectoralcentral.es/" rel="nofollow noopener" target="_blank">juntaelectoralcentral.es</a>.</p></div>
${ad("content")}${ctaBox("¿Ya sabes a quién votar el 29N?")}</div>`;
  write("calendario-electoral-29n/index.html", layout({ path: "/calendario-electoral-29n/", nav: "cal", title: `Calendario electoral 29N 2026: fechas clave de las elecciones generales | ${C.brand}`, description: "Fechas de las elecciones generales del 29 de noviembre de 2026: plazo del voto por correo, sorteo de mesas, campaña electoral, jornada de reflexión y votación.", body: calBody, jsonld: [crumbLd([["Calendario electoral 29N", "/calendario-electoral-29n/"]]), { "@type": "Event", name: "Elecciones generales de España 2026", startDate: "2026-11-29T09:00:00+01:00", endDate: "2026-11-29T20:00:00+01:00", eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Country", name: "España" }, description: "Elecciones a Cortes Generales: Congreso de los Diputados y Senado." }] }));

  const correo = `<div class="wrap">${crumbs([["Voto por correo 29N"]])}
<div class="page-head"><h1>Voto por correo para el 29N: plazos y cómo solicitarlo paso a paso</h1><p>Guía práctica para votar por correo en las elecciones generales del 29 de noviembre de 2026.</p></div>
<div class="prose" style="margin-top:20px">
<h2>Plazos clave</h2>
<ul><li><b>Solicitud:</b> del 6 de octubre al <b>19 de noviembre de 2026</b>.</li><li><b>Envío de la documentación</b> (papeletas y sobres) a tu domicilio: a partir del 9 de noviembre.</li><li><b>Envío del voto:</b> hasta el <b>25 de noviembre de 2026</b> en cualquier oficina de Correos.</li></ul>
<h2>Cómo solicitarlo</h2>
<ol><li><b>En una oficina de Correos</b>: rellena el impreso de solicitud y presenta tu DNI (también se aceptan pasaporte o permiso de conducir). Es personal.</li><li><b>Por internet</b>, en la web de Correos, con certificado digital o DNI electrónico.</li><li>Si estás enfermo o tienes una discapacidad que te impida ir, puedes hacerlo mediante un representante con poder notarial o consular, con certificado médico oficial.</li></ol>
<h2>Cómo votar cuando recibes la documentación</h2>
<ol><li>Elige la papeleta del Congreso y métela en el sobre de votación. La del Senado (sepia) va en su sobre, marcando hasta 3 candidatos en la mayoría de provincias.</li><li>Mete los sobres y el certificado de inscripción en el censo en el sobre dirigido a la mesa electoral.</li><li>Llévalo en persona a una oficina de Correos antes del 25 de noviembre. El envío es gratuito y certificado.</li></ol>
<h2>Importante</h2>
<p>Si solicitas el voto por correo, ya no puedes votar en persona en tu colegio el 29N. Los españoles residentes en el extranjero (CERA) tienen un procedimiento distinto: la solicitud se presenta ante su consulado.</p>
<p class="note">Información orientativa. Comprueba siempre los plazos en <a href="https://www.correos.es/" rel="nofollow noopener" target="_blank">correos.es</a> y en la Oficina del Censo Electoral (<a href="https://www.ine.es/" rel="nofollow noopener" target="_blank">ine.es</a>).</p>
</div>${ad("content")}${ctaBox("Antes de votar: ¿con qué partido coincides más?")}</div>`;
  write("voto-por-correo-29n/index.html", layout({ path: "/voto-por-correo-29n/", title: `Voto por correo 29N 2026: plazos y cómo solicitarlo | ${C.brand}`, description: "Cómo votar por correo en las elecciones generales del 29 de noviembre de 2026: plazo de solicitud hasta el 19 de noviembre, documentación y envío hasta el 25 de noviembre.", body: correo, jsonld: [crumbLd([["Voto por correo 29N", "/voto-por-correo-29n/"]]), { "@type": "HowTo", name: "Cómo votar por correo en las elecciones generales del 29N", step: [{ "@type": "HowToStep", text: "Solicita el voto por correo en una oficina de Correos o en su web antes del 19 de noviembre de 2026." }, { "@type": "HowToStep", text: "Recibe en casa las papeletas, sobres y certificado a partir del 9 de noviembre." }, { "@type": "HowToStep", text: "Prepara tu voto y entrégalo en una oficina de Correos antes del 25 de noviembre." }] }] }));

  write("metodologia/index.html", layout({ path: "/metodologia/", nav: "met", title: `Metodología e imparcialidad del test político | ${C.brand}`, description: "Cómo calculamos tu afinidad con cada partido: fuentes, escala, fórmula, ejes ideológicos, garantías de imparcialidad y limitaciones del test.", body: methodology(), jsonld: [crumbLd([["Metodología", "/metodologia/"]])] }));
  write("aviso-legal/index.html", layout({ path: "/aviso-legal/", title: `Aviso legal | ${C.brand}`, description: `Aviso legal y condiciones de uso de ${C.brand}.`, body: legal(), noindex: false }));
  write("privacidad/index.html", layout({ path: "/privacidad/", title: `Política de privacidad | ${C.brand}`, description: `Política de privacidad de ${C.brand}. Tus respuestas al test no salen de tu dispositivo.`, body: privacy() }));
  write("cookies/index.html", layout({ path: "/cookies/", title: `Política de cookies | ${C.brand}`, description: `Qué cookies usa ${C.brand} y cómo gestionarlas.`, body: cookies() }));
  write("404.html", layout({ path: "/404", noindex: true, title: `Página no encontrada | ${C.brand}`, description: "Página no encontrada.", body: `<div class="wrap" style="padding:60px 16px;text-align:center"><h1 class="qtext">Esta página no existe</h1><p class="res-sub">Pero el test sí 😉</p><p style="margin-top:20px"><a class="btn btn-primary" href="/test/">Hacer el test</a></p></div>` }));
}

function methodology() {
  return `<div class="wrap">${crumbs([["Metodología"]])}
<div class="page-head"><h1>Metodología e imparcialidad</h1><p>Cómo está hecho el test, de dónde salen las posiciones de los partidos y cómo se calcula tu resultado.</p></div>
<div class="prose" style="margin-top:20px">
<h2>Nuestro compromiso de imparcialidad</h2>
<ul>
<li><b>Independencia.</b> ${esc(C.brand)} no tiene relación con ningún partido político, candidatura, sindicato, patronal, gobierno ni medio de comunicación. No recibimos financiación de ninguno de ellos.</li>
<li><b>Sin publicidad política.</b> Nos financiamos con publicidad comercial gestionada por redes publicitarias. No aceptamos anuncios de partidos o campañas, y la publicidad nunca influye en el contenido ni en los resultados.</li>
<li><b>Mismas reglas para todos.</b> Todos los partidos se codifican con la misma escala, sobre las mismas afirmaciones y con la misma fórmula. Ningún partido tiene más peso. El orden de los resultados depende solo de tus respuestas.</li>
<li><b>Redacción neutral.</b> Las afirmaciones describen propuestas concretas sin adjetivos valorativos. Hay afirmaciones que suelen defender la izquierda y otras que suele defender la derecha, para evitar sesgos de aquiescencia.</li>
<li><b>Transparencia.</b> Cada posición tiene una justificación pública, visible en las fichas de <a href="/partidos/">partidos</a> y <a href="/temas/">temas</a>. Si detectas un error, escríbenos a <a href="mailto:${C.owner.email}">${C.owner.email}</a> y lo revisaremos con la fuente.</li>
<li><b>No es una recomendación de voto ni una encuesta.</b> El resultado es una herramienta informativa: compara tus opiniones con las posiciones públicas de cada partido. No publicamos estadísticas agregadas de los resultados de los usuarios.</li>
</ul>
<h2>Fuentes de las posiciones</h2>
<p>Para cada partido y afirmación asignamos una posición a partir, por orden de preferencia, de: (1) su programa electoral para el 29N cuando está publicado; (2) propuestas y declaraciones públicas de sus dirigentes en 2026; (3) sus votaciones en el Congreso en la XV legislatura (2023-2026); (4) su programa de las elecciones generales de 2023. Posiciones revisadas por última vez el <b>${fmtDate(C.updated)}</b>. Las actualizaremos cuando los partidos publiquen sus programas.</p>
<h2>La escala</h2>
<table><tbody><tr><td><span class="v v2">++</span></td><td>Totalmente de acuerdo</td></tr><tr><td><span class="v v1">+</span></td><td>De acuerdo</td></tr><tr><td><span class="v v0">=</span></td><td>Neutral, ambiguo o sin posición clara</td></tr><tr><td><span class="v v-1">−</span></td><td>En desacuerdo</td></tr><tr><td><span class="v v-2">−−</span></td><td>Totalmente en desacuerdo</td></tr></tbody></table>
<h2>Cómo se calcula tu afinidad</h2>
<p>Para cada pregunta medimos la distancia entre tu respuesta y la del partido (de 0 a 4 puntos). Las preguntas que marcas como importantes (★) cuentan el doble y las que saltas no cuentan. La afinidad es:</p>
<p class="note"><b>Afinidad = 100 × (1 − Σ peso × |tu respuesta − posición del partido| ÷ Σ peso × 4)</b></p>
<p>Es decir, el 100% significa que coincides exactamente en todo y el 0% que estás en el extremo opuesto en todo. Es un método similar al de herramientas de referencia como Wahl-O-Mat (Alemania) o Kieskompas (Países Bajos).</p>
<h2>Ejes ideológicos</h2>
<p>Algunas afirmaciones se asignan a tres ejes: <b>económico</b> (más Estado y redistribución frente a más mercado y menos impuestos), <b>social</b> (progresista frente a conservador) y <b>territorial</b> (plurinacional o descentralizador frente a centralista). Tu posición es la media de tus respuestas en cada eje, y la de los partidos se calcula con la misma fórmula.</p>
<h2>Limitaciones</h2>
<ul><li>Resumir un programa en una escala de cinco puntos simplifica matices. Por eso enlazamos la justificación de cada posición.</li><li>Los partidos pueden cambiar de posición durante la campaña. Revisamos los datos de forma periódica.</li><li>Incluimos los partidos con representación parlamentaria o con opciones reales según las encuestas. Los partidos de ámbito autonómico solo se presentan en sus territorios.</li><li>La afinidad programática no tiene en cuenta otros factores legítimos del voto: liderazgo, gestión, voto útil o confianza.</li></ul>
<h2>Fuentes consultadas</h2>
<ul>${sources.map(([t, u]) => `<li><a href="${esc(u)}" rel="nofollow noopener" target="_blank">${esc(t)}</a></li>`).join("")}</ul>
</div>${ctaBox()}</div>`;
}

function legal() {
  const o = C.owner;
  return `<div class="wrap">${crumbs([["Aviso legal"]])}<div class="page-head"><h1>Aviso legal y condiciones de uso</h1></div><div class="prose" style="margin-top:16px">
<h2>1. Titular del sitio web</h2>
<p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este sitio web (${esc(C.domain)}) es titularidad de:</p>
<ul><li>Titular: ${esc(o.name)}</li><li>NIF: ${esc(o.nif)}</li><li>Domicilio: ${esc(o.address)}</li><li>Email de contacto: <a href="mailto:${o.email}">${esc(o.email)}</a></li></ul>
<h2>2. Objeto y naturaleza del servicio</h2>
<p>${esc(C.brand)} ofrece de forma gratuita un test de afinidad política con fines exclusivamente <b>informativos y educativos</b>, que compara las opiniones del usuario con las posiciones públicas de los partidos que concurren a las elecciones generales del 29 de noviembre de 2026.</p>
<ul>
<li>El resultado <b>no constituye una recomendación de voto</b>, ni un sondeo o encuesta electoral en el sentido del artículo 69 de la Ley Orgánica 5/1985, del Régimen Electoral General (LOREG). No se recogen ni publican estimaciones de voto ni resultados agregados de los usuarios.</li>
<li>${esc(C.brand)} es un proyecto <b>independiente</b>, sin vinculación con ningún partido, candidatura, administración pública ni con la Junta Electoral. No es un sitio oficial.</li>
<li>Las posiciones atribuidas a cada partido son una interpretación razonada de información pública (programas, declaraciones y votaciones), elaborada con criterios homogéneos y publicada en la <a href="/metodologia/">metodología</a>. Pueden contener errores u omisiones. Cualquier partido o usuario puede solicitar su corrección en ${esc(o.email)}.</li>
<li>Los nombres y siglas de los partidos se usan solo para identificarlos, con fines informativos y sin ánimo de sugerir respaldo o asociación. No se reproducen sus logotipos.</li>
</ul>
<h2>3. Condiciones de uso</h2>
<p>El uso del sitio es libre y gratuito y no requiere registro. El usuario se compromete a hacer un uso lícito del sitio y a no intentar dañarlo, alterarlo o usarlo con fines fraudulentos.</p>
<h2>4. Publicidad</h2>
<p>El sitio se financia con publicidad comercial servida por terceros (como Google AdSense). Los anuncios se identifican como "Publicidad". No se admite publicidad política (Reglamento (UE) 2024/900 sobre transparencia y segmentación de la publicidad política) y la publicidad no influye en el contenido ni en los resultados del test. En algunos casos podemos ofrecer ver un anuncio para acceder al contenido; ese anuncio es siempre voluntario y lo gestiona la red publicitaria.</p>
<h2>5. Propiedad intelectual</h2>
<p>Los textos, el diseño, el código y la metodología del sitio pertenecen a su titular. Se permite citar y enlazar el contenido indicando la fuente. Las marcas de terceros pertenecen a sus titulares.</p>
<h2>6. Responsabilidad</h2>
<p>El titular trabaja para que la información sea exacta y esté actualizada, pero no garantiza su exactitud ni que esté libre de errores, y no responde de las decisiones que el usuario tome basándose en ella. Recomendamos consultar los programas electorales oficiales. El titular no se responsabiliza del contenido de los sitios enlazados.</p>
<h2>7. Ley aplicable</h2>
<p>Estas condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan según la normativa aplicable, incluida la de consumidores y usuarios.</p>
<p class="disclaimer">Última actualización: ${fmtDate(C.updated)}.</p>
</div></div>`;
}

function privacy() {
  const o = C.owner;
  return `<div class="wrap">${crumbs([["Privacidad"]])}<div class="page-head"><h1>Política de privacidad</h1><p>Resumen: <b>tus respuestas al test y tu resultado no salen de tu dispositivo.</b> No te pedimos datos personales, no tienes que registrarte y no vendemos datos.</p></div><div class="prose" style="margin-top:16px">
<h2>1. Responsable del tratamiento</h2>
<p>${esc(o.name)} · NIF ${esc(o.nif)} · ${esc(o.address)} · <a href="mailto:${o.email}">${esc(o.email)}</a>.</p>
<h2>2. Tus respuestas al test: no las tratamos</h2>
<p>Las opiniones políticas son una categoría especial de datos protegida por el artículo 9 del Reglamento General de Protección de Datos (RGPD). Por eso hemos diseñado el test para que <b>no las recojamos</b>:</p>
<ul><li>El cálculo de tu resultado se hace en tu navegador, con JavaScript. Tus respuestas no se envían a nuestros servidores ni a terceros.</li><li>Para que puedas continuar un test a medias, tu progreso se guarda en el almacenamiento local de tu navegador (localStorage). Puedes borrarlo cuando quieras desde tu navegador; se borra solo al terminar el test.</li><li>Si compartes tu resultado, el enlace incluye tus respuestas codificadas después del símbolo "#". Esa parte de la dirección no se envía a nuestro servidor. Compartirlo es una decisión tuya: cualquiera con el enlace puede ver ese resultado.</li><li>No pedimos email, nombre ni registro, y no creamos perfiles ideológicos.</li><li>Si activamos analítica, solo mide eventos anónimos ("test iniciado", "test completado") y nunca tus respuestas ni tu resultado.</li></ul>
<h2>3. Datos que sí se tratan</h2>
<table><thead><tr><th>Dato</th><th>Finalidad</th><th>Base jurídica</th></tr></thead><tbody>
<tr><td>Dirección IP y datos técnicos de la conexión (registros del servidor de alojamiento)</td><td>Servir la web y mantener su seguridad</td><td>Interés legítimo (art. 6.1.f RGPD)</td></tr>
<tr><td>Cookies y similares de publicidad y medición (Google)</td><td>Mostrar y medir anuncios (personalizados solo si lo aceptas) y estadísticas de uso</td><td>Consentimiento (art. 6.1.a RGPD y art. 22.2 LSSI), que puedes retirar en cualquier momento</td></tr>
<tr><td>Correos que nos envíes</td><td>Responder tus consultas o correcciones</td><td>Consentimiento / interés legítimo</td></tr>
</tbody></table>
<h2>4. Destinatarios y transferencias</h2>
<p>Proveedores que actúan como encargados o responsables independientes: el proveedor de alojamiento (Vercel Inc.) y Google Ireland Ltd. (AdSense y, en su caso, Google Analytics). Estos proveedores pueden transferir datos a EE. UU. al amparo del Marco de Privacidad de Datos UE-EE. UU. o de cláusulas contractuales tipo. Más información: <a href="https://policies.google.com/technologies/partner-sites" rel="nofollow noopener" target="_blank">cómo usa Google los datos de los sitios asociados</a>. No vendemos ni cedemos datos personales a nadie.</p>
<h2>5. Conservación</h2>
<p>Registros técnicos: el plazo del proveedor de alojamiento (normalmente unas semanas). Correos: el tiempo necesario para atender la consulta. Cookies: el indicado en la <a href="/cookies/">política de cookies</a>.</p>
<h2>6. Tus derechos</h2>
<p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <a href="mailto:${o.email}">${esc(o.email)}</a>. Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="nofollow noopener" target="_blank">aepd.es</a>).</p>
<h2>7. Menores</h2><p>El sitio está dirigido a mayores de edad con derecho a voto, aunque cualquier persona puede consultarlo con fines informativos. No recogemos datos de menores.</p>
<p class="disclaimer">Última actualización: ${fmtDate(C.updated)}.</p>
</div></div>`;
}

function cookies() {
  return `<div class="wrap">${crumbs([["Cookies"]])}<div class="page-head"><h1>Política de cookies</h1></div><div class="prose" style="margin-top:16px">
<p>Usamos cookies y tecnologías similares según el artículo 22.2 de la LSSI y la Guía sobre el uso de las cookies de la AEPD. Las cookies no necesarias solo se instalan si das tu consentimiento en el banner que aparece al entrar. Ese banner lo gestiona una plataforma de consentimiento certificada por Google según el marco TCF de IAB Europe.</p>
<h2>Tipos de cookies</h2>
<table><thead><tr><th>Tipo</th><th>Quién</th><th>Para qué</th><th>¿Requiere consentimiento?</th></tr></thead><tbody>
<tr><td>Técnicas / almacenamiento local (q29-progress, stickyClosed)</td><td>Propias</td><td>Guardar tu progreso del test en tu navegador y recordar si cerraste el anuncio fijo</td><td>No (exentas)</td></tr>
<tr><td>Consentimiento (FCCDCF, FCNEC)</td><td>Google</td><td>Recordar tus preferencias de cookies</td><td>No (exentas)</td></tr>
<tr><td>Publicidad (p. ej. __gads, __gpi, IDE)</td><td>Google</td><td>Mostrar anuncios, limitar su frecuencia, medir su rendimiento y, si lo aceptas, personalizarlos</td><td>Sí</td></tr>
<tr><td>Analítica (_ga, _ga_*)</td><td>Google</td><td>Estadísticas anónimas de uso</td><td>Sí</td></tr>
</tbody></table>
<h2>Cómo gestionarlas</h2>
<p>Puedes cambiar tu elección en cualquier momento desde el enlace "Privacidad y cookies" del banner, o borrar las cookies desde la configuración de tu navegador. Si rechazas las cookies de publicidad, seguirás viendo anuncios, pero no personalizados.</p>
<p class="disclaimer">Última actualización: ${fmtDate(C.updated)}.</p>
</div></div>`;
}

/* ============================================================
 * ARCHIVOS TÉCNICOS
 * ============================================================ */
function technical() {
  const today = new Date().toISOString().slice(0, 10);
  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${U}${p}</loc><lastmod>${today}</lastmod><changefreq>${p === "/" || p === "/test/" ? "daily" : "weekly"}</changefreq><priority>${p === "/" ? "1.0" : p === "/test/" ? "0.9" : p.startsWith("/comparar/") || p.startsWith("/partidos/") || p.startsWith("/temas/") ? "0.7" : "0.5"}</priority></url>`).join("\n")}\n</urlset>\n`);
  write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /resultado/\n\nSitemap: ${U}/sitemap.xml\n`);
  const pub = (C.ads.adsenseClient || "").replace("ca-", "");
  write("ads.txt", pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : `# Añade aquí tu línea de AdSense: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n`);
  write("manifest.webmanifest", JSON.stringify({ name: `${C.brand} · Test político 29N`, short_name: C.brand, start_url: "/", display: "standalone", background_color: "#f6f5f1", theme_color: "#2f3cf0", icons: [{ src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }, { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] }, null, 2));
  write("vercel.json", JSON.stringify({ trailingSlash: true, headers: [{ source: "/assets/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }, { source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }] }] }, null, 2));
}

/* ---------- validación de datos ---------- */
function validate() {
  const ids = new Set();
  for (const q of questions) {
    if (ids.has(q.id)) throw new Error("id de pregunta duplicado: " + q.id);
    ids.add(q.id);
    if (!cats[q.cat]) throw new Error(`categoría desconocida en ${q.id}`);
    for (const p of parties) {
      const v = q.pos[p.id];
      if (!v) throw new Error(`falta la posición de ${p.id} en ${q.id}`);
      if (![-2, -1, 0, 1, 2].includes(v[0]) || !v[1]) throw new Error(`posición inválida ${p.id}/${q.id}`);
    }
  }
}

validate();
home();
quizPages();
partyPages();
topicPages();
comparePages();
contentPages();
technical();
console.log(`OK · ${pages.length} páginas indexables · ${questions.length} preguntas · ${parties.length} partidos`);
