import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';

import { loadPublicModule } from './load-public-module.mjs';

const { default: content } = loadPublicModule('publicContent');
const html = await readFile('dist/index.html', 'utf8');
await mkdir('dist/work', { recursive: true });
await writeFile('dist/work/index.html', html);
for (const project of content.projects) {
  if (!/^[a-z0-9-]+$/.test(project.id)) throw Error('Invalid case route');
  const directory = `dist/work/${project.id}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');
const snapshot = JSON.parse(await readFile('scripts/github-snapshot.json', 'utf8'));
if (!Number.isSafeInteger(snapshot.repositories) || snapshot.repositories < 0 ||
    !Number.isSafeInteger(snapshot.commits) || snapshot.commits < 0 ||
    !Number.isFinite(Date.parse(snapshot.fetchedAt))) throw Error('Invalid static GitHub metrics');
await writeFile('dist/github-activity.json', JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Static case routes: ${content.projects.length}; manually maintained GitHub metrics: ${snapshot.fetchedAt}`);
