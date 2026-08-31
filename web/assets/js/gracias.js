/** Confirmación de pedido. */

import { $, initHeader, download, slugify, toast } from './ui.js';
import { loadOrder, load, isReady } from './store.js';
import { generateSite } from './generator.js';

initHeader();

const pedido = loadOrder();
if (pedido?.cliente) {
  $('#g-nombre').textContent = pedido.cliente.nombre.split(' ')[0];
  $('#g-email').textContent = pedido.cliente.email;
}

$('#g-descargar').addEventListener('click', () => {
  const brief = pedido?.brief || load();
  if (!isReady(brief)) { toast('No encontramos tu web en este navegador.'); return; }
  const { html } = generateSite(brief);
  download(`${slugify(brief.name)}.html`, html);
  toast('Descargada. Guárdala: es tuya pase lo que pase.');
});
