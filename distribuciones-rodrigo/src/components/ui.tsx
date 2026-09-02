"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { aparece, escalona, enVista } from "@/lib/motion";
import { Iconos } from "./brand";

/* ------------------------------------------------------------------ */
/* Estructura                                                          */
/* ------------------------------------------------------------------ */

export function Contenedor({
  children,
  estrecho = false,
  className = "",
}: {
  children: React.ReactNode;
  estrecho?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-8 ${estrecho ? "max-w-3xl" : "max-w-[76rem]"} ${className}`}
    >
      {children}
    </div>
  );
}

export function Seccion({
  children,
  alt = false,
  compacta = false,
  id,
  className = "",
}: {
  children: React.ReactNode;
  alt?: boolean;
  compacta?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`${compacta ? "py-14 sm:py-20" : "py-20 sm:py-28 lg:py-32"} ${className}`}
      style={alt ? { background: "var(--fondo-alt)" } : undefined}
    >
      {children}
    </section>
  );
}

/** Antetítulo + titular + entradilla, con la barra amarilla del logotipo. */
export function Encabezado({
  antetitulo,
  titulo,
  entradilla,
  centrado = false,
  className = "",
}: {
  antetitulo?: string;
  titulo: React.ReactNode;
  entradilla?: React.ReactNode;
  centrado?: boolean;
  className?: string;
}) {
  return (
    <Aparece
      className={`${centrado ? "mx-auto text-center" : ""} max-w-3xl ${className}`}
    >
      {antetitulo ? (
        <p className={`antetitulo mb-5 ${centrado ? "justify-center" : ""}`}>{antetitulo}</p>
      ) : null}
      <h2 className="text-[clamp(2rem,1.3rem+2.6vw,3.4rem)]">{titulo}</h2>
      {entradilla ? (
        <p
          className={`mt-5 text-[1.05rem] leading-relaxed ${centrado ? "mx-auto" : ""} max-w-[58ch]`}
          style={{ color: "var(--texto-2)" }}
        >
          {entradilla}
        </p>
      ) : null}
    </Aparece>
  );
}

/* ------------------------------------------------------------------ */
/* Movimiento                                                          */
/* ------------------------------------------------------------------ */

export function Aparece({
  children,
  className = "",
  retardo = 0,
  as = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  retardo?: number;
  as?: "div" | "li" | "article";
  style?: React.CSSProperties;
}) {
  const Etiqueta = motion[as];
  return (
    <Etiqueta
      className={className}
      style={style}
      variants={aparece}
      initial="oculto"
      whileInView="visible"
      viewport={enVista}
      transition={{ delay: retardo }}
    >
      {children}
    </Etiqueta>
  );
}

/** Rejilla cuyos hijos entran escalonados. */
export function Escalonado({
  children,
  className = "",
  retardo = 0.07,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  retardo?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={escalona(retardo)}
      initial="oculto"
      whileInView="visible"
      viewport={enVista}
    >
      {children}
    </motion.div>
  );
}

export function Hijo({
  children,
  className = "",
  as = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  style?: React.CSSProperties;
}) {
  const Etiqueta = motion[as];
  return (
    <Etiqueta className={className} style={style} variants={aparece}>
      {children}
    </Etiqueta>
  );
}

/** Cifra que cuenta hasta su valor al entrar en pantalla. */
export function Contador({
  valor,
  sufijo = "",
  className = "",
}: {
  valor: number;
  sufijo?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const enPantalla = useInView(ref, { once: true, amount: 0.5 });
  const sinMovimiento = useReducedMotion();
  const [n, setN] = useState(sinMovimiento ? valor : 0);

  useEffect(() => {
    if (!enPantalla || sinMovimiento) {
      setN(valor);
      return;
    }
    let raf = 0;
    const inicio = performance.now();
    const duracion = 1500;
    const paso = (t: number) => {
      const p = Math.min((t - inicio) / duracion, 1);
      const suave = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(valor * suave));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [enPantalla, valor, sinMovimiento]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
      {sufijo ? <span style={{ color: "var(--acento)" }}>{sufijo}</span> : null}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Controles                                                           */
/* ------------------------------------------------------------------ */

type BotonProps = {
  children: React.ReactNode;
  href?: string;
  variante?: "solido" | "linea" | "claro";
  tamano?: "md" | "lg" | "sm";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function Boton({
  children,
  href,
  variante = "solido",
  tamano = "md",
  className = "",
  onClick,
  type = "button",
}: BotonProps) {
  const medidas =
    tamano === "lg"
      ? "px-7 py-3.5 text-[0.95rem]"
      : tamano === "sm"
        ? "px-4 py-2 text-[0.8rem]"
        : "px-5 py-2.5 text-[0.875rem]";

  const estilos: Record<string, React.CSSProperties> = {
    solido: { background: "var(--acento-fuerte)", color: "var(--acento-contraste)", borderColor: "transparent" },
    linea: { background: "transparent", color: "var(--texto)", borderColor: "var(--linea)" },
    claro: { background: "var(--invertido-texto)", color: "var(--marino-profundo)", borderColor: "transparent" },
  };

  const clases = `group inline-flex items-center justify-center gap-2 rounded-full border font-semibold
    transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px
    active:translate-y-0 ${medidas} ${className}`;

  const contenido = (
    <>
      {children}
      <Iconos.flecha className="h-[1em] w-[1em] transition-transform duration-200 group-hover:translate-x-1" />
    </>
  );

  if (href) {
    const externo = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (externo) {
      return (
        <a href={href} className={clases} style={estilos[variante]}>
          {contenido}
        </a>
      );
    }
    return (
      <Link href={href} className={clases} style={estilos[variante]}>
        {contenido}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={clases} style={estilos[variante]}>
      {contenido}
    </button>
  );
}

export function Etiqueta({
  children,
  tono = "neutro",
  className = "",
}: {
  children: React.ReactNode;
  tono?: "neutro" | "frio" | "fresco" | "acento" | "destello";
  className?: string;
}) {
  const tonos: Record<string, React.CSSProperties> = {
    neutro: { background: "var(--superficie-alt)", color: "var(--texto-2)", borderColor: "var(--linea)" },
    frio: { background: "var(--frio-suave)", color: "var(--frio-fuerte)", borderColor: "color-mix(in srgb, var(--frio) 30%, transparent)" },
    acento: { background: "var(--acento-suave)", color: "var(--acento-fuerte)", borderColor: "color-mix(in srgb, var(--acento) 30%, transparent)" },
    fresco: { background: "var(--fresco-suave)", color: "var(--fresco)", borderColor: "color-mix(in srgb, var(--fresco) 32%, transparent)" },
    destello: { background: "color-mix(in srgb, var(--destello) 22%, transparent)", color: "var(--destello-texto)", borderColor: "color-mix(in srgb, var(--destello) 55%, transparent)" },
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold ${className}`}
      style={tonos[tono]}
    >
      {children}
    </span>
  );
}

export function Tarjeta({
  children,
  className = "",
  interactiva = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactiva?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-[transform,box-shadow,border-color] duration-300
        ${interactiva ? "hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(12,31,54,0.35)]" : ""} ${className}`}
      style={{ background: "var(--superficie)", borderColor: "var(--linea)" }}
    >
      {children}
    </div>
  );
}

/** Lista de comprobación con el icono de verificación. */
export function Comprobacion({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-[0.9rem]" style={{ color: "var(--texto-2)" }}>
          <Iconos.check className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
