/* ==========================================================================
   Distribuciones Rodrigo — buscador de catálogo
   Carga data/productos.json, indexa en memoria y filtra al instante.
   El estado (búsqueda + filtros) se refleja en la URL para poder compartirla.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("catalogo");
  if (!root) return;

  var els = {
    search: document.getElementById("cat-search"),
    clear: document.getElementById("cat-clear"),
    families: document.getElementById("filter-familia"),
    temps: document.getElementById("filter-temp"),
    channels: document.getElementById("filter-canal"),
    chips: document.getElementById("cat-chips"),
    count: document.getElementById("cat-count"),
    grid: document.getElementById("cat-grid"),
    empty: document.getElementById("cat-empty"),
    reset: document.getElementById("cat-reset"),
    sort: document.getElementById("cat-sort")
  };

  var TEMPS = {
    congelado: { label: "Congelado", detail: "−18 °C", cls: "pill--cold" },
    refrigerado: { label: "Refrigerado", detail: "0 a 4 °C", cls: "pill--fresh" },
    ambiente: { label: "Ambiente", detail: "Seco", cls: "" }
  };

  var CANALES = {
    restauracion: "Restauración",
    colectividades: "Colectividades",
    comercio: "Comercio y retail"
  };

  var ICON_BOX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></svg>';

  var state = { q: "", familias: [], temps: [], canales: [], sort: "relevancia" };
  var data = { familias: [], productos: [] };
  var index = [];

  /* --- Utilidades -------------------------------------------------------- */

  function normalize(str) {
    return String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  /* --- Estado en la URL -------------------------------------------------- */

  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    state.q = p.get("q") || "";
    state.familias = (p.get("familia") || "").split(",").filter(Boolean);
    state.temps = (p.get("temp") || "").split(",").filter(Boolean);
    state.canales = (p.get("canal") || "").split(",").filter(Boolean);
    state.sort = p.get("orden") || "relevancia";
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.familias.length) p.set("familia", state.familias.join(","));
    if (state.temps.length) p.set("temp", state.temps.join(","));
    if (state.canales.length) p.set("canal", state.canales.join(","));
    if (state.sort !== "relevancia") p.set("orden", state.sort);
    var qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs + window.location.hash : window.location.pathname + window.location.hash);
  }

  /* --- Filtrado ---------------------------------------------------------- */

  function matches(item) {
    if (state.familias.length && state.familias.indexOf(item.familia) === -1) return false;
    if (state.temps.length && state.temps.indexOf(item.temp) === -1) return false;
    if (state.canales.length) {
      var canales = item.canal || [];
      var hit = state.canales.some(function (c) { return canales.indexOf(c) !== -1; });
      if (!hit) return false;
    }
    if (state.q) {
      var terms = normalize(state.q).split(/\s+/).filter(Boolean);
      return terms.every(function (t) { return item._hay.indexOf(t) !== -1; });
    }
    return true;
  }

  function score(item) {
    if (!state.q) return item.destacado ? -1 : 0;
    var q = normalize(state.q);
    var name = normalize(item.nombre);
    if (name.indexOf(q) === 0) return -3;
    if (name.indexOf(q) !== -1) return -2;
    if (normalize(item.ref).indexOf(q) !== -1) return -2;
    return -1;
  }

  function currentResults() {
    var out = index.filter(matches);
    if (state.sort === "nombre") {
      out.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
    } else if (state.sort === "familia") {
      out.sort(function (a, b) {
        return a.familia.localeCompare(b.familia, "es") || a.nombre.localeCompare(b.nombre, "es");
      });
    } else {
      out.sort(function (a, b) { return score(a) - score(b) || a.nombre.localeCompare(b.nombre, "es"); });
    }
    return out;
  }

  /* --- Renderizado ------------------------------------------------------- */

  function familyName(id) {
    var f = data.familias.find(function (x) { return x.id === id; });
    return f ? f.nombre : id;
  }

  function renderProducts(list) {
    if (!list.length) {
      els.grid.innerHTML = "";
      els.empty.hidden = false;
      return;
    }
    els.empty.hidden = true;
    els.grid.innerHTML = list.map(function (p) {
      var t = TEMPS[p.temp] || TEMPS.ambiente;
      return '<article class="product">' +
        '<div class="product__thumb">' + ICON_BOX +
          '<span class="pill ' + t.cls + ' product__temp">' + t.label + '</span>' +
        '</div>' +
        '<div class="product__body">' +
          '<span class="product__fam">' + escapeHtml(p.subfamilia || familyName(p.familia)) + '</span>' +
          '<h3 class="product__name">' + escapeHtml(p.nombre) + '</h3>' +
          '<div class="product__meta">' +
            '<span>' + escapeHtml(p.formato) + '</span>' +
          '</div>' +
          '<span class="product__ref">Ref. ' + escapeHtml(p.ref) + '</span>' +
        '</div>' +
      '</article>';
    }).join("");
  }

  function renderChips() {
    var chips = [];
    state.familias.forEach(function (id) { chips.push({ type: "familia", value: id, label: familyName(id) }); });
    state.temps.forEach(function (id) { chips.push({ type: "temp", value: id, label: (TEMPS[id] || {}).label || id }); });
    state.canales.forEach(function (id) { chips.push({ type: "canal", value: id, label: CANALES[id] || id }); });

    els.chips.innerHTML = chips.map(function (c) {
      return '<span class="chip">' + escapeHtml(c.label) +
        '<button type="button" data-remove-type="' + c.type + '" data-remove-value="' + escapeHtml(c.value) + '" aria-label="Quitar filtro ' + escapeHtml(c.label) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button></span>';
    }).join("");
    els.chips.hidden = !chips.length;
  }

  function renderCounts(list) {
    els.count.innerHTML = '<strong>' + list.length + '</strong> ' +
      (list.length === 1 ? "referencia" : "referencias") +
      (index.length !== list.length ? ' de ' + index.length : "");
  }

  function update() {
    var list = currentResults();
    renderProducts(list);
    renderChips();
    renderCounts(list);
    els.clear.hidden = !state.q;
    writeUrl();
  }

  /* --- Construcción de filtros ------------------------------------------- */

  function buildCheckboxes(container, entries, group) {
    container.innerHTML = entries.map(function (e) {
      var checked = state[group].indexOf(e.id) !== -1 ? " checked" : "";
      return '<label class="check">' +
        '<input type="checkbox" value="' + escapeHtml(e.id) + '" data-group="' + group + '"' + checked + '>' +
        '<span>' + escapeHtml(e.label) + '</span>' +
        '<span class="count">' + e.count + '</span>' +
      '</label>';
    }).join("");

    container.addEventListener("change", function (ev) {
      var input = ev.target;
      if (!input.matches("input[type=checkbox]")) return;
      var arr = state[group];
      var i = arr.indexOf(input.value);
      if (input.checked && i === -1) arr.push(input.value);
      if (!input.checked && i !== -1) arr.splice(i, 1);
      update();
    });
  }

  function countBy(fn) {
    var map = {};
    index.forEach(function (p) {
      var keys = fn(p);
      (Array.isArray(keys) ? keys : [keys]).forEach(function (k) {
        if (!k) return;
        map[k] = (map[k] || 0) + 1;
      });
    });
    return map;
  }

  function syncCheckboxes() {
    root.querySelectorAll("input[type=checkbox][data-group]").forEach(function (input) {
      input.checked = state[input.dataset.group].indexOf(input.value) !== -1;
    });
  }

  /* --- Arranque ---------------------------------------------------------- */

  function init(json) {
    data = json;
    index = json.productos.map(function (p) {
      var fam = json.familias.find(function (f) { return f.id === p.familia; });
      p._hay = normalize([p.nombre, p.ref, p.subfamilia, p.formato, fam ? fam.nombre : "", (p.canal || []).join(" ")].join(" "));
      return p;
    });

    readUrl();

    var famCounts = countBy(function (p) { return p.familia; });
    buildCheckboxes(els.families, json.familias.map(function (f) {
      return { id: f.id, label: f.nombre, count: famCounts[f.id] || 0 };
    }), "familias");

    var tempCounts = countBy(function (p) { return p.temp; });
    buildCheckboxes(els.temps, Object.keys(TEMPS).map(function (id) {
      return { id: id, label: TEMPS[id].label + " · " + TEMPS[id].detail, count: tempCounts[id] || 0 };
    }), "temps");

    var canalCounts = countBy(function (p) { return p.canal || []; });
    buildCheckboxes(els.channels, Object.keys(CANALES).map(function (id) {
      return { id: id, label: CANALES[id], count: canalCounts[id] || 0 };
    }), "canales");

    els.search.value = state.q;
    if (els.sort) els.sort.value = state.sort;

    els.search.addEventListener("input", debounce(function () {
      state.q = els.search.value.trim();
      update();
    }, 140));

    els.clear.addEventListener("click", function () {
      state.q = "";
      els.search.value = "";
      els.search.focus();
      update();
    });

    els.chips.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-remove-type]");
      if (!btn) return;
      var map = { familia: "familias", temp: "temps", canal: "canales" };
      var key = map[btn.dataset.removeType];
      var i = state[key].indexOf(btn.dataset.removeValue);
      if (i !== -1) state[key].splice(i, 1);
      syncCheckboxes();
      update();
    });

    els.reset.addEventListener("click", function () {
      state = { q: "", familias: [], temps: [], canales: [], sort: "relevancia" };
      els.search.value = "";
      if (els.sort) els.sort.value = "relevancia";
      syncCheckboxes();
      update();
    });

    if (els.sort) {
      els.sort.addEventListener("change", function () {
        state.sort = els.sort.value;
        update();
      });
    }

    // Atajo de teclado: "/" enfoca el buscador
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        els.search.focus();
      }
    });

    update();
  }

  fetch("data/productos.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(init)
    .catch(function () {
      els.grid.innerHTML = "";
      els.empty.hidden = false;
      els.empty.innerHTML = '<p>No hemos podido cargar el catálogo. Escríbanos a ' +
        '<a href="mailto:comercial@distribucionesrodrigo.com">comercial@distribucionesrodrigo.com</a> ' +
        'y le enviamos la tarifa completa.</p>';
    });
})();
