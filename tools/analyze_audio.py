"""Analyze a music/fx stem: loudness over time, onset peaks and estimated tempo.

Usage: python tools/analyze_audio.py <wav> [t0] [t1]
Prints a coarse loudness timeline (0.5s bins), estimated BPM, and the strongest
onset peaks (useful for locating SFX hits in a reference mix).
"""
import sys
import numpy as np
import soundfile as sf

x, sr = sf.read(sys.argv[1])
if x.ndim > 1:
    x = x.mean(1)
t0 = float(sys.argv[2]) if len(sys.argv) > 2 else 0
t1 = float(sys.argv[3]) if len(sys.argv) > 3 else len(x) / sr
x = x[int(t0 * sr):int(t1 * sr)]

hop = 512
frames = np.lib.stride_tricks.sliding_window_view(x, 2048)[::hop]
spec = np.abs(np.fft.rfft(frames * np.hanning(2048), axis=1))
flux = np.maximum(0, np.diff(np.log1p(spec), axis=0)).sum(1)
flux = (flux - flux.mean()) / (flux.std() + 1e-9)
fps = sr / hop

# tempo via autocorrelation of onset envelope, 70..180 BPM
ac = np.correlate(flux, flux, "full")[len(flux) - 1:]
lags = np.arange(len(ac))
bpm = 60 * fps / np.maximum(lags, 1)
mask = (bpm > 70) & (bpm < 180)
best = lags[mask][np.argmax(ac[mask])]
print(f"estimated tempo: {60 * fps / best:.1f} BPM")

rms = [np.sqrt(np.mean(x[i:i + sr // 2] ** 2)) for i in range(0, len(x), sr // 2)]
print("loudness (dBFS per 0.5s):")
for i, r in enumerate(rms):
    db = 20 * np.log10(r + 1e-9)
    print(f"{t0 + i * 0.5:7.1f}s {db:6.1f} " + "#" * max(0, int(db + 60)))

peaks = [i for i in range(1, len(flux) - 1) if flux[i] > 3 and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1]]
print("strong onsets (s):", " ".join(f"{t0 + p / fps:.2f}" for p in peaks))
