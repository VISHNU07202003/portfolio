import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const compiled=ts.transpileModule(readFileSync(new URL('../app/src/experienceTimeline.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const exports={};runInNewContext(compiled,{exports,require});
const {gsap}=require('gsap');
function setup(){
 const rotations=[[-7,-7,6,-4,-12],[5,5,-8,5,-7]];
 const targets=rotations.map(group=>group.map(rotation=>({x:0,y:0,z:0,rotation,rotationX:0,rotationY:0,scale:1,opacity:1})));
 let size=520;
 const timeline=exports.buildExperienceTimeline(targets[0],targets[1],()=>size,rotations);
 return {targets,timeline,resize:()=>{size=400;timeline.progress(0);timeline.invalidate();}};
}
const snapshot=targets=>targets.flat().map(t=>Object.fromEntries(['x','y','z','rotation','rotationX','rotationY','scale','opacity'].map(k=>[k,Math.round(t[k]*10000)/10000])));
test('five layers detach independently; overlap never becomes an empty scene',()=>{
 const {targets,timeline}=setup();
 timeline.progress(.4);assert.equal(new Set(targets[0].map(t=>`${t.x},${t.y}`)).size,5);
 for(let p=0;p<=1;p+=.01){timeline.progress(p);assert.ok(targets.flat().some(t=>t.opacity>=.45),`blank at ${p}`);}
 timeline.progress(.48);assert.ok(targets[0].some(t=>t.opacity>.3));assert.ok(targets[1].some(t=>t.opacity>.3));timeline.kill();
});
test('reverse and rapid seeks restore deterministic endpoints and midpoint',()=>{
 const {targets,timeline}=setup();timeline.progress(.5);const middle=snapshot(targets);
 timeline.progress(1);assert.ok(targets[0].every(t=>t.opacity===0));assert.ok(targets[1].every(t=>t.x===0&&t.y===0&&t.z===0&&t.scale===1&&t.opacity===1));
 for(const p of [.12,.9,.37,.8,0,.5])timeline.progress(p);
 assert.deepEqual(snapshot(targets),middle);
 timeline.progress(0);assert.ok(targets[0].every(t=>t.x===0&&t.y===0&&t.scale===1&&t.opacity===1));assert.ok(targets[1].every(t=>t.opacity===0));timeline.kill();
});
test('resize recomputes spatial offsets and keeps final composition intact',()=>{
 const {targets,timeline,resize}=setup();timeline.progress(.45);const before=targets[0][0].x;resize();timeline.progress(.45);assert.ok(Math.abs(targets[0][0].x)<Math.abs(before));timeline.progress(1);assert.ok(targets[1].every(t=>t.x===0&&t.y===0&&t.scale===1));timeline.kill();
});

test('three chapters hold the middle composition, assemble the third and reverse without ghosts',()=>{
 const rotations=[[-7,-7,6,-4,-12],[5,5,-8,5,-7],[4,-7,7,-3,-6]];
 const targets=rotations.map(group=>group.map(rotation=>({x:0,y:0,z:0,rotation,rotationX:0,rotationY:0,scale:1,opacity:1})));
 let size=520;
 const timeline=exports.buildExperienceSequence(targets,()=>size,rotations);
 const composed=index=>{targets.forEach((group,i)=>assert.ok(group.every(t=>i===index?t.opacity===1&&t.x===0&&t.y===0&&t.scale===1:t.opacity===0),`chapter ${index}, group ${i}`));};
 timeline.progress(.001);composed(0);
 timeline.progress(.5);composed(1);
 timeline.progress(1);composed(2);
 timeline.progress(.74);const middle=snapshot(targets);
 for(const p of [.02,.98,.3,.9,.51,.74])timeline.progress(p);
 assert.deepEqual(snapshot(targets),middle);
 for(let p=1;p>=0;p-=.005){timeline.progress(p);assert.ok(targets.flat().some(t=>t.opacity>=.45),`blank at ${p}`);}
 timeline.progress(.5);composed(1);
 timeline.progress(0);composed(0);
 timeline.progress(.2);const before=targets[0][1].x;
 timeline.progress(0);size=360;timeline.invalidate();timeline.progress(.2);
 assert.ok(Math.abs(targets[0][1].x)<Math.abs(before));
 timeline.progress(1);composed(2);
 timeline.kill();
});
test.after(()=>gsap.ticker.sleep());

test('six chapters retain composed holds, overlap, reverse seeks and resize determinism',()=>{
 const rotations=Array.from({length:6},()=>[-5,8,-7,3,-5]);
 const groups=rotations.map(group=>group.map(rotation=>({x:0,y:0,z:0,rotation,rotationX:0,rotationY:0,scale:1,opacity:1})));
 let size=500;const timeline=exports.buildExperienceSequence(groups,()=>size,rotations);
 for(let i=0;i<6;i++){
  timeline.progress(i===0?.001:i/5);
  groups.forEach((group,index)=>assert.ok(group.every(t=>index===i?t.opacity===1&&t.x===0&&t.y===0:t.opacity===0),`composed ${i}, group ${index}`));
 }
 for(let p=0;p<=1;p+=.002){timeline.progress(p);assert.ok(groups.flat().some(t=>t.opacity>=.45),`empty at ${p}`);}
 timeline.progress(.69);const expected=snapshot(groups);
 for(const p of [0,.95,.19,.82,.5,1,.69])timeline.progress(p);
 assert.deepEqual(snapshot(groups),expected);
 timeline.progress(.08);const before=groups[0][1].x;timeline.progress(0);size=350;timeline.invalidate();timeline.progress(.08);
 assert.ok(Math.abs(groups[0][1].x)<Math.abs(before));timeline.kill();
});

test('composed chapters retain five depth planes and camera motion reverses deterministically',()=>{
 const rotations=Array.from({length:3},()=>[-7,-7,6,-4,-12]);
 const targets=rotations.map(group=>group.map(rotation=>({x:0,y:0,z:0,rotation,rotationX:0,rotationY:0,scale:1,opacity:1})));
 const cameras=rotations.map(()=>({rotationX:0,rotationY:0}));
 const timeline=exports.buildExperienceSequence(targets,()=>520,rotations,cameras);
 for(const [progress,chapter] of [[.001,0],[.5,1],[1,2]]){
  timeline.progress(progress);
  assert.deepEqual(targets[chapter].map(t=>t.z),Array.from(exports.composedDepths));
  assert.equal(new Set(targets[chapter].map(t=>t.z)).size,5);
 }
 timeline.progress(.74);const layers=snapshot(targets),camera=cameras.map(c=>[c.rotationX,c.rotationY]);
 for(const p of [0,.95,.21,1,.5,.74])timeline.progress(p);
 assert.deepEqual(snapshot(targets),layers);assert.deepEqual(cameras.map(c=>[c.rotationX,c.rotationY]),camera);
 assert.ok(cameras.every(c=>Math.abs(c.rotationY)<=16&&Math.abs(c.rotationX)<=8));
 timeline.kill();
});

const pageMotion={};
const pointerDocument={hidden:false,listeners:new Map(),addEventListener(type,handler){this.listeners.set(type,handler);},removeEventListener(type){this.listeners.delete(type);}};
runInNewContext(ts.transpileModule(readFileSync(new URL('../app/src/pageMotion.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:pageMotion,document:pointerDocument,require:id=>id==='gsap/ScrollTrigger'?{ScrollTrigger:{}}:require(id)});

test('pointer tilt is bounded and never changes the scroll camera',()=>{
 const pose=pageMotion.spatialPointerPose(5,-4);assert.equal(pose.rotationX,4);assert.equal(pose.rotationY,6);
 assert.equal(pageMotion.spatialPointerPose(0,0).rotationY,0);
});

test('pointer interaction handles replaced gallery art, touch, hidden documents and cleanup',()=>{
 let targets=[{rotationX:0,rotationY:0}];const retired=targets[0],handlers=new Map();
 const host={matches:()=>true,contains:t=>targets.includes(t),querySelectorAll:()=>targets,getBoundingClientRect:()=>({left:0,top:0,width:400,height:300}),addEventListener:(type,handler)=>handlers.set(type,handler),removeEventListener:type=>handlers.delete(type)};
 const finish=target=>gsap.getTweensOf(target).forEach(t=>t.progress(1));
 const move=type=>handlers.get('pointermove')({pointerType:type,currentTarget:host,clientX:400,clientY:0});
 const dispose=pageMotion.bindSpatialPointer(host);
 move('touch');assert.equal(gsap.getTweensOf(retired).length,0);
 move('mouse');finish(retired);assert.equal(retired.rotationX,4);assert.equal(retired.rotationY,6);
 targets=[{rotationX:0,rotationY:0}];move('mouse');finish(targets[0]);assert.equal(targets[0].rotationY,6);assert.equal(gsap.getTweensOf(retired).length,0);
 handlers.get('pointerleave')();finish(targets[0]);assert.equal(targets[0].rotationX,0);assert.equal(targets[0].rotationY,0);
 move('mouse');pointerDocument.hidden=true;pointerDocument.listeners.get('visibilitychange')();assert.equal(targets[0].rotationY,0);
 move('mouse');assert.equal(targets[0].rotationY,0);
 dispose();assert.equal(handlers.size,0);assert.equal(pointerDocument.listeners.size,0);assert.equal(gsap.getTweensOf(targets[0]).length,0);pointerDocument.hidden=false;
});

const visual={};runInNewContext(ts.transpileModule(readFileSync(new URL('../app/src/Visual.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports:visual,require:id=>/\.(jpg|png|webp)$/.test(id)?{default:id}:require(id)});
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');

test('homepage Selected Work uses static flat vector illustrations without generated images or depth wrappers',()=>{
 for(const projectId of ['transgis','fedguard','plant-cropper']){
  const markup=renderToStaticMarkup(React.createElement(visual.SelectedWorkArtwork,{projectId}));
  assert.match(markup,/selected-flat-art/);
  assert.match(markup,/<svg[^>]+role="img"/);
  assert.match(markup,/Flat /);
  assert.doesNotMatch(markup,/<img|spatial-camera|spatial-pointer|translateZ|data-layer/);
 }
});
test('each experience keeps exactly five independently addressable surfaces inside its camera',()=>{
 for(const kind of ['lab','events','android']){
  const markup=renderToStaticMarkup(React.createElement(visual.default,{kind}));
  assert.deepEqual([...markup.matchAll(/data-layer="([^"]+)"/g)].map(m=>m[1]),['shell','primary','inspector','results','context']);
  assert.match(markup,/class="spatial-camera"><div class="spatial-pointer"><div class="spatial-world">/);
  assert.match(markup,/not a product screenshot/);
 }
});
test('selected-work sculptures have three depth planes and collision-free SVG gradient references',()=>{
 const kinds=['map','federated','plant','plant','community','commerce','analytics','covid'];
 const markup=renderToStaticMarkup(React.createElement(React.Fragment,null,...kinds.map((kind,key)=>React.createElement(visual.default,{kind,key}))));
 for(const plane of ['ground','object','detail'])assert.equal([...markup.matchAll(new RegExp(`class="sculpture-plane depth-${plane}"`,'g'))].length,kinds.length);
 const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const match of markup.matchAll(/url\(#([^)]+)\)/g))assert.ok(ids.includes(match[1]),`missing gradient ${match[1]}`);
 assert.equal([...markup.matchAll(/role="img"/g)].length,kinds.length);
});

test('organization artwork keeps official logos separate from generated conceptual backdrops',()=>{
 for(const organization of ['ifas','vit-ap']){
  const markup=renderToStaticMarkup(React.createElement(visual.OrganizationArtwork,{organization}));
  assert.match(markup,/class="plain-organization-logo"/);assert.doesNotMatch(markup,/spatial-camera|spatial-pointer|float/);
  assert.match(markup,/loading="lazy"/);
  assert.ok(markup.includes(organization==='ifas'?'uf-ifas-logo.png':'vit-ap-logo.png'));
  assert.ok(markup.includes(organization==='ifas'?'ifas-blueberry-concept.jpg':'vit-campus-concept.jpg'));
  assert.match(markup,/not laboratory photography|not an actual campus building/);
 }
});

test('every Work project resolves to a flat static image and preserves organization boundaries',()=>{
 const cases={'transgis':'transgis','reddit-clone':'reddit','zara-replica':'zara','fedguard':'fedguard','yelp-analysis':'yelp','covid-19':'covid','snack-squad':'snack'};
 for(const [projectId,file]of Object.entries(cases)){
  const markup=renderToStaticMarkup(React.createElement(visual.ProjectArtwork,{projectId,kind:'map'}));
  assert.ok(markup.includes(`${file}-project-concept.webp`));assert.ok(markup.includes(`data-project-art="${projectId}"`));
  assert.match(markup,/plain-project-art/);assert.doesNotMatch(markup,/generated-ground|generated-subject-depth|spatial-camera|spatial-pointer/);assert.match(markup,/loading="lazy"/);
  assert.ok(!markup.includes('uf-ifas-logo.png'));
 }
 for(const projectId of ['cell-counter','plant-cropper'])assert.match(renderToStaticMarkup(React.createElement(visual.ProjectArtwork,{projectId,kind:'plant'})),/uf-ifas-logo.png/);
 assert.match(renderToStaticMarkup(React.createElement(visual.ProjectArtwork,{projectId:'campus-events',kind:'events'})),/vit-ap-logo.png/);
});
