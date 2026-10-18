# Deployment

The QR generator ships as a container image built from the `Dockerfile` at the
repo root. Any host that runs an image can serve it.

## Image

- build: `docker build .`. The image installs with Bun from `packageManager`,
  runs `next build` on the Node pinned in `engines.node`, and keeps only the standalone server,
  `public/` and `.next/static/`. The blog's MDX files in `src/content/blog`
  are traced into the standalone output. It runs as the unprivileged `node`
  user.
- start: the image `CMD`, `node server.js`. No start command is needed on the
  host.
- port: `$PORT`, default `3000`. The server binds `0.0.0.0`.
- health: `/` returns 200.
- release command: none. There is no database and nothing to migrate.

## Environment

The app reads no environment variables at build time or at runtime beyond
`PORT`. A `NEXT_PUBLIC_*` variable added later is baked into the bundle at
build time and must also be declared as an `ARG` in the build stage of the
`Dockerfile`.

## Environments

| Environment | Watched branch | Domains                                        |
| ----------- | -------------- | ---------------------------------------------- |
| production  | `main`         | qr.beyondtheinnovation.com, qr.gamified.studio |

A push to `main` deploys. Nothing else triggers a release.

## Railway

Production runs on Railway. The service builds from the `Dockerfile` with no
build or start command of its own, so the image `CMD` starts it. The health
check path (`/`) and its timeout, the restart policy, the watched branch and
the domains are set on the service. The service has no watch patterns, so
every push to `main` rebuilds.

Project, environment and service ids are not recorded here. Read them from
BTI OS: `bti call projects.fetch id=BTI7 include_metadata=true`.

## Gate

`.github/workflows/verify.yml` runs the frozen-lockfile install, the lint and
format check, the typecheck, the tests, the build and the image build on every push to and pull
request into `main`. Railway deploys on push in parallel with it, so a red check
holds a deploy back only while the trigger's Wait for CI is on; check that in
Railway rather than assuming.

## When a deploy fails

See `~/.claude/reference/deployment.md` for the shared contract and
`~/.claude/reference/railway.md` for Railway mechanics.
