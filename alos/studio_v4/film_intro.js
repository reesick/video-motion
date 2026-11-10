// Five candidate intros for 0 s → "Suppliers overcharge" (L3), chosen with ?intro=1..5.
// Inspired by the Madison reference at 7–12 s: things burst out of a centre on springs into a ring,
// float, then collapse back and the centre turns into the next scene. Everything after L3 is unchanged.
(function () {
  const IV = +(window.INTRO || 0); if (!IV) return;
  const { S, show, E, ep, lerp, spring, pop, settle, drift } = M;
  const { ic, rise, maskWords, bump, q, W, roller, makeGlobe } = K;
  const { L, add } = F;
  const END = L(3) + 0.5, T2 = L(2);
  const LOCK1 = W('million') + 0.02, LOCK2 = W('cars', T2) - 0.12, TC = W('chips', T2);
  F.LOCK1 = LOCK1; F.LOCK2 = LOCK2;

  const camLayer = (root) => add(root, `<div class="abs" style="left:0;top:0;width:1920px;height:1080px;transform-origin:960px 540px"></div>`);
  const clampAge = (t, t0) => Math.max(0, t - t0);
  const measure = (e) => { e.style.left = '0px'; e.style.top = '0px'; e.style.transformOrigin = '50% 50%'; e._w = e.offsetWidth; e._h = e.offsetHeight; return e; };
  const centerAt = (e, x, y, s = 1) => { e.style.transform = `translate(${x - e._w / 2}px,${y - e._h / 2}px) scale(${Math.max(0, s)})`; };
  const chip = (root, txt, icn, col = '#8ea2ff', sub = '') => measure(add(root, `<div class="card" style="padding:12px 20px;border-radius:20px;display:flex;align-items:center;gap:12px;font-size:20px;font-weight:600;white-space:nowrap"><span class="icirc">${ic(icn, 19, col)}</span><div>${txt}${sub ? `<div class="mut" style="font-size:14px;font-weight:500">${sub}</div>` : ''}</div></div>`));

  // centre counter: every digit spins, all lock on "million"
  function counter(root, top, size) {
    const wrap = add(root, `<div class="abs" style="left:0;width:1920px;top:${top}px;text-align:center">
      <div data-k="lab" style="font-size:${Math.round(size * 0.22)}px;font-weight:500;color:#c9cbe6">${maskWords('One hour of downtime in a car plant')}</div>
      <div data-k="n" style="display:flex;justify-content:center;letter-spacing:-${size / 40}px"></div>
      <div data-k="src" style="font-size:18px;color:#7f81a6;margin-top:6px">Siemens · The True Cost of Downtime, 2024</div></div>`);
    const R = roller('$2,300,000', size, 800); q(wrap, 'n').appendChild(R.el);
    const ws = [...q(wrap, 'lab').querySelectorAll('.mask > span')];
    return (t, mode = 'shrink') => {
      ws.forEach((w, i) => rise(w, t, 0.02 + i * 0.05, 0.3));
      R.set(t, 0.06, LOCK1);
      const fl = t > LOCK1 ? Math.exp(-(t - LOCK1) * 6) : 0;
      q(wrap, 'n').style.textShadow = fl > 0.01 ? `0 0 ${40 * fl}px rgba(249,115,22,${0.55 * fl})` : 'none';
      const up = ep(t, T2 - 0.15, T2 + 0.35, E.inOutCubic), out = ep(t, L(3) - 0.1, L(3) + 0.3, E.inCubic);
      if (mode === 'away') {   // leave completely when the next number takes over (no leftover $2.3M on top)
        const a = ep(t, T2 - 0.2, T2 + 0.2, E.inCubic);
        wrap.style.transform = `translateY(${-260 * a}px) scale(${(1 - 0.35 * a) * (1 + 0.035 * fl)})`;
        wrap.style.opacity = 1 - a; return;
      }
      if (mode === 'shrink') {
        wrap.style.transform = `translateY(${(110 - top) * up}px) scale(${lerp(1, 0.42, up) * (1 + 0.035 * fl)})`;
        q(wrap, 'lab').style.opacity = q(wrap, 'src').style.opacity = 1 - up;
      } else wrap.style.transform = `translateY(${400 * ep(t, T2 - 0.1, T2 + 0.3, E.inCubic)}px) scale(${1 + 0.035 * fl})`;
      wrap.style.opacity = 1 - out;
    };
  }

  // the 46,000 card (same content as before), entering from any point
  function card46(root) {
    const card = add(root, `<div class="card" style="left:510px;top:300px;width:900px;height:430px;padding:46px 54px;z-index:20">
      <div class="pill p-red" data-k="pill"><i></i>Line stopped</div>
      <div style="margin-top:18px;letter-spacing:-2px;transform-origin:0 50%" data-k="n"></div>
      <div data-k="l1" style="font-size:30px;font-weight:600;margin-top:2px">cars not built · Oct–Dec 2022</div>
      <div data-k="l2" class="mut" style="font-size:20px;margin-top:10px">India's biggest carmaker · for want of chips</div>
      <div class="abs" data-k="chip" style="right:70px;top:120px;width:150px;height:150px;border-radius:26px;background:#25264a;border:2px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center">${ic('cpu', 86, '#ef4444', 1.6)}</div></div>`);
    const R2 = roller('46,000', 92, 700); q(card, 'n').appendChild(R2.el);
    const kids = ['n', 'l1', 'l2'].map((k) => q(card, k));
    return (t, t0, from = { x: 960, y: 515, s: 0.1 }, morph = false) => {
      show(card, t > t0); if (t <= t0) return;
      const k = morph ? 1 : settle(t, t0);
      card.style.transform = `translate(${lerp(from.x - 960, 0, k)}px,${lerp(from.y - 515, 0, k)}px) scale(${lerp(from.s, 1, k)})`;
      if (morph) kids.forEach((e, i) => { const kk = ep(t, t0 + i * 0.06, t0 + 0.35 + i * 0.06, E.outCubic); e.style.opacity = kk; e.style.translate = `0 ${(1 - kk) * 24}px`; });
      R2.set(t, t0 + 0.1, LOCK2);
      const f2 = t > LOCK2 ? Math.exp(-(t - LOCK2) * 6) : 0; q(card, 'n').style.transform = `scale(${1 + 0.05 * f2})`;
      q(card, 'pill').style.transform = `scale(${pop(t, t0 + 0.3)})`;
      const blink = t > TC - 0.2 ? 0.5 + 0.5 * Math.sin((t - TC) * 14) : 0;
      S(q(card, 'chip'), { boxShadow: `0 0 ${40 * blink}px rgba(239,68,68,${0.7 * blink})`, transform: `scale(${1 + 0.06 * bump(t, TC - 0.1, TC + 0.3)})` });
      card.style.translate = `0 ${-900 * ep(t, L(3) - 0.1, L(3) + 0.4, E.inCubic)}px`;
    };
  }

  // ---------- 1. PARTS BURST: the car's parts explode out into a ring; all collapse, one MCU is left and turns red ----------
  if (IV === 1) F.scene(0, END, 1, (root) => {
    const cam = camLayer(root);
    const C = counter(cam, 400, 130);
    const P = [['Automotive MCU · 32-bit', 'cpu', '#ef4444'], ['CAN connector, 12-pin', 'plug'], ['6-layer controller PCB', 'layers'], ['Hall current sensor', 'activity'], ['Controller wiring harness', 'flow'],
      ['LTE Cat-1 modem', 'globe'], ['7-inch automotive TFT', 'layers'], ['BMS monitor IC', 'cpu'], ['Li-ion cell module', 'box'], ['GNSS antenna', 'globe']];
    const SLOT = [[0, -330], [-640, -250], [640, -250], [-780, 10], [780, 10], [-640, 270], [640, 270], [-300, 380], [300, 380], [0, 390]];
    const ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const items = P.map(([n, i, c], k) => ({ e: chip(cam, n, i, c), x: 960 + SLOT[ORDER[k]][0], y: 515 + SLOT[ORDER[k]][1], tb: 0.7 + k * 0.07 }));
    const end = card46(root);
    // car matrix behind the 46,000 card: rows x columns of car icons fill in sync with the counter
    const COLS = 44, ROWS = 20, N = COLS * ROWS, CW = 1920 / COLS, CH = 1080 / ROWS; // 880 icons, each standing for ~52 cars
    const carSvg = (c) => `<svg viewBox="0 0 40 20" width="${CW * 0.72}" height="${CH * 0.5}"><path d="M3 14 Q3 11 6 10.5 L11 10 Q15 5.5 21 5.2 L28 5.4 Q32 6 35 10 L37 10.6 Q38.5 11.2 38.5 13 L38.5 15 L3 15 Z" fill="${c}"/><circle cx="11" cy="15.2" r="3.2" fill="${c}"/><circle cx="31" cy="15.2" r="3.2" fill="${c}"/></svg>`;
    const grid = add(root, `<div class="abs" style="left:0;top:0;width:1920px;height:1080px;z-index:1"></div>`);
    const cells = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const e = add(grid, `<div class="abs" style="left:${c * CW + CW * 0.14}px;top:${r * CH + CH * 0.25}px;width:${CW * 0.72}px;height:${CH * 0.5}px;line-height:0">${carSvg(K.LIGHT ? '#6d72d8' : '#8ea2ff')}</div>`);
      // fill order: from the centre outwards (rings), so cars spread from behind the card to the edges
      const dx = (c + 0.5 - COLS / 2) / (COLS / 2), dy = (r + 0.5 - ROWS / 2) / (ROWS / 2);
      cells.push({ e, d: Math.hypot(dx * 1.0, dy * 0.95) + 0.03 * Math.sin(r * 7.3 + c * 3.1) });
    }
    cells.sort((a, b) => a.d - b.d).forEach((c, i) => { c.i = i; });
    const tFill0 = T2 + 0.15, tFill1 = LOCK2;   // same window as the 46,000 roller
    return (t) => {
      C(t, 'away');
      cam.style.transform = `scale(${lerp(1.18, 0.96, ep(t, 0, T2, E.outCubic))})`;
      const shown = Math.floor(N * ep(t, tFill0, tFill1, E.outCubic));
      const tc = W('chips', T2);
      const red = t > tc - 0.2;                     // on "chips" the whole matrix flushes red: none of them get built
      const gOut = ep(t, L(3) - 0.15, L(3) + 0.3, E.inCubic);
      grid.style.opacity = (t > tFill0 ? 0.55 : 0) * (1 - gOut);
      cells.forEach((c) => {
        const on = c.i < shown;
        if (!on) { c.e.style.transform = 'scale(0)'; return; }
        const age = clampAge(t, tFill0 + (c.i / N) * (tFill1 - tFill0));
        c.e.style.transform = `scale(${Math.min(1, age * 6)})`;
        c.e.firstElementChild.firstElementChild.setAttribute('fill', red ? '#ef4444' : (K.LIGHT ? '#6d72d8' : '#8ea2ff'));
        c.e.style.opacity = red ? 0.35 + 0.65 * ((Math.sin((t - tc) * 10 - c.d * 6) + 1) / 2) : 1;
      });
      const col = T2 - 0.1;
      items.forEach((it, k) => {
        show(it.e, t > it.tb && t < T2 + 0.9);
        const m = spring(t, it.tb, 1.5, 0.72);
        const m2 = 0.35 + 0.65 * m; let x = lerp(960, it.x, m2) + drift(t, k, 6, 0.25), y = lerp(515, it.y, m2) + drift(t, k + 7, 6, 0.22), s = pop(t, it.tb, 2.2, 0.6);
        if (k === 0) {
          const kk = ep(t, col, col + 0.5, E.inOutCubic); x = lerp(x, 960, kk); y = lerp(y, 515, kk); s *= 1 + 0.6 * kk;
          it.e.style.borderColor = t > col ? 'rgba(239,68,68,.75)' : ''; it.e.style.boxShadow = t > col ? `0 0 ${30 + 20 * Math.sin(t * 10)}px rgba(239,68,68,.5)` : '';
        } else { const b = ep(t, col + k * 0.02, col + 0.4 + k * 0.02, E.inCubic); x = lerp(x, 960, b); y = lerp(y, 515, b); s *= 1 - b; }
        centerAt(it.e, x, y, s);
      });
      end(t, T2 + 0.5, { x: 960, y: 515, s: 0.3 });
    };
  });

  // ---------- 2. ONE-HOUR CLOCK: a clock sweeps one hour while cost boxes spring out; boxes get sucked in, the clock morphs into the card ----------
  if (IV === 2) F.scene(0, END, 1, (root) => {
    const cx = 960, cy = 470, R = 190;
    const circ = add(root, `<div class="card" style="left:${cx - R}px;top:${cy - R}px;width:${2 * R}px;height:${2 * R}px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:5">
      <svg viewBox="0 0 200 200" width="300" height="300" data-k="clk"><defs><linearGradient id="clkg" x1="0" x2="1"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#ef4444"/></linearGradient></defs>
      <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(127,127,170,.18)" stroke-width="10"/>
      ${Array.from({ length: 12 }, (_, i) => `<line x1="100" y1="26" x2="100" y2="34" stroke="rgba(127,127,170,.55)" stroke-width="3" transform="rotate(${i * 30} 100 100)"/>`).join('')}
      <circle data-k="arc" cx="100" cy="100" r="80" fill="none" stroke="url(#clkg)" stroke-width="10" stroke-linecap="round" transform="rotate(-90 100 100)" stroke-dasharray="502.65" stroke-dashoffset="502.65"/>
      <line data-k="hand" x1="100" y1="100" x2="100" y2="40" stroke="${K.LIGHT ? '#1f1b3d' : '#fff'}" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="8" fill="${K.LIGHT ? '#1f1b3d' : '#fff'}"/></svg></div>`);
    const B = [['One hour of downtime', -560, -150, 'hour'], ['in a large car plant', 560, -150, 'car'], ['Production line stopped', -560, 110, 'downtime', 'red'], ['over $600 every second', 560, 110, '$2'], ['Siemens · The True Cost of Downtime, 2024', 0, -300, 'one', 'small']];
    const boxes = B.map(([txt, dx, dy, w, kind]) => ({ e: measure(add(root, `<div class="abs" style="border:2px solid ${kind === 'red' ? 'rgba(239,68,68,.65)' : 'rgba(139,92,246,.6)'};border-radius:12px;padding:${kind === 'small' ? '10px 18px' : '16px 26px'};font-size:${kind === 'small' ? 18 : 30}px;font-weight:${kind === 'small' ? 500 : 600};background:var(--card);box-shadow:0 14px 40px rgba(60,50,140,.10);white-space:nowrap;color:${kind === 'red' ? '#ef4444' : kind === 'small' ? 'var(--ink2)' : 'var(--ink)'}">${txt}</div>`)), dx, dy, tb: W(w) - 0.1 }));
    const big = add(root, `<div class="abs" style="border:2px solid rgba(249,115,22,.6);border-radius:16px;padding:14px 34px 18px;background:var(--card);box-shadow:0 14px 40px rgba(60,50,140,.10);text-align:center"><div data-k="n" style="display:flex;justify-content:center;letter-spacing:-2px"></div><div class="mut" style="font-size:20px;margin-top:2px">lost, every hour the line stands still</div></div>`);
    const RB = roller('$2,300,000', 96, 800); q(big, 'n').appendChild(RB.el); measure(big);
    const tBig = W('costs') - 0.1;
    const end = card46(root);
    return (t) => {
      const k = ep(t, 0.06, LOCK1, E.outCubic), fl = t > LOCK1 ? Math.exp(-(t - LOCK1) * 6) : 0;
      q(circ, 'hand').setAttribute('transform', `rotate(${360 * k} 100 100)`);
      q(circ, 'arc').setAttribute('stroke-dashoffset', 502.65 * (1 - k));
      const col = T2 - 0.05, mk = ep(t, T2 + 0.15, T2 + 0.6, E.inOutCubic);
      const rr = K.lerpRect({ x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, r: R }, { x: 510, y: 300, w: 900, h: 430, r: 26 }, mk);
      S(circ, { left: `${rr.x}px`, top: `${rr.y}px`, width: `${rr.w}px`, height: `${rr.h}px`, borderRadius: `${rr.r}px`, transform: `scale(${pop(t, 0, 2.2, 0.65) * (1 + 0.04 * fl)})`, boxShadow: fl > 0.01 ? `0 0 ${60 * fl}px rgba(239,68,68,${0.6 * fl})` : '' });
      q(circ, 'clk').style.transform = `scale(${1 - ep(t, T2 + 0.05, T2 + 0.3, E.inCubic)})`;
      show(circ, t < T2 + 0.62);
      const all = [...boxes, { e: big, dx: 0, dy: 330, tb: tBig }];
      all.forEach((b, i) => {
        show(b.e, t > b.tb && t < col + 0.6);
        const m = spring(t, b.tb, 1.6, 0.72), back = ep(t, col + i * 0.03, col + 0.35 + i * 0.03, E.inCubic);
        centerAt(b.e, cx + b.dx * m * (1 - back) + drift(t, i, 5, 0.3), cy + b.dy * m * (1 - back) + drift(t, i + 4, 5, 0.27), (0.3 + 0.7 * m) * (1 - back));
      });
      RB.set(t, tBig, LOCK1);
      q(big, 'n').style.textShadow = fl > 0.01 ? `0 0 ${40 * fl}px rgba(249,115,22,${0.55 * fl})` : 'none';
      end(t, T2 + 0.58, undefined, true);
    };
  });

  // ---------- 3. EXPLODED CAR: parts fly out of an EV on leader lines; camera dives into the MCU, which becomes the card ----------
  if (IV === 3) F.scene(0, END, 1, (root) => {
    const cam = camLayer(root);
    const X0 = 510, Y0 = 290;
    const car = add(cam, `<svg class="abs" style="left:${X0}px;top:${Y0}px" width="900" height="300" viewBox="0 0 900 300">
      <path d="M60 210 Q60 172 112 162 L250 150 Q330 82 450 76 L620 79 Q700 86 760 150 L830 165 Q862 176 862 210 L862 232 L60 232 Z" fill="${K.LIGHT ? '#ffffff' : '#23244a'}" stroke="#6366f1" stroke-width="3"/>
      <path d="M288 150 Q352 100 450 96 L600 98 Q662 104 712 150 Z" fill="rgba(142,162,255,.16)" stroke="rgba(142,162,255,.5)" stroke-width="2"/><line x1="505" y1="97" x2="505" y2="150" stroke="rgba(142,162,255,.5)" stroke-width="3"/>
      ${[220, 700].map((x) => `<circle cx="${x}" cy="232" r="54" fill="${K.LIGHT ? '#eef0ff' : '#121327'}" stroke="#6366f1" stroke-width="6"/><circle cx="${x}" cy="232" r="22" fill="${K.LIGHT ? '#c7cdfb' : '#2c2d55'}"/>`).join('')}
      <rect x="836" y="180" width="22" height="14" rx="4" fill="#fbbf24"/><rect x="62" y="186" width="16" height="12" rx="3" fill="#ef4444"/></svg>`);
    const P = [['7-inch automotive TFT', 470, 112, 700, 160, 'layers'], ['LTE Cat-1 modem', 540, 80, 1080, 130, 'globe'], ['Automotive MCU · 32-bit', 560, 165, 1480, 230, 'cpu', '#ef4444'], ['Controller wiring harness', 300, 185, 300, 380, 'flow'],
      ['Hall current sensor', 780, 190, 1680, 450, 'activity'], ['BMS monitor IC', 380, 205, 330, 700, 'cpu'], ['Li-ion cell module', 460, 222, 800, 760, 'box'], ['CAN connector, 12-pin', 640, 200, 1300, 760, 'plug']];
    const svg = add(cam, `<svg class="abs" style="left:0;top:0" width="1920" height="1080">${P.map(() => `<line stroke="rgba(142,162,255,.6)" stroke-width="2" stroke-dasharray="6 6"/><circle r="0" fill="#8ea2ff"/>`).join('')}</svg>`);
    const items = P.map(([n, px, py, lx, ly, i, c], k) => ({ e: chip(cam, n, i, c), px: X0 + px, py: Y0 + py, lx, ly, tb: 0.75 + k * 0.08 }));
    const hero = items[2], lines = [...svg.querySelectorAll('line')], dots = [...svg.querySelectorAll('circle')];
    const C = counter(root, 850, 92);
    const end = card46(root);
    return (t) => {
      C(t, 'drop');
      car.style.transform = `translateY(${(1 - settle(t, 0)) * 80}px)`;
      const col = T2 - 0.1, zk = ep(t, T2, T2 + 0.7, E.inOutCubic);
      cam.style.transformOrigin = `${hero.px}px ${hero.py}px`;
      cam.style.transform = `translate(${(960 - hero.px) * zk}px,${(515 - hero.py) * zk}px) scale(${lerp(1.06, 1, ep(t, 0, T2, E.outCubic)) * lerp(1, 3.2, zk)})`;
      cam.style.opacity = 1 - ep(t, T2 + 0.45, T2 + 0.8);
      items.forEach((it, k) => {
        const isH = it === hero, m = spring(t, it.tb, 1.5, 0.74), back = isH ? 0 : ep(t, col + k * 0.03, col + 0.35 + k * 0.03, E.inCubic);
        const x = lerp(it.px, it.lx, m) + drift(t, k, 4, 0.3), y = lerp(it.py, it.ly, m) + drift(t, k + 5, 4, 0.26) + 700 * back;
        show(it.e, t > it.tb && !(isH && t > T2 + 0.6));
        centerAt(it.e, x, y, pop(t, it.tb, 2.2, 0.62));
        const d = ep(t, it.tb, it.tb + 0.4, E.outCubic) * (1 - back);
        lines[k].setAttribute('x1', it.px); lines[k].setAttribute('y1', it.py); lines[k].setAttribute('x2', lerp(it.px, x, d)); lines[k].setAttribute('y2', lerp(it.py, y, d));
        dots[k].setAttribute('cx', it.px); dots[k].setAttribute('cy', it.py); dots[k].setAttribute('r', t > it.tb ? 7 : 0);
        if (isH) { dots[k].setAttribute('fill', t > col ? '#ef4444' : '#8ea2ff'); if (t > col) dots[k].setAttribute('r', 9 + 3 * Math.sin(t * 10)); it.e.style.borderColor = t > col ? 'rgba(239,68,68,.75)' : ''; }
      });
      end(t, T2 + 0.6, { x: 960, y: 515, s: 0.05 });
    };
  });

  // ---------- 4. SUPPLY GLOBE: routes from real suppliers shoot into Pune; labels pop on arrival; on "India" every route turns red ----------
  if (IV === 4) F.scene(0, END, 1, (root) => {
    const SUP = [['shenzhen', 'Zhen Hua Electronics', 'MCU · Shenzhen', 1520, 610], ['hsinchu', 'Formosa Precision', 'MCU · Hsinchu', 1620, 500], ['osaka', 'Nippon Cell Tech', 'Li-ion cells · Osaka', 1590, 380],
      ['penang', 'Nexus Micro', 'BMS IC · Penang', 1000, 930], ['singapore', 'AeroCell Logistics', 'air freight · Singapore', 1420, 960], ['stuttgart', 'Rhein Sensorik GmbH', 'Hall sensor · Stuttgart', 420, 300]];
    const RT = SUP.map(([c], i) => ({ from: c, col: '#3b82f6', w: 3, prog: (t) => ep(t, 0.6 + i * 0.12, 1.4 + i * 0.12), color: (t) => (t > T2 + i * 0.06 ? '#ef4444' : ['#3b82f6', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#f59e0b'][i]) }));
    const gw = add(root, `<div class="abs" style="left:0;top:0;width:1920px;height:1080px"></div>`);
    const G = makeGlobe(1920, 1080, 620, [-88, -14], RT); gw.appendChild(G.svg);
    const labs = SUP.map(([, n, sub], i) => ({ e: chip(root, n, 'box', '#8ea2ff', sub), x: SUP[i][3], y: SUP[i][4], tb: 1.4 + i * 0.12 }));
    const hub = chip(root, 'Pune Plant 1', 'globe', '#a78bfa', '700 controllers due');
    const top = add(root, `<div class="card" style="left:520px;top:12px;width:880px;height:204px"></div>`);
    const C = counter(root, 30, 96);
    const end = card46(root);
    return (t) => {
      C(t);
      top.style.opacity = 1 - ep(t, T2 - 0.1, T2 + 0.3);
      const gk = ep(t, T2 + 0.15, T2 + 0.7, E.inOutCubic);
      gw.style.transform = `translateY(${200 * (1 - gk)}px)`;
      G.draw(t, { scale: lerp(620, 30, gk), rot: [-88 + 4 * ep(t, 0, T2, E.inOutSine), -14], hot: 0 });
      gw.style.display = gk >= 1 ? 'none' : '';
      labs.forEach((l, i) => {
        const fall = ep(t, T2 + i * 0.04, T2 + 0.4 + i * 0.04, E.inCubic);
        show(l.e, t > l.tb && fall < 1);
        centerAt(l.e, l.x + drift(t, i, 4, 0.3), l.y + drift(t, i + 3, 4, 0.26) + 600 * fall, pop(t, l.tb, 2.3, 0.62));
        l.e.style.borderColor = t > T2 + i * 0.06 ? 'rgba(239,68,68,.6)' : '';
      });
      const hf = ep(t, T2, T2 + 0.4, E.inCubic);
      const pp = G.proj(K.LL.pune); show(hub, t > 0.5 && hf < 1); centerAt(hub, pp[0] - 170, pp[1] + 70 + 600 * hf, pop(t, 0.5, 2.2, 0.62));
      end(t, T2 + 0.62, { x: 960, y: 540, s: 0.05 });
    };
  });

  // ---------- 5. STAT RING: six sourced industry numbers burst around the counter; they collapse and the 46,000 headline slams in ----------
  if (IV === 5) F.scene(0, END, 1, (root) => {
    const cam = camLayer(root);
    const C = counter(cam, 400, 130);
    const ST = [['3.7 yrs', 'between month-long supply-chain breaks', 'McKinsey Global Institute, 2020'], ['45%', "of a year's profit lost to shocks per decade", 'McKinsey Global Institute, 2020'], ['76%', 'of US firms hit by payments fraud in 2025', 'AFP, 2026'],
      ['+56%', 'landed cost vs. the factory quote', 'Sourcify, 2025'], ['18%', 'of AP lost profit is duplicate payments', 'apexanalytix, 2026'], ['$2.77B', 'lost to fake business emails in a year', 'FBI IC3, 2024']];
    const POS = [[-640, -270], [0, -385], [640, -270], [640, 285], [0, 395], [-640, 285]];
    const cards = ST.map(([n, l, s], i) => ({ e: measure(add(cam, `<div class="card" style="width:360px;padding:18px 22px"><div style="font-size:42px;font-weight:800;letter-spacing:-1px;color:${i % 2 ? '#fbbf24' : '#ff6b6b'}">${n}</div><div style="font-size:17px;font-weight:600;margin-top:2px">${l}</div><div class="mut" style="font-size:13px;margin-top:6px">${s}</div></div>`)), dx: POS[i][0], dy: POS[i][1], tb: 0.75 + i * 0.12 }));
    const end = card46(root);
    return (t) => {
      C(t);
      cam.style.transform = `scale(${lerp(1.16, 0.97, ep(t, 0, T2, E.outCubic))})`;
      const col = T2 - 0.1;
      cards.forEach((c, i) => {
        const m = spring(t, c.tb, 1.5, 0.72), b = ep(t, col + i * 0.03, col + 0.4 + i * 0.03, E.inCubic);
        show(c.e, t > c.tb && b < 1);
        centerAt(c.e, 960 + c.dx * m * (1 - b) + drift(t, i, 6, 0.25), 515 + c.dy * m * (1 - b) + drift(t, i + 6, 6, 0.22), pop(t, c.tb, 2.2, 0.6) * (1 - b));
      });
      end(t, T2 + 0.35, { x: 960, y: 515, s: 1.6 });
    };
  });
})();
