import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadPublicModule } from './load-public-module.mjs';
const base=process.env.PORTFOLIO_BASE || '/';
const html=readFileSync('dist/index.html','utf8');
assert.ok(html.includes(`content="${base}"`),'base metadata matches deployment');
const assets=[...html.matchAll(/(?:src|href)="([^\"]+\/assets\/[^\"]+)"/g)].map(x=>x[1]);
assert.ok(assets.length>=2,'script and stylesheet found');
for(const asset of assets){assert.ok(asset.startsWith(base+'assets/'));assert.ok(existsSync('dist/'+asset.slice(base.length)));}
const {default:content}=loadPublicModule('publicContent');
assert.equal(readFileSync('dist/work/index.html','utf8'),html,'Work gallery has a refreshable static entry');
for(const p of content.projects){const page=readFileSync(`dist/work/${p.id}/index.html`,'utf8');assert.equal(page,html);}
assert.ok(existsSync('dist/.nojekyll'));assert.ok(existsSync('dist/404.html'));
const snapshot=JSON.parse(readFileSync('dist/github-activity.json','utf8'));
assert.ok(Number.isSafeInteger(snapshot.repositories));assert.ok(Number.isFinite(Date.parse(snapshot.fetchedAt)));
assert.ok(Number.isSafeInteger(snapshot.commits));
assert.deepEqual(snapshot,JSON.parse(readFileSync('scripts/github-snapshot.json','utf8')),'build preserves manually verified metrics');
assert.ok(!/email|Authorization|token/i.test(JSON.stringify(snapshot)),'public metadata only');
console.log(`Pages verification passed: ${base}, ${content.projects.length} refreshable case routes, assets and timestamped statistics.`);
