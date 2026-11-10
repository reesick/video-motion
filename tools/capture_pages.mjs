// Read-only capture of specific routes: waits for network idle + settle, screenshots, visible text, and every
// JSON response from /api/ (exact data the UI renders).  node tools/capture_pages.mjs <base_url> <out_dir> route1 ...
// On /team it also clicks each incident thread (read-only) to load its trail.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [base, out, ...routes] = process.argv.slice(2);
fs.mkdirSync(path.join(out, 'api'), { recursive: true });
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
let k = 0;
page.on('response', async (res) => {
  const u = res.url();
  if (!u.includes('/api/') || res.request().method() !== 'GET') return;
  try { const j = await res.json(); fs.writeFileSync(path.join(out, 'api', `${String(++k).padStart(3, '0')}_${u.split('/api/')[1].replace(/[^a-z0-9]+/gi, '_').slice(0, 60)}.json`), JSON.stringify(j, null, 1)); } catch {}
});
const settle = async (ms) => { await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await page.waitForTimeout(ms); };
const data = {};
for (const r of routes) {
  const name = r.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home';
  await page.goto(base + r, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await settle(Number(process.env.SETTLE || 8000));
  await page.screenshot({ path: path.join(out, name + '.png') });
  data[r] = await page.evaluate(() => document.body.innerText);
  console.log('captured', r, data[r].length);
  if (r === '/team') {
    const items = page.locator('button:has-text("INC-"), [role=button]:has-text("INC-"), li:has-text("INC-")');
    const n = Math.min(await items.count(), 8);
    for (let i = 0; i < n; i++) {
      await items.nth(i).scrollIntoViewIfNeeded().catch(() => {});
      await items.nth(i).click({ timeout: 5000 }).catch(() => {});
      await settle(3500);
      await page.screenshot({ path: path.join(out, `team_thread_${i}.png`) });
      data[`/team#${i}`] = await page.evaluate(() => document.body.innerText);
    }
  }
}
fs.writeFileSync(path.join(out, 'texts.json'), JSON.stringify(data, null, 1));
await browser.close();
