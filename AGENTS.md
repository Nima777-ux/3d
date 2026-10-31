# Working notes for agents

## Stack
React 18 + TypeScript + Vite 6 (hand-written CSS, no Tailwind/UI kit), plus an Express contact API in `server/index.mjs`. There is no Base44 SDK or entity layer here — this is a standalone repo.

## Run it
`docker compose -f docker-compose.base44.yml up -d` → web on host port 3000, API on internal `api:8000`, `/api` proxied by Vite.

- `install` is a one-shot service that runs `npm ci` into the shared `node_modules` volume; both app services depend on it. Never run two installers against that volume concurrently.
- There is no migration or seed step.
- `data/` is git-ignored and bind-mounted into the API as the contact-form message store.

## Gotchas
- Vite host allowlist is gated on `BASE44_PREVIEW_MODE === "1"` inside `vite.config.ts`; `BASE44_SANDBOX_HOST_DOMAIN` is needed at runtime for that wildcard.
- Fonts come from Fontshare (Clash Display, Satoshi) and Google Fonts (Instrument Serif) at runtime; system sans fallbacks keep the layout usable offline.
- `public/media/portrait.webp` is the hero photograph — the only image asset. Do not add filters/colour grading to it (user requirement); the hero only applies a CSS radial mask for edge blending.
- Placeholder content (projects, stats, email, socials) renders disabled/dashed states by design — do not invent URLs or numbers to "fill" them.

## Verify
- `npm run build` inside a container (`docker compose -f docker-compose.base44.yml exec -T web npm run build`) type-checks and builds.
- Health: `curl localhost:3000/` and `curl localhost:3000/api/health` (returns `{ok:true,emailDelivery:bool}`).
- Contact form end to end: submit in the UI, then confirm a new line in `data/messages.jsonl` and delete that test line.
