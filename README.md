# Nima Nabizada — Portfolio

A premium personal portfolio built with **React 18 + TypeScript + Vite**, a small **Express** contact API, and hand-written CSS (no UI framework). All personal content lives in one file: [`src/data/site.ts`](src/data/site.ts).

---

## Run locally (Docker, recommended)

```bash
docker compose -f docker-compose.base44.yml up -d
```

- Site: <http://localhost:3000>
- Contact API: <http://localhost:3000/api/health> (proxied to the `api` service)

Everything runs from the cloned source with hot reload; `node_modules` lives in a Docker volume and is installed once by the `install` service.

## Run locally (Node)

```bash
npm ci
npm run dev          # Vite on :5173
npm run dev:api      # Express on :8000 (second terminal)
```

`npm run dev` proxies `/api` to `http://localhost:8000`.

```bash
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build
```

---

## Editing your content

Open `src/data/site.ts`. Everything below is a placeholder until you fill it in:

| Field | What to add |
| --- | --- |
| `email` | Your email. Activates every `mailto:` link, the contact section and the footer address. |
| `socials[].href` | Full URLs (`https://github.com/you`, …). Empty entries render as dashed placeholders. |
| `projects[]` | Title, description, technologies, `previewUrl`, `sourceUrl`. Buttons stay disabled until the URL exists — no dead links. |
| `stats[]` | Real numbers. `null` renders an em dash; a number animates with a count-up. |
| `introVideoUrl` | An `.mp4`/`.webm` file or a YouTube/Vimeo link. Empty shows the graceful "no video" state. |
| `skills[]`, `services[]`, `about.more[]` | Copy for those sections. |

### Your photograph

The hero uses `public/media/portrait.webp`. It currently holds the portrait cropped from the supplied design reference — replace that file with your own photograph (same filename, any 4:5-ish crop) and the hero updates with no code change. The image is displayed as-is: no filters, colour grading or retouching, only proportional scaling and a soft CSS edge fade so it blends into the dark hero.

---

## Contact form (real submission, no fake success)

`POST /api/contact` is a real backend route (`server/index.mjs`):

1. Validates name, email, subject and message server-side.
2. Blocks bots with a hidden honeypot field, a submit-timing check and a per-IP rate limit (5 / 10 min).
3. **Stores every message** in `data/messages.jsonl` (git-ignored, bind-mounted in Docker) — so nothing is ever lost.
4. **Emails the message** when an email provider is configured.

To enable email delivery, add these secrets (dashboard Secrets page → or "Import .env"):

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | for email | API key from <https://resend.com/api-keys> |
| `CONTACT_TO_EMAIL` | for email | Your inbox, e.g. `you@yourdomain.com` |
| `CONTACT_FROM_EMAIL` | optional | Verified sender, e.g. `Portfolio <hello@yourdomain.com>`. Defaults to Resend's onboarding sender. |

Without them the form still works and messages are stored on disk — swap in another provider by editing the single `sendEmail()` function.

---

## Deployment

The repo ships a **development** compose file; deploy with your host of choice:

**Static frontend (Vercel / Netlify / Cloudflare Pages)**

1. Build command `npm run build`, output directory `dist`.
2. The contact form needs the API, so deploy `server/index.mjs` (Render, Railway, Fly.io, a Node host) and set `API_PROXY_TARGET` / a reverse proxy from `/api/*` to it. Any static host's rewrite/proxy rule works the same way.
3. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in the host's environment variables.

**Single container anywhere (Docker, Fly.io, Railway)**

Serve `dist/` plus `/api` from one process behind a reverse proxy (Caddy/Nginx), keeping `data/` on a persistent volume so stored messages survive restarts.

After deploying, replace `your-domain.com` in `public/robots.txt` and `public/sitemap.xml`, then add your social preview image (`og:image`) in `index.html`.

---

## Structure

```
src/
  App.tsx                  page composition
  data/site.ts             all editable content
  components/              Navbar, Hero, About, Services, Portfolio, Skills,
                           Stats, Contact, Footer + small UI pieces
  styles/tokens.css        palette, type, spacing scales
  styles/base.css          reset, buttons, a11y, reduced-motion
  styles/ui.css            loader, cursor, progress, back-to-top
server/index.mjs           contact API
public/                    favicon, robots, sitemap, portrait
```

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus rings, `aria-current`/`aria-expanded`/`role="alert"`, labelled form fields with persistent labels.
- Every animation is disabled or reduced under `prefers-reduced-motion: reduce` (parallax, fog, cursor, count-up, reveals).
- Palette contrast: Cream `#F7F4EF` on Ink `#1C1C1C` = 15.1:1; beige is used for decoration and non-essential accents, with cream/ink for functional text.
- The portrait is a single optimised WebP (220 KB) preloaded for LCP; no other images are loaded.

## Sandbox-only configuration

- `vite.config.ts` adds the sandbox hostname to `allowedHosts` only when `BASE44_PREVIEW_MODE === "1"` (the sandbox id rotates, so it uses the `.$BASE44_SANDBOX_HOST_DOMAIN` wildcard). With the flag unset, Vite keeps its default host checking.
- `/api` is proxied to the `api` service (`API_PROXY_TARGET`) so cookies/proxy stay single-origin; the platform secret file `/run/base44/app.env` is mounted read-only into the API via `env_file` (declared optional so the stack boots without secrets).
