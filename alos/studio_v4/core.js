// Shared helpers for the DisruptionOps film (pure functions of t).
(function () {
  const { h, S, E, ep, prog, lerp, clamp } = M;
  const P = {
    team: 'M12 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM5 16a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM19 16a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM12 8v4M12 12l-5.5 4.3M12 12l5.5 4.3',
    msg: 'M21 14a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
    alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4', undo: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2', mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
    truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01',
    check: 'M5 12.5 10 17 19 7', x: 'M6 6l12 12M18 6 6 18', shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z',
    plane: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
    flow: 'M5 3h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM15 13h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM7 11v4a2 2 0 0 0 2 2h4',
    cpu: 'M6 6h12v12H6zM9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4',
    spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
    folder: 'M3 6h6l2 2h10v11H3z', box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
    wallet: 'M3 7h16v12H3zM16 13h.01M3 7l12-4v4', bot: 'M5 9h14v10H5zM12 5v4M9 13h.01M15 13h.01M9 16h6',
    users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3',
    flask: 'M9 3h6M10 3v6l-5 10a1 1 0 0 0 .9 1.5h12.2A1 1 0 0 0 19 19L14 9V3', search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5',
    bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4', clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
    ship: 'M3 17l2 4h14l2-4M5 17V9h14v8M9 9V5h6v4', key: 'M15 7a4 4 0 1 1-3.5 6L5 19.5V22H2v-3l6.5-6.5A4 4 0 0 1 15 7zM16 9h.01',
    hook: 'M18 17h-6c-1.1 0-2 .9-2.5 1.9A4 4 0 1 1 6.6 14M6 17l3.1-5.8c.5-1-.1-2.2-.6-3.1a4 4 0 1 1 7-4M12 6l3.1 5.7c.5 1 1.8 1.3 2.9 1.3a4 4 0 0 1 0 8',
    layers: 'M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5', cal: 'M4 5h16v16H4zM4 9h16M8 3v4M16 3v4', reports: 'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6M9 9h2',
    plug: 'M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4', help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
    back: 'M19 12H5M12 19l-7-7 7-7', down: 'M12 5v14M6 13l6 6 6-6', up: 'M12 19V5M6 11l6-6 6 6', chev: 'M6 9l6 6 6-6', arrow: 'M5 12h14M13 6l6 6-6 6', ext: 'M7 17 17 7M8 7h9v9',
  };
  const ic = (n, s = 20, c = 'currentColor', w = 2) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n]}"/></svg>`;
  const paypal = (s = 28) => `<span style="font-weight:800;font-style:italic;font-size:${s}px;letter-spacing:-.5px"><span style="color:#003087">Pay</span><span style="color:#0070e0">Pal</span></span>`;
  const paypalDark = (s = 20) => `<span style="font-weight:800;font-style:italic;font-size:${s}px;letter-spacing:-.4px"><span style="color:#5aa0ff">Pay</span><span style="color:#9cc8ff">Pal</span></span>`;
  const logo = (size) => `<div class="logo" style="width:${size}px;height:${size}px">${ic('flow', size * 0.55, '#fff', 2.2)}</div>`;

  // stage-wide bg for layers that must hide what is below them
  const BG = window.THEME === 'light'
    ? 'radial-gradient(900px 700px at 8% 95%, rgba(236,72,153,.16), transparent 70%), radial-gradient(800px 600px at 92% 10%, rgba(59,130,246,.16), transparent 70%), radial-gradient(700px 600px at 70% 100%, rgba(139,92,246,.14), transparent 70%), #f1f0fa'
    : 'radial-gradient(900px 700px at 8% 95%, rgba(124,58,237,.30), transparent 70%), radial-gradient(800px 600px at 92% 10%, rgba(59,130,246,.18), transparent 70%), radial-gradient(700px 600px at 70% 100%, rgba(236,72,153,.12), transparent 70%), #121327';
  const LIGHT = window.THEME === 'light';
  // theme colours used by scenes for values that are set at runtime
  const C = LIGHT
    ? { side: 'rgba(255,255,255,.92)', end: 'radial-gradient(1300px 900px at 50% 40%, #e4e1ff, #f1f0fa 70%)', ocean0: '#bfe3f7', ocean1: '#86c3ea', land: '#eef2e2', bord: 'rgba(40,40,80,.16)', atm: 'rgba(120,150,255,.30)', hub: '#5b6cf5' }
    : { side: 'rgba(30,31,56,.95)', end: 'radial-gradient(1300px 900px at 50% 40%, #2a2470, #121327 70%)', ocean0: '#2f4150', ocean1: '#18212e', land: '#3a4a46', bord: 'rgba(255,255,255,.10)', atm: 'rgba(120,150,255,.22)', hub: '#6d7cff' };

  // grow a layer's visible area out of a rect (shape change, no fade)
  function grow(root, t, t0, dur, r, ease = E.inOutCubic) {
    const k = ease(prog(t, t0, t0 + dur));
    if (k >= 1) { root.style.clipPath = 'none'; return 1; }
    const top = r.y * (1 - k), left = r.x * (1 - k), right = (1920 - r.x - r.w) * (1 - k), bot = (1080 - r.y - r.h) * (1 - k);
    root.style.clipPath = `inset(${top}px ${right}px ${bot}px ${left}px round ${lerp(r.r || 0, 0, k)}px)`;
    return k;
  }
  // reveal text rising out of a mask line
  const rise = (el, t, t0, d = 0.38) => { const k = ep(t, t0, t0 + d, E.outCubic); el.style.transform = `translateY(${(1 - k) * 110}%)`; return k; };
  const maskWords = (txt, cls = '') => txt.split(' ').map((w) => `<span class="mask ${cls}"><span>${w}</span></span>`).join(' ');
  const bump = (t, t0, t1) => Math.sin(Math.PI * clamp((t - t0) / (t1 - t0)));
  const lerpRect = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), r: lerp(a.r || 0, b.r || 0, k) });
  const place = (el, r) => S(el, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px`, borderRadius: `${r.r || 0}px` });
  const html = (s) => { const d = h('div'); d.innerHTML = s.trim(); return d.firstElementChild; };
  const q = (r, k) => r.querySelector(`[data-k="${k}"]`);
  const qa = (r, k) => [...r.querySelectorAll(`[data-k="${k}"]`)];
  const money = (v, d = 0) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  // one entry per word of the VO: W('six') -> start time of first match after a given time
  function W(word, after = 0) {
    const w = (window.WORDS || []).find((x) => x.start >= after - 0.01 && x.word.toLowerCase().replace(/[^a-z0-9$.]/g, '').startsWith(word.toLowerCase()));
    return w ? w.start : after;
  }
  function cpath(t, pts) {
    if (t <= pts[0][0]) return [pts[0][1], pts[0][2]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (t <= b[0]) { const k = E.inOutCubic(prog(t, a[0], b[0])); const arc = Math.sin(Math.PI * k) * Math.min(40, Math.hypot(b[1] - a[1], b[2] - a[2]) * 0.08); return [lerp(a[1], b[1], k) + arc * 0.4, lerp(a[2], b[2], k) - arc]; }
    }
    const l = pts[pts.length - 1]; return [l[1], l[2]];
  }
  const press = (t, clicks) => 1 - 0.16 * Math.max(0, ...clicks.map((c) => (t < c - 0.07 || t > c + 0.16 ? 0 : t < c ? (t - c + 0.07) / 0.07 : 1 - (t - c) / 0.16)));

  // ---------------- globe (d3 orthographic, dark) ----------------
  const LL = { pune: [73.86, 18.52], shenzhen: [114.06, 22.54], hsinchu: [120.97, 24.8], osaka: [135.5, 34.69], penang: [100.33, 5.41],
    taoyuan: [121.3, 24.99], kobe: [135.19, 34.69],
    singapore: [103.82, 1.35], mumbai: [72.88, 19.08], chennai: [80.27, 13.08], nashik: [73.79, 20.0], hyderabad: [78.49, 17.39], stuttgart: [9.18, 48.78], guangzhou: [113.26, 23.13], dongguan: [113.75, 23.02] };
  const ROUTES = [
    { from: 'shenzhen', col: '#ef4444', w: 3.2, red: true }, { from: 'hsinchu', col: '#3b82f6', w: 2.4 }, { from: 'osaka', col: '#f59e0b', w: 2 },
    { from: 'penang', col: '#8b5cf6', w: 2 }, { from: 'singapore', col: '#22c55e', w: 2 }, { from: 'stuttgart', col: '#f59e0b', w: 2 },
    { from: 'guangzhou', col: '#f59e0b', w: 2 }, { from: 'hyderabad', col: '#22c55e', w: 2 },
  ];
  function makeGlobe(w, hh, scale, rot, routes = ROUTES) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', w); svg.setAttribute('height', hh); svg.style.position = 'absolute'; svg.style.left = '0'; svg.style.top = '0';
    const id = 'g' + Math.random().toString(36).slice(2, 7);
    svg.innerHTML = `<defs><radialGradient id="${id}o" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${C.ocean0}"/><stop offset="1" stop-color="${C.ocean1}"/></radialGradient>
      <radialGradient id="${id}a" r="50%"><stop offset=".86" stop-color="rgba(120,150,255,0)"/><stop offset=".93" stop-color="${C.atm}"/><stop offset="1" stop-color="rgba(120,150,255,0)"/></radialGradient>
      <filter id="${id}b"><feGaussianBlur stdDeviation="2.4"/></filter></defs>
      <circle data-k="atm" fill="url(#${id}a)"/><circle data-k="ocean" fill="url(#${id}o)"/><path data-k="land" fill="${C.land}" stroke="none"/><path data-k="bord" fill="none" stroke="${C.bord}" stroke-width=".8"/>
      <g data-k="routes"></g><g data-k="dots"></g>`;
    const land = topojson.feature(WORLD_LAND, WORLD_LAND.objects.land);
    const bord = topojson.mesh(WORLD_COUNTRIES, WORLD_COUNTRIES.objects.countries, (a, b) => a !== b);
    const proj = d3.geoOrthographic().translate([w / 2, hh / 2]).clipAngle(90);
    const path = d3.geoPath(proj);
    const g = svg.querySelector('[data-k="routes"]'), gd = svg.querySelector('[data-k="dots"]');
    const R = routes.map((r) => {
      const glow = document.createElementNS(ns, 'path'), line = document.createElementNS(ns, 'path');
      glow.setAttribute('fill', 'none'); glow.setAttribute('stroke', r.col); glow.setAttribute('stroke-width', r.w * 3.2); glow.setAttribute('opacity', '.35'); glow.setAttribute('filter', `url(#${id}b)`);
      line.setAttribute('fill', 'none'); line.setAttribute('stroke', r.col); line.setAttribute('stroke-width', r.w); line.setAttribute('stroke-linecap', 'round');
      const dot = document.createElementNS(ns, 'circle'); dot.setAttribute('r', 6); dot.setAttribute('fill', '#fff'); dot.setAttribute('stroke', r.col); dot.setAttribute('stroke-width', 3);
      const src = document.createElementNS(ns, 'circle'); src.setAttribute('r', 5); src.setAttribute('fill', r.col);
      g.appendChild(glow); g.appendChild(line); gd.appendChild(src); gd.appendChild(dot);
      return { ...r, glow, line, dot, src, interp: d3.geoInterpolate(LL[r.from], LL[r.to || 'pune']) };
    });
    const hub = document.createElementNS(ns, 'circle'); hub.setAttribute('fill', C.hub); hub.setAttribute('stroke', '#fff'); hub.setAttribute('stroke-width', 3); gd.appendChild(hub);
    const els = { atm: svg.querySelector('[data-k="atm"]'), ocean: svg.querySelector('[data-k="ocean"]'), land: svg.querySelector('[data-k="land"]'), bord: svg.querySelector('[data-k="bord"]') };
    function draw(t, opt) {
      const sc = opt.scale || scale;
      proj.scale(sc).rotate(opt.rot || rot);
      S(els.ocean, {}); els.ocean.setAttribute('cx', w / 2); els.ocean.setAttribute('cy', hh / 2); els.ocean.setAttribute('r', sc);
      els.atm.setAttribute('cx', w / 2); els.atm.setAttribute('cy', hh / 2); els.atm.setAttribute('r', sc * 1.12);
      els.land.setAttribute('d', path(land)); els.bord.setAttribute('d', path(bord));
      R.forEach((r, i) => {
        const p = r.prog != null ? clamp(r.prog(t)) : clamp((opt.draw || 1) * 1.6 - i * 0.08);
        if (r.color) { const c = r.color(t); r.line.setAttribute('stroke', c); r.glow.setAttribute('stroke', c); }
        const d = path({ type: 'LineString', coordinates: d3.range(0, 1.0001, 0.02).map(r.interp) }) || '';
        r.line.setAttribute('d', d); r.glow.setAttribute('d', d);
        const L = r.line.getTotalLength ? r.line.getTotalLength() : 0;
        [r.line, r.glow].forEach((e) => e.setAttribute('stroke-dasharray', `${L * p} ${L + 10}`));
        const hot = r.red ? (opt.hot || 0) : 0;
        r.glow.setAttribute('opacity', String(0.35 + hot * 0.5)); r.line.setAttribute('stroke-width', r.w * (1 + hot * 0.6));
        const f = ((t * 0.08 + i * 0.13) % 1) * 0.9 + 0.05;
        const pt = proj(r.interp(r.red ? 0.02 : f)), sp = proj(LL[r.from]);
        r.dot.setAttribute('cx', pt[0]); r.dot.setAttribute('cy', pt[1]); r.dot.setAttribute('opacity', p > 0.95 && !r.nodot ? 1 : 0);
        r.src.setAttribute('cx', sp[0]); r.src.setAttribute('cy', sp[1]); r.src.setAttribute('opacity', p > 0.05 ? 1 : 0);
      });
      const hp = proj(LL.pune); hub.setAttribute('cx', hp[0]); hub.setAttribute('cy', hp[1]); hub.setAttribute('r', 8 + 2 * Math.sin(t * 5));
    }
    return { svg, draw, proj };
  }

  // Slot-machine counter: every digit spins (each at its own speed), all lock on the same frame tLock.
  function roller(str, size, weight = 700, extra = '') {
    const el = document.createElement('div');
    el.style.cssText = `display:inline-flex;align-items:flex-start;font-size:${size}px;font-weight:${weight};line-height:1;height:${size * 1.08}px;overflow:hidden;font-feature-settings:'tnum' 1;${extra}`;
    const cols = [];
    let di = 0;
    for (const ch of str) {
      if (/[0-9]/.test(ch)) {
        const c = document.createElement('span');
        c.style.cssText = `display:inline-block;height:${size * 1.08}px;overflow:hidden;position:relative`;
        const strip = document.createElement('span');
        strip.style.cssText = 'display:flex;flex-direction:column;will-change:auto';
        strip.innerHTML = '0123456789 0'.replace(' ', '').split('').map((d) => `<span style="display:block;height:${size * 1.08}px;line-height:${size * 1.08}px">${d}</span>`).join('');
        c.appendChild(strip); el.appendChild(c);
        cols.push({ strip, d: +ch, spins: 2 + ((di * 7) % 5) + di * 0.5 }); di++;
      } else {
        const s = document.createElement('span'); s.textContent = ch; s.style.cssText = `display:inline-block;line-height:${size * 1.08}px`; el.appendChild(s);
      }
    }
    const H = size * 1.08;
    // k: 0 = start spinning, 1 = locked. Rolls decelerate together (outCubic), so they all land at k = 1.
    function set(t, t0, tLock) {
      const k = clamp((t - t0) / (tLock - t0));
      const e = 1 - Math.pow(1 - k, 3);
      cols.forEach((c) => {
        const v = c.d + 10 * c.spins * (1 - e);           // value still to travel
        const p = ((v % 10) + 10) % 10;                   // 0..10 position on the 0-9,0 strip
        const settleBump = t > tLock ? 0.06 * Math.exp(-(t - tLock) * 9) * Math.sin((t - tLock) * 30) : 0;
        c.strip.style.transform = `translateY(${-(p + settleBump) * H}px)`;
      });
      return k;
    }
    return { el, set };
  }

  // Light theme: remap the inline dark colours of everything built so far (static styles only).
  function retheme(root) {
    if (!LIGHT) return;
    const map = [
      [/rgba\(255,\s*255,\s*255,\s*(0?\.\d+)\)/g, (m, a) => `rgba(40,36,90,${(+a * 0.75).toFixed(3)})`],
      [/#25264a|#2c2d55/gi, () => '#eceafb'],
      [/color:\s*#fff\b/gi, () => 'color:#1f1b3d'],
      [/color:\s*#(c9cbe6|d4d5ea|d8d9ea|c8cae4|e3e6ff|d6d8f5|b9bce0|9fb0ff|7f81a6|c9cbe6)/gi, () => 'color:#4a4770'],
      [/color:\s*#ff6b6b|color:\s*#ff8080|color:\s*#ffb4b4|color:\s*#ffcaca/gi, () => 'color:#dc2626'],
      [/color:\s*#fbbf24/gi, () => 'color:#b45309'], [/color:\s*#4ade80/gi, () => 'color:#15803d'], [/color:\s*#c4b5fd/gi, () => 'color:#6d28d9'], [/color:\s*#8ea2ff/gi, () => 'color:#4f46e5'],
    ];
    root.querySelectorAll('[style]').forEach((e) => {
      if (e.closest('[data-keep]')) return;
      let s = e.getAttribute('style'); map.forEach(([re, f]) => { s = s.replace(re, f); }); e.setAttribute('style', s);
    });
  }

  window.K = { ic, paypal, paypalDark, logo, BG, grow, rise, maskWords, bump, lerpRect, place, html, q, qa, money, W, cpath, press, makeGlobe, LL, roller, C, LIGHT, retheme };
})();
