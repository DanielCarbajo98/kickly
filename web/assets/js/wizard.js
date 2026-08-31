/** La encuesta: 7 pasos, autoguardado y validación amable. */

import { $, $$, initHeader } from './ui.js';
import { INDUSTRIES, getIndustry } from './data/industries.js';
import { THEMES, FONT_PAIRS, SHAPES, HERO_LAYOUTS, TONES } from './data/themes.js';
import { load, save, clear, EMPTY } from './store.js';

initHeader();

const TOTAL = 7;
let paso = 1;
let brief = load();

/* Un plan preseleccionado desde precios llega por la URL. */
const planUrl = new URLSearchParams(location.search).get('plan');
if (planUrl) brief.plan = planUrl;

const OBJETIVOS = [
  { id: 'reservas', icon: '📅', name: 'Que reserven', note: 'Mesa, cita o plaza. El botón de reserva manda en toda la web.' },
  { id: 'contacto', icon: '💬', name: 'Que me escriban', note: 'Consultas y primeros contactos. Formulario y WhatsApp muy visibles.' },
  { id: 'presupuesto', icon: '📄', name: 'Que pidan presupuesto', note: 'Trabajos a medida. Damos peso al método y a la confianza.' },
  { id: 'catalogo', icon: '🛍️', name: 'Que vean lo que vendo', note: 'Catálogo o carta por delante, con las fotos primero.' },
  { id: 'clientes', icon: '🎯', name: 'Captar clientes nuevos', note: 'Primera sesión gratis, proceso claro y prueba social.' },
];

/* ---------- Render de opciones ---------- */

function pintarSectores() {
  $('#sectores').innerHTML = INDUSTRIES.map((i) => `
    <label class="sector">
      <input type="radio" name="industry" value="${i.id}"${brief.industry === i.id ? ' checked' : ''}>
      <span class="ic" aria-hidden="true">${i.icon}</span>
      <span class="nb">${i.label}</span>
      <span class="gr">${i.group}</span>
    </label>`).join('');
}

function opcion(grupo, valor, marcado, icono, nombre, nota) {
  return `<label class="opcion">
    <input type="radio" name="${grupo}" value="${valor}"${marcado ? ' checked' : ''}>
    ${icono ? `<span class="op-icono" aria-hidden="true">${icono}</span>` : ''}
    <span class="op-nombre">${nombre}</span>
    ${nota ? `<span class="op-nota">${nota}</span>` : ''}
  </label>`;
}

function pintarOpciones() {
  $('#objetivos').innerHTML = OBJETIVOS
    .map((o) => opcion('goal', o.id, brief.goal === o.id, o.icon, o.name, o.note)).join('');
  $('#tonos').innerHTML = TONES
    .map((t) => opcion('tone', t.id, brief.tone === t.id, '', t.name, t.note)).join('');
  $('#fuentes').innerHTML = FONT_PAIRS
    .map((f) => opcion('fonts', f.id, brief.fonts === f.id, '', f.name, f.note)).join('');
  $('#portadas').innerHTML = HERO_LAYOUTS
    .map((h) => opcion('hero', h.id, brief.hero === h.id, '', h.name, h.note)).join('');
  $('#formas').innerHTML = SHAPES
    .map((s) => opcion('shape', s.id, brief.shape === s.id, '', s.name, '')).join('');

  const temaActual = brief.theme || getIndustry(brief.industry).theme;
  $('#temas').innerHTML = THEMES.map((t) => `
    <label class="opcion">
      <input type="radio" name="theme" value="${t.id}"${temaActual === t.id ? ' checked' : ''}>
      <span class="paleta-tiras" style="height:20px;border-radius:6px;margin-bottom:10px;display:flex;overflow:hidden">
        <i style="flex:1;background:${t.bg}"></i><i style="flex:1;background:${t.surface}"></i>
        <i style="flex:1;background:${t.accent}"></i><i style="flex:1;background:${t.text}"></i>
      </span>
      <span class="op-nombre">${t.name}</span>
      <span class="op-nota">${t.mood}</span>
    </label>`).join('');
}

/* ---------- Servicios ---------- */

function filaServicio(s = {}, i = 0) {
  return `<div class="servicio" data-i="${i}">
    <input class="input" type="text" placeholder="Nombre del servicio" data-campo="name" value="${(s.name || '').replace(/"/g, '&quot;')}">
    <input class="input" type="text" placeholder="Descripción corta" data-campo="desc" value="${(s.desc || '').replace(/"/g, '&quot;')}">
    <button class="quitar" type="button" aria-label="Quitar servicio">
      <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>`;
}

function pintarServicios() {
  const cont = $('#servicios');
  const lista = brief.services.length ? brief.services : getIndustry(brief.industry).services;
  brief.services = lista.map((s) => ({ ...s }));
  cont.innerHTML = brief.services.map(filaServicio).join('');
}

/* ---------- Horarios ---------- */

function filaHorario(h = {}, i = 0) {
  return `<div class="horario" data-i="${i}">
    <input class="input" type="text" placeholder="Lunes a viernes" data-campo="d" value="${(h.d || '').replace(/"/g, '&quot;')}">
    <input class="input" type="text" placeholder="09:00 – 20:00" data-campo="h" value="${(h.h || '').replace(/"/g, '&quot;')}">
    <button class="quitar" type="button" aria-label="Quitar franja">
      <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>`;
}

function pintarHorarios() {
  $('#horarios').innerHTML = brief.schedule.map(filaHorario).join('');
}

/* ---------- Redes ---------- */

const REDES = [
  ['instagram', 'Instagram', 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.5a6.3 6.3 0 1 0 0 12.6 6.3 6.3 0 0 0 0-12.6Zm0 10.4a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2Zm8-10.7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z'],
  ['facebook', 'Facebook', 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z'],
  ['tiktok', 'TikTok', 'M16.6 5.8a4.9 4.9 0 0 1-1.2-3.2h-3.3v13a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.6a6 6 0 1 0 5.2 6V9.4a8.2 8.2 0 0 0 4.7 1.5V7.6a4.9 4.9 0 0 1-3.5-1.8Z'],
  ['google', 'Ficha de Google', 'M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Zm-9.6 10c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22.2Zm-5.6-8a6 6 0 0 1 0-3.8V7.8H3.1a10 10 0 0 0 0 9l3.3-2.6ZM12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.8l3.3 2.6C7.2 7.9 9.4 5.8 12 5.8Z'],
  ['linkedin', 'LinkedIn', 'M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 21h4V9H3v12ZM10 21h4v-6.5c0-1.7 2-1.9 2 0V21h4v-7.9c0-4.3-4.6-4.1-6-2v-2h-4v12Z'],
  ['youtube', 'YouTube', 'M21.6 7.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 4 12 4 12 4s-4 0-6.8.3c-.4 0-1.3 0-2 .9-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.8 1.7.8 2.1.9 1.6.1 6.7.2 6.7.2s4 0 6.8-.3c.4 0 1.3 0 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5c0-1.6-.2-3.1-.2-3.1ZM9.9 14.6V8.9l5.2 2.9-5.2 2.8Z'],
  ['tripadvisor', 'Tripadvisor', 'M12 6c-2.6 0-5 .7-7 2H1l1.6 1.8A4.9 4.9 0 0 0 6 18.4a4.8 4.8 0 0 0 3.4-1.4l1.6 1.8 1.6-1.8a4.8 4.8 0 0 0 3.4 1.4 4.9 4.9 0 0 0 3.4-8.6L21 8h-2c-2-1.3-4.4-2-7-2Zm-6 10a2.8 2.8 0 1 1 0-5.6A2.8 2.8 0 0 1 6 16Zm12 0a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z'],
  ['spotify', 'Spotify', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 0 1-.3-1.5c4.8-1.1 8.9-.6 12.2 1.4.4.2.5.7.3 1Zm1.2-2.8a1 1 0 0 1-1.3.3c-3.4-2-8.6-2.7-12.6-1.5a1 1 0 1 1-.6-1.9c4.6-1.4 10.3-.6 14.2 1.8.4.3.6.9.3 1.3Zm.1-2.9C14 8.4 7.9 8.2 4.4 9.3a1.2 1.2 0 1 1-.7-2.3C7.8 5.8 14.5 6 18.9 8.6a1.2 1.2 0 0 1-1.2 2.1Z'],
];

function pintarRedes() {
  $('#redes').innerHTML = REDES.map(([id, label, path]) => `
    <div class="red">
      <span class="red-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg></span>
      <input type="url" data-red="${id}" placeholder="${label}" aria-label="${label}" value="${(brief.social[id] || '').replace(/"/g, '&quot;')}">
    </div>`).join('');
}

/* ---------- Campos simples ---------- */

function pintarCampos() {
  const map = {
    '#f-name': 'name', '#f-city': 'city', '#f-years': 'years', '#f-pitch': 'pitch',
    '#f-whatsapp': 'whatsapp', '#f-phone': 'phone', '#f-email': 'email',
    '#f-address': 'address', '#f-domain': 'domain',
  };
  Object.entries(map).forEach(([sel, key]) => { const el = $(sel); if (el) el.value = brief[key] || ''; });
  $('#f-logo').value = brief.images.logo || '';
  $('#f-heroimg').value = brief.images.hero || '';
}

/* ---------- Navegación ---------- */

function pintarPuntos() {
  $('#puntos').innerHTML = Array.from({ length: TOTAL }, (_, i) => {
    const n = i + 1;
    const cls = n === paso ? 'act' : (n < paso ? 'hecho' : '');
    return `<button class="punto-paso ${cls}" type="button" data-ir="${n}" aria-label="Ir al paso ${n}"></button>`;
  }).join('');
}

function irA(n) {
  paso = Math.max(1, Math.min(TOTAL, n));
  $$('.paso-form').forEach((s) => s.classList.toggle('activo', Number(s.dataset.paso) === paso));
  $('#progreso-txt').textContent = `Paso ${paso} de ${TOTAL}`;
  $('#progreso-relleno').style.width = `${(paso / TOTAL) * 100}%`;
  $('#atras').style.visibility = paso === 1 ? 'hidden' : 'visible';
  $('#siguiente').innerHTML = paso === TOTAL
    ? 'Generar mi web ✨'
    : 'Siguiente <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  pintarPuntos();
  scrollTo({ top: 0, behavior: 'smooth' });
  if (paso === 4) pintarServicios();
}

function validar() {
  if (paso === 1 && !brief.industry) {
    $('#err-industry').classList.remove('oculto');
    return false;
  }
  if (paso === 2 && !(brief.name || '').trim()) {
    $('#err-name').classList.remove('oculto');
    $('#f-name').classList.add('error');
    $('#f-name').focus();
    return false;
  }
  return true;
}

/* ---------- Guardado ---------- */

let guardadoTimer;
function guardar() {
  save(brief);
  const chip = $('#guardado');
  chip.classList.add('visible');
  clearTimeout(guardadoTimer);
  guardadoTimer = setTimeout(() => chip.classList.remove('visible'), 1600);
}

/* ---------- Eventos ---------- */

document.addEventListener('input', (e) => {
  const t = e.target;

  if (t.dataset.red) { brief.social[t.dataset.red] = t.value.trim(); guardar(); return; }

  const fila = t.closest('.servicio');
  if (fila && t.dataset.campo) {
    const i = Number(fila.dataset.i);
    brief.services[i] = brief.services[i] || {};
    brief.services[i][t.dataset.campo] = t.value;
    guardar(); return;
  }

  const hora = t.closest('.horario');
  if (hora && t.dataset.campo) {
    const i = Number(hora.dataset.i);
    brief.schedule[i] = brief.schedule[i] || {};
    brief.schedule[i][t.dataset.campo] = t.value;
    guardar(); return;
  }

  const simples = {
    'f-name': 'name', 'f-city': 'city', 'f-years': 'years', 'f-pitch': 'pitch',
    'f-whatsapp': 'whatsapp', 'f-phone': 'phone', 'f-email': 'email',
    'f-address': 'address', 'f-domain': 'domain',
  };
  if (simples[t.id]) {
    brief[simples[t.id]] = t.value;
    t.classList.remove('error');
    $('#err-name')?.classList.add('oculto');
    guardar(); return;
  }
  if (t.id === 'f-logo') { brief.images.logo = t.value.trim(); guardar(); }
  if (t.id === 'f-heroimg') { brief.images.hero = t.value.trim(); guardar(); }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.type !== 'radio') return;
  const campos = ['industry', 'goal', 'tone', 'theme', 'fonts', 'hero', 'shape'];
  if (!campos.includes(t.name)) return;

  brief[t.name] = t.value;

  if (t.name === 'industry') {
    $('#err-industry').classList.add('oculto');
    // Al cambiar de sector, refrescamos servicios y tema sugerido.
    const ind = getIndustry(t.value);
    brief.services = ind.services.map((s) => ({ ...s }));
    brief.theme = ind.theme;
    brief.sections = null;
    pintarOpciones();
  }
  guardar();
});

document.addEventListener('click', (e) => {
  const ir = e.target.closest('[data-ir]');
  if (ir) { irA(Number(ir.dataset.ir)); return; }

  const quitar = e.target.closest('.quitar');
  if (quitar) {
    const fila = quitar.closest('.servicio');
    if (fila) {
      brief.services.splice(Number(fila.dataset.i), 1);
      pintarServicios(); guardar(); return;
    }
    const hora = quitar.closest('.horario');
    if (hora) {
      brief.schedule.splice(Number(hora.dataset.i), 1);
      pintarHorarios(); guardar();
    }
  }
});

$('#add-servicio').addEventListener('click', () => {
  brief.services.push({ name: '', desc: '', price: '' });
  pintarServicios();
  $$('.servicio .input')[brief.services.length * 2 - 2]?.focus();
});

$('#add-horario').addEventListener('click', () => {
  brief.schedule.push({ d: '', h: '' });
  pintarHorarios();
});

$('#atras').addEventListener('click', () => irA(paso - 1));

$('#siguiente').addEventListener('click', () => {
  if (!validar()) return;
  if (paso < TOTAL) { irA(paso + 1); return; }
  generar();
});

$('#empezar-cero').addEventListener('click', () => {
  if (!confirm('¿Seguro? Se borrarán todas las respuestas de esta encuesta.')) return;
  clear();
  brief = JSON.parse(JSON.stringify(EMPTY));
  pintarSectores(); pintarOpciones(); pintarCampos(); pintarRedes();
  brief.services = []; brief.schedule = [];
  pintarServicios(); pintarHorarios();
  irA(1);
});

// Enter avanza (salvo en el área de texto).
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && !e.shiftKey) {
    e.preventDefault();
    $('#siguiente').click();
  }
});

/* ---------- Generación ---------- */

const TAREAS = [
  'Leyendo lo que nos has contado…',
  'Eligiendo composición para tu sector…',
  'Comprobando el contraste de la paleta…',
  'Escribiendo los textos en castellano…',
  'Montando el SEO local y los horarios…',
  'Ajustando el diseño para el móvil…',
  'Casi está…',
];

function generar() {
  guardar();
  const capa = $('#generando');
  const txt = $('#gen-tarea');
  capa.classList.add('visible');
  let i = 0;
  const t = setInterval(() => {
    i++;
    if (i >= TAREAS.length) {
      clearInterval(t);
      location.href = './preview.html';
      return;
    }
    txt.style.opacity = '0';
    setTimeout(() => { txt.textContent = TAREAS[i]; txt.style.opacity = '1'; }, 160);
  }, 420);
}

/* ---------- Arranque ---------- */

pintarSectores();
pintarOpciones();
pintarCampos();
pintarRedes();
pintarHorarios();
if (brief.industry) pintarServicios();
irA(1);
