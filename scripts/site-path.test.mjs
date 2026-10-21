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
 assert.equal(exports.siteHref('/work/'),base+'work/');
 assert.equal(exports.sitePath(base+'work/'),'/work');
 assert.equal(exports.sitePath(base+'work/index.html'),'/work');
 assert.equal(exports.sitePath(base),'/');assert.equal(exports.sitePath(base+'work/transgis/'),'/work/transgis');
 assert.equal(exports.sitePath(base+'work/transgis/index.html'),'/work/transgis');
 assert.equal(exports.siteHref('https://github.com/example'),'https://github.com/example');
 assert.equal(exports.siteHref('#work'),'#work');
});

test('case-study returns preserve homepage flow and explicit gallery entry',()=>{
 const exports={};runInNewContext(compiled,{exports});
 for(const id of ['transgis','fedguard','plant-cropper']){
  assert.equal(exports.caseStudyReturn(id,true,null).href,'/#work');
  assert.equal(exports.caseStudyReturn(id,true,'work').href,`/work/#${id}`);
 }
 for(const id of ['cell-counter','campus-events','snack-squad']){
  assert.equal(exports.caseStudyReturn(id,false,null).href,'/#experience');
  assert.equal(exports.caseStudyReturn(id,false,'work').href,`/work/#${id}`);
 }
 assert.equal(exports.caseStudyReturn('transgis',true,'unexpected').href,'/#work');
});
