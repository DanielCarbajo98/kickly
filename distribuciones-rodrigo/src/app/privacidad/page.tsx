import type { Metadata } from "next";
import { CabeceraPagina, TextoLegal } from "@/components/cabecera-pagina";
import { Contenedor, Seccion } from "@/components/ui";
import { empresa } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo trata Distribuciones Rodrigo, S.A. los datos personales recogidos a través de su sitio web, conforme al RGPD y la LOPDGDD.",
  alternates: { canonical: "/privacidad" },
};

const tratamientos = [
  ["Atender solicitudes de información y de alta de cliente", "Nombre, empresa, teléfono, correo, localidad y datos del negocio", "Consentimiento y medidas precontractuales", "Hasta resolver la solicitud; si no hay relación comercial, 1 año"],
  ["Gestión de la relación comercial con clientes", "Datos identificativos y fiscales, contacto, pedidos y facturación", "Ejecución del contrato y obligaciones legales", "Durante la relación y los plazos de prescripción fiscal y mercantil"],
  ["Gestión de propuestas de proveedores", "Datos de contacto profesional y documentación del producto", "Consentimiento y medidas precontractuales", "Hasta resolver la propuesta; en caso negativo, 1 año"],
  ["Procesos de selección de personal", "Datos curriculares y de contacto", "Consentimiento del candidato", "Máximo 1 año desde la recepción de la candidatura"],
];

export default function PrivacidadPagina() {
  return (
    <>
      <CabeceraPagina miga="Privacidad" antetitulo="Información legal" titulo="Política de privacidad" entradilla="Información sobre el tratamiento de datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD)." />
      <Seccion compacta>
        <Contenedor estrecho>
          <TextoLegal>
            <h2>1. Responsable del tratamiento</h2>
            <p>
              <strong>{empresa.razonSocial}</strong> · CIF {empresa.cif}<br />
              {empresa.direccion.calle} · {empresa.direccion.cp} {empresa.direccion.ciudad}<br />
              <a href={`mailto:${empresa.email}`}>{empresa.email}</a> · <a href={`tel:${empresa.telefonoLink}`}>{empresa.telefono}</a>
            </p>

            <h2>2. Qué datos tratamos y con qué finalidad</h2>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--linea)" }}>
              <table className="w-full min-w-[44rem] border-collapse text-[0.84rem]">
                <thead>
                  <tr>
                    {["Finalidad", "Datos tratados", "Base legal", "Conservación"].map((h) => (
                      <th key={h} className="dato border-b px-3 py-2.5 text-left text-[0.68rem] uppercase tracking-[0.08em]" style={{ borderColor: "var(--linea)", background: "var(--superficie-alt)", color: "var(--texto-2)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tratamientos.map((f) => (
                    <tr key={f[0]}>
                      {f.map((c, i) => (
                        <td key={i} className="border-b px-3 py-2.5 align-top" style={{ borderColor: "var(--linea)" }}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>3. Comunicación de datos a terceros</h2>
            <p>No cedemos datos personales a terceros salvo obligación legal. Pueden acceder a ellos, en calidad de encargados del tratamiento y con contrato firmado conforme al artículo 28 del RGPD, los proveedores de servicios necesarios para nuestra actividad: alojamiento web, correo electrónico, gestión administrativa y contable, y servicios de transporte cuando la entrega lo requiera.</p>

            <h2>4. Transferencias internacionales</h2>
            <p>No está prevista la realización de transferencias internacionales de datos. Si algún proveedor tecnológico las implicara, se realizarán con las garantías previstas en el capítulo V del RGPD.</p>

            <h2>5. Derechos de las personas interesadas</h2>
            <p>Puede ejercer en cualquier momento los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento prestado, escribiendo a <a href={`mailto:${empresa.email}`}>{empresa.email}</a> o a la dirección postal indicada, acreditando su identidad e indicando el derecho que desea ejercer.</p>
            <p>Si considera que el tratamiento no se ajusta a la normativa, puede presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a> (C/ Jorge Juan 6, 28001 Madrid).</p>

            <h2>6. Medidas de seguridad</h2>
            <p>Aplicamos las medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo, de acuerdo con el artículo 32 del RGPD, incluida la transmisión cifrada de los formularios mediante HTTPS.</p>

            <h2>7. Veracidad de los datos</h2>
            <p>La persona que facilita los datos garantiza que son ciertos y se compromete a comunicar cualquier modificación. Cuando se aporten datos de terceros, quien los facilita asume la responsabilidad de haberles informado previamente de lo previsto en esta política.</p>

            <p className="mt-10 text-[0.82rem]" style={{ color: "var(--texto-3)" }}>Última actualización: septiembre de 2026.</p>
          </TextoLegal>
        </Contenedor>
      </Seccion>
    </>
  );
}
