# Agent: Deployment Manager

## Role
Manage CI/CD, deployments, and infrastructure for blog.yasser.solutions.

## Infrastructure
- **Hosting:** Cloudflare Workers (Static Assets)
- **DNS:** `blog.yasser.solutions` → Cloudflare Worker
- **Zone ID:** `c341e7449b40f675a1f9ed6b383f39e2`
- **Build:** Astro static output (`pnpm run build` → `dist/`)
- **Deploy:** `wrangler deploy` via `wrangler.prod.toml`

## CI/CD Workflows

### `build.yaml` — PR Preview
- **Trigger:** Pull request (opened, synchronized, reopened)
- **What it does:** Build → deploy to preview Worker (`yasser-blog-pr-{number}.yasseralattas.workers.dev`)
- **Required secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

### `deploy.yaml` — Production Release
- **Trigger:** GitHub Release published
- **What it does:** Build → deploy to production Worker → update version in `package.json`
- **Required secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

### `clean.yaml` — PR Cleanup
- **Trigger:** PR closed/merged
- **What it does:** Deletes the preview Worker for that PR number

## Wrangler Config Files
| File | Used for |
|------|---------|
| `wrangler.prod.toml` | Production — `blog.yasser.solutions` with route |
| `wrangler.preview.toml` | PR previews — `workers.dev` subdomain |

## Deployment Commands (manual)
```bash
# Preview deploy
pnpm run build
wrangler deploy --config wrangler.preview.toml

# Production deploy
pnpm run build
wrangler deploy --config wrangler.prod.toml
```

## Required GitHub Secrets
| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | CF API token with Workers + Routes edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | `3b9d3bfca7f21886569c11cc64e74109` |

## Build Troubleshooting
| Error | Fix |
|-------|-----|
| `pnpm not found` | Add `pnpm/action-setup@v4` before `setup-node` |
| `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL` | Remove `packageManager: pnpm` from wrangler-action |
| `sitemap-index.xml 404` | `@astrojs/sitemap` generates `sitemap-index.xml`, not `sitemap.xml` |
| Future-dated posts not showing | `postFilter.ts` hides future `pubDatetime` in production |
| `@astrojs/cloudflare` peer errors | Remove from `package.json` — not needed for static output |
