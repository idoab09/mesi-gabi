# CLAUDE.md

Party invite site for Gabi. Hebrew RTL, single-page, deployed on Vercel.
**Keep this file updated every time you change the codebase.**

---

## Deployment

Push to `main` → auto-deploys via Vercel/GitHub integration. No build step.

```bash
vercel dev      # local dev with serverless functions on localhost:3000
```

---

## File Map

```
/
├── index.html          # Single HTML file — all sections inline, RTL Hebrew
├── main.js             # All client-side JS (~4000 lines, sectioned with // ====)
├── style.css           # All styles (~1900 lines)
├── data.json           # All editable content (text, emojis, questions, fortunes…)
├── vercel.json         # Vercel config: rewrites /api/* → serverless functions
├── package.json        # type: "module", dep: @vercel/blob (unused)
├── api/
│   ├── guests.js       # GET/POST/DELETE guest list — Supabase `guests` table
│   ├── leaderboard.js  # GET/POST leaderboard scores — Supabase `leaderboard` table
│   ├── messages.js     # GET/POST noticeboard messages — Supabase `messages` table
│   └── photos.js       # GET/POST/DELETE photo wall — Supabase Storage + `photos` table
└── assets/
    ├── *.mp3           # DJ tracks (get-lucky, september, music-sounds-better-with-you,
    │                   #   canned-heat, celebration, dance-till-youre-dead,
    │                   #   lady-hear-me-out-tonight)
    └── *.webp          # Album cover art (same basenames as mp3s)
```

---

## Technologies

| Layer | Tech |
|-------|------|
| Frontend | Vanilla JS + HTML + CSS, no framework |
| Fonts | Google Fonts — Heebo (Hebrew, 400/700/900) |
| Balloons | `balloons-js` via CDN (ESM) |
| Face detection | `face-api.js` v0.22.2 via CDN (loaded lazily in photo booth) |
| Backend | Vercel serverless functions (`api/*.js`, ESM `export default`) |
| Database | Supabase (direct REST API, no SDK) |
| Storage | Supabase Storage bucket `photos` (public) |
| NSFW moderation | Sightengine API (models: nudity-2.1, gore, offensive) |
| Hosting | Vercel, static + Functions |

---

## Supabase Schema

All API files use direct `fetch` against `https://aqleksrbvrqueaqgsavk.supabase.co`.
Anon key is hardcoded in each API file (low-security site, intentional).

### Tables

**`guests`**
- `id` uuid PK
- `name` text UNIQUE NOT NULL
- `created_at` timestamptz

**`leaderboard`**
- `id` uuid PK
- `game` text NOT NULL — one of: `duck | balloon | memory | whack | simon | trivia`
- `name` text NOT NULL
- `score` int NOT NULL
- `created_at` timestamptz

**`messages`** (noticeboard)
- `id` uuid PK
- `name` text NOT NULL
- `text` text NOT NULL
- `created_at` timestamptz

**`photos`**
- `id` uuid PK
- `uploader` text NOT NULL
- `caption` text
- `frame` text — one of: `polaroid | glitter | gold | neon | retro | duck`
- `storage_path` text NOT NULL
- `created_at` timestamptz

**Storage bucket**: `photos` — public, anon upload/read.

> **Note**: bucket must exist before photo uploads work. Create in Supabase dashboard → Storage → New bucket → name `photos`, set public. Or run SQL:
> ```sql
> INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true) ON CONFLICT DO NOTHING;
> CREATE POLICY "anon upload" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'photos');
> CREATE POLICY "anon read"   ON storage.objects FOR SELECT TO anon USING  (bucket_id = 'photos');
> ```

---

## Admin Password

`"gabi"` — used for:
- Removing a guest from the guest list (DELETE `/api/guests`)
- Deleting a photo from the photo wall (DELETE `/api/photos`)

Password is checked server-side in each API handler. Never changes without updating both files.

---

## `data.json` — Content Reference

Edit this file to change any displayed text/content without touching JS:

| Key | Used by | Description |
|-----|---------|-------------|
| `animalMessages` | Animal click handlers | 8 messages, one per animal |
| `cannonMessages` | Confetti cannon | 5 random messages shown on fire |
| `guestEmojis` | Guest list chips | 12 emojis, cycled by index |
| `balloonEmojis` | Floating balloons | 7 emojis |
| `memoryEmojis` | Memory match game | 8 emojis (each appears as a pair) |
| `whackChars` | Whack-a-duck game | 6 characters that pop up |
| `leaderboardLabels` | Leaderboard display | `{ duck, balloon, memory, whack, simon, trivia }` |
| `excuses` | Excuse generator | 15 excuses for not coming |
| `fortunes` | Fortune teller | 15 objects `{ emoji, text }` |
| `trivia` | Trivia game | 20 objects `{ q, options: [4], answer: 0-3 }` |
| `outfit` | Outfit generator | `{ tops, belts, shoes, accessories, vibes }` arrays |
| `cardGen.emojis` | Invite card generator | Array of emojis |
| `cardGen.quiz` | Invite card generator | Quiz questions `{ q, options, key }` |
| `cardGen.personalities` | Invite card generator | Map of personality results |

---

## `main.js` — Section Map

Each section is delimited by `// ========== SECTION NAME ==========`.

| Line | Section | Key functions |
|------|---------|---------------|
| 1 | SITE DATA | `loadData()`, `initFromData()` — fetch data.json, wire everything |
| 31 | CURSOR GLOW | Smooth cursor trail effect |
| 60 | CONFETTI ENGINE | `createConfetti(x,y,count,burst)`, `createAmbientParticle()` |
| 174 | FLOATING BALLOONS | `spawnBalloon()` — spawns via balloons-js CDN |
| 193 | TOAST | `showToast(msg)` — bottom notification |
| 203 | SPARKLE | `spawnSparkle(el)` — click sparkle burst |
| 215 | DUCK CLICK GAME | `startDuckGame()`, `onDuckClick()` |
| 301 | BALLOON POP GAME | `startBalloonGame()`, `spawnPopBalloon()` |
| 404 | CONFETTI CANNON | `fireCannon()` |
| 428 | COUNTDOWN TIMER | `updateCountdown()` — target: Aug 7 2025 21:00 |
| 453 | GUEST LIST | `fetchGuests()`, `renderGuestList()`, `askRemove(name)` |
| 499 | PASSWORD MODAL | `openPwModal(label)`, `closePwModal()`, `confirmRemove()` — shared by guest removal and photo deletion |
| 569 | RSVP | `sendRSVP(coming)` — posts to noticeboard + guest list |
| 604 | NOTICEBOARD | `fetchNoticeboard()`, `renderNoticeboard()`, `postNoticeboardMessage()` |
| 669 | MEMORY GAME | `startMemoryGame()`, `flipCard(card)` |
| 736 | WHACK-A-DUCK | `startWhackGame()`, `whackHit()` |
| 842 | SIMON SAYS | `startSimon()`, `simonPress(i)`, `playSequence()` |
| 965 | TRIVIA | `startTrivia()`, `showTriviaQuestion()`, `answerTrivia(chosen)` |
| 1104 | LEADERBOARDS | `fetchLeaderboard(game)`, `submitScore(game)`, `showLbSubmit(game,score)` |
| 1191 | PHOTO WALL | `pwSelectFrame()`, `pwFileChosen()`, `pwCropToSquare()`, `pwSubmit()`, `renderPhotoWall(photos)`, `initClotheslineSwing(track)`, `askRemovePhoto(id,uploader)` |
| 1417 | CLICK SPARKLE | Global click → random sparkle |
| 1431 | DJ PLAYER | `djTogglePlay()`, `djSetVol()`, `djSeek()` — vinyl drag-and-drop |
| 2007 | INVITE CARD | `cgStep(n)`, `cgSnap()`, `cgOpenCamera()` — quiz → card generator |
| 2528 | OUTFIT GENERATOR | `generateOutfit()` — picks from data.json outfit arrays |
| 2569 | PHOTO BOOTH | `pbStartCamera()`, `pbSnap()`, `pbDownload()`, `pbRetake()` — face tracking with face-api.js |
| 3007 | KARATE GAME | Full side-scroller game |
| 3964 | EXCUSE GENERATOR | `generateExcuse()` |
| 3980 | FORTUNE TELLER | `revealFortune()` |

---

## `style.css` — Section Map

Sections marked with `/* ===== SECTION ===== */`:

| Section | Notes |
|---------|-------|
| `:root` CSS vars | Colors, font sizes, spacing, transitions — edit here first |
| Reset / Base | Box-sizing, body, scrollbar |
| Page wrapper | `#page-wrapper` max-width centering |
| Password modal | `#pw-modal` — shared for guest + photo deletion |
| Hero | `.hero`, title letter animation |
| Section titles | `.section-title`, `.section-emoji`, `.section-text` — emoji/text split to fix gradient clip |
| Section dividers | `.section-divider` |
| DJ Player | `.dj-section`, `.turntable-wrap`, `.album-crate`, `.dj-controls` |
| Info sections | `.info-section`, `.info-card` — generic card container |
| Countdown | `.countdown-section` |
| Confetti cannon | `.cannon-section` |
| Animals parade | `.animals-section` |
| Noticeboard | `.noticeboard-section` |
| RSVP | `.rsvp-section` |
| Guest list | `.guest-list-section`, `.guest-chip` |
| Minigames | `.minigames-section`, cassette wrappers |
| Trivia | Gameshow podium styling |
| Leaderboard | `.lb-*` |
| Invite card gen | `.card-gen-*` |
| Outfit generator | `.outfit-gen-*` |
| Photo booth | `.photo-booth-section`, `.pb-*` |
| Photo wall (upload form) | `.photo-wall-section`, `.pw-upload-*`, `.pw-frame-*` |
| Clothesline wall | `.pw-clothesline-section`, `.pw-rope-*`, `.pw-clip`, `.pw-photo-hanger`, `.pw-photo-item`, frame variants |
| Fortune teller | `.fortune-teller-card`, `.fortune-ball-wrap` |
| Karate game | `.karate-section`, CRT monitor shell |
| Footer | `.party-footer` |

---

## CSS Variables (`:root`)

Key variables — always use these, never hardcode values:

```css
--pink: #ff2d7a          /* primary accent */
--purple: #7c3aed        /* secondary accent */
--gold: #ffd700
--bg: #0a0014            /* page background */
--card-bg: rgba(255,255,255,0.05)
--fs-section-title: clamp(1.6rem, 4vw, 2.4rem)
--fs-section-subtitle: clamp(0.9rem, 2vw, 1.1rem)
--fs-body: 1rem
--fs-small: 0.85rem
--section-pad: clamp(3rem, 6vw, 5rem)
--card-pad: clamp(1.2rem, 3vw, 2rem)
--card-radius: 24px
--gap-sm / --gap-md / --gap-lg
--text-muted: rgba(255,255,255,0.45)
--text-dim: rgba(255,255,255,0.30)
--transition: 0.2s ease
```

---

## How to Add Things

### New DJ track
1. Add `track.mp3` + `track.webp` to `assets/`
2. Add `.album-card` div to `#album-crate` in `index.html` with `data-src`, `data-cover`, `data-title`, `data-artist`

### New mini-game
1. Add HTML section in `index.html` (follow cassette wrapper pattern for games grid, or standalone section)
2. Add `start*()` function in `main.js` under a new `// ========== GAME NAME ==========` header
3. Add game key to `VALID_GAMES` in `api/leaderboard.js` if it has a leaderboard
4. Add label to `leaderboardLabels` in `data.json`
5. Call `showLbSubmit(game, score)` at game end to prompt score submission

### New content (text, questions, etc.)
Edit `data.json` only — no JS changes needed for arrays already wired up.

### New API endpoint
1. Create `api/newname.js` with `export default async function handler(req, res) {}`
2. Vercel auto-routes it to `/api/newname` (vercel.json rewrites handle prefix)
3. Use direct `fetch` against Supabase REST API — copy pattern from existing handlers
4. No SDK imports — everything via native `fetch`

### New section in the page
1. Add HTML section in `index.html` — use `.info-section` + `.info-card` wrapper for standard card look
2. Use `<h2 class="section-title"><span class="section-emoji">🎉</span> <span class="section-text">Title</span></h2>` pattern (required for emoji gradient fix)
3. Add `<p class="section-subtitle">` below title
4. Separate sections with `<div class="section-divider"><span><i></i><i></i><i></i></span></div>`
5. Add styles in `style.css` under a `/* ===== SECTION ===== */` comment

### New photo frame style
1. Add frame name to `VALID_FRAMES` in `api/photos.js`
2. Add button to frame picker in `index.html` (`.pw-frame-btn` with `onclick="pwSelectFrame(this,'name')"`)
3. Add `.pw-frame-name .pw-photo-inner { ... }` CSS block in the frames section of `style.css`

---

## Key Patterns & Gotchas

**Section title emojis**: Always split into `<span class="section-emoji">` + `<span class="section-text">`. The text span gets `-webkit-background-clip: text` gradient; the emoji span gets `-webkit-text-fill-color: initial` to override it. Never put emoji inside the text span.

**Password modal**: Shared between guest removal and photo deletion. `pendingRemoveName` vs `pendingRemovePhoto` control which action `confirmRemove()` takes. Admin password is `"gabi"` checked server-side.

**data.json getters**: All arrays from data.json are accessed via getter functions (e.g. `const MEMORY_EMOJIS = () => D.memoryEmojis || [...]`) so fallbacks work before data loads.

**Photo wall clothesline**: Photos hang from `.pw-photo-hanger` (transform-origin: top center). `initClotheslineSwing(track)` adds scroll + pointer drag listeners with velocity-based swing physics. Re-calling it cleans up old listeners first via `track._swingCleanup()`.

**Photo uploads**: Images are cropped to 1:1 client-side via canvas before upload. Max 5MB. Sightengine moderates before Supabase Storage upload. Supabase Storage bucket `photos` must exist and be public.

**Vercel body limit**: Default 4.5MB JSON body. Base64 photo images are ~100-200KB so well within limit.

**No build step**: `main.js` and `style.css` are served as-is. No bundler, no transpilation.
