import { cp, mkdir, writeFile } from 'node:fs/promises';
import config from '../admin/config.mjs';

const target = new URL('../public/admin/', import.meta.url);
const packageMain = import.meta.resolve('@sveltia/cms');
await mkdir(target, { recursive: true });
await writeFile(new URL('config.json', target), JSON.stringify(config, null, 2) + '\n');
await cp(new URL('../dist/', packageMain), new URL('vendor/', target), {
  recursive: true,
  filter: path => !path.endsWith('.map') && !path.endsWith('.mjs'),
});
await cp(new URL('../LICENSE.txt', packageMain), new URL('vendor/LICENSE.txt', target));
console.log('Admin prepared: pinned Sveltia CMS, repository-scoped token sign-in, content and settings forms.');
