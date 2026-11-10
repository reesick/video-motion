// Crawl a live web app: screenshot every page reachable from nav links/buttons, dump visible text.
//   node tools/explore_site.mjs <url> <out_dir> [maxPages=30]
// Writes: <out>/NN_<slug>.png (full-page), <out>/dataset.json (url, title, headings, buttons, text per page)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [url, out, maxArg] = process.argv.slice(2);
const MAX = Number(maxArg || 30);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const origin = new URL(url).origin;
const data = [];
const seen = new Set();
let n = 0;

const slug = (s) => s.replace(/https?:\/\/[^/]+/, '').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').slice(0, 50) || 'home';
async function settle() { await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(Number(process.env.SETTLE || 2500)); }

async function capture(label) {
  n++;
  const name = `${String(n).padStart(2, '0')}_${slug(label)}`;
  await page.screenshot({ path: path.join(out, name + '.png'), fullPage: false });
  await page.screenshot({ path: path.join(out, name + '_full.png'), fullPage: true }).catch(() => {});
  const info = await page.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const txt = (sel) => [...document.querySelectorAll(sel)].filter(vis).map((e) => e.innerText.trim()).filter(Boolean);
    const css = getComputedStyle(document.body);
    return {
      url: location.href, title: document.title,
      headings: txt('h1,h2,h3,h4'),
      buttons: txt('button,[role=button]').slice(0, 80),
      links: [...document.querySelectorAll('a[href]')].filter(vis).map((a) => ({ text: a.innerText.trim(), href: a.href })).slice(0, 80),
      text: document.body.innerText.slice(0, 12000),
      bg: css.backgroundColor, fg: css.color, font: css.fontFamily,
    };
  });
  data.push({ label, file: name + '.png', ...info });
  console.log(`[${n}] ${label} -> ${info.url}`);
  return info;
}

await page.goto(url, { waitUntil: 'domcontentloaded' });
await settle();
const home = await capture('home');

// 1) follow same-origin links (nav)
const queue = home.links.filter((l) => l.href.startsWith(origin)).map((l) => l.href);
for (const href of queue) {
  if (n >= MAX) break;
  const key = href.split('#')[0];
  if (seen.has(key)) continue; seen.add(key);
  await page.goto(href, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await settle();
  const info = await capture(href);
  info.links.filter((l) => l.href.startsWith(origin)).forEach((l) => { if (!seen.has(l.href.split('#')[0])) queue.push(l.href); });
}

// 2) on the home page, click nav-like buttons that change the view (SPA tabs)
await page.goto(url, { waitUntil: 'domcontentloaded' }); await settle();
const labels = await page.evaluate(() => [...document.querySelectorAll('nav button, aside button, [role=tab], nav a, aside a')].map((e) => e.innerText.trim()).filter((t) => t && t.length < 40));
for (const lb of [...new Set(labels)]) {
  if (n >= MAX) break;
  const el = page.getByText(lb, { exact: true }).first();
  if (!(await el.isVisible().catch(() => false))) continue;
  await el.click({ timeout: 3000 }).catch(() => {});
  await settle();
  await capture('tab ' + lb);
}

fs.writeFileSync(path.join(out, 'dataset.json'), JSON.stringify(data, null, 1));
console.log('pages:', data.length);
await browser.close();
