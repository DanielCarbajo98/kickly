/* Cloudflare Worker: sirve la web estática (public/) y las rutas de pago /api/*. */
import { onRequestPost as checkout } from "../functions/api/checkout.js";
import { onRequestGet as verify } from "../functions/api/verify.js";
import { json } from "../functions/api/_stripe.js";

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/checkout") {
      return request.method === "POST" ? checkout({ request, env }) : json(405, { error: "Método no permitido" });
    }
    if (pathname === "/api/verify") {
      return request.method === "GET" ? verify({ request, env }) : json(405, { error: "Método no permitido" });
    }
    return env.ASSETS.fetch(request);
  },
};
