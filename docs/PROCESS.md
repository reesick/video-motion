# Remake Pipeline: reference video → code-built motion video

A repeatable process for recreating any reference explainer or launch video in code, keeping only its voice-over.
Built on the method in `1.md`. Used here for the first half (0–57.5 s) of the Madison explainer.

```
reference.mp4
   │  1. Extract       frames, contact sheets, stills, audio
   │  2. Separate      voice  ←→  music+fx          (demucs)
   │  3. Transcribe    word timings                  (faster-whisper)
   │  4. Analyze       tempo, beat grid, sfx onsets, colors
   │  5. Document      DESIGN_GUIDELINES.md + BEAT_MAP.md
   │  6. Assets        SVG logos / people / photos, font, Mixkit music + sfx
   │  7. Build         studio/index.html + film.js  (seek(t))
   │  8. Review        stills vs reference (side-by-side), fix, repeat
   │  9. Render        Playwright → sub-frames → tmix motion blur → NVENC
   │ 10. Mix           voice + ducked music + sfx at peaks → loudnorm -14 LUFS
   ▼ 11. Deliver       final mp4 + side-by-side mp4
```

## 0. Requirements

| Tool | Install | Used for |
|---|---|---|
| ffmpeg (with NVENC) | `scoop install ffmpeg` | everything video/audio |
| Python 3.11 + numpy, pillow, soundfile | `pip install numpy pillow soundfile` | analysis, sheets, mixing |
| demucs + torch | `pip install demucs` and torch from `https://download.pytorch.org/whl/cpu` (or cu12x) | voice separation |
| faster-whisper | `pip install faster-whisper` | word-level transcript |
| Node 18+ + Playwright | `npm i -D playwright && npx playwright install chromium` | rendering |

## 1. Extract (study the reference)

```powershell
ffmpeg -i reference.mp4 -vf "fps=2,scale=640:-1" -q:v 3 reference/frames/f_%04d.jpg
python tools/contact_sheet.py reference/frames reference/sheets 2 4 4      # 4x4 sheets, 8 s each, timestamped
python tools/grab_stills.py reference.mp4 reference/stills 0.4 8.0 11.0 ...  # full-res stills, 2x2 grids
ffmpeg -i reference.mp4 -vn -ac 2 -ar 44100 audio/original_mix.wav
```
Read every contact sheet. For each beat, write down what is on screen, how it turns into the next scene, the camera move, colors and type.

## 2. Separate the voice

```powershell
python -m demucs --two-stems=vocals -n htdemucs -o audio/separated audio/original_mix.wav
```
Output: `vocals.wav` (voice only, this is the only thing reused) and `no_vocals.wav` (music+fx, used only for analysis).

## 3. Transcribe with word timings

```powershell
python tools/transcribe.py audio/separated/htdemucs/original_mix/vocals.wav docs/transcript.json medium.en
python tools/words.py docs/transcript.json 60
```
Word times drive the animation. Text appears on its word, and scene changes land in the gaps between sentences.
Choose the cut point where the voice is silent (here 56.9–57.5 s, found by measuring RMS).

## 4. Analyze

```powershell
python tools/analyze_audio.py audio/separated/htdemucs/original_mix/no_vocals.wav 0 58   # reference tempo + sfx hits
python tools/beatgrid.py assets/audio/music.mp3 85 100 docs/beatgrid.json               # new track's grid
```
Colors: sample stills with PIL `getpixel` (see `DESIGN_GUIDELINES.md` §2).

## 5. Document

* `docs/DESIGN_GUIDELINES.md`: format, color tokens, type, components, motion rules, easing, audio.
* `docs/BEAT_MAP.md`: one row per scene with time, voice line, action, and the **handoff** (which element of this scene becomes the next one). Every scene must have a handoff; that is what gives you "no cuts".

## 6. Assets (all remade, nothing copied from the reference)

| Kind | File | How |
|---|---|---|
| Brand logos | `assets/logos.js` | flat SVG redraws |
| People | `assets/people.js` | one parametric SVG face, expressions/outfits as options |
| Photos | `assets/photos.js` | flat vector restaurant / dish illustrations |
| Font | `assets/Outfit-Variable.ttf` | Google Fonts (OFL) |
| Music + SFX | `assets/audio/` | Mixkit (free license); `tools/mixkit.py list <page>` / `get <url> <out>`, `tools/sfx_probe.py` measures peaks |

## 7. Build the film (`studio/`)

* `lib.js`: pure-function motion kit. Easing, `spring()` (closed-form step response), `springSteps()` (sum of springs for multi-target values), `keys()`, `camera()` (zoom interpolated in log space), `typed()` (human typing rhythm).
* `ui.js`: HTML builders for every UI piece (search card, profile cards, dashboard, integrations, invoice, modal).
* `film.js`: one `scene(t0, t1, z, build)` per beat-map row. `build` creates DOM once; the returned `update(t)` sets every style from `t`.
  `window.seek(t)` shows only the active scenes and calls their updates. No CSS transitions, timers, or state carried between frames.
* Handoffs are shared elements in screen space: a morph box interpolates between the projected rect of the outgoing element and the incoming one (`projRect` + `lerpRect`).

Rules that keep it smooth (from `1.md`):
1. Nothing fades in. Things change shape.
2. No cuts.
3. Something on every beat; no hold > 1 s (idle elements drift ±4–6 px).
4. Springs with a small overshoot on landings.
5. One camera move at a time, never reversing.
6. A real SFX on every event.
7. Check your own work before showing anyone.

## 8. Review loop

```powershell
node studio/stills.mjs output/stills 0.4 8.0 11.0 18.0 31.0 47.6      # our frames (also prints page errors)
python tools/compare.py stills reference.mp4 output/stills output/compare 0.4 8.0 11.0 18.0 31.0 47.6
```
Open `output/compare/compare_XX.jpg` (reference left, ours right). Fix scale, position and timing, then re-run. Compare a few key moments per pass.

## 9. Render

```powershell
node studio/render.mjs 0 57.5 6 4 output/video_silent.mp4
```
6 parallel Chromium pages, 4 sub-frames per 60 fps frame across a 180° shutter, blended with `tmix` then decimated (motion blur), encoded with `h264_nvenc -cq 15`, segments concatenated. It shows a progress bar and writes `output/render.log`.
Measured speed on an RTX 4050 laptop: about 7.6 rendered frames/s, so 57.5 s takes about 7–8 min.
Benchmark first with a 2 s range: `node studio/render.mjs 0 2 4 4 output/test_2s.mp4`.

## 10. Mix

```powershell
python tools/mix_audio.py docs/cues.json output/soundtrack.wav
```
`docs/cues.json` lists the voice (timing unchanged), the music (-19 dB, ducked a further 7 dB under the voice by an envelope follower) and every SFX at the time of its event. `align: peak` puts the file's loudest sample exactly on the cue. The master goes through `loudnorm I=-14 TP=-1`.

## 11. Deliver

```powershell
powershell -ExecutionPolicy Bypass -File make.ps1      # runs 9 → 10 → mux → side-by-side
```
Outputs: `output/madison_first_half.mp4` and `output/side_by_side.mp4`.

## Adapting to a new video

1. Drop the new reference in the root and repeat steps 1–4.
2. Rewrite `BEAT_MAP.md` and the color/type tokens in `DESIGN_GUIDELINES.md` and `studio/index.html` `:root`.
3. Add assets to `assets/` and components to `ui.js`.
4. Rewrite the `scene()` blocks in `film.js` from the new beat map; keep `lib.js`, `render.mjs`, and all `tools/` unchanged.
5. Update `docs/cues.json` and run `make.ps1`.

## Known gotchas

* Build the film only after the font loads (`document.fonts.load`), or text measurements are wrong.
* Use `position: relative` lists, or a measured layout, for stacked rows. Absolute rows without `top` collapse onto each other.
* Floods must clear the farthest corner (radius > 2200 px for 1080p) and take ≥ 0.35 s, or they read as a flash.
* `np.convolve` with long windows on 48 kHz audio is O(N·M) and hangs. Use a cumulative-sum moving average.
* faster-whisper on CUDA needs `cublas64_12.dll`. Without it, the script falls back to CPU int8 automatically.
