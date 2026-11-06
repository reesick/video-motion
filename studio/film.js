// The film. window.seek(t) draws any moment; every style is computed from t.
(function () {
  const { h, S, show, E, ep, prog, lerp, clamp, spring, pop, settle, springSteps, keys, camera, camCSS, typed, textW } = M;
  const stage = document.getElementById('stage');
  const SCENES = [];
  const SH = {}; // shared cross-scene helpers
  const CUR = { on: false, x: 0, y: 0, s: 1 };
  const q = (r, k) => r.querySelector(`[data-k="${k}"]`);
  const html = (s) => { const d = h('div'); d.innerHTML = s.trim(); return d.firstElementChild; };
  const proj = (c, x, y) => [(x - c.x) * c.z + 960, (y - c.y) * c.z + 540];
  const projRect = (c, r) => { const [x, y] = proj(c, r.x, r.y); return { x, y, w: r.w * c.z, h: r.h * c.z, r: (r.r || 0) * c.z }; };
  const lerpRect = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), r: lerp(a.r || 0, b.r || 0, k) });
  // rect = centre x,y + w,h (screen) -> css
  const placeC = (el, r) => S(el, { left: `${r.x - r.w / 2}px`, top: `${r.y - r.h / 2}px`, width: `${r.w}px`, height: `${r.h}px`, borderRadius: `${r.r}px` });
  function posIn(el, anc) { let x = 0, y = 0; while (el && el !== anc) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x, y }; }
  const lerpColor = (a, b, k) => { const pa = a.match(/\w\w/g).map((v) => parseInt(v, 16)), pb = b.match(/\w\w/g).map((v) => parseInt(v, 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(',')})`; };
  const bump = (t, t0, t1) => Math.sin(Math.PI * clamp((t - t0) / (t1 - t0)));
  function cpath(t, pts) { // cursor path [[t,x,y],...] screen coords
    if (t <= pts[0][0]) return [pts[0][1], pts[0][2]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (t <= b[0]) { const k = E.inOutCubic(prog(t, a[0], b[0])); const arc = Math.sin(Math.PI * k) * Math.min(40, Math.hypot(b[1] - a[1], b[2] - a[2]) * 0.08); return [lerp(a[1], b[1], k) + arc * 0.4, lerp(a[2], b[2], k) - arc]; }
    }
    const l = pts[pts.length - 1]; return [l[1], l[2]];
  }
  const press = (t, clicks) => 1 - 0.16 * Math.max(0, ...clicks.map((c) => (t < c - 0.07 || t > c + 0.16 ? 0 : t < c ? (t - c + 0.07) / 0.07 : 1 - (t - c) / 0.16)));

  function scene(t0, t1, z, build) {
    const root = h('div', 'layer', null, { zIndex: z });
    stage.appendChild(root);
    SCENES.push({ t0, t1, root, update: build(root) });
  }

  // =====================================================================
  // A. Search -> results card -> carousel -> logo burst   (0 – 9.8)
  // =====================================================================
  scene(0, 9.8, 1, (root) => {
    const cam = h('div', 'cam'); root.appendChild(cam);
    const SL = { L: [-440, 22, 0.86], C: [0, 0, 1], R: [440, 22, 0.86], B: [0, 0, 0.9] };
    const mk = (inner) => { const hd = h('div', 'abs'); hd.appendChild(inner); cam.appendChild(hd); return hd; };
    const search = html(UI.searchCard(['yours', 'cucina', 'gyro'], true));
    const maps = html(UI.mapsCard()), ig = html(UI.igCard());
    S(maps, { left: '-200px', top: '-360px' }); S(ig, { left: '-200px', top: '-360px' });
    const hs = mk(search), hm = mk(maps), hi = mk(ig);
    const spill = q(search, 'spill'), stext = q(search, 'stext'), rows = q(search, 'rows'), more = q(search, 'more'), best = search.querySelector('.best');
    ['row-yours', 'row-cucina', 'row-gyro'].forEach((k, i) => S(q(search, k), { top: `${i * 118}px` }));
    const QUERY = 'Restaurants near me';
    const pillW = (s) => Math.max(110, 20 + 24 + 14 + textW(s, 20) + 24);

    // logos
    const L = (name, wide) => { const e = h('div', 'flogo' + (wide ? ' wide' : ''), UI.logo(name)); cam.appendChild(e); return e; };
    const lg = { google: L('google'), instagram: L('instagram'), tripadvisor: L('tripadvisor') };
    const RING = [['booking', -644, -423, 0], ['trustpilot', -883, -8, 1], ['facebook', -795, 338, 0], ['twitter', -356, 553, 0], ['expedia', 210, 582, 0], ['yelp', 836, 415, 1]];
    const ring = RING.map(([n, x, y, w], i) => ({ e: L(n, w), x, y, tb: 6.45 + i * 0.07 }));

    // slot transitions: [t0, from, to, wrap]
    function slotPos(t, seq) {
      let p = SL[seq[0][1]];
      for (const [t0, from, to, wrap] of seq) {
        if (t < t0) break;
        const k = E.inOutCubic(prog(t, t0, t0 + 0.75));
        const a = SL[from], b = SL[to];
        p = [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + (wrap ? 30 * Math.sin(Math.PI * k) : 0), lerp(a[2], b[2], k) - (wrap ? 0.2 * Math.sin(Math.PI * k) : 0)];
      }
      return p;
    }
    const SEQ = {
      search: [[0, 'C', 'C'], [2.95, 'C', 'L'], [4.55, 'L', 'R', 1]],
      maps: [[1.15, 'B', 'L'], [2.95, 'L', 'R', 1], [4.55, 'R', 'C']],
      ig: [[1.2, 'B', 'R'], [2.95, 'R', 'C'], [4.55, 'C', 'L']],
    };
    const camK = [[0, 2.1, 0, -333], [1.5, 1.15, 0, 0], [6.3, 1.05, 0, 14], [7.3, 0.77, 0, 20, E.outCubic], [9.8, 0.77, 0, 20]];
    // final ring positions (design px) measured from the reference at 8.0 s, screen offset / 0.77
    const RINGPOS = { google: [0, -470], instagram: [675, -350], tripadvisor: [860, 34] };
    SH.camA = (t) => camera(t, camK);

    return (t) => {
      const c = camera(t, camK);
      cam.style.transform = camCSS(c);
      const col = ep(t, 9.2, 9.6, E.inCubic); // collapse
      // --- search card growth
      const s = typed(QUERY, t, 0.02, 0.7);
      stext.textContent = s;
      const pw = pillW(s);
      const k = ep(t, 0.72, 1.45, E.inOutQuint);
      const cw = lerp(pw, 400, k), chh = lerp(54, 720, k), pad = 14 * k;
      S(search, { left: `${-cw / 2}px`, top: `${lerp(-346, -360, k)}px`, width: `${cw}px`, height: `${chh}px`, borderRadius: `${lerp(27, 28, k)}px` });
      S(spill, { left: `${pad}px`, top: `${pad}px`, width: `${cw - 2 * pad}px` });
      const ix = (cw - 400) / 2;
      S(rows, { left: `${ix + 14}px`, width: '372px', top: `${82 + (1 - k) * 50}px` });
      S(more, { left: `${ix + 14}px`, width: '372px', top: `${450 + (1 - k) * 80}px` });
      S(best, { left: `${ix + 22}px`, top: `${520 + (1 - k) * 110}px` });
      // --- carousel
      const place = (hd, seq, key) => {
        const on = t >= seq[0][0];
        show(hd, on); if (!on) return null;
        let [x, y, sc] = slotPos(t, seq);
        if (key !== 'C') { x *= 1 - col; }
        hd.style.transform = `translate(${x}px,${y}px) scale(${sc})`;
        hd.style.zIndex = Math.round(sc * 100);
        return [x, y, sc];
      };
      const ps = place(hs, SEQ.search), pm = place(hm, SEQ.maps), pi = place(hi, SEQ.ig);
      const ride = (e, p, tp, name) => {
        const on = p && t >= tp; show(e, on); if (!on) return;
        const rk = spring(t, 6.4, 1.5, 0.78); // move out to the ring with the burst
        const sc = pop(t, tp) * (1 - col) * lerp(1, 1.85, rk);
        const [rx, ry] = RINGPOS[name];
        const x = lerp(p[0], rx, rk) * (1 - col) + M.drift(t, tp, 5, 0.3), y = lerp(p[1] - 360 * p[2] - 72, ry, rk) * (1 - col) + M.drift(t, tp + 3, 6, 0.27);
        S(e, { transform: `translate(${x}px,${y}px) scale(${sc})`, zIndex: 300 });
      };
      ride(lg.google, ps, 1.5, 'google'); ride(lg.instagram, pi, 1.65, 'instagram'); ride(lg.tripadvisor, pm, 1.8, 'tripadvisor');
      ring.forEach((r) => {
        const on = t >= r.tb; show(r.e, on); if (!on) return;
        const m = spring(t, r.tb, 1.5, 0.72) * (1 - col);
        const x = r.x * m + M.drift(t, r.tb * 3, 6, 0.25), y = r.y * m + M.drift(t, r.tb * 5, 6, 0.22);
        S(r.e, { transform: `translate(${x}px,${y}px) scale(${1.85 * pop(t, r.tb, 2.2, 0.6) * (1 - col)})`, zIndex: 1 });
      });
    };
  });

  // =====================================================================
  // B. Owner + tasks -> invoice + consultant   (9.3 – 17.4)
  // =====================================================================
  scene(9.3, 17.4, 2, (root) => {
    const cam = h('div', 'cam'); root.appendChild(cam);
    const TASKS = [
      ['Optimize my social media\ncampaigns for each platform', -10, -390],
      ['Post content daily to all\nmy social media accounts', -512, -194],
      ['SEO optimize my Google\nBusiness Profile', 496, -190],
      ['Derive actionable insights from\ndata spread across platforms', -650, 10],
      ['Consistently create engaging\nSEO optimized content', 638, 10],
      ['Continuously monitor and\nanalyze competitors', -508, 212],
      ['Ensure my business information is\nconsistent across dozens of platform', 576, 214],
      ['Respond to all my online reviews\nacross multiple platforms', 6, 404],
    ];
    const order = [0, 2, 4, 6, 7, 5, 3, 1];
    const tasks = TASKS.map(([txt, x, y], i) => {
      const e = h('div', 'task', txt.replace('\n', '<br>')); cam.appendChild(e);
      return { e, x, y, ti: 9.95 + order.indexOf(i) * 0.065, w: 0, hh: 0 };
    });
    // morph box (screen space): card -> circle -> invoice
    const box = h('div', 'morph'); root.appendChild(box);
    const mapsClone = html(UI.mapsCard()); S(mapsClone, { boxShadow: 'none', transformOrigin: '0 0' }); box.appendChild(mapsClone);
    const owner = h('div', 'abs', UI.face('ownerConfused'), { left: 0, top: 0, width: '100%', height: '100%' }); box.appendChild(owner);
    const inv = html(UI.invoice()); S(inv, { boxShadow: 'none', transformOrigin: '0 0', background: 'transparent' }); box.appendChild(inv);
    const invKids = [...inv.children];
    const cons = h('div', 'circle', UI.face('consultant'), { borderRadius: '50%', boxShadow: '0 20px 50px rgba(0,0,0,.12)' }); cam.appendChild(cons);
    let invH = 0;
    requestAnimationFrame(() => {});
    const camK = [[9.3, 1.3, 0, 0], [9.75, 1.3, 0, 0], [10.95, 1.0, 0, 0], [13.0, 0.96, 0, 0, E.inOutSine], [13.6, 1.0, 40, 0], [16.8, 1.05, 40, 0, E.inOutSine]];
    const amt = [q(inv, 'amt-0'), q(inv, 'amt-1'), q(inv, 'amt-2')], bal = q(inv, 'bal');

    return (t) => {
      if (!invH) { invH = inv.offsetHeight; tasks.forEach((k) => { k.w = k.e.offsetWidth; k.hh = k.e.offsetHeight; }); }
      const c = camera(t, camK);
      cam.style.transform = camCSS(c);
      const cA = SH.camA(9.3);
      const cardR = { x: 960 + (0 - cA.x) * cA.z, y: 540 + (0 - cA.y) * cA.z, w: 400 * cA.z, h: 720 * cA.z, r: 28 * cA.z };
      const circR = projRect(c, { x: 0, y: 0, w: 428, h: 428, r: 214 });
      const invR = projRect(c, { x: -110, y: 0, w: 760, h: invH, r: 26 });
      const exitY = 1000 * ep(t, 16.8, 17.3, E.inCubic);
      let r;
      if (t < 13.15) r = lerpRect(cardR, circR, ep(t, 9.3, 9.78, E.inOutCubic));
      else r = lerpRect(circR, invR, ep(t, 13.15, 13.6, E.inOutCubic));
      r.y += exitY * c.z;
      placeC(box, r);
      // contents
      const mk = ep(t, 9.3, 9.45, E.linear);
      show(mapsClone, t < 9.46);
      S(mapsClone, { opacity: 1 - mk, left: `${r.w / 2 - 200 * cA.z}px`, top: `${r.h / 2 - 360 * cA.z}px`, transform: `scale(${cA.z})` });
      const ownIn = ep(t, 9.42, 9.85, E.outCubic), ownOut = ep(t, 12.98, 13.25, E.inCubic);
      show(owner, t > 9.42 && t < 13.25);
      S(owner, { transform: `translateY(${(1 - ownIn + ownOut) * 100}%)` });
      box.style.background = t < 13.1 ? lerpColor('ffffff', 'a9c6ca', ep(t, 9.35, 9.6)) : lerpColor('a9c6ca', 'ffffff', ep(t, 13.1, 13.4));
      box.style.boxShadow = t > 9.6 && t < 13.2 ? '0 20px 50px rgba(20,40,60,.10)' : '';
      // invoice content
      show(inv, t > 13.4);
      S(inv, { left: `${r.w / 2 - 380 * c.z}px`, top: `${r.h / 2 - (invH / 2) * c.z}px`, transform: `scale(${c.z})` });
      invKids.forEach((e, i) => { const k = ep(t, 13.42 + i * 0.05, 13.8 + i * 0.05, E.outCubic); S(e, { opacity: k, transform: `translateY(${(1 - k) * 22}px)` }); });
      const v0 = lerp(0, 2000, ep(t, 13.75, 14.7, E.outCubic)), v1 = lerp(0, 500, ep(t, 13.95, 15.0, E.outCubic)), v2 = lerp(0, 1000, ep(t, 14.15, 15.4, E.outCubic));
      amt[0].textContent = M.fmtMoney(v0); amt[1].textContent = M.fmtMoney(v1); amt[2].textContent = M.fmtMoney(v2);
      bal.textContent = M.fmtMoney(v0 + v1 + v2);
      S(bal, { display: 'inline-block', transform: `scale(${1 + 0.14 * bump(t, 15.42, 15.8)})`, transformOrigin: '100% 60%' });
      // tasks
      tasks.forEach((k, i) => {
        const on = t >= k.ti && t < 13.4; show(k.e, on); if (!on) return;
        const m = spring(t, k.ti, 1.5, 0.74) * (1 - ep(t, 12.95 + i * 0.025, 13.3 + i * 0.025, E.inCubic));
        const x = k.x * m + M.drift(t, i, 4, 0.3), y = k.y * m + M.drift(t, i + 9, 5, 0.26);
        S(k.e, { left: `${x - k.w / 2}px`, top: `${y - k.hh / 2}px`, transform: `scale(${0.25 + 0.75 * m})`, zIndex: 1 });
      });
      // consultant
      const con = t >= 14.05; show(cons, con);
      if (con) {
        const m = settle(t, 14.35);
        const d = lerp(120, 330, m) * pop(t, 14.05, 2.4, 0.6);
        const x = lerp(270, 450, m) + M.drift(t, 2, 4, 0.3), y = lerp(250, -40, m) - 1000 * ep(t, 16.8, 17.25, E.inCubic);
        S(cons, { left: `${x - d / 2}px`, top: `${y - d / 2}px`, width: `${d}px`, height: `${d}px`, zIndex: 5 });
      }
    };
  });

  // =====================================================================
  // C. "Madison" wordmark + subtitle + flood   (17.2 – 23.75)
  // =====================================================================
  scene(17.2, 23.75, 3, (root) => {
    const circ = [0, 1, 2].map(() => { const e = h('div', 'ecirc'); root.appendChild(e); return e; });
    const card = h('div', 'lcard'); root.appendChild(card);
    const wm = h('div', 'wm'); root.appendChild(wm);
    const WORD = 'Madison';
    const chars = [...WORD].map((ch, i) => {
      const e = h('span', 'ch', `<span style="color:transparent">${ch}</span><span class="b" style="color:#8b84f2">${ch}</span><span class="a">${ch}</span>`);
      wm.appendChild(e); return { e, a: e.querySelector('.a'), b: e.querySelector('.b'), dir: [0, 1, 2, 3, 0, 2, 1][i] };
    });
    const dashes = [0, 1].map(() => { const e = h('div', 'dash'); root.appendChild(e); return e; });
    const SUB = 'Your New AI-Powered Digital Marketing Specialist';
    const subWrap = h('div', 'abs', null, { overflow: 'hidden', padding: '6px 4px' }); root.appendChild(subWrap);
    const sub = h('div', 'sub', null, { position: 'relative' }); subWrap.appendChild(sub);
    const W = [['Your', 20.22], [' New', 20.38], [' AI-Powered', 20.7, 21.35], [' Digital', 21.4], [' Marketing', 21.98], [' Specialist', 22.38, 22.95]];
    const subChars = [];
    W.forEach(([w, ts, te], wi) => {
      const end = te || W[wi + 1][1];
      [...w].forEach((ch, ci) => { const e = h('span', 'c', ch); sub.appendChild(e); subChars.push({ e, t: ts + (end - ts) * 0.85 * (ci / w.length) }); });
    });
    let wmW = 0, wmH = 0, subW = 0;
    const clipFor = (dir, k) => { const p = (1 - k) * 100; return dir === 0 ? `inset(${p}% 0 0 0)` : dir === 1 ? `inset(0 ${p}% 0 0)` : dir === 2 ? `inset(0 0 ${p}% 0)` : `inset(0 0 0 ${p}%)`; };
    SH.wmState = (t) => { const y = 520 - 45 * ep(t, 19.85, 20.4); const sc = lerp(1, 0.55, ep(t, 23.0, 23.42, E.inOutCubic)); return { x: 960, y, sc, w: wmW, h: wmH }; };

    return (t) => {
      if (!wmW) { wmW = wm.offsetWidth; wmH = wm.offsetHeight; subW = sub.offsetWidth; }
      // edge circles rolling along the frame
      const R = 150;
      const cp = [
        [lerp(2150, 1800, ep(t, 17.25, 17.9, E.outCubic)) - 300 * ep(t, 17.9, 23.5, E.inOutSine), lerp(-60, 70, ep(t, 17.9, 23.5, E.inOutSine))],
        [lerp(-260, 30, ep(t, 17.3, 18.0, E.outCubic)), lerp(1060, 620, ep(t, 18.0, 23.5, E.inOutSine))],
        [lerp(2200, 1880, ep(t, 18.6, 19.4, E.outCubic)), lerp(1000, 940, ep(t, 19.4, 23.2, E.inOutSine))],
      ];
      circ.forEach((e, i) => {
        let r = R;
        if (i === 2) r = R + 2400 * ep(t, 23.22, 23.68, E.inOutCubic);
        S(e, { left: `${cp[i][0] - r}px`, top: `${cp[i][1] - r}px`, width: `${2 * r}px`, height: `${2 * r}px`, zIndex: i === 2 ? 10 : 1 });
      });
      // logo card behind the wordmark
      const st = SH.wmState(t);
      const ck = settle(t, 23.0);
      show(card, t > 23.0);
      const cw = 660 * ck, chh = 290 * ck;
      S(card, { left: `${st.x - cw / 2}px`, top: `${st.y - chh / 2}px`, width: `${cw}px`, height: `${chh}px`, borderRadius: `${30 * ck}px`, zIndex: 2 });
      // wordmark
      S(wm, { left: `${st.x - wmW / 2}px`, top: `${st.y - wmH / 2}px`, transform: `scale(${st.sc})`, zIndex: 3 });
      const spread = 70 * (1 - ep(t, 17.6, 19.0, E.inOutCubic)); // letters start spaced out and converge
      chars.forEach((c, i) => {
        c.e.style.transform = `translateX(${(i - 3) * spread}px)`;
        const ti = 17.55 + i * 0.075;
        c.b.style.clipPath = clipFor(c.dir, ep(t, ti, ti + 0.34, E.outCubic));
        c.a.style.clipPath = clipFor(c.dir, ep(t, ti + 0.12, ti + 0.5, E.outCubic));
      });
      // sweeping dash lines
      [[17.5, 760, 1010, 610], [17.7, 860, 1160, 660]].forEach(([ts, a, b, y], i) => {
        const l = lerp(a, b, ep(t, ts + 0.15, ts + 0.75, E.inOutCubic)), r = lerp(a, b, ep(t, ts, ts + 0.55, E.outCubic));
        S(dashes[i], { left: `${l}px`, top: `${y}px`, width: `${Math.max(0, r - l)}px`, zIndex: 3 });
      });
      // subtitle
      S(subWrap, { left: `${960 - subW / 2 - 4}px`, top: `${st.y + 112}px`, zIndex: 3 });
      subChars.forEach((c, i) => {
        const k = ep(t, c.t, c.t + 0.2, E.outCubic), out = ep(t, 22.95 + i * 0.004, 23.2 + i * 0.004, E.inCubic);
        c.e.style.transform = `translateY(${(1 - k + out) * 110}%)`;
      });
    };
  });

  // =====================================================================
  // D. Dashboard on purple: labels, shocked owner, integrations  (23.7 – 37.8)
  // =====================================================================
  scene(23.7, 37.8, 5, (root) => {
    root.style.background = 'var(--brand)';
    const cam = h('div', 'cam'); root.appendChild(cam);
    const win = html(UI.dashboard()); S(win, { left: '-800px', top: '-500px' }); cam.appendChild(win);
    const shell = h('div', 'morph', null, { boxShadow: '0 30px 80px rgba(10,10,40,.18)' }); root.appendChild(shell);
    const flyLogo = h('div', 'wm', 'Madison', { transformOrigin: '0 0' }); root.appendChild(flyLogo);
    const wlogo = q(win, 'wlogo'), side = q(win, 'side'), main = q(win, 'main'), topbar = win.querySelector('.top .who');
    const pgDash = q(win, 'pg-dash'), pgInt = q(win, 'pg-int'), navhi = q(win, 'navhi');
    // labels
    const LBL = [['seo', 'SEO', 24.44], ['mobile', 'Social Media', 25.9], ['chart', 'Actionable Insights', 27.8]];
    const labels = LBL.map(([i, n, ti]) => {
      const e = h('div', 'flabel', `<span class="fi">${UI.ic(i, 28, '#fff', 2)}</span><span class="lt"><span>${n}</span></span>`); cam.appendChild(e);
      return { e, fi: e.querySelector('.fi'), tx: e.querySelector('.lt span'), ti, w: 56 + 16 + textW(n, 34, 600) };
    });
    const GAP = 70;
    const layout = (n) => { const ws = labels.slice(0, n).map((l) => l.w); const tot = ws.reduce((a, b) => a + b, 0) + GAP * (n - 1); let x = -tot / 2; return ws.map((w) => { const v = x; x += w + GAP; return v; }); };
    const L1 = layout(1), L2 = layout(2), L3 = layout(3);
    // shocked owner + bubble (screen space)
    const own = h('div', 'circle', UI.face('ownerShocked'), { borderRadius: '50%', width: '290px', height: '290px', boxShadow: '0 20px 50px rgba(0,0,0,.18)' }); root.appendChild(own);
    const bub = h('div', 'bubble', 'How do they do it?'); root.appendChild(bub);
    // integration cards
    const ic = {}; UI.INT.forEach((d) => { ic[d.k] = { e: q(win, 'ic-' + d.k), b: q(win, 'cb-' + d.k), col: d.col }; });
    const CONNECT = { google: 34.35, instagram: 34.9, tripadvisor: 35.45, facebook: 36.0, twitter: 36.55 };
    const cardH = (k, t) => 86 + 60 * spring(t, CONNECT[k] + 0.04, 2.0, 0.82);
    const colTops = (t) => {
      const out = {}; let y0 = 0, y1 = 0;
      ['google', 'instagram', 'tripadvisor'].forEach((k) => { out[k] = y0; y0 += cardH(k, t) + 18; });
      ['facebook', 'twitter'].forEach((k) => { out[k] = y1; y1 += cardH(k, t) + 18; });
      return out;
    };
    let G = null, NAVY = {}, intOrigin = null;
    const camK = [[23.7, 0.8, 0, -40], [24.3, 0.8, 0, -40], [28.8, 0.845, 0, -58, E.inOutSine], [29.7, 0.92, 30, -30], [33.75, 0.95, 30, -30, E.inOutSine], [34.3, 1.5, 150, -120], [37.2, 1.56, 150, -128, E.inOutSine]];
    SH.camD = (t) => camera(t, camK);

    return (t) => {
      if (!G) {
        show(pgInt, true);
        intOrigin = posIn(q(win, 'ic-google').parentElement, win);
        UI.NAV.concat(UI.ORG).forEach(([, n]) => { const el = q(win, 'nav-' + n); NAVY[n] = posIn(el, win); });
        G = true;
      }
      const c = camera(t, camK);
      cam.style.transform = camCSS(c);
      // --- logo card -> window morph (screen space shell)
      const st = SH.wmState(23.7);
      const fromR = { x: 960, y: st.y, w: 660, h: 290, r: 30 };
      const toR = projRect(camera(24.3, camK), { x: 0, y: 0, w: 1600, h: 1000, r: 18 });
      const mk = ep(t, 23.72, 24.3, E.inOutCubic);
      const morphing = t < 24.3;
      show(shell, morphing); show(win, !morphing);
      if (morphing) placeC(shell, lerpRect(fromR, toR, mk));
      // flying wordmark: from card centre to window logo slot
      const c0 = camera(24.3, camK);
      const [lx, ly] = proj(c0, -800 + 34, -500 + 37);
      const fontTo = 30 * c0.z / 200, fontFrom = st.sc;
      const fx = lerp(960 - (st.w * fontFrom) / 2, lx, mk), fy = lerp(st.y - (st.h * fontFrom) / 2, ly - (st.h * fontTo) / 2, mk);
      show(flyLogo, morphing);
      S(flyLogo, { left: `${fx}px`, top: `${fy}px`, transform: `scale(${lerp(fontFrom, fontTo, mk)})`, zIndex: 20 });
      // window contents enter
      const ce = ep(t, 24.25, 24.75, E.outCubic);
      [side, main, topbar].forEach((e, i) => S(e, { opacity: clamp(ce * 1.4 - i * 0.15), transform: `translateY(${(1 - ce) * 18}px)` }));
      // labels
      labels.forEach((l, i) => {
        const on = t >= l.ti && t < 29.4; show(l.e, on); if (!on) return;
        const Ls = [L1, L2, L3], TT = [24.44, 25.9, 27.8];
        const steps = [[0, Ls[i][i]]]; for (let j = i + 1; j < 3; j++) steps.push([TT[j], Ls[j][i]]);
        const x = springSteps(t, steps, 1.6, 0.85);
        const out = ep(t, 28.85 + i * 0.05, 29.3 + i * 0.05, E.inCubic);
        S(l.e, { left: `${x}px`, top: `${-610 - 120 * out}px` });
        S(l.fi, { transform: `scale(${pop(t, l.ti, 2.3, 0.6)})` });
        S(l.tx, { transform: `translateY(${(1 - ep(t, l.ti + 0.08, l.ti + 0.45, E.outCubic)) * 110}%)` });
      });
      // shocked owner + bubble
      const oOn = t > 29.75 && t < 32.8; show(own, oOn); show(bub, t > 30.4 && t < 32.8);
      if (oOn) {
        const up = settle(t, 29.75), down = ep(t, 32.25, 32.7, E.inCubic);
        const rot = 5 * Math.sin((t - 29.75) * 14) * Math.exp(-(t - 29.75) * 2.2);
        S(own, { left: `${1745 - 145}px`, top: `${lerp(1300, 935, up) + 500 * down - 145}px`, transform: `rotate(${rot}deg)` });
        const b = pop(t, 30.4, 2.4, 0.62) * (1 - down);
        S(bub, { left: '1500px', top: '700px', transform: `scale(${b})`, transformOrigin: '90% 100%' });
      }
      // nav highlight + page swap
      const hiY = springSteps(t, [[0, NAVY.Dashboard.y], [33.47, NAVY.Integrations.y], [44, NAVY.Integrations.y]], 2.2, 0.8) - posIn(side, win).y;
      S(navhi, { top: `${hiY}px` });
      const dOut = ep(t, 33.5, 33.66, E.inCubic), iIn = ep(t, 33.62, 33.95, E.outCubic);
      show(pgDash, t < 33.66); show(pgInt, t >= 33.62);
      S(pgDash, { opacity: 1 - dOut, transform: `translateY(${-30 * dOut}px)` });
      S(pgInt, { opacity: iIn, transform: `translateY(${30 * (1 - iIn)}px)` });
      const tops = colTops(t);
      Object.entries(ic).forEach(([k, d]) => {
        S(d.e, { left: `${d.col * 620}px`, top: `${tops[k]}px`, height: `${cardH(k, t)}px` });
        const bs = 1 - spring(t, CONNECT[k] + 0.02, 2.6, 0.9);
        S(d.b, { transform: `scale(${Math.max(0, bs) * press(t, [CONNECT[k]])})`, opacity: bs > 0.02 ? 1 : 0 });
      });
      // window exit (slides up), purple wipes up
      const wy = -1500 * ep(t, 37.15, 37.55, E.inCubic);
      win.style.transform = `translateY(${wy}px)`;
      root.style.clipPath = `inset(0 0 ${100 * ep(t, 37.32, 37.75, E.inOutCubic)}% 0)`;
      // cursor
      if (t > 32.6 && t < 37.3) {
        const w2s = (p, yo = 0) => proj(camera(p.t, camK), -800 + p.x, -500 + p.y + yo);
        const navI = NAVY.Integrations;
        const nav = w2s({ t: 33.4, x: navI.x + 80, y: navI.y + 25 });
        const btn = (k, tc) => { const tp = colTops(tc - 0.01); return proj(camera(tc, camK), -800 + intOrigin.x + ic[k].col * 620 + 535, -500 + intOrigin.y + tp[k] + 42); };
        const pts = [[32.6, 1500, 1180], [33.38, nav[0], nav[1]]];
        Object.entries(CONNECT).forEach(([k, tc]) => { const p = btn(k, tc); pts.push([tc - 0.04, p[0], p[1]]); pts.push([tc + 0.18, p[0], p[1]]); });
        pts.push([37.0, 1650, 760]);
        const [x, y] = cpath(t, pts);
        Object.assign(CUR, { on: true, x, y, s: press(t, [33.45, ...Object.values(CONNECT)]) });
      }
    };
  });

  // =====================================================================
  // E. Google ranking -> business profile   (37.25 – 46.45)
  // =====================================================================
  scene(37.25, 46.45, 4, (root) => {
    const cam = h('div', 'cam'); root.appendChild(cam);
    const card = html(UI.searchCard(['cucina', 'gyro', 'yours'], false));
    const CH = 82 + 354 + 14 + 46 + 14;
    S(card, { left: '-200px', top: `${-CH / 2}px`, width: '400px', height: `${CH}px` }); cam.appendChild(card);
    S(q(card, 'spill'), { left: '14px', top: '14px', width: '372px' });
    S(q(card, 'rows'), { top: '82px', width: '372px', height: '354px' }); S(q(card, 'more'), { top: `${82 + 354 + 14}px` });
    const R = { cucina: q(card, 'row-cucina'), gyro: q(card, 'row-gyro'), yours: q(card, 'row-yours') };
    // profile morph box
    const pbox = h('div', 'morph'); cam.appendChild(pbox);
    const rowClone = html(UI.resultRow('yours')); S(rowClone, { position: 'absolute', left: '0', top: '0', width: '372px', borderBottom: 'none' }); pbox.appendChild(rowClone);
    const prof = html(UI.profile()); S(prof, { left: '0', top: '0', boxShadow: 'none', background: 'transparent' }); pbox.appendChild(prof);
    const pfKids = [...prof.children];
    const tiles = [0, 1, 2, 3, 4, 5].map((i) => q(prof, 'pf-' + i));
    const TL = [[0, 0, 300, 210], [310, 0, 130, 100], [450, 0, 138, 100], [310, 110, 90, 100], [405, 110, 90, 100], [500, 110, 88, 100]];
    const desc = q(prof, 'desc'), addr = q(prof, 'addr');
    const socs = ['instagram', 'facebook', 'twitter'].map((n) => q(prof, 'soc-' + n));
    const DESC = 'Three-meal comfort food is generously heaped at this standard diner.';
    const ADDR = '123 Main St, New York, NY 10016';
    let SEC = null;
    const PT = -330; // profile top (design)
    const order = (t) => {
      // slot index of 'yours': 2 -> 1 at 38.55 -> 0 at 39.35
      const a = ep(t, 38.55, 39.05), b = ep(t, 39.35, 39.85);
      return { yours: 2 - a - b, gyro: 1 + a, cucina: b };
    };
    const camK = [[37.25, 1.72, 0, 30], [40.6, 1.85, 0, 10, E.inOutSine], [41.8, 1.08, 0, PT + 330], [42.3, 1.08, 0, PT + 330], [45.0, 1.12, 0, PT + 420, E.inOutSine], [46.45, 1.12, 0, PT + 420]];
    SH.camE = (t) => camera(t, camK);
    SH.profH = (t) => SEC ? springSteps(t, [[0, SEC.tabs], [42.35, SEC.s0], [42.95, SEC.s1], [43.45, SEC.s2], [44.35, SEC.s3]], 1.4, 0.9) + 24 : 600;
    SH.profRectScreen = (t) => projRect(camera(t, camK), { x: 0, y: PT + SH.profH(t) / 2, w: 640, h: SH.profH(t), r: 6 });

    return (t) => {
      if (!SEC) {
        const b = (k) => { const e = q(prof, k); return e.offsetTop + e.offsetHeight; };
        SEC = { tabs: b('pftabs'), s0: b('pfs-0'), s1: b('pfs-1'), s2: q(prof, 'pfs-2').offsetTop + 60, s3: b('pfs-3') };
      }
      const c = camera(t, camK);
      cam.style.transform = camCSS(c);
      // card rises in, reorders
      const rise = ep(t, 37.35, 38.0, E.outCubic);
      const o = order(t);
      Object.entries(R).forEach(([k, e]) => {
        const lift = k === 'yours' ? bump(t, 38.55, 39.05) + bump(t, 39.35, 39.85) : 0;
        S(e, { top: `${o[k] * 118}px`, zIndex: k === 'yours' ? 3 : 1, transform: `scale(${1 + 0.035 * lift})`, boxShadow: lift > 0.01 ? `0 ${12 * lift}px ${30 * lift}px rgba(0,0,0,${0.12 * lift})` : 'none', borderRadius: `${10 * lift}px` });
      });
      // card shrinks onto the clicked row
      const sk = ep(t, 40.62, 40.98, E.inOutCubic);
      const rowTop = 82, rowBot = CH - (82 + 118);
      S(card, { transform: `translateY(${(1 - rise) * 700}px)`, clipPath: `inset(${rowTop * sk}px ${14 * sk}px ${rowBot * sk}px ${14 * sk}px round ${lerp(28, 12, sk)}px)` });
      show(card, t < 41.0);
      // profile box: row rect -> small card -> profile
      const on = t >= 41.0; show(pbox, on);
      if (on) {
        const rowR = { x: -186, y: -CH / 2 + 82, w: 372, h: 118 };
        const smallR = { x: -150, y: -60, w: 300, h: 110 };
        const ph = SH.profH(t);
        const profR = { x: -320, y: PT, w: 640, h: ph };
        const k1 = ep(t, 41.0, 41.22, E.inOutCubic), k2 = ep(t, 41.22, 41.8, E.inOutQuint);
        let r = k2 > 0 ? { x: lerp(smallR.x, profR.x, k2), y: lerp(smallR.y, profR.y, k2), w: lerp(smallR.w, profR.w, k2), h: lerp(smallR.h, profR.h, k2) } : { x: lerp(rowR.x, smallR.x, k1), y: lerp(rowR.y, smallR.y, k1), w: lerp(rowR.w, smallR.w, k1), h: lerp(rowR.h, smallR.h, k1) };
        const fadeAll = ep(t, 45.78, 45.95);
        S(pbox, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px`, borderRadius: `${lerp(12, 6, k1)}px`, opacity: t > 45.95 ? 0 : 1 });
        S(rowClone, { opacity: 1 - ep(t, 41.15, 41.3), transform: `translate(${(r.w - 372) / 2}px, ${(r.h - 118) / 2}px)` });
        show(prof, t > 41.3);
        S(prof, { opacity: 1 - fadeAll });
        pfKids.forEach((e, i) => { if (i > 3) return; const k = ep(t, 41.4 + i * 0.12, 41.8 + i * 0.12, E.outCubic); S(e, { transform: `translateY(${(1 - k) * 18}px)`, opacity: k }); });
        tiles.forEach((e, i) => { const [x, y, w, hh] = TL[i]; const s = pop(t, 41.55 + i * 0.06, 2.2, 0.7); S(e, { left: `${x + (w * (1 - s)) / 2}px`, top: `${y + (hh * (1 - s)) / 2}px`, width: `${w * s}px`, height: `${hh * s}px` }); });
        q(prof, 'pftab-line').style.transform = `scaleX(${ep(t, 41.95, 42.35, E.outCubic)})`;
        q(prof, 'pftab-line').style.transformOrigin = '0 0';
        [['pfs-0', 42.35], ['pfs-1', 42.95], ['pfs-2', 43.45], ['pfs-3', 44.35]].forEach(([k, ts]) => { const kk = ep(t, ts, ts + 0.4, E.outCubic); S(q(prof, k), { transform: `translateY(${(1 - kk) * 22}px)`, opacity: kk }); });
        addr.textContent = typed(ADDR, t, 43.0, 43.45);
        desc.textContent = typed(DESC, t, 43.6, 44.55);
        socs.forEach((e, i) => { S(e, { transform: `scale(${pop(t, 44.55 + i * 0.14, 2.4, 0.6)})` }); });
      }
      // cursor
      if (t > 39.8 && t < 46.0) {
        const yr = proj(camera(40.5, camK), 0, -CH / 2 + 82 + 59);
        const pts = [[39.8, 1750, 1150], [40.45, yr[0] + 40, yr[1] + 10], [40.75, yr[0] + 40, yr[1] + 10], [42.0, 1250, 520], [42.6, 760, 470], [43.4, 860, 760], [44.4, 1480, 820], [45.9, 1560, 760]];
        const [x, y] = cpath(t, pts);
        Object.assign(CUR, { on: true, x, y, s: press(t, [40.55]) });
      }
    };
  });

  // =====================================================================
  // F. Dashboard reviews on canvas: modal edit + approve   (45.95 – 57.5)
  // =====================================================================
  scene(45.95, 57.6, 6, (root) => {
    const cam = h('div', 'cam'); root.appendChild(cam);
    const win = html(UI.dashboard()); S(win, { left: '-800px', top: '-500px', boxShadow: '0 30px 80px rgba(10,10,40,.10)' }); cam.appendChild(win);
    const shell = h('div', 'morph'); root.appendChild(shell);
    const side = q(win, 'side'), main = q(win, 'main'), topbar = win.querySelector('.top');
    const pg = q(win, 'pg-dash'), lower = q(win, 'lower'), navhi = q(win, 'navhi');
    const dim = h('div', 'dim'); root.appendChild(dim);
    const mwrap = h('div', 'cam', null, { zIndex: 30 }); root.appendChild(mwrap);
    const modal = html(UI.modal()); mwrap.appendChild(modal);
    const mdin = q(modal, 'mdin'), resp = q(modal, 'resp'), caret = q(modal, 'caret'), submit = q(modal, 'submit');
    const rv = {}; UI.REVIEWS.forEach((r) => { rv[r.k] = q(win, 'rv-' + r.k); });
    let G = null;
    const R1 = 'Hi Donna! Thanks for the great review! Happy to hear you loved our generous portions! We make them nice and hearty so you leave full and happy! Looking forward to ';
    const A1 = 'serving you again soon!', A2 = 'having you back soon!', SIGN = '\n\nThe "Your Business" Team';
    const camK = [[46.0, 0.88, 0, 30], [46.45, 0.88, 0, 30], [48.7, 0.9, 0, 30, E.inOutSine], [49.5, 1.32, 150, -20], [53.55, 1.36, 150, -14, E.inOutSine], [54.35, 0.92, 0, 30], [57.6, 0.95, 0, 30, E.inOutSine]];

    return (t) => {
      if (!G) {
        G = { scroll: lower.offsetTop - 10, mh: mdin.offsetHeight, rows: {}, list: posIn(q(win, 'rvlist'), win), nav: {} };
        let y = 0; UI.REVIEWS.forEach((r) => { G.rows[r.k] = { y, h: rv[r.k].offsetHeight }; y += rv[r.k].offsetHeight + 14; });
        UI.NAV.forEach(([, n]) => { G.nav[n] = posIn(q(win, 'nav-' + n), win); });
      }
      const c = camera(t, camK);
      cam.style.transform = camCSS(c); mwrap.style.transform = camCSS(c);
      // shell morph from the profile panel
      const fromR = SH.profRectScreen(45.95);
      const fr = { x: fromR.x, y: fromR.y, w: fromR.w, h: fromR.h, r: 6 };
      const toR = projRect(camera(46.45, camK), { x: 0, y: 0, w: 1600, h: 1000, r: 18 });
      const mk = ep(t, 45.95, 46.42, E.inOutQuint);
      show(shell, t < 46.42); show(win, t >= 46.42);
      if (t < 46.42) placeC(shell, lerpRect(fr, toR, mk));
      const ce = ep(t, 46.4, 46.85, E.outCubic);
      [topbar, side, main].forEach((e, i) => S(e, { opacity: clamp(ce * 1.4 - i * 0.15), transform: `translateY(${(1 - ce) * 16}px)` }));
      // scroll to pending reviews
      const sc = G.scroll * ep(t, 46.75, 47.55, E.inOutCubic);
      pg.style.transform = `translateY(${-sc}px)`;
      // rows: donna collapses into the closing modal and leaves
      const gone = ep(t, 53.95, 54.25, E.inCubic);
      const shiftUp = (G.rows.donald.y) * spring(t, 54.1, 1.6, 0.8);
      UI.REVIEWS.forEach((r, i) => {
        const base = G.rows[r.k].y;
        if (r.k === 'donna') { S(rv.donna, { transform: `translateX(${gone * 900}px)`, background: t > 48.15 && t < 54 ? '#f7f7fb' : '#fff', opacity: t > 53.6 && t < 53.95 ? 0 : 1 }); }
        else S(rv[r.k], { transform: `translateY(${-shiftUp}px)` });
      });
      // dim + modal
      const mOpen = ep(t, 48.8, 49.3, E.outQuint), mClose = ep(t, 53.6, 53.95, E.inOutCubic);
      const dimK = ep(t, 48.8, 49.1) * (1 - ep(t, 53.6, 53.9));
      show(dim, dimK > 0); dim.style.opacity = dimK;
      const mOn = t > 48.8 && t < 53.95; show(modal, mOn);
      if (mOn) {
        const rowR = { x: -800 + G.list.x, y: -500 + G.list.y - sc + G.rows.donna.y, w: 760, h: G.rows.donna.h };
        const mR = { x: 150 - 300, y: -G.mh / 2 + 20, w: 600, h: G.mh };
        const k = t < 53.6 ? mOpen : 1 - mClose;
        S(modal, { left: `${lerp(rowR.x, mR.x, k)}px`, top: `${lerp(rowR.y, mR.y, k)}px`, width: `${lerp(rowR.w, mR.w, k)}px`, height: `${lerp(rowR.h, mR.h, k)}px`, borderRadius: `${lerp(12, 14, k)}px` });
        const ci = ep(t, 49.1, 49.4, E.outCubic) * (1 - ep(t, 53.6, 53.72));
        S(mdin, { opacity: ci, transform: `translateY(${(1 - ci) * 14}px)` });
        // response text
        let body;
        if (t < 51.2) body = typed(R1 + A1, t, 49.45, 50.5);
        else if (t < 51.62) { const n = Math.round(A1.length * ep(t, 51.22, 51.55, E.inOutSine)); body = null; resp.innerHTML = esc(R1 + A1.slice(0, A1.length - n)) + `<span class="sel">${esc(A1.slice(A1.length - n))}</span>`; }
        else body = R1 + typed(A2 + SIGN, t, 51.78, 53.05);
        if (body !== null) resp.textContent = body;
        caret.style.opacity = (t > 49.4 && (Math.floor(t * 2.4) % 2 === 0 || (t > 49.45 && t < 50.5) || (t > 51.78 && t < 53.05))) ? 1 : 0;
        submit.style.transform = `scale(${1 - 0.03 * bump(t, 53.42, 53.6)})`;
      }
      // nav highlight to Review Requests at the very end
      const hiY = springSteps(t, [[0, G.nav.Dashboard.y], [57.22, G.nav['Review Requests'].y]], 2.2, 0.8) - posIn(side, win).y;
      S(navhi, { top: `${hiY}px` });
      // cursor
      if (t > 46.3) {
        const D = (tt, x, y) => proj(camera(tt, camK), x, y);
        const rowP = (tt) => D(tt, -800 + G.list.x + 380, -500 + G.list.y - G.scroll + G.rows.donna.y + 30);
        const mR = (tt, x, y) => D(tt, 150 - 300 + x, -G.mh / 2 + 20 + y);
        const endTxt = mR(51.2, 380, 325), startSel = mR(51.55, 170, 325);
        const sub = mR(53.4, 300, G.mh - 52);
        const nav = D(57.1, -800 + G.nav['Review Requests'].x + 90, -500 + G.nav['Review Requests'].y + 25);
        const r1 = rowP(48.7);
        const pts = [[46.3, 1830, 900], [47.55, 1830, 640], [48.0, 1500, 600], [48.68, r1[0], r1[1]], [48.85, r1[0], r1[1]], [50.6, 1250, 880], [51.2, endTxt[0], endTxt[1]], [51.55, startSel[0], startSel[1]], [52.0, startSel[0] + 30, startSel[1] + 120], [53.38, sub[0], sub[1]], [53.6, sub[0], sub[1]], [54.6, 1180, 560], [55.6, 980, 430], [56.4, 900, 520], [57.12, nav[0], nav[1]]];
        const [x, y] = cpath(t, pts);
        Object.assign(CUR, { on: true, x, y, s: press(t, [48.78, 51.22, 53.48, 57.2]) });
      }
    };
  });
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // cursor layer
  const cur = h('div', null, `<svg viewBox="0 0 30 40" width="44" height="56"><path d="M3 2 L3 31 L10 24.5 L15 35.5 L19.6 33.4 L14.8 22.6 L24.5 22.6 Z" fill="#111" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/></svg>`, { position: 'absolute', left: 0, top: 0, zIndex: 100, transformOrigin: '4px 3px' });
  stage.appendChild(cur);

  window.seek = function (t) {
    CUR.on = false;
    for (const s of SCENES) {
      const on = t >= s.t0 && t < s.t1;
      show(s.root, on);
      if (on) s.update(t);
    }
    show(cur, CUR.on);
    if (CUR.on) cur.style.transform = `translate(${CUR.x - 4}px,${CUR.y - 3}px) scale(${CUR.s})`;
  };
  window.DURATION = 57.5;
  // make every scene measurable once, then draw t=0
  for (const s of SCENES) { show(s.root, true); try { s.update(s.t0 + 0.0001); } catch (e) { console.error(e); } }
  window.seek(0);
  window.__ready = true;
})();
