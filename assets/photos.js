// Flat vector "photos" of restaurants and dishes. viewBox 160x120, fills its box (slice).
// Gradient ids use the token ID, replaced with a unique suffix by ASSETS.uniq() at insert time.
window.ASSETS = window.ASSETS || {};
(function () {
  const wrap = (body) => `<svg viewBox="0 0 160 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
  const plate = (cx, cy, r) => `<ellipse cx="${cx}" cy="${cy + 3}" rx="${r}" ry="${r * 0.72}" fill="rgba(0,0,0,.35)"/><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.72}" fill="#f4f1ec"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.78}" ry="${r * 0.56}" fill="#e7e2da"/>`;
  const wood = (a, b) => `<defs><linearGradient id="wID" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="160" height="120" fill="url(#wID)"/>
    <path d="M0 30 H160 M0 62 H160 M0 94 H160" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>`;

  ASSETS.photo = {
    interiorWood: () => wrap(`<defs><linearGradient id="gID" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a5530"/><stop offset="1" stop-color="#6b3a20"/></linearGradient></defs>
      <rect width="160" height="120" fill="url(#gID)"/>
      <g fill="#fff3dc">${[0, 1, 2, 3].map(i => `<rect x="${14 + i * 34}" y="10" width="26" height="54" rx="1"/>`).join('')}</g>
      <g stroke="#f7f1e8" stroke-width="2.4" fill="none">${[0, 1, 2, 3].map(i => `<rect x="${14 + i * 34}" y="10" width="26" height="54"/><path d="M${27 + i * 34} 10 V64 M${14 + i * 34} 28 H${40 + i * 34} M${14 + i * 34} 46 H${40 + i * 34}"/>`).join('')}</g>
      <rect y="64" width="160" height="56" fill="#5a2f19"/><rect y="64" width="160" height="5" fill="#7a4428"/>
      <g fill="#fbfaf7"><path d="M8 84 H62 L58 100 H12 Z"/><path d="M92 82 H150 L146 99 H96 Z"/></g>
      <g fill="#2e1a0f"><rect x="14" y="98" width="4" height="22"/><rect x="52" y="98" width="4" height="22"/><rect x="100" y="98" width="4" height="22"/><rect x="138" y="98" width="4" height="22"/>
      <path d="M66 74 h12 v22 h-3 v24 h-3 v-24 h-6 Z"/><path d="M80 76 h-10 v20"/></g>
      <g fill="#e9e1d4"><rect x="22" y="78" width="4" height="7" rx="1"/><rect x="40" y="78" width="4" height="7" rx="1"/><rect x="110" y="76" width="4" height="7" rx="1"/><rect x="130" y="76" width="4" height="7" rx="1"/></g>`),

    barDark: () => wrap(`<defs><radialGradient id="lID"><stop offset="0" stop-color="#ffd27a"/><stop offset=".35" stop-color="rgba(255,170,70,.55)"/><stop offset="1" stop-color="rgba(255,150,50,0)"/></radialGradient></defs>
      <rect width="160" height="120" fill="#1b110b"/><rect y="0" width="160" height="70" fill="#24170e"/>
      <g fill="#3a2414">${[0, 1, 2, 3, 4].map(i => `<rect x="${8 + i * 31}" y="14" width="24" height="44" rx="2"/>`).join('')}</g>
      <g fill="#c98a3c" opacity=".7">${[0, 1, 2, 3, 4].map(i => `<rect x="${11 + i * 31}" y="22" width="18" height="2"/><rect x="${11 + i * 31}" y="36" width="18" height="2"/>`).join('')}</g>
      ${[18, 50, 80, 110, 142].map(x => `<circle cx="${x}" cy="30" r="22" fill="url(#lID)"/><line x1="${x}" y1="0" x2="${x}" y2="26" stroke="#000" stroke-width=".8"/><circle cx="${x}" cy="28" r="3.2" fill="#ffe2a8"/>`).join('')}
      <rect y="72" width="160" height="16" fill="#6b3d1c"/><rect y="72" width="160" height="2.5" fill="#f2b45a"/>
      <rect y="88" width="160" height="32" fill="#120b07"/>
      <g fill="#3b2516">${[16, 46, 76, 106, 136].map(x => `<rect x="${x}" y="90" width="10" height="4" rx="2"/><rect x="${x + 4}" y="94" width="2" height="26"/>`).join('')}</g>`),

    cafeColor: () => wrap(`<rect width="160" height="120" fill="#24484d"/><rect x="0" y="0" width="70" height="120" fill="#2f5d62"/>
      <rect x="84" y="10" width="64" height="48" fill="#3c8a9b"/><rect x="84" y="10" width="64" height="48" fill="none" stroke="#1d3437" stroke-width="3"/>
      <path d="M116 10 V58" stroke="#1d3437" stroke-width="3"/>
      <g fill="#2e8b3f"><ellipse cx="22" cy="40" rx="16" ry="22"/><ellipse cx="38" cy="30" rx="12" ry="18" fill="#45a852"/><ellipse cx="12" cy="24" rx="9" ry="14" fill="#3d9a4b"/></g>
      <rect x="18" y="58" width="16" height="14" fill="#c8693a"/>
      <circle cx="74" cy="20" r="7" fill="#f6c445"/><line x1="74" y1="0" x2="74" y2="13" stroke="#111" stroke-width="1"/>
      <rect y="78" width="160" height="42" fill="#7a4a2a"/>
      <g fill="#b5763f"><rect x="10" y="80" width="54" height="5" rx="2"/><rect x="90" y="80" width="60" height="5" rx="2"/></g>
      <g fill="#e94f3d"><circle cx="30" cy="77" r="3"/><circle cx="118" cy="77" r="3" fill="#f1c232"/></g>
      <g fill="#f3e3c3"><rect x="44" y="72" width="6" height="7" rx="1"/><rect x="132" y="72" width="6" height="7" rx="1"/></g>`),

    pasta: () => wrap(`${wood('#4a3020', '#2a1a10')}${plate(80, 62, 50)}
      <g>${Array.from({ length: 26 }, (_, i) => { const a = i * 2.4, r = 6 + (i % 7) * 4.4; const x = 80 + Math.cos(a) * r * 1.2, y = 62 + Math.sin(a) * r * 0.62; return `<rect x="${x - 7}" y="${y - 2.6}" width="14" height="5.2" rx="2" fill="${i % 3 ? '#e9ad59' : '#f2c27a'}" transform="rotate(${(i * 47) % 180 - 90} ${x} ${y})"/>`; }).join('')}</g>
      <g fill="#fff6e5" opacity=".75"><circle cx="70" cy="56" r="4"/><circle cx="92" cy="66" r="3"/><circle cx="84" cy="52" r="2.5"/></g>
      <g fill="#3f8f3a"><ellipse cx="74" cy="62" rx="4" ry="2" transform="rotate(30 74 62)"/><ellipse cx="90" cy="58" rx="4" ry="2" transform="rotate(-20 90 58)"/><ellipse cx="82" cy="70" rx="3.5" ry="1.8"/></g>`),

    burger: () => wrap(`<rect width="160" height="120" fill="#2b2420"/><ellipse cx="80" cy="100" rx="56" ry="10" fill="#1a1512"/>
      <path d="M38 76 Q80 84 122 76 L120 92 Q80 100 40 92 Z" fill="#d79a4d"/>
      <path d="M36 70 Q80 78 124 70 L124 78 Q80 86 36 78 Z" fill="#5a2e17"/>
      <path d="M34 66 L126 66 L118 74 L106 68 L94 75 L82 68 L70 75 L58 68 L46 74 Z" fill="#f2c230"/>
      <path d="M38 62 Q80 70 122 62 L120 68 Q80 74 40 68 Z" fill="#5fae3c"/>
      <path d="M40 60 Q42 30 80 28 Q118 30 120 60 Q80 66 40 60 Z" fill="#e1a04f"/>
      <g fill="#fff2d6">${[[62, 40], [78, 36], [94, 41], [70, 48], [88, 50], [104, 48]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.3"/>`).join('')}</g>`),

    salad: () => wrap(`${wood('#5b3b26', '#3a2416')}${plate(80, 62, 50)}
      <g>${Array.from({ length: 16 }, (_, i) => { const a = i * 0.9, r = 8 + (i % 5) * 7; const x = 80 + Math.cos(a) * r * 1.1, y = 62 + Math.sin(a) * r * 0.55; return `<ellipse cx="${x}" cy="${y}" rx="11" ry="6" fill="${['#5fb046', '#7cc35a', '#3e8f35', '#9ad16e'][i % 4]}" transform="rotate(${i * 37} ${x} ${y})"/>`; }).join('')}</g>
      <g fill="#e2413a"><circle cx="70" cy="58" r="5"/><circle cx="94" cy="64" r="5"/><circle cx="82" cy="72" r="4.5"/></g>
      <g fill="#f4e7b5"><rect x="86" y="52" width="7" height="7" rx="1.5"/><rect x="66" y="68" width="7" height="7" rx="1.5"/></g>`),

    fruit: () => wrap(`<rect width="160" height="120" fill="#f1ece4"/>${plate(80, 64, 54)}
      <g>${[[60, 56], [76, 50], [94, 54], [68, 70], [86, 68], [102, 72], [56, 76]].map(([x, y], i) => `<path d="M${x} ${y - 10} C${x + 12} ${y - 10} ${x + 10} ${y + 6} ${x} ${y + 12} C${x - 10} ${y + 6} ${x - 12} ${y - 10} ${x} ${y - 10} Z" fill="${i % 3 === 2 ? '#c0182a' : '#e1272f'}"/><path d="M${x - 6} ${y - 10} L${x} ${y - 6} L${x + 6} ${y - 10} L${x} ${y - 13} Z" fill="#3c9a3a"/><g fill="#ffd9a0" opacity=".9"><circle cx="${x - 3}" cy="${y - 2}" r=".9"/><circle cx="${x + 3}" cy="${y + 1}" r=".9"/><circle cx="${x}" cy="${y + 5}" r=".9"/></g>`).join('')}</g>
      <circle cx="116" cy="52" r="12" fill="#f4f0e2"/><path d="M110 50 a6 6 0 0 1 12 0" fill="#e1272f"/>`),

    storefront: () => wrap(`<rect width="160" height="120" fill="#cfd8de"/><rect y="0" width="160" height="40" fill="#e3eaee"/>
      <rect x="18" y="30" width="124" height="70" fill="#8f9aa2"/><rect x="18" y="30" width="124" height="10" fill="#6e7880"/>
      <path d="M14 44 H146 L140 58 H20 Z" fill="#b8312f"/><path d="M14 44 H146 L140 58 H20 Z" fill="none" stroke="#fff" stroke-width="0" />
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${20 + i * 21} 58 L${30 + i * 21} 58 L${28 + i * 21} 52 L${22 + i * 21} 52 Z" fill="#fff" opacity=".85"/>`).join('')}
      <rect x="28" y="62" width="40" height="30" fill="#2c3a44"/><rect x="92" y="62" width="40" height="30" fill="#2c3a44"/><rect x="72" y="64" width="16" height="36" fill="#3d4a54"/>
      <g fill="#f6d27a" opacity=".55"><rect x="30" y="64" width="16" height="12"/><rect x="94" y="64" width="16" height="12"/></g>
      <rect y="100" width="160" height="20" fill="#7d8186"/><rect x="0" y="100" width="160" height="3" fill="#9aa0a5"/>
      <g fill="#4d8a3f"><circle cx="10" cy="88" r="10"/><circle cx="150" cy="88" r="10"/></g>`),

    breakfast: () => wrap(`<rect width="160" height="120" fill="#efe9df"/>${plate(80, 62, 50)}
      <ellipse cx="68" cy="58" rx="18" ry="13" fill="#fff"/><circle cx="68" cy="57" r="6" fill="#f5b522"/>
      <ellipse cx="94" cy="66" rx="16" ry="11" fill="#fff"/><circle cx="95" cy="65" r="5.4" fill="#f5b522"/>
      <rect x="78" y="40" width="26" height="16" rx="3" fill="#d39a54" transform="rotate(-12 91 48)"/>
      <g fill="#b33b2a"><rect x="58" y="74" width="22" height="5" rx="2.5" transform="rotate(8 69 76)"/><rect x="60" y="80" width="22" height="5" rx="2.5" transform="rotate(4 71 82)"/></g>
      <g fill="#4f9b45"><circle cx="104" cy="54" r="2.4"/><circle cx="108" cy="58" r="2"/></g>`),

    waffles: () => wrap(`${wood('#7a5338', '#4a2f1d')}${plate(80, 62, 48)}
      <rect x="54" y="42" width="52" height="40" rx="6" fill="#d9993f"/>
      <g stroke="#b77629" stroke-width="2.2">${[0, 1, 2, 3].map(i => `<path d="M${54 + 10.4 * (i + 1)} 42 V82 M54 ${42 + 8 * (i + 1)} H106"/>`).join('')}</g>
      <path d="M62 44 Q80 54 100 44 L98 50 Q80 60 64 50 Z" fill="#7b2f1a" opacity=".8"/>
      <g fill="#e2272f"><circle cx="70" cy="50" r="4"/><circle cx="92" cy="52" r="4"/></g><circle cx="82" cy="46" r="3.5" fill="#3b4fbf"/>`),

    ramen: () => wrap(`<rect width="160" height="120" fill="#1f1a17"/><ellipse cx="80" cy="66" rx="60" ry="40" fill="#b8321f"/><ellipse cx="80" cy="60" rx="54" ry="34" fill="#e18a3b"/>
      <g stroke="#f6dc8e" stroke-width="2.4" fill="none">${[0, 1, 2, 3, 4].map(i => `<path d="M${40 + i * 4} ${54 + i * 3} Q80 ${40 + i * 6} ${120 - i * 4} ${56 + i * 3}"/>`).join('')}</g>
      <circle cx="62" cy="54" r="9" fill="#fff"/><circle cx="62" cy="54" r="5" fill="#f2a516"/>
      <rect x="84" y="44" width="22" height="14" rx="3" fill="#8f4b2e"/><g fill="#3e9a3c"><circle cx="96" cy="70" r="3"/><circle cx="102" cy="66" r="2.6"/><circle cx="90" cy="72" r="2.6"/></g>
      <path d="M118 20 L94 60 M128 22 L102 62" stroke="#d8b26a" stroke-width="3" stroke-linecap="round"/>`),

    pizza: () => wrap(`${wood('#5b3a24', '#3a2416')}<circle cx="80" cy="62" r="46" fill="#d7923f"/><circle cx="80" cy="62" r="40" fill="#d83a26"/><circle cx="80" cy="62" r="38" fill="#f1d27b" opacity=".85"/>
      <g fill="#b52a1d">${[[66, 48], [92, 50], [78, 64], [62, 72], [96, 74], [84, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5"/>`).join('')}</g>
      <g fill="#3e8f35">${[[72, 56], [88, 62], [70, 80], [98, 60]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2"/>`).join('')}</g>
      <path d="M80 62 L80 16 M80 62 L120 84 M80 62 L40 84" stroke="#c07a33" stroke-width="1.2"/>`),

    steak: () => wrap(`<rect width="160" height="120" fill="#262120"/>${plate(80, 62, 52)}
      <path d="M52 50 Q60 36 86 40 Q112 44 110 62 Q106 80 80 80 Q54 78 52 64 Z" fill="#7a2e1c"/>
      <g stroke="#4a160c" stroke-width="3">${[0, 1, 2, 3].map(i => `<path d="M${60 + i * 12} 44 L${54 + i * 12} 76"/>`).join('')}</g>
      <g fill="#f1c84b"><rect x="94" y="70" width="5" height="18" rx="2" transform="rotate(30 96 79)"/><rect x="102" y="66" width="5" height="18" rx="2" transform="rotate(20 104 75)"/><rect x="108" y="70" width="5" height="16" rx="2" transform="rotate(40 110 78)"/></g>
      <g fill="#4f9b45"><circle cx="58" cy="78" r="3"/><circle cx="64" cy="82" r="2.6"/></g>`),

    tacos: () => wrap(`<rect width="160" height="120" fill="#2a2321"/>
      ${[[52, 64], [96, 60]].map(([x, y]) => `<path d="M${x - 30} ${y + 14} Q${x} ${y - 40} ${x + 30} ${y + 14} Z" fill="#f0c063"/><path d="M${x - 24} ${y + 8} Q${x} ${y - 24} ${x + 24} ${y + 8} Z" fill="#8a3a1e"/><g fill="#6bb54a"><circle cx="${x - 10}" cy="${y - 2}" r="4"/><circle cx="${x + 6}" cy="${y - 6}" r="4"/></g><g fill="#e2413a"><circle cx="${x}" cy="${y + 2}" r="3"/><circle cx="${x + 12}" cy="${y + 2}" r="3"/></g><g fill="#fff"><circle cx="${x - 4}" cy="${y - 8}" r="2"/></g>`).join('')}
      <ellipse cx="132" cy="96" rx="14" ry="8" fill="#a2321e"/>`),

    pancakes: () => wrap(`${wood('#6c4a33', '#3d281a')}${plate(80, 72, 48)}
      ${[0, 1, 2, 3].map(i => `<ellipse cx="80" cy="${70 - i * 8}" rx="34" ry="11" fill="#c47a31"/><ellipse cx="80" cy="${68 - i * 8}" rx="34" ry="10" fill="#e3a656"/>`).join('')}
      <path d="M58 44 Q80 36 102 44 Q104 54 96 60 Q92 52 80 52 Q70 52 64 58 Q56 52 58 44 Z" fill="#7a3a12" opacity=".85"/>
      <rect x="72" y="34" width="16" height="9" rx="2" fill="#fff4c8"/>`),
  };
})();
