import { Hero } from "@/components/hero";
import {
  BandaCTA, CadenaFrio, Cifras, Claim, Familias, Grupo, Preguntas, Segmentos, Ventajas,
} from "@/components/secciones-inicio";
import { dominio, preguntas } from "@/content/site";

const faqEstructurada = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: preguntas.map((p) => ({
    "@type": "Question",
    name: p.pregunta,
    acceptedAnswer: { "@type": "Answer", text: p.respuesta },
  })),
};

export const metadata = {
  alternates: { canonical: dominio },
};

export default function Inicio() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqEstructurada) }}
      />
      <Hero />
      <Cifras />
      <Familias />
      <Segmentos />
      <CadenaFrio />
      <Ventajas />
      <Grupo />
      <Claim />
      <Preguntas />
      <BandaCTA />
    </>
  );
}
