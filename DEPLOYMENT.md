# Deployment

The site is a static Next.js export served by a Cloudflare Worker, `bti7-qr-generator`, configured in `wrangler.jsonc`.

- **Target**: Workers static assets serve `out/`. Static asset requests never invoke the Worker script; `worker/` runs only for `/mcp`, `/api/*`, `/.well-known/mcp/*` and the HTML page paths (`run_worker_first`). Add a new page route there so it can serve markdown.
- **Code paths**: `/mcp` is the stateless MCP server over Streamable HTTP, `/api/resolve-url` follows short map links for the location type, and `/.well-known/mcp/server-card` (also at `.json`) describes the MCP server. A page requested with `Accept: text/markdown` gets its `.md` twin, which `scripts/markdown-twins.ts` writes into `out/` after `next build`.
- **Watched ref**: Workers Builds is connected at the repository root (`/`) and builds `main` for production. Builds from other branches are disabled.
- **Build**: `bun install --frozen-lockfile && bun run build`, which writes the export to `out/`, including `_headers` and `_redirects` copied from `public/`.
- **Deploy**: Workers Builds runs `bunx wrangler deploy` after the build on `main`. It uploads changed assets and the Worker.
- **Domains**: `qr.beyondtheinnovation.com` and `qr.gamified.studio`, set as custom domains on the Worker.
- **Health**: `GET /` returns 200 with the generator page.
- **Environment**: none. The app reads no environment variables at build time or at runtime, and the Worker has no secrets. A `NEXT_PUBLIC_*` variable added later is baked into the export at build time, so it belongs in the build environment.

## URL rules

`wrangler.jsonc` (`html_handling: "auto-trailing-slash"`, `not_found_handling: "404-page"`), `public/_redirects` and `public/_headers` keep the site's URLs:

- `/page` serves `page.html`; `/page.html`, `/index` and `/index.html` redirect (301) to the clean URL.
- `/privacy` redirects (307) to `/policies/privacy`, and the renamed blog post redirects (308) to `/blog/hello-world`. Add a line to `public/_redirects` when a post slug changes.
- A trailing slash reaches a page by redirecting (307) to its clean URL, and never reaches a file. Directories are not listed.
- An unknown path returns `404.html` with status 404.
- `/_next/static/*` is cached for a year as immutable; everything else is `no-cache`, so browsers revalidate by ETag. Every asset carries `X-Content-Type-Options: nosniff`.
- Cloudflare compresses text responses at the edge.

## Local preview

```sh
bun run build
bunx wrangler dev
```

## Gate

`.github/workflows/verify.yml` runs the frozen-lockfile install, the lint and format check, the typecheck, the tests, the build and `bunx wrangler deploy --dry-run` on every push to and pull request into `main`. The dry run bundles the Worker without deploying, so a Worker that does not bundle fails the check.

## When a deploy fails

See `~/.claude/reference/deployment.md` for the shared contract.
