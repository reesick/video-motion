# DisruptionOps – dataset for the launch video

Source of truth: the **live MVP** at https://agenticlogisticsystem.vercel.app/, crawled on 2026-11-05 with
`tools/explore_site.mjs` (29 pages, screenshots in `alos/research/shots/`, raw text in `alos/research/shots/dataset.json`).
Repo: https://github.com/officialayush23/Agentic-Logistic-Orchestration-System (latest commit 2026-11-05,
"Replace hex globe with Mapbox globe").

**Stale data warning.** `README.md`, `EXPLAINER.md` and `DEMO.md` in the repo describe an older build: ₹ prices, COMP-104,
SUP-21/18/64 suppliers, and "no map tiles". The live app has moved to $ + PayPal sandbox, SCU-700 / Zhen Hua Electronics,
and a Mapbox globe. **Every number in the video comes from the live app.** The docs are used only for the product
thesis ("the LLM explains, deterministic Python decides"), which has not changed.

## Brand

| Item | Value |
|---|---|
| Name | DisruptionOps |
| Tagline (sidebar) | Autonomous supply-chain f(irefighter) |
| Thesis | The model explains. The code decides. |
| Font | Inter (variable) |
| Canvas | lavender `oklch(0.965 0.018 285)` ≈ `#f1f0fa`, soft pink/blue corner glows |
| Ink | `oklch(0.24 0.06 280)` ≈ `#1f1b3d` |
| Accent | indigo `#6366f1` → violet `#8b5cf6` → pink `#ec4899` gradient (logo tile, progress bars, mandate card) |
| Cards | white glass, radius 24, hairline border, very soft shadow |
| Status | Critical red `#ef4444`, At risk amber `#f59e0b`, On track green `#10b981` |

## Mission Control (home)

Pune Plant 1 · 6 customer projects · 16 purchase orders watched.
Units at risk **1,530** · Funds held in PayPal **$35,790** · Recovered from bad suppliers **$15,490** · Open incidents **4**.
Live supply network: 8 shipments into Pune, 12 suppliers on 4 continents.
Shipments: PO-7712 Zhen Hua Electronics · COSCO Shipping, **Claim ≠ carrier**, 0% · PO-7790 Formosa Precision · China Airlines Cargo, in transit 38% · PO-7715 Western Components · Gati Express, 71%.
Agent activity: "Checking inbound modems cover the gap" · "ONE Harmony waiting berth at Chennai" · "Approval needed: $9,855 over limit".

## The hero incident (INC-301, Scenario S3, critical)

Project PRJ-2041 · **SCU-700 Smart Controller Units** · Bharat EV Motors (Chennai) · **700 units · due 11 Nov (in 6 days)**.
Timeline on the Agent Board:
1. Line-stop risk: SCU-700 needs 700 MCUs in 6 days, 0 on hand (Solver)
2. Gemini read Zhen Hua email: "goods dispatched 3 days ago" (Gemini)
3. COSCO tracking COSU6218840: label created, no pickup (Solver)
4. Contradiction confirmed → supplier reliability 47 → 41 (Solver)

Outcome: "Agent voided the **$5,880** hold and re-sourced to Formosa by air." PO-7790 Formosa Precision, China Airlines Cargo, AIR.

## Pipeline (Agent Board)

Open incidents 4 · Decisions by solver **16** (deterministic Python) · Reads by Gemini **3** (never touches money) · Human approvals **1** (only above the limit).
Columns: Detected → Investigating → Awaiting approval → Funds held → Settled → Clawed back.

## Constraint trap (Scenario S4)

"A supplier offers 22% cheaper parts with no AEC-Q100 evidence. Agent hard-rejects the option; picks the certified one."
Budget Semicon Traders (Guangzhou), reliability 52%.

## Approval (Scenario S5)

"Release **$9,855** to AeroCell Logistics?" IC-450 Instrument Clusters · PO-7742.
Options: AeroCell · air, $9,855, arrives 8 Nov, score 0.89, **chosen**, "only option landing before due date" vs Lowcost Display · wait, SEA, $8,370, 14 Nov, 0.31, viable.
The agent acts alone up to **$5,000**. Above that it emails a **one-time code** and holds funds.

## Money (Payments)

Held (authorized, not moved) $35,790 · Released to suppliers $10,771 (only after goods verified) · Voided or refunded $15,490 (never paid for bad goods) · Awaiting human release $9,855.

## Suppliers

12 watched · 6 countries · **192 claims checked** · **17 contradicted** · 7 trusted (≥ 85).
Lowest: Zhen Hua Electronics 41% · Budget Semicon Traders 52% · Lowcost Display Co 58%. Highest: Nippon Cell Tech 94% · Formosa Precision 93%.

## Audit

62 entries, every Gemini read, solver step and PayPal event, searchable in plain English.
Sample: "PAYMENT.AUTHORIZATION.VOIDED: Promised date missed by 7 days — order cancelled".
