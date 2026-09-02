# Contenido pendiente antes de publicar

Lista de todo lo que solo puede aportar la empresa, ordenado por impacto.
Cada punto indica dónde se toca.

---

## 🔴 Bloqueante

### 1. Logotipos oficiales

`assets/img/logo.svg` y `assets/img/logo-mark.svg` son una **reconstrucción
provisional**: un monograma «R» creado para poder maquetar. **No son los
logotipos de la marca.**

Hacen falta:

- Logotipo horizontal (lockup) en **SVG** → `assets/img/logo.svg`
- Isotipo cuadrado en **SVG** → `assets/img/logo-mark.svg`
- Colores corporativos exactos (referencias Pantone, HEX o el manual de marca)

Y después:

1. Regenerar `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180×180),
   `icon-192.png`, `icon-512.png` y `og.png` (1200×630) a partir del isotipo real.
2. Ajustar `--brand-500/600/700/100` en `assets/css/style.css`.
3. Sustituir el SVG **incrustado en línea** en la cabecera y el pie de cada
   página HTML: buscar `<svg class="brand__mark"` (aparece 3 veces por página).

> El logotipo va en línea para que cargue sin peticiones extra. Si se cambia el
> archivo pero no el SVG en línea, la web seguirá mostrando el provisional.

### 2. Confirmar datos de contacto

Verificados en registros públicos, **pendientes de confirmar con la empresa**:

| Dato | Valor usado | Origen |
|---|---|---|
| Razón social | Distribuciones Rodrigo, S.A. | Registro |
| CIF | A50165083 | Registro público |
| Domicilio | Ctra. de Logroño 2, Pol. Ind. El Portazgo, Nave 73 · 50011 Zaragoza | Registro |
| Teléfono | 976 31 33 12 | Web anterior |
| Correo | comercial@distribucionesrodrigo.com | Web anterior |
| Constitución | 2 de noviembre de 1986 | Registro |

Falta además el **horario real de atención**. Ahora se muestra un genérico
«Lunes a viernes» en la barra superior de todas las páginas y en el JSON-LD de
`contacto.html`. Sustituir por el horario concreto (p. ej. «L-V 8:00-18:00»).

---

## 🟠 Importante

### 3. Catálogo real

`data/productos.json` contiene **85 referencias de muestra**, plausibles para el
sector pero **inventadas**. La web afirma «más de 2.500 referencias», que es el
dato real de la empresa.

Lo correcto es exportar el catálogo desde el ERP al formato del archivo
(ver README, apartado «Añadir o modificar productos»). Si por política comercial
no se quiere publicar el catálogo completo, basta con una selección real
representativa: lo importante es que las referencias existan.

### 4. Fotografías

El sitio funciona sin fotos —usa composiciones abstractas de marca—, pero en
este sector **la foto real de la nave, las cámaras y la flota es el mejor
argumento comercial** que existe. Es la mejora de mayor impacto después del
logotipo.

| Archivo | Dónde aparece | Tamaño | Proporción |
|---|---|---|---|
| `assets/img/hero.jpg` | Portada, columna derecha | 1200×1500 | 4:5 |
| `assets/img/almacen.jpg` | Portada + Empresa | 1600×1200 | 4:3 |
| `assets/img/flota.jpg` | Servicios | 1600×1200 | 4:3 |
| `assets/img/camara-frio.jpg` | Calidad | 1600×1200 | 4:3 |
| `assets/img/equipo.jpg` | Empresa | 1600×1200 | 4:3 |

En el HTML, cada hueco tiene ya la etiqueta `<img>` escrita y comentada:
buscar `<!-- <img src="assets/img/` y descomentarla.

Recomendación: fotografía propia, con luz, sin banco de imágenes. WebP o JPEG
optimizado por debajo de 250 KB.

### 5. Certificaciones

`calidad.html` describe los controles (APPCC, trazabilidad, control de
temperatura) pero **no afirma tener ninguna certificación**, porque no consta.

Si la empresa tiene IFS Logistics, BRC, ISO 9001, ISO 22000, sello ecológico u
otras, hay que añadirlas: es de lo que más pesa en licitaciones de
colectividades. Hay un comentario `<!-- TODO CLIENTE -->` en el punto exacto.

### 6. Datos del Registro Mercantil

`aviso-legal.html` tiene pendiente el tomo, folio y hoja de inscripción.
Es un requisito del artículo 10 de la LSSI-CE.

---

## 🟡 Recomendable

### 7. Logotipos de proveedores

`proveedores.html` tiene un muro con 12 celdas vacías. Sustituir por los
logotipos reales de las marcas distribuidas (SVG o PNG transparente, 44 px de
alto). Hay instrucciones en un comentario dentro del archivo.

**Antes de publicar el logotipo de un proveedor, conviene confirmar con él que
autoriza su uso.**

### 8. Formularios conectados

Ahora abren el gestor de correo del visitante. Conviene conectarlos a un
servicio para no perder solicitudes (ver README, apartado «Hacer que los
formularios envíen de verdad»). Es un atributo por formulario.

### 9. Mapa con las coordenadas exactas

El mapa de `contacto.html` usa un recuadro aproximado de OpenStreetMap.
Ajustar el `bbox` a las coordenadas reales de la nave, o sustituirlo por la
ficha de Google Maps del negocio.

### 10. Perfil de empresa en Google

Alta o reclamación del **Perfil de Empresa de Google** con la dirección, el
teléfono y el horario exactamente iguales a los de la web. Para un mayorista
local es la palanca de captación más barata que hay.

### 11. Alta en buscadores

Tras publicar: dar de alta el dominio en **Google Search Console** y enviar
`sitemap.xml`. Bing se puede importar desde ahí.

### 12. Textos por revisar

Todo el contenido está redactado a partir de datos públicos de la empresa y de
su web anterior. Conviene que alguien de la casa revise, en particular:

- El bloque de trayectoria de `empresa.html`: las etapas por décadas son una
  reconstrucción razonable, no un histórico verificado.
- Las respuestas de preguntas frecuentes sobre **pedido mínimo, plazos y zonas
  de reparto**: están redactadas en genérico («se fija con el comercial»)
  precisamente porque no se conocen las condiciones reales.
- La cobertura descrita en `servicios.html`.

### 13. Analítica

No hay ninguna instalada, y por eso el banner de cookies es honesto y simple.
Si se añade Google Analytics o similar, hay que hacer tres cosas:
cargar el script **solo tras aceptar** en el banner, añadir su fila a la tabla
de `cookies.html`, y revisar `privacidad.html`. Hay un `<!-- TODO CLIENTE -->`
en el sitio exacto.

---

## Ideas para una segunda fase

Cosas que ningún competidor local del sector ofrece hoy y que darían ventaja real:

- **Área de cliente**: histórico de albaranes, facturas y repetición de pedido.
  Es la funcionalidad que más valoran los hosteleros y la que separa a los
  distribuidores grandes de los locales.
- **Pedido en línea** para clientes ya dados de alta, con tarifa personalizada.
- **Fichas técnicas descargables** por referencia (PDF con alérgenos), enlazadas
  desde cada tarjeta del catálogo. Resuelve de golpe el trabajo administrativo
  de las colectividades.
- **Consulta de la ruta de reparto** por código postal.
- **Novedades y producto de temporada** como sección editorial: ayuda al SEO y
  da motivo para volver a la web.
- **Versión en inglés** si hay actividad de importación o exportación.
