// Render the film: 60 fps, SUB sub-frames per frame blended with ffmpeg tmix (motion blur),
// split across parallel Chromium pages, encoded with NVENC, then concatenated.
//   node studio/render.mjs [t0=0] [t1=DURATION] [workers=4] [sub=4] [out=output/video_silent.mp4]
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const FPS = 60;
const SHUTTER = 0.5; // 180-degree shutter: sub-frames span half a frame
const [a0, a1, aw, as, aout] = process.argv.slice(2);
const WORKERS = Number(aw || 4), SUB = Number(as || 4);
const OUT = aout || 'output/video_silent.mp4';
const LOG = process.env.RENDER_LOG || 'output/render.log';
const tmp = path.resolve(process.env.SEGMENTS || 'output/_segments');
fs.mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const url = pathToFileURL(path.resolve(process.env.STUDIO || 'studio/index.html')).href + '?theme=' + (process.env.THEME || 'dark') + '&intro=' + (process.env.INTRO || '');

async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', (e) => console.error('PAGE ERROR', e));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
  return page;
}

const probe = await openPage();
const DUR = await probe.evaluate(() => window.DURATION);
await probe.close();
const T0 = Number(a0 || 0), T1 = Number(a1 || DUR);
const F0 = Math.round(T0 * FPS), F1 = Math.round(T1 * FPS);
const per = Math.ceil((F1 - F0) / WORKERS);
const started = Date.now();
let done = 0;

async function worker(w) {
  const fa = F0 + w * per, fb = Math.min(F1, fa + per);
  if (fa >= fb) return null;
  const page = await openPage();
  const seg = path.join(tmp, `seg_${String(w).padStart(2, '0')}.mp4`);
  const vf = SUB > 1 ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB` : 'null';
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-c:v', 'mjpeg', '-i', '-',
    '-vf', vf, '-r', String(FPS), '-c:v', 'h264_nvenc', '-preset', 'p6', '-tune', 'hq', '-rc', 'vbr', '-cq', '15', '-b:v', '0', '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = fa; f < fb; f++) {
    for (let s = 0; s < SUB; s++) {
      const t = (f + (SUB > 1 ? (s / (SUB - 1) - 0.5) * SHUTTER : 0)) / FPS;
      await page.evaluate((t) => window.seek(t), Math.max(0, Math.min(DUR - 1e-4, t)));
      const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    done++;
    if (done % 6 === 0 || done === F1 - F0) {
      const total = F1 - F0, el = (Date.now() - started) / 1000, rate = done / el;
      const k = done / total, W = 40, fill = Math.round(k * W);
      const eta = Math.max(0, (total - done) / rate);
      const line = `[${'#'.repeat(fill)}${'-'.repeat(W - fill)}] ${(k * 100).toFixed(1).padStart(5)}%  ${done}/${total} frames  ${rate.toFixed(1)} fps  elapsed ${el.toFixed(0)}s  eta ${Math.floor(eta / 60)}m${String(Math.round(eta % 60)).padStart(2, '0')}s`;
      process.stdout.write('\r' + line);
      if (done % 600 === 0) fs.appendFileSync(LOG, line + '\n');
    }
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await page.close();
  return seg;
}

fs.mkdirSync('output', { recursive: true });
fs.writeFileSync(LOG, `render ${T0}-${T1}s, ${F1 - F0} frames, ${WORKERS} workers, ${SUB} subframes\n`);
console.log(`rendering ${T0}-${T1}s: ${F1 - F0} frames x ${SUB} subframes on ${WORKERS} workers`);
const segs = (await Promise.all([...Array(WORKERS).keys()].map(worker))).filter(Boolean);
await browser.close();
const list = path.join(tmp, 'list.txt');
fs.writeFileSync(list, segs.map((s) => `file '${s.replace(/\\/g, '/')}'`).join('\n'));
spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', OUT], { stdio: 'inherit' });
process.stdout.write('\n');
fs.appendFileSync(LOG, `done -> ${OUT}\n`);
console.log(`wrote ${OUT} in ${((Date.now() - started) / 1000).toFixed(0)}s`);
