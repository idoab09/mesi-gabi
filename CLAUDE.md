# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

"מסיגבי" (Masigabi) — a Hebrew-language party invitation website for Gabi's party. It's a static frontend deployed on Vercel with a single serverless API function.

## Deployment

Pushing to the `main` branch automatically deploys to Vercel via GitHub integration. To deploy, just commit and push.

```bash
vercel dev      # run locally with serverless functions
```

There's no build step — static files are served directly. The only dependency is `@vercel/blob` (installed but not actively used; guest storage uses JSONBin).

## Architecture

- **`index.html`** — single-page app, RTL Hebrew layout. All sections are inline: hero, DJ deck, countdown, mini-games, RSVP form, guest list.
- **`main.js`** — all client-side JS: confetti engine, cursor glow, DJ turntable/audio player with drag-and-drop albums, countdown timer, mini-games (duck catch, balloon pop, confetti cannon, memory match, whack-a-duck, Simon Says), RSVP logic, guest list rendering.
- **`style.css`** — all styles.
- **`api/guests.js`** — Vercel serverless function. Handles GET/POST/DELETE for the guest list. Stores data in JSONBin (BIN_ID hardcoded). DELETE requires password `"gabi"`.
- **`assets/`** — MP3s and WebP cover art for the DJ section's album crate.

## Key Patterns

**Guest list API** (`/api/guests`): proxied by Vercel rewrites. The JSONBin master key is hardcoded in `api/guests.js` — treat it as a low-security shared secret, not a production credential.

**DJ player**: Albums are dragged from `.album-card` elements (with `data-src`, `data-cover`, `data-title`, `data-artist` attributes) onto the turntable. The `<audio id="dj-audio">` element is controlled by `djTogglePlay()`, `djSetVol()`, `djSeek()`.

**Adding a new track**: Add `.album-card` HTML to `#album-crate` in `index.html` and place the `.mp3` + `.webp` files in `assets/`.

**Mini-games**: Each game is self-contained in `main.js` with a `start*()` function called from inline `onclick` handlers in `index.html`.
