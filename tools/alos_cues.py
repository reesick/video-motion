"""Generate alos/docs/cues.json from the VO word timings, so SFX follow the voice even after re-recording.

Usage: python tools/alos_cues.py
"""
import json

vo = json.load(open("alos/audio/vo/lines.json"))
words = [w for s in json.load(open("alos/docs/transcript.json"))["segments"] for w in s["words"]]
L = [l["start"] for l in vo["lines"]]


def W(word, after=0.0):
    for w in words:
        k = "".join(c for c in w["word"].lower() if c.isalnum() or c in "$.")
        if w["start"] >= after - 0.01 and k.startswith(word.lower()):
            return w["start"]
    return after


S = "assets/audio/sfx/"
cues = []
add = lambda f, t, g=-14, **kw: cues.append({"file": S + f, "t": round(t, 3), "gain_db": g, **kw})

# ---- intro 1 "parts burst" (same cues as tools/intro_cues.py variant 1) ----
T2 = L[1]
LOCK1, LOCK2, TC = W("million") + 0.02, W("cars", T2) - 0.12, W("chips", T2)


def roll_ticks(t0, t1, n, g):
    for i in range(1, n):
        k = 1 - (1 - i / n) ** (1 / 3)   # inverse of outCubic: dense at start, sparse near the lock
        add("tick.wav", t0 + k * (t1 - t0), g - 4 * (i / n))


add("swoosh_rise.wav", 0.15, -22, max_len=1.0)
roll_ticks(0.06, LOCK1, 22, -24)
add("thump.wav", LOCK1, -15)
add("pop_hi.wav", LOCK1 + 0.01, -21)
roll_ticks(T2 + 0.2, LOCK2, 14, -25)
add("thump.wav", LOCK2, -16)
add("pop_hi.wav", LOCK2 + 0.01, -22)
add("tick.wav", TC, -13)
add("thump.wav", TC + 0.1, -13)
add("whoosh_fast.wav", L[2] - 0.15, -16, max_len=0.8)   # card leaves into the next scene
for k in range(10):                                      # parts burst into a ring
    add("pop.wav", 0.7 + k * 0.07, -18 - (k % 3))
add("whoosh_soft.wav", T2 - 0.2, -15, max_len=1.0)       # ring collapses, MCU turns red
add("pop_hi.wav", T2 - 0.1, -13)
add("swoosh_rise.wav", T2 + 0.4, -18, max_len=0.8)       # 46,000 card + car matrix
# ---- rest of the film ----
for w in ("overcharge", "push", "invoice", "say"):
    add("pop_hi.wav", W(w, L[2]) - 0.08, -14)
add("whoosh_fast.wav", L[3] - 0.5, -14, max_len=1.0)
add("swoosh_rise.wav", L[3] - 0.2, -11, max_len=1.3)
add("shimmer.wav", L[3] + 0.1, -14)
add("whoosh_soft.wav", L[4] - 0.4, -15, max_len=1.2)
for i in range(4):
    add("pop.wav", L[4] + 0.6 + i * 0.08, -19)
add("click.wav", L[5] - 0.17, -10)
add("whoosh_fast.wav", L[5] - 0.15, -19, max_len=0.8)
add("click.wav", W("orders", L[5]), -10)
add("pop.wav", W("orders", L[5]) + 0.15, -14)
add("whoosh_fast.wav", L[6] - 0.15, -19, max_len=0.8)
add("thump.wav", W("blocked", L[6]), -8)
add("success.wav", W("blocked", L[6]) + 0.2, -20)
add("click.wav", L[7] + 0.4, -10)
add("typing_bed.wav", W("ai", L[7]) + 0.1, -14, align="start", trim=[12.9, 14.2])
for i in range(4):
    add("tick.wav", W("plain", L[7]) + 0.15 + i * 0.14, -18)
add("pop_hi.wav", W("story", L[7]), -12)
add("thump.wav", W("voided", L[7]), -8)
add("click.wav", L[8] - 0.17, -10)
add("whoosh_fast.wav", L[8] - 0.15, -19, max_len=0.8)
add("pop_hi.wav", W("duplicate", L[8]) - 0.1, -13)
add("pop_hi.wav", W("new", L[8]) - 0.1, -13)
add("thump.wav", W("neither", L[8]), -10)
for i in range(3):
    add("pop.wav", W("only", L[9]) + i * 0.22, -15)
add("whoosh_soft.wav", W("minus", L[9]) - 0.1, -16, max_len=1.0)
add("success.wav", W("late", L[9]) + 0.2, -16)
add("click.wav", L[10] - 0.2, -10)
add("whoosh_fast.wav", W("over", L[10]), -16, max_len=0.8)
for i in range(6):
    add("tick.wav", W("asks", L[10]) - 0.35 + i * 0.1, -16)
add("click.wav", L[11] - 0.35, -9)
add("success.wav", L[11] - 0.25, -16)
add("click.wav", L[11] + 0.3, -11)
add("whoosh_soft.wav", L[11] + 0.1, -18, max_len=1.0)
add("pop_hi.wav", W("secretly", L[11]), -11)
add("thump.wav", W("secretly", L[11]) + 0.05, -13)
add("whoosh_fast.wav", L[12] - 0.2, -18, max_len=0.8)
add("success.wav", W("time", L[12]), -14)
add("swoosh_rise.wav", L[13] - 0.15, -14, max_len=1.2)
for i in range(3):
    add("pop.wav", W("zero", L[13]) - 0.1 + i * 0.12, -14)
for i in range(6):
    add("pop_hi.wav", W("every", L[13] + 1) - 0.1 + i * 0.09, -19)
add("whoosh_soft.wav", L[14] - 0.1, -14, max_len=1.2)
add("shimmer.wav", L[14] + 0.1, -12)
add("thump.wav", W("never", L[14]), -14)

json.dump({"duration": vo["duration"],
           "voice": {"file": "alos/audio/vo/voiceover.wav", "start": 0, "gain_db": 0},
           "music": {"file": "alos/assets/music_running_out_of_time.mp3", "offset": 0, "gain_db": -20, "duck_db": -6, "fade_out": 2.0},
           "sfx": cues}, open("alos/docs/cues.json", "w"), indent=1)
print(len(cues), "cues ->", "alos/docs/cues.json", "duration", vo["duration"])
