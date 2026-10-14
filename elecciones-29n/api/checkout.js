/* POST /api/checkout — crea una sesión de Stripe Checkout para el informe completo.
 * No recibe ni envía las respuestas del test: solo el consentimiento de
 * renuncia al desistimiento (art. 103.m TRLGDCU), que se guarda en la sesión. */
import { stripe, siteUrl, send, PRICE_CENTS } from "./_stripe.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Método no permitido" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body || body.waiver !== true) {
    return send(res, 400, { error: "Debes aceptar el acceso inmediato y la pérdida del derecho de desistimiento." });
  }
  try {
    const site = siteUrl(req);
    const now = new Date().toISOString();
    const session = await stripe("checkout/sessions", {
      method: "POST",
      form: {
        mode: "payment",
        locale: "es",
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][unit_amount]": String(PRICE_CENTS),
        "line_items[0][price_data][product_data][name]": "Informe completo de afinidad política · Elecciones 29N",
        "line_items[0][price_data][product_data][description]": "Contenido digital de acceso inmediato. IVA incluido.",
        success_url: `${site}/resultado/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${site}/resultado/?cancelado=1`,
        "invoice_creation[enabled]": "true",
        "invoice_creation[invoice_data][footer]":
          "Contenido digital suministrado de forma inmediata a petición expresa del consumidor, que reconoce la pérdida del derecho de desistimiento (art. 103.m TRLGDCU). Precio con IVA incluido.",
        "metadata[producto]": "informe-completo",
        "metadata[renuncia_desistimiento]": "aceptada",
        "metadata[renuncia_fecha]": now,
        "payment_intent_data[description]": "Informe completo de afinidad política",
        "custom_text[submit][message]":
          "Contenido digital de acceso inmediato: al pagar confirmas que pierdes el derecho de desistimiento una vez desbloqueado el informe (art. 103.m TRLGDCU).",
      },
    });
    return send(res, 200, { url: session.url });
  } catch (e) {
    return send(res, e.status || 500, { error: e.status === 503 ? "Pagos no disponibles todavía." : "No se pudo iniciar el pago. Inténtalo de nuevo." });
  }
}
