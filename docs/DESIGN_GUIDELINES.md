# Madison Explainer – Design Guidelines

Derived from the reference `Explainer Video for Madison_ AI Powered Digital Marketing Tool_1080p.mp4`
(contact sheets: `reference/sheets/`, full-res stills: `reference/stills/`) and the rules in `1.md`.
These rules apply to every frame of the remake.

## 1. Format

| Property | Value |
|---|---|
| Resolution | 1920 x 1080 (16:9) |
| Frame rate | 60 fps (reference is 30 fps; we render double for smoothness) |
| Motion blur | sub-frames per frame blended with ffmpeg `tmix` (see `studio/render.mjs`) |
| Length | 0.00 – 57.50 s (first half of the reference, ends after "...learns your brand's voice.") |
| Style | 2D only, flat UI, no 3D, no particles, no glows |

## 2. Color

Sampled from reference stills with `PIL.getpixel`.

| Token | Hex | Use |
|---|---|---|
| `--canvas` | `#f4f4f4` | Background of every light scene |
| `--brand` | `#4f45e3` | Madison purple: wordmark, flood, buttons, edge circles, dashboard backdrop |
| `--brand-soft` | `#8b84f2` | Second tone used while the wordmark assembles |
| `--brand-tint` | `#ecebfd` | Active sidebar row, selection highlight |
| `--ink` | `#16161a` | Primary text |
| `--ink-2` | `#5f6068` | Secondary text |
| `--ink-3` | `#9a9ba3` | Tertiary text, table headers |
| `--line` | `#ececef` | Hairlines and card borders |
| `--card` | `#ffffff` | Cards, windows |
| `--pill` | `#eef0f2` | Search pill, chips |
| `--money-red` | `#e5322d` | Invoice balance |
| `--up-green` | `#16a34a` on `#dcfce7` | Positive delta chips |
| `--star` | `#f6b400` | Rating stars |
| Avatar teal | `#9fc3c7` (owner), `#4fb3bf` (consultant), `#bfe0ef` (shocked owner) | Character circle backgrounds |

Brand colors of third-party logos follow each brand (Google 4-color, Facebook `#1877f2`,
Twitter `#1d9bf0`, Tripadvisor `#34e0a1`, Yelp `#ff1a1a`, Trustpilot `#00b67a`, Booking `#003b95`, Expedia `#191e3b`/`#fddb32`).

## 3. Typography

* One family: **Outfit** (variable, OFL, `assets/Outfit-Variable.ttf`). It matches the reference's geometric
  sans (single-storey `a`, round `o`).
* Wordmark "Madison": Outfit 600, 200 px, `--brand`, letter-spacing -1 px.
* Headline subtitle: Outfit 500, 40 px, `--ink`.
* UI text: Outfit 400/500/600 at 13–22 px inside windows (windows are scaled by the camera, never the font).
* Numbers in stat cards: Outfit 500, tabular feel, 30 px.

## 4. Layout and components

* Cards: white, radius 18–24, 1 px `--line` border, shadow `0 24px 60px rgba(20,20,40,.08)`.
* Phone-like cards (search results, Maps profile, Instagram): 400 x 720 design px.
* Dashboard window: 1600 x 1000, radius 16, top bar 64, sidebar 300.
* Task boxes (scene 4): transparent fill, 2 px `rgba(79,69,227,.55)` border, radius 8, 24 px text.
* Character avatars: flat vector illustrations in a colored circle (`assets/people.js`).
* Photos: flat vector illustrations of restaurants and dishes (`assets/photos.js`).
* Cursor: black arrow with white 2 px outline, 38 px, scales 0.85 on press.

## 5. Motion rules (from `1.md`, step 5)

1. Nothing fades in. Things change shape: the search pill grows into a results card, the owner circle
   morphs into the invoice, the edge circle floods the screen, the logo card grows into the dashboard,
   the clicked review row grows into the modal.
2. No cuts. Each scene is built from an element of the previous one (see `docs/BEAT_MAP.md`, "handoff").
3. Something happens on every beat (92 BPM, 0.652 s). Holds never exceed ~1 s; idle elements drift
   (slow camera push, ±4 px float).
4. Landings use closed-form springs with a small overshoot (damping 0.65–0.8).
5. The camera makes one move at a time: one transform on the scene container, keyed `[t, zoom, x, y]`,
   eased segments, zoom interpolated in log space. Never zoom in and out back to back.
6. Every click, pop and whoosh has a real sound effect (Mixkit), placed at its measured peak.
7. Content that swaps inside a morphing container has its own exit/enter timing.

Banned: crossfades between scenes, blur-ins, 3D, particles, glows, camera reversals, holds > 1 s.

## 6. Easing vocabulary

| Name | Use |
|---|---|
| `inOutCubic` | Camera moves, list reorders, cursor travel |
| `outExpo` | Fast reveals (mask rises, card growth) |
| `inCubic` | Exits (things leaving frame) |
| `spring(f=2.2, z=0.7)` | Pops: logos, avatars, chips, buttons |
| `spring(f=1.6, z=0.85)` | Large settles: windows, cards |

## 7. Audio

* Voice: isolated female voice-over from the reference (`demucs htdemucs --two-stems=vocals`), untouched timing.
* Music: Mixkit "PlaceIt World 01" (Lily J), 92 BPM, same tempo as the reference bed, ducked under the voice.
* SFX: Mixkit (see `assets/audio/CREDITS.md`).
* Master: loudnorm to -14 LUFS, true peak -1 dBTP.
