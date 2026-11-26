// Inline SVG chart builders for the Kalandria statistics site.
// Pure functions: data in, an SVG string out. No libraries, no network.

const CHART_COLORS = ["#0b6b7a", "#e8a33d", "#4d9e6d", "#7a5fb0", "#c25b4a", "#3f7fb8", "#8a8f98", "#b07d3a"];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function niceCeil(v) {
  // Smallest "round" number >= v, from steps 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10.
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  for (const s of steps) if (n <= s) return s * p;
  return 10 * p;
}

// Width (px) the y-axis labels need, so long labels are never clipped.
function yPad(tickLabels) {
  const longest = Math.max.apply(null, tickLabels.map((t) => t.length));
  return Math.max(46, longest * 7 + 14);
}

function fmtNum(n) {
  return n.toLocaleString("en-US");
}

// Line chart with labelled points and a light grid.
function lineChart(labels, values, opts) {
  const o = Object.assign({ width: 640, height: 260, color: CHART_COLORS[0], unit: "", decimals: 1, min: null, title: "" }, opts || {});
  const W = o.width, H = o.height;
  const min = o.min !== null ? o.min : Math.min(0, Math.min.apply(null, values));
  const max = min + niceCeil((Math.max.apply(null, values) - min) * 1.06);
  const ticks = 4;
  const tickLabels = [];
  for (let t = 0; t <= ticks; t++) tickLabels.push((min + ((max - min) * t) / ticks).toFixed(o.decimals) + o.unit);
  const padL = yPad(tickLabels), padR = 14, padT = 14, padB = 30;
  const iw = W - padL - padR, ih = H - padT - padB;
  const x = (i) => padL + (iw * i) / (labels.length - 1);
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  let grid = "";
  for (let t = 0; t <= ticks; t++) {
    const v = min + ((max - min) * t) / ticks;
    const yy = y(v);
    grid += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="#e3e8ea" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="11" fill="#5a6b72">${esc(tickLabels[t])}</text>`;
  }
  let pts = "";
  let path = "";
  values.forEach((v, i) => {
    path += (i === 0 ? "M" : "L") + x(i).toFixed(1) + "," + y(v).toFixed(1) + " ";
    pts += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4" fill="${o.color}" stroke="#fff" stroke-width="1.5"/>` +
      `<text x="${x(i).toFixed(1)}" y="${y(v).toFixed(1) - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="#22343b">${v.toFixed(o.decimals)}</text>`;
  });
  let xlabels = "";
  labels.forEach((lb, i) => {
    xlabels += `<text x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#5a6b72">${esc(lb)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(o.title || "Line chart")}">${grid}` +
    `<path d="${path}" fill="none" stroke="${o.color}" stroke-width="2.5"/>${pts}${xlabels}</svg>`;
}

// Vertical bar chart with value labels on top of each bar.
function barChart(labels, values, opts) {
  const o = Object.assign({ width: 640, height: 260, color: CHART_COLORS[0], unit: "", decimals: 0, divide: 1, title: "" }, opts || {});
  const W = o.width, H = o.height;
  const scaled = values.map((v) => v / o.divide);
  const max = niceCeil(Math.max.apply(null, scaled) * 1.08);
  const tickLabels = [];
  for (let t = 0; t <= 4; t++) tickLabels.push(((max * t) / 4).toFixed(o.decimals) + o.unit);
  const padL = yPad(tickLabels), padR = 10, padT = 22, padB = 30;
  const iw = W - padL - padR, ih = H - padT - padB;
  const slot = iw / labels.length;
  const bw = Math.min(54, slot * 0.62);
  let grid = "";
  for (let t = 0; t <= 4; t++) {
    const v = (max * t) / 4;
    const yy = padT + ih - (ih * t) / 4;
    grid += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="#e3e8ea" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="11" fill="#5a6b72">${esc(tickLabels[t])}</text>`;
  }
  let bars = "";
  scaled.forEach((v, i) => {
    const h = (v / max) * ih;
    const bx = padL + slot * i + (slot - bw) / 2;
    const by = padT + ih - h;
    bars += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${o.color}"/>` +
      `<text x="${(bx + bw / 2).toFixed(1)}" y="${(by - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#22343b">${scaled[i].toFixed(o.decimals)}${o.unit}</text>` +
      `<text x="${(padL + slot * i + slot / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#5a6b72">${esc(labels[i])}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(o.title || "Bar chart")}">${grid}${bars}</svg>`;
}

// Donut chart with a centre total and a side legend.
function donutChart(parts, opts) {
  const o = Object.assign({ size: 240, centerLabel: "", centerValue: "" }, opts || {});
  const cx = o.size / 2, cy = o.size / 2, r = o.size / 2 - 14, hole = r * 0.62;
  const total = parts.reduce((s, p) => s + p.pct, 0);
  let arcs = "";
  let a0 = -Math.PI / 2;
  parts.forEach((p, i) => {
    const a1 = a0 + (p.pct / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + hole * Math.cos(a1), yi1 = cy + hole * Math.sin(a1);
    const xi0 = cx + hole * Math.cos(a0), yi0 = cy + hole * Math.sin(a0);
    arcs += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${hole} ${hole} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${CHART_COLORS[i % CHART_COLORS.length]}"/>`;
    a0 = a1;
  });
  let legend = "";
  parts.forEach((p, i) => {
    legend += `<li><span class="swatch" style="background:${CHART_COLORS[i % CHART_COLORS.length]}"></span>${esc(p.label)} <strong>${p.pct.toFixed(1)}%</strong></li>`;
  });
  return `<div class="donut-wrap"><svg viewBox="0 0 ${o.size} ${o.size}" width="${o.size}" height="${o.size}" role="img" aria-label="Donut chart">${arcs}` +
    `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="12" fill="#5a6b72">${esc(o.centerLabel)}</text>` +
    `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="19" font-weight="700" fill="#22343b">${esc(o.centerValue)}</text></svg>` +
    `<ul class="legend">${legend}</ul></div>`;
}

// Horizontal percentage bars (age structure, province shares, ...).
function hbarChart(rows, opts) {
  const o = Object.assign({ max: 100, unit: "%", decimals: 1, color: CHART_COLORS[0] }, opts || {});
  let out = '<div class="hbars">';
  rows.forEach((row, i) => {
    const pct = (row.pct / o.max) * 100;
    out += `<div class="hbar-row"><span class="hbar-label">${esc(row.label)}</span>` +
      `<span class="hbar-track"><span class="hbar-fill" style="width:${pct.toFixed(1)}%;background:${CHART_COLORS[i % CHART_COLORS.length]}"></span></span>` +
      `<span class="hbar-value">${row.pct.toFixed(o.decimals)}${o.unit}</span></div>`;
  });
  return out + "</div>";
}
