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

**Pago único** (la web es tuya) o **cuota mensual** (mantenimiento incluido, sin permanencia).

| Plan | Único | Mensual | Para quién |
|---|---|---|---|
| Uno | 79 € | 9 €/mes | Existir en Google con lo básico |
| **Pro** | **149 €** | **15 €/mes** | El estándar de un negocio local |
| Studio | 349 € | 29 €/mes | Cuando la web *es* el negocio |

Extras: dominio 15 €/año · logotipo y kit de marca 89 € · fotografía editada 60 € ·
redacción profesional 70 € · segundo idioma 55 €.

**Unit economics orientativos (plan Pro, pago único):** ingreso 149 €, coste directo
(hosting + dominio + pasarela) ≈ 20 €/año, coste de revisión humana ≈ 30 min. El margen
sostiene un CAC de hasta ~50 €, lo que sitúa el canal rentable en SEO local, boca a boca
y prospección directa a negocios sin web; **no** en puja abierta de Google Ads.

**Palancas de crecimiento**, por orden de coste de adquisición:
1. Prospección directa: generar la web de un negocio sin web y enviársela hecha. El
   producto es el propio argumento de venta y generarla cuesta cero.
2. SEO local de cola larga: «web para peluquerías en Valencia», una landing por sector.
3. Recomendación de gestorías y asesorías, que ven a cientos de autónomos.
4. Marca blanca para agencias a partir de cinco webs.

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
    └── js/
        ├── config.js     ★ Planes, precios, extras, endpoint de pedidos
        ├── data/
        │   ├── industries.js  ★ 26 sectores: textos, servicios, FAQ, secciones
        │   └── themes.js      ★ 9 paletas, 5 tipografías, formas y utilidades de color
        ├── copywriter.js  Motor de redacción por sector y tono
        ├── generator.js   Motor de generación → documento HTML autocontenido
        ├── store.js       Estado del brief (localStorage) y codificación para compartir
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
- [ ] Conectar Stripe y quitar `DEMO_MODE`.
- [ ] Conectar el endpoint de pedidos.
- [ ] Sustituir los tres testimonios de ejemplo por reseñas reales (hoy van con su aviso).
- [ ] Contrastar de nuevo la tabla comparativa con los precios públicos vigentes.
- [ ] Registrar el dominio y decidir si Vitrina vive bajo `kickly.app` o por su cuenta.

Ideas para la siguiente iteración, por valor esperado:
- Segunda página (carta, catálogo o servicios) para el plan Studio.
- Edición de textos en línea desde la previsualización.
- Subida real de imágenes en lugar de enlaces.
- Versión en portugués y catalán, que son mercados naturales del mismo producto.
