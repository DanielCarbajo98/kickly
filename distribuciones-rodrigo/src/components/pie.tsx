"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Iconos, Logotipo } from "./brand";
import { Contenedor } from "./ui";
import { empresa } from "@/content/site";

const columnas = [
  {
    titulo: "Catálogo",
    enlaces: [
      { href: "/productos?familia=pescados", texto: "Pescados y mariscos" },
      { href: "/productos?familia=carnes", texto: "Carnes y elaborados" },
      { href: "/productos?familia=charcuteria", texto: "Charcutería y quesos" },
      { href: "/productos?familia=verduras", texto: "Verduras y guarniciones" },
      { href: "/productos?familia=precocinados", texto: "Precocinados" },
      { href: "/productos?familia=helados", texto: "Helados y postres" },
    ],
  },
  {
    titulo: "Empresa",
    enlaces: [
      { href: "/empresa", texto: "Quiénes somos" },
      { href: "/servicios", texto: "Servicio y logística" },
      { href: "/calidad", texto: "Calidad y seguridad alimentaria" },
      { href: "/proveedores", texto: "Proveedores" },
      { href: "/empleo", texto: "Trabaja con nosotros" },
    ],
  },
];

export function Pie() {
  return (
    <footer
      className="no-imprimir mt-24"
      style={{ background: "var(--invertido-fondo)", color: "color-mix(in srgb, var(--invertido-texto) 72%, transparent)" }}
    >
      <Contenedor className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div>
            <Logotipo className="h-[4.5rem] w-auto" />
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed">
              Distribuidor mayorista de alimentación en Aragón desde 1986. Congelados,
              refrigerados, charcutería, helados y despensa con cadena de frío garantizada
              de nuestro almacén a su cocina.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: empresa.redes.facebook, Icono: Iconos.facebook, nombre: "Facebook" },
                { href: empresa.redes.linkedin, Icono: Iconos.linkedin, nombre: "LinkedIn" },
              ].map(({ href, Icono, nombre }) => (
                <a
                  key={nombre}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nombre}
                  className="grid h-9 w-9 place-items-center rounded-full border transition-colors hover:bg-white/10"
                  style={{ borderColor: "color-mix(in srgb, var(--invertido-texto) 22%, transparent)" }}
                >
                  <Icono className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columnas.map((c) => (
            <div key={c.titulo}>
              <h2
                className="dato mb-4 text-[0.7rem] uppercase tracking-[0.16em]"
                style={{ color: "var(--invertido-texto)", fontWeight: 600 }}
              >
                {c.titulo}
              </h2>
              <ul className="grid gap-2.5 text-sm">
                {c.enlaces.map((e) => (
                  <li key={e.href}>
                    <Link href={e.href} className="no-underline transition-colors hover:text-white">
                      {e.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2
              className="dato mb-4 text-[0.7rem] uppercase tracking-[0.16em]"
              style={{ color: "var(--invertido-texto)", fontWeight: 600 }}
            >
              Contacto
            </h2>
            <ul className="grid gap-2.5 text-sm">
              <li>
                <a href={`tel:${empresa.telefonoLink}`} className="dato no-underline hover:text-white">
                  {empresa.telefono}
                </a>
              </li>
              <li>
                <a href={`mailto:${empresa.email}`} className="no-underline hover:text-white">
                  {empresa.email}
                </a>
              </li>
              <li className="leading-relaxed">
                {empresa.direccion.calle}
                <br />
                {empresa.direccion.cp} {empresa.direccion.ciudad}
              </li>
              <li>
                <Link href="/contacto#alta" className="no-underline hover:text-white">
                  Solicitar alta de cliente
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-[0.75rem]"
          style={{ borderColor: "color-mix(in srgb, var(--invertido-texto) 15%, transparent)" }}
        >
          <p>
            © {new Date().getFullYear()} {empresa.razonSocial}. Todos los derechos reservados.
          </p>
          <nav aria-label="Enlaces legales" className="flex flex-wrap gap-5">
            <Link href="/aviso-legal" className="no-underline hover:text-white">Aviso legal</Link>
            <Link href="/privacidad" className="no-underline hover:text-white">Privacidad</Link>
            <Link href="/cookies" className="no-underline hover:text-white">Cookies</Link>
          </nav>
        </div>
      </Contenedor>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Aviso de cookies (RGPD)                                             */
/* ------------------------------------------------------------------ */

export function AvisoCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let decidido: string | null = null;
    try {
      decidido = localStorage.getItem("dr-cookies");
    } catch {
      /* navegación privada */
    }
    if (!decidido) {
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const decidir = (valor: string) => {
    try {
      localStorage.setItem("dr-cookies", valor);
    } catch {
      /* navegación privada */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="dialog"
          aria-label="Aviso de cookies"
          className="no-imprimir fixed bottom-4 left-4 right-4 z-[70] max-w-lg rounded-2xl border p-5 text-sm shadow-2xl"
          style={{ background: "var(--superficie)", borderColor: "var(--linea)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ color: "var(--texto-2)" }}>
            <strong style={{ color: "var(--texto)" }}>Usamos cookies.</strong> Solo las técnicas
            necesarias para que la web funcione y, si acepta, unas analíticas anónimas. Los detalles,
            en la <Link href="/cookies">política de cookies</Link>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => decidir("all")}
              className="rounded-full px-4 py-2 text-[0.8rem] font-semibold"
              style={{ background: "var(--acento-fuerte)", color: "var(--acento-contraste)" }}
            >
              Aceptar todas
            </button>
            <button
              type="button"
              onClick={() => decidir("essential")}
              className="rounded-full border px-4 py-2 text-[0.8rem] font-semibold"
              style={{ borderColor: "var(--linea)", color: "var(--texto)" }}
            >
              Solo necesarias
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
