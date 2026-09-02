/**
 * Datos de la empresa y contenido editorial del sitio.
 *
 * Fuentes: web actual de Distribuciones Rodrigo (claim y textos), registros
 * mercantiles públicos (CIF, constitución, domicilio) y la ficha de la empresa
 * en Mercazaragoza. Lo que no está verificado, no se afirma.
 */

export const empresa = {
  nombre: "Distribuciones Rodrigo",
  razonSocial: "Distribuciones Rodrigo, S.A.",
  cif: "A50165083",
  claim: "La confianza de los profesionales comprometidos con sus clientes",
  fundacion: 1986,
  telefono: "976 31 33 12",
  telefonoLink: "+34976313312",
  email: "calidad@distribucionesrodrigo.com",
  direccion: {
    calle: "Ctra. de Logroño 2, Pol. Ind. El Portazgo, Nave 73",
    cp: "50011",
    ciudad: "Zaragoza",
    region: "Aragón",
    pais: "ES",
  },
  horario: "Lunes a viernes",
  redes: {
    facebook: "https://www.facebook.com/p/Distribuciones-Rodrigo-SA-100068657462492/",
    linkedin: "https://es.linkedin.com/company/distribuciones-rodrigo",
  },
  mapa:
    "https://www.google.com/maps/search/?api=1&query=Distribuciones+Rodrigo+Poligono+El+Portazgo+73+Zaragoza",
} as const;

export const dominio = "https://distribucionesrodrigo.com";

export const navegacion = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/empresa", etiqueta: "Empresa" },
  { href: "/productos", etiqueta: "Productos" },
  { href: "/servicios", etiqueta: "Servicios" },
  { href: "/calidad", etiqueta: "Calidad" },
  { href: "/proveedores", etiqueta: "Proveedores" },
  { href: "/contacto", etiqueta: "Contacto" },
] as const;

/** Cifras publicadas por la propia empresa en su web. */
export const cifras = [
  { valor: 2500, sufijo: "+", etiqueta: "Referencias en catálogo" },
  { valor: 18000, sufijo: "", etiqueta: "m³ de frío negativo" },
  { valor: 3000, sufijo: "", etiqueta: "m³ de frío positivo" },
  { valor: 10000, sufijo: "", etiqueta: "m² de instalaciones" },
  { valor: 40, sufijo: "+", etiqueta: "Vehículos de reparto" },
  { valor: 70, sufijo: "+", etiqueta: "Profesionales" },
] as const;

export type PasoCadena = { titulo: string; descripcion: string; temperatura: string };

export const cadenaFrio: PasoCadena[] = [
  {
    titulo: "Recepción",
    descripcion: "Control de temperatura, lote y documentación de cada entrada en muelle.",
    temperatura: "−18 / 0-4 °C",
  },
  {
    titulo: "Almacenaje",
    descripcion: "18.000 m³ de frío negativo y 3.000 m³ de positivo con registro continuo.",
    temperatura: "−18 °C",
  },
  {
    titulo: "Preparación",
    descripcion: "Picking por referencia y lote en zona refrigerada, sin rupturas de temperatura.",
    temperatura: "0-4 °C",
  },
  {
    titulo: "Carga",
    descripcion: "Muelle refrigerado y vehículos bitemperatura preenfriados antes de cargar.",
    temperatura: "−18 / 0-4 °C",
  },
  {
    titulo: "Entrega",
    descripcion: "Reparto en ruta propia con registro de temperatura y albarán trazado.",
    temperatura: "En destino",
  },
];

export type Segmento = { id: string; nombre: string; descripcion: string; puntos: string[] };

export const segmentos: Segmento[] = [
  {
    id: "restauracion",
    nombre: "Restauración",
    descripcion:
      "Bares, restaurantes, hoteles y cadenas que necesitan surtido amplio, entrega frecuente y un interlocutor que responda el mismo día.",
    puntos: [
      "Reparto en frío con frecuencia programada por ruta",
      "Formatos de hostelería: cubeta, caja y ración porcionada",
      "Comercial de zona con conocimiento real de cocina",
      "Alta de referencias bajo petición para su carta",
    ],
  },
  {
    id: "colectividades",
    nombre: "Colectividades y catering",
    descripcion:
      "Colegios, residencias, hospitales y empresas de restauración colectiva, donde la trazabilidad y la regularidad no son negociables.",
    puntos: [
      "Trazabilidad documentada de lote en cada entrega",
      "Fichas técnicas y de alérgenos del surtido servido",
      "Planificación de volúmenes por menú y por temporada",
      "Formatos de gran volumen y producto de coste controlado",
    ],
  },
  {
    id: "comercio",
    nombre: "Comercio y retail",
    descripcion:
      "Tiendas de alimentación, carnicerías, pescaderías y autoservicios que buscan surtido de rotación con reposición ágil.",
    puntos: [
      "Producto de impulso y formato de venta al público",
      "Rotación alta con pedidos pequeños y frecuentes",
      "Apoyo en surtido de campaña y temporada",
      "Helado y congelado en formato lineal",
    ],
  },
  {
    id: "distribuidores",
    nombre: "Otros distribuidores",
    descripcion:
      "Distribuidores locales y operadores que apoyan su surtido en nuestra plataforma de frío y nuestro volumen de compra.",
    puntos: [
      "Capacidad de almacenamiento en frío negativo y positivo",
      "Carga paletizada y preparación de pedido por referencia",
      "Acceso a nuestro poder de compra en las familias principales",
      "Acuerdos estables de suministro por temporada",
    ],
  },
];

export type Ventaja = { titulo: string; texto: string; icono: string };

export const ventajas: Ventaja[] = [
  {
    icono: "termometro",
    titulo: "Cadena de frío sin interrupciones",
    texto:
      "Frío negativo y positivo bajo el mismo techo, muelle refrigerado y flota bitemperatura. El producto no rompe temperatura entre nuestro proveedor y su cámara.",
  },
  {
    icono: "caja",
    titulo: "Un solo proveedor para toda la carta",
    texto:
      "Pescado, carne, charcutería, verdura, precocinados, panadería, helado, despensa y envases. Un albarán, una ruta, un interlocutor.",
  },
  {
    icono: "personas",
    titulo: "Comercial de zona, no un centro de llamadas",
    texto:
      "Un profesional que conoce su cocina, su volumen y su temporada, y que está localizable cuando falla un género a las once de la mañana.",
  },
  {
    icono: "portapapeles",
    titulo: "Trazabilidad de lote documentada",
    texto:
      "Cada entrada y cada salida quedan registradas por lote. Si hay que retirar una referencia, sabemos dónde está en minutos, no en días.",
  },
  {
    icono: "ruta",
    titulo: "Rutas propias y frecuencia programada",
    texto:
      "Más de 40 vehículos propios con rutas fijas por comarca. La frecuencia se planifica con usted, no se improvisa.",
  },
  {
    icono: "movil",
    titulo: "Pedido tomado en el momento",
    texto:
      "Nuestros comerciales trabajan con dispositivo móvil: el pedido entra en el sistema durante la visita y se prepara esa misma tarde.",
  },
];

export const grupo = [
  {
    nombre: "Distribuciones Rodrigo, S.A.",
    lugar: "Zaragoza · El Portazgo",
    texto:
      "Plataforma central. Congelado, refrigerado, charcutería, helado, despensa y envases para restauración, colectividades, comercio y distribución.",
  },
  {
    nombre: "Frigoríficos Bilbilitanos, S.L.",
    lugar: "Calatayud · La Charluca",
    texto:
      "Más de treinta años distribuyendo congelado, charcutería y salazón desde Calatayud, con rutas propias por la comarca.",
  },
  {
    nombre: "San Lamberto 2000, S.L.",
    lugar: "Zaragoza",
    texto:
      "Comercialización de productos cárnicos, conservas y congelados como apoyo al surtido del grupo.",
  },
];

export const preguntas = [
  {
    pregunta: "¿Cuál es el pedido mínimo?",
    respuesta:
      "Trabajamos con importes mínimos por ruta que fijamos junto al comercial de zona según la frecuencia de reparto y el volumen habitual del cliente. En la primera visita le indicamos el mínimo exacto de su población.",
  },
  {
    pregunta: "¿En qué zonas repartís?",
    respuesta:
      "Cubrimos Aragón con rutas propias desde nuestra plataforma de Zaragoza y desde Frigoríficos Bilbilitanos en Calatayud, con extensión a provincias limítrofes. Consulte la frecuencia concreta de su localidad: la programamos por ruta.",
  },
  {
    pregunta: "¿Cómo se garantiza la cadena de frío?",
    respuesta:
      "Todo el recorrido está a temperatura controlada: cámaras de frío negativo a −18 °C y positivo a 0-4 °C en almacén, carga en muelle refrigerado y reparto en vehículos bitemperatura con registro de temperatura. Cada pedido queda trazado desde la recepción del proveedor hasta su entrega.",
  },
  {
    pregunta: "¿Puedo pedir un producto que no está en el catálogo?",
    respuesta:
      "Sí. Buena parte de nuestro surtido nace de peticiones concretas de clientes. Si el producto encaja en nuestras familias, lo buscamos, lo homologamos y lo incorporamos a la tarifa.",
  },
  {
    pregunta: "¿Cómo se hace un pedido?",
    respuesta:
      "Por teléfono con su comercial, por correo electrónico o directamente en la visita del comercial de ruta, que toma el pedido en dispositivo móvil y lo vuelca al sistema en el momento.",
  },
  {
    pregunta: "¿Trabajáis con particulares?",
    respuesta:
      "No. Somos mayoristas: distribuimos a restauración, colectividades, comercios de alimentación y otros distribuidores, siempre con alta de cliente y datos fiscales.",
  },
];
