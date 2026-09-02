import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { BarraContacto, Cabecera } from "@/components/cabecera";
import { AvisoCookies, Pie } from "@/components/pie";
import { dominio, empresa } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(dominio),
  title: {
    default: "Distribuciones Rodrigo | Mayorista de alimentación en Zaragoza",
    template: "%s | Distribuciones Rodrigo",
  },
  description:
    "Mayorista de alimentación en Aragón desde 1986. Más de 2.500 referencias de congelado, refrigerado, charcutería, helados y despensa con reparto propio a restauración, colectividades y comercio.",
  applicationName: empresa.nombre,
  authors: [{ name: empresa.razonSocial }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: empresa.nombre,
    url: dominio,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#21528B" },
    { media: "(prefers-color-scheme: dark)", color: "#060d16" },
  ],
};

/** Datos estructurados del negocio, para buscadores. */
const datosEstructurados = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "Wholesaler"],
      "@id": `${dominio}/#organizacion`,
      name: empresa.razonSocial,
      url: `${dominio}/`,
      email: empresa.email,
      telephone: `+34 ${empresa.telefono}`,
      foundingDate: String(empresa.fundacion),
      slogan: empresa.claim,
      description:
        "Distribuidor mayorista de alimentación en Aragón: congelados, refrigerados, charcutería, helados y despensa para restauración, colectividades y comercio.",
      address: {
        "@type": "PostalAddress",
        streetAddress: empresa.direccion.calle,
        addressLocality: empresa.direccion.ciudad,
        postalCode: empresa.direccion.cp,
        addressRegion: empresa.direccion.region,
        addressCountry: empresa.direccion.pais,
      },
      areaServed: { "@type": "Country", name: "España" },
      numberOfEmployees: { "@type": "QuantitativeValue", minValue: 70 },
      sameAs: [empresa.redes.facebook, empresa.redes.linkedin],
    },
    {
      "@type": "WebSite",
      "@id": `${dominio}/#web`,
      url: `${dominio}/`,
      name: empresa.nombre,
      inLanguage: "es-ES",
      publisher: { "@id": `${dominio}/#organizacion` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${dominio}/productos?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

/** Fija el tema antes del primer pintado, para que no parpadee. */
const scriptTema = `
try {
  var t = localStorage.getItem("dr-tema");
  if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* La regla no-page-custom-font apunta al Pages Router. Aquí el enlace
            vive en el layout raíz, así que se aplica a todas las páginas. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..900&family=IBM+Plex+Mono:wght@400;500;600&family=Public+Sans:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
        />
      </head>
      <body>
        <Link
          href="#principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-3 focus:no-underline"
          style={{ background: "var(--invertido-fondo)", color: "var(--invertido-texto)" }}
        >
          Saltar al contenido principal
        </Link>
        <BarraContacto />
        <Cabecera />
        <main id="principal">{children}</main>
        <Pie />
        <AvisoCookies />
      </body>
    </html>
  );
}
