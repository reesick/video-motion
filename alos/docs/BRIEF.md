# Task: write up the DisruptionOps project details (for the launch video)

---

## 0. The format we use

(Unchanged. Beat table: `| # | Time (s) | Voice-over (exact words) | On screen | Cursor / button | Handoff into next beat |`. Shape: problem → pain (real number) → "Meet DisruptionOps" → 3–4 proof beats on the real UI → result numbers → tagline → logo.)

---

## 1. Project basics

| Field | Your answer |
|---|---|
| Product name (exact spelling + how it's pronounced) | **DisruptionOps**, one word with a capital D and capital O. Say "dis-RUP-shun ops" (rhymes with "corruption ops"). |
| One-line description (≤ 12 words) | Buyer-side AI agent: projects ship on time, on budget, paid only on proof. |
| Tagline for the end card (≤ 6 words) | **Never pay for what didn't arrive.** (sub-line: *Money moves only on proof.*) |
| Hackathon name + track | **Build What's Next with PayPal and AI** (PayPal global online hackathon, Devpost). No tracks. Prize categories we are aiming at: Best Use of Agentic Commerce, Best Use of PayPal + AI, Best Use of AG Grid, Best Use of Bryntum, Best Use of Render. |
| Team name + members (as they should appear) | Team **kala dhua**: Ayush Pathak · Shreeviraj Matale · Meet Shah · Krishna Lokhande · Pooja Wavdara |
| Live URL to show on the end card | **agenticlogisticsystem.vercel.app** |
| Repo URL | **github.com/officialayush23/Agentic-Logistic-Orchestration-System** |
| Who is the user? (role, company type) | The **supply-chain / procurement lead at a Tier-1 automotive electronics plant** (in the demo: Pune Plant 1, Chakan, building controllers and battery-management systems for EV makers like "Bharat EV Motors"). Second user: the **plant finance approver**, who owns each project's budget envelope and signs off on anything above the agent's $5,000 limit. |

---

## 2. The problem, in the user's words

| Field | Your answer |
|---|---|
| The pain in one sentence | "Suppliers overcharge me, push dates back, send the same invoice twice and say parts shipped when they didn't, and my customer's deadline pays for all of it." |
| What happens today without the product (step by step, who does what) | 1) A buyer emails the supplier: "where is PO-7712?" 2) The supplier replies "dispatched 3 days ago" and attaches an invoice. 3) Nobody checks the carrier; tracking says "label created, no pickup". 4) Accounts payable pays the invoice because the PO and invoice match. 5) The line-stop risk is noticed only when stock hits zero. 6) Someone hunts for a backup supplier by phone and email, under deadline. 7) An expensive air shipment needs a manager's approval, which waits in an inbox. 8) Clawing back the money from the first supplier takes weeks, if it happens at all. |
| What it costs when it goes wrong (time / money / line stop) | Line stop: about **$2.3M per hour** for a large automotive plant (Siemens 2024, see §3). Demo plant: SCU-700 needs **700 MCUs in 6 days with 0 on hand**. Money already sent for goods that never shipped: **$5,880** (PO-7712). Recovery by air: **$6,580** to a certified backup (Formosa Precision). Source: live app (PROD-882, PO-7712). |
| One real-feeling story we can dramatize (who, what part, what went wrong) | **Thursday, Pune.** Bharat EV Motors needs 700 Smart Controller Units in 6 days. The MCUs come from **Zhen Hua Electronics (Shenzhen)** on PO-7712. Zhen Hua emails: *"Goods dispatched 3 days ago. Please release payment per invoice ZH-INV-55120."* COSCO tracking COSU6218840 says: **"Label created, no pickup."** DisruptionOps catches the contradiction, refuses to pay, **voids the $5,880 hold**, re-sources to **Formosa Precision (Hsinchu)** by air, holds **$6,580** in PayPal, and releases it only when the Pune warehouse confirms receipt and QC. |

---

## 3. Industry numbers (how big this is globally)

| Claim (exact wording for the video) | Number | Year | Source (link) |
|---|---|---|---|
| "One hour of downtime in a large car plant costs $2.3 million." | $2.3M per hour (over $600 a second) | 2024 | Siemens / Senseye, *The True Cost of Downtime 2024*: https://assets.new.siemens.com/siemens/assets/api/uuid:1b43afb5-2d07-47f7-9eb7-893fe7d0bc59/TCOD-2024_original.pdf |
| "Supply chains break for a month or more every 3.7 years." | every 3.7 years | 2020 | McKinsey Global Institute, *Risk, resilience, and rebalancing in global value chains* (press summary): https://www.manufacturingtomorrow.com/news/2020/08/05/as-covid-19-highlights-vulnerabilities-in-global-supply-chains-and-resilience-takes-priority-report-calculates-ongoing-cost-of-shocks-and-prospects-for-production-to-shift/15659 |
| "Over a decade, those shocks erase almost half a year's profit." | ~45% of one year's EBITDA per decade | 2020 | Same McKinsey Global Institute report (same link as above) |
| "Three in four companies were hit by payments fraud last year." | 76% of US organizations (attempted or actual), 2025 | 2026 | AFP, *2026 Payments Fraud and Control Survey*: https://www.financialprofessionals.org/about/learn-more/press-releases/Details/over-75-percent-of-us-firms-experienced-payments-fraud-in-2025-while-ai-adoption-for-fraud-mitigation-lags |
| "Fake business emails cost companies $2.77 billion in a single year." | $2.77B (21,442 complaints) | 2024 | FBI IC3 2024 Internet Crime Report, via Nacha: https://www.nacha.org/news/fbis-ic3-finds-almost-85-billion-lost-business-email-compromise-last-three-years |
| "India's biggest carmaker couldn't build 46,000 cars in one quarter, for want of chips." | ~46,000 units (Oct–Dec 2022); 3.63 lakh orders pending | 2023 | Maruti Suzuki CFO via PTI / DT Next: https://www.dtnext.in/news/business/semiconductor-shortage-continues-to-impact-maruti-suzukis-production |
| "Duplicate payments are the biggest single cause of lost profit in accounts payable." | 18% of lost profit (400M+ invoices, $3.25T spend) | 2026 | apexanalytix 2026 Global Overpayment Report: https://www.apexanalytix.com/resources/blog/apexanalytix-2026-global-overpayment-report/ |
| "Manufacturers leak more spend to payment errors than any other industry." | 0.72% of annual spend | 2026 | Xelix analysis of 481M invoices (via BriefGlance): https://briefglance.com/articles/ai-plugs-the-53-billion-leak-in-corporate-accounts-payable |
| "A ten-dollar quote becomes a fifteen-dollar part once it lands." | +56% landed vs factory quote | 2025 | Sourcify, Hidden Factory Costs: https://sourcify.com/blog/uncovering-the-hidden-factory-costs/ |
| "85% of supply-chain risk starts with your supplier's suppliers." | 85% below Tier 1 | 2025 | Sphera N-Tier survey (500 CPOs): https://procurementmag.com/risk-management/sphera-cpo-cso-survey |
| "Paying early on 2/10 net 30 is a 37% annual return most buyers miss." | ~37% annualized | 2026 | AFP: https://www.financialprofessionals.org/training-resources/resources/articles/Details/when-does-it-pay-to-take-an-early-payment-discount |

Which ONE should open the video? → **"One hour of downtime in a large car plant costs $2.3 million."** It is the most visual and matches our user exactly. Second beat uses the **Maruti 46,000 cars** line, because it is Indian and makes the "one missing part" fear concrete.

---

## 4. PayPal sandbox: exactly what we use and why it matters

All IDs below are real **PayPal sandbox** transactions made by DisruptionOps (merchant `sb-unq5y53709739@business.example.com`; buyer `dops-buyer-dada@business.example.com`).

| PayPal product | API / endpoint / SDK call | Code file | When the agent calls it (trigger) | Example from the demo (IDs, amounts) | Why it matters for this ecosystem |
|---|---|---|---|---|---|
| **Vault v3: setup token** (spending mandate) | `POST /v3/vault/setup-tokens` (usage_type MERCHANT, ON_PAYER_APPROVAL) | `backend/app/paypal_client.py` | Once, when the plant connects its PayPal wallet and approves "agent may spend for us" | Setup token **0FC18452DJ213630Y**, approved by the buyer on PayPal's own page | The human consents **once**, on PayPal; the agent never sees a password or card. |
| **Vault v3: payment token** | `POST /v3/vault/payment-tokens` | same | Right after the approval returns to `/mandate/return` | Vault id **429990492e962572x** (customer **dVPWCuakiw**) | Turns that one consent into a reusable, revocable mandate: the basis of agentic commerce. |
| **Orders v2: hold funds** | `POST /v2/checkout/orders` with `intent: AUTHORIZE` + `payment_source.paypal.vault_id` | same + `finance_agent.py` | Deterministic solver picks a recovery supplier → agent places a hold, no human click | Order **2YD51330MB766861S** → authorization **5LK9680517471812N**, **$6,580** for PO-7790 (expires 4 Dec 2026). Order **4EY1554464456701K** → authorization **45357457J6295492T**, **$5,880** for PO-7712 | Money is **reserved but not moved**, so the supplier sees committed funds and the buyer keeps control. |
| **Payments v2: capture** | `POST /v2/payments/authorizations/{id}/capture` | same | Warehouse confirms receipt + QC → three-way match passes (PO ↔ invoice ↔ goods receipt) | Capture **91M79894DL640601B**, **$6,580**, COMPLETED | Payment happens only after verified goods. |
| **Payments v2: void** | `POST /v2/payments/authorizations/{id}/void` | same | Carrier contradicts the supplier's dispatch claim (scenario S3) | Authorization **45357457J6295492T** → **VOIDED** ($5,880 never left the buyer) | The lie costs the liar, not the buyer: no chargeback chase. |
| **Payments v2: refund** | `POST /v2/payments/captures/{id}/refund` | same | Goods arrive but fail QC after payment (wrong silicon revision) | Capture **4YS16732CG4236228** ($1,240, PO-7730) → refund **2H629030W4747693S**, COMPLETED | Money comes back automatically when the goods were wrong. |
| **Payouts** | `POST /v1/payments/payouts` | same | Paying a freight forwarder an expedite fee; releasing funds to the supplier | Batch **BZYS2T6Z25Y7G**: **$15** expedite fee to AeroCell → **SUCCESS**; supplier releases paid the same way after capture | Suppliers and forwarders get paid instantly, in one call, the moment goods are verified. |
| **Webhooks** | `POST /v1/notifications/webhooks` (register) + `POST /v1/notifications/verify-webhook-signature` | `backend/app/main.py` → `/api/webhooks/paypal` | Every PayPal state change, so the app trusts PayPal and not its own memory | Endpoint `https://agentic-logistic-orchestration-system.onrender.com/api/webhooks/paypal`; signature verified on every event; idempotent by event id | Signed events keep the agent's view of the money identical to PayPal's. |
| **Payments v2: partial capture** | `POST /v2/payments/authorizations/{id}/capture` with `amount` < held and `final_capture:false` | `finance_agent.py` | Goods accepted but late or partly rejected: capture = accepted value − late-delivery credit, keep 10% retention | PO-7744 AeroCell: held **$4,200**, captured **$4,020** (−$180 late credit, 6 days × 5%/week) | The penalty is enforced by the payment itself; no chasing a credit note. |
| **Payments v2: reauthorize** | `POST /v2/payments/authorizations/{id}/reauthorize` | `finance_agent.py` (Hold-Expiry Guard) | Any hold ≥ 25 days old while goods are still in transit | Sea shipment PO-7761: hold refreshed before expiry | Long ocean legs stay protected; a hold never silently lapses. |
| **Refusal is a feature** (no API call) | Guards run *before* `create order` / `capture` / `payout` | `finance_agent.py` → `guard_events` table | Broker quote 4.6× should-cost; duplicate invoice `ZH-INV-55120-A`; payout to a changed payee | **$7,770** overcharge avoided, **$5,880** duplicate blocked, **$4,410** redirect stopped | The safest PayPal call is the one the agent refuses to make. |
| **PayPal Agent Toolkit** (read-only) | Agent Toolkit tools (order / invoice lookup) | `backend/app/agent_tools.py` | When a user asks the chat agent "has Formosa been paid?" | "Formosa Precision: $6,580 captured for PO-7790" | PayPal + AI together, with zero write access for the LLM. |

Also answer:

| Question | Your answer |
|---|---|
| Sandbox only, or anything live? | **Sandbox only.** Nothing touches live money. |
| Webhooks received? Which event types? | **Yes**, signature-verified: PAYMENT.AUTHORIZATION.CREATED, PAYMENT.AUTHORIZATION.VOIDED, PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.REFUNDED, PAYMENT.PAYOUTS-ITEM.SUCCEEDED, VAULT.PAYMENT-TOKEN.CREATED. |
| The full money lifecycle, in order (e.g. hold → … → release / void / refund) | **Mandate** (Vault, human approves once) → **Hold** (Orders AUTHORIZE: buyer's funds reserved) → **Invoice read** (Gemini extracts it; Python does the three-way match) → **Capture** on verified goods, then **Payout** to the supplier. Bad paths: **Void** if the supplier's claim is contradicted, **Refund** if goods fail QC after capture. Over-limit amounts: the hold still happens, but **release waits for a human code**. |
| Spending rules (agent limit, who approves above it, how: code/email/…) | Three limits, all deterministic: (1) **per order**: the agent holds and releases up to **$5,000** alone; above that the hold is placed but **capture waits** for a **6-digit one-time code sent by email**; (2) **per project budget envelope** (e.g. PRJ-2041: $48,000 for Nov–Jan); a hold that would break it also needs the code; (3) **payee lock**: payouts only to the supplier's verified PayPal email; changing it takes 72 h + the code + a confirmation to the old contact. |
| How PayPal solves the trust problem between buyer and supplier, in 2–3 sentences | The supplier sees money **committed** through PayPal the moment the order is placed, so they ship. The buyer's money only **moves** when goods are verified, and is **voided or refunded** automatically if the supplier lied or shipped the wrong part. PayPal is the neutral party holding the money, so neither side has to trust the other's word. |
| The ONE sentence about PayPal judges should remember | **"Seven guards stand between the AI and your money: PayPal holds it, and it moves only on proof, to the right supplier, at a fair price, once."** |
| Proof we can show (sandbox dashboard screenshots / transaction IDs) | IDs above (orders 2YD51330MB766861S / 4EY1554464456701K, authorizations 5LK9680517471812N / 45357457J6295492T, capture 91M79894DL640601B, refund 2H629030W4747693S, payout batch BZYS2T6Z25Y7G). Sandbox **Activity** page for `dops-buyer-dada@business.example.com` shows the holds, the capture, the void and the refund; the in-app Payments ledger shows the same PayPal IDs. |

---

## 5. How it works (the product's moves)

All screens are live at **agenticlogisticsystem.vercel.app**. The product is a **Buyer Shield**: seven guards, every one visible on screen.

| # | What the product does | Which screen / URL shows it | The exact on-screen moment (button, number, label) | Real data shown (IDs, amounts) |
|---|---|---|---|---|
| 1 | **Watches every project and every shipment** on a live globe, with the Buyer Shield total | `/` Mission Control | Globe over India, routes into "Pune Plant 1"; KPI strip **"Protected $25,438 · Timers red 3 · Held $35,790"** | 5 projects, 8 inbound shipments, 12 suppliers |
| 2 | **Buy timers**: tells you the last day to order each part so the project still ships | `/projects/PRJ-2043?tab=timers` | Row **"PCB-12 · order by 9 Nov · 2 d 04 h"** turns red; button **"Agent drafted PO-7801"**; Gantt shows a diamond **"Order-by"** before the bar | 23 timers, 3 red, 0 projects slipped |
| 3 | **Fair-price guard** blocks a broker markup | Materials inspector → "Price check" | **"Quote $14.20 · should-cost $3.10 · 4.6× → Broker markup: blocked"**; second option **"Formosa $3.24 ✓"** | $7,770 overcharge avoided |
| 4 | **Catches the lie** (claim vs carrier) and **voids the hold** | `/projects/PRJ-2041?tab=materials` → PO-7712 | **"Supplier says: Dispatched 3 days ago"** vs **"COSCO: Label created — no pickup"** → **"Hold voided $5,880"** | Authorization 45357457J6295492T VOIDED |
| 5 | **Payee lock + duplicate shield** | `/payments` ledger | Red rows: **"Payee change from look-alike domain: blocked, 72 h lock"** ($4,410); **"ZH-INV-55120-A duplicate of ZH-INV-55120: blocked"** ($5,880) | guard_events G-114, G-118 |
| 6 | **Pays on proof, minus penalties** | `/payments` → PO-7744 PaymentCard | ThreeWayMatch ✓ → **"Late-delivery credit −$180 (6 days × 5%/wk)"** → **"Captured $4,020 of $4,200"** → Payout to 🔒 verified email | Partial capture, payout SUCCESS |
| 7 | **Budget envelope** keeps the project on budget | `/projects/PRJ-2041?tab=money` | Burn bar **"$31,420 committed of $48,000 · forecast $44,900"**; a $9,855 air option would cross the line → **Approvals** card with 6-digit code | APR-88 |
| 8 | **Hidden shared supplier** found under a "dual source" | `/shipments` globe | Two connector routes (Delta, Kirin) converge on a red node **"Penang Plating Works: shared sub-supplier"** | S2 flag on COMP-131 |
| 9 | **Re-plans the timeline** | `/projects/PRJ-2041?tab=timeline` (Bryntum Gantt) | Bars shift after PO-7790; teal diamonds **"Release funds (after QC)"**; red **Due** line still met | SCU-700, due in 6 days |

---

## 6. Tech stack (what we used)

| Layer | Tools / services (exact names) | Why we chose it (one line) |
|---|---|---|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS v4, shadcn/ui, Motion, lucide-react, React Router 7, Zustand, TanStack Query; **AG Grid Enterprise 36** + **AG Studio 3.1**; **Bryntum Gantt / Scheduler / TaskBoard 8** | A dense, "frosted glass on lavender" control room, with grids and timelines built for real operations data. |
| Backend | Python 3.12, **FastAPI**, asyncpg, httpx, WebSockets | An async API for an agent that reacts to events in real time. |
| Database | **Supabase Postgres** (project AUTONOMOUS_CRM, 10 migrations, row-level security, multi-tenant `org_id`) | One source of truth with tenant isolation and an audit log that survives resets. |
| AI / LLM (model + what it is and isn't allowed to do) | **Google Gemini** (`GEMINI_MODEL` in `.env`). **Allowed:** read supplier emails and warehouse replies, extract claims, dates and invoice totals, spot contradictions, explain decisions. **Not allowed:** choose a supplier, approve spend, or call any PayPal write API. | Language is messy, money isn't; the model handles the messy part only. |
| Decision engine | Deterministic Python: `backend/app/solver.py` (hard constraints: certification, hazmat-can't-fly, budget, due date), `agent.py` state machine, `finance_agent.py` three-way match, authority limit and the **7 Buyer Shield guards** (fair price, budget envelope, payee lock, duplicate shield, late-delivery credit, quality holdback, hold expiry), `timers.py` buy timers | Every money decision is reproducible and readable; every refusal is logged in `guard_events`. |
| Payments | **PayPal sandbox**: Vault v3, Orders v2 (AUTHORIZE), Payments v2 (capture / void / refund), Payouts, Webhooks | Holds that are captured on proof and voided on lies give trust between strangers. |
| Email / messaging | Gmail **SMTP** out, **IMAP** in; supplier and warehouse threads (`comms.py`) | Suppliers live in email, so the agent works where they are. |
| Maps / visualization | **Mapbox GL JS 3** (globe projection, great-circle routes), Recharts, AG Charts (inside AG Studio) | A real Earth with real routes; you can zoom from the globe to a street. |
| Hosting | **Vercel** (frontend), **Render** Docker web service (backend: agentic-logistic-orchestration-system.onrender.com), Supabase (database) | Push to `main` deploys both. |

---

## 7. Results and proof numbers

| Metric | Value | Where it comes from |
|---|---|---|
| Money protected by the Buyer Shield (all 7 guards) | **$25,438** | live app, Mission Control "Protected" (sum of guard_events) |
| ↳ voided on a supplier lie | $5,880 | PayPal authorization 45357457J6295492T |
| ↳ refunded on failed QC | $1,240 | refund 2H629030W4747693S |
| ↳ broker overcharge blocked | $7,770 | Fair-price guard, PRJ-2041 |
| ↳ duplicate invoice blocked | $5,880 | Duplicate shield |
| ↳ payee-change redirect stopped | $4,410 | Payee lock |
| ↳ late-delivery credit deducted | $180 | Partial capture, PO-7744 |
| ↳ early-pay discount captured | $78 (37% annualized) | Delta Connectors 2/10 net 30 |
| Buy timers running / red handled / projects slipped | **23 / 3 / 0** | Buy-timers tab |
| Supplier claims checked vs carrier/warehouse | **192** (17 contradictions) | Suppliers page |
| Money held in PayPal, released only on proof | **$35,790** | Payments KPI "Held" |
| Real sandbox money moved | $13,700 held · $7,820 captured · $5,880 voided · $1,240 refunded · $15 paid out | PayPal sandbox (IDs in §4) |
| Disruption → funded recovery plan | **~1 h 18 min** | INC-301 step timestamps |

---

## 8. Highlights: rank what the judges must see

| Rank | Highlight | One-line proof |
|---|---|---|
| 1 | **Seven guards between the AI and your money** (the Buyer Shield) | Mission Control "Protected $25,438"; each guard has a row in the ledger. |
| 2 | **The lie gets caught, and the money never leaves** | PO-7712 claim vs carrier → authorization 45357457J6295492T **VOIDED**. |
| 3 | **The deadline is protected before anything goes wrong** | Buy timer turns red → agent drafts the PO → Gantt "Order-by" diamond → project still meets Due. |
| 4 | **PayPal enforces the contract**: holds, partial capture with late credit, payout only to the locked payee | PO-7744: $4,200 held → $4,020 captured → payout to 🔒 email. |
| 5 | **AI reads, Python decides, PayPal moves** | Every step tagged Gemini / Solver / PayPal; Gemini never touches a money step. |

---

## 9. Draft beats (~80 s)

Voice-over directions are written for Fish Audio Drama 3 (each line well under 500 characters).

| # | Time (s) | Voice-over (exact words) | On screen | Cursor / button | Handoff into next beat |
|---|---|---|---|---|---|
| 1 | 0.0–3.5 | "[low, measured] One hour of downtime in a car plant costs two point three million dollars." | Black → **$2,300,000** counter ticking; "Siemens, 2024" | — | Digits scatter into a headline |
| 2 | 3.5–7.5 | "[heavier] India's biggest carmaker couldn't build forty-six thousand cars in one quarter. <slow>For want of chips.</slow>" | Headline card "46,000 cars not built · Oct–Dec 2022"; a single chip icon blinks red | — | Chip icon flies into an inbox |
| 3 | 7.5–13.0 | "[tense, quick] Suppliers overcharge. [beat] Push dates back. [beat] Invoice twice. [beat] And say it shipped when it didn't." | Four email cards stack fast: broker quote **$14.20**, "revised ETD +9 days", **ZH-INV-55120-A**, "Goods dispatched 3 days ago" | — | Cards freeze, crack, fall away |
| 4 | 13.0–16.0 | "[confident, warm] Meet DisruptionOps. Your buyer-side agent." | Wordmark assembles; lavender glass washes in | — | Wordmark lifts into Mission Control top bar |
| 5 | 16.0–21.0 | "It watches every project, every part, every shipment." | `/` Mission Control: globe over India, routes into Pune; KPI **Protected $25,438** | Cursor hovers the KPI | Zoom into PRJ-2043 |
| 6 | 21.0–27.0 | "It knows the last day you can order each part, [beat] and orders before the deadline is at risk." | Buy-timers tab: **PCB-12 · order by 9 Nov · 2 d 04 h** turns red → "Agent drafted PO-7801"; Gantt order-by diamond | Cursor clicks the red timer | Inspector opens on the quote |
| 7 | 27.0–32.0 | "[dry] A broker wants four times the fair price. [beat] Blocked." | Price check **$14.20 vs should-cost $3.10 · 4.6× · Blocked**; Formosa $3.24 ✓ chosen | — | Slide to PO-7712 |
| 8 | 32.0–38.5 | "An AI reads the supplier's email. [beat] Plain code checks the carrier. [emphatic] The story doesn't match, so the PayPal hold is voided." | "Supplier says / Carrier says" → **Contradiction** → **Hold voided $5,880** | Cursor clicks PO-7712 | Ledger scrolls in |
| 9 | 38.5–44.0 | "[cool] A duplicate invoice. A new bank account from a look-alike domain. [beat] Neither gets paid." | Payments ledger: red rows **Duplicate blocked $5,880**, **Payee change blocked $4,410 · 72 h lock** | — | Row PO-7744 expands |
| 10 | 44.0–50.5 | "[rising] Money moves only on proof, [beat] minus what the supplier owes you for being late." | PaymentCard PO-7744: ThreeWayMatch ✓ → **Late credit −$180** → **Captured $4,020 of $4,200** → payout to 🔒 email | — | Card shrinks into the Money tab |
| 11 | 50.5–56.5 | "And it keeps every project inside its budget. [beat] Over the line, it asks you first." | Money tab burn bar **$31,420 of $48,000**; Approvals card **"Release $9,855?"**, code typed, **Approve** | Cursor types the code | Check-mark becomes a globe pin |
| 12 | 56.5–62.0 | "It even finds the hidden supplier your two backups secretly share." | Globe: two connector routes converge on red node **Penang Plating Works** | — | Globe pulls back to Gantt |
| 13 | 62.0–67.0 | "So the project still ships on time." | Bryntum Gantt: bars shift, Due line met, teal "Release funds" diamonds | — | Gantt collapses into numbers |
| 14 | 67.0–74.0 | "Twenty-five thousand dollars protected. [beat] Zero projects slipped. [beat] Every move through PayPal." | **$25,438 protected · 0 slipped · 23 buy timers · 7 guards** | — | Numbers fold into the tagline |
| 15 | 74.0–80.0 | "[quiet, certain] DisruptionOps. Never pay for what didn't arrive." | End card: logo, tagline, sub-line *Money moves only on proof*, **agenticlogisticsystem.vercel.app**, "Built on PayPal sandbox" | — | Fade to lavender |

---

## 10. Send back

1. This file, filled in. ✔
2. Screenshots / recording: PayPal sandbox **Activity** page (`dops-buyer-dada@business.example.com`) showing the holds, capture, void and refund; plus the in-app Payments ledger with the same IDs.
3. Logo: **N/A.** There is no official logo; the app currently uses a lucide "Workflow" icon on a violet→azure gradient square.
