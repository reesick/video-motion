# DisruptionOps launch film – beat map (≈54 s, 1920x1080, 60 fps)

Same grammar as the Madison remake: one continuous take, every scene is built from an element of the previous one, a cursor
drives real clicks, the camera makes one eased move per scene, springs on every landing, a real SFX on every event.
Timing is from the generated VO (`alos/audio/vo/lines.json`). When the Fish Audio Drama 3 take arrives, re-run
`tools/transcribe.py` and shift each scene to its line start.
Music: Mixkit "Running Out of Time" (Ahjay Stelino), 130 BPM, beat 0.4615 s. The energy lift at ~17 s sits on "Meet".

Theme: **dark mode**, matched to the user's screenshots in `alos/research/theme_samples/` (sampled with PIL):
canvas `#131428` deepening to `#14112f`, with violet/teal nebula glows bottom-left and right; glass cards `#1e1f39` at
radius 24 with a 1 px `rgba(255,255,255,.06)` border; white ink `#f4f4fb`, secondary `#a3a3c2`; brand blue tile `#4f6cf0`;
mandate gradient `#486cde → #7c5cf0`; dark Mapbox globe `#2c3b44` with glowing arcs; status red `#ef4444`, amber `#f59e0b`,
green `#22c55e`; Inter.

| # | Time | VO | On screen (source screen) | Cursor / button | Handoff |
|---|---|---|---|---|---|
| 1 | 0.0–3.3 | "A factory doesn't stop when it runs out of everything." | A 9x5 wall of part chips (MCU · 32-bit, CAN connector, Hall sensor, harness, TFT, BMS IC …) on lavender, slow push-in. | — | All chips fly into one chip |
| 2 | 3.3–5.5 | "…runs out of **one** part." | One chip "Automotive MCU · 32-bit" left in centre; on "one" it flips red, pulses. | — | Chip grows into project header card |
| 3 | 5.5–10.4 | "Seven hundred controllers. Due in six days. Zero on hand." | PRJ-2041 header card (Projects → PRJ-2041): "SCU-700 · Smart Controller Units", Bharat EV Motors. Three counters land on each phrase: **700** units · due **11 Nov (6d)** · **0** on hand. "Critical" pill pops on "Zero". | — | Card slides left; email card pulls out of its edge |
| 4 | 10.4–13.1 | "Then the supplier writes: goods dispatched." | Emails tab: Zhen Hua Electronics email bubble, text types "goods dispatched 3 days ago". Gemini chip "read by Gemini". | — | Tracking card snaps out to the right |
| 5 | 13.1–17.2 | "The carrier says: label created. No pickup." | COSCO tracking COSU6218840 card: status steps; "label created" ✓, "pickup" ✗ red. A red **≠** draws between the two cards on "No pickup". | — | ≠ sign scales up and floods violet gradient edge to edge (0.35 s) |
| 6 | 17.2–21.4 | "Meet DisruptionOps. The autonomous supply-chain firefighter." | Violet flood contracts into the logo tile (white rounded square, link-chain glyph); "DisruptionOps" wordmark rises letter by letter beside it; subtitle types. | — | Logo tile becomes the sidebar logo; the app shell grows around it |
| 7 | 21.4–25.6 | "It reads every email, and checks every claim against the carrier." | Mission Control: KPI cards spring in (1,530 · $35,790 · $15,490 · 4), globe with route arcs drawing into Pune Plant 1; PO-7712 "Claim ≠ carrier" chip pulses. Camera pushes into globe. | Cursor enters, clicks **Agent Board** in the sidebar | Sidebar highlight slides; page swaps |
| 8 | 25.6–31.4 | "Lie detected. Trust drops. The hold is voided, and the parts are re-sourced by air." | INC-301 incident card (Agent Board / Agent decisions): timeline rows tick in one per beat: Line-stop risk → Gemini read → COSCO label → **Contradiction confirmed, reliability 47 → 41** (number rolls down, bar shrinks red) → **PayPal: voided $5,880** (chip strikes) → **PayPal: $6,580 held for Formosa (air)**. A plane icon arcs Taipei → Pune on a mini-route. | Cursor clicks the incident card | Card scrolls to "Options the solver compared" |
| 9 | 31.4–36.4 | "The cheapest quote has no certification? Refused, with the rule that stopped it." | Options table: Formosa · air $6,995 **chosen 0.91** · Zhen Hua · wait **rejected** · Budget Semicon · sea **$4,900** (cheapest, highlighted) → on "Refused" a red strike runs through the row and a rule tag pops: **"No AEC-Q100 certificate — hard constraint"**. | Cursor hovers the cheapest row | Chosen row lifts and becomes the approval card |
| 10 | 36.4–39.5 | "Over five thousand dollars, it waits for a human." | Approvals: "Release **$9,855** to AeroCell Logistics?"; "$5,000 authority limit" gauge fills past the line; one-time code boxes fill digit by digit. | Cursor types code, clicks **Approve & hold funds** | Button morphs into PayPal state pill |
| 11 | 39.5–42.4 | "And money only moves when the goods are verified." | PayPal pill morphs Held → (warehouse QC ✓) → Released. Money in flight bars animate: Funds held $35.8k, Released $10.4k. | — | Pill shrinks into a dot on the globe |
| 12 | 42.4–48.3 | "One ninety-two claims checked. Seventeen lies caught. Fifteen thousand dollars recovered." | Three big counters on lavender, one per phrase: **192** claims checked · **17** contradicted · **$15,490** recovered (Suppliers + Mission Control). Supplier trust bars ripple behind. | — | Numbers collapse into two words |
| 13 | 48.3–51.7 | "The model explains. The code decides." | "The model explains." (Gemini chip) / "The code decides." (Solver chip) rise from mask lines, 92 px. | — | Both chips merge into the logo tile |
| 14 | 51.7–54.2 | "DisruptionOps." | End card: logo tile + wordmark, "agenticlogisticsystem.vercel.app" below, violet glow corners. | — | Hold to end |

## SFX cues (Mixkit, placed on measured peak)
Chips settle (0.4), collapse whoosh (3.0), red flip tick (4.75), counter ticks (6.2, 7.9, 9.1), critical pop (9.2),
email swoosh (10.5), typing (11.0–12.8), tracking card snap (13.3), ✗ error tick (15.9), ≠ draw (16.0), flood swoosh (16.9),
shimmer on wordmark (17.6), sidebar shell whoosh (21.4), KPI pops (21.7–22.3), arc draws (22.5–24.5), click Agent Board (25.2),
row ticks on beats (25.8–30.6), reliability down blip (27.2), void strike (28.6), plane whoosh (30.3), click card (31.3),
strike + error (34.1), rule tag pop (34.4), gauge rise (36.8), code key ticks (37.4–38.2), approve click (38.8),
success chime (40.0), counter ticks + impacts (42.7, 44.7, 46.3), word risers (48.7, 50.3), final hit + sparkle (52.0).
