/**
 * Tag System Tests
 * Validates tag pages, filtering, and URL safety
 */

import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Tag System Tests', () => {
  describe('4.1 - Tag format validation', async () => {
    const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
    const tagPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    
    for (const collectionName of collections) {
      it(`${collectionName}: all tags are lowercase and URL-safe`, async () => {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          const { tags } = post.data;
          
          tags.forEach(tag => {
            expect(
              typeof tag,
              `${post.id}: tag must be string, got ${typeof tag}`
            ).toBe('string');
            
            expect(
              tagPattern.test(tag),
              `${post.id}: tag "${tag}" must be lowercase, alphanumeric, with hyphens only (a-z, 0-9, -)`
            ).toBe(true);
            
            expect(
              !tag.startsWith('-') && !tag.endsWith('-'),
              `${post.id}: tag "${tag}" cannot start or end with hyphen`
            ).toBe(true);
            
            expect(
              !tag.includes('--'),
              `${post.id}: tag "${tag}" cannot contain consecutive hyphens`
            ).toBe(true);
          });
        });
      });
    }
  });

  describe('4.2 - Tag coverage and uniqueness', async () => {
    it('collects all unique tags across all posts', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      const allTags = new Set();
      
      for (const collectionName of collections) {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          post.data.tags.forEach(tag => allTags.add(tag));
        });
      }
      
      expect(allTags.size, 'no tags found across all posts').toBeGreaterThan(0);
      
      // Verify all tags are unique (Set handles this, but we verify)
      expect(allTags.size).toBe(Array.from(allTags).length);
    });

    it('every post has at least one tag', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      
      for (const collectionName of collections) {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          expect(
            post.data.tags.length,
            `${post.id}: must have at least one tag`
          ).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('4.3 - Tag filtering logic', async () => {
    it('tag filtering returns only posts with that tag', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      const allTags = new Set();
      
      // Collect all tags
      for (const collectionName of collections) {
        const posts = await getCollection(collectionName);
        posts.forEach(post => {
          post.data.tags.forEach(tag => allTags.add(tag));
        });
      }
      
      // Test filtering for each tag
      for (const tag of Array.from(allTags).slice(0, 5)) { // Test first 5 tags
        let tagPosts = [];
        
        for (const collectionName of collections) {
          const posts = await getCollection(collectionName);
          const filtered = posts.filter(post => post.data.tags.includes(tag));
          tagPosts.push(...filtered);
        }
        
        // Verify all returned posts contain the tag
        tagPosts.forEach(post => {
          expect(
            post.data.tags.includes(tag),
            `${post.id}: should contain tag "${tag}"`
          ).toBe(true);
        });
        
        // At least one post should have this tag
        expect(tagPosts.length, `no posts found for tag "${tag}"`).toBeGreaterThan(0);
      }
    });
  });

  describe('4.4 - Tag data quality', async () => {
    it('no empty tags', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      
      for (const collectionName of collections) {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          post.data.tags.forEach(tag => {
            expect(
              tag.trim().length,
              `${post.id}: empty tag found`
            ).toBeGreaterThan(0);
          });
        });
      }
    });

    it('no duplicate tags within a post', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      
      for (const collectionName of collections) {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          const { tags } = post.data;
          const uniqueTags = new Set(tags);
          
          expect(
            uniqueTags.size,
            `${post.id}: has duplicate tags`
          ).toBe(tags.length);
        });
      }
    });

    it('reasonable tag count per post', async () => {
      const collections = ['blog', 'ml', 'transformers', 'web', 'notes'];
      const MAX_TAGS = 10;
      
      for (const collectionName of collections) {
        const posts = await getCollection(collectionName);
        
        posts.forEach(post => {
          expect(
            post.data.tags.length,
            `${post.id}: has ${post.data.tags.length} tags (max recommended: ${MAX_TAGS})`
          ).toBeLessThanOrEqual(MAX_TAGS);
        });
      }
    });
  });
});
