/* KICKLY — agenda multideporte, reproductor y metadatos dinámicos */
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
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(iso, opts) {
    try { return new Intl.DateTimeFormat("es-ES", opts).format(new Date(iso)); }
    catch (e) { return iso; }
  }
  function timeHM(iso) { return fmt(iso, { hour: "2-digit", minute: "2-digit" }); }
  function longDate(iso) { return fmt(iso, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }); }
  function dayKey(iso) { var d = new Date(iso); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function dayLabel(iso) {
    var today = dayKey(new Date().toISOString());
    var tomorrow = dayKey(new Date(Date.now() + 864e5).toISOString());
    var k = dayKey(iso);
    var name = fmt(iso, { weekday: "long", day: "numeric", month: "long" });
    if (k === today) return "Hoy · " + name;
    if (k === tomorrow) return "Mañana · " + name;
    return name;
  }
  function title(ev) { return ev.away ? ev.home + " – " + ev.away : ev.home; }
  function sportName(ev) { return (CFG.sports[ev.sport] || {}).name || ev.sport; }
  function evUrl(ev) { return ROOT + "/evento.html?e=" + encodeURIComponent(ev.id); }

  function pill(ev) {
    if (ev.status === "live") return '<span class="pill pill-live">EN DIRECTO</span>';
    if (ev.status === "finished") return '<span class="pill pill-end">FINALIZADO</span>';
    var diff = new Date(ev.date).getTime() - Date.now();
    if (diff > 0 && diff < 36e5) return '<span class="pill pill-soon">EMPIEZA PRONTO</span>';
    return "";
  }

  function row(ev, showDay) {
    return '<a class="row' + (ev.status === "live" ? " is-live" : "") + '" href="' + evUrl(ev) + '">' +
      '<div class="row-time">' + (ev.status === "live" ? "LIVE" : timeHM(ev.date)) +
        (showDay ? '<span class="day">' + esc(fmt(ev.date, { day: "numeric", month: "short" })) + "</span>" : "") + "</div>" +
      '<div class="row-teams"><b>' + esc(ev.home) + "</b>" + (ev.away ? "<b>" + esc(ev.away) + "</b>" : "") + "</div>" +
      '<div class="row-meta"><span class="row-comp">' + esc(sportName(ev)) + " · " + esc(ev.competitionName) + "</span>" + pill(ev) +
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div></a>';
  }

  function injectJsonLd(obj) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  function eventLd(ev) {
    var url = CFG.siteUrl + "/evento.html?e=" + encodeURIComponent(ev.id);
    var ld = {
      "@type": "SportsEvent",
      "name": title(ev) + " — " + ev.competitionName,
      "description": ev.description || (title(ev) + " en directo. " + sportName(ev) + " · " + ev.competitionName + "."),
      "startDate": ev.date,
      "sport": sportName(ev),
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "location": { "@type": "VirtualLocation", "url": url },
      "organizer": { "@type": "Organization", "name": ev.competitionName },
      "url": url
    };
    if (ev.away) {
      ld.competitor = [
        { "@type": "SportsTeam", "name": ev.home },
        { "@type": "SportsTeam", "name": ev.away }
      ];
    }
    return ld;
  }

  /* ---------- Datos ---------- */
  function loadEvents() {
    return fetch(ROOT + "/data/events.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (d) { return d.events || []; })
      .catch(function () { return []; });
  }

  /* ---------- Agenda (portada y páginas de deporte) ---------- */
  function renderAgenda(events) {
    var box = document.getElementById("agenda");
    if (!box) return;
    var sport = document.body.getAttribute("data-sport");
    if (sport) events = events.filter(function (e) { return e.sport === sport; });
    events.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

    var live = events.filter(function (e) { return e.status === "live"; });
    var upcoming = events.filter(function (e) { return e.status === "scheduled"; });
    var finished = events.filter(function (e) { return e.status === "finished"; });

    var html = "";
    if (live.length) {
      html += '<div class="group"><div class="group-head is-live"><i></i>En directo ahora</div><div class="list">' +
        live.map(function (e) { return row(e); }).join("") + "</div></div>";
    }
    if (upcoming.length) {
      var byDay = {};
      upcoming.forEach(function (e) {
        var k = dayKey(e.date);
        (byDay[k] = byDay[k] || []).push(e);
      });
      Object.keys(byDay).forEach(function (k) {
        var list = byDay[k];
        html += '<div class="group"><div class="group-head"><i></i>' + esc(dayLabel(list[0].date)) + '</div><div class="list">' +
          list.map(function (e) { return row(e); }).join("") + "</div></div>";
      });
    }
    if (finished.length) {
      html += '<div class="group"><div class="group-head"><i></i>Finalizados</div><div class="list">' +
        finished.map(function (e) { return row(e, true); }).join("") + "</div></div>";
    }
    if (!html) {
      html = '<div class="group"><div class="list"><div class="empty">No hay eventos programados en esta categoría todavía.<br>Consulta la <a href="' + ROOT + '/">agenda completa</a>.</div></div></div>';
    }
    box.innerHTML = html;

    if (events.length) {
      injectJsonLd({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": events.slice(0, 25).map(function (e, i) {
          return { "@type": "ListItem", "position": i + 1, "item": eventLd(e) };
        })
      });
    }
  }

  /* ---------- Página de evento ---------- */
  function renderEvent(events) {
    var box = document.getElementById("event-page");
    if (!box) return;
    var id = new URLSearchParams(location.search).get("e");
    var ev = events.find(function (x) { return x.id === id; });

    if (!ev) {
      box.innerHTML = '<div class="list" style="margin-top:24px"><div class="empty">Evento no encontrado. <a href="' + ROOT + '/">Volver a la agenda</a>.</div></div>';
      return;
    }

    var t = title(ev) + " en directo — " + ev.competitionName + " | " + CFG.siteName;
    document.title = t;
    setMeta("description", ev.description || (title(ev) + " en directo online. " + sportName(ev) + " · " + ev.competitionName + ", " + longDate(ev.date) + "."));
    var canonical = CFG.siteUrl + "/evento.html?e=" + encodeURIComponent(ev.id);
    setCanonical(canonical);
    setMeta("og:title", t, true);
    setMeta("og:url", canonical, true);

    var player;
    if (ev.embed) {
      player = '<iframe src="' + esc(ev.embed) + '" allowfullscreen loading="lazy" referrerpolicy="no-referrer" title="' + esc(title(ev)) + '"></iframe>';
    } else if (ev.hls) {
      player = '<video id="hls-player" controls playsinline></video>';
    } else if (ev.status === "finished") {
      player = '<div class="player-idle"><div class="vs">' + esc(title(ev)) + '</div><div class="when">Este evento ha finalizado.</div></div>';
    } else {
      player = '<div class="player-idle"><div class="vs">' + esc(title(ev)) + '</div>' +
        '<div class="when">' + esc(longDate(ev.date)) + " h</div>" +
        '<div class="count" id="countdown"></div></div>';
    }

    box.innerHTML =
      '<nav class="crumbs" aria-label="Ruta"><a href="' + ROOT + '/">Inicio</a><span class="sep">/</span>' +
      '<a href="' + ROOT + "/deportes/" + esc(ev.sport) + '.html">' + esc(sportName(ev)) + '</a><span class="sep">/</span><span>' + esc(title(ev)) + "</span></nav>" +
      '<div class="player">' + player + "</div>" +
      '<header class="ev-head"><h1>' + esc(title(ev)) + " en directo</h1>" +
      '<div class="meta"><span>' + esc(sportName(ev)) + " · " + esc(ev.competitionName) + '</span><time datetime="' + esc(ev.date) + '">' + esc(longDate(ev.date)) + " h</time>" + pill(ev) + "</div></header>" +
      (ev.description ? '<p class="ev-desc">' + esc(ev.description) + "</p>" : "") +
      '<div class="ad" id="ad-under-player"></div>' +
      '<section class="section"><h2>También en Kickly</h2><div id="related"></div></section>';

    if (!ev.embed && ev.hls) initHls(ev.hls);
    startCountdown(ev);

    var related = events.filter(function (x) { return x.id !== ev.id && x.status !== "finished"; }).slice(0, 6);
    document.getElementById("related").innerHTML = related.length
      ? '<div class="list">' + related.map(function (e) { return row(e, true); }).join("") + "</div>"
      : '<div class="list"><div class="empty">No hay más eventos programados.</div></div>';

    var ld = eventLd(ev);
    ld["@context"] = "https://schema.org";
    injectJsonLd(ld);
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": CFG.siteUrl + "/" },
        { "@type": "ListItem", "position": 2, "name": sportName(ev), "item": CFG.siteUrl + "/deportes/" + ev.sport + ".html" },
        { "@type": "ListItem", "position": 3, "name": title(ev) }
      ]
    });
  }

  function initHls(src) {
    var video = document.getElementById("hls-player");
    if (!video) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) { video.src = src; return; }
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

  function startCountdown(ev) {
    var el = document.getElementById("countdown");
    if (!el) return;
    function tick() {
      var diff = new Date(ev.date).getTime() - Date.now();
      if (diff <= 0) { el.textContent = "El evento está a punto de comenzar — recarga la página."; return; }
      var d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5),
          m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
      el.textContent = "Comienza en " + (d ? d + " d " : "") + h + " h " + m + " min " + s + " s";
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
  loadEvents().then(function (events) {
    var indicator = document.getElementById("live-indicator");
    if (indicator && !events.some(function (e) { return e.status === "live"; })) {
      indicator.style.display = "none";
    }
    renderAgenda(events);
    renderEvent(events);
  });
})();
