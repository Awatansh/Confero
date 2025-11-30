# Testing Guide

## Overview

This project includes a comprehensive test suite that ensures stability, correctness, and prevents breaking changes from being merged. All tests run automatically in GitHub Actions on every push and pull request.

## Test Categories

### 1. MDX Content Validation Tests (`tests/content-validation.test.js`)

Validates all MDX blog posts have correct structure and metadata.

**What it tests:**
- ✅ Required frontmatter fields (title, date, description, tags, space)
- ✅ Correct field types (strings, arrays, dates)
- ✅ Valid space references (must exist in `spaces.json`)
- ✅ Unique slugs (no duplicates)
- ✅ Valid MDX syntax
- ✅ Date format validation
- ✅ URL-safe tags (lowercase, alphanumeric, hyphens)

**Run:**
```bash
npm test -- tests/content-validation.test.js
```

### 2. Page Generation Tests (`tests/page-generation.test.js`)

Ensures Astro builds successfully and all pages are generated.

**What it tests:**
- ✅ Build completes without errors
- ✅ `dist/` directory created
- ✅ Homepage exists
- ✅ `/spaces` index exists
- ✅ All space pages generated (`/spaces/ml`, `/spaces/transformers`, etc.)
- ✅ Post pages generated (`/posts/[slug]`)
- ✅ Tag pages generated (`/tags/[tag]`)
- ✅ RSS feed generated
- ✅ Sitemap generated

**Run:**
```bash
npm test -- tests/page-generation.test.js
```

### 3. Space System Tests (`tests/space-system.test.js`)

Validates the multi-space architecture.

**What it tests:**
- ✅ `spaces.json` has all required fields
- ✅ Space IDs are URL-safe
- ✅ All posts reference valid spaces
- ✅ Space filtering logic works correctly
- ✅ No duplicate space IDs
- ✅ Banner paths follow convention
- ✅ Each space has content

**Run:**
```bash
npm test -- tests/space-system.test.js
```

### 4. Tag System Tests (`tests/tag-system.test.js`)

Validates tag pages and filtering.

**What it tests:**
- ✅ Tags are lowercase and URL-safe
- ✅ No empty tags
- ✅ No duplicate tags within a post
- ✅ Tag filtering returns correct posts
- ✅ All unique tags collected
- ✅ Reasonable tag count per post (≤10)

**Run:**
```bash
npm test -- tests/tag-system.test.js
```

### 5. RSS & Sitemap Tests (`tests/rss-sitemap.test.js`)

Validates RSS feed and sitemap generation.

**What it tests:**
- ✅ RSS feed is valid XML
- ✅ Contains required elements (`<channel>`, `<item>`, `<title>`, etc.)
- ✅ pubDate format is RFC-822
- ✅ Links are absolute URLs
- ✅ Sitemap is valid XML
- ✅ Contains all key URLs
- ✅ URLs use correct protocol

**Run:**
```bash
npm test -- tests/rss-sitemap.test.js
```

### 6. UI Component Tests (`tests/ui-components.test.js`)

Validates key UI components render correctly.

**What it tests:**
- ✅ Navbar exists on all pages
- ✅ Footer exists on all pages
- ✅ SpaceCard displays correct data
- ✅ PostList renders correctly
- ✅ Breadcrumbs show correct hierarchy
- ✅ Proper HTML structure (DOCTYPE, viewport, etc.)

**Run:**
```bash
npm test -- tests/ui-components.test.js
```

### 7. Asset & Link Tests (`tests/assets-links.test.js`)

Validates assets exist and links are valid.

**What it tests:**
- ✅ Banner images referenced in `spaces.json`
- ✅ Public assets structure
- ✅ Favicon exists
- ✅ Internal links are valid
- ✅ No broken anchor tags
- ✅ Navigation structure is correct

**Run:**
```bash
npm test -- tests/assets-links.test.js
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- tests/content-validation.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --grep "MDX"
```

## GitHub Actions CI/CD

All tests run automatically on:
- Every push to `main` or `develop`
- Every pull request to `main` or `develop`

### Workflow Jobs

The GitHub Actions workflow (`.github/workflows/tests.yml`) includes:

1. **Lint** - Code formatting check
2. **TypeCheck** - TypeScript validation
3. **Build** - Project build verification
4. **MDX Validation** - Content validation
5. **Page Generation** - Routing tests
6. **Space System** - Architecture tests
7. **Tag System** - Tag validation
8. **RSS & Sitemap** - Feed/sitemap tests
9. **UI Components** - Component rendering
10. **Assets & Links** - Asset/link validation
11. **All Tests** - Full test suite
12. **Required Checks** - Final status check

### PR Blocking

To enable PR blocking (prevent merging if tests fail):

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
4. Select required checks:
   - `Lint & Format Check`
   - `TypeScript Type Check`
   - `Build Verification`
   - `MDX Content Validation`
   - `Page Generation Tests`
   - `Space System Tests`
   - `Tag System Tests`
   - `RSS & Sitemap Tests`
   - `UI Component Tests`
   - `Asset & Link Tests`
   - `Required Checks ✓`

5. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Do not allow bypassing the above settings

## Writing New Tests

### Test Structure

```javascript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  describe('Specific functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = someFunction(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Testing Astro Content Collections

```javascript
import { getCollection } from 'astro:content';

it('validates post structure', async () => {
  const posts = await getCollection('blog');
  
  posts.forEach(post => {
    expect(post.data.title).toBeDefined();
    expect(post.data.date instanceof Date).toBe(true);
  });
});
```

### Testing Built Pages

```javascript
import fs from 'fs';
import path from 'path';

it('page exists after build', () => {
  const pagePath = path.join(__dirname, '../dist/index.html');
  expect(fs.existsSync(pagePath)).toBe(true);
});
```

## Test Configuration

### `vitest.config.js`

- Environment: Node.js
- Timeout: 30 seconds (for build tests)
- Coverage: V8 provider
- Includes: `tests/**/*.test.js`

### `.prettierrc`

Code formatting rules:
- Semi: true
- Single quotes: true
- Tab width: 2
- Trailing comma: ES5
- Print width: 100

## Common Issues

### Issue: Build takes too long in tests

**Solution:** Tests are configured with 30-second timeout. If builds take longer:

```javascript
test.timeout(60000); // 60 seconds
```

### Issue: Tests fail locally but pass in CI

**Solution:** Ensure build artifacts exist:

```bash
npm run build
npm test
```

### Issue: MDX parsing errors

**Solution:** Check frontmatter format:

```yaml
---
title: "My Post"
date: 2024-01-01
description: "Description here"
tags: ["tag1", "tag2"]
space: "ml"
---
```

### Issue: Coverage not generating

**Solution:** Install coverage provider:

```bash
npm install -D @vitest/coverage-v8
```

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test
   ```

2. **Format code before committing**
   ```bash
   npm run format
   ```

3. **Check types before committing**
   ```bash
   npm run check
   ```

4. **Fix linting issues**
   ```bash
   npm run lint
   ```

5. **Write tests for new features**
   - Add tests to appropriate test file
   - Follow existing patterns
   - Test both success and failure cases

6. **Keep tests isolated**
   - Don't depend on test execution order
   - Clean up after tests if needed
   - Use `beforeAll`/`afterAll` for setup/teardown

## Performance Tips

- Tests run in parallel by default
- Build artifacts are cached in CI
- Use `--no-coverage` for faster test runs during development
- Use `--watch` mode for active development

## Getting Help

If tests fail:

1. Read the error message carefully
2. Check the failing test file
3. Run the specific test locally
4. Check GitHub Actions logs for CI failures
5. Verify your content follows the schema

## Summary

This test suite ensures:
- ✅ All MDX content is valid
- ✅ Build never breaks
- ✅ Pages generate correctly
- ✅ Navigation works
- ✅ RSS/Sitemap are valid
- ✅ No broken links
- ✅ Consistent formatting

**Total Coverage:** 7 test files, 50+ individual tests

Run `npm test` before every commit! 🚀
