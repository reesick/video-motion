// DisruptionOps film, part B: lie+void → ledger guards → partial capture → budget+approval → hidden supplier → gantt → numbers → end.
(function () {
  const { h, S, show, E, ep, lerp, clamp, spring, pop, settle, springSteps, typed } = M;
  const { ic, paypal, paypalDark, logo, grow, rise, maskWords, bump, html, q, qa, money, W, makeGlobe } = K;
  const { L, add, header, scene } = F;
  const stage = document.getElementById('stage');

  // ===== N. Result numbers (full screen) =====
  scene(L(14) - 0.15, L(15) + 0.5, 40, (root) => {
    const big = add(root, `<div class="abs" style="left:0;width:1920px;top:250px;text-align:center"><div data-k="v" style="font-size:190px;font-weight:800;letter-spacing:-6px;line-height:1">$0</div><div style="font-size:38px;font-weight:600;margin-top:8px">${maskWords('protected by the Buyer Shield')}</div></div>`);
    const row = add(root, `<div class="abs" style="left:0;width:1920px;top:640px;display:flex;justify-content:center;gap:24px">${[['0', 'projects slipped', 'zero'], ['23', 'buy timers', 'zero'], ['7', 'guards', 'zero']].map(([a, b, w]) => `<div data-k="n" class="card" style="position:relative;width:300px;height:150px;padding:24px 28px"><div style="font-size:56px;font-weight:800">${a}</div><div class="mut" style="font-size:18px">${b}</div></div>`).join('')}</div>`);
    const pp = add(root, `<div class="abs" style="left:0;width:1920px;top:850px;display:flex;justify-content:center;gap:14px">${['Held', 'Captured', 'Voided', 'Refunded', 'Paid out'].map((n) => `<span data-k="e" class="pill" style="background:#fff;color:#0057c2;font-size:20px;padding:10px 20px">${n}</span>`).join('')}<span data-k="e" class="pill" style="background:#fff;padding:8px 18px">${paypal(22)}</span></div>`);
    const words = [...big.querySelectorAll('.mask > span')], ns = qa(row, 'n'), es = qa(pp, 'e');
    return (t) => {
      const t0 = L(14) - 0.15;
      grow(root, t, t0, 0.5, { x: 1350, y: 900, w: 300, h: 60, r: 30 });
      q(big, 'v').textContent = money(Math.round(25438 * ep(t, t0 + 0.2, W('protected', L(14)) + 0.4, E.outCubic)));
      words.forEach((w, i) => rise(w, t, W('protected', L(14)) - 0.1 + i * 0.05));
      ns.forEach((n, i) => S(n, { transform: `translateY(${(1 - settle(t, W('zero', L(14)) - 0.1 + i * 0.12)) * 300}px)` }));
      es.forEach((e, i) => S(e, { transform: `scale(${pop(t, W('every', L(14) + 1) - 0.1 + i * 0.09)})` }));
      const out = ep(t, L(15) - 0.1, L(15) + 0.4, E.inCubic);
      root.style.transform = `scale(${1 - 0.15 * out})`;
    };
  });

  // ===== END card =====
  scene(L(15) - 0.05, 999, 50, (root) => {
    root.style.background = K.C.end;
    const lg = add(root, `<div class="abs" style="left:885px;top:250px">${logo(150)}</div>`);
    const wm = add(root, `<div class="abs" style="left:0;width:1920px;top:430px;text-align:center;font-size:110px;font-weight:800;letter-spacing:-3px">${[...'DisruptionOps'].map((c) => `<span class="mask" style="padding:0"><span>${c}</span></span>`).join('')}</div>`);
    const tag = add(root, `<div class="abs" style="left:0;width:1920px;top:590px;text-align:center;font-size:52px;font-weight:600">${maskWords("Never pay for what didn't arrive.")}</div>`);
    const sub = add(root, `<div class="abs" style="left:0;width:1920px;top:690px;text-align:center;font-size:28px;font-weight:500;color:#d6d8f5">Money moves only on proof.</div>`);
    const foot = add(root, `<div class="abs" style="left:0;width:1920px;top:820px;text-align:center;font-size:22px;color:#c9cbe6"><b>agenticlogisticsystem.vercel.app</b><div style="margin-top:14px;display:flex;justify-content:center;gap:12px;align-items:center"><span class="pill" style="background:#fff;padding:6px 16px">${paypal(18)}</span><span class="mut" style="font-size:18px">Built on PayPal sandbox · Team kala dhua</span></div></div>`);
    const ls = [...wm.querySelectorAll('.mask > span')], tw = [...tag.querySelectorAll('.mask > span')];
    return (t) => {
      const t0 = L(15) - 0.05;
      grow(root, t, t0, 0.45, { x: 885, y: 250, w: 150, h: 150, r: 42 });
      S(lg, { transform: `scale(${pop(t, t0 + 0.05, 2, 0.6)})` });
      ls.forEach((e, i) => rise(e, t, t0 + 0.15 + i * 0.03, 0.3));
      const tn = W('never', L(15));
      tw.forEach((e, i) => rise(e, t, tn - 0.05 + i * 0.17, 0.32));
      S(sub, { transform: `translateY(${(1 - settle(t, tn + 0.9)) * 30}px)`, opacity: clamp((t - tn - 0.9) * 4) });
      S(foot, { transform: `translateY(${(1 - settle(t, tn + 1.2)) * 40}px)`, opacity: clamp((t - tn - 1.2) * 4) });
    };
  });

  // ===== cursor + seek =====
  const cur = h('div', 'cursor', K.LIGHT
    ? `<svg viewBox="0 0 30 40" width="40" height="52"><path d="M3 2 L3 31 L10 24.5 L15 35.5 L19.6 33.4 L14.8 22.6 L24.5 22.6 Z" fill="#111" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/></svg>`
    : `<svg viewBox="0 0 30 40" width="40" height="52"><path d="M3 2 L3 31 L10 24.5 L15 35.5 L19.6 33.4 L14.8 22.6 L24.5 22.6 Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg>`);
  cur.style.zIndex = 100; stage.appendChild(cur);
  // Meet scene stays violet in both themes, so it is excluded from the light remap
  F.scenes.forEach((s) => { if (s.t0 > F.L(4) - 0.5 && s.t0 < F.L(4) + 0.5) s.root.setAttribute('data-keep', ''); else K.retheme(s.root); });
  window.DURATION = +(VO.duration).toFixed(2);
  window.seek = function (t) {
    F.CUR.on = false;
    for (const s of F.scenes) { const on = t >= s.t0 && t < s.t1; show(s.root, on); if (on) s.update(t); }
    show(cur, F.CUR.on);
    if (F.CUR.on) cur.style.transform = `translate(${F.CUR.x - 4}px,${F.CUR.y - 3}px) scale(${F.CUR.s})`;
  };
  for (const s of F.scenes) { show(s.root, true); try { s.update(s.t0 + 0.01); } catch (e) { console.error(e); } }
  window.seek(0);
  window.__ready = true;
})();
