"""Print word-level timings from a transcript JSON (tools/transcribe.py output).

Usage: python tools/words.py docs/transcript.json [t_max]
"""
import json
import sys

d = json.load(open(sys.argv[1], encoding="utf-8"))
tmax = float(sys.argv[2]) if len(sys.argv) > 2 else 1e9
for s in d["segments"]:
    if s["start"] > tmax:
        break
    print(" ".join(f"{w['word']}@{w['start']:.2f}" for w in s["words"]))
