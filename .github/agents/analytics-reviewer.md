# Agent: Analytics Reviewer

## Setup
- **GTM Container:** `GTM-5VPJL3VJ` (dedicated for blog.yasser.solutions)
- **GTM snippet:** `src/layouts/Layout.astro` — `<head>` + top of `<body>`
- **GA4:** Configure via GTM (NOT hardcoded in HTML)

## GTM Tags to Set Up (in GTM UI)
1. **GA4 Configuration** — fires on All Pages, triggers pageview
2. **Scroll Depth** — 25/50/75/100% thresholds
3. **Post Read** — scroll 100% on `/posts/*` URLs
4. **Outbound Click** — built-in GTM trigger
5. **Copy Code Block** — click on copy button in code snippets

## GA4 Events to Track
| Event | When | Dimensions |
|-------|------|------------|
| `page_view` | Every page | post_title, post_tags |
| `scroll` | 75% scroll depth | post_slug |
| `post_read` | 100% scroll on /posts/* | post_title |
| `click_outbound` | External link click | link_url |
| `rss_subscribe` | Click on RSS icon | — |

## Monthly Review Tasks
Open GA4 → check:
1. **Acquisition** — which channels send traffic? (Organic, LinkedIn, Direct?)
2. **Top posts** — which posts get the most pageviews?
3. **Scroll depth** — do readers actually finish posts?
4. **Outbound clicks** — what resources do readers click through to?

## Verification Steps
1. Open GTM Preview mode → visit blog.yasser.solutions
2. Confirm `page_view` fires on each navigation
3. Open GA4 DebugView → confirm events arrive
4. Check browser console → no CORS errors for `google-analytics.com`

## Files to Check (in repo)
- `src/layouts/Layout.astro` — GTM snippet present?
- `public/_headers` — CSP includes GA/GTM domains?

## CSP Domains Required for GA/GTM
```
script-src: https://www.googletagmanager.com https://www.google-analytics.com
connect-src: https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net
frame-src: https://www.googletagmanager.com
```
