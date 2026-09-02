/* ==========================================================================
   Distribuciones Rodrigo — comportamiento común del sitio
   Sin dependencias externas. Se carga con `defer` en todas las páginas.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Tema claro / oscuro ---------------------------------------------- */
  var THEME_KEY = "dr-theme";

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(value) {
    if (value === "dark" || value === "light") {
      doc.documentElement.setAttribute("data-theme", value);
    } else {
      doc.documentElement.removeAttribute("data-theme");
    }
    var isDark = value === "dark" ||
      (!value && window.matchMedia("(prefers-color-scheme: dark)").matches);
    doc.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", isDark ? "Activar tema claro" : "Activar tema oscuro");
      btn.setAttribute("aria-pressed", String(isDark));
    });
  }

  applyTheme(storedTheme());

  doc.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isDark = doc.documentElement.getAttribute("data-theme") === "dark" ||
        (!doc.documentElement.hasAttribute("data-theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      var next = isDark ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* modo privado */ }
      applyTheme(next);
    });
  });

  /* --- Cabecera adherida ------------------------------------------------- */
  var header = doc.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Menú móvil -------------------------------------------------------- */
  var mobileNav = doc.getElementById("mobile-nav");
  var openBtn = doc.querySelector("[data-nav-open]");
  var closeBtn = doc.querySelector("[data-nav-close]");

  function setNav(open) {
    if (!mobileNav) return;
    mobileNav.classList.toggle("is-open", open);
    mobileNav.setAttribute("aria-hidden", String(!open));
    doc.body.style.overflow = open ? "hidden" : "";
    if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      var first = mobileNav.querySelector("a, button");
      if (first) first.focus();
    } else if (openBtn) {
      openBtn.focus();
    }
  }

  if (openBtn) openBtn.addEventListener("click", function () { setNav(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setNav(false); });
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("is-open")) setNav(false);
  });

  /* --- Animación de entrada ---------------------------------------------- */
  var revealables = doc.querySelectorAll(".reveal");
  if (revealables.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* --- Contadores de cifras ---------------------------------------------- */
  function formatNumber(n, decimals) {
    return n.toLocaleString("es-ES", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function runCounter(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var decimals = (el.dataset.decimals && parseInt(el.dataset.decimals, 10)) || 0;
    if (reduceMotion) { el.textContent = formatNumber(target, decimals); return; }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutExpo
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = formatNumber(target * eased, decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = doc.querySelectorAll("[data-count]");
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            co.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* --- Pestañas de segmento ---------------------------------------------- */
  doc.querySelectorAll("[data-tabs]").forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll("[role='tab']"));
    var panels = tabs.map(function (t) { return doc.getElementById(t.getAttribute("aria-controls")); });

    function select(index) {
      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        if (panels[i]) panels[i].hidden = !active;
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next); tabs[next].focus(); }
      });
    });

    select(0);
  });

  /* --- Banner de cookies (RGPD) ------------------------------------------ */
  var COOKIE_KEY = "dr-cookies";
  var banner = doc.getElementById("cookie-banner");
  if (banner) {
    var decision = null;
    try { decision = localStorage.getItem(COOKIE_KEY); } catch (e) { /* ignorar */ }
    if (!decision) {
      window.setTimeout(function () { banner.classList.add("is-visible"); }, 900);
    }
    banner.querySelectorAll("[data-cookie]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem(COOKIE_KEY, btn.dataset.cookie); } catch (e) { /* ignorar */ }
        banner.classList.remove("is-visible");
        window.setTimeout(function () { banner.hidden = true; }, 450);
      });
    });
  }

  /* --- Formularios -------------------------------------------------------
     Sitio estático: no hay backend. El formulario valida en cliente y, por
     defecto, compone un correo con los datos hacia la dirección comercial.
     Para enviarlo por HTTP basta con definir `data-endpoint` en el <form>
     (Formspree, Netlify Forms, un webhook propio…) y el script hará POST.
     -------------------------------------------------------------------- */
  doc.querySelectorAll("form[data-contact-form]").forEach(function (form) {
    var status = form.querySelector("[data-form-status]");

    function say(kind, message) {
      if (!status) return;
      status.hidden = false;
      status.className = "form-status form-status--" + kind;
      status.textContent = message;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Trampa antispam: si está relleno, es un bot.
      var trap = form.querySelector("[name='empresa_web']");
      if (trap && trap.value) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var endpoint = form.dataset.endpoint;

      if (endpoint) {
        say("ok", "Enviando…");
        fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            form.reset();
            say("ok", "Mensaje enviado. Le responderemos en menos de 24 h laborables.");
          })
          .catch(function () {
            say("err", "No hemos podido enviar el formulario. Escríbanos a comercial@distribucionesrodrigo.com o llame al 976 31 33 12.");
          });
        return;
      }

      // Sin endpoint: abrir el cliente de correo con el contenido ya redactado.
      var lines = [];
      data.forEach(function (value, key) {
        if (key === "empresa_web" || key === "consent") return;
        var label = form.querySelector("[name='" + key + "']");
        var name = label && label.labels && label.labels[0]
          ? label.labels[0].textContent.replace("*", "").trim()
          : key;
        lines.push(name + ": " + value);
      });
      var subject = form.dataset.subject || "Solicitud de información desde la web";
      var mailto = "mailto:comercial@distribucionesrodrigo.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      window.location.href = mailto;
      say("ok", "Se abrirá su gestor de correo con el mensaje preparado. Si no ocurre, escriba a comercial@distribucionesrodrigo.com.");
    });
  });

  /* --- Año actual en el pie ---------------------------------------------- */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
