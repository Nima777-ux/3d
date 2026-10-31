# Project notes

## What this is
Single-page React (Vite) site for Nima Nabizada's photography tours, plus a small
Express + PostgreSQL API that stores contact messages and seat reservations in an
`inquiries` table. There is no router: one page, six anchored sections.

All copy, imagery, itinerary and pricing content lives in `src/data/site.js` —
edit that file rather than the components for text or photo changes.

## Running it here
```
docker compose -f docker-compose.base44.yml up -d --build
```

- `install` — one-shot `npm install`. Both app services wait for it to exit, so
  only one installer ever touches the shared `node_modules` in the bind mount.
  Add a dependency → run this service again (or `up -d --build`).
- `db` — postgres:16-alpine, credentials `nima` / `nima_dev_pw` / `nima`.
- `api` — `node --watch server/index.mjs` on port 4000, creates the `inquiries`
  table on boot (30 retries while the DB warms up). Not published to the host.
- `web` — `vite` on container port 5173, published as host **3000**. Proxies
  `/api` to `http://api:4000`, so the browser only ever talks to one origin.

## Quirks worth knowing
- `vite.config.js` adds `.<BASE44_SANDBOX_HOST_DOMAIN>` to `server.allowedHosts`
  only when `BASE44_PREVIEW_MODE === '1'`. Unset → empty allowlist (normal Vite).
  File watching uses polling because bind-mount events don't fire in containers.
- The API is deliberately not exposed on its own host port; the front end calls
  relative `/api/...` URLs through the Vite proxy. Don't add CORS — there is no
  cross-origin request.
- Image URLs point at Wikimedia Commons placeholders (subject-accurate Java
  photography, CC BY-SA). `IMAGE_CREDIT` renders a footer credit; remove it when
  the real photographs are dropped in.
- Posts are throttled in-memory (8 per IP / 10 minutes) — restarting the API
  resets the counter.

## Verifying it works
```
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/          # 200
curl -sS http://localhost:3000/api/health                                 # {"ok":true}
curl -sS -X POST http://localhost:3000/api/inquiries \
  -H 'Content-Type: application/json' \
  -d '{"kind":"message","name":"QA","email":"qa@example.com","message":"hello there"}'
docker compose -f docker-compose.base44.yml exec -T db \
  psql -U nima -d nima -c 'SELECT kind, email, tour_date FROM inquiries;'
```
Delete any rows a check created (`DELETE FROM inquiries WHERE email = '...'`).

The production bundle builds cleanly with:
```
docker compose -f docker-compose.base44.yml exec -T web npx vite build
```
