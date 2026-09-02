# Contenido pendiente antes de publicar

Lo que solo puede aportar la empresa, por orden de impacto.

---

## 🔴 Bloqueante

### 1. Logotipo oficial en vectorial

Los **colores ya son los reales**: se muestrearon del logotipo y de la web
anterior a partir de una captura.

| Rol | Hex | Dónde está en la marca |
|---|---|---|
| Rojo Rodrigo | `#EB4135` | Letras del logotipo |
| Azul marino | `#21528B` | Marco exterior del logotipo |
| Azul corporativo | `#4282BC` | Barra de contacto e iconos de la web |
| Amarillo | `#FCEE4F` | Aro interior del logotipo |
| Gris de menú | `#444444` | Barra de navegación anterior |

Lo que **no** es real es el dibujo del logotipo. `src/components/brand.tsx`
contiene una **reconstrucción**: píldora con marco marino, aro amarillo, banda
roja con «DISTRIBUCIONES» y la palabra «RODRIGO». Se parece, pero las
proporciones y la tipografía no son las originales.

Hace falta:

1. El **logotipo oficial en SVG** (lockup horizontal) y el isotipo.
2. Sustituir `Logotipo` e `Isotipo` en `src/components/brand.tsx`.
3. Regenerar `public/favicon.svg` y añadir `apple-touch-icon.png` (180×180)
   y una imagen social `og.png` (1200×630) a partir del original.

### 2. Confirmar datos de contacto

| Dato | Valor usado | Origen |
|---|---|---|
| Razón social | Distribuciones Rodrigo, S.A. | Registro |
| CIF | A50165083 | Registro público |
| Domicilio | Ctra. de Logroño 2, Pol. Ind. El Portazgo, Nave 73 · 50011 Zaragoza | Registro |
| Teléfono | 976 31 33 12 | Web de la empresa |
| Correo | calidad@distribucionesrodrigo.com | Web de la empresa |
| Constitución | 2 de noviembre de 1986 | Registro |

Dos cosas por confirmar:

- **El correo.** En la web aparece `calidad@`, que es el que se ha puesto. Si
  existe un buzón comercial (`comercial@`, `pedidos@`), es mejor ese para los
  formularios de alta de cliente. Está en `src/content/site.ts`.
- **El horario real.** Ahora pone un genérico «Lunes a viernes» en la barra
  superior. Sustituir por el horario concreto (p. ej. «L-V 8:00-18:00»).

---

## 🟠 Importante

### 3. Catálogo real

`src/content/productos.ts` tiene **85 referencias de muestra**, plausibles para
el sector pero **inventadas**. La web afirma «más de 2.500 referencias», que sí
es el dato real de la empresa.

Lo correcto es exportar el catálogo del ERP al formato del archivo (ver README).
Si no se quiere publicar el surtido completo, basta con una selección real: lo
importante es que las referencias existan.

### 4. Fotografías

El sitio funciona sin fotos —usa el panel de cadena de frío, degradados y
retículas— pero en este sector **la foto real de la nave, las cámaras y la
flota es el mejor argumento comercial que hay**.

Sugerencia de encuadres: nave y muelles, interior de cámara de congelación,
flota con la marca, equipo trabajando, preparación de pedido. Formato WebP o
JPEG por debajo de 250 KB.

### 5. Certificaciones

`/calidad` describe los controles (APPCC, trazabilidad, control de temperatura)
pero **no afirma tener ninguna certificación**, porque no consta. Si la empresa
tiene IFS Logistics, BRC, ISO 9001, ISO 22000 o sello ecológico, hay que
añadirlas: es de lo que más pesa en licitaciones de colectividades. Hay un
comentario `TODO CLIENTE` en el punto exacto.

### 6. Datos del Registro Mercantil

`/aviso-legal` tiene pendiente el tomo, folio y hoja de inscripción. Lo exige el
artículo 10 de la LSSI-CE.

---

## 🟡 Recomendable

### 7. Marcas de proveedores

La página de proveedores no muestra logotipos de marcas distribuidas porque no
se conocen. Si se quieren añadir, conviene **confirmar antes con cada proveedor
que autoriza el uso de su logotipo**.

### 8. Formularios conectados

Ahora abren el gestor de correo del visitante. Conviene conectarlos a un
servicio para no perder solicitudes (ver README).

### 9. Mapa con coordenadas exactas

El mapa de `/contacto` usa un recuadro aproximado de OpenStreetMap. Ajustar el
`bbox` a las coordenadas reales de la nave, o sustituirlo por la ficha de
Google Maps del negocio.

### 10. Perfil de Empresa de Google

Alta o reclamación del perfil, con dirección, teléfono y horario **exactamente
iguales** a los de la web. Para un mayorista local es la palanca de captación
más barata que existe.

### 11. Alta en buscadores

Tras publicar: dar de alta el dominio en Google Search Console y enviar
`sitemap.xml`. Bing se importa desde ahí.

### 12. Textos por revisar

El contenido se ha redactado a partir de datos públicos de la empresa y de su
web anterior. Conviene que alguien de la casa revise:

- El bloque de **trayectoria** de `/empresa`: las etapas por décadas son una
  reconstrucción razonable, no un histórico verificado.
- Las respuestas sobre **pedido mínimo, plazos y zonas de reparto**: están en
  genérico («se fija con el comercial») precisamente porque no se conocen las
  condiciones reales.
- La **cobertura** descrita en `/servicios`.

### 13. Analítica

No hay ninguna instalada, y por eso el banner de cookies es honesto y simple.
Si se añade Google Analytics o similar: cargar el script **solo tras aceptar**,
añadir su fila a la tabla de `/cookies` y revisar `/privacidad`. Hay un
`TODO CLIENTE` en el sitio exacto.

---

## Ideas para una segunda fase

Cosas que ningún competidor local ofrece hoy y que darían ventaja real:

- **Área de cliente**: histórico de albaranes, facturas y repetición de pedido.
  Es lo que más valoran los hosteleros y lo que separa a los distribuidores
  grandes de los locales.
- **Pedido en línea** para clientes ya dados de alta, con tarifa personalizada.
- **Fichas técnicas descargables** por referencia (PDF con alérgenos), enlazadas
  desde cada ficha del catálogo. Resuelve de golpe el trabajo administrativo de
  las colectividades.
- **Consulta de la ruta de reparto** por código postal.
- **Novedades y producto de temporada** como sección editorial: ayuda al SEO y
  da motivo para volver.
