import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('dist/site');
for (const route of ['demo', 'app', 'privacy', 'terms', '404']) {
  await mkdir(resolve(root, route), { recursive: true });
  await cp(resolve(root, 'index.html'), resolve(root, route, 'index.html'));
}
await cp(resolve(root, 'index.html'), resolve(root, '404.html'));
