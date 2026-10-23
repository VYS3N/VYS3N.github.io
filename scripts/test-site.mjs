import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir, stat, writeFile, unlink, mkdir, access } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { XMLParser } from 'fast-xml-parser';

const project = process.cwd();
const dist = resolve('dist');
const scratch = resolve('work/site-test');
await mkdir(scratch, { recursive: true });
const snapshots = process.env.SITE_SCREENSHOTS ? resolve(process.env.SITE_SCREENSHOTS) : join(scratch, 'screenshots');
await mkdir(snapshots, { recursive: true });
const testNames = [];
const report = [];
const parser = new XMLParser();
let browser;
let server;
let base;
const log = text => { report.push(text); console.log(text); };
async function build(label) {
  const pkg = JSON.parse(await readFile('node_modules/astro/package.json', 'utf8'));
  const cli = resolve('node_modules/astro', typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.astro);
  const output = await new Promise((accept, reject) => {
    const child = spawn(process.execPath, [cli, 'build'], { cwd: project, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let text = ''; child.stdout.on('data', chunk => { text += chunk; }); child.stderr.on('data', chunk => { text += chunk; }); child.once('error', reject);
    child.once('exit', code => code === 0 ? accept(text) : reject(new Error(`Build failed:\n${text.slice(-12000)}`)));
  });
  await writeFile(join(scratch, `build-${label}.log`), output);
  log(`PASS production build: ${label}`);
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain' };
async function serve() {
  server = createServer(async (request, response) => {
    try {
      const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      let file = resolve(dist, '.' + path);
      if (file !== dist && !file.startsWith(dist + sep)) { response.writeHead(403); response.end(); return; }
      try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); await access(file); }
      catch { file = join(dist, '404.html'); response.statusCode = 404; }
      response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
      response.end(await readFile(file));
    } catch { response.writeHead(500); response.end(); }
  });
  await new Promise(accept => server.listen(0, '127.0.0.1', accept));
  base = `http://127.0.0.1:${server.address().port}`;
}
async function walk(folder) {
  const result = [];
  for (const item of await readdir(folder, { withFileTypes: true })) { const path = join(folder, item.name); if (item.isDirectory()) result.push(...await walk(path)); else result.push(path); }
  return result;
}
async function checkInternalLinks() {
  const files = (await walk(dist)).filter(path => path.endsWith('.html'));
  const urls = new Set();
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/<a\b[^>]*href="([^"#]+)"/g)) if (match[1].startsWith('/')) urls.add(match[1].split('#')[0].replaceAll('&amp;', '&'));
  }
  for (const path of urls) { const response = await fetch(base + path); assert.equal(response.status, 200, `Broken internal link: ${path}`); }
  log(`PASS internal navigation: ${urls.size} links across ${files.length} HTML files`);
}
async function screenshot(page, name) { await page.screenshot({ path: join(snapshots, name + '.png'), fullPage: true }); }
async function chooseBrowser() {
  const candidates = [process.env.SITE_BROWSER, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean);
  for (const path of candidates) { try { await access(path); return path; } catch { /* Try the next local browser. */ } }
  return undefined;
}
async function basicTests() {
  const errors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').textContent(), 'VYS3N');
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  if (!process.env.SITE_EXPECT_CONTENT) { assert.match(await page.locator('main').innerText(), /文章还在准备中/); assert.deepEqual(await (await fetch(base + '/search-index.json')).json(), []); }
  await screenshot(page, 'home-light-zh');
  await page.locator('[data-theme-toggle]').click();
  await page.locator('[data-theme-toggle]').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await screenshot(page, 'home-dark-zh');
  await page.locator('.language-switch').click();
  assert.match(page.url(), /\/en\/$/); assert.equal(await page.locator('html').getAttribute('lang'), 'en'); assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await screenshot(page, 'home-dark-en');
  await page.goto(base + '/search/'); await page.locator('input[type="search"]').fill('尚无内容的查询');
  await page.locator('[data-search-results] .empty-title').waitFor();
  await page.goto(base + '/links/'); assert.equal(await page.locator('[data-waline-server]').getAttribute('data-waline-server'), ''); assert.equal(await page.locator('[data-load-comments]').count(), 0);
  await page.locator('[data-copy-site]').click(); await page.locator('[data-toast]:not([hidden])').waitFor();
  await screenshot(page, 'links-dark-zh');
  const missing = await page.goto(base + '/does-not-exist/'); assert.equal(missing.status(), 404); assert.match(await page.locator('main').innerText(), /404/);
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 }); await page.goto(base, { waitUntil: 'networkidle' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal page overflow at ${width}px`);
    if (width < 760) { await page.locator('[data-menu-toggle]').click(); assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'true'); await page.keyboard.press('Escape'); assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false'); }
    if (width === 390) await screenshot(page, 'home-mobile-dark-zh');
  }
  assert.deepEqual(errors, [], 'Unexpected browser errors');
  await context.close(); log('PASS empty state, themes, locale switching, mobile navigation, no page overflow, copy, comments disabled, 404');
}
async function addFixtures() {
  const folder = resolve('src/content/posts');
  const componentTemplate = await readFile('content/templates/writing.mdx', 'utf8');
  const componentBody = componentTemplate.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  for (let index = 0; index < 15; index++) {
    const name = join(folder, `__site_test_${index}.${index >= 12 ? 'mdx' : 'md'}`);
    try { await access(name); throw new Error(`Fixture already exists: ${name}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const draft = index === 13; const future = index === 14;
    const body = index === 0 ? '\n## 第一节\n\n全文检索独有短语 saffronprotocol。\n\n### 第二层标题\n\n这是测试用临时内容。\n\n```javascript\nconsole.log("copy-test");\n```\n\n$$\na^2 + b^2 = c^2\n$$\n\n```mermaid\nflowchart LR\n  A[Write] --> B[Publish]\n```\n\n![测试图片](/favicon.svg)\n\n## 最后一节\n\n结束。\n' : `\n## 测试内容\n\n临时端到端验证文章 ${index}。不会发布到正式网站。\n`;
    const mdxBody = '\nexport const internalOnlyMarker = "not-part-of-search-index";\n\n' + componentBody + '\n\n<Video src="https://www.youtube.com/watch?v=jfKfPfyJRdk" title="外部视频测试" />\n\n<Tabs label="外层测试"><Tab label="外层一"><Tabs label="内层测试"><Tab label="内层一">内层第一项</Tab><Tab label="内层二">内层第二项</Tab></Tabs></Tab><Tab label="外层二">外层第二项</Tab></Tabs>\n\n<Collapse title="深层锚点"><Tabs><Tab label="首项">第一项</Tab><Tab label="隐藏锚点页签"><h3 id="hidden-anchor-target">隐藏锚点目标</h3></Tab></Tabs></Collapse>\n\n$$\na^2 + b^2 = c^2\n$$\n\n```mermaid\nflowchart LR\n  A[Write] --> B[Publish]\n```\n';
    const syncedTabs = '\n<Tabs label="同步页签测试" syncKey="operating-system"><Tab label="Windows">Windows 同步内容</Tab><Tab label="macOS / Linux">Unix 同步内容</Tab></Tabs>\n';
    const content = ['---', `title: "临时验证文章 ${index}"`, 'description: "仅用于本地功能测试"', `date: "${future ? '2099-01-01' : '2020-01-' + String(index + 1).padStart(2, '0')}"`, `slug: "site-test-${index}"`, 'category: tech', 'tags: ["中文标签", "TypeScript", "C++", "C#"]', 'collection: validation-series', `order: ${index + 1}`, `draft: ${draft}`, 'lang: zh', '---', index === 12 ? mdxBody + syncedTabs : body].join('\n');
    await writeFile(name, content, { flag: 'wx' }); testNames.push(name);
  }
}
async function articleTests() {
  const index = await (await fetch(base + '/search-index.json')).json(); assert.equal(index.length, 13); assert.ok(!index.some(post => ['site-test-13', 'site-test-14'].includes(post.slug)));
  const feed = parser.parse(await (await fetch(base + '/rss.xml')).text()); assert.equal(feed.rss.channel.item.length, 13);
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', permissions: ['clipboard-read', 'clipboard-write'], reducedMotion: 'reduce' });
  const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/blog/all/'); assert.equal(await page.locator('.post-row').count(), 10); await page.locator('a[rel="next"]').click(); assert.equal(await page.locator('.post-row').count(), 3);
  await page.goto(base + '/tags/'); assert.equal(await page.locator('.tag-cloud>a').count(), 4); const paths = await page.locator('.tag-cloud>a').evaluateAll(links => links.map(link => link.getAttribute('href'))); assert.equal(new Set(paths).size, 4);
  await page.goto(base + '/collection/validation-series/'); assert.equal(await page.locator('.post-row').count(), 13);
  await page.goto(base + '/archives/'); assert.equal(await page.locator('.archive-row').count(), 13);
  await page.goto(base + '/search/?q=' + encodeURIComponent('全文检索独有短语')); await page.locator('.search-result').waitFor(); assert.equal(await page.locator('.search-result').count(), 1);
  await page.locator('input').fill('saffronprotocol'); await page.waitForFunction(() => document.querySelector('.search-excerpt')?.textContent?.includes('saffronprotocol')); assert.equal(await page.locator('.search-result').count(), 1);
  await page.locator('input').fill('<img src=x onerror=alert(1)>'); await page.locator('[data-search-results] .empty-title').waitFor(); assert.equal(await page.locator('[data-search-results] img').count(), 0);
  await page.goto(base + '/blog/site-test-0/', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('[data-toc-link]').count(), 3); assert.ok(await page.locator('.katex').count() > 0);
  await page.locator('.mermaid svg').waitFor({ timeout: 20000 });
  await page.locator('.code-copy').click(); assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'console.log("copy-test");');
  await screenshot(page, 'test-article-light');
  await page.locator('[data-share-qr]').click(); await page.locator('dialog[open] canvas').waitFor(); await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.locator('.article-body img').click(); await page.locator('dialog[open] .lightbox-image').waitFor(); await page.locator('[data-close-dialog]').click();
  await page.locator('.language-switch').click(); assert.equal(await page.locator('h1').textContent(), '临时验证文章 0'); assert.equal(await page.locator('.article-body').getAttribute('lang'), 'zh-CN'); assert.match(await page.locator('.back-link').innerText(), /Back to posts/);
  await page.locator('[data-theme-toggle]').click(); await page.locator('[data-theme-toggle]').click(); assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark'); await page.locator('.mermaid svg').waitFor();
  await screenshot(page, 'test-article-dark-en');
  for (const width of [320, 390]) { await page.setViewportSize({ width, height: 844 }); await page.reload({ waitUntil: 'networkidle' }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Article overflow at ${width}px`); if (width === 390) await screenshot(page, 'test-article-mobile'); }
  await page.goto(base + '/search/'); await page.route('**/search-index.json', route => route.abort()); await page.locator('input').fill('saffronprotocol'); await page.waitForFunction(() => document.querySelector('[data-search-status]')?.textContent?.includes('暂时无法加载')); await page.unroute('**/search-index.json'); await page.locator('form button').click(); await page.locator('.search-result').waitFor();
  assert.deepEqual(errors, [], 'Unexpected article or search browser errors');
  await context.close(); await checkInternalLinks();
  log('PASS 13 published posts, draft/future exclusion, RSS, pagination, tags with collisions, archives, collections, Chinese/English full-text search, search recovery and safe query rendering');
  log('PASS TOC, KaTeX, Mermaid in both themes, clipboard, QR dialog, image lightbox, article locale, mobile layout');
}
async function walineTests() {
  const configPath = resolve('src/data/site.json');
  const original = await readFile(configPath, 'utf8');
  const config = JSON.parse(original);
  config.walineServer = 'https://comments.invalid';
  try {
    await writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
    await build('waline-mock');
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const requests = [];
    await context.route('https://comments.invalid/**', async route => {
      const request = route.request(); requests.push({ url: request.url(), method: request.method(), body: request.postData() });
      const address = new URL(request.url());
      const data = address.pathname.endsWith('/article') ? [{ time: 7 }] : address.searchParams.get('type') === 'count' ? [0] : { count: 0, page: 1, pageSize: 10, data: [], totalPages: 0 };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ errno: 0, errmsg: '', data }) });
    });
    const page = await context.newPage();
    await page.goto(base + '/blog/site-test-0/', { waitUntil: 'networkidle' });
    await page.locator('#comments').scrollIntoViewIfNeeded();
    await page.locator('#comments textarea').waitFor({ timeout: 20000 });
    assert.equal(await page.locator('.waline-pageview-count').textContent(), '7');
    assert.ok(requests.some(item => item.method === 'POST' && item.url.includes('/api/article')));
    const paths = requests.filter(item => item.url.includes('/api/comment?path=')).map(item => new URL(item.url).searchParams.get('path'));
    assert.ok(paths.includes('/blog/site-test-0/'));
    await page.goto(base + '/en/blog/site-test-0/'); await page.locator('#comments').scrollIntoViewIfNeeded(); await page.locator('#comments textarea').waitFor();
    assert.equal(await page.locator('#comments').getAttribute('data-waline-path'), '/blog/site-test-0/');
    await context.close();
    const failedContext = await browser.newContext(); await failedContext.route('https://comments.invalid/**', route => route.abort());
    const failedPage = await failedContext.newPage(); await failedPage.goto(base + '/about/'); await failedPage.locator('#comments').scrollIntoViewIfNeeded();
    await failedPage.waitForFunction(() => document.querySelector('.comment-status')?.textContent?.includes('暂时无法加载'));
    assert.equal(await failedPage.locator('[data-load-comments]').isEnabled(), true);
    await failedContext.close();
    log('PASS Waline mocked service: anonymous editor, real counter API wiring, shared bilingual comment path, unavailable-service recovery');
  } finally { await writeFile(configPath, original); }
}
async function writingTests() {
  const index = await (await fetch(base + '/search-index.json')).json();
  const mdxPost = index.find(post => post.slug === 'site-test-12');
  assert.ok(mdxPost.body.includes('日常文章继续使用'));
  assert.ok(!mdxPost.body.includes('not-part-of-search-index'));
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
  let githubRequests = 0; let videoRequests = 0;
  await context.route('https://api.github.com/repos/VYS3N/VYS3N.github.io', async route => {
    githubRequests++;
    await route.fulfill({ status: githubRequests === 1 ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ description: '<img src=x onerror=alert(1)>', language: 'Astro', stargazers_count: 12, forks_count: 3, license: { spdx_id: 'MIT' } }) });
  });
  await context.route('https://www.youtube-nocookie.com/**', async route => { videoRequests++; await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Test player</title>' }); });
  await page.goto(base + '/blog/site-test-12/', { waitUntil: 'networkidle' });
  const mainTabs = page.getByRole('tablist', { name: '操作系统' });
  await mainTabs.getByRole('tab', { name: 'Windows', exact: true }).click();
  await page.keyboard.press('ArrowRight'); assert.equal(await mainTabs.getByRole('tab', { name: 'macOS / Linux' }).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home'); assert.equal(await mainTabs.getByRole('tab', { name: 'Windows', exact: true }).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End'); assert.equal(await mainTabs.getByRole('tab', { name: 'macOS / Linux' }).getAttribute('aria-selected'), 'true');
  assert.equal(await page.getByRole('tablist', { name: '同步页签测试' }).getByRole('tab', { name: 'macOS / Linux' }).getAttribute('aria-selected'), 'true');
  await page.getByRole('tablist', { name: '内层测试' }).getByRole('tab', { name: '内层二' }).click();
  assert.equal(await page.getByRole('tablist', { name: '外层测试' }).getByRole('tab', { name: '外层一' }).getAttribute('aria-selected'), 'true');
  await page.locator('summary').filter({ hasText: '查看答案' }).click(); assert.equal(await page.locator('.writing-spoiler').evaluate(element => element.open), true);
  await page.evaluate(() => { location.hash = 'hidden-anchor-target'; }); await page.locator('#hidden-anchor-target').waitFor({ state: 'visible' });
  assert.equal(await page.getByRole('tab', { name: '隐藏锚点页签' }).getAttribute('aria-selected'), 'true');
  const github = page.locator('[data-github-card]'); await github.scrollIntoViewIfNeeded(); await github.locator('[data-github-retry]').waitFor(); await github.locator('[data-github-retry]').click();
  await github.locator('[data-github-meta]:not([hidden])').waitFor(); assert.equal(await github.locator('[data-github-stars]').textContent(), '12');
  assert.equal(await github.locator('[data-github-license]').textContent(), 'MIT');
  assert.equal(await github.locator('[data-github-description] img').count(), 0); assert.match(await github.locator('[data-github-description]').textContent(), /<img/);
  await page.locator('[data-image-gallery] img').first().click(); await page.locator('dialog[open] .lightbox-image').waitFor();
  await page.keyboard.press('ArrowRight'); assert.equal(await page.locator('.lightbox-image').getAttribute('alt'), '网站标识示例二');
  await page.locator('[data-gallery-previous]').click(); assert.equal(await page.locator('.lightbox-image').getAttribute('alt'), '网站标识示例一'); await page.keyboard.press('Escape');
  await page.locator('[data-writing-qr]').scrollIntoViewIfNeeded(); await page.locator('[data-writing-qr] canvas').waitFor();
  assert.equal(videoRequests, 0); await page.locator('[data-load-video]').click(); await page.locator('iframe').waitFor(); await page.waitForFunction(() => !!document.querySelector('iframe')?.contentWindow);
  assert.ok(await page.locator('iframe').getAttribute('src').then(value => value.startsWith('https://www.youtube-nocookie.com/')));
  assert.equal(await page.locator('.writing-video-source a').count(), 1);
  await page.locator('.mermaid svg').waitFor(); assert.ok(await page.locator('.katex').count() > 0);
  await page.locator('h1').scrollIntoViewIfNeeded(); await screenshot(page, 'writing-components-light');
  await page.screenshot({ path: join(snapshots, 'writing-components-desktop-preview.png'), fullPage: false });
  await page.locator('.language-switch').click(); assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.equal(await page.locator('.article-body').getAttribute('lang'), 'zh-CN'); await page.getByRole('tablist', { name: '操作系统' }).waitFor(); assert.equal(await page.getByRole('tablist', { name: '操作系统' }).count(), 1);
  assert.equal(await page.getByRole('tablist', { name: '操作系统' }).getByRole('tab', { name: 'macOS / Linux' }).getAttribute('aria-selected'), 'true');
  assert.equal(await page.getByRole('button', { name: 'Load video', exact: true }).count(), 1);
  await page.locator('[data-theme-toggle]').click(); await page.locator('[data-theme-toggle]').click(); await page.locator('.mermaid svg').waitFor();
  await screenshot(page, 'writing-components-dark');
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 }); await page.reload({ waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, elements: [...document.querySelectorAll('main *')].filter(element => element.getBoundingClientRect().right > innerWidth).slice(0, 12).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent?.slice(0, 70), right: element.getBoundingClientRect().right })) }));
    if (overflow.document > overflow.width) await screenshot(page, 'writing-components-overflow');
    assert.ok(overflow.document <= overflow.width, `Writing component overflow at ${width}px: ${JSON.stringify(overflow)}`);
    if (width === 390) { await screenshot(page, 'writing-components-mobile'); await page.screenshot({ path: join(snapshots, 'writing-components-mobile-preview.png'), fullPage: false }); }
  }
  assert.deepEqual(errors, [], 'Unexpected writing component browser errors'); await context.close();
  const noScript = await browser.newContext({ javaScriptEnabled: false }); const plainPage = await noScript.newPage(); await plainPage.goto(base + '/blog/site-test-12/');
  assert.equal(await plainPage.locator('[data-tabs-nav]:visible').count(), 0);
  assert.ok(await plainPage.locator('[data-tab-title]:visible').count() >= 4);
  await plainPage.locator('.writing-spoiler>summary').click(); assert.equal(await plainPage.locator('.writing-spoiler').evaluate(element => element.open), true);
  assert.equal(await plainPage.locator('[data-github-card] a').count(), 1); assert.match(await plainPage.locator('[data-writing-qr]').textContent(), /https:\/\/vys3n.github.io/);
  await noScript.close();
  log('PASS MDX render and search, accessible/nested/synchronized/persisted tabs, anchor reveal, native disclosures, real repository API wiring with failure/retry, safe metadata rendering and license, gallery navigation, inline QR, click-to-load video, math/diagrams, bilingual UI, light/dark/mobile and no-script fallback');
}
async function writingCliTests() {
  const name = resolve('src/content/posts/site-test-cli.mdx');
  try { await access(name); throw new Error('CLI test file already exists.'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const run = args => new Promise((accept, reject) => {
    const child = spawn(process.execPath, ['scripts/new-post.mjs', '临时 CLI 验证', '--slug', 'site-test-cli', ...args], { cwd: project, windowsHide: true, stdio: 'ignore' });
    child.once('error', reject); child.once('exit', code => accept(code));
  });
  assert.equal(await run(['--mdx']), 0); testNames.push(name);
  const original = await readFile(name, 'utf8'); assert.match(original, /draft: true/); assert.match(original, /\{\/\* 写好正文/);
  assert.equal(await run([]), 1); assert.equal(await readFile(name, 'utf8'), original);
  assert.equal((await readdir(resolve('src/content/posts'))).includes('site-test-cli.md'), false);
  log('PASS MDX draft CLI and cross-format slug collision protection');
}
let failure;
try {
  await build('empty'); await serve(); browser = await chromium.launch({ executablePath: await chooseBrowser(), headless: true });
  await basicTests(); await checkInternalLinks();
  if (!process.env.SITE_SKIP_FIXTURES) { await writingCliTests(); await addFixtures(); await build('fixtures'); await articleTests(); await writingTests(); await walineTests(); }
} catch (error) { failure = error; console.error(error); }
finally {
  if (browser) await browser.close(); if (server) await new Promise(accept => server.close(accept));
  for (const name of testNames) await unlink(name);
  if (testNames.length) { try { await build('restored'); } catch (error) { failure ||= error; console.error(error); } }
  await writeFile(join(scratch, 'report.json'), JSON.stringify({ passed: !failure, checks: report, error: failure?.message || null, screenshots: snapshots, fixtureFilesRemoved: testNames.length }, null, 2));
}
if (failure) process.exitCode = 1;
else log('ALL CHECKS PASSED. Temporary content removed; production build restored.');
