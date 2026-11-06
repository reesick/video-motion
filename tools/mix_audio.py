"""Build the soundtrack: original isolated voice + new music (ducked) + SFX at cue times.

Usage: python tools/mix_audio.py <cues.json> <out.wav>
cues.json: {
  "duration": 57.5,
  "voice": {"file": "...", "start": 0, "end": 57.5, "gain_db": 0},
  "music": {"file": "...", "offset": 0, "gain_db": -20, "duck_db": -6, "fade_out": 1.5},
  "sfx": [{"file": "...", "t": 1.5, "gain_db": -12, "align": "peak"|"start", "max_len": 1.0}, ...]
}
align=peak: the file's loudest sample lands exactly on t (the "measured peak" rule from 1.md).
Final master is loudness-normalised with ffmpeg loudnorm to -14 LUFS / -1 dBTP.
"""
import json
import subprocess
import sys
import tempfile
import numpy as np
import soundfile as sf

SR = 48000


def load(path, start=0.0, end=None):
    tmp = tempfile.mktemp(suffix=".wav")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", path, "-ac", "2", "-ar", str(SR)]
    cmd += ["-ss", str(start)] if start else []
    cmd += ["-to", str(end)] if end else []
    subprocess.run(cmd + [tmp], check=True)
    x, _ = sf.read(tmp, dtype="float32")
    return x if x.ndim == 2 else np.stack([x, x], 1)


def movavg(x, n):
    c = np.cumsum(np.insert(x, 0, 0.0))
    y = (c[n:] - c[:-n]) / n
    pad = n // 2
    return np.pad(y, (pad, len(x) - len(y) - pad), mode="edge")


db = lambda v: 10 ** (v / 20)
cues = json.load(open(sys.argv[1]))
out = sys.argv[2]
N = int(cues["duration"] * SR)
mix = np.zeros((N, 2), np.float32)

# voice
v = cues["voice"]
voice = load(v["file"], v.get("start", 0), v.get("end"))[:N] * db(v.get("gain_db", 0))
fo = int(0.25 * SR)  # tiny fade at the cut so the voice never clicks
voice[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix[: len(voice)] += voice

# music with sidechain-style ducking driven by the voice envelope
m = cues["music"]
music = load(m["file"], m.get("offset", 0))[:N]
music = np.pad(music, ((0, max(0, N - len(music))), (0, 0)))
env = np.abs(voice).mean(1)
env = movavg(env, int(0.05 * SR))
env = np.pad(env, (0, N - len(env)))
active = (env > db(-38)).astype(np.float32)
active = movavg(active, int(0.25 * SR))
gain = db(m.get("gain_db", -20)) * (1 - active * (1 - db(m.get("duck_db", -6))))
fade = int(m.get("fade_out", 1.5) * SR)
gain[-fade:] *= np.linspace(1, 0, fade)
fi = int(0.4 * SR)
gain[:fi] *= np.linspace(0, 1, fi)
mix += music * gain[:, None]

# sfx
cache = {}
for c in cues["sfx"]:
    if c["file"] not in cache:
        cache[c["file"]] = load(c["file"])
    s = cache[c["file"]]
    if "trim" in c:
        s = s[int(c["trim"][0] * SR): int(c["trim"][1] * SR)]
    if "max_len" in c:
        L = int(c["max_len"] * SR)
        s = s[:L].copy()
        f = min(len(s), int(0.06 * SR))
        s[-f:] *= np.linspace(1, 0, f)[:, None]
    off = int(np.abs(s).mean(1).argmax()) if c.get("align", "peak") == "peak" else 0
    i0 = int(c["t"] * SR) - off
    a, b = max(0, i0), min(N, i0 + len(s))
    if b > a:
        mix[a:b] += s[a - i0: b - i0] * db(c.get("gain_db", -12))

pre = tempfile.mktemp(suffix=".wav")
sf.write(pre, mix, SR, subtype="FLOAT")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af", "loudnorm=I=-14:TP=-1:LRA=11", "-ar", str(SR), out], check=True)
print("wrote", out)
