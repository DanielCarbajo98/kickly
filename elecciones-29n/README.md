# TestElectoral.es — Test de afinidad política · Elecciones generales 29N 2026

Web estática e independiente: test de afinidad política para las elecciones generales del **29 de noviembre de 2026**. Tiene 44 afirmaciones, 11 partidos y el resultado incluye "en qué coincides y en qué discrepas" con cada uno. Está preparada para SEO y monetización con AdSense.

## Estructura

```
src/config.mjs     ★ marca, dominio, datos del titular (LSSI) y anuncios
src/data.mjs       ★ partidos, afirmaciones y posiciones (con justificación)
src/content.mjs      calendario electoral y preguntas frecuentes
src/build.mjs        generador de todas las páginas → public/
tools/images.mjs     regenera og.png y los iconos (opcional)
public/              ← lo que se publica (ya generado)
  assets/quiz.js     motor del test (todo en el navegador)
  assets/site.js     anuncios, cuenta atrás
  assets/style.css   diseño (claro y oscuro)
```

Tras cambiar algo en `src/`, ejecuta `node src/build.mjs`. Eso regenera `public/`, incluidos el `sitemap.xml`, `robots.txt` y `ads.txt`.

## Páginas que se generan (108 indexables)

| Tipo | URL | Búsquedas que ataca |
|---|---|---|
| Portada | `/` | test político 29N, a quién votar 2026 |
| Test | `/test/` | test electoral, qué partido votar |
| Resultado | `/resultado/#r=…` | (noindex; enlace para compartir en WhatsApp) |
| 11 fichas de partido | `/partidos/pp/` … | programa PP 2026, propuestas Vox 29N… |
| 10 temas | `/temas/vivienda/` … | qué proponen los partidos sobre vivienda… |
| ~45 comparativas | `/comparar/pp-vs-vox/` … | PP o Vox, PSOE o Sumar… |
| Calendario | `/calendario-electoral-29n/` | calendario elecciones 29N |
| Voto por correo | `/voto-por-correo-29n/` | voto por correo 29N plazo |
| Encuestas | `/encuestas/` | encuestas elecciones generales 2026, quién va ganando |
| Actualidad | `/actualidad/` y una página por noticia | noticias PSOE/PP/Vox 29N… |
| Guías | `/como-votar-29n/`, `/mesa-electoral-29n/` | mesa electoral cuánto se cobra, cómo votar |
| Legales | `/metodologia/`, `/aviso-legal/`, `/privacidad/`, `/cookies/`, `/condiciones/` | — |

## Publicar en Cloudflare Pages (recomendado: gratis y con uso comercial permitido)

1. **Dominio:** cuando lo tengas, cambia `domain`, `siteUrl` y `email` en `src/config.mjs` y ejecuta `node src/build.mjs`.
2. **Crear el proyecto:** en Cloudflare → Workers & Pages → Create → Pages → *Connect to Git* → este repo.
   - **Production branch:** la rama que quieras publicar.
   - **Build command:** vacío. `public/` ya está generado.
   - **Root directory:** `elecciones-29n`
   - **Build output directory:** `public`
   - Las funciones de pago (`functions/api/`) se despliegan solas.
3. **Variables:** en Settings → Variables and Secrets añade `STRIPE_SECRET_KEY` (tipo *Secret*) y `SITE_URL` = `https://tudominio.es`.
4. **Dominio personalizado:** en Custom domains añade tu dominio. Lo más fácil es pasar los DNS del dominio a Cloudflare, que es gratis.
5. **Analítica sin cookies (opcional):** activa Cloudflare Web Analytics, que es gratis.

**Plan gratuito:** permite uso comercial, tráfico web ilimitado y 100.000 peticiones al día a las funciones. Solo se usan al pagar, así que sobra.

*Alternativa Vercel:* Root Directory `elecciones-29n`, usa `api/` y `vercel.json`. Necesita el plan Pro para uso comercial. Si lo usas, pon `hosting: "vercel"` en `config.mjs`.

## Informe completo de pago (Stripe)

1. Crea la cuenta en stripe.com con tus datos fiscales y tu cuenta bancaria.
2. En Settings → Payment methods, deja activadas Tarjeta, Apple Pay y Google Pay. En Settings → Branding, sube el logo.
3. Revisa que Settings → Invoices tenga tus datos fiscales: el checkout genera factura o recibo automáticamente.
4. **Prueba en modo test**: tarjeta `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC.
5. Cuando funcione, cambia la clave a `sk_live_…`.

El precio se define en dos sitios que deben coincidir: `api/_stripe.js` (`PRICE_CENTS = 199`) y `src/config.mjs` (`payments.priceLabel`). Con `payments.enabled: false` el informe completo pasa a ser gratis.

**Fiscalidad:** los ingresos hay que declararlos (alta de autónomo o actividad económica, IVA trimestral, modelo 303). Verifactu será obligatorio para autónomos desde el 1 de julio de 2027. Consúltalo con un gestor.

## Publicidad (AdSense)

1. Da de alta el dominio en AdSense y pega tu `ca-pub-…` en `config.mjs → ads.adsenseClient`. Crea los bloques de anuncio y pega sus IDs en `ads.slots`, después ejecuta `node src/build.mjs`. El `ads.txt` se genera solo.
2. **Consentimiento de cookies (obligatorio en la UE):** en AdSense → *Privacidad y mensajes* → activa el mensaje RGPD, que es la CMP certificada de Google.
3. **Modelo:** resultado básico gratis con anuncios e informe completo de pago.
   - **No actives el Offerwall** en `/resultado/`: chocaría con el pago.
   - Quien paga no ve anuncios en su resultado, porque en esa página AdSense solo se carga si el informe no está desbloqueado.
4. **No pongas anuncios en pantallas sin contenido** ni recompenses ver anuncios fuera de los formatos oficiales: va contra las políticas de AdSense.
5. Puedes activar los anuncios automáticos de anclaje y viñeta.
6. No mezcles redes de *popunders* (Monetag y similares) con AdSense.

## Encuestas y actualidad (actualizar a mano o con una tarea programada)

- **Encuestas:** añade cada sondeo nuevo arriba en `src/polls.mjs` con su encuestadora, medio, fechas de campo, muestra y URL, y cambia `pollsUpdated`.
- **Noticias:** añade cada noticia arriba en `src/news.mjs`. Escríbela **siempre con tus propias palabras** y enlaza la fuente. No copies textos de medios: la ley protege a los editores de prensa.
- Después, `node src/build.mjs`, commit y push.

### ⚠️ Veda de encuestas (art. 69.7 LOREG)
Del **24 de noviembre a las 00:00** hasta el **29 de noviembre a las 21:00** está prohibido publicar o difundir encuestas.
- La página `/encuestas/` las oculta sola en el navegador durante ese periodo.
- Las noticias con encuestas (`poll: true`) se excluyen si se compila en esas fechas.
- **Aun así, ejecuta `node src/build.mjs` y publica el 23 de noviembre por la noche**, para que los datos no estén ni en el HTML.

## Legalidad: lo que está hecho y lo que debes hacer tú

Hecho:
- **Datos de opinión política (art. 9 RGPD)**: el test se calcula en el navegador y las respuestas **no se envían ni se guardan** en ningún servidor. No hay registro ni email.
- **No es una encuesta (art. 69 LOREG)**: no se publican resultados agregados de usuarios. Así no hay riesgo con la prohibición de difundir sondeos del 24 al 28 de noviembre.
- **Imparcialidad**: misma escala y fórmula para todos los partidos, justificación pública de cada posición, metodología publicada, canal de correcciones y sin logotipos de partidos.
- **Publicidad política**: excluida expresamente (Reglamento UE 2024/900). No vendas patrocinios a partidos.
- Aviso legal (LSSI art. 10), privacidad (RGPD), cookies (LSSI art. 22) y condiciones de venta (TRLGDCU).
- **Venta del informe:** precio con IVA visible, casilla obligatoria de renuncia al desistimiento (art. 103.m TRLGDCU), registrada en los metadatos de Stripe y en el pie de la factura, y garantía de conformidad con devolución si falla.
- **Encuestas de terceros** con su ficha técnica y veda automática del 24 al 29 de noviembre.
- **Noticias** de redacción propia, con enlace a la fuente.

Pendiente para ti:
- [ ] Completar en `config.mjs → owner` los apellidos, el código postal y el municipio. Están marcados con [ ].
- [ ] Activar la CMP de Google antes de mostrar anuncios.
- [ ] Crear el email de contacto (`hola@tudominio`).
- [ ] Si facturas con la web, darte de alta como autónomo o declarar los ingresos.

**No vendas emails ni datos.** Un email asociado al resultado del test es un dato de opinión política (categoría especial del RGPD). Venderlo o cederlo es una infracción muy grave, con multas de hasta 20 M€ o el 4% de la facturación. Si quieres una lista de correo, que sea solo una newsletter propia con consentimiento expreso y sin vincularla a las respuestas.

## Mantenimiento (importante)

Las posiciones están revisadas a **14 de octubre de 2026**. Los programas oficiales aún no se han publicado. Las marcadas "(estimada)" en `data.mjs` deben revisarse cuando salgan.

- **16-17 oct**: confirmar el candidato del Frente Amplio (Colau), la primaria de Podemos y las coaliciones registradas.
- **26 oct**: cierre de candidaturas. Confirmar los candidatos de Bildu, PNV y BNG y si SALF consigue las firmas.
- **Programas electorales**: revisar las posiciones y actualizar `updated` en `config.mjs`.
- Cada cambio: `node src/build.mjs`, commit y push.

## SEO tras publicar

1. Da de alta el dominio en Google Search Console y envía `sitemap.xml`. Haz lo mismo en Bing Webmaster Tools.
2. Comparte el test en redes y foros. El enlace de resultado por WhatsApp es el motor viral.
3. Consigue enlaces de medios locales y blogs: el test es gratuito, independiente y citable.
