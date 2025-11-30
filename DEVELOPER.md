# Developer Guide

## Setup

```bash
git clone <your-repo>
cd confero
npm install
npm run dev
```

## Development Workflow

### 1. Create New Content

Add MDX files to `src/content/{space}/`:

- `ml/` - Machine learning posts
- `transformers/` - Transformer architecture posts
- `web/` - Web development posts
- `notes/` - General notes
- `blog/` - Blog posts

### 2. Frontmatter Requirements

Every post must have:

```yaml
---
title: 'Post Title' # Required, string
date: '2024-01-01' # Required, ISO date string
description: 'Brief desc' # Required, string
tags: ['tag1', 'tag2'] # Required, array of lowercase strings
space: 'ml' # Required, valid space ID
---
```

Valid space IDs: `ml`, `transformers`, `web`, `notes`, `blog`

### 3. Pre-Commit Checks

Always run before committing:

```bash
npm run format    # Auto-format code
npm run check     # Type check
npm test          # Run tests
npm run build     # Verify build
```

## Project Architecture

### Content Collections

Defined in `src/content/config.ts`. All collections use the same schema:

```typescript
{
  title: string
  description: string
  date: Date (from string)
  tags: string[]
  space: string
}
```

### Pages

- `/` - Homepage
- `/spaces` - All spaces
- `/spaces/[space]` - Space-specific posts
- `/posts/[slug]` - Individual post
- `/tags/[tag]` - Tag-specific posts
- `/rss.xml` - RSS feed
- `/sitemap-index.xml` - Sitemap

### Layouts

- `BaseLayout.astro` - HTML shell, global styles
- `PageLayout.astro` - Standard page wrapper
- `BlogPostLayout.astro` - Blog post reader
- `SpaceLayout.astro` - Space index pages

### Utilities

- `contentHelpers.ts` - Content queries (getAllPosts, getPostsBySpace, etc.)

## Adding a New Space

1. **Update `src/spaces.json`:**

```json
{
  "id": "new-space",
  "title": "New Space",
  "description": "Description here",
  "banner": "/assets/banners/new-space.png",
  "icon": "🎯"
}
```

2. **Create directory:**

```bash
mkdir src/content/new-space
```

3. **Update collections in `src/content/config.ts`:**

```typescript
export const collections = {
  blog: blogCollection,
  ml: blogCollection,
  transformers: blogCollection,
  web: blogCollection,
  notes: blogCollection,
  'new-space': blogCollection, // Add this
};
```

4. **Update `src/utils/contentHelpers.ts`:**

```typescript
const collections = ['blog', 'ml', 'transformers', 'web', 'notes', 'new-space'] as const;
```

## Styling

Global styles in `BaseLayout.astro`. Uses CSS variables:

```css
--color-bg
--color-text
--color-border
--color-primary
--color-secondary
--color-accent
```

Dark mode: `html.dark` class toggles automatically.

## Testing

- Run all: `npm test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`
- Single file: `npm test tests/content-validation.test.js`

Test categories:

1. Content validation (MDX correctness)
2. Page generation (build verification)
3. Space system (architecture)
4. Tag system (filtering)
5. RSS/Sitemap (feeds)
6. UI components (rendering)
7. Assets/Links (resources)
8. Math rendering (MathJax)

## Common Tasks

### Add a blog post

```bash
# Create file
touch src/content/ml/my-post.mdx

# Add frontmatter + content
# Test locally
npm run dev

# Validate
npm test
npm run build
```

### Fix formatting

```bash
npm run format
```

### Debug build errors

```bash
npm run build  # See full error
npm run check  # Check types
```

### Update dependencies

```bash
npm update
npm test       # Verify nothing broke
```

## Configuration Files

- `astro.config.mjs` - Astro + integrations
- `tsconfig.json` - TypeScript settings
- `vitest.config.js` - Test configuration
- `.prettierrc` - Code formatting rules

## Environment Variables

Create `.env` (gitignored):

```bash
PUBLIC_SITE_URL=https://yourdomain.com
```

## Deployment

Build output in `dist/`:

```bash
npm run build
```

Static files ready for any host (Vercel, Netlify, GitHub Pages, etc.).

See `private-docs/DEPLOYMENT.md` for detailed deployment guides.

## Troubleshooting

**Build fails with "space not found":**

- Check frontmatter `space` matches `spaces.json` ID

**TypeScript errors:**

- Run `npm run check`
- Ensure `as const` in contentHelpers.ts collections array

**Tests fail:**

- Run `npm run build` first (some tests need dist/)
- Check frontmatter format (dates as strings)

**Math not rendering:**

- Verify remark-math and rehype-mathjax installed
- Check MathJax script in BaseLayout.astro

## Git Workflow

```bash
git checkout -b feature/my-feature
# Make changes
npm run format && npm run check && npm test
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
# Create PR on GitHub
```

## Resources

- [Astro Docs](https://docs.astro.build/)
- [MDX Guide](https://mdxjs.com/)
- [MathJax Docs](https://docs.mathjax.org/)
- [Vitest Docs](https://vitest.dev/)
