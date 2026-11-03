import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
const compiled=ts.transpileModule(readFileSync(new URL('../app/src/heroMotion.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function eligible({reduced=false,search='',pathname='/',hash='',seen=null,storageFails=false}={}){
 const exports={};
 runInNewContext(compiled,{exports,require:id=>id==='./sitePath'?{sitePath:path=>path}:({}),URLSearchParams,matchMedia:()=>({matches:reduced}),location:{search,pathname,hash},sessionStorage:{getItem(){if(storageFails)throw Error('Storage blocked');return seen;}}});
 return exports.shouldShowIntro();
}
test('reduced motion bypasses both automatic and requested intro',()=>{assert.equal(eligible({reduced:true}),false);assert.equal(eligible({reduced:true,search:'?intro'}),false);});
test('first home visit shows intro, repeat session and deep links bypass it',()=>{assert.equal(eligible(),true);assert.equal(eligible({seen:'1'}),false);assert.equal(eligible({pathname:'/work/fedguard'}),false);assert.equal(eligible({hash:'#work'}),false);});
test('blocked storage fails open; explicit replay remains available',()=>{assert.equal(eligible({storageFails:true}),false);assert.equal(eligible({seen:'1',search:'?intro'}),true);});

const blackHoleCompiled=ts.transpileModule(readFileSync(new URL('../app/src/blackHole.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function atmosphereModule(extra={}){const exports={};runInNewContext(blackHoleCompiled,{exports,...extra});return exports;}
test('black hole resolution respects desktop/mobile budgets and retina caps',()=>{
 const {blackHoleRenderSize}=atmosphereModule();
 for(const mobile of [false,true])for(const [w,h,dpr] of [[880,677,1],[1440,900,3],[390,700,3],[0,0,1],[100000,1,2]]){
  const size=blackHoleRenderSize(w,h,dpr,mobile);
  assert.ok(size.width>=1&&size.height>=1);
  assert.ok(size.width<=960&&size.height<=720);
  assert.ok(size.width*size.height<=(mobile?160000:360000));
 }
});
test('missing or blocked WebGL leaves the CSS atmosphere available',()=>{
 const {createBlackHole}=atmosphereModule();
 for(const fail of [false,true]){
  const host={dataset:{}};
  assert.equal(createBlackHole({parentElement:host,getContext(){if(fail)throw Error('blocked');return null;}}),null);
  assert.equal(host.dataset.renderer,'css');
 }
});
test('renderer pauses without a frame loop and releases resources on cleanup',()=>{
 const frames=new Map(),listeners=new Map();let id=0,draws=0,deleted=0,disconnected=false;
 const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,ARRAY_BUFFER:3,STATIC_DRAW:4,FLOAT:5,TRIANGLES:6,LINK_STATUS:7,
  createProgram:()=>({}),createShader:()=>({}),shaderSource(){},compileShader(){},attachShader(){},linkProgram(){},getProgramParameter:()=>true,useProgram(){},createBuffer:()=>({}),bindBuffer(){},bufferData(){},getAttribLocation:()=>0,enableVertexAttribArray(){},vertexAttribPointer(){},getUniformLocation:()=>({}),viewport(){},uniform2f(){},uniform1f(){},drawArrays(){draws++;},isContextLost:()=>false,deleteShader(){},deleteBuffer(){deleted++;},deleteProgram(){deleted++;}};
 const host={dataset:{}};
 const canvas={parentElement:host,clientWidth:880,clientHeight:677,getContext:()=>gl,addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
 const {createBlackHole}=atmosphereModule({innerWidth:1440,devicePixelRatio:2,requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:key=>frames.delete(key),ResizeObserver:class{observe(){}disconnect(){disconnected=true;}}});
 const renderer=createBlackHole(canvas);
 assert.ok(renderer);assert.equal(host.dataset.renderer,'webgl');assert.equal(frames.size,0);
 renderer.setRunning(true);assert.equal(frames.size,1);
 const [key,tick]=frames.entries().next().value;frames.delete(key);tick(100);assert.equal(frames.size,1);
 renderer.setRunning(false);assert.equal(frames.size,0);assert.equal(host.dataset.playback,'paused');
 const still=draws;renderer.setRunning(false);assert.equal(draws,still);
 renderer.dispose();assert.equal(frames.size,0);assert.equal(listeners.size,0);assert.ok(disconnected);assert.equal(deleted,2);
});
