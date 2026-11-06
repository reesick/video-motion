// Motion engine: everything is a pure function of time t (seconds).
// No CSS transitions, no timers, no state carried between frames.
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, t0, t1) => clamp((t - t0) / (t1 - t0));

  const E = {
    linear: (x) => x,
    inCubic: (x) => x * x * x,
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    outQuint: (x) => 1 - Math.pow(1 - x, 5),
    inOutQuint: (x) => (x < 0.5 ? 16 * x ** 5 : 1 - Math.pow(-2 * x + 2, 5) / 2),
    outExpo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    inExpo: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
    inOutExpo: (x) => x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
    inOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  };

  // eased progress between t0 and t1
  const ep = (t, t0, t1, ease = E.inOutCubic) => ease(prog(t, t0, t1));

  // Closed-form damped spring step response 0 -> 1 starting at t0.
  // f = natural frequency (Hz), z = damping ratio (<1 overshoots).
  function spring(t, t0, f = 2.2, z = 0.7) {
    const s = t - t0;
    if (s <= 0) return 0;
    const w = 2 * Math.PI * f;
    if (z >= 1) return 1 - Math.exp(-w * s) * (1 + w * s);
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * s) * (Math.cos(wd * s) + (z * w / wd) * Math.sin(wd * s));
  }
  const pop = (t, t0, f = 2.4, z = 0.62) => spring(t, t0, f, z);
  const settle = (t, t0) => spring(t, t0, 1.6, 0.82);

  // Sum-of-springs: a value that changes target several times. steps = [[t, value], ...]
  function springSteps(t, steps, f = 2, z = 0.75) {
    let v = steps[0][1];
    for (let i = 1; i < steps.length; i++) v += (steps[i][1] - steps[i - 1][1]) * spring(t, steps[i][0], f, z);
    return v;
  }

  // Piecewise keyframes [[t, v], ...] with easing per segment.
  function keys(t, ks, ease = E.inOutCubic) {
    if (t <= ks[0][0]) return ks[0][1];
    for (let i = 0; i < ks.length - 1; i++) {
      const [ta, va] = ks[i], [tb, vb] = ks[i + 1];
      if (t <= tb) {
        const k = (ks[i + 1][2] || ease)(prog(t, ta, tb));
        if (Array.isArray(va)) return va.map((a, j) => lerp(a, vb[j], k));
        return lerp(va, vb, k);
      }
    }
    return ks[ks.length - 1][1];
  }

  // Camera: keys [t, zoom, x, y] (x,y = design-space point at frame centre). Zoom in log space.
  function camera(t, ks, ease = E.inOutCubic) {
    if (t <= ks[0][0]) return { z: ks[0][1], x: ks[0][2], y: ks[0][3] };
    for (let i = 0; i < ks.length - 1; i++) {
      const a = ks[i], b = ks[i + 1];
      if (t <= b[0]) {
        const k = (b[4] || ease)(prog(t, a[0], b[0]));
        return { z: Math.exp(lerp(Math.log(a[1]), Math.log(b[1]), k)), x: lerp(a[2], b[2], k), y: lerp(a[3], b[3], k) };
      }
    }
    const l = ks[ks.length - 1];
    return { z: l[1], x: l[2], y: l[3] };
  }
  const camCSS = (c) => `translate(960px,540px) scale(${c.z}) translate(${-c.x}px,${-c.y}px)`;

  // DOM helpers
  function h(tag, cls, html, style) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (style) Object.assign(e.style, style);
    return e;
  }
  const S = (e, st) => { for (const k in st) e.style[k] = st[k]; return e; };
  const show = (e, on) => { e.style.display = on ? '' : 'none'; };
  const px = (v) => `${v}px`;

  // unique ids inside inline SVG strings (gradients/clipPaths must not collide)
  let uidN = 0;
  function uniq(svg) {
    const n = ++uidN;
    let out = svg.replace(/ID"/g, `u${n}"`).replace(/ID\)/g, `u${n})`); // photo template token
    const ids = new Set();
    out.replace(/id="([^"]+)"/g, (_, id) => ids.add(id));
    ids.forEach((id) => {
      out = out.split(`id="${id}"`).join(`id="${id}_${n}"`).split(`url(#${id})`).join(`url(#${id}_${n})`);
    });
    return out;
  }

  // Text measuring (Outfit must be loaded first)
  const mctx = document.createElement('canvas').getContext('2d');
  function textW(str, size, weight = 400) {
    mctx.font = `${weight} ${size}px Outfit`;
    return mctx.measureText(str).width;
  }

  // Typewriter: reveal count of chars between t0..t1 with a slightly irregular human rhythm
  function typed(str, t, t0, t1) {
    if (t <= t0) return '';
    if (t >= t1) return str;
    const n = str.length;
    const k = (t - t0) / (t1 - t0);
    // jitter: deterministic per-char weight
    let total = 0; const w = [];
    for (let i = 0; i < n; i++) { const x = Math.sin(i * 12.9898) * 43758.5453; const r = x - Math.floor(x); w.push(0.6 + r * 0.8 + (str[i] === ' ' ? 0.5 : 0)); total += w[i]; }
    let acc = 0, c = 0;
    for (; c < n; c++) { acc += w[c] / total; if (acc > k) break; }
    return str.slice(0, c);
  }

  const fmtMoney = (v) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (v) => Math.round(v).toLocaleString('en-US');

  // smooth deterministic float for idle drift
  const drift = (t, seed, amp = 4, speed = 0.35) => amp * Math.sin(t * speed * 2 * Math.PI + seed * 1.7) ;

  window.M = { clamp, lerp, prog, E, ep, spring, pop, settle, springSteps, keys, camera, camCSS, h, S, show, px, uniq, textW, typed, fmtMoney, fmtInt, drift };
})();
