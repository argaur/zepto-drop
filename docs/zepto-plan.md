# Zepto "Scream for Ice Cream" — Builder OS Sprint Plan

**Framework:** Builder OS (compressed — 4-day competition sprint)
**Deadline:** 2026-05-23, 11:59 PM
**Stack:** Next.js 14 (App Router) → Vercel · Tailwind CSS · Framer Motion
**No DB, no auth, no backend** — pure UI prototype

---

## Brief Summary

Blinkit launched "Scream for Ice Cream" (scream into phone → ice cream delivered). It went viral. Zepto needs its own brand moment that is native to Zepto — not a copy.

Core brief insight: **Blinkit owns the scream. Zepto owns the ten minutes.**
The solution lives inside the 10-minute delivery window, not the ordering moment.

**5 success tests (from brief):**
1. Screenshot reads as Zepto, no logo needed
2. Drives organic X/Reels/Reddit mentions in launch week
3. Lifts ice cream orders 15%+ sustained 4 weeks
4. Pulls back 30% of users who tried Blinkit Scream in past 90 days
5. Mechanic is reusable — works for biscuits, chocolate, anything impulse

**Constraints:** Inside existing app · 10-min SLA locked · No ops/warehouse changes · No AR/VR · No loyalty programs · Branding reads as Zepto, not sub-brand

---

## Deliverables

- [ ] Working prototype — deployed on Vercel (shareable URL)
- [ ] One-page strategy memo (PDF)
- [ ] 30-second screen recording (landscape, MP4)

---

## Pre-Flight (Before Day 1 · 20 min)

- [ ] GitHub repo created: `zepto-drop` (or chosen name)
- [ ] Vercel account connected to GitHub
- [ ] Next.js project scaffolded:
  ```bash
  npx create-next-app@latest zepto-drop --typescript --tailwind --app
  cd zepto-drop
  npm install framer-motion html2canvas lucide-react
  ```
- [ ] CLAUDE.md at project root (with brief summary + constraints)
- [ ] Repo pushed and auto-deployed to Vercel

---

## Day 1 — Strategy + Brand (May 19)

**Goal:** Lock the mechanic. Have Zepto's brand tokens extracted. Draft strategy memo skeleton.

### Session A: Research (60 min)

**Zepto brand extraction:**
- Open zepto.com and app screenshots
- Extract: primary purple, yellow/green accent, type system (likely Inter), border radius, microcopy voice
- Document in `/docs/brand.md`

**Blinkit Scream anatomy:**
- What triggered virality: absurdity of input (scream) + dramatic confirmation screen + shareable result
- What Zepto can own that Blinkit can't: the 10-minute wait window

### Session B: Mechanic Brainstorm (45 min)

Three candidates to evaluate against the 5 success tests:

**A — "The Drop"**
Frame ice cream orders as limited drops (sneaker/concert culture). Wait screen = countdown with personality milestones. Delivery = shareable "I copped the drop" card. Tag line: "Don't shop it. Drop it."

**B — "Melt Clock"**
Melting ice cream visual races the countdown. Delivery = visual "saved before it melted." Tag line: "We race the melt."

**C — "Your 10 Minutes"**
Personalized ritual card generated on order. Countdown with attitude. Delivery = auto-generated Reel-ready card with time, flavor, and one-liner.

**Pick and lock — don't blend.** Evaluate each on:
- Screenshot test (reads Zepto without logo?)
- Share motivation (would Aanya share it?)
- Reusability (biscuits? chocolate?)

### Session C: Strategy Memo Draft (30 min)

Draft `/docs/strategy-memo.md` with:
- Problem in one sentence
- Chosen mechanic + why it's uniquely Zepto
- Why Blinkit can't copy it without breaking their SLA promise
- 5-test checklist filled in

**Day 1 done when:** Mechanic locked. Brand tokens documented. Memo skeleton written.

---

## Day 2 — Design (May 20)

**Goal:** All screens designed (in code). Copy locked. Visual language established.

### Session D: Design System (30 min)

Create `/lib/tokens.ts` with Zepto design tokens:
- Colors (purple, accent, dark bg, white)
- Type scale
- Border radius
- Animation config (duration, easing — fast and snappy)

Apply globals in `tailwind.config.ts`.

### Session E: Core Screens (90 min)

Build all screens in Next.js (mobile-first, 390px):

1. `/app/page.tsx` — Product page entry
   - Simulated Zepto ice cream PDP
   - Primary CTA: the chosen mechanic's trigger (e.g., "Drop it")

2. `/app/drop/page.tsx` — Activated state (full-screen theatre)
   - Countdown timer (10:00 → 0:00, demo runs at 5x speed)
   - Live status milestones with personality copy
   - Zepto purple dominant, big type

3. `/app/drop/card/page.tsx` — Delivery + share card
   - Auto-generated card: time ordered, flavor, one-liner
   - Download and Share buttons
   - This is the screenshot moment

**Milestone copy** lives in `/lib/milestones.ts` (SKU-agnostic, reusable):
```ts
// Example structure
export const milestones = {
  "8:00": "Rider's got it. He skips leg day, not your order.",
  "5:00": "Halfway. Your ice cream hasn't melted. Barely.",
  "2:00": "Your street. 120 seconds.",
  "0:30": "Doorbell incoming.",
}
```

**Day 2 done when:** All screens render at 390px. Visual language reads as Zepto. Screenshot test passes.

---

## Day 3 — Build (May 21)

**Goal:** Prototype is interactive, animated, deployed on Vercel.

### Session F: Animations + Countdown Logic (60 min)

- `Countdown.tsx` — Framer Motion countdown with number tween
- `MilestoneToast.tsx` — Toast that fires at each milestone timestamp
- `ShareCard.tsx` — html2canvas renders the card for download
- Demo mode: 5x speed so judges see the full moment in ~2 min

### Session G: Share Flow + Deploy (45 min)

- Share button → native share sheet (`navigator.share()`) with pre-filled caption
- Fallback: copy link / download card image
- `git push` → Vercel auto-deploys
- Test on real phone at the Vercel URL

**Day 3 done when:** Full flow works on mobile browser at Vercel URL. Share card downloads correctly.

---

## Day 4 — Polish + Record + Submit (May 22)

**Goal:** Ship-ready. Recording done. Memo finalised.

### Session H: Delight Layer (45 min)

- Page transition between screens (subtle fade/slide)
- Entrance animations on the countdown screen
- Number animation on timer
- Correct OG meta tags (so sharing the Vercel URL shows the right preview)

### Session I: Screen Recording (30 min)

- Loom or OBS, landscape orientation
- 30-second cut:
  - 0–5s: product page, tap trigger
  - 5–20s: countdown, 2-3 milestone toasts at speed
  - 20–25s: delivery moment
  - 25–30s: share card appears, tap share

### Session J: Strategy Memo → PDF (30 min)

Finalise `/docs/strategy-memo.md`:
- Sections: Problem → Mechanic → Why Zepto → 5-test answers → Why Blinkit can't copy
- Tone: opinionated, not hedged (per brief's explicit instruction)
- Convert to PDF

### Submission Checklist

- [ ] Vercel URL live and shareable
- [ ] Screen recording: landscape, 30 sec, MP4
- [ ] Strategy memo: 1 page, PDF, opinionated
- [ ] Screenshot test: does it read Zepto without the logo?

---

## File Structure

```
/app
  /page.tsx              — product entry (simulated PDP)
  /drop/page.tsx         — countdown theatre screen
  /drop/card/page.tsx    — shareable delivery card
/components
  /Countdown.tsx
  /MilestoneToast.tsx
  /ShareCard.tsx
/lib
  /tokens.ts             — Zepto design tokens
  /milestones.ts         — personality copy, SKU-agnostic
/docs
  /brand.md              — extracted Zepto brand tokens
  /strategy-memo.md      — one-page memo draft
```

---

## Verification

- [ ] Load at 375px — does the countdown feel like Zepto?
- [ ] Screenshot the delivery card — reads Zepto without logo?
- [ ] Watch the 30-sec recording — user moment clear in under 10 seconds?
- [ ] Strategy memo: is every sentence opinionated, or are there hedges to cut?
