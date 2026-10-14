/* Versión Cloudflare Pages Functions de las llamadas a Stripe (sin dependencias). */
export const PRICE_CENTS = 199;

export async function stripe(env, path, { method = "GET", form } = {}) {
  if (!env.STRIPE_SECRET_KEY) throw Object.assign(new Error("STRIPE_SECRET_KEY no configurada"), { status: 503 });
  const r = await fetch("https://api.stripe.com/v1/" + path, {
    method,
    headers: {
      Authorization: "Bearer " + env.STRIPE_SECRET_KEY,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: form ? new URLSearchParams(form).toString() : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw Object.assign(new Error(data?.error?.message || "Error de Stripe"), { status: 502 });
  return data;
}

export const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
