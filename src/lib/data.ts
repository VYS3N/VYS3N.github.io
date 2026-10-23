import { getCollection, type CollectionEntry } from 'astro:content';
import rawSite from '../data/site.json';
import rawFriends from '../data/friends.json';
import rawCollections from '../data/collections.json';
import { type Lang, type Message, localized, t, url } from './i18n';

type Localized = string | { zh: string; en: string };
export interface Project { title: Localized; description: Localized; url: string; tags?: string[]; image?: string; }
export interface Publication { title: string; authors?: string; venue?: string; year: string | number; url?: string; code?: string; }
export interface Education { title: Localized; detail: Localized; start: string; end?: string; url?: string; }
export interface Friend { name: string; url: string; description: string; avatar?: string; rss?: string; }
export interface Series { slug: string; title: Localized; description: Localized; }
export const site = rawSite as Omit<typeof rawSite, 'projects' | 'publications' | 'education' | 'interests' | 'tools' | 'mirrors'> & {
  projects: Project[]; publications: Publication[]; education: Education[]; interests: Localized[];
  tools: { name: string; description: Localized; url: string }[]; mirrors: { name: string; url: string }[];
};
export const friends = rawFriends as Friend[];
export const configuredSeries = rawCollections as Series[];
export type Post = CollectionEntry<'posts'>;
export const categoryKeys = ['tech', 'research', 'daily', 'journal'] as const;
export type Category = typeof categoryKeys[number];
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || (!data.draft && data.date.getTime() <= Date.now()));
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}
export const postSlug = (post: Post) => post.data.slug || post.id.replace(/\.(md|mdx)$/, '');
export const postUrl = (post: Post, lang: Lang) => url(lang, 'blog/' + postSlug(post));
export function textOnly(body = ''): string {
  return body.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, '').replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`#*_>~|]/g, '').replace(/\s+/g, ' ').trim();
}
export function wordCount(body = ''): number {
  const clean = textOnly(body);
  return (clean.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu) || []).length + (clean.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu, ' ').match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) || []).length;
}
export const readTime = (post: Post) => Math.max(1, Math.ceil(wordCount(post.body) / (post.data.lang === 'zh' ? 350 : 220)));
export const formatDate = (date: Date | string, lang: Lang) => new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Shanghai' }).format(new Date(date));
export function tagSlug(tag: string) {
  const normalized = tag.normalize('NFKC').toLowerCase();
  const stem = normalized.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'tag';
  let hash = 5381;
  for (const char of tag) hash = ((hash << 5) + hash) ^ char.codePointAt(0)!;
  return stem + '-' + (hash >>> 0).toString(36).slice(0, 5);
}
export function tagGroups(posts: Post[]) {
  const result = new Map<string, Post[]>();
  for (const post of posts) for (const tag of new Set(post.data.tags)) result.set(tag, [...(result.get(tag) || []), post]);
  return [...result].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}
export function allSeries(posts: Post[]): Series[] {
  const result = [...configuredSeries];
  for (const post of posts) {
    if (post.data.collection && !result.some(s => s.slug === post.data.collection)) result.push({ slug: post.data.collection, title: post.data.collection, description: '' });
  }
  return result;
}
export const seriesPosts = (posts: Post[], slug: string) => posts.filter(p => p.data.collection === slug).sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || a.data.date.getTime() - b.data.date.getTime());
export type Route = { path: string; lang: Lang; kind: 'home' | 'about' | 'academic' | 'projects' | 'listing' | 'article' | 'archives' | 'tags' | 'tag' | 'collections' | 'collection' | 'links' | 'search' | 'policy' | 'policies'; title: string; category?: string; page?: number; tag?: string; series?: Series; postId?: string; };
export const pageSize = 10;
export function makeRoutes(posts: Post[]): Route[] {
  const routes: Route[] = [];
  const slugs = new Set<string>();
  for (const post of posts) {
    const slug = postSlug(post);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug) || ['all', ...categoryKeys].includes(slug)) throw new Error(`Article slug "${slug}" is invalid or reserved. Set an ASCII slug in its frontmatter.`);
    if (slugs.has(slug)) throw new Error(`Duplicate article slug: ${slug}`);
    slugs.add(slug);
  }
  const series = allSeries(posts);
  for (const item of series) if (!/^[a-z0-9][a-z0-9-]*$/.test(item.slug)) throw new Error(`Invalid collection slug: ${item.slug}`);
  for (const lang of ['zh', 'en'] as const) {
    const add = (route: Omit<Route, 'lang'>) => routes.push({ ...route, lang });
    for (const [path, kind, key] of [ ['', 'home', 'home'], ['about', 'about', 'about'], ['academic', 'academic', 'academic'], ['projects', 'projects', 'projects'], ['archives', 'archives', 'archives'], ['tags', 'tags', 'tags'], ['collection', 'collections', 'collections'], ['links', 'links', 'links'], ['search', 'search', 'search'], ['terms/list', 'policies', 'policy'] ] as const) add({ path, kind, title: t(lang, key) });
    for (const category of ['all', ...categoryKeys]) {
      const count = category === 'all' ? posts.length : posts.filter(p => p.data.category === category).length;
      for (let page = 1; page <= Math.max(1, Math.ceil(count / pageSize)); page++) add({ path: `blog/${category}${page === 1 ? '' : '/' + page}`, kind: 'listing', category, page, title: t(lang, category as Message) });
    }
    for (const post of posts) add({ path: 'blog/' + postSlug(post), kind: 'article', postId: post.id, title: post.data.title });
    for (const [tag] of tagGroups(posts)) add({ path: 'tags/' + tagSlug(tag), kind: 'tag', tag, title: tag });
    for (const item of series) add({ path: 'collection/' + item.slug, kind: 'collection', series: item, title: localized(item.title, lang) });
    for (const [path, key] of [['privacy-policy', 'privacy'], ['terms-and-conditions', 'terms'], ['copyright', 'copyright'], ['disclaimer', 'disclaimer']] as const) add({ path: 'terms/' + path, kind: 'policy', title: t(lang, key) });
  }
  return routes;
}
