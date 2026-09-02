import type { Metadata } from "next";
import { CabeceraPagina, TextoLegal } from "@/components/cabecera-pagina";
import { Contenedor, Seccion } from "@/components/ui";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Qué cookies utiliza distribucionesrodrigo.com, para qué sirven y cómo gestionarlas o desactivarlas.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPagina() {
  return (
    <>
      <CabeceraPagina miga="Cookies" antetitulo="Información legal" titulo="Política de cookies" entradilla="Qué cookies utilizamos, para qué sirven y cómo puede gestionarlas desde su navegador." />
      <Seccion compacta>
        <Contenedor estrecho>
          <TextoLegal>
            <h2>1. Qué es una cookie</h2>
            <p>Una cookie es un pequeño archivo que un sitio web guarda en su dispositivo para recordar información sobre su visita: preferencias de idioma o de tema, o datos de uso agregados que ayudan a mejorar el sitio.</p>

            <h2>2. Cookies que utilizamos</h2>
            <p>Este sitio es informativo. Por defecto <strong>no instala cookies publicitarias ni de seguimiento de terceros</strong>. Utiliza el almacenamiento local del navegador para dos cosas estrictamente técnicas:</p>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--linea)" }}>
              <table className="w-full min-w-[36rem] border-collapse text-[0.85rem]">
                <thead>
                  <tr>
                    {["Nombre", "Tipo", "Finalidad", "Duración"].map((h) => (
                      <th key={h} className="dato border-b px-3 py-2.5 text-left text-[0.68rem] uppercase tracking-[0.08em]" style={{ borderColor: "var(--linea)", background: "var(--superficie-alt)", color: "var(--texto-2)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="dato border-b px-3 py-2.5" style={{ borderColor: "var(--linea)" }}>dr-tema</td>
                    <td className="border-b px-3 py-2.5" style={{ borderColor: "var(--linea)" }}>Técnica propia (localStorage)</td>
                    <td className="border-b px-3 py-2.5" style={{ borderColor: "var(--linea)" }}>Recordar si ha elegido el tema claro u oscuro.</td>
                    <td className="border-b px-3 py-2.5" style={{ borderColor: "var(--linea)" }}>Hasta que borre los datos del navegador</td>
                  </tr>
                  <tr>
                    <td className="dato border-b px-3 py-2.5" style={{ borderColor: "var(--linea)" }}>dr-cookies</td>
                    <td className="border-b px-3 py-2.5" style={{ borderColor: "var(--linea)" }}>Técnica propia (localStorage)</td>
                    <td className="border-b px-3 py-2.5" style={{ borderColor: "var(--linea)" }}>Recordar su decisión sobre este aviso para no volver a mostrarlo.</td>
                    <td className="border-b px-3 py-2.5" style={{ borderColor: "var(--linea)" }}>Hasta que borre los datos del navegador</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[0.82rem]">Ambas son necesarias para el funcionamiento del sitio y están exentas del deber de consentimiento previo conforme al artículo 22.2 de la LSSI-CE. No se comparten con terceros ni permiten identificarle personalmente.</p>

            <h2>3. Servicios de terceros</h2>
            <p>El sitio carga tipografías desde Google Fonts y, en la página de contacto, un mapa incrustado de OpenStreetMap. Estos servicios pueden registrar su dirección IP por motivos técnicos de entrega del contenido.</p>

            {/* TODO CLIENTE: si se añade Google Analytics, Meta Pixel o un chat en
                vivo, hay que (1) añadir su fila a la tabla, (2) cargar el script
                SOLO tras aceptar en el banner y (3) revisar la privacidad. */}

            <h2>4. Cómo gestionar las cookies</h2>
            <p>Puede permitir, bloquear o eliminar las cookies y el almacenamiento local desde la configuración de su navegador:</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>
            <p>Si elimina el almacenamiento local, el sitio volverá a mostrarle el aviso de cookies y olvidará su preferencia de tema.</p>

            <h2>5. Cambios en esta política</h2>
            <p>Podemos actualizar esta política cuando cambien los servicios utilizados o la normativa aplicable. La versión vigente es siempre la publicada en esta página.</p>

            <p className="mt-10 text-[0.82rem]" style={{ color: "var(--texto-3)" }}>Última actualización: septiembre de 2026.</p>
          </TextoLegal>
        </Contenedor>
      </Seccion>
    </>
  );
}
