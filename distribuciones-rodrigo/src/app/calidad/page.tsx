import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/cabecera-pagina";
import { Boton, Comprobacion, Contenedor, Encabezado, Escalonado, Hijo, Seccion, Tarjeta } from "@/components/ui";
import { Iconos, type NombreIcono } from "@/components/brand";
import { BandaCTA } from "@/components/secciones-inicio";

export const metadata: Metadata = {
  title: "Calidad y seguridad alimentaria",
  description:
    "Control de temperatura continuo, trazabilidad por lote, sistema de autocontrol APPCC, transporte bitemperatura y documentación para colectividades y auditorías.",
  alternates: { canonical: "/calidad" },
};

const controles: { icono: NombreIcono; titulo: string; texto: string }[] = [
  { icono: "termometro", titulo: "Control de temperatura continuo", texto: "Registro en cámaras de frío negativo y positivo, control en recepción de cada entrada y verificación antes de la carga. Cualquier desviación se detecta y se actúa sobre ella." },
  { icono: "portapapeles", titulo: "Trazabilidad por lote", texto: "Cada referencia se identifica por lote desde que entra en el muelle hasta que se firma el albarán. Ante una alerta, localizamos el destino de un lote concreto en minutos." },
  { icono: "escudo", titulo: "Sistema de autocontrol (APPCC)", texto: "La operativa se apoya en un plan de análisis de peligros y puntos de control crítico aplicado a recepción, almacenaje, preparación, carga y transporte." },
  { icono: "personas", titulo: "Formación del equipo", texto: "El personal de almacén y reparto está formado en manipulación de alimentos y en los protocolos de frío e higiene aplicables a su puesto." },
  { icono: "camion", titulo: "Transporte a temperatura controlada", texto: "Vehículos bitemperatura preenfriados antes de cargar, con separación física entre frío negativo y positivo y control de temperatura en ruta." },
  { icono: "check", titulo: "Homologación de proveedores", texto: "Antes de incorporar una referencia comprobamos ficha técnica, registro sanitario y condiciones de suministro. Lo que no podemos documentar, no entra en tarifa." },
];

const tabla = [
  ["Recepción", "−18 / 0-4 °C", "Temperatura del producto, integridad del envase, lote y caducidad", "Hoja de recepción por entrada"],
  ["Almacenaje congelado", "−18 °C", "Temperatura de cámara y rotación de existencias", "Registro continuo de cámara"],
  ["Almacenaje refrigerado", "0-4 °C", "Temperatura de cámara y separación de familias", "Registro continuo de cámara"],
  ["Preparación de pedido", "Zona refrigerada", "Tiempo de exposición y asignación de lote", "Trazabilidad por línea de albarán"],
  ["Carga", "Vehículo preenfriado", "Temperatura de caja antes de cargar", "Control previo a la salida"],
  ["Transporte y entrega", "−18 / 0-4 °C", "Temperatura en ruta y condiciones de descarga", "Albarán de entrega"],
];

export default function CalidadPagina() {
  return (
    <>
      <CabeceraPagina
        miga="Calidad"
        antetitulo="Calidad y seguridad alimentaria"
        titulo="La temperatura no se corrige después"
        entradilla="En congelado y refrigerado, la calidad del producto que llega a su cocina se decide en el recorrido, no en el origen. Por eso controlamos, registramos y documentamos cada tramo de la cadena de frío."
      />

      <Seccion compacta>
        <Contenedor>
          <h2 className="sr-only">Controles de calidad</h2>
          <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {controles.map((c) => {
              const Icono = Iconos[c.icono];
              return (
                <Hijo key={c.titulo} as="article">
                  <Tarjeta interactiva className="h-full">
                    <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--frio-suave)", color: "var(--frio-fuerte)" }}>
                      <Icono className="h-[22px] w-[22px]" />
                    </span>
                    <h3 className="text-[1rem]">{c.titulo}</h3>
                    <p className="mt-2 text-[0.88rem]" style={{ color: "var(--texto-2)" }}>{c.texto}</p>
                  </Tarjeta>
                </Hijo>
              );
            })}
          </Escalonado>
        </Contenedor>
      </Seccion>

      <Seccion alt>
        <Contenedor>
          <Encabezado antetitulo="Cadena de frío" titulo="Dónde se controla y a qué temperatura" centrado className="mb-12" />
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--linea)", background: "var(--superficie)" }}>
            <table className="w-full min-w-[46rem] border-collapse text-[0.86rem]">
              <caption className="sr-only">Puntos de control de la cadena de frío</caption>
              <thead>
                <tr>
                  {["Etapa", "Temperatura objetivo", "Qué se controla", "Registro"].map((h) => (
                    <th key={h} className="dato border-b px-4 py-3 text-left text-[0.7rem] uppercase tracking-[0.08em]" style={{ borderColor: "var(--linea)", background: "var(--superficie-alt)", color: "var(--texto-2)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tabla.map((fila) => (
                  <tr key={fila[0]}>
                    {fila.map((celda, i) => (
                      <td key={i} className={`border-b px-4 py-3 ${i === 1 ? "dato" : ""}`} style={{ borderColor: "var(--linea)", color: i === 0 ? "var(--texto)" : "var(--texto-2)" }}>
                        {celda}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[0.8rem]" style={{ color: "var(--texto-3)" }}>
            Los valores son los objetivos de trabajo habituales para producto congelado y refrigerado.
            Las condiciones concretas de cada referencia figuran en su ficha técnica.
          </p>
        </Contenedor>
      </Seccion>

      <Seccion>
        <Contenedor estrecho>
          <Encabezado
            antetitulo="Documentación"
            titulo="Lo que entregamos a colectividades y auditorías"
            entradilla="Colegios, residencias, hospitales y empresas de restauración colectiva necesitan justificar cada género que entra en su cocina. Se lo damos hecho."
            className="mb-8"
          />
          <Comprobacion
            items={[
              "Fichas técnicas de las referencias servidas",
              "Información de alérgenos conforme al Reglamento (UE) 1169/2011",
              "Trazabilidad de lote asociada a albarán y fecha de entrega",
              "Documentación de proveedor y registro sanitario cuando se solicita",
            ]}
          />
          <div className="mt-8">
            <Boton href="/contacto">Solicitar documentación</Boton>
          </div>
        </Contenedor>
      </Seccion>

      {/* TODO CLIENTE: si la empresa tiene certificaciones (IFS Logistics, BRC,
          ISO 9001, ISO 22000, sello ecológico), añadir aquí una sección con los
          sellos. Es de lo que más pesa en licitaciones de colectividades. */}

      <BandaCTA />
    </>
  );
}
