/**
 * KICKLY — configuración del sitio.
 */
window.KICKLY = {
  siteUrl: "https://kickly.app",
  siteName: "Kickly",

  // Deportes disponibles. El slug se usa en data/events.json y en /deportes/<slug>.html
  sports: {
    "futbol":      { name: "Fútbol" },
    "baloncesto":  { name: "Baloncesto" },
    "tenis":       { name: "Tenis" },
    "ufc":         { name: "UFC · MMA" },
    "ciclismo":    { name: "Ciclismo" },
    "motor":       { name: "Fórmula 1" },
    "golf":        { name: "Golf" }
  },

  /**
   * MONETAG
   * 1) Añade tu sitio (https://kickly.app) en https://monetag.com
   * 2) Pega la meta tag de verificación en el <head> de index.html
   *    (busca el comentario MONETAG).
   * 3) Crea tus zonas: cada una te da un script con "src" y "data-zone".
   *    Añádelas aquí y se cargan solas en todas las páginas:
   *      zones: [ { src: "https://xxxx.com/tag.min.js", zone: "123456" } ]
   * 4) Push (opcional): pega el service worker de Monetag en /sw.js
   *    y activa pushServiceWorker: true.
   */
  monetag: {
    // El MultiTag (zona 259826) está pegado directamente en el <head> de
    // cada página HTML. Añade aquí solo zonas adicionales si creas más.
    zones: [],
    // sw.js contiene el service worker de Push de Monetag (zona 11299357)
    pushServiceWorker: true
  }
};
