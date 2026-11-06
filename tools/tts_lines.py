"""Generate a voice-over line by line with edge-tts, measure each clip, and lay them on a timeline.

Usage: python tools/tts_lines.py <lines.txt> <out_dir> [voice=en-US-AvaNeural] [rate=+0%] [gap=0.35] [lead=0.6]
lines.txt: one line per row. A row "|0.8" before a line adds 0.8 s of extra pause before it.
Writes <out_dir>/L01.mp3..., <out_dir>/lines.json [{i,text,start,end}], and <out_dir>/voiceover.wav (48 kHz).
"""
import asyncio
import json
import subprocess
import sys
from pathlib import Path
import numpy as np
import soundfile as sf
import edge_tts

src, out = sys.argv[1], Path(sys.argv[2])
voice = sys.argv[3] if len(sys.argv) > 3 else "en-US-AvaNeural"
rate = sys.argv[4] if len(sys.argv) > 4 else "+0%"
gap = float(sys.argv[5]) if len(sys.argv) > 5 else 0.35
lead = float(sys.argv[6]) if len(sys.argv) > 6 else 0.6
out.mkdir(parents=True, exist_ok=True)
SR = 48000

rows, extra = [], 0.0
for raw in Path(src).read_text(encoding="utf-8").splitlines():
    raw = raw.strip()
    if not raw:
        continue
    if raw.startswith("|"):
        extra = float(raw[1:]); continue
    rows.append((raw, extra)); extra = 0.0


async def synth(i, text):
    mp3 = out / f"L{i:02d}.mp3"
    await edge_tts.Communicate(text, voice, rate=rate).save(str(mp3))
    return mp3


async def main():
    return await asyncio.gather(*[synth(i + 1, t) for i, (t, _) in enumerate(rows)])

mp3s = asyncio.run(main())
clips = []
for p in mp3s:
    wav = p.with_suffix(".wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(p), "-ac", "1", "-ar", str(SR), str(wav)], check=True)
    x, _ = sf.read(wav, dtype="float32")
    a = np.abs(x)
    th = a.max() * 0.02
    nz = np.where(a > th)[0]
    x = x[max(0, nz[0] - int(0.02 * SR)): nz[-1] + int(0.06 * SR)]  # trim silence
    clips.append(x)

t = lead
meta, parts = [], [np.zeros(int(lead * SR), np.float32)]
for i, ((text, ex), x) in enumerate(zip(rows, clips)):
    if i:
        pad = gap + ex
        parts.append(np.zeros(int(pad * SR), np.float32)); t += pad
    meta.append({"i": i + 1, "text": text, "start": round(t, 3), "end": round(t + len(x) / SR, 3)})
    parts.append(x); t += len(x) / SR
parts.append(np.zeros(int(1.2 * SR), np.float32))
vo = np.concatenate(parts)
sf.write(out / "voiceover.wav", np.stack([vo, vo], 1), SR)
json.dump({"voice": voice, "rate": rate, "duration": round(len(vo) / SR, 3), "lines": meta}, open(out / "lines.json", "w"), indent=1)
for m in meta:
    print(f"L{m['i']:02d} {m['start']:6.2f}-{m['end']:6.2f}  {m['text']}")
print(f"total {len(vo) / SR:.2f}s")
