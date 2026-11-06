// Flat vector characters, built from one parametric face so every person shares one style.
// person(opts) returns an SVG string (viewBox 0 0 200 200, circular background).
window.ASSETS = window.ASSETS || {};
(function () {
  const face = 'M68 92 C68 64 82 52 100 52 C118 52 132 64 132 92 L132 108 C132 133 118 147 100 147 C82 147 68 133 68 108 Z';

  const hairStyles = {
    quiff: (c) => `<path fill="${c}" d="M65 96 C58 62 74 38 104 39 C128 40 142 56 136 90 C133 76 128 68 120 64 C110 71 86 71 76 64 C70 72 67 82 65 96 Z"/><path fill="${c}" d="M78 50 C86 34 116 30 128 46 C118 42 98 44 86 54 Z"/>`,
    slick: (c) => `<path fill="${c}" d="M66 94 C62 60 78 42 102 42 C126 42 140 58 134 92 C132 78 126 70 116 66 C102 62 86 62 76 68 C70 76 67 84 66 94 Z"/>`,
    short: (c) => `<path fill="${c}" d="M66 92 C64 62 80 46 100 46 C122 46 136 60 134 92 C130 76 124 66 100 64 C78 66 70 76 66 92 Z"/>`,
    gray: (c) => `<path fill="${c}" d="M66 96 C62 76 66 60 76 56 C70 70 72 80 72 90 Z M134 96 C138 76 134 60 124 56 C130 70 128 80 128 90 Z M80 54 C90 46 112 46 122 54 C110 52 92 52 80 54 Z"/>`,
    long: (c) => `<path fill="${c}" d="M60 160 C48 120 50 70 70 52 C86 38 120 38 134 54 C152 74 152 126 140 160 C134 150 134 130 134 110 C134 84 128 70 118 64 C106 72 86 74 72 66 C66 80 66 96 66 112 C66 132 66 150 60 160 Z"/>`,
  };

  const beards = {
    full: (c) => `<path fill="${c}" d="M67 102 C69 130 82 150 100 151 C118 150 131 130 133 102 C129 116 124 122 117 124 C111 117 89 117 83 124 C76 122 71 116 67 102 Z"/>`,
    short: (c) => `<path fill="${c}" opacity=".9" d="M70 110 C74 132 86 146 100 147 C114 146 126 132 130 110 C126 120 120 126 114 127 C108 122 92 122 86 127 C80 126 74 120 70 110 Z"/>`,
    none: () => '',
  };

  const expressions = {
    neutral: (ink) => `<path d="M80 86 Q87 82 94 85 M106 85 Q113 82 120 86" stroke="${ink}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
      <circle cx="87" cy="96" r="3.4" fill="#22160f"/><circle cx="113" cy="96" r="3.4" fill="#22160f"/>
      <path d="M92 130 Q100 135 108 130" stroke="#7a3b2e" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    smile: (ink) => `<path d="M80 86 Q87 82 94 85 M106 85 Q113 82 120 86" stroke="${ink}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
      <path d="M83 97 Q87 93 91 97 M109 97 Q113 93 117 97" stroke="#22160f" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M89 127 Q100 138 111 127 Q100 131 89 127 Z" fill="#fff" stroke="#7a3b2e" stroke-width="2.2" stroke-linejoin="round"/>`,
    smug: (ink) => `<path d="M79 84 Q87 79 95 84 M105 86 Q113 84 121 86" stroke="${ink}" stroke-width="3.8" fill="none" stroke-linecap="round"/>
      <path d="M82 96 Q87 93 92 96 M108 96 Q113 93 118 96" stroke="#140d09" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M88 127 Q100 136 113 125 Q101 131 88 127 Z" fill="#fff" stroke="#5c2a20" stroke-width="2.2"/>`,
    confused: (ink) => `<path d="M77 87 Q85 77 95 84" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M105 90 Q113 88 122 92" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="86" cy="96" rx="3.6" ry="4.2" fill="#22160f"/>
      <path d="M107 98 Q114 95 121 98" stroke="#22160f" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M91 131 Q100 128 111 125" stroke="#6b2f24" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
    shocked: (ink) => `<path d="M77 80 Q86 70 95 78 M105 78 Q114 70 123 80" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="87" cy="95" r="6.2" fill="#fff"/><circle cx="113" cy="95" r="6.2" fill="#fff"/>
      <circle cx="87" cy="95" r="3.2" fill="#22160f"/><circle cx="113" cy="95" r="3.2" fill="#22160f"/>
      <ellipse cx="100" cy="131" rx="8" ry="10.5" fill="#5a1f1b"/><path d="M93 136 Q100 131 107 136 Q100 142 93 136 Z" fill="#d9665a"/>`,
  };

  function person(o) {
    const id = 'p' + Math.random().toString(36).slice(2, 8);
    const skin = o.skin || '#f0c39f';
    const shade = o.shade || '#d9a07c';
    const hair = o.hair || '#3a2a1f';
    const ink = o.brow || hair;
    let body = '';
    if (o.outfit === 'suit') {
      body = `<path fill="${o.shirt || '#1f2b4a'}" d="M22 204 C24 172 52 156 100 154 C148 156 176 172 178 204 Z"/>
        <path fill="#fff" d="M84 156 L100 186 L116 156 Z"/><path fill="#111" d="M96 162 L104 162 L106 194 L100 200 L94 194 Z"/>
        <path fill="#17213a" d="M84 156 L100 190 L74 172 Z M116 156 L100 190 L126 172 Z"/>`;
    } else if (o.outfit === 'sweater') {
      body = `<path fill="${o.shirt || '#2b2d33'}" d="M24 204 C26 172 54 156 100 154 C146 156 174 172 176 204 Z"/><path fill="${shade}" d="M86 152 Q100 166 114 152 L114 158 Q100 170 86 158 Z"/>`;
    } else if (o.outfit === 'top') {
      body = `<path fill="${o.shirt || '#e9e2d7'}" d="M30 204 C32 174 58 160 100 158 C142 160 168 174 170 204 Z"/><path fill="${skin}" d="M84 156 Q100 176 116 156 Z"/>`;
    } else {
      body = `<path fill="${o.shirt || '#9cc1dc'}" d="M22 204 C24 172 52 156 100 154 C148 156 176 172 178 204 Z"/>
        <path fill="#7fa8c7" d="M82 156 L100 178 L92 186 L74 166 Z M118 156 L100 178 L108 186 L126 166 Z"/>
        <path fill="#e9f1f7" d="M88 156 L100 176 L112 156 Z"/><circle cx="100" cy="190" r="2" fill="#6d93b0"/>`;
    }
    const arms = o.handsOnHead ? `
      <path d="M36 206 L52 116" stroke="${o.shirt || '#9cc1dc'}" stroke-width="28" stroke-linecap="round"/>
      <path d="M164 206 L148 116" stroke="${o.shirt || '#9cc1dc'}" stroke-width="28" stroke-linecap="round"/>` : '';
    const hands = o.handsOnHead ? `
      <g fill="${skin}" stroke="${shade}" stroke-width="1.5"><path d="M48 112 C44 96 50 74 62 66 C70 62 74 70 70 78 C74 76 78 82 74 90 C76 92 76 100 70 104 C66 110 58 116 48 112 Z"/>
      <path d="M152 112 C156 96 150 74 138 66 C130 62 126 70 130 78 C126 76 122 82 126 90 C124 92 124 100 130 104 C134 110 142 116 152 112 Z"/></g>` : '';
    const steeple = o.steeple ? `<g fill="${skin}" stroke="${shade}" stroke-width="1.5">
      <path d="M70 204 C72 186 82 172 94 166 C98 170 98 178 96 186 C92 194 86 200 84 204 Z"/>
      <path d="M130 204 C128 186 118 172 106 166 C102 170 102 178 104 186 C108 194 114 200 116 204 Z"/></g>` : '';
    const glasses = o.glasses ? `<g fill="none" stroke="#2b2b2b" stroke-width="2.6"><circle cx="87" cy="96" r="9"/><circle cx="113" cy="96" r="9"/><path d="M96 96 L104 96"/></g>` : '';
    return `<svg viewBox="0 0 200 200" width="100%" height="100%"><defs><clipPath id="${id}"><circle cx="100" cy="100" r="100"/></clipPath></defs>
      <g clip-path="url(#${id})"><rect width="200" height="200" fill="${o.bg || '#a9c6ca'}"/>
      ${o.hairStyle === 'long' ? hairStyles.long(hair) : ''}
      ${arms}${body}
      <path fill="${shade}" d="M86 126 L114 126 L116 160 Q100 170 84 160 Z"/>
      <ellipse cx="67" cy="104" rx="7" ry="10" fill="${shade}"/><ellipse cx="133" cy="104" rx="7" ry="10" fill="${shade}"/>
      <path fill="${skin}" d="${face}"/>
      <path d="M100 99 Q96 111 101 113" stroke="${shade}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      ${(beards[o.beard || 'none'])(o.beardColor || hair)}
      ${o.hairStyle === 'long' ? '' : (hairStyles[o.hairStyle || 'short'])(hair)}
      ${o.hairStyle === 'long' ? `<path fill="${hair}" d="M70 70 C80 54 120 50 132 70 C120 62 110 66 100 72 C92 64 80 64 70 70 Z"/>` : ''}
      ${(expressions[o.expression || 'neutral'])(ink)}${glasses}${hands}${steeple}</g></svg>`;
  }

  ASSETS.person = person;
  ASSETS.people = {
    ownerConfused: () => person({ bg: '#a9c6ca', hairStyle: 'quiff', beard: 'full', beardColor: '#4a3426', expression: 'confused' }),
    ownerShocked: () => person({ bg: '#bfe0ef', hairStyle: 'quiff', beard: 'full', beardColor: '#4a3426', expression: 'shocked', handsOnHead: true }),
    consultant: () => person({ bg: '#4fb3bf', skin: '#dcaa84', shade: '#bf8a64', hair: '#15100d', hairStyle: 'slick', beard: 'full', beardColor: '#1a1412', outfit: 'suit', expression: 'smug', steeple: true }),
    cameron: () => person({ bg: '#e7e3dc', skin: '#e2b08c', shade: '#c48f6b', hair: '#2a1d16', hairStyle: 'short', beard: 'short', outfit: 'sweater', expression: 'smile' }),
    donna: () => person({ bg: '#f6ddd2', skin: '#f3cdb3', shade: '#dba98a', hair: '#b4432a', hairStyle: 'long', outfit: 'top', shirt: '#f1ede6', expression: 'smile', brow: '#8c3320' }),
    martin: () => person({ bg: '#dde6ee', skin: '#efc6a6', shade: '#d3a283', hair: '#9b9b9b', hairStyle: 'gray', beard: 'short', beardColor: '#a5a5a5', outfit: 'sweater', shirt: '#4c6a86', expression: 'smile', glasses: true, brow: '#7d7d7d' }),
    andrew: () => person({ bg: '#e9e3d8', skin: '#f0c7a5', shade: '#d6a482', hair: '#6b4630', hairStyle: 'short', beard: 'short', beardColor: '#6b4630', outfit: 'sweater', shirt: '#8a9a5b', expression: 'neutral' }),
    // small crowd avatars for campaign approval stacks
    crowd: (i) => person([
      { bg: '#cfd8e3', hair: '#2a1d16', hairStyle: 'short', outfit: 'sweater', shirt: '#3b4a5c', expression: 'smile' },
      { bg: '#e8d5c9', skin: '#d9a47f', shade: '#bb8762', hair: '#1c1410', hairStyle: 'long', outfit: 'top', expression: 'smile' },
      { bg: '#d6e4d3', hair: '#5a3b26', hairStyle: 'quiff', beard: 'short', outfit: 'sweater', shirt: '#5b6b48', expression: 'neutral' },
      { bg: '#e3dcef', skin: '#c48b66', shade: '#a6704d', hair: '#120c09', hairStyle: 'short', beard: 'full', beardColor: '#120c09', outfit: 'sweater', shirt: '#30303a', expression: 'smile' },
    ][i % 4]),
  };
})();
