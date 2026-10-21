import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
const moduleExports={};
runInNewContext(ts.transpileModule(readFileSync(new URL('../api/github.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:moduleExports,AbortSignal});
const {fetchGithubActivity,createGithubService}=moduleExports;
const now=Date.parse('2026-10-18T12:00:00Z');
const fixture={repositories:17,recentRepositories:2,commits:277,commitsIncomplete:false,latest:[],fetchedAt:new Date(now).toISOString()};
function upstream({incomplete=false,fail=false,repositories=[]}={}) {
 return async url=>({ok:!fail,status:fail?403:200,json:async()=>url.includes('/repos?')?repositories:url.includes('/search/')?{total_count:277,incomplete_results:incomplete,items:[{sha:'a'.repeat(40),repository:{full_name:'VISHNU07202003/demo',private:false},commit:{author:{date:'2026-10-17T12:00:00Z',email:'must-not-be-returned'},message:'not included'}}]}:{public_repos:17,email:'not included'}});
}
test('counts both old and new repositories; exposes only allowlisted public commit metadata',async()=>{
 const result=await fetchGithubActivity(upstream({repositories:[{created_at:'2026-10-01T00:00:00Z',private:false},{created_at:'2021-01-01T00:00:00Z',private:false}]}),now);
 assert.equal(result.repositories,17);assert.equal(result.recentRepositories,1);assert.equal(result.commits,277);
 assert.equal(result.latest[0].sha,'aaaaaaa');assert.equal(result.latest[0].url,`https://github.com/VISHNU07202003/demo/commit/${'a'.repeat(40)}`);
 assert.ok(!JSON.stringify(result).includes('email'));assert.ok(!JSON.stringify(result).includes('message'));
});
test('incomplete GitHub search never masquerades as a verified commit total',async()=>{const result=await fetchGithubActivity(upstream({incomplete:true}),now);assert.equal(result.commits,null);assert.equal(result.commitsIncomplete,true);});
test('GitHub failure rejects instead of inventing zero activity',async()=>{await assert.rejects(fetchGithubActivity(upstream({fail:true}),now));});
test('simultaneous readers share one upstream refresh and fresh snapshots are reused',async()=>{
 let calls=0;let release;const service=createGithubService(()=>{calls++;return new Promise(resolve=>{release=resolve;});},()=>now);
 const a=service(),b=service();release(fixture);const results=await Promise.all([a,b]);assert.equal(calls,1);assert.equal(results[0].stale,false);await service();assert.equal(calls,1);
});
test('rate limits retain a labeled stale snapshot and back off without another fetch',async()=>{
 let time=now,calls=0;const service=createGithubService(async()=>{if(calls++===0)return fixture;throw Error('rate limit');},()=>time);
 await service();time+=301000;const stale=await service();assert.equal(stale.stale,true);assert.equal(stale.commits,277);await service();assert.equal(calls,2);
});

test('repository pagination counts every recent public repository before reaching old history',async()=>{
 let pages=0;const base=upstream();const fetcher=async url=>{if(!url.includes('/repos?'))return base(url);pages++;return {ok:true,json:async()=>pages===1?Array.from({length:100},()=>({created_at:'2026-10-10T00:00:00Z',private:false})):[{created_at:'2026-09-10T00:00:00Z',private:false},{created_at:'2020-01-01T00:00:00Z',private:false}]};};
 const result=await fetchGithubActivity(async url=>url.endsWith('/users/VISHNU07202003')?{ok:true,json:async()=>({public_repos:140})}:fetcher(url),now);assert.equal(result.recentRepositories,101);assert.equal(pages,2);
});
test('valid empty accounts keep zero totals distinct from upstream failure',async()=>{
 const result=await fetchGithubActivity(async url=>({ok:true,json:async()=>url.includes('/repos?')?[]:url.includes('/search/')?{total_count:0,incomplete_results:false,items:[]}:{public_repos:0}}),now);assert.equal(result.repositories,0);assert.equal(result.commits,0);assert.equal(result.latest.length,0);
});
test('commit URLs cannot be supplied by upstream data or point away from GitHub',async()=>{
 const result=await fetchGithubActivity(async url=>{const response=await upstream()(url);const data=await response.json();if(url.includes('/search/'))data.items[0].html_url='https://untrusted.example';return {...response,json:async()=>data};},now);assert.ok(result.latest[0].url.startsWith('https://github.com/'));assert.ok(!JSON.stringify(result).includes('untrusted.example'));
});

test('compiled deployment entry runs without the source tree and serves HTTP responses', async () => {
 const {mkdtemp,writeFile,rm}=await import('node:fs/promises');
 const {tmpdir}=await import('node:os');
 const {join}=await import('node:path');
 const {pathToFileURL}=await import('node:url');
 const {createServer}=await import('node:http');
 const directory=await mkdtemp(join(tmpdir(),'portfolio-function-'));
 const originalFetch=globalThis.fetch;
 let server;
 try {
  const output=ts.transpileModule(readFileSync(new URL('../api/github.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  const entry=join(directory,'github.mjs');await writeFile(entry,output);
  const {default:handler}=await import(pathToFileURL(entry).href);
  assert.equal(typeof handler,'function');
  globalThis.fetch=upstream();
  server=createServer((req,res)=>{void handler(req,res);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=`http://127.0.0.1:${server.address().port}/api/github`;
  const response=await originalFetch(url);
  assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/application\/json/);
  assert.match(response.headers.get('cache-control'),/s-maxage=300/);
  const body=await response.json();assert.equal(body.repositories,17);assert.equal(body.stale,false);
  const rejected=await originalFetch(url,{method:'POST'});assert.equal(rejected.status,405);assert.equal(rejected.headers.get('allow'),'GET');
 } finally {
  globalThis.fetch=originalFetch;
  if(server)await new Promise(resolve=>server.close(resolve));
  await rm(directory,{recursive:true,force:true});
 }
});

import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const componentSource = readFileSync(new URL('../app/src/GithubActivity.tsx', import.meta.url), 'utf8');
const savedMetrics = JSON.parse(readFileSync(new URL('./github-snapshot.json', import.meta.url), 'utf8'));
function renderStaticMetrics() {
 const output = ts.transpileModule(componentSource, {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const exports = {};
 const require = createRequire(import.meta.url);
 runInNewContext(output, {exports,require: id => id.endsWith('github-snapshot.json') ? savedMetrics : require(id)});
 return renderToStaticMarkup(createElement(exports.default));
}
test('static GitHub cards render saved public counts and their verification date immediately', () => {
 const html = renderStaticMetrics();
 assert.equal((html.match(/class="github-number"/g)||[]).length, 2);
 assert.ok(html.includes(`>${savedMetrics.repositories}</span>`));
 assert.ok(html.includes(`>${savedMetrics.commits}</span>`));
 assert.ok(html.includes('October 21, 2026'));
 assert.ok(html.includes('these figures are not live'));
 assert.ok(html.includes('Public repositories'));
 assert.ok(html.includes('Indexed public commits'));
});
test('static metrics have no refresh controls, activity feed, polling or network dependency', () => {
 const html = renderStaticMetrics();
 assert.doesNotMatch(html, /<button|<ol|role="status"|Connecting|Loading|Refresh data|Latest indexed commits/);
 assert.doesNotMatch(componentSource, /\bfetch\s*\(|\bsetInterval\s*\(|\buseEffect\b/);
 assert.match(html, /href="https:\/\/github.com\/VISHNU07202003"/);
});
