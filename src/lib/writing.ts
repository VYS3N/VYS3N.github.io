import type { Lang } from './i18n';

export const writingLang = (url: URL): Lang => url.pathname.startsWith('/en/') ? 'en' : 'zh';

export function writingHref(value: string): string {
  if (!value || /[\u0000-\u001f\\]/.test(value)) throw new Error('A writing component needs a valid link.');
  const address = new URL(value, 'https://vys3n.github.io');
  if (!['http:', 'https:', 'mailto:'].includes(address.protocol)) throw new Error(`Unsupported writing link protocol: ${address.protocol}`);
  return value;
}

export function writingMedia(value: string): string {
  const result = writingHref(value);
  if (new URL(result, 'https://vys3n.github.io').protocol === 'mailto:') throw new Error('Media needs an HTTP, HTTPS or local file URL.');
  return result;
}

export const externalLink = (value: string) => /^(https?:)?\/\//i.test(value);
