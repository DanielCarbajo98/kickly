import type { MetadataRoute } from "next";
import { dominio } from "@/content/site";

export const dynamic = "force-static";

const rutas: { ruta: string; prioridad: number; frecuencia: "weekly" | "monthly" | "yearly" }[] = [
  { ruta: "", prioridad: 1.0, frecuencia: "weekly" },
  { ruta: "/productos", prioridad: 0.9, frecuencia: "weekly" },
  { ruta: "/empresa", prioridad: 0.8, frecuencia: "monthly" },
  { ruta: "/servicios", prioridad: 0.8, frecuencia: "monthly" },
  { ruta: "/contacto", prioridad: 0.8, frecuencia: "monthly" },
  { ruta: "/calidad", prioridad: 0.7, frecuencia: "monthly" },
  { ruta: "/proveedores", prioridad: 0.6, frecuencia: "monthly" },
  { ruta: "/empleo", prioridad: 0.5, frecuencia: "monthly" },
  { ruta: "/aviso-legal", prioridad: 0.2, frecuencia: "yearly" },
  { ruta: "/privacidad", prioridad: 0.2, frecuencia: "yearly" },
  { ruta: "/cookies", prioridad: 0.2, frecuencia: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date();
  return rutas.map((r) => ({
    url: `${dominio}${r.ruta}`,
    lastModified: hoy,
    changeFrequency: r.frecuencia,
    priority: r.prioridad,
  }));
}
