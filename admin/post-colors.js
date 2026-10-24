(() => {
  const hash = value => {
    let result = 2166136261;
    for (const character of value) {
      result ^= character.codePointAt(0);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  };

  const applyPlaceholderColors = () => {
    for (const cell of document.querySelectorAll('#entry-list [role="row"][aria-label] .grid-cell.image')) {
      const row = cell.closest('[role="row"]');
      const isEmpty = cell.childElementCount === 0;
      if (!row || !isEmpty) {
        cell.classList.remove('vys3n-post-placeholder');
        continue;
      }
      const label = row.getAttribute('aria-label') || 'article';
      cell.style.setProperty('--vys3n-post-hue', String(hash(label) % 360));
      cell.classList.add('vys3n-post-placeholder');
    }
  };

  const start = () => {
    if (!document.body) return;
    applyPlaceholderColors();
    new MutationObserver(applyPlaceholderColors).observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
