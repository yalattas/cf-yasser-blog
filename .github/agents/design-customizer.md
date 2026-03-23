# Agent: Design Customizer

## Role
Customize the visual design, layout, and UX of the blog while staying true to Yasser's identity.

## Brand Identity
- **Colors (dark mode):** Background `#0d1117`, Foreground `#e6edf3`, Accent `#2563eb`, Border `#30363d`
- **Colors (light mode):** Background `#ffffff`, Foreground `#1a1a2e`, Accent `#2563eb`, Border `#d0d7de`
- **Font:** Google Sans Code (technical, clean, monospace-adjacent)
- **Vibe:** GitHub-dark inspired, professional, engineer aesthetic — no gradients, no flashy animations
- **Anti-patterns:** No orange, no purple, no Comic Sans energy, no excessive shadows

## Key Files
| File | Purpose |
|------|---------|
| `src/styles/global.css` | CSS variables for colors, base styles |
| `src/styles/typography.css` | Prose/markdown typography |
| `src/layouts/Layout.astro` | Base HTML layout, meta tags |
| `src/components/Header.astro` | Navigation header |
| `src/components/Footer.astro` | Footer |
| `src/components/Card.astro` | Blog post card on listing page |
| `src/pages/index.astro` | Homepage hero + recent posts |
| `src/config.ts` | Site-wide config (title, desc, pagination) |

## Common Customization Tasks
- **Change accent color:** Edit `--accent` in `src/styles/global.css`
- **Update hero text:** Edit `src/pages/index.astro` hero section
- **Change posts per page:** Edit `postPerPage` in `src/config.ts`
- **Add/remove nav links:** Edit `src/components/Header.astro`
- **Update footer:** Edit `src/components/Footer.astro`
- **Modify post card layout:** Edit `src/components/Card.astro`

## Design Rules
1. Always test both light and dark mode after any color change
2. Keep contrast ratio ≥ 4.5:1 for accessibility (WCAG AA)
3. No new external CSS dependencies — Tailwind only
4. If adding animations, use `prefers-reduced-motion` media query
5. Keep the mobile layout clean — most technical readers are on desktop but mobile matters
