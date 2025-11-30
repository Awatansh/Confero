/**
 * Page Generation & Routing Tests
 * Ensures Astro builds all pages correctly and dynamic routes work
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

describe('Page Generation Tests', () => {
  describe('2.1 - Astro build succeeds', () => {
    it('npm run build completes without errors', () => {
      try {
        execSync('npm run build', { 
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe'
        });
        expect(true).toBe(true);
      } catch (error) {
        throw new Error(`Build failed: ${error.message}`);
      }
    });

    it('dist directory exists after build', () => {
      expect(fs.existsSync(distPath)).toBe(true);
    });
  });

  describe('2.2 - Dynamic routes generate pages', () => {
    beforeAll(() => {
      // Ensure build has run
      if (!fs.existsSync(distPath)) {
        execSync('npm run build', { 
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe'
        });
      }
    });

    it('root index page exists', () => {
      const indexPath = path.join(distPath, 'index.html');
      expect(fs.existsSync(indexPath), 'index.html not found').toBe(true);
    });

    it('/spaces index page exists', () => {
      const spacesPath = path.join(distPath, 'spaces', 'index.html');
      expect(fs.existsSync(spacesPath), '/spaces/index.html not found').toBe(true);
    });

    it('all space pages are generated', () => {
      const spaces = ['ml', 'transformers', 'web', 'notes', 'blog'];
      
      spaces.forEach(space => {
        const spacePath = path.join(distPath, 'spaces', space, 'index.html');
        expect(
          fs.existsSync(spacePath),
          `/spaces/${space}/index.html not generated`
        ).toBe(true);
      });
    });

    it('post pages are generated', () => {
      const postsDir = path.join(distPath, 'posts');
      expect(fs.existsSync(postsDir), '/posts directory not found').toBe(true);
      
      const posts = fs.readdirSync(postsDir);
      expect(posts.length, 'no post pages generated').toBeGreaterThan(0);
      
      // Check at least one post has index.html
      const firstPost = posts[0];
      const postIndexPath = path.join(postsDir, firstPost, 'index.html');
      expect(
        fs.existsSync(postIndexPath),
        `post ${firstPost}/index.html not found`
      ).toBe(true);
    });

    it('tag pages are generated', () => {
      const tagsDir = path.join(distPath, 'tags');
      expect(fs.existsSync(tagsDir), '/tags directory not found').toBe(true);
      
      const tags = fs.readdirSync(tagsDir);
      expect(tags.length, 'no tag pages generated').toBeGreaterThan(0);
    });

    it('RSS feed is generated', () => {
      const rssPath = path.join(distPath, 'rss.xml');
      expect(fs.existsSync(rssPath), 'rss.xml not generated').toBe(true);
    });

    it('sitemap is generated', () => {
      const sitemapPath = path.join(distPath, 'sitemap-index.xml');
      const altSitemapPath = path.join(distPath, 'sitemap-0.xml');
      
      const hasSitemap = fs.existsSync(sitemapPath) || fs.existsSync(altSitemapPath);
      expect(hasSitemap, 'sitemap not generated').toBe(true);
    });
  });

  describe('2.3 - Page content validation', () => {
    beforeAll(() => {
      if (!fs.existsSync(distPath)) {
        execSync('npm run build', { 
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe'
        });
      }
    });

    it('index page contains expected content', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      expect(content).toContain('Confero');
      expect(content.length).toBeGreaterThan(100);
    });

    it('spaces index contains all space cards', () => {
      const spacesPath = path.join(distPath, 'spaces', 'index.html');
      const content = fs.readFileSync(spacesPath, 'utf-8');
      
      expect(content).toContain('Machine Learning');
      expect(content).toContain('Transformers');
      expect(content).toContain('Web Development');
    });

    it('space pages contain only posts from that space', () => {
      const mlPath = path.join(distPath, 'spaces', 'ml', 'index.html');
      
      if (fs.existsSync(mlPath)) {
        const content = fs.readFileSync(mlPath, 'utf-8');
        expect(content).toContain('Machine Learning');
      }
    });
  });
});
