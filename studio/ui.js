// UI component builders. Each returns an HTML string; animated parts carry data-k="name"
// so film.js can grab them with q(root, 'name').
(function () {
  const A = window.ASSETS;
  const u = (s) => M.uniq(s);
  const logo = (n) => u(A.logo[n]);
  const photo = (n) => u(A.photo[n]());
  const face = (n) => u(A.people[n]());

  // ---- icons (24x24, stroke) ----
  const P = {
    home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
    reviews: 'M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.5 8.5 0 1 1 21 11.5z',
    social: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
    requests: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M8 11h8M8 15h8M8 19h5',
    reports: 'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6M9 9h2',
    pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    chat: 'M4 5h16v11H8l-4 4zM8 9h8M8 12.5h5',
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    team: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7.5M18 21v-1a6 6 0 0 0-3-5.2',
    billing: 'M3 6h18v12H3zM3 10h18M7 15h3',
    refresh: 'M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4',
    x: 'M6 6l12 12M18 6 6 18',
    more: 'M12 5.5v.01M12 12v.01M12 18.5v.01',
    moreH: 'M5.5 12h.01M12 12h.01M18.5 12h.01',
    heart: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.6A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
    phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
    bookmark: 'M6 3h12v18l-6-4-6 4z',
    dir: 'M12 2 22 12 12 22 2 12zM9 14v-3h5M12 8.5l2.5 2.5L12 13.5',
    cal: 'M4 5h16v16H4zM4 9h16M8 3v4M16 3v4',
    check: 'M5 12.5 10 17 19 7',
    up: 'M12 19V5M6 11l6-6 6 6',
    down: 'M12 5v14M6 13l6 6 6-6',
    chevR: 'M9 6l6 6-6 6',
    chevL: 'M15 6l-6 6 6 6',
    back: 'M15 5l-7 7 7 7',
    seo: 'M3 4h18v14H3zM3 8h18M7 12h5M7 15h3M15 11l3 3M14.5 13.5a2 2 0 1 0 0-.01',
    mobile: 'M7 2h10v20H7zM11 18h2M12 13.5s-3-1.8-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.8-3 3.8z',
    chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5',
    plus: 'M12 5v14M5 12h14',
    film: 'M4 4h16v16H4zM9 4v16M15 4v16',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    camera: 'M4 7h4l2-3h4l2 3h4v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  };
  const ic = (n, s = 20, c = 'currentColor', w = 1.8) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n]}"/></svg>`;
  const stars = (n = 5, s = 15, col = '#f6b400') => `<span class="stars">${Array.from({ length: 5 }, (_, i) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="${i < n ? col : '#ddd'}"/></svg>`).join('')}</span>`;
  const dots = (n = 4.5, s = 13) => `<span class="dots">${Array.from({ length: 5 }, (_, i) => `<i style="width:${s}px;height:${s}px;background:${i < Math.floor(n) ? '#00aa6c' : (i < n ? 'linear-gradient(90deg,#00aa6c 50%,#fff 50%)' : '#fff')}"></i>`).join('')}</span>`;
  const icon = (n, s) => `<span class="lg" style="width:${s}px;height:${s}px">${logo(n)}</span>`;

  // ---- Google search results card ----
  const RESULTS = {
    yours: { name: 'Your Business', r: '4.6', c: '(2K)', a: '123 Main St', p: 'interiorWood' },
    cucina: { name: 'Cucina Gustosa', r: '4.5', c: '(310)', a: '372 Main St', p: 'cafeColor' },
    gyro: { name: 'Gyro Heaven', r: '4.6', c: '(310)', a: '1147 Main St', p: 'barDark' },
  };
  function resultRow(k) {
    const d = RESULTS[k];
    return `<div class="rrow" data-k="row-${k}"><div class="rtxt"><div class="rname">${d.name}</div>
      <div class="rmeta">${d.r} ${stars(5, 15)} ${d.c} · $$ · 0.5 m</div><div class="rmeta">Restaurant · ${d.a}</div></div>
      <div class="rimg">${photo(d.p)}</div></div>`;
  }
  function searchCard(order = ['yours', 'cucina', 'gyro'], extra = true) {
    return `<div class="scard" data-k="scard"><div class="spill" data-k="spill">${icon('google', 24)}<span data-k="stext">Restaurants near me</span></div>
      <div class="rows" data-k="rows">${order.map(resultRow).join('')}</div>
      <div class="more" data-k="more">More places ${ic('chevR', 16)}</div>
      ${extra ? `<div class="best"><div class="btitle">Best places to eat</div><div class="bgrid"><div><div class="bimg">${photo('interiorWood')}</div><span>Your Business</span></div><div><div class="bimg">${photo('barDark')}</div><span>Cucina Gustosa</span></div></div></div>` : ''}</div>`;
  }

  // ---- Maps / Tripadvisor style profile phone card ----
  function mapsCard() {
    return `<div class="pcard maps"><div class="mhead"><b>Your Business</b>${ic('heart', 18, '#666')}</div>
      <div class="mrow">${dots(4.5)} <span class="mut">1,426 Reviews</span></div>
      <div class="mut sm">$$ - $$$, American, Greek, Diner</div><div class="mut sm">${ic('cal', 13)} Open now: 06:00 AM - 12:00 AM</div>
      <div class="mhero">${photo('pasta')}</div>
      <div class="micons">${['phone', 'map', 'globe', 'reviews'].map((n, i) => `<div>${ic(n, 20, '#333')}<span>${['Call', 'Map', 'Website', 'Review'][i]}</span></div>`).join('')}</div>
      <div class="msec"><b>Ratings and reviews</b><div class="mrow"><span class="big">4.5</span>${dots(4.5)}<span class="mut sm">1,426 Reviews</span></div>
      <div class="sm"><b>#1 of 20</b> American in New York</div><div class="sm"><b>#1 of 82</b> Restaurants in New York</div></div>
      <div class="msec"><div class="mut xs">RATINGS</div>${['Food', 'Service', 'Value', 'Atmosphere'].map((n) => `<div class="rat"><span>${n}</span>${dots(5, 11)}</div>`).join('')}</div></div>`;
  }

  // ---- Instagram profile phone card ----
  function igCard() {
    const tiles = ['salad', 'pasta', 'burger', 'pizza', 'steak', 'ramen', 'pancakes', 'tacos', 'breakfast', 'fruit', 'waffles', 'burger'];
    return `<div class="pcard ig"><div class="ihead">${ic('back', 18)}<b>your-business</b>${ic('moreH', 18)}</div>
      <div class="istats"><div class="iav">${photo('interiorWood')}</div>${[['743', 'Posts'], ['7.6K', 'Followers'], ['102', 'Following']].map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
      <div class="ibio"><b>Your Business</b><span>123 Main St, New York, NY 10016, 212-468-8100</span><span class="lnk">www.your-business.com</span></div>
      <div class="ibtn"><span class="f">Follow</span><span>Message</span><span class="s">+</span></div>
      <div class="itabs">${ic('grid', 18)}${ic('user', 18)}</div>
      <div class="igrid">${tiles.map((n) => `<div>${photo(n)}</div>`).join('')}</div>
      <div class="inav">${['home', 'search', 'plus', 'film', 'user'].map((n) => ic(n, 18)).join('')}</div></div>`;
  }

  // ---- Dashboard window ----
  const NAV = [['home', 'Dashboard'], ['reviews', 'Reviews'], ['social', 'Social'], ['requests', 'Review Requests'], ['reports', 'Reports'], ['pin', 'Locations'], ['chat', 'Chat']];
  const ORG = [['grid', 'Integrations'], ['team', 'Team'], ['billing', 'Billing']];
  const delta = (v) => `<span class="delta">${v} ${ic('up', 11, '#16a34a', 2.4)}</span>`;
  const tag = (v) => `<span class="tag">${v}</span>`;
  function stat(title, tg, value, body) {
    return `<div class="stat"><div class="sh"><b>${title}</b>${tag(tg)}</div><div class="sv">${value}</div>${body}</div>`;
  }
  const srow = (lg, v, d) => `<div class="srow">${icon(lg, 18)}<span>${v}</span>${delta(d)}</div>`;
  const kw = (a) => `<div class="kw">${a.map((x) => `<span>${x} <i>→</i></span>`).join('')}</div>`;

  const REVIEWS = [
    { k: 'donna', n: 'Donna Dina', av: 'donna', ago: '2 min ago', src: 'google', txt: 'The food is excellent but the portions are insane! One meatloaf dinner enough for 4 people! Waitstaff friendly and accommodating.' },
    { k: 'donald', n: 'Donald Glover', av: 'D', ago: '3 hours ago', src: 'facebook', txt: 'Love the new decor, great service fab food, friendly wait staff.' },
    { k: 'martin', n: 'Martin Skolnik', av: 'martin', ago: '7 hours ago', src: 'tripadvisor', txt: 'Food good. Large varied menu. Prices have risen but portions are large.' },
    { k: 'andrew', n: 'Andrew Reenan', av: 'andrew', ago: '1 day ago', src: 'yelpburst', txt: 'Delicious food and excellent friendly service. Highly recommend!' },
  ];
  const yelpBurst = `<svg viewBox="-24 -30 48 56" width="16" height="16"><g fill="#FF1A1A"><path d="M-2 -4 L-4 -26 Q0 -30 6 -27 L3 -5 Z"/><path d="M2 -1 L18 -13 Q22 -9 22 -3 L4 3 Z"/><path d="M3 4 L21 9 Q20 15 15 18 L1 7 Z"/><path d="M-1 6 L-2 24 Q-8 24 -12 20 L-4 5 Z"/><path d="M-5 2 L-21 7 Q-23 1 -21 -4 L-5 -2 Z"/></g></svg>`;
  function avatar(av, s) {
    if (av.length === 1) return `<span class="av init" style="width:${s}px;height:${s}px">${av}</span>`;
    return `<span class="av" style="width:${s}px;height:${s}px">${face(av)}</span>`;
  }
  function reviewRow(r) {
    return `<div class="rv" data-k="rv-${r.k}">${avatar(r.av, 42)}<div class="rvb"><b>${r.n}</b><span class="mut xs">Your Business</span>
      <div class="rvm">${stars(5, 14)}<span class="mut xs">${r.ago}</span>${r.src === 'yelpburst' ? yelpBurst : icon(r.src, 16)}</div>
      <p>${r.txt}</p></div></div>`;
  }
  function calendar() {
    const days = [];
    const prev = [26, 27, 28, 29, 30];
    prev.forEach((d) => days.push(`<span class="o">${d}</span>`));
    for (let d = 1; d <= 31; d++) days.push(`<span class="${d === 21 ? 'today' : ''}${[1, 6, 12, 23, 24, 30, 31].includes(d) ? ' dot' : ''}">${d}</span>`);
    for (let d = 1; d <= 6; d++) days.push(`<span class="o${d === 4 ? ' dot' : ''}">${d}</span>`);
    return `<div class="cal"><div class="calh"><b>December</b><span>${ic('chevL', 14, '#bbb')}${ic('chevR', 14, '#888')}</span></div>
      <div class="calg">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span class="wd">${d}</span>`).join('')}${days.join('')}</div></div>`;
  }
  const stack = () => `<div class="stack">${[0, 1, 2, 3].map((i) => `<span class="av" style="width:30px;height:30px">${u(A.people.crowd(i))}</span>`).join('')}</div>`;

  function dashboard() {
    return `<div class="win" data-k="win">
      <div class="top"><span class="wlogo" data-k="wlogo">Madison</span><span class="who">${avatar('cameron', 30)}<span>Cameron James</span></span></div>
      <div class="side" data-k="side"><div class="navhi" data-k="navhi"></div>
        ${NAV.map(([i, n]) => `<div class="nav" data-k="nav-${n}">${ic(i, 19)}<span>${n}</span></div>`).join('')}
        <div class="org">ORGANIZATION</div>
        ${ORG.map(([i, n]) => `<div class="nav" data-k="nav-${n}">${ic(i, 19)}<span>${n}</span></div>`).join('')}
      </div>
      <div class="main" data-k="main">
        <div class="pg" data-k="pg-dash">
          <div class="welcome" data-k="welcome">Welcome back, Cameron</div>
          <div class="stats" data-k="stats">
            ${stat('Rating', 'All time', `4.6 ${stars(5, 17)}`, `<div class="mut xs" style="margin:-6px 0 10px">Based on 2,436 reviews</div>${srow('facebook', '4', '+4.2%')}${srow('google', '4.6', '+7%')}`)}
            ${stat('Impressions', 'Nov 23', '34,589', `${delta('+16.7%').replace('delta', 'delta abs')}${kw(['restaurants in nyc', 'restaurants', 'best restaurants', 'restaurants near me'])}`)}
            ${stat('Actions', 'Nov 23', '5,431', `${delta('+16.7%').replace('delta', 'delta abs')}${kw(['Website visit', 'Direction', 'Calls', 'Menu visit'])}`)}
            ${stat('Followers', 'All time', '31,268', `${srow('facebook', '9,008', '+15.6%')}${srow('instagram', '22,260', '+21%')}`)}
            ${stat('Reach', 'Nov 23', '46,069', `${delta('+34%').replace('delta', 'delta abs')}${srow('facebook', '19,568', '+38%')}${srow('instagram', '26,501', '+31%')}`)}
            ${stat('Page Engagement', 'Nov 23', '953', `${delta('+9%').replace('delta', 'delta abs')}${srow('facebook', '481', '+9%')}${srow('google', '472', '+7%')}`)}
          </div>
          <div class="insights" data-k="insights"><div class="sh"><b>Insights for November</b><span class="mut xs">Show more</span></div>
            <div class="ins"><span>${ic('up', 14, '#16a34a', 2.2)} The staff is friendly, expert, and on point.</span><span>${ic('down', 14, '#e5322d', 2.2)} Long wait times</span></div></div>
          <div class="lower" data-k="lower">
            <div class="pend" data-k="pend"><div class="sh"><div><b class="h">Pending Reviews</b><div class="mut xs">Showing pending reviews across all locations</div></div><span class="mut xs">View all</span></div>
              <div class="rvlist" data-k="rvlist">${REVIEWS.map(reviewRow).join('')}</div></div>
            <div class="camp"><div class="sh"><b class="h">Campaigns</b><span class="mut xs">New Campaign</span></div>${calendar()}
              <div class="sched"><b>Scheduled</b>
                <div class="sc"><div class="sch"><b>Promote 5-star review for Your Business Name</b><span class="mut xs">Dec 24 8:00 AM</span></div><span class="mut xs">Your Business</span>${stack()}<span class="need">Needs Approval</span></div>
                <div class="sc"><div class="sch"><b>Christmas 2023</b><span class="mut xs">Dec 23 10:00 AM</span></div><span class="mut xs">Your Business</span>${stack()}</div></div></div>
          </div>
        </div>
        <div class="pg" data-k="pg-int" style="display:none">${integrations()}</div>
      </div></div>`;
  }

  // ---- Integrations page ----
  const INT = [
    { k: 'google', n: 'Google', acct: 'support@yourbusiness.com', col: 0 },
    { k: 'instagram', n: 'Instagram', acct: '@your_business', col: 0 },
    { k: 'tripadvisor', n: 'Tripadvisor', acct: '@yourbusiness', col: 0 },
    { k: 'facebook', n: 'Facebook', acct: 'Your Business', col: 1 },
    { k: 'twitter', n: 'Twitter', acct: '@your_business', col: 1 },
  ];
  function integrations() {
    return `<div class="intw"><div class="h1" data-k="int-title">Integrations</div><div class="mut" data-k="int-sub">Authorize Madison to manage your online presence</div>
      <div class="intg">${INT.map((d) => `<div class="ic" data-k="ic-${d.k}"><div class="ich">${icon(d.k, 24)}<b>${d.n}</b><span class="cbtn" data-k="cb-${d.k}">Connect</span></div>
        <div class="ica" data-k="ica-${d.k}"><span>${d.acct}</span><span class="rm">Remove</span></div></div>`).join('')}</div></div>`;
  }

  // ---- Invoice ----
  function invoice() {
    return `<div class="inv" data-k="inv"><div class="invt">$$$ Expensive Ineffective Marketing LLC.</div><span class="chip">May Invoice</span>
      <div class="invh"><b>Items</b><b>Line Total</b></div>
      ${['5 Social Media Posts', '5 Google Review Responses', '2 Social Media Stories'].map((n, i) => `<div class="invr" data-k="invr-${i}"><span>${n}</span><span data-k="amt-${i}">$0.00</span></div>`).join('')}
      <div class="invb"><b>Balance Due</b><span data-k="bal">$0.00</span></div></div>`;
  }

  // ---- Business profile panel (Google) ----
  function profile() {
    return `<div class="prof" data-k="prof"><div class="pfh"><div><div class="pft">Your Business</div><div class="mut xs">4.6 ${stars(5, 13)} (2,034) · $$ · Diner</div></div><span>${ic('more', 18, '#777')}${ic('x', 18, '#777')}</span></div>
      <div class="pfg" data-k="pfg"><div class="pf0" data-k="pf-0">${photo('interiorWood')}</div>${['fruit', 'storefront', 'breakfast', 'waffles', 'salad'].map((n, i) => `<div data-k="pf-${i + 1}">${photo(n)}</div>`).join('')}</div>
      <div class="pfa" data-k="pfa">${[['cal', 'Reserve a table'], ['globe', 'Website'], ['dir', 'Directions'], ['bookmark', 'Save'], ['phone', 'Call']].map(([i, n]) => `<span>${ic(i, 14, '#1a73e8')}${n}</span>`).join('')}</div>
      <div class="pftabs" data-k="pftabs"><span class="on">Overview</span><span>Menu</span><span>Reviews</span><i data-k="pftab-line"></i></div>
      <div class="pfs" data-k="pfs-0"><b>Service options:</b><div class="opts">${['Outdoor seating', 'Serves vegan dishes', 'Accepts reservations', 'Dine-in'].map((o) => `<span>${ic('check', 13, '#1a73e8', 2.4)} ${o}</span>`).join('')}</div></div>
      <div class="pfs" data-k="pfs-1"><b>Address:</b> <span data-k="addr">123 Main St, New York, NY 10016</span></div>
      <div class="pfs col" data-k="pfs-2"><b>From Your Business</b><span data-k="desc"></span></div>
      <div class="pfs col" data-k="pfs-3"><b>Social Profiles</b><div class="soc">${['instagram', 'facebook', 'twitter'].map((n) => `<span data-k="soc-${n}">${icon(n, 30)}</span>`).join('')}</div></div></div>`;
  }

  // ---- Review modal ----
  function modal() {
    const r = REVIEWS[0];
    return `<div class="modal" data-k="modal"><div class="mdin" data-k="mdin"><div class="mdh"><b>Review</b>${ic('x', 22, '#777')}</div>
      <div class="mdr">${avatar('donna', 46)}<div class="rvb"><b>${r.n}</b><span class="mut xs">Your Business</span><div class="rvm">${stars(5, 15)}<span class="mut xs">2 min ago</span>${icon('google', 18)}</div><p>${r.txt}</p></div></div>
      <div class="mdy"><span class="yav">${ic('user', 16, '#4f45e3', 2.2)}</span><b>Your Response</b>${ic('refresh', 18, '#888')}</div>
      <div class="mdt" data-k="mdt"><span data-k="resp"></span><span class="caret" data-k="caret"></span></div>
      <div class="mdb" data-k="submit">Submit Response</div></div></div>`;
  }

  window.UI = { ic, stars, dots, icon, logo, photo, face, searchCard, resultRow, mapsCard, igCard, dashboard, integrations, invoice, profile, modal, REVIEWS, INT, NAV, ORG, avatar };
})();
