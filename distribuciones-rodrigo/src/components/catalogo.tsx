"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Contenedor, Etiqueta, Seccion } from "./ui";
import { Iconos } from "./brand";
import {
  CANALES, TEMPERATURAS, familias, productos,
  type Canal, type Producto, type Temperatura,
} from "@/content/productos";

/** Minúsculas y sin tildes, para que "jamon" encuentre "jamón". */
const normalizar = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

type Orden = "relevancia" | "nombre" | "familia";

const indice = productos.map((p) => ({
  ...p,
  buscable: normalizar(
    [p.nombre, p.ref, p.subfamilia, p.formato, familias.find((f) => f.id === p.familia)?.nombre ?? ""].join(" "),
  ),
}));

export function Catalogo() {
  const router = useRouter();
  const params = useSearchParams();
  const campo = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [orden, setOrden] = useState<Orden>((params.get("orden") as Orden) ?? "relevancia");
  const leerLista = useCallback((clave: string) => (params.get(clave) ?? "").split(",").filter(Boolean), [params]);

  const [fam, setFam] = useState<string[]>(leerLista("familia"));
  const [temps, setTemps] = useState<string[]>(leerLista("temp"));
  const [canales, setCanales] = useState<string[]>(leerLista("canal"));

  /* La URL refleja el estado: un filtro se puede compartir por WhatsApp. */
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (fam.length) p.set("familia", fam.join(","));
    if (temps.length) p.set("temp", temps.join(","));
    if (canales.length) p.set("canal", canales.join(","));
    if (orden !== "relevancia") p.set("orden", orden);
    const cadena = p.toString();
    router.replace(cadena ? `/productos?${cadena}` : "/productos", { scroll: false });
  }, [q, fam, temps, canales, orden, router]);

  /* Atajo: "/" enfoca el buscador. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const activo = document.activeElement?.tagName ?? "";
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(activo)) {
        e.preventDefault();
        campo.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const alternar = (lista: string[], set: (v: string[]) => void, valor: string) =>
    set(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);

  const resultados = useMemo(() => {
    const terminos = normalizar(q).split(/\s+/).filter(Boolean);
    const filtrados = indice.filter((p) => {
      if (fam.length && !fam.includes(p.familia)) return false;
      if (temps.length && !temps.includes(p.temp)) return false;
      if (canales.length && !canales.some((c) => (p.canal as string[]).includes(c))) return false;
      return terminos.every((t) => p.buscable.includes(t));
    });

    const puntua = (p: (typeof indice)[number]) => {
      if (!q) return p.destacado ? -1 : 0;
      const n = normalizar(p.nombre);
      const t = normalizar(q);
      if (n.startsWith(t)) return -3;
      if (n.includes(t) || normalizar(p.ref).includes(t)) return -2;
      return -1;
    };

    return [...filtrados].sort((a, b) => {
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre, "es");
      if (orden === "familia")
        return a.familia.localeCompare(b.familia, "es") || a.nombre.localeCompare(b.nombre, "es");
      return puntua(a) - puntua(b) || a.nombre.localeCompare(b.nombre, "es");
    });
  }, [q, fam, temps, canales, orden]);

  const cuenta = (predicado: (p: Producto) => boolean) => productos.filter(predicado).length;

  const chips = [
    ...fam.map((id) => ({
      clave: `f-${id}`,
      texto: familias.find((f) => f.id === id)?.nombre ?? id,
      quitar: () => alternar(fam, setFam, id),
    })),
    ...temps.map((id) => ({
      clave: `t-${id}`,
      texto: TEMPERATURAS[id as Temperatura].etiqueta,
      quitar: () => alternar(temps, setTemps, id),
    })),
    ...canales.map((id) => ({
      clave: `c-${id}`,
      texto: CANALES[id as Canal],
      quitar: () => alternar(canales, setCanales, id),
    })),
  ];

  const limpiar = () => {
    setQ("");
    setFam([]);
    setTemps([]);
    setCanales([]);
    setOrden("relevancia");
  };

  return (
    <Seccion compacta>
      <Contenedor>
        <h2 className="sr-only">Buscador del catálogo</h2>

        {/* Buscador */}
        <div className="mb-10 max-w-xl">
          <label htmlFor="buscar" className="sr-only">Buscar en el catálogo</label>
          <div className="relative flex items-center">
            <Iconos.lupa className="pointer-events-none absolute left-4 h-5 w-5" style={{ color: "var(--texto-3)" }} />
            <input
              id="buscar"
              ref={campo}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar merluza, croqueta, patata prefrita, PES-0101…"
              autoComplete="off"
              className="w-full rounded-full border py-3.5 pl-12 pr-4 text-[0.95rem] outline-none transition-[border-color,box-shadow]"
              style={{ background: "var(--superficie)", borderColor: "var(--linea)", color: "var(--texto)" }}
            />
          </div>
          <p className="dato mt-2.5 text-[0.72rem]" style={{ color: "var(--texto-3)" }}>
            Pulse <kbd className="rounded border px-1.5 py-0.5" style={{ borderColor: "var(--linea)" }}>/</kbd> para
            buscar desde cualquier punto de la página.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
          {/* Filtros */}
          <aside
            className="grid gap-6 rounded-2xl border p-5 lg:sticky lg:top-24"
            style={{ background: "var(--superficie)", borderColor: "var(--linea)" }}
            aria-label="Filtros de catálogo"
          >
            <GrupoFiltro
              titulo="Familia"
              opciones={familias.map((f) => ({
                id: f.id,
                etiqueta: f.nombre,
                n: cuenta((p) => p.familia === f.id),
              }))}
              seleccion={fam}
              alternar={(v) => alternar(fam, setFam, v)}
            />
            <GrupoFiltro
              titulo="Conservación"
              opciones={(Object.keys(TEMPERATURAS) as Temperatura[]).map((t) => ({
                id: t,
                etiqueta: `${TEMPERATURAS[t].etiqueta} · ${TEMPERATURAS[t].rango}`,
                n: cuenta((p) => p.temp === t),
              }))}
              seleccion={temps}
              alternar={(v) => alternar(temps, setTemps, v)}
            />
            <GrupoFiltro
              titulo="Canal"
              opciones={(Object.keys(CANALES) as Canal[]).map((c) => ({
                id: c,
                etiqueta: CANALES[c],
                n: cuenta((p) => (p.canal as string[]).includes(c)),
              }))}
              seleccion={canales}
              alternar={(v) => alternar(canales, setCanales, v)}
            />
            <button
              type="button"
              onClick={limpiar}
              className="w-full rounded-full border py-2 text-[0.8rem] font-semibold"
              style={{ borderColor: "var(--linea)", color: "var(--texto-2)" }}
            >
              Limpiar filtros
            </button>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p role="status" aria-live="polite" className="text-[0.88rem]" style={{ color: "var(--texto-3)" }}>
                <strong className="tabular" style={{ color: "var(--texto)" }}>{resultados.length}</strong>{" "}
                {resultados.length === 1 ? "referencia" : "referencias"}
                {resultados.length !== productos.length ? ` de ${productos.length}` : ""}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="orden" className="text-[0.8rem]" style={{ color: "var(--texto-3)" }}>Ordenar por</label>
                <select
                  id="orden"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as Orden)}
                  className="rounded-lg border px-2.5 py-1.5 text-[0.82rem]"
                  style={{ background: "var(--superficie)", borderColor: "var(--linea)", color: "var(--texto)" }}
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="nombre">Nombre A-Z</option>
                  <option value="familia">Familia</option>
                </select>
              </div>
            </div>

            {chips.length ? (
              <div className="mb-5 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <motion.span
                    key={c.clave}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-1.5 rounded-full border py-1 pl-3 pr-1.5 text-[0.75rem] font-semibold"
                    style={{
                      background: "var(--acento-suave)",
                      color: "var(--acento-fuerte)",
                      borderColor: "color-mix(in srgb, var(--acento) 30%, transparent)",
                    }}
                  >
                    {c.texto}
                    <button type="button" onClick={c.quitar} aria-label={`Quitar filtro ${c.texto}`} className="grid h-4 w-4 place-items-center rounded-full">
                      <Iconos.cerrar className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            ) : null}

            {resultados.length ? (
              <motion.ul layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {resultados.map((p) => (
                    <FichaProducto key={p.ref} producto={p} />
                  ))}
                </AnimatePresence>
              </motion.ul>
            ) : (
              <div
                className="rounded-2xl border border-dashed p-14 text-center"
                style={{ borderColor: "var(--linea)", color: "var(--texto-3)" }}
              >
                <Iconos.lupa className="mx-auto mb-4 h-10 w-10 opacity-40" />
                <h3 className="text-[1.1rem]" style={{ color: "var(--texto)" }}>Sin resultados</h3>
                <p className="mx-auto mt-2 max-w-[46ch] text-[0.9rem]">
                  No hemos encontrado referencias con esos criterios. Pruebe con menos filtros o
                  escríbanos: gran parte de nuestro surtido nace de peticiones concretas de clientes.
                </p>
              </div>
            )}
          </div>
        </div>
      </Contenedor>
    </Seccion>
  );
}

function GrupoFiltro({
  titulo,
  opciones,
  seleccion,
  alternar,
}: {
  titulo: string;
  opciones: { id: string; etiqueta: string; n: number }[];
  seleccion: string[];
  alternar: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="dato mb-3 text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: "var(--texto-3)" }}>
        {titulo}
      </legend>
      <div className="grid gap-1">
        {opciones.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-center gap-2.5 py-0.5 text-[0.85rem]" style={{ color: "var(--texto-2)" }}>
            <input
              type="checkbox"
              value={o.id}
              checked={seleccion.includes(o.id)}
              onChange={() => alternar(o.id)}
              className="h-4 w-4 shrink-0 cursor-pointer"
              style={{ accentColor: "var(--acento)" }}
            />
            <span className="min-w-0 flex-1">{o.etiqueta}</span>
            <span className="tabular text-[0.72rem]" style={{ color: "var(--texto-3)" }}>{o.n}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FichaProducto({ producto }: { producto: Producto }) {
  const t = TEMPERATURAS[producto.temp];
  const tono = producto.temp === "congelado" ? "frio" : producto.temp === "refrigerado" ? "fresco" : "neutro";
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col overflow-hidden rounded-xl border"
      style={{ background: "var(--superficie)", borderColor: "var(--linea)" }}
    >
      <div
        className="relative grid aspect-[5/4] place-items-center border-b"
        style={{
          borderColor: "var(--linea)",
          background: "linear-gradient(150deg, var(--superficie-alt), var(--superficie))",
        }}
      >
        <Iconos.caja className="h-10 w-10 opacity-30" style={{ color: "var(--texto-3)" }} />
        <span className="absolute left-2 top-2">
          <Etiqueta tono={tono as "frio" | "fresco" | "neutro"}>{t.etiqueta}</Etiqueta>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="dato text-[0.63rem] uppercase tracking-[0.08em]" style={{ color: "var(--texto-3)" }}>
          {producto.subfamilia}
        </span>
        <h3 className="text-[0.9rem] leading-snug" style={{ fontFamily: "var(--font-sans)", fontWeight: 650 }}>
          {producto.nombre}
        </h3>
        <p className="mt-auto pt-3 text-[0.78rem]" style={{ color: "var(--texto-2)" }}>{producto.formato}</p>
        <span className="dato text-[0.68rem]" style={{ color: "var(--texto-3)" }}>Ref. {producto.ref}</span>
      </div>
    </motion.li>
  );
}
