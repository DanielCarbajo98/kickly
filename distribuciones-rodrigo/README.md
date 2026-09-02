# Distribuciones Rodrigo — web corporativa

Sitio de **Distribuciones Rodrigo, S.A.** (Zaragoza), distribuidor mayorista de
alimentación a temperatura controlada.

**Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Motion**

Se exporta como sitio estático, así que se puede alojar en cualquier sitio
—Vercel, Netlify, Cloudflare Pages o un FTP clásico— sin servidor Node.

---

## Arrancar

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # genera out/ listo para publicar
npm run lint     # ESLint
npm run typecheck
```

---

## Estructura

```
src/
  app/                    Rutas (App Router). Una carpeta por página.
    layout.tsx            Cabecera, pie, fuentes, JSON-LD y tema
    page.tsx              Portada
    productos/            Catálogo con buscador
    empresa/ servicios/ calidad/ proveedores/ contacto/ empleo/
    aviso-legal/ privacidad/ cookies/
    not-found.tsx         404
    sitemap.ts robots.ts  SEO generados en build
    globals.css           ★ Sistema de diseño completo

  components/
    brand.tsx             Logotipo, isotipo e iconografía
    cabecera.tsx          Barra de contacto, navegación, tema, menú móvil
    pie.tsx               Pie y aviso de cookies
    hero.tsx              Portada: titular y panel de frío
    panel-frio.tsx        Panel animado de la cadena de frío
    secciones-inicio.tsx  Cifras, familias, segmentos, cadena, grupo, FAQ
    catalogo.tsx          Buscador, filtros y fichas
    formulario.tsx        Formulario reutilizable
    ui.tsx                Contenedor, Sección, Botón, Contador, Tarjeta…

  content/
    site.ts               ★ Datos de la empresa y textos
    productos.ts          ★ Catálogo

  lib/motion.ts           Curvas y variantes de animación
```

Los dos archivos marcados con ★ son los que se tocan para actualizar contenido.

---

## Tareas habituales

### Cambiar textos o datos de contacto

Todo está en `src/content/site.ts`: teléfono, correo, dirección, cifras,
segmentos de cliente, ventajas, empresas del grupo y preguntas frecuentes.
No hay textos sueltos repartidos por los componentes.

### Añadir o modificar productos

`src/content/productos.ts`. Cada referencia es un objeto tipado:

```ts
{
  ref: "PES-0101",
  nombre: "Merluza del Cabo lomo s/piel",
  familia: "pescados",
  subfamilia: "Pescado blanco",
  temp: "congelado",              // congelado | refrigerado | ambiente
  formato: "Caja 5 kg · IQF",
  canal: ["restauracion", "colectividades"],
  destacado: true,                // opcional: sube en relevancia
}
```

TypeScript avisa si `familia`, `temp` o `canal` no son válidos. El buscador,
los filtros y los recuentos se actualizan solos. Lo natural es generar este
archivo desde el ERP con un script.

### Ajustar los colores de marca

`src/app/globals.css`, bloque `@theme`. Los valores actuales están muestreados
del logotipo y de la web anterior:

```css
--color-rojo-500:   #eb4135;   /* letras del logotipo */
--color-marino-500: #21528b;   /* marco del logotipo */
--color-azul-500:   #4282bc;   /* barra de contacto e iconos */
--color-amarillo-500: #fcee4f; /* aro interior del logotipo */
```

Debajo, el bloque de **tokens semánticos** (`--acento`, `--frio`, `--texto`…)
es lo que usan los componentes. Nunca se escribe un color literal en un
componente: así los dos temas siguen cuadrando.

> Ojo con el contraste: el rojo de marca (#EB4135) da 3,9:1 con blanco encima,
> por debajo del mínimo AA. Por eso los botones usan `--acento-fuerte`
> (#d32d21, 5,0:1) y el #EB4135 queda para el logotipo y los acentos.

### Conectar los formularios

Ahora abren el gestor de correo del visitante. Para recibirlos por HTTP, pase
`endpoint` al componente:

```tsx
<Formulario endpoint="https://formspree.io/f/XXXX" … />
```

Sirve cualquier servicio que acepte `POST` con `FormData` (Formspree, Netlify
Forms, Web3Forms o un endpoint propio).

### Publicar

```bash
npm run build     # deja el sitio en out/
```

- **Vercel / Netlify / Cloudflare Pages**: conectar el repositorio indicando
  esta carpeta como raíz. Detectan Next.js solos.
- **Hosting clásico (FTP)**: subir el contenido de `out/` a `public_html`.

El dominio está en `src/content/site.ts` (`dominio`). De ahí salen los
`canonical`, el `sitemap.xml`, el `robots.txt` y los datos estructurados.

---

## Qué incluye

**Diseño**
- Sistema de tokens: cambiar cuatro variables reajusta toda la identidad.
- Tema claro y oscuro, siguiendo la preferencia del sistema y con conmutador
  que se recuerda entre visitas, sin parpadeo al cargar.
- Tipografía: Archivo (titulares, con eje de anchura), Public Sans (texto) e
  IBM Plex Mono (temperaturas, referencias y volúmenes).
- Responsive de 320 px en adelante.

**Movimiento** (todo respeta `prefers-reduced-motion`)
- Entrada del titular por máscara, escalonada.
- Panel de cadena de frío con lectura de temperatura viva y el pedido
  recorriendo el raíl.
- La cadena de frío se rellena **con el scroll**: el raíl traza el recorrido
  a medida que se lee.
- Contadores que cuentan al entrar en pantalla.
- Pastilla que se desliza entre pestañas y en la navegación (`layoutId`).
- El catálogo reordena las fichas con animación de layout al filtrar.

**Catálogo**
- Búsqueda instantánea, insensible a mayúsculas y tildes, por nombre,
  referencia, subfamilia o formato.
- Filtros combinables por familia, temperatura y canal, con recuento por opción.
- El estado va en la URL: `?familia=helados&temp=congelado` se puede compartir.
- Atajo `/` para saltar al buscador.

**Accesibilidad**
- Contraste AA verificado en las 12 páginas y en los dos temas.
- Navegación por teclado, enlace de salto y foco visible.
- Jerarquía de encabezados correcta y landmarks semánticos.

**SEO**
- Metadatos y `canonical` por página con la API de metadata de Next.
- JSON-LD: `Organization`, `WebSite`, `LocalBusiness` y `FAQPage`.
- `sitemap.xml` y `robots.txt` generados en build.

**Cumplimiento**
- Aviso legal, privacidad y cookies redactados para España (LSSI-CE, RGPD,
  LOPDGDD), con banner que permite rechazar de verdad.
- Sin analítica ni rastreadores de terceros por defecto.

---

## Antes de publicar

Queda contenido que solo puede aportar la empresa:
**[CONTENIDO-PENDIENTE.md](CONTENIDO-PENDIENTE.md)**.
