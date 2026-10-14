/* ============================================================
 * ENCUESTAS publicadas por terceros (art. 69 LOREG: citar encuestadora,
 * medio, fechas de campo y muestra). Añade las nuevas arriba.
 * vote = % estimación de voto · seats = escaños (si un rango, punto medio).
 * Revisar cada ficha con la fuente antes de publicar.
 * ============================================================ */
import { parties } from "./data.mjs";

export const pollsUpdated = "2026-10-14";

const LR = { podemos: 1, "frente-amplio": 2, bildu: 3, bng: 4, erc: 5, psoe: 6, pnv: 7, junts: 8, pp: 9, vox: 10, salf: 11 };
export const pollParties = parties.map((p) => ({ id: p.id, short: p.short, color: p.color, lr: LR[p.id] ?? 6 }));

const mid = (a, b) => (a + b) / 2;

export const polls = [
  { pollster: "CIS (barómetro de octubre, estudio 3582)", media: "Centro de Investigaciones Sociológicas", fieldwork: "1–6 oct", sample: 5025, published: "2026-10-14",
    vote: { pp: 22.2, psoe: 34.0, vox: 17.1, "frente-amplio": 6.1, podemos: 3.1, salf: 1.8, erc: 3.0, junts: 1.1, bildu: 1.6, pnv: 0.6, bng: 0.9 }, seats: null,
    url: "https://www.cis.es/documents/d/guest/3582_estimacion-pdf" },
  { pollster: "SocioMétrica", media: "El Español", fieldwork: "10–11 oct", sample: 1000, published: "2026-10-12",
    vote: { pp: 32.6, psoe: 26.2, vox: 18.8, "frente-amplio": 4.9, podemos: 2.8, salf: 2.1 },
    seats: { pp: 141, psoe: 104, vox: 64, "frente-amplio": 5, podemos: 2, erc: 8, bildu: 7, junts: 6, pnv: 4 },
    url: "https://electomania.es/encuesta-sociometrica-12-oct-la-ventaja-de-pp-y-vox-sobre-el-actual-gobierno-supera-los-90-escanos/" },
  { pollster: "GESOP", media: "Prensa Ibérica", fieldwork: "6–8 oct", sample: 1000, published: "2026-10-12",
    vote: { pp: 28.7, psoe: 26.1, vox: 18.9, "frente-amplio": 8.0, podemos: 2.6 },
    seats: { pp: mid(121, 125), psoe: mid(108, 112), vox: mid(68, 72), "frente-amplio": mid(14, 17), podemos: 2 },
    url: "https://www.democrata.es/encuestas/elecciones-generales/encuesta-elecciones-generales-psoe-queda-26-puntos-pp-pero-vox-sostiene-mayoria-derecha-segun-gesop/" },
  { pollster: "GAD3", media: "ABC", fieldwork: "6–8 oct", sample: 1077, published: "2026-10-12",
    vote: { pp: 31.4, psoe: 26.4, vox: 18.2, "frente-amplio": 7.4, salf: 1.8 },
    seats: { pp: 133, psoe: 107, vox: 65, "frente-amplio": 10, podemos: 2, salf: 0 },
    url: "https://www.gad3.com/en/barometro-abc-estimacion-de-voto-nacional-octubre-2026/" },
  { pollster: "Sigma Dos", media: "El Mundo", fieldwork: "oct", sample: 2017, published: "2026-10-11",
    vote: { pp: 31.9, psoe: 25.3, vox: 19.1, "frente-amplio": 7.6, podemos: 3.1, salf: 0.8 },
    seats: { pp: 135, psoe: 103, vox: 68, "frente-amplio": 9, podemos: 2, salf: 0 },
    url: "https://www.sigmados.com/sondeo-de-arranque-de-campana-estimacion-de-voto-para-las-elecciones-generales-29-n/" },
  { pollster: "Target Point", media: "El Debate", fieldwork: "6–9 oct", sample: 1002, published: "2026-10-11",
    vote: { pp: 32.0, psoe: 25.9, vox: 18.7, "frente-amplio": 6.9, podemos: 3.4, salf: 1.3 },
    seats: { pp: mid(135, 137), psoe: mid(103, 105), vox: mid(64, 66), "frente-amplio": 10, podemos: 2 },
    url: "https://www.electografica.com/2026/10/encuesta-target-point-261011.html" },
  { pollster: "Hamalgama Métrica", media: "Vozpópuli", fieldwork: "5–8 oct", sample: 1000, published: "2026-10-11",
    vote: { pp: 33.4, psoe: 25.3, vox: 19.6 }, seats: { pp: 144, vox: 68 },
    url: "https://electomania.es/encuesta-h-metrica-11-oct-pp-y-vox-suman-212-escanos-y-el-53/" },
  { pollster: "40dB", media: "El País / Cadena SER", fieldwork: "7–8 oct", sample: 800, published: "2026-10-09",
    vote: { pp: 31.9, psoe: 28.1, vox: 18.9, "frente-amplio": 5.3, podemos: 2.3 },
    seats: { pp: 132, psoe: 112, vox: 66, "frente-amplio": 5, podemos: 2 },
    url: "https://www.electografica.com/2026/10/encuesta-40db-261009.html" },
  { pollster: "IMOP Insights", media: "El Confidencial", fieldwork: "5–7 oct", sample: 900, published: "2026-10-09",
    vote: { pp: 30.4, psoe: 26.5, vox: 19.0, "frente-amplio": 7.6, podemos: 2.3, salf: 1.9 },
    seats: { pp: 130, psoe: 110, vox: 70, "frente-amplio": 11, podemos: 1 },
    url: "https://electomania.es/encuesta-imop-9-oct-la-derecha-suma-201-escanos/" },
  { pollster: "DYM", media: "20minutos", fieldwork: "5–7 oct", sample: 1011, published: "2026-10-09",
    vote: { pp: 34.0, psoe: 28.2, vox: 18.2, "frente-amplio": 3.6, podemos: 2.6 },
    seats: { pp: mid(139, 143), psoe: mid(107, 111), vox: mid(61, 65), "frente-amplio": mid(3, 5), podemos: mid(1, 2) },
    url: "https://democrata.es/encuestas/elecciones-generales/encuesta-dym-octubre-2026-psoe-sube-pp-vox-mayoria" },
  { pollster: "NC Report", media: "La Razón", fieldwork: "1–6 oct", sample: 1000, published: "2026-10-08",
    vote: { pp: 34.1, psoe: 25.0, vox: 18.2, "frente-amplio": 5.3, podemos: 3.9, junts: 2.9 },
    seats: { pp: mid(146, 148), psoe: mid(98, 102), vox: mid(61, 64), "frente-amplio": mid(6, 8), podemos: mid(2, 4), junts: mid(10, 11) },
    url: "https://www.electografica.com/2026/10/encuesta-nc-report-261008.html" },
  { pollster: "40dB", media: "El País / Cadena SER", fieldwork: "25–28 sep", sample: 2000, published: "2026-10-05",
    vote: { pp: 31.6, psoe: 27.4, vox: 18.4, "frente-amplio": 5.6, podemos: 2.7, salf: 2.0 }, seats: null,
    url: "https://www.electografica.com/2026/10/encuesta-40db-261005.html" },
  { pollster: "SocioMétrica", media: "El Español", fieldwork: "1–3 oct", sample: 1000, published: "2026-10-04",
    vote: { pp: 33.4, psoe: 26.5, vox: 18.1, podemos: 3.1, salf: 2.2 },
    seats: { pp: 143, psoe: 106, vox: 62, "frente-amplio": 6, podemos: 2 },
    url: "https://www.elespanol.com/espana/politica/20261004/sondeo-expres-sanchez-disuelve-congreso-pp-hoy-diputados-psoe-vox-sumar/1003744408026_0.html" },
];
