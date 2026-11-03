import { useEffect, useId, useRef, type ReactNode } from 'react';
import type { VisualKind } from './types';
import ifasArtwork from './assets/ifas-blueberry-concept.jpg';
import vitArtwork from './assets/vit-campus-concept.jpg';
import ifasLogo from './assets/uf-ifas-logo.png';
import vitLogo from './assets/vit-ap-logo.png';
import transgisArtwork from './assets/transgis-project-concept.webp';
import redditArtwork from './assets/reddit-project-concept.webp';
import zaraArtwork from './assets/zara-project-concept.webp';
import fedguardArtwork from './assets/fedguard-project-concept.webp';
import yelpArtwork from './assets/yelp-project-concept.webp';
import covidArtwork from './assets/covid-project-concept.webp';
import snackArtwork from './assets/snack-project-concept.webp';

function useArtworkVisibility() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let visible = false;
    const sync = () => { root.dataset.artActive = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); sync(); });
    observer.observe(root); document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return ref;
}

const generatedProjects: Record<string, { src: string; name: string; tone: string }> = {
  transgis: { src: transgisArtwork, name: 'layered terrain and spatial route', tone: 'sage' },
  'reddit-clone': { src: redditArtwork, name: 'Reddit-themed Snoo and conversation sculpture', tone: 'orange' },
  'zara-replica': { src: zaraArtwork, name: 'floating ivory shirt, not an actual Zara catalog product', tone: 'ivory' },
  fedguard: { src: fedguardArtwork, name: 'glass shield and federated server sculpture', tone: 'blue' },
  'yelp-analysis': { src: yelpArtwork, name: 'review and regression sculpture, not measured results', tone: 'blue' },
  'covid-19': { src: covidArtwork, name: 'symbolic global trends sculpture, not measured results', tone: 'rose' },
  'snack-squad': { src: snackArtwork, name: 'phone, burger and shopping bag sculpture, not application UI', tone: 'sage' },
};

function GeneratedProjectArtwork({ projectId }: { projectId: string }) {
  const ref = useArtworkVisibility();
  const art = generatedProjects[projectId];
  return <div ref={ref} className={`generated-project-art generated-tone-${art.tone} concept-art spatial-illustration`} role="img" aria-label={`AI-generated conceptual ${art.name}`} data-project-art={projectId}>
    <div className="spatial-camera"><div className="spatial-pointer"><div className="spatial-world">
      <div className="generated-ground"/>
      <div className="generated-shadow"/>
      <div className="generated-subject-depth"><div className="generated-subject-float"><img src={art.src} width="800" height="800" alt="" loading="lazy" decoding="async"/></div></div>
      <div className="generated-orbit"/>
      <div className="generated-accent"><i/><i/><i/></div>
    </div></div></div>
  </div>;
}

export function ProjectArtwork({ projectId, kind }: { projectId: string; kind: VisualKind }) {
  if (projectId === 'cell-counter' || projectId === 'plant-cropper') return <OrganizationArtwork organization="ifas"/>;
  if (projectId === 'campus-events') return <OrganizationArtwork organization="vit-ap"/>;
  if (generatedProjects[projectId]) return <GeneratedProjectArtwork projectId={projectId}/>;
  return <Visual kind={kind}/>;
}

export function OrganizationArtwork({ organization }: { organization: 'ifas' | 'vit-ap' }) {
  const ifas = organization === 'ifas';
  const ref = useArtworkVisibility();
  return <div ref={ref} className={`organization-art organization-art-${organization} concept-art spatial-illustration`} role="img" aria-label={ifas?'UF IFAS logo floating above conceptual blueberry artwork; not laboratory photography':'VIT-AP logo floating above conceptual event artwork; not an actual campus building'}>
    <div className="spatial-camera"><div className="spatial-pointer"><div className="spatial-world">
      <div className="organization-image-plane"><img src={ifas?ifasArtwork:vitArtwork} width="960" height="960" alt="" loading="lazy" decoding="async"/></div>
      <div className="organization-halo"/>
      <div className="organization-logo-depth"><div className="organization-logo-float"><img src={ifas?ifasLogo:vitLogo} alt=""/></div></div>
      <div className="organization-light-line"/>
    </div></div></div>
  </div>;
}

function Cells() {
  const gradientId=useId();
  return <svg viewBox="0 0 300 230" role="img" aria-label="Abstract microscopy composition, not research data"><defs><radialGradient id={gradientId} cx=".3" cy=".25"><stop stopColor="#d3efe8"/><stop offset=".24" stopColor="#82b5b7"/><stop offset=".6" stopColor="#3e7180"/><stop offset="1" stopColor="#172f40"/></radialGradient></defs>{[[48,61,23],[123,58,32],[216,67,25],[78,148,33],[173,151,28],[256,164,19],[145,211,16]].map(([x,y,r],i)=><g key={i}><ellipse cx={x+4} cy={y+r} rx={r*.8} ry={r*.22} fill="#061a23" opacity=".45"/><circle cx={x} cy={y} r={r} fill={`url(#${gradientId})`} stroke="#b5dcdb" strokeOpacity=".45"/><circle cx={x+3} cy={y-2} r={r*.35} fill="#b2dbd9" opacity=".22"/><path d={`M ${x-r-7} ${y-r/2} v -10 h 10 M ${x+r+7} ${y+r/2} v 10 h -10`} fill="none" stroke="#a7ced0" strokeOpacity=".35"/></g>)}</svg>;
}
// Original shaded artwork. Each plane has real CSS depth; none is source/lab imagery.
function Prism({ x, y, height = 45, width = 28 }: { x: number; y: number; height?: number; width?: number }) {
  const d = width * .5;
  return <g transform={`translate(${x} ${y})`} stroke="#c5d4ee" strokeOpacity=".25" strokeLinejoin="round">
    <path d={`M${-width} 0 0 ${d} ${width} 0 0 ${-d}Z`} fill="#a0b6c9"/>
    <path d={`M${-width} 0 0 ${d}v${height}l${-width} ${-d}Z`} fill="#3a5167"/>
    <path d={`M0 ${d} ${width} 0v${height}L0 ${height+d}Z`} fill="#1d3149"/>
    {[.3,.6].map(n=><path key={n} d={`M6 ${height*n+d}l${width-12} ${-d*.6}`} stroke="#c6dceb" strokeOpacity=".6"/>)}
  </g>;
}
function ProjectSculpture({ kind }: { kind: 'map' | 'federated' | 'plant' }) {
  const id=useId(), plant=kind==='plant', map=kind==='map';
  return <>
    <svg className="sculpture-plane depth-ground" viewBox="0 0 600 440" aria-hidden="true" fill="none">
      <ellipse cx="310" cy="345" rx="205" ry="46" fill="#000" opacity=".3"/>
      <path d="M65 263 305 131 540 259 300 400Z" fill={plant?'#152c25':'#172737'} stroke="#afc7d8" strokeOpacity=".18"/>
      <path d="M65 263v12l235 139v-14m0 14 240-141v-14" stroke="#8ca8b7" strokeOpacity=".3"/>
      {[0,1,2,3,4].map(i=><path key={i} d={`M${105+i*42} ${285+i*24}l235-132M${110+i*45} ${237-i*25}l235 131`} stroke="#a2bccd" strokeOpacity=".09"/>)}
      {!map&&!plant&&<g stroke="#aebdeb" strokeOpacity=".6" strokeDasharray="4 7"><path d="M300 238 125 195M300 238 454 172M300 238 452 330M300 238 145 332"/></g>}
    </svg>
    <svg className="sculpture-plane depth-object" viewBox="0 0 600 440" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={`${id}-glass`} x2=".9" y2="1"><stop stopColor="#d4e2f0" stopOpacity=".9"/><stop offset="1" stopColor="#476884" stopOpacity=".65"/></linearGradient>
        <linearGradient id={`${id}-leaf`} x2=".9" y2="1"><stop stopColor="#d0dd9e"/><stop offset=".48" stopColor="#799d71"/><stop offset="1" stopColor="#294f42"/></linearGradient>
        <radialGradient id={`${id}-berry`} cx=".3" cy=".25"><stop stopColor="#b6c7e9"/><stop offset=".3" stopColor="#708bb6"/><stop offset=".75" stopColor="#344967"/><stop offset="1" stopColor="#18263f"/></radialGradient>
      </defs>
      {map?<>
        <path d="M75 211 308 81 533 209 300 345Z" fill="#324f4c" stroke="#91aaa2" strokeOpacity=".6"/>
        <path d="M75 211v18l225 136v-20m0 20 233-137v-19" fill="#203833" stroke="#738f84" strokeOpacity=".3"/>
        {[0,1,2,3,4,5].map(i=><path key={i} d={`M${104+i*36} ${228+i*21}l224-127M${113+i*36} ${190-i*20}l222 126`} stroke="#b3c7b0" strokeOpacity=".18"/>)}
        {[[222,163,31],[337,124,46],[392,185,38],[185,226,25],[329,243,35]].map(([x,y,height],i)=><Prism key={i} x={x} y={y} height={height} width={22}/>)}
        <path className="sculpture-route" d="m119 224 98 57 78-45 64 34 119-70" stroke="#cce2bc" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        {[119,478].map((x,i)=><g key={x} transform={`translate(${x} ${i?200:224})`}><ellipse cy="5" rx="15" ry="8" fill="#d2e9c0" opacity=".2"/><path d="M0 0v-50" stroke="#e1efcf" strokeWidth="2"/><circle cy="-54" r="9" fill="#dcebc7"/><circle cy="-54" r="3" fill="#3d5945"/></g>)}
      </>:plant?<>
        <path d="M173 330C102 241 105 107 282 72c41 126-18 223-109 258Z" fill={`url(#${id}-leaf)`} stroke="#c5d5a6" strokeOpacity=".5"/>
        <path d="M173 330 258 106m-61 164-53-66m71 14 54-53m-66 83-52-28m83-51-10-39" stroke="#dce7b8" strokeOpacity=".6" strokeWidth="2"/>
        <path d="M170 355c66-62 118-107 208-115" stroke="#8ea77a" strokeWidth="5"/>
        {[[350,213,44],[417,257,51],[333,293,36]].map(([x,y,r],i)=><g key={i}><circle cx={x} cy={y} r={r} fill={`url(#${id}-berry)`} stroke="#99b4d3" strokeOpacity=".3"/><path d={`m${x-10} ${y-r+9} 7 4 4-9 5 8 8-2-4 7-13 1Z`} fill="#253e47"/><ellipse cx={x-12} cy={y-12} rx={r*.23} ry={r*.12} fill="#d1dff3" opacity=".18" transform={`rotate(-35 ${x-12} ${y-12})`}/></g>)}
      </>:<>
        {[[125,137],[454,115],[452,274],[145,278]].map(([x,y],i)=><Prism key={i} x={x} y={y} height={55} width={31}/>)}
        <Prism x={300} y={143} height={116} width={70}/>
        <path d="m300 101 48 24v53c0 32-24 60-48 77-24-17-48-45-48-77v-53Z" fill={`url(#${id}-glass)`} stroke="#dce7f5" strokeOpacity=".7"/>
        <path d="m279 170 15 16 30-35" stroke="#172e4a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="300" cy="293" rx="84" ry="25" stroke="#adbee4" strokeOpacity=".4"/>
      </>}
    </svg>
    <svg className="sculpture-plane depth-detail" viewBox="0 0 600 440" aria-hidden="true" fill="none">
      {plant?<><path d="M112 142v-25h25m155 0h25v25M112 302v25h25m155 0h25v-25" stroke="#d9e8bd" strokeWidth="2"/><rect x="385" y="118" width="111" height="78" rx="8" fill="#c4d3dc" fillOpacity=".14" stroke="#ceddec" strokeOpacity=".5"/><circle cx="420" cy="157" r="17" stroke="#b3c9dd"/><path d="m432 169 11 11m18-36h18m-18 12h12" stroke="#c5d8e6"/></>:map?<><path d="M370 72h99l24 16v43H370Z" fill="#d6e1ce" fillOpacity=".92"/><path d="m386 109 16-15 15 9 20-18 16 10" stroke="#456451" strokeWidth="2"/><circle cx="453" cy="95" r="4" fill="#456451"/></>:<><circle cx="139" cy="116" r="7" fill="#d4dff6"/><circle cx="447" cy="91" r="7" fill="#bfccec"/><path d="M256 69q44-25 88 0" stroke="#bdcfee" strokeWidth="2"/><path d="m339 63 6 6-9 2" stroke="#bdcfee"/></>}
    </svg>
  </>;
}
function SpatialFrame({kind,compact,children,layered=false,label}:{kind:VisualKind;compact:boolean;children:ReactNode;layered?:boolean;label:string}) {
  return <div className={`${layered?'layered-visual':'concept-art'} spatial-illustration ${kind==='events'?'event':kind}-visual ${kind} ${compact?'compact':''}`} role="img" aria-label={label}>
    <div className="spatial-camera"><div className="spatial-pointer"><div className="spatial-world">{children}</div></div></div>
    <span className={layered?'visual-note':'diagram-caption'}>{layered?'CONCEPTUAL INTERFACE':'Conceptual illustration'}</span>
  </div>;
}
function SecondarySculpture({kind}:{kind:VisualKind}) {
  const community=kind==='community',commerce=kind==='commerce',covid=kind==='covid';
  return <>
    <svg className="sculpture-plane depth-ground" viewBox="0 0 600 440" fill="none" aria-hidden="true">
      <ellipse cx="310" cy="348" rx="214" ry="40" fill="#000" opacity=".25"/>
      <path d="M66 275 300 143 537 275 300 407Z" fill={covid?'#342633':'#1b2c3d'} stroke="#b4cadc" strokeOpacity=".2"/>
      <path d="M66 275v12l234 133v-13m0 13 237-133v-12" stroke="#bdd2e1" strokeOpacity=".25"/>
      {community&&<g stroke="#a9c2db" strokeDasharray="5 7" strokeOpacity=".5"><path d="M300 222 135 146M300 222 461 144M300 222 136 315M300 222 458 313"/></g>}
    </svg>
    <svg className="sculpture-plane depth-object" viewBox="0 0 600 440" fill="none" aria-hidden="true">
      {community?<>
        <Prism x={300} y={155} width={64} height={105}/>
        {[[135,98],[461,98],[136,268],[458,268]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path d="M-48 4h96v61h-96Z" fill="#273f59" stroke="#bbd0e3" strokeOpacity=".5"/><path d="m-48 65 7 7h96V11l-7-7" fill="#192d43" stroke="#8da7bd" strokeOpacity=".35"/><circle cx="-28" cy="24" r="7" fill="#b0c6da"/><path d="M-12 21h45m-45 10h27M-31 48h58" stroke="#c6d7e7" strokeOpacity=".6"/><path d="m-21 65 2 17 17-17" fill="#273f59" stroke="#bbd0e3" strokeOpacity=".5"/></g>)}
        <text x="300" y="212" fill="#dce6f0" textAnchor="middle" fontSize="11" letterSpacing="2">ENGINE</text>
      </>:commerce?<>
        <path d="M85 79h425v268H85Z" fill="#e2e0d5" stroke="#fbf7eb" strokeOpacity=".6"/>
        <path d="m85 347 13 14h425V93l-13-14v268Z" fill="#9a9e95"/>
        <path d="M85 122h425" stroke="#8e948d"/>
        <text x="111" y="107" fill="#323c38" fontFamily="Georgia,serif" fontSize="17" letterSpacing="1">COLLECTION / STUDY</text>
        <path d="M117 302h167m-167 13h104" stroke="#758178"/>
      </>:<>
        {[45,99,71,145,119].map((height,i)=><Prism key={i} x={145+i*65} y={298-i*13-height} width={20} height={height}/>)}
        <path d="m122 254 65-62 66 15 65-94 69 13 69-51" stroke={covid?'#ecbecb':'#bed5ea'} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="456" cy="75" r="6" fill={covid?'#ecbecb':'#bed5ea'}/>
      </>}
    </svg>
    <svg className="sculpture-plane depth-detail" viewBox="0 0 600 440" fill="none" aria-hidden="true">
      {commerce?[122,256,390].map((x,i)=><g key={x}><path d={`M${x} 140h104v133H${x}Z`} fill={['#b4b9a9','#8e9f9c','#c5bcae'][i]} stroke="#f2eee6" strokeOpacity=".5"/><path d={`m${x+31} 175 12-11h18l12 11-10 16-3-5v47H${x+44}v-47l-3 5Z`} fill="#53655d"/><path d={`M${x} 273l7 6h104V146l-7-6v133Z`} fill="#596e64" fillOpacity=".6"/></g>):community?<><circle cx="300" cy="129" r="15" fill="#bbd2e4"/><path d="m293 129 5 5 10-10" stroke="#334e68" strokeWidth="2"/></>:<><rect x="106" y="85" width="104" height="48" rx="6" fill="#c6d6e9" fillOpacity=".13" stroke="#c6d6e9" strokeOpacity=".4"/><path d="M122 102h71m-71 12h42" stroke="#b9cde2"/><text x="300" y="373" fill="#b4c7d9" textAnchor="middle" fontSize="9" letterSpacing="1">EXPLANATORY SHAPES / NO MEASURED VALUES</text></>}
    </svg>
  </>;
}
function IndustryVisual({kind,compact}:{kind:'optum'|'samsung'|'yahoo';compact:boolean}) {
  const config={
    optum:{name:'optum',focus:'DATA / SERVICES',stack:'PYTHON · SQL',flow:'Validate → Reconcile'},
    samsung:{name:'SAMSUNG',focus:'CAMERA / VISION',stack:'KOTLIN · JAVA',flow:'Capture → Inspect'},
    yahoo:{name:'yahoo!',focus:'MAIL / ANDROID',stack:'KOTLIN · JETPACK',flow:'Draft → Refine'},
  }[kind];
  return <SpatialFrame kind={kind} compact={compact} layered label={`Five-layer conceptual ${config.name} experience composition, company name rendered as text, not a product screenshot`}>
    <div className="visual-layer industry-name-tile" data-layer="shell"><span>{config.name}</span></div>
    <div className="visual-layer industry-motif" data-layer="primary"><svg viewBox="0 0 100 100" fill="none" aria-hidden="true">{kind==='optum'?<><ellipse cx="50" cy="27" rx="27" ry="11"/><path d="M23 27v40c0 15 54 15 54 0V27M23 47c0 15 54 15 54 0"/><path d="m39 66 8 8 15-19"/></>:kind==='samsung'?<><rect x="17" y="25" width="66" height="52" rx="10"/><circle cx="50" cy="51" r="18"/><circle cx="50" cy="51" r="9"/><path d="M27 25l7-9h32l7 9"/></>:<><rect x="14" y="24" width="72" height="52" rx="7"/><path d="m15 29 35 26 35-26M35 60 15 74m50-14 20 14"/></>}</svg></div>
    <div className="visual-layer industry-stack" data-layer="inspector"><span>{config.stack}</span></div>
    <div className="visual-layer industry-flow" data-layer="results"><span>{config.flow}</span><span aria-hidden="true">↗</span></div>
    <div className="visual-layer industry-context" data-layer="context"><span>{config.focus}</span><i aria-hidden="true"/></div>
  </SpatialFrame>;
}
export default function Visual({kind, compact=false}:{kind:VisualKind;compact?:boolean}) {
  if(kind==='optum'||kind==='samsung'||kind==='yahoo')return <IndustryVisual kind={kind} compact={compact}/>;
  const lab=kind==='lab', event=kind==='events';
  if(kind==='map'||kind==='federated'||kind==='plant')return <SpatialFrame kind={kind} compact={compact} label={`Original dimensional ${kind==='map'?'spatial network':kind==='plant'?'leaf and berry inspection':'federated server network'} illustration, not a product screenshot, research data or measured results`}><ProjectSculpture kind={kind}/></SpatialFrame>;
  if (['community','commerce','analytics','covid'].includes(kind)) return <SpatialFrame kind={kind} compact={compact} label={`Conceptual ${kind==='community'?'actor and message':kind==='commerce'?'storefront':'data visualization'} diagram, not an application screenshot or measured data`}>
    <SecondarySculpture kind={kind}/>
  </SpatialFrame>;
  if (kind === 'android') return <SpatialFrame kind={kind} compact={compact} layered label="Five-layer dimensional conceptual Snack Squad Android interface, not a product screenshot">
    <div className="visual-layer android-phone" data-layer="shell"><div className="android-speaker"/><span className="android-brand">SNACK / SQUAD</span><span className="android-phone-line">Browse. Choose.<br/>Make it yours.</span><div className="android-nav" aria-hidden="true"><i/><i/><i/></div></div>
    <div className="visual-layer android-catalog" data-layer="primary"><span className="mini-label">CATALOG</span><div className="android-dish" aria-hidden="true"><span/></div><strong>Something good.</strong><span className="android-ui-caption">Browse the menu ↗</span></div>
    <div className="visual-layer android-cart" data-layer="inspector"><span className="mini-label">YOUR CART</span><div className="android-order-line"/><div className="android-order-line short"/><span className="android-ui-caption">Review your order →</span></div>
    <div className="visual-layer android-order" data-layer="results"><span className="mini-label">ORDER FLOW</span><span>Choose → Cart → Place</span></div>
    <div className="visual-layer android-account" data-layer="context"><span className="android-user-icon" aria-hidden="true">◎</span><span className="mini-label">SIGN IN</span></div>
  </SpatialFrame>;
  return <SpatialFrame kind={event?'events':'lab'} compact={compact} layered label={lab?'Five-layer dimensional conceptual microscopy interface, not a product screenshot or research data':'Five-layer dimensional conceptual campus event interface, not a product screenshot'}>
    <div className="visual-layer layer-shell" data-layer="shell"><div className="window-bar"><span>•••</span><span>{lab?'CELL / VIEW':'CAMPUS / SPACE'}</span><span>↗</span></div><div className="shell-sidebar"><i/><i/><i/><i/></div></div>
    <div className="visual-layer layer-primary" data-layer="primary">{lab?<Cells/>:<><div className="event-poster"><span>TOGETHER,<br/>SOMETHING<br/><em>MORE.</em></span><div className="poster-orbit"/></div><div className="event-caption">A space for campus life <span>↗</span></div></>}</div>
    <div className="visual-layer layer-inspector" data-layer="inspector"><span className="mini-label">{lab?'REVIEW':'EVENT REQUEST'}</span><div className="tool-symbol">{lab?'⌖':'↗'}</div><div className="ui-rule"/><div className="ui-rule short"/><span className="mini-foot">{lab?'A human perspective':'A shared experience'}</span></div>
    <div className="visual-layer layer-results" data-layer="results"><span className="mini-label">{lab?'OBSERVE. REFINE.':'EVENT LIST'}</span>{event&&<span className="event-list-lines" aria-hidden="true"><i/><i/><i/></span>}<span>→</span></div>
    <div className="visual-layer layer-context" data-layer="context">{lab?<><span className="context-symbol">◎</span><span>IN FOCUS</span></>:<div className="event-calendar"><span>CALENDAR</span><div className="calendar-grid" aria-hidden="true">{Array.from({length:15},(_,i)=><i key={i}/>)}</div></div>}</div>
  </SpatialFrame>;
}
