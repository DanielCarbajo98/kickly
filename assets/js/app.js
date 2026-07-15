/* Kickly — lógica del sitio (agenda, reproductor, SEO dinámico, Monetag) */
(function () {
  "use strict";
  var CFG = window.KICKLY || {};
  var ROOT = document.body.getAttribute("data-root") || ".";

  /* ---------- Monetag ---------- */
  function loadMonetag() {
    var m = CFG.monetag || {};
    (m.zones || []).forEach(function (z) {
      if (!z || !z.src || !z.zone) return;
      var s = document.createElement("script");
      s.src = z.src;
      s.async = true;
      s.setAttribute("data-zone", String(z.zone));
      s.setAttribute("data-cfasync", "false");
      document.body.appendChild(s);
    });
    if (m.pushServiceWorker && "serviceWorker" in navigator) {
      navigator.serviceWorker.register(ROOT + "/sw.js").catch(function () {});
    }
  }

  /* ---------- Utilidades ---------- */
  function fmtDate(iso) {
    try {
      return new Intl.DateTimeFormat("es-ES", {
        weekday: "long", day: "numeric", month: "long",
        hour: "2-digit", minute: "2-digit"
      }).format(new Date(iso));
    } catch (e) { return iso; }
  }

  function matchUrl(m) { return ROOT + "/partido.html?p=" + encodeURIComponent(m.id); }

  function badge(m) {
    var now = Date.now(), kickoff = new Date(m.date).getTime();
    if (m.status === "live") return '<span class="badge live">EN DIRECTO</span>';
    if (m.status === "finished") return '<span class="badge">FINALIZADO</span>';
    if (kickoff - now < 36e5 && kickoff > now) return '<span class="badge soon">PRÓXIMAMENTE</span>';
    return "";
  }

  function card(m) {
    return '<a class="match-card" href="' + matchUrl(m) + '">' +
      '<div class="comp"><span>' + esc(m.competitionName) + "</span>" + badge(m) + "</div>" +
      '<div class="teams"><span>' + esc(m.home) + '</span><span class="vs">vs</span><span>' + esc(m.away) + "</span></div>" +
      '<time datetime="' + esc(m.date) + '">' + fmtDate(m.date) + "</time></a>";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function injectJsonLd(obj) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  function sportsEventLd(m) {
    var url = CFG.siteUrl + "/partido.html?p=" + encodeURIComponent(m.id);
    return {
      "@type": "SportsEvent",
      "name": m.home + " vs " + m.away,
      "description": m.description || (m.home + " contra " + m.away + " en directo — " + m.competitionName),
      "startDate": m.date,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "location": { "@type": "VirtualLocation", "url": url },
      "competitor": [
        { "@type": "SportsTeam", "name": m.home },
        { "@type": "SportsTeam", "name": m.away }
      ],
      "organizer": { "@type": "Organization", "name": m.competitionName },
      "url": url
    };
  }

  /* ---------- Datos ---------- */
  function loadMatches() {
    return fetch(ROOT + "/data/matches.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (d) { return d.matches || []; })
      .catch(function () { return []; });
  }

  /* ---------- Listados (portada y ligas) ---------- */
  function renderLists(matches) {
    var league = document.body.getAttribute("data-league");
    if (league) matches = matches.filter(function (m) { return m.competition === league; });
    matches.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

    var buckets = {
      live: matches.filter(function (m) { return m.status === "live"; }),
      upcoming: matches.filter(function (m) { return m.status === "scheduled"; }),
      finished: matches.filter(function (m) { return m.status === "finished"; })
    };
    Object.keys(buckets).forEach(function (key) {
      var el = document.getElementById("list-" + key);
      if (!el) return;
      var list = buckets[key];
      if (!list.length) {
        el.innerHTML = '<div class="empty">' +
          (key === "live" ? "Ahora mismo no hay partidos en directo. Consulta la agenda de próximos partidos."
                          : "No hay partidos en esta sección todavía.") + "</div>";
        return;
      }
      el.innerHTML = list.map(card).join("");
    });

    if (matches.length) {
      injectJsonLd({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": matches.slice(0, 20).map(function (m, i) {
          return { "@type": "ListItem", "position": i + 1, "item": sportsEventLd(m) };
        })
      });
    }
  }

  /* ---------- Página de partido ---------- */
  function renderMatchPage(matches) {
    var container = document.getElementById("match-page");
    if (!container) return;
    var id = new URLSearchParams(location.search).get("p");
    var m = matches.find(function (x) { return x.id === id; });

    if (!m) {
      container.innerHTML = '<div class="empty">Partido no encontrado. <a href="' + ROOT + '/">Volver a la agenda</a>.</div>';
      return;
    }

    var title = m.home + " vs " + m.away + " en directo — " + m.competitionName + " | " + CFG.siteName;
    document.title = title;
    setMeta("description", m.description || (m.home + " contra " + m.away + " en directo online. " + m.competitionName + ", " + fmtDate(m.date) + "."));
    setCanonical(CFG.siteUrl + "/partido.html?p=" + encodeURIComponent(m.id));
    setMeta("og:title", title, true);
    setMeta("og:url", CFG.siteUrl + "/partido.html?p=" + encodeURIComponent(m.id), true);

    var player;
    if (m.status !== "live" && !m.embed && !m.hls) {
      player = '<div class="player-msg"><strong>' + esc(m.home) + " vs " + esc(m.away) + "</strong>" +
        "<span>La emisión empezará el " + fmtDate(m.date) + "</span>" +
        '<span id="countdown"></span></div>';
    } else if (m.embed) {
      player = '<iframe src="' + esc(m.embed) + '" allowfullscreen loading="lazy" referrerpolicy="no-referrer" title="' +
        esc(m.home + " vs " + m.away) + '"></iframe>';
    } else if (m.hls) {
      player = '<video id="hls-player" controls playsinline poster=""></video>';
    } else {
      player = '<div class="player-msg"><span>Emisión no disponible todavía. Vuelve unos minutos antes del inicio.</span></div>';
    }

    container.innerHTML =
      '<div class="player-wrap">' + player + "</div>" +
      '<header class="match-head"><h1>' + esc(m.home) + " vs " + esc(m.away) + " en directo</h1>" +
      '<p class="meta">' + esc(m.competitionName) + " · <time datetime=\"" + esc(m.date) + '">' + fmtDate(m.date) + "</time> " + badge(m) + "</p></header>" +
      (m.description ? '<p class="prose">' + esc(m.description) + "</p>" : "") +
      '<section class="section"><h2>Más partidos</h2><div class="match-grid" id="related"></div></section>';

    if (m.hls) initHls(m.hls);
    startCountdown(m);

    var related = matches.filter(function (x) { return x.id !== m.id && x.status !== "finished"; }).slice(0, 6);
    document.getElementById("related").innerHTML =
      related.length ? related.map(card).join("") : '<div class="empty">No hay más partidos programados.</div>';

    var ld = sportsEventLd(m);
    ld["@context"] = "https://schema.org";
    injectJsonLd(ld);
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": CFG.siteUrl + "/" },
        { "@type": "ListItem", "position": 2, "name": m.competitionName, "item": CFG.siteUrl + "/ligas/" + m.competition + ".html" },
        { "@type": "ListItem", "position": 3, "name": m.home + " vs " + m.away }
      ]
    });
  }

  function initHls(src) {
    var video = document.getElementById("hls-player");
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
    s.onload = function () {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }
    };
    document.head.appendChild(s);
  }

  function startCountdown(m) {
    var el = document.getElementById("countdown");
    if (!el) return;
    function tick() {
      var diff = new Date(m.date).getTime() - Date.now();
      if (diff <= 0) { el.textContent = "¡El partido está a punto de empezar! Recarga la página."; return; }
      var d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5),
          mi = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
      el.textContent = "Faltan " + (d ? d + "d " : "") + h + "h " + mi + "m " + s + "s";
      setTimeout(tick, 1000);
    }
    tick();
  }

  function setMeta(name, content, isProperty) {
    var sel = isProperty ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var el = document.head.querySelector(sel);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(isProperty ? "property" : "name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setCanonical(url) {
    var el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.rel = "canonical";
      document.head.appendChild(el);
    }
    el.href = url;
  }

  /* ---------- Arranque ---------- */
  loadMonetag();
  loadMatches().then(function (matches) {
    renderLists(matches);
    renderMatchPage(matches);
  });
})();
