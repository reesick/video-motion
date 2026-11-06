// DisruptionOps film, UI part: the app shell and every product page, rebuilt to match the live app
// (agenticlogisticsystem.vercel.app, crawled 5 Nov 2026 + owner's dark-mode screenshots). Real names, IDs and amounts only.
(function () {
  const { h, S, show, E, ep, lerp, clamp, spring, pop, settle, springSteps, typed } = M;
  const { ic, paypal, paypalDark, grow, rise, bump, html, q, qa, money, W, cpath, press, makeGlobe } = K;
  const { L, add } = F;

  // ---------- shell geometry (measured from the owner's 1917x968 screenshot, scaled to 1920x1080) ----------
  F.NAV = [['globe', 'Mission Control'], ['folder', 'Projects', 5], ['truck', 'Shipments'], ['wallet', 'Payments'], ['bot', 'Agent Board', 4], ['shield', 'Approvals', 1], ['users', 'Suppliers'], ['flask', 'Simulation Lab'], ['search', 'Audit & Search']];
  F.navY = (i) => 117 + i * 47.5;
  F.navRect = (i) => ({ x: 40, y: F.navY(i), w: 260, h: 46, r: 14 });
  F.navPt = (i) => [150, F.navY(i) + 23];
  F.cursor = (t, t0, t1, pts, clicks) => { if (t < t0 || t > t1) return; const [x, y] = cpath(t, pts); Object.assign(F.CUR, { on: true, x, y, s: press(t, clicks) }); };

  const header = (title, sub) => `<div class="abs" style="left:340px;top:96px"><div class="h1">${title}</div><div class="sub">${sub}</div></div>`;
  F.header = header;
  const delta = (v, up, good, txt) => `<span style="color:${good ? '#22c55e' : '#ef4444'};font-weight:600">${up ? '↑' : '↓'} ${v}</span> ${txt}`;
  const kpi = (x, w, icn, col, l, v, d, k) => `<div class="kpi" data-k="${k}" style="left:${x}px;top:190px;width:${w}px"><div class="ico" style="background:${col}22">${ic(icn, 20, col)}</div><div class="l">${l}</div><div class="v" data-k="${k}v">${v}</div><div class="d">${d}</div></div>`;
  F.kpi = kpi;
  const cardHead = (icn, title, sub, right = '') => `<div class="chd"><span class="icirc">${ic(icn, 19, '#8ea2ff')}</span><div><b>${title}</b><span class="s">${sub}</span></div>${right ? `<span style="margin-left:auto" class="link">${right}</span>` : ''}</div>`;
  const pill = (cls, txt, dot = true) => `<span class="pill ${cls}">${dot ? '<i></i>' : ''}${txt}</span>`;

  // project page header (Projects → PRJ-…)
  const PRJ = {
    '2041': { st: ['p-red', 'Critical'], ids: 'PROD-882 · PROD-884', title: 'SCU-700 · Smart Controller Units', who: 'Bharat EV Motors', city: 'Chennai', units: '700 units', due: 'due 11 Nov (in 6d)',
      sum: 'Zhen Hua claimed the MCUs shipped; the carrier never collected them. Agent voided the $5,880 hold and re-sourced to Formosa by air.', mat: 62, rel: 22, com: 'Committed $13,445 · ₹11,29,380', dec: 1 },
    '2043': { st: ['p-green', 'On track'], ids: 'PROD-885', title: 'TCU-500 · Telematics Units', who: 'Shakti Auto', city: 'Pune', units: '500 units', due: 'due 16 Nov (in 11d)',
      sum: 'Stock record says 600 modems on hand; the warehouse counted 140. Agent asked the floor before trusting either number.', mat: 88, rel: 25, com: 'Committed $7,850 · ₹6,59,400', dec: 2 },
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
  F.scene(L(5) + 0.25, L(14) + 0.3, 30, (root) => {
    const side = add(root, `<div class="side"><div class="brand"><div class="logo" style="position:relative;width:46px;height:46px;flex:none">${ic('flow', 25, '#fff', 2.2)}</div><div><b>DisruptionOps</b><span>Autonomous supply-chain f…</span></div></div>
      <div class="navhi" data-k="hi"></div>
      ${F.NAV.map(([i, n, c], k) => `<div class="nav" data-k="nav" style="position:absolute;left:20px;width:260px;top:${F.navY(k) - 20}px">${ic(i, 20, 'currentColor', 1.8)}<span>${n}</span>${c ? `<span class="cnt">${c}</span>` : ''}</div>`).join('')}
      <div class="mandate" style="top:600px">${ic('shield', 24, '#fff')}<b>Agent spending mandate</b><p>Holds funds automatically. Releases above $5,000 need a human code.</p><span class="sb">PayPal sandbox · live</span></div>
      ${[['plug', 'Integrations', 815], ['help', 'Help & docs', 862]].map(([i, n, y]) => `<div class="nav" style="position:absolute;left:20px;width:260px;top:${y}px">${ic(i, 20, 'currentColor', 1.8)}<span>${n}</span></div>`).join('')}</div>`);
    const top = add(root, `<div class="top"><div class="search">${ic('search', 20, 'currentColor')}Search projects, POs, suppliers, PayPal ids…<span class="k">⌘K</span></div>
      <div style="margin-left:auto" class="chipbtn"><span style="width:9px;height:9px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e"></span>Agent live</div>
      <div class="chipbtn" style="width:54px;justify-content:center;padding:0;position:relative">${ic('bell', 20, 'currentColor')}<span class="badge3">3</span></div>
      <div class="chipbtn"><span class="ap">AP</span><div style="line-height:1.15"><div style="font-size:15px">Ayush Pathak</div><div class="mut" style="font-size:12px;font-weight:500">Supply-chain lead</div></div></div></div>`);
    const navs = qa(side, 'nav'), hi = q(side, 'hi'), topKids = [...top.children];
    const st = [[0, 0], [L(6) - 0.15, 1], [L(9) - 0.15, 3], [L(11) - 0.15, 1], [L(12) - 0.25, 2], [L(13) - 0.15, 1]];
    return (t) => {
      root.style.background = 'none';
      const t0 = L(5) + 0.25;
      hi.style.top = `${springSteps(t, st.map(([a, b]) => [a, F.navY(b) - 20]), 2.4, 0.8)}px`;
      navs.forEach((n, i) => { const k = ep(t, t0 + 0.05 + i * 0.03, t0 + 0.4 + i * 0.03, E.outCubic); S(n, { transform: `translateX(${(1 - k) * -30}px)`, opacity: k }); });
      topKids.forEach((e, i) => S(e, { transform: `scale(${pop(t, t0 + 0.1 + i * 0.07, 2.4, 0.7)})` }));
      const out = ep(t, L(14) - 0.25, L(14) + 0.25, E.inCubic);
      side.style.transform = `translateX(${-360 * out}px)`; top.style.transform = `translateY(${-120 * out}px)`;
    };
  }, { bg: false });

  // ===== P1. Mission Control =====
  F.scene(L(5) + 0.3, L(6) + 0.6, 10, (root) => {
    add(root, `<div>${header('Mission Control', 'Pune Plant 1 · 6 customer projects · 16 purchase orders watched')}</div>`);
    add(root, `<div class="pill p-green" style="position:absolute;right:40px;top:110px;font-size:15px"><i></i>Last agent action 6m ago</div>`);
    const kp = add(root, `<div>${kpi(340, 370, 'shield', '#22c55e', 'Protected by Buyer Shield', '$25,438', '7 guards · this month', 'k1')}${kpi(730, 370, 'clock', '#ef4444', 'Buy timers red', '3', 'of 23 running · 0 projects slipped', 'k2')}${kpi(1120, 370, 'lock', '#5b8cff', 'Funds held in PayPal', '$35,790', delta('17.9%', 1, 1, 'reserved, not moved'), 'k3')}${kpi(1510, 370, 'activity', '#a78bfa', 'Open incidents', '4', delta('25.0%', 1, 0, 'vs previous 24 h'), 'k4')}</div>`);
    const SH = [['PO-7712', 'p-red', 'Claim ≠ carrier', 'Zhen Hua Electronics · COSCO Shipping', 0], ['PO-7790', 'p-blue', 'In transit', 'Formosa Precision · China Airlines Cargo', 38], ['PO-7715', 'p-blue', 'In transit', 'Western Components Ltd · Gati Express', 71]];
    const gc = add(root, `<div class="card" style="left:340px;top:392px;width:1046px;height:644px">
      <div style="position:absolute;left:28px;right:28px;top:22px">${cardHead('globe', 'Live supply network', '8 shipments moving into Pune · 12 suppliers on 4 continents', 'Open shipments →')}</div>
      <div style="position:absolute;left:28px;top:86px;display:flex;gap:8px;z-index:2">${[['#3b82f6', 'In transit'], ['#f59e0b', 'Delayed'], ['#ef4444', 'Claim ≠ carrier'], ['#22c55e', 'To customer'], ['#ffffff', 'Shipment now']].map(([c, n]) => `<span class="tag"><i style="width:8px;height:8px;border-radius:50%;background:${c};border:1px solid rgba(0,0,0,.2);display:inline-block"></i>${n}</span>`).join('')}</div>
      <div data-k="g" style="position:absolute;left:0;top:70px"></div>
      <div style="position:absolute;left:20px;right:20px;bottom:18px;display:flex;gap:14px">${SH.map(([po, pc, pl, who, v]) => `<div class="soft" style="flex:1;padding:14px 16px"><div style="display:flex;align-items:center"><b style="font-size:16px">${po}</b><span class="pill ${pc}" style="margin-left:auto;font-size:12px;padding:3px 9px"><i></i>${pl}</span></div><div class="mut" style="font-size:13px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${who}</div><div style="display:flex;align-items:center;gap:10px;margin-top:10px"><div class="bar" style="flex:1"><i style="width:${v}%;background:linear-gradient(90deg,#6366f1,#ec4899)"></i></div><b style="font-size:13px">${v}%</b></div></div>`).join('')}</div></div>`);
    const ACT = [['bot', 'Agent', '6m ago', 'p-amber', 'Medium', 'Checking inbound modems cover the gap', 'TCU-500 · 360 modems short, PO-7731 lands in 66 h', 'TCU-500 · Telematics Units'],
      ['box', 'Carrier', '24m ago', 'p-amber', 'Medium', 'ONE Harmony waiting berth at Chennai', 'Hazmat cells for BMS-380 · ETA +1 day', 'BMS-380 · Battery Management Systems'],
      ['users', 'Human', '1h ago', 'p-violet', 'High', 'Approval needed: $9,855 over limit', 'IC-450 · AeroCell Logistics · one-time code sent', 'IC-450 · Instrument Clusters']];
    const act = add(root, `<div class="card" style="left:1406px;top:392px;width:474px;height:644px;padding:22px 22px">
      ${cardHead('activity', 'Agent activity', 'Every decision, as it happens', 'Audit →')}
      ${ACT.map(([i, who, ago, pc, pl, tt, sub, lk]) => `<div data-k="a" class="soft" style="margin-top:14px;padding:16px 18px"><div style="display:flex;align-items:center;gap:8px;font-size:14px">${ic(i, 16, '#9aa8ff')}<b>${who}</b><span class="mut">${ago}</span><span class="pill ${pc}" style="margin-left:auto;font-size:12px;padding:3px 10px">${pl}</span></div>
        <div style="font-size:17px;font-weight:700;margin-top:8px;line-height:1.3">${tt}</div><div class="mut" style="font-size:14px;margin-top:4px">${sub}</div><div class="link" style="font-size:13px;margin-top:6px">${lk}</div></div>`).join('')}</div>`);
    const G = makeGlobe(1046, 470, 230, [-88, -16]);
    q(gc, 'g').appendChild(G.svg);
    const kps = [...kp.children], acts = qa(act, 'a');
    return (t) => {
      const t0 = L(5) + 0.3;
      grow(root, t, t0, 0.5, { x: 340, y: 96, w: 300, h: 60, r: 16 });
      kps.forEach((e, i) => S(e, { transform: `translateY(${(1 - settle(t, t0 + 0.25 + i * 0.08)) * 60}px)` }));
      q(kp, 'k1v').textContent = money(Math.round(25438 * ep(t, t0 + 0.3, t0 + 1.4, E.outCubic)));
      S(gc, { transform: `translateY(${(1 - settle(t, t0 + 0.4)) * 80}px)` }); S(act, { transform: `translateX(${(1 - settle(t, t0 + 0.5)) * 120}px)` });
      acts.forEach((e, i) => S(e, { transform: `translateY(${(1 - spring(t, t0 + 0.8 + i * 0.35, 2, 0.75)) * 40}px)`, opacity: clamp((t - t0 - 0.8 - i * 0.35) * 5) }));
      const sc = lerp(230, 250, ep(t, t0, L(6) + 0.6, E.inOutSine));
      G.draw(t, { scale: sc, rot: [-88 + 3 * ep(t, t0, L(6) + 0.6, E.inOutSine), -16], draw: ep(t, W('every', L(5)), W('shipment', L(5)) + 0.6, E.inOutCubic), hot: 0.5 + 0.5 * Math.sin(t * 6) });
      S(q(kp, 'k1'), { boxShadow: t > W('project', L(5)) ? '0 0 0 2px rgba(34,197,94,.45), 0 20px 60px rgba(34,197,94,.15)' : '' });
      const [nx, ny] = F.navPt(1);
      F.cursor(t, t0 + 0.8, L(6) + 0.6, [[t0 + 0.8, 1300, 1100], [W('project', L(5)) + 0.1, 560, 290], [L(6) - 0.5, 560, 300], [L(6) - 0.2, nx, ny], [L(6) + 0.6, nx + 40, ny + 60]], [L(6) - 0.17]);
    };
  });

  // ===== P2. Buy timers (PRJ-2043 · Buy timers tab) =====
  F.scene(L(6) - 0.2, L(7) + 0.6, 11, (root) => {
    add(root, prjHeader('2043', 'Buy timers'));
    const tb = add(root, `<div class="card" style="left:340px;top:352px;width:1540px;height:684px;padding:24px 30px">
      ${cardHead('clock', 'Buy timers', 'Last day to order each part so the project still ships')}
      <div style="position:absolute;right:30px;top:20px;display:flex;gap:10px">${[['23', 'timers running', ''], ['3', 'red', '#ef4444'], ['0', 'projects slipped', '#22c55e']].map(([a, b, c]) => `<div class="soft" style="padding:8px 16px;text-align:right"><div style="font-size:26px;font-weight:700;${c ? 'color:' + c : ''}">${a}</div><div class="mut" style="font-size:12px">${b}</div></div>`).join('')}</div>
      <table class="tbl" style="margin-top:34px"><tr><th>Part</th><th>Material</th><th>Order by</th><th>Time left</th><th style="width:300px">Runway</th><th>Agent</th></tr>
        <tr data-k="row"><td><b>PCB-12</b></td><td>6-layer controller PCB</td><td>9 Nov</td><td class="mono" data-k="left" style="font-size:18px">2 d 04 h</td><td><div class="bar"><i style="width:18%;background:#ef4444"></i></div></td><td data-k="act"><span class="pill p-violet" data-k="po">${ic('bot', 14)} Agent drafted PO-7801</span></td></tr>
        <tr data-k="row"><td><b>LTE-1</b></td><td>LTE Cat-1 modem · Lakeshore Semiconductors</td><td class="mut">ordered</td><td class="mut">PO-7731 lands in 66 h</td><td><div class="bar"><i style="width:100%;background:#22c55e"></i></div></td><td>${pill('p-green', 'Covered')}</td></tr>
        <tr data-k="row"><td class="mut" colspan="6">21 more timers across 5 projects · all green</td></tr></table>
      <div class="soft" style="position:absolute;left:30px;right:30px;bottom:26px;height:170px">
        <div class="mut" style="position:absolute;left:20px;top:16px;font-size:14px">Timeline · PCB-12 → SMT line → Final assembly → Due</div>
        <div data-k="ob" style="position:absolute;left:250px;top:84px;width:22px;height:22px;transform:rotate(45deg);background:#f59e0b;border-radius:4px"></div><div class="mut" style="position:absolute;left:214px;top:118px;font-size:13px">Order-by · 9 Nov</div>
        <div class="gbar" style="left:310px;top:84px;width:420px;background:rgba(139,92,246,.6)"></div><div class="gbar" style="left:750px;top:84px;width:300px;background:rgba(59,130,246,.55)"></div>
        <div style="position:absolute;left:1220px;top:44px;width:2px;height:100px;border-left:2px dashed #ef4444"></div><div style="position:absolute;left:1180px;top:20px;font-size:13px;color:#ef4444;font-weight:600">Due · 16 Nov</div></div></div>`);
    const rows = qa(tb, 'row'), red = rows[0], ob = q(tb, 'ob'), po = q(tb, 'po'), left = q(tb, 'left');
    return (t) => {
      const t0 = L(6) - 0.2, tr = W('last', L(6)), tc = W('orders', L(6));
      grow(root, t, t0, 0.45, { ...F.navRect(1) });
      rows.forEach((r, i) => S(r, { transform: `translateY(${(1 - settle(t, t0 + 0.35 + i * 0.06)) * 40}px)`, opacity: clamp((t - t0 - 0.35 - i * 0.06) * 6) }));
      const secs = Math.max(0, 2 * 86400 + 4 * 3600 + 59 * 60 - (t - t0) * 7);
      left.textContent = `${Math.floor(secs / 86400)} d ${String(Math.floor(secs % 86400 / 3600)).padStart(2, '0')} h ${String(Math.floor(secs % 3600 / 60)).padStart(2, '0')} m`;
      const pulse = t > tr ? 0.5 + 0.5 * Math.sin((t - tr) * 9) : 0;
      S(red, { background: `rgba(239,68,68,${0.06 + 0.1 * pulse})` });
      S(po, { display: 'inline-flex', transform: `scale(${pop(t, tc + 0.15)})` });
      S(ob, { boxShadow: t > tc ? `0 0 ${18 + 10 * pulse}px #f59e0b` : 'none', transform: `rotate(45deg) scale(${1 + 0.4 * bump(t, tc + 0.1, tc + 0.6)})` });
      F.cursor(t, t0 + 0.4, L(7) + 0.4, [[t0 + 0.4, 300, 400], [tr, 900, 560], [tc - 0.1, 1690, 560], [tc + 0.2, 1690, 560], [L(7) + 0.4, 1400, 700]], [tc]);
    };
  });

  // ===== P3+P4. PRJ-2041 · Materials: price check, then the lie on PO-7712 =====
  F.scene(L(7) - 0.15, L(9) + 0.5, 12, (root) => {
    add(root, prjHeader('2041', 'Materials'));
    const PO = [['PO-7712', 'Automotive MCU, 32-bit', 'Zhen Hua Electronics', 41, '700', 'SEA', '$5,880', 'p-blue', 'Funds held', 'r12'],
      ['PO-7790', 'Automotive MCU, 32-bit', 'Formosa Precision', 93, '700', 'AIR', '$6,580', 'p-blue', 'Funds held'],
      ['PO-7715', 'CAN connector, 12-pin', 'Western Components Ltd', 86, '1,800', 'ROAD', '$2,070', 'p-blue', 'Funds held'],
      ['PO-7716', 'Hall current sensor', 'Rhein Sensorik GmbH', 95, '700', 'AIR', '$1,890', 'p-amber', 'Invoice received'],
      ['PO-7714', 'Controller wiring harness', 'Sahyadri Harness Works', 84, '700', 'ROAD', '$3,010', 'p-green', 'Funds released'],
      ['PCB-12', '6-layer controller PCB', 'Broker quote', null, '700', 'SEA', '$9,940', 'p-red', 'Price check', 'rpcb']];
    const tbl = add(root, `<div class="card" style="left:340px;top:352px;width:880px;height:684px;padding:24px 26px">${cardHead('layers', 'Materials', 'On hand + verified inbound vs required')}
      <table class="tbl" style="margin-top:20px;font-size:15px"><tr><th>PO</th><th>Material</th><th>Supplier</th><th>Mode</th><th>Value</th><th>PayPal state</th></tr>
      ${PO.map(([p, m, s, r, qn, md, v, pc, ps, k]) => `<tr data-k="${k || 'r'}"><td><b>${p}</b></td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${m}</td><td>${s}${r ? ` <span style="color:${r < 50 ? '#ef4444' : '#22c55e'};font-size:12px;font-weight:700">${r}</span>` : ''}</td><td class="mut">${md}</td><td>${v}</td><td data-k="ps"><span class="pill ${pc}" style="font-size:13px"><i></i>${ps}</span></td></tr>`).join('')}</table></div>`);
    // inspector 1: price check (fair-price guard)
    const pc = add(root, `<div class="card" style="left:1240px;top:352px;width:640px;height:684px;padding:26px 28px">
      ${cardHead('shield', 'Price check · PCB-12 × 700', 'Fair-price guard runs before any PayPal hold')}
      <div style="display:flex;gap:30px;margin-top:30px"><div><div class="mut" style="font-size:14px">Quote</div><div style="font-size:50px;font-weight:800">$14.20</div></div><div><div class="mut" style="font-size:14px">Should-cost</div><div style="font-size:50px;font-weight:800;color:#7aa2ff">$3.10</div></div><div><div class="mut" style="font-size:14px">Ratio</div><div style="font-size:50px;font-weight:800;color:#ef4444" data-k="ratio">1.0×</div></div></div>
      <div style="position:relative;height:40px;margin-top:22px"><div data-k="b1" style="position:absolute;left:0;top:0;height:14px;border-radius:7px;background:linear-gradient(90deg,#f59e0b,#ef4444)"></div><div data-k="b2" style="position:absolute;left:0;top:22px;height:14px;border-radius:7px;background:#5b6cf5"></div></div>
      <div data-k="stamp" class="pill p-red" style="margin-top:18px;font-size:20px;padding:10px 18px">${ic('shield', 18)} Broker markup: blocked</div>
      <div data-k="op" class="soft" style="margin-top:22px;padding:16px 18px;display:flex;align-items:center"><div><b style="font-size:18px">Formosa Precision</b><div style="margin-top:6px">${pill('p-green', 'Certified · trust 93 · chosen')}</div></div><b style="margin-left:auto;font-size:26px">$3.24</b></div>
      <div data-k="sv" class="soft" style="margin-top:16px;padding:16px 18px;display:flex;align-items:center;gap:14px">${ic('shield', 28, '#22c55e')}<div><b style="font-size:26px" data-k="svn">$0</b><div class="mut" style="font-size:14px">overcharge avoided · no PayPal hold was ever placed for the broker</div></div></div></div>`);
    // inspector 2: PO-7712 claim vs carrier → void
    const ins = add(root, `<div class="card" style="left:1240px;top:352px;width:640px;height:684px;padding:26px 28px">
      ${cardHead('box', 'PO-7712 · Automotive MCU, 32-bit', 'Zhen Hua Electronics · trust 41 · SEA')}
      <div data-k="s1" class="soft" style="margin-top:20px;padding:18px 20px"><div class="mut" style="display:flex;align-items:center;gap:8px;font-size:14px">${ic('mail', 16, '#9aa8ff')} Supplier says <span class="tag" style="margin-left:auto">${ic('spark', 13, '#ec4899')} Gemini read</span></div><div style="font-size:21px;margin-top:8px;line-height:1.35" data-k="say"></div></div>
      <div data-k="s2" class="soft" style="margin-top:14px;padding:18px 20px"><div class="mut" style="display:flex;align-items:center;gap:8px;font-size:14px">${ic('ship', 16, '#9aa8ff')} Carrier says · COSCO Shipping · COSU6218840 <span class="tag" style="margin-left:auto">${ic('cpu', 13, '#3b82f6')} Solver</span></div>
        <div style="font-size:21px;margin-top:8px;font-weight:600;color:#ef4444">Label created — no pickup</div></div>
      <div data-k="bad" class="pill p-red" style="margin-top:16px;font-size:17px;padding:10px 16px">${ic('alert', 17)} Contradiction — the agent will not pay on this claim</div>
      <div data-k="pp" style="margin-top:16px;padding:20px 22px;border-radius:20px;background:#fff;color:#1d2142">
        <div style="display:flex;align-items:center;gap:12px">${paypal(22)}<span style="font-size:13px;color:#556">Authorization <span class="mono">45357457J6295492T</span></span></div>
        <div style="display:flex;align-items:baseline;gap:14px;margin-top:8px"><span data-k="amt" style="font-size:40px;font-weight:800">$5,880</span><span data-k="st" class="pill" style="background:#e8f0ff;color:#0057c2">Held</span></div>
        <div class="mono" data-k="ev" style="font-size:13px;color:#556;margin-top:6px">PAYMENT.AUTHORIZATION.CREATED</div></div></div>`);
    const r12 = q(tbl, 'r12'), rpcb = q(tbl, 'rpcb'), rows = [...tbl.querySelectorAll('tr')].slice(1);
    const say = q(ins, 'say'), pp = q(ins, 'pp'), bad = q(ins, 'bad');
    return (t) => {
      const t0 = L(7) - 0.15, tb = W('blocked', L(7)), tAI = W('ai', L(8)), tCode = W('plain', L(8)), tMatch = W('story', L(8)), tV = W('voided', L(8));
      const sw = L(8) - 0.25; // inspector switches from PCB-12 to PO-7712
      grow(root, t, t0, 0.45, { x: 1240, y: 600, w: 640, h: 60, r: 12 });
      rows.forEach((r, i) => S(r, { transform: `translateY(${(1 - settle(t, t0 + 0.2 + i * 0.04)) * 30}px)` }));
      S(rpcb, { background: t < sw ? 'rgba(239,68,68,.10)' : '' }); S(r12, { background: t > sw ? 'rgba(91,108,245,.14)' : '' });
      // price check
      show(pc, t < sw + 0.4);
      S(pc, { transform: `translateX(${(1 - settle(t, t0 + 0.3)) * 700 + ep(t, sw, sw + 0.4, E.inCubic) * 700}px)` });
      q(pc, 'ratio').textContent = `${lerp(1, 4.6, ep(t, W('four', L(7)) - 0.1, W('fair', L(7)) + 0.3, E.outCubic)).toFixed(1)}×`;
      q(pc, 'b1').style.width = `${580 * ep(t, t0 + 0.4, W('fair', L(7)) + 0.3, E.outCubic)}px`; q(pc, 'b2').style.width = `${127 * ep(t, t0 + 0.5, t0 + 1.0, E.outCubic)}px`;
      S(q(pc, 'stamp'), { display: 'inline-flex', transform: `scale(${pop(t, tb - 0.05)})` });
      S(q(pc, 'op'), { transform: `translateY(${(1 - settle(t, tb + 0.1)) * 60}px)`, opacity: clamp((t - tb - 0.1) * 6) });
      S(q(pc, 'sv'), { transform: `translateY(${(1 - settle(t, tb + 0.25)) * 60}px)`, opacity: clamp((t - tb - 0.25) * 6) });
      q(pc, 'svn').textContent = money(Math.round(7770 * ep(t, tb + 0.3, tb + 1.1, E.outCubic)));
      const psPcb = q(rpcb, 'ps'); psPcb.innerHTML = t > tb ? `<span class="pill p-red" style="font-size:13px">${ic('shield', 12)}Blocked 4.6×</span>` : `<span class="pill p-amber" style="font-size:13px"><i></i>Price check</span>`;
      // PO-7712 inspector
      show(ins, t > sw);
      S(ins, { transform: `translateX(${(1 - settle(t, sw + 0.1)) * 700}px)` });
      say.textContent = '"' + typed('Goods dispatched 3 days ago. Please release payment per invoice ZH-INV-55120.', t, tAI + 0.1, tAI + 1.4) + '"';
      S(q(ins, 's2'), { transform: `translateY(${(1 - settle(t, tCode - 0.1)) * 40}px)`, opacity: clamp((t - tCode + 0.1) * 6) });
      S(bad, { display: 'inline-flex', transform: `scale(${pop(t, tMatch)})` });
      S(pp, { transform: `translateY(${(1 - settle(t, tMatch + 0.4)) * 160}px)`, opacity: clamp((t - tMatch - 0.4) * 5) });
      const v = t > tV;
      q(ins, 'amt').style.textDecoration = v ? 'line-through' : 'none'; q(ins, 'amt').style.color = v ? '#9aa' : '#1d2142';
      const st = q(ins, 'st'); st.textContent = v ? 'VOIDED' : 'Held'; S(st, { background: v ? '#ffe4e4' : '#e8f0ff', color: v ? '#c81e1e' : '#0057c2', transform: `scale(${1 + 0.35 * bump(t, tV, tV + 0.35)})` });
      q(ins, 'ev').textContent = v ? 'PAYMENT.AUTHORIZATION.VOIDED · rule R-07 · $5,880 never left the buyer' : 'PAYMENT.AUTHORIZATION.CREATED';
      q(r12, 'ps').innerHTML = v ? `<span class="pill p-amber" style="font-size:13px"><i></i>Hold voided</span>` : `<span class="pill p-blue" style="font-size:13px"><i></i>Funds held</span>`;
      F.cursor(t, sw - 0.6, sw + 0.6, [[sw - 0.6, 1100, 1000], [sw - 0.05, 520, 450], [sw + 0.6, 560, 520]], [sw]);
      const [nx, ny] = F.navPt(3);
      F.cursor(t, L(9) - 0.8, L(9) + 0.4, [[L(9) - 0.8, 1300, 900], [L(9) - 0.2, nx, ny], [L(9) + 0.4, nx + 60, ny + 80]], [L(9) - 0.17]);
    };
  });

  // ===== P5. Payments: duplicate invoice + payee lock =====
  F.scene(L(9) - 0.2, L(10) + 0.55, 14, (root) => {
    add(root, `<div>${header('Payments', 'Every dollar the agent has held, released, voided or refunded through PayPal — and why')}</div>`);
    const kp = add(root, `<div>${kpi(340, 370, 'lock', '#5b8cff', 'Held (authorized, not moved)', '$35,790', '₹30,06,360', 'a')}${kpi(730, 370, 'wallet', '#22c55e', 'Released to suppliers', '$10,771', 'only after goods verified', 'b')}${kpi(1120, 370, 'undo', '#f59e0b', 'Voided or refunded', '$15,490', 'never paid for bad goods', 'c')}${kpi(1510, 370, 'reports', '#ec4899', 'Awaiting human release', '$9,855', 'over $5,000 limit', 'd')}</div>`);
    const R = [
      ['7XK21893LM4402917', 'PO-7712', 'Zhen Hua Electronics', 'p-amber', 'Hold voided', 'mismatch', '$5,880'],
      ['3HN44017PL5590023', 'PO-7790', 'Formosa Precision', 'p-blue', 'Funds held', 'pending', '$6,580'],
      ['G-118 · guard', 'PO-7712', 'Zhen Hua Electronics', 'p-red', 'ZH-INV-55120-A duplicate of ZH-INV-55120 · blocked', 'duplicate', '$5,880', 'dup'],
      ['5BB10284QX7713302', 'PO-7715', 'Western Components Ltd', 'p-blue', 'Funds held', 'pending', '$2,070'],
      ['G-114 · guard', 'PO-7712', 'zhenhua-electr0nics.com', 'p-red', 'Payee change from look-alike domain · blocked · 72 h lock', 'payee lock', '$4,410', 'payee'],
      ['9QW33810MN22099…', 'PO-7714', 'Sahyadri Harness Works', 'p-green', 'Funds released', 'matched', '$3,010'],
      ['PAYOUT-HB8820', 'PO-7718', 'AeroCell Logistics', 'p-violet', 'Payout sent', 'matched', '$415'],
    ];
    const led = add(root, `<div class="card" style="left:340px;top:392px;width:1540px;height:644px;padding:24px 30px">${cardHead('wallet', 'Ledger', 'PayPal ids and Buyer Shield guard events')}
      <table class="tbl" style="margin-top:16px;font-size:15px"><tr><th>PayPal id</th><th>PO</th><th>Supplier</th><th>PayPal state</th><th>3-way match</th><th style="text-align:right">Amount (USD)</th></tr>
      ${R.map(([id, po, s, pc, st, m, a, k]) => `<tr data-k="${k || 'r'}"><td class="mono" style="font-size:14px">${id}</td><td>${po}</td><td>${s}</td><td><span class="pill ${pc}" style="font-size:13px">${pc === 'p-red' ? ic('shield', 13) : '<i></i>'}${st}</span></td><td class="mut">${m}</td><td style="text-align:right;font-weight:700" data-k="am">${a}</td></tr>`).join('')}</table>
      <div data-k="np" class="pill p-red" style="position:absolute;right:34px;bottom:26px;font-size:22px;padding:12px 22px">$0 paid on either</div></div>`);
    const rows = [...led.querySelectorAll('tr')].slice(1), dup = q(led, 'dup'), payee = q(led, 'payee'), np = q(led, 'np');
    return (t) => {
      const t0 = L(9) - 0.2, tD = W('duplicate', L(9)), tP = W('new', L(9)), tN = W('neither', L(9));
      grow(root, t, t0, 0.45, { ...F.navRect(3) });
      [...kp.children].forEach((e, i) => S(e, { transform: `translateY(${(1 - settle(t, t0 + 0.2 + i * 0.06)) * 50}px)` }));
      rows.forEach((r) => { const on = r === dup ? tD - 0.1 : r === payee ? tP - 0.1 : t0 + 0.3 + rows.indexOf(r) * 0.05; S(r, { opacity: clamp((t - on) * 6), transform: `translateX(${(1 - settle(t, on)) * 80}px)` }); });
      [dup, payee].forEach((r, i) => { const tt = i ? tP : tD; S(r, { background: t > tt ? `rgba(239,68,68,${0.08 + 0.1 * bump(t, tt, tt + 0.6)})` : '' }); const a = q(r, 'am'); a.style.textDecoration = t > tN ? 'line-through' : 'none'; a.style.color = t > tN ? '#ef4444' : ''; });
      S(np, { display: 'inline-flex', transform: `scale(${pop(t, tN)})` });
    };
  });

  // ===== P6. Payments · PO-7744 pays on proof, minus the late credit =====
  F.scene(L(10) - 0.15, L(11) + 0.55, 15, (root) => {
    add(root, `<div>${header('Payments', 'Every dollar the agent has held, released, voided or refunded through PayPal — and why')}</div>`);
    const c = add(root, `<div class="card" style="left:340px;top:190px;width:1540px;height:846px;padding:32px 40px">
      <div style="display:flex;align-items:center;gap:14px">${K.LIGHT ? paypal(26) : paypalDark(26)}<b style="font-size:24px">PO-7744 · AeroCell Logistics</b>${pill('p-blue', 'Funds held')}<span class="mut" style="margin-left:auto;font-size:15px">Authorization held · $4,200</span></div>
      <div class="mut" style="margin-top:30px;font-size:13px;letter-spacing:.5px">THREE-WAY MATCH</div>
      <div style="display:flex;gap:16px;margin-top:12px">${['Purchase order', 'Invoice', 'Goods receipt + QC'].map((n) => `<div data-k="m" class="soft" style="flex:1;padding:20px 22px;display:flex;align-items:center;gap:14px;font-size:19px;font-weight:600"><span data-k="mc" style="width:38px;height:38px;border-radius:50%;background:rgba(34,197,94,.18);display:flex;align-items:center;justify-content:center">${ic('check', 21, '#22c55e', 2.6)}</span>${n}</div>`).join('')}</div>
      <div data-k="late" style="margin-top:24px;padding:20px 24px;border-radius:18px;background:rgba(245,158,11,.10);border:1px solid rgba(245,158,11,.3);display:flex;align-items:center;gap:16px;font-size:20px">${ic('clock', 24, '#f59e0b')}<b>Late-delivery credit</b><span class="mut">6 days × 5% / week</span><b style="margin-left:auto;color:#f59e0b;font-size:28px">−$180</b></div>
      <div style="margin-top:30px;display:flex;align-items:baseline;gap:18px"><span class="mut" style="font-size:18px">Captured</span><span data-k="cap" style="font-size:70px;font-weight:800;letter-spacing:-2px">$0</span><span class="mut" style="font-size:24px">of $4,200 held</span></div>
      <div class="bar" style="height:14px;border-radius:7px;margin-top:12px"><i data-k="cb" style="background:linear-gradient(90deg,#3b82f6,#22c55e)"></i></div>
      <div class="mono mut" style="font-size:14px;margin-top:10px">POST /v2/payments/authorizations/{id}/capture · final_capture: false</div>
      <div data-k="pay" style="margin-top:26px;padding:18px 24px;border-radius:18px;background:#fff;color:#1d2142;display:flex;align-items:center;gap:16px;font-size:19px">${paypal(22)}<b>Payout</b><span>${ic('lock', 18, '#0057c2')} verified payee email</span><span style="color:#556;font-size:15px">payee lock on</span><span class="pill" style="margin-left:auto;background:#dcfce7;color:#15803d">SUCCESS</span></div></div>`);
    const ms = qa(c, 'm'), mc = qa(c, 'mc');
    return (t) => {
      const t0 = L(10) - 0.15, tM = W('minus', L(10)), tL = W('late', L(10));
      grow(root, t, t0, 0.45, { x: 340, y: 700, w: 1540, h: 58, r: 10 });
      ms.forEach((m, i) => S(m, { transform: `translateY(${(1 - settle(t, t0 + 0.3 + i * 0.08)) * 40}px)` }));
      mc.forEach((m, i) => S(m, { transform: `scale(${pop(t, W('only', L(10)) + i * 0.22, 2.6, 0.55)})` }));
      S(q(c, 'late'), { transform: `translateX(${(1 - settle(t, tM - 0.1)) * -1600}px)` });
      const v = 4020 * ep(t, tM + 0.1, tL + 0.2, E.outCubic);
      q(c, 'cap').textContent = money(Math.round(v)); q(c, 'cb').style.width = `${(v / 4200) * 100}%`;
      S(q(c, 'pay'), { transform: `translateY(${(1 - settle(t, tL + 0.15)) * 260}px)`, opacity: clamp((t - tL - 0.15) * 5) });
    };
  });

  // ===== P7. PRJ-2041 · Money: budget envelope → Approvals card (real layout) =====
  F.scene(L(11) - 0.2, L(12) + 0.55, 16, (root) => {
    add(root, prjHeader('2041', 'Money'));
    const b = add(root, `<div class="card" style="left:340px;top:352px;width:1540px;height:200px;padding:24px 34px">
      <div style="display:flex;align-items:baseline;gap:14px"><span data-k="cm" style="font-size:44px;font-weight:800">$0</span><span class="mut" style="font-size:19px">committed of <b style="color:var(--ink)">$48,000</b> · budget envelope Nov–Jan</span><span class="mut" style="margin-left:auto;font-size:17px">forecast <b style="color:var(--ink)">$44,900</b></span></div>
      <div style="position:relative;height:32px;margin-top:22px;border-radius:10px;background:rgba(255,255,255,.06)">
        <i data-k="b1" style="position:absolute;left:0;top:0;bottom:0;border-radius:10px;background:linear-gradient(90deg,#5b6cf5,#8b5cf6)"></i>
        <i data-k="b2" style="position:absolute;top:0;bottom:0;border-radius:0 10px 10px 0;background:repeating-linear-gradient(45deg,rgba(239,68,68,.85) 0 10px,rgba(239,68,68,.55) 10px 20px)"></i>
        <div style="position:absolute;left:1470px;top:-12px;bottom:-12px;border-left:3px dashed #ef4444"></div></div>
      <div data-k="air" style="margin-top:12px;font-size:15px;color:#ef4444;font-weight:600;text-align:right">+ AeroCell air $9,855 would cross the envelope → needs a human code</div></div>`);
    const ap = add(root, `<div class="card" style="left:340px;top:572px;width:1540px;height:464px;padding:26px 30px">
      <div style="display:flex;align-items:center;gap:14px"><span class="icirc" style="background:rgba(236,72,153,.14)">${ic('shield', 19, '#ec4899')}</span><div><b style="font-size:21px">Release $9,855 to AeroCell Logistics?</b><div class="mut" style="font-size:14px">IC-450 · Instrument Clusters · PO-7742 · 7-inch automotive TFT</div></div><span class="pill p-violet" style="margin-left:auto"><i></i>pending</span></div>
      <div class="soft" style="margin-top:16px;padding:10px 14px;font-size:14px;width:1040px"><b>Why it's here:</b> $9,855 is above the agent's $5,000 authority limit. Only option landing before IC-450 due date. Funds will be held, not released, until goods are verified.</div>
      <table class="tbl" style="margin-top:14px;width:1040px;font-size:15px"><tr><th>Option</th><th>Supplier</th><th>Mode</th><th>Cost</th><th>Arrives</th><th>Score</th><th>Solver verdict</th></tr>
        <tr><td><b>AeroCell · air</b></td><td>AeroCell Logistics</td><td>AIR</td><td>$9,855</td><td>8 Nov</td><td><b>0.89</b></td><td>${pill('p-green', 'chosen')} <span class="mut" style="font-size:13px">only option landing before due date</span></td></tr>
        <tr><td><b>Lowcost Display · wait</b></td><td>Lowcost Display Co</td><td>SEA</td><td>$8,370</td><td>14 Nov</td><td><b>0.31</b></td><td>${pill('p-gray', 'viable')} <span class="mut" style="font-size:13px">cheaper, but pushes IC-450 one day late</span></td></tr></table>
      <div class="soft" style="position:absolute;right:30px;top:26px;width:400px;height:410px;padding:22px 24px">
        <div style="display:flex;align-items:center;gap:8px"><b style="font-size:17px">${ic('key', 16)} One-time code</b></div><div class="mut" style="font-size:13px;margin-top:6px">Sent to the project owner's email 1h ago. Expires in 23h.</div>
        <div style="display:flex;gap:8px;margin-top:22px">${[0, 1, 2, 3, 4, 5].map(() => `<div data-k="d" style="width:52px;height:64px;border-radius:12px;border:2px solid rgba(127,127,170,.35);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700"></div>`).join('')}</div>
        <div style="display:flex;align-items:center;gap:18px;margin-top:24px"><div data-k="btn" style="padding:14px 20px;border-radius:14px;background:linear-gradient(135deg,#7c5cf0,#4f6cf0);color:#fff;font-size:17px;font-weight:700">Approve &amp; hold funds ↗</div><span style="font-size:16px;font-weight:600">Reject</span></div>
        <div data-k="ok" class="pill p-green" style="margin-top:22px;font-size:15px;padding:9px 14px">${ic('check', 15)} Approved — funds held in PayPal</div></div></div>`);
    const ds = qa(ap, 'd'), CODE = '482913';
    return (t) => {
      const t0 = L(11) - 0.2, tB = W('budget', L(11)), tO = W('over', L(11)), tA = W('asks', L(11)), tc = L(12) - 0.35;
      grow(root, t, t0, 0.45, { ...F.navRect(1) });
      const v = 31420 * ep(t, t0 + 0.3, tB + 0.2, E.outCubic);
      q(b, 'cm').textContent = money(Math.round(v)); q(b, 'b1').style.width = `${(v / 48000) * 1470}px`;
      const over = ep(t, tO - 0.1, tO + 0.5, E.outCubic);
      S(q(b, 'b2'), { left: `${(31420 / 48000) * 1470}px`, width: `${over * (9855 + 4200) / 48000 * 1470}px` });
      S(q(b, 'air'), { opacity: over });
      S(ap, { transform: `translateY(${(1 - settle(t, tO + 0.2)) * 520}px)` });
      ds.forEach((d, i) => { const ti = tA - 0.35 + i * 0.1; d.textContent = t > ti ? CODE[i] : ''; d.style.borderColor = t > ti ? '#8b5cf6' : 'rgba(127,127,170,.35)'; });
      S(q(ap, 'btn'), { transform: `scale(${1 - 0.06 * bump(t, tc - 0.05, tc + 0.15)})` });
      S(q(ap, 'ok'), { display: 'inline-flex', transform: `scale(${pop(t, tc + 0.1)})` });
      F.cursor(t, tO + 0.3, L(12) + 0.4, [[tO + 0.3, 1300, 1060], [tA - 0.4, 1600, 880], [tc - 0.1, 1590, 1000], [tc + 0.15, 1590, 1000], [L(12) + 0.4, 1700, 1040]], [tc]);
    };
  });

  // ===== P8. Shipments: hidden shared sub-supplier =====
  F.scene(L(12) - 0.25, L(13) + 0.6, 17, (root) => {
    add(root, `<div>${header('Shipments', "Every inbound purchase order, where it really is, and whether the supplier's story matches the carrier's")}</div>`);
    const kp = add(root, `<div>${kpi(340, 370, 'truck', '#5b8cff', 'In transit', '4', 'tracked live', 'a')}${kpi(730, 370, 'clock', '#f59e0b', 'Delayed', '3', delta('33.3%', 1, 0, 'vs previous 24 h'), 'b')}${kpi(1120, 370, 'alert', '#ef4444', 'Claim ≠ carrier', '1', 'payment blocked', 'c')}${kpi(1510, 370, 'box', '#22c55e', 'Delivered & verified', '3', 'funds released', 'd')}</div>`);
    const gc = add(root, `<div class="card" style="left:340px;top:392px;width:1046px;height:644px"><div data-k="g" style="position:absolute;left:0;top:0"></div>
      <div style="position:absolute;left:28px;right:28px;top:22px">${cardHead('globe', 'Global view', 'Drag to spin · click an arc to open its project')}</div>
      <div style="position:absolute;left:28px;top:86px;display:flex;gap:8px">${pill('p-blue', 'COMP-131 · dual-sourced')}<span class="tag">Delta Connectors · Taoyuan</span><span class="tag">Kirin Components · Kobe</span></div>
      <div data-k="lbl" style="position:absolute;padding:12px 16px;border-radius:14px;background:rgba(239,68,68,.16);border:1px solid rgba(239,68,68,.5);font-size:18px;font-weight:700;color:#ef4444;white-space:nowrap">Penang Plating Works<div style="font-size:13px;font-weight:500">shared sub-supplier · S2</div></div></div>`);
    const SL = [['p-red', 'Claim ≠ carrier', 'COSCO Shipping', 'SEA', 'PO-7712 · Automotive MCU, 32-bit', 'Zhen Hua Electronics → Pune · SCU-700', 'Supplier: Dispatched 3 days ago', 'Carrier: Label created — no pickup', 0],
      ['p-blue', 'In transit', 'China Airlines Cargo', 'AIR', 'PO-7790 · Automotive MCU, 32-bit', 'Formosa Precision → Pune · SCU-700', 'Supplier: Departed TPE', 'Carrier: In flight · CI 6831', 38],
      ['p-blue', 'In transit', 'Gati Express', 'ROAD', 'PO-7715 · CAN connector, 12-pin', 'Western Components Ltd → Pune · SCU-700', 'Supplier: On truck MH-04', 'Carrier: Lonavala checkpoint', 71]];
    const list = add(root, `<div class="card" style="left:1406px;top:392px;width:474px;height:644px;padding:22px 22px">${cardHead('truck', 'Shipments', '13 shown')}
      ${SL.map(([pc, pl, car, md, tt, rt, s1, s2, v]) => `<div class="soft" style="margin-top:12px;padding:14px 16px;${pc === 'p-red' ? 'border-color:rgba(239,68,68,.45)' : ''}"><div style="display:flex;align-items:center;gap:8px;font-size:13px"><span class="pill ${pc}" style="font-size:12px;padding:3px 9px"><i></i>${pl}</span><span class="mut">${car}</span><b style="margin-left:auto">${md}</b></div>
        <div style="font-size:16px;font-weight:700;margin-top:8px">${tt}</div><div class="mut" style="font-size:13px">${rt}</div>
        <div style="display:flex;gap:8px;margin-top:8px;font-size:12px"><span class="soft" style="flex:1;padding:6px 8px">${s1}</span><span class="soft" style="flex:1;padding:6px 8px;${pc === 'p-red' ? 'color:#ef4444' : ''}">${s2}</span></div></div>`).join('')}</div>`);
    const tS = () => W('secretly', L(12));
    const RT = [
      { from: 'taoyuan', col: '#3b82f6', w: 3, prog: (t) => ep(t, L(12) + 0.1, L(12) + 1.2) },
      { from: 'kobe', col: '#3b82f6', w: 3, prog: (t) => ep(t, L(12) + 0.3, L(12) + 1.4) },
      { from: 'penang', to: 'taoyuan', col: '#ef4444', w: 2.4, nodot: true, prog: (t) => ep(t, W('hidden', L(12)), tS() + 0.2) },
      { from: 'penang', to: 'kobe', col: '#ef4444', w: 2.4, nodot: true, prog: (t) => ep(t, W('hidden', L(12)) + 0.15, tS() + 0.35) },
    ];
    const G = makeGlobe(1046, 644, 300, [-104, -14], RT);
    q(gc, 'g').appendChild(G.svg);
    const lbl = q(gc, 'lbl');
    return (t) => {
      const t0 = L(12) - 0.25;
      grow(root, t, t0, 0.45, { ...F.navRect(2) });
      [...kp.children].forEach((e, i) => S(e, { transform: `translateY(${(1 - settle(t, t0 + 0.2 + i * 0.06)) * 50}px)` }));
      S(list, { transform: `translateX(${(1 - settle(t, t0 + 0.4)) * 140}px)` });
      const z = lerp(300, 380, ep(t, t0, L(13) + 0.6, E.inOutSine));
      G.draw(t, { scale: z, rot: [-104 - 6 * ep(t, t0, L(13) + 0.6, E.inOutSine), -14], hot: 0 });
      const p = G.proj(K.LL.penang);
      S(lbl, { left: `${p[0] + 24}px`, top: `${p[1] - 20}px`, transform: `scale(${pop(t, tS())})`, transformOrigin: '0 50%' });
    };
  });

  // ===== P9. PRJ-2041 · Timeline (Bryntum Gantt layout): still ships on time =====
  F.scene(L(13) - 0.2, L(14) + 0.5, 18, (root) => {
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
      const t0 = L(13) - 0.2, ts = W('still', L(13)), tT = W('time', L(13));
      grow(root, t, t0, 0.45, { ...F.navRect(1) });
      bars.forEach((b, i) => {
        const x = +b.dataset.x, f = b.dataset.f, k = spring(t, ts - 0.25 + i * 0.04, 1.8, 0.8);
        const shift = f === 'shift' ? 1.2 * (1 - k) : 0; // production bars slide left into place once PO-7790 lands
        S(b, { left: `${X0 + (x + shift) * DX}px`, transform: `scaleX(${settle(t, t0 + 0.25 + i * 0.04)})`, transformOrigin: '0 50%', opacity: f === 'void' ? 0.55 : 1, backgroundImage: f === 'void' ? 'repeating-linear-gradient(45deg,rgba(255,255,255,.18) 0 6px,transparent 6px 12px)' : '' });
      });
      dias.forEach((d, i) => S(d, { transform: `rotate(45deg) scale(${pop(t, ts + 0.1 + i * 0.12)})` }));
      S(q(g, 'met'), { display: 'inline-flex', transform: `scale(${pop(t, tT)})` });
    };
  });
})();
