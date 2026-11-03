// Original procedural artwork. Perspective disk + stylized light bending;
// this is an art-directed atmosphere, not a general-relativity simulation.
export function blackHoleRenderSize(width: number, height: number, dpr: number, mobile: boolean) {
  const w = Math.max(1, width), h = Math.max(1, height);
  const scale = Math.min(Math.max(1, dpr), 1.25, 960 / w, 720 / h, Math.sqrt((mobile ? 160000 : 360000) / (w * h)));
  return { width: Math.max(1, Math.floor(w * scale)), height: Math.max(1, Math.floor(h * scale)) };
}

const vertexSource = `attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}`;
const fragmentSource = `precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
float cloud(vec2 p){return noise(p)*.57+noise(p*2.03+5.2)*.28+noise(p*4.07-3.1)*.15;}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y*1.7;
 uv-=pointer*vec2(.018,.012);
 float radius=length(uv),angle=atan(uv.y,uv.x);
 vec3 ro=vec3(pointer.x*.12,1.45+pointer.y*.12,6.0);
 vec3 forward=normalize(-ro),right=vec3(1.,0.,0.),up=normalize(cross(right,forward));
 vec3 ray=normalize(forward*1.8+uv.x*right+uv.y*up);
 float distance=-ro.y/min(ray.y,-.0001);
 vec3 hit=ro+ray*distance;
 float r=length(hit.xz),a=atan(hit.z,hit.x);
 float angularSpeed=1.4/pow(max(r,.8),1.25);
 vec2 flow=vec2(a*5.0-time*angularSpeed,r*4.0);
 float strands=cloud(flow)*.65+.35;
 float filaments=.55+.45*sin(r*37.0+cloud(flow*.65)*8.0-time*angularSpeed*2.0);
 float annulus=smoothstep(1.24,1.52,r)*(1.-smoothstep(2.1,3.65,r));
 float emission=annulus*strands*(.5+.5*filaments)*step(ray.y,-.001);
 float approaching=.65+.65*smoothstep(-2.8,2.8,hit.x);
 vec3 ember=mix(vec3(.48,.20,.095),vec3(1.0,.82,.56),exp(-max(r-1.4,0.)*1.4));
 vec3 color=ember*emission*approaching*2.2;
 float shadow=1.-smoothstep(.325,.345,radius);
 color*=1.-shadow;
 // The far disk appears as a luminous arc around the shadow.
 float arcRadius=length(vec2(uv.x,uv.y*.98));
 float arc=exp(-pow((arcRadius-.365)/.018,2.0));
 float arcFlow=.66+.34*cloud(vec2(angle*5.-time*.42,arcRadius*24.));
 float upper=smoothstep(-.12,.12,uv.y);
 color+=vec3(.95,.78,.55)*arc*arcFlow*(.35+upper*.8);
 float photon=exp(-pow((radius-.343)/.0045,2.0));
 color+=vec3(.8,.89,1.)*photon*(.20+.30*upper);
 float corona=exp(-abs(radius-.36)*18.)*.055;
 color+=vec3(.65,.72,.83)*corona;
 // Sparse, faint dust: no downloaded star texture or external media.
 vec2 grid=uv*46.;vec2 cell=floor(grid);
 float star=pow(max(0.,1.-length(fract(grid)-.5)*3.5),10.0)*step(.993,hash(cell));
 color+=vec3(.46,.58,.76)*star*.17*(1.-shadow);
 color=1.-exp(-color*.95);
 float edge=1.-smoothstep(.86,1.25,length(uv*vec2(.65,.85)));
 float alpha=edge*max(shadow*.98,clamp(max(color.r,max(color.g,color.b))*1.6,0.,.98));
 color=mix(color,vec3(.0314,.0275,.0431),shadow);
 gl_FragColor=vec4(color*alpha,alpha);
}`;

const savedViews = new WeakMap<HTMLCanvasElement, { time: number; x: number; y: number }>();
export function createBlackHole(canvas: HTMLCanvasElement) {
  const host = canvas.parentElement!;
  let gl: WebGLRenderingContext | null = null;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', premultipliedAlpha: true }); }
  catch { /* CSS atmosphere is always available beneath the canvas. */ }
  if (!gl) { host.dataset.renderer = 'css'; return null; }
  const gpu = gl;
  let program: WebGLProgram | null = null, buffer: WebGLBuffer | null = null;
  let uniforms: { resolution: WebGLUniformLocation | null; pointer: WebGLUniformLocation | null; time: WebGLUniformLocation | null };
  const view = savedViews.get(canvas) || { time: 2.8, x: 0, y: 0 };
  let frame = 0, running = false, disposed = false, last = 0, time = view.time, frames = 0;
  let targetX = view.x, targetY = view.y, x = view.x, y = view.y;
  let mobile = false;
  function release() { if (buffer) gpu.deleteBuffer(buffer); if (program) gpu.deleteProgram(program); buffer = null; program = null; }
  function initialize() {
    const shaders: WebGLShader[] = [];
    try {
      program = gpu.createProgram();
      if (!program) throw Error('Program unavailable');
      for (const [kind, source] of [[gpu.VERTEX_SHADER, vertexSource], [gpu.FRAGMENT_SHADER, fragmentSource]] as const) {
        const shader = gpu.createShader(kind);
        if (!shader) throw Error('Shader unavailable');
        shaders.push(shader); gpu.shaderSource(shader, source); gpu.compileShader(shader); gpu.attachShader(program, shader);
      }
      gpu.linkProgram(program);
      if (!gpu.getProgramParameter(program, gpu.LINK_STATUS)) throw Error('Shader unsupported');
      gpu.useProgram(program);
      buffer = gpu.createBuffer();
      if (!buffer) throw Error('Buffer unavailable');
      gpu.bindBuffer(gpu.ARRAY_BUFFER, buffer);
      gpu.bufferData(gpu.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gpu.STATIC_DRAW);
      const position = gpu.getAttribLocation(program, 'position');
      gpu.enableVertexAttribArray(position); gpu.vertexAttribPointer(position, 2, gpu.FLOAT, false, 0, 0);
      uniforms = { resolution: gpu.getUniformLocation(program, 'resolution'), pointer: gpu.getUniformLocation(program, 'pointer'), time: gpu.getUniformLocation(program, 'time') };
      host.dataset.renderer = 'webgl';
      resize(); draw();
      return true;
    } catch { release(); host.dataset.renderer = 'css'; return false; }
    finally { shaders.forEach(shader => gpu.deleteShader(shader)); }
  }
  function resize() {
    if (!program) return;
    mobile = innerWidth <= 700;
    const size = blackHoleRenderSize(canvas.clientWidth, canvas.clientHeight, devicePixelRatio || 1, mobile);
    canvas.width = size.width; canvas.height = size.height;
    gpu.viewport(0, 0, size.width, size.height);
    host.dataset.resolution = `${size.width}×${size.height}`;
    draw();
  }
  function draw() {
    if (!program || gpu.isContextLost()) return;
    gpu.useProgram(program);
    gpu.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gpu.uniform2f(uniforms.pointer, x, y); gpu.uniform1f(uniforms.time, time);
    gpu.drawArrays(gpu.TRIANGLES, 0, 3);
    frames++;
    if (frames === 1 || frames % 12 === 0) host.dataset.frames = String(frames);
  }
  function tick(now: number) {
    frame = 0;
    if (!running || disposed) return;
    if (!last || now - last >= (mobile ? 1000 / 24 : 1000 / 30) - 1) {
      if (last) time += Math.min(.08, (now - last) / 1000);
      last = now; x += (targetX - x) * .06; y += (targetY - y) * .06;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function setRunning(value: boolean) {
    const next = value && !!program && !disposed && !gpu.isContextLost();
    host.dataset.playback = next ? 'running' : 'paused';
    if (running === next) return;
    running = next; last = 0;
    if (running) frame = requestAnimationFrame(tick);
    else { cancelAnimationFrame(frame); frame = 0; host.dataset.frames = String(frames); }
  }
  const lost = (event: Event) => { event.preventDefault(); setRunning(false); host.dataset.renderer = 'css'; };
  const restored = () => { if (!disposed) { release(); if (initialize()) setRunning(host.closest<HTMLElement>('.hero-motion')?.dataset.motion === 'running'); } };
  if (!initialize()) return null;
  canvas.addEventListener('webglcontextlost', lost); canvas.addEventListener('webglcontextrestored', restored);
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  return {
    setRunning,
    setPointer(px: number, py: number) { targetX = Math.max(-1, Math.min(1, px)); targetY = Math.max(-1, Math.min(1, py)); },
    dispose() {
      savedViews.set(canvas, { time, x, y });
      setRunning(false); disposed = true; observer.disconnect(); release();
      canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', restored);
      delete host.dataset.frames; delete host.dataset.playback; delete host.dataset.resolution; delete host.dataset.renderer;
    },
  };
}
