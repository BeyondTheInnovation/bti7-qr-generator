# QR Code Generator (BTI)

Multi-format QR code generator with web app, blog, CLI, and MCP server. Next.js 15 App Router deployed on Railway.

## Commands

```bash
bun dev          # Next.js dev server (Turbopack) :3000
bun build        # Next.js production build
bun start        # Production server (next start)
bun run cli      # CLI tool
bun run mcp      # MCP server (stdio, for local/Claude Code)
                   # Remote MCP: served at /mcp via Next.js route handler
bun lint         # ESLint (next lint)
bun run indexnow # Submit URLs to search engines after deploy
```

## Tech Stack

| Layer      | Tech                                              |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 15, React 19, App Router                  |
| Language   | TypeScript (strict mode)                           |
| Styling    | Tailwind v4, CSS variables (oklch), @tailwindcss/postcss |
| Components | shadcn/ui (Radix), CVA for variants               |
| Icons      | lucide-react                                       |
| Dark mode  | next-themes (defaultTheme="dark")                  |
| QR         | qr-code-styling (web), qrcode (CLI/MCP)           |
| Blog       | MDX (next-mdx-remote/rsc), gray-matter, rehype-pretty-code, remark-gfm |
| CLI        | Bun executable (`bun run src/cli/index.ts`)        |
| MCP        | @modelcontextprotocol/sdk (route handler + stdio)  |

## Structure

```
src/
  app/
    layout.tsx               # Root layout (ThemeProvider, fonts, globals)
    page.tsx                 # Home — QR generator (default URL type)
    [type]/page.tsx          # QR generator per type (url, text, wifi, etc.)
    vcard/
      page.tsx               # vCard QR generator
      bulk/page.tsx          # Bulk vCard generation
    blog/
      layout.tsx             # Blog metadata template
      page.tsx               # Blog listing with tag filtering
      opengraph-image.tsx    # Blog listing OG image (next/og)
      [slug]/
        page.tsx             # Blog post (MDX rendering, JSON-LD, ToC)
        opengraph-image.tsx  # Per-post OG image (next/og)
    docs/mcp/page.tsx        # MCP server documentation
    policies/
      privacy/page.tsx       # Privacy policy
      tos/page.tsx           # Terms of service
    privacy/route.ts         # Redirect → /policies/privacy
    mcp/route.ts             # MCP endpoint (Streamable HTTP)
    sitemap.ts               # Dynamic sitemap
    robots.ts                # robots.txt
  components/
    ui/                      # shadcn/ui primitives
    QRGenerator.tsx          # Main QR generator (client component)
    BulkVCard.tsx            # Bulk vCard generator (client component)
    McpDocs.tsx              # MCP docs (client component)
    AddressSearch.tsx        # Address autocomplete (Photon/Komoot)
    BlogGrid.tsx             # Post card grid with tag filtering
    BlogTag.tsx              # Tag pill link
    BlogToC.tsx              # Table of contents (sidebar + inline)
    CodeBlock.tsx            # Code block with copy button
    StructuredData.tsx       # JSON-LD schemas (WebApplication, FAQ)
  content/blog/              # MDX blog posts
  lib/
    blog.ts                  # Blog content loading (gray-matter)
    toc.ts                   # Table of contents extraction
    qr-generator.ts          # QR generation logic (server-side)
    utils.ts                 # cn() utility
  qr-types.ts               # QR type definitions + encoders
  vcard.ts                   # vCard encoding logic
  seo.ts                     # Per-route SEO metadata
  mcp/
    tools.ts                 # Shared MCP tool definitions
    stdio.ts                 # Stdio transport (local/Claude Code)
    http.ts                  # HTTP transport handler
  cli/index.ts               # CLI entry point
scripts/
  indexnow.ts                # Post-deploy search engine notification
```

## Rules

- **Imports**: `@/` alias → `./src/`. Use `cn()` from `@/lib/utils` for class names
- **Components**: Client components need `"use client"` directive. QR generator, bulk vCard, and interactive blog components are client-side
- **Styling**: Tailwind v4 + CSS vars in `src/index.css`. Never hardcode colors — use theme vars
- **SEO**: Next.js Metadata API per route. Blog posts auto-generate JSON-LD (BreadcrumbList, BlogPosting, FAQPage)
- **Blog**: MDX files in `src/content/blog/`. Frontmatter parsed by gray-matter. Quick Answer + FAQ patterns auto-extract to schema
- **Domain**: `qr.gamified.studio` (production)
- **CLI/MCP**: These files use `.ts` extensions in imports (Bun convention). They're excluded from tsconfig for Next.js build

## Railway

This project is **already linked** via `~/.railway/config.json`.

| Key           | Value                                          |
| ------------- | ---------------------------------------------- |
| Project       | `3f48add9-bdad-47cc-a135-405a0f2d4fc7`         |
| Service       | `fdfcc3c1-2a6f-4368-9a4a-450aa4f2bda8`         |
| Service name  | `qr-generator`                                 |
| Environment   | `ed978dc6-4f37-4aab-b165-97dcf7c4283b` (prod)  |
| Domain        | `qr.gamified.studio`                           |

**Deploy**: Railpack builds with `bun run build`, starts with `npx next start`. Config in `railway.toml`.

## Cloudflare

| Key     | Value                              |
| ------- | ---------------------------------- |
| Zone    | `ed1e713c326cd1afcd60de9178bf26c3` (gamified.studio) |
| CNAME   | `qr` → `cshik326.up.railway.app`  |

## Discord

- Channel: `#qr-generator` (ID: `1483119194542440498`)

## Linear

| Key        | Value                                          |
| ---------- | ---------------------------------------------- |
| Team       | **Gamified** (key: `GS`)                       |
| Team ID    | `70a7f593-d6be-4c30-bdbb-2df59cd81cce`         |
| Project    | **qr-gamified.studio**                         |
| Project ID | `ce88fedd-7cdb-4773-bf58-7af77261f614`         |
| Lead       | So Kanon                                       |

Use `GS-` prefix for commit messages.

## No Tests

No test framework. Don't create test files unless asked.

<!-- >>> bti-os-project (managed by BTI OS — refresh with `bti sync`; edit app/public/onboarding/TEAM.md in the bti-os repo, not here) >>> -->
<!-- bti-os-project: QR · d2f1cb47eb39 · rendered 2026-09-19 -->

# QR — Internal Tool

This checkout is a Beyond The Innovation project. Its BTI OS record is **QR — Internal Tool** and its code is `QR`: task identifiers are `QR-<n>`, and that is what branches and commits carry.

- **Client**: Gamified Studio (partner)
- **Status**: live · **Type**: internal · **Template**: Software
- **Deployment**: Railway; production to qr.gamified.studio (qr-generator)
- **Deliverable**: Internal Tool
- **Stage**: Internal
- **Source code**: [qr-gamified.studio](https://github.com/gamifiedstudio/qr-gamified.studio)

Ids and the rest of the record are not copied here on purpose: read them from BTI OS (`projects.fetch` with `include_metadata`, or `bti call projects.fetch id=QR include_metadata=true`).

---

# Beyond The Innovation

Beyond The Innovation (BTI) is the company. Everything we ship — our own
internal tools and client work — runs under BTI.

## Stack

- **BTI OS** (os.beyondtheinnovation.com) — the company OS and **system of
  record for tasks** (BTI MCP `tasks.*` tools). Also holds project records,
  per-project metadata (the deployment pointer, repos, ops notes), team,
  finance, attendance, and AI-usage analytics. **Look project ids up in BTI OS
  rather than hardcoding them** — the BTI MCP `projects.fetch` tool takes a
  project code or directory slug and returns the project with its metadata.
  That's the source of truth; don't keep them in local notes where they drift.
- **SharePoint** — long-form client documents, filed per the `client-filing`
  skill. Notion is retired: nothing reads or writes it.
- **Railway** — hosting and deployments
- **GitHub** — `BeyondTheInnovation`

## Conventions

- **Timezone**: Libya (UTC+2)
- **Package manager**: always **Bun** — never npm/yarn/pnpm
- **Project naming**: `code-domain` format everywhere (BTI OS, GitHub,
  Railway, directories) — e.g. `qr-gamified.studio`,
  `bta-beyondtheanalytics.com`. Projects without a domain use `code-name`
  (e.g. `jsr-josoor`).
- **Folder layout on disk**: clone every project directly under
  `bti/<project>` — one flat folder, no `internal/`/`clients/` split.
- **Tone**: grounded, clear reasoning — not hype, not corporate.
- **Communication**: Discord for all team comms. Same voice across platforms,
  adapt for format only.

## Task Workflow

Every task is tracked in **BTI OS**, via the BTI MCP task tools (`tasks.save`,
`tasks.fetch`, `tasks.sweep`, `comments.save`). Commit messages must include
the BTI OS task identifier.

- **Task identifiers** are project-prefixed: `<CODE>-<n>`, where `<CODE>` is the
  project code (e.g. `BTA-42`, `QR-7`, `BTI2-12`). `tasks.save` mints one when
  you create a task; reference it by identifier everywhere after.
- **Personal tasks**: a task created with no `project` is personal — it mints
  under the creator's initials prefix automatically (e.g. Sohaib → `SO-3`) and
  self-assigns. Don't leave real project work project-less — if a task names a
  project, file it there.
- **Commit and branch format**: `BTA-42: imperative description` (e.g.
  `BTA-42: fix auth redirect loop`); branches `type/bta-42-short-description`
  (e.g. `blog/bta-46-migrate-tableau-to-power-bi`). The task id goes in both.
- **Do not attribute yourself in commits.** No `Co-Authored-By`, no "Generated
  with…", no tool or model trailer of any kind. The commit belongs to the
  person who did the work — nothing else.
- **Task lifecycle** (`status`): `backlog`/`todo` → `in_progress` (start work +
  `comments.save`) → `in_review` (comment a summary) → `done`. Move it with
  `tasks.save`.
- **Shipping is a handoff.** When asked to commit, push, ship, or wrap up
  session work, don't run raw git — invoke `/handoff-commit`, or `/handoff-pr`
  when the repo routes work through PR review. Nobody should have to name the
  command. A mid-task "commit this so I don't lose it" stays a plain commit:
  no task creation, no status move.
- **Where new work goes — the ladder, in order.** Something discovered while
  mid-task → a subtask of the task you are on, or a comment on it when it is
  not separable work. Work belonging to an initiative → a subtask of that
  initiative's parent; search for the parent (`tasks.fetch` the project) before
  minting a sibling, and mint the parent yourself if the initiative doesn't
  have one. A genuinely independent unit → a top-level task. Not worth a commit
  trail → a comment, or nothing. That last rung is the rule of thumb for the
  whole ladder: a task that is not worth a commit trail is not worth a task.
  **The ladder answers one arrival at a time.** When several arrive together,
  walk it per item and then ask the grouping question below for the set.
- **New work**: walk the ladder first; where it lands on a task, create it
  before starting the work (`tasks.save`, omit `id`), then work on it. Set
  `project` to the matching `code-domain` project so it gets that project's
  identifier prefix.
- **Write tasks like a person.** Titles stand alone — GitHub renders a title
  beside its commits with no parent link for context, so no phase prefixes
  ("P0a:", "Phase 3:", "Attempt 2:"); membership is what `parent` carries. Two
  forms are legitimate: imperative, like a good commit subject ("Fix auth
  redirect loop on expired session", not "auth bug" or "Task management
  improvements"), or a precise defect statement ("Notes dock drops teammate
  changes for 4s after any local note edit"). Descriptions say what, why and
  where in plain sentences. No em dashes, no AI filler ("comprehensive",
  "robust", "leverage"), no section scaffolding on a task two sentences can
  cover. If it reads machine-written, rewrite it before saving.
- **One deliverable per task.** A title that needs commas or "and" between
  unrelated things is a split signal — those become subtasks under a parent,
  per the splitting rule below. Related steps that one sitting will finish are
  the other case: a checklist in the description, not a split.
- **Splitting down — when one task is really several** (`parent` on
  `tasks.save`): split when the pieces ship separately or span sessions. Each
  subtask carries its own identifier for commits and branches, and the parent
  becomes the roll-up: it doesn't reach `in_review`/`done` ahead of its
  children. Work children in dependency order, not filing order. Don't split
  what one sitting will finish — that's a checklist in the description, not
  subtasks; what does get split is unrelated deliverables sharing one title,
  per the rule above. **This guard is about splitting only.** It is not a
  reason to leave tasks ungrouped, which is the opposite operation.
- **Grouping up — when several tasks are really one initiative.** When a single
  piece of work produces several tasks at once — an audit, a review, an incident
  post-mortem, a migration survey — file a parent, even when the children share
  no dependency and each ships alone. **The test is reporting: if someone will
  later ask "is X done?" and answering means checking several rows, X is a
  parent.** Provenance is reason enough; the children don't have to be a
  decomposition of one deliverable. Group at filing time — one `tasks.save`
  call carries the parent and its children together: give the parent item a
  `ref` and name it from each child's `parent_ref` instead of `parent`.
  `tasks.save` warns when one call mints three or more parentless tasks onto a
  project, and re-parenting afterwards is one more call, but the shape is easier
  to see before the rows exist than after. A parent minted from an audit or a
  review carries the method **and what came back clean**, so nobody spends a
  session re-checking what was already checked.
- **A due date is a commitment, not a default.** Set one when a day has
  actually been promised; don't batch-stamp dates nobody will honor.
- **Every task gets a tag.** It's the axis every roll-up, filter and board
  grouping reads — an untagged task is invisible to all of them, and a create
  that carries none is refused where the project's template declares a
  vocabulary. The vocabulary belongs to the project's template; Software, which almost every
  project runs, offers `bug` (was broken), `improvement` (worked, now works
  better), `feature` (new capability) and `chore` (upkeep, nothing
  user-visible). Pass it as `tags`. A value the project doesn't offer is
  refused with its list; take the list rather than dropping the tag, and add a
  genuinely new one in Admin → Templates → Fields → Tags. Personal lists take
  free text.
- **Default scope**: when working inside a project directory, only fetch that
  project's BTI OS tasks (`tasks.fetch` filtered by project) unless asked
  otherwise.

### Content pipelines

A brand's content pipeline is its own BTI OS project, separate from the
engineering project for the same brand — precedent: **BTA4 — Blog** alongside
**BTA — Website**. One task per post. Where it differs from the workflow above:

- **Status** runs `researched` → `ready` → `published` → `archived`, not the
  standard lifecycle.
- **`due_date` is the publish date.** It _is_ the schedule, not a deadline to
  work against.
- **Branches and commits use the content project's code**, not the engineering
  one: `blog/bta4-72-some-slug`, `BTA4-72: imperative description`.
- **Template fields carry the post metadata**: `slug`, `audience`,
  `lead_variant`, `live_url`. **Copy `slug` from the actual file on disk, never
  generate it from the title** — `live_url` is built from it, and a slugified
  title 404s the post. The 2026-07-27 migration into BTI OS did exactly this,
  wrong on 33 of 47 published BTA posts; fixed since, but the rule stands.

## Engineering conventions

For anyone shipping code. These are always-on defaults — follow them without
being asked.

- **Delete the branch after every merge.** The moment a PR is merged (or a
  branch is otherwise finished), delete it — the remote branch **and** your
  local copy. Stale branches pile up and make it impossible to tell what's
  actually in flight. Our GitHub repos have "automatically delete head branches"
  turned on, so the remote side is usually cleaned on merge; still prune your
  local afterwards (`git fetch --prune`, then `git branch -d <branch>`). Never
  leave a merged branch sitting around "just in case" — the history is on the
  base branch.

- **Write few comments, and no task ids in them.** A comment earns its place
  only where the code cannot state a constraint the next reader needs. Not to
  narrate what a change does, justify it to a reviewer, or record what used to
  break. Keep the ones that survive to a line or two; anything that wants a
  paragraph wants to be in the repo's `CLAUDE.md` instead.

  **Task ids belong in the commit message and the branch name, never in the
  code.** `git blame` already leads from any line to the commit that wrote it,
  and that commit already carries the id — citing it in the comment duplicates
  it in the one place nothing can update. The BTIOS → BTI2 rename left 689 dead
  references in bti-os alone.

  Existing comments are not a licence. Most of our code predates this rule;
  match the rule, not the neighbours.

- **Mark every repo as a BTI project: `bti init` in the checkout, then commit
  what it wrote.** It asks BTI OS for two things and writes both: a managed
  block at the end of the root `CLAUDE.md` (the project's story from its BTI OS
  record, followed by this guide, between `bti-os-project` markers, stamped
  with a version), and a `.claude/settings.json` carrying the code and the
  switch that turns usage export on. `bti sync` refreshes both after this
  guide or the project record changes; nothing rewrites a checkout behind
  your back, so run it and commit the diff. A clone with the block needs no
  global install to know which project it is or how we work.

  The settings file it writes:

  ```json
  {
    "env": {
      "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
      "OTEL_METRICS_EXPORTER": "otlp",
      "OTEL_LOGS_EXPORTER": "otlp",
      "OTEL_RESOURCE_ATTRIBUTES": "project=bta-beyondtheanalytics.com"
    }
  }
  ```

  Nothing secret goes in it — the endpoint and your token live in your own
  `~/.claude/settings.json`, which onboarding writes. Claude Code reads both and
  merges them, so the repo says _which project and whether to export_ while your
  machine says _how to reach the intake_. A repo without this block exports
  nothing on its own, so any launch that bypasses the wrapper stays dark.
  Through the wrapper it is still counted, with no project attached — the spend
  shows as untagged and the folder's name is never sent.

  Commit it and every teammate who clones is reporting correctly on their first
  launch, from the terminal, an IDE extension or the desktop app alike. Without
  it the `claude` wrapper falls back to the checkout's **directory name**, so
  usage attaches to whatever the folder happens to be called — and renaming the
  repo or the folder later strands that history under a slug that resolves to
  nothing.

  The value must match the project's registered code (or an alias on its
  record) exactly. `bti init` writes the code off the record, so it cannot
  mistype it; a hand-written one has **nothing validating it** — a typo doesn't
  error, it just quietly accrues cost under a slug nobody is watching. Check it
  against `projects.fetch`, then confirm the usage lands: anything that failed
  to resolve shows up under **Unattributed slugs** on the AI Usage page.

  The marker also means "this repo is ours", which is what enables telemetry
  for client repos hosted outside our GitHub orgs.

  Older repos carry the code as `env.BTI_PROJECT` instead. That still works and
  needs no rush; `bti init` adds the keys above beside it.

## Working style

- **Keep bookkeeping off the critical path.** BTI OS task updates, status
  comments, lookups and Discord messages are side-effects of the work, not the
  work — don't interleave them with a task you're mid-way through. Where
  delegation is available, hand them to subagents and fire independent ones in
  parallel. Where it isn't, batch them at a natural checkpoint — defer them,
  don't drop them.
- **Never cheap out on UI work.** Visual quality degrades noticeably on cheaper
  model tiers, so UI, design and layout stay on the strongest model available.
  This holds whether you're doing the work yourself or delegating it.
- Mechanical work — lookups, status updates, formatting — can run on cheaper
  models when you are delegating.

<!-- <<< bti-os-project <<< -->
