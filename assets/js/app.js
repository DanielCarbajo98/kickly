/* KICKLY — agenda multideporte, reproductor y metadatos dinámicos */
(function () {
  "use strict";
  var CFG = window.KICKLY || {};
  var _r = document.body.getAttribute("data-root");
  var ROOT = _r === null ? "." : _r;                                  // raíz del sitio (datos, assets); "" = absoluta
  var _lr = document.body.getAttribute("data-langroot");
  var LANGROOT = _lr === null ? ROOT : _lr;                           // raíz de la sección de idioma (enlaces)
  var WATCH = {};
  var LANG = (document.documentElement.getAttribute("lang") || "es").slice(0, 2);
  var LOCALE = { es: "es-ES", en: "en-GB", pt: "pt-BR" }[LANG] || "es-ES";
  var LPREFIX = LANG === "es" ? "" : "/" + LANG;

  /* ---------- i18n ---------- */
  var I18N = {
    es: {
      liveNow: "En directo ahora", today: "Hoy", tomorrow: "Mañana", finished: "Finalizados",
      loading: "Cargando agenda…", noneCat: "No hay eventos programados en esta categoría todavía.",
      fullAgenda: "agenda completa", noMatch: "No hay eventos que coincidan con tu búsqueda.",
      live: "EN DIRECTO", ended: "FINALIZADO", soon: "EMPIEZA PRONTO",
      titleTpl: function (t, c) { return "Ver " + t + " Online Gratis — " + c + " en directo | " + CFG.siteName; },
      descTpl: function (t, sp, c, d) { return "Ver " + t + " gratis y online: " + sp + " · " + c + ", " + d + " h. "; },
      descTail: "Dónde ver el evento en directo en Kickly.",
      h1: function (t) { return "Ver " + t + " en directo online gratis"; },
      whereWatch: function (t) { return "Dónde ver " + t; }, chooseWatch: "Elige dónde ver el partido",
      linksSoon: function (d) { return "Los enlaces para ver el partido se publicarán poco antes del inicio (" + d + " h)."; },
      endedMsg: "Este evento ya ha terminado. Consulta la agenda para ver los próximos.",
      startsIn: "Comienza en", startingNow: "¡El evento está comenzando! Actualizando…",
      alsoOn: "También en Kickly", byCountry: function (t) { return "Dónde ver " + t + " por país"; },
      home: "Inicio", noMore: "No hay más eventos programados.", notFound: "Evento no encontrado.", back: "Volver a la agenda",
      d: "d", h: "h", min: "min", s: "s", offline: "OFFLINE", linksHead: "Enlaces del partido"
    },
    en: {
      liveNow: "Live now", today: "Today", tomorrow: "Tomorrow", finished: "Finished",
      loading: "Loading schedule…", noneCat: "No events scheduled in this category yet.",
      fullAgenda: "full schedule", noMatch: "No events match your search.",
      live: "LIVE", ended: "FINISHED", soon: "STARTING SOON",
      titleTpl: function (t, c) { return "Watch " + t + " Free Online — " + c + " live | " + CFG.siteName; },
      descTpl: function (t, sp, c, d) { return "Watch " + t + " free and online: " + sp + " · " + c + ", " + d + ". "; },
      descTail: "Where to watch the event live on Kickly.",
      h1: function (t) { return "Watch " + t + " live free online"; },
      whereWatch: function (t) { return "Where to watch " + t; }, chooseWatch: "Choose where to watch",
      linksSoon: function (d) { return "The links to watch will be published shortly before kick-off (" + d + ")."; },
      endedMsg: "This event has ended. Check the schedule for upcoming ones.",
      startsIn: "Starts in", startingNow: "The event is starting! Refreshing…",
      alsoOn: "Also on Kickly", byCountry: function (t) { return "Where to watch " + t + " by country"; },
      home: "Home", noMore: "No more scheduled events.", notFound: "Event not found.", back: "Back to the schedule",
      d: "d", h: "h", min: "min", s: "s", offline: "OFFLINE", linksHead: "Event links"
    },
    pt: {
      liveNow: "Ao vivo agora", today: "Hoje", tomorrow: "Amanhã", finished: "Encerrados",
      loading: "Carregando agenda…", noneCat: "Ainda não há eventos nesta categoria.",
      fullAgenda: "agenda completa", noMatch: "Nenhum evento corresponde à sua busca.",
      live: "AO VIVO", ended: "ENCERRADO", soon: "COMEÇA EM BREVE",
      titleTpl: function (t, c) { return "Assistir " + t + " Online Grátis — " + c + " ao vivo | " + CFG.siteName; },
      descTpl: function (t, sp, c, d) { return "Assistir " + t + " grátis e online: " + sp + " · " + c + ", " + d + ". "; },
      descTail: "Onde assistir ao evento ao vivo na Kickly.",
      h1: function (t) { return "Assistir " + t + " ao vivo online grátis"; },
      whereWatch: function (t) { return "Onde assistir " + t; }, chooseWatch: "Escolha onde assistir",
      linksSoon: function (d) { return "Os links para assistir serão publicados pouco antes do início (" + d + ")."; },
      endedMsg: "Este evento terminou. Confira a agenda para os próximos.",
      startsIn: "Começa em", startingNow: "O evento está começando! Atualizando…",
      alsoOn: "Também na Kickly", byCountry: function (t) { return "Onde assistir " + t + " por país"; },
      home: "Início", noMore: "Não há mais eventos agendados.", notFound: "Evento não encontrado.", back: "Voltar à agenda",
      d: "d", h: "h", min: "min", s: "s", offline: "OFFLINE", linksHead: "Links do evento"
    }
  };
  var T = I18N[LANG] || I18N.es;

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
    try { return new Intl.DateTimeFormat(LOCALE, opts).format(new Date(iso)); }
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
    if (k === today) return T.today + " · " + name;
    if (k === tomorrow) return T.tomorrow + " · " + name;
    return name;
  }
  function title(ev) { return ev.away ? ev.home + " – " + ev.away : ev.home; }
  function sportName(ev) { return (CFG.sports[ev.sport] || {}).name || ev.sport; }
  function evUrl(ev) { return LANGROOT + "/ver/" + encodeURIComponent(ev.id) + ".html"; }
  function evCanonical(ev) { return CFG.siteUrl + LPREFIX + "/ver/" + encodeURIComponent(ev.id) + ".html"; }

  function pill(ev) {
    if (ev.status === "live") return '<span class="pill pill-live">' + T.live + '</span>';
    if (ev.status === "finished") return '<span class="pill pill-end">' + T.ended + '</span>';
    var diff = new Date(ev.date).getTime() - Date.now();
    if (diff > 0 && diff < 36e5) return '<span class="pill pill-soon">' + T.soon + '</span>';
    return "";
  }

  function scene(ev) { return (CFG.sports[ev.sport]) ? ev.sport : "futbol"; }

  // Tarjeta con miniatura (escena difuminada del deporte + overlay de play)
  function card(ev, showDay) {
    var when = ev.status === "live" ? T.live
      : (showDay ? esc(fmt(ev.date, { day: "numeric", month: "short" })) + " · " : "") + timeHM(ev.date);
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
    return '<section class="section"><h2>' + esc(T.byCountry(title(ev))) + '</h2>' +
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
      html += '<div class="group"><div class="group-head is-live"><i></i>' + esc(T.liveNow) + "</div>" + grid(live) + "</div>";
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
      html += '<div class="group"><div class="group-head"><i></i>' + esc(T.finished) + "</div>" + grid(finished, true) + "</div>";
    }
    if (!html) {
      html = (agendaFilter.q || agendaFilter.sport)
        ? '<div class="empty">' + esc(T.noMatch) + "</div>"
        : '<div class="empty">' + esc(T.noneCat) + '<br><a href="' + LANGROOT + '/">' + esc(T.fullAgenda) + "</a>.</div>";
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
      box.innerHTML = '<div class="list" style="margin-top:24px"><div class="empty">' + esc(T.notFound) + ' <a href="' + LANGROOT + '/">' + esc(T.back) + '</a>.</div></div>';
      return;
    }

    var t = T.titleTpl(title(ev), ev.competitionName);
    document.title = t;
    setMeta("description",
      T.descTpl(title(ev), sportName(ev), ev.competitionName, longDate(ev.date)) +
      (ev.description ? ev.description + " " : "") + T.descTail);
    setMeta("keywords", buildKeywords(ev).join(", "));
    setCanonical(evCanonical(ev));
    setMeta("og:title", t, true);
    setMeta("og:url", evCanonical(ev), true);
    setMeta("og:type", "video.other", true);

    box.innerHTML =
      '<nav class="crumbs" aria-label="breadcrumb"><a href="' + LANGROOT + '/">' + esc(T.home) + '</a><span class="sep">/</span>' +
      '<a href="' + LANGROOT + "/deportes/" + esc(ev.sport) + '.html">' + esc(sportName(ev)) + '</a><span class="sep">/</span><span>' + esc(title(ev)) + "</span></nav>" +
      '<div class="player" id="player-box">' + simulator(ev) + "</div>" +
      sourcesPanel(ev) +
      '<header class="ev-head"><h1>' + esc(T.h1(title(ev))) + "</h1>" +
      '<div class="meta"><span>' + esc(sportName(ev)) + " · " + esc(ev.competitionName) + '</span><time datetime="' + esc(ev.date) + '">' + esc(longDate(ev.date)) + "</time>" + pill(ev) + "</div></header>" +
      (ev.description ? '<p class="ev-desc">' + esc(ev.description) + "</p>" : "") +
      '<div class="ad" id="ad-under-player"></div>' +
      broadcastersTable(ev) +
      '<section class="section"><h2>' + esc(T.alsoOn) + '</h2><div id="related"></div></section>';

    bindSimulator(ev);
    startCountdown(ev);

    var related = events.filter(function (x) { return x.id !== ev.id && x.status !== "finished"; }).slice(0, 6);
    document.getElementById("related").innerHTML = related.length
      ? grid(related, true)
      : '<div class="empty">' + esc(T.noMore) + "</div>";

    var ld = eventLd(ev);
    ld["@context"] = "https://schema.org";
    injectJsonLd(ld);
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "BroadcastEvent",
      "name": T.whereWatch(title(ev)),
      "isLiveBroadcast": true,
      "videoFormat": "HD",
      "inLanguage": LANG,
      "startDate": ev.date,
      "broadcastOfEvent": eventLd(ev)
    });
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": T.home, "item": CFG.siteUrl + LPREFIX + "/" },
        { "@type": "ListItem", "position": 2, "name": sportName(ev), "item": CFG.siteUrl + LPREFIX + "/deportes/" + ev.sport + ".html" },
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
        esc(T.whereWatch(title(ev))) + "</div><div class=\"sources-btns\">" + btns + "</div></div>";
    }
    if (ev.status === "finished") return "";
    return '<div class="sources" id="sources"><div class="sources-head">' + esc(T.linksHead) + "</div>" +
      '<div class="sources-soon">' + esc(T.linksSoon(longDate(ev.date))) + "</div></div>";
  }

  /* Reproductor simulado: escena difuminada del deporte + botón de play */
  function simulator(ev) {
    var isLive = ev.status === "live";
    var hasLinks = true;
    var sub = ev.status === "finished" ? T.ended
      : isLive ? T.live
      : longDate(ev.date);
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
        '<span class="sim-live-tag' + (isLive ? "" : " off") + '">' + (isLive ? T.live : T.offline) + "</span>" +
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
          links.innerHTML = '<div class="sim-links-h">' + esc(T.chooseWatch) + "</div>" + btns;
        }
        sim.classList.add("links-on");
        var panel = document.getElementById("sources");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        var msg = document.getElementById("sim-msg");
        msg.textContent = ev.status === "finished" ? T.endedMsg : T.linksSoon(longDate(ev.date));
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
        el.textContent = T.startingNow;
        setTimeout(function () { location.reload(); }, 5000);
        return;
      }
      var d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5),
          m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
      el.textContent = T.startsIn + " " + (d ? d + " " + T.d + " " : "") + h + " " + T.h + " " + m + " " + T.min + " " + s + " " + T.s;
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
