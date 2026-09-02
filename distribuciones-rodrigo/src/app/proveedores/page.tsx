import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/cabecera-pagina";
import { Aparece, Comprobacion, Contenedor, Encabezado, Seccion } from "@/components/ui";
import { Formulario } from "@/components/formulario";

export const metadata: Metadata = {
  title: "Proveedores",
  description:
    "¿Fabrica o representa producto de alimentación? Distribuciones Rodrigo da acceso a la restauración, colectividades y comercio de Aragón con red comercial y plataforma de frío propias.",
  alternates: { canonical: "/proveedores" },
};

export default function ProveedoresPagina() {
  return (
    <>
      <CabeceraPagina
        miga="Proveedores"
        antetitulo="Proveedores"
        titulo="Buscamos producto que aguante una carta entera"
        entradilla="Detrás de nuestras 2.500 referencias hay fabricantes y marcas que llevan años trabajando con nosotros. Si fabrica o representa producto de alimentación y busca distribución en Aragón, hablemos."
      />

      <Seccion compacta>
        <Contenedor>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Encabezado antetitulo="Trabajar con nosotros" titulo="Qué aporta entrar en nuestra tarifa" entradilla="Damos acceso directo a la hostelería, las colectividades y el comercio de alimentación de Aragón, con una red comercial que visita al cliente en persona." className="mb-8" />
              <Comprobacion
                items={[
                  "Red comercial propia con visita presencial programada por zona",
                  "Plataforma de frío con 18.000 m³ negativo y 3.000 m³ positivo",
                  "Cobertura real de Aragón con dos bases de reparto",
                  "Rotación en cuatro canales: restauración, colectividades, comercio y distribución",
                ]}
              />
            </div>
            <div>
              <Encabezado antetitulo="Qué pedimos" titulo="Antes de incorporar una referencia" entradilla="Homologamos todo lo que entra en tarifa. No es burocracia: es lo que nos permite responder ante una auditoría de cliente o una alerta sanitaria." className="mb-8" />
              <Comprobacion
                items={[
                  "Ficha técnica completa y actualizada de cada referencia",
                  "Registro sanitario y documentación legal de la empresa",
                  "Información de alérgenos conforme al Reglamento (UE) 1169/2011",
                  "Condiciones de suministro estables: formato, paletización, plazo y mínimos",
                ]}
              />
            </div>
          </div>
        </Contenedor>
      </Seccion>

      <Seccion alt id="propuesta">
        <Contenedor estrecho>
          <Encabezado antetitulo="Contacto" titulo="Propónganos su producto" entradilla="Cuéntenos qué fabrica o representa, en qué familia encaja y con qué formato trabaja. Le responde el departamento de compras." className="mb-10" />
          <Aparece>
            <Formulario
              asunto="Propuesta de proveedor desde la web"
              textoBoton="Enviar propuesta"
              campos={[
                { nombre: "empresa", etiqueta: "Empresa", requerido: true },
                { nombre: "contacto", etiqueta: "Persona de contacto", requerido: true },
                { nombre: "email", etiqueta: "Correo electrónico", tipo: "email", requerido: true },
                { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel" },
                { nombre: "familia", etiqueta: "Familia de producto", tipo: "select", requerido: true, opciones: ["Pescados y mariscos", "Carnes y elaborados", "Charcutería y quesos", "Verduras y guarniciones", "Precocinados y V gama", "Panadería y bollería", "Helados y postres", "Conservas y despensa", "Envases y desechables", "Otra"] },
                { nombre: "mensaje", etiqueta: "Cuéntenos su propuesta", tipo: "textarea", requerido: true, marcador: "Producto, formatos, temperatura de conservación, capacidad de suministro, zonas donde ya distribuye…" },
              ]}
            />
          </Aparece>
        </Contenedor>
      </Seccion>
    </>
  );
}
