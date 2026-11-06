"""Join voice-over chunks (e.g. Fish Audio takes, 500-char limit each) into one timed track.

Usage: python tools/join_vo.py <out.wav> <gap_s> <lead_s> chunk1.wav chunk2.wav ...
Trims leading/trailing silence of each chunk, joins with gap_s of silence, adds lead_s at the start and 1.2 s tail.
Prints each chunk's start/end. Then run tools/transcribe.py on out.wav for word timings.
"""
import subprocess
import sys
import tempfile
import numpy as np
import soundfile as sf

SR = 48000
out, gap, lead = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
parts, t = [np.zeros(int(lead * SR), np.float32)], lead
for i, f in enumerate(sys.argv[4:]):
    tmp = tempfile.mktemp(suffix=".wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-ac", "1", "-ar", str(SR), tmp], check=True)
    x, _ = sf.read(tmp, dtype="float32")
    a = np.abs(x); nz = np.where(a > a.max() * 0.02)[0]
    x = x[max(0, nz[0] - int(0.02 * SR)): nz[-1] + int(0.08 * SR)]
    if i:
        parts.append(np.zeros(int(gap * SR), np.float32)); t += gap
    print(f"chunk {i + 1}: {t:6.2f} - {t + len(x) / SR:6.2f}  {f}")
    parts.append(x); t += len(x) / SR
parts.append(np.zeros(int(1.2 * SR), np.float32))
vo = np.concatenate(parts)
peak = np.abs(vo).max()
vo = vo / peak * 0.89 if peak > 0 else vo
sf.write(out, np.stack([vo, vo], 1), SR)
print(f"wrote {out}  {len(vo) / SR:.2f}s")
