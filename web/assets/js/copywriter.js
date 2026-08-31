/**
 * Motor de redacción.
 * Convierte las respuestas de la encuesta en textos en castellano
 * con el tono elegido. No traduce: escribe.
 */

import { getIndustry } from './data/industries.js';

const TONE = {
  cercano: {
    ctaPrimary: (a) => a,
    ctaSecondary: 'Escríbenos por WhatsApp',
    closer: 'Estamos a un mensaje.',
    connector: 'Y si tienes dudas, preguntas y ya está.',
    aboutOpener: (n) => `${n} nació con una idea sencilla:`,
    honorific: 'tú',
  },
  elegante: {
    ctaPrimary: (a) => a,
    ctaSecondary: 'Solicitar información',
    closer: 'Estaremos encantados de atenderle.',
    connector: 'Cada detalle está pensado.',
    aboutOpener: (n) => `${n} es el resultado de una convicción:`,
    honorific: 'usted',
  },
  audaz: {
    ctaPrimary: (a) => a.toUpperCase(),
    ctaSecondary: 'Cuéntanos qué necesitas',
    closer: 'Sin vueltas. Sin letra pequeña.',
    connector: 'Lo hacemos así porque funciona.',
    aboutOpener: (n) => `${n} existe por una razón:`,
    honorific: 'tú',
  },
  tecnico: {
    ctaPrimary: (a) => a,
    ctaSecondary: 'Consultar disponibilidad',
    closer: 'Datos, plazos y precio por escrito.',
    connector: 'Método, no improvisación.',
    aboutOpener: (n) => `${n} trabaja con un criterio claro:`,
    honorific: 'usted',
  },
};

const ABOUT_BODY = {
  cercano: [
    'hacer bien lo que sabemos hacer y tratar a cada persona como nos gustaría que nos trataran a nosotros.',
    'que la gente salga de aquí con ganas de volver y de contarlo.',
    'ofrecer algo que nos guste tanto a nosotros como a quien lo recibe.',
  ],
  elegante: [
    'que la excelencia está en los detalles que nadie ve, no en los que se anuncian.',
    'que el buen servicio no se explica, se nota desde el primer momento.',
    'que la constancia vale más que cualquier promesa.',
  ],
  audaz: [
    'estábamos hartos de lo de siempre y decidimos hacerlo a nuestra manera.',
    'creemos que se puede hacer mucho mejor, y lo demostramos cada día.',
    'no queríamos ser uno más, así que no lo somos.',
  ],
  tecnico: [
    'el resultado depende del método, y el método se puede explicar y medir.',
    'cada decisión tiene un porqué y cada porqué se puede justificar.',
    'la experiencia sirve de poco si no se convierte en un proceso repetible.',
  ],
};

const PROCESS = {
  reservas: [
    { t: 'Nos escribes', d: 'Por WhatsApp, teléfono o el formulario. Dinos día, hora y cuántos sois.' },
    { t: 'Te confirmamos', d: 'Respondemos el mismo día con la reserva cerrada y cualquier detalle.' },
    { t: 'Te esperamos', d: 'Llegas y está todo listo. Sin colas ni malentendidos.' },
  ],
  contacto: [
    { t: 'Cuéntanos tu caso', d: 'Una llamada o un mensaje. Sin compromiso y sin coste.' },
    { t: 'Te damos un plan', d: 'Analizamos lo que necesitas y te decimos qué se puede hacer y qué cuesta.' },
    { t: 'Nos ponemos', d: 'Empezamos con plazos claros y una persona de referencia.' },
  ],
  presupuesto: [
    { t: 'Visita y diagnóstico', d: 'Vemos el trabajo de cerca para no dar precios al aire.' },
    { t: 'Presupuesto cerrado', d: 'Por escrito, con alcance y plazo. Lo que firmas es lo que pagas.' },
    { t: 'Ejecución y entrega', d: 'Trabajamos, te vamos informando y entregamos cuando dijimos.' },
  ],
  catalogo: [
    { t: 'Mira la selección', d: 'Todo lo que tenemos, con precios y disponibilidad reales.' },
    { t: 'Resérvalo', d: 'Aparta lo que te gusta por WhatsApp y te lo guardamos.' },
    { t: 'Recoge o recíbelo', d: 'Pásate por la tienda o te lo mandamos a casa.' },
  ],
  clientes: [
    { t: 'Primera sesión', d: 'Valoramos tu punto de partida y hablamos de objetivos reales.' },
    { t: 'Plan a medida', d: 'Diseñamos el programa según tu caso, tu horario y tu ritmo.' },
    { t: 'Seguimiento', d: 'Revisamos, ajustamos y celebramos lo que vas consiguiendo.' },
  ],
};

const TRUST_BASE = {
  reservas: ['Respuesta en menos de 1 hora', 'Reserva sin comisiones', 'Cancelación flexible'],
  contacto: ['Primera consulta sin coste', 'Respuesta en 24 h', 'Trato directo, sin intermediarios'],
  presupuesto: ['Presupuesto cerrado y por escrito', 'Sin sorpresas en la factura', 'Garantía por escrito'],
  catalogo: ['Envío en 48 h', 'Cambios y devoluciones fáciles', 'Atención por WhatsApp'],
  clientes: ['Primera sesión gratuita', 'Sin permanencia', 'Seguimiento personalizado'],
};

const GOAL_CTA = {
  reservas: 'Reservar ahora',
  contacto: 'Contactar',
  presupuesto: 'Pedir presupuesto',
  catalogo: 'Ver el catálogo',
  clientes: 'Empezar ahora',
};

function pick(arr, seed) {
  if (!arr || !arr.length) return '';
  return arr[Math.abs(seed) % arr.length];
}

/** Semilla estable a partir del nombre del negocio: la misma web siempre se genera igual. */
export function seedFrom(str) {
  let h = 0;
  for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) | 0;
  return h;
}

function fill(tpl, brief, ind) {
  return String(tpl)
    .replace(/\{negocio\}/g, brief.name || 'tu negocio')
    .replace(/\{ciudad\}/g, brief.city || 'tu ciudad')
    .replace(/\{anos\}/g, brief.years || '')
    .replace(/\{sector\}/g, ind.words.what)
    .replace(/\{cliente\}/g, ind.words.client)
    .replace(/\{accion\}/g, ind.words.action);
}

export function writeCopy(brief) {
  const ind = getIndustry(brief.industry);
  const tone = TONE[brief.tone] || TONE.cercano;
  const seed = seedFrom((brief.name || '') + (brief.city || '') + (brief.tone || ''));
  const goal = brief.goal || 'contacto';

  const headline = brief.headline?.trim() || fill(pick(ind.hero, seed), brief, ind);
  const subhead = brief.pitch?.trim() || fill(ind.sub, brief, ind);

  const ctaPrimary = tone.ctaPrimary(brief.ctaLabel?.trim() || GOAL_CTA[goal] || ind.words.action);

  const years = parseInt(brief.years, 10);
  const experience = years > 0
    ? (years >= 20 ? `Más de ${years} años` : `${years} ${years === 1 ? 'año' : 'años'}`)
    : null;

  const aboutParts = [];
  aboutParts.push(`${tone.aboutOpener(brief.name || 'Este proyecto')} ${pick(ABOUT_BODY[brief.tone] || ABOUT_BODY.cercano, seed + 3)}`);
  if (experience) {
    aboutParts.push(`${experience} ${years === 1 ? 'trabajando' : 'trabajando'} en ${brief.city || 'la zona'} nos han enseñado que no hay atajos: lo que funciona es la constancia y escuchar a quien tenemos delante.`);
  } else {
    aboutParts.push(`Trabajamos en ${brief.city || 'la zona'} con una idea fija: escuchar primero y proponer después. Nada de soluciones genéricas.`);
  }
  aboutParts.push(tone.connector);

  const trust = (brief.usp && brief.usp.filter(Boolean).length)
    ? brief.usp.filter(Boolean)
    : (ind.usp || TRUST_BASE[goal] || TRUST_BASE.contacto);

  const process = PROCESS[goal] || PROCESS.contacto;

  const metaDesc = `${brief.name || ind.label}${brief.city ? ` en ${brief.city}` : ''}. ${subhead}`
    .replace(/\s+/g, ' ').slice(0, 155);

  return {
    industry: ind,
    tone,
    headline,
    subhead,
    ctaPrimary,
    ctaSecondary: tone.ctaSecondary,
    closer: tone.closer,
    about: {
      title: brief.aboutTitle?.trim() || (brief.name ? `Sobre ${brief.name}` : 'Quiénes somos'),
      body: brief.about?.trim() ? [brief.about.trim()] : aboutParts,
      badge: experience ? `${experience} de oficio` : 'Negocio local',
    },
    trust,
    process: {
      title: 'Cómo trabajamos',
      subtitle: 'Tres pasos, ninguna sorpresa.',
      steps: process,
    },
    sections: {
      servicios: {
        title: brief.servicesTitle?.trim() || (goal === 'catalogo' ? 'Lo que encontrarás' : 'Qué hacemos'),
        subtitle: `${ind.words.offer.charAt(0).toUpperCase() + ind.words.offer.slice(1)} de ${brief.name || 'la casa'}.`,
      },
      galeria: { title: 'En imágenes', subtitle: 'Un vistazo rápido a lo que hacemos.' },
      opiniones: { title: 'Lo que dicen', subtitle: 'Opiniones reales de quien ya ha pasado por aquí.' },
      faq: { title: 'Preguntas frecuentes', subtitle: 'Lo que más nos preguntáis.' },
      contacto: {
        title: '¿Hablamos?',
        subtitle: `${tone.closer} Escríbenos y te respondemos hoy mismo.`,
      },
      horario: { title: 'Horario y ubicación', subtitle: 'Cuándo y dónde encontrarnos.' },
    },
    meta: {
      title: `${brief.name || ind.label}${brief.city ? ` · ${ind.label} en ${brief.city}` : ` · ${ind.label}`}`,
      description: metaDesc,
    },
  };
}

/** Opiniones de relleno cuando el negocio aún no ha aportado las suyas. */
export function placeholderTestimonials(brief) {
  const ind = getIndustry(brief.industry);
  const n = brief.name || 'ellos';
  return [
    { text: `Fui por recomendación y ahora recomiendo yo. Trato inmejorable y resultado por encima de lo que esperaba.`, author: 'Marta G.', meta: `Cliente de ${n}` },
    { text: `Explican todo antes de empezar y cumplen lo que dicen. En ${ind.words.what === 'negocio' ? 'este sector' : `un ${ind.words.what}`} eso vale mucho.`, author: 'Javier R.', meta: 'Reseña de Google' },
    { text: `Llevo tiempo viniendo y nunca me han fallado. Se nota que les importa.`, author: 'Lucía M.', meta: 'Cliente habitual' },
  ];
}
