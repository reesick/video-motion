"""Download Mixkit SFX ids and measure them so they can be chosen without listening.

Usage: python tools/sfx_probe.py <out_dir> <id> [<id> ...]
Prints: id, duration, peak time (s), sound length above -30 dB, spectral centroid (Hz).
  - click/tick: short (<0.25s), high centroid
  - pop: short, mid centroid, single peak
  - whoosh: 0.4-2s, broad, peak near middle/end
  - typing: long, many peaks
"""
import subprocess
import sys
import urllib.request
from pathlib import Path
import numpy as np
import soundfile as sf

UA = {"User-Agent": "Mozilla/5.0"}
out = Path(sys.argv[1])
out.mkdir(parents=True, exist_ok=True)
for sid in sys.argv[2:]:
    mp3 = out / f"{sid}.mp3"
    wav = out / f"{sid}.wav"
    if not mp3.exists():
        url = f"https://assets.mixkit.co/active_storage/sfx/{sid}/{sid}-preview.mp3"
        mp3.write_bytes(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ac", "1", "-ar", "44100", str(wav)], check=True)
    x, sr = sf.read(wav)
    env = np.abs(x)
    peak = env.argmax() / sr
    win = 441
    rms = np.sqrt(np.convolve(x ** 2, np.ones(win) / win, "same"))
    db = 20 * np.log10(rms + 1e-9) - 20 * np.log10(rms.max() + 1e-9)
    active = (db > -30).sum() / sr
    spec = np.abs(np.fft.rfft(x))
    freqs = np.fft.rfftfreq(len(x), 1 / sr)
    cen = (spec * freqs).sum() / (spec.sum() + 1e-9)
    onsets = int(((db[1:] > -12) & (db[:-1] <= -12)).sum())
    print(f"{sid:>5} dur={len(x)/sr:5.2f}s peak={peak:5.2f}s active={active:5.2f}s centroid={cen:6.0f}Hz onsets={onsets}")
