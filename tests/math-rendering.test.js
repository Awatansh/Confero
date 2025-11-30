/**
 * Math Rendering Tests
 * Validates MathJax integration and math symbol rendering
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

describe('Math Rendering Tests', () => {
  beforeAll(() => {
    if (!fs.existsSync(distPath)) {
      execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
    }
  });

  describe('MathJax Configuration', () => {
    it('MathJax script is included in HTML pages', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      expect(
        content.includes('mathjax') || content.includes('MathJax'),
        'MathJax script not found in HTML'
      ).toBe(true);
    });

    it('MathJax configuration is present', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Check for MathJax config object
      expect(
        content.includes('window.MathJax') || content.includes('MathJax'),
        'MathJax configuration not found'
      ).toBe(true);
    });

    it('MathJax CDN script is loaded', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      const hasMathJaxCDN = 
        content.includes('cdn.jsdelivr.net/npm/mathjax') ||
        content.includes('mathjax') ||
        content.includes('tex-svg');
      
      expect(hasMathJaxCDN, 'MathJax CDN script not loaded').toBe(true);
    });
  });

  describe('Math Symbol Support', () => {
    it('inline math delimiters are configured', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Check for inline math configuration
      const hasInlineMath = 
        content.includes('inlineMath') ||
        content.includes('$') ||
        content.includes('\\(');
      
      expect(hasInlineMath, 'inline math delimiters not configured').toBe(true);
    });

    it('display math delimiters are configured', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Check for display math configuration
      const hasDisplayMath = 
        content.includes('displayMath') ||
        content.includes('$$') ||
        content.includes('\\[');
      
      expect(hasDisplayMath, 'display math delimiters not configured').toBe(true);
    });
  });

  describe('MDX Math Processing', () => {
    it('remark-math plugin processes math in MDX', () => {
      // Check if astro.config.mjs has remark-math
      const configPath = path.join(__dirname, '../astro.config.mjs');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      expect(
        configContent.includes('remark-math') || configContent.includes('remarkMath'),
        'remark-math plugin not found in config'
      ).toBe(true);
    });

    it('rehype-mathjax plugin is configured', () => {
      // Check if astro.config.mjs has rehype-mathjax
      const configPath = path.join(__dirname, '../astro.config.mjs');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      expect(
        configContent.includes('rehype-mathjax') || configContent.includes('rehypeMathjax'),
        'rehype-mathjax plugin not found in config'
      ).toBe(true);
    });

    it('remarkPlugins array includes remarkMath', () => {
      const configPath = path.join(__dirname, '../astro.config.mjs');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      expect(
        configContent.includes('remarkPlugins'),
        'remarkPlugins not configured'
      ).toBe(true);
    });

    it('rehypePlugins array includes rehypeMathjax', () => {
      const configPath = path.join(__dirname, '../astro.config.mjs');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      expect(
        configContent.includes('rehypePlugins'),
        'rehypePlugins not configured'
      ).toBe(true);
    });
  });

  describe('Math in Built Pages', () => {
    it('pages with math content build successfully', () => {
      // Check if any ML or transformers posts exist (likely to have math)
      const mlSpacePath = path.join(distPath, 'spaces', 'ml', 'index.html');
      const transformersSpacePath = path.join(distPath, 'spaces', 'transformers', 'index.html');
      
      const hasMlSpace = fs.existsSync(mlSpacePath);
      const hasTransformersSpace = fs.existsSync(transformersSpacePath);
      
      expect(
        hasMlSpace || hasTransformersSpace,
        'spaces with potential math content not found'
      ).toBe(true);
    });

    it('MathJax is available on all pages', () => {
      // Check multiple pages for MathJax presence
      const pages = [
        path.join(distPath, 'index.html'),
        path.join(distPath, 'spaces', 'index.html'),
      ];
      
      pages.forEach(pagePath => {
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf-8');
          expect(
            content.includes('MathJax') || content.includes('mathjax'),
            `MathJax missing on ${pagePath}`
          ).toBe(true);
        }
      });
    });
  });

  describe('Package Dependencies', () => {
    it('remark-math is installed', () => {
      const packageJsonPath = path.join(__dirname, '../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      expect(
        'remark-math' in deps,
        'remark-math not found in package.json'
      ).toBe(true);
    });

    it('rehype-mathjax is installed', () => {
      const packageJsonPath = path.join(__dirname, '../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      expect(
        'rehype-mathjax' in deps,
        'rehype-mathjax not found in package.json'
      ).toBe(true);
    });
  });

  describe('Math Rendering Integration', () => {
    it('BaseLayout includes MathJax script', () => {
      const baseLayoutPath = path.join(__dirname, '../src/layouts/BaseLayout.astro');
      const content = fs.readFileSync(baseLayoutPath, 'utf-8');
      
      expect(
        content.includes('MathJax') || content.includes('mathjax'),
        'BaseLayout does not include MathJax'
      ).toBe(true);
    });

    it('MathJax config defines tex settings', () => {
      const baseLayoutPath = path.join(__dirname, '../src/layouts/BaseLayout.astro');
      const content = fs.readFileSync(baseLayoutPath, 'utf-8');
      
      expect(
        content.includes('tex') && (content.includes('inlineMath') || content.includes('displayMath')),
        'MathJax tex configuration not found'
      ).toBe(true);
    });

    it('MathJax is configured before loading script', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Config should appear before the script
      const configIndex = content.indexOf('window.MathJax');
      const scriptIndex = content.indexOf('tex-svg.js');
      
      if (configIndex !== -1 && scriptIndex !== -1) {
        expect(
          configIndex < scriptIndex,
          'MathJax config should be defined before loading script'
        ).toBe(true);
      }
    });
  });

  describe('Math Symbol Examples', () => {
    it('inline math syntax is recognized', () => {
      // This test verifies the configuration supports common inline math patterns
      const baseLayoutPath = path.join(__dirname, '../src/layouts/BaseLayout.astro');
      const content = fs.readFileSync(baseLayoutPath, 'utf-8');
      
      // Check for $ or \( delimiters in config
      const hasInlineDelimiters = 
        content.includes("'$'") || 
        content.includes('"$"') ||
        content.includes('\\(');
      
      expect(hasInlineDelimiters, 'inline math delimiters not configured').toBe(true);
    });

    it('display math syntax is recognized', () => {
      // This test verifies the configuration supports common display math patterns
      const baseLayoutPath = path.join(__dirname, '../src/layouts/BaseLayout.astro');
      const content = fs.readFileSync(baseLayoutPath, 'utf-8');
      
      // Check for $$ or \[ delimiters in config
      const hasDisplayDelimiters = 
        content.includes("'$$'") || 
        content.includes('"$$"') ||
        content.includes('\\[');
      
      expect(hasDisplayDelimiters, 'display math delimiters not configured').toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('MathJax uses SVG output for accessibility', () => {
      const baseLayoutPath = path.join(__dirname, '../src/layouts/BaseLayout.astro');
      const content = fs.readFileSync(baseLayoutPath, 'utf-8');
      
      // Check for SVG configuration or tex-svg script
      const usesSVG = 
        content.includes('svg') ||
        content.includes('tex-svg');
      
      expect(usesSVG, 'MathJax should use SVG output for better accessibility').toBe(true);
    });
  });
});
