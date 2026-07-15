# ⚽ Kickly — Fútbol en directo online

Web estática para publicar una **agenda de partidos con emisión en directo**, optimizada para SEO y monetizada con **Monetag**. Funciona en GitHub Pages sin backend.

## Estructura

```
index.html              Portada: agenda (en directo / próximos / finalizados)
partido.html            Página de cada partido (reproductor + cuenta atrás)
ligas/*.html            Landing pages SEO por competición
aviso-legal.html        Aviso legal
404.html                Página de error
data/matches.json       ★ AQUÍ añades los partidos
assets/js/config.js     ★ AQUÍ configuras la URL del sitio y Monetag
assets/js/app.js        Lógica (agenda, reproductor, JSON-LD dinámico)
assets/css/style.css    Estilos
robots.txt, sitemap.xml SEO / indexación
sw.js                   Service worker para Push de Monetag
```

## 1. Publicar la web (GitHub Pages)

1. En GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
2. La web quedará en `https://danielcarbajo98.github.io/kickly/`.
3. Si usas **dominio propio**, cámbialo en:
   - `siteUrl` de `assets/js/config.js`
   - las URLs `canonical`/`og:url` de cada HTML
   - `robots.txt` y `sitemap.xml`
   - las rutas `/kickly/` de `404.html`

## 2. Añadir partidos

Edita `data/matches.json`. Cada partido:

```json
{
  "id": "equipo1-vs-equipo2-2026-07-20",
  "competition": "la-liga",
  "competitionName": "La Liga",
  "home": "Equipo 1",
  "away": "Equipo 2",
  "date": "2026-07-20T21:00:00+02:00",
  "status": "scheduled",
  "embed": "",
  "hls": "",
  "description": "Texto para SEO del partido."
}
```

- `status`: `scheduled` (muestra cuenta atrás) → `live` (muestra el reproductor) → `finished`.
- `embed`: URL de un **iframe** con tu emisión, o
- `hls`: URL de un stream **.m3u8** (se reproduce con hls.js).
- `competition` debe coincidir con el slug de la página de liga (`la-liga`, `premier-league`, `champions-league`). Para añadir una liga nueva, copia una página de `ligas/` y cambia el `data-league`.

> ⚠️ **Importante**: emite únicamente contenido del que tengas los derechos de retransmisión. Emitir partidos de competiciones profesionales sin licencia es ilegal y además Monetag (y cualquier red publicitaria) suspende las cuentas asociadas a contenido pirata.

## 3. Activar Monetag

1. Regístrate en [monetag.com](https://monetag.com) y añade tu sitio.
2. **Verificación**: copia la meta tag que te dan y pégala en el `<head>` de `index.html` (hay un comentario `<!-- MONETAG -->` marcando el sitio).
3. **Zonas de anuncios**: crea tus zonas (MultiTag es la recomendada para empezar; también Vignette, In-Page Push…). Cada zona te da un script con un `src` y un `data-zone`. Añádelos en `assets/js/config.js`:

```js
monetag: {
  zones: [
    { src: "https://xxxxx.com/tag.min.js", zone: "123456" }
  ],
  pushServiceWorker: false
}
```

Se inyectan automáticamente en **todas** las páginas.

4. **Push Notifications** (opcional): pega el código del service worker que te da Monetag en `sw.js` y pon `pushServiceWorker: true` en la config.

## 4. SEO — qué incluye y qué hacer tú

Ya incluido:
- Metadatos completos (title/description únicos por página), canonicals, Open Graph y Twitter Cards.
- Datos estructurados JSON-LD: `WebSite`, `FAQPage`, `BreadcrumbList`, `SportsEvent` + `ItemList` (generados por partido).
- `sitemap.xml` + `robots.txt`, HTML semántico, títulos dinámicos por partido, horarios en `<time datetime>`.
- Landing pages por competición con enlazado interno.

Pendiente de ti:
1. **Google Search Console**: da de alta la propiedad y envía `sitemap.xml`. Es lo que más acelera la indexación.
2. **Bing Webmaster Tools**: importa la propiedad desde Search Console.
3. Actualiza `lastmod` en `sitemap.xml` cuando cambies contenido.
4. Escribe `description` únicas y con palabras clave en cada partido del JSON.
5. Con dominio propio ganarás mucha más autoridad que con `github.io`.
