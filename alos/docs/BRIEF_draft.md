# Task: write up the DisruptionOps project details (for the launch video)

---

## 0. The format we use

(Unchanged. Beat table: `| # | Time (s) | Voice-over (exact words) | On screen | Cursor / button | Handoff into next beat |`. Shape: problem → pain (real number) → "Meet DisruptionOps" → 3–4 proof beats on the real UI → result numbers → tagline → logo.)

---

## 1. Project basics

| Field | Your answer |
|---|---|
| Product name (exact spelling + how it's pronounced) | **DisruptionOps**, one word with a capital D and capital O. Say "dis-RUP-shun ops" (rhymes with "corruption ops"). |
| One-line description (≤ 12 words) | AI agent that rescues stalled production and pays suppliers only on proof. |
| Tagline for the end card (≤ 6 words) | **Money moves only on proof.** |
| Hackathon name + track | **Build What's Next with PayPal and AI** (PayPal global online hackathon, Devpost). No tracks. Prize categories we are aiming at: Best Use of Agentic Commerce, Best Use of PayPal + AI, Best Use of AG Grid, Best Use of Bryntum, Best Use of Render. |
| Team name + members (as they should appear) | Team **kala dhua**: Ayush Pathak · Shreeviraj Matale · Meet Shah · Krishna Lokhande · Pooja Wavdara |
| Live URL to show on the end card | **agenticlogisticsystem.vercel.app** |
| Repo URL | **github.com/officialayush23/Agentic-Logistic-Orchestration-System** |
| Who is the user? (role, company type) | The **supply-chain / procurement lead at a Tier-1 automotive electronics plant** (in the demo: Pune Plant 1, Chakan, building controllers and battery-management systems for EV makers like "Bharat EV Motors"). Second user: the **plant finance approver**, who signs off on anything above the agent's $5,000 limit. |

---

## 2. The problem, in the user's words

| Field | Your answer |
|---|---|
| The pain in one sentence | "A supplier tells me the parts shipped, I pay, the line stops anyway, and I find out a week later that nothing ever left their dock." |
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

Which ONE should open the video? → **"One hour of downtime in a large car plant costs $2.3 million."** It is the most visual, it matches our user exactly (automotive), and it makes the 6-day countdown feel expensive.

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
| **PayPal Agent Toolkit** (read-only) | Agent Toolkit tools (order / invoice lookup) | `backend/app/agent_tools.py` | When a user asks the chat agent "has Formosa been paid?" | "Formosa Precision: $6,580 captured for PO-7790" | PayPal + AI together, with zero write access for the LLM. |

Also answer:

| Question | Your answer |
|---|---|
| Sandbox only, or anything live? | **Sandbox only.** Nothing touches live money. |
| Webhooks received? Which event types? | **Yes**, signature-verified: PAYMENT.AUTHORIZATION.CREATED, PAYMENT.AUTHORIZATION.VOIDED, PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.REFUNDED, PAYMENT.PAYOUTS-ITEM.SUCCEEDED, VAULT.PAYMENT-TOKEN.CREATED. |
| The full money lifecycle, in order (e.g. hold → … → release / void / refund) | **Mandate** (Vault, human approves once) → **Hold** (Orders AUTHORIZE: buyer's funds reserved) → **Invoice read** (Gemini extracts it; Python does the three-way match) → **Capture** on verified goods, then **Payout** to the supplier. Bad paths: **Void** if the supplier's claim is contradicted, **Refund** if goods fail QC after capture. Over-limit amounts: the hold still happens, but **release waits for a human code**. |
| Spending rules (agent limit, who approves above it, how: code/email/…) | The agent can hold and release up to **$5,000** per order alone. Above that it still **places the hold** (so the supplier is secured) but **capture waits** for the project owner to enter a **6-digit one-time code sent by email** (Approvals screen). |
| How PayPal solves the trust problem between buyer and supplier, in 2–3 sentences | The supplier sees money **committed** through PayPal the moment the order is placed, so they ship. The buyer's money only **moves** when goods are verified, and is **voided or refunded** automatically if the supplier lied or shipped the wrong part. PayPal is the neutral party holding the money, so neither side has to trust the other's word. |
| The ONE sentence about PayPal judges should remember | **"The AI reads the emails, but only verified facts can move money, through PayPal holds that are captured on proof and voided on lies."** |
| Proof we can show (sandbox dashboard screenshots / transaction IDs) | IDs above (orders 2YD51330MB766861S / 4EY1554464456701K, authorizations 5LK9680517471812N / 45357457J6295492T, capture 91M79894DL640601B, refund 2H629030W4747693S, payout batch BZYS2T6Z25Y7G). Sandbox **Activity** page for `dops-buyer-dada@business.example.com` shows the holds, the capture, the void and the refund; the in-app Payments ledger shows the same PayPal IDs. |

---

## 5. How it works (the product's moves)

All screens are live at **agenticlogisticsystem.vercel.app**.

| # | What the product does | Which screen / URL shows it | The exact on-screen moment (button, number, label) | Real data shown (IDs, amounts) |
|---|---|---|---|---|
| 1 | **Watches every shipment behind every customer project** on a live globe | `/` Mission Control | Mapbox globe centred on India; routes into "Pune Plant 1"; red route from Shenzhen; KPI **"Units at risk 1,530"** | 8 shipments into Pune, 12 suppliers on 4 continents |
| 2 | **Catches the supplier's lie**: email claim vs carrier truth | `/projects/PRJ-2041?tab=materials` → click row **PO-7712** | Inspector: **"Supplier says: Dispatched 3 days ago"** vs **"Carrier says · COSCO Shipping: Label created — no pickup"**, then the badge **"Contradiction — the agent will not pay on this claim"** | PO-7712, Zhen Hua Electronics (reliability **41**), tracking COSU6218840 |
| 3 | **Voids the hold and re-sources**, with the PayPal trail visible | Same inspector (PaymentCard) or `/payments` → ledger row PO-7712 | Badge **"Hold voided" $5,880**; timeline ends **PAYMENT.AUTHORIZATION.VOIDED — "Hold voided by deterministic rule R-07"** | $5,880 voided; new hold **$6,580** for PO-7790 (Formosa Precision, air, CI 6831) |
| 4 | **Shows why**: the solver compared options and refused unsafe ones | `/agent` → card **INC-301** | Options table: **Formosa · air, score 0.91, "chosen"**; **Budget Semicon · sea, 0.00, "rejected: No AEC-Q100 certificate — hard constraint"** | INC-301 (S3 · Adversarial supplier), 10-step trail with Solver / Gemini / PayPal tags |
| 5 | **Asks a human only above the limit** | `/approvals` | **"Release $9,855 to AeroCell Logistics?"**, 6-box one-time code, button **"Approve & hold funds"** | APR-88, PO-7742, limit $5,000 |
| 6 | **Re-plans the whole project timeline** | `/projects/PRJ-2041?tab=timeline` (Bryntum Gantt) | Production bars start after PO-7790 lands; teal diamonds **"Release PO-7790 funds (after QC)"**; red **Due** line | SCU-700, due in 6 days |

---

## 6. Tech stack (what we used)

| Layer | Tools / services (exact names) | Why we chose it (one line) |
|---|---|---|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS v4, shadcn/ui, Motion, lucide-react, React Router 7, Zustand, TanStack Query; **AG Grid Enterprise 36** + **AG Studio 3.1**; **Bryntum Gantt / Scheduler / TaskBoard 8** | A dense, "frosted glass on lavender" control room, with grids and timelines built for real operations data. |
| Backend | Python 3.12, **FastAPI**, asyncpg, httpx, WebSockets | An async API for an agent that reacts to events in real time. |
| Database | **Supabase Postgres** (project AUTONOMOUS_CRM, 10 migrations, row-level security, multi-tenant `org_id`) | One source of truth with tenant isolation and an audit log that survives resets. |
| AI / LLM (model + what it is and isn't allowed to do) | **Google Gemini** (`GEMINI_MODEL` in `.env`). **Allowed:** read supplier emails and warehouse replies, extract claims, dates and invoice totals, spot contradictions, explain decisions. **Not allowed:** choose a supplier, approve spend, or call any PayPal write API. | Language is messy, money isn't; the model handles the messy part only. |
| Decision engine | Deterministic Python: `backend/app/solver.py` (hard constraints: certification, hazmat-can't-fly, budget, due date), `agent.py` state machine, `finance_agent.py` three-way match + authority limit | Every money decision is reproducible and readable. |
| Payments | **PayPal sandbox**: Vault v3, Orders v2 (AUTHORIZE), Payments v2 (capture / void / refund), Payouts, Webhooks | Holds that are captured on proof and voided on lies give trust between strangers. |
| Email / messaging | Gmail **SMTP** out, **IMAP** in; supplier and warehouse threads (`comms.py`) | Suppliers live in email, so the agent works where they are. |
| Maps / visualization | **Mapbox GL JS 3** (globe projection, great-circle routes), Recharts, AG Charts (inside AG Studio) | A real Earth with real routes; you can zoom from the globe to a street. |
| Hosting | **Vercel** (frontend), **Render** Docker web service (backend: agentic-logistic-orchestration-system.onrender.com), Supabase (database) | Push to `main` deploys both. |

---

## 7. Results and proof numbers

| Metric | Value | Where it comes from |
|---|---|---|
| Supplier claims checked against carrier/warehouse | **192** | live app, Suppliers page |
| Lies / contradictions caught | **17** | live app, Suppliers page |
| Money protected (voided + refunded, never paid for bad goods) | **$15,490** | live app, Payments KPI "Voided or refunded" |
| Money held in PayPal, released only on verified goods | **$35,790** | live app, Payments KPI "Held" |
| Real sandbox money moved by the PayPal flow | **$13,700 held · $7,820 captured · $5,880 voided · $1,240 refunded · $15 paid out** | PayPal sandbox (IDs in §4) |
| Time from disruption to funded recovery plan | **~1 h 18 min** (line-stop detected → backup funded and on a plane) | live app, INC-301 step timestamps |
| Options the solver compared / rejected for INC-301 | **4 compared, 2 rejected** (uncertified; too slow by sea) | live app, Agent Board INC-301 |

---

## 8. Highlights: rank what the judges must see

| Rank | Highlight | One-line proof |
|---|---|---|
| 1 | **The lie gets caught, and the money never leaves** | PO-7712: "Dispatched 3 days ago" vs "Label created, no pickup" → PayPal authorization 45357457J6295492T **VOIDED** ($5,880). |
| 2 | **AI reads, Python decides, PayPal moves** (the LLM can't touch money) | Every step on INC-301 is tagged Gemini / Solver / PayPal; Gemini never appears on a money step. |
| 3 | **Hold → verify → capture: agentic commerce with a human mandate** | One Vault approval → order 2YD51330MB766861S authorized $6,580 → captured 91M79894DL640601B after QC. |
| 4 | **A human only above the limit** | Approvals: "Release $9,855 to AeroCell Logistics?" with an emailed 6-digit code. |
| 5 | **Everything organised by customer project, on a real globe** | PRJ-2041 → materials → POs → shipments → money; Mapbox globe, AG Grid tree, Bryntum Gantt. |

---

## 9. Draft beats (~55 s)

Voice-over directions are written for Fish Audio Drama 3 (each line well under 500 characters).

| # | Time (s) | Voice-over (exact words) | On screen | Cursor / button | Handoff into next beat |
|---|---|---|---|---|---|
| 1 | 0.0–3.2 | "[low, measured] One hour of downtime in a car plant costs two point three million dollars." | Black → a **$2,300,000** counter ticks up per second; small source line "Siemens, 2024" | — | Counter digits scatter into a 6-day countdown |
| 2 | 3.2–7.0 | "[tense, clipped] Seven hundred controllers. [short pause] Due in six days. [short pause] <slow>Zero on hand.</slow>" | Countdown **6 days**; "700 MCUs · 0 on hand · SCU-700 · Bharat EV Motors" | — | Countdown shrinks into an email card |
| 3 | 7.0–11.5 | "[almost friendly, then sharp] The supplier says it shipped. [beat] The carrier says it never left." | Email: *"Goods dispatched 3 days ago. Please release payment."* slides beside COSCO tracking **"Label created — no pickup"**; red line connects them | — | Red line becomes the red route on the globe |
| 4 | 11.5–14.5 | "[confident, warm] Meet DisruptionOps." | Wordmark assembles; lavender glass washes in | — | Wordmark lifts to the top bar of Mission Control |
| 5 | 14.5–19.5 | "It watches every shipment behind every customer order." | `/` Mission Control: Mapbox globe over India, routes into Pune, red route from Shenzhen | Cursor clicks the red route | Zoom into the project screen |
| 6 | 19.5–25.5 | "An AI reads the supplier's email. [beat] Plain code checks it against the carrier." | `/projects/PRJ-2041?tab=materials`, PO-7712 inspector: "Supplier says" vs "Carrier says"; badge **"Contradiction — the agent will not pay on this claim"** | Cursor clicks row **PO-7712** | Badge flips into the PayPal timeline |
| 7 | 25.5–31.5 | "[emphatic] So the money never moves. [beat] The PayPal hold is voided, and a certified backup is funded by air." | PaymentCard: **"Hold voided" $5,880**, PAYMENT.AUTHORIZATION.VOIDED; new hold **$6,580** for Formosa | — | Timeline row expands into the solver's options table |
| 8 | 31.5–36.5 | "Every choice is explained. [beat] Unsafe options never make the list." | `/agent` INC-301: Formosa · air **0.91 chosen**; Budget Semicon **rejected: no AEC-Q100** | Cursor hovers "chosen" | Table slides away to reveal the Approvals card |
| 9 | 36.5–41.5 | "Above five thousand dollars, it holds the money and asks you." | `/approvals`: "Release $9,855 to AeroCell Logistics?", six code boxes fill in | Cursor types the code, clicks **Approve & hold funds** | Check-mark becomes a diamond on the Gantt |
| 10 | 41.5–46.5 | "[rising] Funds are released only when the goods are in the building." | `/projects/PRJ-2041?tab=timeline`: Gantt, teal diamonds "Release PO-7790 funds (after QC)" | — | Gantt collapses into three result numbers |
| 11 | 46.5–51.5 | "Seventeen lies caught. [beat] Fifteen thousand dollars never paid for bad goods." | **17** · **$15,490** · **$35,790 held, not moved** | — | Numbers fold into the tagline |
| 12 | 51.5–55.0 | "[quiet, certain] DisruptionOps. Money moves only on proof." | End card: logo, tagline, **agenticlogisticsystem.vercel.app**, "Built on PayPal sandbox" | — | Fade to lavender |

---

## 10. Send back

1. This file, filled in. ✔
2. Screenshots / recording: PayPal sandbox **Activity** page (`dops-buyer-dada@business.example.com`) showing the holds, capture, void and refund; plus the in-app Payments ledger with the same IDs.
3. Logo: **N/A.** There is no official logo; the app currently uses a lucide "Workflow" icon on a violet→azure gradient square.
