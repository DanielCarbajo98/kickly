import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/cabecera-pagina";
import {
  Aparece, Boton, Comprobacion, Contador, Contenedor, Encabezado,
  Escalonado, Etiqueta, Hijo, Seccion, Tarjeta,
} from "@/components/ui";
import { Iconos } from "@/components/brand";
import { BandaCTA } from "@/components/secciones-inicio";
import { grupo } from "@/content/site";

export const metadata: Metadata = {
  title: "Empresa",
  description:
    "Distribuciones Rodrigo, S.A.: empresa zaragozana de distribución de alimentación desde 1986. 10.000 m² de plataforma, 18.000 m³ de frío negativo y más de 70 profesionales.",
  alternates: { canonical: "/empresa" },
};

const hitos = [
  { ano: "1986", titulo: "Nace Distribuciones Rodrigo", texto: "Constituida el 2 de noviembre de 1986, la empresa arranca en Zaragoza como distribuidora de alimentación con un almacén y un reparto local." },
  { ano: "Años 90", titulo: "Especialización en frío", texto: "El congelado y el refrigerado se convierten en el eje del negocio: primeras cámaras propias y flota isotermo." },
  { ano: "Años 2000", titulo: "Crecimiento del grupo", texto: "Se incorporan Frigoríficos Bilbilitanos, en Calatayud, y San Lamberto 2000, ampliando cobertura y surtido en Aragón." },
  { ano: "Años 2010", titulo: "Plataforma de El Portazgo", texto: "La actividad se concentra en 10.000 m² con 18.000 m³ de frío negativo y 3.000 m³ de positivo." },
  { ano: "Hoy", titulo: "Más de 2.500 referencias", texto: "Un equipo de más de 70 profesionales y más de 40 vehículos sirven a restauración, colectividades, comercio y distribución." },
];

const valores = [
  { icono: "escudo" as const, titulo: "Fiabilidad antes que promesa", texto: "Preferimos comprometer una frecuencia que podemos cumplir a prometer una que no. En hostelería, una entrega fallada cuesta un servicio entero." },
  { icono: "termometro" as const, titulo: "El frío es innegociable", texto: "Invertimos en cámara, muelle y flota porque la temperatura es lo único que no se puede corregir después." },
  { icono: "personas" as const, titulo: "Trato directo", texto: "Cada cliente tiene un comercial con nombre y teléfono. Sin centralita, sin tickets, sin esperar respuesta al día siguiente." },
  { icono: "grafico" as const, titulo: "Eficiencia con sentido", texto: "Un uso eficiente de los recursos es lo que permite mantener precio y servicio a la vez, año tras año." },
];

export default function EmpresaPagina() {
  return (
    <>
      <CabeceraPagina
        miga="Empresa"
        antetitulo="Empresa"
        titulo="Cuarenta años moviendo alimentación en frío por Aragón"
        entradilla="Distribuciones Rodrigo, S.A. es una empresa zaragozana fundada en 1986. Hoy es uno de los operadores de referencia en distribución de alimentación a temperatura controlada de la comunidad."
      />

      <Seccion compacta>
        <Contenedor>
          <Escalonado className="grid grid-cols-2 overflow-hidden rounded-2xl border lg:grid-cols-4" style={{ borderColor: "var(--linea)" }} retardo={0.05}>
            {[
              { v: 2500, s: "+", e: "Referencias" },
              { v: 70, s: "+", e: "Profesionales" },
              { v: 40, s: "+", e: "Vehículos" },
              { v: 1986, s: "", e: "Desde" },
            ].map((c) => (
              <Hijo key={c.e} className="border-b border-r p-6 text-center last:border-r-0"
              style={{ borderColor: "var(--linea)" }}>
                <span className="dato block text-[clamp(1.7rem,1.2rem+1.6vw,2.4rem)] font-semibold leading-none">
                  {c.e === "Desde" ? "1986" : <Contador valor={c.v} sufijo={c.s} />}
                </span>
                <span className="mt-2.5 block text-[0.72rem]" style={{ color: "var(--texto-3)" }}>{c.e}</span>
              </Hijo>
            ))}
          </Escalonado>
        </Contenedor>
      </Seccion>

      <Seccion>
        <Contenedor>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Encabezado
                antetitulo="Quiénes somos"
                titulo="Una plataforma de frío al servicio de la cocina profesional"
                className="mb-6"
              />
              <div className="grid gap-4 leading-relaxed" style={{ color: "var(--texto-2)" }}>
                <p>
                  Distribuciones Rodrigo, S.A. está especializada en la venta y distribución de
                  productos alimenticios. Nuestra experiencia se basa en una mejora continuada en la
                  comercialización de productos de alimentación y en una logística que asegura la
                  cadena de suministro a temperatura controlada.
                </p>
                <p>
                  Contamos con más de 70 profesionales en las áreas comercial, administrativa y
                  logística, y con 18.000 m³ de frío negativo y 3.000 m³ de frío positivo en un
                  emplazamiento de 10.000 m² donde almacenamos más de 2.500 productos.
                </p>
                <p>
                  Servimos a distribuidores, empresas de catering, restaurantes y comercios de
                  alimentación de toda Aragón, con amplia variedad y calidad en todas las gamas de
                  producto, trabajando por y para nuestros clientes.
                </p>
              </div>
            </div>

            <Aparece>
              <div
                className="rounded-2xl border p-8"
                style={{ background: "var(--superficie)", borderColor: "var(--linea)" }}
              >
                <p className="antetitulo mb-5">Nuestra misión</p>
                <p className="text-[1.15rem] leading-relaxed" style={{ color: "var(--texto)" }}>
                  Trabajamos por ser cada día más eficientes, preocupándonos por que los productos que
                  vendemos alcancen la máxima satisfacción del cliente mediante una acertada gestión
                  comercial y un uso eficiente de los recursos.
                </p>
                <div className="mt-8 grid gap-3 border-t pt-6" style={{ borderColor: "var(--linea)" }}>
                  <Comprobacion
                    items={[
                      "18.000 m³ de cámara de frío negativo a −18 °C",
                      "3.000 m³ de frío positivo para refrigerado y charcutería",
                      "Muelles refrigerados para carga y descarga sin ruptura térmica",
                      "Trazabilidad integrada en recepción, picking y reparto",
                    ]}
                  />
                </div>
              </div>
            </Aparece>
          </div>
        </Contenedor>
      </Seccion>

      <Seccion alt>
        <Contenedor>
          <Encabezado
            antetitulo="Trayectoria"
            titulo="De un almacén local a la plataforma de El Portazgo"
            entradilla="La historia de la empresa es la de una especialización progresiva: cada etapa añadió capacidad de frío, cobertura y surtido."
            className="mb-12"
          />
          <ol className="relative mx-auto grid max-w-3xl gap-9 pl-10">
            <div className="rail absolute left-[7px] top-2 bottom-2 w-[2px]" aria-hidden />
            {hitos.map((h) => (
              <Aparece key={h.ano} as="li" className="relative">
                <span
                  className="absolute -left-10 top-1.5 block h-4 w-4 rounded-full border-[3px]"
                  style={{ background: "var(--fondo-alt)", borderColor: "var(--acento)" }}
                  aria-hidden
                />
                <span className="dato text-[0.95rem] font-semibold" style={{ color: "var(--acento-fuerte)" }}>{h.ano}</span>
                <h3 className="mt-1 text-[1.1rem]">{h.titulo}</h3>
                <p className="mt-2 max-w-[62ch] text-[0.92rem]" style={{ color: "var(--texto-2)" }}>{h.texto}</p>
              </Aparece>
            ))}
          </ol>
        </Contenedor>
      </Seccion>

      <Seccion>
        <Contenedor>
          <Encabezado antetitulo="Cómo trabajamos" titulo="Cuatro cosas que no negociamos" centrado className="mb-12" />
          <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v) => {
              const Icono = Iconos[v.icono];
              return (
                <Hijo key={v.titulo} as="article">
                  <Tarjeta interactiva className="h-full">
                    <span
                      className="mb-4 grid h-11 w-11 place-items-center rounded-xl"
                      style={{ background: "var(--acento-suave)", color: "var(--acento-fuerte)" }}
                    >
                      <Icono className="h-[22px] w-[22px]" />
                    </span>
                    <h3 className="text-[0.98rem]">{v.titulo}</h3>
                    <p className="mt-2 text-[0.86rem]" style={{ color: "var(--texto-2)" }}>{v.texto}</p>
                  </Tarjeta>
                </Hijo>
              );
            })}
          </Escalonado>
        </Contenedor>
      </Seccion>

      <Seccion alt>
        <Contenedor>
          <Encabezado
            antetitulo="Grupo"
            titulo="Empresas del grupo"
            entradilla="Tres sociedades que comparten plataforma, criterios de calidad y red comercial en Aragón."
            className="mb-12"
          />
          <Escalonado className="grid gap-4 lg:grid-cols-3">
            {grupo.map((g) => (
              <Hijo key={g.nombre} as="article">
                <Tarjeta className="h-full">
                  <h3 className="text-[1rem]">{g.nombre}</h3>
                  <p className="mt-2 text-[0.88rem]" style={{ color: "var(--texto-2)" }}>{g.texto}</p>
                  <span className="mt-auto pt-5"><Etiqueta>{g.lugar}</Etiqueta></span>
                </Tarjeta>
              </Hijo>
            ))}
          </Escalonado>
          <Aparece className="mt-10">
            <Boton href="/empleo" variante="linea">Ver oportunidades de empleo</Boton>
          </Aparece>
        </Contenedor>
      </Seccion>

      <BandaCTA />
    </>
  );
}
