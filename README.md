# Yasser Alattas — Personal Blog

Technical blog by [Yasser Alattas](https://yasser.solutions) — MLOps, Cloud Infrastructure, SRE, and AI systems at scale.

## 🌟 Live

**[blog.yasser.solutions](https://blog.yasser.solutions)** *(coming soon)*

## 🛠️ Stack

- **[Astro](https://astro.build/)** + **[AstroPaper](https://github.com/satnaing/astro-paper)** theme
- **Cloudflare Pages** — static, edge-delivered globally
- **Markdown/MDX** — write posts as `.md` files in `src/data/blog/`
- Auto sitemap, RSS feed, dynamic OG images, syntax highlighting (Shiki)

## 🚀 Local Development

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:4321](http://localhost:4321)

## ✍️ Writing a Post

Create a new `.md` file in `src/data/blog/`:

```markdown
---
title: "Your Post Title"
description: "One sentence summary"
pubDatetime: 2026-03-29T08:00:00Z
tags: ["mlops", "kubernetes", "aws"]
draft: false
---

Post content here...
```

Push to `main` → Cloudflare Pages auto-deploys.

## 📦 Build & Deploy

```bash
pnpm run build          # builds to ./dist
npx wrangler pages deploy dist  # manual deploy
```

CF Pages auto-deploys on push to `main`.

## 📁 Project Structure

```
src/
├── content/blog/      # ← Write posts here (.md files)
├── config.ts          # Site config (title, author, URL)
├── pages/             # Routes
└── components/        # UI components
wrangler.toml          # Cloudflare Pages config
```

## 🔗 Related

- Portfolio: [yasser.solutions](https://yasser.solutions) — [github.com/yalattas/cf-yasser-cv](https://github.com/yalattas/cf-yasser-cv)
