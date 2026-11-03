import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const {gsap}=require('gsap');
const exports={};
runInNewContext(ts.transpileModule(readFileSync(new URL('../app/src/sceneTimeline.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,require});
const target=()=>({x:0,y:0,yPercent:0,scale:1,rotation:0,opacity:1});
test('shared scene hands off before scatter and restores hero on reverse',()=>{
 const hero=Object.assign(target(),{querySelector:()=>target()});
 const parts=new Map();const experience={querySelector:key=>{if(!parts.has(key))parts.set(key,target());return parts.get(key);}};
 const sample={progress:0};const scatter=gsap.timeline({paused:true}).to(sample,{progress:1,duration:1,ease:'none'});
 const scene=exports.buildSceneTimeline(hero,experience,scatter);
 scene.progress(.14);assert.equal(sample.progress,0);assert.ok(parts.get('.experience-scene-stack').opacity>0);
 scene.progress(.28);assert.equal(hero.opacity,0);assert.equal(sample.progress,0);
 scene.progress(1);assert.equal(sample.progress,1);
 scene.progress(.14);const opacity=hero.opacity;scene.progress(.8);scene.progress(.14);assert.equal(hero.opacity,opacity);
 scene.progress(0);assert.equal(hero.opacity,1);assert.equal(parts.get('.experience-scene-stack').opacity,0);scene.kill();
});
test('experience progress is clamped and cannot scatter during hero exit',()=>{assert.equal(exports.experienceProgress(.15),0);assert.equal(exports.experienceProgress(1),1);assert.equal(exports.experienceProgress(2),1);});

test('three chapter controls select composed states and copy switches at each transition midpoint',()=>{
 for(let index=0;index<3;index++)assert.equal(exports.chapterState(exports.chapterProgress(index,3),3).active,index);
 assert.equal(exports.chapterState(.24,3).active,0);
 assert.equal(exports.chapterState(.26,3).active,1);
 assert.equal(exports.chapterState(.74,3).active,1);
 assert.equal(exports.chapterState(.76,3).active,2);
 assert.equal(exports.chapterState(1,3).active,2);
});
test.after(()=>gsap.ticker.sleep());

test('six chapters retain the hero handoff distance and resolve every direct anchor',()=>{
 const ids=['optum-experience','samsung-experience','yahoo-experience','uf','campus-events','android-experience'];
 const pacing=exports.scenePacing(ids.length),old=exports.scenePacing(3);
 assert.ok(Math.abs(pacing.screens*pacing.handoff-old.screens*old.handoff)<1e-9);
 assert.ok(Math.abs(old.handoff-.28)<1e-9);
 assert.equal(exports.sceneAnchorProgress('#experience',ids,pacing.handoff),pacing.handoff);
 assert.equal(exports.sceneAnchorProgress('#work',ids,pacing.handoff),null);
 for(let index=0;index<ids.length;index++){
  const scene=exports.sceneAnchorProgress(`#${ids[index]}`,ids,pacing.handoff);
  assert.equal(exports.chapterState(exports.experienceProgress(scene,pacing.handoff),ids.length).active,index);
 }
 for(let segment=0;segment<5;segment++){
  assert.equal(exports.chapterState((segment+.48)/5,6).active,segment);
  assert.equal(exports.chapterState((segment+.52)/5,6).active,segment+1);
 }
});

test('six-chapter handoff and full layer sequence remain reversible at the normalized split',()=>{
 const hero=Object.assign(target(),{querySelector:()=>target()});const parts=new Map();
 const experience={querySelector:key=>{if(!parts.has(key))parts.set(key,target());return parts.get(key);}};
 const sample={progress:0},layers=gsap.timeline({paused:true}).to(sample,{progress:1,duration:5,ease:'none'});
 const {handoff}=exports.scenePacing(6),scene=exports.buildSceneTimeline(hero,experience,layers,handoff);
 scene.progress(handoff);assert.equal(sample.progress,0);assert.equal(hero.opacity,0);
 scene.progress(1);assert.equal(sample.progress,1);
 scene.progress(0);assert.equal(hero.opacity,1);assert.equal(parts.get('.experience-scene-stack').opacity,0);
 scene.kill();
});
