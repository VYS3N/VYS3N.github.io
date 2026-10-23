import './comments';

const html = document.documentElement;
const lang = html.dataset.uiLang === 'en' ? 'en' : 'zh';
const toast = document.querySelector<HTMLElement>('[data-toast]');
let toastTimer: ReturnType<typeof setTimeout>;
function notify(message: string) {
  if (!toast) return;
  clearTimeout(toastTimer); toast.textContent = message; toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2500);
}
async function copy(text: string, success?: string, failure?: string) {
  try {
    if (navigator.clipboard) await navigator.clipboard.writeText(text);
    else {
      const active = document.activeElement as HTMLElement;
      const textarea = document.createElement('textarea'); textarea.value = text; textarea.className = 'clipboard-fallback'; document.body.append(textarea); textarea.select();
      const result = document.execCommand('copy'); textarea.remove(); active?.focus(); if (!result) throw new Error('Copy failed');
    }
    notify(success || (lang === 'zh' ? '已复制' : 'Copied'));
    return true;
  } catch { notify(failure || (lang === 'zh' ? '复制失败，请手动复制。' : 'Could not copy. Please copy manually.')); return false; }
}
const themeButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const colorScheme = matchMedia('(prefers-color-scheme: dark)');
function updateTheme(preference: string, save = false) {
  const effective = preference === 'system' ? (colorScheme.matches ? 'dark' : 'light') : preference;
  html.dataset.theme = effective; html.dataset.themePreference = preference;
  if (save) try { localStorage.setItem('vys3n-theme', preference); } catch { /* Browser storage is optional. */ }
  if (themeButton) {
    const current = themeButton.dataset[preference] || themeButton.dataset.system;
    const label = `${themeButton.dataset.label}: ${current}`;
    themeButton.setAttribute('aria-label', label); themeButton.title = label;
  }
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', effective === 'dark' ? '#18191c' : '#fafafa');
  window.dispatchEvent(new Event('vys3n:themechange'));
}
updateTheme(html.dataset.themePreference || 'system');
themeButton?.addEventListener('click', () => { const modes = ['system', 'light', 'dark']; updateTheme(modes[(modes.indexOf(html.dataset.themePreference || 'system') + 1) % modes.length], true); });
colorScheme.addEventListener('change', () => { if (html.dataset.themePreference === 'system') updateTheme('system'); });
const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');
function closeMenu() { if (mobileNav) mobileNav.hidden = true; menuButton?.setAttribute('aria-expanded', 'false'); }
menuButton?.addEventListener('click', () => { if (!mobileNav) return; mobileNav.hidden = !mobileNav.hidden; menuButton.setAttribute('aria-expanded', String(!mobileNav.hidden)); });
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  const target = event.target as Element;
  if (!target.closest('.site-header')) closeMenu();
  document.querySelectorAll<HTMLDetailsElement>('.nav-dropdown[open]').forEach(dropdown => { if (!dropdown.contains(target)) dropdown.open = false; });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeMenu(); document.querySelectorAll<HTMLDetailsElement>('.nav-dropdown[open]').forEach(dropdown => { dropdown.open = false; }); }
  if ((event.metaKey || event.ctrlKey) && event.key === 'k' && !/input|textarea/i.test((event.target as HTMLElement).tagName)) { event.preventDefault(); location.href = `${lang === 'en' ? '/en' : ''}/search/`; }
});
const topButton = document.querySelector<HTMLButtonElement>('[data-back-top]');
const firstHeading = document.querySelector('h1');
if (topButton && firstHeading && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => { topButton.hidden = entries[0].isIntersecting || entries[0].boundingClientRect.top >= 0; }).observe(firstHeading);
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
}
const daysElement = document.querySelector<HTMLElement>('[data-days-online]');
if (daysElement?.dataset.startDate) { const days = Math.max(1, Math.floor((Date.now() - new Date(daysElement.dataset.startDate + 'T00:00:00+08:00').getTime()) / 86400000) + 1); daysElement.textContent = days.toLocaleString(); }
document.querySelectorAll<HTMLElement>('[data-copy-site]').forEach(button => button.addEventListener('click', () => void copy(button.dataset.copyValue || '', button.dataset.copied)));
document.querySelectorAll<HTMLElement>('[data-copy-link]').forEach(button => button.addEventListener('click', () => void copy(location.origin + location.pathname, button.dataset.copied, button.dataset.copyFailed)));
const dialog = document.querySelector<HTMLDialogElement>('[data-media-dialog]');
const dialogContent = dialog?.querySelector<HTMLElement>('[data-dialog-content]');
dialog?.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
let lightboxImages: HTMLImageElement[] = [];
let lightboxIndex = 0;
function showLightboxImage(index: number) {
  if (!dialog || !dialogContent || !lightboxImages.length) return;
  lightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
  const original = lightboxImages[lightboxIndex];
  const full = document.createElement('img'); full.src = original.currentSrc || original.src; full.alt = original.alt; full.className = 'lightbox-image';
  const figure = document.createElement('figure'); figure.className = 'lightbox-gallery'; figure.append(full);
  const captionText = original.closest('figure')?.querySelector('figcaption')?.textContent || original.alt;
  if (captionText) { const caption = document.createElement('figcaption'); caption.textContent = captionText; figure.append(caption); }
  if (lightboxImages.length > 1) {
    const navigation = document.createElement('div'); navigation.className = 'lightbox-navigation';
    const previous = document.createElement('button'); previous.type = 'button'; previous.textContent = lang === 'zh' ? '上一张' : 'Previous'; previous.dataset.galleryPrevious = '';
    const next = document.createElement('button'); next.type = 'button'; next.textContent = lang === 'zh' ? '下一张' : 'Next'; next.dataset.galleryNext = '';
    const position = document.createElement('span'); position.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`; position.setAttribute('role', 'status');
    previous.addEventListener('click', () => { showLightboxImage(lightboxIndex - 1); dialogContent.querySelector<HTMLButtonElement>('[data-gallery-previous]')?.focus(); });
    next.addEventListener('click', () => { showLightboxImage(lightboxIndex + 1); dialogContent.querySelector<HTMLButtonElement>('[data-gallery-next]')?.focus(); });
    navigation.append(previous, position, next); figure.append(navigation);
  }
  dialogContent.replaceChildren(figure);
}
dialog?.addEventListener('close', () => { dialogContent?.replaceChildren(); lightboxImages = []; });
dialog?.addEventListener('keydown', event => {
  if (lightboxImages.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault(); showLightboxImage(lightboxIndex + (event.key === 'ArrowRight' ? 1 : -1)); dialog.querySelector<HTMLButtonElement>('[data-close-dialog]')?.focus();
});
document.querySelectorAll<HTMLElement>('[data-share-qr]').forEach(button => button.addEventListener('click', async () => {
  if (!dialog || !dialogContent) return;
  try {
    button.setAttribute('aria-busy', 'true');
    const QRCode = await import('qrcode'); const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, location.origin + location.pathname, { width: 264, margin: 3, color: { dark: '#20252e', light: '#ffffff' } });
    const hint = document.createElement('p'); hint.textContent = button.dataset.qrHint || '';
    const box = document.createElement('div'); box.className = 'qr-content'; box.append(canvas, hint); dialogContent.replaceChildren(box); dialog.showModal();
  } catch { notify(lang === 'zh' ? '暂时无法生成二维码。' : 'Could not create a QR code.'); }
  finally { button.removeAttribute('aria-busy'); }
}));
const articleBody = document.querySelector<HTMLElement>('[data-article-body]');
if (articleBody) {
  articleBody.querySelectorAll<HTMLPreElement>('pre').forEach(pre => {
    if (pre.dataset.language === 'mermaid' || pre.querySelector('code.language-mermaid')) return;
    const code = pre.querySelector('code'); if (!code) return;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'code-copy'; button.textContent = lang === 'zh' ? '复制代码' : 'Copy code'; button.setAttribute('aria-label', button.textContent);
    button.addEventListener('click', async () => { const copied = await copy(code.textContent || '', articleBody.dataset.copied, articleBody.dataset.copyFailed); if (copied) { button.textContent = articleBody.dataset.copied || 'Copied'; setTimeout(() => { button.textContent = lang === 'zh' ? '复制代码' : 'Copy code'; }, 1800); } });
    pre.append(button);
  });
  articleBody.querySelectorAll<HTMLImageElement>('img').forEach(image => {
    if (image.closest('a,[data-video-embed],.writing-card')) return;
    image.tabIndex = 0; image.setAttribute('role', 'button'); image.setAttribute('aria-label', `${articleBody.dataset.imageLabel}: ${image.alt}`); image.classList.add('zoomable');
    const openImage = () => {
      if (!dialog || !dialogContent) return;
      const group = image.closest('[data-image-gallery]');
      lightboxImages = group ? [...group.querySelectorAll<HTMLImageElement>('img')] : [image];
      showLightboxImage(lightboxImages.indexOf(image)); dialog.showModal();
    };
    image.addEventListener('click', openImage); image.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openImage(); } });
  });
  const diagramNodes: HTMLElement[] = [];
  articleBody.querySelectorAll<HTMLPreElement>('pre[data-language="mermaid"], pre:has(code.language-mermaid)').forEach(pre => {
    const source = pre.querySelector('code')?.textContent || ''; const diagram = document.createElement('div'); diagram.className = 'mermaid'; diagram.dataset.source = source; diagram.textContent = source; pre.replaceWith(diagram); diagramNodes.push(diagram);
  });
  if (diagramNodes.length) {
    let renderVersion = 0;
    const renderDiagrams = async () => {
      const ownVersion = ++renderVersion;
      try {
        const { default: mermaid } = await import('mermaid'); if (ownVersion !== renderVersion) return;
        mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: html.dataset.theme === 'dark' ? 'dark' : 'neutral' });
        for (const node of diagramNodes) { node.removeAttribute('data-processed'); node.textContent = node.dataset.source || ''; }
        await mermaid.run({ nodes: diagramNodes, suppressErrors: true });
      } catch { for (const node of diagramNodes) { node.textContent = node.dataset.source || ''; node.classList.add('diagram-fallback'); } }
    };
    void renderDiagrams(); window.addEventListener('vys3n:themechange', () => void renderDiagrams());
  }
}
const tocLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
const headingToLink = new Map(tocLinks.map(link => [document.getElementById(decodeURIComponent(link.hash.slice(1))), link]));
if ('IntersectionObserver' in window && tocLinks.length) {
  const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { tocLinks.forEach(link => link.removeAttribute('aria-current')); headingToLink.get(entry.target as HTMLElement)?.setAttribute('aria-current', 'location'); } }, { rootMargin: '-80px 0px -65% 0px' });
  headingToLink.forEach((_, heading) => { if (heading) observer.observe(heading); });
  if (matchMedia('(max-width: 1000px)').matches) document.querySelector<HTMLDetailsElement>('.toc details')?.removeAttribute('open');
}
