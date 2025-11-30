# Confero

Multi-space knowledge blog built with Astro + MDX. Organize content across ML, Transformers, Web Development, and more.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- ��� **Fast** - Astro static site generation
- ��� **MDX** - Markdown with components
- ��� **Math** - MathJax support for equations
- ��� **Spaces** - Organize content by topic
- ���️ **Tags** - Cross-space content discovery
- ��� **Responsive** - Mobile-friendly design
- ��� **Dark Mode** - Built-in theme toggle
- ��� **SEO** - RSS feed + sitemap
- ✅ **Tested** - 118 automated tests

## Project Structure

```
confero/
├── src/
│   ├── content/          # MDX blog posts
│   │   ├── ml/
│   │   ├── transformers/
│   │   ├── web/
│   │   ├── notes/
│   │   └── blog/
│   ├── pages/            # Routes
│   ├── layouts/          # Page layouts
│   ├── components/       # UI components
│   └── utils/            # Helper functions
├── public/               # Static assets
├── tests/                # Test suite
└── docs/                 # Documentation
```

## Adding Content

Create a new \`.mdx\` file in \`src/content/{space}/\`:

```yaml
---
title: "Your Post Title"
date: "2024-01-01"
description: "Brief description"
tags: ["tag1", "tag2"]
space: "ml"
---

# Your content here

Use \$inline math\$ or:

\$\$
E = mc^2
\$\$
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
npm test             # Run tests
npm run format       # Format code
npm run check        # Type check
```

## Documentation

- [DEVELOPER.md](DEVELOPER.md) - Development guide
- [TESTING.md](docs/TESTING.md) - Testing guide
- [GUIDE_TO_MDX.md](GUIDE_TO_MDX.md) - MDX writing guide

## Tech Stack

- **Framework:** Astro 4.x
- **Content:** MDX
- **Math:** MathJax
- **Styling:** CSS (no framework)
- **Testing:** Vitest
- **CI/CD:** GitHub Actions

## License

MIT
