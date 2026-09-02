import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/cabecera-pagina";
import { Aparece, Contenedor, Encabezado, Escalonado, Hijo, Seccion, Tarjeta } from "@/components/ui";
import { Formulario } from "@/components/formulario";
import { dominio, empresa } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto y alta de cliente",
  description:
    "Teléfono 976 31 33 12, calidad@distribucionesrodrigo.com y formulario de alta de cliente. Polígono El Portazgo, Nave 73, 50011 Zaragoza.",
  alternates: { canonical: "/contacto" },
};

const negocioLocal = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Wholesaler"],
  name: empresa.razonSocial,
  url: `${dominio}/`,
  telephone: `+34 ${empresa.telefono}`,
  email: empresa.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: empresa.direccion.calle,
    addressLocality: empresa.direccion.ciudad,
    postalCode: empresa.direccion.cp,
    addressRegion: empresa.direccion.region,
    addressCountry: empresa.direccion.pais,
  },
};

const pasos = [
  { n: "01", t: "Nos escribe", d: "Con el formulario o por teléfono. Solo necesitamos saber qué tipo de negocio es y dónde está." },
  { n: "02", t: "Le visita el comercial de zona", d: "Revisa su surtido, le explica la frecuencia de ruta de su localidad y le prepara una tarifa ajustada a su volumen." },
  { n: "03", t: "Primer pedido", d: "Alta administrativa, condiciones de pago y entrada en la ruta. A partir de ahí, pedido por teléfono, correo o en la visita." },
];

export default function ContactoPagina() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(negocioLocal) }} />

      <CabeceraPagina
        miga="Contacto"
        antetitulo="Contacto"
        titulo="Hablemos de lo que necesita su cocina"
        entradilla="Llame, escriba o rellene el formulario de alta. Le asignamos comercial de zona y le confirmamos frecuencia de ruta y condiciones en la primera visita."
      />

      <Seccion compacta>
        <Contenedor>
          <h2 className="sr-only">Datos de contacto</h2>
          <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Teléfono", c: <a href={`tel:${empresa.telefonoLink}`} className="dato text-[1.2rem] font-semibold no-underline">{empresa.telefono}</a>, p: "Atención comercial y pedidos." },
              { t: "Correo electrónico", c: <a href={`mailto:${empresa.email}`} className="break-all font-semibold no-underline">{empresa.email}</a>, p: "Respondemos en menos de 24 h laborables." },
              { t: "Dirección", c: <span>{empresa.direccion.calle}<br />{empresa.direccion.cp} {empresa.direccion.ciudad}</span>, p: "", enlace: { href: empresa.mapa, texto: "Cómo llegar" } },
              { t: "Calatayud", c: <span>Frigoríficos Bilbilitanos, S.L.<br />Pol. Ind. La Charluca · 50300</span>, p: "", enlace: { href: "tel:+34976882246", texto: "976 88 22 46" } },
            ].map((b) => (
              <Hijo key={b.t}>
                <Tarjeta className="h-full">
                  <h3 className="dato mb-3 text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: "var(--texto-3)" }}>{b.t}</h3>
                  <div className="text-[0.92rem]" style={{ color: "var(--texto)" }}>{b.c}</div>
                  {b.p ? <p className="mt-2 text-[0.8rem]" style={{ color: "var(--texto-3)" }}>{b.p}</p> : null}
                  {b.enlace ? (
                    <a href={b.enlace.href} target={b.enlace.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-3 text-[0.82rem] font-semibold" style={{ color: "var(--acento-fuerte)" }}>
                      {b.enlace.texto}
                    </a>
                  ) : null}
                </Tarjeta>
              </Hijo>
            ))}
          </Escalonado>
        </Contenedor>
      </Seccion>

      <Seccion id="alta">
        <Contenedor>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Encabezado antetitulo="Alta de cliente" titulo="Empiece a comprar en tres pasos" entradilla="Somos mayoristas: trabajamos con negocios dados de alta y con datos fiscales. El proceso es corto y lo acompaña siempre una persona." className="mb-10" />
              <ol className="relative grid gap-8 pl-10">
                <div className="rail absolute left-[7px] top-2 bottom-2 w-[2px]" aria-hidden />
                {pasos.map((p) => (
                  <Aparece key={p.n} as="li" className="relative">
                    <span className="absolute -left-10 top-1.5 block h-4 w-4 rounded-full border-[3px]" style={{ background: "var(--fondo)", borderColor: "var(--acento)" }} aria-hidden />
                    <span className="dato text-[0.8rem] font-semibold" style={{ color: "var(--acento-fuerte)" }}>{p.n}</span>
                    <h3 className="mt-1 text-[1.05rem]">{p.t}</h3>
                    <p className="mt-2 max-w-[52ch] text-[0.9rem]" style={{ color: "var(--texto-2)" }}>{p.d}</p>
                  </Aparece>
                ))}
              </ol>
            </div>

            <Aparece>
              <div className="rounded-2xl border p-6 sm:p-8" style={{ background: "var(--superficie)", borderColor: "var(--linea)" }}>
                <h2 className="text-[1.35rem]">Solicitar alta de cliente</h2>
                <p className="mb-6 mt-1.5 text-[0.85rem]" style={{ color: "var(--texto-3)" }}>Sin compromiso. Le llamamos nosotros.</p>
                <Formulario
                  asunto="Solicitud de alta de cliente desde la web"
                  textoBoton="Enviar solicitud"
                  campos={[
                    { nombre: "negocio", etiqueta: "Nombre del negocio", requerido: true },
                    { nombre: "nombre", etiqueta: "Persona de contacto", requerido: true },
                    { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", requerido: true },
                    { nombre: "email", etiqueta: "Correo electrónico", tipo: "email", requerido: true },
                    { nombre: "tipo", etiqueta: "Tipo de negocio", tipo: "select", requerido: true, opciones: ["Bar o cafetería", "Restaurante", "Hotel", "Colectividades o catering", "Tienda de alimentación", "Carnicería o pescadería", "Distribuidor", "Otro"] },
                    { nombre: "localidad", etiqueta: "Localidad", requerido: true },
                    { nombre: "familias", etiqueta: "Familias que le interesan", marcador: "Congelado, charcutería, helado…", ayuda: "Opcional. Nos ayuda a preparar la tarifa antes de llamarle." },
                    { nombre: "mensaje", etiqueta: "Comentarios", tipo: "textarea", marcador: "Volúmenes aproximados, referencias concretas, horario de recepción de mercancía…" },
                  ]}
                />
                <p className="mt-4 text-[0.78rem]" style={{ color: "var(--texto-3)" }}>
                  También puede llamarnos al <a href={`tel:${empresa.telefonoLink}`} className="dato">{empresa.telefono}</a> en horario de oficina.
                </p>
              </div>
            </Aparece>
          </div>
        </Contenedor>
      </Seccion>

      <Seccion alt>
        <Contenedor>
          <Encabezado antetitulo="Dónde estamos" titulo="Plataforma de El Portazgo, Zaragoza" entradilla="Acceso directo desde la carretera de Logroño, con muelles de carga para vehículo pesado." className="mb-10" />
          <Aparece className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--linea)" }}>
            <iframe
              title="Mapa de la ubicación de Distribuciones Rodrigo en Zaragoza"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.9445%2C41.6520%2C-0.9145%2C41.6720&layer=mapnik"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[26rem] w-full border-0"
            />
          </Aparece>
          <p className="mt-3 text-[0.8rem]" style={{ color: "var(--texto-3)" }}>
            {/* TODO CLIENTE: ajustar el bbox a las coordenadas exactas de la nave. */}
            ¿Prefiere el navegador? <a href={empresa.mapa} target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a>.
          </p>
        </Contenedor>
      </Seccion>
    </>
  );
}
