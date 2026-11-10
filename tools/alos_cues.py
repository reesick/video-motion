"""Generate alos/docs/cues.json from the VO word timings, so SFX follow the voice even after re-recording.

Usage: python tools/alos_cues.py
"""
import json
import os

# paths can be overridden so a second cut can be built while another render runs
VO_DIR = os.environ.get("CUES_VO_DIR", "alos/audio/vo")
OUT = os.environ.get("CUES_OUT", "alos/docs/cues.json")
vo = json.load(open(VO_DIR + "/lines.json"))
words = [w for s in json.load(open(os.environ.get("CUES_TRANSCRIPT", "alos/docs/transcript.json")))["segments"] for w in s["words"]]
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
for k in range(8):                                           # the eight agents burst into a ring around the wordmark
    add("pop.wav", W("agents", L[3]) - 0.15 + k * 0.06, -19 - (k % 3))
add("whoosh_soft.wav", L[4] - 0.85, -17, max_len=0.9)        # ring collapses
# L5 Sentinel: Mission Control -> Buyer Shield buy timers -> handed to the team
add("click.wav", W("when", L[4]) - 0.17, -10)
add("whoosh_fast.wav", W("when", L[4]) - 0.15, -19, max_len=0.8)
for i in range(3):
    add("tick.wav", W("red", L[4]) - 0.05 + i * 0.12, -15)
add("pop_hi.wav", W("hands", L[4]), -13)
add("whoosh_fast.wav", L[5] - 0.45, -17, max_len=0.6)
add("click.wav", L[5] - 0.32, -10)
# L6 Agent Team trail: investigator reads, carrier disagrees, treasurer voids
for i in range(3):
    add("pop.wav", L[5] + 0.15 + i * 0.3, -21)
add("typing_bed.wav", W("reads", L[5]) + 0.3, -16, align="start", trim=[12.9, 13.6])
add("pop_hi.wav", W("carrier", L[5]), -12)
add("pop.wav", W("so", L[5]) - 0.35, -18)
add("thump.wav", W("voids", L[5]) + 0.15, -8)
# L7 memory, then Suppliers proof-only
add("shimmer.wav", W("remembers", L[6]) - 0.1, -18)
add("click.wav", W("that", L[6]) - 0.17, -10)
add("whoosh_fast.wav", W("that", L[6]) - 0.15, -19, max_len=0.8)
add("pop_hi.wav", W("proof", L[6]) - 0.05, -12)
# L8 Buyer Shield ledger: blocked, locked
add("click.wav", L[7] - 0.17, -10)
add("whoosh_fast.wav", L[7] - 0.15, -19, max_len=0.8)
add("thump.wav", W("blocked", L[7]), -8)
add("whoosh_soft.wav", W("payout", L[7]) - 0.2, -18, max_len=0.8)
add("thump.wav", W("locked", L[7]), -9)
add("pop_hi.wav", W("locked", L[7]) + 0.02, -15)
# L9 PO-7718 pays on proof
add("click.wav", L[8] - 0.17, -10)
add("whoosh_fast.wav", L[8] - 0.15, -19, max_len=0.8)
for i in range(3):
    add("pop.wav", W("only", L[8]) + i * 0.2, -15)
for i in range(3):
    add("whoosh_fast.wav", W("minus", L[8]) - 0.15 + i * 0.4, -22, max_len=0.5)
add("success.wav", W("late", L[8]) + 0.25, -16)
# L10 Approvals: stops and asks, one click, thread resumes
add("click.wav", L[9] - 0.17, -10)
add("whoosh_fast.wav", L[9] - 0.15, -19, max_len=0.8)
add("pop_hi.wav", W("stops", L[9]) - 0.1, -14)
add("click.wav", W("click", L[9]), -8)
add("success.wav", W("click", L[9]) + 0.15, -17)
for i in range(5):
    add("pop.wav", W("picks", L[9]) - 0.35 + i * 0.28, -20)
# L11 globe, L12 gantt
add("click.wav", L[10] - 0.27, -10)
add("whoosh_soft.wav", L[10] + 0.1, -18, max_len=1.0)
add("pop_hi.wav", W("secretly", L[10]), -11)
add("thump.wav", W("secretly", L[10]) + 0.05, -13)
add("click.wav", L[11] - 0.17, -10)
add("whoosh_fast.wav", L[11] - 0.2, -18, max_len=0.8)
add("success.wav", W("time", L[11]), -14)
# L13 Buyer Shield numbers
add("swoosh_rise.wav", L[12] - 0.15, -14, max_len=1.2)
for i in range(10):
    add("tick.wav", W("every", L[12]) + 0.05 + i * (W("logged", L[12]) + 0.4 - W("every", L[12])) / 10, -18)
for i in range(6):
    add("pop_hi.wav", W("dollar", L[12]) - 0.1 + i * 0.09, -19)
for i in range(3):
    add("pop.wav", W("nothing", L[12]) - 0.1 + i * 0.08, -16)
# Copilot beat (only when the voice-over has the "Ask it anything." line)
E = L[-1]
if len(L) == 15:
    tq = W("ask", L[13]) + 0.1
    add("whoosh_soft.wav", L[13] - 0.2, -17, max_len=0.9)
    add("click.wav", tq - 0.12, -10)
    add("typing_bed.wav", tq + 0.75, -17, align="start", trim=[12.9, 14.0])
    add("pop.wav", tq + 1.9, -18)
# end card
add("whoosh_soft.wav", E - 0.1, -14, max_len=1.2)
add("shimmer.wav", E + 0.1, -12)
add("thump.wav", W("never", E), -14)

json.dump({"duration": vo["duration"],
           "voice": {"file": VO_DIR + "/voiceover.wav", "start": 0, "gain_db": 0},
           "music": {"file": "alos/assets/music_running_out_of_time.mp3", "offset": 0, "gain_db": -20, "duck_db": -6, "fade_out": 2.0},
           "sfx": cues}, open(OUT, "w"), indent=1)
print(len(cues), "cues ->", OUT, "duration", vo["duration"])
