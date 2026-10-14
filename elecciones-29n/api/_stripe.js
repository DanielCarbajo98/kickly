/* Llamadas mínimas a la API de Stripe sin dependencias (fetch nativo). */
export const PRICE_CENTS = 199;

export async function stripe(path, { method = "GET", form } = {}) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw Object.assign(new Error("STRIPE_SECRET_KEY no configurada"), { status: 503 });
  const r = await fetch("https://api.stripe.com/v1/" + path, {
    method,
    headers: {
      Authorization: "Bearer " + key,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: form ? new URLSearchParams(form).toString() : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw Object.assign(new Error(data?.error?.message || "Error de Stripe"), { status: 502 });
  return data;
}

export function siteUrl(req) {
  return (process.env.SITE_URL || "https://" + req.headers.host).replace(/\/$/, "");
}

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
