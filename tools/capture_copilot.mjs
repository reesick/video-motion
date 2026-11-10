// Ask the live Copilot one of its own suggested questions (read-only tools) and capture the answer.
//   node tools/capture_copilot.mjs <base_url> <out_dir> "<question>"
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [base, out, qn] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const api = [];
page.on('response', async (r) => { if (r.url().includes('/api/copilot')) { try { api.push(await r.json()); } catch {} } });
await page.goto(base + '/team', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(6000);
await page.getByRole('button', { name: qn }).first().click({ timeout: 10000 });
for (let i = 0; i < 30 && !api.length; i++) await page.waitForTimeout(2000);
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(out, 'copilot.png') });
fs.writeFileSync(path.join(out, 'copilot.json'), JSON.stringify(api, null, 1));
console.log(api.length ? JSON.stringify(api[0]).slice(0, 1500) : 'no answer');
await browser.close();
