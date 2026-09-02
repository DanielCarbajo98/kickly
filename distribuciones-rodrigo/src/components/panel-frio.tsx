"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cadenaFrio } from "@/content/site";

/**
 * Panel de cadena de frío del hero.
 *
 * No es decoración: dibuja el recorrido real del producto por la plataforma,
 * con la temperatura objetivo de cada tramo. El punto que desciende por el
 * raíl es el pedido moviéndose por la nave.
 */
export function PanelFrio() {
  const sinMovimiento = useReducedMotion();
  const [lectura, setLectura] = useState("−18.0");

  // La lectura de cámara oscila unas décimas, como un registrador real.
  useEffect(() => {
    if (sinMovimiento) return;
    const id = setInterval(() => {
      const v = -18 + (Math.random() * 0.5 - 0.25);
      setLectura(v.toFixed(1).replace("-", "−"));
    }, 2200);
    return () => clearInterval(id);
  }, [sinMovimiento]);

  const pasos = cadenaFrio;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border p-6 sm:p-7"
      style={{
        background:
          "linear-gradient(165deg, color-mix(in srgb, var(--frio) 14%, var(--superficie)), var(--superficie) 62%)",
        borderColor: "var(--linea)",
        boxShadow: "0 40px 90px -50px rgba(12,31,54,0.55)",
      }}
    >
      <div className="reticula pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      {/* Lectura de cámara */}
      <div className="relative mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="dato text-[0.65rem] uppercase tracking-[0.16em]" style={{ color: "var(--texto-3)" }}>
            Cámara de congelación
          </p>
          <p
            className="dato mt-1 text-[2.6rem] leading-none font-semibold"
            style={{ color: "var(--frio-fuerte)" }}
          >
            {lectura}
            <span className="ml-1 text-[1.1rem] align-top">°C</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className="block h-2 w-2 rounded-full"
            style={{ background: "#2f9e5f" }}
            animate={sinMovimiento ? {} : { opacity: [1, 0.25, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="dato text-[0.68rem]" style={{ color: "var(--texto-3)" }}>
            EN RANGO
          </span>
        </div>
      </div>

      {/* Raíl con las cinco etapas */}
      <div className="relative pl-8">
        <div className="rail absolute left-[7px] top-2 bottom-2 w-[2px]" aria-hidden />

        {/* El pedido descendiendo por el raíl */}
        {!sinMovimiento ? (
          <motion.span
            className="absolute left-[1px] z-10 block h-3.5 w-3.5 rounded-full"
            style={{
              background: "var(--acento)",
              boxShadow: "0 0 0 4px color-mix(in srgb, var(--acento) 22%, transparent)",
            }}
            animate={{ top: ["1%", "94%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
            aria-hidden
          />
        ) : null}

        <ol className="grid gap-5">
          {pasos.map((p, i) => (
            <motion.li
              key={p.titulo}
              className="relative"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.11, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="absolute -left-8 top-1.5 block h-2 w-2 rounded-full ring-4"
                style={{
                  background: "var(--superficie)",
                  borderColor: "var(--frio)",
                  boxShadow: "inset 0 0 0 2px var(--frio)",
                  // El anillo usa el color de fondo para "recortar" el raíl
                  ["--tw-ring-color" as string]: "var(--superficie)",
                }}
                aria-hidden
              />
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[0.9rem] font-semibold" style={{ color: "var(--texto)" }}>
                  {p.titulo}
                </span>
                <span className="dato text-[0.72rem]" style={{ color: "var(--frio-fuerte)" }}>
                  {p.temperatura}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Pie del panel */}
      <div
        className="relative mt-7 flex items-center gap-3 rounded-xl border p-3.5"
        style={{
          background: "color-mix(in srgb, var(--superficie) 80%, transparent)",
          borderColor: "var(--linea)",
        }}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
          style={{ background: "var(--acento-suave)", color: "var(--acento-fuerte)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
            <path d="M14 17V6a1 1 0 0 0-1-1H2v11h1" />
            <path d="M14 9h4l3 3v5h-2" />
            <circle cx="6" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
            <path d="M8 17h7" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-[0.82rem] font-semibold" style={{ color: "var(--texto)" }}>
            Reparto en ruta propia
          </p>
          <p className="dato text-[0.68rem]" style={{ color: "var(--texto-3)" }}>
            +40 vehículos bitemperatura
          </p>
        </div>
      </div>
    </div>
  );
}
