/**
 * Banco de fotografía por sector.
 *
 * Vacío a propósito. Mientras no haya fotos aquí, cada hueco se rellena con las
 * composiciones de `escenas.js`, que quedan bien y no engañan a nadie.
 *
 * PARA ACTIVAR FOTOS REALES
 * 1. Elige las imágenes en un banco con licencia comercial sin atribución
 *    (Unsplash y Pexels lo son; revisa siempre la licencia de cada foto y
 *    evita las que muestren personas reconocibles o marcas de terceros).
 * 2. DESCÁRGALAS y súbelas a `web/assets/img/stock/`. No enlaces al CDN del
 *    banco: añadirías una dependencia externa a la web de cada cliente y
 *    dejaría de ser cierto que no carga nada de terceros.
 * 3. Redimensiona a 1200 px de ancho y guarda en .webp (unos 60-90 KB cada una).
 * 4. Rellena las listas de abajo con las rutas. Con 6 fotos por familia sobra.
 *
 * Las claves son familias, no sectores: varios sectores comparten banco.
 */

export const STOCK = {
  hosteleria: [],   // restaurante, cafeteria, panaderia, eventos
  belleza: [],      // peluqueria, estetica
  salud: [],        // fisio, dentista, veterinario, nutricion, psicologia
  deporte: [],      // gimnasio
  profesional: [],  // abogado, agencia, inmobiliaria, academia
  creativo: [],     // fotografo, tatuador, musica
  comercio: [],     // tienda, floristeria
  oficios: [],      // taller, reformas, limpieza
  turismo: [],      // hotel
  general: [],      // otro
};

/** De qué familia bebe cada sector. */
const FAMILIA = {
  restaurante: 'hosteleria', cafeteria: 'hosteleria', panaderia: 'hosteleria', eventos: 'hosteleria',
  peluqueria: 'belleza', estetica: 'belleza',
  fisio: 'salud', dentista: 'salud', veterinario: 'salud', nutricion: 'salud', psicologia: 'salud',
  gimnasio: 'deporte',
  abogado: 'profesional', agencia: 'profesional', inmobiliaria: 'profesional', academia: 'profesional',
  fotografo: 'creativo', tatuador: 'creativo', musica: 'creativo',
  tienda: 'comercio', floristeria: 'comercio',
  taller: 'oficios', reformas: 'oficios', limpieza: 'oficios',
  hotel: 'turismo',
};

/** Devuelve la foto que toca, o cadena vacía si el banco está vacío. */
export function fotoDe(sectorId, indice) {
  const banco = STOCK[FAMILIA[sectorId] || 'general'] || [];
  if (!banco.length) return '';
  return banco[((indice % banco.length) + banco.length) % banco.length];
}

export function hayFotos(sectorId) {
  return (STOCK[FAMILIA[sectorId] || 'general'] || []).length > 0;
}
