/** Previsualización: mira tu web, remézclala y decide. */

import { $, $$, initHeader, toast, download, slugify } from './ui.js';
import { THEMES, FONT_PAIRS, SHAPES, HERO_LAYOUTS, TONES } from './data/themes.js';
import { getIndustry } from './data/industries.js';
import { load, save, isReady, encodeBrief, decodeBrief } from './store.js';
import { generateSite } from './generator.js';

initHeader();

/* Un brief compartido por enlace tiene prioridad sobre el guardado. */
const hash = location.hash.startsWith('#b=') ? location.hash.slice(3) : '';
let brief = hash ? (decodeBrief(hash) || load()) : load();

if (!isReady(brief)) {
  $('.pv').classList.add('oculto');
  $('.hd').classList.add('oculto');
  $('#pv-vacio').classList.remove('oculto');
} else {
  arrancar();
}

function arrancar() {
  const marco = $('#pv-marco');
  const iframe = $('#pv-iframe');
  const ind = getIndustry(brief.industry);
  if (!brief.theme) brief.theme = ind.theme;
  if (!brief.sections) brief.sections = [...ind.sections];

  $('#chip-negocio').innerHTML = `<span class="punto"></span> ${brief.name} · ${ind.label}`;

  const ORDEN_BASE = ['hero', 'trust', 'servicios', 'proceso', 'sobre', 'galeria',
    'opiniones', 'horario', 'faq', 'contacto'];

  const SECCIONES = {
    hero: 'Portada', trust: 'Motivos para elegirte', servicios: 'Servicios',
    proceso: 'Cómo trabajas', sobre: 'Sobre el negocio', galeria: 'Galería',
    opiniones: 'Opiniones', horario: 'Horario y mapa', faq: 'Preguntas frecuentes',
    contacto: 'Contacto',
  };

  const ACENTOS = ['#E8A33D', '#E2673A', '#B5502F', '#B34A5C', '#1F6B58',
    '#2456B8', '#6E8BFF', '#7C6BF2', '#B9F227', '#3BA88B'];

  /* ---------- Panel ---------- */

  function opcion(grupo, valor, marcado, nombre, nota) {
    return `<label class="opcion">
      <input type="radio" name="pv-${grupo}" value="${valor}"${marcado ? ' checked' : ''}>
      <span class="op-nombre">${nombre}</span>
      ${nota ? `<span class="op-nota">${nota}</span>` : ''}
    </label>`;
  }

  function pintarPanel() {
    $('#pv-temas').innerHTML = THEMES.map((t) => `
      <label class="opcion" style="padding:12px">
        <input type="radio" name="pv-theme" value="${t.id}"${brief.theme === t.id ? ' checked' : ''}>
        <span style="display:flex;height:18px;border-radius:5px;overflow:hidden;margin-bottom:9px">
          <i style="flex:1;background:${t.bg}"></i><i style="flex:1;background:${t.surface}"></i>
          <i style="flex:1;background:${t.accent}"></i><i style="flex:1;background:${t.text}"></i>
        </span>
        <span class="op-nombre" style="font-size:.9rem">${t.name}</span>
      </label>`).join('');

    $('#pv-acentos').innerHTML = ACENTOS.map((c) => `
      <label class="muestra" style="background:${c}" title="${c}">
        <input type="radio" name="pv-accent" value="${c}"${brief.accent === c ? ' checked' : ''}>
        <span class="sr">Acento ${c}</span>
      </label>`).join('')
      + `<label class="muestra" style="background:linear-gradient(135deg,#F2B33D,#DC6A4C,#7C6BF2)" title="El del tema">
          <input type="radio" name="pv-accent" value=""${!brief.accent ? ' checked' : ''}>
          <span class="sr">Usar el color del tema</span>
        </label>`;

    $('#pv-fuentes').innerHTML = FONT_PAIRS
      .map((f) => opcion('fonts', f.id, brief.fonts === f.id, f.name, f.note)).join('');
    $('#pv-portadas').innerHTML = HERO_LAYOUTS
      .map((h) => opcion('hero', h.id, brief.hero === h.id, h.name, '')).join('');
    $('#pv-formas').innerHTML = SHAPES
      .map((s) => opcion('shape', s.id, brief.shape === s.id, s.name, '')).join('');
    $('#pv-tonos').innerHTML = TONES
      .map((t) => opcion('tone', t.id, brief.tone === t.id, t.name, '')).join('');

    $('#pv-secciones').innerHTML = Object.entries(SECCIONES)
      .filter(([k]) => k !== 'hero')
      .map(([k, label]) => `<label class="extra-check" style="padding:10px 12px">
        <input type="checkbox" data-sec="${k}"${brief.sections.includes(k) ? ' checked' : ''}>
        <span class="txt"><b style="font-size:.9rem">${label}</b></span>
      </label>`).join('');
  }

  /* ---------- Render ---------- */

  let ultimoHtml = '';

  function render() {
    const { html } = generateSite(brief);
    ultimoHtml = html;
    iframe.srcdoc = html;
    const kb = Math.round(new Blob([html]).size / 1024);
    $('#pv-peso').textContent = `${kb} KB`;
    save(brief);
  }

  /* ---------- Eventos del panel ---------- */

  $('.pv-panel').addEventListener('change', (e) => {
    const t = e.target;
    if (t.type === 'radio' && t.name.startsWith('pv-')) {
      const campo = t.name.slice(3);
      brief[campo] = t.value;
      render();
      return;
    }
    if (t.dataset.sec) {
      const activas = new Set(brief.sections);
      if (t.checked) activas.add(t.dataset.sec); else activas.delete(t.dataset.sec);
      activas.add('hero');
      // El sector define el orden; lo que no contemple va al final, antes de contacto.
      const propio = getIndustry(brief.industry).sections;
      const resto = ORDEN_BASE.filter((s) => !propio.includes(s));
      const orden = [...propio.filter((s) => s !== 'contacto'), ...resto, 'contacto'];
      brief.sections = orden.filter((s, i) => orden.indexOf(s) === i && activas.has(s));
      render();
    }
  });

  /* ---------- Dispositivos ---------- */

  $$('.pv-dispositivos button').forEach((b) => b.addEventListener('click', () => {
    $$('.pv-dispositivos button').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    marco.classList.remove('movil', 'tablet');
    if (b.dataset.disp !== 'escritorio') marco.classList.add(b.dataset.disp);
  }));

  /* ---------- Acciones ---------- */

  $('#pv-descargar').addEventListener('click', () => {
    download(`${slugify(brief.name)}.html`, ultimoHtml);
    toast('Descargada. Es un único archivo: súbelo a cualquier hosting y ya funciona.');
  });

  $('#pv-enlace').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#b=${encodeBrief(brief)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast('Enlace copiado. Quien lo abra verá tu web tal cual está ahora.');
    } catch {
      location.hash = `b=${encodeBrief(brief)}`;
      toast('Enlace listo en la barra de direcciones: cópialo desde ahí.');
    }
  });

  $('#pv-nueva').addEventListener('click', () => {
    const w = open('', '_blank');
    if (!w) { toast('Tu navegador ha bloqueado la ventana emergente.'); return; }
    w.document.write(ultimoHtml);
    w.document.close();
  });

  $('#pv-sorpresa').addEventListener('click', () => {
    const al = (arr) => arr[Math.floor(Math.random() * arr.length)];
    brief.theme = al(THEMES).id;
    brief.fonts = al(FONT_PAIRS).id;
    brief.shape = al(SHAPES).id;
    brief.hero = al(HERO_LAYOUTS).id;
    brief.accent = '';
    pintarPanel();
    render();
    toast('Otra dirección. Dale otra vez si no te convence.');
  });

  pintarPanel();
  render();
}
