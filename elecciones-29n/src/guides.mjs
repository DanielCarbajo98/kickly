/* Guías prácticas de alto volumen de búsqueda (cómo votar, mesa electoral). */
import C from "./config.mjs";

const faqLd = (items) => ({ "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) });

export function guides({ layout, write, ctaBox, crumbs, crumbLd, ad }) {
  /* ---------- Cómo votar ---------- */
  const votarFaq = [
    ["¿Qué horario tienen los colegios electorales el 29N?", "Los colegios abren de 9:00 a 20:00 horas el domingo 29 de noviembre de 2026. Si estás en la cola a las 20:00, puedes votar."],
    ["¿Qué documento necesito para votar?", "El DNI, el pasaporte o el permiso de conducir, siempre el documento original y con fotografía. No sirven las fotocopias."],
    ["¿Cómo sé dónde me toca votar?", "Lo indica la tarjeta censal que envía la Oficina del Censo Electoral. También puedes consultarlo en la sede electrónica del INE o en tu ayuntamiento."],
    ["¿Cómo se vota al Senado?", "En la papeleta sepia puedes marcar con una cruz hasta tres candidatos de cualquier partido en la mayoría de provincias (menos en las islas, Ceuta y Melilla). Las listas son abiertas."],
    ["¿Qué es el voto en blanco?", "Es meter en la urna el sobre vacío o con una papeleta en blanco oficial. Cuenta como voto válido, pero no se asigna a ningún partido."],
    ["¿Tengo derecho a permiso en el trabajo para votar?", "Sí. Si tu horario coincide con el de votación, tienes derecho a un permiso retribuido de hasta cuatro horas."],
  ];
  const votar = `<div class="wrap">${crumbs([["Cómo votar el 29N"]])}
<div class="page-head"><h1>Cómo votar el 29N: guía completa de las elecciones generales 2026</h1><p>Horarios, documentación, papeletas y cómo se reparten los escaños, explicado de forma sencilla.</p></div>
<div class="prose" style="margin-top:18px">
<h2>Lo básico</h2>
<ul><li><b>Cuándo:</b> domingo 29 de noviembre de 2026, de 9:00 a 20:00 horas.</li><li><b>Quién vota:</b> los españoles mayores de edad inscritos en el censo electoral. Los extranjeros no votan en las generales.</li><li><b>Qué se elige:</b> los 350 diputados del Congreso y los senadores de elección directa.</li><li><b>Qué llevar:</b> DNI, pasaporte o carné de conducir originales y con foto.</li></ul>
<h2>Dónde me toca votar</h2>
<p>Te lo dice la <b>tarjeta censal</b> que llega a casa antes de las elecciones, con tu colegio, tu mesa y tu sección. Si no te llega, puedes consultarlo en la sede electrónica del INE (Oficina del Censo Electoral) o en tu ayuntamiento. No necesitas la tarjeta para votar: basta con tu documento de identidad.</p>
<h2>Las papeletas</h2>
<ul><li><b>Congreso (papeleta blanca):</b> listas cerradas y bloqueadas. Eliges un partido y no puedes tachar ni añadir nombres: cualquier marca anula el voto.</li><li><b>Senado (papeleta sepia):</b> listas abiertas. Marca con una cruz hasta 3 candidatos en las provincias peninsulares (el número es menor en islas, Ceuta y Melilla), del mismo o de distintos partidos.</li><li><b>Voto en blanco:</b> sobre vacío o papeleta en blanco oficial. Es válido, pero no suma escaños a nadie.</li><li><b>Voto nulo:</b> papeletas de partidos distintos en el mismo sobre, papeletas tachadas o con añadidos, o papeletas no oficiales.</li></ul>
${ad("content")}
<h2>Cómo se reparten los escaños</h2>
<p>Cada provincia es una circunscripción y elige un número fijo de diputados, con un mínimo de dos más un reparto según la población. Ceuta y Melilla eligen uno cada una. Los escaños se reparten con la <b>ley D'Hondt</b> entre las candidaturas que superan el <b>3% de los votos válidos</b> de la provincia. La mayoría absoluta en el Congreso es de <b>176 diputados</b>.</p>
<h2>Si no puedes ir a votar</h2>
<p>Puedes <a href="/voto-por-correo-29n/">votar por correo</a>: hay que solicitarlo antes del 19 de noviembre y entregar el voto antes del 25 de noviembre.</p>
<h2>Preguntas frecuentes</h2>
${votarFaq.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join("")}
<p class="note">Información orientativa basada en la Ley Orgánica del Régimen Electoral General. En caso de duda, consulta la <a href="https://www.infoelectoral.interior.gob.es/" rel="nofollow noopener" target="_blank">web oficial de Interior</a>.</p>
</div>${ctaBox("Antes de votar: ¿con qué partido coincides más?")}</div>`;
  write("como-votar-29n/index.html", layout({ path: "/como-votar-29n/", title: `Cómo votar el 29N: horario, documentación y papeletas | ${C.brand}`, description: "Guía para votar en las elecciones generales del 29 de noviembre de 2026: horario de 9 a 20 h, qué documento llevar, dónde votar, papeletas del Congreso y Senado y cómo se reparten los escaños.", body: votar, jsonld: [crumbLd([["Cómo votar el 29N", "/como-votar-29n/"]]), faqLd(votarFaq)] }));

  /* ---------- Mesa electoral ---------- */
  const mesaFaq = [
    ["¿Cuándo se sortean las mesas electorales del 29N?", "Los ayuntamientos celebran el sorteo entre el 31 de octubre y el 4 de noviembre de 2026. La notificación se entrega en los tres días siguientes."],
    ["¿Cuánto se cobra por estar en una mesa electoral el 29N?", "75 euros por la jornada para presidentes y vocales, según la Orden INT/650/2026. Los suplentes solo cobran si ocupan una vacante."],
    ["¿Cuánto tiempo tengo para alegar?", "Siete días naturales desde la notificación, ante la Junta Electoral de Zona. La junta resuelve en unos cinco días."],
    ["¿Qué pasa si no me presento a la mesa electoral?", "No acudir sin causa justificada es un delito electoral (art. 143 de la LOREG), castigado con prisión de tres meses a un año o multa de seis a veinticuatro meses."],
    ["¿Tengo permiso en el trabajo si me toca mesa?", "Sí: permiso retribuido toda la jornada del día de la votación, si es laborable, y una reducción de cinco horas en la jornada del día siguiente."],
  ];
  const mesa = `<div class="wrap">${crumbs([["Mesa electoral 29N"]])}
<div class="page-head"><h1>Mesa electoral 29N: cuánto se cobra, cómo librarse y qué pasa si no vas</h1><p>Todo lo que necesitas saber si te toca ser presidente, vocal o suplente en las elecciones generales del 29 de noviembre de 2026.</p></div>
<div class="prose" style="margin-top:18px">
<h2>Fechas clave</h2>
<ul><li><b>Sorteo:</b> del 31 de octubre al 4 de noviembre, en cada ayuntamiento.</li><li><b>Notificación:</b> en los 3 días siguientes al sorteo.</li><li><b>Alegaciones:</b> 7 días naturales desde la notificación, ante la Junta Electoral de Zona.</li><li><b>Día de la votación:</b> la mesa se constituye a las 8:00 del 29 de noviembre.</li></ul>
<h2>Cuánto se cobra</h2>
<p>Los presidentes y vocales reciben una dieta de <b>75 euros</b> por la jornada (Orden INT/650/2026). Los suplentes solo cobran si sustituyen a un titular.</p>
<h2>Motivos válidos para librarse</h2>
<ul><li>Ser mayor de 65 años (puedes renunciar).</li><li>Haber formado parte de una mesa al menos tres veces en los últimos diez años.</li><li>Enfermedad o incapacidad acreditadas con certificado médico, o embarazo a partir del sexto mes.</li><li>Cuidado de hijos menores de 14 años o de familiares dependientes, si lo acreditas.</li><li>Haberte trasladado a otra provincia o comunidad.</li><li>Ser candidato o pertenecer a una confesión religiosa cuyas normas lo impidan, entre otras causas que valora la Junta Electoral de Zona.</li></ul>
<p>Presentar alegaciones no te exime automáticamente: tienes que esperar la resolución de la junta. Si el impedimento surge después, comunícalo al menos 72 horas antes de la votación.</p>
${ad("content")}
<h2>Derechos laborales</h2>
<p>Si trabajas, tienes <b>permiso retribuido</b> el día de la votación y una <b>reducción de cinco horas</b> en tu jornada del día siguiente.</p>
<h2>Si no te presentas</h2>
<p>No acudir sin causa justificada es un <b>delito electoral</b> (art. 143 de la LOREG): prisión de tres meses a un año o multa de seis a veinticuatro meses.</p>
<h2>Preguntas frecuentes</h2>
${mesaFaq.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join("")}
<p class="note">Información orientativa. Consulta siempre tu notificación oficial y la Junta Electoral de Zona.</p>
</div>${ctaBox("¿Ya sabes a quién votar el 29N?")}</div>`;
  write("mesa-electoral-29n/index.html", layout({ path: "/mesa-electoral-29n/", title: `Mesa electoral 29N 2026: cuánto se cobra (75 €), alegaciones y multas | ${C.brand}`, description: "Si te toca mesa electoral el 29N: sorteo del 31 de octubre al 4 de noviembre, dieta de 75 euros, motivos para librarse, plazo de alegaciones de 7 días y sanciones por no acudir.", body: mesa, jsonld: [crumbLd([["Mesa electoral 29N", "/mesa-electoral-29n/"]]), faqLd(mesaFaq)] }));
}
