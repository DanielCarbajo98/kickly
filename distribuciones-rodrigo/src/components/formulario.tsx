"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { empresa } from "@/content/site";

/**
 * Formulario de contacto.
 *
 * El sitio es estático, así que por defecto compone un correo con los datos.
 * Para recibirlos por HTTP basta con pasar `endpoint` (Formspree, Netlify
 * Forms, Web3Forms o un servicio propio): entonces hace POST con FormData.
 */

export type Campo = {
  nombre: string;
  etiqueta: string;
  tipo?: "text" | "email" | "tel" | "textarea" | "select";
  requerido?: boolean;
  opciones?: string[];
  ayuda?: string;
  marcador?: string;
  ancho?: "medio" | "completo";
};

type Estado = { tipo: "ok" | "error"; mensaje: string } | null;

export function Formulario({
  campos,
  asunto,
  textoBoton = "Enviar",
  endpoint,
  className = "",
}: {
  campos: Campo[];
  asunto: string;
  textoBoton?: string;
  endpoint?: string;
  className?: string;
}) {
  const [estado, setEstado] = useState<Estado>(null);
  const [enviando, setEnviando] = useState(false);

  async function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // Trampa antispam: si un robot la rellena, no se envía nada.
    const trampa = form.elements.namedItem("empresa_web") as HTMLInputElement | null;
    if (trampa?.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const datos = new FormData(form);

    if (endpoint) {
      setEnviando(true);
      try {
        const r = await fetch(endpoint, { method: "POST", body: datos, headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error(String(r.status));
        form.reset();
        setEstado({ tipo: "ok", mensaje: "Mensaje enviado. Le respondemos en menos de 24 h laborables." });
      } catch {
        setEstado({
          tipo: "error",
          mensaje: `No hemos podido enviar el formulario. Escríbanos a ${empresa.email} o llame al ${empresa.telefono}.`,
        });
      } finally {
        setEnviando(false);
      }
      return;
    }

    const lineas: string[] = [];
    campos.forEach((c) => {
      const v = datos.get(c.nombre);
      if (v) lineas.push(`${c.etiqueta}: ${v}`);
    });
    window.location.href =
      `mailto:${empresa.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(lineas.join("\n"))}`;
    setEstado({
      tipo: "ok",
      mensaje: `Se abrirá su gestor de correo con el mensaje preparado. Si no ocurre, escriba a ${empresa.email}.`,
    });
  }

  return (
    <form onSubmit={alEnviar} className={`grid gap-4 ${className}`} noValidate>
      {campos.map((c) => (
        <div key={c.nombre} className={`grid gap-1.5 ${c.ancho === "medio" ? "sm:col-span-1" : ""}`}>
          <label htmlFor={c.nombre} className="text-[0.85rem] font-semibold" style={{ color: "var(--texto-2)" }}>
            {c.etiqueta}
            {c.requerido ? <span style={{ color: "var(--acento-fuerte)" }}> *</span> : null}
          </label>

          {c.tipo === "textarea" ? (
            <textarea
              id={c.nombre}
              name={c.nombre}
              required={c.requerido}
              placeholder={c.marcador}
              rows={5}
              className="w-full resize-y rounded-lg border px-3.5 py-2.5 text-[0.9rem] outline-none"
              style={{ background: "var(--superficie)", borderColor: "var(--linea)", color: "var(--texto)" }}
            />
          ) : c.tipo === "select" ? (
            <select
              id={c.nombre}
              name={c.nombre}
              required={c.requerido}
              defaultValue=""
              className="w-full rounded-lg border px-3.5 py-2.5 text-[0.9rem] outline-none"
              style={{ background: "var(--superficie)", borderColor: "var(--linea)", color: "var(--texto)" }}
            >
              <option value="" disabled>Seleccione una opción</option>
              {c.opciones?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input
              id={c.nombre}
              name={c.nombre}
              type={c.tipo ?? "text"}
              required={c.requerido}
              placeholder={c.marcador}
              className="w-full rounded-lg border px-3.5 py-2.5 text-[0.9rem] outline-none"
              style={{ background: "var(--superficie)", borderColor: "var(--linea)", color: "var(--texto)" }}
            />
          )}

          {c.ayuda ? (
            <span className="text-[0.75rem]" style={{ color: "var(--texto-3)" }}>{c.ayuda}</span>
          ) : null}
        </div>
      ))}

      {/* Trampa antispam, oculta a las personas */}
      <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden>
        <label htmlFor="empresa_web">No rellenar</label>
        <input id="empresa_web" name="empresa_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-2.5 text-[0.78rem] leading-relaxed" style={{ color: "var(--texto-3)" }}>
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0" style={{ accentColor: "var(--acento)" }} />
        <span>
          He leído y acepto la <a href="/privacidad">política de privacidad</a> y consiento el
          tratamiento de mis datos para gestionar esta solicitud.
        </span>
      </label>

      {estado ? (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className="rounded-lg border px-4 py-3 text-[0.85rem]"
          style={
            estado.tipo === "ok"
              ? { background: "var(--frio-suave)", borderColor: "var(--frio)", color: "var(--frio-fuerte)" }
              : { background: "var(--acento-suave)", borderColor: "var(--acento)", color: "var(--acento-fuerte)" }
          }
        >
          {estado.mensaje}
        </motion.p>
      ) : null}

      <button
        type="submit"
        disabled={enviando}
        className="mt-1 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-transform hover:-translate-y-px disabled:opacity-60"
        style={{ background: "var(--acento-fuerte)", color: "var(--acento-contraste)" }}
      >
        {enviando ? "Enviando…" : textoBoton}
      </button>
    </form>
  );
}
