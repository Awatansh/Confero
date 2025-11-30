import { getCollection } from 'astro:content';
import readingTime from 'reading-time';

export async function getAllPosts() {
  const allPosts = [];
  
  const collections = ['blog', 'ml', 'transformers', 'web', 'notes'] as const;
  
  for (const collection of collections) {
    try {
      const posts = await getCollection(collection);
      allPosts.push(...posts);
    } catch (e) {
      // Collection might not exist yet
    }
  }
  
  return allPosts.sort((a, b) => 
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

export async function getPostsBySpace(space: string) {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.data.space === space);
}

export async function getPostsByTag(tag: string) {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.data.tags.includes(tag));
}

export async function getAllTags() {
  const allPosts = await getAllPosts();
  const tags = new Set<string>();
  
  allPosts.forEach(post => {
    post.data.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

export function calculateReadingTime(content: string): string {
  const result = readingTime(content);
  return result.text;
}

export async function getLatestPosts(limit: number = 5) {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, limit);
}
