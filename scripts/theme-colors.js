(() => {
  const root = document.documentElement;
  const storageKey = 'vys3n-accent';
  const defaultAccent = '#3b82f6';
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  function validHex(value) {
    return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value) ? value.toLowerCase() : null;
  }

  function channels(hex) {
    return [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16));
  }

  function toHex(values) {
    return `#${values.map(value => Math.round(Math.max(0, Math.min(255, value))).toString(16).padStart(2, '0')).join('')}`;
  }

  function toHsl(hex) {
    const [red, green, blue] = channels(hex).map(value => value / 255);
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;
    let hue = 0;
    let saturation = 0;
    if (max !== min) {
      const difference = max - min;
      saturation = lightness > 0.5 ? difference / (2 - max - min) : difference / (max + min);
      if (max === red) hue = (green - blue) / difference + (green < blue ? 6 : 0);
      else if (max === green) hue = (blue - red) / difference + 2;
      else hue = (red - green) / difference + 4;
      hue /= 6;
    }
    return [hue, saturation, lightness];
  }

  function fromHsl(hue, saturation, lightness) {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const segment = hue * 6;
    const secondary = chroma * (1 - Math.abs(segment % 2 - 1));
    let rgb;
    if (segment < 1) rgb = [chroma, secondary, 0];
    else if (segment < 2) rgb = [secondary, chroma, 0];
    else if (segment < 3) rgb = [0, chroma, secondary];
    else if (segment < 4) rgb = [0, secondary, chroma];
    else if (segment < 5) rgb = [secondary, 0, chroma];
    else rgb = [chroma, 0, secondary];
    const offset = lightness - chroma / 2;
    return toHex(rgb.map(value => (value + offset) * 255));
  }

  function luminance(hex) {
    const linear = channels(hex).map(value => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  }

  function contrast(first, second) {
    const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  }

  function blend(first, second, amount) {
    const a = channels(first);
    const b = channels(second);
    return toHex(a.map((value, index) => value * amount + b[index] * (1 - amount)));
  }

  function readAccent() {
    try { return validHex(localStorage.getItem(storageKey)) || defaultAccent; }
    catch { return defaultAccent; }
  }

  function applyAccent(value = readAccent(), theme = root.dataset.theme === 'dark' ? 'dark' : 'light') {
    const seed = validHex(value) || defaultAccent;
    const [hue, saturation, lightness] = toHsl(seed);
    const levels = [
      Math.min(0.995, lightness + (1 - lightness) * 0.95),
      lightness + (1 - lightness) * 0.86,
      lightness + (1 - lightness) * 0.72,
      lightness + (1 - lightness) * 0.55,
      lightness + (1 - lightness) * 0.32,
      lightness,
      lightness * 0.84,
      lightness * 0.68,
      lightness * 0.52,
      lightness * 0.36,
      lightness * 0.22,
    ];
    const palette = Object.fromEntries(shades.map((shade, index) => [shade, index === 5 ? seed : fromHsl(hue, saturation, levels[index])]));
    const dark = theme === 'dark';
    const canvas = dark ? '#121212' : '#ffffff';
    const candidates = dark ? [500, 400, 300, 200, 100, 50] : [500, 600, 700, 800, 900, 950];
    let accent = palette[candidates.at(-1)];
    for (const shade of candidates) {
      accent = palette[shade];
      if (contrast(accent, canvas) >= 4.5) break;
    }
    const foreground = contrast('#ffffff', accent) >= contrast('#121212', accent) ? '#ffffff' : '#121212';
    const background = dark ? '#1c1c1c' : '#ffffff';

    for (const shade of shades) root.style.setProperty(`--color-accent-${shade}`, palette[shade]);
    root.style.setProperty('--color-accent-seed', seed);
    root.style.setProperty('--color-border-focus', accent);
    root.style.setProperty('--color-text-on-accent', foreground);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-rgb', channels(accent).join(' '));
    root.style.setProperty('--accent-soft', blend(accent, background, dark ? 0.2 : 0.1));
    root.style.setProperty('--accent-foreground', foreground);
    root.style.setProperty('--focus', accent);
    return { seed, accent, palette };
  }

  window.Vys3nThemeColors = { defaultAccent, readAccent, applyAccent };
  applyAccent(readAccent());
})();
