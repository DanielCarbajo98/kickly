"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Iconos, Isotipo } from "./brand";
import { Contenedor } from "./ui";
import { empresa, navegacion } from "@/content/site";

/* ------------------------------------------------------------------ */
/* Barra de contacto                                                   */
/* ------------------------------------------------------------------ */

export function BarraContacto() {
  return (
    <div
      className="no-imprimir hidden text-[0.75rem] md:block"
      style={{ background: "var(--color-marino-500)", color: "#ffffff" }}
    >
      <Contenedor className="flex min-h-9 flex-wrap items-center justify-between gap-x-8 gap-y-1">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-1">
          <a href={`tel:${empresa.telefonoLink}`} className="inline-flex items-center gap-2 no-underline hover:underline">
            <Iconos.telefono className="h-3.5 w-3.5 opacity-80" />
            <span className="dato">{empresa.telefono}</span>
          </a>
          <a href={`mailto:${empresa.email}`} className="inline-flex items-center gap-2 no-underline hover:underline">
            <Iconos.correo className="h-3.5 w-3.5 opacity-80" />
            {empresa.email}
          </a>
        </div>
        <span className="inline-flex items-center gap-2 opacity-90">
          <Iconos.reloj className="h-3.5 w-3.5" />
          {empresa.horario}
        </span>
      </Contenedor>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Selector de tema                                                    */
/* ------------------------------------------------------------------ */

function BotonTema() {
  const [oscuro, setOscuro] = useState<boolean | null>(null);

  useEffect(() => {
    const guardado = (() => {
      try {
        return localStorage.getItem("dr-tema");
      } catch {
        return null;
      }
    })();
    const sistema = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setOscuro(guardado ? guardado === "dark" : sistema);
  }, []);

  const alternar = () => {
    const siguiente = !oscuro;
    setOscuro(siguiente);
    document.documentElement.setAttribute("data-theme", siguiente ? "dark" : "light");
    try {
      localStorage.setItem("dr-tema", siguiente ? "dark" : "light");
    } catch {
      /* navegación privada */
    }
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={oscuro ? "Activar tema claro" : "Activar tema oscuro"}
      className="grid h-10 w-10 place-items-center rounded-full border transition-colors"
      style={{ borderColor: "var(--linea)", color: "var(--texto-2)" }}
    >
      {oscuro ? <Iconos.sol className="h-[18px] w-[18px]" /> : <Iconos.luna className="h-[18px] w-[18px]" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Cabecera                                                            */
/* ------------------------------------------------------------------ */

export function Cabecera() {
  const ruta = usePathname();
  const [fijada, setFijada] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setFijada(v > 12));

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  useEffect(() => {
    setAbierto(false);
  }, [ruta]);

  const activa = (href: string) => (href === "/" ? ruta === "/" : ruta.startsWith(href));

  return (
    <>
      <header
        className="no-imprimir sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300"
        style={{
          background: fijada
            ? "color-mix(in srgb, var(--fondo) 92%, transparent)"
            : "color-mix(in srgb, var(--fondo) 70%, transparent)",
          backdropFilter: "saturate(1.6) blur(14px)",
          WebkitBackdropFilter: "saturate(1.6) blur(14px)",
          borderBottom: `1px solid ${fijada ? "var(--linea)" : "transparent"}`,
        }}
      >
        <Contenedor className="flex min-h-[4.25rem] items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3 no-underline">
            <Isotipo className="h-10 w-10" />
            <span className="flex flex-col leading-none">
              <span
                className="font-[800] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}
              >
                Distribuciones Rodrigo
              </span>
              <span
                className="dato mt-1 text-[0.6rem] uppercase tracking-[0.18em]"
                style={{ color: "var(--texto-3)" }}
              >
                Alimentación · Zaragoza
              </span>
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {navegacion.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={activa(n.href) ? "page" : undefined}
                    className="relative block rounded-full px-3.5 py-2 text-[0.875rem] font-medium no-underline transition-colors"
                    style={{ color: activa(n.href) ? "var(--acento-fuerte)" : "var(--texto-2)" }}
                  >
                    {activa(n.href) ? (
                      <motion.span
                        layoutId="nav-activa"
                        className="absolute inset-0 -z-10 rounded-full"
                        style={{ background: "var(--acento-suave)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    {n.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <BotonTema />
            <Link
              href="/contacto#alta"
              className="hidden rounded-full px-4 py-2.5 text-[0.8rem] font-semibold no-underline transition-transform hover:-translate-y-px sm:inline-flex"
              style={{ background: "var(--acento-fuerte)", color: "var(--acento-contraste)" }}
            >
              Solicitar alta de cliente
            </Link>
            <button
              type="button"
              onClick={() => setAbierto(true)}
              aria-label="Abrir menú"
              aria-expanded={abierto}
              className="grid h-10 w-10 place-items-center rounded-full border lg:hidden"
              style={{ borderColor: "var(--linea)", color: "var(--texto-2)" }}
            >
              <Iconos.menu className="h-[18px] w-[18px]" />
            </button>
          </div>
        </Contenedor>
      </header>

      <AnimatePresence>
        {abierto ? (
          <motion.div
            className="fixed inset-0 z-[60] overflow-y-auto p-5 lg:hidden"
            style={{ background: "var(--fondo)" }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8 flex items-center justify-between">
              <Isotipo className="h-10 w-10" />
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar menú"
                className="grid h-10 w-10 place-items-center rounded-full border"
                style={{ borderColor: "var(--linea)", color: "var(--texto-2)" }}
              >
                <Iconos.cerrar className="h-[18px] w-[18px]" />
              </button>
            </div>
            <ul className="mb-8 grid">
              {navegacion.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.045 }}
                >
                  <Link
                    href={n.href}
                    aria-current={activa(n.href) ? "page" : undefined}
                    className="flex items-center justify-between border-b py-4 text-[1.45rem] no-underline"
                    style={{
                      borderColor: "var(--linea)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: activa(n.href) ? "var(--acento)" : "var(--texto)",
                    }}
                  >
                    {n.etiqueta}
                    <Iconos.flecha className="h-4 w-4 opacity-50" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link
              href="/contacto#alta"
              className="flex w-full items-center justify-center rounded-full px-6 py-4 font-semibold no-underline"
              style={{ background: "var(--acento-fuerte)", color: "var(--acento-contraste)" }}
            >
              Solicitar alta de cliente
            </Link>
            <p className="dato mt-6 text-sm" style={{ color: "var(--texto-3)" }}>
              <a href={`tel:${empresa.telefonoLink}`}>{empresa.telefono}</a>
              <br />
              <a href={`mailto:${empresa.email}`}>{empresa.email}</a>
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
