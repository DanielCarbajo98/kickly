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

## Páginas que se generan (74 indexables)

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
| Legales | `/metodologia/`, `/aviso-legal/`, `/privacidad/`, `/cookies/` | — |

## Publicar (Vercel, 5 minutos)

1. Dominio: **testelectoral.es** (comprado/disponible). Contiene la palabra clave exacta "test electoral".
2. En Vercel crea un **proyecto nuevo** desde este mismo repo, con **Root Directory = `elecciones-29n/public`**, Framework "Other" y sin build command.
3. Añade el dominio en Vercel → Domains y apunta los DNS como te indique.
4. Si cambias de dominio, cambia `domain`/`siteUrl` en `src/config.mjs` y ejecuta `node src/build.mjs`.

## Monetización (legal)

1. **AdSense**: da de alta el dominio, pega tu `ca-pub-…` en `config.mjs → ads.adsenseClient`, crea los bloques de anuncio y pega sus IDs en `ads.slots`. Después regenera la web; `ads.txt` se genera solo.
2. **Consentimiento de cookies (obligatorio en la UE)**: en AdSense → *Privacidad y mensajes* → activa el mensaje **RGPD** (la CMP certificada de Google). No hace falta tocar código.
3. **"Ver un anuncio para ver tu resultado"**: en AdSense → *Privacidad y mensajes* → **Offerwall**. Créalo con la opción "Anuncio recompensado" y aplícalo **solo a la URL `/resultado/`**. Es la forma permitida por Google de condicionar el acceso a un anuncio.
   - ⚠️ No metas un anuncio de AdSense dentro de una cuenta atrás propia que "desbloquee" el resultado. Las políticas lo prohíben (recompensar la visualización de anuncios y anuncios en pantallas sin contenido), y por eso la animación "Calculando…" no lleva anuncios.
   - Alternativa: Google Ad Manager con anuncios *rewarded* (`ads.gamRewardedUnit`). El código ya está preparado.
4. **Anuncios automáticos**: puedes activar Auto ads con anclaje y viñeta, además de los bloques manuales.
5. **Monetag u otras redes**: se pueden añadir en `ads.extraScripts`, pero **no se recomienda** mezclarlas con AdSense. Los popunders dañan la confianza, el SEO y la cuenta de AdSense.

## Legalidad: lo que está hecho y lo que debes hacer tú

Hecho:
- **Datos de opinión política (art. 9 RGPD)**: el test se calcula en el navegador y las respuestas **no se envían ni se guardan** en ningún servidor. No hay registro ni email.
- **No es una encuesta (art. 69 LOREG)**: no se publican resultados agregados de usuarios. Así no hay riesgo con la prohibición de difundir sondeos del 24 al 28 de noviembre.
- **Imparcialidad**: misma escala y fórmula para todos los partidos, justificación pública de cada posición, metodología publicada, canal de correcciones y sin logotipos de partidos.
- **Publicidad política**: excluida expresamente (Reglamento UE 2024/900). No vendas patrocinios a partidos.
- Aviso legal (LSSI art. 10), privacidad (RGPD) y cookies (LSSI art. 22).

Pendiente para ti:
- [ ] Rellenar en `config.mjs → owner` tu nombre o razón social, NIF y dirección. La LSSI lo exige.
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
