/* GET /api/verify?session_id=cs_... — confirma con Stripe que la sesión está pagada. */
import { stripe, send } from "./_stripe.js";

export default async function handler(req, res) {
  const id = new URL(req.url, "http://x").searchParams.get("session_id") || "";
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return send(res, 400, { paid: false });
  try {
    const s = await stripe("checkout/sessions/" + encodeURIComponent(id));
    return send(res, 200, { paid: s.payment_status === "paid" && s.metadata?.producto === "informe-completo" });
  } catch (e) {
    return send(res, e.status || 500, { paid: false });
  }
}
