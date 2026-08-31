/**
 * Motor de generación.
 * Entrada: el brief de la encuesta. Salida: un documento HTML completo,
 * autocontenido (CSS y JS en línea, cero dependencias) y listo para publicar.
 */

import { getIndustry } from './data/industries.js';
import { getTheme, getFontPair, getShape, buildPalette } from './data/themes.js';
import { writeCopy, placeholderTestimonials, seedFrom } from './copywriter.js';

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const attr = (s) => esc(s);
const slug = (s) => String(s || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const telHref = (t) => 'tel:' + String(t || '').replace(/[^\d+]/g, '');
const waHref = (t, msg) => {
  const num = String(t || '').replace(/[^\d]/g, '');
  return 'https://wa.me/' + num + (msg ? '?text=' + encodeURIComponent(msg) : '');
};

const SOCIAL_META = {
  instagram: { label: 'Instagram', icon: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.5a6.3 6.3 0 1 0 0 12.6 6.3 6.3 0 0 0 0-12.6Zm0 10.4a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2Zm8-10.7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z' },
  facebook: { label: 'Facebook', icon: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z' },
  tiktok: { label: 'TikTok', icon: 'M16.6 5.8a4.9 4.9 0 0 1-1.2-3.2h-3.3v13a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.6a6 6 0 1 0 5.2 6V9.4a8.2 8.2 0 0 0 4.7 1.5V7.6a4.9 4.9 0 0 1-3.5-1.8Z' },
  x: { label: 'X', icon: 'M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.4L5.1 21H2l7.3-8.3L2.4 3h6.3l4.4 5.8L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z' },
  linkedin: { label: 'LinkedIn', icon: 'M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 21h4V9H3v12ZM10 21h4v-6.5c0-1.7 2-1.9 2 0V21h4v-7.9c0-4.3-4.6-4.1-6-2v-2h-4v12Z' },
  youtube: { label: 'YouTube', icon: 'M21.6 7.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 4 12 4 12 4s-4 0-6.8.3c-.4 0-1.3 0-2 .9-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.8 1.7.8 2.1.9 1.6.1 6.7.2 6.7.2s4 0 6.8-.3c.4 0 1.3 0 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5c0-1.6-.2-3.1-.2-3.1ZM9.9 14.6V8.9l5.2 2.9-5.2 2.8Z' },
  spotify: { label: 'Spotify', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 0 1-.3-1.5c4.8-1.1 8.9-.6 12.2 1.4.4.2.5.7.3 1Zm1.2-2.8a1 1 0 0 1-1.3.3c-3.4-2-8.6-2.7-12.6-1.5a1 1 0 1 1-.6-1.9c4.6-1.4 10.3-.6 14.2 1.8.4.3.6.9.3 1.3Zm.1-2.9C14 8.4 7.9 8.2 4.4 9.3a1.2 1.2 0 1 1-.7-2.3C7.8 5.8 14.5 6 18.9 8.6a1.2 1.2 0 0 1-1.2 2.1Z' },
  tripadvisor: { label: 'Tripadvisor', icon: 'M12 6c-2.6 0-5 .7-7 2H1l1.6 1.8A4.9 4.9 0 0 0 6 18.4a4.8 4.8 0 0 0 3.4-1.4l1.6 1.8 1.6-1.8a4.8 4.8 0 0 0 3.4 1.4 4.9 4.9 0 0 0 3.4-8.6L21 8h-2c-2-1.3-4.4-2-7-2Zm-6 10a2.8 2.8 0 1 1 0-5.6A2.8 2.8 0 0 1 6 16Zm12 0a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z' },
  google: { label: 'Google', icon: 'M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Zm-9.6 10c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22.2Zm-5.6-8a6 6 0 0 1 0-3.8V7.8H3.1a10 10 0 0 0 0 9l3.3-2.6ZM12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.8l3.3 2.6C7.2 7.9 9.4 5.8 12 5.8Z' },
  web: { label: 'Web', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.9 9h-3.4a15.6 15.6 0 0 0-1.3-5.6A8 8 0 0 1 19.9 11ZM12 4.2c.8 1.1 1.8 3.3 2 6.8h-4c.2-3.5 1.2-5.7 2-6.8ZM4.1 13h3.4c.1 2.2.6 4.1 1.3 5.6A8 8 0 0 1 4.1 13Zm3.4-2H4.1a8 8 0 0 1 4.7-5.6A15.6 15.6 0 0 0 7.5 11ZM12 19.8c-.8-1.1-1.8-3.3-2-6.8h4c-.2 3.5-1.2 5.7-2 6.8Zm3.2-1.2c.7-1.5 1.2-3.4 1.3-5.6h3.4a8 8 0 0 1-4.7 5.6Z' },
};

/* ------------------------------------------------------------------ */
/* Modelo                                                              */
/* ------------------------------------------------------------------ */

export function buildModel(brief) {
  const ind = getIndustry(brief.industry);
  const theme = getTheme(brief.theme || ind.theme);
  const palette = buildPalette(theme, brief.accent);
  const fonts = getFontPair(brief.fonts || 'editorial');
  const shape = getShape(brief.shape || 'suave');
  const copy = writeCopy(brief);
  const seed = seedFrom(brief.name || 'vitrina');

  const services = (brief.services && brief.services.filter((s) => s && s.name))
    || null;

  const testimonials = (brief.testimonials && brief.testimonials.filter((t) => t && t.text).length)
    ? brief.testimonials.filter((t) => t && t.text)
    : placeholderTestimonials(brief);

  const faq = (brief.faq && brief.faq.filter((f) => f && f.q).length)
    ? brief.faq.filter((f) => f && f.q)
    : ind.faq || [];

  let sections = brief.sections && brief.sections.length ? [...brief.sections] : [...ind.sections];
  // El objetivo del negocio manda sobre el orden por defecto.
  if (brief.goal === 'catalogo' && sections.includes('galeria')) {
    sections = ['hero', 'galeria', ...sections.filter((s) => s !== 'hero' && s !== 'galeria')];
  }

  return {
    brief, ind, theme, palette, fonts, shape, copy, seed, sections,
    services: services || ind.services,
    testimonials,
    faq,
    gallery: (brief.images?.gallery || []).filter(Boolean),
    galleryLabels: ind.gallery || [],
  };
}

/* ------------------------------------------------------------------ */
/* Piezas                                                              */
/* ------------------------------------------------------------------ */

function placeholder(m, label, i, tall) {
  const hues = [0, 18, -14, 30, -26, 10];
  const rot = hues[i % hues.length];
  return `<div class="ph${tall ? ' ph-tall' : ''}" style="--rot:${rot}deg" role="img" aria-label="${attr(label)}">
      <span>${esc(label)}</span>
    </div>`;
}

function media(m, src, label, i, tall) {
  if (src) return `<img src="${attr(src)}" alt="${attr(label)}" loading="lazy" decoding="async">`;
  return placeholder(m, label, i, tall);
}

function navLinks(m) {
  const map = {
    servicios: 'Servicios', galeria: 'Galería', sobre: 'Nosotros',
    opiniones: 'Opiniones', horario: 'Horario', faq: 'FAQ', contacto: 'Contacto',
    proceso: 'Cómo trabajamos',
  };
  return m.sections
    .filter((s) => map[s])
    .map((s) => `<a href="#${s}">${map[s]}</a>`)
    .join('');
}

function heroSection(m) {
  const { brief, copy, palette } = m;
  const layout = brief.hero || 'partido';
  const img = brief.images?.hero;
  const cta = `<div class="hero-cta">
      <a class="btn btn-primary" href="#contacto">${esc(copy.ctaPrimary)}</a>
      ${brief.whatsapp ? `<a class="btn btn-ghost" href="${attr(waHref(brief.whatsapp, `Hola ${brief.name || ''}, os escribo desde la web.`))}" target="_blank" rel="noopener">${esc(copy.ctaSecondary)}</a>` : `<a class="btn btn-ghost" href="#servicios">Ver ${esc(m.ind.words.offer)}</a>`}
    </div>`;
  const badges = copy.trust.slice(0, 3)
    .map((t) => `<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>${esc(t)}</li>`).join('');

  const eyebrow = `<p class="eyebrow">${esc(m.ind.label)}${brief.city ? ` · ${esc(brief.city)}` : ''}</p>`;
  const h1 = `<h1>${esc(copy.headline)}</h1>`;
  const sub = `<p class="lede">${esc(copy.subhead)}</p>`;

  if (layout === 'centro') {
    return `<section class="hero hero-centro" id="inicio">
      <div class="wrap hero-in">
        ${eyebrow}${h1}${sub}${cta}
        <ul class="hero-badges">${badges}</ul>
      </div>
    </section>`;
  }
  if (layout === 'inmersivo') {
    return `<section class="hero hero-inmersivo" id="inicio">
      <div class="hero-bg">${media(m, img, brief.name || 'Portada', 0, true)}</div>
      <div class="wrap hero-in">
        ${eyebrow}${h1}${sub}${cta}
        <ul class="hero-badges">${badges}</ul>
      </div>
    </section>`;
  }
  if (layout === 'editorial') {
    return `<section class="hero hero-editorial" id="inicio">
      <div class="wrap">
        <div class="hero-top">${eyebrow}${h1}<div class="hero-aside">${sub}${cta}</div></div>
        <div class="hero-strip">${media(m, img, brief.name || 'Portada', 0)}</div>
        <ul class="hero-badges">${badges}</ul>
      </div>
    </section>`;
  }
  return `<section class="hero hero-partido" id="inicio">
    <div class="wrap hero-grid">
      <div class="hero-col">
        ${eyebrow}${h1}${sub}${cta}
        <ul class="hero-badges">${badges}</ul>
      </div>
      <div class="hero-media">${media(m, img, brief.name || 'Portada', 0, true)}</div>
    </div>
  </section>`;
}

function trustSection(m) {
  return `<section class="trust" aria-label="Motivos para elegirnos">
    <div class="wrap trust-in">
      ${m.copy.trust.slice(0, 4).map((t) => `<div class="trust-item"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>${esc(t)}</span></div>`).join('')}
    </div>
  </section>`;
}

function serviciosSection(m) {
  const s = m.copy.sections.servicios;
  return `<section class="sec" id="servicios">
    <div class="wrap">
      <header class="sec-head">
        <p class="eyebrow">${esc(m.ind.words.offer)}</p>
        <h2>${esc(s.title)}</h2>
        <p class="sec-sub">${esc(s.subtitle)}</p>
      </header>
      <div class="cards">
        ${m.services.slice(0, 8).map((sv, i) => `<article class="card">
          <div class="card-num">${String(i + 1).padStart(2, '0')}</div>
          <h3>${esc(sv.name)}</h3>
          <p>${esc(sv.desc || '')}</p>
          ${sv.price ? `<p class="price">${esc(sv.price)}</p>` : ''}
        </article>`).join('')}
      </div>
    </div>
  </section>`;
}

function procesoSection(m) {
  const p = m.copy.process;
  return `<section class="sec sec-alt" id="proceso">
    <div class="wrap">
      <header class="sec-head">
        <p class="eyebrow">El método</p>
        <h2>${esc(p.title)}</h2>
        <p class="sec-sub">${esc(p.subtitle)}</p>
      </header>
      <ol class="steps">
        ${p.steps.map((st, i) => `<li><span class="step-n">${i + 1}</span><h3>${esc(st.t)}</h3><p>${esc(st.d)}</p></li>`).join('')}
      </ol>
    </div>
  </section>`;
}

function sobreSection(m) {
  const a = m.copy.about;
  const img = m.brief.images?.about;
  return `<section class="sec" id="sobre">
    <div class="wrap about-grid">
      <div class="about-media">${media(m, img, 'Nuestro equipo', 2, true)}</div>
      <div class="about-col">
        <p class="eyebrow">${esc(a.badge)}</p>
        <h2>${esc(a.title)}</h2>
        ${a.body.map((p) => `<p>${esc(p)}</p>`).join('')}
        <a class="btn btn-primary" href="#contacto">${esc(m.copy.ctaPrimary)}</a>
      </div>
    </div>
  </section>`;
}

function galeriaSection(m) {
  const items = m.gallery.length
    ? m.gallery.map((src, i) => ({ src, label: m.galleryLabels[i] || 'Imagen' }))
    : m.galleryLabels.slice(0, 6).map((label) => ({ src: '', label }));
  const g = m.copy.sections.galeria;
  return `<section class="sec sec-alt" id="galeria">
    <div class="wrap">
      <header class="sec-head">
        <p class="eyebrow">Galería</p>
        <h2>${esc(g.title)}</h2>
        <p class="sec-sub">${esc(g.subtitle)}</p>
      </header>
      <div class="gallery">
        ${items.map((it, i) => `<figure class="gal-item${i % 5 === 0 ? ' gal-wide' : ''}">${media(m, it.src, it.label, i + 1)}<figcaption>${esc(it.label)}</figcaption></figure>`).join('')}
      </div>
    </div>
  </section>`;
}

function opinionesSection(m) {
  const o = m.copy.sections.opiniones;
  return `<section class="sec" id="opiniones">
    <div class="wrap">
      <header class="sec-head">
        <p class="eyebrow">Opiniones</p>
        <h2>${esc(o.title)}</h2>
        <p class="sec-sub">${esc(o.subtitle)}</p>
      </header>
      <div class="quotes">
        ${m.testimonials.slice(0, 3).map((t) => `<blockquote class="quote">
          <div class="stars" aria-label="5 de 5">${'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8L12 2Z"/></svg>'.repeat(5)}</div>
          <p>${esc(t.text)}</p>
          <cite>${esc(t.author || 'Cliente')}${t.meta ? `<span>${esc(t.meta)}</span>` : ''}</cite>
        </blockquote>`).join('')}
      </div>
    </div>
  </section>`;
}

function horarioSection(m) {
  const b = m.brief;
  const h = m.copy.sections.horario;
  const rows = (b.schedule && b.schedule.length ? b.schedule : [
    { d: 'Lunes a viernes', h: '09:00 – 20:00' },
    { d: 'Sábado', h: '10:00 – 14:00' },
    { d: 'Domingo', h: 'Cerrado' },
  ]);
  const mapQ = encodeURIComponent([b.address, b.city].filter(Boolean).join(', ') || b.city || '');
  return `<section class="sec sec-alt" id="horario">
    <div class="wrap horario-grid">
      <div>
        <p class="eyebrow">Visítanos</p>
        <h2>${esc(h.title)}</h2>
        <table class="sched">
          <tbody>${rows.map((r) => `<tr><th scope="row">${esc(r.d)}</th><td${/cerrad/i.test(r.h) ? ' class="closed"' : ''}>${esc(r.h)}</td></tr>`).join('')}</tbody>
        </table>
        ${b.address ? `<p class="addr"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>${esc(b.address)}${b.city ? `, ${esc(b.city)}` : ''}</p>` : ''}
      </div>
      <div class="map-wrap">
        ${mapQ ? `<iframe title="Mapa de ${attr(b.name || 'nuestra ubicación')}" src="https://www.google.com/maps?q=${mapQ}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : placeholder(m, 'Nuestra ubicación', 4, true)}
      </div>
    </div>
  </section>`;
}

function faqSection(m) {
  if (!m.faq.length) return '';
  const f = m.copy.sections.faq;
  return `<section class="sec" id="faq">
    <div class="wrap wrap-narrow">
      <header class="sec-head">
        <p class="eyebrow">Dudas</p>
        <h2>${esc(f.title)}</h2>
        <p class="sec-sub">${esc(f.subtitle)}</p>
      </header>
      <div class="faq">
        ${m.faq.map((q, i) => `<details${i === 0 ? ' open' : ''}>
          <summary>${esc(q.q)}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
          <div class="faq-body"><p>${esc(q.a)}</p></div>
        </details>`).join('')}
      </div>
    </div>
  </section>`;
}

function socialList(m, cls) {
  const s = m.brief.social || {};
  const items = Object.keys(SOCIAL_META)
    .filter((k) => s[k])
    .map((k) => `<a class="soc" href="${attr(s[k])}" target="_blank" rel="noopener" aria-label="${attr(SOCIAL_META[k].label)}" title="${attr(SOCIAL_META[k].label)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${SOCIAL_META[k].icon}"/></svg></a>`);
  if (!items.length) return '';
  return `<div class="${cls}">${items.join('')}</div>`;
}

function contactoSection(m) {
  const b = m.brief;
  const c = m.copy.sections.contacto;
  const rows = [];
  if (b.phone) rows.push(`<a class="cbox" href="${attr(telHref(b.phone))}"><span class="cbox-k">Teléfono</span><span class="cbox-v">${esc(b.phone)}</span></a>`);
  if (b.whatsapp) rows.push(`<a class="cbox" href="${attr(waHref(b.whatsapp, `Hola ${b.name || ''}, os escribo desde la web.`))}" target="_blank" rel="noopener"><span class="cbox-k">WhatsApp</span><span class="cbox-v">${esc(b.whatsapp)}</span></a>`);
  if (b.email) rows.push(`<a class="cbox" href="mailto:${attr(b.email)}"><span class="cbox-k">Email</span><span class="cbox-v">${esc(b.email)}</span></a>`);
  if (b.address) rows.push(`<a class="cbox" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([b.address, b.city].filter(Boolean).join(', '))}" target="_blank" rel="noopener"><span class="cbox-k">Dirección</span><span class="cbox-v">${esc(b.address)}</span></a>`);

  return `<section class="sec sec-contacto" id="contacto">
    <div class="wrap contacto-grid">
      <div>
        <p class="eyebrow">Contacto</p>
        <h2>${esc(c.title)}</h2>
        <p class="sec-sub">${esc(c.subtitle)}</p>
        <div class="cboxes">${rows.join('')}</div>
        ${socialList(m, 'socs')}
      </div>
      <form class="form" ${b.formAction ? `action="${attr(b.formAction)}" method="POST"` : 'onsubmit="return vForm(event)"'}>
        <label>Nombre<input type="text" name="nombre" required autocomplete="name" placeholder="Cómo te llamas"></label>
        <label>Email o teléfono<input type="text" name="contacto" required placeholder="Para poder responderte"></label>
        <label>Mensaje<textarea name="mensaje" rows="4" required placeholder="Cuéntanos qué necesitas"></textarea></label>
        <label class="check"><input type="checkbox" name="rgpd" required> He leído y acepto la <a href="#legal">política de privacidad</a>.</label>
        <button class="btn btn-primary" type="submit">Enviar mensaje</button>
        <p class="form-note" id="form-note" role="status"></p>
      </form>
    </div>
  </section>`;
}

const SECTION_RENDERERS = {
  hero: heroSection, trust: trustSection, servicios: serviciosSection,
  proceso: procesoSection, sobre: sobreSection, galeria: galeriaSection,
  opiniones: opinionesSection, horario: horarioSection, faq: faqSection,
  contacto: contactoSection,
};

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

function buildCss(m) {
  const p = m.palette, f = m.fonts, sh = m.shape;
  return `
:root{
  --bg:${p.bg}; --surface:${p.surface}; --surface2:${p.surface2}; --line:${p.line};
  --text:${p.text}; --muted:${p.muted}; --accent:${p.accent}; --accent-ink:${p.accentInk};
  --accent-soft:${p.accentSoft}; --accent-line:${p.accentLine};
  --r:${sh.radius}px; --r-sm:${sh.radiusSm}px; --r-pill:${sh.radiusPill}px;
  --shadow:${p.shadow};
  --display:${f.display}; --body:${f.body}; --dw:${f.displayWeight}; --tr:${f.tracking};
  --wrap:1120px;
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--body);font-size:17px;line-height:1.65;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block;height:auto}
a{color:inherit}
h1,h2,h3{font-family:var(--display);font-weight:var(--dw);letter-spacing:var(--tr);line-height:1.08;margin:0 0 .5em}
h1{font-size:clamp(2.4rem,6vw,4.4rem)}
h2{font-size:clamp(1.9rem,4vw,2.9rem)}
h3{font-size:1.2rem;line-height:1.3}
p{margin:0 0 1em}
.wrap{width:100%;max-width:var(--wrap);margin:0 auto;padding:0 24px}
.wrap-narrow{max-width:760px}
.eyebrow{font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-weight:600;margin:0 0 .9em}
.lede{font-size:clamp(1.05rem,1.6vw,1.22rem);color:var(--muted);max-width:56ch;margin-bottom:2rem}
.sec{padding:clamp(64px,9vw,120px) 0}
.sec-alt{background:var(--surface)}
.sec-head{max-width:640px;margin:0 0 clamp(36px,5vw,60px)}
.sec-sub{color:var(--muted);margin:0}

/* botones */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;padding:.95em 1.7em;border-radius:var(--r-pill);font-weight:600;font-size:.98rem;text-decoration:none;border:1px solid transparent;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,background .18s ease;font-family:inherit}
.btn-primary{background:var(--accent);color:var(--accent-ink);box-shadow:0 8px 24px -10px var(--accent)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 34px -12px var(--accent)}
.btn-ghost{border-color:var(--line);color:var(--text);background:transparent}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}

/* cabecera */
.hd{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:saturate(180%) blur(14px);border-bottom:1px solid transparent;transition:border-color .3s}
.hd.stuck{border-bottom-color:var(--line)}
.hd-in{display:flex;align-items:center;gap:24px;height:72px}
.logo{display:flex;align-items:center;gap:.6em;font-family:var(--display);font-weight:var(--dw);font-size:1.16rem;letter-spacing:var(--tr);text-decoration:none;margin-right:auto}
.logo img{height:34px;width:auto}
.logo-dot{width:12px;height:12px;border-radius:50%;background:var(--accent);flex:none}
.hd-nav{display:flex;gap:22px}
.hd-nav a{color:var(--muted);text-decoration:none;font-size:.94rem;font-weight:500;transition:color .18s}
.hd-nav a:hover{color:var(--text)}
.hd .btn{padding:.7em 1.3em;font-size:.9rem}
.burger{display:none;background:none;border:0;color:var(--text);padding:8px;cursor:pointer}
.burger svg{width:26px;height:26px;stroke:currentColor;fill:none;stroke-width:1.8}

/* hero */
.hero{position:relative;overflow:hidden}
.hero-partido .hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(32px,5vw,72px);align-items:center;padding:clamp(56px,8vw,104px) 0}
.hero-centro .hero-in{text-align:center;padding:clamp(72px,11vw,150px) 0;max-width:860px}
.hero-centro .lede{margin-inline:auto}
.hero-centro .hero-cta,.hero-centro .hero-badges{justify-content:center}
.hero-cta{display:flex;flex-wrap:wrap;gap:12px}
.hero-badges{list-style:none;display:flex;flex-wrap:wrap;gap:10px 22px;padding:0;margin:2.4rem 0 0}
.hero-badges li{display:flex;align-items:center;gap:.5em;color:var(--muted);font-size:.9rem}
.hero-badges svg{width:16px;height:16px;stroke:var(--accent);fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;flex:none}
.hero-media{border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)}
.hero-inmersivo{min-height:min(86vh,760px);display:flex;align-items:flex-end}
.hero-inmersivo .hero-bg{position:absolute;inset:0;z-index:0}
.hero-inmersivo .hero-bg img,.hero-inmersivo .hero-bg .ph{width:100%;height:100%;object-fit:cover;border-radius:0}
.hero-inmersivo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 25%,transparent) 0%,color-mix(in srgb,var(--bg) 88%,transparent) 72%,var(--bg) 100%);z-index:1}
.hero-inmersivo .hero-in{position:relative;z-index:2;padding:0 24px clamp(56px,8vw,96px);max-width:760px}
.hero-editorial{padding:clamp(56px,8vw,104px) 0 0}
.hero-editorial h1{font-size:clamp(2.6rem,8.5vw,6rem);margin-bottom:.3em}
.hero-editorial .hero-top{display:grid;grid-template-columns:1fr;gap:8px}
.hero-editorial .hero-aside{max-width:52ch;margin-left:auto}
.hero-strip{margin-top:48px;border-radius:var(--r);overflow:hidden;aspect-ratio:21/9;box-shadow:var(--shadow)}
.hero-strip img,.hero-strip .ph{width:100%;height:100%;object-fit:cover}
.hero-editorial .hero-badges{padding-bottom:clamp(40px,6vw,72px)}

/* placeholders */
.ph{position:relative;aspect-ratio:4/3;border-radius:var(--r);display:grid;place-items:center;overflow:hidden;
  background:
    radial-gradient(120% 100% at 15% 10%, color-mix(in srgb,var(--accent) 34%,transparent) 0%, transparent 58%),
    radial-gradient(120% 120% at 90% 90%, color-mix(in srgb,var(--accent) 16%,transparent) 0%, transparent 55%),
    var(--surface2);
  border:1px solid var(--line);filter:hue-rotate(var(--rot,0deg))}
.ph-tall{aspect-ratio:4/5}
.ph::after{content:"";position:absolute;inset:0;background-image:linear-gradient(color-mix(in srgb,var(--text) 5%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--text) 5%,transparent) 1px,transparent 1px);background-size:34px 34px;opacity:.5}
.ph span{position:relative;z-index:1;font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:600;padding:.5em 1em;border:1px solid var(--line);border-radius:var(--r-pill);background:color-mix(in srgb,var(--bg) 62%,transparent)}

/* confianza */
.trust{border-block:1px solid var(--line);background:var(--surface)}
.trust-in{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px 32px;padding:26px 24px}
.trust-item{display:flex;align-items:center;gap:.6em;font-size:.92rem;font-weight:500}
.trust-item svg{width:17px;height:17px;stroke:var(--accent);fill:none;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;flex:none}

/* tarjetas */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(258px,1fr));gap:18px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:30px 26px;transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}
.sec-alt .card{background:var(--bg)}
.card:hover{transform:translateY(-4px);border-color:var(--accent-line);box-shadow:var(--shadow)}
.card-num{font-family:var(--display);font-size:.8rem;letter-spacing:.1em;color:var(--accent);margin-bottom:1.4em;font-weight:600}
.card p{color:var(--muted);margin:0;font-size:.96rem}
.card .price{margin-top:1em;color:var(--text);font-weight:600;font-size:.92rem}

/* pasos */
.steps{list-style:none;counter-reset:s;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:32px}
.steps li{position:relative;padding-top:22px;border-top:2px solid var(--line)}
.steps li::before{content:"";position:absolute;top:-2px;left:0;width:44px;height:2px;background:var(--accent)}
.step-n{display:inline-block;font-family:var(--display);font-size:.82rem;color:var(--accent);font-weight:600;margin-bottom:.9em;letter-spacing:.1em}
.steps h3{margin-bottom:.4em}
.steps p{color:var(--muted);font-size:.96rem;margin:0}

/* sobre */
.about-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(32px,5vw,72px);align-items:center}
.about-media{border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)}
.about-col p{color:var(--muted)}
.about-col .btn{margin-top:1em}

/* galería */
.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.gal-item{margin:0;position:relative;border-radius:var(--r);overflow:hidden;background:var(--surface2)}
.gal-item img,.gal-item .ph{width:100%;height:100%;aspect-ratio:1/1;object-fit:cover;border-radius:0;border:0}
.gal-wide{grid-column:span 2}
.gal-wide img,.gal-wide .ph{aspect-ratio:2/1}
.gal-item figcaption{position:absolute;left:12px;bottom:12px;font-size:.76rem;letter-spacing:.08em;text-transform:uppercase;font-weight:600;padding:.42em .9em;border-radius:var(--r-pill);background:color-mix(in srgb,var(--bg) 80%,transparent);backdrop-filter:blur(8px);color:var(--text)}

/* opiniones */
.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
.quote{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:30px 26px}
.sec-alt .quote{background:var(--bg)}
.stars{display:flex;gap:3px;margin-bottom:1.1em}
.stars svg{width:15px;height:15px;fill:var(--accent)}
.quote p{font-size:1.02rem;margin-bottom:1.4em}
.quote cite{font-style:normal;font-weight:600;font-size:.93rem;display:block}
.quote cite span{display:block;font-weight:400;color:var(--muted);font-size:.85rem;margin-top:.2em}

/* horario */
.horario-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:clamp(32px,5vw,64px);align-items:start}
.sched{width:100%;border-collapse:collapse;margin:1.5em 0}
.sched th,.sched td{text-align:left;padding:.85em 0;border-bottom:1px solid var(--line);font-weight:500;font-size:.96rem}
.sched th{color:var(--muted);font-weight:500}
.sched td{text-align:right;font-variant-numeric:tabular-nums}
.sched td.closed{color:var(--muted)}
.addr{display:flex;gap:.6em;align-items:flex-start;color:var(--muted);font-size:.95rem}
.addr svg{width:18px;height:18px;stroke:var(--accent);fill:none;stroke-width:1.8;flex:none;margin-top:3px}
.map-wrap{border-radius:var(--r);overflow:hidden;border:1px solid var(--line);aspect-ratio:4/3}
.map-wrap iframe{width:100%;height:100%;border:0;display:block;filter:grayscale(.25)}

/* faq */
.faq details{border-bottom:1px solid var(--line)}
.faq summary{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:1.15em 0;cursor:pointer;font-weight:600;font-size:1.04rem;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary svg{width:20px;height:20px;stroke:var(--accent);fill:none;stroke-width:2;flex:none;transition:transform .25s}
.faq details[open] summary svg{transform:rotate(180deg)}
.faq-body{padding-bottom:1.4em;color:var(--muted);max-width:62ch}
.faq-body p{margin:0}

/* contacto */
.sec-contacto{background:var(--surface)}
.contacto-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,64px);align-items:start}
.cboxes{display:grid;gap:10px;margin:2em 0 1.6em}
.cbox{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:1em 1.2em;border:1px solid var(--line);border-radius:var(--r-sm);text-decoration:none;background:var(--bg);transition:border-color .18s,transform .18s}
.cbox:hover{border-color:var(--accent);transform:translateX(3px)}
.cbox-k{color:var(--muted);font-size:.86rem}
.cbox-v{font-weight:600;font-size:.96rem;text-align:right}
.socs{display:flex;gap:10px}
.soc{width:42px;height:42px;display:grid;place-items:center;border:1px solid var(--line);border-radius:var(--r-pill);transition:border-color .18s,color .18s,transform .18s}
.soc svg{width:19px;height:19px;fill:currentColor}
.soc:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-2px)}
.form{background:var(--bg);border:1px solid var(--line);border-radius:var(--r);padding:clamp(24px,3vw,34px);display:grid;gap:14px}
.form label{display:grid;gap:.45em;font-size:.88rem;font-weight:600;color:var(--muted)}
.form input[type=text],.form textarea{width:100%;padding:.85em 1em;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);color:var(--text);font:inherit;font-size:.98rem;font-weight:400;transition:border-color .18s}
.form input:focus,.form textarea:focus{outline:none;border-color:var(--accent)}
.form textarea{resize:vertical}
.check{display:flex!important;flex-direction:row;align-items:flex-start;gap:.7em;font-weight:400;font-size:.84rem;line-height:1.5}
.check input{margin-top:3px;accent-color:var(--accent);flex:none}
.check a{color:var(--accent)}
.form-note{margin:0;font-size:.87rem;color:var(--accent);font-weight:600;min-height:1.2em}

/* pie */
.ft{border-top:1px solid var(--line);padding:56px 0 40px;background:var(--bg)}
.ft-in{display:flex;flex-wrap:wrap;gap:28px;justify-content:space-between;align-items:flex-start}
.ft-brand{max-width:34ch}
.ft-brand p{color:var(--muted);font-size:.92rem;margin:1em 0 0}
.ft-nav{display:grid;gap:.6em}
.ft-nav a{color:var(--muted);text-decoration:none;font-size:.92rem}
.ft-nav a:hover{color:var(--accent)}
.ft-legal{margin-top:40px;padding-top:22px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:8px 20px;justify-content:space-between;color:var(--muted);font-size:.82rem}
.ft-legal a{color:var(--muted)}
#legal{scroll-margin-top:90px}

/* wa flotante */
.wa{position:fixed;right:18px;bottom:18px;z-index:60;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:#25D366;color:#fff;box-shadow:0 12px 30px -8px rgba(37,211,102,.7);transition:transform .2s}
.wa:hover{transform:scale(1.07)}
.wa svg{width:29px;height:29px;fill:currentColor}

/* animación de entrada */
.rv{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
.rv.in{opacity:1;transform:none}

@media (max-width:900px){
  .hero-partido .hero-grid,.about-grid,.horario-grid,.contacto-grid{grid-template-columns:1fr}
  .hero-media,.about-media{order:-1}
  .hd-nav{display:none}
  .burger{display:block}
  .hd-nav.open{display:flex;position:absolute;top:72px;left:0;right:0;flex-direction:column;background:var(--bg);border-bottom:1px solid var(--line);padding:18px 24px 24px;gap:16px}
  .gal-wide{grid-column:span 1}
  .gal-wide img,.gal-wide .ph{aspect-ratio:1/1}
  .hero-editorial .hero-aside{margin-left:0}
}
@media (max-width:560px){
  body{font-size:16px}
  .hd .btn{display:none}
  .cbox{flex-direction:column;align-items:flex-start;gap:4px}
  .cbox-v{text-align:left}
}
@media (prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
  html{scroll-behavior:auto}
  .rv{opacity:1;transform:none}
}
`.trim();
}

/* ------------------------------------------------------------------ */
/* Documento                                                           */
/* ------------------------------------------------------------------ */

function jsonLd(m) {
  const b = m.brief;
  const data = {
    '@context': 'https://schema.org',
    '@type': m.ind.schema || 'LocalBusiness',
    name: b.name || m.ind.label,
    description: m.copy.meta.description,
    ...(b.phone ? { telephone: b.phone } : {}),
    ...(b.email ? { email: b.email } : {}),
    ...(b.domain ? { url: b.domain.startsWith('http') ? b.domain : 'https://' + b.domain } : {}),
    ...(b.address || b.city ? {
      address: {
        '@type': 'PostalAddress',
        ...(b.address ? { streetAddress: b.address } : {}),
        ...(b.city ? { addressLocality: b.city } : {}),
        addressCountry: 'ES',
      },
    } : {}),
    ...(m.services?.length ? {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: m.copy.sections.servicios.title,
        itemListElement: m.services.slice(0, 8).map((s) => ({
          '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.desc || '' },
        })),
      },
    } : {}),
    ...(Object.values(b.social || {}).filter(Boolean).length
      ? { sameAs: Object.values(b.social).filter(Boolean) } : {}),
  };
  const faqLd = m.faq.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: m.faq.map((q) => ({
      '@type': 'Question', name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a },
    })),
  } : null;
  return [data, faqLd].filter(Boolean)
    .map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}<\/script>`)
    .join('\n');
}

const RUNTIME = `
(function(){
  var hd=document.querySelector('.hd');
  if(hd){addEventListener('scroll',function(){hd.classList.toggle('stuck',scrollY>8)},{passive:true})}
  var b=document.querySelector('.burger'),n=document.querySelector('.hd-nav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    n.addEventListener('click',function(e){if(e.target.tagName==='A')n.classList.remove('open')})}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
  document.querySelectorAll('.sec-head,.card,.quote,.steps li,.gal-item,.about-col,.about-media,.form,.cboxes,.hero-badges,.trust-item').forEach(function(el,i){el.classList.add('rv');el.style.transitionDelay=(Math.min(i%6,5)*55)+'ms';io.observe(el)});
})();
function vForm(e){
  e.preventDefault();
  var f=e.target,n=document.getElementById('form-note');
  n.textContent='Gracias. Hemos recibido tu mensaje y te respondemos hoy mismo.';
  f.reset();
  return false;
}
`.trim();

export function renderSite(model) {
  const m = model;
  const b = m.brief;
  const year = new Date().getFullYear();
  const body = m.sections
    .map((s) => (SECTION_RENDERERS[s] ? SECTION_RENDERERS[s](m) : ''))
    .join('\n');

  const logo = b.images?.logo
    ? `<img src="${attr(b.images.logo)}" alt="${attr(b.name || 'Logotipo')}">`
    : `<span class="logo-dot"></span>`;

  const legalName = b.legalName || b.name || '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(m.copy.meta.title)}</title>
<meta name="description" content="${attr(m.copy.meta.description)}">
<meta name="theme-color" content="${attr(m.palette.bg)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${attr(m.copy.meta.title)}">
<meta property="og:description" content="${attr(m.copy.meta.description)}">
<meta property="og:locale" content="es_ES">
${b.domain ? `<link rel="canonical" href="${attr(b.domain.startsWith('http') ? b.domain : 'https://' + b.domain)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${m.fonts.googleFonts}&display=swap" rel="stylesheet">
<style>${buildCss(m)}</style>
${jsonLd(m)}
</head>
<body>
<header class="hd">
  <div class="wrap hd-in">
    <a class="logo" href="#inicio">${logo}<span>${esc(b.name || m.ind.label)}</span></a>
    <nav class="hd-nav" aria-label="Principal">${navLinks(m)}</nav>
    <a class="btn btn-primary" href="#contacto">${esc(m.copy.ctaPrimary)}</a>
    <button class="burger" aria-label="Abrir menú" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg></button>
  </div>
</header>
<main>
${body}
</main>
<footer class="ft">
  <div class="wrap">
    <div class="ft-in">
      <div class="ft-brand">
        <a class="logo" href="#inicio">${logo}<span>${esc(b.name || m.ind.label)}</span></a>
        <p>${esc(m.copy.subhead)}</p>
        ${socialList(m, 'socs') ? `<div style="margin-top:18px">${socialList(m, 'socs')}</div>` : ''}
      </div>
      <nav class="ft-nav" aria-label="Pie">${navLinks(m)}</nav>
      <div class="ft-nav">
        ${b.phone ? `<a href="${attr(telHref(b.phone))}">${esc(b.phone)}</a>` : ''}
        ${b.email ? `<a href="mailto:${attr(b.email)}">${esc(b.email)}</a>` : ''}
        ${b.address ? `<span style="color:var(--muted);font-size:.92rem">${esc(b.address)}${b.city ? `, ${esc(b.city)}` : ''}</span>` : ''}
      </div>
    </div>
    <div class="ft-legal" id="legal">
      <span>© ${year} ${esc(legalName)}. Todos los derechos reservados.</span>
      <span>Aviso legal · Privacidad · Cookies</span>
    </div>
  </div>
</footer>
${b.whatsapp ? `<a class="wa" href="${attr(waHref(b.whatsapp, `Hola ${b.name || ''}, os escribo desde la web.`))}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Z"/></svg></a>` : ''}
<script>${RUNTIME}<\/script>
</body>
</html>`;
}

export function generateSite(brief) {
  const model = buildModel(brief);
  return { model, html: renderSite(model) };
}
