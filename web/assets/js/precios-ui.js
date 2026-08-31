/**
 * Bloque de precios compartido por la portada y la página de precios.
 * Estaba duplicado en dos sitios y por eso se desincronizó: ahora vive aquí.
 */

import { $, $$, euro, initReveal } from './ui.js';
import { PLANS, MODOS, RENOVACION, FINANCIACION } from './config.js';

export function pintarPlanes(cont, modo) {
  const esCompra = modo === 'compra';
  cont.innerHTML = PLANS.map((p) => {
    const precio = esCompra ? p.price : p.priceSub;
    const financiable = esCompra && FINANCIACION.activa && p.price >= FINANCIACION.minimo;
    const pie = esCompra
      ? `Pago único. Después, ${euro(RENOVACION.precio)} ${RENOVACION.unidad} de mantenimiento opcional.`
      : 'Al mes, todo incluido. Sin permanencia.';
    return `<article class="plan${p.highlight ? ' destacado' : ''} rv">
      ${p.badge ? `<span class="plan-insignia">${p.badge}</span>` : ''}
      <h3>${p.name}</h3>
      <p class="plan-kicker">${p.kicker}</p>
      <div class="plan-precio"><b>${euro(precio)}</b><i>${esCompra ? '' : '/mes'}</i></div>
      <p class="plan-unidad">${pie}</p>
      ${financiable ? `<p class="plan-financia">o ${euro(Math.round(p.price / FINANCIACION.plazos))} × ${FINANCIACION.plazos} meses con ${FINANCIACION.proveedor}, sin intereses</p>` : ''}
      <a class="btn ${p.highlight ? 'btn-luz' : 'btn-fantasma'} btn-bloque" href="./crear.html?plan=${p.id}&modo=${modo}">Empezar con ${p.name}</a>
      <ul>${p.features.map((f) => `<li${f.endsWith(':') ? ' class="grupo"' : ''}>${f}</li>`).join('')}</ul>
    </article>`;
  }).join('');
  initReveal('.plan.rv');
}

export function pintarExplicacion(el, modo) {
  if (!el) return;
  const m = MODOS.find((x) => x.id === modo) || MODOS[0];
  el.innerHTML = `<b>${m.resumen}</b> ${m.detalle}`;
}

/** Conmutador Comprar / Suscripción con la corredera animada. */
export function montarConmutador(conm, alCambiar) {
  if (!conm) return;
  const corredera = $('.corredera', conm);
  const botones = $$('button', conm);
  const mover = () => {
    const activo = botones.find((b) => b.getAttribute('aria-pressed') === 'true');
    if (!activo || !corredera) return;
    corredera.style.width = `${activo.offsetWidth}px`;
    corredera.style.transform = `translateX(${activo.offsetLeft - 4}px)`;
  };
  botones.forEach((b) => b.addEventListener('click', () => {
    botones.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    mover();
    alCambiar(b.dataset.modo);
  }));
  requestAnimationFrame(mover);
  addEventListener('resize', mover);
  // Con las tipografías ya cargadas el ancho del botón cambia.
  if (document.fonts?.ready) document.fonts.ready.then(mover);
}
