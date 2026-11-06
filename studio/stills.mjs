// Render single frames for review.  node studio/stills.mjs out_dir t1 t2 ...
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const [out, ...ts] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(pathToFileURL(path.resolve(process.env.STUDIO || 'studio/index.html')).href + '?theme=' + (process.env.THEME || 'dark') + '&intro=' + (process.env.INTRO || ''));
await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
for (const t of ts) {
  await page.evaluate((t) => window.seek(t), Number(t));
  const f = path.join(out, `t_${Number(t).toFixed(2).padStart(6, '0')}.png`);
  await page.screenshot({ path: f });
  console.log(f);
}
if (errs.length) console.log('PAGE ERRORS:\n' + errs.join('\n'));
await browser.close();
