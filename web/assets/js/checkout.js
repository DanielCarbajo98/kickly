/** Checkout: resumen del pedido, extras y salida a la pasarela de pago. */

import { $, $$, euro, initHeader, toast } from './ui.js';
import { PLANS, ADDONS, MODOS, RENOVACION, FINANCIACION, ORDER_ENDPOINT, DEMO_MODE, BRAND } from './config.js';
import { getIndustry } from './data/industries.js';
import { load, isReady, saveOrder } from './store.js';

initHeader();

const brief = load();
if (!isReady(brief)) {
  location.replace('./crear.html');
}

let plan = PLANS.find((p) => p.id === brief.plan) || PLANS.find((p) => p.highlight) || PLANS[0];
let modo = brief.modo === 'suscripcion' ? 'suscripcion' : 'compra';
let formaPago = 'tarjeta';
const extras = new Set(brief.addons || []);

const esCompra = () => modo === 'compra';
const precioPlan = () => (esCompra() ? plan.price : plan.priceSub);

/* ---------- Render ---------- */

function pintarModos() {
  $('#modo-check').innerHTML = MODOS.map((m) => `
    <label class="opcion">
      <input type="radio" name="modo" value="${m.id}"${m.id === modo ? ' checked' : ''}>
      <span class="op-nombre">${m.nombre}</span>
      <span class="op-nota">${m.resumen}</span>
    </label>`).join('');
  const m = MODOS.find((x) => x.id === modo);
  $('#modo-nota').textContent = m ? m.detalle : '';
}

function pintarPlanes() {
  $('#planes-check').innerHTML = PLANS.map((p) => {
    const precio = esCompra() ? p.price : p.priceSub;
    return `<label class="opcion">
      <input type="radio" name="plan" value="${p.id}"${p.id === plan.id ? ' checked' : ''}>
      <span class="op-nombre">${p.name} · ${euro(precio)} <span style="color:var(--niebla-2);font-weight:400">${esCompra() ? 'pago único' : 'al mes'}</span></span>
      <span class="op-nota">${p.kicker}</span>
    </label>`;
  }).join('');
}

function pintarFormasPago() {
  const opciones = esCompra()
    ? [
      { id: 'tarjeta', nombre: 'Tarjeta, de una vez', nota: `${euro(precioPlan() + totalExtras())} hoy. Pago seguro, no guardamos los datos de tu tarjeta.` },
      ...(FINANCIACION.activa && (precioPlan() + totalExtras()) >= FINANCIACION.minimo ? [{
        id: 'sequra',
        nombre: `En ${FINANCIACION.plazos} plazos con ${FINANCIACION.proveedor}`,
        nota: `${FINANCIACION.plazos} mensualidades de unos ${euro(Math.round((precioPlan() + totalExtras()) / FINANCIACION.plazos))}, sin intereses para ti. La web se publica igual desde el primer día.`,
      }] : []),
    ]
    : [
      { id: 'sepa', nombre: 'Domiciliación bancaria', nota: 'Te cobramos la cuota cada mes en tu cuenta. Cancelas cuando quieras.' },
      { id: 'tarjeta', nombre: 'Tarjeta recurrente', nota: 'La cuota se carga cada mes en tu tarjeta. Cancelas cuando quieras.' },
    ];
  if (!opciones.some((o) => o.id === formaPago)) formaPago = opciones[0].id;
  $('#pago-check').innerHTML = opciones.map((o) => `
    <label class="opcion">
      <input type="radio" name="pago" value="${o.id}"${o.id === formaPago ? ' checked' : ''}>
      <span class="op-nombre">${o.nombre}</span>
      <span class="op-nota">${o.nota}</span>
    </label>`).join('');
}

function totalExtras() {
  return ADDONS.filter((a) => extras.has(a.id)).reduce((s, a) => s + a.price, 0);
}

function pintarExtras() {
  $('#extras-check').innerHTML = ADDONS.map((a) => `
    <label class="extra-check">
      <input type="checkbox" value="${a.id}"${extras.has(a.id) ? ' checked' : ''}>
      <span class="txt"><b>${a.name}</b><span>${a.note}</span></span>
      <span class="pr">+${euro(a.price)}</span>
    </label>`).join('');
}

function pintarResumen() {
  const ind = getIndustry(brief.industry);
  $('#resumen-web').innerHTML = `
    <b>${brief.name}</b><br>
    <span class="muted">${ind.label}${brief.city ? ` · ${brief.city}` : ''}</span><br>
    <span class="muted">${(brief.sections || ind.sections).length} secciones · ${(brief.services || ind.services).length} servicios</span>`;

  const lineas = [{
    label: `Plan ${plan.name}`,
    price: precioPlan(),
    sufijo: esCompra() ? '' : '/mes',
  }];
  ADDONS.filter((a) => extras.has(a.id)).forEach((a) => lineas.push({ label: a.name, price: a.price, sufijo: '' }));

  $('#resumen-lineas').innerHTML = lineas.map((l) => `
    <div class="linea-resumen"><span>${l.label}</span><b>${euro(l.price)}${l.sufijo}</b></div>`).join('');

  const total = lineas.reduce((s, l) => s + l.price, 0);
  $('#resumen-total').textContent = euro(total) + (esCompra() ? '' : '/mes');
  $('#resumen-pie').innerHTML = esCompra()
    ? `Pago único. A partir del segundo año, ${euro(RENOVACION.precio)} ${RENOVACION.unidad} de mantenimiento, y es opcional.`
    : `Cuota mensual, todo incluido. Sin permanencia: cancelas cuando quieras.${totalExtras() ? ' Los extras se cobran una sola vez.' : ''}`;
  return total;
}

/* ---------- Eventos ---------- */

$('#modo-check').addEventListener('change', (e) => {
  if (e.target.name !== 'modo') return;
  modo = e.target.value;
  pintarModos(); pintarPlanes(); pintarFormasPago(); pintarResumen();
});

$('#planes-check').addEventListener('change', (e) => {
  if (e.target.name !== 'plan') return;
  plan = PLANS.find((p) => p.id === e.target.value) || plan;
  pintarFormasPago(); pintarResumen();
});

$('#pago-check').addEventListener('change', (e) => {
  if (e.target.name !== 'pago') return;
  formaPago = e.target.value;
});

$('#extras-check').addEventListener('change', (e) => {
  if (e.target.type !== 'checkbox') return;
  if (e.target.checked) extras.add(e.target.value); else extras.delete(e.target.value);
  pintarFormasPago(); pintarResumen();
});

/* Prellenamos lo que ya sabemos de la encuesta. */
$('#c-email').value = brief.email || '';
$('#c-tel').value = brief.whatsapp || brief.phone || '';
$('#c-fiscal').value = brief.legalName || brief.name || '';
$('#c-dominio').value = brief.domain || '';

/* ---------- Envío ---------- */

$('#pedido').addEventListener('submit', async (e) => {
  e.preventDefault();

  const campos = ['#c-nombre', '#c-email', '#c-tel'];
  let ok = true;
  campos.forEach((sel) => {
    const el = $(sel);
    const vacio = !el.value.trim();
    const emailMal = sel === '#c-email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim());
    el.classList.toggle('error', vacio || emailMal);
    if (vacio || emailMal) ok = false;
  });
  if (!$('#c-rgpd').checked) ok = false;

  if (!ok) {
    $('#err-pedido').classList.remove('oculto');
    $('.input.error')?.focus();
    return;
  }
  $('#err-pedido').classList.add('oculto');

  const total = pintarResumen();
  const pedido = {
    modo,
    formaPago,
    plan: plan.id,
    planName: plan.name,
    addons: [...extras],
    total,
    cliente: {
      nombre: $('#c-nombre').value.trim(),
      email: $('#c-email').value.trim(),
      telefono: $('#c-tel').value.trim(),
      nif: $('#c-nif').value.trim(),
      fiscal: $('#c-fiscal').value.trim(),
      dominio: $('#c-dominio').value.trim(),
      notas: $('#c-notas').value.trim(),
    },
    brief,
  };

  const btn = $('#btn-pagar');
  btn.disabled = true;
  btn.textContent = 'Enviando…';

  saveOrder(pedido);

  // 1) Si hay endpoint configurado, registramos el pedido.
  if (ORDER_ENDPOINT) {
    try {
      await fetch(ORDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
    } catch {
      // El pedido queda guardado en local; lo recuperamos desde la pantalla de gracias.
      toast('No hemos podido conectar. Guardamos tu pedido y te escribimos igualmente.');
    }
  }

  // 2) Si el plan tiene enlace de pago, allá vamos.
  if (plan.link && !DEMO_MODE) {
    location.href = plan.link;
    return;
  }

  // 3) Sin pasarela configurada todavía: confirmamos y contactamos a mano.
  location.href = './gracias.html';
});

/* Modo y plan pueden venir preseleccionados desde la página de precios. */
const params = new URLSearchParams(location.search);
if (params.get('modo') === 'suscripcion') modo = 'suscripcion';

pintarModos();
pintarPlanes();
pintarExtras();
pintarFormasPago();
pintarResumen();

if (DEMO_MODE) {
  const aviso = document.createElement('p');
  aviso.className = 'small muted center';
  aviso.style.marginTop = '10px';
  aviso.innerHTML = `Modo demostración: todavía no se cobra nada. Registramos tu pedido y te escribimos a mano desde <b>${BRAND.email}</b>.`;
  $('#btn-pagar').insertAdjacentElement('afterend', aviso);
}
