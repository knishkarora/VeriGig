# Design System

<!-- impeccable:design-schema 1 -->

## Visual World & Aesthetic POV

- **Style:** Editorial Neo-Tactile. Clean high-contrast surfaces, soft lilac-tinted canvas (`#F8F6FE`), crisp structured cards (`#FFFFFF`) with subtle multi-layer atmospheric shadow, obsidian black anchor blocks (`#101014`), and energetic acid lime (`#D4F851`) & bubblegum blush (`#FFA8D5`) focal cues.
- **Mode:** Operate (for dashboards, ATS, workspaces, and queues) & Persuade (for landing and gig discovery).
- **Tone:** Sharp, confident, collegiate-contemporary, distinctly authentic.

## Color Palette & Semantic System

| Token | Hex / Value | Semantic Role | WCAG Compliance |
|---|---|---|---|
| `canvas-bg` | `#F8F6FE` | Background canvas, soft lavender tint | AA against dark text |
| `canvas-card` | `#FFFFFF` | Primary container surface | Pure white |
| `ink-dark` | `#101014` | High-impact headings, primary CTAs | AAA (18.5:1 on white) |
| `ink-body` | `#334155` | Primary body text | AAA (7.3:1 on white) |
| `ink-muted` | `#64748B` | Secondary details, metadata | AA (4.8:1 on white) |
| `accent-lime` | `#D4F851` | Action accents, status markers, highlight capsules | Paired with `#101014` text |
| `accent-pink` | `#FFA8D5` | Creative badges, warm highlights, editorial ribbons | Tinted text on colored surface |
| `accent-purple` | `#7C3AED` | Escrow locks, institutional badges | AA (5.9:1 on white) |
| `state-emerald` | `#059669` | Verified badges, released payments, success | AAA (4.6:1 on white) |

## Typography & Hierarchy

- **Font Family:** `Plus Jakarta Sans`, system-ui, -apple-system, sans-serif.
- **Display Scale:**
  - Hero Display: `text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]`
  - Section Title: `text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101014]`
  - Subsection / Card Title: `text-lg font-bold text-[#101014]`
  - Body: `text-sm sm:text-base text-[#334155] leading-relaxed max-w-[70ch]`
  - Small / Metadata: `text-xs font-semibold text-[#64748B]`
  - Monospace / Numerals: Tabular figures `font-mono tabular-nums` for INR currency, deadlines, roll numbers.

## Surface Rules & Craft Floor Enforcements

1. **No Eyebrow/Kicker Clutter:** Delete generic kicker chips above headings (e.g., "WHY US", "CAMPUS NETWORK"). Let titles speak directly with weight and clarity.
2. **No Generic 4-Metric Row:** Transform repetitive metric cards into dynamic operational summaries (primary hero status + telemetry strip).
3. **No Ugly Parentheses in Navigation:** Strip engineering-style parentheses like `(Home)` or `(Why Us)` into clean typography with fluid active indicators.
4. **Tinted Text on Colored Canvases:** Footer and colored surfaces tint secondary copy from the background hue or foreground—never raw slate gray on pink.
5. **Tactile Depth:** Multi-stop subtle shadows with directional offset; no flat artificial block shadows.
6. **Polished Browser Surfaces:** Custom themed focus rings (`ring-2 ring-[#101014] ring-offset-2`), custom selection highlight (`selection:bg-[#D4F851] selection:text-[#101014]`), smooth scrollbar.
