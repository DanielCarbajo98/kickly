/* Contenido editorial: calendario y preguntas frecuentes. */
import C from "./config.mjs";

export const calendar = [
  ["5 oct 2026", "Pedro Sánchez anuncia la disolución de las Cortes y la convocatoria de elecciones generales."],
  ["6 oct", "Publicación del Real Decreto de convocatoria en el BOE. Se abre el plazo para solicitar el voto por correo."],
  ["12–19 oct", "Consulta del censo electoral y plazo de reclamaciones."],
  ["16 oct", "Fin del plazo para comunicar coaliciones electorales."],
  ["21–26 oct", "Presentación de candidaturas ante las juntas electorales."],
  ["31 oct", "Fin del plazo para que los españoles residentes en el extranjero (CERA) soliciten el voto."],
  ["31 oct – 4 nov", "Sorteo de los miembros de las mesas electorales en los ayuntamientos."],
  ["9 nov", "La Oficina del Censo Electoral empieza a enviar la documentación del voto por correo."],
  ["13 nov", "Comienza la campaña electoral (00:00 h)."],
  ["19 nov", "<b>Último día para solicitar el voto por correo.</b>"],
  ["21–26 nov", "Voto en urna en consulados y embajadas para los residentes en el extranjero."],
  ["24–28 nov", "Prohibido publicar o difundir encuestas electorales (art. 69.7 de la LOREG)."],
  ["25 nov", "<b>Último día para depositar el voto por correo</b> en las oficinas de Correos."],
  ["27 nov", "Fin de la campaña electoral (24:00 h)."],
  ["28 nov", "Jornada de reflexión."],
  ["29 nov", "<b>Día de las elecciones.</b> Los colegios abren de 9:00 a 20:00 h. Se eligen los 350 diputados del Congreso y los senadores de elección directa. Están llamados a votar 38.728.356 electores."],
  ["23 dic", "Constitución de las nuevas Cortes Generales."],
];

export const faqs = [
  ["¿Qué es este test de afinidad política?", `Es una herramienta gratuita que compara tus opiniones sobre los grandes temas de la campaña con las posiciones de los partidos que se presentan a las elecciones generales del 29 de noviembre de 2026. Al final ves tu porcentaje de afinidad con cada partido y en qué coincides y en qué discrepas con cada uno.`],
  ["¿El test es imparcial?", `Sí. ${C.brand} es un proyecto independiente, sin relación con ningún partido, y no acepta publicidad política. Todos los partidos se puntúan con la misma escala y la misma fórmula, y cada posición está justificada. El resultado depende solo de tus respuestas. Puedes leer todos los detalles en la <a href="/metodologia/">metodología</a>.`],
  ["¿Cómo se calcula el resultado?", `Para cada afirmación medimos la distancia entre tu respuesta y la de cada partido en una escala de cinco puntos. Las preguntas que marcas como importantes cuentan el doble y las que saltas no cuentan. La afinidad es el porcentaje de cercanía media.`],
  ["¿Guardáis mis respuestas o mis datos?", `No. El test se calcula en tu navegador y tus respuestas no se envían a ningún servidor. No pedimos email ni registro, y no creamos perfiles ideológicos. Más información en la <a href="/privacidad/">política de privacidad</a>.`],
  ["¿Qué partidos aparecen en el test?", `PSOE, PP, Vox, el Frente Amplio (Sumar, IU, Más Madrid y Comuns), Podemos, Se Acabó La Fiesta (SALF), ERC, Junts, EH Bildu, PNV y BNG. Los partidos autonómicos solo se presentan en sus comunidades.`],
  ["¿Cuándo son las elecciones generales de 2026?", `El domingo 29 de noviembre de 2026, de 9:00 a 20:00 horas. La campaña electoral va del 13 al 27 de noviembre y el 28 es la jornada de reflexión. Consulta el <a href="/calendario-electoral-29n/">calendario electoral completo</a>.`],
  ["¿Hasta cuándo puedo pedir el voto por correo?", `Hasta el 19 de noviembre de 2026, en cualquier oficina de Correos o en su web con certificado digital. Tendrás que enviar tu voto antes del 25 de noviembre. Tienes los detalles en nuestra <a href="/voto-por-correo-29n/">guía del voto por correo</a>.`],
  ["¿Es una encuesta o una recomendación de voto?", `Ninguna de las dos cosas. El test no recoge tus respuestas ni publica estadísticas de los usuarios, y el resultado no es una recomendación: es una ayuda para conocer qué defiende cada partido. En la sección de <a href="/encuestas/">encuestas</a> recopilamos los sondeos publicados por terceros, con su ficha técnica.`],
  ["¿Por qué hay publicidad?", `La publicidad comercial nos permite ofrecer el test gratis y sin depender de ningún partido ni institución. Nunca mostramos anuncios de partidos ni de campañas políticas, y la publicidad no influye en los resultados.`],
  ["¿El test es gratis?", `Sí. El test y tu resultado (tu partido más afín y tu % con cada partido) son gratis. De forma opcional puedes desbloquear el informe completo por ${C.payments?.priceLabel || "1,99 €"}: coincidencias y discrepancias con cada partido, brújula política, afinidad por temas y PDF. Pagar no cambia tu resultado.`],
];
