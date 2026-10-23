const uiLang = document.documentElement.dataset.uiLang === 'en' ? 'en' : 'zh';
const syncedTabGroups = new Map<string, ((label: string) => void)[]>();

document.querySelectorAll<HTMLElement>('[data-writing-tabs]').forEach((root, groupIndex) => {
  const nav = root.querySelector<HTMLElement>(':scope > [data-tabs-nav]');
  const panels = [...root.querySelectorAll<HTMLElement>(':scope > .writing-tab-panels > [data-tab-panel]')];
  if (!nav || !panels.length) return;
  const prefix = `writing-tabs-${groupIndex}`;
  const syncKey = root.dataset.syncKey;
  const controls = panels.map((panel, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.id = `${prefix}-tab-${index}`; button.textContent = panel.dataset.tabLabel || String(index + 1);
    button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', `${prefix}-panel-${index}`);
    panel.id = `${prefix}-panel-${index}`; panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', button.id); panel.tabIndex = 0;
    const title = panel.querySelector<HTMLElement>(':scope > [data-tab-title]'); if (title) title.hidden = true;
    return button;
  });
  function select(index: number, focus = false, sync = true) {
    controls.forEach((button, ownIndex) => { const selected = ownIndex === index; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; panels[ownIndex].hidden = !selected; });
    if (focus) controls[index].focus();
    if (sync && syncKey) {
      const label = panels[index].dataset.tabLabel || '';
      try { localStorage.setItem(`vys3n-tabs:${syncKey}`, label); } catch { /* Synchronization still works when browser storage is blocked. */ }
      syncedTabGroups.get(syncKey)?.forEach(update => update(label));
    }
  }
  controls.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % controls.length : event.key === 'ArrowLeft' ? (index + controls.length - 1) % controls.length : event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : -1;
      if (next >= 0) { event.preventDefault(); select(next, true); }
    });
  });
  nav.setAttribute('role', 'tablist'); nav.append(...controls); nav.hidden = false;
  let initial = Number(root.dataset.defaultTab);
  if (syncKey) {
    try { const saved = localStorage.getItem(`vys3n-tabs:${syncKey}`); const savedIndex = panels.findIndex(panel => panel.dataset.tabLabel === saved); if (savedIndex >= 0) initial = savedIndex; } catch { /* Stored tab preference is optional. */ }
    const update = (label: string) => { const index = panels.findIndex(panel => panel.dataset.tabLabel === label); if (index >= 0) select(index, false, false); };
    syncedTabGroups.set(syncKey, [...(syncedTabGroups.get(syncKey) || []), update]);
  }
  select(Number.isFinite(initial) ? Math.min(panels.length - 1, Math.max(0, initial)) : 0, false, false);
});

function revealAnchor(hash: string) {
  if (!hash || hash === '#') return;
  let target: HTMLElement | null;
  try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
  if (!target) return;
  let ancestor = target.parentElement;
  while (ancestor) {
    if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
    if (ancestor.matches('[data-tab-panel][hidden]')) {
      const controlId = ancestor.getAttribute('aria-labelledby');
      if (controlId) document.getElementById(controlId)?.click();
    }
    ancestor = ancestor.parentElement;
  }
  requestAnimationFrame(() => target?.scrollIntoView({ behavior: 'instant', block: 'start' }));
}
if (location.hash) revealAnchor(location.hash);
window.addEventListener('hashchange', () => revealAnchor(location.hash));
document.addEventListener('click', event => {
  const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
  if (anchor && anchor.origin === location.origin && anchor.pathname === location.pathname && anchor.hash === location.hash) revealAnchor(anchor.hash);
});

function whenVisible(element: HTMLElement, run: () => void) {
  if (!('IntersectionObserver' in window)) { run(); return; }
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); run(); } }, { rootMargin: '200px' });
  observer.observe(element);
}

interface RepoData { description: string | null; language: string | null; stargazers_count: number; forks_count: number; license?: { spdx_id?: string } | null; }
const githubRequests = new Map<string, Promise<RepoData>>();
function repositoryData(repo: string) {
  if (!githubRequests.has(repo)) {
    const request = fetch(`https://api.github.com/repos/${repo}`, { signal: AbortSignal.timeout(8000), headers: { Accept: 'application/vnd.github+json' } }).then(async response => {
      if (!response.ok) throw new Error('Repository metadata unavailable');
      const data = await response.json();
      if (typeof data.stargazers_count !== 'number' || typeof data.forks_count !== 'number') throw new Error('Invalid repository metadata');
      return data as RepoData;
    });
    githubRequests.set(repo, request);
  }
  return githubRequests.get(repo)!;
}
document.querySelectorAll<HTMLElement>('[data-github-card]').forEach(card => {
  const status = card.querySelector<HTMLElement>('[data-github-status]')!;
  const retry = card.querySelector<HTMLButtonElement>('[data-github-retry]')!;
  const repo = card.dataset.repository!;
  let loading = false;
  async function load() {
    if (loading) return;
    loading = true; retry.hidden = true; status.textContent = uiLang === 'zh' ? '正在读取公开仓库信息…' : 'Loading public repository details…';
    try {
      const data = await repositoryData(repo);
      const description = card.querySelector<HTMLElement>('[data-github-description]')!;
      if (description.dataset.customDescription !== 'true') { description.textContent = typeof data.description === 'string' ? data.description : ''; description.hidden = !description.textContent; }
      const language = card.querySelector<HTMLElement>('[data-github-language]')!; language.textContent = typeof data.language === 'string' ? data.language : ''; language.hidden = !language.textContent;
      const license = card.querySelector<HTMLElement>('[data-github-license]')!; const licenseId = data.license?.spdx_id;
      license.textContent = typeof licenseId === 'string' && licenseId !== 'NOASSERTION' ? licenseId : ''; license.hidden = !license.textContent;
      const stars = card.querySelector<HTMLElement>('[data-github-stars]')!; stars.textContent = data.stargazers_count.toLocaleString(); stars.parentElement?.setAttribute('aria-label', `${stars.textContent} ${uiLang === 'zh' ? '个 Star' : 'stars'}`);
      const forks = card.querySelector<HTMLElement>('[data-github-forks]')!; forks.textContent = data.forks_count.toLocaleString(); forks.parentElement?.setAttribute('aria-label', `${forks.textContent} ${uiLang === 'zh' ? '个 Fork' : 'forks'}`);
      card.querySelector<HTMLElement>('[data-github-meta]')!.hidden = false; status.textContent = '';
    } catch {
      githubRequests.delete(repo);
      status.textContent = uiLang === 'zh' ? '仓库信息暂不可用，仍可通过链接访问。' : 'Repository details are unavailable. The link still works.';
      retry.hidden = false;
    } finally { loading = false; }
  }
  retry.addEventListener('click', () => void load()); whenVisible(card, () => void load());
});

document.querySelectorAll<HTMLElement>('[data-video-embed]').forEach(root => {
  root.querySelector<HTMLButtonElement>('[data-load-video]')?.addEventListener('click', () => {
    const address = new URL(root.dataset.videoSrc!);
    if (!['www.youtube-nocookie.com', 'player.bilibili.com'].includes(address.hostname) || address.protocol !== 'https:') return;
    const iframe = document.createElement('iframe'); iframe.src = address.href; iframe.title = root.dataset.videoTitle || 'Video'; iframe.allowFullscreen = true;
    iframe.allow = 'fullscreen; picture-in-picture; encrypted-media'; iframe.referrerPolicy = 'strict-origin-when-cross-origin'; iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    root.replaceChildren(iframe); iframe.focus();
  });
});

document.querySelectorAll<HTMLElement>('[data-writing-qr]').forEach(root => {
  const status = root.querySelector<HTMLElement>('[data-qr-status]')!;
  const retry = root.querySelector<HTMLButtonElement>('[data-qr-retry]')!;
  let loading = false;
  async function load() {
    if (loading) return;
    loading = true; retry.hidden = true;
    try {
      const QRCode = await import('qrcode'); const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, root.dataset.qrValue || '', { width: Number(root.dataset.qrSize) || 200, margin: 3, color: { dark: '#20252e', light: '#ffffff' } });
      canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', `${uiLang === 'zh' ? '二维码' : 'QR code'}: ${root.dataset.qrValue}`);
      root.querySelector<HTMLElement>('[data-qr-mount]')!.replaceChildren(canvas); status.textContent = '';
    } catch { status.textContent = uiLang === 'zh' ? '二维码生成失败，请重试。' : 'Could not generate the QR code.'; retry.hidden = false; }
    finally { loading = false; }
  }
  retry.addEventListener('click', () => void load()); whenVisible(root, () => void load());
});
