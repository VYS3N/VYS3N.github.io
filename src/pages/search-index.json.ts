import { getPosts, postSlug, readTime, textOnly } from '../lib/data';
export async function GET() {
  const posts = await getPosts();
  return new Response(JSON.stringify(posts.map(post => ({ title: post.data.title, description: post.data.description, body: textOnly(post.body), tags: post.data.tags, category: post.data.category, slug: postSlug(post), date: post.data.date.toISOString(), minutes: readTime(post) }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
