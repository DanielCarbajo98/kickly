/** Página de precios. Usa el mismo bloque que la portada. */

import { $, euro, initHeader, initReveal } from './ui.js';
import { ADDONS } from './config.js';
import { pintarPlanes, pintarExplicacion, montarConmutador } from './precios-ui.js';

initHeader();
initReveal();

const cont = $('#planes');
let modo = 'compra';

const pintar = () => {
  pintarPlanes(cont, modo);
  pintarExplicacion($('#modo-explica'), modo);
  document.body.dataset.modo = modo;
};

$('#extras').innerHTML = ADDONS.map((a) => `<div class="extra">
  <b>${a.name}</b><span>${a.note}</span><span class="precio">${euro(a.price)}</span>
</div>`).join('');

montarConmutador($('#conmutador'), (m) => { modo = m; pintar(); });
pintar();
