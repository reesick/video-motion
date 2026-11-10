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

  // ===== O. Copilot (brief beat 14): "Ask it anything." =====
  // The live Copilot needs a working Gemini key on Render (it returned 401 on 10 Nov). The answer below is written from the
  // app's own records for SUP-21 (trust ledger, guard ledger, thread INC-1001); replace it with the real reply once the key works.
  const CQ = 'Which supplier should we trust least, and why?';
  const CA = 'Zhen Hua Electronics (SUP-21). Learned reliability 41%, trust = proof only: the carrier contradicted its dispatch claim, so the Treasurer voided the hold on PO-7712. Its payee change from a look-alike domain is locked.';
  scene(L(14) - 0.15, L(15) + 0.4, 45, (root) => {
    const c = add(root, `<div class="card" style="left:410px;top:230px;width:1100px;height:620px;padding:34px 40px">
      <div class="chd"><span class="icirc">${ic('spark', 22, '#6d72d8')}</span><div><b style="font-size:26px">Copilot</b><span class="s" style="font-size:16px">Gemini ReAct agent · read-only tools · remembers…</span></div></div>
      <div data-k="sg" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:24px">${['How much has the Buyer Shield protected?', CQ, 'Is anything waiting for my approval?'].map((s) => `<span class="soft" data-k="s" style="padding:9px 18px;border-radius:999px;font-size:17px;background:var(--card)">${s}</span>`).join('')}</div>
      <div data-k="you" style="margin:34px 0 0 260px;padding:18px 22px;border-radius:18px;background:rgba(91,108,245,.10);font-size:24px;font-weight:600"></div>
      <div data-k="ans" class="soft" style="margin:18px 160px 0 0;padding:22px 24px;border-radius:18px;background:var(--card);font-size:23px;line-height:1.45;min-height:150px"><span data-k="at"></span><div data-k="tl" class="mut" style="font-size:15px;margin-top:12px">tools: supplier_memory · buyer_shield · payments</div></div>
      <div style="position:absolute;left:40px;right:40px;bottom:34px;display:flex;gap:12px"><div class="soft" data-k="in" style="flex:1;height:58px;padding:0 20px;display:flex;align-items:center;font-size:19px;color:var(--ink3);background:var(--card)">Ask about projects, money, suppliers…</div><span style="width:58px;height:58px;border-radius:14px;background:linear-gradient(135deg,#7c5cf0,#4f6cf0);display:flex;align-items:center;justify-content:center">${ic('send', 22, '#fff')}</span></div></div>`);
    const you = q(c, 'you'), ans = q(c, 'ans'), at = q(c, 'at'), tl = q(c, 'tl'), sgs = qa(c, 's');
    return (t) => {
      const t0 = L(14) - 0.15, tq = W('ask', L(14)) + 0.1, ta = tq + 0.75;
      grow(root, t, t0, 0.5, { x: 410, y: 230, w: 1100, h: 620, r: 26 });
      sgs.forEach((s, i) => S(s, { transform: `scale(${pop(t, t0 + 0.2 + i * 0.07) * (i === 1 ? 1 - 0.05 * bump(t, tq - 0.1, tq + 0.1) : 1)})`, borderColor: i === 1 && t > tq - 0.1 ? '#6d5cf0' : '' }));
      you.textContent = typed(CQ, t, tq, tq + 0.45); S(you, { opacity: t > tq ? 1 : 0 });
      S(ans, { opacity: clamp((t - ta + 0.1) * 6), transform: `translateY(${(1 - settle(t, ta - 0.1)) * 30}px)` });
      at.textContent = typed(CA, t, ta, ta + 1.1);
      tl.style.opacity = clamp((t - ta - 1.15) * 5);
      F.cursor(t, t0 + 0.2, tq + 0.4, [[t0 + 0.2, 1300, 900], [tq - 0.15, 960, 410], [tq + 0.4, 990, 440]], [tq - 0.12]);
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
