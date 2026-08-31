/** Utilidades compartidas por todas las páginas de Vitrina. */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const euro = (n) => new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
}).format(n);

/** Cabecera pegajosa + menú móvil. */
export function initHeader() {
  const hd = $('#hd');
  if (hd) {
    const onScroll = () => hd.classList.toggle('stuck', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const burger = $('#burger'), nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const abierto = nav.classList.toggle('abierto');
      burger.setAttribute('aria-expanded', String(abierto));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('abierto');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();
}

/** Revelado progresivo al entrar en pantalla. */
export function initReveal(selector = '.rv') {
  const els = $$(selector);
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  els.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 5, 4) * 70}ms`;
    io.observe(el);
  });
}

/** Aviso efímero en pantalla. */
export function toast(msg, ms = 3200) {
  let t = $('#v-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'v-toast';
    t.setAttribute('role', 'status');
    t.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translate(-50%,20px);z-index:200;'
      + 'padding:.85em 1.4em;border-radius:999px;background:#F7F3EC;color:#0B0B0E;font-weight:600;'
      + 'font-size:.92rem;box-shadow:0 18px 44px -14px rgba(0,0,0,.7);opacity:0;'
      + 'transition:opacity .28s cubic-bezier(.22,.72,.2,1),transform .28s cubic-bezier(.22,.72,.2,1);'
      + 'max-width:calc(100vw - 40px);text-align:center';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translate(-50%,0)'; });
  clearTimeout(t._h);
  t._h = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%,20px)'; }, ms);
}

/** Descarga un texto como archivo. */
export function download(filename, content, type = 'text/html;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export const slugify = (s) => String(s || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '').slice(0, 40) || 'mi-negocio';
