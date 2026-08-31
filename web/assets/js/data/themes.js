/**
 * Sistema de diseño de las webs generadas.
 * Un tema = paleta + pareja tipográfica + reglas de forma.
 * Todas las combinaciones se validan contra contraste AA antes de servirse.
 */

export const THEMES = [
  {
    id: 'obsidiana', name: 'Obsidiana', mood: 'Elegante y nocturno',
    bg: '#0C0C0F', surface: '#15151A', line: '#26262E',
    text: '#F5F2EC', muted: '#9C9CA8', accent: '#E8A33D', accentInk: '#12100B',
    dark: true,
  },
  {
    id: 'lino', name: 'Lino', mood: 'Cálido y editorial',
    bg: '#FAF6EF', surface: '#FFFFFF', line: '#E7DFD2',
    text: '#1B1815', muted: '#6E665C', accent: '#B5502F', accentInk: '#FFFFFF',
    dark: false,
  },
  {
    id: 'brasa', name: 'Brasa', mood: 'Intenso y apetitoso',
    bg: '#120D0B', surface: '#1C1512', line: '#2E231E',
    text: '#F7EFE7', muted: '#A89386', accent: '#E2673A', accentInk: '#1A0C05',
    dark: true,
  },
  {
    id: 'jade', name: 'Jade', mood: 'Sereno y saludable',
    bg: '#F4F8F5', surface: '#FFFFFF', line: '#DBE7DE',
    text: '#12211B', muted: '#5C7168', accent: '#1F6B58', accentInk: '#FFFFFF',
    dark: false,
  },
  {
    id: 'cielo', name: 'Cielo', mood: 'Limpio y profesional',
    bg: '#F5F7FB', surface: '#FFFFFF', line: '#DEE4EF', 
    text: '#111726', muted: '#5B667E', accent: '#2456B8', accentInk: '#FFFFFF',
    dark: false,
  },
  {
    id: 'noche', name: 'Noche', mood: 'Sobrio y corporativo',
    bg: '#0B0E16', surface: '#141926', line: '#232A3C',
    text: '#EDF1F8', muted: '#8E99B1', accent: '#6E8BFF', accentInk: '#080B14',
    dark: true,
  },
  {
    id: 'arena', name: 'Arena', mood: 'Natural y artesano',
    bg: '#F7F2E9', surface: '#FFFDF9', line: '#E5DACA',
    text: '#231C13', muted: '#75695A', accent: '#A9762C', accentInk: '#FFFFFF',
    dark: false,
  },
  {
    id: 'rosaseco', name: 'Rosa seco', mood: 'Suave y cuidado',
    bg: '#FBF4F3', surface: '#FFFFFF', line: '#EFDEDC',
    text: '#241A1A', muted: '#7A6260', accent: '#B34A5C', accentInk: '#FFFFFF',
    dark: false,
  },
  {
    id: 'grafito', name: 'Grafito', mood: 'Directo y con carácter',
    bg: '#101113', surface: '#1A1C1F', line: '#2A2D32',
    text: '#F2F3F5', muted: '#969AA2', accent: '#B9F227', accentInk: '#101113',
    dark: true,
  },
];

export const FONT_PAIRS = [
  {
    id: 'editorial', name: 'Editorial', note: 'Serif con carácter + neogrotesca',
    display: "'Fraunces', Georgia, 'Times New Roman', serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    googleFonts: 'family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600',
    displayWeight: 600, tracking: '-0.02em',
  },
  {
    id: 'moderna', name: 'Moderna', note: 'Todo sans, geométrica y limpia',
    display: "'Inter', -apple-system, sans-serif",
    body: "'Inter', -apple-system, sans-serif",
    googleFonts: 'family=Inter:wght@400;500;600;700;800',
    displayWeight: 700, tracking: '-0.035em',
  },
  {
    id: 'clasica', name: 'Clásica', note: 'Serif de toda la vida, muy legible',
    display: "'Playfair Display', Georgia, serif",
    body: "'Source Sans 3', -apple-system, sans-serif",
    googleFonts: 'family=Playfair+Display:wght@500;600;700&family=Source+Sans+3:wght@400;500;600',
    displayWeight: 600, tracking: '-0.01em',
  },
  {
    id: 'tecnica', name: 'Técnica', note: 'Condensada y con presencia',
    display: "'Archivo', 'Arial Narrow', sans-serif",
    body: "'Archivo', -apple-system, sans-serif",
    googleFonts: 'family=Archivo:wght@400;500;600;800',
    displayWeight: 800, tracking: '-0.03em',
  },
  {
    id: 'suave', name: 'Suave', note: 'Redonda y amable',
    display: "'Poppins', -apple-system, sans-serif",
    body: "'Poppins', -apple-system, sans-serif",
    googleFonts: 'family=Poppins:wght@400;500;600;700',
    displayWeight: 600, tracking: '-0.02em',
  },
];

/** Variantes de portada. El generador elige según objetivo y contenido. */
export const HERO_LAYOUTS = [
  { id: 'centro', name: 'Centrado', note: 'Titular grande al centro, muy directo' },
  { id: 'partido', name: 'Partido', note: 'Texto a la izquierda, imagen a la derecha' },
  { id: 'inmersivo', name: 'Inmersivo', note: 'Imagen a pantalla completa con degradado' },
  { id: 'editorial', name: 'Editorial', note: 'Titular sobredimensionado, imagen debajo' },
];

export const SHAPES = [
  { id: 'suave', name: 'Suave', radius: 18, radiusSm: 10, radiusPill: 999 },
  { id: 'recto', name: 'Recto', radius: 2, radiusSm: 2, radiusPill: 4 },
  { id: 'redondo', name: 'Redondo', radius: 28, radiusSm: 16, radiusPill: 999 },
];

/** Tonos de voz: modulan cómo escribe el generador. */
export const TONES = [
  { id: 'cercano', name: 'Cercano', note: 'Tuteo, frases cortas, como hablarías en el mostrador' },
  { id: 'elegante', name: 'Elegante', note: 'Sobrio y cuidado, sin exclamaciones' },
  { id: 'audaz', name: 'Audaz', note: 'Directo y con actitud, va al grano' },
  { id: 'tecnico', name: 'Técnico', note: 'Preciso y con datos, transmite competencia' },
];

export function getTheme(id) { return THEMES.find((t) => t.id === id) || THEMES[0]; }
export function getFontPair(id) { return FONT_PAIRS.find((f) => f.id === id) || FONT_PAIRS[0]; }
export function getShape(id) { return SHAPES.find((s) => s.id === id) || SHAPES[0]; }

/* ---------- utilidades de color ---------- */

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

export function rgbToHex(r, g, b) {
  const c = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function luminance(hex) {
  const srgb = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Devuelve el color de texto (claro u oscuro) que mejor contrasta sobre `bg`. */
export function inkOn(bg) {
  return contrast(bg, '#FFFFFF') >= contrast(bg, '#111111') ? '#FFFFFF' : '#111111';
}

export function mix(a, b, amount) {
  const [r1, g1, b1] = hexToRgb(a), [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * amount, g1 + (g2 - g1) * amount, b1 + (b2 - b1) * amount);
}

/**
 * Ajusta un acento hasta que contrasta al menos `min` con el fondo,
 * acercándolo al texto principal. Garantiza legibilidad sea cual sea
 * el color que elija el usuario.
 */
export function ensureContrast(accent, bg, min = 3.2) {
  let c = accent, step = 0;
  const target = luminance(bg) > 0.4 ? '#000000' : '#FFFFFF';
  while (contrast(c, bg) < min && step < 20) {
    c = mix(c, target, 0.06);
    step++;
  }
  return c;
}

/** Genera una escala de superficies coherente con el tema. */
export function buildPalette(theme, accentOverride) {
  const accent = ensureContrast(accentOverride || theme.accent, theme.bg, 3.4);
  return {
    ...theme,
    accent,
    accentInk: inkOn(accent),
    accentSoft: mix(accent, theme.bg, theme.dark ? 0.82 : 0.88),
    accentLine: mix(accent, theme.bg, 0.6),
    surface2: mix(theme.surface, theme.dark ? '#FFFFFF' : '#000000', 0.04),
    shadow: theme.dark ? '0 24px 60px rgba(0,0,0,.55)' : '0 24px 60px rgba(30,25,20,.10)',
  };
}
