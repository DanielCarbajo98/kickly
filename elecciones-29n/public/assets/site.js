/* Común a todas las páginas: anuncios, cuenta atrás electoral, utilidades. */
(function () {
  var CFG = window.SITE || {};
  var ADS = CFG.ads || {};
  var debug = /[?&]adsdebug\b/.test(location.search);

  /* ---------- Anuncios ----------
   * Cada hueco publicitario es <div class="ad" data-ad="nombre">.
   * Si hay AdSense configurado se rellena con una unidad; si no, se oculta
   * (o se muestra un recuadro gris con ?adsdebug para ver la maqueta). */
  var adsenseLoaded = false;
  function loadAdsense() {
    if (adsenseLoaded || !ADS.adsenseClient) return;
    adsenseLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADS.adsenseClient;
    document.head.appendChild(s);
  }

  function fillAd(el) {
    if (el.dataset.filled) return;
    var name = el.dataset.ad;
    var slot = (ADS.slots || {})[name];
    el.dataset.filled = "1";
    if (ADS.adsenseClient && slot) {
      loadAdsense();
      el.hidden = false;
      el.innerHTML = '<span class="ad-label">Publicidad</span>' +
        '<ins class="adsbygoogle ad-box" style="display:block" data-ad-client="' + ADS.adsenseClient +
        '" data-ad-slot="' + slot + '"' +
        (name === "sticky" ? ' data-ad-format="horizontal" data-full-width-responsive="false"' : ' data-ad-format="auto" data-full-width-responsive="true"') +
        '></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    } else if (debug) {
      el.hidden = false;
      el.innerHTML = '<span class="ad-label">Publicidad</span><div class="ad-debug ad-box">Anuncio · ' + name + '</div>';
    } else {
      el.hidden = true;
    }
  }

  function fillAds(root) {
    (root || document).querySelectorAll(".ad[data-ad]").forEach(fillAd);
  }

  function stickyAd() {
    if (!ADS.sticky || !(ADS.adsenseClient && (ADS.slots || {}).sticky) && !debug) return;
    try { if (sessionStorage.getItem("stickyClosed")) return; } catch (e) {}
    var el = document.createElement("div");
    el.className = "ad ad-sticky";
    el.dataset.ad = "sticky";
    var x = document.createElement("button");
    x.className = "ad-sticky-x";
    x.setAttribute("aria-label", "Cerrar anuncio");
    x.textContent = "Cerrar ✕";
    x.onclick = function () {
      el.remove();
      document.body.classList.remove("has-sticky");
      try { sessionStorage.setItem("stickyClosed", "1"); } catch (e) {}
    };
    document.body.appendChild(el);
    fillAd(el);
    el.appendChild(x);
    document.body.classList.add("has-sticky");
  }

  /* Redes adicionales opcionales (p. ej. Monetag): scripts que da la red. */
  function extraNetworks() {
    (ADS.extraScripts || []).forEach(function (z) {
      var s = document.createElement("script");
      s.src = z.src;
      s.async = true;
      if (z.zone) s.dataset.zone = z.zone;
      s.setAttribute("data-cfasync", "false");
      document.head.appendChild(s);
    });
  }

  /* ---------- Cuenta atrás hasta el 29N ---------- */
  function countdown() {
    var el = document.querySelector("[data-countdown]");
    if (!el) return;
    var target = new Date(CFG.electionDate || "2026-11-29T09:00:00+01:00").getTime();
    function tick() {
      var d = Math.max(0, target - Date.now());
      var parts = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
      el.querySelectorAll("b").forEach(function (b, i) { b.textContent = String(parts[i]).padStart(2, "0"); });
    }
    tick();
    setInterval(tick, 1000);
  }

  window.SiteAds = { fill: fillAds, fillOne: fillAd, debug: debug };

  document.addEventListener("DOMContentLoaded", function () {
    fillAds();
    stickyAd();
    extraNetworks();
    countdown();
  });
})();
