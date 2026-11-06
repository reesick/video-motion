# Task: write up the DisruptionOps project details (for the launch video)

**Who:** you, because you know the project best.
**Why:** we're building a 45–60 s launch video for the **PayPal hackathon**, and every word and number in it has to come
from you, not from guesses. The video is generated in code from this file, so **the format matters**: fill in each
section exactly as shown, then send the file back.

**How to fill it in**
- Replace every `<…>` with your answer. Keep the tables as tables.
- Use real values from the product: exact names, IDs, amounts, API names.
- Short and concrete wins: "voids the $5,880 hold on PO-7712", not "handles payments smartly".
- If something doesn't exist, write `N/A`. Don't leave it blank.
- Every number needs a source: `live app`, `code: <file>`, or a link.

---

## 0. The format we use (and an example from our last video)

The film is planned in **beats**. One beat = one voice-over line + what's on screen + how it turns into the next beat.
Nothing fades in; every scene grows out of the previous one, so each beat must name its **handoff**.

```
| # | Time (s) | Voice-over (exact words) | On screen | Cursor / button | Handoff into next beat |
```

Example: our Madison video (an AI marketing assistant). The final result looked like this:

| # | Time | Voice-over | On screen | Cursor / button | Handoff |
|---|---|---|---|---|---|
| 1 | 0.0–1.1 | "In today's world," | Google search pill types "Restaurants near me" | — | Pill grows into the results card |
| 4 | 9.3–13.2 | "But building one is time-consuming and complex," | Confused owner; 8 task boxes spring out around him | — | Boxes get sucked in; circle morphs into an invoice |
| 5 | 13.2–17.2 | "…hiring someone to do it for you is expensive." | Invoice from "$$$ Expensive Ineffective Marketing LLC." counts up to **$3,500.00** | — | Invoice drops; purple circles roll in |
| 6 | 17.2–23.3 | "Until now, meet Madison…" | "Madison" wordmark assembles letter by letter | — | Edge circle floods the screen purple |
| 8 | 32.4–37.3 | "Just connect your business's accounts." | Integrations page | Cursor clicks Connect on Google, Instagram… | Window slides up and out |

The shape that works: **problem → pain (with a real number) → "Meet <product>" → 3–4 proof beats on the real UI → result numbers → one-line tagline → logo.**

The voice-over is generated with **Fish Audio Drama 3**, at most **500 characters per generation**. Directions go in
`[square brackets]`; tags change single words. Example:
```
[tense, clipped, each fact lands like a countdown] Seven hundred controllers. [short pause] Due in six days. [short pause] <slow>Zero on hand.</slow>
```

---

## 1. Project basics

| Field | Your answer |
|---|---|
| Product name (exact spelling + how it's pronounced) | <…> |
| One-line description (≤ 12 words) | <…> |
| Tagline for the end card (≤ 6 words) | <…> |
| Hackathon name + track | <…> |
| Team name + members (as they should appear) | <…> |
| Live URL to show on the end card | <…> |
| Repo URL | <…> |
| Who is the user? (role, company type) | <…> |

---

## 2. The problem, in the user's words

| Field | Your answer |
|---|---|
| The pain in one sentence | <…> |
| What happens today without the product (step by step, who does what) | <…> |
| What it costs when it goes wrong (time / money / line stop) | <…> |
| One real-feeling story we can dramatize (who, what part, what went wrong) | <…> |

---

## 3. Industry numbers (how big this is globally)

Give 3–5 figures, **each with a source link**. Market size, cost of disruption, cost of downtime, B2B payment fraud,
supplier non-delivery losses, and so on.

| Claim (exact wording for the video) | Number | Year | Source (link) |
|---|---|---|---|
| <e.g. "Unplanned downtime costs an automotive plant … per hour"> | <…> | <…> | <…> |
| <…> | <…> | <…> | <…> |
| <…> | <…> | <…> | <…> |

Which ONE should open the video? → <…>

---

## 4. PayPal sandbox: exactly what we use and why it matters

This is the section the judges score. One row per PayPal product/API actually called in the code.

| PayPal product | API / endpoint / SDK call | Code file | When the agent calls it (trigger) | Example from the demo (IDs, amounts) | Why it matters for this ecosystem |
|---|---|---|---|---|---|
| <e.g. Orders v2 – authorize> | <e.g. POST /v2/checkout/orders/{id}/authorize> | <…> | <…> | <…> | <…> |
| <…> | <…> | <…> | <…> | <…> | <…> |
| <…> | <…> | <…> | <…> | <…> | <…> |

Also answer:

| Question | Your answer |
|---|---|
| Sandbox only, or anything live? | <…> |
| Webhooks received? Which event types? | <…> |
| The full money lifecycle, in order (e.g. hold → … → release / void / refund) | <…> |
| Spending rules (agent limit, who approves above it, how: code/email/…) | <…> |
| How PayPal solves the trust problem between buyer and supplier, in 2–3 sentences | <…> |
| The ONE sentence about PayPal judges should remember | <…> |
| Proof we can show (sandbox dashboard screenshots / transaction IDs) | <…> |

---

## 5. How it works (the product's moves)

List the 4–6 things the product does, in the order a viewer should see them. Each one is a proof beat in the video.

| # | What the product does | Which screen / URL shows it | The exact on-screen moment (button, number, label) | Real data shown (IDs, amounts) |
|---|---|---|---|---|
| 1 | <…> | <…> | <…> | <…> |
| 2 | <…> | <…> | <…> | <…> |
| 3 | <…> | <…> | <…> | <…> |
| 4 | <…> | <…> | <…> | <…> |

---

## 6. Tech stack (what we used)

| Layer | Tools / services (exact names) | Why we chose it (one line) |
|---|---|---|
| Frontend | <…> | <…> |
| Backend | <…> | <…> |
| Database | <…> | <…> |
| AI / LLM (model + what it is and isn't allowed to do) | <…> | <…> |
| Decision engine | <…> | <…> |
| Payments | <…> | <…> |
| Email / messaging | <…> | <…> |
| Maps / visualization | <…> | <…> |
| Hosting | <…> | <…> |

---

## 7. Results and proof numbers

| Metric | Value | Where it comes from |
|---|---|---|
| <e.g. supplier claims checked> | <…> | <…> |
| <e.g. lies / contradictions caught> | <…> | <…> |
| <e.g. money protected / recovered> | <…> | <…> |
| <e.g. time from disruption to plan> | <…> | <…> |

---

## 8. Highlights: rank what the judges must see

Order by importance (1 = must be in the video):

| Rank | Highlight | One-line proof |
|---|---|---|
| 1 | <…> | <…> |
| 2 | <…> | <…> |
| 3 | <…> | <…> |
| 4 | <…> | <…> |
| 5 | <…> | <…> |

---

## 9. Your draft beats (optional, but it helps a lot)

If you have ideas for the script, write them in our format (see §0). Keep each voice-over line under ~15 words.

| # | Time (s) | Voice-over (exact words) | On screen | Cursor / button | Handoff into next beat |
|---|---|---|---|---|---|
| 1 | <…> | <…> | <…> | <…> | <…> |

---

## 10. Send back

1. This file, filled in.
2. Screenshots or a screen recording of anything not visible on the live site (PayPal sandbox dashboard, email inbox, webhooks).
3. Logo file (SVG or PNG) if there's an official one.
