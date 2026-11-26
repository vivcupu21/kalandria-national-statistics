// Page rendering and controls for the Kalandria statistics site.
// Hash router: #/overview, #/economy, #/population, #/regions.

const ROUTES = {
  "/overview": { title: "Overview", render: renderOverview },
  "/economy": { title: "Economy", render: renderEconomy },
  "/population": { title: "Population", render: renderPopulation },
  "/regions": { title: "Regions & environment", render: renderRegions },
};

const state = {
  economyTab: "gdp",
  popSort: { key: "population", dir: -1 },
  popQuery: "",
  region: "Port Meridia",
};

function kpiCard(label, value, sub) {
  return `<div class="kpi"><span class="kpi-label">${esc(label)}</span>` +
    `<span class="kpi-value">${esc(value)}</span><span class="kpi-sub">${esc(sub)}</span></div>`;
}

function section(title, inner, note) {
  return `<section class="card"><h2>${esc(title)}</h2>${inner}` +
    (note ? `<p class="note">${esc(note)}</p>` : "") + `</section>`;
}

function yearTable(headers, rows) {
  let head = "<tr>" + headers.map((h) => `<th>${esc(h)}</th>`).join("") + "</tr>";
  let body = rows.map((r) => "<tr>" + r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join("") + "</tr>").join("");
  return `<div class="table-wrap"><table>${head}${body}</table></div>`;
}

function renderOverview() {
  const K = KALANDRIA, D = K.derived, E = K.economy, P = K.population;
  const last = K.years.length - 1;
  const kpis =
    kpiCard("Population, 2024", fmtNum(P.total[last]), `+${D.popGrowth.toFixed(2)}% on 2023`) +
    kpiCard("GDP, 2024", "K " + E.gdpBillion[last].toFixed(1) + " bn", `+${E.gdpGrowth[last].toFixed(1)}% real growth`) +
    kpiCard("GDP per capita, 2024", "K " + fmtNum(D.gdpPerCapita2024), "Kalandria's highest on record") +
    kpiCard("Unemployment, 2024", E.unemployment[last].toFixed(1) + "%", "Down from 5.6% in 2023") +
    kpiCard("Inflation, 2024", E.inflation[last].toFixed(1) + "%", "Down from 4.4% in 2023") +
    kpiCard("Life expectancy, 2024", P.lifeExpectancy[last].toFixed(1) + " years", "Women 81.2, men 76.1");
  const gdpChart = lineChart(K.years.map(String), E.gdpBillion, { color: "#0b6b7a", decimals: 1, title: "GDP 2019 to 2024, billion kaldar" });
  const popChart = barChart(K.years.map(String), P.total, { color: "#e8a33d", divide: 1000000, decimals: 1, unit: "m", title: "Population 2019 to 2024, millions" });
  const releases = K.releases.map((r) =>
    `<li><span class="rel-date">${esc(r.date)}</span><strong>${esc(r.title)}</strong><span class="rel-detail">${esc(r.detail)}</span></li>`).join("");
  return `<h1>Republic of Kalandria at a glance</h1>` +
    `<p class="lede">Official statistics for a nation of ${fmtNum(P.total[last])} people, capital Port Meridia, ` +
    `currency the kaldar. All figures are published by the ${esc(K.office)}.</p>` +
    `<div class="kpi-grid">${kpis}</div>` +
    `<div class="two-col">` +
    section("Gross domestic product, 2019–2024 (billion kaldar)", gdpChart, "Nominal GDP. Growth in 2024 was 5.7% after 5.8% in 2023.") +
    section("Population, 2019–2024 (millions)", popChart, "Population at 1 January each year; 2024: " + fmtNum(P.total[last]) + ".") +
    `</div>` +
    section("Latest releases",
      `<ul class="releases">${releases}</ul><p class="note">Full tables for every release are on the Economy, Population and Regions pages.</p>`) +
    `<p class="quick-links">Explore: <a href="#/economy">Economy</a> · <a href="#/population">Population</a> · <a href="#/regions">Regions &amp; environment</a></p>`;
}

const ECONOMY_TABS = {
  gdp: { label: "GDP", values: () => KALANDRIA.economy.gdpBillion, decimals: 1, unit: " bn K", chart: "line", note: "Nominal GDP in billion kaldar. 2024: K 48.2 billion, up 5.7% on 2023." },
  unemployment: { label: "Unemployment", values: () => KALANDRIA.economy.unemployment, decimals: 1, unit: "%", chart: "line", note: "Share of the labour force without work. 2024: 5.2%, the lowest since 2019." },
  inflation: { label: "Inflation", values: () => KALANDRIA.economy.inflation, decimals: 1, unit: "%", chart: "line", note: "Consumer price inflation, annual average. Peaked at 6.8% in 2022, back to 2.9% in 2024." },
  trade: { label: "Trade", values: () => KALANDRIA.economy.exportsBillion, decimals: 1, unit: " bn K", chart: "line", note: "Goods exports, billion kaldar. 2024 exports K 18.2 billion against imports of K 17.6 billion — a surplus of K 0.6 billion." },
};

function renderEconomy() {
  const K = KALANDRIA, E = K.economy, last = K.years.length - 1;
  const tabKeys = Object.keys(ECONOMY_TABS);
  const tabs = tabKeys.map((k) =>
    `<button type="button" class="tab${state.economyTab === k ? " active" : ""}" data-tab="${k}" aria-pressed="${state.economyTab === k}">${ECONOMY_TABS[k].label}</button>`).join("");
  const tab = ECONOMY_TABS[state.economyTab];
  const chart = lineChart(K.years.map(String), tab.values(), { color: "#0b6b7a", decimals: tab.decimals, unit: tab.unit, title: tab.label + " 2019 to 2024" });
  const tabTable = yearTable(["Indicator", ...K.years.map(String)], [
    [tab.label + (state.economyTab === "trade" ? " (exports, bn K)" : tab.unit === "%" ? " (%)" : " (bn K)"),
      ...tab.values().map((v) => v.toFixed(tab.decimals))],
  ]);
  const donut = donutChart(E.sectors2024, { centerLabel: "GVA 2024", centerValue: "100%" });
  const fullRows = [
    ["GDP (billion kaldar)", ...E.gdpBillion.map((v) => v.toFixed(1))],
    ["GDP growth (%)", ...E.gdpGrowth.map((v) => (v > 0 ? "+" : "") + v.toFixed(1))],
    ["Unemployment (%)", ...E.unemployment.map((v) => v.toFixed(1))],
    ["Inflation (%)", ...E.inflation.map((v) => v.toFixed(1))],
    ["Exports (billion kaldar)", ...E.exportsBillion.map((v) => v.toFixed(1))],
    ["Imports (billion kaldar)", ...E.importsBillion.map((v) => v.toFixed(1))],
    ["Trade balance (billion kaldar)", ...E.exportsBillion.map((v, i) => (E.exportsBillion[i] - E.importsBillion[i]).toFixed(1))],
  ];
  return `<h1>Economy</h1>` +
    `<p class="lede">GDP reached K 48.2 billion in 2024 with unemployment at 5.2% and inflation at 2.9%. ` +
    `Trade moved into a surplus of K ${K.derived.tradeBalance2024.toFixed(1)} billion.</p>` +
    section("Indicators, 2019–2024",
      `<div class="tabs" role="tablist">${tabs}</div><div class="tab-panel">${chart}${tabTable}</div>`, tab.note) +
    `<div class="two-col">` +
    section("What Kalandria produces, 2024", donut, "Shares of gross value added. Services dominate at 58.2%; the five shares add to 100.0%.") +
    section("Key figures, 2024",
      `<dl class="facts"><dt>GDP</dt><dd>K ${E.gdpBillion[last].toFixed(1)} billion</dd>` +
      `<dt>GDP per capita</dt><dd>K ${fmtNum(K.derived.gdpPerCapita2024)}</dd>` +
      `<dt>Unemployment</dt><dd>${E.unemployment[last].toFixed(1)}%</dd>` +
      `<dt>Inflation</dt><dd>${E.inflation[last].toFixed(1)}%</dd>` +
      `<dt>Exports</dt><dd>K ${E.exportsBillion[last].toFixed(1)} billion</dd>` +
      `<dt>Imports</dt><dd>K ${E.importsBillion[last].toFixed(1)} billion</dd>` +
      `<dt>Trade balance</dt><dd>K +${K.derived.tradeBalance2024.toFixed(1)} billion</dd></dl>`,
      "Source: " + esc(K.office) + ", national accounts and trade bulletins.") +
    `</div>` +
    section("Full table, 2019–2024",
      yearTable(["Indicator", ...K.years.map(String)], fullRows) +
      `<p><button type="button" class="btn" id="csvBtn">Download this table as CSV</button> <span class="note" id="csvNote"></span></p>`,
      "The CSV contains exactly the figures in the table above.");
}

function renderPopulation() {
  const K = KALANDRIA, P = K.population, last = K.years.length - 1;
  const c = P.change2024;
  const age = hbarChart(P.ageGroups2024, { max: 50, decimals: 1 });
  const life = lineChart(K.years.map(String), P.lifeExpectancy, { color: "#4d9e6d", decimals: 1, min: 76, title: "Life expectancy at birth, years" });
  return `<h1>Population</h1>` +
    `<p class="lede">Kalandria had ${fmtNum(P.total[last])} residents in 2024, up ${fmtNum(P.total[last] - P.total[last - 1])} on 2023. ` +
    `Life expectancy reached ${P.lifeExpectancy[last].toFixed(1)} years.</p>` +
    `<div class="two-col">` +
    section("Age structure, 2024", age, "Shares of the total population; the five groups add to 100.0%.") +
    section("Life expectancy at birth, 2019–2024 (years)", life, "Women 81.2 years and men 76.1 years in 2024.") +
    `</div>` +
    section("How the population changed in 2024",
      `<dl class="facts"><dt>Births</dt><dd>+${fmtNum(c.births)}</dd>` +
      `<dt>Deaths</dt><dd>−${fmtNum(c.deaths)}</dd>` +
      `<dt>Net migration</dt><dd>+${fmtNum(c.netMigration)}</dd>` +
      `<dt>Change in 2024</dt><dd>+${fmtNum(c.births - c.deaths + c.netMigration)}</dd>` +
      `<dt>Population, 1 Jan 2024</dt><dd>${fmtNum(P.total[last])}</dd></dl>`,
      "Births minus deaths plus net migration equals the 42,000 rise from 4,244,000 to 4,286,000.") +
    section("Population by province, 2024",
      `<p><label for="provSearch">Search provinces </label><input id="provSearch" type="search" placeholder="Type a province name…" value="${esc(state.popQuery)}"></p>` +
      `<div id="provTable"></div>`,
      "Click a column heading to sort. Shares add to 100.0% of the national total.");
}

function provinceRows() {
  const q = state.popQuery.trim().toLowerCase();
  let rows = KALANDRIA.provinces.filter((p) => !q || p.name.toLowerCase().includes(q));
  const k = state.popSort.key, dir = state.popSort.dir;
  rows = rows.slice().sort((a, b) => {
    const av = a[k], bv = b[k];
    return (av < bv ? -1 : av > bv ? 1 : 0) * dir;
  });
  return rows;
}

function renderProvinceTable() {
  const rows = provinceRows();
  const total = KALANDRIA.population.total[KALANDRIA.years.length - 1];
  const sortMark = (k) => (state.popSort.key === k ? (state.popSort.dir === 1 ? " ▲" : " ▼") : "");
  const columns = [
    { label: "Province", sort: "name" },
    { label: "Population", sort: "population" },
    { label: "Share", sort: null },
    { label: "Density /km²", sort: null },
    { label: "Life exp.", sort: "life" },
  ];
  const head = columns.map((c) => c.sort
    ? `<th><button type="button" class="th-btn" data-sort="${c.sort}">${c.label}${sortMark(c.sort)}</button></th>`
    : `<th>${c.label}</th>`).join("");
  let body;
  if (rows.length === 0) {
    body = `<tr><td colspan="5">No province matches “${esc(state.popQuery)}”.</td></tr>`;
  } else {
    body = rows.map((p) =>
      `<tr><th scope="row">${esc(p.name)}${p.capital ? " (capital)" : ""}</th>` +
      `<td>${fmtNum(p.population)}</td><td>${((p.population / total) * 100).toFixed(1)}%</td>` +
      `<td>${(p.population / p.areaKm2).toFixed(1)}</td><td>${p.life.toFixed(1)}</td></tr>`).join("");
  }
  return `<div class="table-wrap"><table><tr>${head}</tr>${body}</table></div>` +
    `<p class="note">${rows.length} of ${KALANDRIA.provinces.length} provinces shown · National total ${fmtNum(total)}</p>`;
}

function renderRegions() {
  const K = KALANDRIA;
  const popChart = barChart(K.provinces.map((p) => p.name.split(" ").pop()), K.provinces.map((p) => p.population),
    { color: "#3f7fb8", divide: 1000, decimals: 0, unit: "k", title: "Population by province, 2024, thousands" });
  const options = K.provinces.map((p) => `<option value="${esc(p.name)}"${p.name === state.region ? " selected" : ""}>${esc(p.name)}</option>`).join("");
  const p = K.provinces.find((x) => x.name === state.region) || K.provinces[0];
  const total = K.population.total[K.years.length - 1];
  const explorer = `<p><label for="regionSelect">Choose a province </label>` +
    `<select id="regionSelect">${options}</select></p>` +
    `<dl class="facts"><dt>Population, 2024</dt><dd>${fmtNum(p.population)} (${((p.population / total) * 100).toFixed(1)}% of Kalandria)</dd>` +
    `<dt>Area</dt><dd>${fmtNum(p.areaKm2)} km²</dd>` +
    `<dt>Density</dt><dd>${(p.population / p.areaKm2).toFixed(1)} people per km²</dd>` +
    `<dt>GDP per capita</dt><dd>K ${fmtNum(p.gdpPerCapita)}</dd>` +
    `<dt>Unemployment</dt><dd>${p.unemployment.toFixed(1)}%</dd>` +
    `<dt>Life expectancy</dt><dd>${p.life.toFixed(1)} years</dd>` +
    `<dt>Forest cover</dt><dd>${p.forest.toFixed(1)}%</dd>` +
    `<dt>Renewable electricity</dt><dd>${p.renewable.toFixed(1)}%</dd>` +
    `<dt>CO₂ per capita</dt><dd>${p.co2.toFixed(1)} tonnes</dd>` +
    `<dt>Recycling rate</dt><dd>${p.recycling.toFixed(1)}%</dd>` +
    `<dt>Protected land</dt><dd>${p.protected.toFixed(1)}%</dd>` +
    `<dt>Good air-quality days</dt><dd>${p.goodDays} of 365</dd></dl>`;
  const envCards = K.environment2024.map((e) => {
    const pct = e.unit === "t" ? (e.value / 8) * 100 : e.unit === "days" ? (e.value / 365) * 100 : e.value;
    return `<div class="env-card"><span class="env-value">${e.value}${e.unit === "t" ? " t" : e.unit === "days" ? " days" : "%"}</span>` +
      `<span class="env-label">${esc(e.label)}</span>` +
      `<span class="hbar-track"><span class="hbar-fill" style="width:${pct.toFixed(1)}%;background:#4d9e6d"></span></span>` +
      `<span class="env-note">${esc(e.note)}</span></div>`;
  }).join("");
  return `<h1>Regions &amp; environment</h1>` +
    `<p class="lede">Eight provinces share ${fmtNum(K.areaKm2)} km². Port Meridia holds ${((1142000 / total) * 100).toFixed(1)}% of the ` +
    `population on 1.5% of the land; the Veyl Highlands hold 4.3% of the people on 20.8% of the land.</p>` +
    section("Population by province, 2024 (thousands)", popChart, "Provinces sum to the national total of " + fmtNum(total) + ".") +
    `<div class="two-col">` +
    section("Province explorer", explorer, "Every figure comes from the same provincial tables used above.") +
    section("Environment, national picture 2024", `<div class="env-grid">${envCards}</div>`,
      "Renewables supplied 41.2% of electricity in 2024; 312 days had good air quality.") +
    `</div>`;
}

function downloadEconomyCsv() {
  const K = KALANDRIA, E = K.economy;
  const lines = [["Indicator", ...K.years.map(String)].join(",")];
  const add = (label, vals) => lines.push([label, ...vals.map((v) => v.toFixed(1))].join(","));
  add("GDP (billion kaldar)", E.gdpBillion);
  add("GDP growth (%)", E.gdpGrowth);
  add("Unemployment (%)", E.unemployment);
  add("Inflation (%)", E.inflation);
  add("Exports (billion kaldar)", E.exportsBillion);
  add("Imports (billion kaldar)", E.importsBillion);
  add("Trade balance (billion kaldar)", E.exportsBillion.map((v, i) => E.exportsBillion[i] - E.importsBillion[i]));
  const blob = new Blob([lines.join("\n") + "\n"], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kalandria-economy-2019-2024.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  const note = document.getElementById("csvNote");
  if (note) note.textContent = "Downloaded kalandria-economy-2019-2024.csv (" + lines.length + " rows).";
}

function bindPage(route) {
  document.querySelectorAll(".tab").forEach((b) => {
    b.addEventListener("click", () => { state.economyTab = b.dataset.tab; render(); });
  });
  const csvBtn = document.getElementById("csvBtn");
  if (csvBtn) csvBtn.addEventListener("click", downloadEconomyCsv);
  const search = document.getElementById("provSearch");
  if (search) {
    search.addEventListener("input", () => {
      state.popQuery = search.value;
      const box = document.getElementById("provTable");
      if (box) box.innerHTML = renderProvinceTable();
      bindProvinceTable();
    });
    const box = document.getElementById("provTable");
    if (box) box.innerHTML = renderProvinceTable();
    bindProvinceTable();
  }
  const sel = document.getElementById("regionSelect");
  if (sel) sel.addEventListener("change", () => { state.region = sel.value; render(); });
}

function bindProvinceTable() {
  document.querySelectorAll(".th-btn").forEach((b) => {
    b.addEventListener("click", () => {
      const k = b.dataset.sort;
      if (state.popSort.key === k) state.popSort.dir *= -1;
      else state.popSort = { key: k, dir: k === "name" ? 1 : -1 };
      const box = document.getElementById("provTable");
      if (box) box.innerHTML = renderProvinceTable();
      bindProvinceTable();
    });
  });
}

function currentRoute() {
  const h = (location.hash || "#/overview").replace(/^#/, "");
  return ROUTES[h] ? h : "/overview";
}

function render() {
  const route = currentRoute();
  const view = document.getElementById("view");
  view.innerHTML = ROUTES[route].render();
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + route);
    if (a.getAttribute("href") === "#" + route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = ROUTES[route].title + " — Kalandria National Statistics";
  bindPage(route);
  window.scrollTo(0, 0);
}
