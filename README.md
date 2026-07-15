# Kickly — Deporte en directo

Plataforma web de **agenda y emisión de deporte en directo** (fútbol, baloncesto, tenis, UFC) publicada en **https://kickly.app** (Vercel, despliegue automático desde `main`). Optimizada para SEO y monetizada con Monetag.

## Estructura

```
index.html              Portada: agenda multideporte (en directo / por día)
evento.html             Página de cada evento (reproductor + cuenta atrás)
deportes/*.html         Landing pages SEO por deporte (futbol, baloncesto, tenis, ufc)
aviso-legal.html        Aviso legal · 404.html Página de error
data/events.json        ★ AQUÍ añades los eventos
assets/js/config.js     ★ AQUÍ configuras deportes y Monetag
assets/js/app.js        Lógica (agenda, reproductor, JSON-LD dinámico)
assets/css/style.css    Diseño
robots.txt, sitemap.xml SEO / indexación
sw.js                   Service worker para Push de Monetag
```

## Añadir eventos

Edita `data/events.json`:

```json
{
  "id": "inglaterra-vs-argentina-mundial-2026",
  "sport": "futbol",
  "competitionName": "Mundial 2026 · Semifinal",
  "home": "Inglaterra",
  "away": "Argentina",
  "date": "2026-07-15T21:00:00+02:00",
  "status": "scheduled",
  "embed": "",
  "hls": "",
  "description": "Texto SEO del evento."
}
```

- `sport`: `futbol` | `baloncesto` | `tenis` | `ufc` (definidos en `config.js`; añade más ahí y crea su página en `deportes/`).
- `status`: `scheduled` (cuenta atrás) → `live` (marca EN DIRECTO) → `finished`.
- `embed`: URL de un **iframe** con tu emisión, o `hls`: URL **.m3u8** (se reproduce con hls.js).
- Para eventos sin dos rivales (UFC, finales de tenis) deja `away` vacío y usa `home` como título.
- `date` en formato ISO con zona horaria; la web la convierte automáticamente a la hora local de cada visitante.

> ⚠️ Emite únicamente contenido del que tengas derechos de retransmisión. Emitir eventos profesionales sin licencia es ilegal y Monetag suspende cuentas asociadas a contenido pirata.

## Monetag

1. Añade `https://kickly.app` en [monetag.com](https://monetag.com).
2. Pega la meta tag de verificación en el `<head>` de `index.html` (comentario `MONETAG`).
3. Crea zonas (MultiTag recomendada) y añádelas en `assets/js/config.js`:
   ```js
   monetag: { zones: [ { src: "https://xxxx.com/tag.min.js", zone: "123456" } ] }
   ```
   Se inyectan en todas las páginas automáticamente.
4. Push (opcional): pega el service worker de Monetag en `sw.js` y activa `pushServiceWorker: true`.

## SEO

Incluido: metadatos únicos por página, canonicals a `kickly.app`, Open Graph/Twitter Cards, JSON-LD (`WebSite`, `FAQPage`, `SportsEvent`, `ItemList`, `BreadcrumbList`), `sitemap.xml`, `robots.txt`, HTML semántico y títulos dinámicos por evento.

Pendiente (manual):
1. **Google Search Console**: alta de `kickly.app` y envío de `sitemap.xml`.
2. **Bing Webmaster Tools**: importar desde Search Console.
3. Actualizar `lastmod` del sitemap al cambiar contenido y escribir `description` únicas por evento.

## Despliegue

Vercel está conectado a este repo: cada push a `main` publica en https://kickly.app en ~1 minuto.
