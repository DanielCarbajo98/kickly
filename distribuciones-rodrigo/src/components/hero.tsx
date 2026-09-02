"use client";

import { motion, useReducedMotion } from "motion/react";
import { Contenedor, Boton } from "./ui";
import { Iconos } from "./brand";
import { PanelFrio } from "./panel-frio";
import { lineaTitular, salida } from "@/lib/motion";

const LINEAS = ["La cadena de frío", "que sostiene"];

export function Hero() {
  const sinMovimiento = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
      {/* Resplandores de marca */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-1/3 h-[140%]"
        style={{
          background:
            "radial-gradient(56% 48% at 14% 20%, color-mix(in srgb, var(--frio) 16%, transparent) 0%, transparent 66%), radial-gradient(46% 44% at 88% 6%, color-mix(in srgb, var(--acento) 12%, transparent) 0%, transparent 64%)",
        }}
        aria-hidden
      />

      <Contenedor className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <motion.p
              className="antetitulo mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...salida, delay: 0.1 }}
            >
              Distribución de alimentación · desde 1986
            </motion.p>

            <h1 className="text-[clamp(2.6rem,1.6rem+4.2vw,4.9rem)]">
              {LINEAS.map((linea, i) => (
                <span key={linea} className="mascara-linea">
                  <motion.span
                    className="block"
                    variants={lineaTitular}
                    initial={sinMovimiento ? "visible" : "oculto"}
                    animate="visible"
                    transition={{ delay: 0.18 + i * 0.09 }}
                  >
                    {linea}
                  </motion.span>
                </span>
              ))}
              <span className="mascara-linea">
                <motion.span
                  className="block"
                  style={{ color: "var(--acento)" }}
                  variants={lineaTitular}
                  initial={sinMovimiento ? "visible" : "oculto"}
                  animate="visible"
                  transition={{ delay: 0.36 }}
                >
                  su cocina.
                </motion.span>
              </span>
            </h1>

            <motion.p
              className="mt-7 max-w-[52ch] text-[1.08rem] leading-relaxed"
              style={{ color: "var(--texto-2)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...salida, delay: 0.5 }}
            >
              Somos el mayorista de alimentación de referencia en Aragón. Más de 2.500
              referencias de congelado, refrigerado, charcutería, helado y despensa,
              servidas con flota propia a restauración, colectividades y comercio.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...salida, delay: 0.6 }}
            >
              <Boton href="/productos" tamano="lg">Explorar el catálogo</Boton>
              <Boton href="/contacto#alta" variante="linea" tamano="lg">
                Solicitar alta de cliente
              </Boton>
            </motion.div>

            <motion.ul
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t pt-6"
              style={{ borderColor: "var(--linea)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...salida, delay: 0.72 }}
            >
              {[
                "Frío negativo y positivo propio",
                "Rutas propias en Aragón",
                "Trazabilidad de lote",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-[0.85rem]"
                  style={{ color: "var(--texto-2)" }}
                >
                  <Iconos.check className="h-4 w-4" style={{ color: "var(--frio)" } as React.CSSProperties} />
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
          >
            <PanelFrio />
          </motion.div>
        </div>
      </Contenedor>
    </section>
  );
}
