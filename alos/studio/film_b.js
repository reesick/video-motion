// DisruptionOps film, part B: lie+void → ledger guards → partial capture → budget+approval → hidden supplier → gantt → numbers → end.
(function () {
  const { h, S, show, E, ep, lerp, clamp, spring, pop, settle, springSteps, typed } = M;
  const { ic, paypal, paypalDark, logo, grow, rise, maskWords, bump, html, q, qa, money, W, makeGlobe } = K;
  const { L, add, header, scene } = F;
  const stage = document.getElementById('stage');

  // ===== N. Buyer Shield numbers (full screen): every refusal logged, every dollar through PayPal =====
  scene(L(13) - 0.15, L(14) + 0.5, 40, (root) => {
    const big = add(root, `<div class="abs" style="left:0;width:1920px;top:150px;text-align:center"><div data-k="v" style="font-size:170px;font-weight:800;letter-spacing:-6px;line-height:1">$0</div><div style="font-size:36px;font-weight:600;margin-top:8px">${maskWords('protected by the Buyer Shield')}</div><div class="mut" data-k="dc" style="font-size:22px;margin-top:10px">45 guard decisions · 31 changed what PayPal did</div></div>`);
    const GT = [['Fair price', '$3,400'], ['Budget envelope', '—'], ['Payee lock', '$1,405'], ['Duplicate shield', '$770'], ['Pay on proof', '—'], ['Late credit', '$175'], ['Quality holdback', '$215'], ['Hold expiry', '—'], ['Early-pay discount', '$15.71'], ['Chargebacks', '$120']];
    const row = add(root, `<div class="abs" style="left:0;width:1920px;top:520px;display:flex;justify-content:center;flex-wrap:wrap;gap:16px;padding:0 210px">${GT.map(([n, v]) => `<div data-k="n" class="card" style="position:relative;width:282px;height:104px;padding:18px 22px;border-radius:20px"><div class="mut" style="font-size:16px;font-weight:600;display:flex;gap:8px;align-items:center"><span data-k="ck" style="width:20px;height:20px;border-radius:50%;background:rgba(34,197,94,.18);display:inline-flex;align-items:center;justify-content:center">${ic('check', 13, '#22c55e', 3)}</span>${n}</div><div style="font-size:32px;font-weight:800;margin-top:6px">${v}</div></div>`).join('')}</div>`);
    const pp = add(root, `<div class="abs" style="left:0;width:1920px;top:800px;display:flex;justify-content:center;gap:14px">${['Held', 'Captured', 'Voided', 'Refunded', 'Paid out'].map((n) => `<span data-k="e" class="pill" style="background:#fff;color:#0057c2;font-size:20px;padding:10px 20px;border:1px solid var(--line)">${n}</span>`).join('')}<span data-k="e" class="pill" style="background:#fff;padding:8px 18px;border:1px solid var(--line)">${paypal(22)}</span></div>`);
    const tag = add(root, `<div class="abs" style="left:0;width:1920px;top:900px;display:flex;justify-content:center;gap:14px;font-size:22px;font-weight:600">${[['spark', '#ec4899', 'Gemini reads'], ['cpu', '#3b82f6', 'Solver decides'], ['lock', '#0057c2', 'PayPal moves']].map(([i, c, n]) => `<span data-k="g" class="soft" style="padding:10px 20px;display:inline-flex;gap:10px;align-items:center;background:var(--card)">${ic(i, 20, c)}${n}</span>`).join('<span data-k="g" class="mut" style="align-self:center">→</span>')}</div>`);
    const words = [...big.querySelectorAll('.mask > span')], ns = qa(row, 'n'), es = qa(pp, 'e'), gs = qa(tag, 'g');
    return (t) => {
      const t0 = L(13) - 0.15, tE = W('every', L(13)), tL = W('logged', L(13)), tD = W('dollar', L(13)), tN = W('nothing', L(13));
      grow(root, t, t0, 0.5, { x: 340, y: 180, w: 292, h: 138, r: 22 });
      q(big, 'v').textContent = money(Math.round(6100 * ep(t, t0 + 0.15, tL + 0.3, E.outCubic)));
      words.forEach((w, i) => rise(w, t, t0 + 0.25 + i * 0.05));
      q(big, 'dc').style.opacity = clamp((t - tL) * 4);
      ns.forEach((n, i) => { const a = tE + 0.05 + i * ((tL + 0.4 - tE) / 10); S(n, { transform: `translateY(${(1 - settle(t, a)) * 260}px)`, borderColor: t > a + 0.2 ? 'rgba(34,197,94,.45)' : '' }); });
      es.forEach((e, i) => S(e, { transform: `scale(${pop(t, tD - 0.1 + i * 0.09)})` }));
      gs.forEach((g, i) => S(g, { transform: `scale(${pop(t, tN - 0.1 + i * 0.08)})` }));
      const out = ep(t, L(14) - 0.1, L(14) + 0.4, E.inCubic);
      root.style.transform = `scale(${1 - 0.15 * out})`;
    };
  });

  // ===== END card =====
  scene(L(14) - 0.05, 999, 50, (root) => {
    root.style.background = K.C.end;
    const lg = add(root, `<div class="abs" style="left:885px;top:250px">${logo(150)}</div>`);
    const wm = add(root, `<div class="abs" style="left:0;width:1920px;top:430px;text-align:center;font-size:110px;font-weight:800;letter-spacing:-3px">${[...'DisruptionOps'].map((c) => `<span class="mask" style="padding:0"><span>${c}</span></span>`).join('')}</div>`);
    const tag = add(root, `<div class="abs" style="left:0;width:1920px;top:590px;text-align:center;font-size:52px;font-weight:600">${maskWords("Never pay for what didn't arrive.")}</div>`);
    const sub = add(root, `<div class="abs" style="left:0;width:1920px;top:690px;text-align:center;font-size:28px;font-weight:500;color:#d6d8f5">Money moves only on proof.</div>`);
    const foot = add(root, `<div class="abs" style="left:0;width:1920px;top:820px;text-align:center;font-size:22px;color:#c9cbe6"><b>agenticlogisticsystem.vercel.app</b><div style="margin-top:14px;display:flex;justify-content:center;gap:12px;align-items:center"><span class="pill" style="background:#fff;padding:6px 16px">${paypal(18)}</span><span class="mut" style="font-size:18px">Built on PayPal sandbox · Team kala dhua</span></div></div>`);
    const ls = [...wm.querySelectorAll('.mask > span')], tw = [...tag.querySelectorAll('.mask > span')];
    return (t) => {
      const t0 = L(14) - 0.05;
      grow(root, t, t0, 0.45, { x: 885, y: 250, w: 150, h: 150, r: 42 });
      S(lg, { transform: `scale(${pop(t, t0 + 0.05, 2, 0.6)})` });
      ls.forEach((e, i) => rise(e, t, t0 + 0.15 + i * 0.03, 0.3));
      const tn = W('never', L(14));
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
