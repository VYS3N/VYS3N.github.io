import rss from '@astrojs/rss';
import { getPosts, site, postUrl } from '../lib/data';
export async function GET() {
  const posts = await getPosts();
  return rss({ title: site.title, description: site.description.zh || site.description.en, site: site.url, items: posts.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: postUrl(post, 'zh'), categories: [post.data.category, ...post.data.tags], author: site.name })), customData: '<language>zh-cn</language>' });
}
