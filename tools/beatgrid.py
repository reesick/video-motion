"""Fit a constant-tempo beat grid to a music file (numpy only).

Usage: python tools/beatgrid.py <music.wav|mp3> [bpm_min=85] [bpm_max=100] [out.json]
Finds the BPM (0.01 resolution) and phase that best line up with the onset
envelope, then prints the first beat time and the grid. Downbeat = the beat of
the 4 with the strongest low-frequency (kick) energy.
"""
import json
import subprocess
import sys
import tempfile
import numpy as np
import soundfile as sf

src = sys.argv[1]
lo = float(sys.argv[2]) if len(sys.argv) > 2 else 85
hi = float(sys.argv[3]) if len(sys.argv) > 3 else 100
out = sys.argv[4] if len(sys.argv) > 4 else None

if not src.endswith(".wav"):
    tmp = tempfile.mktemp(suffix=".wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", "22050", tmp], check=True)
    src = tmp
x, sr = sf.read(src)
if x.ndim > 1:
    x = x.mean(1)
x = x[: sr * 90]

hop, n = 256, 1024
fr = np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * np.hanning(n)
spec = np.abs(np.fft.rfft(fr, axis=1))
flux = np.maximum(0, np.diff(np.log1p(spec), axis=0)).sum(1)
low = np.maximum(0, np.diff(np.log1p(spec[:, :12]), axis=0)).sum(1)  # < ~250 Hz
fps = sr / hop
times = np.arange(len(flux)) / fps


def score(bpm, phase, env):
    period = 60 / bpm
    beats = np.arange(phase, times[-1], period)
    idx = np.clip((beats * fps).astype(int), 0, len(env) - 1)
    return env[idx].mean()


best = (0, 0, 0)
for bpm in np.arange(lo, hi, 0.05):
    period = 60 / bpm
    for phase in np.arange(0, period, 0.005):
        s = score(bpm, phase, flux)
        if s > best[0]:
            best = (s, bpm, phase)
_, bpm, phase = best
for b in np.arange(bpm - 0.06, bpm + 0.06, 0.01):  # fine pass
    for ph in np.arange(phase - 0.01, phase + 0.01, 0.001):
        s = score(b, ph, flux)
        if s > best[0]:
            best = (s, b, ph)
_, bpm, phase = best
period = 60 / bpm
beats = np.arange(phase, times[-1], period)
kick = [low[np.clip((beats[i::4] * fps).astype(int), 0, len(low) - 1)].mean() for i in range(4)]
down = int(np.argmax(kick))
print(f"bpm={bpm:.2f} period={period:.4f}s first_beat={phase:.3f}s downbeat_offset={down} (first downbeat {phase + down * period:.3f}s)")
if out:
    json.dump({"bpm": round(bpm, 3), "period": period, "first_beat": phase,
               "first_downbeat": phase + down * period,
               "beats": [round(b, 4) for b in beats]}, open(out, "w"), indent=1)
    print("wrote", out)
