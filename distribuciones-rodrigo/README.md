# Distribuciones Rodrigo — sitio web

Sitio corporativo de **Distribuciones Rodrigo, S.A.** (Zaragoza), distribuidor
mayorista de alimentación a temperatura controlada.

HTML, CSS y JavaScript planos. **Sin framework, sin build, sin dependencias.**
Se edita con cualquier editor de texto y se publica copiando la carpeta.

---

## Estructura

```
index.html            Portada
empresa.html          Quiénes somos, trayectoria, valores, grupo, equipo
productos.html        Catálogo con buscador y filtros en vivo
servicios.html        Servicio, logística, cobertura y operativa
calidad.html          Seguridad alimentaria, cadena de frío y trazabilidad
proveedores.html      Propuesta para fabricantes + formulario de compras
contacto.html         Datos, alta de cliente y mapa
empleo.html           Trabaja con nosotros
aviso-legal.html      LSSI-CE
privacidad.html       RGPD / LOPDGDD
cookies.html          Política de cookies
404.html              Página de error

assets/css/style.css  ★ Sistema de diseño completo (tokens en :root)
assets/js/site.js     Tema, menú, animaciones, contadores, cookies, formularios
assets/js/catalogo.js Buscador del catálogo
assets/img/           Logotipos, iconos e imagen social
data/productos.json   ★ AQUÍ se edita el catálogo

robots.txt            Indexación
sitemap.xml           Mapa del sitio
site.webmanifest      Metadatos de aplicación web
```

---

## Cómo verlo en local

No hace falta compilar nada, pero el catálogo carga un JSON por `fetch`, y eso
no funciona abriendo el archivo con doble clic (`file://`). Levante un servidor:

```bash
cd distribuciones-rodrigo
python3 -m http.server 8000
# abrir http://localhost:8000
```

---

## Tareas habituales

### Cambiar los colores de marca

Todo el sitio deriva de cuatro variables. En `assets/css/style.css`, bloque `:root`:

```css
--brand-500: #b4172a;   /* color principal: botones, acentos */
--brand-600: #99101f;   /* texto de acento y estados hover */
--brand-700: #7a0c18;   /* variante más oscura */
--brand-100: #fdeceb;   /* fondo suave de acento */
```

Hay un bloque equivalente para el tema oscuro más abajo en el mismo archivo.
Si cambia los colores, **compruebe el contraste** (mínimo 4,5:1 para texto
normal) antes de publicar.

### Añadir o modificar productos

Edite `data/productos.json`. Cada referencia tiene esta forma:

```json
{
  "ref": "PES-0101",
  "nombre": "Merluza del Cabo lomo s/piel",
  "familia": "pescados",
  "subfamilia": "Pescado blanco",
  "temp": "congelado",
  "formato": "Caja 5 kg · IQF",
  "canal": ["restauracion", "colectividades"],
  "destacado": true
}
```

- `familia` debe coincidir con un `id` de la lista `familias` del mismo archivo.
- `temp`: `congelado` | `refrigerado` | `ambiente`.
- `canal`: cualquier combinación de `restauracion`, `colectividades`, `comercio`.
- `destacado`: opcional, sube la referencia en el orden por relevancia.

El buscador, los filtros y los contadores se actualizan solos. Lo natural es
exportar el catálogo desde el ERP a este formato con un script, en lugar de
mantenerlo a mano.

### Hacer que los formularios envíen de verdad

Ahora mismo los formularios validan y abren el gestor de correo del visitante
con el mensaje ya redactado. Para recibirlos por HTTP, añada `data-endpoint`
a la etiqueta `<form>`:

```html
<form class="form" data-contact-form data-endpoint="https://formspree.io/f/XXXX">
```

Sirve cualquier servicio que acepte un `POST` con `FormData`
(Formspree, Netlify Forms, Web3Forms, un endpoint propio…).
`assets/js/site.js` se encarga del envío, los estados y los errores.

### Publicar

Es un sitio estático: cualquier alojamiento vale.

- **Netlify / Vercel / Cloudflare Pages**: arrastrar la carpeta, o conectar el
  repositorio indicando esta carpeta como directorio raíz. Sin comando de build.
- **Hosting clásico (FTP)**: subir el contenido de la carpeta a `public_html`.

Después de publicar, en `robots.txt`, `sitemap.xml` y las etiquetas
`<link rel="canonical">` de cada página el dominio ya apunta a
`https://distribucionesrodrigo.com`. Si se publica en otro dominio, hay que
sustituirlo (una búsqueda y reemplazo).

---

## Qué incluye

**Diseño**
- Sistema de diseño con tokens: color, tipografía, espaciado, sombras y formas.
- Tema claro y oscuro. Sigue la preferencia del sistema y permite forzarlo.
- Responsive real, de 320 px a pantallas grandes.
- Hoja de estilos de impresión.

**Catálogo**
- Búsqueda instantánea, insensible a mayúsculas y tildes, por nombre,
  referencia, subfamilia, formato o canal.
- Filtros combinables por familia, temperatura y canal, con recuento por opción.
- El estado se refleja en la URL: los filtros se pueden compartir y enlazar.
- Atajo de teclado `/` para saltar al buscador.

**Accesibilidad**
- Contraste AA verificado en las 12 páginas y en los dos temas.
- Navegación completa por teclado, enlace de salto al contenido y foco visible.
- Jerarquía de encabezados correcta y landmarks semánticos.
- Respeta `prefers-reduced-motion`.
- **Funciona sin JavaScript**: todo el contenido es visible y los formularios
  y el acordeón siguen operativos.

**SEO**
- Metadatos y `canonical` únicos por página.
- Datos estructurados JSON-LD: `Organization`, `WebSite`, `LocalBusiness`,
  `BreadcrumbList` y `FAQPage`.
- Open Graph y Twitter Cards con imagen social.
- `sitemap.xml`, `robots.txt` y migas de pan.

**Cumplimiento**
- Aviso legal, política de privacidad y política de cookies redactados para
  España (LSSI-CE, RGPD y LOPDGDD).
- Banner de cookies con opción real de rechazar.
- Sin analítica ni rastreadores de terceros por defecto.

---

## Antes de publicar

Queda contenido que solo puede aportar la empresa. Está recogido, punto por
punto, en **[CONTENIDO-PENDIENTE.md](CONTENIDO-PENDIENTE.md)**.
