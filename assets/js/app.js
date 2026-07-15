/* KICKLY — agenda multideporte, reproductor y metadatos dinámicos */
(function () {
  "use strict";
  var CFG = window.KICKLY || {};
  var ROOT = document.body.getAttribute("data-root") || ".";
  var WATCH = {};

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
  function evUrl(ev) { return ROOT + "/ver/" + encodeURIComponent(ev.id) + ".html"; }
  function evCanonical(ev) { return CFG.siteUrl + "/ver/" + encodeURIComponent(ev.id) + ".html"; }

  function pill(ev) {
    if (ev.status === "live") return '<span class="pill pill-live">EN DIRECTO</span>';
    if (ev.status === "finished") return '<span class="pill pill-end">FINALIZADO</span>';
    var diff = new Date(ev.date).getTime() - Date.now();
    if (diff > 0 && diff < 36e5) return '<span class="pill pill-soon">EMPIEZA PRONTO</span>';
    return "";
  }

  function scene(ev) { return (CFG.sports[ev.sport]) ? ev.sport : "futbol"; }

  // Tarjeta con miniatura (escena difuminada del deporte + overlay de play)
  function card(ev, showDay) {
    var when = ev.status === "live" ? "EN DIRECTO"
      : (showDay ? esc(fmt(ev.date, { day: "numeric", month: "short" })) + " · " : "") + timeHM(ev.date) + " h";
    return '<a class="card' + (ev.status === "live" ? " is-live" : "") + '" href="' + evUrl(ev) + '">' +
      '<div class="card-thumb"><div class="sim-scene ' + esc(scene(ev)) + '"></div>' +
        '<span class="card-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>' +
        '<span class="card-pillwrap">' + pill(ev) + "</span>" +
      "</div>" +
      '<div class="card-body"><div class="card-comp">' + esc(sportName(ev)) + " · " + esc(ev.competitionName) + "</div>" +
        '<div class="card-teams">' + esc(ev.home) + (ev.away ? ' <span class="vs">vs</span> ' + esc(ev.away) : "") + "</div>" +
        '<div class="card-time">' + when + "</div></div></a>";
  }

  function grid(list, showDay) {
    return '<div class="cards">' + list.map(function (e) { return card(e, showDay); }).join("") + "</div>";
  }

  // Botones de enlaces (modelo agregador: abren en pestaña nueva).
  // Se usan los botones globales de WATCH en todos los eventos; si el evento
  // define 'sources' propios, tienen prioridad.
  function sourceButtons(ev) {
    var srcs = (ev.sources && ev.sources.length) ? ev.sources : globalSources();
    return srcs.map(function (s, i) {
      if (!s || !s.url) return "";
      return '<a class="src-btn" href="' + esc(s.url) + '" target="_blank" rel="nofollow noopener">' +
        '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>' +
        esc(s.label || ("Enlace " + (i + 1))) + "</a>";
    }).join("");
  }

  function globalSources() {
    var w = WATCH || {};
    if (!w.url || !(w.buttons || []).length) return [];
    return w.buttons.map(function (label) { return { label: label, url: w.url }; });
  }

  // Tabla "dónde ver por país"
  function broadcastersTable(ev) {
    var bs = ev.broadcasters || [];
    if (!bs.length) return "";
    return '<section class="section"><h2>Dónde ver ' + esc(title(ev)) + ' por país</h2>' +
      '<table class="bcast"><tbody>' +
      bs.map(function (b) {
        var ch = b.url
          ? '<a href="' + esc(b.url) + '" target="_blank" rel="noopener">' + esc(b.channels) + "</a>"
          : esc(b.channels);
        return "<tr><th>" + esc(b.country) + "</th><td>" + ch + "</td></tr>";
      }).join("") +
      "</tbody></table></section>";
  }

  function injectJsonLd(obj) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  function buildKeywords(ev) {
    var kws = [];
    var pairs = ev.away
      ? [ev.home + " " + ev.away, ev.away + " " + ev.home, ev.home + " vs " + ev.away]
      : [ev.home];
    pairs.forEach(function (p) {
      kws.push("ver " + p + " gratis", "ver " + p + " online", p + " en directo",
               "ver " + p + " online gratis", p + " streaming", p + " en vivo");
    });
    kws.push(ev.competitionName + " en directo", "ver " + sportName(ev).toLowerCase() + " online gratis");
    return kws;
  }

  function eventLd(ev) {
    var url = evCanonical(ev);
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
      .then(function (d) { WATCH = d.watch || {}; return d.events || []; })
      .catch(function () { return []; });
  }

  /* ---------- Agenda (portada y páginas de deporte) ---------- */
  var AGENDA_EVENTS = null, agendaFilter = { sport: "", q: "" };

  function renderAgenda(events) {
    var box = document.getElementById("agenda");
    if (!box) return;
    var pageSport = document.body.getAttribute("data-sport");
    if (pageSport) events = events.filter(function (e) { return e.sport === pageSport; });
    if (AGENDA_EVENTS === null) { AGENDA_EVENTS = events; bindAgendaControls(); }

    // Filtros de buscador/deporte (solo portada)
    if (agendaFilter.sport) events = events.filter(function (e) { return e.sport === agendaFilter.sport; });
    if (agendaFilter.q) {
      var q = agendaFilter.q.toLowerCase();
      events = events.filter(function (e) {
        return (e.home + " " + (e.away || "") + " " + e.competitionName + " " + sportName(e)).toLowerCase().indexOf(q) >= 0;
      });
    }
    events.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

    var live = events.filter(function (e) { return e.status === "live"; });
    var upcoming = events.filter(function (e) { return e.status === "scheduled"; });
    var finished = events.filter(function (e) { return e.status === "finished"; });

    var html = "";
    if (live.length) {
      html += '<div class="group"><div class="group-head is-live"><i></i>En directo ahora</div>' + grid(live) + "</div>";
    }
    if (upcoming.length) {
      var byDay = {};
      upcoming.forEach(function (e) {
        var k = dayKey(e.date);
        (byDay[k] = byDay[k] || []).push(e);
      });
      Object.keys(byDay).forEach(function (k) {
        var list = byDay[k];
        html += '<div class="group"><div class="group-head"><i></i>' + esc(dayLabel(list[0].date)) + "</div>" + grid(list) + "</div>";
      });
    }
    if (finished.length) {
      html += '<div class="group"><div class="group-head"><i></i>Finalizados</div>' + grid(finished, true) + "</div>";
    }
    if (!html) {
      html = (agendaFilter.q || agendaFilter.sport)
        ? '<div class="empty">No hay eventos que coincidan con tu búsqueda.</div>'
        : '<div class="empty">No hay eventos programados en esta categoría todavía.<br>Consulta la <a href="' + ROOT + '/">agenda completa</a>.</div>';
    }
    box.innerHTML = html;

    if (events.length && !agendaLdDone) {
      agendaLdDone = true;
      injectJsonLd({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": events.slice(0, 25).map(function (e, i) {
          return { "@type": "ListItem", "position": i + 1, "item": eventLd(e) };
        })
      });
    }
  }
  var agendaLdDone = false;

  function bindAgendaControls() {
    var input = document.getElementById("q");
    var filters = document.getElementById("filters");
    if (input) {
      input.addEventListener("input", function () {
        agendaFilter.q = input.value.trim();
        renderAgenda(AGENDA_EVENTS);
      });
    }
    if (filters) {
      filters.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter");
        if (!btn) return;
        agendaFilter.sport = btn.getAttribute("data-sport") || "";
        [].forEach.call(filters.querySelectorAll(".filter"), function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        renderAgenda(AGENDA_EVENTS);
      });
    }
  }

  /* ---------- Página de evento ---------- */
  function renderEvent(events) {
    var box = document.getElementById("event-page");
    if (!box) return;
    var id = document.body.getAttribute("data-event-id") || new URLSearchParams(location.search).get("e");
    var ev = events.find(function (x) { return x.id === id; });

    if (!ev) {
      box.innerHTML = '<div class="list" style="margin-top:24px"><div class="empty">Evento no encontrado. <a href="' + ROOT + '/">Volver a la agenda</a>.</div></div>';
      return;
    }

    var t = "Ver " + title(ev) + " Online Gratis — " + ev.competitionName + " en directo | " + CFG.siteName;
    document.title = t;
    setMeta("description",
      "Ver " + title(ev) + " gratis y online: " + sportName(ev) + " · " + ev.competitionName + ", " + longDate(ev.date) + " h. " +
      (ev.description ? ev.description + " " : "") + "Emisión en directo en Kickly.");
    setMeta("keywords", buildKeywords(ev).join(", "));
    setCanonical(evCanonical(ev));
    setMeta("og:title", t, true);
    setMeta("og:url", evCanonical(ev), true);
    setMeta("og:type", "video.other", true);

    box.innerHTML =
      '<nav class="crumbs" aria-label="Ruta"><a href="' + ROOT + '/">Inicio</a><span class="sep">/</span>' +
      '<a href="' + ROOT + "/deportes/" + esc(ev.sport) + '.html">' + esc(sportName(ev)) + '</a><span class="sep">/</span><span>' + esc(title(ev)) + "</span></nav>" +
      '<div class="player" id="player-box">' + simulator(ev) + "</div>" +
      sourcesPanel(ev) +
      '<header class="ev-head"><h1>Ver ' + esc(title(ev)) + " en directo online gratis</h1>" +
      '<div class="meta"><span>' + esc(sportName(ev)) + " · " + esc(ev.competitionName) + '</span><time datetime="' + esc(ev.date) + '">' + esc(longDate(ev.date)) + " h</time>" + pill(ev) + "</div></header>" +
      (ev.description ? '<p class="ev-desc">' + esc(ev.description) + "</p>" : "") +
      '<div class="ad" id="ad-under-player"></div>' +
      broadcastersTable(ev) +
      '<section class="section"><h2>También en Kickly</h2><div id="related"></div></section>';

    bindSimulator(ev);
    startCountdown(ev);

    var related = events.filter(function (x) { return x.id !== ev.id && x.status !== "finished"; }).slice(0, 6);
    document.getElementById("related").innerHTML = related.length
      ? grid(related, true)
      : '<div class="empty">No hay más eventos programados.</div>';

    var ld = eventLd(ev);
    ld["@context"] = "https://schema.org";
    injectJsonLd(ld);
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "BroadcastEvent",
      "name": "Ver " + title(ev) + " online gratis",
      "isLiveBroadcast": true,
      "videoFormat": "HD",
      "inLanguage": "es",
      "startDate": ev.date,
      "broadcastOfEvent": eventLd(ev)
    });
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

  // Panel de enlaces bajo el reproductor (modelo agregador)
  function sourcesPanel(ev) {
    var btns = sourceButtons(ev);
    if (btns) {
      return '<div class="sources" id="sources"><div class="sources-head">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>' +
        "Dónde ver " + esc(title(ev)) + "</div><div class=\"sources-btns\">" + btns + "</div></div>";
    }
    if (ev.status === "finished") return "";
    return '<div class="sources" id="sources"><div class="sources-head">Enlaces del partido</div>' +
      '<div class="sources-soon">Los enlaces para ver ' + esc(title(ev)) + ' se publicarán poco antes del inicio (' + esc(longDate(ev.date)) + " h). Vuelve entonces.</div></div>";
  }

  /* Reproductor simulado: escena difuminada del deporte + botón de play */
  function simulator(ev) {
    var isLive = ev.status === "live";
    var hasLinks = (ev.sources || []).length > 0;
    var sub = ev.status === "finished" ? "Este evento ha finalizado"
      : isLive ? (hasLinks ? "En directo — pulsa para ver los enlaces" : "En directo")
      : longDate(ev.date) + " h";
    return '<div class="sim' + '" id="sim">' +
      '<div class="sim-scene ' + esc(scene(ev)) + '"></div>' +
      '<button class="play-btn" id="play-btn" aria-label="Ver ' + esc(title(ev)) + '">' +
        '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>' +
      '<div class="sim-title">' + esc(title(ev)) + "</div>" +
      '<div class="sim-sub">' + esc(sub) + "</div>" +
      '<div class="sim-count" id="countdown"></div>' +
      '<div class="sim-links" id="sim-links"></div>' +
      '<div class="sim-msg" id="sim-msg"></div>' +
      '<div class="sim-bar">' +
        '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>' +
        '<span class="sim-live-tag' + (isLive ? "" : " off") + '">' + (isLive ? "EN DIRECTO" : "OFFLINE") + "</span>" +
        '<div class="sim-progress"><i></i></div>' +
        '<span class="sim-clock">' + (isLive ? "LIVE" : timeHM(ev.date)) + "</span>" +
        '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z"/></svg>' +
        '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>' +
      "</div></div>";
  }

  function bindSimulator(ev) {
    var sim = document.getElementById("sim");
    if (!sim) return;
    var btns = sourceButtons(ev);
    sim.addEventListener("click", function (e) {
      // No interceptar clics en los propios enlaces
      if (e.target.closest(".src-btn")) return;
      if (btns) {
        var links = document.getElementById("sim-links");
        if (links && !links.innerHTML) {
          links.innerHTML = '<div class="sim-links-h">Elige dónde ver el partido</div>' + btns;
        }
        sim.classList.add("links-on");
        var panel = document.getElementById("sources");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        var msg = document.getElementById("sim-msg");
        msg.textContent = ev.status === "finished"
          ? "Este evento ya ha terminado. Consulta la agenda para ver los próximos."
          : "Los enlaces para ver el partido se publicarán poco antes del inicio (" + longDate(ev.date) + " h).";
        sim.classList.add("msg-on");
      }
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
      if (diff <= 0) {
        el.textContent = "¡El evento está comenzando! Actualizando…";
        setTimeout(function () { location.reload(); }, 5000);
        return;
      }
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
