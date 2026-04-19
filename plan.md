# Context

Party website "מסיגבי" has 14 distinct sections. Goal: wrap each in a thematic SVG frame that visually fits its content. Minimal, polished, not just CSS — actual inline SVG geometry. Must not break existing JS, canvas elements, or RTL layout.

---

# Constraints

- **No SVG inside** `.game-card`, `.info-card`, `.trivia-card`, `.photobooth-card` — all have `overflow: hidden`
- **No `::before`/`::after`** — already consumed on `.hero`, `.info-card`, `.game-card`, `.trivia-card`
- **Canvas elements are sacred** — `#karate-canvas`, `#pb-canvas`, `#cg-card-canvas` must not be overlapped or have z-index interference
- **RTL**: `left`/`right` CSS behaves normally (not flipped). Asymmetric SVGs need `transform="scale(-1,1)"` mirroring for left/right pairs
- **`pointer-events: none`** on all SVG frame elements — mandatory
- **No CSS `animation: transform`** on frame SVGs — creates stacking contexts that break canvas games
- Colors from CSS vars: `--pink: #FF2D7A`, `--yellow: #FFD600`, `--purple: #7C3AED`, `--teal: #00D4C8`, `--orange: #FF6B00`, `--lime: #A3FF00`, `--bg: #0D0020`

---

# Implementation Pattern

Wrap every section in a `.section-frame.sf-[theme]` div. SVGs are siblings to the section content, not inside it.

```html
<div class="section-frame sf-hero">
  <section class="hero">…</section>
  <svg class="sf-corner sf-tl" …>…</svg>
  <svg class="sf-corner sf-tr" …>…</svg>
  <svg class="sf-border-top" …>…</svg>
</div>
```

Shared CSS added to `style.css`:
```css
.section-frame { position: relative; }
.sf-corner, .sf-border-top, .sf-border-bottom, .sf-side {
  position: absolute; pointer-events: none; z-index: 0;
}
.sf-corner { width: clamp(48px, 8vw, 80px); height: clamp(48px, 8vw, 80px); }
.sf-tl { top: 0; right: 0; }
.sf-tr { top: 0; left: 0; }
.sf-bl { bottom: 0; right: 0; }
.sf-br { bottom: 0; left: 0; }
.sf-border-top { top: 0; left: 0; width: 100%; }
.sf-border-bottom { bottom: 0; left: 0; width: 100%; }
```

All SVGs use inline `fill`/`stroke` referencing the hex values (not CSS vars, since SVG `currentColor` is inconsistent across browsers for `stroke`).

---

# Section-by-Section Plan

## 1. Hero — Concert Stage Marquee
**Frame:** Top arch SVG (full-width bezier arc + 5 spotlight circles) + 4 star-burst corners  
**SVG elements:**
- Corner: two `<rect>`s rotated 45° forming a 4-point starburst + small `<circle>` orbit ring
- Top border: `<path>` bezier arc + 5 `<circle>` nodes along arc (stage lights)  
**Colors:** `--yellow` stars, `--purple` arc, `--pink` glow via `filter: drop-shadow(0 0 6px #FF2D7A)`  
**Opacity:** 0.55 corners, 0.4 top border

## 2. DJ Section — Rack-Mount Audio Unit
**Frame:** Top + bottom horizontal rail bars  
**SVG elements:**
- Rail: `<rect rx="4">` bar + evenly-spaced `<circle r="3">` screw holes + `<circle r="7">` rack ears at ends
- Center of top rail: 3 tiny EQ bar rectangles (echoes real EQ in UI)  
**Colors:** `--teal` rail, `--purple` screw circles  
**Opacity:** 0.4

## 3. Countdown — LCD Display Bezel
**Frame:** 4 corner L-brackets  
**SVG elements:**
- Each: two `<line>` elements forming L-shape + `<circle r="3">` at elbow + `<circle r="1.5">` at open ends
- Optional: thin dashed `<rect>` full bezel at 6% opacity  
**Colors:** `--yellow` (matches `.cd-num`)  
**RTL mirror:** `sf-tr` and `sf-br` use inner `<g transform="scale(-1,1)">` to flip L direction  
**Opacity:** 0.6

## 4. Animals Parade — Safari Bunting + Paw Prints
**Frame:** Top bunting border + bottom paw print row  
**SVG elements:**
- Top: `<polyline>` sagging rope + triangular `<polygon>` flags alternating pink/yellow/teal/purple
- Bottom: `<defs><symbol id="paw">` (1 large ellipse + 4 small circles) + `<use>` repeated across width  
**Colors:** multicolor flags, paw prints `rgba(255,255,255,0.15)`  
**preserveAspectRatio:** `"none"` so SVGs stretch to full section width

## 5. Games Section — Retro Arcade Cabinet
**Frame:** 4 stepped/pixelated corner brackets + top scanline bar  
**SVG elements:**
- Corners: `<polyline>` with 3-step staircase (no curves, pure 90° angles) — pixel-art aesthetic
- Top: `<rect>` with horizontal `<line>` scanlines inside at 3px intervals, 6% opacity  
**Colors:** `--pink` brackets, `--purple` fill behind, scanlines `rgba(255,255,255,0.06)`  
**RTL mirror:** same `scale(-1,1)` approach for left/right pairs

## 6. Trivia — Quiz Show Lightbulb Strip
**Frame:** Top lightbulb strip + 2 corner gold stars  
**SVG elements:**
- Strip: row of `<circle r="5">` + `<rect>` base below each (simplified bulb), alternating yellow/white
- Corner: `<polygon points="…">` 5-pointed star using standard formula  
**Colors:** `--yellow` bulbs with `filter: drop-shadow(0 0 4px #FFD600)`, `--teal` wire/base  
**Opacity:** 0.5

## 7. Invite Card Generator — Film Strip
**Frame:** Left + right side film-strip borders  
**SVG elements:**
- Strip: `<rect>` column (width 24px, full height) + `<rect rx="3">` sprocket holes every 20px (dark fill to simulate punch-through)  
**Colors:** `rgba(255,214,0,0.08)` strip, `rgba(0,0,0,0.4)` sprocket holes  
**Placement:** `left: -24px` and `right: -24px` relative to the section wrapper (outside the card)

## 8. RSVP / Info — Invitation Envelope + Wax Seal
**Frame:** Top center wax seal + 4 corner ribbon curls  
**SVG elements:**
- Seal: `<polygon>` 8-point star + `<circle>` overlay + `<text>` Hebrew letter "ג" centered  
- Ribbon curls: `<path>` cubic bezier S-curve in each corner, fill none, stroke  
**Colors:** `--pink` seal, `--yellow` star points, `rgba(255,45,122,0.3)` curls

## 9. Outfit Generator — Wardrobe / Dressing Room
**Frame:** 2 top corner hanger SVGs + bottom hem-stitch zigzag  
**SVG elements:**
- Hanger: `<path>` drawing triangle body (two diagonals to hook apex) + `<circle>` at hook + horizontal `<line>` shoulder bar
- Bottom: `<polyline>` zigzag alternating y=0/y=12, every 12px across full width  
**Colors:** `--purple` hangers, `--teal` zigzag at 0.4 opacity

## 10. Excuse Generator — Sticky Note + Pushpin
**Frame:** Compact section — single top-corner pushpin + bottom-corner paper fold  
**SVG elements:**
- Pushpin: `<circle r="6">` head + `<polygon>` 3-point tip + `<line>` shaft (20×30px total)
- Paper fold: `<polygon>` triangle at bottom-right corner in `rgba(255,255,255,0.12)`
- Top torn edge: `<path>` with irregular points for tear/wave effect  
**Colors:** `--pink` pin, near-white fold

## 11. Guest List — VIP Velvet Rope
**Frame:** Full-width SVG at top with 2 stanchion posts + rope swag  
**SVG elements:**
- Posts: `<rect rx="3">` vertical bar + `<circle>` round cap + `<rect>` base (each ~12×50px)
- Rope: `<path>` quadratic bezier catenary arc with `stroke-dasharray="6 4"` braided look  
**Colors:** `--yellow` posts, `--pink` rope `stroke-width="3"`, `--purple` post-head circles  
**Opacity:** 0.5

## 12. Photobooth — Photo Print Dashed Border
**Frame:** Single SVG overlay — dashed perimeter rect + 4 corner film-frame markers  
**SVG elements:**
- `<rect>` with `fill="none"`, `stroke-dasharray="8 6"`, `stroke-width="2"`, `rx="32"` (matches card border-radius)
- 4× small `<rect>` squares at corners (film frame registration marks)  
**Colors:** `rgba(255,255,255,0.12)` dash, `rgba(255,255,255,0.2)` corner marks  
**Note:** SVG spans entire wrapper, `pointer-events: none` — camera and canvas unaffected

## 13. Karate Game — Retro Arcade Console Bezel
**Frame:** Top + bottom chunky bevel bars + crosshair corner marks  
**SVG elements:**
- Bevel bar: `<rect>` in `rgba(255,107,0,0.15)` + `<line>` highlight on top edge in `rgba(255,255,255,0.4)` + inner 2px stripe offset 6px
- Corner marks: `+` crosshair (two `<line>` elements each) in `--orange`  
**Colors:** `--orange` primary, `--pink` accent, `--yellow` highlight  
**CRITICAL:** `pointer-events: none` mandatory — touch controls must stay interactive  
**Opacity:** max 0.35 — don't compete with canvas game

## 14. Noticeboard — Corkboard / Pinboard
**Frame:** Full perimeter cork-wood border + 4 thumbtack corners  
**SVG elements:**
- Border: `<rect fill="none" stroke-width="12" stroke="rgba(139,90,43,0.25)" rx="32">` + inner `<rect stroke-width="3" stroke="rgba(255,214,0,0.15)">` double-frame
- Thumbtacks: `<circle r="7">` head + `<circle r="2">` shine highlight + `<polygon>` pin point below  
**Colors:** warm brown border, `--pink`/`--teal` alternating tack heads, `--yellow` shine

---

# File Changes

- **`/home/ido/gabii/index.html`** — wrap each section in `.section-frame.sf-[theme]` div, add inline SVG elements as siblings
- **`/home/ido/gabii/style.css`** — add `/* ===== SECTION FRAMES =====*/` block at bottom with shared + per-theme overrides

No new files. No changes to `main.js` or `api/guests.js`.

---

# Verification

1. `vercel dev` — load site locally
2. Visually verify each of 14 sections shows its frame
3. Test karate game: touch controls work, canvas renders correctly
4. Test photobooth: camera feed unobstructed, capture button works
5. Test invite card generator: all 3 steps function, canvas downloadable
6. Resize to mobile (375px): frames scale via `clamp()`, no horizontal overflow
7. Check no new horizontal scrollbar appears (existing `overflow-x: clip` on `#page-wrapper` should contain SVGs)
