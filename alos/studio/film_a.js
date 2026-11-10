// DisruptionOps film, part A: hook → problem → reveal → shell → Mission Control → buy timers → price check.
(function () {
  const { h, S, show, E, ep, prog, lerp, clamp, spring, pop, settle, springSteps, keys, camera, camCSS, typed, drift } = M;
  const { ic, paypal, logo, BG, grow, rise, maskWords, bump, lerpRect, place, html, q, qa, money, W, cpath, press, makeGlobe } = K;
  const stage = document.getElementById('stage');
  const F = window.F = { scenes: [], CUR: { on: false, x: 0, y: 0, s: 1 } };
  const L = (i) => VO.lines[i - 1].start, LE = (i) => VO.lines[i - 1].end;
  F.L = L; F.LE = LE;
  F.scene = function (t0, t1, z, build, opts = {}) {
    const root = h('div', 'layer', null, { zIndex: z });
    if (opts.bg !== false) root.style.background = opts.bg || BG;
    stage.appendChild(root);
    F.scenes.push({ t0, t1, root, update: build(root) });
  };
  const add = (root, s) => { const e = html(s); root.appendChild(e); return e; };
  F.add = add;
  // nav geometry (shell)
  F.NAV = [['globe', 'Mission Control'], ['folder', 'Projects', 5], ['truck', 'Shipments'], ['wallet', 'Payments'], ['bot', 'Agent Board', 4], ['shield', 'Approvals', 1], ['users', 'Suppliers'], ['flask', 'Simulation Lab'], ['search', 'Audit & Search']];
  F.navY = (i) => 124 + i * 53;
  F.navRect = (i) => ({ x: 40, y: F.navY(i), w: 260, h: 47, r: 14 });
  F.navPt = (i) => [150, F.navY(i) + 24];
  F.PAGE = { x: 340, y: 96, w: 1540, h: 964 };

  if (!+(window.INTRO || 0)) {
  // ===== A. hook: $2.3M/hour → 46,000 cars → chip =====
  F.scene(0, L(3) + 0.5, 1, (root) => {
    const lab = add(root, `<div class="abs" style="left:0;width:1920px;top:330px;text-align:center;font-size:34px;font-weight:500;color:#c9cbe6">${maskWords('One hour of downtime in a car plant')}</div>`);
    const num = add(root, `<div class="abs" style="left:0;width:1920px;top:382px;display:flex;justify-content:center;letter-spacing:-4px"></div>`);
    const R1 = K.roller('$2,300,000', 168, 700); num.appendChild(R1.el);
    F.LOCK1 = W('million') + 0.02;
    const src = add(root, `<div class="abs" style="left:0;width:1920px;top:600px;text-align:center;font-size:20px;color:#7f81a6">Siemens · The True Cost of Downtime, 2024</div>`);
    const bar = add(root, `<div class="abs" style="left:660px;top:650px;width:600px;height:6px;border-radius:3px;background:rgba(255,255,255,.08)"><i style="position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,#ef4444,#f97316)"></i></div>`);
    const card = add(root, `<div class="card" style="left:510px;top:300px;width:900px;height:430px;padding:46px 54px">
      <div class="pill p-red" data-k="pill"><i></i>Line stopped</div>
      <div style="margin-top:18px;letter-spacing:-2px;transform-origin:0 50%" data-k="n"></div>
      <div style="font-size:30px;font-weight:600;margin-top:2px">cars not built · Oct–Dec 2022</div>
      <div class="mut" style="font-size:20px;margin-top:10px">India's biggest carmaker · for want of chips</div>
      <div class="abs" data-k="chip" style="right:70px;top:120px;width:150px;height:150px;border-radius:26px;background:#25264a;border:2px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center">${ic('cpu', 86, '#ef4444', 1.6)}</div></div>`);
    const R2 = K.roller('46,000', 92, 700); q(card, 'n').appendChild(R2.el);
    F.LOCK2 = W('cars', L(2)) - 0.12;
    const words = [...lab.querySelectorAll('.mask > span')];
    return (t) => {
      const t2 = L(2);
      words.forEach((w, i) => rise(w, t, 0.02 + i * 0.05, 0.3));
      // every digit spins; all of them land together on "million"
      R1.set(t, 0.06, F.LOCK1);
      const fl = t > F.LOCK1 ? Math.exp(-(t - F.LOCK1) * 6) : 0;
      num.style.textShadow = fl > 0.01 ? `0 0 ${40 * fl}px rgba(249,115,22,${0.55 * fl})` : 'none';
      const up = ep(t, t2 - 0.15, t2 + 0.35, E.inOutCubic);
      num.style.transform = `translateY(${-250 * up}px) scale(${lerp(1, 0.42, up) * (1 + 0.035 * fl)})`;
      S(lab, { transform: `translateY(${-140 * up}px)`, opacity: 1 - up });
      S(src, { transform: `translateY(${-370 * up}px)`, opacity: 1 - up });
      bar.firstElementChild.style.width = `${100 * ep(t, 0.06, F.LOCK1, E.outCubic)}%`;
      S(bar, { transform: `scaleX(${1 - up})` });
      // card grows out of the bar line
      const k = settle(t, t2 + 0.05);
      show(card, t > t2 + 0.05);
      S(card, { transform: `scale(${lerp(0.2, 1, k)}, ${lerp(0.02, 1, k)})` });
      R2.set(t, t2 + 0.2, F.LOCK2);
      const f2 = t > F.LOCK2 ? Math.exp(-(t - F.LOCK2) * 6) : 0;
      q(card, 'n').style.transform = `scale(${1 + 0.05 * f2})`;
      S(q(card, 'pill'), { transform: `scale(${pop(t, t2 + 0.4)})` });
      const chip = q(card, 'chip'), tc = W('chips', t2);
      const blink = t > tc - 0.2 ? 0.5 + 0.5 * Math.sin((t - tc) * 14) : 0;
      S(chip, { boxShadow: `0 0 ${40 * blink}px rgba(239,68,68,${0.7 * blink})`, transform: `scale(${1 + 0.06 * bump(t, tc - 0.1, tc + 0.3)})` });
      // whole card leaves upward into the inbox at the end
      const out = ep(t, L(3) - 0.1, L(3) + 0.4, E.inCubic);
      card.style.translate = `0 ${-900 * out}px`;
      S(num, { opacity: 1 - out }); src.style.opacity = (1 - up) * (1 - out);
    };
  });

  }

  // ===== B. problem: four supplier tricks stack, crack, fall; flood =====
  F.scene(L(3) - 0.05, L(4) + 0.6, 2, (root) => {
    const C = [
      ['Shenzhen QuickBoard (broker)', 'Quote · PCB-12', '<b style="font-size:30px">$14.20</b> <span class="mut">/ unit</span>', 'p-amber', 'Overcharge', W('overcharge', L(3))],
      ['Lowcost Display Co', 'RE: PO-7742', 'Revised ETD <b style="color:#fbbf24">+9 days</b>', 'p-amber', 'Date pushed', W('push', L(3))],
      ['Zhen Hua Electronics', 'Invoice attached', '<span class="mono">ZH-INV-55120-A</span> · <b>$5,880</b>', 'p-red', 'Invoice twice', W('invoice', L(3))],
      ['Zhen Hua Electronics', 'RE: PO-7712', '"Goods dispatched 3 days ago."', 'p-red', 'Not shipped', W('say', L(3))],
    ];
    const cards = C.map(([from, subj, body, pc, pl], i) => add(root, `<div class="card" style="left:560px;top:${200 + i * 30}px;width:800px;height:220px;padding:30px 34px">
      <div style="display:flex;align-items:center;gap:14px"><span style="width:46px;height:46px;border-radius:50%;background:#2c2d55;display:flex;align-items:center;justify-content:center">${ic('mail', 22, '#9aa8ff')}</span>
      <div><b style="font-size:21px">${from}</b><div class="mut" style="font-size:16px">${subj}</div></div><span class="pill ${pc}" style="margin-left:auto"><i></i>${pl}</span></div>
      <div style="font-size:26px;margin-top:30px">${body}</div></div>`));
    const flood = add(root, `<div class="abs" style="border-radius:50%;background:radial-gradient(circle at 40% 35%,#7c5cf0,#4f46e5 60%,#3b4fd8)"></div>`);
    return (t) => {
      grow(root, t, L(3) - 0.05, 0.4, { x: 880, y: 260, w: 160, h: 160, r: 26 });
      const crack = L(4) - 0.55;
      cards.forEach((c, i) => {
        const t0 = C[i][5] - 0.12, k = spring(t, t0, 2.0, 0.72);
        const fall = ep(t, crack + i * 0.05, crack + 0.5 + i * 0.05, E.inCubic);
        S(c, { display: t > t0 ? '' : 'none', transform: `translateY(${(1 - k) * 420 + fall * 900}px) rotate(${(i % 2 ? 1 : -1) * (4 * fall + (1 - k) * 6)}deg) scale(${lerp(0.9, 1, k)})`, zIndex: i,
          top: `${170 + i * 165 - (i > 0 ? 0 : 0)}px` });
        c.style.top = `${130 + i * 205}px`;
        c.style.height = '180px';
      });
      // flood from centre on "Meet"
      const fk = ep(t, L(4) - 0.25, L(4) + 0.15, E.inOutCubic), r = 2300 * fk;
      S(flood, { left: `${960 - r}px`, top: `${540 - r}px`, width: `${2 * r}px`, height: `${2 * r}px`, zIndex: 10 });
    };
  });

  // ===== C. Meet DisruptionOps =====
  F.scene(L(4) + 0.1, L(5) + 0.35, 3, (root) => {
    root.style.background = 'radial-gradient(1200px 900px at 40% 35%,#7c5cf0,#4f46e5 55%,#3442c9)';
    const lg = add(root, `<div class="abs" style="left:0;top:0">${logo(170)}</div>`);
    const wm = add(root, `<div class="abs" style="left:0;top:0;font-size:120px;font-weight:700;letter-spacing:-3px;white-space:nowrap">${[...'DisruptionOps'].map((c) => `<span class="mask" style="padding:0"><span>${c}</span></span>`).join('')}</div>`);
    const sub = add(root, `<div class="abs" style="left:0;width:1920px;top:640px;text-align:center;font-size:40px;font-weight:500;color:#e3e6ff">${maskWords('A team of AI agents that works for the buyer.')}</div>`);
    // the eight specialists burst out of the wordmark into a ring (same motion as the intro's parts burst), then collapse back
    const ring = (F.AGR = [['Sentinel', 'activity'], ['Investigator', 'search'], ['Liaison', 'mail'], ['Sourcing', 'flow'], ['Approval', 'check'], ['Procurement', 'box'], ['Treasurer', 'wallet'], ['Verifier', 'shield']]).map(([n, i], k) => {
      const e = add(root, `<div class="abs" style="left:0;top:0;padding:12px 20px;border-radius:20px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);color:#fff;font-size:22px;font-weight:600;display:flex;gap:10px;align-items:center;white-space:nowrap;backdrop-filter:blur(6px)">${ic(i, 20, '#fff')}${n}</div>`);
      const a = (-90 + k * 45) * Math.PI / 180; return { e, x: 1005 + 790 * Math.cos(a), y: 445 + 330 * Math.sin(a), w: 0, h: 0 };
    });
    const letters = [...wm.querySelectorAll('.mask > span')], sw = [...sub.querySelectorAll('.mask > span')];
    return (t) => {
      const t0 = L(4);
      const tb = W('agents', t0) - 0.15, tcol = L(5) - 0.85;
      ring.forEach((r, k) => {
        if (!r.w) { r.w = r.e.offsetWidth; r.h = r.e.offsetHeight; }
        const m = spring(t, tb + k * 0.06, 1.6, 0.72), b = ep(t, tcol + k * 0.02, tcol + 0.35 + k * 0.02, E.inCubic);
        const x = lerp(960, r.x, (0.3 + 0.7 * m) * (1 - b)) + M.drift(t, k, 5, 0.3), y = lerp(445, r.y, (0.3 + 0.7 * m) * (1 - b)) + M.drift(t, k + 5, 5, 0.27);
        S(r.e, { display: t > tb + k * 0.06 && b < 1 ? '' : 'none', transform: `translate(${x - r.w / 2}px,${y - r.h / 2}px) scale(${pop(t, tb + k * 0.06, 2.2, 0.6) * (1 - b)})` });
      });
      const lk = pop(t, t0, 2.2, 0.62);
      const shrink = ep(t, L(5) - 0.55, L(5) + 0.25, E.inOutCubic);
      // final positions = sidebar brand
      const LX = lerp(560, 62, shrink), LY = lerp(380, 42, shrink), LS = lerp(170, 46, shrink);
      S(lg.firstElementChild, { width: `${LS}px`, height: `${LS}px` }); lg.firstElementChild.querySelector('svg').setAttribute('width', LS * 0.55); lg.firstElementChild.querySelector('svg').setAttribute('height', LS * 0.55);
      S(lg, { left: `${LX}px`, top: `${LY}px`, transform: `scale(${lk})` });
      S(wm, { left: `${lerp(770, 122, shrink)}px`, top: `${lerp(392, 44, shrink)}px`, fontSize: `${lerp(120, 21, shrink)}px`, letterSpacing: `${lerp(-3, 0, shrink)}px`, color: shrink > 0.5 ? (K.LIGHT ? '#4f46e5' : '#8ea2ff') : '#fff' });
      letters.forEach((e, i) => rise(e, t, t0 + 0.1 + i * 0.03, 0.32));
      sw.forEach((e, i) => { rise(e, t, W('team', t0) - 0.25 + i * 0.1, 0.35); e.parentElement.style.opacity = 1 - shrink; });
      // the violet field contracts into the sidebar
      if (shrink > 0) root.style.clipPath = `inset(${20 * shrink}px ${(1920 - 320) * shrink}px ${20 * shrink}px ${20 * shrink}px round ${30 * shrink}px)`;
      else root.style.clipPath = 'none';
      root.style.background = shrink > 0.85 ? K.C.side : 'radial-gradient(1200px 900px at 40% 35%,#7c5cf0,#4f46e5 55%,#3442c9)';
    };
  }, { bg: false });

})();
