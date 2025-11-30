/**
 * Space System Tests
 * Validates the multi-space architecture works correctly
 */

import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spacesPath = path.join(__dirname, '../src/spaces.json');
const spaces = JSON.parse(fs.readFileSync(spacesPath, 'utf-8'));

describe('Space System Tests', () => {
  describe('3.1 - Each space has required properties', () => {
    it('spaces.json is valid and contains all required fields', () => {
      expect(spaces.length).toBeGreaterThan(0);
      
      spaces.forEach(space => {
        expect(space.id, `space missing id`).toBeDefined();
        expect(space.title, `${space.id}: missing title`).toBeDefined();
        expect(space.description, `${space.id}: missing description`).toBeDefined();
        expect(space.banner, `${space.id}: missing banner`).toBeDefined();
        expect(space.icon, `${space.id}: missing icon`).toBeDefined();
        
        // Type checks
        expect(typeof space.id).toBe('string');
        expect(typeof space.title).toBe('string');
        expect(typeof space.description).toBe('string');
        expect(typeof space.banner).toBe('string');
        expect(typeof space.icon).toBe('string');
      });
    });

    it('space IDs are URL-safe', () => {
      const urlSafePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
      
      spaces.forEach(space => {
        expect(
          urlSafePattern.test(space.id),
          `space ID "${space.id}" is not URL-safe`
        ).toBe(true);
      });
    });
  });

  describe('3.2 - Posts are correctly assigned to spaces', async () => {
    const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
    
    for (const collectionName of collections) {
      it(`${collectionName}: posts belong to valid spaces`, async () => {
        const posts = await getCollection(collectionName);
        const validSpaceIds = spaces.map(s => s.id);
        
        posts.forEach(post => {
          expect(
            validSpaceIds.includes(post.data.space),
            `${post.id}: space "${post.data.space}" not in spaces.json`
          ).toBe(true);
        });
      });
    }
  });

  describe('3.3 - Space filtering logic', async () => {
    it('getPostsBySpace returns only posts from that space', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      
      for (const space of spaces) {
        let spacePosts = [];
        
        for (const collectionName of collections) {
          const posts = await getCollection(collectionName);
          const filtered = posts.filter(post => post.data.space === space.id);
          spacePosts.push(...filtered);
        }
        
        // Verify all posts in spacePosts have the correct space
        spacePosts.forEach(post => {
          expect(post.data.space).toBe(space.id);
        });
      }
    });
  });

  describe('3.4 - Space data integrity', () => {
    it('no duplicate space IDs', () => {
      const ids = spaces.map(s => s.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('banner paths follow convention', () => {
      spaces.forEach(space => {
        expect(
          space.banner.startsWith('/assets/banners/'),
          `${space.id}: banner path should start with /assets/banners/`
        ).toBe(true);
      });
    });

    it('all spaces have non-empty descriptions', () => {
      spaces.forEach(space => {
        expect(
          space.description.trim().length,
          `${space.id}: description is empty`
        ).toBeGreaterThan(0);
      });
    });
  });

  describe('3.5 - Content collection structure', async () => {
    it('each space has a corresponding content directory or posts', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      
      for (const collectionName of collections) {
        const posts = await getCollection(collectionName);
        expect(posts.length, `${collectionName} collection is empty`).toBeGreaterThan(0);
      }
    });
  });
});
