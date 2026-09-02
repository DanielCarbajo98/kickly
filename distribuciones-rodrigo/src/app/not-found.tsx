import { Boton, Contenedor, Seccion } from "@/components/ui";
import { empresa } from "@/content/site";

export const metadata = { title: "Página no encontrada" };

export default function NoEncontrada() {
  return (
    <Seccion>
      <Contenedor estrecho className="py-16 text-center">
        <p className="antetitulo mb-5 justify-center">Error 404</p>
        <h1 className="text-[clamp(2rem,1.5rem+2.6vw,3.4rem)]">Esta página se ha salido de la ruta</h1>
        <p className="mx-auto mt-6 max-w-[48ch] leading-relaxed" style={{ color: "var(--texto-2)" }}>
          La dirección que ha seguido no existe o ha cambiado. Pruebe desde el catálogo o díganos qué buscaba.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Boton href="/" tamano="lg">Volver al inicio</Boton>
          <Boton href="/productos" variante="linea" tamano="lg">Ir al catálogo</Boton>
        </div>
        <p className="mt-10 text-[0.85rem]" style={{ color: "var(--texto-3)" }}>
          ¿Necesita hablar con alguien? Llame al{" "}
          <a href={`tel:${empresa.telefonoLink}`} className="dato">{empresa.telefono}</a> o escriba a{" "}
          <a href={`mailto:${empresa.email}`}>{empresa.email}</a>.
        </p>
      </Contenedor>
    </Seccion>
  );
}
