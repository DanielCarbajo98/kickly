/**
 * Identidad de marca.
 *
 * El logotipo es una RECONSTRUCCIÓN a partir de la web de la empresa: forma
 * de píldora con marco azul marino, aro amarillo, banda roja con
 * "DISTRIBUCIONES" y la palabra "RODRIGO" en rojo. Los colores sí son los
 * reales, muestreados del original:
 *   rojo #EB4135 · marino #21528B · amarillo #FCEE4F
 * Sustituir por el SVG oficial en cuanto la empresa lo facilite.
 */

export function Logotipo({ className = "", titulo = "Distribuciones Rodrigo" }) {
  return (
    <svg viewBox="0 0 320 116" role="img" aria-label={titulo} className={className}>
      <title>{titulo}</title>
      {/* Marco exterior azul marino */}
      <rect
        x="4" y="4" width="312" height="108" rx="54"
        fill="var(--superficie)" stroke="#21528B" strokeWidth="8"
      />
      {/* Aro interior amarillo */}
      <rect
        x="16.5" y="16.5" width="287" height="83" rx="41.5"
        fill="none" stroke="#FCEE4F" strokeWidth="5"
      />
      {/* Banda roja con el nombre largo */}
      <rect x="108" y="25" width="104" height="15" rx="2.5" fill="#EB4135" />
      <text
        x="160" y="36.4" textAnchor="middle" fill="#ffffff"
        fontFamily="var(--font-display), Archivo, Arial, sans-serif"
        fontSize="9" fontWeight="700" letterSpacing="2.1"
      >
        DISTRIBUCIONES
      </text>
      {/* Palabra principal */}
      <text
        x="158" y="86" textAnchor="middle" fill="#EB4135"
        fontFamily="var(--font-display), Archivo, Arial, sans-serif"
        fontSize="46" fontWeight="800" letterSpacing="-0.5"
      >
        RODRIGO
      </text>
      {/* Subrayado corto, como en el original */}
      <rect x="66" y="90" width="128" height="5" rx="2.5" fill="#EB4135" />
    </svg>
  );
}

/** Versión compacta para la cabecera y el favicon. */
export function Isotipo({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <rect x="2" y="2" width="60" height="60" rx="17" fill="#21528B" />
      <rect
        x="8.5" y="8.5" width="47" height="47" rx="12.5"
        fill="none" stroke="#FCEE4F" strokeWidth="2.5"
      />
      <text
        x="32" y="46" textAnchor="middle" fill="#EB4135"
        fontFamily="var(--font-display), Archivo, Arial, sans-serif"
        fontSize="38" fontWeight="800"
      >
        R
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Iconografía: trazo uniforme, sin relleno, a 24×24                    */
/* ------------------------------------------------------------------ */

type IconoProps = { className?: string; style?: React.CSSProperties };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

export const Iconos = {
  telefono: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  ),
  correo: (p: IconoProps) => (
    <svg {...base} {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  ),
  pin: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  reloj: (p: IconoProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  check: (p: IconoProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5L16 9.5" />
    </svg>
  ),
  flecha: (p: IconoProps) => (
    <svg {...base} strokeWidth={2} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  camion: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M14 17V6a1 1 0 0 0-1-1H2v11h1" />
      <path d="M14 9h4l3 3v5h-2" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M8 17h7" />
    </svg>
  ),
  copo: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M12 2v20M4.2 7 19.8 17M19.8 7 4.2 17M12 6 9.5 3.5M12 6l2.5-2.5M12 18l-2.5 2.5M12 18l2.5 2.5" />
    </svg>
  ),
  termometro: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z" />
      <path d="M12 9v6" />
    </svg>
  ),
  escudo: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M12 22s8-3.5 8-10V5.5L12 2 4 5.5V12c0 6.5 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  caja: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  ),
  lupa: (p: IconoProps) => (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  personas: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 20v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </svg>
  ),
  cocinero: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M6 20h12M7 16h10l.6-6.2A4 4 0 1 0 12 5a4 4 0 1 0-5.6 4.8L7 16Z" />
    </svg>
  ),
  tienda: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M3 9 4.5 4h15L21 9M3 9h18v11H3V9Z" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
    </svg>
  ),
  nave: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M14 9h4a2 2 0 0 1 2 2v10" />
      <path d="M8 7h2M8 11h2M8 15h2M2 21h20" />
    </svg>
  ),
  hoja: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10 0 9-4 16-9 16Z" />
      <path d="M4 21c2-6 6-9 10-11" />
    </svg>
  ),
  pez: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M6.5 12c3-5 8.5-6.5 12.5-6.5.5 3.5-1 9-6.5 12.5" />
      <path d="M6.5 12C4 12 2 14 2 16c2.5 0 4.5-1 4.5-4Z" />
      <path d="M12.5 18c-2 1.5-4.5 1.5-6-.5" />
      <circle cx="16" cy="9" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  ),
  copa: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M5 4h13v6a6.5 6.5 0 0 1-13 0V4Z" />
      <path d="M18 6h1.5a2.5 2.5 0 0 1 0 5H18M3 21h17" />
    </svg>
  ),
  portapapeles: (p: IconoProps) => (
    <svg {...base} {...p}>
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
      <path d="m9 13 1.5 1.5L14 11" />
    </svg>
  ),
  ruta: (p: IconoProps) => (
    <svg {...base} {...p}>
      <circle cx="6" cy="19" r="3" />
      <circle cx="18" cy="5" r="3" />
      <path d="M9 19h4a5 5 0 0 0 0-10H8a5 5 0 0 1 0-10" />
    </svg>
  ),
  movil: (p: IconoProps) => (
    <svg {...base} {...p}>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  ),
  grafico: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M3 3v18h18" />
      <path d="m7 14 3.5-4 3 3L20 6" />
    </svg>
  ),
  menu: (p: IconoProps) => (
    <svg {...base} strokeWidth={2} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  cerrar: (p: IconoProps) => (
    <svg {...base} strokeWidth={2} {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  sol: (p: IconoProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  luna: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  ),
  facebook: (p: IconoProps) => (
    <svg {...base} {...p}>
      <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v8h3v-8h2.2l.8-3H14V9c0-.6.4-1 1-1Z" />
    </svg>
  ),
  linkedin: (p: IconoProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4" />
    </svg>
  ),
} as const;

export type NombreIcono = keyof typeof Iconos;
