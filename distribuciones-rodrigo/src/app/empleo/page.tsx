import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/cabecera-pagina";
import { Aparece, Comprobacion, Contenedor, Encabezado, Escalonado, Hijo, Seccion, Tarjeta } from "@/components/ui";
import { Formulario } from "@/components/formulario";
import { Iconos, type NombreIcono } from "@/components/brand";

export const metadata: Metadata = {
  title: "Trabaja con nosotros",
  description:
    "Ofertas y candidatura espontánea en Distribuciones Rodrigo: almacén, reparto, comercial y administración en Zaragoza.",
  alternates: { canonical: "/empleo" },
};

const perfiles: { icono: NombreIcono; t: string; d: string }[] = [
  { icono: "caja", t: "Almacén y preparación", d: "Preparación de pedido en cámara, carretilleros y personal de muelle." },
  { icono: "camion", t: "Reparto", d: "Conductores de reparto con carné C y experiencia en ruta de distribución." },
  { icono: "personas", t: "Comercial de zona", d: "Venta a hostelería y comercio con cartera y visita presencial." },
  { icono: "portapapeles", t: "Administración", d: "Gestión de pedidos, facturación, compras y atención al cliente." },
];

export default function EmpleoPagina() {
  return (
    <>
      <CabeceraPagina
        miga="Trabaja con nosotros"
        antetitulo="Trabaja con nosotros"
        titulo="Aquí la gente se queda"
        entradilla="Más de 70 personas en comercial, logística y administración. Buena parte del equipo lleva décadas en la casa, y esa continuidad es lo que sostiene el servicio."
      />

      <Seccion compacta>
        <Contenedor>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Encabezado antetitulo="Qué ofrecemos" titulo="Una empresa estable en un sector que no para" className="mb-8" />
              <Comprobacion
                items={[
                  "Empleo estable en una empresa con cuarenta años de actividad",
                  "Equipos pequeños donde se conoce a todo el mundo por su nombre",
                  "Formación en manipulación de alimentos y protocolos de frío",
                  "Instalaciones propias en el Polígono El Portazgo, con buen acceso",
                ]}
              />
            </div>
            <div>
              <Encabezado antetitulo="Perfiles habituales" titulo="Dónde solemos necesitar gente" className="mb-8" />
              <Escalonado className="grid gap-4 sm:grid-cols-2">
                {perfiles.map((p) => {
                  const Icono = Iconos[p.icono];
                  return (
                    <Hijo key={p.t} as="article">
                      <Tarjeta className="h-full">
                        <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg" style={{ background: "var(--frio-suave)", color: "var(--frio-fuerte)" }}>
                          <Icono className="h-5 w-5" />
                        </span>
                        <h3 className="text-[0.95rem]">{p.t}</h3>
                        <p className="mt-1.5 text-[0.84rem]" style={{ color: "var(--texto-2)" }}>{p.d}</p>
                      </Tarjeta>
                    </Hijo>
                  );
                })}
              </Escalonado>
            </div>
          </div>
        </Contenedor>
      </Seccion>

      <Seccion alt>
        <Contenedor estrecho>
          <Encabezado antetitulo="Candidatura" titulo="Envíenos su candidatura" entradilla="Guardamos las candidaturas espontáneas y las revisamos cuando abrimos proceso." className="mb-10" />
          <Aparece>
            <Formulario
              asunto="Candidatura espontánea desde la web"
              textoBoton="Enviar candidatura"
              campos={[
                { nombre: "nombre", etiqueta: "Nombre y apellidos", requerido: true },
                { nombre: "email", etiqueta: "Correo electrónico", tipo: "email", requerido: true },
                { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", requerido: true },
                { nombre: "area", etiqueta: "Área de interés", tipo: "select", requerido: true, opciones: ["Almacén y preparación", "Reparto y conducción", "Comercial", "Administración", "Otra"] },
                { nombre: "mensaje", etiqueta: "Presentación", tipo: "textarea", requerido: true, marcador: "Experiencia, disponibilidad, carnés y titulaciones relevantes…", ayuda: "Si quiere adjuntar el CV, indíquelo aquí y se lo pediremos por correo." },
              ]}
            />
          </Aparece>
        </Contenedor>
      </Seccion>
    </>
  );
}
