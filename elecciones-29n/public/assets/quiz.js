/* Motor del test. Todo se calcula en el navegador: las respuestas nunca
 * se envían a ningún servidor. */
(function () {
  var D = window.Q29;
  var CFG = window.SITE || {};
  var ADS = CFG.ads || {};
  var root = document.getElementById("quiz");
  if (!D || !root) return;

  var PARTY = {};
  D.parties.forEach(function (p) { PARTY[p.id] = p; });
  var LABELS = { "2": "Totalmente de acuerdo", "1": "De acuerdo", "0": "Neutral / no lo tengo claro", "-1": "En desacuerdo", "-2": "Totalmente en desacuerdo" };
  var KEYS = { "2": "++", "1": "+", "0": "=", "-1": "−", "-2": "−−" };
  var STORE = "q29-progress-v1";

  var state = { mode: null, list: [], i: 0, ans: {}, imp: {} };

  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(STORE); } catch (e) {} }
  function track(name, params) { try { if (window.gtag) window.gtag("event", name, params || {}); } catch (e) {} }

  function questionsFor(mode) {
    return D.questions.filter(function (q) { return mode === "full" || q.core; }).map(function (q) { return q.id; });
  }
  var QBYID = {};
  D.questions.forEach(function (q) { QBYID[q.id] = q; });

  /* ---------- Codificación de respuestas para compartir ----------
   * Un carácter por pregunta (en el orden de D.questions):
   * a..e = +2..-2, A..E = lo mismo marcado como importante, "_" = sin responder. */
  var CODE = "abcde";
  function encode() {
    return "1" + (state.mode === "full" ? "f" : "r") + D.questions.map(function (q) {
      var v = state.ans[q.id];
      if (v === undefined || v === null) return "_";
      var c = CODE[2 - v];
      return state.imp[q.id] ? c.toUpperCase() : c;
    }).join("");
  }
  function decode(s) {
    if (!s || s[0] !== "1") return null;
    var mode = s[1] === "f" ? "full" : "rapid";
    var body = s.slice(2), ans = {}, imp = {}, n = 0;
    D.questions.forEach(function (q, k) {
      var c = body[k];
      if (!c || c === "_") return;
      var idx = CODE.indexOf(c.toLowerCase());
      if (idx < 0) return;
      ans[q.id] = 2 - idx;
      if (c !== c.toLowerCase()) imp[q.id] = 1;
      n++;
    });
    return n ? { mode: mode, ans: ans, imp: imp } : null;
  }

  /* ---------- Cálculo ----------
   * Afinidad = 100 · (1 − Σ peso·|tú − partido| / Σ peso·4)
   * sobre las preguntas respondidas (peso 2 si la marcas como importante).
   * La respuesta "neutral" cuenta (0), "saltar" no cuenta. */
  function compute(ans, imp) {
    var ids = Object.keys(ans).filter(function (id) { return QBYID[id]; });
    var res = D.parties.map(function (p) {
      var num = 0, den = 0, yes = [], no = [], cats = {};
      ids.forEach(function (id) {
        var q = QBYID[id], pp = q.pos[p.id];
        if (!pp) return;
        var w = imp[id] ? 2 : 1, u = ans[id], d = Math.abs(u - pp[0]);
        num += w * d; den += w * 4;
        var c = cats[q.cat] || (cats[q.cat] = { num: 0, den: 0 });
        c.num += w * d; c.den += w * 4;
        var item = { q: q, u: u, p: pp[0], why: pp[1], w: w, d: d };
        if (u !== 0 && pp[0] !== 0 && (u > 0) === (pp[0] > 0)) yes.push(item);
        else if (u === pp[0]) yes.push(item);
        else if (u !== 0 && pp[0] !== 0) no.push(item);
      });
      var catPct = {};
      Object.keys(cats).forEach(function (k) { catPct[k] = Math.round(100 * (1 - cats[k].num / cats[k].den)); });
      yes.sort(function (a, b) { return b.w - a.w || a.d - b.d; });
      no.sort(function (a, b) { return b.w - a.w || b.d - a.d; });
      return { p: p, pct: den ? Math.round(1000 * (1 - num / den)) / 10 : 0, yes: yes, no: no, cats: catPct };
    });
    res.sort(function (a, b) { return b.pct - a.pct; });
    return { ranking: res, ids: ids };
  }

  /* Ejes: económico (izq. ↔ der.), social (progresista ↔ conservador),
   * territorial (plurinacional ↔ centralista). Valores −1..1. */
  function axes(getVal, ids) {
    var out = {};
    ["e", "s", "t"].forEach(function (k) {
      var num = 0, den = 0;
      ids.forEach(function (id) {
        var q = QBYID[id], dir = q.ax && q.ax[k];
        if (!dir) return;
        var v = getVal(q);
        if (v === undefined || v === null) return;
        num += v * dir; den += 2 * Math.abs(dir);
      });
      out[k] = den ? num / den : 0;
    });
    return out;
  }

  /* ---------- Vistas ---------- */
  function viewStart() {
    var nCore = questionsFor("rapid").length, nAll = D.questions.length;
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) {}
    root.innerHTML =
      (saved && saved.list && saved.list.length && saved.i > 0 && saved.i < saved.list.length
        ? '<div class="note" style="margin-bottom:16px">Tienes un test a medias (' + saved.i + "/" + saved.list.length + ' preguntas). <button class="link-btn" id="resume" style="color:var(--brand)">Continuar donde lo dejé →</button></div>'
        : "") +
      '<h1 class="qtext" style="font-size:clamp(28px,4.4vw,42px)">Elige tu test</h1>' +
      '<p class="res-sub" style="text-align:left">Responde con sinceridad. No hay respuestas correctas y tus respuestas no salen de tu dispositivo.</p>' +
      '<div class="mode-pick">' +
      '<button class="mode" data-mode="rapid"><b>Test rápido</b><span>' + nCore + " preguntas sobre los temas clave de la campaña.</span><br><span class=\"tag\">≈ 3 minutos</span></button>" +
      '<button class="mode" data-mode="full"><b>Test completo</b><span>' + nAll + " preguntas. El resultado más preciso, con todos los temas.</span><br><span class=\"tag\">≈ 8 minutos · recomendado</span></button>" +
      "</div>";
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.onclick = function () {
        state = { mode: b.dataset.mode, list: questionsFor(b.dataset.mode), i: 0, ans: {}, imp: {} };
        track("quiz_start", { mode: state.mode });
        save();
        viewQuestion();
      };
    });
    var r = $("#resume");
    if (r) r.onclick = function () { state = saved; viewQuestion(); };
  }

  function viewQuestion() {
    if (state.i >= state.list.length) return viewGate(10);
    var q = QBYID[state.list[state.i]], n = state.list.length, cur = state.ans[q.id];
    var pct = Math.round((state.i / n) * 100);
    var html =
      '<div class="progress"><span>' + (state.i + 1) + " / " + n + '</span><div class="bar"><i style="width:' + pct + '%"></i></div><span>' + pct + "%</span></div>" +
      '<article class="qcard" aria-live="polite">' +
      '<span class="qcat">' + esc(D.cats[q.cat]) + "</span>" +
      '<h2 class="qtext">' + esc(q.text) + "</h2>" +
      (q.info ? '<details class="qmore"><summary>¿Qué significa esto?</summary><p>' + esc(q.info) + "</p></details>" : '<div style="height:10px"></div>') +
      '<div class="answers" role="group" aria-label="Tu respuesta">' +
      ["2", "1", "0", "-1", "-2"].map(function (v) {
        return '<button class="ans' + (String(cur) === v ? " sel" : "") + '" data-v="' + v + '"><span class="k">' + KEYS[v] + "</span>" + LABELS[v] + "</button>";
      }).join("") +
      "</div>" +
      '<div class="qfoot"><div class="left">' +
      '<button class="star" aria-pressed="' + (state.imp[q.id] ? "true" : "false") + '" id="imp">★ Esto es importante para mí</button>' +
      "</div><div>" +
      (state.i > 0 ? '<button class="link-btn" id="back">← Anterior</button>' : "") +
      '<button class="link-btn" id="skip">Saltar →</button></div></div>' +
      "</article>" +
      '<p class="kbd-hint">Atajos: teclas 1–5 para responder · S saltar · I importante · ← volver</p>' +
      '<div class="ad" data-ad="quiz" hidden></div>';
    root.innerHTML = html;
    if (window.SiteAds) window.SiteAds.fill(root);
    root.querySelectorAll(".ans").forEach(function (b) {
      b.onclick = function () { answer(parseInt(b.dataset.v, 10)); };
    });
    $("#imp").onclick = function () {
      if (state.imp[q.id]) delete state.imp[q.id]; else state.imp[q.id] = 1;
      this.setAttribute("aria-pressed", state.imp[q.id] ? "true" : "false");
      save();
    };
    $("#skip").onclick = function () { delete state.ans[q.id]; next(); };
    var back = $("#back");
    if (back) back.onclick = prev;
  }

  function answer(v) {
    state.ans[state.list[state.i]] = v;
    next();
  }
  function next() {
    state.i++;
    save();
    if (state.i === Math.floor(state.list.length / 2)) track("quiz_half", { mode: state.mode });
    viewQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function prev() { if (state.i > 0) { state.i--; save(); viewQuestion(); } }

  document.addEventListener("keydown", function (e) {
    if (!root.querySelector(".qcard") || e.metaKey || e.ctrlKey || e.altKey) return;
    var map = { "1": 2, "2": 1, "3": 0, "4": -1, "5": -2 };
    if (map[e.key] !== undefined) answer(map[e.key]);
    else if (e.key === "s" || e.key === "S") $("#skip").click();
    else if (e.key === "i" || e.key === "I") $("#imp").click();
    else if (e.key === "ArrowLeft") prev();
  });

  /* ---------- Pantalla de espera con publicidad ----------
   * Cuenta atrás antes de mostrar el resultado. Si hay un bloque "rewarded"
   * de Google Ad Manager configurado, se ofrece verlo para saltar la espera. */
  function viewGate(seconds) {
    var answered = Object.keys(state.ans).length;
    if (!answered) {
      root.innerHTML = '<div class="qcard"><h2 class="qtext">No has respondido ninguna pregunta</h2><p class="res-sub" style="text-align:left">Necesitamos al menos una respuesta para calcular tu afinidad.</p><p style="margin-top:18px"><button class="btn btn-primary" id="again">Empezar de nuevo</button></p></div>';
      $("#again").onclick = function () { clear(); viewStart(); };
      return;
    }
    var code = encode();
    try { history.replaceState(null, "", "#r=" + code); } catch (e) {}
    clear();
    try { localStorage.setItem("q29-mine", code); } catch (e) {}
    track("quiz_complete", { mode: state.mode, answered: answered });

    var total = ADS.gateSeconds != null ? ADS.gateSeconds : seconds;
    if (!total) return goResults(code);
    var C = 2 * Math.PI * 58;
    root.innerHTML =
      '<div class="qcard gate">' +
      '<div class="ring"><svg width="132" height="132"><circle cx="66" cy="66" r="58" fill="none" stroke="var(--surface-2)" stroke-width="10"/><circle id="arc" cx="66" cy="66" r="58" fill="none" stroke="var(--brand)" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="0" style="transition:stroke-dashoffset 1s linear"/></svg><b id="sec">' + total + "</b></div>" +
      "<h2>Calculando tu resultado…</h2>" +
      "<p>Comparamos tus " + answered + " respuestas con las posiciones de " + D.parties.length + " partidos.</p>" +
      '<ul class="gate-steps"><li>Analizando tus respuestas</li><li>Comparando con los programas electorales</li><li>Calculando tus ejes ideológicos</li><li>Preparando tu informe detallado</li></ul>' +
      '<p><button class="btn btn-primary" id="see" disabled>Ver mi resultado</button></p>' +
      '<p id="rw" style="margin-top:10px"></p>' +
      "</div>";
    var left = total, steps = root.querySelectorAll(".gate-steps li"), btn = $("#see"), done = false;
    var timer = setInterval(function () {
      left--;
      $("#sec").textContent = Math.max(0, left);
      $("#arc").style.strokeDashoffset = String(C * (1 - left / total));
      var k = Math.floor(((total - left) / total) * steps.length);
      for (var j = 0; j < Math.min(k, steps.length); j++) steps[j].classList.add("done");
      if (left <= 0) unlock();
    }, 1000);
    function unlock() {
      if (done) return;
      done = true;
      clearInterval(timer);
      steps.forEach(function (s) { s.classList.add("done"); });
      $("#sec").textContent = "✓";
      btn.disabled = false;
      btn.focus();
    }
    btn.onclick = function () { track("result_view", { mode: state.mode }); goResults(code); };
    rewarded(function () { unlock(); btn.click(); });
  }

  /* El resultado vive en /resultado/ (allí se puede activar el Offerwall de AdSense). */
  function goResults(code) { location.href = "/resultado/#r=" + code; }

  function rewarded(onGranted) {
    var unit = ADS.gamRewardedUnit;
    if (!unit) return;
    window.googletag = window.googletag || { cmd: [] };
    if (!document.getElementById("gpt-js")) {
      var s = document.createElement("script");
      s.id = "gpt-js";
      s.async = true;
      s.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      document.head.appendChild(s);
    }
    googletag.cmd.push(function () {
      var slot = googletag.defineOutOfPageSlot(unit, googletag.enums.OutOfPageFormat.REWARDED);
      if (!slot) return;
      slot.addService(googletag.pubads());
      var granted = false;
      googletag.pubads().addEventListener("rewardedSlotReady", function (ev) {
        var holder = document.getElementById("rw");
        if (!holder) return;
        holder.innerHTML = '<button class="btn btn-ghost btn-sm">▶ Ver un anuncio y saltar la espera</button>';
        holder.firstChild.onclick = function () { ev.makeRewardedVisible(); holder.innerHTML = ""; };
      });
      googletag.pubads().addEventListener("rewardedSlotGranted", function () { granted = true; });
      googletag.pubads().addEventListener("rewardedSlotClosed", function () {
        googletag.destroySlots([slot]);
        if (granted) onGranted();
      });
      googletag.enableServices();
      googletag.display(slot);
    });
  }

  /* ---------- Resultados ---------- */
  var PAY = CFG.payments || {};
  var UNLOCK = "q29-unlock", MINE = "q29-mine", LAST = "q29-last";
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function isUnlocked() { return !PAY.enabled || !!lsGet(UNLOCK); }
  function signClass(v) { return v === undefined || v === null ? "vx" : "v" + v; }
  function vtxt(v) { return v === undefined || v === null ? "–" : KEYS[String(v)]; }
  var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function viewResults(code) {
    var dec = decode(code);
    if (!dec) return viewStart();
    var R = compute(dec.ans, dec.imp), top = R.ranking[0], second = R.ranking[1];
    var mine = lsGet(MINE) === code;          // ¿es mi resultado o uno compartido?
    var unlocked = isUnlocked();
    if (mine) lsSet(LAST, code);
    if (unlocked && PAY.enabled) document.body.classList.add("no-ads");
    var domain = CFG.domain || location.host;
    var shareUrl = (CFG.siteUrl || location.origin) + "/resultado/#r=" + code;
    var shareText = "Mi partido más afín para el 29N es " + top.p.short + " (" + Math.round(top.pct) + "%). ¿Y el tuyo? Haz el test:";
    var close = second && top.pct - second.pct < 3;

    var html =
      (!mine ? '<div class="note" style="margin-bottom:14px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><span>Estás viendo el resultado que alguien ha compartido contigo.</span><a class="btn btn-primary btn-sm" href="/test/">Haz tu propio test →</a></div>' : "") +
      '<section class="share-card" id="card" style="--pc:' + top.p.color + '">' +
      '<div class="sc-top"><span class="sc-brand"><span class="brand-mark">' + CHECK + "</span>" + esc(CFG.brand || "") + '</span><span>Elecciones generales · 29N 2026</span></div>' +
      '<div class="res-kicker">' + (mine ? "Mi partido más afín" : "Su partido más afín") + "</div>" +
      '<div class="res-name">' + esc(top.p.short) + "</div>" +
      '<div class="res-pct">' + Math.round(top.pct) + "%</div>" +
      '<p class="res-sub">de afinidad con ' + esc(top.p.name) + "</p>" +
      '<div class="sc-bars">' +
      R.ranking.slice(0, 5).map(function (r) {
        return '<div class="sc-row"><span class="sc-n"><i class="dot" style="background:' + r.p.color + '"></i>' + esc(r.p.short) + '</span><span class="rk-bar"><i style="width:' + r.pct + "%;background:" + r.p.color + '"></i></span><b>' + Math.round(r.pct) + "%</b></div>";
      }).join("") +
      "</div>" +
      '<div class="sc-foot">¿Y tú? Haz el test en <b>' + esc(domain) + "</b></div>" +
      "</section>" +
      (close ? '<p class="note" style="margin-top:12px">Empate técnico: ' + esc(second.p.short) + " está a menos de 3 puntos (" + Math.round(second.pct) + "%).</p>" : "") +
      '<div class="res-share">' +
      '<button class="share img" id="shareimg">📷 Compartir imagen</button>' +
      '<a class="share wa" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(shareText + " " + shareUrl) + '">WhatsApp</a>' +
      '<a class="share x" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(shareUrl) + '">X</a>' +
      '<a class="share tg" target="_blank" rel="noopener" href="https://t.me/share/url?url=' + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText) + '">Telegram</a>' +
      '<a class="share fb" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl) + '">Facebook</a>' +
      '<button class="share cp" id="dlimg">Descargar imagen</button>' +
      '<button class="share cp" id="copy">Copiar enlace</button>' +
      "</div>" +
      '<p class="disclaimer" style="text-align:center;margin-top:8px">Para Instagram o TikTok: pulsa «Compartir imagen» o haz una captura de la tarjeta.</p>' +

      '<div class="ad" data-ad="results1" hidden></div>' +

      '<section class="section" style="padding-top:18px"><h2>Afinidad con cada partido</h2>' +
      '<div class="rank">' +
      R.ranking.map(function (r, k) {
        return '<div class="rk"><span class="rk-pos">' + (k + 1) + '</span><span><span class="rk-name"><span class="dot" style="background:' + r.p.color + '"></span>' + esc(r.p.short) + " <small>" + esc(r.p.candidate || "") + '</small></span><span class="rk-bar"><i style="width:0;background:' + r.p.color + '" data-w="' + r.pct + '"></i></span></span><span class="rk-pct">' + Math.round(r.pct) + "%</span></div>";
      }).join("") +
      "</div></section>" +

      '<div id="premium"></div>' +
      '<div class="ad" data-ad="results2" hidden></div>' +

      '<section class="card noprint" style="text-align:center;margin-top:24px"><h3>¿Y tus amigos?</h3><p>Comparte el test y comparad resultados. Es anónimo y gratuito.</p>' +
      '<p style="margin-top:14px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(shareText + " " + shareUrl) + '">Compartir por WhatsApp</a><a class="btn btn-ghost btn-sm" href="/test/">' + (mine ? "Repetir el test" : "Hacer mi test") + "</a></p></section>" +
      '<p class="disclaimer">Resultado orientativo, no es una recomendación de voto. Compara las posiciones públicas de cada partido con tus respuestas según la <a href="/metodologia/">metodología</a> publicada. Consulta los programas oficiales antes de votar.</p>';

    root.innerHTML = html;
    if (!(unlocked && PAY.enabled) && window.SiteAds) window.SiteAds.fill(root);
    setTimeout(function () { root.querySelectorAll(".rk-bar i[data-w]").forEach(function (i) { i.style.width = i.dataset.w + "%"; }); }, 80);

    var prem = $("#premium");
    if (unlocked) renderPremium(prem, dec, R);
    else if (mine) renderPaywall(prem, R);
    else prem.innerHTML = "";

    $("#copy").onclick = function () {
      (navigator.clipboard ? navigator.clipboard.writeText(shareUrl) : Promise.reject()).then(function () { toast("Enlace copiado"); }, function () { prompt("Copia este enlace:", shareUrl); });
      track("share", { method: "copy" });
    };
    $("#shareimg").onclick = function () { shareImage(R, mine, shareText, shareUrl, false); };
    $("#dlimg").onclick = function () { shareImage(R, mine, shareText, shareUrl, true); };
    root.querySelectorAll("a.share").forEach(function (a) { a.addEventListener("click", function () { track("share", { method: a.textContent }); }); });
    window.scrollTo(0, 0);
  }

  /* ---------- Muro de pago del informe completo ---------- */
  function renderPaywall(el, R) {
    var top = R.ranking[0];
    var sample = top.yes.slice(0, 3).concat(top.no.slice(0, 2));
    el.innerHTML =
      '<section class="paywall">' +
      '<span class="pill">Informe completo</span>' +
      "<h2>¿Por qué te sale " + esc(top.p.short) + "? Descúbrelo tema a tema</h2>" +
      '<ul class="pw-list">' +
      "<li>" + CHECK + " <span>En qué <b>coincides y en qué discrepas</b> con cada uno de los " + D.parties.length + " partidos, con la justificación de su postura</span></li>" +
      "<li>" + CHECK + " <span>Tu <b>brújula política</b> y tus ejes económico, social y territorial</span></li>" +
      "<li>" + CHECK + " <span>Tu afinidad <b>por temas</b>: vivienda, impuestos, inmigración…</span></li>" +
      "<li>" + CHECK + " <span>Tabla completa de tus respuestas frente a todos los partidos</span></li>" +
      "<li>" + CHECK + " <span>Descarga en <b>PDF</b> y sin anuncios</span></li>" +
      "</ul>" +
      '<div class="pw-preview" aria-hidden="true"><ul>' +
      sample.map(function (it) { return "<li>" + esc(it.q.text) + "<small>" + esc(it.why) + "</small></li>"; }).join("") +
      '</ul><div class="pw-lock">🔒 Contenido del informe completo</div></div>' +
      '<label class="pw-consent"><input type="checkbox" id="waiver"> <span>Quiero acceder al informe de forma inmediata y acepto que, una vez desbloqueado, <b>pierdo el derecho de desistimiento</b> (art. 103.m de la Ley General para la Defensa de los Consumidores). He leído las <a href="/condiciones/" target="_blank">condiciones de venta</a>.</span></label>' +
      '<button class="btn btn-primary" id="buy" disabled>Desbloquear por ' + esc(PAY.priceLabel || "1,99 €") + "</button>" +
      '<p class="pw-fine">Pago único, IVA incluido. Pago seguro con Stripe: tarjeta, Apple Pay o Google Pay. Pagar no cambia tu resultado. Tus respuestas no se envían a ningún servidor: el informe se genera en tu dispositivo y queda desbloqueado en este navegador.</p>' +
      '<p class="pw-err" id="pwerr" role="alert"></p>' +
      "</section>";
    var chk = $("#waiver"), buy = $("#buy");
    chk.onchange = function () { buy.disabled = !chk.checked; };
    buy.onclick = function () {
      if (!chk.checked) return;
      buy.disabled = true;
      buy.textContent = "Abriendo pago seguro…";
      track("checkout_start");
      fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ waiver: true }) })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) {
          if (d && d.url) { location.href = d.url; return; }
          throw new Error((d && d.error) || "No se pudo iniciar el pago.");
        })
        .catch(function (e) {
          $("#pwerr").textContent = e.message || "No se pudo iniciar el pago. Inténtalo de nuevo.";
          buy.disabled = false;
          buy.textContent = "Desbloquear por " + (PAY.priceLabel || "1,99 €");
        });
    };
  }

  /* ---------- Informe completo ---------- */
  function renderPremium(el, dec, R) {
    var top = R.ranking[0];
    var you = axes(function (q) { return dec.ans[q.id]; }, R.ids);
    var partyAx = {};
    D.parties.forEach(function (p) { partyAx[p.id] = axes(function (q) { return q.pos[p.id] && q.pos[p.id][0]; }, R.ids); });
    el.innerHTML =
      '<section class="section" style="padding-top:10px"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><h2 style="margin:0">Tu informe completo</h2><button class="btn btn-ghost btn-sm noprint" id="pdf">⤓ Descargar PDF</button></div>' +
      '<div class="res-grid">' +
      '<div class="card"><h3>Tu posición ideológica</h3><p>Calculada con tus respuestas. Los puntos de color son los partidos, calculados con la misma fórmula.</p>' + compass(you, partyAx, top.p.id) + "</div>" +
      '<div class="card"><h3>Tus ejes</h3>' +
      axisBar("Izquierda económica", "Derecha económica", you.e) +
      axisBar("Progresista", "Conservador", you.s) +
      axisBar("Plurinacional / descentralización", "Centralista", you.t) +
      '<h3 style="margin-top:22px">Afinidad con ' + esc(top.p.short) + " por temas</h3>" +
      '<div class="cat-bars">' +
      Object.keys(top.cats).sort(function (a, b) { return top.cats[b] - top.cats[a]; }).map(function (c) {
        return "<div><span>" + esc(D.cats[c]) + '</span><span class="rk-bar"><i style="width:' + top.cats[c] + "%;background:" + top.p.color + '"></i></span><b>' + top.cats[c] + "%</b></div>";
      }).join("") +
      "</div></div></div></section>" +
      '<section class="section" id="detalle"><h2>En qué coincides y en qué no</h2>' +
      '<div class="tabs noprint" role="tablist">' +
      R.ranking.map(function (r, k) {
        return '<button class="tab" role="tab" data-tab="' + r.p.id + '" aria-selected="' + (k === 0) + '"><span class="dot" style="background:' + r.p.color + '"></span>' + esc(r.p.short) + " · " + Math.round(r.pct) + "%</button>";
      }).join("") +
      '</div><div id="cmp"></div></section>' +
      '<section class="section"><h2>Todas tus respuestas frente a los partidos</h2>' +
      '<div class="card tbl-scroll">' + table(dec, R) + "</div>" +
      '<p class="disclaimer">++ totalmente de acuerdo · + de acuerdo · = neutral · − en desacuerdo · −− totalmente en desacuerdo · ★ importante para ti (cuenta doble).</p></section>';

    function showCmp(pid) {
      var r = R.ranking.filter(function (x) { return x.p.id === pid; })[0];
      el.querySelectorAll(".tab").forEach(function (t) { t.setAttribute("aria-selected", String(t.dataset.tab === pid)); });
      function li(it) {
        return "<li>" + esc(it.q.text) + (it.w > 1 ? " ★" : "") + '<small><span class="yo">Tú: ' + LABELS[String(it.u)].toLowerCase() + "</span> · " + esc(r.p.short) + ": " + LABELS[String(it.p)].toLowerCase() + "<br>" + esc(it.why) + "</small></li>";
      }
      $("#cmp").innerHTML =
        '<h3 class="print-only" style="margin:10px 0">' + esc(r.p.name) + " · " + Math.round(r.pct) + "%</h3>" +
        '<div class="cmp-cols">' +
        '<div class="cmp yes"><h4><span class="dot" style="background:var(--agree)"></span>Coincides (' + r.yes.length + ")</h4><ul>" + (r.yes.map(li).join("") || "<li>Ninguna coincidencia clara.</li>") + "</ul></div>" +
        '<div class="cmp no"><h4><span class="dot" style="background:var(--disagree)"></span>Discrepas (' + r.no.length + ")</h4><ul>" + (r.no.map(li).join("") || "<li>Ninguna discrepancia clara.</li>") + "</ul></div>" +
        "</div>" +
        '<p class="noprint" style="margin-top:14px"><a href="/partidos/' + r.p.id + '/">Ver todas las posiciones de ' + esc(r.p.short) + " →</a></p>";
    }
    el.querySelectorAll(".tab").forEach(function (t) { t.onclick = function () { showCmp(t.dataset.tab); }; });
    showCmp(top.p.id);
    $("#pdf").onclick = function () { track("pdf"); window.print(); };
  }

  /* ---------- Imagen para compartir (1080×1350, generada en el navegador) ---------- */
  function shareImage(R, mine, text, url, download) {
    var W = 1080, H = 1350, c = document.createElement("canvas");
    c.width = W; c.height = H;
    var x = c.getContext("2d"), top = R.ranking[0];
    var disp = "'Bricolage Grotesque', Inter, system-ui, sans-serif", body = "Inter, system-ui, sans-serif";
    var fontsReady = document.fonts && document.fonts.load
      ? Promise.all([document.fonts.load("800 100px 'Bricolage Grotesque'"), document.fonts.load("600 30px Inter"), document.fonts.load("800 30px Inter")]).catch(function () {})
      : Promise.resolve();
    fontsReady.then(function () {
      x.fillStyle = "#f6f5f1"; x.fillRect(0, 0, W, H);
      x.fillStyle = "#e9ebff"; x.beginPath(); x.arc(W + 40, -40, 360, 0, 2 * Math.PI); x.fill();
      x.fillStyle = top.p.color; x.fillRect(0, 0, W, 16);
      // marca
      rr(x, 80, 76, 64, 64, 16); x.fillStyle = "#2f3cf0"; x.fill();
      x.strokeStyle = "#fff"; x.lineWidth = 8; x.lineCap = "round"; x.lineJoin = "round";
      x.beginPath(); x.moveTo(97, 109); x.lineTo(107, 119); x.lineTo(127, 97); x.stroke();
      x.fillStyle = "#16181d"; x.font = "800 40px " + disp; x.textBaseline = "middle";
      x.fillText(CFG.brand || "", 162, 110);
      x.fillStyle = "#555b66"; x.font = "600 30px " + body; x.textBaseline = "alphabetic";
      x.fillText((mine ? "Mi partido más afín" : "Su partido más afín") + " · Elecciones 29N", 80, 250);
      // partido
      x.fillStyle = "#16181d";
      var size = 150; x.font = "800 " + size + "px " + disp;
      while (x.measureText(top.p.short).width > W - 160 && size > 60) { size -= 6; x.font = "800 " + size + "px " + disp; }
      x.fillText(top.p.short, 76, 250 + size * 0.95);
      x.fillStyle = top.p.color; x.font = "800 170px " + disp;
      var py = 250 + size * 0.95 + 175;
      x.fillText(Math.round(top.pct) + "%", 72, py);
      x.fillStyle = "#555b66"; x.font = "600 30px " + body;
      x.fillText("de afinidad", 80, py + 52);
      // top 5
      var y0 = py + 130;
      R.ranking.slice(0, 5).forEach(function (r, i) {
        var y = y0 + i * 74;
        x.fillStyle = r.p.color; x.beginPath(); x.arc(92, y - 10, 11, 0, 2 * Math.PI); x.fill();
        x.fillStyle = "#16181d"; x.font = "700 32px " + body; x.fillText(r.p.short, 116, y);
        rr(x, 420, y - 26, 460, 22, 11); x.fillStyle = "#e4e1d8"; x.fill();
        rr(x, 420, y - 26, Math.max(22, 460 * r.pct / 100), 22, 11); x.fillStyle = r.p.color; x.fill();
        x.fillStyle = "#16181d"; x.font = "800 32px " + body; x.textAlign = "right"; x.fillText(Math.round(r.pct) + "%", W - 80, y); x.textAlign = "left";
      });
      // pie
      rr(x, 80, H - 150, W - 160, 84, 20); x.fillStyle = "#2f3cf0"; x.fill();
      x.fillStyle = "#8a8f99"; x.font = "600 26px " + body; x.textAlign = "center";
      x.fillText("Test de afinidad política · Elecciones generales 2026", W / 2, H - 190);
      x.fillStyle = "#fff"; x.font = "700 34px " + body;
      x.fillText("¿Y tú? Haz el test en " + (CFG.domain || location.host), W / 2, H - 96); x.textAlign = "left";

      c.toBlob(function (blob) {
        if (!blob) return;
        var file = new File([blob], "mi-resultado-29n.png", { type: "image/png" });
        if (!download && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text: text + " " + url }).catch(function () {});
          track("share", { method: "image" });
        } else {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob); a.download = file.name;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
          toast("Imagen descargada");
          track("share", { method: "image_download" });
        }
      }, "image/png");
    });
  }
  function rr(x, X, Y, w, h, r) {
    x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r);
    x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  function axisBar(l, r, v) {
    return '<div class="axis"><div class="axis-l"><span>' + l + "</span><span>" + r + '</span></div><div class="axis-t"><i style="left:' + (50 + v * 50).toFixed(1) + '%"></i></div></div>';
  }

  function compass(you, pax, topId) {
    var S = 300, pad = 28, mid = S / 2, R = (S - 2 * pad) / 2;
    function X(v) { return mid + v * R; }
    function Y(v) { return mid - v * R; }
    var dots = D.parties.map(function (p) {
      var a = pax[p.id];
      return '<g><circle cx="' + X(a.e).toFixed(1) + '" cy="' + Y(a.s).toFixed(1) + '" r="' + (p.id === topId ? 8 : 6) + '" fill="' + p.color + '" stroke="var(--surface)" stroke-width="2"><title>' + esc(p.short) + "</title></circle></g>";
    }).join("");
    return '<div class="compass-wrap"><svg class="compass" viewBox="0 0 ' + S + " " + S + '" role="img" aria-label="Brújula política">' +
      '<rect x="' + pad + '" y="' + pad + '" width="' + 2 * R + '" height="' + 2 * R + '" rx="10" fill="var(--surface-2)"/>' +
      '<line x1="' + mid + '" y1="' + pad + '" x2="' + mid + '" y2="' + (S - pad) + '" stroke="var(--line)" stroke-width="1.5"/>' +
      '<line x1="' + pad + '" y1="' + mid + '" x2="' + (S - pad) + '" y2="' + mid + '" stroke="var(--line)" stroke-width="1.5"/>' +
      '<text x="' + mid + '" y="18" text-anchor="middle">Conservador</text>' +
      '<text x="' + mid + '" y="' + (S - 6) + '" text-anchor="middle">Progresista</text>' +
      '<text x="' + (pad + 4) + '" y="' + (mid - 6) + '">Izquierda</text>' +
      '<text x="' + (S - pad - 4) + '" y="' + (mid - 6) + '" text-anchor="end">Derecha</text>' +
      dots +
      '<g><circle cx="' + X(you.e).toFixed(1) + '" cy="' + Y(you.s).toFixed(1) + '" r="11" fill="var(--text)" stroke="var(--surface)" stroke-width="3"/><text x="' + X(you.e).toFixed(1) + '" y="' + (Y(you.s) + 4).toFixed(1) + '" text-anchor="middle" style="fill:var(--bg);font-weight:800;font-size:10px">TÚ</text></g>' +
      "</svg>" +
      '<div class="legend">' + D.parties.map(function (p) { return '<span><i class="dot" style="background:' + p.color + '"></i>' + esc(p.short) + "</span>"; }).join("") + "</div></div>";
  }

  function table(dec, R) {
    var ps = R.ranking.map(function (r) { return r.p; });
    return '<table class="qa-table"><thead><tr><th>Afirmación</th><th>Tú</th>' + ps.map(function (p) { return '<th title="' + esc(p.name) + '">' + esc(p.short) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      D.questions.filter(function (q) { return dec.ans[q.id] !== undefined; }).map(function (q) {
        var u = dec.ans[q.id];
        return "<tr><td>" + esc(q.text) + (dec.imp[q.id] ? " ★" : "") + '</td><td><span class="v ' + signClass(u) + '">' + vtxt(u) + "</span></td>" +
          ps.map(function (p) { var v = q.pos[p.id] && q.pos[p.id][0]; return '<td><span class="v ' + signClass(v) + '" title="' + esc((q.pos[p.id] || [])[1] || "") + '">' + vtxt(v) + "</span></td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table>";
  }

  /* ---------- Arranque ---------- */
  var m = location.hash.match(/r=([\w-]+)/);
  var qs = new URLSearchParams(location.search);
  var onResults = /^\/resultado/.test(location.pathname);
  function emptyResults() {
    root.innerHTML = '<div class="qcard"><h1 class="qtext">Aún no tienes resultado</h1><p class="res-sub" style="text-align:left">Haz el test para descubrir tu afinidad con cada partido.</p><p style="margin-top:18px"><a class="btn btn-primary" href="/test/">Empezar el test</a></p></div>';
  }
  function showCode(code) {
    try { history.replaceState(null, "", "/resultado/#r=" + code); } catch (e) {}
    viewResults(code);
  }
  if (onResults && qs.get("session_id")) {
    // Vuelta de Stripe: verificar el pago y desbloquear el informe en este navegador.
    root.innerHTML = '<div class="qcard gate"><h2>Confirmando tu pago…</h2><p>Un momento, por favor.</p></div>';
    var back = lsGet(LAST) || lsGet(MINE);
    fetch("/api/verify?session_id=" + encodeURIComponent(qs.get("session_id")))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.paid) {
          lsSet(UNLOCK, JSON.stringify({ sid: qs.get("session_id"), at: new Date().toISOString() }));
          track("purchase", { value: 1.99, currency: "EUR" });
          toast("¡Pago confirmado! Informe desbloqueado");
        } else toast("No hemos podido confirmar el pago");
      })
      .catch(function () { toast("No hemos podido confirmar el pago"); })
      .then(function () { back && decode(back) ? showCode(back) : emptyResults(); });
  } else if (onResults) {
    if (qs.get("cancelado")) setTimeout(function () { toast("Pago cancelado: no se ha cobrado nada"); }, 300);
    var code = m && decode(m[1]) ? m[1] : (lsGet(LAST) && decode(lsGet(LAST)) ? lsGet(LAST) : null);
    if (code) showCode(code); else emptyResults();
  } else if (m && decode(m[1])) {
    location.replace("/resultado/#r=" + m[1]);
  } else {
    viewStart();
  }
})();
