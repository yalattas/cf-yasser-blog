# Agent: Deployment Manager

## Stack
- **Framework:** Astro v5 (static output)
- **Hosting:** Cloudflare Workers (Static Assets — NOT Pages)
- **Build:** `pnpm run build` → `dist/`
- **Deploy:** `wrangler deploy` via `wrangler.prod.toml`
- **DNS:** `blog.yasser.solutions` → CF Worker route

## Wrangler Config
```toml
# wrangler.prod.toml
name = "PLACEHOLDER"  # CI replaces this
compatibility_date = "2024-09-23"
assets = { directory = "dist" }

[[routes]]
pattern = "blog.yasser.solutions/*"
zone_id = "c341e7449b40f675a1f9ed6b383f39e2"
```

**Note:** `PLACEHOLDER` in wrangler files is intentional — CI replaces it. Do NOT change it manually.

## CI/CD Workflows

### `build.yaml` — PR Preview
- **Trigger:** PR opened/updated
- **Deploys to:** `yasser-blog-pr-{number}.yasseralattas.workers.dev`
- **Key steps:** pnpm setup → install → build → wrangler deploy

### `deploy.yaml` — Production Release  
- **Trigger:** GitHub Release published
- **Deploys to:** `blog.yasser.solutions`
- **Also:** Updates `package.json` version from release tag

### `clean.yaml` — PR Cleanup
- **Trigger:** PR closed/merged
- **Action:** Deletes the preview Worker

## Required GitHub Secrets
| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | CF API token with Workers + Routes edit |
| `CLOUDFLARE_ACCOUNT_ID` | `3b9d3bfca7f21886569c11cc64e74109` |

## Deploy Manually
```bash
# Build
pnpm run build

# Preview
wrangler deploy --config wrangler.preview.toml

# Production
wrangler deploy --config wrangler.prod.toml
```

## Troubleshooting Quick Reference
| Error | Cause | Fix |
|-------|-------|-----|
| `pnpm not found` | Missing pnpm setup step | Add `pnpm/action-setup@v4` before `setup-node` |
| `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL` | `packageManager: pnpm` in wrangler-action | Remove that option |
| `workingDirectory: ./dist` 404 | wrangler can't find wrangler.toml in dist | Change to `workingDirectory: .` |
| `@astrojs/cloudflare` peer errors | Package included but not needed | Remove from `package.json` |
| Future posts not showing | `postFilter.ts` hides future `pubDatetime` | Change pubDatetime to past date |
| `sitemap-index.xml` 404 | Looking for `sitemap.xml` | Correct path is `/sitemap-index.xml` |

## Post-Deploy Checks
1. Visit `blog.yasser.solutions` — does it load?
2. Check `blog.yasser.solutions/sitemap-index.xml` — returns XML?
3. Check `blog.yasser.solutions/robots.txt` — shows `Allow: /`?
4. Share URL in Telegram — does og:image preview appear?
