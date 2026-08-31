/** Checkout: resumen del pedido, extras y salida a la pasarela de pago. */

import { $, $$, euro, initHeader, toast } from './ui.js';
import { PLANS, ADDONS, ORDER_ENDPOINT, DEMO_MODE, BRAND } from './config.js';
import { getIndustry } from './data/industries.js';
import { load, isReady, saveOrder } from './store.js';

initHeader();

const brief = load();
if (!isReady(brief)) {
  location.replace('./crear.html');
}

let plan = PLANS.find((p) => p.id === brief.plan) || PLANS.find((p) => p.highlight) || PLANS[0];
const extras = new Set(brief.addons || []);

/* ---------- Render ---------- */

function pintarPlanes() {
  $('#planes-check').innerHTML = PLANS.map((p) => `
    <label class="opcion">
      <input type="radio" name="plan" value="${p.id}"${p.id === plan.id ? ' checked' : ''}>
      <span class="op-nombre">${p.name} · ${euro(p.price)} <span style="color:var(--niebla-2);font-weight:400">${p.unit}</span></span>
      <span class="op-nota">${p.kicker}</span>
    </label>`).join('');
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

  const lineas = [{ label: `Plan ${plan.name}`, price: plan.price }];
  ADDONS.filter((a) => extras.has(a.id)).forEach((a) => lineas.push({ label: a.name, price: a.price }));

  $('#resumen-lineas').innerHTML = lineas.map((l) => `
    <div class="linea-resumen"><span>${l.label}</span><b>${euro(l.price)}</b></div>`).join('');

  const total = lineas.reduce((s, l) => s + l.price, 0);
  $('#resumen-total').textContent = euro(total);
  return total;
}

/* ---------- Eventos ---------- */

$('#planes-check').addEventListener('change', (e) => {
  if (e.target.name !== 'plan') return;
  plan = PLANS.find((p) => p.id === e.target.value) || plan;
  pintarResumen();
});

$('#extras-check').addEventListener('change', (e) => {
  if (e.target.type !== 'checkbox') return;
  if (e.target.checked) extras.add(e.target.value); else extras.delete(e.target.value);
  pintarResumen();
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

pintarPlanes();
pintarExtras();
pintarResumen();

if (DEMO_MODE) {
  const aviso = document.createElement('p');
  aviso.className = 'small muted center';
  aviso.style.marginTop = '10px';
  aviso.innerHTML = `Modo demostración: todavía no se cobra nada. Registramos tu pedido y te escribimos a mano desde <b>${BRAND.email}</b>.`;
  $('#btn-pagar').insertAdjacentElement('afterend', aviso);
}
