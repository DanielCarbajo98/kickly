/* ============================================================
 * CONFIGURACIÓN DEL SITIO — lo único que necesitas tocar.
 * Después de cambiar algo: `node src/build.mjs`
 * ============================================================ */
export default {
  brand: "QuéVoto",                 // nombre visible
  brandHtml: "Qué<b>Voto</b>",      // logo de texto
  domain: "quevoto.es",             // dominio sin https://
  siteUrl: "https://quevoto.es",    // URL canónica (sin barra final)
  electionDate: "2026-11-29T09:00:00+01:00",
  updated: "2026-10-14",            // fecha de última revisión de posiciones

  /* Datos del titular — OBLIGATORIOS por la LSSI (art. 10).
   * Rellénalos antes de publicar. */
  owner: {
    name: "[Nombre y apellidos o razón social]",
    nif: "[NIF/CIF]",
    address: "[Dirección postal completa]",
    email: "hola@quevoto.es",
  },

  /* Analítica (opcional, solo se carga con consentimiento vía la CMP de Google).
   * Ej.: "G-XXXXXXX" */
  ga4: "",

  ads: {
    /* Google AdSense: "ca-pub-XXXXXXXXXXXXXXXX". Vacío = sin anuncios. */
    adsenseClient: "",
    /* IDs de los bloques de anuncios creados en AdSense (Anuncios > Por bloque). */
    slots: {
      home: "",      // portada, tras el hero
      home2: "",     // portada, antes de las FAQ
      quiz: "",      // debajo de cada pregunta
      side: "",      // columna lateral del test (escritorio)
      results1: "",  // resultado, tras el partido ganador
      results2: "",  // resultado, entre gráficos y detalle
      results3: "",  // resultado, final
      content: "",   // páginas de partidos, temas y comparativas
      sticky: "",    // anuncio fijo inferior (móvil)
    },
    sticky: true,
    /* Segundos de la animación "Calculando tu resultado". Sin anuncios
     * (AdSense no permite anuncios en pantallas sin contenido). */
    gateSeconds: 4,
    /* Google Ad Manager rewarded (opcional): "/1234567/quevoto_rewarded".
     * Ofrece ver un anuncio voluntario para saltar la espera. */
    gamRewardedUnit: "",
    /* Otras redes (p. ej. Monetag). NO recomendado junto a AdSense. */
    extraScripts: [],
  },
};
