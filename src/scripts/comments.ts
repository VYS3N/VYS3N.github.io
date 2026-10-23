const giscusOrigin = 'https://giscus.app';

document.querySelectorAll<HTMLElement>('[data-giscus-enabled="true"]').forEach(section => {
  const button = section.querySelector<HTMLButtonElement>('[data-load-comments]');
  const status = section.querySelector<HTMLElement>('.comment-status');
  const mount = section.querySelector<HTMLElement>('[data-comment-mount]');
  if (!button || !status || !mount) return;

  let loading = false;
  let initialized = false;
  let timeout: ReturnType<typeof setTimeout>;
  const frame = () => mount.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
  const theme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const syncTheme = () => frame()?.contentWindow?.postMessage({ giscus: { setConfig: { theme: theme() } } }, giscusOrigin);
  const ready = () => {
    clearTimeout(timeout);
    loading = false;
    initialized = true;
    button.hidden = true;
    button.disabled = false;
    status.textContent = '';
    mount.removeAttribute('aria-busy');
  };
  const fail = () => {
    clearTimeout(timeout);
    loading = false;
    initialized = false;
    button.hidden = false;
    button.disabled = false;
    button.textContent = section.dataset.retry || 'Retry';
    status.textContent = section.dataset.error || '';
    mount.removeAttribute('aria-busy');
  };

  window.addEventListener('message', event => {
    if (event.origin !== giscusOrigin || event.source !== frame()?.contentWindow) return;
    const message = event.data?.giscus;
    if (!message || typeof message !== 'object') return;
    if (typeof message.error === 'string') {
      // A discussion is created when the first comment or reaction is submitted.
      if (message.error.includes('Discussion not found')) ready();
      else if (!/Bad credentials|Invalid state value|State has expired/.test(message.error)) fail();
    } else if (typeof message.resizeHeight === 'number' && message.resizeHeight > 0) ready();
  });
  window.addEventListener('vys3n:themechange', syncTheme);

  function loadComments() {
    if (loading || initialized) return;
    loading = true;
    button!.disabled = true;
    status!.textContent = section.dataset.loading || '';
    mount!.setAttribute('aria-busy', 'true');
    section.querySelector('[data-giscus-loader]')?.remove();
    mount!.replaceChildren();

    const script = document.createElement('script');
    script.src = `${giscusOrigin}/client.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    Object.assign(script.dataset, {
      giscusLoader: '',
      repo: section.dataset.giscusRepo,
      repoId: section.dataset.giscusRepoId,
      category: section.dataset.giscusCategory,
      categoryId: section.dataset.giscusCategoryId,
      mapping: 'specific',
      term: section.dataset.giscusTerm,
      strict: '1',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'top',
      theme: theme(),
      lang: section.dataset.giscusLang,
    });
    script.addEventListener('error', fail, { once: true });
    script.addEventListener('load', () => {
      const iframe = frame();
      if (!iframe) { fail(); return; }
      iframe.title = section.dataset.title || 'Comments';
      iframe.addEventListener('load', syncTheme);
      syncTheme();
    }, { once: true });
    timeout = setTimeout(fail, 20000);
    section.querySelector('.comment-loader')!.append(script);
  }

  button.addEventListener('click', loadComments);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadComments(); }
    }, { rootMargin: '250px' });
    observer.observe(section);
  }
});
