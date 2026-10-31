# Project notes

## What this is
A single-page static site: `index.html` at the repo root. There is no framework,
package manager, build step, backend, or database.

## Running it here
```
docker compose -f docker-compose.base44.yml up -d --build
```
The `web` service is `python:3.12-slim` serving the repo via `python -m http.server`
on container port 3000, with the repo bind-mounted at `/app`.

## Quirks worth knowing
- There is no live-reload dev server. `http.server` reads files from the mount on
  each request, so editing `index.html` and reloading the page is enough; no
  container restart or rebuild is needed for content changes.
- Because there is no bundler, new `.html`/`.css`/`.js` files just need to be
  linked from `index.html`; no imports or manifest to update.
- No external services or credentials are required.

## Verifying it works
```
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/
curl -sS http://localhost:3000/ | grep -q '<h1>Nima</h1>'
docker compose -f docker-compose.base44.yml ps
```
A healthy stack returns HTTP 200 and the page containing the `Nima` heading.
