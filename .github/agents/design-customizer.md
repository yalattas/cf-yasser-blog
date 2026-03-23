# Agent: Design Customizer

## Brand Identity (Memorize This)

### Colors
| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| Background | `#0d1117` | `#ffffff` | Page background |
| Foreground | `#e6edf3` | `#1a1a2e` | Body text |
| Accent | `#2563eb` | `#2563eb` | Links, CTAs, highlights |
| Muted | `#161b22` | `#f0f4f8` | Cards, secondary bg |
| Border | `#30363d` | `#d0d7de` | Dividers, borders |

### Typography
- Font: `Google Sans Code` (monospace-adjacent, technical)
- Fallback: `Courier New`, `monospace`

### Aesthetic Rules
- GitHub-dark inspired. Clean, minimal, engineering aesthetic
- **No:** gradients, drop shadows, rounded corners overkill, stock photo vibes, orange, purple
- **Yes:** whitespace, sharp edges, blue accent, code blocks, terminal feel

## Key Files to Edit
| File | What it controls |
|------|-----------------|
| `src/styles/global.css` | CSS color variables (the source of truth) |
| `src/styles/typography.css` | Prose/markdown styling |
| `src/layouts/Layout.astro` | Base HTML, meta tags, GTM |
| `src/components/Header.astro` | Navigation |
| `src/components/Footer.astro` | Footer links |
| `src/components/Card.astro` | Post card on listing page |
| `src/pages/index.astro` | Homepage hero + recent posts |
| `src/config.ts` | Site-wide settings |

## Common Tasks

### Change accent color
Edit `--accent` in `src/styles/global.css` — both light and dark mode.

### Update hero text
Edit the `<h1>` and `<p>` in `src/pages/index.astro` hero section.

### Add/remove nav items
Edit `src/components/Header.astro` — find the `<ul id="menu-items">` block.

### Update post card layout
Edit `src/components/Card.astro`.

### Generate og:image banner
Use Python + Pillow:
```python
# System fonts available at /usr/share/fonts/truetype/dejavu/
# Bold: DejaVuSans-Bold.ttf
# Regular: DejaVuSans.ttf  
# Monospace: DejaVuSansMono-Bold.ttf

# Output to: public/og-blog.jpg (1200x630)
```

## Design Rules
1. Test both light and dark mode after any color change
2. Contrast ratio ≥ 4.5:1 (WCAG AA minimum)
3. Tailwind only — no new CSS libraries
4. If adding animation, wrap in `prefers-reduced-motion`
5. Mobile-first — check at 375px width

## Current Asset Paths
- Blog og:image: `public/og-blog.jpg` (1200×630)
- Favicon: `public/favicon.svg`
- Headshot source (for new banners): `~/projects/cf-yasser-cv/src/assets/headshot.jpg`
