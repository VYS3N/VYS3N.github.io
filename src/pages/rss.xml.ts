import rss from '@astrojs/rss';
import { getPosts, site, postUrl } from '../lib/data';
import { localized } from '../lib/i18n';
export async function GET() {
  const posts = await getPosts();
  return rss({ title: site.title, description: localized(site.description, 'zh') || site.title, site: site.url, items: posts.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: postUrl(post, 'zh'), categories: [post.data.category, ...post.data.tags], author: site.name })), customData: '<language>zh-cn</language>' });
}
