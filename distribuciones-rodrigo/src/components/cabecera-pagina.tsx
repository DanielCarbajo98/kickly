"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Contenedor } from "./ui";
import { salida } from "@/lib/motion";

export function CabeceraPagina({
  antetitulo,
  titulo,
  entradilla,
  miga,
}: {
  antetitulo: string;
  titulo: string;
  entradilla?: string;
  miga: string;
}) {
  return (
    <section className="relative overflow-hidden pb-8 pt-8 sm:pb-10 sm:pt-10">
      <div
        className="pointer-events-none absolute inset-x-0 -top-1/2 h-[200%]"
        style={{
          background:
            "radial-gradient(42% 52% at 18% 22%, color-mix(in srgb, var(--frio) 13%, transparent), transparent 68%), radial-gradient(38% 48% at 86% 12%, color-mix(in srgb, var(--acento) 10%, transparent), transparent 66%)",
        }}
        aria-hidden
      />
      <Contenedor className="relative">
        <nav aria-label="Ruta de navegación" className="dato mb-8 text-[0.72rem]" style={{ color: "var(--texto-3)" }}>
          <ol className="flex flex-wrap gap-2">
            <li><Link href="/" className="no-underline hover:underline">Inicio</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page">{miga}</li>
          </ol>
        </nav>

        <motion.p className="antetitulo mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={salida}>
          {antetitulo}
        </motion.p>

        <h1 className="max-w-[20ch] text-[clamp(2.1rem,1.5rem+2.8vw,3.7rem)]">
          <span className="mascara-linea">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            >
              {titulo}
            </motion.span>
          </span>
        </h1>

        {entradilla ? (
          <motion.p
            className="mt-7 max-w-[58ch] text-[1.05rem] leading-relaxed"
            style={{ color: "var(--texto-2)" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...salida, delay: 0.22 }}
          >
            {entradilla}
          </motion.p>
        ) : null}
      </Contenedor>
    </section>
  );
}

/** Bloque de texto legal, con ritmo tipográfico propio. */
export function TextoLegal({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-[1.3rem] [&_li]:mb-1.5 [&_p]:mb-4 [&_p]:leading-relaxed [&_table]:w-full [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 first:[&_h2]:mt-0"
      style={{ color: "var(--texto-2)" }}
    >
      {children}
    </div>
  );
}
