/* Textos legales: aviso legal, condiciones de venta, privacidad y cookies.
 * Revisados para LSSI-CE, RGPD/LOPDGDD, TRLGDCU y LOREG.
 * Los datos del titular salen de config.mjs (owner). */
import C from "./config.mjs";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
const crumbs = (n) => `<nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a> › ${esc(n)}</nav>`;
const o = C.owner;
const price = C.payments?.priceLabel || "1,99 €";
const titular = `<ul><li><b>Titular:</b> ${esc(o.name)}</li><li><b>NIF:</b> ${esc(o.nif)}</li><li><b>Domicilio:</b> ${esc(o.address)}</li><li><b>Email:</b> <a href="mailto:${o.email}">${esc(o.email)}</a></li><li><b>Sitio web:</b> ${esc(C.domain)}</li></ul>`;
const updated = () => `<p class="disclaimer">Última actualización: ${fmtDate(C.updated)}.</p>`;
const page = (h1, lead, inner) => `<div class="wrap">${crumbs(h1)}<div class="page-head"><h1>${h1}</h1>${lead ? `<p>${lead}</p>` : ""}</div><div class="prose" style="margin-top:16px">${inner}${updated()}</div></div>`;

export function legal() {
  return page("Aviso legal y condiciones de uso", "", `
<h2>1. Titular del sitio web</h2>
<p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:</p>
${titular}
<h2>2. Objeto y naturaleza del servicio</h2>
<p>${esc(C.brand)} ofrece un test de afinidad política con fines <b>informativos y educativos</b>. El test compara las opiniones del usuario con las posiciones públicas de los partidos que concurren a las elecciones generales del 29 de noviembre de 2026. El resultado básico es gratuito. De forma opcional se puede comprar un informe completo, regulado por las <a href="/condiciones/">condiciones de venta</a>.</p>
<ul>
<li><b>Independencia.</b> ${esc(C.brand)} es un proyecto independiente, sin vinculación con ningún partido político, candidatura, administración pública, Junta Electoral ni medio de comunicación. No es un sitio oficial.</li>
<li><b>No es una recomendación de voto.</b> El resultado no aconseja votar a ninguna opción política.</li>
<li><b>No es un sondeo electoral.</b> El test no es una encuesta en el sentido del artículo 69 de la Ley Orgánica 5/1985, del Régimen Electoral General (LOREG). No se recogen respuestas de los usuarios ni se publican resultados agregados ni estimaciones de voto propias.</li>
<li><b>Encuestas de terceros.</b> La sección de <a href="/encuestas/">encuestas</a> reproduce sondeos ya publicados por terceros, citando la entidad que los ha realizado, el medio y la ficha técnica disponible. Conforme al artículo 69.7 de la LOREG, esta información no se publica ni se actualiza durante los cinco días anteriores a la votación ni el día de la votación hasta el cierre de los colegios.</li>
<li><b>Posiciones de los partidos.</b> Son una interpretación razonada de información pública (programas, declaraciones y votaciones), con criterios homogéneos publicados en la <a href="/metodologia/">metodología</a>. Pueden contener errores u omisiones. Cualquier partido o persona puede solicitar una corrección en ${esc(o.email)}, y la revisaremos con la fuente.</li>
<li><b>Marcas de terceros.</b> Los nombres y siglas de los partidos se usan solo para identificarlos, con fines informativos y sin sugerir respaldo o asociación. No se reproducen sus logotipos.</li>
<li><b>Noticias.</b> Las piezas de la sección de <a href="/actualidad/">actualidad</a> son resúmenes de redacción propia sobre hechos públicos, con enlace a la fuente original. No se reproducen textos de terceros.</li>
</ul>
<h2>3. Condiciones de uso</h2>
<p>El acceso es libre y gratuito y no requiere registro. El usuario se compromete a hacer un uso lícito del sitio, a no dañarlo ni alterarlo y a no usarlo con fines fraudulentos. Tampoco puede extraer su contenido de forma masiva ni automatizada.</p>
<h2>4. Publicidad</h2>
<p>El sitio se financia con publicidad comercial servida por terceros, como Google AdSense, siempre identificada como «Publicidad», y con la venta opcional del informe completo. <b>No se admite publicidad política</b> en el sentido del Reglamento (UE) 2024/900. Ni la publicidad ni los pagos influyen en el contenido, en las posiciones de los partidos ni en los resultados del test.</p>
<h2>5. Propiedad intelectual e industrial</h2>
<p>Los textos, el diseño, el código, la base de datos de posiciones y la metodología pertenecen a su titular y están protegidos por la Ley de Propiedad Intelectual. Puedes citar y enlazar el contenido indicando la fuente. Para cualquier otro uso, especialmente comercial, necesitas autorización previa.</p>
<h2>6. Responsabilidad</h2>
<p>El titular procura que la información sea exacta y esté actualizada, pero no garantiza que esté libre de errores. No responde de las decisiones que el usuario tome basándose en ella. Recomendamos consultar los programas electorales oficiales. El titular no se responsabiliza del contenido de los sitios enlazados.</p>
<h2>7. Ley aplicable y jurisdicción</h2>
<p>Estas condiciones se rigen por la legislación española. Si el usuario es consumidor, serán competentes los juzgados y tribunales de su domicilio.</p>`);
}

export function conditions() {
  return page("Condiciones de venta del informe completo", `Condiciones que regulan la compra del informe completo de afinidad política (${price}, IVA incluido).`, `
<h2>1. Vendedor</h2>
${titular}
<h2>2. Qué compras</h2>
<p>El <b>informe completo de afinidad política</b> es un contenido digital que amplía el resultado gratuito del test. Incluye:</p>
<ul><li>tus coincidencias y discrepancias con cada partido, con la justificación de cada posición;</li><li>tu posición en la brújula política y en los ejes económico, social y territorial;</li><li>tu afinidad por temas;</li><li>la tabla completa de tus respuestas frente a todos los partidos;</li><li>la opción de descargarlo o imprimirlo en PDF, sin anuncios en el informe.</li></ul>
<p>El informe se genera <b>en tu propio navegador</b> a partir de tus respuestas, que no se envían a nuestros servidores. <b>Pagar no modifica el resultado</b>: muestra con más detalle el mismo cálculo que el resultado gratuito.</p>
<h2>3. Precio y pago</h2>
<p>El precio es de <b>${price}, IVA incluido</b>, en un pago único. No hay suscripción, cargos recurrentes ni gastos adicionales. El pago se realiza a través de Stripe Payments Europe, Ltd. con tarjeta, Apple Pay o Google Pay. Nosotros no vemos ni guardamos los datos de tu tarjeta. Recibirás el justificante de compra o la factura en el email que indiques en el pago.</p>
<h2>4. Proceso de compra y entrega</h2>
<ol><li>Pulsa «Desbloquear» en la página de tu resultado, después de aceptar expresamente la casilla sobre el acceso inmediato y la pérdida del derecho de desistimiento.</li><li>Completa el pago en la página segura de Stripe.</li><li>Al volver, el informe completo se desbloquea al instante en ese navegador.</li></ol>
<p>El contrato se celebra en español. El desbloqueo queda guardado en el navegador y el dispositivo en que compraste. Si cambias de dispositivo o borras los datos del navegador, escríbenos a <a href="mailto:${o.email}">${esc(o.email)}</a> con el email de la compra y te ayudaremos a recuperar el acceso.</p>
<h2>5. Derecho de desistimiento</h2>
<p>Como consumidor, en general tienes 14 días naturales para desistir de un contrato a distancia. Sin embargo, el <b>artículo 103.m) del Texto Refundido de la Ley General para la Defensa de los Consumidores y Usuarios</b> (TRLGDCU) excluye este derecho en el suministro de contenido digital sin soporte material cuya ejecución empieza con tu consentimiento expreso y tu conocimiento de que pierdes ese derecho.</p>
<p>Antes de pagar te pedimos ese consentimiento expreso mediante una casilla que tienes que marcar. Lo confirmamos en la página de pago y en el justificante de compra. Si no marcas la casilla, no se puede iniciar la compra.</p>
<h2>6. Garantía y problemas con el informe</h2>
<p>Si el informe no se desbloquea o no funciona correctamente, escríbenos a <a href="mailto:${o.email}">${esc(o.email)}</a>. Lo solucionaremos y, si no es posible, <b>te devolveremos el importe</b>, de acuerdo con la garantía de conformidad de los contenidos digitales (artículos 114 y siguientes del TRLGDCU). Si te hemos cobrado por error o dos veces, te lo devolvemos sin más trámite.</p>
<h2>7. Atención al cliente y reclamaciones</h2>
<p>Atendemos consultas y reclamaciones en <a href="mailto:${o.email}">${esc(o.email)}</a> y respondemos en un plazo máximo de un mes. También puedes acudir a los servicios de consumo de tu comunidad autónoma o ayuntamiento (OMIC) o al Sistema Arbitral de Consumo.</p>
<h2>8. Requisitos</h2>
<p>Para comprar debes ser mayor de edad o contar con la autorización de tus padres o tutores.</p>
<h2>9. Ley aplicable</h2>
<p>Estas condiciones se rigen por la legislación española, sin perjuicio de los derechos que te reconozca la ley de tu país de residencia como consumidor. Para cualquier controversia serán competentes los juzgados de tu domicilio.</p>`);
}

export function privacy() {
  return page("Política de privacidad", "Resumen: <b>tus respuestas al test y tu resultado no salen de tu dispositivo.</b> No tienes que registrarte y no vendemos ni cedemos datos. Si compras el informe, solo tratamos los datos imprescindibles para cobrar y emitir la factura.", `
<h2>1. Responsable del tratamiento</h2>
${titular}
<h2>2. Tus respuestas al test: no las tratamos</h2>
<p>Las opiniones políticas son una categoría especial de datos protegida por el artículo 9 del Reglamento General de Protección de Datos (RGPD). Por eso el test está diseñado para que <b>no las recojamos</b>:</p>
<ul>
<li>El cálculo del resultado y del informe completo se hace en tu navegador, con JavaScript. <b>Tus respuestas no se envían a nuestros servidores ni a terceros</b>, tampoco a la pasarela de pago.</li>
<li>Para que puedas continuar un test a medias o volver a tu resultado, tu progreso y tu último resultado se guardan en el almacenamiento local de tu navegador (localStorage). Solo están en tu dispositivo y puedes borrarlos cuando quieras.</li>
<li>Si compartes tu resultado, el enlace incluye tus respuestas codificadas después del símbolo «#». Esa parte de la dirección no llega a nuestro servidor. Compartirlo es decisión tuya: cualquiera con el enlace podrá ver ese resultado.</li>
<li>La imagen para compartir se genera en tu dispositivo. No la recibimos.</li>
<li>No creamos perfiles ideológicos ni vinculamos tus respuestas con tu identidad, con tus pagos ni con los anuncios.</li>
</ul>
<h2>3. Datos que sí tratamos</h2>
<table><thead><tr><th>Datos</th><th>Finalidad</th><th>Base jurídica</th><th>Conservación</th></tr></thead><tbody>
<tr><td>Dirección IP y datos técnicos de la conexión (registros del servidor)</td><td>Servir la web y mantener su seguridad</td><td>Interés legítimo (art. 6.1.f RGPD)</td><td>El plazo del proveedor de alojamiento, normalmente unas semanas</td></tr>
<tr><td>Compra del informe: email, nombre y país de facturación, importe, fecha e identificador de la compra (los datos de la tarjeta los trata Stripe, no nosotros)</td><td>Cobrar, entregar el informe, emitir la factura, atender incidencias y devoluciones</td><td>Ejecución del contrato (art. 6.1.b RGPD) y obligaciones legales fiscales y mercantiles (art. 6.1.c RGPD)</td><td>Mientras dure la relación y, después, 6 años (art. 30 del Código de Comercio) o el plazo de prescripción fiscal</td></tr>
<tr><td>Cookies y similares de publicidad y medición (Google)</td><td>Mostrar y medir anuncios (personalizados solo si lo aceptas) y obtener estadísticas de uso</td><td>Consentimiento (art. 6.1.a RGPD y art. 22.2 LSSI), revocable en cualquier momento</td><td>Ver la <a href="/cookies/">política de cookies</a></td></tr>
<tr><td>Correos que nos envíes</td><td>Responder consultas, correcciones o reclamaciones</td><td>Interés legítimo o ejecución del contrato</td><td>El tiempo necesario para atenderlos y para atender posibles responsabilidades</td></tr>
</tbody></table>
<p>La analítica, si está activa, solo mide eventos anónimos como «test iniciado», «test completado» o «compra realizada». Nunca recoge tus respuestas ni tu resultado.</p>
<h2>4. Destinatarios y transferencias internacionales</h2>
<ul>
<li><b>${C.hosting === "vercel" ? "Vercel Inc." : "Cloudflare, Inc."}</b>: alojamiento de la web, red de distribución y funciones de servidor que verifican el pago.</li>
<li><b>Stripe Payments Europe, Ltd.</b> (Irlanda): procesamiento del pago y emisión del justificante. Ver la <a href="https://stripe.com/es/privacy" rel="nofollow noopener" target="_blank">política de privacidad de Stripe</a>.</li>
<li><b>Google Ireland Ltd.</b>: publicidad (AdSense) y, en su caso, analítica. Ver <a href="https://policies.google.com/technologies/partner-sites" rel="nofollow noopener" target="_blank">cómo usa Google los datos de los sitios asociados</a>.</li>
<li>La Agencia Tributaria y otras administraciones, cuando lo exija la ley.</li>
</ul>
<p>Algunos de estos proveedores pueden transferir datos a EE. UU. al amparo del Marco de Privacidad de Datos UE-EE. UU. o de cláusulas contractuales tipo de la Comisión Europea. <b>No vendemos ni cedemos datos personales a nadie</b> y no enviamos comunicaciones comerciales.</p>
<h2>5. Tus derechos</h2>
<p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a <a href="mailto:${o.email}">${esc(o.email)}</a>. Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="nofollow noopener" target="_blank">aepd.es</a>).</p>
<h2>6. Menores</h2>
<p>El sitio está dirigido sobre todo a personas con derecho a voto. Cualquier persona puede consultarlo con fines informativos, pero la compra del informe está reservada a mayores de edad o a menores con autorización de sus padres o tutores. No recogemos conscientemente datos de menores de 14 años.</p>
<h2>7. Seguridad</h2>
<p>La web funciona íntegramente con HTTPS, y los pagos se procesan en la plataforma certificada PCI-DSS de Stripe.</p>`);
}

export function cookies() {
  return page("Política de cookies", "", `
<p>Usamos cookies y tecnologías similares de acuerdo con el artículo 22.2 de la LSSI y la Guía sobre el uso de las cookies de la AEPD. Las cookies no necesarias solo se instalan si das tu consentimiento en el banner que aparece al entrar, gestionado por una plataforma de consentimiento certificada por Google según el marco TCF de IAB Europe.</p>
<h2>Cookies y almacenamiento que usamos</h2>
<table><thead><tr><th>Nombre</th><th>Titular</th><th>Finalidad</th><th>Duración</th><th>¿Requiere consentimiento?</th></tr></thead><tbody>
<tr><td>q29-progress-v1</td><td>Propia (localStorage)</td><td>Guardar tu progreso para continuar un test a medias</td><td>Hasta terminar el test o borrarlo</td><td>No: es necesaria para el servicio que pides</td></tr>
<tr><td>q29-mine, q29-last</td><td>Propia (localStorage)</td><td>Recordar tu último resultado para poder volver a él</td><td>Hasta que lo borres</td><td>No: es necesaria para el servicio que pides</td></tr>
<tr><td>q29-unlock</td><td>Propia (localStorage)</td><td>Recordar que has comprado el informe completo</td><td>Hasta que lo borres</td><td>No: es necesaria para el servicio contratado</td></tr>
<tr><td>stickyClosed</td><td>Propia (sessionStorage)</td><td>Recordar que cerraste el anuncio fijo</td><td>Sesión</td><td>No</td></tr>
<tr><td>FCCDCF, FCNEC</td><td>Google</td><td>Guardar tus preferencias de consentimiento</td><td>Hasta 13 meses</td><td>No: es técnica</td></tr>
<tr><td>__gads, __gpi, __eoi, IDE</td><td>Google</td><td>Mostrar anuncios, limitar su frecuencia, medir su rendimiento y, si lo aceptas, personalizarlos</td><td>Hasta 13 meses</td><td>Sí</td></tr>
<tr><td>_ga, _ga_*</td><td>Google</td><td>Estadísticas anónimas de uso (solo si está activada)</td><td>Hasta 2 años</td><td>Sí</td></tr>
</tbody></table>
<p>Durante el pago, Stripe puede usar sus propias cookies en su dominio (checkout.stripe.com) para prevenir el fraude. Se rigen por la política de cookies de Stripe.</p>
<h2>Cómo gestionarlas</h2>
<p>Puedes cambiar tu elección en cualquier momento desde el enlace «Privacidad y cookies» del banner, o borrar las cookies y el almacenamiento local desde la configuración de tu navegador. Si rechazas las cookies de publicidad, seguirás viendo anuncios, pero no personalizados. Si borras el almacenamiento local perderás tu progreso y el desbloqueo del informe. En ese caso, escríbenos para recuperarlo.</p>`);
}
