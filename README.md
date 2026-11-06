# video-motion

Motion-graphics videos built in code. Every frame is HTML drawn by `seek(t)`, Playwright screenshots it
(60 fps, sub-frame motion blur), ffmpeg encodes it, and a Python mixer lays voice, music and SFX at -14 LUFS.
No After Effects, no editor.

| Project | Folder | What it is |
|---|---|---|
| DisruptionOps launch film | `alos/` | 74 s product film for the PayPal hackathon, light theme, intro 1 "parts burst" |
| Madison explainer remake | `studio/`, `docs/` | Shot-for-shot remake of the first 57.5 s of a reference explainer |

## Layout

```
alos/                DisruptionOps film
  studio/            index.html + core.js, film_a.js, film_intro.js, film_ui.js, film_b.js, timing.js
  docs/              BRIEF.md (source of truth), SCRIPT.md, BEAT_MAP.md, DATASET.md, cues.json, transcript.json
  audio/vo/          voiceover.wav + lines.json (edge-tts, Ava +4%)
  research/          live-app screenshots, click states, theme samples
  make.ps1           full film      make_intros.ps1   the 5 intro candidates
studio/              Madison remake scenes + render.mjs / stills.mjs (shared render engine)
tools/               cues, mixer, TTS, transcription, contact sheets, comparisons
docs/                Madison design guidelines, beat map, process
PLAYBOOK.md          the reusable step-by-step process      1.md   the original method
```

## Setup

Windows + PowerShell, Node 18+, Python 3.10+, ffmpeg on PATH (NVENC used when available).

```powershell
npm install
npx playwright install chromium
pip install numpy soundfile edge-tts openai-whisper pillow
```

## Build

```powershell
powershell -ExecutionPolicy Bypass -File alos\make.ps1          # DisruptionOps, light -> alos\output\disruptionops_launch_light.mp4
powershell -ExecutionPolicy Bypass -File alos\make_intros.ps1   # all 5 intros     -> alos\output\intros\
powershell -ExecutionPolicy Bypass -File make.ps1               # Madison remake   -> output\madison_first_half.mp4
```

Preview any frame: open `alos/studio/index.html?theme=light&intro=1` in Chrome, or
`node studio/stills.mjs <outdir> 3 8.4 30` with `STUDIO=alos/studio/index.html`.
`intro=0` gives the original hook, `intro=2..5` the other candidates.

## Assets you add yourself

Third-party media is git-ignored because its licences don't allow redistribution:

- `assets/audio/` and `alos/assets/music_running_out_of_time.mp3`: Mixkit music and SFX (free licence, no redistribution).
  Sources are listed in `assets/audio/CREDITS.md` (the film's track is Mixkit "Running Out of Time" by Ahjay Stelino);
  fetch with `python tools/mixkit.py get <url> <out>`.
- `reference/`, `audio/` and the Madison reference `.mp4`: the original explainer and its demucs stems (Madison remake only).

Rendered videos are not committed; attach finals to a GitHub Release.
