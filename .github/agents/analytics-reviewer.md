# Agent: Analytics Reviewer

## Role
Review GTM/GA4 setup, verify tracking is working, and suggest analytics improvements for the blog.

## Setup
- **GTM Container:** GTM-5VPJL3VJ (blog.yasser.solutions dedicated)
- **GTM snippet location:** `src/layouts/Layout.astro` — in `<head>` and top of `<body>`
- **GA4:** Configure via GTM (not hardcoded) — add GA4 Configuration tag in GTM UI

## GTM/GA4 Configuration Checklist

### Tags to set up in GTM
1. **GA4 Configuration tag** — fires on All Pages, sends to your GA4 Measurement ID
2. **Scroll Depth** — built-in GTM trigger, 25/50/75/100% thresholds
3. **Post Read** — custom event when user reaches end of post (`scroll_depth = 100%` on `/posts/*`)
4. **Outbound Click** — built-in GTM trigger for external link clicks
5. **Copy Code Block** — custom event when user copies a code snippet (great for technical blogs)

### GA4 Events to track
| Event | Trigger | Custom Dimensions |
|-------|---------|-------------------|
| `page_view` | All Pages | post_title, post_tags |
| `scroll` | Scroll Depth 75% | post_slug |
| `post_read` | Scroll 100% on /posts/* | post_title, read_time |
| `click_outbound` | External links | link_url, link_text |
| `rss_subscribe` | Click on RSS link | — |
| `copy_code` | Click on code copy button | code_language |

### Verification Steps
1. Open GTM Preview mode → visit blog.yasser.solutions
2. Check all page_view events fire on navigation
3. Use GA4 DebugView to confirm events arrive
4. Verify no CORS errors in browser console (Network tab → filter by `google-analytics.com`)

## Files to check
- `src/layouts/Layout.astro` — GTM snippet
- `public/_headers` — CSP allows GA/GTM domains
- `src/config.ts` — `website` URL matches GTM trigger rules

## Monthly Review Tasks
- Check GA4 Acquisition report: which channels drive traffic?
- Check top posts by pageviews — which topics resonate?
- Check scroll depth: do readers finish posts or bounce early?
- Check outbound clicks: what external resources do readers find valuable?
