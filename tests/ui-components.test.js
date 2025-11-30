/**
 * UI Component Tests
 * Validates key UI components render correctly
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

describe('UI Component Tests', () => {
  beforeAll(() => {
    if (!fs.existsSync(distPath)) {
      execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
    }
  });

  describe('7.1 - Navbar component', () => {
    it('navbar exists on homepage', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Check for nav element or navigation links
      expect(
        content.includes('<nav') || content.includes('navigation'),
        'navbar not found on homepage'
      ).toBe(true);
    });

    it('navbar contains key navigation links', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Check for essential links
      expect(content).toContain('Home');
      expect(content).toContain('Spaces');
    });

    it('navbar is present across multiple pages', () => {
      const pages = [
        path.join(distPath, 'index.html'),
        path.join(distPath, 'spaces', 'index.html'),
      ];
      
      pages.forEach(pagePath => {
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf-8');
          expect(
            content.includes('Home') || content.includes('Confero'),
            `navbar missing on ${pagePath}`
          ).toBe(true);
        }
      });
    });
  });

  describe('7.2 - Footer component', () => {
    it('footer exists on homepage', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      expect(
        content.includes('<footer') || content.includes('footer'),
        'footer not found on homepage'
      ).toBe(true);
    });

    it('footer is present across multiple pages', () => {
      const pages = [
        path.join(distPath, 'index.html'),
        path.join(distPath, 'spaces', 'index.html'),
      ];
      
      pages.forEach(pagePath => {
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf-8');
          expect(
            content.includes('<footer') || content.toLowerCase().includes('footer'),
            `footer missing on ${pagePath}`
          ).toBe(true);
        }
      });
    });
  });

  describe('7.3 - SpaceCard component', () => {
    it('space cards render on spaces index', () => {
      const spacesPath = path.join(distPath, 'spaces', 'index.html');
      const content = fs.readFileSync(spacesPath, 'utf-8');
      
      // Check for space names from spaces.json
      expect(content).toContain('Machine Learning');
      expect(content).toContain('Transformers');
      expect(content).toContain('Web Development');
    });

    it('space cards contain descriptions', () => {
      const spacesPath = path.join(distPath, 'spaces', 'index.html');
      const content = fs.readFileSync(spacesPath, 'utf-8');
      
      // Check for descriptions from spaces.json
      const hasDescriptions = 
        content.includes('Fundamentals') || 
        content.includes('Attention') ||
        content.includes('Frontend');
      
      expect(hasDescriptions, 'space descriptions not found').toBe(true);
    });
  });

  describe('7.4 - PostList component', () => {
    it('post list renders on space pages', () => {
      const mlPath = path.join(distPath, 'spaces', 'ml', 'index.html');
      
      if (fs.existsSync(mlPath)) {
        const content = fs.readFileSync(mlPath, 'utf-8');
        
        // Should contain post elements or links
        const hasPostElements = 
          content.includes('<article') || 
          content.includes('post') ||
          content.includes('/posts/');
        
        expect(hasPostElements, 'post list not found on space page').toBe(true);
      }
    });
  });

  describe('7.5 - Breadcrumbs component', () => {
    it('breadcrumbs render on nested pages', () => {
      const mlPath = path.join(distPath, 'spaces', 'ml', 'index.html');
      
      if (fs.existsSync(mlPath)) {
        const content = fs.readFileSync(mlPath, 'utf-8');
        
        // Check for breadcrumb navigation
        const hasBreadcrumbs = 
          content.includes('breadcrumb') ||
          content.includes('Home') && content.includes('Spaces');
        
        expect(hasBreadcrumbs, 'breadcrumbs not found').toBe(true);
      }
    });

    it('breadcrumbs show correct hierarchy on post pages', () => {
      const postsDir = path.join(distPath, 'posts');
      
      if (fs.existsSync(postsDir)) {
        const posts = fs.readdirSync(postsDir);
        
        if (posts.length > 0) {
          const firstPostPath = path.join(postsDir, posts[0], 'index.html');
          
          if (fs.existsSync(firstPostPath)) {
            const content = fs.readFileSync(firstPostPath, 'utf-8');
            
            // Should show Home → ... navigation
            const hasBreadcrumbs = content.includes('Home');
            expect(hasBreadcrumbs, 'breadcrumbs missing on post page').toBe(true);
          }
        }
      }
    });
  });

  describe('7.6 - Layout consistency', () => {
    it('all pages have DOCTYPE declaration', () => {
      const pages = [
        path.join(distPath, 'index.html'),
        path.join(distPath, 'spaces', 'index.html'),
      ];
      
      pages.forEach(pagePath => {
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf-8');
          expect(
            content.includes('<!DOCTYPE') || content.includes('<!doctype'),
            `DOCTYPE missing on ${pagePath}`
          ).toBe(true);
        }
      });
    });

    it('all pages have proper HTML structure', () => {
      const pages = [
        path.join(distPath, 'index.html'),
        path.join(distPath, 'spaces', 'index.html'),
      ];
      
      pages.forEach(pagePath => {
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf-8');
          expect(content).toContain('<html');
          expect(content).toContain('<head>');
          expect(content).toContain('<body>');
          expect(content).toContain('</html>');
        }
      });
    });

    it('all pages have meta viewport for responsive design', () => {
      const pages = [
        path.join(distPath, 'index.html'),
        path.join(distPath, 'spaces', 'index.html'),
      ];
      
      pages.forEach(pagePath => {
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf-8');
          expect(
            content.includes('viewport'),
            `viewport meta tag missing on ${pagePath}`
          ).toBe(true);
        }
      });
    });
  });
});
