/** Página de precios: reutiliza el bloque de planes de la portada. */

import { $, $$, euro, initHeader, initReveal } from './ui.js';
import { PLANS, ADDONS } from './config.js';

initHeader();
initReveal();

const cont = $('#planes');
const extras = $('#extras');
const conm = $('#conmutador');
let modo = 'unico';

function pintar() {
  cont.innerHTML = PLANS.map((p) => {
    const precio = modo === 'unico' ? p.price : p.priceSub;
    const unidad = modo === 'unico'
      ? `${p.unit} · sin cuotas obligatorias`
      : 'al mes · mantenimiento y cambios incluidos';
    return `<article class="plan${p.highlight ? ' destacado' : ''}">
      ${p.badge ? `<span class="plan-insignia">${p.badge}</span>` : ''}
      <h3>${p.name}</h3>
      <p class="plan-kicker">${p.kicker}</p>
      <div class="plan-precio"><b>${euro(precio)}</b><i>${modo === 'unico' ? '' : '/mes'}</i></div>
      <p class="plan-unidad">${unidad}</p>
      <a class="btn ${p.highlight ? 'btn-luz' : 'btn-fantasma'} btn-bloque" href="./crear.html?plan=${p.id}">Empezar con ${p.name}</a>
      <ul>${p.features.map((f) => `<li${f.endsWith(':') ? ' class="grupo"' : ''}>${f}</li>`).join('')}</ul>
    </article>`;
  }).join('');
}

extras.innerHTML = ADDONS.map((a) => `<div class="extra">
  <b>${a.name}</b><span>${a.note}</span><span class="precio">${euro(a.price)}</span>
</div>`).join('');

const corredera = $('#corredera');
const botones = $$('button', conm);
const mover = () => {
  const activo = botones.find((b) => b.getAttribute('aria-pressed') === 'true');
  if (!activo) return;
  corredera.style.width = `${activo.offsetWidth}px`;
  corredera.style.transform = `translateX(${activo.offsetLeft - 4}px)`;
};
botones.forEach((b) => b.addEventListener('click', () => {
  botones.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
  modo = b.dataset.modo;
  mover(); pintar();
}));
requestAnimationFrame(mover);
addEventListener('resize', mover);

pintar();
