"""SFX cue sheet for one intro variant (1..5), voice + music cut at the end of the intro.

Usage: python tools/intro_cues.py <variant 1-5> <end_seconds> <out.json>
Times mirror alos/studio/film_intro.js (same word anchors), so sounds land on the animation.
"""
import json
import sys

V, END, OUT = int(sys.argv[1]), float(sys.argv[2]), sys.argv[3]
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
add = lambda f, t, g=-14, **kw: cues.append({"file": S + f, "t": round(t, 3), "gain_db": g, **kw}) if t < END else None
T2 = L[1]
LOCK1, LOCK2, TC = W("million") + 0.02, W("cars", T2) - 0.12, W("chips", T2)


def roll_ticks(t0, t1, n, g):
    for i in range(1, n):
        k = 1 - (1 - i / n) ** (1 / 3)          # inverse of outCubic: dense at start, sparse near the lock
        add("tick.wav", t0 + k * (t1 - t0), g - 4 * (i / n))


# shared by all variants: the counter rolls and locks, the 46,000 card rolls and locks, the chip blinks
add("swoosh_rise.wav", 0.15, -22, max_len=1.0)
roll_ticks(0.06, LOCK1, 22, -24)
add("thump.wav", LOCK1, -15); add("pop_hi.wav", LOCK1 + 0.01, -21)
roll_ticks(T2 + 0.2, LOCK2, 14, -25)
add("thump.wav", LOCK2, -16); add("pop_hi.wav", LOCK2 + 0.01, -22)
add("tick.wav", TC, -13); add("thump.wav", TC + 0.1, -13)
add("whoosh_fast.wav", L[2] - 0.15, -16, max_len=0.8)          # card leaves into the next scene

if V == 1:   # parts burst into a ring, collapse, MCU turns red
    for k in range(10):
        add("pop.wav", 0.7 + k * 0.07, -18 - (k % 3))
    add("whoosh_soft.wav", T2 - 0.2, -15, max_len=1.0)
    add("pop_hi.wav", T2 - 0.1, -13)
    add("swoosh_rise.wav", T2 + 0.4, -18, max_len=0.8)
elif V == 2:  # one-hour clock, cost boxes spring out, clock morphs into the card
    for w in ("one", "hour", "car", "downtime", "$2"):
        add("pop.wav", W(w) - 0.1, -17)
    add("pop_hi.wav", W("costs") - 0.1, -15)
    add("whoosh_soft.wav", T2 - 0.1, -15, max_len=1.0)
    add("swoosh_rise.wav", T2 + 0.15, -16, max_len=0.9)
elif V == 3:  # exploded car, labels on leader lines, camera dives into the MCU
    add("whoosh_soft.wav", 0.0, -18, max_len=1.0)
    for k in range(8):
        add("pop.wav", 0.75 + k * 0.08, -18 - (k % 3))
    add("pop_hi.wav", T2 - 0.1, -13)
    add("whoosh_fast.wav", T2 + 0.05, -13, max_len=1.0)
elif V == 4:  # supply globe: routes shoot into Pune, labels pop, routes turn red
    add("pop.wav", 0.5, -16)
    for i in range(6):
        add("whoosh_fast.wav", 0.6 + i * 0.12, -26, max_len=0.6)
        add("pop.wav", 1.4 + i * 0.12, -18)
    for i in range(6):
        add("tick.wav", T2 + i * 0.06, -16)
    add("swoosh_rise.wav", T2 + 0.15, -15, max_len=0.9)
elif V == 5:  # stat ring bursts, collapses, headline slams in
    for i in range(6):
        add("pop.wav", 0.75 + i * 0.12, -17)
    add("whoosh_soft.wav", T2 - 0.15, -15, max_len=1.0)
    add("thump.wav", T2 + 0.35, -10)

json.dump({"duration": END,
           "voice": {"file": "alos/audio/vo/voiceover.wav", "start": 0, "gain_db": 0},
           "music": {"file": "alos/assets/music_running_out_of_time.mp3", "offset": 0, "gain_db": -20, "duck_db": -6, "fade_out": 0.8},
           "sfx": cues}, open(OUT, "w"), indent=1)
print(f"intro {V}: {len(cues)} cues, {END:.2f}s -> {OUT}")
