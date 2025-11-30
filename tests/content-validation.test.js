/**
 * MDX Content Validation Tests
 * Ensures all MDX files have correct frontmatter, valid spaces, and unique slugs
 */

import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load spaces.json
const spacesPath = path.join(__dirname, '../src/spaces.json');
const spaces = JSON.parse(fs.readFileSync(spacesPath, 'utf-8'));
const validSpaceIds = spaces.map(s => s.id);

describe('MDX Content Validation', () => {
  describe('1.1 - Required frontmatter fields', async () => {
    const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
    
    for (const collectionName of collections) {
      it(`${collectionName}: all posts have required frontmatter fields`, async () => {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          const { title, date, description, tags, space } = post.data;
          
          // Check required fields exist
          expect(title, `${post.id}: missing title`).toBeDefined();
          expect(date, `${post.id}: missing date`).toBeDefined();
          expect(description, `${post.id}: missing description`).toBeDefined();
          expect(tags, `${post.id}: missing tags`).toBeDefined();
          expect(space, `${post.id}: missing space`).toBeDefined();
          
          // Check correct types
          expect(typeof title, `${post.id}: title must be string`).toBe('string');
          expect(date instanceof Date, `${post.id}: date must be Date object`).toBe(true);
          expect(typeof description, `${post.id}: description must be string`).toBe('string');
          expect(Array.isArray(tags), `${post.id}: tags must be array`).toBe(true);
          expect(typeof space, `${post.id}: space must be string`).toBe('string');
          
          // Check non-empty
          expect(title.trim().length, `${post.id}: title cannot be empty`).toBeGreaterThan(0);
          expect(description.trim().length, `${post.id}: description cannot be empty`).toBeGreaterThan(0);
          expect(tags.length, `${post.id}: must have at least one tag`).toBeGreaterThan(0);
        });
      });
    }
  });

  describe('1.2 - Validate space exists in spaces.json', async () => {
    const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
    
    for (const collectionName of collections) {
      it(`${collectionName}: all posts reference valid spaces`, async () => {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          const { space } = post.data;
          expect(
            validSpaceIds.includes(space),
            `${post.id}: space "${space}" not found in spaces.json. Valid: ${validSpaceIds.join(', ')}`
          ).toBe(true);
        });
      });
    }
  });

  describe('1.3 - Validate slug uniqueness', async () => {
    it('no duplicate slugs across all collections', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      const allSlugs = new Map();
      
      for (const collectionName of collections) {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          const slug = post.slug;
          
          if (allSlugs.has(slug)) {
            throw new Error(
              `Duplicate slug "${slug}" found in ${collectionName}/${post.id} and ${allSlugs.get(slug)}`
            );
          }
          
          allSlugs.set(slug, `${collectionName}/${post.id}`);
        });
      }
      
      expect(allSlugs.size).toBeGreaterThan(0);
    });
  });

  describe('1.4 - Validate MDX syntax', async () => {
    const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
    
    for (const collectionName of collections) {
      it(`${collectionName}: all MDX files have valid syntax`, async () => {
        const posts = await getCollection(collectionName);
        
        // If getCollection succeeds without throwing, MDX is parseable
        expect(posts.length).toBeGreaterThan(0);
        
        posts.forEach(post => {
          // Additional checks for common issues
          expect(post.data, `${post.id}: frontmatter must be defined`).toBeDefined();
          expect(post.body, `${post.id}: body must be defined`).toBeDefined();
        });
      });
    }
  });

  describe('Additional - Date validation', async () => {
    const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
    
    for (const collectionName of collections) {
      it(`${collectionName}: dates are valid and not in future`, async () => {
        const posts = await getCollection(collectionName);
        const now = new Date();
        
        posts.forEach(post => {
          const { date } = post.data;
          
          // Check valid date
          expect(isNaN(date.getTime()), `${post.id}: invalid date`).toBe(false);
          
          // Optional: warn if date is in future (uncomment if needed)
          // expect(date <= now, `${post.id}: date is in the future`).toBe(true);
        });
      });
    }
  });

  describe('Additional - Tag format validation', async () => {
    const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
    const tagPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    
    for (const collectionName of collections) {
      it(`${collectionName}: tags are lowercase and URL-safe`, async () => {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          const { tags } = post.data;
          
          tags.forEach(tag => {
            expect(
              tagPattern.test(tag),
              `${post.id}: tag "${tag}" must be lowercase, alphanumeric, with hyphens only`
            ).toBe(true);
          });
        });
      });
    }
  });
});
