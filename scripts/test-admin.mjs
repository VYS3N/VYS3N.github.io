import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist');
const scratch = resolve('work/admin-test');
await mkdir(scratch, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    let file = resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
    if (!file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end('Not found'); }
});
await new Promise(accept => server.listen(0, '127.0.0.1', accept));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.SITE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const checks = [];
const check = message => { checks.push(message); console.log(`PASS ${message}`); };
let page;
let failure;

async function repositoryFiles() {
  return page.evaluate(async () => {
    const result = {};
    async function walk(dir, prefix = '') {
      for await (const [name, handle] of dir.entries()) {
        const path = prefix + name;
        if (handle.kind === 'directory') await walk(handle, path + '/');
        else if (/\.(md|mdx|json)$/.test(name)) result[path] = await (await handle.getFile()).text();
      }
    }
    await walk(await navigator.storage.getDirectory());
    return result;
  });
}

try {
  const production = JSON.parse(await readFile('dist/admin/config.json', 'utf8'));
  assert.deepEqual(production.backend, { name: 'github', repo: 'VYS3N/VYS3N.github.io', branch: 'main', auth_methods: ['token'] });
  const context = await browser.newContext({ locale: 'en-US', viewport: { width: 1440, height: 1000 } });
  page = await context.newPage(); page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/admin/');
  await page.getByRole('button', { name: 'Sign In Using Access Token', exact: true }).click();
  await page.getByRole('alertdialog').waitFor();
  assert.equal(await page.getByRole('alertdialog').count(), 1);
  assert.equal(await page.getByRole('textbox', { name: 'Personal Access Token', exact: true }).inputValue(), '');
  assert.equal(await page.getByRole('button', { name: 'Sign In', exact: true }).isDisabled(), true);
  const tokenUrl = await page.getByRole('alertdialog').getByRole('link').getAttribute('href');
  assert.match(tokenUrl, /^https:\/\/github.com\/settings\/personal-access-tokens\/new/);
  assert.equal(await page.getByRole('button', { name: /Sign In with GitHub/ }).count(), 0);
  await page.screenshot({ path: join(scratch, 'token-login.png'), fullPage: true });
  check('production config requires repository-scoped GitHub token; empty token cannot sign in; no unconfigured OAuth flow');
  await context.close();

  const demo = await browser.newContext({ locale: 'en-US', viewport: { width: 1440, height: 1000 } });
  page = await demo.newPage(); page.setDefaultTimeout(15000);
  page.on('pageerror', error => errors.push(error.message));
  const config = structuredClone(production); config.backend = { name: 'test-repo' };
  await page.route('**/admin/config.json*', route => route.fulfill({ json: config }));
  const html = (await readFile('dist/admin/index.html', 'utf8')).replace('</head>', '<link rel="cms-seed-url" href="/seed/manifest.json"></head>');
  await page.route('**/admin/', route => route.fulfill({ contentType: 'text/html', body: html }));
  const seed = Object.fromEntries(await Promise.all(['src/data/site.json', 'src/data/friends.json', 'src/data/collections.json', 'src/content/pages/about.md', 'src/content/pages/academic.md'].map(async path => [path, await readFile(path, 'utf8')])));
  const frontmatter = title => `---\ntitle: ${title}\nslug: ${title}\ndate: '2020-01-01'\ncategory: tech\ndraft: true\ncomments: true\nlang: zh\n---\n\n`;
  seed['src/content/posts/admin-seed.md'] = frontmatter('admin-seed') + 'Markdown seed.\n';
  const mdxBody = '<Aside type="note" title="Keep JSX">MDX source remains unchanged.</Aside>\n';
  seed['src/content/posts/admin-seed-mdx.mdx'] = frontmatter('admin-seed-mdx') + mdxBody;
  await page.route('**/seed/**', route => {
    const path = new URL(route.request().url()).pathname.replace('/seed/', '');
    return path === 'manifest.json' ? route.fulfill({ json: { files: Object.keys(seed) } }) : route.fulfill({ body: seed[path], contentType: path.endsWith('.json') ? 'application/json' : 'text/plain' });
  });
  await page.goto(base + '/admin/');
  await page.getByRole('button', { name: 'Start Demo', exact: true }).click();
  await page.getByRole('button', { name: 'Get Started', exact: true }).click();
  await page.getByRole('treeitem', { name: '文章 · Markdown', exact: true }).waitFor();
  const list = page.getByRole('group', { name: 'Entry List', exact: true });
  assert.match(await list.innerText(), /admin-seed/);
  assert.doesNotMatch(await list.innerText(), /admin-seed-mdx/);
  await page.getByRole('treeitem', { name: '文章 · MDX 源码', exact: true }).click();
  assert.match(await list.innerText(), /admin-seed-mdx/);
  check('Markdown and MDX collections filter by extension and preserve separate entries');

  await page.getByRole('treeitem', { name: '文章 · Markdown', exact: true }).click();
  await page.getByRole('button', { name: 'Create New Entry', exact: true }).first().click();
  await page.getByRole('textbox', { name: '文章标题', exact: true }).fill('Admin integration check');
  await page.getByRole('textbox', { name: '固定网址标识', exact: true }).fill('admin-integration-check');
  await page.getByRole('textbox', { name: '发布日期', exact: true }).fill('2020-05-06');
  const editor = page.getByRole('group', { name: 'Edit Content', exact: true });
  await editor.evaluate(root => { for (const el of [root, ...root.querySelectorAll('*')]) if (el.scrollHeight > el.clientHeight && /auto|scroll/.test(getComputedStyle(el).overflowY)) el.scrollTop = el.scrollHeight; });
  const bodyField = editor.locator('[data-key-path="body"]');
  await bodyField.waitFor();
  await bodyField.getByRole('textbox').fill('Test article saved locally for integration verification.');
  await page.screenshot({ path: join(scratch, 'article-editor.png'), fullPage: true });
  assert.equal(await page.getByRole('switch', { name: '保留为草稿', exact: true }).isChecked(), true);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForFunction(async () => {
    async function find(dir) {
      for await (const [name, handle] of dir.entries()) {
        if (handle.kind === 'directory' && await find(handle)) return true;
        if (name === 'admin-integration-check.md') return true;
      }
      return false;
    }
    return find(await navigator.storage.getDirectory());
  });
  let files = await repositoryFiles();
  await writeFile(join(scratch, 'test-storage.json'), JSON.stringify(files, null, 2));
  const article = Object.entries(files).find(([path]) => path.endsWith('/admin-integration-check.md'))?.[1];
  assert.ok(article, 'CMS should save a Markdown file using the chosen slug');
  assert.match(article, /draft: true/); assert.match(article, /date: ['"]?2020-05-06['"]?\s*\n/);
  assert.doesNotMatch(article, /updated:|coverCredit:/);
  check('new article saves as valid Markdown frontmatter with a stable slug, date-only value, draft default and omitted blank optional dates/URLs');
  await page.getByRole('treeitem', { name: '站点资料', exact: true }).click();
  await page.getByText('主页、联系方式与展示内容', { exact: true }).click();
  await page.getByRole('textbox', { name: '公开名称', exact: true }).fill('VYS3N integration check');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.waitForFunction(async () => {
    async function find(dir) {
      for await (const [name, handle] of dir.entries()) {
        if (handle.kind === 'directory' && await find(handle)) return true;
        if (name === 'site.json' && (await (await handle.getFile()).text()).includes('VYS3N integration check')) return true;
      }
      return false;
    }
    return find(await navigator.storage.getDirectory());
  });
  files = await repositoryFiles();
  const saved = JSON.parse(Object.entries(files).find(([path]) => path.endsWith('/src/data/site.json'))[1]);
  assert.equal(saved.name, 'VYS3N integration check'); assert.equal(saved.avatar, '/images/avatar.webp');
  assert.equal(saved.giscus.repo, 'VYS3N/VYS3N.github.io');
  check('site settings save valid JSON and retain the homepage avatar and nested comment configuration');
  await page.getByRole('treeitem', { name: '文章 · MDX 源码', exact: true }).click();
  await page.getByRole('row', { name: 'admin-seed-mdx', exact: true }).getByRole('gridcell').nth(2).click();
  await page.getByRole('textbox', { name: '文章标题', exact: true }).fill('Updated MDX title');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('treeitem', { name: '文章 · MDX 源码', exact: true }).waitFor();
  files = await repositoryFiles();
  const savedMDX = Object.entries(files).find(([path]) => path.endsWith('/admin-seed-mdx.mdx'))[1];
  assert.match(savedMDX, /title: Updated MDX title/);
  assert.ok(savedMDX.includes(mdxBody.trim()), 'Editing MDX metadata must preserve JSX source');
  check('editing MDX metadata preserves the original JSX component source');
  await page.getByRole('radio', { name: 'Assets', exact: true }).click();
  await page.getByRole('button', { name: 'Upload New Assets', exact: true }).first().click();
  const upload = page.getByRole('dialog', { name: 'Upload New Assets', exact: true });
  await upload.locator('input[type="file"]').setInputFiles({ name: 'admin-test.webp', mimeType: 'image/webp', buffer: await readFile('public/images/avatar.webp') });
  await page.getByRole('alertdialog', { name: 'Upload New Assets', exact: true }).getByRole('button', { name: 'Upload', exact: true }).click();
  await page.getByRole('alertdialog', { name: 'Upload New Assets', exact: true }).waitFor({ state: 'hidden' });
  await page.getByRole('group', { name: 'Asset List', exact: true }).getByText('admin-test.webp', { exact: true }).first().waitFor();
  const imageBytes = await page.evaluate(async () => {
    let folder = await navigator.storage.getDirectory();
    for (const part of ['sveltia-cms-test', 'public', 'images']) folder = await folder.getDirectoryHandle(part);
    return (await (await folder.getFileHandle('admin-test.webp')).getFile()).size;
  });
  assert.ok(imageBytes > 0);
  check('asset upload accepts a valid image and writes it to the configured public/images folder');
  assert.deepEqual(errors, []);
  await demo.close();
  check('no browser runtime errors; test edits remain in isolated browser storage and never access GitHub');
} catch (error) {
  failure = error;
  console.error(error);
  if (page && !page.isClosed()) {
    await writeFile(join(scratch, 'failure.txt'), await page.locator('body').ariaSnapshot());
    await page.screenshot({ path: join(scratch, 'failure.png'), fullPage: true });
  }
} finally {
  await browser.close(); await new Promise(accept => server.close(accept));
  await writeFile(join(scratch, 'report.json'), JSON.stringify({ passed: !failure, checks, error: failure?.message || null, scope: 'Local CMS integration. Actual GitHub token authorization and real repository writes are not tested.' }, null, 2));
}
if (failure) process.exitCode = 1;
