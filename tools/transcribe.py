"""Transcribe an isolated voice track with word-level timestamps.

Usage: python tools/transcribe.py <voice.wav> <out.json> [model=medium.en]
Tries CUDA first, falls back to CPU int8.
Writes {segments:[{start,end,text,words:[{start,end,word}]}]}.
"""
import json
import sys
from faster_whisper import WhisperModel

src, out = sys.argv[1], sys.argv[2]
model_name = sys.argv[3] if len(sys.argv) > 3 else "medium.en"

model = None
for device, ctype in (("cuda", "float16"), ("cpu", "int8")):
    try:
        model = WhisperModel(model_name, device=device, compute_type=ctype)
        segs, info = model.transcribe(src, word_timestamps=True, vad_filter=True, beam_size=5)
        segs = list(segs)
        print(f"device={device}")
        break
    except Exception as e:  # missing CUDA libs etc.
        print(f"{device} failed: {e}")
else:
    sys.exit("transcription failed")

data = {"segments": []}
for s in segs:
    data["segments"].append({
        "start": round(s.start, 3), "end": round(s.end, 3), "text": s.text.strip(),
        "words": [{"start": round(w.start, 3), "end": round(w.end, 3), "word": w.word.strip()} for w in s.words],
    })
    print(f"[{s.start:7.2f} - {s.end:7.2f}] {s.text.strip()}")

with open(out, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=1)
