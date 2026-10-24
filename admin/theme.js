(() => {
  const root = document.documentElement;
  const key = 'vys3n-theme';
  const prefsKey = 'sveltia-cms.prefs';
  const valid = value => ['light', 'dark', 'system'].includes(value);
  let preference = 'light';
  try {
    const storedPrefs = JSON.parse(localStorage.getItem(prefsKey) || '{}');
    const prefs = storedPrefs && typeof storedPrefs === 'object' && !Array.isArray(storedPrefs) ? storedPrefs : {};
    const saved = localStorage.getItem(key);
    const native = prefs.theme === 'auto' ? 'system' : prefs.theme;
    preference = valid(saved) ? saved : valid(native) ? native : 'light';
    // Change only the theme setting; preserve tokens, drafts and other CMS preferences.
    prefs.theme = preference === 'system' ? 'auto' : preference;
    localStorage.setItem(prefsKey, JSON.stringify(prefs));
  } catch { /* Themes also work when browser storage is unavailable. */ }

  root.dataset.autoTheming = String(preference === 'system');
  root.dataset.theme = preference === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preference;

  const sync = () => {
    const effective = root.dataset.theme === 'dark' ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = effective === 'dark' ? '#18191c' : '#FFFFFF';
    try { localStorage.setItem(key, root.dataset.autoTheming === 'true' ? 'system' : effective); }
    catch { /* Storage is optional. */ }
  };
  sync();
  new MutationObserver(sync).observe(root, {
    attributes: true, attributeFilter: ['data-theme', 'data-auto-theming'],
  });
})();
