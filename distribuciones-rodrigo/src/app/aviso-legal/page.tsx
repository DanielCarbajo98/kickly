import type { Metadata } from "next";
import { CabeceraPagina, TextoLegal } from "@/components/cabecera-pagina";
import { Contenedor, Seccion } from "@/components/ui";
import { empresa } from "@/content/site";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal y datos identificativos de Distribuciones Rodrigo, S.A., titular del sitio web distribucionesrodrigo.com.",
  alternates: { canonical: "/aviso-legal" },
};

const filas: [string, React.ReactNode][] = [
  ["Denominación social", empresa.razonSocial],
  ["CIF", empresa.cif],
  ["Domicilio social", `${empresa.direccion.calle} · ${empresa.direccion.cp} ${empresa.direccion.ciudad} (España)`],
  ["Teléfono", <a key="t" href={`tel:${empresa.telefonoLink}`}>{empresa.telefono}</a>],
  ["Correo electrónico", <a key="e" href={`mailto:${empresa.email}`}>{empresa.email}</a>],
  ["Actividad", "Comercio al por mayor de productos alimenticios, bebidas y tabaco (CNAE 4639)"],
  ["Registro Mercantil", "Datos de inscripción pendientes de completar (tomo, folio, hoja)"],
];

export default function AvisoLegalPagina() {
  return (
    <>
      <CabeceraPagina miga="Aviso legal" antetitulo="Información legal" titulo="Aviso legal" entradilla="Condiciones de uso del sitio web y datos identificativos de su titular, conforme a la Ley 34/2002 (LSSI-CE)." />
      <Seccion compacta>
        <Contenedor estrecho>
          <TextoLegal>
            <h2>1. Datos identificativos del titular</h2>
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, se facilitan los siguientes datos:</p>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--linea)" }}>
              <table className="w-full border-collapse text-[0.88rem]">
                <tbody>
                  {filas.map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row" className="border-b px-4 py-3 text-left align-top font-semibold" style={{ borderColor: "var(--linea)", background: "var(--superficie-alt)", color: "var(--texto)", width: "34%" }}>{k}</th>
                      <td className="border-b px-4 py-3" style={{ borderColor: "var(--linea)" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>2. Objeto y ámbito de aplicación</h2>
            <p>El presente aviso legal regula el acceso, la navegación y el uso de este sitio web. La navegación atribuye la condición de usuario e implica la aceptación plena de todas las cláusulas aquí recogidas, en la versión publicada en cada momento.</p>
            <p>Este sitio web tiene carácter informativo y comercial. No constituye una tienda en línea ni permite la contratación de productos: la relación comercial se formaliza mediante alta de cliente y las condiciones particulares acordadas con cada empresa.</p>

            <h2>3. Condiciones de uso</h2>
            <p>El usuario se compromete a hacer un uso adecuado y lícito del sitio web y de sus contenidos, absteniéndose de:</p>
            <ul>
              <li>Utilizarlos con fines contrarios a la ley, a la moral o al orden público.</li>
              <li>Difundir contenidos ilícitos, difamatorios o que vulneren derechos de terceros.</li>
              <li>Introducir programas, virus o cualquier elemento que pueda dañar los sistemas del titular o de terceros.</li>
              <li>Intentar acceder a áreas restringidas o alterar el funcionamiento del sitio.</li>
            </ul>

            <h2>4. Propiedad intelectual e industrial</h2>
            <p>Todos los contenidos del sitio web —textos, fotografías, gráficos, imágenes, iconos, tecnología, software, diseño gráfico y código fuente— son titularidad de {empresa.razonSocial} o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial.</p>
            <p>Las marcas, nombres comerciales y logotipos que aparecen en el sitio pertenecen a sus respectivos titulares. Su aparición no implica cesión de derechos ni relación de patrocinio más allá de la relación comercial de distribución existente.</p>
            <p>Queda prohibida la reproducción, distribución, comunicación pública o transformación, total o parcial, de los contenidos sin autorización expresa y por escrito del titular.</p>

            <h2>5. Exclusión de responsabilidad</h2>
            <p>El titular no garantiza la disponibilidad ininterrumpida del sitio web ni la ausencia de errores en sus contenidos, aunque emplea medios razonables para evitarlos y corregirlos.</p>
            <p>La información sobre productos publicada en este sitio es orientativa y puede variar sin previo aviso. Las características, formatos y disponibilidad vinculantes son los recogidos en la ficha técnica y en la tarifa vigente comunicada a cada cliente.</p>

            <h2>6. Enlaces a terceros</h2>
            <p>El sitio puede contener enlaces a páginas de terceros. El titular no se responsabiliza de los contenidos, políticas o prácticas de dichos sitios, cuyo acceso se realiza bajo la exclusiva responsabilidad del usuario.</p>

            <h2>7. Protección de datos</h2>
            <p>El tratamiento de los datos personales recogidos a través de este sitio se rige por la <a href="/privacidad">política de privacidad</a>. El uso de cookies se detalla en la <a href="/cookies">política de cookies</a>.</p>

            <h2>8. Legislación aplicable y jurisdicción</h2>
            <p>Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia, las partes se someten a los Juzgados y Tribunales de Zaragoza, salvo que la normativa aplicable establezca un fuero imperativo distinto.</p>

            <p className="mt-10 text-[0.82rem]" style={{ color: "var(--texto-3)" }}>Última actualización: septiembre de 2026.</p>
          </TextoLegal>
        </Contenedor>
      </Seccion>
    </>
  );
}
