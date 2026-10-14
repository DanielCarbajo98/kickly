/* Sección de actualidad: listado filtrable por partido y una página por noticia. */
import C from "./config.mjs";
import { news } from "./news.mjs";
import { parties } from "./data.mjs";
import { inBlackout } from "./polls-page.mjs";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
export const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 10).join("-");

export function visibleNews() {
  const blocked = inBlackout();
  const seen = new Set();
  return news
    .filter((n) => !(blocked && n.poll))
    .map((n) => {
      let slug = slugify(n.headline);
      while (seen.has(slug)) slug += "-2";
      seen.add(slug);
      return { ...n, slug };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function newsCard(n, PBY, dot) {
  return `<a class="news" href="/actualidad/${n.slug}/" data-p="${n.parties.join(" ")}"><time datetime="${n.date}">${fmtDate(n.date)}</time><h3>${esc(n.headline)}</h3><p>${esc(n.summary.split(". ")[0])}.</p><div class="tags">${n.parties.map((id) => PBY[id] ? `<span>${dot(PBY[id])}${esc(PBY[id].short)}</span>` : "").join("")}</div></a>`;
}

export function latestNews(pid, n = 4) {
  return visibleNews().filter((x) => !pid || x.parties.includes(pid)).slice(0, n);
}

export function newsPages({ layout, write, ctaBox, crumbs, crumbLd, ad, PBY, dot }) {
  const items = visibleNews();
  const chips = `<div class="tabs" role="tablist" id="nf"><button class="tab" data-f="" aria-selected="true">Todos</button>${parties.map((p) => `<button class="tab" data-f="${p.id}" aria-selected="false">${dot(p)}${esc(p.short)}</button>`).join("")}</div>`;
  const list = `<div class="wrap">${crumbs([["Actualidad"]])}
<div class="page-head"><h1>Actualidad de la campaña del 29N: noticias de los partidos</h1><p>Lo más importante de cada partido de cara a las elecciones generales del 29 de noviembre, resumido de forma neutral y con enlace a la fuente original.</p></div>
${chips}
<div class="news-list" id="nl">${items.map((n, i) => newsCard(n, PBY, dot) + (i === 5 ? ad("content") : "")).join("")}</div>
<script>(function(){var b=document.querySelectorAll('#nf .tab');b.forEach(function(t){t.onclick=function(){b.forEach(function(x){x.setAttribute('aria-selected',x===t)});var f=t.dataset.f;document.querySelectorAll('#nl .news').forEach(function(n){n.hidden=f&&n.dataset.p.split(' ').indexOf(f)<0;});};});})();</script>
${ctaBox("Entre tanta noticia: ¿con qué partido coincides tú?")}</div>`;
  write("actualidad/index.html", layout({
    path: "/actualidad/", nav: "news",
    title: `Actualidad elecciones 29N: últimas noticias de los partidos | ${C.brand}`,
    description: "Últimas noticias de la campaña de las elecciones generales del 29N de 2026: PSOE, PP, Vox, Frente Amplio, Podemos, SALF, ERC, Junts, EH Bildu, PNV y BNG, resumidas de forma neutral.",
    body: list,
    jsonld: [crumbLd([["Actualidad", "/actualidad/"]]), { "@type": "ItemList", itemListElement: items.slice(0, 20).map((n, i) => ({ "@type": "ListItem", position: i + 1, url: `${C.siteUrl}/actualidad/${n.slug}/` })) }],
  }));

  for (const n of items) {
    const related = items.filter((x) => x !== n && x.parties.some((p) => n.parties.includes(p))).slice(0, 4);
    const body = `<div class="wrap">${crumbs([["Actualidad", "/actualidad/"], [n.headline.slice(0, 50) + (n.headline.length > 50 ? "…" : "")]])}
<article class="prose" style="margin-top:14px">
<p class="news" style="all:unset"><time datetime="${n.date}" style="font-size:13px;color:var(--faint);font-weight:700;text-transform:uppercase;letter-spacing:.05em">${fmtDate(n.date)}</time></p>
<h1 style="font-family:var(--display);font-size:clamp(28px,4.2vw,42px);letter-spacing:-.03em;line-height:1.1;margin:8px 0 14px">${esc(n.headline)}</h1>
<div class="party-strip" style="justify-content:flex-start;margin:0 0 16px">${n.parties.map((id) => PBY[id] ? `<a class="chip" href="/partidos/${id}/">${dot(PBY[id])}${esc(PBY[id].short)}</a>` : "").join("")}</div>
<p style="font-size:18px">${esc(n.summary)}</p>
<h2 style="font-size:22px">Por qué importa</h2>
<p>${esc(n.why)}</p>
<p class="note">Fuente: <a href="${esc(n.url)}" rel="nofollow noopener" target="_blank">${esc(n.source)}</a>. Resumen de redacción propia de ${esc(C.brand)}.</p>
</article>
${ad("content")}
${ctaBox()}
${related.length ? `<section class="section" style="padding-top:0"><h2>Más noticias relacionadas</h2><div class="news-list">${related.map((r) => newsCard(r, PBY, dot)).join("")}</div></section>` : ""}
</div>`;
    write(`actualidad/${n.slug}/index.html`, layout({
      path: `/actualidad/${n.slug}/`, nav: "news", ogType: "article",
      title: `${n.headline} | ${C.brand}`,
      description: n.summary.slice(0, 155),
      body,
      extraHead: `<meta property="article:published_time" content="${n.date}T09:00:00+02:00">`,
      jsonld: [
        crumbLd([["Actualidad", "/actualidad/"], [n.headline, `/actualidad/${n.slug}/`]]),
        { "@type": "NewsArticle", headline: n.headline.slice(0, 110), datePublished: `${n.date}T09:00:00+02:00`, dateModified: `${n.date}T09:00:00+02:00`, image: [`${C.siteUrl}/og.png`], author: { "@type": "Organization", name: C.brand, url: C.siteUrl }, publisher: { "@type": "Organization", name: C.brand, logo: { "@type": "ImageObject", url: `${C.siteUrl}/apple-touch-icon.png` } }, mainEntityOfPage: `${C.siteUrl}/actualidad/${n.slug}/`, inLanguage: "es-ES" },
      ],
    }));
  }
}
