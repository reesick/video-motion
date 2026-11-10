// DisruptionOps film, UI part (v3 brief): the app shell and every product page, rebuilt from the live app
// (agenticlogisticsystem.vercel.app, captured 10 Nov 2026: screenshots + the JSON each page renders). Real names, IDs and amounts only.
(function () {
  const { h, S, show, E, ep, lerp, clamp, spring, pop, settle, springSteps, typed } = M;
  const { ic, paypal, paypalDark, grow, rise, bump, html, q, qa, money, W, cpath, press, makeGlobe } = K;
  const { L, add } = F;

  // ---------- shell geometry: the v3 nav has 12 items ----------
  F.NAV = [['globe', 'Mission Control'], ['folder', 'Projects', 5], ['truck', 'Shipments'], ['wallet', 'Payments'], ['shield', 'Buyer Shield'], ['bot', 'Agent Board', 4], ['team', 'Agent Team'], ['msg', 'Messages'], ['shield', 'Approvals', 1], ['users', 'Suppliers'], ['flask', 'Simulation Lab'], ['search', 'Audit & Search']];
  const NI = { mc: 0, prj: 1, ship: 2, pay: 3, shield: 4, team: 6, appr: 8, sup: 9 };
  F.navY = (i) => 112 + i * 40.5;
  F.navRect = (i) => ({ x: 40, y: F.navY(i), w: 260, h: 42, r: 14 });
  F.navPt = (i) => [150, F.navY(i) + 21];
  F.cursor = (t, t0, t1, pts, clicks) => { if (t < t0 || t > t1) return; const [x, y] = cpath(t, pts); Object.assign(F.CUR, { on: true, x, y, s: press(t, clicks) }); };

  const header = (title, sub) => `<div class="abs" style="left:340px;top:96px"><div class="h1">${title}</div><div class="sub">${sub}</div></div>`;
  F.header = header;
  const delta = (v, up, good, txt) => `<span style="color:${good ? '#16a34a' : '#ef4444'};font-weight:600">${up ? '↑' : '↓'} ${v}</span> ${txt}`;
  const kpi = (x, w, icn, col, l, v, d, k, top = 190) => `<div class="kpi" data-k="${k}" style="left:${x}px;top:${top}px;width:${w}px"><div class="ico" style="background:${col}22">${ic(icn, 20, col)}</div><div class="l">${l}</div><div class="v" data-k="${k}v">${v}</div><div class="d">${d}</div></div>`;
  F.kpi = kpi;
  const cardHead = (icn, title, sub, right = '') => `<div class="chd"><span class="icirc">${ic(icn, 19, '#6d72d8')}</span><div><b>${title}</b><span class="s">${sub}</span></div>${right ? `<span style="margin-left:auto" class="link">${right}</span>` : ''}</div>`;
  const pill = (cls, txt, dot = true, st = '') => `<span class="pill ${cls}" style="${st}">${dot ? '<i></i>' : ''}${txt}</span>`;
  const btn = (txt, k = '', st = '') => `<span data-k="${k}" style="display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:12px;background:linear-gradient(135deg,#7c5cf0,#4f6cf0);color:#fff;font-size:15px;font-weight:700;${st}">${txt}</span>`;
  const appear = (e, t, t0, dy = 30) => S(e, { opacity: clamp((t - t0) * 6), transform: `translateY(${(1 - settle(t, t0)) * dy}px)` });

  // project page header (Projects → PRJ-…)
  const PRJ = {
    '2041': { st: ['p-red', 'Critical'], ids: 'PROD-882 · PROD-884', title: 'SCU-700 · Smart Controller Units', who: 'Bharat EV Motors', city: 'Chennai', units: '700 units', due: 'due 11 Nov (in 6d)',
      sum: 'Zhen Hua claimed the MCUs shipped; the carrier never collected them. Agent voided the hold and re-sourced to Formosa by air.', mat: 62, rel: 22, com: 'Committed $13,445 · ₹11,29,380', dec: 1 },
  };
  const TABS = [['globe', 'Overview'], ['layers', 'Materials'], ['clock', 'Buy timers'], ['cal', 'Timeline'], ['wallet', 'Money'], ['mail', 'Emails'], ['bot', 'Agent decisions']];
  function prjHeader(id, tab) {
    const p = PRJ[id];
    return `<div class="card" data-k="ph" style="left:340px;top:96px;width:1540px;height:236px;padding:22px 30px">
      <div class="mut" style="font-size:14px;display:flex;align-items:center;gap:6px">${ic('back', 14)} Projects</div>
      <div style="display:flex;gap:10px;align-items:center;margin-top:10px">${pill(p.st[0], p.st[1])}${pill('p-blue', 'PRJ-' + id, false)}<span class="mut" style="font-size:14px">${p.ids}</span></div>
      <div style="font-size:28px;font-weight:700;margin-top:8px;letter-spacing:-.3px">${p.title}</div>
      <div class="mut" style="font-size:15px;margin-top:4px">For <b style="color:var(--ink)">${p.who}</b> (${p.city}) · ${p.units} · ${p.due} · owner A. Kulkarni</div>
      <div style="font-size:15px;margin-top:8px;width:1130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.sum}</div>
      <div class="tabs" style="position:absolute;left:24px;bottom:16px">${TABS.map(([i, n]) => `<span class="tab${n === tab ? ' on' : ''}">${ic(i, 15)}${n}${n === 'Agent decisions' ? ` <span class="n">${p.dec}</span>` : ''}</span>`).join('')}</div>
      <div class="soft" style="position:absolute;right:28px;top:28px;width:330px;padding:18px 20px;font-size:14px">
        ${[['Materials secured', p.mat], ['Money released', p.rel]].map(([n, v]) => `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><span class="mut" style="width:120px">${n}</span><div class="bar" style="flex:1"><i style="width:${v}%;background:linear-gradient(90deg,#6366f1,#ec4899)"></i></div><b>${v}%</b></div>`).join('')}
        <div class="mut">${p.com}</div></div></div>`;
  }
  F.prjHeader = prjHeader;

  // ===== SHELL (sidebar + top bar), persists across pages =====
  F.scene(L(5) + 0.25, L(13) + 0.3, 30, (root) => {
    const side = add(root, `<div class="side"><div class="brand"><div class="logo" style="position:relative;width:46px;height:46px;flex:none">${ic('flow', 25, '#fff', 2.2)}</div><div><b>DisruptionOps</b><span>Autonomous supply-chain f…</span></div></div>
      <div class="navhi" data-k="hi" style="height:42px"></div>
      ${F.NAV.map(([i, n, c], k) => `<div class="nav" data-k="nav" style="position:absolute;left:20px;width:260px;height:42px;top:${F.navY(k) - 20}px">${ic(i, 20, 'currentColor', 1.8)}<span>${n}</span>${c ? `<span class="cnt">${c}</span>` : ''}</div>`).join('')}
      <div class="mandate" style="top:620px">${ic('shield', 24, '#fff')}<b>Agent spending mandate</b><p>Holds funds automatically. Releases above $5,000 need a human code.</p><span class="sb">PayPal sandbox · live</span></div>
      ${[['plug', 'Integrations', 862], ['help', 'Help & docs', 906]].map(([i, n, y]) => `<div class="nav" style="position:absolute;left:20px;width:260px;height:42px;top:${y}px">${ic(i, 20, 'currentColor', 1.8)}<span>${n}</span></div>`).join('')}</div>`);
    const top = add(root, `<div class="top"><div class="search">${ic('search', 20, 'currentColor')}Search projects, POs, suppliers, PayPal ids…<span class="k">⌘K</span></div>
      <div style="margin-left:auto" class="chipbtn"><span style="width:9px;height:9px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e"></span>Agent live</div>
      <div class="chipbtn" style="width:54px;justify-content:center;padding:0;position:relative">${ic('bell', 20, 'currentColor')}<span class="badge3">3</span></div>
      <div class="chipbtn"><span class="ap">AP</span><div style="line-height:1.15"><div style="font-size:15px">Ayush Pathak</div><div class="mut" style="font-size:12px;font-weight:500">Supply-chain lead</div></div></div></div>`);
    const navs = qa(side, 'nav'), hi = q(side, 'hi'), topKids = [...top.children];
    const st = [[0, NI.mc], [W('when', L(5)) - 0.15, NI.shield], [L(6) - 0.15, NI.team], [W('that', L(7)) - 0.15, NI.sup], [L(8) - 0.15, NI.shield], [L(9) - 0.15, NI.pay], [L(10) - 0.15, NI.appr], [L(11) - 0.25, NI.ship], [L(12) - 0.15, NI.prj]];
    return (t) => {
      root.style.background = 'none';
      const t0 = L(5) + 0.25;
      hi.style.top = `${springSteps(t, st.map(([a, b]) => [a, F.navY(b) - 20]), 2.4, 0.8)}px`;
      navs.forEach((n, i) => { const k = ep(t, t0 + 0.05 + i * 0.025, t0 + 0.4 + i * 0.025, E.outCubic); S(n, { transform: `translateX(${(1 - k) * -30}px)`, opacity: k }); });
      topKids.forEach((e, i) => S(e, { transform: `scale(${pop(t, t0 + 0.1 + i * 0.07, 2.4, 0.7)})` }));
      const out = ep(t, L(13) - 0.25, L(13) + 0.25, E.inCubic);
      side.style.transform = `translateX(${-360 * out}px)`; top.style.transform = `translateY(${-120 * out}px)`;
    };
  }, { bg: false });

  // ===== P1. Mission Control (v3 KPIs) — "A Sentinel watches every project." =====
  F.scene(L(5) + 0.3, W('when', L(5)) + 0.45, 10, (root) => {
    add(root, `<div>${header('Mission Control', 'Pune Plant 1 · 6 customer projects · 17 purchase orders watched')}</div>`);
    add(root, `<div class="pill p-green" style="position:absolute;right:40px;top:110px;font-size:15px"><i></i>Last agent action 1m ago</div>`);
    const kp = add(root, `<div>${kpi(340, 370, 'alert', '#ef4444', 'Units at risk', '1,530', delta('18.4%', 0, 1, 'vs previous 24 h'), 'k1')}${kpi(730, 370, 'lock', '#5b8cff', 'Funds held in PayPal', '$38,450', delta('17.9%', 1, 1, 'reserved, not moved'), 'k2')}${kpi(1120, 370, 'undo', '#22c55e', 'Protected by Buyer Shield', '$6,100', delta('117.5%', 1, 1, '7 guards · blocked, voided, deducted'), 'k3')}${kpi(1510, 370, 'activity', '#a78bfa', 'Open incidents', '4', delta('25.0%', 1, 0, 'vs previous 24 h'), 'k4')}</div>`);
    const SH = [['PO-7712', 'p-red', 'Claim ≠ carrier', 'Zhen Hua Electronics · COSCO Shipping', 0], ['PO-7790', 'p-blue', 'In transit', 'Formosa Precision · China Airlines Cargo', 38], ['PO-7715', 'p-blue', 'In transit', 'Western Components Ltd · Gati Express', 71]];
    const gc = add(root, `<div class="card" style="left:340px;top:392px;width:1046px;height:644px">
      <div style="position:absolute;left:28px;right:28px;top:22px">${cardHead('globe', 'Live supply network', '8 shipments moving into Pune · 12 suppliers on 4 continents', 'Open shipments →')}</div>
      <div style="position:absolute;left:28px;top:86px;display:flex;gap:8px;z-index:2">${[['#3b82f6', 'In transit'], ['#f59e0b', 'Delayed'], ['#ef4444', 'Claim ≠ carrier'], ['#22c55e', 'To customer'], ['#ffffff', 'Shipment now']].map(([c, n]) => `<span class="tag"><i style="width:8px;height:8px;border-radius:50%;background:${c};border:1px solid rgba(0,0,0,.2);display:inline-block"></i>${n}</span>`).join('')}</div>
      <div data-k="g" style="position:absolute;left:0;top:70px"></div>
      <div style="position:absolute;left:20px;right:20px;bottom:18px;display:flex;gap:14px">${SH.map(([po, pc, pl, who, v]) => `<div class="soft" style="flex:1;padding:14px 16px"><div style="display:flex;align-items:center"><b style="font-size:16px">${po}</b><span class="pill ${pc}" style="margin-left:auto;font-size:12px;padding:3px 9px"><i></i>${pl}</span></div><div class="mut" style="font-size:13px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${who}</div><div style="display:flex;align-items:center;gap:10px;margin-top:10px"><div class="bar" style="flex:1"><i style="width:${v}%;background:linear-gradient(90deg,#6366f1,#ec4899)"></i></div><b style="font-size:13px">${v}%</b></div></div>`).join('')}</div></div>`);
    const ACT = [['bot', 'Agent', '1m ago', 'Agent Step', 'Sent parallel RFQs to 2 alternate suppliers (SUP-77, SUP-64).'], ['mail', 'Email', '1m ago', 'Message Sent', 'Wrote to Sahyadri Harness Works: URGENT RFQ - Wiring Harness']];
    const act = add(root, `<div class="card" style="left:1406px;top:392px;width:474px;height:370px;padding:22px 22px">
      ${cardHead('activity', 'Agent activity', 'Every decision, as it happens', 'Audit →')}
      ${ACT.map(([i, who, ago, tt, sub]) => `<div data-k="a" class="soft" style="margin-top:14px;padding:14px 18px"><div style="display:flex;align-items:center;gap:8px;font-size:14px">${ic(i, 16, '#6d72d8')}<b>${who}</b><span class="mut">${ago}</span></div>
        <div style="font-size:17px;font-weight:700;margin-top:6px">${tt}</div><div class="mut" style="font-size:14px;margin-top:4px;line-height:1.35">${sub}</div></div>`).join('')}</div>`);
    const MF = [['p-blue', 'Funds held', '$38.4k', 92], ['p-violet', 'Awaiting approval', '$9,855', 24], ['p-green', 'Funds released', '$10.4k', 26], ['p-amber', 'Hold voided', '$8,370', 21], ['p-amber', 'Refunded', '$1,240', 4]];
    const mf = add(root, `<div class="card" style="left:1406px;top:782px;width:474px;height:254px;padding:20px 22px">${cardHead('wallet', 'Money in flight', 'Where every PayPal dollar sits right now')}
      ${MF.map(([pc, n, v, w]) => `<div style="display:flex;align-items:center;gap:12px;margin-top:9px;font-size:14px"><span class="pill ${pc}" style="font-size:12px;padding:2px 9px;width:130px"><i></i>${n}</span><div class="bar" style="flex:1"><i data-k="mb" data-w="${w}" style="background:linear-gradient(90deg,#6366f1,#ec4899)"></i></div><b style="width:60px;text-align:right">${v}</b></div>`).join('')}</div>`);
    const G = makeGlobe(1046, 470, 230, [-88, -16]);
    q(gc, 'g').appendChild(G.svg);
    const kps = [...kp.children], acts = qa(act, 'a'), mbs = qa(mf, 'mb');
    return (t) => {
      const t0 = L(5) + 0.3;
      grow(root, t, t0, 0.5, { x: 340, y: 96, w: 300, h: 60, r: 16 });
      kps.forEach((e, i) => S(e, { transform: `translateY(${(1 - settle(t, t0 + 0.2 + i * 0.07)) * 60}px)` }));
      q(kp, 'k3v').textContent = money(Math.round(6100 * ep(t, t0 + 0.3, t0 + 1.3, E.outCubic)));
      S(gc, { transform: `translateY(${(1 - settle(t, t0 + 0.35)) * 80}px)` }); S(act, { transform: `translateX(${(1 - settle(t, t0 + 0.45)) * 120}px)` }); S(mf, { transform: `translateX(${(1 - settle(t, t0 + 0.55)) * 120}px)` });
      acts.forEach((e, i) => appear(e, t, t0 + 0.7 + i * 0.3, 40));
      mbs.forEach((b, i) => { b.style.width = `${+b.dataset.w * ep(t, t0 + 0.7 + i * 0.08, t0 + 1.5 + i * 0.08, E.outCubic)}%`; });
      G.draw(t, { scale: lerp(230, 250, ep(t, t0, t0 + 3, E.inOutSine)), rot: [-88 + 3 * ep(t, t0, t0 + 3, E.inOutSine), -16], draw: ep(t, W('watches', L(5)), W('project', L(5)) + 0.6, E.inOutCubic), hot: 0.5 + 0.5 * Math.sin(t * 6) });
      const [nx, ny] = F.navPt(NI.shield);
      F.cursor(t, t0 + 0.6, W('when', L(5)) + 0.45, [[t0 + 0.6, 1300, 1100], [W('project', L(5)) + 0.1, 1290, 280], [W('when', L(5)) - 0.4, nx, ny], [W('when', L(5)) + 0.45, nx + 40, ny + 60]], [W('when', L(5)) - 0.17]);
    };
  });

  // ===== P2. Buyer Shield · buy timers — "When a part's order-by date turns red, it hands it to the team." =====
  const SHIELD_SUB = 'Seven deterministic guards between the agents and your money. Every decision is recorded, with the PayPal action it allowed or refused.';
  F.scene(W('when', L(5)) - 0.15, L(6) + 0.5, 11, (root) => {
    add(root, `<div>${header('Buyer Shield', SHIELD_SUB)}</div>`);
    add(root, `<div class="abs" style="right:40px;top:110px">${btn(`${ic('activity', 14, '#fff')} Run guard drill`)}</div>`);
    const kp = add(root, `<div>${kpi(340, 370, 'shield', '#22c55e', 'Money protected', '$6,100', 'blocked, voided, refunded or deducted', 'a')}${kpi(730, 370, 'check', '#6d72d8', 'Guard decisions', '45', '31 changed what PayPal did', 'b')}${kpi(1120, 370, 'clock', '#ec4899', 'Buy timers red', '3', 'of 7 BOM lines', 'c')}${kpi(1510, 370, 'wallet', '#5b8cff', 'Budget envelopes', '5', 'one per project', 'd')}</div>`);
    const TR = [['Microcontroller MCU', 'TCU-500 · Telematics Units · 500 pcs', '', 'late', 'red'], ['Motor Driver IC', 'SCU-700 · Smart Controller Units · 700 pcs', '75 approved alt', 'ordered · PO-7712', 'green'],
      ['Wiring Harness', 'BMS-380 · Battery Management Systems · 760 pcs', '', 'h1', 'red'], ['TFT Display Panel', 'IC-450 · Instrument Clusters · 450 pcs', '', 'h2', 'red', 'EOL · last buy 29 Nov'],
      ['Connector Set', 'SCU-700 · Smart Controller Units · 2,100 pcs', '77 approved alt', 'ordered · PO-7725', 'green'], ['Li-ion Cell Module', 'BMS-380 · Battery Management Systems · 380 pcs', '', 'ordered · PO-7718', 'green']];
    const tb = add(root, `<div class="card" style="left:340px;top:392px;width:1046px;height:644px;padding:24px 26px">${cardHead('clock', 'Buy timers', 'order-by = need-by − lead time − transit − buffer')}
      ${TR.map(([n, s, alt, st, c, eol], i) => `<div data-k="tr" class="soft" style="margin-top:${i ? 10 : 18}px;padding:13px 18px;display:flex;align-items:center;gap:10px;font-size:16px;background:var(--card)"><div style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>${n}</b> <span class="mut">· ${s}</span></div>
        ${eol ? pill('p-amber', eol, false, 'font-size:13px') : ''}${pill('p-violet', alt || '2 approved alt', false, 'font-size:13px')}${c === 'red' ? `<span class="pill p-red mono" data-k="cd" data-m="${st}" style="font-size:13px"><i></i><span></span></span>` : pill('p-green', st, false, 'font-size:13px')}</div>`).join('')}
      <div data-k="toast" class="soft" style="position:absolute;left:26px;right:26px;bottom:24px;padding:16px 20px;background:var(--card);border-color:rgba(239,68,68,.45)"><div style="display:flex;gap:8px;align-items:center;font-size:14px">${ic('activity', 16, '#6d72d8')}<b>sentinel</b><span class="mut">buy_timer</span>${pill('p-amber', 'escalate', false, 'font-size:12px;padding:2px 9px')}<span class="mut" style="margin-left:auto">Guard ledger</span></div>
        <div style="font-size:17px;margin-top:8px">PRJ-2043: order Microcontroller MCU by 09 Nov or the project slips (-19 h left). <b>Handed to the team as INC-1002.</b></div></div></div>`);
    const BE = [['SCU-700 · Smart Controller Units', '$2,175 of $48,000', 4.5], ['BMS-380 · Battery Management Systems', '$20,598 of $60,000', 34], ['TCU-500 · Telematics Units', '$7,850 of $30,000', 26], ['IC-450 · Instrument Clusters', '$0 of $25,000', 0], ['SCU-300 · Smart Controller Units', '$0 of $12,000', 0]];
    const be = add(root, `<div class="card" style="left:1406px;top:392px;width:474px;height:644px;padding:24px 24px">${cardHead('wallet', 'Budget envelopes', 'committed (held + released) against each project’s cap')}
      ${BE.map(([n, v, w]) => `<div style="margin-top:22px;font-size:14px"><div style="display:flex"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:250px">${n}</span><span class="mut" style="margin-left:auto">${v}</span></div><div class="bar" style="margin-top:8px"><i data-k="bb" data-w="${w}" style="background:#5b6cf5"></i></div></div>`).join('')}</div>`);
    const rows = qa(tb, 'tr'), cds = qa(tb, 'cd'), toast = q(tb, 'toast'), bbs = qa(be, 'bb');
    return (t) => {
      const t0 = W('when', L(5)) - 0.15, tr = W('red', L(5)), th = W('hands', L(5));
      grow(root, t, t0, 0.45, { ...F.navRect(NI.shield) });
      [...kp.children].forEach((e, i) => S(e, { transform: `translateY(${(1 - settle(t, t0 + 0.2 + i * 0.06)) * 50}px)` }));
      rows.forEach((r, i) => appear(r, t, t0 + 0.3 + i * 0.06, 40));
      bbs.forEach((b, i) => { b.style.width = `${+b.dataset.w * ep(t, t0 + 0.4 + i * 0.06, t0 + 1.2, E.outCubic)}%`; });
      const m = Math.floor((t - t0) * 2);   // the live clocks keep ticking
      cds.forEach((c) => { const k = c.dataset.m; c.lastChild.textContent = k === 'late' ? `late by 0d 19h ${17 + m}m` : `1d 4h ${String(42 - m).padStart(2, '0')}m`; });
      const pulse = t > tr - 0.1 ? 0.5 + 0.5 * Math.sin((t - tr) * 9) : 0;
      [0, 2, 3].forEach((i) => S(rows[i], { borderColor: t > tr - 0.1 ? `rgba(239,68,68,${0.3 + 0.4 * pulse})` : '', boxShadow: i === 0 && t > tr - 0.1 ? `0 0 ${18 * pulse}px rgba(239,68,68,.35)` : '' }));
      // the escalation lands in the ledger, then flies to the Agent Team nav
      const fly = ep(t, L(6) - 0.45, L(6) - 0.05, E.inCubic);
      S(toast, { opacity: clamp((t - th + 0.1) * 6) * (1 - fly), transform: `translate(${-700 * fly}px,${(1 - settle(t, th - 0.1)) * 60 - 560 * fly}px) scale(${1 - 0.7 * fly})` });
      F.cursor(t, t0 + 0.4, L(6) + 0.4, [[t0 + 0.4, 600, 900], [tr, 900, 520], [th, 900, 530], [L(6) - 0.3, ...F.navPt(NI.team)], [L(6) + 0.4, 200, 420]], [L(6) - 0.32]);
    };
  });

  // ===== P3. Agent Team — the incident thread: Investigator → Treasurer voids; then the team remembers =====
  const AG = [['Sentinel', 'activity', -90], ['Investigator', 'search', -45], ['Liaison', 'mail', 0], ['Sourcing', 'flow', 45], ['Approval', 'check', 90], ['Procurement', 'box', 135], ['Treasurer', 'wallet', 180], ['Verifier', 'shield', -135]];
  F.AG = AG;
  const ROLES = [['Supervisor', 'Routes every turn from shared state (policy, replayable)'], ['Sentinel', 'Risk triage, buy timers, push-outs, hold expiry patrol'], ['Investigator', 'Evidence pack; Gemini reads claims vs carrier truth'], ['Liaison', 'Supplier/warehouse email, RFQs, ack chases, payee confirmations'],
    ['Sourcing', 'Deterministic solver, applies long-term supplier memory'], ['Approval', 'Human-in-the-loop via LangGraph interrupt()'], ['Procurement', 'Raises purchase orders in the ERP'], ['Treasurer', 'Only money mover: PayPal holds/captures/voids/payouts through 7 guards'], ['Verifier', 'Closes only on usable stock; writes the episode to memory'], ['Copilot', 'Gemini ReAct agent with read-only tools']];
  const COPILOT = (root, x, y, w, hh) => add(root, `<div class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${hh}px;padding:22px 22px">${cardHead('spark', 'Copilot', 'Gemini ReAct agent · read-only tools · remembers…')}
      <div data-k="sugg" style="display:flex;flex-direction:column;align-items:flex-start;gap:9px;margin-top:20px">${['How much has the Buyer Shield protected?', 'Which supplier should we trust least, and why?', 'Is anything waiting for my approval?'].map((s) => `<span class="soft" data-k="sg" style="padding:7px 14px;border-radius:999px;font-size:14px;background:var(--card)">${s}</span>`).join('')}</div>
      <div data-k="chat" style="position:absolute;left:22px;right:22px;top:110px"></div>
      <div style="position:absolute;left:22px;right:22px;bottom:22px;display:flex;gap:10px"><div class="soft" data-k="in" style="flex:1;height:46px;padding:0 16px;display:flex;align-items:center;font-size:15px;color:var(--ink3);background:var(--card)">Ask about projects, money, suppliers…</div><span style="width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,#7c5cf0,#4f6cf0);display:flex;align-items:center;justify-content:center">${ic('send', 18, '#fff')}</span></div></div>`);
  F.COPILOT = COPILOT;
  F.scene(L(6) - 0.2, W('that', L(7)) + 0.1, 12, (root) => {
    add(root, `<div>${header('Agent Team', 'LangGraph multi-agent system: a supervisor routes every turn to one of eight specialists. Each incident is a checkpointed thread.')}</div>`);
    const badges = add(root, `<div class="abs" style="right:40px;top:108px;display:flex;gap:10px"><span data-k="mem" class="pill p-gray" style="font-size:14px;background:var(--card);border:1px solid var(--line);color:var(--ink)">memory · postgres</span><span class="pill p-gray" style="font-size:14px;background:var(--card);border:1px solid var(--line);color:var(--ink)">${ic('activity', 14)} Run Sentinel patrol</span></div>`);
    const CX = 210, CY = 250, R = 140;   // inside the team card
    const team = add(root, `<div class="card" style="left:340px;top:160px;width:420px;height:876px;padding:22px 22px">${cardHead('team', 'The team', '<span data-k="last">last turn: Supervisor</span>')}
      <svg class="abs" style="left:0;top:0" width="420" height="440">${AG.map(([, , a]) => { const r = a * Math.PI / 180; return `<line data-k="ed" x1="${CX}" y1="${CY}" x2="${CX + R * Math.cos(r)}" y2="${CY + R * Math.sin(r)}" stroke="#a5a8e6" stroke-width="1.5" stroke-dasharray="4 5"/>`; }).join('')}</svg>
      ${AG.map(([n, i, a]) => { const r = a * Math.PI / 180; return `<div data-k="nd" class="abs" style="left:${CX + R * Math.cos(r) - 34}px;top:${CY + R * Math.sin(r) - 34}px;width:68px;height:68px;border-radius:50%;background:var(--card);border:1.5px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10.5px;font-weight:600;box-shadow:0 6px 18px rgba(60,50,140,.08)">${ic(i, 15, '#6d72d8')}${n}</div>`; }).join('')}
      <div data-k="sv" class="abs" style="left:${CX - 44}px;top:${CY - 44}px;width:88px;height:88px;border-radius:50%;background:rgba(139,92,246,.10);border:2.5px solid #6d5cf0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px;font-weight:700">${ic('team', 18, '#6d5cf0')}Supervisor</div>
      <div class="abs" style="left:22px;right:22px;top:440px">${ROLES.map(([n, d]) => `<div style="font-size:13px;line-height:1.35;margin-top:9px"><b>${n}</b> <span class="mut">· ${d}</span></div>`).join('')}</div></div>`);
    const TRAIL = [['s', 'sentinel: trigger \'risk\''], ['Sentinel', 'activity', 'Triage: EV Drive Controller for Bharat EV Motors needs 160 more Motor Driver IC — the line stops in 7.7 days. (severity medium, coverage 7.7 d)'],
      ['s', 'investigator: need evidence before any decision'], ['Investigator', 'search', 'Evidence pack done: <b style="color:#ef4444">1 contradicted claim(s)</b>, 6 candidate supplier(s)'], ['ev'],
      ['s', 'treasurer: 1 contradicted claim(s): money must not move on them'], ['Treasurer', 'wallet', '<b>Pay-on-proof:</b> 1 hold(s) voided/refunded on contradicted claims'], ['pp'], ['mem']];
    const th = add(root, `<div class="card" style="left:780px;top:160px;width:700px;height:876px;padding:22px 26px">${cardHead('team', 'Thread INC-1001', 'phase awaiting_goods · 7 turns · 100 checkpoints')}
      <div style="margin-top:10px">${TRAIL.map((r) => {
        if (r[0] === 's') return `<div data-k="row" style="display:flex;gap:10px;align-items:center;margin-top:9px;font-size:14px"><span style="width:12px;height:12px;border-radius:50%;border:2px solid #6d72d8;flex:none"></span>${ic('team', 14, '#6d72d8')}<b style="color:#4f6cf0">Supervisor</b><span class="mut">→ ${r[1]}</span></div>`;
        if (r[0] === 'ev') return `<div data-k="row" style="margin:10px 0 0 22px;display:flex;gap:10px"><div class="soft" style="flex:1;padding:12px 14px;background:var(--card)"><div class="mut" style="font-size:13px;display:flex;gap:6px;align-items:center">${ic('mail', 14, '#6d72d8')} Zhen Hua says · Gemini read</div><div data-k="say" style="font-size:16px;margin-top:5px"></div></div>
          <div data-k="car" class="soft" style="flex:1;padding:12px 14px;background:var(--card);border-color:rgba(239,68,68,.45)"><div class="mut" style="font-size:13px;display:flex;gap:6px;align-items:center">${ic('ship', 14, '#6d72d8')} COSCO · COSU6218840</div><div style="font-size:16px;margin-top:5px;font-weight:700;color:#ef4444">Label created — no pickup</div></div></div>`;
        if (r[0] === 'pp') return `<div data-k="row" style="margin:10px 0 0 22px;padding:14px 18px;border-radius:16px;background:#fff;border:1px solid var(--line);color:#1d2142;display:flex;align-items:center;gap:14px">${paypal(20)}<div style="font-size:13px;color:#556">PO-7712 · Zhen Hua Electronics<div class="mono">Authorization 16G37721SM9802600</div></div><span data-k="amt" style="margin-left:auto;font-size:28px;font-weight:800">$1,404.76</span><span data-k="st" class="pill" style="background:#e8f0ff;color:#0057c2">Held</span></div>`;
        if (r[0] === 'mem') return `<div data-k="row" class="soft" style="margin-top:14px;padding:14px 18px;background:rgba(139,92,246,.07);border-color:rgba(139,92,246,.35)"><div style="font-size:14px;font-weight:700;display:flex;gap:8px;align-items:center">${ic('layers', 15, '#6d5cf0')} Long-term memory used</div>
          <div style="font-size:15px;margin-top:8px">Zhen Hua Electronics Co., Ltd.: 1 contradiction(s) on record, <b data-k="po" style="color:#ef4444">trust=proof_only</b></div><div class="mut" style="font-size:15px;margin-top:4px">Excluded SUP-21 on its memory record</div></div>`;
        return `<div data-k="row" style="display:flex;gap:10px;align-items:flex-start;margin-top:10px;font-size:16.5px;line-height:1.35"><span style="width:12px;height:12px;border-radius:50%;border:2px solid #1f1b3d;flex:none;margin-top:5px"></span><b style="color:#4f6cf0;display:inline-flex;gap:5px;align-items:center;flex:none">${ic(r[1], 15, '#4f6cf0')}${r[0]}</b><span>${r[2]}</span></div>`;
      }).join('')}</div></div>`);
    const cp = COPILOT(root, 1500, 160, 380, 876);
    const nds = qa(team, 'nd'), eds = qa(team, 'ed'), rows = qa(th, 'row');
    const T6 = L(6), tI = W('investigator', T6), tR = W('reads', T6), tC = W('carrier', T6), tS = W('so', T6), tV = W('voids', T6), tM = W('remembers', L(7));
    const rt = [T6 + 0.15, T6 + 0.45, tI - 0.35, tR - 0.1, tR + 0.25, tS - 0.35, tV - 0.1, tV + 0.05, tM - 0.1];
    const act = [[T6 + 0.4, 0], [tI - 0.1, 1], [tS, 6], [tM - 0.1, 7]];   // which agent node is lit
    const say = q(th, 'say');
    return (t) => {
      const t0 = L(6) - 0.2;
      grow(root, t, t0, 0.45, { ...F.navRect(NI.team) });
      S(team, { transform: `translateY(${(1 - settle(t, t0 + 0.2)) * 80}px)` }); S(th, { transform: `translateY(${(1 - settle(t, t0 + 0.28)) * 80}px)` }); S(cp, { transform: `translateY(${(1 - settle(t, t0 + 0.36)) * 80}px)` });
      nds.forEach((n, i) => S(n, { transform: `scale(${pop(t, t0 + 0.35 + i * 0.05, 2.4, 0.6)})` }));
      S(q(team, 'sv'), { transform: `scale(${pop(t, t0 + 0.3, 2.4, 0.6)})`, boxShadow: `0 0 ${20 + 10 * Math.sin(t * 5)}px rgba(109,92,240,.35)` });
      let on = -1; act.forEach(([a, k]) => { if (t > a) on = k; });
      nds.forEach((n, i) => S(n, { borderColor: i === on ? '#6d5cf0' : '', borderWidth: i === on ? '3px' : '', boxShadow: i === on ? '0 0 26px rgba(109,92,240,.45)' : '' }));
      eds.forEach((e, i) => { e.setAttribute('stroke', i === on ? '#6d5cf0' : '#a5a8e6'); e.setAttribute('stroke-width', i === on ? 3 : 1.5); e.setAttribute('stroke-dasharray', i === on ? '0' : '4 5'); });
      q(team, 'last').textContent = `last turn: ${on >= 0 ? AG[on][0] : 'Supervisor'}`;
      rows.forEach((r, i) => appear(r, t, rt[i], 24));
      say.textContent = '"' + typed('Goods dispatched 3 days ago.', t, tR + 0.3, tR + 1.0) + '"';
      S(q(th, 'car'), { opacity: clamp((t - tC + 0.1) * 6), transform: `scale(${1 + 0.06 * bump(t, tC, tC + 0.4)})` });
      const v = t > tV + 0.15;
      S(q(th, 'amt'), { textDecoration: v ? 'line-through' : 'none', color: v ? '#9aa' : '#1d2142' });
      const st = q(th, 'st'); st.textContent = v ? 'VOIDED' : 'Held'; S(st, { background: v ? '#ffe4e4' : '#e8f0ff', color: v ? '#c81e1e' : '#0057c2', transform: `scale(${1 + 0.35 * bump(t, tV + 0.15, tV + 0.5)})` });
      S(q(badges, 'mem'), { boxShadow: t > tM - 0.1 ? `0 0 0 ${2 + 2 * bump(t, tM - 0.1, tM + 0.5)}px rgba(109,92,240,.5)` : '' });
      S(q(th, 'po'), { textShadow: t > W('that', L(7)) - 0.4 ? '0 0 12px rgba(239,68,68,.5)' : '' });
      F.cursor(t, t0 + 0.3, tR, [[t0 + 0.3, 200, 420], [tI - 0.2, 1000, 230], [tR, 1080, 300]], [tI - 0.25]);
      F.cursor(t, W('that', L(7)) - 0.7, W('that', L(7)) + 0.1, [[W('that', L(7)) - 0.7, 1100, 860], [W('that', L(7)) - 0.15, ...F.navPt(NI.sup)], [W('that', L(7)) + 0.1, 170, 520]], [W('that', L(7)) - 0.17]);
    };
  });

  // ===== P4. Suppliers — "That supplier is now proof-only." =====
  F.scene(W('that', L(7)) - 0.15, L(8) + 0.5, 13, (root) => {
    add(root, `<div>${header('Suppliers', 'Reliability is learned, not declared: every claim is checked against the carrier and the warehouse')}</div>`);
    const kp = add(root, `<div>${kpi(340, 370, 'users', '#6d72d8', 'Suppliers watched', '12', '6 countries', 'a')}${kpi(730, 370, 'activity', '#5b8cff', 'Claims checked', '176', 'against carrier + receipts', 'b')}${kpi(1120, 370, 'alert', '#ef4444', 'Claims contradicted', '16', 'each one blocked a payment', 'c')}${kpi(1510, 370, 'shield', '#22c55e', 'Trusted (≥ 85)', '7', 'preferred for re-sourcing', 'd')}</div>`);
    const SU = [['Zhen Hua Electronics', 'Shenzhen, China', 41, 'proof only', 41, 'carrier contradicted dispatch claims'], ['Budget Semicon Traders', 'Guangzhou, China', 52, 'proof only', 38, '—'], ['Lowcost Display Co', 'Dongguan, China', 58, 'proof only', 44, '—'],
      ['Deccan Rapid Supply', 'Hyderabad, India', 79, 'watch', 78, '—'], ['Sahyadri Harness Works', 'Nashik, India', 84, 'trusted', 78, 'Shares a plating house with Western connectors'], ['Western Components Ltd', 'Mumbai, India', 86, 'watch', 82, 'Shares a plating house with Sahyadri Harness Works'],
      ['AeroCell Logistics', 'Singapore, Singapore', 88, 'trusted', 78, '—'], ['Nexus Micro', 'Penang, Malaysia', 90, 'trusted', 78, '—'], ['Formosa Precision', 'Hsinchu, Taiwan', 93, 'trusted', 93, '—']];
    const mc = { 'proof only': 'p-red', watch: 'p-amber', trusted: 'p-green' };
    const bc = (r) => (r < 50 ? '#ef4444' : r < 80 ? '#f59e0b' : '#16a34a');
    const tb = add(root, `<div class="card" style="left:340px;top:392px;width:1100px;height:644px;padding:24px 26px">${cardHead('users', 'Supplier trust ledger', 'Lowest reliability first')}
      <table class="tbl" style="margin-top:14px;font-size:15px"><tr><th>Supplier</th><th>Location</th><th style="width:220px">Learned reliability</th><th>Agent memory</th><th>Health</th><th>Risk signals</th></tr>
      ${SU.map(([n, l, r, m, hh, rk], i) => `<tr data-k="r" style="height:54px"><td><b>${n}</b></td><td>${l}</td><td><div style="display:flex;align-items:center;gap:10px"><div class="bar" style="flex:1"><i data-k="rb" data-w="${r}" style="background:${bc(r)}"></i></div><b style="font-size:13px">${r}%</b></div></td>
        <td><span data-k="${i ? 'm' : 'm0'}" class="pill ${mc[m]}" style="font-size:13px"><i></i>${m}</span></td><td style="color:${hh < 50 ? '#ef4444' : 'var(--ink)'};font-weight:${hh < 50 ? 700 : 400}">${hh}</td><td style="max-width:230px;overflow:hidden;text-overflow:ellipsis">${rk}</td></tr>`).join('')}</table></div>`);
    const ch = add(root, `<div class="card" style="left:1460px;top:392px;width:420px;height:644px;padding:24px 24px">${cardHead('activity', 'Reliability by supplier', 'Drops every time a claim is contradicted')}
      ${SU.map(([n, , r]) => `<div style="display:flex;align-items:center;gap:10px;margin-top:17px;font-size:12px"><span class="mut" style="width:120px;text-align:right;line-height:1.1">${n}</span><div style="flex:1;height:16px"><i data-k="cb" data-w="${r}" style="display:block;height:16px;border-radius:3px;background:${r < 50 ? '#ef4444' : r < 80 ? '#f59e0b' : '#5b5ef0'}"></i></div></div>`).join('')}</div>`);
    const rows = qa(tb, 'r'), rbs = qa(tb, 'rb'), cbs = qa(ch, 'cb'), m0 = q(tb, 'm0');
    return (t) => {
      const t0 = W('that', L(7)) - 0.15, tP = W('proof', L(7));
      grow(root, t, t0, 0.45, { ...F.navRect(NI.sup) });
      [...kp.children].forEach((e, i) => S(e, { transform: `translateY(${(1 - settle(t, t0 + 0.15 + i * 0.05)) * 50}px)` }));
      rows.forEach((r, i) => appear(r, t, t0 + 0.2 + i * 0.04, 24));
      rbs.forEach((b, i) => { b.style.width = `${+b.dataset.w * ep(t, t0 + 0.3 + i * 0.04, t0 + 1.0 + i * 0.04, E.outCubic)}%`; });
      cbs.forEach((b, i) => { b.style.width = `${+b.dataset.w * ep(t, t0 + 0.35 + i * 0.04, t0 + 1.1 + i * 0.04, E.outCubic)}%`; });
      S(rows[0], { background: t > tP - 0.2 ? 'rgba(239,68,68,.07)' : '' });
      S(m0, { transform: `scale(${1 + 0.45 * bump(t, tP - 0.05, tP + 0.45)})`, boxShadow: t > tP - 0.05 ? `0 0 ${16 + 6 * Math.sin(t * 8)}px rgba(239,68,68,.45)` : '' });
      const [nx, ny] = F.navPt(NI.shield);
      F.cursor(t, L(8) - 0.7, L(8) + 0.3, [[L(8) - 0.7, 1200, 900], [L(8) - 0.15, nx, ny], [L(8) + 0.3, nx + 60, ny + 80]], [L(8) - 0.17]);
    };
  });

  // ===== P5. Buyer Shield · guard tiles + ledger — broker blocked, look-alike payee locked =====
  F.scene(L(8) - 0.15, L(9) + 0.5, 14, (root) => {
    add(root, `<div>${header('Buyer Shield', SHIELD_SUB)}</div>`);
    const GT = [['scale', 'Fair price', '$3,400', 'Quote vs should-cost and last price paid; broker markups blocked'], ['wallet', 'Budget envelope', '—', 'Project cap for its date window; over the line needs your code'], ['lock', 'Payee lock', '$1,405', 'Payouts only to the verified payee; changes wait 72 h + code'], ['layers', 'Duplicate shield', '$770', 'Same PO or invoice never paid twice'], ['check', 'Pay on proof', '—', 'Holds voided when the carrier contradicts the supplier'],
      ['clock', 'Late credit', '$175', 'Late-delivery penalty deducted from the capture'], ['box', 'Quality holdback', '$215', 'Pay accepted units only; retention until line acceptance'], ['clock', 'Hold expiry', '—', 'Re-authorize holds before PayPal’s 29-day expiry'], ['wallet', 'Early-pay discount', '$15.71', '2/10 net 30 taken when it beats the cost of capital'], ['undo', 'Chargebacks', '$120', 'Rework cost billed to the supplier by PayPal invoice']];
    const tiles = add(root, `<div>${GT.map(([i, n, v, d], k) => `<div class="card" data-k="gt" style="left:${340 + (k % 5) * 312}px;top:${180 + Math.floor(k / 5) * 152}px;width:292px;height:138px;padding:18px 20px;border-radius:22px"><div style="display:flex;gap:8px;align-items:center;font-size:16px;font-weight:700">${ic(i === 'scale' ? 'shield' : i, 17, '#6d72d8')}${n}</div><div style="font-size:26px;font-weight:800;margin-top:6px">${v}</div><div class="mut" style="font-size:12.5px;line-height:1.3;margin-top:4px">${d}</div></div>`).join('')}</div>`);
    const LG = [['8:20 pm', 'chargeback', 'adjust', 'PO-7725', '$120', 'treasurer', 'Billed Coastal Connectors $120.00 via PayPal invoice INV2-JPSU-F5RF-66EG-KFPB: Rework: 20 units failed incoming QC'], ['8:20 pm', 'duplicate', 'block', 'PO-7725', '$770', 'treasurer', 'PO-7725 is already paid ($770.00); invoice CC-7725-A refused as a duplicate of CC-7725.'],
      ['8:20 pm', 'late_credit', 'adjust', 'PO-7718', '$174.88', 'treasurer', '6 day(s) late at 5%/week: $174.88 deducted from the capture.'], ['8:19 pm', 'payee_lock', 'block', '—', '$1,404.76', 'liaison', 'Payee change to payments@zhenhua-hk.com requested from look-alike domain zhenhua-hk.com (supplier domain is example.com). Locked for 72 h'],
      ['8:19 pm', 'fair_price', 'block', '—', '$3,400', 'sourcing', 'Quote is 4.6x should-cost (520.00 vs 112.00 per unit): broker markup, blocked.']];
    const lg = add(root, `<div class="card" style="left:340px;top:500px;width:1540px;height:536px;padding:22px 26px">${cardHead('reports', 'Guard ledger', 'every verdict, newest first (AG Grid)')}
      <table class="tbl" style="margin-top:12px;font-size:15px;table-layout:fixed"><tr><th style="width:120px">When</th><th style="width:150px">Guard</th><th style="width:110px">Outcome</th><th style="width:100px">PO</th><th style="width:120px">Protected</th><th style="width:110px">Agent</th><th>Why</th></tr>
      ${LG.map(([w, g, o, p, a, ag, why]) => `<tr data-k="lr" style="height:58px"><td class="mut">9 Nov, ${w}</td><td class="mono">${g}</td><td><span data-k="oc" class="pill ${o === 'block' ? 'p-red' : 'p-amber'}" style="font-size:13px">${o}</span></td><td>${p}</td><td style="font-weight:700">${a}</td><td class="mut">${ag}</td><td style="overflow:hidden;text-overflow:ellipsis">${why}</td></tr>`).join('')}</table></div>`);
    const pc = add(root, `<div class="card" style="left:620px;top:812px;width:1240px;height:200px;padding:22px 26px;z-index:3;box-shadow:0 30px 80px rgba(60,50,140,.22)">
      <div class="mut" style="font-size:13px;font-weight:700;letter-spacing:.4px">APPROVALS · 2 DECISIONS WAITING ON YOU (LIVE)</div>
      <div style="display:flex;align-items:center;gap:14px;margin-top:14px">${pill('p-red', 'payee change')}<div style="font-size:18px"><b>Zhen Hua Electronics:</b> dops-sup21-dada@business.example.com → <b>payments@zhenhua-hk.com</b><div class="mut" style="font-size:14px;margin-top:3px">asked by accounts@zhenhua-hk.com · cooling-off ends in 2d</div></div>
        <span style="margin-left:auto;position:relative">${btn('Approve change ↗', 'ab', 'opacity:.42')}<span data-k="lk" class="abs" style="right:-14px;top:-16px;width:34px;height:34px;border-radius:50%;background:#ef4444;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(239,68,68,.4)">${ic('lock', 17, '#fff')}</span></span><b style="font-size:15px">Reject</b></div></div>`);
    const gts = qa(tiles, 'gt'), lrs = qa(lg, 'lr'), ocs = qa(lg, 'oc');
    return (t) => {
      const t0 = L(8) - 0.15, tBr = W('broker', L(8)), tB = W('blocked', L(8)), tLA = W('lookalike', L(8)), tLk = W('locked', L(8));
      grow(root, t, t0, 0.45, { ...F.navRect(NI.shield) });
      gts.forEach((g, i) => S(g, { transform: `translateY(${(1 - settle(t, t0 + 0.15 + i * 0.035)) * 50}px)` }));
      lrs.forEach((r, i) => appear(r, t, t0 + 0.35 + i * 0.05, 20));
      const hl = (i, a) => S(lrs[i], { background: t > a ? `rgba(239,68,68,${0.06 + 0.08 * bump(t, a, a + 0.6)})` : '' });
      hl(4, tBr - 0.1); hl(3, tLA - 0.1);
      const glow = (g, a) => S(gts[g], { borderColor: t > a ? 'rgba(239,68,68,.6)' : '', boxShadow: t > a ? `0 0 ${24 + 10 * Math.sin(t * 7)}px rgba(239,68,68,.25)` : '' });
      glow(0, tBr - 0.1); glow(2, tLA - 0.1);
      S(ocs[4], { transform: `scale(${1 + 0.5 * bump(t, tB - 0.05, tB + 0.4)})` }); S(ocs[3], { transform: `scale(${1 + 0.5 * bump(t, tLk - 0.05, tLk + 0.4)})` });
      S(pc, { transform: `translateY(${(1 - settle(t, W('payout', L(8)) - 0.2)) * 420}px)` });
      S(q(pc, 'lk'), { transform: `scale(${pop(t, tLk - 0.05, 2.6, 0.55)})` });
    };
  });

  // ===== P6. Payments · PO-7718 pays on proof, minus the late credit =====
  F.scene(L(9) - 0.15, L(10) + 0.5, 15, (root) => {
    add(root, `<div>${header('Payments', 'Every dollar the agent has held, released, voided or refunded through PayPal — and why')}</div>`);
    const c = add(root, `<div class="card" style="left:340px;top:190px;width:1540px;height:846px;padding:32px 40px">
      <div style="display:flex;align-items:center;gap:14px">${paypal(26)}<b style="font-size:24px">PO-7718 · AeroCell Logistics</b>${pill('p-violet', 'Retention held')}<span class="mut" style="margin-left:auto;font-size:15px">Authorization 3PC49681TC323704T · held $4,295</span></div>
      <div class="mut" style="margin-top:26px;font-size:13px;letter-spacing:.5px">THREE-WAY MATCH</div>
      <div style="display:flex;gap:16px;margin-top:12px">${['Purchase order', 'Invoice', 'Goods receipt + QC · 380/400 passed'].map((n) => `<div data-k="m" class="soft" style="flex:1;padding:18px 22px;display:flex;align-items:center;gap:14px;font-size:19px;font-weight:600;background:var(--card)"><span data-k="mc" style="width:38px;height:38px;border-radius:50%;background:rgba(34,197,94,.18);display:flex;align-items:center;justify-content:center;flex:none">${ic('check', 21, '#22c55e', 2.6)}</span>${n}</div>`).join('')}</div>
      ${[['box', 'Quality holdback', 'Only 380/400 passed QC: pay accepted units only', '−$214.76'], ['clock', 'Late-delivery credit', '6 days late × 5% / week', '−$174.88'], ['lock', 'Retention held', '10% until line acceptance', '$408.05']].map(([i, n, s, v], k) => `<div data-k="adj" style="margin-top:${k ? 10 : 20}px;padding:15px 24px;border-radius:18px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.3);display:flex;align-items:center;gap:16px;font-size:19px">${ic(i, 22, '#d97706')}<b>${n}</b><span class="mut">${s}</span><b style="margin-left:auto;color:#d97706;font-size:26px">${v}</b></div>`).join('')}
      <div style="margin-top:22px;display:flex;align-items:baseline;gap:18px"><span class="mut" style="font-size:18px">Captured</span><span data-k="cap" style="font-size:66px;font-weight:800;letter-spacing:-2px">$0</span><span class="mut" style="font-size:22px">of $4,295 held</span><span class="mono mut" style="margin-left:auto;font-size:15px">capture 03N1676279699893G</span></div>
      <div class="bar" style="height:14px;border-radius:7px;margin-top:10px"><i data-k="cb" style="background:linear-gradient(90deg,#3b82f6,#22c55e)"></i></div>
      <div class="mono mut" style="font-size:14px;margin-top:10px">POST /v2/payments/authorizations/{id}/capture · final_capture: false</div>
      <div data-k="pay" style="margin-top:18px;padding:16px 24px;border-radius:18px;background:#fff;border:1px solid var(--line);color:#1d2142;display:flex;align-items:center;gap:16px;font-size:19px">${paypal(22)}<b>Payout</b><span>${ic('lock', 18, '#0057c2')} verified payee only</span><span style="color:#556;font-size:15px">payee lock on · no address from an email</span></div></div>`);
    const ms = qa(c, 'm'), mc = qa(c, 'mc'), adj = qa(c, 'adj');
    return (t) => {
      const t0 = L(9) - 0.15, tM = W('minus', L(9)), tL = W('late', L(9));
      grow(root, t, t0, 0.45, { ...F.navRect(NI.pay) });
      ms.forEach((m, i) => S(m, { transform: `translateY(${(1 - settle(t, t0 + 0.25 + i * 0.07)) * 40}px)` }));
      mc.forEach((m, i) => S(m, { transform: `scale(${pop(t, W('only', L(9)) + i * 0.2, 2.6, 0.55)})` }));
      adj.forEach((a, i) => S(a, { transform: `translateX(${(1 - settle(t, tM - 0.15 + i * 0.4)) * -1600}px)` }));
      const v = 3497.55 * ep(t, tM, tL + 0.4, E.outCubic);
      q(c, 'cap').textContent = '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); q(c, 'cb').style.width = `${(v / 4295) * 100}%`;
      S(q(c, 'pay'), { transform: `translateY(${(1 - settle(t, tL + 0.2)) * 260}px)`, opacity: clamp((t - tL - 0.2) * 5) });
      const [nx, ny] = F.navPt(NI.appr);
      F.cursor(t, L(10) - 0.7, L(10) + 0.3, [[L(10) - 0.7, 1300, 1000], [L(10) - 0.15, nx, ny], [L(10) + 0.3, nx + 60, ny + 70]], [L(10) - 0.17]);
    };
  });

  // ===== P7. Approvals — the team stops and asks; one click and the thread resumes =====
  F.scene(L(10) - 0.15, L(11) + 0.5, 16, (root) => {
    add(root, `<div>${header('Approvals', 'The agent acts alone up to $5,000. Above that, it holds the money and asks you.')}</div>`);
    const ap = add(root, `<div class="card" style="left:340px;top:180px;width:1540px;height:330px;padding:24px 28px">${cardHead('shield', '2 decisions waiting on you (live)', 'Money releases above the authority limit · agent plans paused at a LangGraph interrupt · payee changes in cooling-off')}
      <div data-k="r1" class="soft" style="margin-top:20px;padding:18px 22px;display:flex;align-items:center;gap:16px;background:var(--card)">${pill('p-blue', 'agent plan', true, 'font-size:13px')}<div><div style="font-size:19px"><b>INC-1002</b> · Nexus Micro (sole source) (AIR) · ₹1,51,400</div><div class="mut" style="font-size:15px;margin-top:4px">Production stops in 5.6 days without action. Selected Nexus Micro (sole source) (AIR) at Rs 151,400.</div></div>
        <span style="margin-left:auto">${btn('Approve ↗', 'ok')}</span><b style="font-size:15px">Reject &amp; replan</b></div>
      <div class="soft" style="margin-top:12px;padding:16px 22px;display:flex;align-items:center;gap:16px;background:var(--card)">${pill('p-red', 'payee change', true, 'font-size:13px')}<div><div style="font-size:18px"><b>Zhen Hua Electronics:</b> dops-sup21-dada@business.example.com → <b>payments@zhenhua-hk.com</b></div><div class="mut" style="font-size:14px;margin-top:3px">asked by accounts@zhenhua-hk.com · cooling-off ends in 2d</div></div><span style="margin-left:auto">${btn('Approve change ↗', '', 'opacity:.42')}</span><b style="font-size:15px">Reject</b></div></div>`);
    const RS = [['Approval', 'check', 'Human approved the plan'], ['s', 'procurement: human approved'], ['Procurement', 'box', 'Raised 1 purchase order(s): PO-A9003'], ['s', 'treasurer: new POs need PayPal holds through the guards'], ['Treasurer', 'wallet', 'Holds placed: 1; blocked by guards: 0. Money moves only on verified goods.']];
    const th = add(root, `<div class="card" style="left:340px;top:530px;width:1540px;height:506px;padding:24px 28px">${cardHead('team', 'Thread INC-1002', 'one per incident · every turn checkpointed in Postgres')}
      <div data-k="int" style="margin-top:18px;padding:18px 22px;border-radius:18px;background:rgba(236,72,153,.07);border:1px solid rgba(236,72,153,.35)"><div style="display:flex;align-items:center"><b style="font-size:18px">Approval agent paused the graph (LangGraph interrupt)</b><span data-k="wf" class="pill p-red" style="margin-left:auto;font-size:13px"><i></i><span data-k="wt">waiting for you</span></span></div>
        <div class="mut" style="font-size:15px;margin-top:6px">Supervisor → approval: plan exceeds the agent's authority or affects another customer</div></div>
      ${RS.map((r) => r[0] === 's' ? `<div data-k="rr" style="display:flex;gap:10px;align-items:center;margin-top:11px;font-size:15px"><span style="width:12px;height:12px;border-radius:50%;border:2px solid #6d72d8"></span>${ic('team', 14, '#6d72d8')}<b style="color:#4f6cf0">Supervisor</b><span class="mut">→ ${r[1]}</span></div>`
        : `<div data-k="rr" style="display:flex;gap:10px;align-items:center;margin-top:11px;font-size:18px"><span style="width:12px;height:12px;border-radius:50%;border:2px solid #1f1b3d"></span><b style="color:#4f6cf0;display:inline-flex;gap:6px;align-items:center">${ic(r[1], 16, '#4f6cf0')}${r[0]}</b><span>${r[2]}</span></div>`).join('')}</div>`);
    const rrs = qa(th, 'rr'), r1 = q(ap, 'r1'), ok = q(ap, 'ok');
    return (t) => {
      const t0 = L(10) - 0.15, tS = W('stops', L(10)), tc = W('click', L(10)), tP = W('picks', L(10));
      grow(root, t, t0, 0.45, { ...F.navRect(NI.appr) });
      S(ap, { transform: `translateY(${(1 - settle(t, t0 + 0.2)) * 60}px)` }); S(th, { transform: `translateY(${(1 - settle(t, t0 + 0.3)) * 120}px)` });
      S(q(th, 'int'), { transform: `scale(${1 + 0.03 * bump(t, tS - 0.1, tS + 0.4)})`, boxShadow: t > tS - 0.1 && t < tc ? `0 0 ${18 + 8 * Math.sin(t * 7)}px rgba(236,72,153,.25)` : '' });
      S(r1, { borderColor: t > tS - 0.1 ? 'rgba(109,92,240,.55)' : '' });
      S(ok, { transform: `scale(${1 - 0.08 * bump(t, tc - 0.05, tc + 0.15)})` });
      const wf = q(th, 'wf'); wf.className = t > tc + 0.1 ? 'pill p-green' : 'pill p-red'; q(wf, 'wt').textContent = t > tc + 0.1 ? 'approved · resumed' : 'waiting for you';
      rrs.forEach((r, i) => appear(r, t, tP - 0.35 + i * 0.28, 24));
      F.cursor(t, tS - 0.3, L(11) + 0.3, [[tS - 0.3, 1200, 900], [tc - 0.15, 1640, 280], [tc + 0.2, 1640, 282], [L(11) - 0.5, 1500, 700], [L(11) - 0.25, ...F.navPt(NI.ship)], [L(11) + 0.3, 200, 300]], [tc, L(11) - 0.27]);
    };
  });

  // ===== P8. Shipments: hidden shared sub-supplier (live: Sahyadri + Western share Penang Plating Works) =====
  F.scene(L(11) - 0.25, L(12) + 0.6, 17, (root) => {
    add(root, `<div>${header('Shipments', "Every inbound purchase order, where it really is, and whether the supplier's story matches the carrier's")}</div>`);
    const kp = add(root, `<div>${kpi(340, 370, 'truck', '#5b8cff', 'In transit', '4', 'tracked live', 'a')}${kpi(730, 370, 'clock', '#f59e0b', 'Delayed', '3', delta('33.3%', 1, 0, 'vs previous 24 h'), 'b')}${kpi(1120, 370, 'alert', '#ef4444', 'Claim ≠ carrier', '1', 'payment blocked', 'c')}${kpi(1510, 370, 'box', '#22c55e', 'Delivered & verified', '3', 'funds released', 'd')}</div>`);
    const gc = add(root, `<div class="card" style="left:340px;top:392px;width:1046px;height:644px"><div data-k="g" style="position:absolute;left:0;top:0"></div>
      <div style="position:absolute;left:28px;right:28px;top:22px">${cardHead('globe', 'Global view', 'Drag to spin · click an arc to open its project')}</div>
      <div style="position:absolute;left:28px;top:86px;display:flex;gap:8px">${pill('p-blue', 'COMP-131 · dual-sourced')}<span class="tag">Sahyadri Harness Works · Nashik</span><span class="tag">Western Components Ltd · Mumbai</span></div>
      <div data-k="lbl" style="position:absolute;padding:12px 16px;border-radius:14px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.5);font-size:18px;font-weight:700;color:#ef4444;white-space:nowrap">Penang Plating Works<div style="font-size:13px;font-weight:500">shared sub-supplier · S2</div></div></div>`);
    const SL = [['p-red', 'Claim ≠ carrier', 'COSCO Shipping', 'SEA', 'PO-7712 · Automotive MCU, 32-bit', 'Zhen Hua Electronics → Pune · SCU-700', 'Supplier: Dispatched 3 days ago', 'Carrier: Label created — no pickup'],
      ['p-blue', 'In transit', 'China Airlines Cargo', 'AIR', 'PO-7790 · Automotive MCU, 32-bit', 'Formosa Precision → Pune · SCU-700', 'Supplier: Departed TPE', 'Carrier: In flight · CI 6831'],
      ['p-blue', 'In transit', 'Gati Express', 'ROAD', 'PO-7715 · CAN connector, 12-pin', 'Western Components Ltd → Pune · SCU-700', 'Supplier: On truck MH-04', 'Carrier: Lonavala checkpoint']];
    const list = add(root, `<div class="card" style="left:1406px;top:392px;width:474px;height:644px;padding:22px 22px">${cardHead('truck', 'Shipments', '13 shown')}
      ${SL.map(([pc, pl, car, md, tt, rt, s1, s2]) => `<div class="soft" style="margin-top:12px;padding:14px 16px;background:var(--card);${pc === 'p-red' ? 'border-color:rgba(239,68,68,.45)' : ''}"><div style="display:flex;align-items:center;gap:8px;font-size:13px"><span class="pill ${pc}" style="font-size:12px;padding:3px 9px"><i></i>${pl}</span><span class="mut">${car}</span><b style="margin-left:auto">${md}</b></div>
        <div style="font-size:16px;font-weight:700;margin-top:8px">${tt}</div><div class="mut" style="font-size:13px">${rt}</div>
        <div style="display:flex;gap:8px;margin-top:8px;font-size:12px"><span class="soft" style="flex:1;padding:6px 8px">${s1}</span><span class="soft" style="flex:1;padding:6px 8px;${pc === 'p-red' ? 'color:#ef4444' : ''}">${s2}</span></div></div>`).join('')}</div>`);
    const tS = () => W('secretly', L(11));
    const RT = [
      { from: 'nashik', col: '#3b82f6', w: 3, prog: (t) => ep(t, L(11) + 0.1, L(11) + 1.0) },
      { from: 'mumbai', col: '#3b82f6', w: 3, prog: (t) => ep(t, L(11) + 0.3, L(11) + 1.2) },
      { from: 'penang', to: 'nashik', col: '#ef4444', w: 2.4, nodot: true, prog: (t) => ep(t, W('hidden', L(11)), tS() + 0.2) },
      { from: 'penang', to: 'mumbai', col: '#ef4444', w: 2.4, nodot: true, prog: (t) => ep(t, W('hidden', L(11)) + 0.15, tS() + 0.35) },
    ];
    const G = makeGlobe(1046, 644, 320, [-86, -12], RT);
    q(gc, 'g').appendChild(G.svg);
    const lbl = q(gc, 'lbl');
    return (t) => {
      const t0 = L(11) - 0.25;
      grow(root, t, t0, 0.45, { ...F.navRect(NI.ship) });
      [...kp.children].forEach((e, i) => S(e, { transform: `translateY(${(1 - settle(t, t0 + 0.2 + i * 0.06)) * 50}px)` }));
      S(list, { transform: `translateX(${(1 - settle(t, t0 + 0.4)) * 140}px)` });
      const z = lerp(320, 400, ep(t, t0, L(12) + 0.6, E.inOutSine));
      G.draw(t, { scale: z, rot: [-86 - 4 * ep(t, t0, L(12) + 0.6, E.inOutSine), -12], hot: 0 });
      const p = G.proj(K.LL.penang);
      S(lbl, { left: `${p[0] + 24}px`, top: `${p[1] - 20}px`, transform: `scale(${pop(t, tS())})`, transformOrigin: '0 50%' });
      const [nx, ny] = F.navPt(NI.prj);
      F.cursor(t, L(12) - 0.7, L(12) + 0.3, [[L(12) - 0.7, 1200, 900], [L(12) - 0.15, nx, ny], [L(12) + 0.3, nx + 60, ny + 80]], [L(12) - 0.17]);
    };
  });

  // ===== P9. PRJ-2041 · Timeline (Bryntum Gantt layout): still ships on time =====
  F.scene(L(12) - 0.2, L(13) + 0.5, 18, (root) => {
    add(root, prjHeader('2041', 'Timeline'));
    const DX = 30, X0 = 600; // 1 day = 30 px, starting Sun 25 Oct
    const ROWS = [['g', 'Materials'], ['r', 'PO-7712 · Automotive MCU, 32-bit · Zhe…', 0, 7, 'rgba(59,130,246,.35)', 'void'], ['r', 'PO-7790 · Automotive MCU, 32-bit · For…', 10.5, 1.8, '#8b5cf6', 'air'], ['r', 'PO-7715 · CAN connector, 12-pin · Weste…', 8, 3.4, 'rgba(139,92,246,.6)'], ['r', 'PO-7716 · Hall current sensor · Rhein Se…', 6.8, 0.9, '#f59e0b'], ['r', 'PO-7714 · Controller wiring harness · Sa…', 4.1, 4.1, '#22c55e'],
      ['g', 'PayPal releases'], ['d', 'Release PO-7790 funds (after QC)', 12.4], ['d', 'Release PO-7715 funds (after QC)', 11.5], ['d', 'Release PO-7716 funds (after QC)', 7.8],
      ['g', 'Production · 700 × Smart Controller Unit'], ['r', 'SMT line', 12.6, 1.6, '#3b82f6', 'shift'], ['r', 'Final assembly', 14.2, 1.4, '#3b82f6', 'shift'], ['r', 'End-of-line test', 15.6, 0.6, '#3b82f6', 'shift']];
    const DAYS = 'SMTWTFS';
    const g = add(root, `<div class="card" style="left:340px;top:352px;width:1540px;height:684px;padding:22px 26px">${cardHead('cal', 'Project timeline', 'Production starts only when every material lands · teal diamonds are PayPal releases · red line is the customer due date')}
      <div class="mut" style="position:absolute;left:30px;top:96px;font-size:13px;font-weight:600;letter-spacing:.4px">PLAN</div>
      ${['Sun 25 Oct 2026', 'Sun 01 Nov 2026', 'Sun 08 Nov 2026', 'Sun 15 Nov 2026'].map((d, i) => `<div style="position:absolute;left:${X0 + i * 7 * DX}px;top:84px;width:${7 * DX}px;text-align:center;font-size:14px;font-weight:600">${d}</div>`).join('')}
      ${Array.from({ length: 30 }, (_, i) => `<div class="mut" style="position:absolute;left:${X0 + i * DX}px;top:108px;width:${DX}px;text-align:center;font-size:12px">${DAYS[i % 7]}</div><div style="position:absolute;left:${X0 + i * DX}px;top:130px;bottom:20px;border-left:1px solid var(--line)"></div>`).join('')}
      ${ROWS.map((r, i) => { const y = 140 + i * 37; if (r[0] === 'g') return `<div style="position:absolute;left:30px;top:${y}px;font-size:15px;font-weight:700">⌄ ${r[1]}</div>`;
        if (r[0] === 'd') return `<div style="position:absolute;left:54px;top:${y}px;font-size:14px">• ${r[1]}</div><div data-k="dia" style="position:absolute;left:${X0 + r[2] * DX - 9}px;top:${y + 2}px;width:18px;height:18px;transform:rotate(45deg);border-radius:4px;background:#14b8a6"></div>`;
        return `<div style="position:absolute;left:54px;top:${y}px;font-size:14px;white-space:nowrap;width:520px;overflow:hidden">• ${r[1]}</div><div data-k="bar" data-x="${r[2]}" data-f="${r[5] || ''}" class="gbar" style="top:${y - 1}px;width:${r[3] * DX}px;background:${r[4]}"></div>`; }).join('')}
      <div style="position:absolute;left:${X0 + 11.94 * DX}px;top:126px;bottom:20px;border-left:3px solid #f97316"></div><div style="position:absolute;left:${X0 + 11.94 * DX - 26}px;top:126px;padding:2px 8px;border-radius:6px;background:#f97316;color:#fff;font-size:12px;font-weight:700">22:41</div>
      <div style="position:absolute;left:${X0 + 17 * DX}px;top:126px;bottom:20px;border-left:3px dashed #ef4444"></div><div style="position:absolute;left:${X0 + 17 * DX + 4}px;top:126px;padding:2px 8px;border-radius:6px;background:#ef4444;color:#fff;font-size:12px;font-weight:700">Due · SCU-700</div>
      <div data-k="met" class="pill p-green" style="position:absolute;right:30px;bottom:30px;font-size:17px">${ic('check', 16)} Due 11 Nov · met</div></div>`);
    const bars = qa(g, 'bar'), dias = qa(g, 'dia');
    return (t) => {
      const t0 = L(12) - 0.2, ts = W('still', L(12)), tT = W('time', L(12));
      grow(root, t, t0, 0.45, { ...F.navRect(NI.prj) });
      bars.forEach((b, i) => {
        const x = +b.dataset.x, f = b.dataset.f, k = spring(t, ts - 0.25 + i * 0.04, 1.8, 0.8);
        const shift = f === 'shift' ? 1.2 * (1 - k) : 0;
        S(b, { left: `${X0 + (x + shift) * DX}px`, transform: `scaleX(${settle(t, t0 + 0.25 + i * 0.04)})`, transformOrigin: '0 50%', opacity: f === 'void' ? 0.55 : 1, backgroundImage: f === 'void' ? 'repeating-linear-gradient(45deg,rgba(255,255,255,.18) 0 6px,transparent 6px 12px)' : '' });
      });
      dias.forEach((d, i) => S(d, { transform: `rotate(45deg) scale(${pop(t, ts + 0.1 + i * 0.12)})` }));
      S(q(g, 'met'), { display: 'inline-flex', transform: `scale(${pop(t, tT)})` });
    };
  });
})();
