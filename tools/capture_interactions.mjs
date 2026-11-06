// Press buttons / tabs on the live app and screenshot each resulting state (read-only clicks only).
//   node tools/capture_interactions.mjs <base_url> <out_dir>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [base, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const wait = async () => { await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {}); await page.waitForTimeout(2200); };
const texts = {};
let n = 0;
async function shot(name) {
  n++;
  const f = `${String(n).padStart(2, '0')}_${name}.png`;
  await page.screenshot({ path: path.join(out, f) });
  texts[f] = (await page.evaluate(() => document.body.innerText)).slice(0, 6000);
  console.log(f);
}
async function click(text, opts = {}) {
  const el = page.getByText(text, { exact: !!opts.exact }).first();
  if (!(await el.isVisible().catch(() => false))) { console.log('  (not visible)', text); return false; }
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await el.click({ timeout: 4000 }).catch((e) => console.log('  click failed', text, e.message));
  await wait();
  return true;
}

// Project PRJ-2041: every tab
await page.goto(base + '/projects/PRJ-2041'); await wait(); await shot('prj2041_overview');
for (const tab of ['Materials', 'Timeline', 'Money', 'Emails', 'Agent decisions']) {
  if (await click(tab)) await shot('prj2041_' + tab.toLowerCase().replace(/\s+/g, '_'));
}
// Agent board: open the critical incident card
await page.goto(base + '/agent'); await wait();
if (await click('Supplier claimed dispatch')) await shot('agent_incident_open');
await page.mouse.wheel(0, 700); await page.waitForTimeout(1200); await shot('agent_incident_scrolled');
// Approvals: focus the code boxes (no submit)
await page.goto(base + '/approvals'); await wait(); await shot('approvals');
// Audit: click a suggested query chip
await page.goto(base + '/audit'); await wait();
if (await click('every time SUP-21 lied and the refund that followed')) await shot('audit_query');
// Mission control lower half
await page.goto(base + '/'); await wait(); await page.mouse.wheel(0, 900); await page.waitForTimeout(1500); await shot('mission_lower');
// Shipments: Problems filter + click first card
await page.goto(base + '/shipments'); await wait();
if (await click('Problems', { exact: true })) await shot('shipments_problems');
await page.mouse.wheel(0, 900); await page.waitForTimeout(1500); await shot('shipments_lanes');
// Integrations
await page.goto(base + '/integrations'); await wait(); await shot('integrations');
// Warehouse + supplier portals (read-only views)
await page.goto(base + '/warehouse'); await wait(); await shot('warehouse_portal');
await page.goto(base + '/supplier/SUP-21'); await wait(); await shot('supplier_portal_sup21');

fs.writeFileSync(path.join(out, 'texts.json'), JSON.stringify(texts, null, 1));
await browser.close();
