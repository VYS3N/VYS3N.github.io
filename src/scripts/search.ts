import Fuse from 'fuse.js';
interface SearchPost { title: string; description: string; body: string; tags: string[]; category: string; slug: string; date: string; minutes: number; }
const root = document.querySelector<HTMLElement>('[data-search-root]');
if (root) {
  const input = root.querySelector<HTMLInputElement>('input')!;
  const form = root.querySelector<HTMLFormElement>('form')!;
  const status = root.querySelector<HTMLElement>('[data-search-status]')!;
  const results = root.querySelector<HTMLElement>('[data-search-results]')!;
  const lang = root.dataset.lang || 'zh';
  let indexPromise: Promise<SearchPost[]> | undefined;
  let generation = 0;
  let timer: ReturnType<typeof setTimeout>;
  const getIndex = () => indexPromise ||= fetch('/search-index.json', { signal: AbortSignal.timeout(12000) }).then(response => { if (!response.ok) throw new Error('Index unavailable'); return response.json() as Promise<SearchPost[]>; }).catch(error => { indexPromise = undefined; throw error; });
  function highlight(target: HTMLElement, text: string, query: string) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index < 0) { target.textContent = text; return; }
    target.append(document.createTextNode(text.slice(0, index)));
    const mark = document.createElement('mark'); mark.textContent = text.slice(index, index + query.length); target.append(mark, document.createTextNode(text.slice(index + query.length)));
  }
  async function search() {
    const ownGeneration = ++generation;
    const query = input.value.normalize('NFKC').trim().slice(0, 200);
    const address = new URL(location.href);
    if (query) address.searchParams.set('q', query); else address.searchParams.delete('q');
    history.replaceState(null, '', address);
    results.replaceChildren();
    if (!query) { status.textContent = ''; return; }
    status.textContent = root!.dataset.loading!;
    try {
      const index = await getIndex();
      if (ownGeneration !== generation) return;
      const fuse = new Fuse(index, { keys: [{ name: 'title', weight: 0.4 }, { name: 'description', weight: 0.2 }, { name: 'tags', weight: 0.2 }, { name: 'body', weight: 0.2 }], ignoreLocation: true, threshold: 0.3 });
      const hits = fuse.search(query, { limit: 40 });
      status.textContent = `${hits.length} ${root!.dataset.results}`;
      if (!hits.length) {
        const empty = document.createElement('div'); empty.className = 'empty-state compact';
        const heading = document.createElement('p'); heading.className = 'empty-title'; heading.textContent = root!.dataset.empty!;
        const detail = document.createElement('p'); detail.className = 'empty-detail'; detail.textContent = root!.dataset.emptyDetail!;
        empty.append(heading, detail); results.append(empty); return;
      }
      for (const { item } of hits) {
        const article = document.createElement('article'); article.className = 'search-result';
        const meta = document.createElement('p'); meta.className = 'post-meta';
        meta.textContent = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Shanghai' }).format(new Date(item.date)) + ` / ${item.minutes} ${root!.dataset.minRead}`;
        const heading = document.createElement('h2'); const link = document.createElement('a');
        link.href = `${lang === 'en' ? '/en' : ''}/blog/${encodeURIComponent(item.slug)}/`; highlight(link, item.title, query); heading.append(link);
        const excerpt = document.createElement('p'); excerpt.className = 'search-excerpt';
        const position = item.body.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, position - 50); const source = position >= 0 ? item.body : item.description || item.body;
        const snippet = (start > 0 ? '…' : '') + source.slice(start, start + 180) + (source.length > start + 180 ? '…' : '');
        highlight(excerpt, snippet, query);
        const tags = document.createElement('p'); tags.className = 'post-tags'; tags.textContent = item.tags.map(tag => '#' + tag).join('  ');
        article.append(meta, heading, excerpt, tags); results.append(article);
      }
    } catch { if (ownGeneration === generation) status.textContent = root!.dataset.error!; }
  }
  form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); void search(); });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => void search(), 160); });
  input.value = new URL(location.href).searchParams.get('q') || '';
  if (input.value) void search();
}
