import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().transform(str => new Date(str)),
    tags: z.array(z.string()).default([]),
    space: z.string().default('blog'),
  }),
});

export const collections = {
  blog: blogCollection,
  ml: blogCollection,
  transformers: blogCollection,
  web: blogCollection,
  notes: blogCollection,
};
