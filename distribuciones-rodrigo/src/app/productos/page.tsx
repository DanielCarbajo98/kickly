import { Suspense } from "react";
import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/cabecera-pagina";
import { Catalogo } from "@/components/catalogo";
import { Contenedor, Encabezado, Escalonado, Hijo, Seccion, Tarjeta, Boton } from "@/components/ui";
import { Iconos } from "@/components/brand";
import { empresa } from "@/content/site";

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description:
    "Catálogo de Distribuciones Rodrigo: pescados y mariscos, carnes, charcutería y quesos, verduras IQF, precocinados, panadería, helados, conservas y envases. Busque y filtre por familia, temperatura y canal.",
  alternates: { canonical: "/productos" },
};

const conservacion = [
  {
    icono: "copo" as const,
    titulo: "Congelado · −18 °C",
    texto:
      "Pescado, marisco, carne, verdura IQF, precocinados, masas y helado. El grueso de nuestro catálogo y de nuestra capacidad de almacenaje.",
  },
  {
    icono: "termometro" as const,
    titulo: "Refrigerado · 0-4 °C",
    texto:
      "Charcutería curada, cocida y loncheada, quesos, elaborados frescos y platos de V gama en frío positivo.",
  },
  {
    icono: "caja" as const,
    titulo: "Ambiente · Seco",
    texto:
      "Conservas, aceites, salsas, despensa y todo el material de envasado y desechables para reparto y take away.",
  },
];

export default function ProductosPagina() {
  return (
    <>
      <CabeceraPagina
        miga="Catálogo de productos"
        antetitulo="Catálogo"
        titulo="Más de 2.500 referencias, buscables al instante"
        entradilla="Filtre por familia, temperatura de conservación o canal, o escriba directamente lo que necesita. Es una selección representativa de nuestro surtido: si no encuentra una referencia, pídanosla."
      />

      <Suspense fallback={<div className="py-24 text-center" style={{ color: "var(--texto-3)" }}>Cargando catálogo…</div>}>
        <Catalogo />
      </Suspense>

      <Seccion alt>
        <Contenedor>
          <Encabezado
            antetitulo="Conservación"
            titulo="Tres temperaturas, un mismo reparto"
            entradilla="Nuestros vehículos bitemperatura permiten servir congelado, refrigerado y seco en la misma entrega, sin partir el pedido ni duplicar rutas."
            centrado
            className="mb-12"
          />
          <Escalonado className="grid gap-4 lg:grid-cols-3">
            {conservacion.map((c) => {
              const Icono = Iconos[c.icono];
              return (
                <Hijo key={c.titulo} as="article">
                  <Tarjeta className="h-full">
                    <span
                      className="mb-4 grid h-11 w-11 place-items-center rounded-xl"
                      style={{ background: "var(--frio-suave)", color: "var(--frio-fuerte)" }}
                    >
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

      <Seccion>
        <Contenedor estrecho className="text-center">
          <h2 className="text-[clamp(1.7rem,1.3rem+1.8vw,2.6rem)]">¿Necesita la tarifa completa?</h2>
          <p className="mx-auto mt-5 max-w-[54ch] leading-relaxed" style={{ color: "var(--texto-2)" }}>
            El catálogo publicado es una selección. La tarifa completa, con precios, escandallos y
            fichas técnicas, se entrega al dar de alta al cliente y se ajusta al surtido real de cada negocio.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Boton href="/contacto#alta" tamano="lg">Solicitar alta y tarifa</Boton>
            <Boton href={`tel:${empresa.telefonoLink}`} variante="linea" tamano="lg">
              Llamar al {empresa.telefono}
            </Boton>
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
