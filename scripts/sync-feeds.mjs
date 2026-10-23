import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);

const config = JSON.parse(await readFile(new URL('../src/data/site.json', import.meta.url), 'utf8'));
const friends = JSON.parse(await readFile(new URL('../src/data/friends.json', import.meta.url), 'utf8'));
const generated = new URL('../src/generated/', import.meta.url);
await mkdir(generated, { recursive: true });
const parser = new XMLParser({ ignoreAttributes: false, processEntities: false });
const arr = value => value == null ? [] : Array.isArray(value) ? value : [value];
const asText = value => typeof value === 'string' ? value : typeof value === 'number' ? String(value) : value?.['#text'] || '';
function publicUrl(raw, base) {
  try {
    const u = new URL(raw, base);
    const host = u.hostname.replace(/^\[|\]$/g, '').toLowerCase();
    if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password || !host.includes('.') || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) || host.includes(':')) return null;
    return u.href;
  } catch { return null; }
}
async function fetchText(address) {
  // Windows web requests honor the system network configuration used by the browser.
  if (process.platform === 'win32') {
    const quotedAddress = address.replaceAll("'", "''");
    const command = `$ErrorActionPreference='Stop'; [Console]::OutputEncoding=[Text.UTF8Encoding]::new(); $response=Invoke-WebRequest -UseBasicParsing -Uri '${quotedAddress}' -TimeoutSec 12 -MaximumRedirection 0; [Console]::Out.Write($response.Content)`;
    const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { windowsHide: true, timeout: 16000, maxBuffer: 6_000_000 });
    if (stdout.length > 5_000_000) throw new Error('Response is too large');
    return stdout;
  }
  const response = await fetch(address, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'VYS3N-Personal-Site/1.0' }, redirect: 'error' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  if (text.length > 5_000_000) throw new Error('Response is too large');
  return text;
}
async function syncGithub() {
  let data = { available: false, user: config.github, days: [], total: 0, fetchedAt: new Date().toISOString() };
  if (config.github && /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(config.github)) {
    try {
      const html = await fetchText(`https://github.com/users/${config.github}/contributions`);
      const counts = new Map();
      for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
        const id = /\bfor="([^"]+)"/.exec(match[1])?.[1];
        const count = /([\d,]+) contributions?/.exec(match[2]);
        if (id) counts.set(id, count ? Number(count[1].replaceAll(',', '')) : 0);
      }
      const days = [...html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)].map(match => {
        const attrs = match[1];
        const id = /\bid="([^"]+)"/.exec(attrs)?.[1];
        return { date: /\bdata-date="([^"]+)"/.exec(attrs)?.[1], level: Number(/\bdata-level="(\d)"/.exec(attrs)?.[1] || 0), count: counts.get(id) ?? null };
      }).filter(day => day.date).sort((a, b) => a.date.localeCompare(b.date));
      if (!days.length) throw new Error('No contribution cells found');
      data = { ...data, available: true, days, total: days.reduce((sum, day) => sum + (day.count || 0), 0) };
      console.log(`GitHub: loaded ${days.length} real contribution days.`);
    } catch (error) { console.log(`GitHub activity unavailable (${error.message}); showing a link instead.`); }
  }
  await writeFile(new URL('github.json', generated), JSON.stringify(data));
}
async function syncFriends() {
  const results = await Promise.allSettled(friends.filter(friend => friend.rss && publicUrl(friend.rss)).slice(0, 40).map(async friend => {
    const parsed = parser.parse(await fetchText(friend.rss));
    const entries = arr(parsed.rss?.channel?.item || parsed.feed?.entry);
    return entries.slice(0, 5).map(item => {
      const link = typeof item.link === 'string' ? item.link : arr(item.link).find(link => !link['@_rel'] || link['@_rel'] === 'alternate')?.['@_href'];
      const address = publicUrl(link, friend.url);
      const title = asText(item.title).replace(/<[^>]+>/g, '').trim();
      const parsedDate = new Date(asText(item.pubDate || item.published || item.updated));
      return address && title ? { title, url: address, author: friend.name, date: Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString() } : null;
    }).filter(Boolean);
  }));
  const items = results.flatMap(result => result.status === 'fulfilled' ? result.value : []).sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 24);
  const unique = [...new Map(items.map(item => [item.url, item])).values()];
  await writeFile(new URL('friends.json', generated), JSON.stringify({ items: unique, fetchedAt: new Date().toISOString(), failed: results.filter(result => result.status === 'rejected').length }));
  console.log(`Friend feeds: ${unique.length} posts from ${results.length} configured feeds.`);
}
await Promise.all([syncGithub(), syncFriends()]);
