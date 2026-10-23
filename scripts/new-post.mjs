import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const args = process.argv.slice(2);
const options = {};
const words = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) { const name = args[i].slice(2); if (!['slug', 'category', 'collection'].includes(name) || !args[i + 1] || args[i + 1].startsWith('--')) { console.error('Supported options: --slug, --category, --collection. Each needs a value.'); process.exit(1); } options[name] = args[++i]; }
  else words.push(args[i]);
}
const title = words.join(' ').trim();
if (!title) { console.error('Usage: npm run new:post -- "文章标题" --slug my-post --category tech'); process.exit(1); }
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const derived = title.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const slug = options.slug || derived || `post-${date}-${Date.now().toString(36).slice(-5)}`;
const category = options.category || 'tech';
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug) || ['all', 'tech', 'research', 'daily', 'journal'].includes(slug)) { console.error('Use a unique lowercase ASCII slug with letters, numbers and hyphens. Category names are reserved.'); process.exit(1); }
if (!['tech', 'research', 'daily', 'journal'].includes(category)) { console.error('Category must be tech, research, daily or journal.'); process.exit(1); }
if (options.collection && !/^[a-z0-9][a-z0-9-]*$/.test(options.collection)) { console.error('Collection must be an ASCII slug.'); process.exit(1); }
const folder = resolve('src/content/posts'); await mkdir(folder, { recursive: true });
const path = resolve(folder, `${slug}.md`);
const lines = ['---', `title: ${JSON.stringify(title)}`, 'description: ""', `date: "${date}"`, `slug: "${slug}"`, `category: ${category}`, 'tags: []', ...(options.collection ? [`collection: "${options.collection}"`, 'order: 1'] : []), 'lang: zh', 'draft: true', 'comments: true', '---', '', '## 从这里开始', '', '<!-- 写好正文后，将 draft 改为 false，再提交发布。 -->', ''];
try { await writeFile(path, lines.join('\n'), { encoding: 'utf8', flag: 'wx' }); console.log(`Created draft: ${path}`); }
catch (error) { if (error.code === 'EEXIST') { console.error('This article file already exists. Choose a different slug.'); process.exit(1); } throw error; }
