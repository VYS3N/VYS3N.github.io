import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const dateInShanghai = z.preprocess(value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value + 'T00:00:00+08:00' : value, z.coerce.date());

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().default(''),
    date: dateInShanghai,
    updated: dateInShanghai.optional(),
    category: z.enum(['tech', 'research', 'daily', 'journal']).default('tech'),
    tags: z.array(z.string()).default([]),
    collection: z.string().optional(),
    order: z.number().optional(),
    slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/).optional(),
    cover: z.string().optional(),
    coverAlt: z.string().default(''),
    coverCredit: z.url().optional(),
    draft: z.boolean().default(false),
    comments: z.boolean().default(true),
    lang: z.enum(['zh', 'en']).default('zh'),
  }),
});
const pages = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({ title: z.string().optional() }),
});
export const collections = { posts, pages };
