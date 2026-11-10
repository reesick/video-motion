# Code-built launch video: the reusable playbook

This is the whole process we used for two films, broken into small steps you can follow without thinking:
1. **Madison remake** (`studio/`): recreate a reference video frame by frame, keeping only its voice.
2. **DisruptionOps launch film** (`alos/`): an original 74 s product film for a hackathon, in a dark and a light theme.

It is `1.md` turned into a checklist: every frame is HTML drawn by `seek(t)`, Playwright screenshots it,
ffmpeg turns the frames into an mp4. No After Effects, no editor, no subscriptions.

```
 PHASE A  Understand         PHASE B  Plan              PHASE C  Build            PHASE D  Ship
 ───────────────────         ─────────────              ─────────────             ─────────────
 A1 Reference teardown       B1 Product brief           C1 Studio + engine        D1 Stills review
 A2 Product research         B2 Script (VO lines)       C2 Shell + components     D2 Test render (2 s)
 A3 Audio teardown           B3 Voice-over + timing     C3 Scenes from beat map   D3 Full render
                             B4 Beat map                C4 Sound cues             D4 Mix + mux
                             B5 Design guidelines       C5 Theme variants         D5 Side-by-side + notes
```

Time from zero, for a 60–75 s film: about 1 h of research, 1 h of planning, 2–3 h of building, and 12 min per render.

---

## 0. One-time setup (≈10 min)

| Need | Install | Check |
|---|---|---|
| ffmpeg with NVENC (GPU encode) | `scoop install ffmpeg` | `ffmpeg -encoders \| findstr nvenc` |
| Python 3.11 | python.org | `python --version` |
| Python packages | `pip install numpy pillow soundfile faster-whisper edge-tts demucs` | `python -c "import faster_whisper, edge_tts"` |
| PyTorch (for demucs) | `pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu` | `python -c "import torch"` |
| Node 18+ and Playwright | `npm i -D playwright d3@7 topojson-client@3 world-atlas@2` then `npx playwright install chromium` | `npx playwright --version` |

**Gotcha:** if `pip show torch` works but `import torch` fails, the install is broken. Reinstall with `--force-reinstall --no-deps`.

---

## Folder layout (copy this for every new film)

```
<project>/
  docs/         DATASET.md  SCRIPT.md  BEAT_MAP.md  DESIGN_GUIDELINES.md  vo_lines.txt  cues.json  transcript.json
  research/     shots/ (page screenshots)  clicks/ (button states)  repo/ (cloned code)  user_samples/
  assets/       fonts, music, world.js, d3, topojson
  audio/vo/     L01.mp3 …  voiceover.wav  lines.json
  studio/       index.html (styles + theme)  core.js (helpers)  film_a.js (hook/problem/meet)  film_ui.js (app shell + product pages)  film_b.js (numbers/end/seek)  timing.js (generated)
  output/       stills/  review/  video_silent_<theme>.mp4  soundtrack.wav  <name>.mp4  render_<theme>.log
  make.ps1      one command: audio → render → mux
```
Shared tools live in the workspace root: `tools/` (Python) and `studio/lib.js`, `studio/render.mjs`, `studio/stills.mjs` (engine).

---

# PHASE A: Understand

## A1. Reference teardown (only if you are copying a video's feel)

**Goal:** know what happens on every beat, how each scene turns into the next, the camera, colours and fonts.

```powershell
ffmpeg -i reference.mp4 -vf "fps=2,scale=640:-1" -q:v 3 reference/frames/f_%04d.jpg
python tools/contact_sheet.py reference/frames reference/sheets 2 4 4          # 16 frames = 8 s per sheet, timestamped
python tools/grab_stills.py reference.mp4 reference/stills 0.4 8.0 11.0 18.0   # full-res stills in 2x2 grids
```
Then read every sheet and write one line per beat: time, what is on screen, **what it turns into**.

Colours: sample a still, don't guess.
```powershell
python -c "from PIL import Image; im=Image.open('reference/stills/still_011.00.png').convert('RGB'); print('#%02x%02x%02x'%im.getpixel((10,10)))"
```
**Output:** `docs/DESIGN_GUIDELINES.md` (format, colour tokens, type, components, motion rules).

## A2. Product research (every film)

**Goal:** every number and name in the film is real.

```powershell
git clone --depth 1 <repo> research/repo
node tools/explore_site.mjs <live_url> research/shots 30          # screenshots every page + dataset.json (text, buttons, colours)
node tools/capture_interactions.mjs <live_url> research/clicks     # clicks tabs/cards (read-only) and screenshots each state
python tools/tile_images.py research/shots research/review         # 2x2 grids to look through fast
```
- **Never press buttons that write data** (e.g. "Inject event", "Approve"). Ask the owner first.
- **Check the docs are current.** Compare the README against the live app and `git log`. In DisruptionOps the README still said ₹ prices and "no map tiles" while the live app used $ + PayPal and a Mapbox globe. **The live app wins.**
- If the owner sends screenshots (e.g. dark mode), they override yours. Sample their colours.

**Output:** `docs/DATASET.md` with brand, colours, screens and real numbers, each with its source.

## A3. Audio teardown (only when reusing a reference voice)

```powershell
ffmpeg -i reference.mp4 -vn -ac 2 -ar 44100 audio/original_mix.wav
python -m demucs --two-stems=vocals -n htdemucs -o audio/separated audio/original_mix.wav   # vocals.wav = voice only
python tools/transcribe.py audio/separated/htdemucs/original_mix/vocals.wav docs/transcript.json medium.en
python tools/words.py docs/transcript.json 60
python tools/analyze_audio.py audio/separated/htdemucs/original_mix/no_vocals.wav 0 58   # tempo + SFX hits of the reference
```
**Cut point:** pick a silence between sentences by measuring RMS, never mid-word.

---

# PHASE B: Plan

## B1. Product brief from the owner (the most important step)

Don't invent facts. Send the owner **`alos/docs/FRIEND_BRIEF.md`** (a fill-in template) and get it back filled in.
It asks for, in fixed tables:
1. project basics (name and pronunciation, tagline, team, URLs, user)
2. the problem in the user's words, plus one story we can dramatize
3. industry numbers with a source link each, and which one opens the film
4. integrations and APIs (for a sponsor hackathon: every endpoint, trigger, demo ID, and why it matters)
5. the product's moves: screen, exact on-screen moment, real data
6. stack · 7. results numbers · 8. ranked highlights · 9. optional draft beats

**Example:** `alos/docs/BRIEF.md` was the final brief. Every number in the film comes from it.

## B2. Script (the voice-over lines)

The shape that works, from `1.md` and the Madison reference:

**hook number → pain → "Meet <product>" → 5–8 proof beats on the real UI → result numbers → tagline + logo**

Rules:
- One idea per line, at most 15 words. Spell numbers the way they should be read ("two point three million", "one ninety-two").
- **More product than problem.** Feedback on the first cut was "more about product would be better". Keep the problem under 25% of the run time; in v2 it's 18 of 74 s.
- Write the lines in `docs/vo_lines.txt`. A line `|0.4` adds 0.4 s of extra pause before the next line.

## B3. Voice-over and timing

**Option 1 (free, instant):** edge-tts, one clip per line, measured and laid on a timeline.
```powershell
python tools/tts_lines.py docs/vo_lines.txt audio/vo en-US-AvaNeural "+4%" 0.38 0.5
#                         lines            out       voice           rate  gap  lead-in
python tools/transcribe.py audio/vo/voiceover.wav docs/transcript.json small.en     # word timings
```
**Option 2 (most expressive):** Fish Audio Drama 3. It allows at most **500 characters per generation**, takes
`[direction]` tags and `<emphasis>` tags, and costs money. Split the script into chunks under 500 characters
(`alos/docs/fish_chunks.txt`), generate each with the same voice, then join them:
```powershell
python tools/join_vo.py audio/vo/fish_voiceover.wav 0.45 0.6 fish_01.wav fish_02.wav ...
```
**Export timing to the film** (scenes read `VO.lines[i].start` and word times, so they follow the voice):
```powershell
python -c "import json;d=json.load(open('audio/vo/lines.json'));w=json.load(open('docs/transcript.json'));open('studio/timing.js','w').write('window.VO='+json.dumps(d)+';\nwindow.WORDS='+json.dumps([x for s in w['segments'] for x in s['words']])+';')"
```
**Trim the start** (a slow intro) by shifting the VO and every timestamp together. The v2 intro was cut 0.3 s this way.

## B4. Beat map

One row per beat. **Every row must name its handoff.** That is how you get "no cuts".

```
| # | Time (s) | Voice-over (exact words) | On screen | Cursor / button | Handoff into next beat |
```
Example rows (DisruptionOps v2):

| # | Time | VO | On screen | Cursor | Handoff |
|---|---|---|---|---|---|
| 1 | 0.2–4.2 | "One hour of downtime in a car plant costs $2.3M." | Every digit spins and **all lock on "million"** | — | Number shrinks up; the card grows out of the bar |
| 4 | 17.7–20.6 | "Meet DisruptionOps." | Violet flood, logo pops, wordmark rises letter by letter | — | The violet field contracts into the sidebar |
| 8 | 33.6–41.2 | "…the PayPal hold is voided." | Supplier says vs carrier says → Contradiction → **$5,880 VOIDED** | Clicks PO-7712 | Clicks Payments in the sidebar |

**Output:** `docs/BEAT_MAP.md`.

## B5. Design guidelines

Write the tokens once and use them everywhere: canvas, card, line, ink 1/2/3, brand gradient, status colours, font,
radii, shadows. One font (Inter or Outfit). Light and dark sets if you need both (see C5).

---

# PHASE C: Build

## C1. Studio and engine (reuse, don't rewrite)

- `studio/lib.js`: pure functions of time. Easings, `spring()` (closed-form), `springSteps()` (one value, many targets), `keys()`, `camera()` (zoom in log space), `typed()` (human typing).
- `<project>/studio/core.js`: project helpers:
  - `grow()`: a layer's clip grows out of a rect (the shape-change handoff)
  - `rise()`: text rises out of a mask
  - `roller()`: slot-machine digits that all lock on one frame
  - `makeGlobe()`: d3 orthographic globe with glowing routes
  - `W('word')`: the time a word is spoken
  - `cpath()` / `press()`: cursor paths and clicks
  - `retheme()`: light-theme colour remap
- `index.html`: all CSS, theme switch (`?theme=light`), loads fonts **before** building the film.

**The one rule:** everything visible is computed from `t` inside `update(t)`. No CSS transitions, no timers, no state
carried between frames. That is what makes renders deterministic and lets workers render in parallel.

## C2. Shell and components (match the real UI exactly)

Rebuild the product UI as HTML: sidebar, top bar, KPI cards, tables, pills, globe. Copy names, numbers and layout
from the research screenshots; nothing is screenshotted into the film.
- Copy every label word for word (page titles, subtitles, nav items, sidebar card, KPI labels and sub-lines, table columns).
- Use only IDs and amounts that appear in the live app or the owner's brief. If a value is unknown, show fewer rows; never invent one.
- Measure the geometry from the owner's screenshot (sidebar 300 px, nav pitch 47.5 px, KPI cards 370 px with 20 px gaps).
- Check side by side: put our still next to the real screenshot (`tools/tile_images.py`) for every page before rendering.

## C3. Scenes from the beat map

One `F.scene(t0, t1, zIndex, build)` per beat-map row. `build(root)` makes the DOM once and returns `update(t)`.
Anchor every time to the voice: `L(n)` = start of line n, `W('blocked', L(7))` = when "blocked" is spoken.

The motion vocabulary (`1.md` step 5, "what makes it look expensive"):
1. **Nothing fades in. Things change shape.** Use `grow()` from the clicked element, card → page, pill → card.
2. **No cuts.** Each scene starts from an element of the previous one (the beat-map handoff).
3. **Something on every beat.** No hold over 1 s; idle things drift ±4–6 px.
4. **Springs on landings** (`pop`, `settle`), with a small overshoot.
5. **One camera move at a time**, never reversing.
6. **A real sound on every event** (C4).
7. **Check your own work** (D1).

Numbers that count up: use `roller()` so every digit moves, and lock them all on one frame, on a spoken word.

## C4. Sound cues

Free music and SFX from Mixkit (`tools/mixkit.py list <page>` / `get <url> <out>`), measured with `tools/sfx_probe.py`.
Mixkit can return 403 for scripted downloads; reuse what's already in `assets/audio/sfx/`.

Cues are **generated from the word timings** (`tools/alos_cues.py`), so they follow the voice after any re-record:
```python
add("thump.wav", W("voided", L[7]), -8)   # hit on the spoken word
roll_ticks(0.06, LOCK1, 22, -24)           # ticks that slow down with the digits, then
add("thump.wav", LOCK1, -15)               # one subtle hit when all digits lock
```
`tools/mix_audio.py` puts each SFX's **loudest sample on its cue time**, ducks the music under the voice, and
loudness-normalises to **-14 LUFS / -1 dBTP**.

## C5. Theme variants (dark / light)

- CSS tokens live in `:root`; a `body.light` block overrides them.
- Runtime colours (globe, end card, flood) come from `K.C`.
- Inline dark colours in scene HTML are remapped by `K.retheme()`. Scenes that should stay the same in both themes, like the violet "Meet" flood, get `data-keep`.
- Render a theme with `THEME=light`. `make.ps1 -Theme light|dark|both` does it for you.

---

# PHASE D: Ship

## D1. Stills review (do this after every change)

```powershell
$env:STUDIO='alos/studio/index.html'; $env:THEME='dark'
node studio/stills.mjs alos/output/stills 2.5 8.5 16.5 23.5 33.4 40.6 50.5 62.7 72.5   # prints PAGE ERRORS if any
python tools/tile_images.py alos/output/stills alos/output/review                      # 2x2 grids
```
Look for overlapping text, things cut off at the edges, faint icons, wrong numbers, and dark colours leaking into the light theme.
Re-copy a reference: `python tools/compare.py stills reference.mp4 output/stills output/compare <times>`.

## D2. Test render (2 s)

```powershell
node studio/render.mjs 20 22 4 4 alos/output/test_2s.mp4     # t0 t1 workers subframes out
```
It measures speed. On an RTX 4050 laptop: about 6.5 frames/s with 6 workers and 4 sub-frames, so 74 s takes about 11–12 min.

## D3–D4. Full render, mix, mux (one command)

```powershell
powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make.ps1                # dark
powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make.ps1 -Theme light   # light
powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make.ps1 -Theme both    # both, one after the other
```
What it does: SFX cues → audio mix → for each theme: 6 Chromium workers × 4 sub-frames (motion blur via `tmix`) →
NVENC encode → concat → mux with the soundtrack. It shows a live progress bar; the log is in `alos/output/render_<theme>.log`.

**Run only one render at a time.** Two at once halve each other's speed and fight over the same files.

## D5. Review like a director

Watch it, then give notes like "this part is too slow", "that fade looks cheap, make it change shape", "make it hit
on the word". Fix one scene, D1 the stills, re-render. Two or three rounds is normal.
Notes we got and what fixed them:

| Note | Fix |
|---|---|
| "More about product would be better" | Problem cut to 18 s; 7 product guards on the real UI |
| "Intro needs a subtle sound effect" | Rolling ticks that slow with the digits + a soft lock hit |
| "Little less time at start, a bit faster" | VO and timings shifted 0.3 s earlier, faster word rises |
| "All digits must move and stop at the same second" | `roller()`: every column spins, all lock on "million" |

---

## Gotchas we hit (save yourself the time)

- Build the film **after** the font loads (`document.fonts.load`), or text measurements are wrong.
- A flood must clear the farthest corner (radius > 2200 px at 1080p) and take ≥ 0.35 s, or it reads as a flash.
- Big `np.convolve` windows on 48 kHz audio hang the mixer. Use a cumulative-sum moving average.
- faster-whisper on CUDA needs `cublas64_12.dll`; without it the script falls back to CPU automatically.
- Parallel tool calls can race: write a file *before* running the command that uses it.
- PowerShell `"…"` breaks Python f-strings with `{}`. Put the code in a `.py` file.
- Whisper mishears the brand ("Disruption Ops", "Lie detected" heard as "Like hot"). Change the script wording, not the timing logic.
- Use read-only clicks when crawling a live app. Writes (inject, approve, pay) need the owner's permission.

## Mistakes we made, and the fix we now use

Every row cost at least one round of feedback. Check these before you show the owner anything.

| What went wrong | Why | Fix (now the default) |
|---|---|---|
| UI didn't match the live app; invented values (a broker name, round numbers) | Rebuilt screens from memory and old screenshots | Capture first: `node tools/capture_pages.mjs <url> <out> /route …` saves a screenshot, the page text, **and every `/api/` JSON the page renders**. Copy strings and numbers from that JSON. Nothing on screen without a source. |
| Pages captured half-loaded (spinners, empty grids) | Fixed 2.5 s wait; the backend (Render free tier) cold-starts | `networkidle` + `SETTLE=8000` (env). Wake the backend first (`/api/health`). |
| Backend API returned 401 | Endpoints need the app's session | Don't call the API directly; let the browser load the page and record its responses (`page.on('response')`). |
| Leftover element on screen ($2.3M still at the top when 46,000 showed) | The old element only shrank, never left | When a new number takes over, the old one must **leave** (fly + fade to 0). Review a still at every handoff. |
| Text spilling out of cards | Long live strings + our larger fonts | KPI sub-lines are `nowrap` + ellipsis at 13.5 px; long rows get `min-width:0` on the flex child; check stills at 1:1, not just tiles. |
| A countdown pill rendered its text inside the 7 px dot | `el.lastChild.textContent = …` hit the `<i>` dot | Put changing text in its own `<span>` and target that. |
| Stamp looked like a faded red box in light theme | `K.retheme()` remaps inline `rgba(255,255,255,a)` to dark | Use solid hex (`#fffafa`, `#fdfcff`) for anything that must stay white. Same for overlay cards: translucent `var(--card)` lets text bleed through. |
| "Blocked" moment felt weak | A pill that only bumped | First-gen recipe: inspector card slides in → numbers count (ratio 1.0→4.6×) → bars race → stamp **slams** (2.4× → 1, overshoot + shake + page jolt) → saved amount counts up. |
| "Minus what the supplier owes you" didn't read | Capture counted up from $0 | Start at the held amount; each deduction chip **flies from its row into the total** and the number ticks down to the captured amount. Use exact figures so the maths adds up (4,295.24 − 214.76 − 174.88 − 408.05 = 3,497.55). |
| Thread trail too small to read | Real 3-column page at 1:1 | Camera push (1.3×) into the thread card, pan with new rows, clip to the page area (below the top bar, right of the sidebar), zoom out before the next page. The stage cursor doesn't follow a zoomed layer, so no clicks while zoomed. |
| Characters turned into `Â·` / `â€"` | PowerShell 5 `Get-Content`/`Set-Content` re-encoded UTF-8 | Edit JS with the editor tool, or `[IO.File]::ReadAllText/WriteAllText` with UTF-8 (no BOM). Grep for `Â|â€` before rendering. |
| PowerShell ate `${…}` in a JS template string | `"…${btn(…)}…"` is a PS variable | Single-quote PS strings or edit the file directly. |
| A brief beat couldn't be shown live (Copilot: Gemini key 401) | Dependency down on the deployed app | Build it anyway from the app's own records, comment it in code as a stand-in, and tell the owner exactly what to replace (`CA` in `film_b.js`). |
| Brief and live UI disagreed (which two suppliers share Penang Plating) | Brief written from seed data, UI from a later run | Ask; the owner chose the brief. Note the source next to the data in code. |
| Wanted to change the film while a render was running | Render workers read `studio/`, `timing.js`, `vo/` | Copy to a new cut (`alos/studio_v4`, `audio/vo_v4`, `docs/cues_v4.json`, `output/v4/`) with its own `make_v4.ps1`. `tools/alos_cues.py` takes `CUES_VO_DIR`, `CUES_TRANSCRIPT`, `CUES_OUT`. |
| `.gitignore` `audio/` also hid `alos/audio/vo` | Unanchored pattern | Anchor root-only folders: `/audio/`, `/output/`, `/reference/`. Dry-run with a throwaway `--git-dir` before the first push. |

### The loop that works (per change)
1. Capture the live page (`capture_pages.mjs`) and read its JSON.
2. Edit one scene, `node --check` the file.
3. Stills at the beat's key words (`stills.mjs` + `tile_images.py`), look at handoffs and at 1:1 crops.
4. Fix, re-still, then the full render.

### New cut checklist (brief changed)
1. New lines in `docs/vo_lines_vN.txt` (keep lines 1–3 identical to keep the intro timing).
2. `tts_lines.py … audio/vo_vN … "+4%" 0.38 0.2` → `transcribe.py` → write `studio_vN/timing.js`.
3. Re-anchor scenes on words (`W('voids', L(6))`), not seconds; re-time cues in `alos_cues.py`.
4. `make_vN.ps1`.

## Files you'll copy for the next project

| File | What it is |
|---|---|
| `alos/docs/FRIEND_BRIEF.md` | Fill-in brief template for the product owner |
| `alos/docs/BEAT_MAP.md` | Beat-map example |
| `alos/docs/vo_lines.txt` | Script format for `tts_lines.py` |
| `alos/docs/fish_chunks.txt` | Fish Audio Drama 3 chunks (<500 chars) |
| `alos/studio/*` | Studio: copy, then rewrite only `film_a.js` / `film_b.js` and the CSS tokens |
| `alos/studio_v4/*` | Latest cut (brief v3): Agent Team, Buyer Shield, stamps, deduction fly-in, thread camera push |
| `alos/make.ps1` | One-command build |
| `alos/make_v4.ps1` | One-command build of a parallel cut (own studio, voice, cues, output) |
| `tools/capture_pages.mjs` | Live-app capture: screenshots + page text + every API JSON the page renders |
| `tools/capture_copilot.mjs` | Ask the app's Copilot a suggested question and save the reply |
| `tools/*` | All research, audio, review and render tools (unchanged between projects) |
