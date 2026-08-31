/**
 * Vitrina — configuración global de la plataforma.
 * Todo lo que hay que tocar para poner el negocio en marcha está en este archivo.
 */

export const BRAND = {
  name: 'Vitrina',
  wordmark: 'vitrina',
  tagline: 'Cuéntanos tu negocio. Te devolvemos su web.',
  claim: 'Tu negocio, en su mejor escaparate.',
  domain: 'vitrina.es',
  url: 'https://kickly.app/web/',
  email: 'hola@vitrina.es',
  whatsapp: '+34600000000',
  instagram: 'https://instagram.com/',
  cityBase: 'España',
};

/**
 * Las dos formas de contratar. NO son la misma cosa pagada de dos maneras:
 * comprar es adquirir la web; suscribirse es un servicio continuo.
 */
export const MODOS = [
  {
    id: 'compra',
    nombre: 'Comprar la web',
    resumen: 'Pago único. La web es tuya.',
    detalle: 'Pagas una vez e incluye el primer año de alojamiento, certificado y dominio. '
      + 'A partir del segundo año, el mantenimiento son 29 € al año y es opcional: si no lo '
      + 'quieres, te llevas los archivos y la alojas donde prefieras.',
    sufijo: 'pago único',
  },
  {
    id: 'suscripcion',
    nombre: 'Suscripción',
    resumen: 'Cuota mensual, todo incluido.',
    detalle: 'Sin desembolso inicial. Incluye alojamiento, dominio, certificado, copias de '
      + 'seguridad, cambios ilimitados y soporte mientras estés suscrito. Sin permanencia. '
      + 'El código es tuyo desde el primer día; si cancelas, dejamos de alojarla nosotros.',
    sufijo: 'al mes',
  },
];

/** Mantenimiento del segundo año en adelante, sólo para quien compra. */
export const RENOVACION = { precio: 29, unidad: 'al año', desde: 'a partir del segundo año' };

/**
 * Fraccionamiento del pago único.
 * SeQura cobra una comisión al comercio y exige contrato firmado: no lo pongas
 * en `activa: true` en producción hasta tenerlo cerrado.
 */
export const FINANCIACION = {
  activa: true,
  proveedor: 'SeQura',
  plazos: 3,
  minimo: 100,
  nota: 'Fracciona el pago en 3 meses sin intereses para ti.',
};

/**
 * Planes. `price` en euros.
 * `link` = Stripe Payment Link (o cualquier checkout externo). Si está vacío,
 * el checkout cae al formulario de pedido manual, que sigue funcionando.
 */
export const PLANS = [
  {
    id: 'uno',
    name: 'Uno',
    kicker: 'Para empezar a existir en Google',
    price: 79,
    priceSub: 9,
    unit: 'pago único',
    highlight: false,
    link: '',
    linkSub: '',
    features: [
      'Web de una página, hasta 6 secciones',
      'Diseño a medida generado con tus datos',
      'Subdominio incluido: tunegocio.vitrina.es',
      'Primer año de alojamiento y certificado',
      'Botón de WhatsApp y llamada directa',
      'Optimizada para móvil y velocidad (100/100)',
      'Te entregamos el código. Sin ataduras.',
      '1 ronda de cambios incluida',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    kicker: 'El estándar para un negocio local',
    price: 149,
    priceSub: 15,
    unit: 'pago único',
    highlight: true,
    badge: 'El más elegido',
    link: '',
    linkSub: '',
    features: [
      'Todo lo de Uno, y además:',
      'Tu dominio propio (.es o .com) a tu nombre',
      'Formulario de contacto y reservas por WhatsApp',
      'SEO local: ficha Google, mapa y datos estructurados',
      'Galería de fotos y sección de reseñas',
      'Analítica de visitas sin cookies',
      'Cambios ilimitados durante 30 días',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    kicker: 'Cuando la web es el negocio',
    price: 349,
    priceSub: 29,
    unit: 'pago único',
    highlight: false,
    link: '',
    linkSub: '',
    features: [
      'Todo lo de Pro, y además:',
      'Multipágina: servicios, catálogo, blog o carta',
      'Textos redactados a mano por nuestro equipo',
      'Sesión de 45 min con un diseñador',
      'Catálogo o tienda hasta 40 productos',
      'Alta en Google Business Profile',
      '3 revisiones y soporte prioritario',
    ],
  },
];

export const ADDONS = [
  { id: 'dominio', name: 'Dominio propio (1 año)', price: 15, note: '.com, .es o .app a tu nombre' },
  { id: 'logo', name: 'Logotipo y kit de marca', price: 89, note: 'Logo, colores, tipografías y favicon' },
  { id: 'fotos', name: 'Pack de fotografía editada', price: 60, note: 'Retocamos 15 fotos de tu negocio' },
  { id: 'textos', name: 'Redacción profesional', price: 70, note: 'Un copywriter reescribe toda tu web' },
  { id: 'idiomas', name: 'Segundo idioma', price: 55, note: 'Traducción profesional de toda la web' },
];

/**
 * Endpoint donde aterrizan los pedidos.
 * Pon aquí una URL de Formspree, Basin, un webhook de Make/Zapier
 * o una Edge Function de Supabase. Si se deja vacío, el checkout
 * ofrece copiar el pedido y enviarlo por email o WhatsApp.
 */
export const ORDER_ENDPOINT = '';

/** Modo demo: no se cobra nada, sólo se registra la intención de compra. */
export const DEMO_MODE = true;

export const STORAGE_KEY = 'vitrina.brief.v1';
export const ORDER_KEY = 'vitrina.order.v1';

export const STATS = [
  { value: '3 min', label: 'lo que tardas en contestar' },
  { value: '0 €', label: 'hasta que te guste' },
  { value: '100/100', label: 'en PageSpeed, de serie' },
  { value: '24 h', label: 'y está publicada' },
];
