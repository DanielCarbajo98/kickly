"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import {
  Aparece, Boton, Comprobacion, Contador, Contenedor, Encabezado,
  Escalonado, Etiqueta, Hijo, Seccion, Tarjeta,
} from "./ui";
import { Iconos, type NombreIcono } from "./brand";
import { cadenaFrio, cifras, grupo, preguntas, segmentos, ventajas, empresa } from "@/content/site";
import { familias, productos } from "@/content/productos";

/* ------------------------------------------------------------------ */
/* Cifras                                                              */
/* ------------------------------------------------------------------ */

export function Cifras() {
  return (
    <Seccion compacta>
      <Contenedor>
        <Escalonado
          className="grid grid-cols-2 overflow-hidden rounded-2xl border sm:grid-cols-3 lg:grid-cols-6"
          style={{ borderColor: "var(--linea)" }}
          retardo={0.05}
        >
          {cifras.map((c) => (
            <Hijo
              key={c.etiqueta}
              className="border-b border-r p-6 text-center last:border-r-0"
              style={{ borderColor: "var(--linea)" }}
              // Los bordes se resuelven con el token de línea
            >
              <span
                className="dato block text-[clamp(1.7rem,1.2rem+1.6vw,2.5rem)] font-semibold leading-none"
                style={{ color: "var(--texto)" }}
              >
                <Contador valor={c.valor} sufijo={c.sufijo} />
              </span>
              <span className="mt-2.5 block text-[0.72rem]" style={{ color: "var(--texto-3)" }}>
                {c.etiqueta}
              </span>
            </Hijo>
          ))}
        </Escalonado>
      </Contenedor>
    </Seccion>
  );
}

/* ------------------------------------------------------------------ */
/* Familias de producto                                                */
/* ------------------------------------------------------------------ */

const iconoFamilia: Record<string, NombreIcono> = {
  pescados: "pez",
  carnes: "caja",
  charcuteria: "tienda",
  verduras: "hoja",
  precocinados: "cocinero",
  panaderia: "caja",
  helados: "copa",
  conservas: "caja",
  envases: "caja",
};

export function Familias() {
  return (
    <Seccion>
      <Contenedor>
        <Encabezado
          antetitulo="Catálogo"
          titulo="Toda la carta, un solo albarán"
          entradilla="Nueve familias que cubren la cocina completa, del pescado al envase de reparto. Busque por nombre, familia, temperatura o formato en el catálogo."
          className="mb-12"
        />

        <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {familias.map((f) => {
            const Icono = Iconos[iconoFamilia[f.id] ?? "caja"];
            const n = productos.filter((p) => p.familia === f.id).length;
            return (
              <Hijo key={f.id} as="article">
                <Link
                  href={`/productos?familia=${f.id}`}
                  className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border p-6 no-underline transition-transform duration-300 hover:-translate-y-1"
                  style={{ borderColor: "var(--linea)", minHeight: "13.5rem" }}
                >
                  <span
                    className="absolute inset-0 -z-10 transition-transform duration-500 group-hover:scale-[1.05]"
                    style={{
                      background: `linear-gradient(165deg, color-mix(in srgb, ${f.tinte} 15%, var(--superficie)), var(--superficie) 72%)`,
                    }}
                    aria-hidden
                  />
                  <Icono
                    className="absolute right-5 top-5 h-14 w-14 opacity-25 transition-opacity duration-300 group-hover:opacity-45"
                    style={{ color: f.tinte }}
                  />
                  <h3 className="text-[1.05rem]" style={{ fontVariationSettings: '"wdth" 105' }}>
                    {f.nombre}
                  </h3>
                  <p className="mt-1.5 text-[0.85rem]" style={{ color: "var(--texto-2)" }}>
                    {f.descripcion}
                  </p>
                  <span
                    className="dato mt-4 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold"
                    style={{ color: "var(--acento-fuerte)" }}
                  >
                    {n} referencias
                    <Iconos.flecha className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Hijo>
            );
          })}
        </Escalonado>

        <Aparece className="mt-10 flex flex-wrap gap-3" retardo={0.1}>
          <Boton href="/productos">Ver el catálogo completo</Boton>
          <Boton href="/contacto" variante="linea">Pedir la tarifa</Boton>
        </Aparece>
      </Contenedor>
    </Seccion>
  );
}

/* ------------------------------------------------------------------ */
/* Segmentos de cliente                                                */
/* ------------------------------------------------------------------ */

const iconoSegmento: Record<string, NombreIcono> = {
  restauracion: "cocinero",
  colectividades: "personas",
  comercio: "tienda",
  distribuidores: "camion",
};

export function Segmentos() {
  const [activo, setActivo] = useState(segmentos[0].id);
  const actual = segmentos.find((s) => s.id === activo)!;
  const Icono = Iconos[iconoSegmento[actual.id]];

  return (
    <Seccion alt>
      <Contenedor>
        <Encabezado
          antetitulo="A quién servimos"
          titulo="Cada canal tiene su ritmo. Y su ruta."
          entradilla="No se surte igual un restaurante que un colegio o una tienda de barrio. Adaptamos surtido, formato y frecuencia al tipo de negocio."
          className="mb-10"
        />

        <div role="tablist" aria-label="Tipos de cliente" className="mb-9 flex flex-wrap gap-2">
          {segmentos.map((s) => {
            const sel = s.id === activo;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={sel}
                aria-controls={`panel-${s.id}`}
                id={`tab-${s.id}`}
                onClick={() => setActivo(s.id)}
                className="relative rounded-full border px-4 py-2 text-[0.85rem] font-semibold transition-colors"
                style={{
                  borderColor: sel ? "transparent" : "var(--linea)",
                  color: sel ? "var(--invertido-texto)" : "var(--texto-2)",
                  background: sel ? "var(--color-marino-500)" : "transparent",
                }}
              >
                {sel ? (
                  <motion.span
                    layoutId="pestana-activa"
                    className="absolute inset-0 -z-10 rounded-full"
                    style={{ background: "var(--color-marino-500)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                ) : null}
                {s.nombre}
              </button>
            );
          })}
        </div>

        <motion.div
          key={actual.id}
          id={`panel-${actual.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${actual.id}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-10 lg:grid-cols-2 lg:gap-14"
        >
          <div>
            <span
              className="mb-5 grid h-12 w-12 place-items-center rounded-xl"
              style={{ background: "var(--acento-suave)", color: "var(--acento-fuerte)" }}
            >
              <Icono className="h-6 w-6" />
            </span>
            <h3 className="text-[clamp(1.5rem,1.2rem+1vw,2rem)]">{actual.nombre}</h3>
            <p className="mt-4 max-w-[52ch] leading-relaxed" style={{ color: "var(--texto-2)" }}>
              {actual.descripcion}
            </p>
            <Link
              href="/contacto#alta"
              className="mt-6 inline-flex items-center gap-2 text-[0.9rem] font-semibold no-underline"
              style={{ color: "var(--acento-fuerte)" }}
            >
              Hablar con un comercial <Iconos.flecha className="h-4 w-4" />
            </Link>
          </div>
          <Comprobacion items={actual.puntos} />
        </motion.div>
      </Contenedor>
    </Seccion>
  );
}

/* ------------------------------------------------------------------ */
/* Cadena de frío: el raíl se llena con el scroll                       */
/* ------------------------------------------------------------------ */

export function CadenaFrio() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 55%"],
  });
  const altura = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <Seccion>
      <Contenedor>
        <Encabezado
          antetitulo="Cadena de frío"
          titulo="Cinco pasos sin romper la temperatura"
          entradilla="El producto congelado no perdona una hora fuera de rango. Por eso controlamos y registramos todo el recorrido, desde el muelle de recepción hasta la puerta de su cámara."
          centrado
          className="mb-14"
        />

        <div ref={ref} className="relative mx-auto max-w-3xl pl-10 sm:pl-14">
          {/* Raíl base y raíl que se llena */}
          <div
            className="absolute left-[13px] top-3 bottom-3 w-[2px] sm:left-[21px]"
            style={{ background: "var(--linea)" }}
            aria-hidden
          />
          <motion.div
            className="absolute left-[13px] top-3 w-[2px] origin-top sm:left-[21px]"
            style={{
              height: altura,
              background: "linear-gradient(var(--frio), var(--acento))",
            }}
            aria-hidden
          />

          <ol className="grid gap-9">
            {cadenaFrio.map((p, i) => (
              <motion.li
                key={p.titulo}
                className="relative"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="absolute top-1 grid h-7 w-7 place-items-center rounded-full border text-[0.65rem] font-bold -left-10 sm:-left-14"
                  style={{
                    background: "var(--superficie)",
                    borderColor: "var(--linea)",
                    color: "var(--texto-3)",
                    fontFamily: "var(--font-mono)",
                  }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[1.15rem]">{p.titulo}</h3>
                  <Etiqueta tono="frio" className="dato">{p.temperatura}</Etiqueta>
                </div>
                <p className="mt-2 max-w-[60ch] text-[0.92rem]" style={{ color: "var(--texto-2)" }}>
                  {p.descripcion}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        <Aparece className="mt-12 text-center">
          <Link
            href="/calidad"
            className="inline-flex items-center gap-2 text-[0.9rem] font-semibold no-underline"
            style={{ color: "var(--acento-fuerte)" }}
          >
            Cómo garantizamos la seguridad alimentaria <Iconos.flecha className="h-4 w-4" />
          </Link>
        </Aparece>
      </Contenedor>
    </Seccion>
  );
}

/* ------------------------------------------------------------------ */
/* Ventajas                                                            */
/* ------------------------------------------------------------------ */

export function Ventajas() {
  return (
    <Seccion alt>
      <Contenedor>
        <Encabezado
          antetitulo="Por qué Rodrigo"
          titulo="Cuarenta años afinando lo mismo: servir bien"
          entradilla="Trabajamos por ser cada día más eficientes, cuidando que los productos que vendemos alcancen la máxima satisfacción del cliente mediante una acertada gestión comercial y un uso eficiente de los recursos."
          className="mb-12"
        />
        <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ventajas.map((v) => {
            const Icono = Iconos[v.icono as NombreIcono] ?? Iconos.caja;
            return (
              <Hijo key={v.titulo} as="article">
                <Tarjeta interactiva className="h-full">
                  <span
                    className="mb-4 grid h-11 w-11 place-items-center rounded-xl"
                    style={{ background: "var(--frio-suave)", color: "var(--frio-fuerte)" }}
                  >
                    <Icono className="h-[22px] w-[22px]" />
                  </span>
                  <h3 className="text-[1rem]" style={{ fontVariationSettings: '"wdth" 105' }}>
                    {v.titulo}
                  </h3>
                  <p className="mt-2 text-[0.88rem]" style={{ color: "var(--texto-2)" }}>
                    {v.texto}
                  </p>
                </Tarjeta>
              </Hijo>
            );
          })}
        </Escalonado>
      </Contenedor>
    </Seccion>
  );
}

/* ------------------------------------------------------------------ */
/* Grupo, claim y preguntas                                            */
/* ------------------------------------------------------------------ */

export function Grupo() {
  return (
    <Seccion>
      <Contenedor>
        <Encabezado
          antetitulo="Grupo"
          titulo="Tres empresas, una misma cadena de frío"
          entradilla="Distribuciones Rodrigo opera junto a dos compañías que amplían su cobertura territorial y su surtido en Aragón."
          centrado
          className="mb-12"
        />
        <Escalonado className="grid gap-4 lg:grid-cols-3">
          {grupo.map((g) => (
            <Hijo key={g.nombre} as="article">
              <Tarjeta className="h-full">
                <h3 className="text-[1rem]" style={{ fontVariationSettings: '"wdth" 105' }}>{g.nombre}</h3>
                <p className="mt-2 text-[0.88rem]" style={{ color: "var(--texto-2)" }}>{g.texto}</p>
                <span className="mt-auto pt-5">
                  <Etiqueta>{g.lugar}</Etiqueta>
                </span>
              </Tarjeta>
            </Hijo>
          ))}
        </Escalonado>
      </Contenedor>
    </Seccion>
  );
}

export function Claim() {
  return (
    <Seccion alt compacta>
      <Contenedor estrecho>
        <Aparece className="text-center">
          <p
            className="text-[clamp(1.5rem,1.1rem+1.9vw,2.5rem)] leading-[1.22]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.025em" }}
          >
            «{empresa.claim}»
          </p>
          <p className="dato mt-6 text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "var(--texto-3)" }}>
            {empresa.razonSocial}
          </p>
        </Aparece>
      </Contenedor>
    </Seccion>
  );
}

export function Preguntas() {
  return (
    <Seccion>
      <Contenedor estrecho>
        <Encabezado
          antetitulo="Preguntas frecuentes"
          titulo="Lo que suelen preguntarnos antes de empezar"
          className="mb-10"
        />
        <div className="border-t" style={{ borderColor: "var(--linea)" }}>
          {preguntas.map((p) => (
            <details key={p.pregunta} className="group border-b" style={{ borderColor: "var(--linea)" }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.02rem] font-semibold marker:hidden">
                {p.pregunta}
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-transform duration-300 group-open:rotate-45"
                  style={{ borderColor: "var(--linea)", color: "var(--texto-3)" }}
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[68ch] pb-6 text-[0.92rem]" style={{ color: "var(--texto-2)" }}>
                {p.respuesta}
              </p>
            </details>
          ))}
        </div>
      </Contenedor>
    </Seccion>
  );
}

/* ------------------------------------------------------------------ */
/* Banda de llamada a la acción                                        */
/* ------------------------------------------------------------------ */

export function BandaCTA() {
  return (
    <Seccion compacta>
      <Contenedor>
        <Aparece
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12"
          style={{ background: "var(--invertido-fondo)", color: "var(--invertido-texto)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(48% 70% at 12% 0%, color-mix(in srgb, var(--acento) 45%, transparent), transparent 68%), radial-gradient(46% 66% at 90% 100%, color-mix(in srgb, var(--frio) 42%, transparent), transparent 66%)",
            }}
            aria-hidden
          />
          <div className="reticula pointer-events-none absolute inset-0 opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="text-[clamp(1.8rem,1.3rem+2.2vw,3rem)]">¿Empezamos a trabajar juntos?</h2>
            <p className="mx-auto mt-5 max-w-[52ch] opacity-80">
              Cuéntenos qué necesita su cocina o su lineal. Un comercial de zona le llamará,
              revisará su surtido y le preparará una tarifa a medida sin compromiso.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Boton href="/contacto#alta" tamano="lg">Solicitar alta de cliente</Boton>
              <Boton href={`tel:${empresa.telefonoLink}`} variante="claro" tamano="lg">
                Llamar al {empresa.telefono}
              </Boton>
            </div>
          </div>
        </Aparece>
      </Contenedor>
    </Seccion>
  );
}
