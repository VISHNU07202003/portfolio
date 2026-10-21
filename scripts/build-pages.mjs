import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fetchGithubActivity } from '../api/github.ts';
import { loadPublicModule } from './load-public-module.mjs';

const { default: content } = loadPublicModule('publicContent');
const html = await readFile('dist/index.html', 'utf8');
for (const project of content.projects) {
  if (!/^[a-z0-9-]+$/.test(project.id)) throw Error('Invalid case route');
  const directory = `dist/work/${project.id}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');
let snapshot;
try {
  snapshot = { ...await fetchGithubActivity(), stale: false };
  await writeFile('scripts/github-snapshot.json', JSON.stringify(snapshot, null, 2) + '\n');
} catch (error) {
  try {
    snapshot = JSON.parse(await readFile('scripts/github-snapshot.json', 'utf8'));
    if (!Number.isSafeInteger(snapshot.repositories) || !Number.isFinite(Date.parse(snapshot.fetchedAt))) throw Error('Invalid saved snapshot');
    snapshot.stale = true;
    console.warn('GitHub refresh failed; retaining the timestamped saved snapshot:', error.message);
  } catch { throw Error('GitHub unavailable and no saved snapshot exists; refusing to invent statistics'); }
}
await writeFile('dist/github-activity.json', JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Static case routes: ${content.projects.length}; GitHub snapshot: ${snapshot.fetchedAt}; stale: ${snapshot.stale}`);
