# Zepto Brand Guide — Final Compiled
> Synthesized 2026-05-19. Sources: Medium UI analysis, LinkedIn purple/green overhaul post, live activity case study, AI integration case study, roskr.in rebranding, Brucira/IBDA case study, web searches. Conflicts flagged. Supersedes previous reconstruction.

---

## 1. Color System

| Role | Color Name | Hex | Confidence | Notes |
|---|---|---|---|---|
| Primary CTA / Brand accent | Hot Pink | `#FF2D55` | **High** | Consistent across all sources; used on "Quick Add", "View Cart", primary CTAs |
| Brand / Secondary | Purple | `~#6B21A8` | Medium | No official hex — approximate. Resolve with DevTools on zepto.com |
| AI surfaces extension | Soft Lavender | — | Medium | Purple extended for AI features only; no hex documented publicly |
| Background | White | `#FFFFFF` | High | Light mode dominant — Zepto prefers light mode |
| Surface / Cards | Light Gray | `#F5F5F5` | High | |
| Body text | Near-black | `#1A1A1A` | High | |
| Add / Success action | Green | `~#22C55E` | Medium | "Add More Items" and similar actions |
| Delivery: On Time | Green (desaturated) | — | Medium | Desaturated for readability on bright bg |
| Delivery: Delayed | Orange (desaturated) | — | Medium | |
| Delivery: Cancelled | Red (desaturated) | — | Medium | |
| Promo / Festive | Warm peach / yellow | varies | Low | Seasonal; not a fixed token |

**Why purple replaced green (2024):**
Green = "fresh/budget" — the grocery category default (Grofers, BigBasket). Purple = "aspirational, premium, quick commerce." The shift is positioning, not aesthetics. Purple signals premium; pink drives action. Together they are the only major Indian commerce app using this palette — fully intentional differentiation from Swiggy (orange/red) and Blinkit (yellow).

---

## 2. Typography

| Role | Spec | Confidence |
|---|---|---|
| Primary typeface | **Poppins** | Medium-High — confirmed in 2026 AI integration case study + search results |
| Heading weight | 700–800 | High — consistent across sources |
| Body / UI weight | 400 | High |
| CTA / Price weight | 700–800 (bold, prominent) | High |
| Logo letterform | Rounded geometric sans-serif, consistent with Poppins | High |

**Note on earlier reconstruction:** Previously listed Inter / Plus Jakarta Sans as candidates. Poppins now has stronger multi-source confirmation. Poppins is geometric, rounded, warm — consistent with the "premium but approachable" brand direction post-2024 rebrand.

**Unconfirmed:** Full type scale (sizes and line heights). Not documented publicly — extract from DevTools or Figma community files if needed.

---

## 3. Logo & Mark

- **Shape:** Lightning-bolt "Z" — speed as the core metaphor, not just a letterform choice
- **Letterform:** Rounded, consistent with Poppins
- **What it communicates:** Instancy, not just delivery. The bolt = the 10-minute SLA visualized
- **Usage:** Purple mark on white; white mark on purple or pink backgrounds
- **No sub-brands:** Zepto does not use sub-brand logos — everything reads as Zepto

---

## 4. Design Personality

**Post-2024 direction:**
- Speed + energy, not playfulness. **Bold, not cute.**
- "Premium quick commerce" — visually distinct from grocery (orange/green) and food delivery (red/orange)
- Bold, high contrast — no soft gradients, no pastels (lavender exception: AI surfaces only)
- Form follows function: every visual choice must connect back to the 10-minute delivery promise
- Light mode dominant; dark surfaces reserved for high-emphasis moments only

**Visual tone keywords:**
- Oversized type on key moments (prices, timers, CTAs)
- Minimal decoration — no illustrated backgrounds, no visual clutter
- Clean card layouts: clear item details, prominent product imagery, uncluttered
- Snappy animations — serve clarity, not decoration

**What Zepto is not:**
- Not playful / illustrative (that's Swiggy)
- Not discount-first / value-signaling (that was the old green era)
- Not corporate / blue-chip (that's not quick commerce)

---

## 5. Interaction Patterns

**Delivery progress system:**
- 8 segments, each = 27px, total bar = 216px
- Stage mapping: Picking (2 parts) → Packing (1 part) → Driver assignment (4 parts) → Arrival (1 part)
- Rationale: driver assignment is the longest stage — gets 4/8 of the bar

**Native UI patterns to respect:**
- Bottom sheets for secondary choices (not modals, not full-screen overlays)
- Smart chips below search bar (contextual, time-of-day triggered)
- Status colors desaturated when on bright backgrounds
- "Add All to Cart" — friction reduction is a design principle, not just a feature

**Animation philosophy:**
- Smooth and fast — animations exist to show state change, not to entertain
- No bounce, no overshoot — clean easing
- Snappy: 200–300ms transitions, not 500ms+

---

## 6. Brand Voice (UI Copy)

- Hindi/English code-switching in high-urgency moments ("SABSE SASTA", direct address to user)
- Speed claims stated as facts, not promises ("6 mins" not "as fast as 6 mins")
- Gamified but never gimmicky ("10 FREE CASH" — tangible reward, not abstract points)
- Friction explicitly removed and called out ("NO MIN. ORDER VALUE")
- **Tone:** Opinionated, confident, slightly irreverent — never corporate, never hedged
- The brief's one-liner captures it: "Make Zepto the brand you scream FOR, not the brand you scream INTO"

---

## 7. Unconfirmed / Needs Resolution

| Item | How to resolve | Time needed |
|---|---|---|
| Exact purple hex | DevTools → zepto.com → CSS variables | 5 min |
| Full type scale | Figma community file or DevTools font inspector | 10 min |
| Border radius values | DevTools → inspect card/button border-radius | 5 min |
| Dark mode existence | Open Zepto app → Settings | 2 min |
| Official Poppins confirmation | DevTools → Network → fonts loaded | 2 min |

**Working assumptions for prototype (safe to proceed with):**
- Purple: `#6B21A8` — close enough for a competition prototype
- Border radius: 8–12px on cards, 24px+ on CTAs (visually consistent with Poppins + premium direction)
- Dark mode: treat as absent — design for light mode only

---

## Sources

- [Zepto UI Analysis — Medium/Bootcamp](https://medium.com/design-bootcamp/less-thinking-more-tapping-zeptos-smart-grocery-lists-eb6badabbef6)
- [Purple vs Green overhaul — LinkedIn](https://www.linkedin.com/posts/its-nishi-singh_productmanagement-uxdesign-uiux-activity-7323668094122348544-A0zD)
- [Live Activity design — Medium/@uiscoop](https://medium.com/@uiscoop/designing-live-activities-for-a-quick-commerce-app-zepto-896b4d7d1d4e)
- [AI Integration design — Medium/@passiparnika](https://medium.com/@passiparnika/zepto-ai-integration-designing-a-smarter-way-to-shop-eed6834cf75c)
- [Zepto Rebranding — roskr.in](https://www.roskr.in/major-projects/zepto-rebranding/zepto)
- [Brucira Zepto case study](https://www.brucira.com/case-studies/zepto)
- [IBDA award — Brucira for Zepto](https://ibda.design-india.com/zepto-mobile-application-design/)
