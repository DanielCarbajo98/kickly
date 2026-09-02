import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/cabecera-pagina";
import { Aparece, Comprobacion, Contenedor, Encabezado, Escalonado, Hijo, Seccion, Tarjeta } from "@/components/ui";
import { Iconos, type NombreIcono } from "@/components/brand";
import { BandaCTA } from "@/components/secciones-inicio";

export const metadata: Metadata = {
  title: "Servicios y logística",
  description:
    "Reparto con flota propia bitemperatura, rutas programadas por comarca en Aragón, almacenaje en frío negativo y positivo, pedido en dispositivo móvil y trazabilidad documentada.",
  alternates: { canonical: "/servicios" },
};

const servicios: { icono: NombreIcono; titulo: string; texto: string }[] = [
  { icono: "camion", titulo: "Reparto con flota propia", texto: "Más de 40 vehículos bitemperatura reparten en rutas fijas por comarca. Al ser flota propia, la frecuencia y el horario los decidimos nosotros, no un tercero." },
  { icono: "ruta", titulo: "Rutas programadas por zona", texto: "Cada población tiene su día y su franja. Usted sabe cuándo llega el género y puede planificar compra, cámara y producción." },
  { icono: "movil", titulo: "Pedido en dispositivo móvil", texto: "El comercial toma el pedido en su visita con terminal móvil. Entra en el sistema al momento y se prepara en el turno correspondiente, sin transcripciones ni errores." },
  { icono: "copo", titulo: "Almacenaje en frío para terceros", texto: "18.000 m³ de frío negativo y 3.000 m³ de positivo. Capacidad para dar soporte de almacenaje a distribuidores y operadores que lo necesiten." },
  { icono: "portapapeles", titulo: "Trazabilidad y documentación", texto: "Registro de lote en recepción, preparación y entrega, con la documentación que necesitan colectividades y auditorías de cliente." },
  { icono: "personas", titulo: "Asesoramiento comercial", texto: "El comercial de zona revisa surtido, propone alternativas de coste y avisa de campañas y producto de temporada antes de que le falte." },
];

const pasos = [
  { n: "01", t: "Pedido", d: "Por teléfono, por correo o en la visita del comercial, que lo registra en el momento con terminal móvil." },
  { n: "02", t: "Preparación", d: "Picking por referencia y lote en zona refrigerada, con control de temperatura durante todo el proceso." },
  { n: "03", t: "Carga", d: "Muelle refrigerado y vehículo bitemperatura preenfriado. Congelado y refrigerado viajan separados en el mismo camión." },
  { n: "04", t: "Entrega", d: "Ruta propia, en el día y la franja acordados, con albarán trazado y registro de temperatura." },
];

const faqs = [
  { p: "¿Con qué antelación hay que hacer el pedido?", r: "Depende de la ruta. Como norma general, el pedido recogido antes del cierre del día anterior entra en el reparto siguiente de su zona. Su comercial le confirmará el corte horario concreto de su población." },
  { p: "¿Se puede recibir congelado y refrigerado en la misma entrega?", r: "Sí. Los vehículos son bitemperatura: llevan compartimentos separados para frío negativo y positivo, de modo que no hay que partir el pedido ni esperar a dos repartos distintos." },
  { p: "¿Qué pasa si falta una referencia?", r: "El comercial de zona le avisa antes del reparto y propone una alternativa equivalente en calidad y coste. Preferimos una llamada a una sorpresa en el muelle a las siete de la mañana." },
  { p: "¿Hay pedido mínimo?", r: "Sí, y varía por ruta y frecuencia. Se fija en el alta de cliente junto al comercial, para que sea coherente con el volumen habitual del negocio." },
];

export default function ServiciosPagina() {
  return (
    <>
      <CabeceraPagina
        miga="Servicios"
        antetitulo="Servicios"
        titulo="El servicio como seña de identidad"
        entradilla="Aprovechamos las ventajas de nuestros más de 40 vehículos y de un sistema de distribución moderno y flexible para dar el mejor servicio a nuestros clientes."
      />

      <Seccion compacta>
        <Contenedor>
          <h2 className="sr-only">Qué incluye nuestro servicio</h2>
          <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((s) => {
              const Icono = Iconos[s.icono];
              return (
                <Hijo key={s.titulo} as="article">
                  <Tarjeta interactiva className="h-full">
                    <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--frio-suave)", color: "var(--frio-fuerte)" }}>
                      <Icono className="h-[22px] w-[22px]" />
                    </span>
                    <h3 className="text-[1rem]">{s.titulo}</h3>
                    <p className="mt-2 text-[0.88rem]" style={{ color: "var(--texto-2)" }}>{s.texto}</p>
                  </Tarjeta>
                </Hijo>
              );
            })}
          </Escalonado>
        </Contenedor>
      </Seccion>

      <Seccion alt>
        <Contenedor>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Encabezado
              antetitulo="Cómo funciona"
              titulo="De su pedido a su cámara, en cuatro pasos"
              entradilla="Un circuito corto y repetible. Menos manipulaciones significa menos incidencias y menos tiempo del producto fuera de rango."
            />
            <Escalonado className="grid gap-4 sm:grid-cols-2">
              {pasos.map((p) => (
                <Hijo key={p.n}>
                  <Tarjeta className="h-full">
                    <span className="dato text-[0.75rem] font-semibold" style={{ color: "var(--acento-fuerte)" }}>{p.n}</span>
                    <h3 className="mt-2 text-[1rem]">{p.t}</h3>
                    <p className="mt-2 text-[0.86rem]" style={{ color: "var(--texto-2)" }}>{p.d}</p>
                  </Tarjeta>
                </Hijo>
              ))}
            </Escalonado>
          </div>
        </Contenedor>
      </Seccion>

      <Seccion>
        <Contenedor>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Encabezado antetitulo="Cobertura" titulo="Aragón, con dos bases de reparto" className="mb-6" />
              <p className="mb-8 max-w-[52ch] leading-relaxed" style={{ color: "var(--texto-2)" }}>
                Repartimos desde la plataforma de Zaragoza y desde Frigoríficos Bilbilitanos, en
                Calatayud, lo que nos permite llegar con frecuencia real a comarcas que otros
                operadores solo cubren de forma esporádica.
              </p>
              <Comprobacion
                items={[
                  "Zaragoza y área metropolitana, con la mayor frecuencia de ruta",
                  "Comarca y Comunidad de Calatayud, desde la base bilbilitana",
                  "Resto de Aragón con rutas programadas según zona",
                  "Provincias limítrofes bajo acuerdo de volumen y frecuencia",
                ]}
              />
              <p className="mt-6 text-[0.82rem]" style={{ color: "var(--texto-3)" }}>
                Consulte la frecuencia exacta de su localidad: la programamos por ruta y se la
                confirmamos en el alta.
              </p>
            </div>

            <Aparece>
              <div className="border-t" style={{ borderColor: "var(--linea)" }}>
                <p className="antetitulo py-6">Operativa</p>
                {faqs.map((f) => (
                  <details key={f.p} className="group border-t" style={{ borderColor: "var(--linea)" }}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.95rem] font-semibold">
                      {f.p}
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-transform group-open:rotate-45" style={{ borderColor: "var(--linea)" }} aria-hidden>
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </span>
                    </summary>
                    <p className="pb-5 text-[0.88rem]" style={{ color: "var(--texto-2)" }}>{f.r}</p>
                  </details>
                ))}
              </div>
            </Aparece>
          </div>
        </Contenedor>
      </Seccion>

      <BandaCTA />
    </>
  );
}
