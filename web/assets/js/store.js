/** Estado del brief: se guarda solo, sobrevive a recargas y viaja entre páginas. */

import { STORAGE_KEY, ORDER_KEY } from './config.js';

export const EMPTY = {
  // negocio
  industry: '', name: '', city: '', years: '',
  pitch: '', goal: 'contacto',
  services: [],
  // estilo
  tone: 'cercano', theme: '', accent: '', fonts: 'editorial', shape: 'suave', hero: 'partido',
  // contacto
  phone: '', whatsapp: '', email: '', address: '',
  schedule: [],
  social: {},
  images: { logo: '', hero: '', about: '', gallery: [] },
  // extras
  headline: '', usp: [], testimonials: [], faq: [],
  domain: '', legalName: '',
  plan: 'pro', modo: 'compra', addons: [],
  sections: null,
  updatedAt: null,
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(EMPTY);
    const saved = JSON.parse(raw);
    return { ...clone(EMPTY), ...saved, images: { ...EMPTY.images, ...(saved.images || {}) } };
  } catch {
    return clone(EMPTY);
  }
}

export function save(brief) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...brief, updatedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

export function clear() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* espacio lleno o modo privado */ }
}

export function saveOrder(order) {
  try { localStorage.setItem(ORDER_KEY, JSON.stringify({ ...order, at: Date.now() })); } catch { /* ignorar */ }
}

export function loadOrder() {
  try { return JSON.parse(localStorage.getItem(ORDER_KEY) || 'null'); } catch { return null; }
}

/** Comparte el brief por URL (para enseñárselo a un socio sin backend). */
export function encodeBrief(brief) {
  const json = JSON.stringify(brief);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeBrief(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

/** ¿Hay lo mínimo para poder generar algo con sentido? */
export function isReady(b) {
  return Boolean(b && b.industry && b.name && b.name.trim().length > 1);
}
