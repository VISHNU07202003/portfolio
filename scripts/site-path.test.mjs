import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
const compiled=ts.transpileModule(readFileSync(new URL('../app/src/sitePath.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
for(const base of ['/','/portfolio/'])test(`navigation and direct case routes work under ${base}`,()=>{
 const exports={};runInNewContext(compiled,{exports,document:{querySelector:()=>({getAttribute:()=>base})}});
 assert.equal(exports.siteHref('/'),base);assert.equal(exports.siteHref('/#experience'),base+'#experience');
 assert.equal(exports.siteHref('/work/transgis/'),base+'work/transgis/');
 assert.equal(exports.sitePath(base),'/');assert.equal(exports.sitePath(base+'work/transgis/'),'/work/transgis');
 assert.equal(exports.sitePath(base+'work/transgis/index.html'),'/work/transgis');
 assert.equal(exports.siteHref('https://github.com/example'),'https://github.com/example');
 assert.equal(exports.siteHref('#work'),'#work');
});
