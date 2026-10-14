/* GET /api/verify?session_id=cs_... (Cloudflare Pages). */
import { stripe, json } from "./_stripe.js";

export async function onRequestGet({ request, env }) {
  const id = new URL(request.url).searchParams.get("session_id") || "";
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return json(400, { paid: false });
  try {
    const s = await stripe(env, "checkout/sessions/" + encodeURIComponent(id));
    return json(200, { paid: s.payment_status === "paid" && s.metadata?.producto === "informe-completo" });
  } catch (e) {
    return json(e.status || 500, { paid: false });
  }
}
