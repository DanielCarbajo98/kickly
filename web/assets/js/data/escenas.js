/**
 * Imaginería de las webs generadas.
 *
 * Un negocio recién dado de alta rara vez tiene fotos decentes, y poner la foto
 * de stock de OTRO restaurante en la web de un restaurante real es engañar a su
 * cliente. Así que cada hueco de imagen se compone aquí: un fondo derivado de la
 * paleta del sitio, un motivo de línea propio del sector y una geometría de
 * apoyo. Se ve intencionado, pesa poco y no depende de nadie.
 *
 * En cuanto el negocio aporta sus fotos (o se rellena `stock.js`), estas
 * composiciones se sustituyen automáticamente.
 *
 * Motivos dibujados sobre una caja de 100 × 100, sólo trazo.
 */

export const MOTIVOS = {
  taza: 'M25 38h40v20a20 20 0 0 1-40 0zM65 42a11 11 0 0 1 0 16M17 74h56M36 30q5-7 0-14M50 30q5-7 0-14',
  copa: 'M31 22h38l-4 22a15 15 0 0 1-30 0zM50 59v18M35 79h30',
  plato: 'M50 50m-27 0a27 27 0 1 0 54 0a27 27 0 1 0-54 0M50 50m-15 0a15 15 0 1 0 30 0a15 15 0 1 0-30 0',
  cubiertos: 'M32 18v28a6 6 0 0 0 12 0V18M38 18v20M38 46v36M66 18c-6 4-6 20 0 24v40',
  trigo: 'M50 84V34M50 42c-9-2-13-9-13-16 8 0 13 6 13 12M50 42c9-2 13-9 13-16-8 0-13 6-13 12M50 26c-9-2-13-9-13-16 8 0 13 6 13 12M50 26c9-2 13-9 13-16-8 0-13 6-13 12',
  tijeras: 'M30 76a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM70 76a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM36 62 70 16M64 62 30 16',
  peine: 'M22 34h56v12H22zM28 46v22M38 46v22M48 46v22M58 46v22M68 46v22',
  frasco: 'M42 14h16v12H42zM38 26h24v10l6 12v30a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V48l6-12z',
  pesa: 'M14 42v16M24 34v32M76 34v32M86 42v16M24 50h52',
  hoja: 'M50 82C22 64 26 28 50 18c24 10 28 46 0 64ZM50 78V30M50 46l-13-9M50 56l13-9',
  pulso: 'M50 80S22 62 22 42a14 14 0 0 1 28-6 14 14 0 0 1 28 6c0 4-1 8-3 11M56 58h10l5-9 7 18 5-9h9',
  diente: 'M30 22c-6 6-6 18-4 30 2 11 5 26 10 26s5-14 14-14 9 14 14 14 8-15 10-26c2-12 2-24-4-30-8-8-14 2-20 2s-12-10-20-2Z',
  huella: 'M50 80c-11 0-18-6-18-13 0-8 8-11 12-17 3-4 3-8 6-8s3 4 6 8c4 6 12 9 12 17 0 7-7 13-18 13ZM28 44a6 8 0 1 0 0-16 6 8 0 0 0 0 16ZM72 44a6 8 0 1 0 0-16 6 8 0 0 0 0 16ZM43 30a6 8 0 1 0 0-16 6 8 0 0 0 0 16ZM57 30a6 8 0 1 0 0-16 6 8 0 0 0 0 16Z',
  balanza: 'M50 14v66M32 80h36M22 32h56M50 22v10M22 32 12 56h20zM78 32 68 56h20zM12 56a10 10 0 0 0 20 0M68 56a10 10 0 0 0 20 0',
  edificio: 'M26 84V22h30v62M56 84V44h20v40M34 32h6M46 32h6M34 46h6M46 46h6M34 60h6M46 60h6M62 56h6M62 70h6M18 84h64',
  documento: 'M28 12h30l16 16v60H28zM58 12v16h16M38 46h26M38 58h26M38 70h16',
  camara: 'M18 32h16l6-10h20l6 10h16a6 6 0 0 1 6 6v34a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V38a6 6 0 0 1 6-6ZM50 72a17 17 0 1 0 0-34 17 17 0 0 0 0 34Z',
  nota: 'M38 74a9 7 0 1 0 0-14 9 7 0 0 0 0 14ZM76 66a9 7 0 1 0 0-14 9 7 0 0 0 0 14ZM47 67V22l38-8v44M47 34l38-8',
  aguja: 'M22 84 44 62M40 58l14 14M52 46 66 60l12-12a10 10 0 0 0 0-14L64 20a10 10 0 0 0-14 0L38 32ZM30 76l-8 8',
  bolsa: 'M24 34h52l4 50H20zM38 44V28a12 12 0 0 1 24 0v16',
  percha: 'M50 30a8 8 0 1 1 8 8c-5 0-8 3-8 8M50 46 16 72h68z',
  flor: 'M50 52a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM50 30c0-10 8-16 8-16s8 8 2 16M50 30c0-10-8-16-8-16s-8 8-2 16M61 41c9-4 18 0 18 0s-4 10-14 8M39 41c-9-4-18 0-18 0s4 10 14 8M50 52v34M50 68c-8 0-14-5-14-5s5-6 14-2M50 74c8 0 14-5 14-5s-5-6-14-2',
  llave: 'M62 20a16 16 0 0 0-8 28l-30 30 8 8 30-30a16 16 0 0 0 20-22l-11 11-9-9 11-11a16 16 0 0 0-11-5Z',
  casa: 'M18 48 50 20l32 28M26 44v40h48V44M42 84V60h16v24',
  libro: 'M50 26C40 18 26 18 16 20v54c10-2 24-2 34 6 10-8 24-8 34-6V20c-10-2-24-2-34 6ZM50 26v60',
  cama: 'M14 72V38M14 52h72V72M86 72V50a8 8 0 0 0-8-8H46v10M22 42h14a6 6 0 0 1 0 12H22a6 6 0 0 1 0-12ZM14 72v10M86 72v10',
  pincel: 'M64 18 82 36 52 66l-18-18zM34 48 22 72l24-12M28 80c-4 4-10 4-12 2 4-2 4-8 8-10',
  montana: 'M12 76 36 38l14 20 10-14 28 32zM32 30a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z',
  chispa: 'M50 14 58 40l26 8-26 8-8 26-8-26-26-8 26-8zM76 62l3 9 9 3-9 3-3 9-3-9-9-3 9-3z',
};

/** Cada sector usa varios motivos para que una galería no se repita. */
export const ESCENAS = {
  restaurante: ['plato', 'cubiertos', 'copa', 'trigo', 'taza', 'hoja'],
  cafeteria: ['taza', 'trigo', 'hoja', 'plato', 'libro', 'chispa'],
  peluqueria: ['tijeras', 'peine', 'frasco', 'chispa', 'flor', 'camara'],
  estetica: ['frasco', 'hoja', 'chispa', 'flor', 'pulso', 'tijeras'],
  gimnasio: ['pesa', 'pulso', 'montana', 'chispa', 'hoja', 'documento'],
  fisio: ['pulso', 'pesa', 'hoja', 'documento', 'huella', 'chispa'],
  dentista: ['diente', 'pulso', 'documento', 'chispa', 'camara', 'edificio'],
  abogado: ['balanza', 'documento', 'edificio', 'libro', 'llave', 'chispa'],
  inmobiliaria: ['casa', 'edificio', 'llave', 'documento', 'montana', 'camara'],
  fotografo: ['camara', 'montana', 'chispa', 'documento', 'flor', 'pincel'],
  tatuador: ['aguja', 'chispa', 'hoja', 'pincel', 'flor', 'camara'],
  tienda: ['bolsa', 'percha', 'chispa', 'flor', 'documento', 'hoja'],
  panaderia: ['trigo', 'taza', 'plato', 'hoja', 'bolsa', 'chispa'],
  agencia: ['chispa', 'documento', 'edificio', 'pincel', 'camara', 'libro'],
  academia: ['libro', 'documento', 'chispa', 'edificio', 'pincel', 'balanza'],
  hotel: ['cama', 'montana', 'taza', 'hoja', 'copa', 'casa'],
  taller: ['llave', 'chispa', 'documento', 'edificio', 'pesa', 'casa'],
  veterinario: ['huella', 'pulso', 'hoja', 'casa', 'frasco', 'chispa'],
  nutricion: ['hoja', 'plato', 'pulso', 'trigo', 'frasco', 'documento'],
  eventos: ['copa', 'flor', 'chispa', 'nota', 'camara', 'cubiertos'],
  reformas: ['casa', 'llave', 'edificio', 'pincel', 'documento', 'montana'],
  psicologia: ['pulso', 'hoja', 'libro', 'chispa', 'documento', 'flor'],
  musica: ['nota', 'chispa', 'camara', 'montana', 'pincel', 'copa'],
  limpieza: ['chispa', 'casa', 'frasco', 'edificio', 'hoja', 'documento'],
  floristeria: ['flor', 'hoja', 'bolsa', 'trigo', 'frasco', 'chispa'],
  otro: ['chispa', 'documento', 'edificio', 'hoja', 'casa', 'camara'],
};

/** Composiciones: cambian el encuadre para que dos imágenes seguidas no se parezcan. */
export const ENCUADRES = [
  { escala: 0.62, x: 0.50, y: 0.46, giro: 0, arcos: 'a' },
  { escala: 0.86, x: 0.72, y: 0.62, giro: -8, arcos: 'b' },
  { escala: 0.48, x: 0.30, y: 0.40, giro: 6, arcos: 'c' },
  { escala: 0.74, x: 0.44, y: 0.58, giro: -4, arcos: 'b' },
  { escala: 0.55, x: 0.66, y: 0.38, giro: 10, arcos: 'a' },
  { escala: 0.94, x: 0.36, y: 0.66, giro: 0, arcos: 'c' },
];

export function escenasDe(sectorId) {
  return ESCENAS[sectorId] || ESCENAS.otro;
}
