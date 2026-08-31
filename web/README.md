# Vitrina

**Cuéntanos tu negocio. Te devolvemos su web.**

Producto independiente alojado dentro del repositorio de Kickly, en `/web/`. No comparte
código, estilos, datos ni identidad con el sitio deportivo: es un proyecto aparte que
simplemente vive en la misma carpeta. Ningún archivo de la raíz ha sido modificado.

En producción se sirve en `https://kickly.app/web/`. Para lanzarlo de verdad conviene
apuntarle un dominio propio (ver *Puesta en marcha*).

---

## 1. Qué es

Un generador de páginas web para negocios locales. El usuario contesta una encuesta de
siete pasos sobre su negocio y el motor devuelve una web terminada: diseño elegido según
el sector, textos redactados en castellano, SEO local montado y todo listo para publicar.
La ve entera y navegable **antes de pagar nada**, y si contrata, **se lleva el código fuente**.

No es un editor. No hay lienzo, ni bloques que arrastrar, ni curva de aprendizaje.

## 2. Por qué existe

El competidor real no es Wix: es **la web que nunca se llegó a hacer**. El dueño de una
peluquería o de un taller no quiere diseñar; quiere que le llamen. Las herramientas
actuales le piden precisamente lo que no tiene: tiempo, criterio visual y ganas de
aprender un editor. Las agencias le piden lo que no quiere gastar.

Vitrina elimina las tres barreras a la vez: tiempo (3 minutos), criterio (lo ponemos
nosotros) y riesgo (no paga hasta verlo).

## 3. Diferenciación

| | Vitrina | Wix / Squarespace | Generadores con IA | Agencia local |
|---|---|---|---|---|
| Tiempo hasta tenerla | 3 min | 8–20 h de trabajo propio | 1 min + arreglos | 3–8 semanas |
| Hay que aprender un editor | No | Sí | Sí, para retocar | No |
| Se ve antes de pagar | Entera, sin registro | Con marca de agua y cuenta | Registro obligatorio | Presupuesto primero |
| Textos por sector en castellano | Escritos, no traducidos | Los pone el cliente | Traducción automática | Sí, si se paga |
| Entrega del código | Siempre | Nunca | Casi nunca | Normalmente |
| Coste primer año | Desde 79 € una vez | 200–400 € | 150–300 € | 800–2.500 € |
| Si dejas de pagar | Te quedas la web | Desaparece | Desaparece | Sigue tuya |

> Datos de terceros orientativos, tomados de los planes de entrada publicados por cada
> proveedor y de tarifas habituales de estudios independientes en España a la fecha de
> redacción. Conviene revisarlos antes de cada campaña: son una afirmación pública.

**Las cinco palancas defendibles:**

1. **Pagas sólo si te gusta.** Invierte el riesgo. Es lo más difícil de copiar para un
   competidor con embudo de registro, porque le rompe la métrica de captación.
2. **Sin editor.** El producto se define tanto por lo que no tiene como por lo que tiene.
3. **Redacción sectorial real.** 26 sectores con vocabulario, servicios, objeciones y FAQ
   propias. Es contenido escrito a mano, no una traducción de plantilla americana.
4. **Sin lock-in.** Entregamos un único `.html` sin dependencias. Es un argumento de venta
   y, a la vez, un compromiso que ninguna plataforma grande puede igualar sin canibalizarse.
5. **Hecho para negocio local.** WhatsApp, llamada, mapa, horarios y reseñas: lo que se usa
   de verdad. No carritos que nadie va a tocar.

## 4. Modelo de negocio

Dos formas de contratar que **no son el mismo producto**, y la web lo explica así:

- **Comprar** (pago único): adquieres la web. Incluye el primer año de alojamiento,
  certificado y dominio. A partir del segundo año, 29 €/año de mantenimiento
  **opcional**: si no lo quieres, te llevas los archivos.
- **Suscripción** (cuota mensual): servicio continuo. Alojamiento, dominio, cambios
  ilimitados y soporte mientras dure. Sin permanencia.

| Plan | Comprar | Suscripción | Para quién |
|---|---|---|---|
| Uno | 79 € | 9 €/mes | Existir en Google con lo básico |
| **Pro** | **149 €** | **15 €/mes** | El estándar de un negocio local |
| Studio | 349 € | 29 €/mes | Cuando la web *es* el negocio |

Comprar sale más barato a partir del décimo mes. La página de precios lo enseña con
una tabla de coste acumulado a 1, 2 y 3 años, porque era justo lo que no se entendía.

El pago único se puede **fraccionar en 3 plazos con SeQura** (`FINANCIACION` en
`config.js`). Ojo: SeQura cobra comisión al comercio y exige contrato firmado — deja
`activa: false` hasta tenerlo cerrado. Para la cuota mensual, SeQura no es la
herramienta: usa domiciliación SEPA (mucho más barata en cobros recurrentes).

Extras: dominio 15 €/año · logotipo y kit de marca 89 € · fotografía editada 60 € ·
redacción profesional 70 € · segundo idioma 55 €.

### Economía unitaria (calculada, no estimada a ojo)

Con una mezcla 25/60/15 % entre Uno, Pro y Studio, valorando tu hora a 30 € y contando
45 minutos de entrega por web: **182,5 € de facturación media** y **123,5 € de margen
de contribución** por venta (68 %).

- Umbral de rentabilidad: **1,4 ventas/mes** el año 1 (con tarifa plana de autónomos);
  **3,2 ventas/mes** el año 2, cuando la cuota sube.
- Capital para arrancar: **672 €**, recuperado con 6 ventas.
- Techo de una persona a jornada completa: ~52 ventas/mes vendiendo a puerta fría
  (≈6.250 €/mes), ~157 ventas/mes con el canal de partners funcionando.

### Captación: la restricción real

Con 123,5 € de margen, **ningún canal de pago cuadra**. Google Ads con un CPC de 1,20 €
—optimista para este sector— ya sale a 136 € por cliente: pierde dinero en cada venta.
El negocio existe sólo con canales cuyo coste sea tu tiempo:

| Canal | Coste por cliente | % del margen |
|---|---|---|
| SEO local por sector | 18 € | 15 % |
| Referidos | 32,50 € | 26 % |
| Gestorías y partners | 43 € | 35 % |
| Prospección directa | 68,80 € | 56 % |
| Google Ads (CPC 3 €) | 341 € | **276 %** |

**Prospección directa** es el canal de arranque: generas la web de un negocio que no
tiene, se la mandas hecha y le ofreces publicarla. Generar cuesta cero, así que el
producto es su propio argumento de venta.

**Gestorías** es el canal que rompe la linealidad: baja el tiempo de captación por
venta de 2,3 horas a 16 minutos. Es lo único que hace que el negocio siga vendiendo
cuando tú no estás delante.

> El análisis completo —escenarios a 12 meses, riesgos y plan de acción— está en el
> documento de viabilidad. Los supuestos están todos listados y son discutibles; el
> más frágil es el de 45 minutos de entrega por web, que hay que medir de verdad
> desde la primera venta.

## 5. Cómo funciona por dentro

```
web/
├── index.html            Portada, con demo del motor generándose en vivo
├── crear.html            Encuesta de 7 pasos con autoguardado
├── preview.html          Previsualización + remezcla de estilo en tiempo real
├── pagar.html            Checkout, extras y resumen
├── gracias.html          Confirmación y siguientes pasos
├── precios.html          Precios detallados y comparativa de planes
├── marca.html            Manual de identidad completo
├── legal/                Aviso legal · Privacidad · Cookies · Términos
├── sitemap.xml
└── assets/
    ├── css/
    │   ├── vitrina.css   Sistema de diseño (tokens, botones, formularios)
    │   ├── landing.css   Componentes de marketing
    │   └── app.css       Encuesta, previsualización, checkout, manual
    ├── img/              Logotipo, isotipo, favicon, imagen social (SVG)
    │   └── stock/        (vacío) Aquí van las fotos de sector, si se activan
    └── js/
        ├── config.js     ★ Planes, precios, extras, endpoint de pedidos
        ├── data/
        │   ├── industries.js  ★ 26 sectores: textos, servicios, FAQ, secciones
        │   ├── themes.js      ★ 9 paletas, 5 tipografías, formas y utilidades de color
        │   ├── escenas.js     26 motivos de línea para la imaginería generada
        │   └── stock.js       ★ Banco de fotos por sector (vacío, listo para rellenar)
        ├── copywriter.js  Motor de redacción por sector y tono
        ├── generator.js   Motor de generación → documento HTML autocontenido
        ├── store.js       Estado del brief (localStorage) y codificación para compartir
        ├── precios-ui.js  Bloque de precios compartido por portada y página de precios
        ├── ui.js          Utilidades comunes
        ├── landing.js · wizard.js · preview.js · checkout.js · precios.js · gracias.js
```

Sin build, sin dependencias, sin framework. Módulos ES nativos servidos como estáticos,
igual que el resto del repositorio. Se despliega solo con el push a `main`.

### El motor de generación

`generateSite(brief)` devuelve `{ model, html }`, donde `html` es un documento completo
con el CSS en línea y **cero peticiones a terceros** salvo la tipografía. Pesa entre 30 y
40 KB. Tres capas:

1. **`copywriter.js`** — elige titular, entradilla, textos de sección y llamadas a la
   acción combinando el sector, el objetivo comercial y el tono de voz. La semilla se
   deriva del nombre del negocio, así que **la misma respuesta genera siempre la misma
   web**: no hay lotería entre recargas.
2. **`themes.js`** — construye la paleta. `ensureContrast()` empuja el color de acento
   hacia el texto hasta alcanzar el mínimo de contraste, de modo que ningún color elegido
   por el usuario puede romper la legibilidad.
3. **`generator.js`** — decide el orden de secciones según el objetivo, monta el HTML y
   añade los datos estructurados (`LocalBusiness` correspondiente al sector y `FAQPage`).

Verificado: **3.744 combinaciones** de sector × tema × portada × tono × objetivo se
generan sin errores, y las 9 paletas cumplen AA (texto ≥ 7:1, secundario ≥ 4.5:1,
acento ≥ 3:1).

### Las imágenes de las webs generadas

Un negocio recién dado de alta rara vez tiene fotos decentes. En vez de dejar huecos
vacíos, cada imagen se **compone**: fondo derivado de la paleta del sitio, un motivo de
línea propio del sector (26 motivos, 6 por sector para que una galería no se repita) y
geometría de apoyo. Pesa poco, es determinista y no depende de nadie.

**Sobre poner fotos de stock.** Está soportado y basta con rellenar
`assets/js/data/stock.js`, pero léelo antes: poner la foto de otro restaurante en la
web de un restaurante real engaña a su cliente, y enlazar al CDN de un banco de
imágenes rompe la promesa de que la web no carga nada de terceros. Si activas fotos,
**descárgalas y sírvelas desde `assets/img/stock/`**. El generador prefiere, por este
orden: foto del negocio → banco de stock → composición generada.

### Privacidad por diseño

Las respuestas de la encuesta viven en el `localStorage` del visitante. **No llegan al
servidor hasta que confirma un pedido.** Por eso el sitio no necesita banner de cookies:
no hay analítica, ni píxeles, ni terceros.

## 6. Puesta en marcha

Todo lo que hay que tocar está en `assets/js/config.js`.

1. **Cobrar.** Crea un Payment Link en Stripe por plan y pégalo en `PLANS[].link`
   (y `linkSub` para la cuota). Después pon `DEMO_MODE = false`.
   Mientras `DEMO_MODE` siga en `true`, el checkout registra el pedido y avisa de que
   todavía no se cobra: sirve para validar demanda antes de montar la pasarela.
2. **Recibir los pedidos.** Rellena `ORDER_ENDPOINT` con una URL de Formspree, Basin, un
   webhook de Make/Zapier o una Edge Function de Supabase. El pedido se envía como JSON
   con el brief completo. Si se deja vacío, el pedido queda guardado en el navegador y la
   pantalla de gracias lo recupera.
3. **Datos de la empresa.** Ajusta `BRAND` (email, teléfono, dominio) y **completa los
   campos entre corchetes de las cuatro páginas legales**: sin eso no se puede abrir al
   público.
4. **Dominio propio.** Recomendado para lanzar. Añade el dominio en Vercel apuntando a
   `/web` y actualiza los `canonical`, los `og:url` y `sitemap.xml`, que hoy apuntan a
   `kickly.app/web/`.
5. **Sitemap.** Opcionalmente, añade a `robots.txt` de la raíz la línea
   `Sitemap: https://kickly.app/web/sitemap.xml`. No se ha tocado para no alterar el
   sitio existente.

### Desarrollo local

```bash
npx http-server -p 8099 .    # y abre http://127.0.0.1:8099/web/
```
Hace falta servirlo por HTTP: los módulos ES no funcionan abriendo el archivo con `file://`.

## 7. Ampliar el catálogo

**Añadir un sector** — un objeto en `assets/js/data/industries.js` con `words`, `hero`,
`services`, `sections`, `faq` y `theme`. Aparece solo en la encuesta y en la marquesina.

**Añadir una paleta** — un objeto en `THEMES` (`assets/js/data/themes.js`). Comprueba el
contraste antes de darlo por bueno; el bloque de verificación del README se hizo con
`contrast()`, exportada del mismo archivo.

**Cambiar precios** — sólo `PLANS` y `ADDONS` en `config.js`. La portada, la página de
precios y el checkout leen de ahí.

## 8. Estado y siguientes pasos

Funciona de extremo a extremo: encuesta → generación → previsualización → remezcla →
checkout → confirmación, verificado en navegador sin errores de consola.

Pendiente antes de facturar al primer cliente:
- [ ] Rellenar los datos del titular en las cuatro páginas legales y revisarlas con un asesor.
- [ ] Registrar `vitrina.es` (los canonicals y el sitemap todavía apuntan a `kickly.app/web/`).
- [ ] Comprobar «vitrina» en las bases de la OEPM y la EUIPO (clases 35 y 42) y registrar
      la **marca mixta**, no la denominativa: es un sustantivo común y como denominativa
      probablemente choque con la falta de carácter distintivo.
- [ ] Conectar Stripe y quitar `DEMO_MODE`.
- [ ] Firmar con SeQura antes de dejar `FINANCIACION.activa` en `true`.
- [ ] Conectar el endpoint de pedidos.
- [ ] **Acotar «cambios ilimitados» en los términos**: 30 días ilimitados y después
      bonos. Es la fuga de margen más probable del modelo.
- [ ] Sustituir los tres testimonios de ejemplo por reseñas reales (hoy van con su aviso).
- [ ] Contrastar de nuevo la tabla comparativa con los precios públicos vigentes.

Ideas para la siguiente iteración, por valor esperado:
- Segunda página (carta, catálogo o servicios) para el plan Studio.
- Edición de textos en línea desde la previsualización.
- Subida real de imágenes en lugar de enlaces.
- Versión en portugués y catalán, que son mercados naturales del mismo producto.
