/** Portada de Vitrina: demo en vivo, precios y microinteracciones. */

import { $, $$, euro, initHeader, initReveal } from './ui.js';
import { ADDONS, STATS } from './config.js';
import { pintarPlanes, pintarExplicacion, montarConmutador } from './precios-ui.js';
import { INDUSTRIES } from './data/industries.js';
import { THEMES } from './data/themes.js';
import { generateSite } from './generator.js';

initHeader();
initReveal();

/* ---------- Titular rotatorio ---------- */
(function rotador() {
  const cont = $('#rotador');
  if (!cont) return;
  const items = $$('span', cont);
  let i = 0;

  // El contenedor mide lo que la palabra más larga, así que fijamos su ancho
  // a la palabra visible para que lo que va detrás no quede descolgado.
  const ajustar = () => { cont.style.width = `${items[i].getBoundingClientRect().width}px`; };

  const listo = () => { ajustar(); requestAnimationFrame(ajustar); };
  if (document.fonts?.ready) document.fonts.ready.then(listo); else listo();
  addEventListener('resize', ajustar);

  setInterval(() => {
    items[i].classList.remove('act');
    i = (i + 1) % items.length;
    items[i].classList.add('act');
    ajustar();
  }, 2300);
})();

/* ---------- Demos generadas en vivo ---------- */
const DEMOS = [
  {
    chip: 'Restaurante', url: 'casamanolo',
    brief: {
      industry: 'restaurante', name: 'Casa Manolo', city: 'Valencia', years: 22,
      goal: 'reservas', tone: 'cercano', hero: 'partido', fonts: 'editorial', shape: 'suave',
      phone: '+34 963 55 12 08', whatsapp: '+34600112233', email: 'reservas@casamanolo.es',
      address: 'Carrer de la Pau 14',
      social: { instagram: 'https://instagram.com/', google: 'https://google.com/' },
      schedule: [{ d: 'Martes a jueves', h: '13:00 – 16:00' }, { d: 'Viernes y sábado', h: '13:00 – 16:30 · 20:30 – 23:30' }, { d: 'Domingo y lunes', h: 'Cerrado' }],
    },
  },
  {
    chip: 'Peluquería', url: 'estudionube',
    brief: {
      industry: 'peluqueria', name: 'Estudio Nube', city: 'Madrid', years: 8,
      goal: 'reservas', tone: 'elegante', hero: 'editorial', fonts: 'clasica', shape: 'recto',
      theme: 'lino', phone: '+34 915 40 22 71', whatsapp: '+34600445566',
      address: 'Calle Hortaleza 41',
      social: { instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/' },
    },
  },
  {
    chip: 'Fisioterapia', url: 'clinicaarco',
    brief: {
      industry: 'fisio', name: 'Clínica Arco', city: 'Bilbao', years: 12,
      goal: 'contacto', tone: 'tecnico', hero: 'centro', fonts: 'moderna', shape: 'suave',
      theme: 'jade', phone: '+34 944 21 08 33', whatsapp: '+34600778899',
      email: 'citas@clinicaarco.es', address: 'Gran Vía 38',
      social: { google: 'https://google.com/', linkedin: 'https://linkedin.com/' },
    },
  },
  {
    chip: 'Tatuaje', url: 'aguja-negra',
    brief: {
      industry: 'tatuador', name: 'Aguja Negra', city: 'Sevilla', years: 6,
      goal: 'presupuesto', tone: 'audaz', hero: 'inmersivo', fonts: 'tecnica', shape: 'recto',
      theme: 'obsidiana', whatsapp: '+34600334455', email: 'hola@agujanegra.com',
      social: { instagram: 'https://instagram.com/' },
    },
  },
  {
    chip: 'Entrenador', url: 'metodo-raiz',
    brief: {
      industry: 'gimnasio', name: 'Método Raíz', city: 'Zaragoza', years: 5,
      goal: 'clientes', tone: 'audaz', hero: 'partido', fonts: 'moderna', shape: 'redondo',
      theme: 'grafito', whatsapp: '+34600998877', email: 'info@metodoraiz.es',
      address: 'Paseo Independencia 12',
      social: { instagram: 'https://instagram.com/', youtube: 'https://youtube.com/' },
    },
  },
  {
    chip: 'Floristería', url: 'flor-de-lunes',
    brief: {
      industry: 'floristeria', name: 'Flor de Lunes', city: 'A Coruña', years: 3,
      goal: 'catalogo', tone: 'cercano', hero: 'editorial', fonts: 'suave', shape: 'redondo',
      theme: 'rosaseco', whatsapp: '+34600221133', phone: '+34 981 22 44 10',
      address: 'Rúa Real 60',
      social: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/' },
    },
  },
];

(function demo() {
  const marco = $('#demo-marco');
  const chips = $('#demo-chips');
  const cargando = $('#demo-cargando');
  const url = $('#demo-url');
  const etiqueta = $('#demo-etiqueta');
  if (!marco || !chips) return;

  const cache = new Map();
  let actual = -1;

  DEMOS.forEach((d, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = d.chip;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => pintar(i));
    chips.appendChild(b);
  });

  function pintar(i) {
    if (i === actual) return;
    actual = i;
    $$('.chip', chips).forEach((c, n) => c.setAttribute('aria-pressed', String(n === i)));
    cargando.classList.remove('fuera');
    etiqueta.textContent = 'Generando…';

    // Un frame de respiro para que se vea la transición.
    setTimeout(() => {
      const d = DEMOS[i];
      let html = cache.get(i);
      if (!html) {
        const t0 = performance.now();
        html = generateSite(d.brief).html;
        cache.set(i, html);
        etiqueta.textContent = `Generada en ${Math.max(1, Math.round(performance.now() - t0))} ms`;
      } else {
        etiqueta.textContent = 'Generado en directo';
      }
      url.textContent = d.url;
      marco.srcdoc = html;
      marco.addEventListener('load', () => cargando.classList.add('fuera'), { once: true });
    }, 180);
  }

  pintar(0);
})();

/* ---------- Marquesina de sectores ---------- */
(function marquesina() {
  const pista = $('#marquesina');
  if (!pista) return;
  const nombres = INDUSTRIES.filter((i) => i.id !== 'otro').map((i) => `${i.icon} ${i.label}`);
  const html = nombres.map((n) => `<span>${n}</span>`).join('');
  pista.innerHTML = html + html; // duplicado para el bucle continuo
})();

/* ---------- Cifras ---------- */
(function cifras() {
  const cont = $('#cifras');
  if (!cont) return;
  cont.innerHTML = STATS.map((s) => `<div class="cifra"><b class="grad">${s.value}</b><span>${s.label}</span></div>`).join('');
})();

/* ---------- Muestrario de paletas ---------- */
(function paletas() {
  const cont = $('#paletas');
  if (!cont) return;
  cont.innerHTML = THEMES.slice(0, 5).map((t) => `
    <div class="paleta">
      <b>${t.name}</b>
      <div class="paleta-tiras">
        <i style="background:${t.bg}"></i><i style="background:${t.surface}"></i>
        <i style="background:${t.muted}"></i><i style="background:${t.accent}"></i>
        <i style="background:${t.text}"></i>
      </div>
    </div>`).join('');
})();

/* ---------- Precios ---------- */
(function precios() {
  const cont = $('#planes');
  const extras = $('#extras');
  if (!cont) return;
  let modo = 'compra';

  const pintar = () => {
    pintarPlanes(cont, modo);
    pintarExplicacion($('#modo-explica'), modo);
  };

  if (extras) {
    extras.innerHTML = ADDONS.map((a) => `<div class="extra rv">
      <b>${a.name}</b><span>${a.note}</span><span class="precio">${euro(a.price)}</span>
    </div>`).join('');
    initReveal('.extra.rv');
  }

  montarConmutador($('#conmutador'), (m) => { modo = m; pintar(); });
  pintar();
})();
