/**
 * Kickly — configuración del sitio.
 * Edita este archivo para personalizar la web y activar Monetag.
 */
window.KICKLY = {
  // URL pública del sitio SIN barra final. Cámbiala si usas dominio propio.
  siteUrl: "https://danielcarbajo98.github.io/kickly",
  siteName: "Kickly",

  /**
   * MONETAG
   * 1) Regístrate en https://monetag.com y añade tu sitio.
   * 2) Verifica la propiedad: Monetag te da una meta tag tipo
   *    <meta name="monetag" content="...">  → pégala en el <head> de
   *    index.html (hay un comentario marcando el sitio exacto).
   * 3) Crea tus zonas (MultiTag, Vignette, In-Page Push, etc.). Cada zona
   *    te da un script como:
   *      <script src="https://XXXX.com/tag.min.js" data-zone="123456" async data-cfasync="false"></script>
   *    Añade aquí cada zona con su "src" y su "zone" y se inyectarán
   *    automáticamente en todas las páginas:
   */
  monetag: {
    zones: [
      // { src: "https://EJEMPLO.com/tag.min.js", zone: "123456" },
    ],
    /**
     * Para notificaciones Push, Monetag te pedirá subir un service worker.
     * Pega su contenido en el archivo sw.js de la raíz del repo y pon
     * pushServiceWorker en true.
     */
    pushServiceWorker: false
  }
};
