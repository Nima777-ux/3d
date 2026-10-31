# Nima Nabizada — Photography Tours

A cinematic, single-page website for a documentary photographer's guided
photography tour through Java, Indonesia. Dark editorial design, full-bleed
imagery, and a working contact / seat-reservation backend.

## Stack

| Part | What it is |
| --- | --- |
| `src/` | React 18 + Vite single-page app (no router — one long page with six sections) |
| `server/` | Express API (`/api/health`, `POST /api/inquiries`), plain `pg` pool |
| `db` | PostgreSQL 16, table `inquiries` created automatically on API boot |
| `public/` | Favicon and static assets |

All copy, imagery and itinerary data live in `src/data/site.js`.

## Sections

01 Home (hero) · 02 The journey (about + stats + thumbnail strip) ·
03 Selected work (filterable gallery with lightbox) · 04 Schedule (day accordion) ·
05 Investment (price, includes/excludes, FAQ accordion) · 06 Contact (form).

Functionality: scroll-spy section rail, sticky nav with full-screen menu,
progress bar, preloader, custom cursor, scroll reveals, gallery filtering +
keyboard-navigable lightbox, itinerary and FAQ accordions, seat-reservation
modal, and a contact form with client + server validation. Both forms persist to
Postgres.

## Running locally with Docker

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web preview: <http://localhost:3000>
- API (inside the compose network): `http://api:4000`

The `install` service runs `npm install` once; `db` must be healthy before
`api` starts, and `web` waits for `api`. Source is bind-mounted, so edits hot
reload.

## Running without Docker

```bash
npm install
DATABASE_URL=postgres://user:pass@localhost:5432/nima npm run server   # API on :4000
npm run dev                                                           # Vite on :5173
```

The Vite dev server proxies `/api` to `http://api:4000` by default; override with
`API_PROXY_TARGET`, e.g. `API_PROXY_TARGET=http://localhost:4000 npm run dev`.

## Environment

No secrets are required. Local database credentials are fixed in
`docker-compose.base44.yml` (`nima` / `nima_dev_pw` / `nima`) and must be changed
before any real deployment.

## Base44 sandbox notes

- `vite.config.js` extends `server.allowedHosts` with
  `.<BASE44_SANDBOX_HOST_DOMAIN>` **only when `BASE44_PREVIEW_MODE === '1'`** so the
  preview proxy host is accepted. With the flag unset, the allowlist stays empty
  (Vite's normal behaviour).
- `server.host` is `0.0.0.0` and file watching uses polling, because bind mounts
  inside containers do not reliably emit file events.
- The preview is served through the Vite dev server on host port 3000; the API is
  reached same-origin via the `/api` proxy, so there is no CORS or cookie setup.

## Replacing the imagery

Every photograph is a Creative Commons placeholder from Wikimedia Commons (Java,
Indonesia) so the layout can be reviewed with accurate subject matter. Swap the
URLs in `src/data/site.js` for Nima's own frames and delete `IMAGE_CREDIT` (it
renders a small credit line in the footer).
