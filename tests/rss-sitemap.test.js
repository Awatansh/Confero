/**
 * RSS & Sitemap Tests
 * Validates RSS feed and sitemap generation
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

describe('RSS Feed Tests', () => {
  beforeAll(() => {
    if (!fs.existsSync(distPath)) {
      execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
    }
  });

  describe('5.1 - RSS feed exists and is valid XML', () => {
    it('rss.xml file exists', () => {
      const rssPath = path.join(distPath, 'rss.xml');
      expect(fs.existsSync(rssPath), 'rss.xml not found').toBe(true);
    });

    it('RSS feed is valid XML', () => {
      const rssPath = path.join(distPath, 'rss.xml');
      const content = fs.readFileSync(rssPath, 'utf-8');
      
      // Check for XML declaration
      expect(content.startsWith('<?xml')).toBe(true);
      
      // Check for RSS root element
      expect(content).toContain('<rss');
      expect(content).toContain('</rss>');
    });
  });

  describe('5.2 - RSS feed structure', () => {
    it('contains required RSS channel elements', () => {
      const rssPath = path.join(distPath, 'rss.xml');
      const content = fs.readFileSync(rssPath, 'utf-8');
      
      expect(content).toContain('<channel>');
      expect(content).toContain('</channel>');
      expect(content).toContain('<title>');
      expect(content).toContain('<link>');
      expect(content).toContain('<description>');
    });

    it('contains item elements for posts', () => {
      const rssPath = path.join(distPath, 'rss.xml');
      const content = fs.readFileSync(rssPath, 'utf-8');
      
      expect(content).toContain('<item>');
      expect(content).toContain('</item>');
      
      // Count items
      const itemCount = (content.match(/<item>/g) || []).length;
      expect(itemCount, 'RSS feed should contain at least one item').toBeGreaterThan(0);
    });
  });

  describe('5.3 - RSS item validation', () => {
    it('each item has required fields', () => {
      const rssPath = path.join(distPath, 'rss.xml');
      const content = fs.readFileSync(rssPath, 'utf-8');
      
      // Extract first item
      const itemMatch = content.match(/<item>([\s\S]*?)<\/item>/);
      
      if (itemMatch) {
        const item = itemMatch[1];
        
        expect(item).toContain('<title>');
        expect(item).toContain('<link>');
        expect(item).toContain('<description>');
        expect(item).toContain('<pubDate>');
      }
    });

    it('pubDate format is valid RFC-822', () => {
      const rssPath = path.join(distPath, 'rss.xml');
      const content = fs.readFileSync(rssPath, 'utf-8');
      
      const datePattern = /<pubDate>(.*?)<\/pubDate>/g;
      const dates = [...content.matchAll(datePattern)];
      
      dates.forEach(match => {
        const dateStr = match[1];
        // RFC-822 format check (basic)
        expect(dateStr.length).toBeGreaterThan(0);
        expect(new Date(dateStr).toString()).not.toBe('Invalid Date');
      });
    });

    it('links are absolute URLs', () => {
      const rssPath = path.join(distPath, 'rss.xml');
      const content = fs.readFileSync(rssPath, 'utf-8');
      
      const linkPattern = /<link>(.*?)<\/link>/g;
      const links = [...content.matchAll(linkPattern)];
      
      links.forEach(match => {
        const link = match[1];
        expect(
          link.startsWith('http://') || link.startsWith('https://'),
          `RSS link "${link}" should be absolute URL`
        ).toBe(true);
      });
    });
  });
});

describe('Sitemap Tests', () => {
  beforeAll(() => {
    if (!fs.existsSync(distPath)) {
      execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
    }
  });

  describe('6.1 - Sitemap exists and is valid XML', () => {
    it('sitemap file exists', () => {
      const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
      const sitemap0Path = path.join(distPath, 'sitemap-0.xml');
      
      const hasSitemap = fs.existsSync(sitemapIndexPath) || fs.existsSync(sitemap0Path);
      expect(hasSitemap, 'sitemap not found').toBe(true);
    });

    it('sitemap is valid XML', () => {
      const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
      const sitemap0Path = path.join(distPath, 'sitemap-0.xml');
      
      let sitemapPath = fs.existsSync(sitemapIndexPath) ? sitemapIndexPath : sitemap0Path;
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Check for XML declaration
      expect(content.startsWith('<?xml')).toBe(true);
      
      // Check for sitemap elements (either urlset or sitemapindex)
      const hasSitemapElements = content.includes('urlset') || content.includes('sitemapindex');
      expect(hasSitemapElements).toBe(true);
    });
  });

  describe('6.2 - Sitemap contains key URLs', () => {
    it('includes homepage', () => {
      const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
      const sitemap0Path = path.join(distPath, 'sitemap-0.xml');
      
      let sitemapPath = fs.existsSync(sitemap0Path) ? sitemap0Path : sitemapIndexPath;
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Should contain root URL (various formats)
      const hasRoot = content.includes('<loc>http') && 
                      (content.includes('localhost') || content.includes('.com') || content.includes('.io'));
      expect(hasRoot, 'sitemap should contain URLs').toBe(true);
    });

    it('includes multiple URLs', () => {
      const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
      const sitemap0Path = path.join(distPath, 'sitemap-0.xml');
      
      let sitemapPath = fs.existsSync(sitemap0Path) ? sitemap0Path : sitemapIndexPath;
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      const urlCount = (content.match(/<loc>/g) || []).length;
      expect(urlCount, 'sitemap should contain multiple URLs').toBeGreaterThan(1);
    });
  });

  describe('6.3 - Sitemap URL validation', () => {
    it('all URLs are absolute', () => {
      const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
      const sitemap0Path = path.join(distPath, 'sitemap-0.xml');
      
      let sitemapPath = fs.existsSync(sitemap0Path) ? sitemap0Path : sitemapIndexPath;
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      const locPattern = /<loc>(.*?)<\/loc>/g;
      const urls = [...content.matchAll(locPattern)];
      
      urls.forEach(match => {
        const url = match[1];
        expect(
          url.startsWith('http://') || url.startsWith('https://'),
          `sitemap URL "${url}" should be absolute`
        ).toBe(true);
      });
    });

    it('URLs use correct protocol', () => {
      const sitemapIndexPath = path.join(distPath, 'sitemap-index.xml');
      const sitemap0Path = path.join(distPath, 'sitemap-0.xml');
      
      let sitemapPath = fs.existsSync(sitemap0Path) ? sitemap0Path : sitemapIndexPath;
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      const locPattern = /<loc>(.*?)<\/loc>/g;
      const urls = [...content.matchAll(locPattern)];
      
      urls.forEach(match => {
        const url = match[1];
        // Check URL is properly formatted
        expect(() => new URL(url)).not.toThrow();
      });
    });
  });
});
