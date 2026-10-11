# QR Code Generator (BTI)

Multi-format QR code generator with web app, blog, CLI, and MCP server. Next.js 16 App Router.

## Stack

| Layer      | Tech                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| Framework  | Next.js 16, React 19, App Router                                       |
| Styling    | Tailwind v4, CSS variables (oklch)                                     |
| Components | shadcn/ui (Radix)                                                      |
| QR         | qr-code-styling (web), qrcode (CLI/MCP)                                |
| Blog       | MDX (next-mdx-remote/rsc), gray-matter, rehype-pretty-code, remark-gfm |
| CLI        | Bun executable (`bun run src/cli/index.ts`)                            |
| MCP        | @modelcontextprotocol/sdk (route handler + stdio)                      |

## Structure

```
src/
  app/                 Routes: home and [type] generators, vcard (and bulk), blog, docs/mcp, policies
  app/mcp/route.ts     Remote MCP endpoint (Streamable HTTP); its server card is under .well-known/mcp
  app/api/resolve-url/ Follows short links (Google Maps) server-side for the location type
  components/          Page components; ui/ holds the shadcn primitives
  content/blog/        MDX posts
  lib/                 QR generation, blog loading and ToC, OG image helper, coordinate parsing, cn()
  qr-types.ts          QR types and encoders; vcard.ts and skins.ts are shared with the CLI and MCP
  seo.ts               Per-route SEO metadata
  mcp/                 Tool definitions (tools.ts), HTTP and stdio transports
  cli/index.ts         CLI entry point
scripts/indexnow.ts    Post-deploy search engine notification
```

## Commands

```bash
bun dev          # Next.js dev server (Turbopack) :3000
bun run build    # Next.js production build
bun start        # Production server (next start)
bun run cli      # CLI tool
bun run mcp      # MCP server over stdio; the remote one is served at /mcp
bun run lint     # ESLint
bun test         # Unit tests (bun:test), *.test.ts beside the module
bun run indexnow # Submit URLs to search engines after deploy
```

## Conventions

- **Class names** go through `cn()` from `@/lib/utils`
- **Client components**: the QR generator, bulk vCard, and interactive blog components
- **Styling**: Tailwind v4 + CSS vars in `src/index.css`. Never hardcode colors — use theme vars
- **CLI/MCP**: `src/cli` and `src/mcp/stdio.ts` run under Bun, import with `.ts` extensions and are excluded from tsconfig. `src/mcp/tools.ts` and `http.ts` are part of the Next build
- **Tests**: `*.test.ts` files import from `bun:test` and are excluded from tsconfig, so the Next build never type-checks them

## Deployment

Production deploys from main on Railway. Build and start commands live in railway.toml.

<!-- >>> bti-os-project (managed by BTI OS — refresh with `bti sync`; edit app/public/onboarding/TEAM.md in the bti-os repo, not here) >>> -->
<!-- bti-os-project: BTI7 · 315d591f0a29 · rendered 2026-10-03 -->

# BTI7 — QR Generator

This checkout is a Beyond The Innovation project and its code is `BTI7`. Tasks are `BTI7-<n>`; branches are `type/bti7-<n>-short-slug` and commits `BTI7-<n>: imperative description`, with no AI or tool attribution.

- **Status**: live · **Deliverable**: Internal Tool · **Stage**: Internal
- **Deploys**: Railway; production from `main`

Ops notes, domains and ids live on the BTI OS record, not here: `bti call projects.fetch id=BTI7 include_metadata=true`. How we work: https://os.beyondtheinnovation.com/onboarding/TEAM.md

<!-- <<< bti-os-project <<< -->
